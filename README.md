# MaduAhay - E-Commerce Madu Murni & Sarang Lebah Alami

Aplikasi web e-commerce B2C UMKM **MaduAhay** berbasis **Vite + Vanilla JavaScript (ES Modules), HTML5, dan Tailwind CSS v4** dengan 3 portal peran (**User**, **Operator**, dan **Admin**).

## Fitur Utama
- **Halaman User (Storefront)**:
  - Animasi pembuka siluet lebah (`000%` s.d. `100%`) saat di-scroll yang langsung menampilkan Hero Beranda di bagian atas.
  - Panggung interaktif panen madu pohon & lebah (`#panen-interaktif`) serta kursor lebah terbang.
  - Katalog Belanja (`/produk`) berisi **20 produk madu murni dalam 5 kategori** menggunakan foto produk studio asli dan badge harga yang menonjol.
  - Halaman Ulasan Pelanggan (`/ulasan`) dengan form kirim ulasan baru.
  - Peta Lokasi & Animasi Rute (`/peta`) terhubung ke Google Maps (`https://maps.app.goo.gl/UWcN2zsZndU6gNmc6`).
  - Berita & Tips Madu (`/artikel`), Cerita Kami (`/tentang`), dan Checkout WhatsApp (`082236010244`).
- **Tombol Login Pengelola (`/login`)**:
  - Tersedia tombol **Login** langsung di navbar atas.
  - **Operator (`operator` / `operator`)**: Mengelola antrean pesanan & pengemasan (`/operator`), input pesanan manual, stok opname cepat harian, dan log aktivitas dapur.
  - **Admin (`admin` / `admin`)**: Dashboard ringkasan nilai inventaris & peringatan stok menipis (`<= 10`), tambah/hapus produk katalog, tambah/edit berita & artikel baru, serta pengaturan nama toko dan nomor WhatsApp.

## Cara Menjalankan
```bash
npm install
npm run dev
```

## Pengujian & Build Produksi
```bash
npm test
npm run build
```
