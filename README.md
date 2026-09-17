# Interactive Quiz App

Aplikasi kuis interaktif sederhana untuk Tugas Rutin 6 Pemrograman Web. Pengguna menjawab 8 soal pilihan ganda dengan batas waktu tiap soal, lalu skor akhir dan skor tertinggi ditampilkan di akhir kuis.

## Fitur

- 8 soal pilihan ganda yang diacak urutannya setiap kali kuis dimulai.

- Timer 20 detik per soal, otomatis dianggap salah bila waktu habis.

- Progress bar yang menunjukkan posisi pengerjaan soal.

- Skor otomatis yang dihitung dari jumlah jawaban benar.

- High score yang disimpan di LocalStorage dan tetap ada setelah halaman dimuat ulang.

- Navigasi antar soal tanpa reload halaman.

- Feedback visual, jawaban benar berwarna hijau dan jawaban salah berwarna merah.

- Label kategori soal pada setiap pertanyaan.

- Animasi transisi halus saat berpindah soal.

- Dark mode toggle yang preferensinya ikut tersimpan di LocalStorage.

- Tombol restart untuk mengulang kuis dan tombol reset skor tertinggi.

- Tampilan responsif, nyaman dibuka dari layar HP.

## Teknologi

- HTML5

- CSS3 dengan CSS Variables, Flexbox, dan Grid

- JavaScript ES6+ tanpa framework

## Struktur File

```
TugasWeb-Pertemuan6-QuizApp/
├── index.html
├── css/
│   └── style.css
├── js/
│   ├── soal.js
│   └── app.js
└── README.md
```

## Penerapan Materi

- ES6+: memakai `const` dan `let`, arrow function, template literal, destructuring, serta spread operator untuk menyalin daftar soal.

- Render soal memakai `createElement` dan `textContent`, bukan `innerHTML`, supaya teks pertanyaan aman dari injeksi HTML.

- Event delegation dipasang pada container pilihan jawaban, lalu tombol yang diklik dikenali lewat `event.target.closest()`.

- Array method: `map` untuk menyusun ringkasan jawaban dan `forEach` untuk membangun elemen pilihan.

- State aplikasi disimpan di variabel terpisah, sehingga perpindahan layar awal, layar kuis, dan layar hasil tidak memerlukan reload halaman.

- LocalStorage dipakai untuk menyimpan skor tertinggi dan pilihan tema.

## Cara Menjalankan

1. Clone repository ini.

2. Buka file `index.html` di browser.

3. Klik tombol Mulai Kuis, lalu jawab setiap soal sebelum waktu habis.

4. Setelah soal terakhir, skor akhir dan skor tertinggi akan ditampilkan.

## Catatan

Skor tertinggi bisa dihapus lewat tombol Reset Skor Tertinggi di layar hasil. Pilihan tema terang atau gelap akan otomatis dipakai lagi saat halaman dibuka kembali.
