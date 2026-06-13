// Proteksi Halaman: Jika sudah login, jangan diam di halaman index.html (login)
window.onload = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const role = localStorage.getItem('role');
        window.location.href = (role === 'Admin' || role === 'Petugas') ? 'dashboard-admin.html' : 'dashboard-user.html';
    }
};

async function executeLogin() {
    const userField = document.getElementById('log-user').value;
    const passField = document.getElementById('log-pass').value;

    if (!userField || !passField) return alert("Semua kolom wajib diisi!");

    try {
        const res = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username: userField, password: passField })
        });
        const data = await res.json();
        
        if (res.ok) {
            // Menyimpan Session Token yang dienkripsi
            localStorage.setItem('token', data.token);
            localStorage.setItem('role', data.user.role);
            localStorage.setItem('username', data.user.username);
            localStorage.setItem('name', data.user.name);
            
            alert(data.message);
            // Pengalihan berdasarkan role (RBAC)
            window.location.href = (data.user.role === 'Admin' || data.user.role === 'Petugas') ? 'dashboard-admin.html' : 'dashboard-user.html';
        } else {
            alert(data.message || "Login gagal.");
        }
    } catch (e) {
        alert("Koneksi gagal. Pastikan backend Node.js berjalan.");
    }
}