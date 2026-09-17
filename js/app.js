const KUNCI_REKOR = "kuisSkorTertinggi";
const KUNCI_TEMA = "kuisTemaGelap";
const DURASI_SOAL = 20;

const layarAwal = document.getElementById("layar-awal");
const layarKuis = document.getElementById("layar-kuis");
const layarHasil = document.getElementById("layar-hasil");
const wadahPertanyaan = document.getElementById("wadah-pertanyaan");
const wadahProgress = document.getElementById("progress-isi");
const infoSoal = document.getElementById("info-soal");
const infoSkor = document.getElementById("info-skor");
const infoTimer = document.getElementById("info-timer");
const kategoriSoal = document.getElementById("kategori-soal");
const pesanJawaban = document.getElementById("pesan-jawaban");
const pesanRekor = document.getElementById("pesan-rekor");
const rincianJawaban = document.getElementById("rincian-jawaban");
const rekorAwal = document.getElementById("rekor-awal");
const rekorAkhir = document.getElementById("rekor-akhir");
const jumlahBenar = document.getElementById("jumlah-benar");
const skorAkhir = document.getElementById("skor-akhir");
const tombolMulai = document.getElementById("tombol-mulai");
const tombolLanjut = document.getElementById("tombol-lanjut");
const tombolUlang = document.getElementById("tombol-ulang");
const tombolReset = document.getElementById("tombol-reset");
const tombolTema = document.getElementById("tombol-tema");

let soalAktif = [];
let nomorSoal = 0;
let skor = 0;
let hitungBenar = 0;
let sudahMenjawab = false;
let sisaWaktu = DURASI_SOAL;
let jalurTimer = null;
let catatanJawaban = [];

const acakUrutan = (daftar) => {
  const hasil = daftar.slice();

  for (let i = hasil.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const sementara = hasil[i];
    hasil[i] = hasil[j];
    hasil[j] = sementara;
  }

  return hasil;
};

const ambilRekor = () => {
  const data = localStorage.getItem(KUNCI_REKOR);
  const angka = Number(data);

  if (isNaN(angka)) {
    return 0;
  }

  return angka;
};

const simpanRekor = (nilai) => {
  localStorage.setItem(KUNCI_REKOR, String(nilai));
};

const terapkanTema = () => {
  const gelap = localStorage.getItem(KUNCI_TEMA) === "ya";

  if (gelap === true) {
    document.body.classList.add("gelap");
    tombolTema.textContent = "Mode Terang";
  } else {
    document.body.classList.remove("gelap");
    tombolTema.textContent = "Mode Gelap";
  }
};

const tampilkanLayar = (layar) => {
  layarAwal.classList.add("sembunyi");
  layarKuis.classList.add("sembunyi");
  layarHasil.classList.add("sembunyi");
  layar.classList.remove("sembunyi");
};

const hentikanTimer = () => {
  if (jalurTimer !== null) {
    clearInterval(jalurTimer);
    jalurTimer = null;
  }
};

const jalankanTimer = () => {
  hentikanTimer();
  sisaWaktu = DURASI_SOAL;
  infoTimer.textContent = sisaWaktu + "s";
  infoTimer.classList.remove("timer-kritis");

  jalurTimer = setInterval(() => {
    sisaWaktu = sisaWaktu - 1;

    if (sisaWaktu <= 5) {
      infoTimer.classList.add("timer-kritis");
    }

    if (sisaWaktu <= 0) {
      infoTimer.textContent = "0s";
      hentikanTimer();
      nilaiJawaban(-1);
      return;
    }

    infoTimer.textContent = sisaWaktu + "s";
  }, 1000);
};

const perbaruiProgress = () => {
  const persen = (nomorSoal / soalAktif.length) * 100;
  wadahProgress.style.width = persen + "%";
};

const gambarSoal = () => {
  const data = soalAktif[nomorSoal];
  sudahMenjawab = false;

  wadahPertanyaan.innerHTML = "";
  wadahPertanyaan.classList.remove("masuk");
  void wadahPertanyaan.offsetWidth;
  wadahPertanyaan.classList.add("masuk");

  pesanJawaban.textContent = "";
  pesanJawaban.className = "pesan";
  tombolLanjut.classList.add("sembunyi");

  infoSoal.textContent = "Soal " + (nomorSoal + 1) + " dari " + soalAktif.length;
  infoSkor.textContent = String(skor);
  kategoriSoal.textContent = data.kategori;
  perbaruiProgress();

  const judulSoal = document.createElement("h2");
  judulSoal.className = "teks-soal";
  judulSoal.textContent = data.soal;
  wadahPertanyaan.appendChild(judulSoal);

  const wadahPilihan = document.createElement("div");
  wadahPilihan.className = "wadah-pilihan";
  wadahPilihan.id = "wadah-pilihan";

  data.pilihan.forEach((teks, urutan) => {
    const tombol = document.createElement("button");
    tombol.className = "pilihan";
    tombol.dataset.urutan = String(urutan);

    const huruf = document.createElement("span");
    huruf.className = "huruf";
    huruf.textContent = String.fromCharCode(65 + urutan);

    const isi = document.createElement("span");
    isi.className = "isi-pilihan";
    isi.textContent = teks;

    tombol.appendChild(huruf);
    tombol.appendChild(isi);
    wadahPilihan.appendChild(tombol);
  });

  wadahPertanyaan.appendChild(wadahPilihan);
  jalankanTimer();
};

const nilaiJawaban = (urutanDipilih) => {
  if (sudahMenjawab === true) {
    return;
  }

  sudahMenjawab = true;
  hentikanTimer();

  const data = soalAktif[nomorSoal];
  const daftarTombol = document.querySelectorAll(".pilihan");

  daftarTombol.forEach((tombol) => {
    const urutan = Number(tombol.dataset.urutan);

    if (urutan === data.jawaban) {
      tombol.classList.add("benar");
    }

    if (urutan === urutanDipilih && urutanDipilih !== data.jawaban) {
      tombol.classList.add("salah");
    }

    tombol.disabled = true;
  });

  if (urutanDipilih === data.jawaban) {
    skor = skor + 10;
    hitungBenar = hitungBenar + 1;
    pesanJawaban.textContent = "Jawaban benar!";
    pesanJawaban.className = "pesan pesan-benar";
    catatanJawaban.push({ nomor: nomorSoal + 1, status: "benar" });
  } else if (urutanDipilih === -1) {
    pesanJawaban.textContent = "Waktu habis. Jawaban benar: " + data.pilihan[data.jawaban];
    pesanJawaban.className = "pesan pesan-salah";
    catatanJawaban.push({ nomor: nomorSoal + 1, status: "waktu habis" });
  } else {
    pesanJawaban.textContent = "Jawaban kurang tepat. Jawaban benar: " + data.pilihan[data.jawaban];
    pesanJawaban.className = "pesan pesan-salah";
    catatanJawaban.push({ nomor: nomorSoal + 1, status: "salah" });
  }

  infoSkor.textContent = String(skor);
  tombolLanjut.classList.remove("sembunyi");

  if (nomorSoal === soalAktif.length - 1) {
    tombolLanjut.textContent = "Lihat Hasil";
  } else {
    tombolLanjut.textContent = "Soal Berikutnya";
  }
};

const tampilkanHasil = () => {
  hentikanTimer();
  tampilkanLayar(layarHasil);

  const rekorLama = ambilRekor();
  let rekorBaru = rekorLama;

  if (skor > rekorLama) {
    rekorBaru = skor;
    simpanRekor(rekorBaru);
    pesanRekor.textContent = "Skor tertinggi baru!";
    pesanRekor.className = "pesan pesan-benar";
  } else {
    pesanRekor.textContent = "Skor tertinggi masih " + rekorLama;
    pesanRekor.className = "pesan";
  }

  jumlahBenar.textContent = hitungBenar + " / " + soalAktif.length;
  skorAkhir.textContent = String(skor);
  rekorAkhir.textContent = String(rekorBaru);
  rekorAwal.textContent = String(rekorBaru);

  const ringkasan = catatanJawaban
    .map((catatan) => "Soal " + catatan.nomor + ": " + catatan.status)
    .join(" | ");

  rincianJawaban.textContent = ringkasan;
};

const mulaiKuis = () => {
  soalAktif = acakUrutan(daftarSoal);
  nomorSoal = 0;
  skor = 0;
  hitungBenar = 0;
  catatanJawaban = [];

  tampilkanLayar(layarKuis);
  gambarSoal();
};

const lanjutSoal = () => {
  if (nomorSoal === soalAktif.length - 1) {
    perbaruiProgress();
    tampilkanHasil();
    return;
  }

  nomorSoal = nomorSoal + 1;
  gambarSoal();
};

tombolMulai.addEventListener("click", () => {
  mulaiKuis();
});

tombolLanjut.addEventListener("click", () => {
  lanjutSoal();
});

tombolUlang.addEventListener("click", () => {
  mulaiKuis();
});

tombolReset.addEventListener("click", () => {
  localStorage.removeItem(KUNCI_REKOR);
  rekorAwal.textContent = "0";
  rekorAkhir.textContent = "0";
  pesanRekor.textContent = "Skor tertinggi sudah direset.";
  pesanRekor.className = "pesan";
});

tombolTema.addEventListener("click", () => {
  const gelap = localStorage.getItem(KUNCI_TEMA) === "ya";

  if (gelap === true) {
    localStorage.setItem(KUNCI_TEMA, "tidak");
  } else {
    localStorage.setItem(KUNCI_TEMA, "ya");
  }

  terapkanTema();
});

wadahPertanyaan.addEventListener("click", (kejadian) => {
  const tombol = kejadian.target.closest(".pilihan");

  if (tombol === null) {
    return;
  }

  const urutan = Number(tombol.dataset.urutan);
  nilaiJawaban(urutan);
});

const rekorTersimpan = ambilRekor();
rekorAwal.textContent = String(rekorTersimpan);
rekorAkhir.textContent = String(rekorTersimpan);
terapkanTema();
