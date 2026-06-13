# EcoLapor

## Deskripsi Proyek

EcoLapor merupakan aplikasi berbasis web yang dikembangkan untuk membantu masyarakat dalam melaporkan dan mengelola permasalahan terkait lingkungan dan pengelolaan sampah. Aplikasi ini memungkinkan pengguna untuk melakukan pelaporan, pengelolaan data, serta pemantauan informasi secara terintegrasi melalui web browser.

Proyek ini dikembangkan sebagai tugas Evaluasi Akhir Semester Mata Kuliah Keamanan Jaringan Program Studi Informatika Institut Teknologi Nasional Bandung dengan fokus pada implementasi keamanan aplikasi dan infrastruktur.

---

# Fitur Utama

* Registrasi dan Login Pengguna
* Manajemen Data Pengguna
* Pelaporan Permasalahan Lingkungan
* Dashboard Monitoring
* Role Based Access Control (RBAC)
* Monitoring Keamanan Sistem

---

# Teknologi yang Digunakan

## Backend

* Node.js
* Express.js

## Frontend

* HTML
* CSS
* JavaScript

## Database

* MySQL / MariaDB

## Web Server

* Nginx

## Monitoring & Security

* Wazuh SIEM
* Suricata IDS
* Telegram Notification

## Virtualisasi

* Oracle VirtualBox
* Ubuntu Server/Desktop
* Kali Linux

---

# Arsitektur Sistem

Client Browser
↓
Nginx Reverse Proxy
↓
EcoLapor Web Application
↓
Database Server

Monitoring Layer

Suricata IDS
↓
Wazuh Manager
↓
Wazuh Dashboard
↓
Telegram Notification

---

# Implementasi Keamanan

| Kontrol Keamanan         | Status |
| ------------------------ | ------ |
| Password Hashing         | ✅      |
| Session Management       | ✅      |
| Input Validation         | ✅      |
| SQL Injection Protection | ✅      |
| XSS Protection           | ✅      |
| CSRF Protection          | ✅      |
| Rate Limiting            | ✅      |
| RBAC                     | ✅      |
| Secure File Upload       | ✅      |
| HTTPS/TLS                | ✅      |
| Wazuh Monitoring         | ✅      |
| Suricata IDS             | ✅      |

---

# Instalasi

## Clone Repository

```bash
git clone https://github.com/USERNAME/ecolapor.git
cd ecolapor
```

## Install Dependency

```bash
npm install
```

## Konfigurasi Environment

Buat file:

```env
.env
```

Contoh konfigurasi:

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

Nginx digunakan sebagai reverse proxy untuk mengarahkan trafik HTTPS menuju aplikasi Node.js.

```bash
sudo systemctl status nginx
```

---

# Implementasi HTTPS

HTTPS diterapkan menggunakan SSL/TLS agar komunikasi antara client dan server terenkripsi.

Verifikasi:

```bash
https://server-ip
```

---

# Implementasi Wazuh

Instalasi Wazuh:

```bash
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
sudo bash wazuh-install.sh -a
```

Verifikasi:

```bash
sudo systemctl status wazuh-manager
```

Dashboard:

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

---

# Pengujian Keamanan

## Information Gathering

```bash
nmap -sV TARGET_IP
```

## Authentication Testing

Pengujian login menggunakan kredensial tidak valid.

Hasil:

* Login ditolak oleh sistem.

## Session Testing

Pengujian logout dan session expiration.

Hasil:

* Session berakhir setelah logout.

## Access Control Testing

Pengguna tidak dapat mengakses halaman yang tidak sesuai dengan hak aksesnya.

## IDS Monitoring

Suricata berhasil mendeteksi aktivitas scanning menggunakan Nmap.

Contoh alert:

```text
NMAP SERVICE SCAN DETECTED
```

## SIEM Monitoring

Alert keamanan berhasil diteruskan ke Wazuh Dashboard secara real-time.

---

# Hasil Pengujian

| Pengujian              | Hasil    |
| ---------------------- | -------- |
| Information Gathering  | Berhasil |
| Authentication Testing | Aman     |
| Session Testing        | Aman     |
| Access Control Testing | Aman     |
| Directory Enumeration  | Aman     |
| IDS Detection          | Berhasil |
| Wazuh Monitoring       | Berhasil |
| HTTPS Testing          | Berhasil |

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
├── README.md
└── package.json
```

---

# Tim Pengembang

| Nama                               | NIM       |
| ---------------------------------- | --------- |
| Razziq Dhavino Rafadhillah         | 152023091 |
| Muhammad Rafly Al Ghifari Ramdhani | 152023117 |
| Amsa Efraim Cicio Tarigan          | 152023120 |

---

# Mata Kuliah

Keamanan Jaringan (IFB-302)

Program Studi Informatika

Institut Teknologi Nasional Bandung

Tahun Akademik 2025/2026
