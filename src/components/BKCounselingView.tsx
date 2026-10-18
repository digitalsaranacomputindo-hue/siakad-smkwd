import React, { useState } from 'react';
import {
  ShieldAlert,
  PlusCircle,
  Award,
  AlertTriangle,
  FileCheck,
  Printer,
  X,
  Search,
  Filter,
  Users,
  CheckCircle2,
  Calendar,
  PhoneCall
} from 'lucide-react';
import type { BKCategory, BKRecord, BKSeverity, Student } from '../types/academic.ts';
import { evaluateBKRecords } from '../utils/smkLogic.ts';
import { SMK_PROFILE } from '../data/initialData.ts';

interface BKCounselingViewProps {
  students: Student[];
  bkRecords: BKRecord[];
  onAddBKRecord: (record: BKRecord) => void;
  onUpdateBKRecord: (record: BKRecord) => void;
  onPrintSP: (record: BKRecord, student: Student, warningType: string) => void;
}

export const BKCounselingView: React.FC<BKCounselingViewProps> = ({
  students,
  bkRecords,
  onAddBKRecord,
  onUpdateBKRecord,
  onPrintSP,
}) => {
  const [selectedFilter, setSelectedFilter] = useState<'ALL' | 'PELANGGARAN' | 'PRESTASI' | 'KONSELING'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedStudentForSP, setSelectedStudentForSP] = useState<Student | null>(null);

  // Form for new BK Record
  const [selectedStudentId, setSelectedStudentId] = useState(students[0]?.id || '');
  const [category, setCategory] = useState<BKCategory>('PELANGGARAN');
  const [severity, setSeverity] = useState<BKSeverity>('SEDANG');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [points, setPoints] = useState(25);
  const [followUpAction, setFollowUpAction] = useState('Bimbingan wali kelas dan guru BK');
  const [parentNotified, setParentNotified] = useState(false);
  const [notes, setNotes] = useState('');

  // Default point suggestion on category/severity change
  const handleCategoryChange = (newCat: BKCategory) => {
    setCategory(newCat);
    if (newCat === 'PRESTASI') {
      setSeverity('PRESTASI');
      setPoints(30);
    } else if (newCat === 'PELANGGARAN') {
      setSeverity('SEDANG');
      setPoints(25);
    } else {
      setSeverity('RINGAN');
      setPoints(0);
    }
  };

  const handleSeverityChange = (newSev: BKSeverity) => {
    setSeverity(newSev);
    if (newSev === 'RINGAN') setPoints(15);
    else if (newSev === 'SEDANG') setPoints(25);
    else if (newSev === 'BERAT') setPoints(50);
    else if (newSev === 'PRESTASI') setPoints(30);
  };

  const handleSubmitRecord = (e: React.FormEvent) => {
    e.preventDefault();
    const st = students.find((s) => s.id === selectedStudentId);
    if (!st || !title.trim()) return;

    const newRec: BKRecord = {
      id: `bk-${Date.now()}`,
      studentId: st.id,
      studentName: st.name,
      studentClass: st.className,
      date: new Date().toISOString().split('T')[0],
      category,
      severity,
      title,
      description,
      points: Number(points),
      isReward: category === 'PRESTASI',
      followUpAction,
      status: 'DALAM_PENANGANAN',
      counselorName: SMK_PROFILE.counselingHead,
      parentNotified,
      notes,
    };

    onAddBKRecord(newRec);
    setShowAddModal(false);
    setTitle('');
    setDescription('');
    setNotes('');
  };

  // Filtered records
  const filteredRecords = bkRecords.filter((r) => {
    if (selectedFilter === 'PELANGGARAN' && r.category !== 'PELANGGARAN') return false;
    if (selectedFilter === 'PRESTASI' && r.category !== 'PRESTASI') return false;
    if (selectedFilter === 'KONSELING' && !['KONSELING_KARIR', 'KONSELING_PRIBADI', 'HOME_VISIT'].includes(r.category))
      return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = r.studentName.toLowerCase().includes(q);
      const matchTitle = r.title.toLowerCase().includes(q);
      const matchClass = r.studentClass.toLowerCase().includes(q);
      if (!matchName && !matchTitle && !matchClass) return false;
    }
    return true;
  });

  // Calculate top students by points
  const studentPointsMap = new Map<string, { student: Student; eval: ReturnType<typeof evaluateBKRecords> }>();
  for (const st of students) {
    const records = bkRecords.filter((b) => b.studentId === st.id);
    if (records.length > 0) {
      studentPointsMap.set(st.id, {
        student: st,
        eval: evaluateBKRecords(records),
      });
    }
  }

  const studentsWithViolations = Array.from(studentPointsMap.values())
    .filter((v) => v.eval.effectivePoint > 0)
    .sort((a, b) => b.eval.effectivePoint - a.eval.effectivePoint);

  return (
    <div className="space-y-6">
      {/* View Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <ShieldAlert className="w-5 h-5 text-rose-600" />
            Bimbingan Konseling (BK) &amp; Poin Kedisiplinan Siswa
          </h2>
          <p className="text-xs text-slate-500">
            Pencatatan pelanggaran tata tertib bengkel &amp; sekolah, penghargaan prestasi lomba, bimbingan karir, serta penerbitan SP.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-rose-600 text-white text-xs font-bold hover:bg-rose-700 shadow-sm transition-all"
          >
            <PlusCircle className="w-4 h-4" />
            + Catat Kasus / Prestasi / BK
          </button>
        </div>
      </div>

      {/* Rules Breakdown & Top Attention Panel */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Rules & Warning Thresholds */}
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
          <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 text-amber-500" />
            Jenjang Sanksi Poin Kedisiplinan SMK
          </h3>
          <p className="text-[11px] text-slate-500">
            Sesuai Buku Pedoman Tata Tertib &amp; K3LH SMK Negeri 1 Nusantara:
          </p>
          <div className="space-y-2 text-xs">
            <div className="flex items-center justify-between p-2 rounded-lg bg-blue-50 border border-blue-200">
              <span className="font-semibold text-blue-900">15 - 29 Poin</span>
              <span className="text-blue-800 text-[11px]">Peringatan Lisan &amp; Literasi</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-yellow-50 border border-yellow-200">
              <span className="font-semibold text-yellow-900">30 - 54 Poin</span>
              <span className="text-yellow-800 text-[11px]">Peringatan Tertulis I (SP1)</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-amber-50 border border-amber-200">
              <span className="font-semibold text-amber-900">55 - 79 Poin</span>
              <span className="text-amber-800 text-[11px]">SP2 &amp; Panggilan Orang Tua</span>
            </div>
            <div className="flex items-center justify-between p-2 rounded-lg bg-rose-50 border border-rose-200">
              <span className="font-semibold text-rose-900">&gt;= 80 - 100 Poin</span>
              <span className="text-rose-800 text-[11px] font-bold">SP3 / Konferensi Kasus Pleno</span>
            </div>
          </div>
          <div className="text-[11px] text-emerald-700 bg-emerald-50 p-2.5 rounded-lg border border-emerald-200 flex items-start gap-1.5">
            <Award className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
            <span>
              <strong>Poin Reward:</strong> Prestasi juara LKS atau sertifikasi BNSP dapat mereduksi beban poin pelanggaran s/d 50%.
            </span>
          </div>
        </div>

        {/* Siswa Perlu Atensi Mendesak */}
        <div className="lg:col-span-2 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center justify-between">
            <span className="flex items-center gap-2">
              <Users className="w-4 h-4 text-rose-600" /> Siswa dengan Akumulasi Poin Pelanggaran
            </span>
            <span className="text-xs text-slate-500 font-normal">
              Urutan tertinggi ke terendah
            </span>
          </h3>

          <div className="space-y-2">
            {studentsWithViolations.length === 0 ? (
              <div className="p-4 text-center text-slate-400 text-xs">
                Tidak ada siswa dengan catatan poin pelanggaran aktif.
              </div>
            ) : (
              studentsWithViolations.map(({ student, eval: ev }) => (
                <div
                  key={student.id}
                  className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs"
                >
                  <div className="flex items-center gap-3">
                    <img
                      src={student.photoUrl}
                      alt={student.name}
                      className="w-10 h-10 rounded-full object-cover ring-1 ring-slate-300 shrink-0"
                    />
                    <div>
                      <div className="font-bold text-slate-900">{student.name}</div>
                      <div className="text-[11px] text-slate-500">
                        {student.className} • NISN: {student.nisn} • Wali: {student.parentName}
                      </div>
                      <div className="text-[10px] text-rose-600 font-medium mt-0.5">
                        {ev.recommendation}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center">
                    <div className="text-right">
                      <div className="font-bold text-rose-700 text-sm">
                        {ev.effectivePoint} Poin
                      </div>
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold border ${ev.badgeColor}`}>
                        {ev.warningLevel.replace('_', ' ')}
                      </span>
                    </div>
                    {ev.effectivePoint >= 30 && (
                      <button
                        onClick={() => {
                          const warningTitle =
                            ev.effectivePoint >= 80 ? 'SP3 / Panggilan Ortu III' : ev.effectivePoint >= 55 ? 'SP2' : 'SP1';
                          const primaryRecord = bkRecords.find((b) => b.studentId === student.id) || bkRecords[0];
                          onPrintSP(primaryRecord, student, warningTitle);
                        }}
                        title="Cetak Surat Peringatan & Panggilan Orang Tua Resmi"
                        className="px-2.5 py-1.5 rounded-lg bg-rose-600 hover:bg-rose-700 text-white text-[11px] font-bold flex items-center gap-1"
                      >
                        <Printer className="w-3.5 h-3.5" /> Cetak SP
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Filter Kategori:
          </div>
          {[
            { id: 'ALL', label: 'Semua Catatan' },
            { id: 'PELANGGARAN', label: 'Pelanggaran Disiplin' },
            { id: 'PRESTASI', label: 'Prestasi & Reward' },
            { id: 'KONSELING', label: 'Layanan Konseling' },
          ].map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedFilter(cat.id as any)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                selectedFilter === cat.id
                  ? 'bg-rose-100 text-rose-800 border border-rose-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {cat.label}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa atau judul kasus..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-rose-500"
          />
        </div>
      </div>

      {/* BK Records Table / Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredRecords.length === 0 ? (
          <div className="col-span-2 py-8 bg-white rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            Tidak ada catatan BK yang sesuai dengan kriteria pencarian.
          </div>
        ) : (
          filteredRecords.map((r) => {
            const st = students.find((s) => s.id === r.studentId);
            return (
              <div
                key={r.id}
                className={`p-4 rounded-xl border transition-all ${
                  r.isReward
                    ? 'bg-emerald-50/40 border-emerald-200 hover:shadow-xs'
                    : r.severity === 'BERAT'
                    ? 'bg-rose-50/40 border-rose-200 hover:shadow-xs'
                    : 'bg-white border-slate-200 hover:shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    {st && (
                      <img
                        src={st.photoUrl}
                        alt={r.studentName}
                        className="w-9 h-9 rounded-full object-cover ring-1 ring-slate-200 shrink-0"
                      />
                    )}
                    <div>
                      <h4 className="font-bold text-slate-900 text-xs">{r.studentName}</h4>
                      <div className="text-[11px] text-slate-500">
                        {r.studentClass} • {r.date}
                      </div>
                    </div>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                      r.isReward
                        ? 'bg-emerald-200 text-emerald-900'
                        : r.severity === 'BERAT'
                        ? 'bg-rose-200 text-rose-900'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {r.isReward ? `+${r.points} Pts Reward` : `+${r.points} Pts Pelanggaran`}
                  </span>
                </div>

                <div className="mt-2.5">
                  <div className="font-bold text-slate-800 text-xs">{r.title}</div>
                  <p className="mt-1 text-slate-600 text-[11px] leading-relaxed">{r.description}</p>
                </div>

                <div className="mt-3 p-2 rounded bg-white/80 border border-slate-200/80 text-[11px] space-y-1">
                  <div>
                    <span className="text-slate-400">Tindak Lanjut: </span>
                    <span className="font-semibold text-slate-700">{r.followUpAction}</span>
                  </div>
                  {r.notes && (
                    <div className="text-slate-500 italic">
                      Catatan: {r.notes}
                    </div>
                  )}
                </div>

                <div className="mt-3 pt-2 border-t border-slate-200/60 flex items-center justify-between text-[11px]">
                  <span className="text-slate-400">Konselor: {r.counselorName}</span>
                  <div className="flex items-center gap-2">
                    <span
                      className={`px-2 py-0.5 rounded text-[10px] font-semibold ${
                        r.status === 'SELESAI'
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-blue-100 text-blue-800'
                      }`}
                    >
                      {r.status === 'SELESAI' ? 'Selesai' : 'Dalam Penanganan'}
                    </span>
                    {st && !r.isReward && (
                      <button
                        onClick={() => onPrintSP(r, st, 'Surat Pemanggilan BK')}
                        title="Cetak Surat Panggilan BK"
                        className="p-1 rounded text-slate-500 hover:text-rose-600"
                      >
                        <Printer className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Tambah Catatan BK Baru */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <PlusCircle className="w-5 h-5 text-rose-600" />
              Input Catatan BK / Kedisiplinan / Prestasi
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Data akan otomatis diintegrasikan dengan riwayat kedisiplinan dan syarat kelulusan siswa.
            </p>

            <form onSubmit={handleSubmitRecord} className="mt-4 space-y-3 text-xs">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Pilih Siswa *</label>
                <select
                  value={selectedStudentId}
                  onChange={(e) => setSelectedStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none font-semibold text-slate-800"
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
                  <label className="block font-semibold text-slate-700 mb-1">Kategori Layanan *</label>
                  <select
                    value={category}
                    onChange={(e) => handleCategoryChange(e.target.value as BKCategory)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    <option value="PELANGGARAN">Pelanggaran Tata Tertib</option>
                    <option value="PRESTASI">Prestasi / Penghargaan Lomba</option>
                    <option value="KONSELING_KARIR">Konseling Karir / PKL / BKK</option>
                    <option value="KONSELING_PRIBADI">Konseling Pribadi / Sosial</option>
                    <option value="HOME_VISIT">Home Visit (Kunjungan Rumah)</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tingkat Keparahan</label>
                  <select
                    value={severity}
                    onChange={(e) => handleSeverityChange(e.target.value as BKSeverity)}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  >
                    {category === 'PRESTASI' ? (
                      <option value="PRESTASI">Prestasi Akademik / Vokasi</option>
                    ) : (
                      <>
                        <option value="RINGAN">Ringan (15 Poin)</option>
                        <option value="SEDANG">Sedang (25 Poin)</option>
                        <option value="BERAT">Berat (50 Poin)</option>
                      </>
                    )}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">Judul Kejadian / Masalah *</label>
                  <input
                    type="text"
                    required
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Contoh: Terlambat masuk bengkel otomotif"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Poin Kredit</label>
                  <input
                    type="number"
                    min={0}
                    max={100}
                    value={points}
                    onChange={(e) => setPoints(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none font-bold text-center"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Deskripsi &amp; Kronologi</label>
                <textarea
                  rows={2}
                  required
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Jelaskan secara objektif kronologi kejadian atau rincian prestasi yang diraih..."
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tindak Lanjut / Sanksi / Pembinaan</label>
                <input
                  type="text"
                  value={followUpAction}
                  onChange={(e) => setFollowUpAction(e.target.value)}
                  placeholder="Contoh: Surat Peringatan I & bimbingan wali kelas"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-rose-500 focus:outline-none"
                />
              </div>

              <div className="flex items-center gap-2 pt-1">
                <input
                  type="checkbox"
                  id="parentNotify"
                  checked={parentNotified}
                  onChange={(e) => setParentNotified(e.target.checked)}
                  className="rounded border-slate-300 text-rose-600 focus:ring-rose-500"
                />
                <label htmlFor="parentNotify" className="text-slate-700 font-medium">
                  Kirim Notifikasi / Surat Pemanggilan Orang Tua
                </label>
              </div>

              <div className="pt-3 border-t border-slate-200 flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 font-bold"
                >
                  Simpan Catatan BK
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
