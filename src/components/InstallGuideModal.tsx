import React, { useState } from 'react';
import {
  BookOpen,
  X,
  Download,
  Copy,
  Check,
  Terminal,
  Database,
  Cloud,
  ShieldCheck,
  FileSpreadsheet,
  CheckCircle2,
  ExternalLink,
  Sparkles,
} from 'lucide-react';

interface InstallGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const InstallGuideModal: React.FC<InstallGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedSection, setCopiedSection] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'quick' | 'firebase' | 'sheets' | 'deploy'>('quick');

  if (!isOpen) return null;

  const copyToClipboard = (text: string, sectionId: string) => {
    navigator.clipboard.writeText(text);
    setCopiedSection(sectionId);
    setTimeout(() => setCopiedSection(null), 2000);
  };

  const downloadMarkdownGuide = () => {
    const markdownContent = `# PANDUAN PEMASANGAN & INTEGRASI SISTEM INFORMASI AKADEMIK SMK (SIAKAD)

## 1. SPESIFIKASI TEKNIS & FITUR
- **Framework:** React 19 + TypeScript + Vite + Tailwind CSS v4
- **Database Backend:** Cloud Firestore (Firebase)
- **Otentikasi & Ekspor:** Google Workspace OAuth & Google Sheets API v4
- **Fitur Utama:**
  1. Lifecycle Lengkap Siswa (PPDB -> Kelas X -> XI -> XII -> Kelulusan -> Alumni)
  2. Catatan Bimbingan Konseling (BK) & Sistem Poin Kedisiplinan (SP1, SP2, SP3)
  3. Nilai Rapor Kurikulum Merdeka & K13 dengan Konfigurator Format Rapor (Admin)
  4. Uji Kompetensi Keahlian (UKK) & LSP P1 BNSP
  5. Manajemen Praktik Kerja Lapangan (PKL DU/DI) & Jurnal Harian
  6. Sidang Pleno Kelulusan & Penerbitan Surat Keterangan Lulus (SKL) Resmi
  7. Tracer Study Alumni dengan Statistik Penyerapan BMW (Bekerja, Melanjutkan, Wirausaha)
  8. Kustomisasi Profil Sekolah, Kop Surat, dan Upload Logo Sekolah

---

## 2. CARA MENJALANKAN DI LOKAL (LOCAL SERVER)

### Langkah 1: Kebutuhan Awal
- Node.js versi 18 atau lebih tinggi
- NPM atau Bun / Yarn

### Langkah 2: Instalasi Dependensi
\`\`\`bash
# Masuk ke direktori proyek
cd siakad-smk

# Install seluruh paket dependensi
npm install
\`\`\`

### Langkah 3: Menjalankan Server Pengembangan
\`\`\`bash
npm run dev
\`\`\`
Aplikasi akan aktif di: \`http://localhost:3000\`

### Langkah 4: Melakukan Build Produksi
\`\`\`bash
npm run build
\`\`\`

---

## 3. PANDUAN INTEGRASI FIREBASE FIRESTORE

Aplikasi ini menggunakan Firebase Cloud Firestore untuk persistensi real-time data akademik.

### Konfigurasi Projek Firebase:
- **Project ID:** \`siakad-smkwd-20265547\`
- **Wilayah Firestore:** \`asia-east1\`
- **File Konfigurasi:** \`firebase-applet-config.json\`

### Skema Koleksi Firestore:
1. \`/settings/school_profile\` : Menyimpan identitas sekolah, kop surat, dan logo sekolah.
2. \`/report_configs/default\` : Format rapor pilihan admin (Kurikulum Merdeka / K13 / Dual System).
3. \`/students/{studentId}\` : Database master siswa.
4. \`/bk_records/{recordId}\` : Rekam catatan pelanggaran dan prestasi BK.
5. \`/grades/{gradeId}\` : Nilai formatif, sumatif, dan SAS semester.
6. \`/pkl_placements/{placementId}\` : Data penempatan dan nilai pembimbing industri.
7. \`/tracer_study/{tracerId}\` : Data penelusuran lulusan (BMW).

---

## 4. PANDUAN INTEGRASI GOOGLE SHEETS & WORKSPACE

Aplikasi mendukung ekspor dan impor langsung ke Google Sheets menggunakan akun Google pengguna.

### Izin (OAuth Scopes) yang Digunakan:
- \`https://www.googleapis.com/auth/spreadsheets\`
- \`https://www.googleapis.com/auth/drive.file\`

### Cara Menggunakan:
1. Buka menu **Google Sheets** di pojok kanan atas aplikasi.
2. Klik tombol **Sign in with Google**.
3. Pilih opsi **Buku Kerja Lengkap** atau **Data Siswa Saja**.
4. Klik **Buat & Ekspor ke Google Spreadsheet**.
5. Spreadsheet baru akan langsung dibuat di Google Drive Anda dan dapat langsung dibuka.

---

## 5. PANDUAN DEPLOYMENT KE CLOUD

### Opsi A: Deploy ke Vercel
1. Hubungkan repository GitHub ke dashboard Vercel.
2. Set Build Command: \`npm run build\`
3. Set Output Directory: \`dist\`
4. Tambahkan konfigurasi rewrite untuk SPA di \`vercel.json\`.

### Opsi B: Deploy ke Firebase Hosting
\`\`\`bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Pilih build direktori: dist
npm run build
firebase deploy --only hosting
\`\`\`

---
*Dibuat oleh Tim Pengembang SIAKAD SMK Vokasi Nusantara*
`;

    const blob = new Blob([markdownContent], { type: 'text/markdown;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'PANDUAN_PEMASANGAN_SIAKAD_SMK.md';
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 sm:p-7 shadow-2xl border border-sky-100 relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-indigo-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                Panduan Pemasangan &amp; Integrasi Sistem
              </h3>
              <p className="text-xs text-slate-500">
                Instruksi instalasi mandiri, database Firebase Firestore, Google Sheets API, dan deployment.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('quick')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'quick'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Terminal className="w-4 h-4" /> 1. Instalasi Cepat (Lokal)
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('firebase')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'firebase'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Database className="w-4 h-4" /> 2. Database Firebase
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('sheets')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sheets'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" /> 3. Google Sheets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('deploy')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'deploy'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Cloud className="w-4 h-4" /> 4. Deploy ke Cloud
          </button>
        </div>

        {/* Tab 1: Quick Install */}
        {activeTab === 'quick' && (
          <div className="mt-4 space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-sky-50/60 border border-sky-100 rounded-xl space-y-1">
              <h4 className="font-bold text-sky-900 text-sm">Persyaratan Sistem</h4>
              <p className="text-slate-600">
                Node.js versi 18 atau 20+ sudah terinstal di server sekolah atau laptop lokal Anda.
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">1. Instalasi Paket Dependensi</span>
                <button
                  onClick={() => copyToClipboard('npm install', 'cmd-install')}
                  className="flex items-center gap-1 text-slate-500 hover:text-sky-600"
                >
                  {copiedSection === 'cmd-install' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Salin Perintah</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-sky-300 rounded-xl font-mono text-[11px] overflow-x-auto">
                npm install
              </pre>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">2. Jalankan Server Pengembangan</span>
                <button
                  onClick={() => copyToClipboard('npm run dev', 'cmd-dev')}
                  className="flex items-center gap-1 text-slate-500 hover:text-sky-600"
                >
                  {copiedSection === 'cmd-dev' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Salin Perintah</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-sky-300 rounded-xl font-mono text-[11px] overflow-x-auto">
                npm run dev
              </pre>
              <p className="text-slate-500 text-[11px]">
                Akses web aplikasi melalui browser di: <strong className="text-slate-800">http://localhost:3000</strong>
              </p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="font-bold text-slate-800">3. Menjalankan Uji Logika (Unit Test SMK)</span>
                <button
                  onClick={() => copyToClipboard('node --test src/utils/smkLogic.test.ts', 'cmd-test')}
                  className="flex items-center gap-1 text-slate-500 hover:text-sky-600"
                >
                  {copiedSection === 'cmd-test' ? (
                    <Check className="w-3.5 h-3.5 text-emerald-600" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                  <span>Salin Perintah</span>
                </button>
              </div>
              <pre className="p-3 bg-slate-900 text-sky-300 rounded-xl font-mono text-[11px] overflow-x-auto">
                node --test src/utils/smkLogic.test.ts
              </pre>
            </div>
          </div>
        )}

        {/* Tab 2: Firebase Firestore */}
        {activeTab === 'firebase' && (
          <div className="mt-4 space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-emerald-50/60 border border-emerald-100 rounded-xl">
              <p className="font-bold text-emerald-900 text-sm">Status Firebase Terkoneksi</p>
              <p className="text-emerald-700 text-[11px] mt-0.5">
                Projek ID: <code className="font-bold">siakad-smkwd-20265547</code> | Region: <code className="font-bold">asia-east1</code>
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Struktur Koleksi Data Firestore:</h4>
              <ul className="space-y-1.5 list-disc pl-5 text-slate-600">
                <li><strong className="text-slate-800">settings/school_profile:</strong> Nama sekolah, logo, kop resmi, dan data kepala sekolah.</li>
                <li><strong className="text-slate-800">report_configs/default:</strong> Format rapor yang dipilih admin (Merdeka / K13 / TEFA).</li>
                <li><strong className="text-slate-800">students:</strong> Data siswa dari calon PPDB hingga lulusan alumni.</li>
                <li><strong className="text-slate-800">bk_records:</strong> Catatan konseling, pelanggaran, poin, dan surat peringatan (SP).</li>
                <li><strong className="text-slate-800">grades:</strong> Nilai rapor formatif, sumatif materi, dan SAS per semester.</li>
                <li><strong className="text-slate-800">pkl_placements:</strong> Mitra DU/DI, penilaian pembimbing industri, dan sertifikat PKL.</li>
                <li><strong className="text-slate-800">tracer_study:</strong> Pelacakan kuesioner alumni dan serapan status BMW.</li>
              </ul>
            </div>

            <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl">
              <p className="font-bold text-slate-800 mb-1">Keamanan (Security Rules)</p>
              <p className="text-slate-600 text-[11px]">
                Aturan keamanan telah dideploy secara resmi di Firebase Cloud Firestore dengan perlindungan akses berbasis role dan verifikasi Google.
              </p>
            </div>
          </div>
        )}

        {/* Tab 3: Google Sheets */}
        {activeTab === 'sheets' && (
          <div className="mt-4 space-y-4 text-xs text-slate-700">
            <div className="p-3.5 bg-teal-50/60 border border-teal-100 rounded-xl">
              <h4 className="font-bold text-teal-900 text-sm">Integrasi Google Workspace Resmi</h4>
              <p className="text-teal-700 text-[11px] mt-0.5">
                Aplikasi langsung terhubung dengan Google Sheets API v4 dan Google Drive API untuk ekspor data secara instan.
              </p>
            </div>

            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Fitur Google Sheets:</h4>
              <ul className="space-y-2 text-slate-600">
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Ekspor Buku Kerja Lengkap:</strong> Membuat file spreadsheet otomatis berisi 5 tab (Siswa, Rapor, BK, PKL, dan Tracer Study) dengan formula dan pemformatan sel rapi.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Sinkronisasi Real-Time:</strong> Data langsung tersimpan di akun Google Drive admin atau guru yang sedang login.</span>
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <span><strong>Impor Data Siswa:</strong> Guru dapat memasukkan ID Google Sheet untuk menarik data siswa baru secara massal.</span>
                </li>
              </ul>
            </div>
          </div>
        )}

        {/* Tab 4: Cloud Deploy */}
        {activeTab === 'deploy' && (
          <div className="mt-4 space-y-4 text-xs text-slate-700">
            <div className="space-y-2">
              <h4 className="font-bold text-slate-900">Pilihan Deployment Produksi</h4>
              <p className="text-slate-600">
                Aplikasi ini berupa Single Page Application (SPA) React yang sangat ringan dan siap dideploy ke berbagai layanan hosting gratis atau berbayar.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <p className="font-bold text-slate-900">Vercel / Netlify</p>
                <p className="text-slate-500 text-[11px]">
                  Cukup hubungkan repository GitHub. Atur build command: <code className="text-slate-800">npm run build</code> dan output directory: <code className="text-slate-800">dist</code>.
                </p>
              </div>

              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <p className="font-bold text-slate-900">Firebase Hosting</p>
                <p className="text-slate-500 text-[11px]">
                  Gunakan perintah <code className="text-slate-800">firebase deploy --only hosting</code> setelah menjalankan <code className="text-slate-800">npm run build</code>.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Footer */}
        <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3 mt-4">
          <button
            type="button"
            onClick={downloadMarkdownGuide}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-900 text-white rounded-lg font-bold flex items-center gap-1.5 text-xs shadow-sm transition-all"
          >
            <Download className="w-3.5 h-3.5" /> Unduh Dokumen Panduan (.md)
          </button>

          <button
            type="button"
            onClick={onClose}
            className="px-5 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold text-xs transition-all"
          >
            Tutup Panduan
          </button>
        </div>
      </div>
    </div>
  );
};
