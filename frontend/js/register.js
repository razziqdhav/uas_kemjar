// Proteksi Halaman: Sama seperti login, jika sudah ada token lewati form ini
window.onload = () => {
    const token = localStorage.getItem('token');
    if (token) {
        const role = localStorage.getItem('role');
        window.location.href = (role === 'Admin' || role === 'Petugas') ? 'admin.html' : 'user.html';
    }
};

async function executeRegister() {
    const name = document.getElementById('reg-name').value;
    const user = document.getElementById('reg-user').value;
    const pass = document.getElementById('reg-pass').value;

    if (!name || !user || !pass) return alert("Harap lengkapi semua data!");

    try {
        const res = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ name, username: user, password: pass })
        });
        const data = await res.json();
        
        alert(data.message || data.error);
        if (res.ok) window.location.href = 'index.html'; // Pindah kembali ke halaman Login (index)
    } catch (e) {
        alert("Koneksi gagal.");
    }
}