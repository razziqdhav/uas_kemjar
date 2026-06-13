// Konfigurasi Global API URL - Dinamis berdasarkan hostname
const API_URL = `http://${window.location.hostname}:3000/api`;

// Fungsi Utility untuk mencegah XSS (Cross-Site Scripting) saat memunculkan data ke layar
function escapeHTML(str) {
    if (!str) return '';
    return str.toString()
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}