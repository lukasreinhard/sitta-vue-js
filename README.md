# SITTA - Tugas Praktik 3

Aplikasi sederhana pemesanan bahan ajar UT menggunakan Vue.js 2.7.16, HTML, dan CSS. Vue 2 dipakai agar `Vue.component` dan filter template sesuai dengan materi soal. Library Vue disertakan di `js/vendor`, sehingga aplikasi tidak memerlukan koneksi internet atau `npm install`.

## Cara menjalankan

1. Pastikan Node.js tersedia di komputer.
2. Klik dua kali `jalankan.bat`, lalu biarkan jendela server terbuka.
3. Buka **http://127.0.0.1:8080** di browser.
4. Untuk menghentikan server, tekan `Ctrl+C` di terminal.

Alternatif melalui terminal dari folder tugas:

```powershell
cd code
node server.js
```

Bisa juga memakai ekstensi **Live Server** di VS Code pada `index.html`. Jangan membuka `index.html` langsung dengan `file://`, karena aplikasi mengambil JSON dan template menggunakan `fetch`.

## Fitur

- **Stok:** daftar bahan ajar, filter UT-Daerah, kategori bergantung daerah, stok di bawah safety atau kosong, urut judul/stok/harga naik atau turun, serta reset filter.
- **Pengelolaan stok:** tambah, edit, validasi, simpan dengan Enter, hapus dengan dialog konfirmasi. Kode mata kuliah harus unik dalam UT-Daerah yang sama.
- **Status:** Aman, Menipis, dan Kosong. Catatan berformat HTML muncul saat status diarahkan kursor, difokuskan dengan keyboard, atau diklik. Tag format yang diizinkan: `em`, `strong`, `u`, `i`, `b`, `br`; atribut HTML dihapus.
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
  jalankan.bat
  README.md
```

## Pemetaan indikator soal

| Indikator | Implementasi |
| --- | --- |
| Komponen, custom element, template | Lima komponen `Vue.component`, props, event `$emit`, dan file HTML template terpisah. |
| Menampilkan data | Mustache di seluruh halaman, `v-text` untuk kode/informasi paket, `v-html` untuk catatan yang telah dibersihkan. |
| Conditional | `v-if`, `v-else-if`, `v-else` pada status; `v-show` pada tab dan catatan. |
| Data binding | `v-model` pada formulir; `:value`, `:class`, `:key`, serta props adalah singkatan `v-bind`. |
| Computed dan methods | Filter bertahap dan sorting pada stok; paket terpilih dan nomor DO; methods untuk CRUD, validasi, pencarian, dan progres. |
| Watcher | `region` mereset kategori; `form.paket` memperbarui keterangan paket; `open` pada modal mengatur fokus. |
| Array dan object rendering | `v-for="(item, index) in displayedStocks"` memakai indeks array mulai nol; `v-for="(label, key) in menus"` memakai nama key object. |
| Filter format | `rupiah`, `buah`, `tanggal`, dan `waktu` didaftarkan dengan `Vue.filter`. |
| Mouse dan keyboard | Klik tombol, hover catatan, Enter simpan/cari, Esc reset pencarian/tutup dialog. |

## Penyesuaian terhadap data soal

- File asli memuat dua entri identik `DO2025-0001`. Service menggabungkannya berdasarkan nomor DO agar tampil sekali, tanpa mengubah JSON sumber.
- Kategori menggunakan `kategoriList`, sedangkan ekspedisi menggunakan `pengirimanList` (`REG` menjadi JNE Regular dan `EXP` menjadi JNE Express). Penyebutan `upbjjList` untuk keduanya di soal ditafsirkan sebagai kekeliruan penamaan.
- Nomor DO baru mengikuti contoh soal dengan minimal tiga digit sequence, misalnya `DO2026-001`. Nomor contoh `DO2025-0001` tetap dipertahankan. Penghitungan memakai nomor tertinggi pada tahun berjalan, termasuk jika formatnya empat digit, agar tidak berbenturan.
- Tahun DO mengikuti waktu lokal komputer ketika pesanan dibuat. Tanggal kirim tetap dapat dipilih manual.
- Pesanan tidak otomatis mengurangi stok karena soal tidak menentukan pemilihan gudang UT-Daerah untuk pesanan.
- Data tersimpan terpisah per browser dan alamat server. Untuk mengulang dari data awal, hapus penyimpanan situs `127.0.0.1:8080` melalui pengaturan browser.

## Pemeriksaan manual

Untuk uji manual: tambah stok nol dan pastikan status Kosong; edit dengan Enter; batalkan lalu konfirmasi hapus; coba semua filter; buat pesanan; cari dengan NIM; tambah progres; muat ulang untuk memeriksa penyimpanan.

Rekaman video maksimal 15 menit dan link pengumpulan dibuat sendiri oleh mahasiswa.
