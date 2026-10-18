import React, { useState } from 'react';
import {
  Award,
  BookOpen,
  PlusCircle,
  Search,
  Filter,
  CheckCircle2,
  Printer,
  X,
  FileSpreadsheet,
  Sliders
} from 'lucide-react';
import type { GradeRecord, ReportCardConfig, Student, SubjectCategory, UKKRecord, UserRole } from '../types/academic.ts';
import { calculateFinalGrade, calculateUKKScore } from '../utils/smkLogic.ts';

interface GradesAndUKKViewProps {
  students: Student[];
  grades: GradeRecord[];
  ukkRecords: UKKRecord[];
  reportConfig: ReportCardConfig;
  currentRole: UserRole;
  onOpenReportConfig: () => void;
  onAddGrade: (grade: GradeRecord) => void;
  onAddUKK: (ukk: UKKRecord) => void;
  onPrintReportCard: (student: Student, studentGrades: GradeRecord[], ukk?: UKKRecord) => void;
}

export const GradesAndUKKView: React.FC<GradesAndUKKViewProps> = ({
  students,
  grades,
  ukkRecords,
  reportConfig,
  currentRole,
  onOpenReportConfig,
  onAddGrade,
  onAddUKK,
  onPrintReportCard,
}) => {
  const [activeSection, setActiveSection] = useState<'RAPOR' | 'UKK'>('RAPOR');
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddGradeModal, setShowAddGradeModal] = useState(false);
  const [showAddUKKModal, setShowAddUKKModal] = useState(false);

  // Form state for Grade
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [subjectName, setSubjectName] = useState('');
  const [subjectCode, setSubjectCode] = useState('PROD-301');
  const [category, setCategory] = useState<SubjectCategory>('KONSENTRASI_KEAHLIAN');
  const [semester, setSemester] = useState(5);
  const [formative, setFormative] = useState(85);
  const [sumativeMaterial, setSumativeMaterial] = useState(85);
  const [sumativeFinal, setSumativeFinal] = useState(88);

  // Form state for UKK
  const [ukkStudentId, setUkkStudentId] = useState(students.find((s) => s.classLevel === 'XII')?.id || students[0]?.id || '');
  const [schemeTitle, setSchemeTitle] = useState('Klaster Pemrograman Web & Aplikasi Bergerak (LSP-P1 SMK)');
  const [practicalScore, setPracticalScore] = useState(88);
  const [theoryScore, setTheoryScore] = useState(84);
  const [portfolioScore, setPortfolioScore] = useState(86);
  const [internalAssessor, setInternalAssessor] = useState('Rahmat Hidayat, M.T.');
  const [externalAssessor, setExternalAssessor] = useState('Farid Rahman (Senior Tech Lead PT Telkom)');
  const [assessorCompany, setAssessorCompany] = useState('PT Telkom Indonesia (Persero) Tbk');

  // Submit Grade
  const handleSubmitGrade = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st || !subjectName.trim()) return;

    const calc = calculateFinalGrade(formative, sumativeMaterial, sumativeFinal, 75);

    const newGrade: GradeRecord = {
      id: `grd-${Date.now()}`,
      studentId: st.id,
      semester,
      academicYear: '2025/2026',
      subjectCode,
      subjectName,
      category,
      kkm: 75,
      formativeScore: formative,
      sumativeMaterialScore: sumativeMaterial,
      sumativeFinalScore: sumativeFinal,
      finalScore: calc.finalScore,
      letterGrade: calc.letterGrade,
      competencyAchievement: calc.competencyText,
    };

    onAddGrade(newGrade);
    setShowAddGradeModal(false);
    setSubjectName('');
  };

  // Submit UKK
  const handleSubmitUKK = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === ukkStudentId);
    if (!st) return;

    const calc = calculateUKKScore(practicalScore, theoryScore, portfolioScore);

    const newUKK: UKKRecord = {
      id: `ukk-${Date.now()}`,
      studentId: st.id,
      academicYear: '2025/2026',
      schemeTitle,
      practicalScore,
      theoryScore,
      portfolioScore,
      finalScore: calc.finalScore,
      predicate: calc.predicate,
      internalAssessor,
      externalAssessor,
      assessorCompany,
      certificateNo: calc.isCompetent
        ? `BNSP-LSP/SMK1-${st.major}/2026/${Math.floor(1000 + Math.random() * 9000)}`
        : undefined,
      testDate: new Date().toISOString().split('T')[0],
      status: calc.isCompetent ? 'LULUS' : 'REMEDIAL',
    };

    onAddUKK(newUKK);
    setShowAddUKKModal(false);
  };

  // Filtered students for display
  const targetStudents = students.filter((s) => {
    if (activeSection === 'UKK' && s.classLevel !== 'XII' && s.classLevel !== 'ALUMNI') return false;
    if (selectedMajor !== 'ALL' && s.major !== selectedMajor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.nisn.includes(q) || s.className.toLowerCase().includes(q);
    }
    return true;
  });

  return (
    <div className="space-y-6">
      {/* View Header with Action */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Award className="w-5 h-5 text-blue-600" />
            Manajemen Nilai Rapor &amp; Uji Kompetensi Keahlian (UKK)
          </h2>
          <p className="text-xs text-slate-500">
            Penilaian capaian pembelajaran Kurikulum Merdeka dan asesmen sertifikasi profesi bersama asesor industri (DU/DI).
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onOpenReportConfig}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold shadow-xs transition-all border border-slate-700"
            title="Klik untuk mengganti format dan template rapor (Khusus Admin)"
          >
            <Sliders className="w-3.5 h-3.5 text-blue-400" />
            <span>Format Rapor:</span>
            <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/20 text-blue-300 font-semibold border border-blue-500/30">
              {reportConfig.templateType.replace(/_/g, ' ')}
            </span>
          </button>

          {activeSection === 'RAPOR' ? (
            <button
              onClick={() => setShowAddGradeModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              + Input Nilai Mapel
            </button>
          ) : (
            <button
              onClick={() => setShowAddUKKModal(true)}
              className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
            >
              <PlusCircle className="w-4 h-4" />
              + Input Asesmen UKK
            </button>
          )}
        </div>
      </div>

      {/* Switcher Tab: Rapor Merdeka vs UKK */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setActiveSection('RAPOR')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'RAPOR'
              ? 'bg-blue-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Rapor Akademik Kurikulum Merdeka ({grades.length} Nilai Terinput)
        </button>
        <button
          onClick={() => setActiveSection('UKK')}
          className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            activeSection === 'UKK'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Award className="w-4 h-4" />
          Uji Kompetensi Keahlian / LSP P1 ({ukkRecords.length} Terasesi)
        </button>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Keahlian:
          </div>
          {['ALL', 'RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'].map((maj) => (
            <button
              key={maj}
              onClick={() => setSelectedMajor(maj)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                selectedMajor === maj
                  ? 'bg-blue-100 text-blue-800 border border-blue-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {maj === 'ALL' ? 'Semua' : maj}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Content: Rapor Merdeka Section */}
      {activeSection === 'RAPOR' && (
        <div className="space-y-4">
          {targetStudents.map((st) => {
            const studentGrades = grades.filter((g) => g.studentId === st.id);
            const studentUKK = ukkRecords.find((u) => u.studentId === st.id);
            const avgScore =
              studentGrades.length > 0
                ? Math.round(studentGrades.reduce((acc, g) => acc + g.finalScore, 0) / studentGrades.length)
                : 0;

            return (
              <div
                key={st.id}
                className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden"
              >
                {/* Student Mini Header */}
                <div className="p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-3">
                    <img
                      src={st.photoUrl}
                      alt={st.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900 text-sm">{st.name}</div>
                      <div className="text-xs text-slate-500">
                        {st.className} • NISN: {st.nisn} • Konsentrasi: {st.major}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="text-right">
                      <span className="text-[11px] text-slate-500 block">Rata-rata Nilai:</span>
                      <span
                        className={`text-base font-black ${
                          avgScore >= 85 ? 'text-emerald-600' : avgScore >= 75 ? 'text-blue-600' : 'text-slate-400'
                        }`}
                      >
                        {avgScore > 0 ? avgScore : 'Belum Ada'}
                      </span>
                    </div>
                    <button
                      onClick={() => onPrintReportCard(st, studentGrades, studentUKK)}
                      className="px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-white text-xs font-semibold flex items-center gap-1.5 shadow-xs"
                    >
                      <Printer className="w-3.5 h-3.5" /> Cetak Lembar Rapor
                    </button>
                  </div>
                </div>

                {/* Grades Table */}
                <div className="p-4">
                  {studentGrades.length === 0 ? (
                    <div className="py-4 text-center text-slate-400 text-xs">
                      Belum ada nilai mata pelajaran yang diinput untuk semester ini.
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="w-full text-left text-xs">
                        <thead className="bg-slate-100/60 text-slate-600 font-semibold text-[11px] uppercase">
                          <tr>
                            <th className="py-2 px-3">Mata Pelajaran</th>
                            <th className="py-2 px-3">Kategori</th>
                            <th className="py-2 px-3 text-center">Formatif (30%)</th>
                            <th className="py-2 px-3 text-center">Sumatif Materi (40%)</th>
                            <th className="py-2 px-3 text-center">SAS (30%)</th>
                            <th className="py-2 px-3 text-center">Nilai Akhir</th>
                            <th className="py-2 px-3 text-center">Predikat</th>
                            <th className="py-2 px-3">Capaian Kompetensi</th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-100">
                          {studentGrades.map((g) => (
                            <tr key={g.id} className="hover:bg-slate-50/50">
                              <td className="py-2.5 px-3 font-semibold text-slate-900">
                                {g.subjectName}
                                <div className="text-[10px] text-slate-400 font-mono">{g.subjectCode}</div>
                              </td>
                              <td className="py-2.5 px-3">
                                <span className="px-2 py-0.5 rounded text-[10px] font-medium bg-slate-100 text-slate-700">
                                  {g.category.replace('_', ' ')}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-center">{g.formativeScore}</td>
                              <td className="py-2.5 px-3 text-center">{g.sumativeMaterialScore}</td>
                              <td className="py-2.5 px-3 text-center">{g.sumativeFinalScore}</td>
                              <td className="py-2.5 px-3 text-center font-bold text-blue-600 text-sm">
                                {g.finalScore}
                              </td>
                              <td className="py-2.5 px-3 text-center">
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    g.letterGrade === 'A'
                                      ? 'bg-emerald-100 text-emerald-800'
                                      : g.letterGrade === 'B'
                                      ? 'bg-blue-100 text-blue-800'
                                      : 'bg-amber-100 text-amber-800'
                                  }`}
                                >
                                  {g.letterGrade}
                                </span>
                              </td>
                              <td className="py-2.5 px-3 text-slate-600 text-[11px] max-w-xs">
                                {g.competencyAchievement}
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Content: UKK Section */}
      {activeSection === 'UKK' && (
        <div className="space-y-4">
          <div className="p-4 bg-emerald-50 rounded-xl border border-emerald-200 text-xs text-emerald-900 flex items-start gap-3">
            <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-bold text-sm block">Uji Kompetensi Keahlian (UKK) Bersama Asesor Industri</span>
              Pelaksanaan sertifikasi kejuruan tingkat akhir (Kelas XII) berstandar BNSP &amp; LSP-P1 SMK Nusantara. Kelulusan UKK dengan predikat minimal KOMPETEN (Nilai &gt;= 75) merupakan salah satu syarat mutlak kelulusan SMK.
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ukkRecords.length === 0 ? (
              <div className="col-span-2 py-8 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
                Belum ada data Uji Kompetensi Keahlian yang diinput.
              </div>
            ) : (
              ukkRecords.map((u) => {
                const st = students.find((s) => s.id === u.studentId);
                return (
                  <div
                    key={u.id}
                    className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        {st && (
                          <img
                            src={st.photoUrl}
                            alt={st.name}
                            className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                          />
                        )}
                        <div>
                          <h4 className="font-bold text-slate-900 text-xs">{st?.name || 'Siswa SMK'}</h4>
                          <div className="text-[11px] text-slate-500">
                            {st?.className} • NISN: {st?.nisn}
                          </div>
                        </div>
                      </div>

                      <span
                        className={`px-2.5 py-1 rounded-md text-xs font-bold ${
                          u.predicate === 'SANGAT_KOMPETEN'
                            ? 'bg-emerald-100 text-emerald-800 border border-emerald-200'
                            : u.predicate === 'KOMPETEN'
                            ? 'bg-blue-100 text-blue-800 border border-blue-200'
                            : 'bg-rose-100 text-rose-800 border border-rose-200'
                        }`}
                      >
                        {u.predicate.replace('_', ' ')} ({u.finalScore})
                      </span>
                    </div>

                    <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
                      <div className="font-semibold text-slate-800">{u.schemeTitle}</div>
                      <div className="grid grid-cols-3 gap-2 pt-1 text-center">
                        <div className="p-1.5 bg-white rounded border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Praktik (60%)</span>
                          <span className="font-bold text-slate-800">{u.practicalScore}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Teori (20%)</span>
                          <span className="font-bold text-slate-800">{u.theoryScore}</span>
                        </div>
                        <div className="p-1.5 bg-white rounded border border-slate-200">
                          <span className="text-[10px] text-slate-400 block">Portofolio (20%)</span>
                          <span className="font-bold text-slate-800">{u.portfolioScore}</span>
                        </div>
                      </div>
                    </div>

                    <div className="text-[11px] space-y-1 text-slate-600">
                      <div>
                        <span className="text-slate-400">Asesor Industri Eksternal: </span>
                        <strong>{u.externalAssessor}</strong> ({u.assessorCompany})
                      </div>
                      <div>
                        <span className="text-slate-400">Asesor Internal Sekolah: </span>
                        <span>{u.internalAssessor}</span>
                      </div>
                      {u.certificateNo && (
                        <div className="font-mono text-[10px] text-emerald-700 font-semibold pt-1">
                          No. Sertifikasi BNSP: {u.certificateNo}
                        </div>
                      )}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      )}

      {/* Modal: Tambah Nilai Mata Pelajaran */}
      {showAddGradeModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddGradeModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-blue-600" />
              Input Nilai Mata Pelajaran (Kurikulum Merdeka)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Perhitungan nilai akhir otomatis berdasarkan bobot Formatif 30%, Sumatif Materi 40%, SAS 30%.
            </p>

            <form onSubmit={handleSubmitGrade} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                >
                  {students.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.className} (NISN: {st.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Mata Pelajaran *</label>
                  <input
                    type="text"
                    required
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    placeholder="Contoh: Pemrograman Mobile"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kode Mapel</label>
                  <input
                    type="text"
                    value={subjectCode}
                    onChange={(e) => setSubjectCode(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kelompok Mapel</label>
                  <select
                    value={category}
                    onChange={(e) => setCategory(e.target.value as SubjectCategory)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="KONSENTRASI_KEAHLIAN">Konsentrasi Keahlian (Kejuruan)</option>
                    <option value="KEJURUAN_DASAR">Dasar-Dasar Kejuruan</option>
                    <option value="UMUM">Mata Pelajaran Umum</option>
                    <option value="PROJEK_P5">Projek Penguatan Profil Pelajar Pancasila (P5)</option>
                    <option value="PKL">Praktik Kerja Lapangan</option>
                    <option value="MUATAN_LOKAL">Muatan Lokal</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Semester</label>
                  <select
                    value={semester}
                    onChange={(e) => setSemester(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    {[1, 2, 3, 4, 5, 6].map((sm) => (
                      <option key={sm} value={sm}>
                        Semester {sm}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Formatif (30%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={formative}
                    onChange={(e) => setFormative(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sumatif Materi (40%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={sumativeMaterial}
                    onChange={(e) => setSumativeMaterial(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">SAS (30%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={sumativeFinal}
                    onChange={(e) => setSumativeFinal(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              {/* Calculated Preview */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-blue-700 font-medium">Estimasi Nilai Akhir:</span>
                  <div className="text-base font-bold text-blue-900">
                    {calculateFinalGrade(formative, sumativeMaterial, sumativeFinal).finalScore}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-blue-200 text-blue-900 font-bold text-xs">
                  Predikat: {calculateFinalGrade(formative, sumativeMaterial, sumativeFinal).letterGrade}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddGradeModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Simpan Nilai Rapor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Tambah Asesmen UKK */}
      {showAddUKKModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddUKKModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Asesmen Uji Kompetensi Keahlian (UKK / LSP)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Input hasil pengujian kejuruan siswa bersama asesor eksternal DU/DI mitra.
            </p>

            <form onSubmit={handleSubmitUKK} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa Kelas XII *</label>
                <select
                  value={ukkStudentId}
                  onChange={(e) => setUkkStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500 font-semibold"
                >
                  {students
                    .filter((s) => s.classLevel === 'XII' || s.classLevel === 'ALUMNI')
                    .map((st) => (
                      <option key={st.id} value={st.id}>
                        {st.name} — {st.className} (NISN: {st.nisn})
                      </option>
                    ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Skema Sertifikasi / Judul Klaster *</label>
                <input
                  type="text"
                  required
                  value={schemeTitle}
                  onChange={(e) => setSchemeTitle(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Praktik (60%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={practicalScore}
                    onChange={(e) => setPracticalScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teori (20%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={theoryScore}
                    onChange={(e) => setTheoryScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Portofolio (20%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={portfolioScore}
                    onChange={(e) => setPortfolioScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Asesor Eksternal DU/DI *</label>
                  <input
                    type="text"
                    required
                    value={externalAssessor}
                    onChange={(e) => setExternalAssessor(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Perusahaan Mitra</label>
                  <input
                    type="text"
                    value={assessorCompany}
                    onChange={(e) => setAssessorCompany(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Asesor Internal Sekolah</label>
                <input
                  type="text"
                  value={internalAssessor}
                  onChange={(e) => setInternalAssessor(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Preview Predicate */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-medium">Nilai Akhir UKK:</span>
                  <div className="text-base font-bold text-emerald-950">
                    {calculateUKKScore(practicalScore, theoryScore, portfolioScore).finalScore}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-200 text-emerald-900 font-bold text-xs">
                  Predikat: {calculateUKKScore(practicalScore, theoryScore, portfolioScore).predicate}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddUKKModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold"
                >
                  Simpan Hasil Asesmen UKK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
