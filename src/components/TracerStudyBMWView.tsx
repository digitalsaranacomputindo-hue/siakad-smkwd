import React, { useState } from 'react';
import {
  TrendingUp,
  Briefcase,
  GraduationCap,
  Store,
  Clock,
  CheckCircle2,
  PlusCircle,
  Download,
  Filter,
  Search,
  Building,
  Coins,
  MessageSquare,
  X,
  Compass
} from 'lucide-react';
import type { MajorCode, Student, TracerBMWStatus, TracerStudyRecord } from '../types/academic.ts';
import { calculateBMWStatistics } from '../utils/smkLogic.ts';

interface TracerStudyBMWViewProps {
  students: Student[];
  tracers: TracerStudyRecord[];
  onAddTracer: (record: TracerStudyRecord) => void;
}

export const TracerStudyBMWView: React.FC<TracerStudyBMWViewProps> = ({
  students,
  tracers,
  onAddTracer,
}) => {
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
  const [selectedYear, setSelectedYear] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showSurveyModal, setShowSurveyModal] = useState(false);

  // Form state
  const alumniCandidates = students.filter((s) => s.status === 'LULUS' || s.classLevel === 'ALUMNI' || s.classLevel === 'XII');
  const [selectedStudentId, setSelectedStudentId] = useState(alumniCandidates[0]?.id || '');
  const [statusBMW, setStatusBMW] = useState<TracerBMWStatus>('BEKERJA');
  const [institutionName, setInstitutionName] = useState('');
  const [positionOrMajor, setPositionOrMajor] = useState('');
  const [income, setIncome] = useState<'< 2 Juta' | '2 - 4 Juta' | '4 - 7 Juta' | '> 7 Juta' | 'Belum Ada Penghasilan'>('4 - 7 Juta');
  const [waitingPeriod, setWaitingPeriod] = useState<'0-1 Bulan' | '1-3 Bulan' | '3-6 Bulan' | '> 6 Bulan'>('0-1 Bulan');
  const [curriculumRelevance, setCurriculumRelevance] = useState<'SANGAT_SELARAS' | 'SELARAS' | 'KURANG_SELARAS' | 'TIDAK_SELARAS'>('SANGAT_SELARAS');
  const [feedback, setFeedback] = useState('');

  // Submit survey
  const handleSubmitSurvey = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st || !institutionName.trim()) return;

    const newTracer: TracerStudyRecord = {
      id: `trc-${Date.now()}`,
      studentId: st.id,
      studentName: st.name,
      nisn: st.nisn,
      major: st.major,
      graduationYear: 2025,
      statusBMW,
      institutionOrCompanyName: institutionName,
      positionOrFieldOrMajor: positionOrMajor,
      monthlyIncome: statusBMW === 'MELANJUTKAN' || statusBMW === 'MENCARI_KERJA' ? 'Belum Ada Penghasilan' : income,
      waitingPeriodMonths: waitingPeriod,
      curriculumRelevance,
      feedbackToSmk: feedback,
      phone: st.phone,
      email: st.email,
      submittedAt: new Date().toISOString().split('T')[0],
    };

    onAddTracer(newTracer);
    setShowSurveyModal(false);
    setInstitutionName('');
    setPositionOrMajor('');
    setFeedback('');
  };

  // Filtered
  const filteredTracers = tracers.filter((t) => {
    if (selectedMajor !== 'ALL' && t.major !== selectedMajor) return false;
    if (selectedYear !== 'ALL' && t.graduationYear.toString() !== selectedYear) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return (
        t.studentName.toLowerCase().includes(q) ||
        t.institutionOrCompanyName.toLowerCase().includes(q) ||
        t.positionOrFieldOrMajor.toLowerCase().includes(q)
      );
    }
    return true;
  });

  const stats = calculateBMWStatistics(filteredTracers);

  // Export CSV
  const handleExportCSV = () => {
    const headers = 'Nama Siswa,NISN,Jurusan,Tahun Lulus,Status BMW,Instansi/Perusahaan,Posisi/Prodi,Penghasilan,Waktu Tunggu,Keselarasan Kurikulum,Tgl Lapor\n';
    const rows = filteredTracers
      .map(
        (t) =>
          `"${t.studentName}","${t.nisn}","${t.major}",${t.graduationYear},"${t.statusBMW}","${t.institutionOrCompanyName}","${t.positionOrFieldOrMajor}","${t.monthlyIncome}","${t.waitingPeriodMonths}","${t.curriculumRelevance}","${t.submittedAt}"`
      )
      .join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `Tracer_Study_BMW_SMKN1_Nusantara_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-purple-600" />
            Tracer Study Lulusan SMK (BMW: Bekerja, Melanjutkan, Wirausaha)
          </h2>
          <p className="text-xs text-slate-500">
            Instrumen resmi pelacakan alumni dan evaluasi keselarasan kurikulum vokasi (Link &amp; Match) dengan kebutuhan industri.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-2 rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 text-xs font-semibold"
          >
            <Download className="w-4 h-4" />
            Ekspor CSV
          </button>
          <button
            onClick={() => setShowSurveyModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-purple-600 text-white text-xs font-bold hover:bg-purple-700 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            + Isi Form Tracer Alumni
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-5 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">
              Bekerja di DU/DI
            </span>
            <Briefcase className="w-5 h-5 opacity-90" />
          </div>
          <div className="mt-3 text-3xl font-black">{stats.pctBekerja}%</div>
          <div className="mt-1 text-xs opacity-90">
            {stats.countBekerja} dari {stats.totalResponded} responden
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">
              Melanjutkan Studi (PTN)
            </span>
            <GraduationCap className="w-5 h-5 opacity-90" />
          </div>
          <div className="mt-3 text-3xl font-black">{stats.pctMelanjutkan}%</div>
          <div className="mt-1 text-xs opacity-90">
            {stats.countMelanjutkan} Kuliah / Politeknik Vokasi
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">
              Wirausaha Mandiri
            </span>
            <Store className="w-5 h-5 opacity-90" />
          </div>
          <div className="mt-3 text-3xl font-black">{stats.pctWirausaha}%</div>
          <div className="mt-1 text-xs opacity-90">
            {stats.countWirausaha} Pemilik Usaha / Studio
          </div>
        </div>

        <div className="p-5 rounded-xl bg-gradient-to-br from-purple-600 to-pink-600 text-white shadow-xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-semibold opacity-90 uppercase tracking-wider">
              Daya Serap Vokasi (BMW)
            </span>
            <CheckCircle2 className="w-5 h-5 opacity-90" />
          </div>
          <div className="mt-3 text-3xl font-black">{stats.bmwAbsorptionRate}%</div>
          <div className="mt-1 text-xs opacity-90">
            Target Nasional: &gt; 80% (Tercapai!)
          </div>
        </div>
      </div>

      {/* Visual Bar Breakdown & Link Match Rating */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 flex items-center justify-between">
            <span>Komposisi Penyerapan Alumni SMK (BMW)</span>
            <span className="text-xs font-medium text-purple-700">
              Total {stats.totalResponded} Responden
            </span>
          </h3>

          {/* Visual Stacked Bar */}
          <div className="h-6 w-full rounded-lg bg-slate-100 flex overflow-hidden p-0.5 border border-slate-200">
            <div
              style={{ width: `${stats.pctBekerja}%` }}
              title={`Bekerja: ${stats.pctBekerja}%`}
              className="bg-blue-600 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
            >
              {stats.pctBekerja > 10 ? `Bekerja ${stats.pctBekerja}%` : ''}
            </div>
            <div
              style={{ width: `${stats.pctMelanjutkan}%` }}
              title={`Melanjutkan: ${stats.pctMelanjutkan}%`}
              className="bg-emerald-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
            >
              {stats.pctMelanjutkan > 10 ? `Kuliah ${stats.pctMelanjutkan}%` : ''}
            </div>
            <div
              style={{ width: `${stats.pctWirausaha}%` }}
              title={`Wirausaha: ${stats.pctWirausaha}%`}
              className="bg-amber-500 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
            >
              {stats.pctWirausaha > 10 ? `Wirausaha ${stats.pctWirausaha}%` : ''}
            </div>
            <div
              style={{ width: `${stats.pctMencariKerja}%` }}
              title={`Mencari Kerja: ${stats.pctMencariKerja}%`}
              className="bg-slate-400 h-full flex items-center justify-center text-[10px] font-bold text-white transition-all"
            >
              {stats.pctMencariKerja > 10 ? `Mencari ${stats.pctMencariKerja}%` : ''}
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs">
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Bekerja di DU/DI</span>
              <strong className="text-blue-700 text-sm">{stats.countBekerja} Alumni</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Kuliah / PTN</span>
              <strong className="text-emerald-700 text-sm">{stats.countMelanjutkan} Alumni</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Wirausaha Mandiri</span>
              <strong className="text-amber-700 text-sm">{stats.countWirausaha} Alumni</strong>
            </div>
            <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-200">
              <span className="text-slate-500 block text-[11px]">Mencari Kerja</span>
              <strong className="text-slate-700 text-sm">{stats.countMencariKerja} Alumni</strong>
            </div>
          </div>
        </div>

        {/* Link & Match Rating Box */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <Compass className="w-4 h-4 text-emerald-600" />
            Keselarasan Kurikulum Vokasi
          </h3>
          <p className="text-xs text-slate-500">
            Penilaian relevansi kompetensi yang dipelajari di SMK dengan realitas pekerjaan alumni.
          </p>

          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200">
            <div className="text-2xl font-black text-emerald-800">{stats.alignmentHighPct}%</div>
            <div className="text-xs text-emerald-700 font-semibold mt-0.5">
              Alumni Menilai Kurikulum Selaras / Sangat Selaras
            </div>
          </div>

          <div className="text-[11px] text-slate-500 space-y-1">
            <div className="flex justify-between">
              <span>Waktu Tunggu Rata-rata:</span>
              <strong className="text-slate-800">&lt; 3 Bulan</strong>
            </div>
            <div className="flex justify-between">
              <span>Rata-rata Gaji Pertama:</span>
              <strong className="text-slate-800">Rp 4.000.000 - 7.000.000</strong>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter Jurusan:
          </div>
          {['ALL', 'RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'].map((maj) => (
            <button
              key={maj}
              onClick={() => setSelectedMajor(maj)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                selectedMajor === maj
                  ? 'bg-purple-100 text-purple-800 border border-purple-300'
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
            placeholder="Cari alumni, DU/DI, profesi..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-purple-500"
          />
        </div>
      </div>

      {/* Tracer Study Records Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredTracers.map((trc) => (
          <div
            key={trc.id}
            className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <h4 className="font-bold text-slate-900 text-sm">{trc.studentName}</h4>
                <div className="text-xs text-slate-500">
                  {trc.major} • Lulusan Tahun {trc.graduationYear} • NISN: {trc.nisn}
                </div>
              </div>
              <span
                className={`px-2.5 py-0.5 rounded-full text-xs font-bold ${
                  trc.statusBMW === 'BEKERJA'
                    ? 'bg-blue-100 text-blue-800'
                    : trc.statusBMW === 'MELANJUTKAN'
                    ? 'bg-emerald-100 text-emerald-800'
                    : trc.statusBMW === 'WIRAUSAHA'
                    ? 'bg-amber-100 text-amber-800'
                    : 'bg-slate-100 text-slate-700'
                }`}
              >
                {trc.statusBMW}
              </span>
            </div>

            <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 text-xs space-y-1.5">
              <div className="flex items-center gap-2 font-bold text-slate-900">
                <Building className="w-4 h-4 text-purple-600" />
                {trc.institutionOrCompanyName}
              </div>
              <div className="text-slate-600">
                Posisi / Program: <strong>{trc.positionOrFieldOrMajor}</strong>
              </div>
              <div className="grid grid-cols-2 gap-2 pt-1 text-[11px] text-slate-500">
                <div>
                  Penghasilan: <strong className="text-slate-800">{trc.monthlyIncome}</strong>
                </div>
                <div>
                  Waktu Tunggu: <strong className="text-slate-800">{trc.waitingPeriodMonths}</strong>
                </div>
              </div>
            </div>

            {trc.feedbackToSmk && (
              <div className="p-2.5 rounded bg-purple-50/50 border border-purple-100 text-xs text-slate-700">
                <div className="font-semibold text-purple-900 text-[11px] flex items-center gap-1 mb-0.5">
                  <MessageSquare className="w-3.5 h-3.5" /> Saran untuk Mutu Pendidikan SMK:
                </div>
                <p className="italic text-[11px] leading-relaxed">&ldquo;{trc.feedbackToSmk}&rdquo;</p>
              </div>
            )}

            <div className="flex justify-between items-center text-[10px] text-slate-400 pt-1 border-t border-slate-100">
              <span>Dilaporkan: {trc.submittedAt}</span>
              <span className="font-semibold text-emerald-700">
                Relevansi: {trc.curriculumRelevance.replace('_', ' ')}
              </span>
            </div>
          </div>
        ))}
      </div>

      {/* Modal: Form Isi Tracer Study */}
      {showSurveyModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowSurveyModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-purple-600" />
              Kuesioner Tracer Study Alumni SMK
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Bantu almamater mengukur keberhasilan program Link &amp; Match dan akreditasi sekolah.
            </p>

            <form onSubmit={handleSubmitSurvey} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Alumni / Siswa *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500 font-semibold"
                >
                  {alumniCandidates.map((st) => (
                    <option key={st.id} value={st.id}>
                      {st.name} — {st.className} (NISN: {st.nisn})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Status Lulusan Saat Ini (BMW) *</label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { id: 'BEKERJA', label: 'Bekerja di DU/DI' },
                    { id: 'MELANJUTKAN', label: 'Melanjutkan Kuliah (PTN)' },
                    { id: 'WIRAUSAHA', label: 'Wirausaha Mandiri' },
                    { id: 'MENCARI_KERJA', label: 'Sedang Mencari Kerja' },
                  ].map((s) => (
                    <label
                      key={s.id}
                      className={`flex items-center gap-2 p-2 rounded-lg border cursor-pointer font-medium ${
                        statusBMW === s.id
                          ? 'bg-purple-50 border-purple-400 text-purple-900'
                          : 'bg-white border-slate-200 text-slate-700'
                      }`}
                    >
                      <input
                        type="radio"
                        name="statusBMW"
                        value={s.id}
                        checked={statusBMW === s.id}
                        onChange={() => setStatusBMW(s.id as TracerBMWStatus)}
                        className="text-purple-600"
                      />
                      <span>{s.label}</span>
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Perusahaan / Kampus / Usaha Mandiri *
                </label>
                <input
                  type="text"
                  required
                  value={institutionName}
                  onChange={(e) => setInstitutionName(e.target.value)}
                  placeholder="Contoh: PT Telkom / Politeknik Negeri / Studio Desain"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Posisi Jabatan / Program Studi</label>
                <input
                  type="text"
                  value={positionOrMajor}
                  onChange={(e) => setPositionOrMajor(e.target.value)}
                  placeholder="Contoh: Junior Frontend Developer / D4 Teknik Informatika"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Rentang Penghasilan Bulanan</label>
                  <select
                    value={income}
                    onChange={(e) => setIncome(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="< 2 Juta">&lt; 2 Juta</option>
                    <option value="2 - 4 Juta">2 - 4 Juta</option>
                    <option value="4 - 7 Juta">4 - 7 Juta</option>
                    <option value="> 7 Juta">&gt; 7 Juta</option>
                    <option value="Belum Ada Penghasilan">Belum Ada Penghasilan</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Waktu Tunggu Kerja Pertama</label>
                  <select
                    value={waitingPeriod}
                    onChange={(e) => setWaitingPeriod(e.target.value as any)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="0-1 Bulan">0 - 1 Bulan</option>
                    <option value="1-3 Bulan">1 - 3 Bulan</option>
                    <option value="3-6 Bulan">3 - 6 Bulan</option>
                    <option value="> 6 Bulan">&gt; 6 Bulan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Keselarasan Kurikulum SMK</label>
                <select
                  value={curriculumRelevance}
                  onChange={(e) => setCurriculumRelevance(e.target.value as any)}
                  className="w-full p-2 border border-slate-300 rounded-lg font-semibold text-emerald-800"
                >
                  <option value="SANGAT_SELARAS">Sangat Selaras dengan Dunia Kerja</option>
                  <option value="SELARAS">Selaras</option>
                  <option value="KURANG_SELARAS">Kurang Selaras</option>
                  <option value="TIDAK_SELARAS">Tidak Selaras</option>
                </select>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Saran / Masukan untuk SMK</label>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Materi apa yang perlu ditambahkan atau ditingkatkan di bengkel/lab SMK?"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowSurveyModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-bold"
                >
                  Kirim Data Tracer
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
