const token = localStorage.getItem('token');
const role = localStorage.getItem('role');

// Proteksi Sesi Admin & Petugas (Penyusup dilempar ke index.html)
window.onload = () => {
    if (!token || (role !== 'Admin' && role !== 'Petugas')) {
        localStorage.clear();
        return window.location.href = 'index.html';
    }
    
    // Terapkan RBAC pada UI: Petugas tidak bisa melihat menu User & Logs
    if (role === 'Petugas') {
        document.getElementById('nav-user').classList.add('hidden');
        document.getElementById('nav-log').classList.add('hidden');
    }

    muatLaporanAdmin();
    if (role === 'Admin') {
        muatUsersAdmin();
        muatLogsAdmin();
    }
};

function logout() {
    localStorage.clear();
    window.location.href = 'index.html';
}

function pindahTab(id) {
    document.getElementById('tab-laporan').classList.add('hidden');
    document.getElementById('tab-users').classList.add('hidden');
    document.getElementById('tab-logs').classList.add('hidden');
    document.getElementById(`tab-${id}`).classList.remove('hidden');
}

async function muatLaporanAdmin() {
    const res = await fetch(`${API_URL}/admin/laporan`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    if (res.status === 401 || res.status === 403) return logout();
    const data = await res.json();
    
    let html = '';
    data.forEach(item => {
        html += `<tr>
            <td><strong>${escapeHTML(item.reporter)}</strong><br><small>${escapeHTML(item.createdAt)}</small></td>
            <td><strong>${escapeHTML(item.lokasi)}</strong><br>${escapeHTML(item.deskripsi)}</td>
            <td>${item.fileUrl ? `<a href="http://localhost:3000${item.fileUrl}" target="_blank">Lihat</a>` : '-'}</td>
            <td><span class="badge ${item.status === 'Pending' ? 'bg-warn' : 'bg-success'}">${escapeHTML(item.status)}</span></td>
            <td>
                <select onchange="ubahStatusLaporan(${item.id}, this.value)">
                    <option value="">- Set Status -</option>
                    <option value="Pending">Pending</option>
                    <option value="Diproses">Diproses</option>
                    <option value="Selesai">Selesai</option>
                </select>
            </td>
        </tr>`;
    });
    document.getElementById('adm-laporan').innerHTML = html || '<tr><td colspan="5">Belum ada aduan masuk.</td></tr>';
}

async function ubahStatusLaporan(id, statusBaru) {
    if(!statusBaru) return;
    await fetch(`${API_URL}/admin/laporan/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: statusBaru })
    });
    muatLaporanAdmin();
}

// Fitur Khusus Admin
async function muatUsersAdmin() {
    const res = await fetch(`${API_URL}/admin/users`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    let html = '';
    data.forEach(u => {
        html += `<tr>
            <td>#${u.id}</td>
            <td>${escapeHTML(u.name)}<br><small>@${escapeHTML(u.username)}</small></td>
            <td><span class="badge bg-info">${escapeHTML(u.role)}</span></td>
            <td>
                <select onchange="ubahRoleAdmin(${u.id}, this.value)" ${u.username === 'admin_sampah' ? 'disabled' : ''}>
                    <option value="">- Ganti Peran -</option>
                    <option value="Admin">Admin</option>
                    <option value="Petugas">Petugas</option>
                    <option value="User">User</option>
                </select>
            </td>
        </tr>`;
    });
    document.getElementById('adm-users').innerHTML = html;
}

async function ubahRoleAdmin(id, roleBaru) {
    if(!roleBaru) return;
    const res = await fetch(`${API_URL}/admin/users/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({ role: roleBaru })
    });
    alert((await res.json()).message);
    muatUsersAdmin();
}

// Fitur Khusus Admin
async function muatLogsAdmin() {
    const res = await fetch(`${API_URL}/admin/logs`, {
        headers: { 'Authorization': `Bearer ${token}` }
    });
    const data = await res.json();
    let html = '';
    data.slice().reverse().forEach(log => {
        let color = '#0f0';
        if(log.type === 'WARNING') color = '#f39c12';
        if(log.type === 'CRITICAL') color = '#ff3333';
        
        html += `<div class="log-line" style="color: ${color}">
            [${escapeHTML(log.timestamp)}] [${escapeHTML(log.type)}] [IP:${escapeHTML(log.ip)}]<br>> ${escapeHTML(log.activity)} : ${escapeHTML(log.details)}
        </div>`;
    });
    document.getElementById('term-logs').innerHTML = html || '<div>Menunggu aktivitas keamanan...</div>';
}   