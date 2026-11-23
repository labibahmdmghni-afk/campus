# CampusMate — Student Learning Hub

CampusMate adalah webapp sederhana untuk membantu mahasiswa mengatur tugas, jadwal kuliah, dan catatan belajar dalam satu tempat.

## Fitur
- Dashboard ringkasan jumlah tugas, tugas selesai, tugas tertunda, dan progress.
- Tambah, tandai selesai, filter, dan hapus tugas.
- Simpan jadwal mata kuliah berdasarkan hari dan jam.
- Buat dan hapus catatan belajar.
- Data disimpan di `localStorage` browser sehingga tetap ada saat halaman dibuka kembali pada perangkat/browser yang sama.
- Tampilan responsif untuk desktop dan ponsel.

## Struktur file
```text
campusmate_webapp/
├── index.html
├── style.css
├── script.js
└── README.md
```

## Cara menjalankan
1. Ekstrak ZIP.
2. Buka `index.html` di browser, atau gunakan ekstensi Live Server di VS Code.

## Cara upload ke GitHub Pages
1. Login ke GitHub dan buat repository baru, misalnya `campusmate`.
2. Pilih Public, lalu buat repository.
3. Upload `index.html`, `style.css`, `script.js`, dan `README.md` ke halaman utama repository.
4. Buka **Settings → Pages**.
5. Pada bagian **Build and deployment**, pilih **Deploy from a branch**.
6. Pilih branch `main` dan folder `/ (root)`, lalu klik **Save**.
7. Tunggu proses publikasi. Alamat web biasanya berbentuk `https://USERNAME.github.io/campusmate/`.

## Catatan
Webapp ini merupakan prototype front-end. Data disimpan secara lokal pada browser, belum menggunakan akun/login, database online, atau sinkronisasi antarperangkat. Google Fonts membutuhkan koneksi internet; jika offline, font cadangan akan digunakan.
