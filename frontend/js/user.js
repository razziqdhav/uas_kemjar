const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Proteksi Sesi Warga (Penyusup dilempar ke index.html)
window.onload = () => {
    if (!token || role === 'Admin' || role === 'Petugas') {
        localStorage.clear();
        return window.location.href = 'index.html'; 
    }
    document.getElementById('display-name').innerText = escapeHTML(localStorage.getItem('name') || 'User');
    muatRiwayat();
};

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

async function muatRiwayat() {
    try {
        const res = await fetch(`${API_URL}/lapor`, {
            headers: { 'Authorization': `Bearer ${token}` }
        });
        if (res.status === 401 || res.status === 403) return logout();
        const data = await res.json();
        
        let html = '';
        data.forEach(item => {
            let btn = (item.status === 'Pending') 
                ? `<button class="btn btn-sm" onclick="editData(${item.id}, '${escapeHTML(item.lokasi)}', '${escapeHTML(item.deskripsi)}')">Edit</button>
                   <button class="btn btn-sm btn-danger" onclick="hapusData(${item.id})">Hapus</button>` 
                : `<small style="color:gray;">Terkunci</small>`;
                
            html += `<tr>
                <td>${escapeHTML(item.lokasi)}</td>
                <td>${escapeHTML(item.deskripsi)}</td>
                <td>${item.fileUrl ? `<a href="http://localhost:3000${item.fileUrl}" target="_blank">Lihat</a>` : '-'}</td>
                <td><span class="badge ${item.status === 'Pending' ? 'bg-warn' : 'bg-success'}">${escapeHTML(item.status)}</span></td>
                <td>${btn}</td>
            </tr>`;
        });
        document.getElementById('tabel-riwayat').innerHTML = html || '<tr><td colspan="5">Belum ada laporan.</td></tr>';
    } catch (e) {
        console.error("Gagal memuat data", e);
    }
}

async function simpanLaporan() {
    const id = document.getElementById('edit-id').value;
    const lokasi = document.getElementById('lap-lokasi').value;
    const deskripsi = document.getElementById('lap-desk').value;
    const fileInput = document.getElementById('lap-file');

    if (!lokasi || !deskripsi) return alert("Lokasi dan Deskripsi wajib diisi!");

    if (!id) {
        // Create Data (Secure File Upload FormData)
        let formData = new FormData();
        formData.append('lokasi', lokasi);
        formData.append('deskripsi', deskripsi);
        if (fileInput.files[0]) formData.append('fotoSampah', fileInput.files[0]);

        const res = await fetch(`${API_URL}/lapor`, {
            method: 'POST',
            headers: { 'Authorization': `Bearer ${token}` },
            body: formData
        });
        alert((await res.json()).message);
    } else {
        // Update Data (Text only JSON)
        const res = await fetch(`${API_URL}/lapor/${id}`, {
            method: 'PUT',
            headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
            body: JSON.stringify({ lokasi, deskripsi })
        });
        alert((await res.json()).message);
        document.getElementById('edit-id').value = '';
        document.getElementById('file-box').classList.remove('hidden');
    }
    
    document.getElementById('lap-lokasi').value = '';
    document.getElementById('lap-desk').value = '';
    document.getElementById('lap-file').value = '';
    muatRiwayat();
}

function editData(id, lok, desk) {
    document.getElementById('edit-id').value = id;
    document.getElementById('lap-lokasi').value = lok;
    document.getElementById('lap-desk').value = desk;
    document.getElementById('file-box').classList.add('hidden'); // Sembunyikan field upload saat mode edit draf
}

async function hapusData(id) {
    if(!confirm('Yakin ingin menghapus laporan ini?')) return;
    const res = await fetch(`${API_URL}/lapor/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
    });
    alert((await res.json()).message);
    muatRiwayat();
}