import React from 'react';
import {
  GraduationCap,
  ShieldCheck,
  UserCheck,
  BookOpen,
  Briefcase,
  User,
  Search,
  RotateCcw,
  Printer,
  Sparkles,
  Sliders,
  Building2,
  FileSpreadsheet,
  Cloud,
  HelpCircle,
  Palette,
  CheckCircle2,
  Upload,
} from 'lucide-react';
import type { BrightThemeId, SchoolProfile, UserRole } from '../types/academic.ts';

interface HeaderProps {
  school: SchoolProfile;
  currentRole: UserRole;
  onRoleChange: (role: UserRole) => void;
  searchQuery: string;
  onSearchChange: (q: string) => void;
  onResetData: () => void;
  onQuickPrint: () => void;
  onOpenReportConfig: () => void;
  onOpenSchoolIdentity: () => void;
  onOpenGoogleSheets: () => void;
  onOpenInstallGuide: () => void;
  onOpenImportData?: () => void;
  onSyncFirebase: () => void;
  isFirebaseSyncing?: boolean;
  theme: BrightThemeId;
  onThemeChange: (t: BrightThemeId) => void;
}

export const Header: React.FC<HeaderProps> = ({
  school,
  currentRole,
  onRoleChange,
  searchQuery,
  onSearchChange,
  onResetData,
  onQuickPrint,
  onOpenReportConfig,
  onOpenSchoolIdentity,
  onOpenGoogleSheets,
  onOpenInstallGuide,
  onOpenImportData,
  onSyncFirebase,
  isFirebaseSyncing = false,
  theme,
  onThemeChange,
}) => {
  const roles: { id: UserRole; label: string; icon: React.ReactNode; desc: string }[] = [
    {
      id: 'ADMIN',
      label: 'Kepala Sekolah / Waka',
      icon: <ShieldCheck className="w-4 h-4 text-emerald-600" />,
      desc: 'Akses Penuh Kurikulum, Siswa & Pleno Kelulusan',
    },
    {
      id: 'GURU_BK',
      label: 'Guru BK',
      icon: <UserCheck className="w-4 h-4 text-rose-600" />,
      desc: 'Catatan Kedisiplinan, Poin Kasus & Konseling Karir',
    },
    {
      id: 'GURU_KEJURUAN',
      label: 'Guru Kejuruan / Wali',
      icon: <BookOpen className="w-4 h-4 text-blue-600" />,
      desc: 'Input Nilai Rapor Merdeka & Asesmen UKK',
    },
    {
      id: 'KOORDINATOR_PKL',
      label: 'Hubin / Koordinator PKL',
      icon: <Briefcase className="w-4 h-4 text-amber-600" />,
      desc: 'Mitra DU/DI, Penempatan & Jurnal Harian Magang',
    },
    {
      id: 'SISWA_ALUMNI',
      label: 'Portal Siswa / Alumni',
      icon: <User className="w-4 h-4 text-purple-600" />,
      desc: 'Rapor, Jurnal PKL, SKL & Kuesioner Tracer Study',
    },
  ];

  // Bright header gradient depending on chosen cheerful theme
  const getHeaderGradient = () => {
    switch (theme) {
      case 'emerald-fresh':
        return 'from-emerald-600 via-teal-600 to-cyan-600';
      case 'amber-sun':
        return 'from-amber-500 via-orange-500 to-rose-500';
      case 'violet-vibrant':
        return 'from-violet-600 via-purple-600 to-indigo-600';
      case 'sky-blue':
      default:
        return 'from-sky-500 via-blue-600 to-indigo-600';
    }
  };

  return (
    <header className="sticky top-0 z-40 shadow-lg text-white">
      {/* Top Banner Bar - Bright & Informative */}
      <div className={`bg-gradient-to-r ${getHeaderGradient()} border-b border-white/20 transition-all duration-300`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2 flex flex-wrap items-center justify-between gap-2.5 text-xs">
          {/* School Status Badges */}
          <div className="flex items-center gap-2 flex-wrap">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-white/20 backdrop-blur-xs text-white font-bold border border-white/30 shadow-xs">
              <Sparkles className="w-3 h-3 text-yellow-300 fill-yellow-300" /> {school.status || 'SMK Pusat Keunggulan'}
            </span>
            <span className="hidden sm:inline bg-white/10 px-2 py-0.5 rounded text-white/90">
              Akreditasi: <strong className="text-white">{school.accreditation || 'A'}</strong>
            </span>
            <span className="hidden md:inline bg-white/10 px-2 py-0.5 rounded text-white/90">
              NPSN: <strong className="text-white font-mono">{school.npsn || '20251945'}</strong>
            </span>

            {/* Cloud Firestore Live Status */}
            <button
              onClick={onSyncFirebase}
              title="Sinkronisasi Realtime dengan Cloud Firestore Database (siakad-smkwd-20265547)"
              className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-emerald-400/25 hover:bg-emerald-400/40 text-white font-semibold border border-emerald-300/40 shadow-xs transition-colors"
            >
              <Cloud className={`w-3.5 h-3.5 text-emerald-200 ${isFirebaseSyncing ? 'animate-pulse' : ''}`} />
              <span className="hidden lg:inline text-[11px]">Firebase Firestore:</span>
              <span className="font-mono text-[11px] font-bold">siakad-smkwd-20265547</span>
              <span className="w-2 h-2 rounded-full bg-emerald-300 animate-ping" />
            </button>
          </div>

          {/* Right Action Tools */}
          <div className="flex items-center gap-2 ml-auto text-white/90 flex-wrap">
            {/* Bright Theme Picker */}
            <div className="flex items-center bg-white/15 px-2 py-0.5 rounded-lg border border-white/20 text-[11px] gap-1.5">
              <Palette className="w-3 h-3 text-yellow-300" />
              <span className="hidden sm:inline font-medium">Warna Cerah:</span>
              <select
                aria-label="Pilih Tema Warna Cerah"
                value={theme}
                onChange={(e) => onThemeChange(e.target.value as BrightThemeId)}
                className="bg-transparent text-white font-bold text-[11px] focus:outline-none cursor-pointer"
              >
                <option value="sky-blue" className="text-slate-800">☀️ Biru Langit (Sky)</option>
                <option value="emerald-fresh" className="text-slate-800">🌿 Hijau Zamrud (Fresh)</option>
                <option value="amber-sun" className="text-slate-800">🌅 Surya Cerah (Amber)</option>
                <option value="violet-vibrant" className="text-slate-800">🔮 Violet Modern (Vibrant)</option>
              </select>
            </div>

            {/* Google Sheets Integration Button */}
            <button
              onClick={onOpenGoogleSheets}
              title="Ekspor & Sinkronisasi ke Google Sheets"
              className="flex items-center gap-1.5 text-white bg-white/20 hover:bg-white/30 backdrop-blur-xs font-bold px-2.5 py-1 rounded-lg border border-white/30 shadow-xs transition-colors"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-300" />
              <span className="hidden md:inline">Google Sheets</span>
            </button>

            {/* Import Data & Template Button */}
            <button
              onClick={onOpenImportData}
              title="Import Data Siswa, Nilai, BK, PKL dengan Template Resmi"
              className="flex items-center gap-1.5 text-white bg-white/25 hover:bg-white/35 backdrop-blur-xs font-bold px-2.5 py-1 rounded-lg border border-white/40 shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-yellow-300" />
              <span className="hidden sm:inline">Import &amp; Template</span>
            </button>

            {/* Panduan Pemasangan */}
            <button
              onClick={onOpenInstallGuide}
              title="Panduan Pemasangan & Integrasi Sistem Lengkap"
              className="flex items-center gap-1 text-white bg-white/15 hover:bg-white/25 px-2.5 py-1 rounded-lg border border-white/20 transition-colors font-semibold"
            >
              <HelpCircle className="w-3.5 h-3.5 text-yellow-200" />
              <span className="hidden sm:inline">Panduan</span>
            </button>

            {/* Quick Print */}
            <button
              onClick={onQuickPrint}
              title="Cetak Dokumen Resmi"
              className="flex items-center gap-1 text-white hover:text-white/80 transition-colors p-1"
            >
              <Printer className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Brand & School Identity Bar - Bright, Clean & Modern */}
      <div className="bg-white text-slate-800 border-b border-sky-100 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex flex-col md:flex-row md:items-center justify-between gap-3.5">
          {/* Dynamic School Logo & Title */}
          <div className="flex items-center gap-3.5">
            <div
              onClick={onOpenSchoolIdentity}
              title="Klik untuk mengubah nama dan logo sekolah"
              className="w-12 h-12 rounded-xl bg-gradient-to-tr from-sky-100 to-blue-50 border-2 border-sky-300 flex items-center justify-center shadow-md overflow-hidden shrink-0 cursor-pointer hover:border-sky-500 transition-all group"
            >
              {school.logoUrl ? (
                <img
                  src={school.logoUrl}
                  alt={school.name}
                  className="w-full h-full object-contain p-1 group-hover:scale-105 transition-transform"
                />
              ) : (
                <GraduationCap className="w-7 h-7 text-sky-600 group-hover:scale-110 transition-transform" />
              )}
            </div>

            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h1 className="text-base sm:text-xl font-black tracking-tight text-slate-900 uppercase">
                  {school.name || 'SMK Negeri 1 Rekayasa Teknologi Nusantara'}
                </h1>
                <button
                  onClick={onOpenSchoolIdentity}
                  className="text-[10px] font-bold px-2 py-0.5 rounded bg-sky-100 hover:bg-sky-200 text-sky-800 border border-sky-300 transition-colors"
                >
                  Edit Sekolah &amp; Logo
                </button>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                Sistem Informasi Akademik Terpadu • Lifecycle Siswa, Nilai, BK, PKL &amp; Tracer Study (BMW)
              </p>
            </div>
          </div>

          {/* Controls: Search, Format Rapor, & Role Switcher */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Format Rapor Admin Button */}
            <button
              onClick={onOpenReportConfig}
              title="Kustomisasi Format & Desain Rapor (Admin)"
              className="flex items-center gap-1.5 text-xs font-bold text-sky-700 bg-sky-50 hover:bg-sky-100 px-3 py-1.5 rounded-lg border border-sky-200 shadow-xs transition-colors"
            >
              <Sliders className="w-3.5 h-3.5 text-sky-600" />
              <span>Format Rapor</span>
            </button>

            {/* Import Data Button */}
            <button
              onClick={onOpenImportData}
              title="Import Data Siswa, Nilai, BK, PKL & Lainnya dengan Template CSV"
              className="flex items-center gap-1.5 text-xs font-bold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 px-3 py-1.5 rounded-lg border border-emerald-200 shadow-xs transition-colors"
            >
              <Upload className="w-3.5 h-3.5 text-emerald-600" />
              <span>Import Data</span>
            </button>

            {/* Universal Search Bar */}
            <div className="relative min-w-[180px] flex-1 sm:flex-initial">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => onSearchChange(e.target.value)}
                placeholder="Cari siswa, NISN, DU/DI..."
                className="w-full bg-slate-50 text-xs text-slate-800 pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:bg-white placeholder-slate-400"
              />
            </div>

            {/* Role Switcher */}
            <div className="flex items-center gap-1.5 bg-slate-100 p-1 rounded-xl border border-slate-200">
              <span className="text-[11px] font-medium text-slate-500 pl-1.5 hidden xl:inline">
                Peran:
              </span>
              <select
                aria-label="Pilih Mode Peran Pengguna"
                value={currentRole}
                onChange={(e) => onRoleChange(e.target.value as UserRole)}
                className="bg-white text-xs font-bold text-slate-800 py-1 px-2.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-sky-500 cursor-pointer shadow-xs"
              >
                {roles.map((r) => (
                  <option key={r.id} value={r.id}>
                    {r.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
