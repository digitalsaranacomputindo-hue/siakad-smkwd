import React from 'react';
import {
  Users,
  Briefcase,
  ShieldAlert,
  Award,
  TrendingUp,
  ArrowUpRight,
  AlertTriangle,
  Building2,
  CheckCircle2,
  BookOpen,
  Compass,
  Smile,
  GraduationCap
} from 'lucide-react';
import type {
  BKRecord,
  IndustryPartner,
  MajorInfo,
  PKLPlacement,
  Student,
  TracerStudyRecord
} from '../types/academic.ts';
import { calculateBMWStatistics, evaluateBKRecords } from '../utils/smkLogic.ts';
import type { TabKey } from './Navigation.tsx';

interface DashboardViewProps {
  students: Student[];
  bkRecords: BKRecord[];
  pklPlacements: PKLPlacement[];
  tracers: TracerStudyRecord[];
  majors: MajorInfo[];
  partners: IndustryPartner[];
  onNavigateTab: (tab: TabKey) => void;
  onSelectStudent: (student: Student) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  students,
  bkRecords,
  pklPlacements,
  tracers,
  majors,
  partners,
  onNavigateTab,
  onSelectStudent,
}) => {
  const activeStudents = students.filter((s) => s.status === 'AKTIF');
  const ppdbStudents = students.filter((s) => s.status === 'CALON');
  const alumniStudents = students.filter((s) => s.status === 'LULUS');
  const activePkl = pklPlacements.filter((p) => p.status === 'BERJALAN');

  // BMW stats
  const bmwStats = calculateBMWStatistics(tracers);

  // Critical BK cases
  const criticalBK = bkRecords.filter((b) => b.severity === 'BERAT' || b.points >= 40);

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="rounded-2xl bg-gradient-to-r from-blue-900 via-indigo-900 to-slate-900 p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-1/3 opacity-10 bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px] pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 mb-3">
            <CheckCircle2 className="w-3.5 h-3.5" /> Program Link &amp; Match SMK - DUDI Terintegrasi
          </span>
          <h2 className="text-xl sm:text-2xl font-black tracking-tight text-white">
            Pusat Komando Akademik &amp; Kesiapan Kerja Lulusan
          </h2>
          <p className="mt-2 text-sm text-slate-300 leading-relaxed">
            Pantau siklus komprehensif mulai dari seleksi <strong>PPDB</strong>, kedisiplinan <strong>BK &amp; Poin Tata Tertib</strong>, evaluasi <strong>Nilai Rapor &amp; Uji Kompetensi Keahlian (UKK)</strong>, monitoring <strong>PKL Industri 6 Bulan</strong>, hingga penetapan <strong>Kelulusan SKL</strong> dan pelacakan <strong>Tracer Study (BMW)</strong>.
          </p>
        </div>
      </div>

      {/* KPI Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Siswa */}
        <div
          onClick={() => onNavigateTab('lifecycle')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Total Siswa Terdata
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{students.length}</span>
            <span className="text-xs text-slate-500">Siswa &amp; Calon</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1.5">
            <span className="font-semibold text-blue-600">{activeStudents.length} Aktif</span>
            <span>•</span>
            <span className="font-semibold text-emerald-600">{ppdbStudents.length} PPDB</span>
            <span>•</span>
            <span className="font-semibold text-purple-600">{alumniStudents.length} Alumni</span>
          </div>
        </div>

        {/* Card 2: Siswa PKL di DU/DI */}
        <div
          onClick={() => onNavigateTab('pkl')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              PKL Industri Aktif
            </span>
            <div className="w-9 h-9 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <Briefcase className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{activePkl.length}</span>
            <span className="text-xs text-slate-500">di {partners.length} Mitra DU/DI</span>
          </div>
          <div className="mt-2 text-xs text-emerald-600 flex items-center gap-1 font-medium">
            <CheckCircle2 className="w-3.5 h-3.5" /> 100% Tercover MoU Kerjasama
          </div>
        </div>

        {/* Card 3: Catatan BK & Poin */}
        <div
          onClick={() => onNavigateTab('bk')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Bimbingan &amp; Konseling
            </span>
            <div className="w-9 h-9 rounded-lg bg-rose-50 text-rose-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{bkRecords.length}</span>
            <span className="text-xs text-slate-500">Catatan Kasus/Prestasi</span>
          </div>
          <div className="mt-2 text-xs text-slate-500 flex items-center gap-1">
            <span className="text-rose-600 font-semibold">{criticalBK.length} Perlu Atensi</span>
            <span>•</span>
            <span className="text-emerald-600 font-semibold">
              {bkRecords.filter((b) => b.isReward).length} Prestasi
            </span>
          </div>
        </div>

        {/* Card 4: Tracer BMW Rate */}
        <div
          onClick={() => onNavigateTab('tracer')}
          className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">
              Serapan BMW Lulusan
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl font-bold text-purple-700">{bmwStats.bmwAbsorptionRate}%</span>
            <span className="text-xs text-slate-500">Bekerja / Kuliah / Wirausaha</span>
          </div>
          <div className="mt-2 text-xs text-slate-600">
            Keselarasan Kejuruan: <strong className="text-emerald-600">{bmwStats.alignmentHighPct}%</strong>
          </div>
        </div>
      </div>

      {/* Grid: BMW Visual breakdown & Actionable Alerts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Column 1 & 2: Tracer Study BMW Breakdown & Program Keahlian */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tracer BMW Progress Bar */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-slate-900 flex items-center gap-2">
                  <Compass className="w-4 h-4 text-purple-600" />
                  Statistik Keterserapan Lulusan Vokasi (BMW)
                </h3>
                <p className="text-xs text-slate-500">
                  Target Nasional Ditjen Pendidikan Vokasi Kemendikbudristek: &gt; 80%
                </p>
              </div>
              <button
                onClick={() => onNavigateTab('tracer')}
                className="text-xs font-semibold text-blue-600 hover:text-blue-800 flex items-center gap-1"
              >
                Lihat Detail Tracer <ArrowUpRight className="w-3.5 h-3.5" />
              </button>
            </div>

            {/* Segmented Bar */}
            <div className="h-6 w-full rounded-lg bg-slate-100 flex overflow-hidden p-0.5 border border-slate-200">
              <div
                style={{ width: `${bmwStats.pctBekerja}%` }}
                title={`Bekerja: ${bmwStats.pctBekerja}%`}
                className="bg-blue-600 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all"
              >
                {bmwStats.pctBekerja > 10 ? `${bmwStats.pctBekerja}%` : ''}
              </div>
              <div
                style={{ width: `${bmwStats.pctMelanjutkan}%` }}
                title={`Melanjutkan: ${bmwStats.pctMelanjutkan}%`}
                className="bg-emerald-500 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all"
              >
                {bmwStats.pctMelanjutkan > 10 ? `${bmwStats.pctMelanjutkan}%` : ''}
              </div>
              <div
                style={{ width: `${bmwStats.pctWirausaha}%` }}
                title={`Wirausaha: ${bmwStats.pctWirausaha}%`}
                className="bg-amber-500 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all"
              >
                {bmwStats.pctWirausaha > 10 ? `${bmwStats.pctWirausaha}%` : ''}
              </div>
              <div
                style={{ width: `${bmwStats.pctMencariKerja}%` }}
                title={`Mencari Kerja: ${bmwStats.pctMencariKerja}%`}
                className="bg-slate-400 h-full flex items-center justify-center text-[11px] font-bold text-white transition-all"
              >
                {bmwStats.pctMencariKerja > 10 ? `${bmwStats.pctMencariKerja}%` : ''}
              </div>
            </div>

            {/* Legend & Counts */}
            <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
              <div className="flex items-center gap-2 p-2 rounded-lg bg-blue-50/70 border border-blue-100">
                <div className="w-3 h-3 rounded-full bg-blue-600 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Bekerja ({bmwStats.pctBekerja}%)</div>
                  <div className="text-slate-500">{bmwStats.countBekerja} Alumni DU/DI</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-emerald-50/70 border border-emerald-100">
                <div className="w-3 h-3 rounded-full bg-emerald-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Melanjutkan ({bmwStats.pctMelanjutkan}%)</div>
                  <div className="text-slate-500">{bmwStats.countMelanjutkan} Kuliah / PTN</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-100">
                <div className="w-3 h-3 rounded-full bg-amber-500 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Wirausaha ({bmwStats.pctWirausaha}%)</div>
                  <div className="text-slate-500">{bmwStats.countWirausaha} Mandiri / Studio</div>
                </div>
              </div>
              <div className="flex items-center gap-2 p-2 rounded-lg bg-slate-50 border border-slate-200">
                <div className="w-3 h-3 rounded-full bg-slate-400 shrink-0" />
                <div>
                  <div className="font-semibold text-slate-800">Mencari Kerja ({bmwStats.pctMencariKerja}%)</div>
                  <div className="text-slate-500">{bmwStats.countMencariKerja} Dalam Binaan BKK</div>
                </div>
              </div>
            </div>
          </div>

          {/* Program Keahlian / Konsentrasi Keahlian */}
          <div className="bg-white p-5 rounded-xl border border-slate-200/90 shadow-xs">
            <h3 className="text-sm font-bold text-slate-900 mb-3 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-blue-600" />
              5 Konsentrasi Keahlian (SMK Pusat Keunggulan)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3">
              {majors.map((m) => {
                const count = students.filter((s) => s.major === m.code).length;
                return (
                  <div
                    key={m.code}
                    className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/50 hover:bg-white hover:border-blue-300 transition-all"
                  >
                    <div className="flex items-center justify-between">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800">
                        {m.code}
                      </span>
                      <span className="text-xs font-semibold text-slate-500">
                        {count} Siswa Terdaftar
                      </span>
                    </div>
                    <h4 className="mt-2 text-sm font-bold text-slate-900">{m.name}</h4>
                    <p className="mt-1 text-xs text-slate-500 line-clamp-2">{m.description}</p>
                    <div className="mt-2 text-[11px] text-slate-400 font-medium">
                      Ka. Jurusan: {m.headOfDepartment}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* Column 3: Tindakan Mendesak & Kasus BK */}
        <div className="space-y-4">
          {/* Urgent Actions Box */}
          <div className="bg-white p-5 rounded-xl border border-rose-200/90 shadow-xs">
            <div className="flex items-center gap-2 text-rose-700 font-bold text-sm mb-3">
              <AlertTriangle className="w-4 h-4 text-rose-600" />
              Perhatian &amp; Tindakan Mendesak
            </div>
            <div className="space-y-3">
              {/* Critical BK Warning */}
              <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-xs">
                <div className="font-semibold text-rose-900">
                  {criticalBK.length} Kasus Kedisiplinan Kategori Berat
                </div>
                <p className="mt-1 text-rose-700 text-[11px]">
                  Terdapat siswa dengan akumulasi poin tinggi yang memerlukan surat panggilan orang tua atau SP.
                </p>
                <button
                  onClick={() => onNavigateTab('bk')}
                  className="mt-2 inline-flex items-center gap-1 font-bold text-rose-800 hover:text-rose-950 underline"
                >
                  Buka Modul BK &amp; Cetak SP &rarr;
                </button>
              </div>

              {/* PPDB Alert */}
              <div className="p-3 rounded-lg bg-blue-50 border border-blue-200 text-xs">
                <div className="font-semibold text-blue-900">
                  {ppdbStudents.length} Pendaftar Calon Siswa (PPDB)
                </div>
                <p className="mt-1 text-blue-700 text-[11px]">
                  Menunggu verifikasi kelengkapan berkas rapor SMP dan tes minat bakat kejuruan.
                </p>
                <button
                  onClick={() => onNavigateTab('lifecycle')}
                  className="mt-2 inline-flex items-center gap-1 font-bold text-blue-800 hover:text-blue-950 underline"
                >
                  Kelola PPDB Siswa Baru &rarr;
                </button>
              </div>

              {/* PKL Logbook Review */}
              <div className="p-3 rounded-lg bg-amber-50 border border-amber-200 text-xs">
                <div className="font-semibold text-amber-900">
                  {activePkl.length} Siswa Sedang Praktik Industri
                </div>
                <p className="mt-1 text-amber-700 text-[11px]">
                  Monitoring jurnal harian dan koordinasi bersama pembimbing DU/DI PT Telkom &amp; PT AHM.
                </p>
                <button
                  onClick={() => onNavigateTab('pkl')}
                  className="mt-2 inline-flex items-center gap-1 font-bold text-amber-800 hover:text-amber-950 underline"
                >
                  Review Jurnal PKL &rarr;
                </button>
              </div>
            </div>
          </div>

          {/* Quick Shortcuts to Student Detail */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">
              Sampel Siswa Lintas Tahap (Klik untuk Buka)
            </h4>
            <div className="space-y-2">
              {students.slice(0, 4).map((s) => (
                <div
                  key={s.id}
                  onClick={() => onSelectStudent(s)}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer border border-transparent hover:border-slate-200"
                >
                  <img
                    src={s.photoUrl}
                    alt={s.name}
                    className="w-8 h-8 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="text-xs font-semibold text-slate-900 truncate">{s.name}</div>
                    <div className="text-[11px] text-slate-500">
                      {s.className} • NISN: {s.nisn}
                    </div>
                  </div>
                  <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                    {s.classLevel}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
