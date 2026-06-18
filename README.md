# 🍲 Soto POS - Aplikasi Kasir Digital (Point of Sale)

Soto POS adalah aplikasi kasir (Point of Sale) modern, responsif, dan *offline-first* yang dirancang khusus untuk **Warung Soto Pak Asyari**. Aplikasi ini dibangun menggunakan teknologi web murni (**HTML5, CSS3, dan Vanilla JavaScript**) tanpa ketergantungan pada pustaka eksternal (*zero-dependency*), sehingga sangat ringan, cepat, dan siap digunakan secara instan.

Semua data transaksi, menu makanan, inventaris bahan baku, catatan pengeluaran, dan pengaturan restoran disimpan secara aman di penyimpanan lokal peramban Anda (`localStorage`).

---

## ✨ Fitur Utama

### 1. 🔐 Sistem Login & Hak Akses (RBAC)
Membatasi akses fitur aplikasi berdasarkan peran pengguna untuk menjaga keamanan data:
*   **Peran Admin (Pemilik/Owner)**: Akses penuh ke seluruh menu sistem termasuk dashboard statistik keuangan, kelola menu, penyesuaian stok, pengeluaran kas, Z-Report harian, ekspor CSV, dan pengaturan warung.
*   **Peran Kasir**: Akses terbatas hanya untuk halaman **Kasir (POS)** dan **Riwayat Transaksi** (cetak ulang struk). Halaman dashboard, pengaturan, kelola stok/menu, serta tombol hapus transaksi disembunyikan secara otomatis.
*   **Session Persistence**: Sesi masuk tetap aktif meskipun halaman web di-refresh (disimpan di peramban) hingga pengguna secara eksplisit mengklik tombol **Keluar (Logout)**.

### 2. 🛒 Mesin Kasir Interaktif (POS Cashier)
*   Menu makanan yang dikelompokkan berdasarkan kategori (*Soto, Topping, Minuman, Ekstra*) dengan pencarian *real-time*.
*   Keranjang belanja dinamis yang otomatis menghitung subtotal, pajak, diskon, dan uang kembalian pelanggan.
*   Pemberian catatan kustom pada tiap item (misal: *"tanpa tauge"*, *"pedas"*).
*   Metode pembayaran beragam (Tunai, QRIS, Transfer) dilengkapi tombol pintas nominal tunai (Rp 10.000 s.d. Rp 100.000).

### 3. 📊 Dashboard Analitik & Grafik SVG Dinamis
*   **6 Kartu Metrik Keuangan**: Menampilkan Pendapatan Kotor Hari Ini, Jumlah Transaksi, Menu Terlaris, Rata-rata Nilai Struk, Total Pengeluaran Hari Ini, dan Keuntungan Bersih secara *real-time*.
*   **Grafik Penjualan Interaktif**: Dibuat menggunakan SVG murni yang digambar ulang secara dinamis sesuai periode yang dipilih (**Hari Ini**, **7 Hari Terakhir**, **Bulan Ini**) lengkap dengan tooltip interaktif.
*   **Indikator Tren**: Informasi visual persentase kenaikan/penurunan keuntungan bersih hari ini dibandingkan hari kemarin.

### 4. 📦 Manajemen Inventaris & Kontrol Stok Bahan Baku
*   Sub-navigasi di menu manajemen untuk memantau stok bahan baku utama (Ayam Suwir, Daging, Sate, Beras, dll.).
*   **Auto-Decrement Recipe**: Stok bahan baku otomatis terpotong saat transaksi berhasil dibayar berdasarkan konfigurasi resep makanan.
*   **Peringatan Stok Menipis**: Memunculkan notifikasi *toast* secara otomatis jika stok bahan baku berada di bawah ambang batas minimum.

### 5. 💸 Pencatatan Pengeluaran (Expense Tracker)
*   Pencatatan pengeluaran harian operasional warung (belanja daging sapi, beli beras, gas LPG, listrik, dll.) berdasarkan kategori.
*   Secara otomatis memotong omzet harian untuk menghasilkan angka keuntungan bersih yang presisi di dashboard.

### 6. 📝 Riwayat Transaksi & Laporan Penutupan (Z-Report)
*   Daftar transaksi lampau lengkap yang dapat difilter berdasarkan tanggal, metode pembayaran, atau pencarian ID transaksi/nama pelanggan.
*   Ekspor seluruh data transaksi ke format `.CSV` yang ramah aplikasi spreadsheet (seperti Microsoft Excel atau Google Sheets).
*   **Z-Report Harian**: Cetak laporan rekap penutupan kasir harian yang berisi omzet kotor, total potongan diskon, pajak terkumpul, pengeluaran kas harian, keuntungan bersih, dan kuantitas menu yang terjual hari ini.

### 7. 🖨️ Cetak Struk Belanja Thermal POS
*   Sistem cetak struk belanja thermal berukuran standard 58mm/80mm.
*   Menggunakan stylesheet `@media print` khusus untuk merapikan struk dan menyembunyikan navigasi aplikasi saat dialog cetak peramban (`Ctrl + P`) aktif.

### 8. ⚙️ Pengaturan Restoran (Warung Settings)
*   Kustomisasi nama warung, tagline, alamat, nomor telepon, default nilai pajak & diskon, hingga logo/emoji.
*   Perubahan pengaturan akan langsung diterapkan secara *real-time* ke judul aplikasi, nilai default di kasir, hingga dokumen cetak struk thermal dan Z-Report.

---

## 🔑 Akun & Kredensial Masuk (Login)

Gunakan akun berikut untuk masuk ke dalam aplikasi:

| Peran (Role) | Nama Pengguna (Username) | Kata Sandi (Password) |
| :--- | :--- | :--- |
| **Admin (Pemilik)** | `admin` | `admin123` |
| **Kasir** | `kasir` | `kasir123` |

---

## 🚀 Cara Menjalankan Aplikasi

Karena aplikasi ini dikembangkan secara murni menggunakan teknologi front-end dasar (*standard web stack*), Anda tidak memerlukan instalasi Node.js, PHP, atau server lokal yang rumit. 

### Metode 1: Buka Langsung di Browser (Paling Mudah)
1. Unduh atau salin seluruh isi repositori ini.
2. Cari berkas **`index.html`** di komputer Anda.
3. Klik ganda (double-click) berkas tersebut. Aplikasi akan langsung berjalan di peramban web bawaan Anda (Google Chrome, Microsoft Edge, Mozilla Firefox, dll.).

### Metode 2: Menggunakan Server Lokal Python (Opsional)
Jika Anda ingin menyajikan aplikasi melalui protokol HTTP lokal, buka terminal/PowerShell di direktori proyek ini dan jalankan:
```bash
python -m http.server 8000
```
Lalu, buka browser Anda dan ketikkan alamat: `http://localhost:8000`.

---

## 📂 Struktur Berkas Proyek

```text
cool-shannon/
├── index.html        # Kerangka layout HTML5 utama, modal dialog, dan struk
├── style.css         # Desain sistem, warna celery-green, responsivitas, & CSS cetak
├── app.js            # Engine logika POS, state manajemen, kalkulasi, & auth
├── logo.png          # Logo grafis resmi Warung Soto Pak Asyari
└── README.md         # Dokumentasi petunjuk penggunaan aplikasi
```

---

*Selamat menggunakan! Semoga aplikasi ini dapat membantu memajukan pembukuan usaha Warung Soto Pak Asyari menjadi lebih efisien dan modern.* 🍲✨
