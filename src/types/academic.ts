export type StudentStatus = 
  | 'CALON'           // Pendaftar PPDB
  | 'AKTIF'           // Siswa Aktif
  | 'CUTI'            // Cuti Akademik
  | 'LULUS'           // Telah Lulus (Alumni)
  | 'MUTASI_KELUAR'   // Pindah Sekolah
  | 'DROP_OUT';

export type ClassLevel = 'PPDB' | 'X' | 'XI' | 'XII' | 'XIII' | 'ALUMNI';

export type MajorCode = 'RPL' | 'TKJ' | 'TKRO' | 'DKV' | 'AKL';

export interface SchoolProfile {
  name: string;
  shortName: string;
  npsn: string;
  nss?: string;
  status: string; // e.g. 'Negeri - SMK Pusat Keunggulan (SMK PK)'
  accreditation: string; // e.g. 'A (Unggul - Nilai 96)'
  address: string;
  village?: string;
  subdistrict?: string;
  city: string;
  province: string;
  postalCode?: string;
  phone: string;
  fax?: string;
  email: string;
  website: string;
  principal: string;
  principalNip: string;
  counselingHead: string;
  hubinHead: string;
  academicYear: string;
  semester: string;
  logoUrl: string; // Base64 data URL or external URL
  kopProvinsi?: string;
  kopDinas?: string;
}

export type BrightThemeId = 'sky-blue' | 'emerald-fresh' | 'amber-sun' | 'violet-vibrant';

export interface MajorInfo {
  code: MajorCode;
  name: string;
  department: string;
  description: string;
  headOfDepartment: string;
  iconName: string;
  totalStudents: number;
}

export interface Student {
  id: string;
  nisn: string;
  nik: string;
  name: string;
  gender: 'L' | 'P';
  birthPlace: string;
  birthDate: string;
  classLevel: ClassLevel;
  major: MajorCode;
  className: string; // e.g. "XII RPL 1"
  status: StudentStatus;
  academicYear: string; // e.g. "2025/2026"
  email: string;
  phone: string;
  parentName: string;
  parentPhone: string;
  address: string;
  photoUrl: string;
  admissionDate: string;
  graduationDate?: string;
  sppStatus: 'LUNAS' | 'MENUNGGAK_1_BULAN' | 'MENUNGGAK_2_BULAN' | 'BEASISWA';
  attendance: {
    hadir: number;
    sakit: number;
    izin: number;
    alpa: number;
  };
}

export type BKCategory = 
  | 'PELANGGARAN'
  | 'PRESTASI'
  | 'KONSELING_KARIR'
  | 'KONSELING_PRIBADI'
  | 'HOME_VISIT';

export type BKSeverity = 'RINGAN' | 'SEDANG' | 'BERAT' | 'PRESTASI';

export interface BKRecord {
  id: string;
  studentId: string;
  studentName: string;
  studentClass: string;
  date: string;
  category: BKCategory;
  severity: BKSeverity;
  title: string;
  description: string;
  points: number; // Positive for violation point (+10, +25, etc.), or reward points
  isReward: boolean;
  followUpAction: string;
  status: 'TERBUKA' | 'DALAM_PENANGANAN' | 'SELESAI';
  counselorName: string;
  parentNotified: boolean;
  notes?: string;
}

export type SubjectCategory = 
  | 'UMUM'
  | 'KEJURUAN_DASAR'
  | 'KONSENTRASI_KEAHLIAN'
  | 'PROJEK_P5'
  | 'PKL'
  | 'MUATAN_LOKAL';

export interface GradeRecord {
  id: string;
  studentId: string;
  semester: number; // 1 to 6
  academicYear: string;
  subjectCode: string;
  subjectName: string;
  category: SubjectCategory;
  kkm: number; // Kriteria Ketercapaian Tujuan Pembelajaran (KKTP)
  formativeScore: number;
  sumativeMaterialScore: number;
  sumativeFinalScore: number;
  finalScore: number;
  letterGrade: 'A' | 'B' | 'C' | 'D';
  competencyAchievement: string;
}

export interface UKKRecord {
  id: string;
  studentId: string;
  academicYear: string;
  schemeTitle: string; // e.g., "Junior Web Developer - LSP P1 SMK"
  theoryScore: number;
  practicalScore: number;
  portfolioScore: number;
  finalScore: number;
  predicate: 'SANGAT_KOMPETEN' | 'KOMPETEN' | 'BELUM_KOMPETEN';
  internalAssessor: string;
  externalAssessor: string; // From Industry
  assessorCompany: string;
  certificateNo?: string;
  testDate: string;
  status: 'LULUS' | 'REMEDIAL' | 'BELUM_TES';
}

export interface IndustryPartner {
  id: string;
  name: string;
  sector: string;
  address: string;
  city: string;
  mouNumber: string;
  mouValidUntil: string;
  contactPerson: string;
  contactPhone: string;
  contactEmail: string;
  quotaPerYear: number;
  activeInternsCount: number;
  suitableMajors: MajorCode[];
  rating: number; // 1-5
}

export interface PKLPlacement {
  id: string;
  studentId: string;
  studentName: string;
  studentNisn: string;
  major: MajorCode;
  studentClass: string;
  companyId: string;
  companyName: string;
  companyAddress: string;
  industryMentor: string;
  schoolSupervisor: string;
  startDate: string;
  endDate: string;
  status: 'PENGAJUAN' | 'BERJALAN' | 'SELESAI' | 'BATAL';
  // Evaluation Scores (Scale 0-100)
  technicalScore: number;
  disciplineScore: number;
  safetyScore: number; // K3LH
  initiativeScore: number;
  reportScore: number;
  finalScore: number;
  predicate: 'SANGAT_BAIK' | 'BAIK' | 'CUKUP' | 'KURANG';
  industryFeedback: string;
  certificateIssued: boolean;
  totalJournals: number;
}

export interface PKLJournal {
  id: string;
  placementId: string;
  studentId: string;
  date: string;
  timeIn: string;
  timeOut: string;
  divisionOrStation: string;
  activitySummary: string;
  competenciesApplied: string;
  obstaclesAndSolutions: string;
  industryMentorApproval: 'MENUNGGU' | 'DISETUJUI' | 'REVISI';
  mentorNotes?: string;
}

export interface GraduationSummary {
  studentId: string;
  studentName: string;
  nisn: string;
  major: MajorCode;
  className: string;
  isEligible: boolean;
  graduationStatus: 'LULUS' | 'TIDAK_LULUS' | 'MENUNGGU_PLENO';
  averageRaporScore: number;
  ukkScore: number;
  pklScore: number;
  attitudePredicate: 'SANGAT_BAIK' | 'BAIK' | 'CUKUP';
  totalViolationPoints: number;
  sklNumber: string;
  diplomaNumber?: string;
  graduationDecisionDate: string;
  ineligibilityReasons: string[];
}

export type TracerBMWStatus = 'BEKERJA' | 'MELANJUTKAN' | 'WIRAUSAHA' | 'MENCARI_KERJA';

export interface TracerStudyRecord {
  id: string;
  studentId: string;
  studentName: string;
  nisn: string;
  major: MajorCode;
  graduationYear: number;
  statusBMW: TracerBMWStatus;
  // Specific details
  institutionOrCompanyName: string;
  positionOrFieldOrMajor: string;
  monthlyIncome: '< 2 Juta' | '2 - 4 Juta' | '4 - 7 Juta' | '> 7 Juta' | 'Belum Ada Penghasilan';
  waitingPeriodMonths: '0-1 Bulan' | '1-3 Bulan' | '3-6 Bulan' | '> 6 Bulan';
  curriculumRelevance: 'SANGAT_SELARAS' | 'SELARAS' | 'KURANG_SELARAS' | 'TIDAK_SELARAS';
  feedbackToSmk: string;
  phone: string;
  email: string;
  submittedAt: string;
}

export type UserRole = 
  | 'ADMIN'                 // Kepala Sekolah / Waka Kurikulum & Kesiswaan
  | 'GURU_BK'               // Guru Bimbingan Konseling
  | 'GURU_KEJURUAN'         // Guru Mapel / Wali Kelas
  | 'KOORDINATOR_PKL'       // Hubungan Industri (Hubin) & PKL
  | 'SISWA_ALUMNI';         // Portal Siswa / Calon / Alumni

export type ReportTemplateType =
  | 'KURIKULUM_MERDEKA'     // Format Rapor Kurikulum Merdeka (Capaian Pembelajaran & SAS)
  | 'KURIKULUM_2013'        // Format K13 (Pemisahan Pengetahuan & Keterampilan)
  | 'DUAL_SYSTEM_TEFA'      // Format Industri / Teaching Factory (TEFA & BNSP & PKL)
  | 'TRANSKRIP_RINGKAS';    // Transkrip Ringkas 1 Halaman (SNPMB / Kedinasan / Beasiswa)

export interface ReportCardConfig {
  templateType: ReportTemplateType;
  titleHeader: string;
  subHeader: string;
  showKop: boolean;
  kkmStandard: number;
  gradingScale: '0-100' | '1-4';
  showFormativeSumativeBreakdown: boolean;
  showCompetencyDescription: boolean;
  showAttendanceTable: boolean;
  showExtracurricular: boolean;
  showUKKSection: boolean;
  showPKLSection: boolean;
  showTeacherNotes: boolean;
  showPrincipalQR: boolean;
  reportDatePlace: string;
  principalName: string;
  principalNip: string;
  teacherNotesTemplate: string;
}

