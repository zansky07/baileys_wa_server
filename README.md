# Proyek Notifikasi WhatsApp

Proyek ini adalah aplikasi Node.js yang dirancang untuk mengirim notifikasi WhatsApp. Ikuti langkah-langkah di bawah ini untuk mengatur dan menjalankan proyek.

## Prasyarat

Sebelum melanjutkan, pastikan hal-hal berikut:
- **Node.js** telah terinstal di komputer Anda. Anda dapat mengunduhnya dari [situs resmi Node.js](https://nodejs.org/).
- Koneksi internet yang stabil diperlukan agar aplikasi dapat berfungsi dengan baik.

## Instalasi

1. Clone repositori ini ke komputer lokal Anda:
   ```bash
   git clone https://git.stis.ac.id/222212750/wa_server.git
   ```

2. Masuk ke direktori proyek:
   ```bash
   cd wa_server
   ```

3. Instal dependensi yang diperlukan:
   ```bash
   npm install
   ```

## Menjalankan Proyek

Untuk memulai aplikasi, gunakan perintah berikut:
```bash
node index.js
```

Setelah menjalankan perintah:
1. QR code akan ditampilkan di terminal.
2. Buka WhatsApp di ponsel Anda dan pergi ke **Pengaturan > Perangkat Tertaut**.
3. Ketuk **Tautkan Perangkat** dan pindai QR code yang ditampilkan di terminal.

Setelah QR code berhasil dipindai, aplikasi akan terhubung ke akun WhatsApp Anda dan mengaktifkan pengiriman notifikasi.

## Catatan

- Pastikan Anda tetap membuka terminal saat menggunakan aplikasi.
- Jika QR code kedaluwarsa, mulai ulang aplikasi dengan menjalankan `node index.js` lagi.

## Pemecahan Masalah

- **Node.js tidak dikenali**: Pastikan Node.js telah terinstal dengan benar dan ditambahkan ke PATH sistem Anda.
- **Tidak dapat memindai QR code**: Pastikan ponsel Anda memiliki koneksi internet yang aktif dan aplikasi WhatsApp sudah diperbarui.

## Lisensi

Proyek ini dilisensikan di bawah Lisensi MIT. Lihat file LICENSE untuk detail lebih lanjut.

