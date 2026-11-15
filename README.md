# SITTA - Tugas Praktik 3

Aplikasi sederhana pemesanan bahan ajar UT menggunakan Vue.js 2.7.16, HTML, dan CSS. Vue 2 dipakai agar `Vue.component` dan filter template sesuai dengan materi soal. Library Vue disertakan di `js/vendor`, sehingga aplikasi tidak memerlukan koneksi internet atau `npm install`.

## Cara menjalankan

1. Pastikan Node.js tersedia di lokal.
2. Jalankan node server.js .
3. Buka **http://127.0.0.1:8080** di browser.
4. Untuk menghentikan server, tekan `Ctrl+C` di terminal.

## Fitur

- **Stok:** daftar bahan ajar, filter UT-Daerah, kategori bergantung daerah, stok di bawah safety atau kosong, urut judul/stok/harga naik atau turun, serta reset filter.
- **Pengelolaan stok:** tambah, edit, validasi, simpan dengan Enter, hapus dengan dialog konfirmasi. Kode mata kuliah harus unik dalam UT-Daerah yang sama.
- **Status:** Aman, Menipis, dan Kosong. Catatan berformat HTML muncul saat status diarahkan kursor, difokuskan dengan keyboard, atau diklik.
- **Pemesanan:** nomor DO otomatis sesuai tahun berjalan, NIM, nama, ekspedisi, detail paket, tanggal kirim, dan harga dari paket.
- **Tracking:** cari berdasarkan nomor DO atau NIM lengkap dengan Enter; Esc atau Reset menghapus pencarian; tambah keterangan perjalanan dan status dengan waktu lokal otomatis.
- **Penyimpanan:** data awal dari JSON, perubahan disimpan pada `localStorage` browser. Tidak ada database maupun perubahan otomatis pada file JSON.

## Struktur

```text
code/
  index.html
  assets/css/style.css
  data/dataBahanAjar.json
  js/
    app.js
    services/api.js
    vendor/vue.min.js
    components/
      stock-table.js
      do-tracking.js
      order-form.js
      status-badge.js
      app-modal.js
  templates/
    stock-table.html
    do-tracking.html
    order-form.html
    status-badge.html
    app-modal.html
  server.js
  README.md
```
