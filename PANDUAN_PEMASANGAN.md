# PANDUAN PEMASANGAN & INTEGRASI SISTEM INFORMASI AKADEMIK SMK (SIAKAD)

Sistem Informasi Akademik SMK Lengkap mencakup seluruh siklus hidup siswa (*Student Lifecycle*), dari seleksi PPDB, pembelajaran aktif (Kelas X, XI, XII), catatan kedisiplinan & Bimbingan Konseling (BK), evaluasi nilai rapor & Uji Kompetensi Keahlian (UKK BNSP), Praktik Kerja Lapangan (PKL) di Dunia Usaha/Dunia Industri (DU/DI), sidang pleno kelulusan & Surat Keterangan Lulus (SKL), hingga pelacakan alumni (*Tracer Study* BMW - Bekerja, Melanjutkan, Wirausaha).

---

## 1. SPESIFIKASI TEKNIS & FITUR SISTEM

- **Frontend Framework:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Database Utama:** Google Cloud Firestore (Firebase)
- **Integrasi Dokumen:** Google Workspace OAuth & Google Sheets API v4
- **Dukungan Tampilan:** Warna dominan cerah (*Bright Theme*) dengan 4 pilihan palet dinamis (Biru Langit, Zamrud Segar, Surya Oranye, Violet Modern).

### Fitur Utama:
1. **Lifecycle Siswa:** PPDB, penempatan kelas, kenaikan tingkat, mutasi, hingga kelulusan menjadi alumni.
2. **Kustomisasi Identitas & Logo Sekolah:** Admin dapat menginput nama resmi sekolah, nama singkat, NPSN, akreditasi, alamat, kepala sekolah & NIP, serta mengunggah logo sekolah (file upload atau URL gambar).
3. **Format Rapor Fleksibel (Admin):**
   - Kurikulum Merdeka (Capaian Pembelajaran & Deskripsi Naratif)
   - Kurikulum 2013 Revisi (Pemisahan Pengetahuan KD-3 & Keterampilan KD-4)
   - Dual System / Teaching Factory (TEFA & Industri)
   - Transkrip Nilai Akademik Ringkas 1 Halaman
4. **Catatan BK & Kedisiplinan:** Poin pelanggaran & reward prestasi, tingkatan sanksi (SP1, SP2, SP3), serta cetak resmi Surat Pemanggilan Orang Tua.
5. **Manajemen PKL DU/DI:** Data mitra industri, penempatan siswa, jurnal kegiatan harian magang, monitoring guru pembimbing, penilaian teknis/non-teknis, dan pencetakan sertifikat PKL.
6. **Sidang Pleno Kelulusan & SKL:** Evaluasi otomatis 4 syarat kelulusan vokasi, perayaan kelulusan, dan penerbitan SKL berkode QR.
7. **Tracer Study (BMW):** Analisis keterapan lulusan di dunia kerja, perguruan tinggi, dan wirausaha dengan ekspor data.
8. **Integrasi Google Sheets:** Ekspor satu-klik ke Google Sheets dan impor data siswa massal.

---

## 2. CARA MENJALANKAN DI KOMPUTER LOKAL / SERVER SEKOLAH

### Persyaratan Awal:
- Node.js versi 18 atau 20+
- Pengelola paket: `npm`, `yarn`, atau `bun`

### Langkah-Langkah:
1. **Clone atau Buka Direktori Proyek:**
   ```bash
   cd siakad-smk
   ```

2. **Instal Seluruh Dependensi:**
   ```bash
   npm install
   ```

3. **Jalankan Server Pengembangan (Dev Server):**
   ```bash
   npm run dev
   ```
   Aplikasi akan berjalan di: `http://localhost:3000`

4. **Uji Logika Perhitungan (Unit Tests):**
   ```bash
   node --test src/utils/smkLogic.test.ts
   ```

5. **Build untuk Produksi:**
   ```bash
   npm run build
   ```
   File hasil build siap didistribusikan pada folder `dist/`.

---

## 3. PANDUAN DATABASE FIREBASE FIRESTORE

Aplikasi ini telah terhubung ke Firebase Cloud Firestore dengan konfigurasi:
- **Project ID:** `siakad-smkwd-20265547`
- **Region:** `asia-east1`
- **File Konfigurasi:** `firebase-applet-config.json`
- **File Aturan Keamanan:** `firestore.rules`

### Struktur Koleksi Firestore:
| Path Koleksi | Deskripsi |
|---|---|
| `/settings/school_profile` | Profil sekolah, nama, alamat, kontak, logo, dan kop surat |
| `/report_configs/default` | Format rapor pilihan admin (Merdeka / K13 / TEFA) |
| `/students/{studentId}` | Master data siswa dan riwayat status lifecycle |
| `/bk_records/{recordId}` | Rekam kasus kedisiplinan dan konseling karir siswa |
| `/grades/{gradeId}` | Nilai formatif, sumatif materi, dan SAS per semester |
| `/pkl_placements/{placementId}` | Data penempatan dan nilai praktik kerja industri |
| `/tracer_study/{tracerId}` | Respon kuesioner penelusuran lulusan alumni |

---

## 4. PANDUAN GOOGLE WORKSPACE & GOOGLE SHEETS

Aplikasi ini menggunakan otentikasi Google OAuth client-side dengan scopes:
- `https://www.googleapis.com/auth/spreadsheets`
- `https://www.googleapis.com/auth/drive.file`

### Cara Ekspor ke Google Sheets:
1. Klik tombol **Google Sheets** di pojok kanan atas aplikasi.
2. Klik tombol **Sign in with Google** untuk menghubungkan akun Google Anda.
3. Pilih **Buku Kerja Lengkap** (membuat 5 lembar kerja: Siswa, Nilai, BK, PKL, dan Tracer Study).
4. Klik **Buat & Ekspor ke Google Spreadsheet Sekarang**.
5. Spreadsheet baru akan langsung dibuat di Google Drive Anda dengan format rapi dan tautan langsung untuk membukanya.

---

## 5. PANDUAN DEPLOY KE LAYANAN CLOUD

### Opsi A: Vercel / Netlify
1. Hubungkan repository ke dashboard Vercel / Netlify.
2. Atur perintah build: `npm run build`.
3. Atur direktori publik: `dist`.
4. Tambahkan konfigurasi rewrite untuk Single Page Application (SPA).

### Opsi B: Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Pilih folder publik: dist
npm run build
firebase deploy --only hosting
```

---
*Dokumen ini dibuat otomatis sebagai panduan resmi implementasi Sistem Informasi Akademik SMK.*
