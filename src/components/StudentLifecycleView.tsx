import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Filter,
  Search,
  GraduationCap,
  Briefcase,
  ShieldAlert,
  Award,
  IdCard,
  ChevronRight,
  X,
  CheckCircle2,
  AlertCircle,
  FileText,
  Calendar,
  Phone,
  Mail,
  MapPin,
  ArrowRight
} from 'lucide-react';
import type {
  BKRecord,
  ClassLevel,
  GradeRecord,
  MajorCode,
  PKLPlacement,
  Student,
  StudentStatus,
  TracerStudyRecord,
  UKKRecord
} from '../types/academic.ts';
import { evaluateBKRecords } from '../utils/smkLogic.ts';

interface StudentLifecycleViewProps {
  students: Student[];
  bkRecords: BKRecord[];
  grades: GradeRecord[];
  ukkRecords: UKKRecord[];
  pklPlacements: PKLPlacement[];
  tracers: TracerStudyRecord[];
  onAddStudent: (newStudent: Student) => void;
  onUpdateStudent: (updatedStudent: Student) => void;
  onPrintStudentCard: (student: Student) => void;
  selectedStudent: Student | null;
  onSelectStudent: (student: Student | null) => void;
}

export const StudentLifecycleView: React.FC<StudentLifecycleViewProps> = ({
  students,
  bkRecords,
  grades,
  ukkRecords,
  pklPlacements,
  tracers,
  onAddStudent,
  onUpdateStudent,
  onPrintStudentCard,
  selectedStudent,
  onSelectStudent,
}) => {
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [drawerActiveTab, setDrawerActiveTab] = useState<'bio' | 'grades' | 'bk' | 'pkl' | 'alumni'>('bio');

  // Form state for adding new student / PPDB
  const [formData, setFormData] = useState({
    name: '',
    nisn: '',
    nik: '',
    gender: 'L' as 'L' | 'P',
    birthPlace: '',
    birthDate: '2008-01-01',
    classLevel: 'PPDB' as ClassLevel,
    major: 'RPL' as MajorCode,
    className: 'Calon X-RPL',
    status: 'CALON' as StudentStatus,
    academicYear: '2026/2027',
    email: '',
    phone: '',
    parentName: '',
    parentPhone: '',
    address: '',
    sppStatus: 'LUNAS' as 'LUNAS' | 'MENUNGGAK_1_BULAN' | 'MENUNGGAK_2_BULAN' | 'BEASISWA',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  // Filter students
  const filteredStudents = students.filter((s) => {
    if (selectedLevel !== 'ALL' && s.classLevel !== selectedLevel) return false;
    if (selectedMajor !== 'ALL' && s.major !== selectedMajor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = s.name.toLowerCase().includes(q);
      const matchNisn = s.nisn.includes(q);
      const matchClass = s.className.toLowerCase().includes(q);
      if (!matchName && !matchNisn && !matchClass) return false;
    }
    return true;
  });

  const handleCreateStudent = (e: React.FormEvent) => {
    e.preventDefault();
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Nama lengkap wajib diisi';
    if (!formData.nisn.trim() || formData.nisn.length < 8) errors.nisn = 'NISN valid minimal 8 digit';
    if (!formData.nik.trim() || formData.nik.length < 12) errors.nik = 'NIK valid minimal 12 digit';
    if (!formData.parentName.trim()) errors.parentName = 'Nama Orang Tua/Wali wajib diisi';
    if (!formData.address.trim()) errors.address = 'Alamat tempat tinggal wajib diisi';

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    const newStudent: Student = {
      id: `std-${Date.now()}`,
      ...formData,
      photoUrl:
        formData.gender === 'L'
          ? 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=200&fit=crop&q=80'
          : 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=200&fit=crop&q=80',
      admissionDate: new Date().toISOString().split('T')[0],
      attendance: { hadir: 0, sakit: 0, izin: 0, alpa: 0 },
    };

    onAddStudent(newStudent);
    setShowAddModal(false);
    // Reset form
    setFormData({
      name: '',
      nisn: '',
      nik: '',
      gender: 'L',
      birthPlace: '',
      birthDate: '2008-01-01',
      classLevel: 'PPDB',
      major: 'RPL',
      className: 'Calon X-RPL',
      status: 'CALON',
      academicYear: '2026/2027',
      email: '',
      phone: '',
      parentName: '',
      parentPhone: '',
      address: '',
      sppStatus: 'LUNAS',
    });
    setFormErrors({});
  };

  // Helper for status badge
  const getStatusBadge = (status: StudentStatus, level: ClassLevel) => {
    if (status === 'CALON') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-100 text-blue-800 border border-blue-200">
          PPDB (Calon)
        </span>
      );
    }
    if (status === 'LULUS') {
      return (
        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-purple-100 text-purple-800 border border-purple-200">
          Alumni / Lulus
        </span>
      );
    }
    return (
      <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200">
        Aktif (Kelas {level})
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* View Header with Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <Users className="w-5 h-5 text-blue-600" />
            Lifecycle &amp; Data Induk Siswa SMK
          </h2>
          <p className="text-xs text-slate-500">
            Pelacakan perjalanan siswa dari seleksi PPDB, pembelajaran Kelas X-XII, PKL industri, hingga berstatus Alumni.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-3.5 py-2 rounded-lg bg-blue-600 text-white text-xs font-bold hover:bg-blue-700 shadow-sm transition-all"
          >
            <UserPlus className="w-4 h-4" />
            + Pendaftaran Siswa (PPDB)
          </button>
        </div>
      </div>

      {/* Stage Tabs Navigation */}
      <div className="flex flex-wrap items-center gap-2 pb-1">
        {[
          { id: 'ALL', label: 'Semua Tahap', count: students.length },
          { id: 'PPDB', label: 'Calon Siswa (PPDB)', count: students.filter((s) => s.classLevel === 'PPDB').length },
          { id: 'X', label: 'Tingkat X (Fase E)', count: students.filter((s) => s.classLevel === 'X').length },
          { id: 'XI', label: 'Tingkat XI (Fase F - PKL)', count: students.filter((s) => s.classLevel === 'XI').length },
          { id: 'XII', label: 'Tingkat XII (UKK/Kelulusan)', count: students.filter((s) => s.classLevel === 'XII').length },
          { id: 'ALUMNI', label: 'Alumni (Tracer Study)', count: students.filter((s) => s.classLevel === 'ALUMNI').length },
        ].map((lvl) => (
          <button
            key={lvl.id}
            onClick={() => setSelectedLevel(lvl.id)}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all flex items-center gap-1.5 ${
              selectedLevel === lvl.id
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-white text-slate-600 hover:bg-slate-100 border border-slate-200'
            }`}
          >
            <span>{lvl.label}</span>
            <span
              className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                selectedLevel === lvl.id ? 'bg-white/20 text-white' : 'bg-slate-100 text-slate-700'
              }`}
            >
              {lvl.count}
            </span>
          </button>
        ))}
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200/90 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5 text-slate-400" /> Jurusan:
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
              {maj === 'ALL' ? 'Semua Keahlian' : maj}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari nama, NISN, kelas..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200/90 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-slate-600">
            <thead className="bg-slate-50/80 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Siswa</th>
                <th className="py-3 px-4">NISN / NIK</th>
                <th className="py-3 px-4">Jurusan &amp; Rombel</th>
                <th className="py-3 px-4">Tahap Lifecycle</th>
                <th className="py-3 px-4">Kehadiran</th>
                <th className="py-3 px-4">Status SPP</th>
                <th className="py-3 px-4 text-right">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200/80">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-slate-400">
                    Tidak ada data siswa yang cocok dengan filter.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((s) => {
                  const totalAbsence = s.attendance.hadir + s.attendance.sakit + s.attendance.izin + s.attendance.alpa;
                  const hadirPct = totalAbsence > 0 ? Math.round((s.attendance.hadir / totalAbsence) * 100) : 100;

                  return (
                    <tr
                      key={s.id}
                      onClick={() => onSelectStudent(s)}
                      className="hover:bg-blue-50/40 transition-colors cursor-pointer"
                    >
                      <td className="py-3 px-4 flex items-center gap-3">
                        <img
                          src={s.photoUrl}
                          alt={s.name}
                          className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                        />
                        <div>
                          <div className="font-bold text-slate-900 hover:text-blue-600 transition-colors">
                            {s.name}
                          </div>
                          <div className="text-[11px] text-slate-400 flex items-center gap-2">
                            <span>{s.gender === 'L' ? 'Laki-laki' : 'Perempuan'}</span>
                            <span>•</span>
                            <span>{s.email}</span>
                          </div>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono text-slate-800">
                        <div>{s.nisn}</div>
                        <div className="text-[10px] text-slate-400">{s.nik}</div>
                      </td>
                      <td className="py-3 px-4">
                        <span className="font-semibold text-slate-900">{s.className}</span>
                        <div className="text-[11px] text-slate-500 font-medium">{s.major}</div>
                      </td>
                      <td className="py-3 px-4">
                        {getStatusBadge(s.status, s.classLevel)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2">
                          <div className="w-16 bg-slate-200 h-1.5 rounded-full overflow-hidden">
                            <div
                              style={{ width: `${hadirPct}%` }}
                              className={`h-full ${
                                hadirPct >= 90 ? 'bg-emerald-500' : hadirPct >= 75 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                            />
                          </div>
                          <span className="text-[11px] font-semibold text-slate-700">{hadirPct}%</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        {s.sppStatus === 'LUNAS' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
                            Lunas
                          </span>
                        )}
                        {s.sppStatus === 'BEASISWA' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-blue-50 text-blue-700 border border-blue-200">
                            Beasiswa Penuh
                          </span>
                        )}
                        {s.sppStatus === 'MENUNGGAK_1_BULAN' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-amber-50 text-amber-700 border border-amber-200">
                            Tunggakan 1 Bln
                          </span>
                        )}
                        {s.sppStatus === 'MENUNGGAK_2_BULAN' && (
                          <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-rose-50 text-rose-700 border border-rose-200">
                            Tunggakan 2 Bln
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onPrintStudentCard(s);
                            }}
                            title="Cetak Kartu Tanda Pelajar SMK"
                            className="p-1.5 rounded-lg text-slate-600 hover:text-blue-600 hover:bg-blue-50 transition-colors"
                          >
                            <IdCard className="w-4 h-4" />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              onSelectStudent(s);
                            }}
                            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          >
                            <ChevronRight className="w-4 h-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal: Pendaftaran Siswa Baru / PPDB */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white rounded-2xl max-w-xl w-full p-6 shadow-2xl relative">
            <button
              onClick={() => setShowAddModal(false)}
              className="absolute top-4 right-4 text-slate-400 hover:text-slate-700"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <UserPlus className="w-5 h-5 text-blue-600" />
              Pendaftaran Siswa Baru (PPDB SMK)
            </h3>
            <p className="text-xs text-slate-500 mt-1">
              Input data calon siswa untuk penempatan rombel dan seleksi kejuruan.
            </p>

            <form onSubmit={handleCreateStudent} className="mt-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Lengkap *</label>
                  <input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: Raditya Pratama"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {formErrors.name && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.name}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as 'L' | 'P' })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="L">Laki-laki (L)</option>
                    <option value="P">Perempuan (P)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NISN (10 Digit) *</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="0081234567"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                  {formErrors.nisn && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.nisn}</p>}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">NIK (16 Digit) *</label>
                  <input
                    type="text"
                    value={formData.nik}
                    onChange={(e) => setFormData({ ...formData, nik: e.target.value })}
                    placeholder="320101..."
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-mono"
                  />
                  {formErrors.nik && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.nik}</p>}
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Pilihan Konsentrasi Keahlian *</label>
                  <select
                    value={formData.major}
                    onChange={(e) => {
                      const m = e.target.value as MajorCode;
                      setFormData({
                        ...formData,
                        major: m,
                        className: `Calon X-${m}`,
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none font-semibold text-blue-900"
                  >
                    <option value="RPL">RPL - Rekayasa Perangkat Lunak</option>
                    <option value="TKJ">TKJ - Teknik Komputer &amp; Jaringan</option>
                    <option value="TKRO">TKRO - Teknik Kendaraan Ringan Otomotif</option>
                    <option value="DKV">DKV - Desain Komunikasi Visual</option>
                    <option value="AKL">AKL - Akuntansi &amp; Keuangan Lembaga</option>
                  </select>
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Tahap Lifecycle Masuk</label>
                  <select
                    value={formData.classLevel}
                    onChange={(e) => {
                      const lvl = e.target.value as ClassLevel;
                      setFormData({
                        ...formData,
                        classLevel: lvl,
                        status: lvl === 'PPDB' ? 'CALON' : 'AKTIF',
                      });
                    }}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  >
                    <option value="PPDB">Calon Siswa (PPDB)</option>
                    <option value="X">Langsung Siswa Aktif (Kelas X)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Nama Orang Tua/Wali *</label>
                  <input
                    type="text"
                    value={formData.parentName}
                    onChange={(e) => setFormData({ ...formData, parentName: e.target.value })}
                    placeholder="Nama Ayah / Ibu"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                  {formErrors.parentName && (
                    <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.parentName}</p>
                  )}
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">No. HP Orang Tua / WA</label>
                  <input
                    type="text"
                    value={formData.parentPhone}
                    onChange={(e) => setFormData({ ...formData, parentPhone: e.target.value })}
                    placeholder="081234567890"
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                  />
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Alamat Lengkap *</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Jl. Nama Jalan, No. Rumah, RT/RW, Kelurahan, Kota"
                  className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
                {formErrors.address && <p className="text-rose-500 text-[10px] mt-0.5">{formErrors.address}</p>}
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
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold"
                >
                  Simpan Calon Siswa
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Student Detail Drawer / Modal */}
      {selectedStudent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex justify-end">
          <div className="bg-white w-full max-w-2xl h-full shadow-2xl flex flex-col overflow-hidden animate-in slide-in-from-right duration-200">
            {/* Drawer Header */}
            <div className="p-5 border-b border-slate-200 bg-slate-900 text-white flex items-center justify-between">
              <div className="flex items-center gap-3">
                <img
                  src={selectedStudent.photoUrl}
                  alt={selectedStudent.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-blue-500"
                />
                <div>
                  <h3 className="text-base font-bold text-white">{selectedStudent.name}</h3>
                  <div className="text-xs text-slate-300 flex items-center gap-2">
                    <span>{selectedStudent.className}</span>
                    <span>•</span>
                    <span>NISN: {selectedStudent.nisn}</span>
                    <span>•</span>
                    <span className="font-semibold text-emerald-400">{selectedStudent.major}</span>
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => onPrintStudentCard(selectedStudent)}
                  className="px-2.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white text-xs font-semibold flex items-center gap-1.5"
                >
                  <IdCard className="w-3.5 h-3.5" /> Cetak Kartu Pelajar
                </button>
                <button
                  onClick={() => onSelectStudent(null)}
                  className="p-1.5 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Drawer Tabs */}
            <div className="flex border-b border-slate-200 bg-slate-50 px-4 text-xs font-semibold overflow-x-auto">
              <button
                onClick={() => setDrawerActiveTab('bio')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  drawerActiveTab === 'bio'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Biodata &amp; Profil
              </button>
              <button
                onClick={() => setDrawerActiveTab('grades')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  drawerActiveTab === 'grades'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Rapor &amp; UKK
              </button>
              <button
                onClick={() => setDrawerActiveTab('bk')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  drawerActiveTab === 'bk'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Catatan BK ({bkRecords.filter((b) => b.studentId === selectedStudent.id).length})
              </button>
              <button
                onClick={() => setDrawerActiveTab('pkl')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  drawerActiveTab === 'pkl'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                PKL Industri
              </button>
              <button
                onClick={() => setDrawerActiveTab('alumni')}
                className={`py-3 px-3 border-b-2 whitespace-nowrap transition-colors ${
                  drawerActiveTab === 'alumni'
                    ? 'border-blue-600 text-blue-600'
                    : 'border-transparent text-slate-600 hover:text-slate-900'
                }`}
              >
                Kelulusan &amp; Tracer
              </button>
            </div>

            {/* Drawer Body Content */}
            <div className="p-6 overflow-y-auto flex-1 text-xs space-y-4">
              {/* Tab 1: Biodata */}
              {drawerActiveTab === 'bio' && (
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200">
                    <div>
                      <span className="text-slate-400 block font-medium">Status Siswa</span>
                      <span className="font-bold text-slate-900 text-sm">
                        {selectedStudent.status === 'AKTIF'
                          ? `Siswa Aktif (Tingkat ${selectedStudent.classLevel})`
                          : selectedStudent.status}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Konsentrasi Keahlian</span>
                      <span className="font-bold text-blue-700 text-sm">{selectedStudent.major}</span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Tempat, Tanggal Lahir</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.birthPlace}, {selectedStudent.birthDate}
                      </span>
                    </div>
                    <div>
                      <span className="text-slate-400 block font-medium">Jenis Kelamin</span>
                      <span className="font-semibold text-slate-800">
                        {selectedStudent.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Phone className="w-4 h-4 text-blue-600" /> Kontak &amp; Alamat Domisili
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block">No. Telepon / WA Siswa</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.phone || '-'}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">Email Akun Sekolah</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.email}</span>
                      </div>
                    </div>
                    <div className="pt-2">
                      <span className="text-slate-400 block">Alamat Rumah</span>
                      <span className="font-semibold text-slate-800">{selectedStudent.address}</span>
                    </div>
                  </div>

                  <div className="p-4 rounded-xl bg-white border border-slate-200 space-y-2.5">
                    <h4 className="font-bold text-slate-900 flex items-center gap-2">
                      <Users className="w-4 h-4 text-emerald-600" /> Data Orang Tua / Wali
                    </h4>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <span className="text-slate-400 block">Nama Wali / Orang Tua</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.parentName}</span>
                      </div>
                      <div>
                        <span className="text-slate-400 block">No. HP Wali</span>
                        <span className="font-semibold text-slate-800">{selectedStudent.parentPhone || '-'}</span>
                      </div>
                    </div>
                  </div>

                  {/* Transition Lifecycle Actions */}
                  <div className="p-4 rounded-xl bg-blue-50/70 border border-blue-200 space-y-2">
                    <h4 className="font-bold text-blue-900 flex items-center gap-1.5">
                      <ArrowRight className="w-4 h-4" /> Manajemen Lifecycle Siswa
                    </h4>
                    <p className="text-blue-700 text-[11px]">
                      Ubah tahapan lifecycle siswa saat terjadi promosi naik kelas atau lulus seleksi PPDB:
                    </p>
                    <div className="flex flex-wrap gap-2 pt-1">
                      {selectedStudent.status === 'CALON' && (
                        <button
                          onClick={() => {
                            onUpdateStudent({
                              ...selectedStudent,
                              status: 'AKTIF',
                              classLevel: 'X',
                              className: `X ${selectedStudent.major} 1`,
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
                        >
                          Diterima Menjadi Siswa Aktif (Kelas X)
                        </button>
                      )}
                      {selectedStudent.classLevel === 'X' && (
                        <button
                          onClick={() => {
                            onUpdateStudent({
                              ...selectedStudent,
                              classLevel: 'XI',
                              className: `XI ${selectedStudent.major} 1`,
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-bold"
                        >
                          Naik ke Kelas XI (Fase PKL)
                        </button>
                      )}
                      {selectedStudent.classLevel === 'XI' && (
                        <button
                          onClick={() => {
                            onUpdateStudent({
                              ...selectedStudent,
                              classLevel: 'XII',
                              className: `XII ${selectedStudent.major} 1`,
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-bold"
                        >
                          Naik ke Kelas XII (Fase UKK &amp; Kelulusan)
                        </button>
                      )}
                      {selectedStudent.classLevel === 'XII' && (
                        <button
                          onClick={() => {
                            onUpdateStudent({
                              ...selectedStudent,
                              status: 'LULUS',
                              classLevel: 'ALUMNI',
                              graduationDate: new Date().toISOString().split('T')[0],
                              className: `Lulusan (Alumni ${selectedStudent.major})`,
                            });
                          }}
                          className="px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white font-bold"
                        >
                          Nyatakan Lulus (Pindah ke Data Alumni)
                        </button>
                      )}
                    </div>
                  </div>
                </div>
              )}

              {/* Tab 2: Grades & UKK */}
              {drawerActiveTab === 'grades' && (
                <div className="space-y-4">
                  <h4 className="font-bold text-slate-900">Nilai Rapor Kurikulum Merdeka</h4>
                  {grades.filter((g) => g.studentId === selectedStudent.id).length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-center">
                      Belum ada entri nilai rapor untuk siswa ini.
                    </div>
                  ) : (
                    <div className="space-y-2">
                      {grades
                        .filter((g) => g.studentId === selectedStudent.id)
                        .map((grd) => (
                          <div key={grd.id} className="p-3 bg-white border border-slate-200 rounded-lg">
                            <div className="flex justify-between items-start">
                              <div>
                                <span className="font-bold text-slate-900">{grd.subjectName}</span>
                                <span className="ml-2 px-1.5 py-0.5 rounded text-[10px] bg-slate-100 text-slate-700">
                                  {grd.category}
                                </span>
                              </div>
                              <div className="text-right">
                                <span className="text-base font-bold text-blue-600">{grd.finalScore}</span>
                                <span className="ml-1 font-semibold text-slate-500">({grd.letterGrade})</span>
                              </div>
                            </div>
                            <p className="mt-1 text-[11px] text-slate-500">{grd.competencyAchievement}</p>
                          </div>
                        ))}
                    </div>
                  )}

                  <h4 className="font-bold text-slate-900 pt-3 border-t border-slate-200">
                    Uji Kompetensi Keahlian (UKK / LSP P1)
                  </h4>
                  {ukkRecords.filter((u) => u.studentId === selectedStudent.id).length === 0 ? (
                    <div className="p-4 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-center">
                      Belum melaksanakan Uji Kompetensi Keahlian (UKK).
                    </div>
                  ) : (
                    ukkRecords
                      .filter((u) => u.studentId === selectedStudent.id)
                      .map((u) => (
                        <div key={u.id} className="p-3 bg-emerald-50/50 border border-emerald-200 rounded-lg">
                          <div className="flex justify-between items-start">
                            <div>
                              <div className="font-bold text-emerald-950">{u.schemeTitle}</div>
                              <div className="text-[11px] text-emerald-700">
                                Asesor DU/DI: {u.externalAssessor} ({u.assessorCompany})
                              </div>
                            </div>
                            <span className="px-2 py-0.5 rounded font-bold bg-emerald-200 text-emerald-900">
                              {u.predicate} ({u.finalScore})
                            </span>
                          </div>
                          {u.certificateNo && (
                            <div className="mt-2 text-[10px] font-mono text-slate-600 bg-white p-1 rounded border border-emerald-200">
                              No. Sertifikat BNSP: {u.certificateNo}
                            </div>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* Tab 3: BK Records */}
              {drawerActiveTab === 'bk' && (
                <div className="space-y-3">
                  {(() => {
                    const studentBK = bkRecords.filter((b) => b.studentId === selectedStudent.id);
                    const evalBK = evaluateBKRecords(studentBK);
                    return (
                      <>
                        <div className="p-3 rounded-lg border border-slate-200 bg-slate-50 flex items-center justify-between">
                          <div>
                            <span className="text-slate-500">Akumulasi Poin Pelanggaran:</span>
                            <div className="text-base font-bold text-slate-900">
                              {evalBK.effectivePoint} Poin Efektif
                            </div>
                          </div>
                          <span className={`px-2.5 py-1 rounded-md text-xs font-bold border ${evalBK.badgeColor}`}>
                            Status: {evalBK.warningLevel}
                          </span>
                        </div>

                        {studentBK.length === 0 ? (
                          <div className="p-4 text-center text-slate-400 bg-slate-50 rounded-lg">
                            Catatan bersih, tidak ada pelanggaran atau kasus tercatat.
                          </div>
                        ) : (
                          studentBK.map((r) => (
                            <div
                              key={r.id}
                              className={`p-3 rounded-lg border ${
                                r.isReward
                                  ? 'bg-emerald-50/60 border-emerald-200'
                                  : 'bg-white border-slate-200'
                              }`}
                            >
                              <div className="flex items-center justify-between">
                                <span className="font-bold text-slate-900">{r.title}</span>
                                <span
                                  className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                                    r.isReward
                                      ? 'bg-emerald-200 text-emerald-900'
                                      : 'bg-rose-100 text-rose-800'
                                  }`}
                                >
                                  {r.isReward ? `+${r.points} Poin Reward` : `+${r.points} Poin Pelanggaran`}
                                </span>
                              </div>
                              <p className="mt-1 text-slate-600 text-[11px]">{r.description}</p>
                              <div className="mt-2 text-[10px] text-slate-400 flex items-center justify-between">
                                <span>Konselor: {r.counselorName}</span>
                                <span>{r.date}</span>
                              </div>
                            </div>
                          ))
                        )}
                      </>
                    );
                  })()}
                </div>
              )}

              {/* Tab 4: PKL */}
              {drawerActiveTab === 'pkl' && (
                <div className="space-y-3">
                  {pklPlacements.filter((p) => p.studentId === selectedStudent.id).length === 0 ? (
                    <div className="p-4 text-center text-slate-500 bg-slate-50 rounded-lg">
                      Siswa belum memiliki penempatan PKL (Praktik Kerja Lapangan).
                    </div>
                  ) : (
                    pklPlacements
                      .filter((p) => p.studentId === selectedStudent.id)
                      .map((p) => (
                        <div key={p.id} className="p-4 bg-white border border-slate-200 rounded-xl space-y-2">
                          <div className="flex justify-between items-start">
                            <div>
                              <h4 className="font-bold text-slate-900">{p.companyName}</h4>
                              <p className="text-[11px] text-slate-500">{p.companyAddress}</p>
                            </div>
                            <span
                              className={`px-2 py-0.5 rounded font-bold text-[10px] ${
                                p.status === 'BERJALAN'
                                  ? 'bg-blue-100 text-blue-800'
                                  : 'bg-emerald-100 text-emerald-800'
                              }`}
                            >
                              Status: {p.status}
                            </span>
                          </div>
                          <div className="grid grid-cols-2 gap-2 text-[11px] pt-1">
                            <div>
                              <span className="text-slate-400 block">Pembimbing Industri:</span>
                              <span className="font-semibold text-slate-800">{p.industryMentor}</span>
                            </div>
                            <div>
                              <span className="text-slate-400 block">Guru Pembimbing:</span>
                              <span className="font-semibold text-slate-800">{p.schoolSupervisor}</span>
                            </div>
                          </div>
                          <div className="p-2.5 rounded bg-slate-50 border border-slate-200 flex justify-between items-center text-xs">
                            <span className="font-semibold text-slate-700">Nilai Akhir PKL DU/DI:</span>
                            <span className="font-bold text-emerald-700 text-sm">
                              {p.finalScore > 0 ? `${p.finalScore} (${p.predicate})` : 'Belum Dinilai'}
                            </span>
                          </div>
                          {p.industryFeedback && (
                            <p className="text-[11px] italic text-slate-600 bg-blue-50/50 p-2 rounded">
                              &ldquo;{p.industryFeedback}&rdquo;
                            </p>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}

              {/* Tab 5: Alumni & Tracer */}
              {drawerActiveTab === 'alumni' && (
                <div className="space-y-3">
                  <div className="p-4 bg-slate-50 rounded-xl border border-slate-200">
                    <span className="text-slate-500 block">Status Kelulusan</span>
                    <span className="font-bold text-sm text-slate-900">
                      {selectedStudent.status === 'LULUS'
                        ? `LULUS - Tanggal: ${selectedStudent.graduationDate}`
                        : 'Belum Lulus / Dalam Tahap Studi'}
                    </span>
                  </div>

                  {tracers.filter((t) => t.studentId === selectedStudent.id).length === 0 ? (
                    <div className="p-4 text-center text-slate-500 bg-white border border-dashed border-slate-300 rounded-lg">
                      Belum mengisi instrumen kuesioner Tracer Study (BMW).
                    </div>
                  ) : (
                    tracers
                      .filter((t) => t.studentId === selectedStudent.id)
                      .map((trc) => (
                        <div key={trc.id} className="p-4 bg-purple-50/50 border border-purple-200 rounded-xl space-y-2">
                          <div className="flex justify-between items-center">
                            <span className="font-bold text-purple-950">Status BMW: {trc.statusBMW}</span>
                            <span className="text-[10px] text-purple-700 font-medium">
                              Tgl Lapor: {trc.submittedAt}
                            </span>
                          </div>
                          <div className="text-xs">
                            <div className="font-semibold text-slate-800">
                              {trc.institutionOrCompanyName}
                            </div>
                            <div className="text-slate-600 text-[11px]">
                              Posisi / Program: {trc.positionOrFieldOrMajor}
                            </div>
                            <div className="text-slate-600 text-[11px]">
                              Rentang Penghasilan: <strong>{trc.monthlyIncome}</strong>
                            </div>
                            <div className="text-emerald-700 font-semibold text-[11px] mt-1">
                              Keselarasan Kurikulum: {trc.curriculumRelevance.replace('_', ' ')}
                            </div>
                          </div>
                          {trc.feedbackToSmk && (
                            <p className="text-[11px] italic text-slate-600 border-t border-purple-200 pt-2">
                              &ldquo;{trc.feedbackToSmk}&rdquo;
                            </p>
                          )}
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
