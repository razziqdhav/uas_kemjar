# Secure Barbershop Management System

## Deskripsi

Secure Barbershop Management System merupakan aplikasi berbasis web yang dikembangkan untuk membantu pengelolaan layanan barbershop secara digital. Sistem menyediakan fitur autentikasi pengguna, manajemen data pelanggan, reservasi layanan, dan dashboard administrasi.

Selain fitur utama aplikasi, sistem juga menerapkan berbagai mekanisme keamanan pada application layer dan infrastructure layer sesuai dengan prinsip keamanan jaringan dan aplikasi.

---

# Tujuan Proyek

- Membangun aplikasi web yang aman dan mudah digunakan.
- Menerapkan secure coding practices.
- Mengimplementasikan monitoring keamanan menggunakan Wazuh dan Suricata.
- Melakukan pengujian keamanan melalui metode penetration testing.
- Memenuhi tugas Evaluasi Akhir Semester Mata Kuliah Keamanan Jaringan.

---

# Fitur Aplikasi

## User

- Registrasi akun
- Login dan logout
- Melihat layanan barbershop
- Melakukan reservasi
- Melihat riwayat reservasi

## Admin

- Login admin
- Mengelola data pelanggan
- Mengelola layanan barbershop
- Mengelola reservasi
- Monitoring aktivitas pengguna

---

# Teknologi yang Digunakan

## Backend

- Java
- Spring Boot
- Spring Security
- Maven

## Frontend

- HTML
- CSS
- JavaScript
- Bootstrap

## Database

- MariaDB / MySQL

## Web Server

- Nginx

## Security Monitoring

- Wazuh SIEM
- Suricata IDS

## Virtualization

- Oracle VirtualBox
- Ubuntu Server/Desktop
- Kali Linux

---

# Implementasi Keamanan

| Fitur Keamanan | Status |
|---------------|---------|
| Password Hashing | ✅ |
| Session Management | ✅ |
| Input Validation | ✅ |
| SQL Injection Protection | ✅ |
| Cross Site Scripting (XSS) Protection | ✅ |
| CSRF Protection | ✅ |
| HTTPS/TLS | ✅ |
| Role Based Access Control | ✅ |
| Logging Security Events | ✅ |
| Wazuh SIEM Monitoring | ✅ |
| Suricata IDS Detection | ✅ |

---

# Arsitektur Sistem

```text
+------------+
|   User     |
+------------+
       |
       v
+----------------+
| Nginx HTTPS    |
| Reverse Proxy  |
+----------------+
       |
       v
+----------------+
| Spring Boot    |
| Application    |
+----------------+
       |
       v
+----------------+
| MariaDB        |
+----------------+

Monitoring Layer

+------------+
| Suricata   |
+------------+
       |
       v
+------------+
| Wazuh      |
| Manager    |
+------------+
       |
       v
+------------+
| Dashboard  |
+------------+
```

---

# Instalasi

## Clone Repository

```bash
git clone https://github.com/USERNAME/REPOSITORY.git
cd REPOSITORY
```

---

## Konfigurasi Database

Buat database baru:

```sql
CREATE DATABASE barbershop_db;
```

Import file database:

```bash
mysql -u root -p barbershop_db < database.sql
```

---

## Konfigurasi Application Properties

```properties
spring.datasource.url=jdbc:mysql://localhost:3306/barbershop_db
spring.datasource.username=root
spring.datasource.password=password

spring.jpa.hibernate.ddl-auto=update
```

---

## Menjalankan Aplikasi

Menggunakan Maven:

```bash
mvn spring-boot:run
```

atau

```bash
java -jar target/barbershop.jar
```

---

# Instalasi Wazuh

## Install Wazuh

```bash
curl -sO https://packages.wazuh.com/4.7/wazuh-install.sh
sudo bash wazuh-install.sh -a
```

Verifikasi:

```bash
sudo systemctl status wazuh-manager
```

---

# Instalasi Suricata

```bash
sudo apt update
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

## Directory Enumeration

```bash
gobuster dir -u https://TARGET_IP -w wordlist.txt
```

## Authentication Testing

Pengujian login menggunakan kredensial tidak valid.

Hasil:

```text
Login ditolak oleh sistem.
```

## Session Testing

Pengujian logout dan session expiration.

Hasil:

```text
Session berakhir setelah logout.
```

## Monitoring Testing

Aktivitas scanning menggunakan Nmap berhasil dideteksi oleh Suricata dan ditampilkan pada dashboard Wazuh.

Contoh alert:

```text
NMAP SERVICE SCAN DETECTED
Source IP : 192.168.20.1
Destination IP : 192.168.20.2
```

---

# Hasil Pengujian

| Pengujian | Hasil |
|------------|--------|
| Information Gathering | Port berhasil teridentifikasi |
| Authentication Testing | Aman |
| Session Testing | Aman |
| Access Control Testing | Aman |
| API Testing | Aman |
| IDS Detection | Berhasil |
| SIEM Monitoring | Berhasil |
| HTTPS Testing | Berhasil |

---

# Struktur Project

```text
project/
│
├── src/
├── database/
├── docs/
├── screenshots/
├── README.md
└── pom.xml
```

---

# Kontributor

| Nama | Tugas |
|--------|--------|
| Muhammad Rafly Al Ghifari Ramdhani | Security Monitoring, Wazuh, Suricata, Penetration Testing |
| Anggota 2 | Backend Development |
| Anggota 3 | Frontend Development |

---

# Lisensi

Proyek ini dibuat untuk keperluan akademik Program Studi Informatika Institut Teknologi Nasional Bandung.
