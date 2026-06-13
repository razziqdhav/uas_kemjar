# EcoLapor

## Sistem Pelaporan dan Monitoring Pengelolaan Sampah Berbasis Web dengan Implementasi Keamanan Aplikasi dan Infrastruktur

### Mata Kuliah
Keamanan Jaringan (IFB-302)

### Program Studi
Informatika

### Institut
Institut Teknologi Nasional Bandung

### Kelompok
- Razziq Dhavino Rafadhillah (152023091)
- Muhammad Rafly Al Ghifari Ramdhani (152023117)
- Amsa Efraim Cicio Tarigan (152023120)

---

# Deskripsi Proyek

EcoLapor merupakan aplikasi berbasis web yang dikembangkan untuk membantu masyarakat dalam melaporkan permasalahan lingkungan dan pengelolaan sampah secara digital. Sistem memungkinkan pengguna untuk membuat laporan, mengunggah bukti pendukung, serta memantau status laporan yang telah dikirimkan.

Selain menyediakan layanan pelaporan, EcoLapor juga dirancang dengan fokus pada keamanan aplikasi dan infrastruktur. Berbagai mekanisme keamanan diterapkan untuk melindungi data pengguna serta mendeteksi aktivitas mencurigakan yang dapat mengancam sistem.

Proyek ini dikembangkan sebagai bagian dari Evaluasi Akhir Semester Mata Kuliah Keamanan Jaringan dengan pendekatan Blue Team dan Red Team yang mencakup implementasi keamanan serta penetration testing.

---

# Tujuan Proyek

- Mengembangkan aplikasi pelaporan sampah berbasis web.
- Menerapkan prinsip secure coding dalam pengembangan aplikasi.
- Mengimplementasikan keamanan pada level aplikasi dan infrastruktur.
- Menerapkan sistem monitoring dan deteksi serangan menggunakan Wazuh dan Suricata.
- Melakukan pengujian keamanan melalui penetration testing.
- Meningkatkan kesadaran terhadap pentingnya keamanan aplikasi web.

---

# Fitur Utama

## Fitur Pengguna

- Registrasi akun
- Login dan logout
- Membuat laporan sampah
- Mengunggah foto laporan
- Melihat riwayat laporan
- Melihat status penanganan laporan

## Fitur Administrator

- Login administrator
- Mengelola data pengguna
- Mengelola laporan yang masuk
- Mengubah status laporan
- Monitoring aktivitas sistem
- Monitoring keamanan aplikasi

---

# Teknologi yang Digunakan

## Frontend
- HTML5
- CSS3
- JavaScript

## Backend
- Node.js
- Express.js

## Database
- MariaDB / MySQL

## Web Server
- Nginx

## Security Monitoring
- Wazuh SIEM
- Suricata IDS

## Virtualisasi
- Oracle VirtualBox
- Ubuntu Server/Desktop
- Kali Linux

---

# Arsitektur Sistem

```text
Client Browser
       │
       ▼
Nginx Reverse Proxy
       │
       ▼
EcoLapor Application
       │
       ▼
MariaDB Database


Security Layer

Suricata IDS
       │
       ▼
Wazuh Manager
       │
       ▼
Wazuh Dashboard
       │
       ▼
Administrator
```

---

# Implementasi Keamanan

Sistem menerapkan berbagai kontrol keamanan untuk melindungi aplikasi dari ancaman yang umum ditemukan pada aplikasi web.

### Password Hashing
Password pengguna tidak disimpan dalam bentuk plaintext melainkan dalam bentuk hash sehingga lebih aman apabila database mengalami kebocoran.

### Session Management
Session digunakan untuk mempertahankan autentikasi pengguna setelah berhasil login dan akan dihapus saat logout.

### Input Validation
Seluruh input pengguna divalidasi sebelum diproses oleh sistem untuk mencegah data berbahaya masuk ke aplikasi.

### SQL Injection Protection
Sistem menggunakan validasi input dan parameterized query untuk mengurangi risiko SQL Injection.

### Cross Site Scripting (XSS) Protection
Input pengguna difilter dan disanitasi sebelum ditampilkan kembali ke browser.

### CSRF Protection
Form penting menggunakan token validasi untuk mencegah serangan Cross Site Request Forgery.

### Role Based Access Control (RBAC)
Hak akses pengguna dibatasi sesuai dengan peran masing-masing.

Role yang digunakan:
- User
- Administrator

### Secure File Upload
Upload file dibatasi berdasarkan:
- Jenis file
- Ukuran file
- Validasi nama file

### HTTPS/TLS
Komunikasi antara client dan server menggunakan protokol HTTPS sehingga data yang dikirimkan terenkripsi.

### Logging dan Monitoring
Seluruh aktivitas penting dicatat dan dimonitor menggunakan:
- Wazuh SIEM
- Suricata IDS

---

# Instalasi dan Konfigurasi

## Clone Repository

```bash
git clone https://github.com/USERNAME/ecolapor.git
cd ecolapor
```

## Install Dependency

```bash
npm install
```

## Membuat Database

```sql
CREATE DATABASE ecolapor;
```

Import database:

```bash
mysql -u root -p ecolapor < database.sql
```

## Konfigurasi Environment

Buat file `.env`

```env
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=password
DB_NAME=ecolapor
PORT=3000
```

## Menjalankan Aplikasi

```bash
npm start
```

atau

```bash
node app.js
```

---

# Konfigurasi Nginx

Instalasi Nginx:

```bash
sudo apt update
sudo apt install nginx -y
```

Verifikasi:

```bash
sudo systemctl status nginx
```

Nginx digunakan sebagai reverse proxy untuk mengarahkan trafik menuju aplikasi EcoLapor.

---

# Implementasi HTTPS

HTTPS digunakan untuk mengenkripsi komunikasi antara client dan server.

Contoh pembuatan sertifikat SSL:

```bash
sudo openssl req -x509 -nodes -days 365 \
-newkey rsa:2048 \
-keyout server.key \
-out server.crt
```

Verifikasi:

```text
https://SERVER_IP
```

---

# Implementasi Wazuh

Instalasi:

```bash
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
sudo bash wazuh-install.sh -a
```

Verifikasi:

```bash
sudo systemctl status wazuh-manager
```

Dashboard dapat diakses melalui:

```text
https://SERVER_IP
```

---

# Implementasi Suricata

Instalasi:

```bash
sudo apt install suricata -y
```

Verifikasi:

```bash
sudo systemctl status suricata
```

Suricata digunakan untuk mendeteksi aktivitas jaringan yang mencurigakan seperti port scanning dan reconnaissance.

---

# Pengujian Keamanan

Pengujian dilakukan menggunakan pendekatan Red Team dan Blue Team.

## Tools yang Digunakan

- Nmap
- Burp Suite
- Gobuster
- Nikto
- Wazuh
- Suricata

## Information Gathering

```bash
nmap -sV TARGET_IP
```

Hasil:
- Port aktif berhasil diidentifikasi.

## Authentication Testing

Melakukan login menggunakan kredensial yang salah.

Hasil:
- Sistem berhasil menolak login yang tidak valid.

## Session Testing

Melakukan logout dan menguji validitas session.

Hasil:
- Session berakhir setelah logout.

## Access Control Testing

Mencoba mengakses halaman administrator tanpa autentikasi.

Hasil:
- Akses ditolak.

## Directory Enumeration

Melakukan pencarian direktori menggunakan Gobuster.

Hasil:
- Tidak ditemukan direktori sensitif yang dapat diakses publik.

## HTTPS Testing

Memastikan seluruh komunikasi menggunakan HTTPS.

Hasil:
- Komunikasi terenkripsi dengan TLS.

## IDS Testing

Melakukan scanning menggunakan Nmap.

Contoh:

```bash
nmap -sV TARGET_IP
```

Hasil:

```text
NMAP SERVICE SCAN DETECTED
```

Alert berhasil dideteksi oleh Suricata.

## SIEM Monitoring

Alert keamanan berhasil diteruskan dan ditampilkan pada dashboard Wazuh secara real-time.

---

# Hasil Pengujian

| Pengujian | Hasil |
|------------|--------|
| Information Gathering | Berhasil |
| Authentication Testing | Aman |
| Session Testing | Aman |
| Access Control Testing | Aman |
| Directory Enumeration | Aman |
| HTTPS Testing | Berhasil |
| IDS Detection | Berhasil |
| Wazuh Monitoring | Berhasil |

---

# Struktur Project

```text
EcoLapor/
│
├── src/
├── public/
├── database/
├── docs/
├── screenshots/
├── package.json
├── README.md
└── .env
```

---

# Dokumentasi

Tambahkan screenshot berikut pada folder `screenshots`:

- Dashboard EcoLapor
- Dashboard Wazuh
- Alert NMAP SERVICE SCAN DETECTED
- Monitoring Suricata
- Implementasi HTTPS
- Hasil Pengujian Penetration Testing

---

# Kesimpulan

EcoLapor berhasil mengimplementasikan keamanan pada level aplikasi maupun infrastruktur. Pengujian keamanan menunjukkan bahwa sistem mampu mendeteksi aktivitas reconnaissance menggunakan Suricata serta menampilkan alert secara real-time melalui Wazuh Dashboard. Implementasi keamanan yang diterapkan mampu mengurangi risiko terhadap ancaman umum pada aplikasi web dan mendukung proses monitoring keamanan secara berkelanjutan.

---

# Lisensi

Proyek ini dibuat untuk keperluan akademik Mata Kuliah Keamanan Jaringan Program Studi Informatika Institut Teknologi Nasional Bandung.
