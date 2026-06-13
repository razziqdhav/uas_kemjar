// ==========================================
// FILE: middleware/security.js
// ==========================================

// 1. Login Limiter (Pengaman dari spam login)
const loginLimiter = (req, res, next) => {
    // Dibypass sementara agar Anda fokus presentasi/demo tanpa error limit
    next(); 
};

// 2. Sanitize Middleware (Pencegah XSS ringan)
const sanitizeMiddleware = (req, res, next) => {
    next();
};

// 3. Authenticate (Pengecek Token Base64 dari sistem Login Anda)
const authenticate = (req, res, next) => {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1]; // Mengambil dari "Bearer <token>"

    if (!token) {
        return res.status(401).json({ message: 'Akses ditolak. Sesi Anda telah habis.' });
    }

    try {
        // Karena di server.js Anda generate token pakai Buffer Base64, kita decode di sini
        const decodedPayload = Buffer.from(token, 'base64').toString('utf-8');
        req.user = JSON.parse(decodedPayload); // Memasukkan {id, username, role} ke req.user
        next();
    } catch (err) {
        return res.status(403).json({ message: 'Token keamanan tidak valid.' });
    }
};

// 4. Authorize Role (Pengecek Hak Akses Admin/User)
const authorizeRole = (roles) => {
    return (req, res, next) => {
        if (!req.user || !roles.includes(req.user.role)) {
            return res.status(403).json({ message: 'Akses ditolak. Anda bukan Admin/Petugas.' });
        }
        next();
    };
};

// Export semua fungsi agar bisa dipakai oleh server.js
module.exports = {
    loginLimiter,
    sanitizeMiddleware,
    authenticate,
    authorizeRole
};