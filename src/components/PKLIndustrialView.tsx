import React, { useState } from 'react';
import {
  Briefcase,
  Building2,
  BookOpen,
  PlusCircle,
  CheckCircle2,
  Clock,
  Printer,
  X,
  Search,
  Filter,
  FileCheck,
  Star,
  Users,
  Award
} from 'lucide-react';
import type {
  IndustryPartner,
  MajorCode,
  PKLJournal,
  PKLPlacement,
  Student
} from '../types/academic.ts';
import { calculatePKLScore } from '../utils/smkLogic.ts';

interface PKLIndustrialViewProps {
  students: Student[];
  partners: IndustryPartner[];
  placements: PKLPlacement[];
  journals: PKLJournal[];
  onAddJournal: (journal: PKLJournal) => void;
  onAddPlacement: (placement: PKLPlacement) => void;
  onUpdatePlacementScore: (placementId: string, scores: { technical: number; discipline: number; report: number; feedback: string }) => void;
  onPrintCertificate: (placement: PKLPlacement, partner: IndustryPartner, student: Student) => void;
}

export const PKLIndustrialView: React.FC<PKLIndustrialViewProps> = ({
  students,
  partners,
  placements,
  journals,
  onAddJournal,
  onAddPlacement,
  onUpdatePlacementScore,
  onPrintCertificate,
}) => {
  const [activeTab, setActiveTab] = useState<'PLACEMENTS' | 'JOURNALS' | 'PARTNERS'>('PLACEMENTS');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddJournalModal, setShowAddJournalModal] = useState(false);
  const [showScoreModal, setShowScoreModal] = useState<PKLPlacement | null>(null);

  // Form state for Journal
  const [selectedPlacementId, setSelectedPlacementId] = useState(placements[0]?.id || '');
  const [journalDate, setJournalDate] = useState(new Date().toISOString().split('T')[0]);
  const [timeIn, setTimeIn] = useState('08:00');
  const [timeOut, setTimeOut] = useState('17:00');
  const [division, setDivision] = useState('Divisi Teknis & Pengembangan');
  const [summary, setSummary] = useState('');
  const [competencies, setCompetencies] = useState('');
  const [obstacles, setObstacles] = useState('');

  // Form state for Score
  const [techScore, setTechScore] = useState(88);
  const [discScore, setDiscScore] = useState(90);
  const [repScore, setRepScore] = useState(85);
  const [feedback, setFeedback] = useState('Kinerja sangat memuaskan dan etos kerja industri sangat baik.');

  const handleSubmitJournal = (e: React.FormEvent) => {
    e.preventDefault();
    const plc = placements.find((p) => p.id === selectedPlacementId);
    if (!plc || !summary.trim()) return;

    const newJrn: PKLJournal = {
      id: `jrn-${Date.now()}`,
      placementId: plc.id,
      studentId: plc.studentId,
      date: journalDate,
      timeIn,
      timeOut,
      divisionOrStation: division,
      activitySummary: summary,
      competenciesApplied: competencies,
      obstaclesAndSolutions: obstacles || 'Tidak ada kendala berarti.',
      industryMentorApproval: 'DISETUJUI',
      mentorNotes: 'Telah diverifikasi oleh pembimbing DU/DI.',
    };

    onAddJournal(newJrn);
    setShowAddJournalModal(false);
    setSummary('');
    setCompetencies('');
    setObstacles('');
  };

  const handleSaveScore = (e: React.FormEvent) => {
    e.preventDefault();
    if (!showScoreModal) return;

    onUpdatePlacementScore(showScoreModal.id, {
      technical: techScore,
      discipline: discScore,
      report: repScore,
      feedback,
    });

    setShowScoreModal(null);
  };

  return (
    <div className="space-y-6">
      {/* Header View */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Briefcase className="w-5 h-5 text-amber-600" />
            Praktik Kerja Lapangan (PKL) &amp; Hubungan Industri (Hubin)
          </h2>
          <p className="text-xs text-slate-500">
            Penempatan magang 6 bulan di Dunia Usaha &amp; Dunia Industri (DU/DI), monitoring jurnal harian kerja, serta sertifikasi industri.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddJournalModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-amber-600 text-white text-xs font-bold hover:bg-amber-700 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            + Isi Jurnal Harian PKL
          </button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
        <button
          onClick={() => setActiveTab('PLACEMENTS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'PLACEMENTS'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Users className="w-4 h-4" />
          Penempatan &amp; Penilaian Siswa ({placements.length})
        </button>
        <button
          onClick={() => setActiveTab('JOURNALS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'JOURNALS'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          Jurnal Logbook PKL ({journals.length})
        </button>
        <button
          onClick={() => setActiveTab('PARTNERS')}
          className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all ${
            activeTab === 'PARTNERS'
              ? 'bg-amber-600 text-white shadow-xs'
              : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
          }`}
        >
          <Building2 className="w-4 h-4" />
          Mitra DU/DI &amp; MoU ({partners.length})
        </button>
      </div>

      {/* Content 1: Placements */}
      {activeTab === 'PLACEMENTS' && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {placements.map((plc) => {
              const st = students.find((s) => s.id === plc.studentId);
              const ptn = partners.find((p) => p.id === plc.companyId) || partners[0];
              const scoreCalc = calculatePKLScore(plc.technicalScore, plc.disciplineScore, plc.reportScore);

              return (
                <div
                  key={plc.id}
                  className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3.5"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex items-center gap-3">
                      {st && (
                        <img
                          src={st.photoUrl}
                          alt={plc.studentName}
                          className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                        />
                      )}
                      <div>
                        <h4 className="font-bold text-slate-900 text-xs">{plc.studentName}</h4>
                        <div className="text-[11px] text-slate-500">
                          {plc.studentClass} • {plc.major}
                        </div>
                      </div>
                    </div>

                    <span
                      className={`px-2.5 py-0.5 rounded text-[10px] font-bold ${
                        plc.status === 'BERJALAN'
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-emerald-100 text-emerald-800'
                      }`}
                    >
                      {plc.status}
                    </span>
                  </div>

                  <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200 text-xs space-y-1">
                    <div className="font-bold text-slate-900 flex items-center gap-1.5">
                      <Building2 className="w-3.5 h-3.5 text-amber-600" />
                      {plc.companyName}
                    </div>
                    <div className="text-[11px] text-slate-500">{plc.companyAddress}</div>
                    <div className="pt-1 text-[11px] text-slate-700">
                      Pembimbing DU/DI: <strong>{plc.industryMentor}</strong>
                    </div>
                    <div className="text-[11px] text-slate-700">
                      Guru Pembimbing Sekolah: <span>{plc.schoolSupervisor}</span>
                    </div>
                  </div>

                  {/* Score breakdown & certificate */}
                  <div className="p-3 bg-slate-50 rounded-lg border border-slate-200 flex items-center justify-between text-xs">
                    <div>
                      <span className="text-[11px] text-slate-500 block">Nilai Akhir PKL:</span>
                      <div className="text-sm font-bold text-emerald-700">
                        {plc.finalScore > 0 ? `${plc.finalScore} (${plc.predicate})` : 'Belum Dinilai'}
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => {
                          setShowScoreModal(plc);
                          setTechScore(plc.technicalScore || 85);
                          setDiscScore(plc.disciplineScore || 90);
                          setRepScore(plc.reportScore || 85);
                          setFeedback(plc.industryFeedback || 'Kinerja sangat baik.');
                        }}
                        className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold"
                      >
                        Input Nilai PKL
                      </button>

                      {st && plc.finalScore >= 75 && (
                        <button
                          onClick={() => onPrintCertificate(plc, ptn, st)}
                          title="Cetak Sertifikat PKL Resmi DU/DI"
                          className="px-2.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1"
                        >
                          <Printer className="w-3.5 h-3.5" /> Cetak Sertifikat
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content 2: Journals */}
      {activeTab === 'JOURNALS' && (
        <div className="space-y-4">
          <div className="bg-white rounded-xl border border-slate-200 shadow-xs divide-y divide-slate-100">
            {journals.map((j) => {
              const plc = placements.find((p) => p.id === j.placementId);
              return (
                <div key={j.id} className="p-4 hover:bg-slate-50/50 transition-colors space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-slate-900">{plc?.studentName}</span>
                      <span className="text-slate-400">•</span>
                      <span className="text-slate-600 font-medium">{plc?.companyName}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-slate-400 text-[11px] flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" /> {j.timeIn} - {j.timeOut} WIB
                      </span>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                        {j.industryMentorApproval}
                      </span>
                    </div>
                  </div>

                  <div className="text-[11px] font-semibold text-blue-800">
                    Stasiun Kerja: {j.divisionOrStation} (Tanggal: {j.date})
                  </div>

                  <p className="text-slate-700 text-xs leading-relaxed">{j.activitySummary}</p>

                  <div className="p-2.5 bg-slate-50 rounded border border-slate-200 text-[11px] space-y-1">
                    <div>
                      <span className="text-slate-400">Kompetensi yang Diterapkan: </span>
                      <span className="font-medium text-slate-800">{j.competenciesApplied}</span>
                    </div>
                    {j.obstaclesAndSolutions && (
                      <div>
                        <span className="text-slate-400">Kendala &amp; Solusi: </span>
                        <span className="text-slate-600 italic">{j.obstaclesAndSolutions}</span>
                      </div>
                    )}
                    {j.mentorNotes && (
                      <div className="text-emerald-700 font-medium pt-0.5 border-t border-slate-200">
                        Catatan Mentor DU/DI: &ldquo;{j.mentorNotes}&rdquo;
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Content 3: Partners & MoU */}
      {activeTab === 'PARTNERS' && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {partners.map((ptn) => (
            <div
              key={ptn.id}
              className="p-5 bg-white rounded-xl border border-slate-200 shadow-xs space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="w-10 h-10 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center font-bold">
                  <Building2 className="w-5 h-5" />
                </div>
                <div className="flex items-center gap-1 text-amber-500 font-bold text-xs bg-amber-50 px-2 py-0.5 rounded">
                  <Star className="w-3.5 h-3.5 fill-amber-500" />
                  <span>{ptn.rating}</span>
                </div>
              </div>

              <div>
                <h4 className="font-bold text-slate-900 text-sm">{ptn.name}</h4>
                <p className="text-[11px] text-slate-500">{ptn.sector}</p>
                <p className="text-[11px] text-slate-400 mt-1">{ptn.address}</p>
              </div>

              <div className="p-2.5 bg-slate-50 rounded-lg border border-slate-200 text-[11px] space-y-1">
                <div className="font-mono text-slate-600 text-[10px] truncate">
                  No. MoU: {ptn.mouNumber}
                </div>
                <div className="text-emerald-700 font-semibold">
                  Berlaku s/d: {ptn.mouValidUntil}
                </div>
                <div className="text-slate-600">
                  PIC: {ptn.contactPerson} ({ptn.contactPhone})
                </div>
              </div>

              <div className="flex flex-wrap gap-1.5 pt-1">
                {ptn.suitableMajors.map((m) => (
                  <span
                    key={m}
                    className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800"
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal: Isi Jurnal Harian */}
      {showAddJournalModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddJournalModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-amber-600" />
              Tulis Jurnal Harian PKL Siswa
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Catatan harian ini akan diverifikasi pembimbing industri dan menjadi portofolio magang.
            </p>

            <form onSubmit={handleSubmitJournal} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Penempatan Siswa *</label>
                <select
                  value={selectedPlacementId}
                  onChange={(e) => setSelectedPlacementId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500 font-semibold"
                >
                  {placements.map((p) => (
                    <option key={p.id} value={p.id}>
                      {p.studentName} — {p.companyName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tanggal</label>
                  <input
                    type="date"
                    value={journalDate}
                    onChange={(e) => setJournalDate(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Masuk</label>
                  <input
                    type="text"
                    value={timeIn}
                    onChange={(e) => setTimeIn(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jam Pulang</label>
                  <input
                    type="text"
                    value={timeOut}
                    onChange={(e) => setTimeOut(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-mono"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Divisi / Stasiun Kerja *</label>
                <input
                  type="text"
                  required
                  value={division}
                  onChange={(e) => setDivision(e.target.value)}
                  placeholder="Contoh: Unit Perbaikan Engine EFI"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ringkasan Pekerjaan Teknis *</label>
                <textarea
                  rows={2}
                  required
                  value={summary}
                  onChange={(e) => setSummary(e.target.value)}
                  placeholder="Deskripsikan pekerjaan teknis yang dikerjakan hari ini..."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Kompetensi Kejuruan yang Diterapkan</label>
                <input
                  type="text"
                  value={competencies}
                  onChange={(e) => setCompetencies(e.target.value)}
                  placeholder="Contoh: Wiring diagram, pemakaian oscilloskop"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddJournalModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 text-white rounded-lg hover:bg-amber-700 font-bold"
                >
                  Simpan Jurnal Harian
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal: Input Nilai PKL */}
      {showScoreModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowScoreModal(null)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Award className="w-5 h-5 text-emerald-600" />
              Penilaian Akhir PKL DU/DI
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Siswa: <strong>{showScoreModal.studentName}</strong> di <strong>{showScoreModal.companyName}</strong>
            </p>

            <form onSubmit={handleSaveScore} className="mt-4 space-y-3 text-xs">
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Teknis (40%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={techScore}
                    onChange={(e) => setTechScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Disiplin &amp; K3LH (30%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={discScore}
                    onChange={(e) => setDiscScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Laporan PKL (30%)</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={repScore}
                    onChange={(e) => setRepScore(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg text-center font-bold"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Ulasan / Catatan Pembimbing Industri</label>
                <textarea
                  rows={2}
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              {/* Calculated Result */}
              <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-emerald-800 font-medium">Nilai Akhir PKL:</span>
                  <div className="text-base font-bold text-emerald-950">
                    {calculatePKLScore(techScore, discScore, repScore).finalScore}
                  </div>
                </div>
                <span className="px-2.5 py-1 rounded bg-emerald-200 text-emerald-900 font-bold text-xs">
                  Predikat: {calculatePKLScore(techScore, discScore, repScore).predicate}
                </span>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowScoreModal(null)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 font-bold"
                >
                  Simpan Nilai PKL
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
