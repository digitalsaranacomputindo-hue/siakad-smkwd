import { getCachedAccessToken } from '../firebase/config.ts';
import type {
  BKRecord,
  GradeRecord,
  PKLPlacement,
  ReportCardConfig,
  SchoolProfile,
  Student,
  TracerStudyRecord,
} from '../types/academic.ts';

export interface ExportResult {
  success: boolean;
  spreadsheetId?: string;
  spreadsheetUrl?: string;
  title?: string;
  message: string;
}

/**
 * Creates a formatted Google Spreadsheet using Google Sheets API v4
 */
export async function createGoogleSpreadsheet(
  title: string,
  sheets: { title: string; rows: (string | number)[][] }[]
): Promise<ExportResult> {
  const token = getCachedAccessToken();
  if (!token) {
    return {
      success: false,
      message: 'Belum masuk dengan akun Google. Silakan klik tombol "Masuk dengan Google" terlebih dahulu.',
    };
  }

  try {
    // 1. Create Spreadsheet with sheets
    const createRes = await fetch('https://sheets.googleapis.com/v4/spreadsheets', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        properties: {
          title,
        },
        sheets: sheets.map((s) => ({
          properties: {
            title: s.title,
            gridProperties: {
              frozenRowCount: 1,
            },
          },
        })),
      }),
    });

    if (!createRes.ok) {
      const errData = await createRes.json();
      throw new Error(errData?.error?.message || `Gagal membuat Google Spreadsheet (Status ${createRes.status})`);
    }

    const createdSheet = await createRes.json();
    const spreadsheetId = createdSheet.spreadsheetId;

    // 2. Populate data into each sheet using batchUpdate values
    const dataPayload = sheets.map((s) => ({
      range: `'${s.title}'!A1`,
      values: s.rows,
    }));

    const updateRes = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values:batchUpdate`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          valueInputOption: 'USER_ENTERED',
          data: dataPayload,
        }),
      }
    );

    if (!updateRes.ok) {
      const errData = await updateRes.json();
      console.warn('Batch update values warning:', errData);
    }

    const spreadsheetUrl = `https://docs.google.com/spreadsheets/d/${spreadsheetId}/edit`;

    return {
      success: true,
      spreadsheetId,
      spreadsheetUrl,
      title,
      message: `Spreadsheet berhasil dibuat! Terbuka di Google Sheets.`,
    };
  } catch (error) {
    console.error('Export to Google Sheets error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kesalahan saat mengekspor ke Google Sheets.',
    };
  }
}

/**
 * Export Master Data Siswa & Lifecycle to Google Sheets
 */
export async function exportStudentsToGoogleSheets(
  students: Student[],
  school: SchoolProfile
): Promise<ExportResult> {
  const header = [
    'No',
    'ID Siswa',
    'NISN',
    'NIK',
    'Nama Lengkap',
    'L/P',
    'Tingkat',
    'Jurusan',
    'Kelas',
    'Status Lifecycle',
    'Tempat Lahir',
    'Tanggal Lahir',
    'Status SPP',
    'No. HP Siswa',
    'Nama Wali / Orang Tua',
    'No. HP Wali',
    'Alamat Lengkap',
    'Tahun Ajaran',
  ];

  const rows: (string | number)[][] = [header];
  students.forEach((s, idx) => {
    rows.push([
      idx + 1,
      s.id,
      s.nisn,
      s.nik || '-',
      s.name,
      s.gender,
      s.classLevel,
      s.major,
      s.className,
      s.status,
      s.birthPlace || '-',
      s.birthDate || '-',
      s.sppStatus,
      s.phone || '-',
      s.parentName || '-',
      s.parentPhone || '-',
      s.address || '-',
      s.academicYear,
    ]);
  });

  const now = new Date().toLocaleDateString('id-ID');
  const title = `[SIAKAD] Master Data Siswa & Lifecycle - ${school.shortName || school.name} (${now})`;

  return createGoogleSpreadsheet(title, [
    {
      title: 'Data Siswa Aktif & Calon',
      rows,
    },
  ]);
}

/**
 * Export All Modules to One Comprehensive Google Workbook
 */
export async function exportComprehensiveWorkbookToGoogleSheets(params: {
  school: SchoolProfile;
  students: Student[];
  grades: GradeRecord[];
  bkRecords: BKRecord[];
  pklPlacements: PKLPlacement[];
  tracers: TracerStudyRecord[];
}): Promise<ExportResult> {
  const { school, students, grades, bkRecords, pklPlacements, tracers } = params;

  // Sheet 1: Siswa
  const studentRows: (string | number)[][] = [
    ['No', 'NISN', 'Nama Siswa', 'Tingkat', 'Jurusan', 'Kelas', 'Status Lifecycle', 'SPP', 'No. HP', 'Wali'],
    ...students.map((s, i) => [
      i + 1,
      s.nisn,
      s.name,
      s.classLevel,
      s.major,
      s.className,
      s.status,
      s.sppStatus,
      s.phone || '-',
      s.parentName || '-',
    ]),
  ];

  // Sheet 2: Nilai Rapor
  const gradeRows: (string | number)[][] = [
    ['No', 'ID Siswa', 'Semester', 'Mata Pelajaran', 'Kategori', 'KKM', 'Formatif (30%)', 'Sumatif (40%)', 'SAS (30%)', 'Nilai Akhir', 'Predikat', 'Capaian Pembelajaran'],
    ...grades.map((g, i) => [
      i + 1,
      g.studentId,
      g.semester,
      g.subjectName,
      g.category,
      g.kkm,
      g.formativeScore,
      g.sumativeMaterialScore,
      g.sumativeFinalScore,
      g.finalScore,
      g.letterGrade,
      g.competencyAchievement || '-',
    ]),
  ];

  // Sheet 3: Catatan BK & Kedisiplinan
  const bkRows: (string | number)[][] = [
    ['No', 'Tanggal', 'Nama Siswa', 'Kelas', 'Kategori', 'Tingkat', 'Perihal / Kasus', 'Poin', 'Tindakan / Rekomendasi', 'Konselor BK', 'Status'],
    ...bkRecords.map((b, i) => [
      i + 1,
      b.date,
      b.studentName,
      b.studentClass,
      b.category,
      b.severity,
      b.title,
      b.points,
      b.followUpAction,
      b.counselorName,
      b.status,
    ]),
  ];

  // Sheet 4: PKL DU/DI
  const pklRows: (string | number)[][] = [
    ['No', 'Nama Siswa', 'Jurusan', 'Perusahaan Mitra DU/DI', 'Alamat DU/DI', 'Mentor Industri', 'Guru Pembimbing', 'Status PKL', 'Nilai Teknis', 'Nilai Kedisiplinan', 'Nilai Laporan', 'Nilai Akhir', 'Predikat'],
    ...pklPlacements.map((p, i) => [
      i + 1,
      p.studentName,
      p.major,
      p.companyName,
      p.companyAddress,
      p.industryMentor,
      p.schoolSupervisor,
      p.status,
      p.technicalScore,
      p.disciplineScore,
      p.reportScore,
      p.finalScore,
      p.predicate,
    ]),
  ];

  // Sheet 5: Tracer Study BMW
  const tracerRows: (string | number)[][] = [
    ['No', 'Nama Alumni', 'Jurusan', 'Tahun Lulus', 'Status BMW', 'Tempat Kerja / Kampus / Usaha', 'Posisi / Prodi', 'Rentang Gaji', 'Masa Tunggu', 'Keselarasan Vokasi', 'Saran untuk SMK'],
    ...tracers.map((t, i) => [
      i + 1,
      t.studentName,
      t.major,
      t.graduationYear,
      t.statusBMW,
      t.institutionOrCompanyName,
      t.positionOrFieldOrMajor,
      t.monthlyIncome,
      t.waitingPeriodMonths,
      t.curriculumRelevance,
      t.feedbackToSmk || '-',
    ]),
  ];

  const dateStr = new Date().toISOString().split('T')[0];
  const title = `[SIAKAD SMK] Rekapitulasi Lengkap Akademik & Vokasi - ${school.shortName || school.name} (${dateStr})`;

  return createGoogleSpreadsheet(title, [
    { title: 'Data Siswa & Lifecycle', rows: studentRows },
    { title: 'Nilai Rapor & Asesmen', rows: gradeRows },
    { title: 'Catatan BK & Kedisiplinan', rows: bkRows },
    { title: 'PKL Industri DU-DI', rows: pklRows },
    { title: 'Tracer Study BMW', rows: tracerRows },
  ]);
}

/**
 * Import students data from a given Google Spreadsheet
 */
export async function importStudentsFromGoogleSheet(
  spreadsheetId: string,
  sheetRange: string = 'A2:R100'
): Promise<{ success: boolean; data?: Partial<Student>[]; message: string }> {
  const token = getCachedAccessToken();
  if (!token) {
    return {
      success: false,
      message: 'Silakan masuk dengan akun Google terlebih dahulu.',
    };
  }

  try {
    const res = await fetch(
      `https://sheets.googleapis.com/v4/spreadsheets/${spreadsheetId}/values/${encodeURIComponent(sheetRange)}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (!res.ok) {
      const err = await res.json();
      throw new Error(err?.error?.message || `Gagal membaca Google Sheet (Status ${res.status})`);
    }

    const result = await res.json();
    const rows: string[][] = result.values || [];

    if (rows.length === 0) {
      return {
        success: false,
        message: 'Tidak ada baris data yang ditemukan pada rentang yang dipilih.',
      };
    }

    const imported: Partial<Student>[] = rows.map((r, i) => ({
      id: r[1] || `imp-stu-${Date.now()}-${i}`,
      nisn: r[2] || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      nik: r[3] || '',
      name: r[4] || `Siswa Impor ${i + 1}`,
      gender: (r[5] === 'P' ? 'P' : 'L') as 'L' | 'P',
      classLevel: (['PPDB', 'X', 'XI', 'XII', 'XIII', 'ALUMNI'].includes(r[6]) ? r[6] : 'X') as any,
      major: (r[7] || 'RPL') as any,
      className: r[8] || 'X RPL 1',
      status: (['CALON', 'AKTIF', 'CUTI', 'LULUS', 'MUTASI_KELUAR', 'DROP_OUT'].includes(r[9])
        ? r[9]
        : 'AKTIF') as any,
      birthPlace: r[10] || 'Jakarta',
      birthDate: r[11] || '2008-01-01',
      sppStatus: (r[12] || 'LUNAS') as any,
      phone: r[13] || '',
      parentName: r[14] || '',
      parentPhone: r[15] || '',
      address: r[16] || '',
      academicYear: r[17] || '2025/2026',
      attendance: { hadir: 90, sakit: 0, izin: 0, alpa: 0 },
      admissionDate: '2025-07-15',
      photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      email: `${(r[4] || 'siswa').toLowerCase().replace(/\s+/g, '')}@smk.sch.id`,
    }));

    return {
      success: true,
      data: imported,
      message: `Berhasil memproses ${imported.length} data siswa dari Google Sheet.`,
    };
  } catch (error) {
    console.error('Import from Google Sheet error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Terjadi kegagalan saat membaca Google Sheet.',
    };
  }
}
