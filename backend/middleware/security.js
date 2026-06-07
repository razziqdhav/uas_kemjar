const rateLimit = require('express-rate-limit');
const db = require('../db/database');

// 1. Rate Limiter untuk Mencegah Brute Force
const loginLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 Menit
    max: 5, // Maksimal 5 percobaan
    message: { error: 'Terlalu banyak percobaan login, silakan coba lagi setelah 15 menit.' },
    handler: (req, res, next, options) => {
        logActivity(req, 'WARN', 'BRUTE_FORCE_ATTEMPT', 'Maksimal percobaan login terlampaui');
        res.status(options.statusCode).send(options.message);
    }
});

// 2. Input Sanitization untuk Mencegah XSS & Injection
const sanitizeString = (str) => {
    if (typeof str !== 'string') return str;
    return str.replace(/[<>&'"]/g, function (c) {
        switch (c) {
            case '<': return '&lt;';
            case '>': return '&gt;';
            case '&': return '&amp;';
            case '\'': return '&#39;';
            case '"': return '&quot;';
        }
    });
};

const sanitizeMiddleware = (req, res, next) => {
    if (req.body) {
        for (let key in req.body) {
            req.body[key] = sanitizeString(req.body[key]);
        }
    }
    next();
};

// 3. Simulasi Auth Token (Base64)
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        logActivity(req, 'WARN', 'UNAUTHORIZED_ACCESS', 'Missing or invalid token');
        return res.status(401).json({ error: 'Akses Ditolak. Token tidak valid.' });
    }

    const token = authHeader.split(' ')[1];
    try {
        const decoded = Buffer.from(token, 'base64').toString('utf-8');
        const [userId, username] = decoded.split(':');
        
        const user = db.users.find(u => u.id === parseInt(userId) && u.username === username);
        if (!user) {
            logActivity(req, 'WARN', 'UNAUTHORIZED_ACCESS', 'Token spoofing attempt / User not found');
            return res.status(403).json({ error: 'Sesi tidak valid.' });
        }
        
        req.user = user;
        next();
    } catch (err) {
        logActivity(req, 'CRITICAL', 'TOKEN_DECODE_ERROR', 'Error decoding auth token');
        return res.status(403).json({ error: 'Token rusak.' });
    }
};

// 4. Role-Based Access Control (RBAC)
const authorizeRole = (role) => {
    return (req, res, next) => {
        if (req.user.role !== role) {
            logActivity(req, 'CRITICAL', 'PRIVILEGE_ESCALATION_ATTEMPT', `User ${req.user.username} mencoba mengakses rute ${role}`);
            return res.status(403).json({ error: 'Akses terlarang. Peran tidak sesuai.' });
        }
        next();
    };
};

// Fungsi Logging Format SIEM (Wazuh)
const logActivity = (req, level, action, details) => {
    const logEntry = {
        timestamp: new Date().toISOString(),
        level: level,
        ip: req.ip || req.connection.remoteAddress,
        user: req.user ? req.user.username : 'GUEST',
        action: action,
        details: details,
        method: req.method,
        path: req.originalUrl
    };
    db.logs.push(logEntry);
    // Standarisasi Console Log JSON untuk Wazuh
    console.log(JSON.stringify(logEntry));
};

module.exports = { loginLimiter, sanitizeMiddleware, authenticate, authorizeRole, logActivity };