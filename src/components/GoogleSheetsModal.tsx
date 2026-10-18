import React, { useState } from 'react';
import {
  FileSpreadsheet,
  X,
  ExternalLink,
  Download,
  Upload,
  CheckCircle2,
  AlertCircle,
  Loader2,
  Table,
  Layers,
  Sparkles,
  Database,
  ArrowRight,
} from 'lucide-react';
import {
  googleSignIn,
  logoutGoogle,
  getCachedAccessToken,
} from '../firebase/config.ts';
import {
  exportComprehensiveWorkbookToGoogleSheets,
  exportStudentsToGoogleSheets,
  importStudentsFromGoogleSheet,
  type ExportResult,
} from '../services/googleSheetsService.ts';
import type {
  BKRecord,
  GradeRecord,
  PKLPlacement,
  SchoolProfile,
  Student,
  TracerStudyRecord,
} from '../types/academic.ts';

interface GoogleSheetsModalProps {
  isOpen: boolean;
  onClose: () => void;
  school: SchoolProfile;
  students: Student[];
  grades: GradeRecord[];
  bkRecords: BKRecord[];
  pklPlacements: PKLPlacement[];
  tracers: TracerStudyRecord[];
  onImportStudents?: (newStudents: Partial<Student>[]) => void;
}

export const GoogleSheetsModal: React.FC<GoogleSheetsModalProps> = ({
  isOpen,
  onClose,
  school,
  students,
  grades,
  bkRecords,
  pklPlacements,
  tracers,
  onImportStudents,
}) => {
  const [activeTab, setActiveTab] = useState<'export' | 'import'>('export');
  const [isSigningIn, setIsSigningIn] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isImporting, setIsImporting] = useState(false);
  const [exportOption, setExportOption] = useState<'all' | 'students'>('all');
  const [lastExport, setLastExport] = useState<ExportResult | null>(null);
  const [importSheetId, setImportSheetId] = useState('');
  const [importRange, setImportRange] = useState('A2:R100');
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const hasToken = !!getCachedAccessToken();

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setIsSigningIn(true);
    try {
      await googleSignIn();
      setImportStatus(null);
    } catch (err: any) {
      alert(`Gagal login Google: ${err.message || err}`);
    } finally {
      setIsSigningIn(false);
    }
  };

  const handleGoogleLogout = async () => {
    await logoutGoogle();
    setLastExport(null);
  };

  const handleExport = async () => {
    setIsExporting(true);
    setLastExport(null);
    try {
      let res: ExportResult;
      if (exportOption === 'all') {
        res = await exportComprehensiveWorkbookToGoogleSheets({
          school,
          students,
          grades,
          bkRecords,
          pklPlacements,
          tracers,
        });
      } else {
        res = await exportStudentsToGoogleSheets(students, school);
      }
      setLastExport(res);
    } catch (err: any) {
      setLastExport({
        success: false,
        message: err.message || 'Gagal ekspor ke Google Sheets.',
      });
    } finally {
      setIsExporting(false);
    }
  };

  const handleImport = async () => {
    if (!importSheetId.trim()) {
      alert('Masukkan Spreadsheet ID atau URL Google Sheets terlebih dahulu.');
      return;
    }

    // Extract ID if full URL pasted
    let cleanId = importSheetId.trim();
    const match = cleanId.match(/\/d\/([a-zA-Z0-9-_]+)/);
    if (match) {
      cleanId = match[1];
    }

    setIsImporting(true);
    setImportStatus('Membaca data dari Google Sheets API...');
    try {
      const res = await importStudentsFromGoogleSheet(cleanId, importRange);
      if (res.success && res.data && res.data.length > 0) {
        onImportStudents?.(res.data);
        setImportStatus(`Berhasil mengimpor ${res.data.length} siswa ke SIAKAD!`);
      } else {
        setImportStatus(`Gagal: ${res.message}`);
      }
    } catch (err: any) {
      setImportStatus(`Gagal: ${err.message || 'Terjadi kesalahan'}`);
    } finally {
      setIsImporting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl border border-emerald-100 relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-emerald-500 to-teal-600 text-white flex items-center justify-center shadow-md shadow-emerald-500/20">
              <FileSpreadsheet className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                Integrasi Google Sheets &amp; Drive (Workspace)
              </h3>
              <p className="text-xs text-slate-500">
                Ekspor dan sinkronkan data siswa, rapor, BK, PKL, dan tracer study langsung ke akun Google Anda.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Google Authentication Box */}
        <div className="mt-4 p-4 rounded-xl border border-slate-200 bg-slate-50 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-white border border-slate-200 flex items-center justify-center shadow-xs">
              <svg className="w-5 h-5" viewBox="0 0 48 48">
                <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z" />
                <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z" />
                <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z" />
                <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z" />
              </svg>
            </div>
            <div>
              <p className="font-bold text-slate-800">
                {hasToken ? 'Akun Google Terhubung' : 'Hubungkan Akun Google Anda'}
              </p>
              <p className="text-slate-500 text-[11px]">
                {hasToken
                  ? 'Izin Google Sheets & Drive aktif untuk membuat spreadsheet di Drive Anda.'
                  : 'Masuk dengan Google untuk mengizinkan pembuatan spreadsheet.'}
              </p>
            </div>
          </div>

          <div>
            {hasToken ? (
              <button
                type="button"
                onClick={handleGoogleLogout}
                className="px-3 py-1.5 border border-slate-300 text-slate-600 hover:bg-slate-100 rounded-lg font-medium transition-colors"
              >
                Ganti Akun
              </button>
            ) : (
              <button
                type="button"
                onClick={handleGoogleLogin}
                disabled={isSigningIn}
                className="px-4 py-2 bg-white hover:bg-slate-50 text-slate-700 font-bold border border-slate-300 rounded-lg shadow-xs flex items-center gap-2 transition-all"
              >
                {isSigningIn ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-blue-600" /> Menghubungkan...
                  </>
                ) : (
                  <>
                    <span className="font-semibold">Sign in with Google</span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Tab Controls */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('export')}
            className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'export'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Download className="w-4 h-4" /> 1. Ekspor ke Google Sheets
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('import')}
            className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'import'
                ? 'border-emerald-600 text-emerald-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Upload className="w-4 h-4" /> 2. Impor Siswa dari Google Sheet
          </button>
        </div>

        {/* Tab Content: Export */}
        {activeTab === 'export' && (
          <div className="mt-4 space-y-4 text-xs">
            <div className="space-y-2.5">
              <label className="font-bold text-slate-800 block">Pilih Cakupan Ekspor:</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div
                  onClick={() => setExportOption('all')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    exportOption === 'all'
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Layers className="w-4 h-4 text-emerald-600" /> Buku Kerja Lengkap
                    </span>
                    {exportOption === 'all' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Satu Google Spreadsheet dengan 5 Tab: Siswa, Nilai Rapor, Catatan BK, PKL DU/DI, dan Tracer Study BMW.
                  </p>
                </div>

                <div
                  onClick={() => setExportOption('students')}
                  className={`p-3.5 rounded-xl border-2 transition-all cursor-pointer ${
                    exportOption === 'students'
                      ? 'border-emerald-500 bg-emerald-50/50'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-bold text-slate-900 text-sm flex items-center gap-1.5">
                      <Table className="w-4 h-4 text-emerald-600" /> Data Siswa Saja
                    </span>
                    {exportOption === 'students' && (
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    )}
                  </div>
                  <p className="text-slate-500 text-[11px] leading-relaxed">
                    Hanya data pokok siswa ({students.length} siswa) dengan NISN, NIK, Kelas, Jurusan, Status, dan SPP.
                  </p>
                </div>
              </div>
            </div>

            {/* Export Action */}
            <div className="pt-2">
              <button
                type="button"
                onClick={handleExport}
                disabled={isExporting}
                className="w-full py-2.5 px-4 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-xl shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 transition-all"
              >
                {isExporting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" /> Sedang Membuat Spreadsheet di Google Drive...
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" /> Buat &amp; Ekspor ke Google Spreadsheet Sekarang
                  </>
                )}
              </button>
            </div>

            {/* Export Result Notification */}
            {lastExport && (
              <div
                className={`p-4 rounded-xl border text-xs ${
                  lastExport.success
                    ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                    : 'bg-rose-50 border-rose-200 text-rose-900'
                }`}
              >
                <div className="flex items-start gap-2.5">
                  {lastExport.success ? (
                    <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                  ) : (
                    <AlertCircle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  )}
                  <div className="flex-1">
                    <p className="font-bold text-sm mb-1">{lastExport.message}</p>
                    {lastExport.spreadsheetUrl && (
                      <a
                        href={lastExport.spreadsheetUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="inline-flex items-center gap-1.5 font-bold text-emerald-700 hover:text-emerald-900 underline mt-1"
                      >
                        Buka Spreadsheet di Google Sheets <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    )}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Tab Content: Import */}
        {activeTab === 'import' && (
          <div className="mt-4 space-y-4 text-xs">
            <div>
              <label className="block font-semibold text-slate-700 mb-1">
                Spreadsheet ID atau URL Google Sheet:
              </label>
              <input
                type="text"
                value={importSheetId}
                onChange={(e) => setImportSheetId(e.target.value)}
                placeholder="https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit"
                className="w-full p-2.5 border border-slate-300 rounded-lg text-slate-900 focus:ring-2 focus:ring-emerald-500 font-mono text-[11px]"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Pastikan dokumen dapat diakses oleh akun Google Anda.
              </p>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">Rentang Sel (Range):</label>
                <input
                  type="text"
                  value={importRange}
                  onChange={(e) => setImportRange(e.target.value)}
                  placeholder="A2:R100"
                  className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                />
              </div>
              <div className="flex items-end">
                <button
                  type="button"
                  onClick={handleImport}
                  disabled={isImporting}
                  className="w-full py-2 px-3 bg-emerald-600 hover:bg-emerald-700 disabled:bg-slate-300 text-white font-bold rounded-lg shadow-sm flex items-center justify-center gap-1.5 transition-all"
                >
                  {isImporting ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" /> Membaca...
                    </>
                  ) : (
                    <>
                      <Upload className="w-3.5 h-3.5" /> Proses Impor Data
                    </>
                  )}
                </button>
              </div>
            </div>

            {importStatus && (
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg text-slate-700 text-xs">
                {importStatus}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};
