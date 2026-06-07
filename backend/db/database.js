const mysql = require('mysql2/promise');
require('dotenv').config();

// Membuat pool koneksi ke MariaDB/MySQL
const pool = mysql.createPool({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD || '',
    database: process.env.DB_NAME || 'laporsampah',
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});

// Tes koneksi saat server berjalan
pool.getConnection()
    .then(conn => {
        console.log('[BLUE TEAM INFO] Berhasil terhubung ke Database MySQL/MariaDB');
        conn.release();
    })
    .catch(err => {
        console.error('[CRITICAL ERROR] Gagal terhubung ke Database:', err.message);
    });

module.exports = pool;