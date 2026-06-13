require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const multer = require('multer');
const path = require('path');
const bcrypt = require('bcryptjs');
const db = require('./db/database'); // Memanggil pool koneksi MySQL
const { loginLimiter, sanitizeMiddleware, authenticate, authorizeRole } = require('./middleware/security');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware Global
app.use(helmet());
app.use(cors());
app.use(express.json());
app.use(sanitizeMiddleware);

// Serve Frontend Static Files
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve Uploads
app.use('/uploads', express.static('uploads'));

// Setup Secure Multer untuk Upload Gambar
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'evidence-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({
    storage: storage,
    limits: { fileSize: 2 * 1024 * 1024 }, // Max 2MB
    fileFilter: (req, file, cb) => {
        const allowedTypes = /jpeg|jpg|png/;
        const extName = allowedTypes.test(path.extname(file.originalname).toLowerCase());
        const mimeType = allowedTypes.test(file.mimetype);
        if (extName && mimeType) {
            return cb(null, true);
        }
        cb(new Error('Hanya file .png, .jpg, dan .jpeg yang diizinkan!'));
    }
});

// --- API AUTHENTICATION ---
app.post('/api/register', async (req, res) => {
    try {
        const { username, name, password } = req.body;
        
        // Cek apakah username sudah ada
        const [existingUser] = await db.execute('SELECT id FROM users WHERE username = ?', [username]);
        if (existingUser.length > 0) {
            return res.status(400).json({ error: 'Username sudah digunakan!' });
        }
        
        // Hash password dan simpan ke database
        const hashedPassword = await bcrypt.hash(password, 10);
        await db.execute(
            'INSERT INTO users (name, username, password, role) VALUES (?, ?, ?, ?)',
            [name, username, hashedPassword, 'User']
        );
        
        res.status(201).json({ message: 'Registrasi berhasil, silakan login.' });
    } catch (err) {
        console.error("💥 [ERROR REGISTER]:", err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server database.', details: err.message });
    }
});

app.post('/api/login', loginLimiter, async (req, res) => {
    try {
        const { username, password } = req.body;
        
        // Ambil data user dari database MySQL
        const [users] = await db.execute('SELECT * FROM users WHERE username = ?', [username]);
        
        // Pengecekan 1: Apakah user ditemukan?
        if (users.length === 0) {
            return res.status(401).json({ error: 'Username atau password salah!' });
        }
        
        const user = users[0];
        
        // Pengecekan 2: Cocokkan password teks biasa dengan hash di DB
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(401).json({ error: 'Username atau password salah!' });
        }
        
        // Generate Simulasi Secure Token Base64
        const payload = JSON.stringify({ id: user.id, username: user.username, role: user.role });
        const token = Buffer.from(payload).toString('base64');
        
        res.json({ 
            message: 'Login sukses', 
            token, 
            user: { id: user.id, username: user.username, name: user.name, role: user.role } 
        });
    } catch (err) {
        console.error("💥 [CRASH ROUTE LOGIN]:", err);
        res.status(500).json({ error: 'Terjadi kesalahan pada server database.', details: err.message });
    }
});

// --- API USER (CRUD LAPORAN) ---
app.post('/api/lapor', authenticate, upload.single('fotoSampah'), async (req, res) => {
    try {
        const { lokasi, deskripsi } = req.body;
        const fileUrl = req.file ? `/uploads/${req.file.filename}` : null;
        
        await db.execute(
            'INSERT INTO laporan (user_id, lokasi, deskripsi, file_url, status) VALUES (?, ?, ?, ?, ?)',
            [req.user.id, lokasi, deskripsi, fileUrl, 'Pending']
        );
        
        res.status(201).json({ message: 'Laporan berhasil dibuat' });
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

app.get('/api/lapor', authenticate, async (req, res) => {
    try {
        const [reports] = await db.execute('SELECT * FROM laporan WHERE user_id = ? ORDER BY created_at DESC', [req.user.id]);
        const formattedReports = reports.map(r => ({
            id: r.id,
            lokasi: r.lokasi,
            deskripsi: r.deskripsi,
            fileUrl: r.file_url,
            status: r.status,
            createdAt: r.created_at
        }));
        res.json(formattedReports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/lapor/:id', authenticate, async (req, res) => {
    try {
        const { lokasi, deskripsi } = req.body;
        const [reports] = await db.execute('SELECT * FROM laporan WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (reports.length === 0) return res.status(404).json({ error: 'Laporan tidak ditemukan' });
        if (reports[0].status !== 'Pending') return res.status(400).json({ error: 'Hanya laporan Pending yang bisa diedit' });

        await db.execute('UPDATE laporan SET lokasi = ?, deskripsi = ? WHERE id = ?', [lokasi, deskripsi, req.params.id]);
        res.json({ message: 'Laporan berhasil diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.delete('/api/lapor/:id', authenticate, async (req, res) => {
    try {
        const [reports] = await db.execute('SELECT * FROM laporan WHERE id = ? AND user_id = ?', [req.params.id, req.user.id]);
        if (reports.length === 0) return res.status(404).json({ error: 'Laporan tidak ditemukan' });
        if (reports[0].status !== 'Pending') return res.status(400).json({ error: 'Hanya laporan Pending yang bisa dihapus' });

        await db.execute('DELETE FROM laporan WHERE id = ?', [req.params.id]);
        res.json({ message: 'Laporan berhasil dihapus' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// --- API ADMIN ---
app.get('/api/admin/laporan', authenticate, authorizeRole(['Admin', 'Petugas']), async (req, res) => {
    try {
        const query = `
            SELECT l.id, l.lokasi, l.deskripsi, l.file_url as fileUrl, l.status, l.created_at as createdAt, u.username as reporter 
            FROM laporan l 
            JOIN users u ON l.user_id = u.id
            ORDER BY l.created_at DESC
        `;
        const [reports] = await db.execute(query);
        res.json(reports);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/laporan/:id', authenticate, authorizeRole(['Admin', 'Petugas']), async (req, res) => {
    try {
        const { status } = req.body;
        await db.execute('UPDATE laporan SET status = ? WHERE id = ?', [status, req.params.id]);
        res.json({ message: 'Status penanganan diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/users', authenticate, authorizeRole(['Admin']), async (req, res) => {
    try {
        const [users] = await db.execute('SELECT id, name, username, role FROM users');
        res.json(users);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.put('/api/admin/users/:id', authenticate, authorizeRole(['Admin']), async (req, res) => {
    try {
        const { role } = req.body;
        await db.execute('UPDATE users SET role = ? WHERE id = ?', [role, req.params.id]);
        res.json({ message: 'Hak akses diperbarui' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/api/admin/logs', authenticate, authorizeRole(['Admin']), async (req, res) => {
    try {
        const [logs] = await db.execute('SELECT * FROM logs ORDER BY timestamp DESC LIMIT 100');
        res.json(logs);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// General Error Handler
app.use((err, req, res, next) => {
    res.status(500).json({ error: 'Terjadi kesalahan sistem internal.' });
});

app.listen(PORT, '0.0.0.0', () => {
    console.log(`[BLUE TEAM ACTIVE] Secure Server running on http://localhost:${PORT}`);
});