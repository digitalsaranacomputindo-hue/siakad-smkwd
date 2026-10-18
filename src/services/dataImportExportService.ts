import type {
  BKRecord,
  GradeRecord,
  IndustryPartner,
  MajorCode,
  PKLPlacement,
  SchoolProfile,
  Student,
  TracerStudyRecord,
} from '../types/academic.ts';

export type ImportDataType = 'students' | 'grades' | 'bk' | 'pkl' | 'partners' | 'tracer';

export interface TemplateColumn {
  key: string;
  label: string;
  required: boolean;
  type: 'string' | 'number' | 'enum' | 'date';
  example: string;
  allowedValues?: string[];
  description: string;
}

export interface TemplateDefinition {
  type: ImportDataType;
  title: string;
  description: string;
  columns: TemplateColumn[];
  sampleRows: Record<string, string | number>[];
}

export const TEMPLATE_DEFINITIONS: Record<ImportDataType, TemplateDefinition> = {
  students: {
    type: 'students',
    title: 'Template Data Induk Siswa & PPDB',
    description: 'Format data siswa mencakup NISN, NIK, nama lengkap, jurusan, kelas, dan kontak wali murid.',
    columns: [
      { key: 'nisn', label: 'NISN', required: true, type: 'string', example: '0081234567', description: 'Nomor Induk Siswa Nasional (10 digit angka)' },
      { key: 'nik', label: 'NIK', required: false, type: 'string', example: '3171012345670001', description: 'Nomor Induk Kependudukan (16 digit angka)' },
      { key: 'name', label: 'Nama Lengkap', required: true, type: 'string', example: 'Muhammad Rizky Pratama', description: 'Nama lengkap siswa sesuai akta' },
      { key: 'gender', label: 'Jenis Kelamin (L/P)', required: true, type: 'enum', example: 'L', allowedValues: ['L', 'P'], description: 'L untuk Laki-laki, P untuk Perempuan' },
      { key: 'classLevel', label: 'Tingkat', required: true, type: 'enum', example: 'X', allowedValues: ['PPDB', 'X', 'XI', 'XII', 'XIII', 'ALUMNI'], description: 'Tingkat pendidikan siswa' },
      { key: 'major', label: 'Kode Jurusan', required: true, type: 'enum', example: 'RPL', allowedValues: ['RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'], description: 'Konsentrasi keahlian SMK' },
      { key: 'className', label: 'Nama Rombel / Kelas', required: true, type: 'string', example: 'X RPL 1', description: 'Nama rombongan belajar' },
      { key: 'status', label: 'Status Siswa', required: false, type: 'enum', example: 'AKTIF', allowedValues: ['CALON', 'AKTIF', 'CUTI', 'LULUS', 'MUTASI_KELUAR', 'DROP_OUT'], description: 'Status keaktifan peserta didik' },
      { key: 'birthPlace', label: 'Tempat Lahir', required: false, type: 'string', example: 'Jakarta', description: 'Kota tempat kelahiran' },
      { key: 'birthDate', label: 'Tanggal Lahir', required: false, type: 'date', example: '2008-04-15', description: 'Format YYYY-MM-DD' },
      { key: 'phone', label: 'No. HP Siswa', required: false, type: 'string', example: '081234567890', description: 'Nomor WhatsApp / telepon siswa' },
      { key: 'parentName', label: 'Nama Orang Tua / Wali', required: false, type: 'string', example: 'Bambang Sutrisno', description: 'Nama ayah/ibu/wali' },
      { key: 'parentPhone', label: 'No. HP Orang Tua', required: false, type: 'string', example: '081298765432', description: 'Nomor kontak wali' },
      { key: 'address', label: 'Alamat Lengkap', required: false, type: 'string', example: 'Jl. Merdeka No. 12, Jakarta', description: 'Alamat tempat tinggal' },
      { key: 'sppStatus', label: 'Status SPP', required: false, type: 'enum', example: 'LUNAS', allowedValues: ['LUNAS', 'MENUNGGAK_1_BULAN', 'MENUNGGAK_2_BULAN', 'BEASISWA'], description: 'Keterangan keuangan SPP' },
      { key: 'academicYear', label: 'Tahun Ajaran', required: false, type: 'string', example: '2025/2026', description: 'Tahun pelajaran berjalan' },
    ],
    sampleRows: [
      {
        nisn: '0081234567',
        nik: '3171012345670001',
        name: 'Muhammad Rizky Pratama',
        gender: 'L',
        classLevel: 'X',
        major: 'RPL',
        className: 'X RPL 1',
        status: 'AKTIF',
        birthPlace: 'Jakarta',
        birthDate: '2008-04-15',
        phone: '081234567890',
        parentName: 'Bambang Sutrisno',
        parentPhone: '081298765432',
        address: 'Jl. Gatot Subroto No. 45, Jakarta Selatan',
        sppStatus: 'LUNAS',
        academicYear: '2025/2026',
      },
      {
        nisn: '0087654321',
        nik: '3171012345670002',
        name: 'Siti Nurhaliza Putri',
        gender: 'P',
        classLevel: 'XI',
        major: 'DKV',
        className: 'XI DKV 2',
        status: 'AKTIF',
        birthPlace: 'Bandung',
        birthDate: '2007-09-20',
        phone: '085712345678',
        parentName: 'Ahmad Fauzi',
        parentPhone: '085798765432',
        address: 'Jl. Asia Afrika No. 10, Jakarta',
        sppStatus: 'BEASISWA',
        academicYear: '2025/2026',
      },
    ],
  },

  grades: {
    type: 'grades',
    title: 'Template Penilaian & Rapor Akademik (Kurikulum Merdeka / K13)',
    description: 'Format nilai mata pelajaran meliputi nilai formatif, sumatif materi (STS), sumatif akhir (SAS), dan capaian kompetensi.',
    columns: [
      { key: 'nisn', label: 'NISN Siswa', required: true, type: 'string', example: '0081234567', description: 'NISN siswa terdaftar di sistem' },
      { key: 'studentName', label: 'Nama Siswa (Opsional)', required: false, type: 'string', example: 'Muhammad Rizky Pratama', description: 'Nama siswa pembantu pencocokan' },
      { key: 'semester', label: 'Semester (1-6)', required: true, type: 'number', example: 1, description: 'Semester ke-1 sampai ke-6' },
      { key: 'academicYear', label: 'Tahun Ajaran', required: false, type: 'string', example: '2025/2026', description: 'Tahun pelajaran berjalan' },
      { key: 'subjectCode', label: 'Kode Mapel', required: true, type: 'string', example: 'RPL-01', description: 'Kode unik mata pelajaran' },
      { key: 'subjectName', label: 'Nama Mata Pelajaran', required: true, type: 'string', example: 'Pemrograman Web dan Perangkat Bergerak', description: 'Nama lengkap mata pelajaran' },
      { key: 'category', label: 'Kategori Mapel', required: true, type: 'enum', example: 'KONSENTRASI_KEAHLIAN', allowedValues: ['UMUM', 'KEJURUAN_DASAR', 'KONSENTRASI_KEAHLIAN', 'PROJEK_P5', 'PKL', 'MUATAN_LOKAL'], description: 'Kelompok mata pelajaran vokasi' },
      { key: 'kkm', label: 'KKTP / KKM (0-100)', required: false, type: 'number', example: 75, description: 'Batas Kriteria Ketercapaian Pembelajaran' },
      { key: 'formativeScore', label: 'Nilai Formatif (0-100)', required: true, type: 'number', example: 88, description: 'Rata-rata asesmen harian / proses' },
      { key: 'sumativeMaterialScore', label: 'Sumatif Lingkup Materi (STS)', required: true, type: 'number', example: 85, description: 'Asesmen tengah semester / per tujuan pembelajaran' },
      { key: 'sumativeFinalScore', label: 'Sumatif Akhir Semester (SAS)', required: true, type: 'number', example: 90, description: 'Asesmen akhir semester' },
      { key: 'competencyAchievement', label: 'Deskripsi Capaian Kompetensi', required: false, type: 'string', example: 'Sangat menguasai arsitektur backend REST API dan autentikasi JWT.', description: 'Narasi capaian pembelajaran siswa pada rapor' },
    ],
    sampleRows: [
      {
        nisn: '0081234567',
        studentName: 'Muhammad Rizky Pratama',
        semester: 1,
        academicYear: '2025/2026',
        subjectCode: 'RPL-01',
        subjectName: 'Pemrograman Web dan Perangkat Bergerak',
        category: 'KONSENTRASI_KEAHLIAN',
        kkm: 75,
        formativeScore: 88,
        sumativeMaterialScore: 86,
        sumativeFinalScore: 92,
        competencyAchievement: 'Menunjukkan penguasaan sangat baik dalam sintaks TypeScript dan React Tailwind.',
      },
      {
        nisn: '0081234567',
        studentName: 'Muhammad Rizky Pratama',
        semester: 1,
        academicYear: '2025/2026',
        subjectCode: 'MTK-01',
        subjectName: 'Matematika Vokasi',
        category: 'UMUM',
        kkm: 70,
        formativeScore: 82,
        sumativeMaterialScore: 80,
        sumativeFinalScore: 84,
        competencyAchievement: 'Mampu menerapkan kalkulus logika ke dalam algoritma pemrograman.',
      },
    ],
  },

  bk: {
    type: 'bk',
    title: 'Template Catatan Bimbingan & Konseling (BK)',
    description: 'Format pencatatan pelanggaran tata tertib, reward prestasi vokasi, konseling karir, dan pembinaan.',
    columns: [
      { key: 'nisn', label: 'NISN Siswa', required: true, type: 'string', example: '0081234567', description: 'NISN siswa' },
      { key: 'studentName', label: 'Nama Siswa (Opsional)', required: false, type: 'string', example: 'Muhammad Rizky Pratama', description: 'Nama siswa' },
      { key: 'date', label: 'Tanggal Kejadian', required: true, type: 'date', example: '2026-03-10', description: 'Format YYYY-MM-DD' },
      { key: 'category', label: 'Kategori Kasus / Layanan', required: true, type: 'enum', example: 'PRESTASI', allowedValues: ['PELANGGARAN', 'PRESTASI', 'KONSELING_KARIR', 'KONSELING_PRIBADI', 'HOME_VISIT'], description: 'Jenis layanan bimbingan' },
      { key: 'severity', label: 'Tingkat / Bobot', required: true, type: 'enum', example: 'PRESTASI', allowedValues: ['RINGAN', 'SEDANG', 'BERAT', 'PRESTASI'], description: 'Klasifikasi berat ringannya kasus' },
      { key: 'title', label: 'Judul Kasus / Prestasi', required: true, type: 'string', example: 'Juara 1 LKS Web Technologies Tingkat Provinsi', description: 'Ringkasan singkat' },
      { key: 'description', label: 'Kronologi / Uraian Detail', required: true, type: 'string', example: 'Meraih medali emas LKS dan sertifikat kompetensi LSP.', description: 'Deskripsi lengkap bimbingan' },
      { key: 'points', label: 'Poin (Angka Positif)', required: true, type: 'number', example: 50, description: 'Poin reward atau poin akumulasi pelanggaran' },
      { key: 'isReward', label: 'Apakah Reward? (TRUE/FALSE)', required: true, type: 'enum', example: 'TRUE', allowedValues: ['TRUE', 'FALSE'], description: 'TRUE untuk penghargaan, FALSE untuk pelanggaran' },
      { key: 'followUpAction', label: 'Tindak Lanjut / Apresiasi', required: false, type: 'string', example: 'Diusulkan beasiswa penuh dan penghargaan saat upacara bendera.', description: 'Tindakan bimbingan konseling' },
      { key: 'status', label: 'Status Bimbingan', required: false, type: 'enum', example: 'SELESAI', allowedValues: ['TERBUKA', 'DALAM_PENANGANAN', 'SELESAI'], description: 'Status penanganan bimbingan' },
      { key: 'counselorName', label: 'Guru BK / Pembina', required: false, type: 'string', example: 'Dra. Hj. Nurjanah, M.Pd.', description: 'Nama pembimbing BK' },
      { key: 'parentNotified', label: 'Wali Diberitahu? (TRUE/FALSE)', required: false, type: 'enum', example: 'TRUE', allowedValues: ['TRUE', 'FALSE'], description: 'Status pemberitahuan ke wali' },
    ],
    sampleRows: [
      {
        nisn: '0081234567',
        studentName: 'Muhammad Rizky Pratama',
        date: '2026-03-10',
        category: 'PRESTASI',
        severity: 'PRESTASI',
        title: 'Juara 1 Lomba LKS Bidang Web Technologies',
        description: 'Mewakili sekolah di tingkat provinsi DKI Jakarta dan meraih nilai tertinggi 98.4.',
        points: 50,
        isReward: 'TRUE',
        followUpAction: 'Pemberian apresiasi piala dan piagam penghargaan oleh Kepala Sekolah.',
        status: 'SELESAI',
        counselorName: 'Dra. Hj. Nurjanah, M.Pd.',
        parentNotified: 'TRUE',
      },
    ],
  },

  pkl: {
    type: 'pkl',
    title: 'Template Penempatan & Evaluasi PKL / Magang DU/DI',
    description: 'Format data magang industri meliputi nama DUDI, mentor industri, masa PKL, dan evaluasi nilai akhir sertifikat.',
    columns: [
      { key: 'studentNisn', label: 'NISN Siswa', required: true, type: 'string', example: '0081234567', description: 'NISN siswa magang' },
      { key: 'studentName', label: 'Nama Siswa', required: true, type: 'string', example: 'Muhammad Rizky Pratama', description: 'Nama siswa' },
      { key: 'major', label: 'Jurusan', required: true, type: 'enum', example: 'RPL', allowedValues: ['RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'], description: 'Program keahlian' },
      { key: 'studentClass', label: 'Kelas Siswa', required: false, type: 'string', example: 'XI RPL 1', description: 'Rombel siswa' },
      { key: 'companyName', label: 'Nama Industri / DU/DI', required: true, type: 'string', example: 'PT Telkom Indonesia (Persero) Tbk', description: 'Tempat magang resmi' },
      { key: 'companyAddress', label: 'Alamat Industri', required: false, type: 'string', example: 'Jl. Gatot Subroto Kav. 52, Jakarta', description: 'Lokasi industri' },
      { key: 'industryMentor', label: 'Mentor / Pembimbing Industri', required: true, type: 'string', example: 'Ir. Hendra Gunawan, M.Kom', description: 'Pembimbing teknis dari DUDI' },
      { key: 'schoolSupervisor', label: 'Guru Pembimbing Sekolah', required: true, type: 'string', example: 'Budi Santoso, S.Kom', description: 'Guru pembimbing magang' },
      { key: 'startDate', label: 'Tanggal Mulai', required: true, type: 'date', example: '2026-01-05', description: 'Format YYYY-MM-DD' },
      { key: 'endDate', label: 'Tanggal Selesai', required: true, type: 'date', example: '2026-06-30', description: 'Format YYYY-MM-DD' },
      { key: 'status', label: 'Status PKL', required: false, type: 'enum', example: 'BERJALAN', allowedValues: ['PENGAJUAN', 'BERJALAN', 'SELESAI', 'BATAL'], description: 'Status magang' },
      { key: 'technicalScore', label: 'Nilai Teknis (0-100)', required: false, type: 'number', example: 92, description: 'Aspek kompetensi vokasi' },
      { key: 'disciplineScore', label: 'Nilai Disiplin (0-100)', required: false, type: 'number', example: 95, description: 'Aspek kehadiran & soft skills' },
      { key: 'safetyScore', label: 'Nilai K3LH (0-100)', required: false, type: 'number', example: 90, description: 'Keselamatan & Kesehatan Kerja' },
      { key: 'initiativeScore', label: 'Nilai Inisiatif (0-100)', required: false, type: 'number', example: 88, description: 'Inisiatif pemecahan masalah' },
      { key: 'reportScore', label: 'Nilai Laporan (0-100)', required: false, type: 'number', example: 90, description: 'Laporan akhir magang' },
      { key: 'industryFeedback', label: 'Catatan / Rekomendasi Industri', required: false, type: 'string', example: 'Sangat proaktif dan direkomendasikan langsung untuk rekrutmen kerja.', description: 'Feedback dari industri' },
    ],
    sampleRows: [
      {
        studentNisn: '0081234567',
        studentName: 'Muhammad Rizky Pratama',
        major: 'RPL',
        studentClass: 'XI RPL 1',
        companyName: 'PT Telkom Indonesia (Persero) Tbk',
        companyAddress: 'Jl. Gatot Subroto Kav. 52, Jakarta',
        industryMentor: 'Ir. Hendra Gunawan, M.Kom',
        schoolSupervisor: 'Budi Santoso, S.Kom',
        startDate: '2026-01-05',
        endDate: '2026-06-30',
        status: 'BERJALAN',
        technicalScore: 92,
        disciplineScore: 95,
        safetyScore: 90,
        initiativeScore: 88,
        reportScore: 90,
        industryFeedback: 'Peserta memiliki kemampuan pemrograman yang matang dan etos kerja prima.',
      },
    ],
  },

  partners: {
    type: 'partners',
    title: 'Template Data Mitra Industri (DUDI / Hubin)',
    description: 'Format data jejaring kerja sama industri, nomor MoU, kontak person, kuota magang, dan jurusan relevan.',
    columns: [
      { key: 'name', label: 'Nama Perusahaan / DUDI', required: true, type: 'string', example: 'PT Astra Honda Motor', description: 'Nama resmi mitra industri' },
      { key: 'sector', label: 'Bidang Industri / Sektor', required: true, type: 'string', example: 'Otomotif & Manufaktur', description: 'Klasifikasi industri' },
      { key: 'address', label: 'Alamat Kantor / Pabrik', required: true, type: 'string', example: 'Kawasan Industri Mitra Karawang', description: 'Alamat lengkap' },
      { key: 'city', label: 'Kota / Kabupaten', required: true, type: 'string', example: 'Karawang', description: 'Lokasi industri' },
      { key: 'mouNumber', label: 'Nomor Perjanjian (MoU)', required: false, type: 'string', example: '045/MOU-SMK/2024', description: 'Nomor naskah kerja sama' },
      { key: 'mouValidUntil', label: 'Masa Berlaku MoU', required: false, type: 'date', example: '2027-12-31', description: 'Format YYYY-MM-DD' },
      { key: 'contactPerson', label: 'Nama PIC Industri', required: true, type: 'string', example: 'Bayu Wicaksono, S.T.', description: 'Nama perwakilan industri' },
      { key: 'contactPhone', label: 'No. Telepon / WhatsApp PIC', required: false, type: 'string', example: '081122334455', description: 'Kontak PIC' },
      { key: 'contactEmail', label: 'Email PIC / HRD', required: false, type: 'string', example: 'hrd.internship@astra.co.id', description: 'Email resmi' },
      { key: 'quotaPerYear', label: 'Kuota Siswa Magang / Tahun', required: false, type: 'number', example: 15, description: 'Jumlah alokasi peserta didik' },
      { key: 'suitableMajors', label: 'Jurusan Relevan (Pisahkan Koma)', required: true, type: 'string', example: 'TKRO, RPL', description: 'Kode jurusan yang diterima' },
      { key: 'rating', label: 'Rating Kemitraan (1-5)', required: false, type: 'number', example: 5, description: 'Indeks kepuasan kemitraan' },
    ],
    sampleRows: [
      {
        name: 'PT Astra Honda Motor',
        sector: 'Otomotif & Manufaktur Presisi',
        address: 'Kawasan Industri Cikarang Barat',
        city: 'Bekasi',
        mouNumber: '088/MOU-SMKN1/2024',
        mouValidUntil: '2027-12-31',
        contactPerson: 'Bayu Wicaksono, S.T.',
        contactPhone: '081122334455',
        contactEmail: 'bayu.hrd@ahm.co.id',
        quotaPerYear: 20,
        suitableMajors: 'TKRO',
        rating: 5,
      },
      {
        name: 'PT Google Cloud Indonesia Partner Network',
        sector: 'Teknologi Informasi & Cloud Computing',
        address: 'Pacific Century Place Lt. 18, SCBD',
        city: 'Jakarta Selatan',
        mouNumber: '112/MOU-SMKN1/2025',
        mouValidUntil: '2028-06-30',
        contactPerson: 'Clara Santoso, M.Sc.',
        contactPhone: '081299887766',
        contactEmail: 'clara@cloudpartner.id',
        quotaPerYear: 12,
        suitableMajors: 'RPL, TKJ',
        rating: 5,
      },
    ],
  },

  tracer: {
    type: 'tracer',
    title: 'Template Penelusuran Alumni (Tracer Study BMW)',
    description: 'Format penelusuran lulusan Bekerja, Melanjutkan studi, Wirausaha, dan relevansi kurikulum vokasi.',
    columns: [
      { key: 'nisn', label: 'NISN Alumni', required: true, type: 'string', example: '0071234567', description: 'NISN saat bersekolah' },
      { key: 'studentName', label: 'Nama Lengkap Alumni', required: true, type: 'string', example: 'Dimas Anggara', description: 'Nama lulusan' },
      { key: 'major', label: 'Jurusan', required: true, type: 'enum', example: 'RPL', allowedValues: ['RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'], description: 'Keahlian' },
      { key: 'graduationYear', label: 'Tahun Kelulusan', required: true, type: 'number', example: 2024, description: 'Tahun lulus (e.g. 2024)' },
      { key: 'statusBMW', label: 'Status BMW', required: true, type: 'enum', example: 'BEKERJA', allowedValues: ['BEKERJA', 'MELANJUTKAN', 'WIRAUSAHA', 'MENCARI_KERJA'], description: 'Bekerja, Melanjutkan, atau Wirausaha' },
      { key: 'institutionOrCompanyName', label: 'Nama Perusahaan / Universitas / Usaha', required: true, type: 'string', example: 'PT Bank Central Asia Tbk', description: 'Nama institusi terkini' },
      { key: 'positionOrFieldOrMajor', label: 'Jabatan / Program Studi / Bidang Usaha', required: true, type: 'string', example: 'Junior Software Engineer', description: 'Posisi atau prodi' },
      { key: 'monthlyIncome', label: 'Kisaran Pendapatan Bulanan', required: false, type: 'enum', example: '4 - 7 Juta', allowedValues: ['< 2 Juta', '2 - 4 Juta', '4 - 7 Juta', '> 7 Juta', 'Belum Ada Penghasilan'], description: 'Rentang gaji/omset' },
      { key: 'waitingPeriodMonths', label: 'Masa Tunggu Mendapat Pekerjaan', required: false, type: 'enum', example: '1-3 Bulan', allowedValues: ['0-1 Bulan', '1-3 Bulan', '3-6 Bulan', '> 6 Bulan'], description: 'Waktu tunggu setelah lulus' },
      { key: 'curriculumRelevance', label: 'Kesesuaian Kurikulum SMK', required: false, type: 'enum', example: 'SANGAT_SELARAS', allowedValues: ['SANGAT_SELARAS', 'SELARAS', 'KURANG_SELARAS', 'TIDAK_SELARAS'], description: 'Relevansi keahlian' },
      { key: 'phone', label: 'No. HP / WhatsApp Alumni', required: false, type: 'string', example: '081345678901', description: 'Nomor kontak aktif' },
      { key: 'email', label: 'Email Alumni', required: false, type: 'string', example: 'dimas.alumni@gmail.com', description: 'Email korespondensi' },
      { key: 'feedbackToSmk', label: 'Saran & Masukan untuk SMK', required: false, type: 'string', example: 'Tingkatkan materi cloud computing dan speaking English.', description: 'Evaluasi kurikulum' },
    ],
    sampleRows: [
      {
        nisn: '0071234567',
        studentName: 'Dimas Anggara',
        major: 'RPL',
        graduationYear: 2024,
        statusBMW: 'BEKERJA',
        institutionOrCompanyName: 'PT Bank Central Asia Tbk',
        positionOrFieldOrMajor: 'Junior Application Developer',
        monthlyIncome: '4 - 7 Juta',
        waitingPeriodMonths: '1-3 Bulan',
        curriculumRelevance: 'SANGAT_SELARAS',
        phone: '081345678901',
        email: 'dimas.alumni@gmail.com',
        feedbackToSmk: 'Pembelajaran React dan Database di SMK sangat sesuai dengan standar industri perbankan.',
      },
    ],
  },
};

/**
 * Generates CSV content with UTF-8 BOM so Microsoft Excel in Windows/Mac correctly parses Indonesian characters.
 */
export function generateCsvContent(type: ImportDataType, includeSamples = true): string {
  const def = TEMPLATE_DEFINITIONS[type];
  if (!def) return '';

  const headers = def.columns.map((col) => col.key);
  const headerLine = headers.join(';');

  const rows: string[] = [headerLine];

  if (includeSamples && def.sampleRows.length > 0) {
    def.sampleRows.forEach((row) => {
      const line = headers.map((key) => {
        const val = row[key] !== undefined ? String(row[key]) : '';
        // Escape quotes and semicolons
        if (val.includes(';') || val.includes('"') || val.includes('\n')) {
          return `"${val.replace(/"/g, '""')}"`;
        }
        return val;
      });
      rows.push(line.join(';'));
    });
  }

  // UTF-8 BOM \uFEFF for Excel compatibility
  return '\uFEFF' + rows.join('\r\n');
}

/**
 * Triggers instant browser download of the CSV template
 */
export function downloadCsvTemplate(type: ImportDataType): void {
  const def = TEMPLATE_DEFINITIONS[type];
  const csvContent = generateCsvContent(type, true);
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `Template_${def.type.toUpperCase()}_SIAKAD_SMK.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Robust CSV/TSV Parser capable of detecting comma, semicolon, tab, and quotes.
 */
export function parseDelimitedText(rawText: string): Record<string, string>[] {
  // Strip BOM if present
  let cleanText = rawText.replace(/^\uFEFF/, '').trim();
  if (!cleanText) return [];

  const lines = cleanText.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return [];

  const firstLine = lines[0];
  // Determine delimiter: semicolon is favored in Indonesian locale, tab for Excel paste, or comma
  let delimiter = ';';
  const tabCount = (firstLine.match(/\t/g) || []).length;
  const semiCount = (firstLine.match(/;/g) || []).length;
  const commaCount = (firstLine.match(/,/g) || []).length;

  if (tabCount > semiCount && tabCount > commaCount) {
    delimiter = '\t';
  } else if (semiCount >= commaCount) {
    delimiter = ';';
  } else {
    delimiter = ',';
  }

  const parseRow = (line: string): string[] => {
    const result: string[] = [];
    let current = '';
    let insideQuotes = false;

    for (let i = 0; i < line.length; i++) {
      const char = line[i];
      if (char === '"') {
        if (insideQuotes && line[i + 1] === '"') {
          current += '"';
          i++;
        } else {
          insideQuotes = !insideQuotes;
        }
      } else if (char === delimiter && !insideQuotes) {
        result.push(current.trim());
        current = '';
      } else {
        current += char;
      }
    }
    result.push(current.trim());
    return result;
  };

  const rawHeaders = parseRow(lines[0]);
  const headers = rawHeaders.map((h) =>
    h.toLowerCase().replace(/[^a-z0-9]/g, '')
  );

  const results: Record<string, string>[] = [];

  for (let idx = 1; idx < lines.length; idx++) {
    const cols = parseRow(lines[idx]);
    if (cols.length === 0 || cols.every((c) => c === '')) continue;

    const rowObj: Record<string, string> = {};
    headers.forEach((hdr, colIdx) => {
      rowObj[hdr] = cols[colIdx] !== undefined ? cols[colIdx] : '';
    });
    // Also save raw original row
    rowObj._rawIndex = String(idx + 1);
    results.push(rowObj);
  }

  return results;
}

export interface ValidationIssue {
  rowNumber: number;
  field: string;
  message: string;
  severity: 'error' | 'warning';
}

export interface ValidationResult<T> {
  success: boolean;
  validRows: T[];
  issues: ValidationIssue[];
  totalParsed: number;
  validCount: number;
  invalidCount: number;
}

// -------------------------------------------------------------
// Type Validators
// -------------------------------------------------------------

export function validateStudentsImport(
  rawRows: Record<string, string>[],
  school?: SchoolProfile
): ValidationResult<Student> {
  const issues: ValidationIssue[] = [];
  const validRows: Student[] = [];

  rawRows.forEach((row, i) => {
    const rowNum = Number(row._rawIndex || i + 2);

    // Header alias matching
    const nisn = row.nisn || row.nomorinduk || row.nis || '';
    const nik = row.nik || '';
    const name = row.name || row.namalengkap || row.nama || '';
    const genderRaw = (row.gender || row.jeniskelamin || row.jk || 'L').toUpperCase();
    const gender: 'L' | 'P' = genderRaw.startsWith('P') || genderRaw.startsWith('W') ? 'P' : 'L';
    const classLevelRaw = (row.classlevel || row.tingkat || row.kelas || 'X').toUpperCase();
    const classLevel = (['PPDB', 'X', 'XI', 'XII', 'XIII', 'ALUMNI'].includes(classLevelRaw)
      ? classLevelRaw
      : 'X') as any;
    const majorRaw = (row.major || row.jurusan || row.kodejurusan || 'RPL').toUpperCase();
    const major = (['RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'].includes(majorRaw)
      ? majorRaw
      : 'RPL') as MajorCode;
    const className = row.classname || row.rombel || row.namakelas || `${classLevel} ${major} 1`;
    const statusRaw = (row.status || row.statussiswa || 'AKTIF').toUpperCase();
    const status = (['CALON', 'AKTIF', 'CUTI', 'LULUS', 'MUTASI_KELUAR', 'DROP_OUT'].includes(statusRaw)
      ? statusRaw
      : 'AKTIF') as any;

    if (!name.trim()) {
      issues.push({
        rowNumber: rowNum,
        field: 'name',
        message: 'Nama lengkap siswa wajib diisi.',
        severity: 'error',
      });
      return;
    }

    if (!nisn.trim()) {
      issues.push({
        rowNumber: rowNum,
        field: 'nisn',
        message: 'NISN belum diisi, nomor otomatis sementara akan dibuat.',
        severity: 'warning',
      });
    }

    const finalNisn = nisn.trim() || `00${Math.floor(10000000 + Math.random() * 90000000)}`;
    const studentId = `stu-imp-${Date.now()}-${i}`;

    const student: Student = {
      id: studentId,
      nisn: finalNisn,
      nik: nik.trim() || '3171012345670001',
      name: name.trim(),
      gender,
      birthPlace: row.birthplace || row.tempatlahir || 'Jakarta',
      birthDate: row.birthdate || row.tanggallahir || '2008-01-01',
      classLevel,
      major,
      className,
      status,
      academicYear: row.academicyear || row.tahunajaran || school?.academicYear || '2025/2026',
      email: row.email || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@smk.sch.id`,
      phone: row.phone || row.nohp || row.telepon || '081234567890',
      parentName: row.parentname || row.namaorangtua || row.wali || 'Wali Murid',
      parentPhone: row.parentphone || row.nohporangtua || row.nohpwali || '081298765432',
      address: row.address || row.alamat || 'Alamat Siswa',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      admissionDate: '2025-07-15',
      sppStatus: (row.sppstatus || row.statusspp || 'LUNAS').toUpperCase() as any,
      attendance: { hadir: 90, sakit: 0, izin: 0, alpa: 0 },
    };

    validRows.push(student);
  });

  return {
    success: validRows.length > 0,
    validRows,
    issues,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: rawRows.length - validRows.length,
  };
}

export function validateGradesImport(
  rawRows: Record<string, string>[],
  existingStudents: Student[],
  school?: SchoolProfile
): ValidationResult<GradeRecord> {
  const issues: ValidationIssue[] = [];
  const validRows: GradeRecord[] = [];

  rawRows.forEach((row, i) => {
    const rowNum = Number(row._rawIndex || i + 2);
    const nisn = (row.nisn || row.nomorinduk || '').trim();
    const studentName = (row.studentname || row.namasiswa || '').trim();
    const subjectName = (row.subjectname || row.namamatapelajaran || row.mapel || '').trim();
    const subjectCode = (row.subjectcode || row.kodemapel || subjectName.substring(0, 3).toUpperCase()).trim();

    // Match student
    let matchedStudent = existingStudents.find((s) => s.nisn === nisn);
    if (!matchedStudent && studentName) {
      matchedStudent = existingStudents.find(
        (s) => s.name.toLowerCase() === studentName.toLowerCase()
      );
    }

    if (!matchedStudent && !nisn) {
      issues.push({
        rowNumber: rowNum,
        field: 'nisn',
        message: 'NISN siswa atau Nama Siswa wajib diisi untuk mengaitkan nilai.',
        severity: 'error',
      });
      return;
    }

    if (!subjectName) {
      issues.push({
        rowNumber: rowNum,
        field: 'subjectName',
        message: 'Nama mata pelajaran wajib diisi.',
        severity: 'error',
      });
      return;
    }

    const formative = Math.min(100, Math.max(0, Number(row.formativescore || row.nilaiformatif || 80)));
    const sumativeMat = Math.min(100, Math.max(0, Number(row.sumativematerialscore || row.sumatifmateri || row.sts || 80)));
    const sumativeFinal = Math.min(100, Math.max(0, Number(row.sumativefinalscore || row.sumatifakhir || row.sas || 80)));
    const finalScore = Math.round(formative * 0.3 + sumativeMat * 0.35 + sumativeFinal * 0.35);

    let letterGrade: 'A' | 'B' | 'C' | 'D' = 'B';
    if (finalScore >= 88) letterGrade = 'A';
    else if (finalScore >= 75) letterGrade = 'B';
    else if (finalScore >= 60) letterGrade = 'C';
    else letterGrade = 'D';

    const categoryRaw = (row.category || row.kategorimapel || 'KONSENTRASI_KEAHLIAN').toUpperCase();
    const category = (['UMUM', 'KEJURUAN_DASAR', 'KONSENTRASI_KEAHLIAN', 'PROJEK_P5', 'PKL', 'MUATAN_LOKAL'].includes(categoryRaw)
      ? categoryRaw
      : 'KONSENTRASI_KEAHLIAN') as any;

    const studentId = matchedStudent ? matchedStudent.id : `stu-ref-${nisn || Date.now()}`;

    const grade: GradeRecord = {
      id: `grd-imp-${Date.now()}-${i}`,
      studentId,
      semester: Number(row.semester || 1),
      academicYear: row.academicyear || row.tahunajaran || school?.academicYear || '2025/2026',
      subjectCode: subjectCode || 'MAPEL-01',
      subjectName,
      category,
      kkm: Number(row.kkm || 75),
      formativeScore: formative,
      sumativeMaterialScore: sumativeMat,
      sumativeFinalScore: sumativeFinal,
      finalScore,
      letterGrade,
      competencyAchievement:
        row.competencyachievement ||
        row.capaiankompetensi ||
        `Menunjukkan pemahaman yang memuaskan dalam materi ${subjectName}.`,
    };

    validRows.push(grade);
  });

  return {
    success: validRows.length > 0,
    validRows,
    issues,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: rawRows.length - validRows.length,
  };
}

export function validateBKImport(
  rawRows: Record<string, string>[],
  existingStudents: Student[]
): ValidationResult<BKRecord> {
  const issues: ValidationIssue[] = [];
  const validRows: BKRecord[] = [];

  rawRows.forEach((row, i) => {
    const rowNum = Number(row._rawIndex || i + 2);
    const nisn = (row.nisn || '').trim();
    const studentName = (row.studentname || row.namasiswa || '').trim();
    const title = (row.title || row.judulkasus || row.prestasi || '').trim();

    let matched = existingStudents.find((s) => s.nisn === nisn);
    if (!matched && studentName) {
      matched = existingStudents.find((s) => s.name.toLowerCase() === studentName.toLowerCase());
    }

    if (!title) {
      issues.push({
        rowNumber: rowNum,
        field: 'title',
        message: 'Judul catatan / kasus bimbingan konseling wajib diisi.',
        severity: 'error',
      });
      return;
    }

    const isReward =
      String(row.isreward || row.apakahreward || '').toUpperCase() === 'TRUE' ||
      String(row.category || '').toUpperCase().includes('PRESTASI');

    const bk: BKRecord = {
      id: `bk-imp-${Date.now()}-${i}`,
      studentId: matched ? matched.id : `stu-ref-${nisn || i}`,
      studentName: matched ? matched.name : (studentName || 'Siswa'),
      studentClass: matched ? matched.className : (row.studentclass || row.kelas || 'X'),
      date: row.date || row.tanggal || new Date().toISOString().split('T')[0],
      category: (isReward ? 'PRESTASI' : (row.category || 'PELANGGARAN').toUpperCase()) as any,
      severity: (row.severity || (isReward ? 'PRESTASI' : 'RINGAN')).toUpperCase() as any,
      title,
      description: row.description || row.kronologi || row.uraian || title,
      points: Math.abs(Number(row.points || row.poin || (isReward ? 25 : 10))),
      isReward,
      followUpAction: row.followupaction || row.tindaklanjut || 'Tindak lanjut bimbingan terdata.',
      status: (row.status || 'SELESAI').toUpperCase() as any,
      counselorName: row.counselorname || row.gurubk || 'Guru BK SMKN',
      parentNotified: String(row.parentnotified || '').toUpperCase() === 'TRUE',
      notes: row.notes || '',
    };

    validRows.push(bk);
  });

  return {
    success: validRows.length > 0,
    validRows,
    issues,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: rawRows.length - validRows.length,
  };
}

export function validatePKLImport(
  rawRows: Record<string, string>[],
  existingStudents: Student[]
): ValidationResult<PKLPlacement> {
  const issues: ValidationIssue[] = [];
  const validRows: PKLPlacement[] = [];

  rawRows.forEach((row, i) => {
    const rowNum = Number(row._rawIndex || i + 2);
    const nisn = (row.studentnisn || row.nisn || '').trim();
    const studentName = (row.studentname || row.namasiswa || '').trim();
    const companyName = (row.companyname || row.namaindustri || row.dudi || '').trim();

    let matched = existingStudents.find((s) => s.nisn === nisn);
    if (!matched && studentName) {
      matched = existingStudents.find((s) => s.name.toLowerCase() === studentName.toLowerCase());
    }

    if (!companyName) {
      issues.push({
        rowNumber: rowNum,
        field: 'companyName',
        message: 'Nama perusahaan mitra industri (DU/DI) wajib diisi.',
        severity: 'error',
      });
      return;
    }

    const techScore = Number(row.technicalscore || row.nilaiteknis || 88);
    const discScore = Number(row.disciplinescore || row.nilaidisiplin || 90);
    const repScore = Number(row.reportscore || row.nilailaporan || 85);
    const finalScore = Math.round(techScore * 0.4 + discScore * 0.3 + repScore * 0.3);

    const placement: PKLPlacement = {
      id: `pkl-imp-${Date.now()}-${i}`,
      studentId: matched ? matched.id : `stu-ref-${nisn || i}`,
      studentName: matched ? matched.name : (studentName || 'Peserta Magang'),
      studentNisn: matched ? matched.nisn : nisn,
      major: (matched ? matched.major : (row.major || 'RPL').toUpperCase()) as MajorCode,
      studentClass: matched ? matched.className : (row.studentclass || 'XI RPL 1'),
      companyId: `comp-${Date.now()}-${i}`,
      companyName,
      companyAddress: row.companyaddress || row.alamatindustri || 'Kawasan Industri',
      industryMentor: row.industrymentor || row.mentorindustri || 'Pembimbing Industri',
      schoolSupervisor: row.schoolsupervisor || row.gurupembimbing || 'Pembimbing Sekolah',
      startDate: row.startdate || row.tanggalmulai || '2026-01-05',
      endDate: row.enddate || row.tanggalselesai || '2026-06-30',
      status: (row.status || 'BERJALAN').toUpperCase() as any,
      technicalScore: techScore,
      disciplineScore: discScore,
      safetyScore: Number(row.safetyscore || 90),
      initiativeScore: Number(row.initiativescore || 85),
      reportScore: repScore,
      finalScore,
      predicate: finalScore >= 90 ? 'SANGAT_BAIK' : finalScore >= 75 ? 'BAIK' : 'CUKUP',
      industryFeedback: row.industryfeedback || row.catatanindustri || 'Peserta melaksanakan magang dengan baik.',
      certificateIssued: true,
      totalJournals: 12,
    };

    validRows.push(placement);
  });

  return {
    success: validRows.length > 0,
    validRows,
    issues,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: rawRows.length - validRows.length,
  };
}

export function validatePartnersImport(
  rawRows: Record<string, string>[]
): ValidationResult<IndustryPartner> {
  const issues: ValidationIssue[] = [];
  const validRows: IndustryPartner[] = [];

  rawRows.forEach((row, i) => {
    const rowNum = Number(row._rawIndex || i + 2);
    const name = (row.name || row.namaperusahaan || row.dudi || '').trim();

    if (!name) {
      issues.push({
        rowNumber: rowNum,
        field: 'name',
        message: 'Nama perusahaan mitra wajib diisi.',
        severity: 'error',
      });
      return;
    }

    const majorsRaw = (row.suitablemajors || row.jurusan || 'RPL,TKJ').toUpperCase();
    const suitableMajors = majorsRaw.split(/[,;\s]+/).filter((m) =>
      ['RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'].includes(m)
    ) as MajorCode[];

    const partner: IndustryPartner = {
      id: `ptn-imp-${Date.now()}-${i}`,
      name,
      sector: row.sector || row.bidang || 'Teknologi & Vokasi',
      address: row.address || row.alamat || 'Alamat Industri',
      city: row.city || row.kota || 'Jakarta',
      mouNumber: row.mounumber || row.nomormou || `MOU-${Date.now()}`,
      mouValidUntil: row.mouvaliduntil || row.masaberlaku || '2027-12-31',
      contactPerson: row.contactperson || row.pic || 'Koordinator HRD',
      contactPhone: row.contactphone || row.telepon || '08123456789',
      contactEmail: row.contactemail || row.email || 'partner@dudi.co.id',
      quotaPerYear: Number(row.quotaperyear || row.kuota || 10),
      activeInternsCount: 0,
      suitableMajors: suitableMajors.length > 0 ? suitableMajors : ['RPL'],
      rating: Number(row.rating || 5),
    };

    validRows.push(partner);
  });

  return {
    success: validRows.length > 0,
    validRows,
    issues,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: rawRows.length - validRows.length,
  };
}

export function validateTracerImport(
  rawRows: Record<string, string>[],
  existingStudents: Student[]
): ValidationResult<TracerStudyRecord> {
  const issues: ValidationIssue[] = [];
  const validRows: TracerStudyRecord[] = [];

  rawRows.forEach((row, i) => {
    const rowNum = Number(row._rawIndex || i + 2);
    const nisn = (row.nisn || '').trim();
    const studentName = (row.studentname || row.namaalumni || row.nama || '').trim();

    let matched = existingStudents.find((s) => s.nisn === nisn);
    if (!matched && studentName) {
      matched = existingStudents.find((s) => s.name.toLowerCase() === studentName.toLowerCase());
    }

    if (!studentName && !matched) {
      issues.push({
        rowNumber: rowNum,
        field: 'studentName',
        message: 'Nama lengkap alumni wajib diisi.',
        severity: 'error',
      });
      return;
    }

    const tracer: TracerStudyRecord = {
      id: `trc-imp-${Date.now()}-${i}`,
      studentId: matched ? matched.id : `stu-ref-${nisn || i}`,
      studentName: matched ? matched.name : studentName,
      nisn: matched ? matched.nisn : nisn,
      major: (matched ? matched.major : (row.major || 'RPL').toUpperCase()) as MajorCode,
      graduationYear: Number(row.graduationyear || row.tahunkelulusan || 2024),
      statusBMW: (row.statusbmw || row.status || 'BEKERJA').toUpperCase() as any,
      institutionOrCompanyName: row.institutionorcompanyname || row.namaperusahaan || row.universitas || 'Institusi',
      positionOrFieldOrMajor: row.positionorfieldormajor || row.jabatan || row.prodi || 'Staf Vokasi',
      monthlyIncome: (row.monthlyincome || row.penghasilan || '2 - 4 Juta') as any,
      waitingPeriodMonths: (row.waitingperiodmonths || row.masatunggu || '1-3 Bulan') as any,
      curriculumRelevance: (row.curriculumrelevance || row.relevansi || 'SANGAT_SELARAS') as any,
      feedbackToSmk: row.feedbacktosmk || row.saran || 'Pembelajaran vokasi sangat bermanfaat.',
      phone: row.phone || row.nohp || '081234567890',
      email: row.email || 'alumni@gmail.com',
      submittedAt: new Date().toISOString().split('T')[0],
    };

    validRows.push(tracer);
  });

  return {
    success: validRows.length > 0,
    validRows,
    issues,
    totalParsed: rawRows.length,
    validCount: validRows.length,
    invalidCount: rawRows.length - validRows.length,
  };
}
