import React, { useState, useRef } from 'react';
import {
  Upload,
  Download,
  FileSpreadsheet,
  X,
  CheckCircle2,
  AlertTriangle,
  AlertCircle,
  Copy,
  Check,
  Table,
  FileText,
  Users,
  Award,
  ShieldAlert,
  Briefcase,
  Building2,
  GraduationCap,
  Sparkles,
  CloudUpload,
  RefreshCw,
  Info,
  ChevronRight,
  Database,
} from 'lucide-react';
import {
  TEMPLATE_DEFINITIONS,
  downloadCsvTemplate,
  generateCsvContent,
  parseDelimitedText,
  validateStudentsImport,
  validateGradesImport,
  validateBKImport,
  validatePKLImport,
  validatePartnersImport,
  validateTracerImport,
  type ImportDataType,
  type ValidationIssue,
} from '../services/dataImportExportService.ts';
import type {
  BKRecord,
  GradeRecord,
  IndustryPartner,
  PKLPlacement,
  SchoolProfile,
  Student,
  TracerStudyRecord,
} from '../types/academic.ts';

interface DataImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialType?: ImportDataType;
  school: SchoolProfile;
  students: Student[];
  onImportStudents?: (newStudents: Student[], mode: 'append' | 'replace') => void;
  onImportGrades?: (newGrades: GradeRecord[], mode: 'append' | 'replace') => void;
  onImportBK?: (newBK: BKRecord[], mode: 'append' | 'replace') => void;
  onImportPKL?: (newPKL: PKLPlacement[], mode: 'append' | 'replace') => void;
  onImportPartners?: (newPartners: IndustryPartner[], mode: 'append' | 'replace') => void;
  onImportTracer?: (newTracers: TracerStudyRecord[], mode: 'append' | 'replace') => void;
  onOpenGoogleSheets?: () => void;
}

export const DataImportModal: React.FC<DataImportModalProps> = ({
  isOpen,
  onClose,
  initialType = 'students',
  school,
  students,
  onImportStudents,
  onImportGrades,
  onImportBK,
  onImportPKL,
  onImportPartners,
  onImportTracer,
  onOpenGoogleSheets,
}) => {
  const [selectedType, setSelectedType] = useState<ImportDataType>(initialType);
  const [inputMethod, setInputMethod] = useState<'upload' | 'paste'>('upload');
  const [pastedText, setPastedText] = useState('');
  const [fileName, setFileName] = useState<string | null>(null);
  const [importMode, setImportMode] = useState<'append' | 'replace'>('append');
  const [isCopied, setIsCopied] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccessMessage, setSaveSuccessMessage] = useState<string | null>(null);

  // Validation output state
  const [parsedData, setParsedData] = useState<any[] | null>(null);
  const [validationIssues, setValidationIssues] = useState<ValidationIssue[]>([]);
  const [totalParsed, setTotalParsed] = useState(0);

  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  const currentDef = TEMPLATE_DEFINITIONS[selectedType];

  const handleCopyTemplate = () => {
    const csv = generateCsvContent(selectedType, true);
    navigator.clipboard.writeText(csv);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2500);
  };

  const handleLoadSampleToPaste = () => {
    const csv = generateCsvContent(selectedType, true);
    setPastedText(csv);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processText(text);
    };
    reader.readAsText(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      processText(text);
    };
    reader.readAsText(file);
  };

  const handleProcessPastedText = () => {
    if (!pastedText.trim()) {
      alert('Silakan tempel (paste) data teks terlebih dahulu.');
      return;
    }
    processText(pastedText);
  };

  const processText = (text: string) => {
    setIsProcessing(true);
    setSaveSuccessMessage(null);

    setTimeout(() => {
      try {
        const rawRows = parseDelimitedText(text);
        setTotalParsed(rawRows.length);

        if (rawRows.length === 0) {
          alert('Tidak ditemukan baris data yang valid. Pastikan ada baris judul kolom (header) dan baris isi data.');
          setParsedData([]);
          setValidationIssues([]);
          setIsProcessing(false);
          return;
        }

        if (selectedType === 'students') {
          const res = validateStudentsImport(rawRows, school);
          setParsedData(res.validRows);
          setValidationIssues(res.issues);
        } else if (selectedType === 'grades') {
          const res = validateGradesImport(rawRows, students, school);
          setParsedData(res.validRows);
          setValidationIssues(res.issues);
        } else if (selectedType === 'bk') {
          const res = validateBKImport(rawRows, students);
          setParsedData(res.validRows);
          setValidationIssues(res.issues);
        } else if (selectedType === 'pkl') {
          const res = validatePKLImport(rawRows, students);
          setParsedData(res.validRows);
          setValidationIssues(res.issues);
        } else if (selectedType === 'partners') {
          const res = validatePartnersImport(rawRows);
          setParsedData(res.validRows);
          setValidationIssues(res.issues);
        } else if (selectedType === 'tracer') {
          const res = validateTracerImport(rawRows, students);
          setParsedData(res.validRows);
          setValidationIssues(res.issues);
        }
      } catch (err: any) {
        alert(`Gagal memproses data: ${err.message}`);
      } finally {
        setIsProcessing(false);
      }
    }, 150);
  };

  const handleCommitImport = async () => {
    if (!parsedData || parsedData.length === 0) {
      alert('Tidak ada baris data valid untuk disimpan.');
      return;
    }

    setIsSaving(true);
    try {
      if (selectedType === 'students' && onImportStudents) {
        onImportStudents(parsedData as Student[], importMode);
      } else if (selectedType === 'grades' && onImportGrades) {
        onImportGrades(parsedData as GradeRecord[], importMode);
      } else if (selectedType === 'bk' && onImportBK) {
        onImportBK(parsedData as BKRecord[], importMode);
      } else if (selectedType === 'pkl' && onImportPKL) {
        onImportPKL(parsedData as PKLPlacement[], importMode);
      } else if (selectedType === 'partners' && onImportPartners) {
        onImportPartners(parsedData as IndustryPartner[], importMode);
      } else if (selectedType === 'tracer' && onImportTracer) {
        onImportTracer(parsedData as TracerStudyRecord[], importMode);
      }

      setSaveSuccessMessage(
        `Sukses! Sebanyak ${parsedData.length} data ${currentDef.title} berhasil diimpor & disinkronkan ke Firebase Firestore.`
      );

      // Auto close after brief notice or let user review
      setTimeout(() => {
        setSaveSuccessMessage(null);
        onClose();
      }, 2000);
    } catch (err: any) {
      alert(`Gagal menyimpan data ke database: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  const handleResetImportState = () => {
    setParsedData(null);
    setValidationIssues([]);
    setFileName(null);
    setPastedText('');
    setSaveSuccessMessage(null);
  };

  const handleSelectType = (type: ImportDataType) => {
    setSelectedType(type);
    handleResetImportState();
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-5 overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl border border-sky-200 max-w-5xl w-full max-h-[92vh] flex flex-col overflow-hidden animate-fadeIn">
        {/* Header Modal - Bright & Clean */}
        <div className="bg-gradient-to-r from-sky-600 via-blue-600 to-indigo-600 px-6 py-4 text-white flex items-center justify-between shadow-md shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/20 backdrop-blur-xs flex items-center justify-center border border-white/30 shadow-xs">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-black tracking-tight">Import Data Master &amp; Akademik</h2>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-400 text-emerald-950 uppercase tracking-wide">
                  Dengan Template Resmi
                </span>
              </div>
              <p className="text-xs text-sky-100">
                Unduh template resmi CSV, periksa data siswa &amp; nilai, validasi otomatis, dan sinkronkan ke Firebase Firestore.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            aria-label="Tutup Jendela Import"
            className="text-white/80 hover:text-white p-1.5 rounded-lg hover:bg-white/20 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Dataset Type Navigation Tabs */}
        <div className="bg-sky-50/70 border-b border-sky-100 px-4 py-2.5 flex items-center gap-2 overflow-x-auto shrink-0 scrollbar-thin">
          {[
            { id: 'students', label: 'Data Siswa', icon: <Users className="w-3.5 h-3.5" />, badge: `${students.length} Siswa` },
            { id: 'grades', label: 'Nilai Rapor', icon: <FileSpreadsheet className="w-3.5 h-3.5" />, badge: 'Format Merdeka/K13' },
            { id: 'bk', label: 'Bimbingan Konseling (BK)', icon: <ShieldAlert className="w-3.5 h-3.5" />, badge: 'Pelanggaran & Prestasi' },
            { id: 'pkl', label: 'PKL / Magang DU/DI', icon: <Briefcase className="w-3.5 h-3.5" />, badge: 'Nilai & DUDI' },
            { id: 'partners', label: 'Mitra DU/DI', icon: <Building2 className="w-3.5 h-3.5" />, badge: 'MoU Industri' },
            { id: 'tracer', label: 'Tracer Study Alumni', icon: <GraduationCap className="w-3.5 h-3.5" />, badge: 'BMW Vokasi' },
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => handleSelectType(tab.id as ImportDataType)}
              className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition-all ${
                selectedType === tab.id
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'bg-white text-slate-700 hover:bg-sky-100 border border-sky-200'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              <span
                className={`text-[10px] px-1.5 py-0.2 rounded-full font-medium ${
                  selectedType === tab.id ? 'bg-white/25 text-white' : 'bg-slate-100 text-slate-600'
                }`}
              >
                {tab.badge}
              </span>
            </button>
          ))}
        </div>

        {/* Modal Scrollable Body */}
        <div className="flex-1 overflow-y-auto p-5 sm:p-6 space-y-6">
          {/* Step 1: Download & Study Template */}
          <div className="bg-gradient-to-br from-sky-50/80 to-blue-50/50 rounded-2xl p-5 border border-sky-200 shadow-xs">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-sky-200/80">
              <div>
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    1
                  </span>
                  <h3 className="text-sm font-bold text-slate-900">
                    Unduh Template &amp; Panduan Kolom: {currentDef.title}
                  </h3>
                </div>
                <p className="text-xs text-slate-600 mt-1 pl-8">
                  {currentDef.description} Template sudah dioptimasi untuk Microsoft Excel, Google Sheets, dan format CSV standar UTF-8.
                </p>
              </div>

              {/* Action Buttons: Download Template & Copy */}
              <div className="flex items-center gap-2 pl-8 sm:pl-0 shrink-0">
                <button
                  onClick={() => downloadCsvTemplate(selectedType)}
                  className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow-xs transition-all active:scale-95"
                  title="Unduh file .CSV siap edit di Microsoft Excel / LibreOffice"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Unduh Template (.CSV)</span>
                </button>
                <button
                  onClick={handleCopyTemplate}
                  className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 text-xs font-semibold shadow-xs transition-all"
                  title="Salin format teks CSV ke clipboard"
                >
                  {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{isCopied ? 'Tersalin!' : 'Salin Format'}</span>
                </button>
              </div>
            </div>

            {/* Template Column Schema Reference Accordion / Cards */}
            <div className="mt-4">
              <div className="text-[11px] font-semibold text-slate-500 uppercase tracking-wider mb-2 flex items-center justify-between">
                <span>Daftar Kolom Template Resmi ({currentDef.columns.length} Kolom):</span>
                <span className="text-sky-700 font-normal">
                  Keterangan: <strong className="text-rose-600">* Wajib</strong> | Kolom lain opsional
                </span>
              </div>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2 text-xs">
                {currentDef.columns.map((col) => (
                  <div
                    key={col.key}
                    className="p-2.5 rounded-lg bg-white border border-sky-100 shadow-2xs hover:border-sky-300 transition-colors"
                  >
                    <div className="flex items-center justify-between gap-1">
                      <span className="font-bold text-slate-800 text-[11px] truncate" title={col.label}>
                        {col.label}
                      </span>
                      {col.required ? (
                        <span className="text-[9px] font-bold text-rose-600 bg-rose-50 px-1 py-0.2 rounded shrink-0">
                          Wajib
                        </span>
                      ) : (
                        <span className="text-[9px] text-slate-400 bg-slate-50 px-1 py-0.2 rounded shrink-0">
                          Opsional
                        </span>
                      )}
                    </div>
                    <div className="text-[10px] font-mono text-blue-600 mt-1 truncate" title={col.key}>
                      {col.key}
                    </div>
                    <div className="text-[10px] text-slate-500 mt-0.5 line-clamp-1" title={col.description}>
                      Contoh: <code className="bg-slate-100 px-1 rounded">{col.example}</code>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Step 2: Choose Upload or Paste */}
          <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                  2
                </span>
                <h3 className="text-sm font-bold text-slate-900">
                  Masukkan Data yang Akan Diimpor
                </h3>
              </div>

              {/* Mode Input Selector */}
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-semibold">
                <button
                  onClick={() => setInputMethod('upload')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    inputMethod === 'upload' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  <Upload className="w-3.5 h-3.5" />
                  Unggah File (.csv / .tsv / .txt)
                </button>
                <button
                  onClick={() => setInputMethod('paste')}
                  className={`flex items-center gap-1.5 px-3 py-1 rounded-lg transition-all ${
                    inputMethod === 'paste' ? 'bg-white text-blue-700 shadow-xs font-bold' : 'text-slate-600'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  Tempel Teks (Paste dari Excel)
                </button>
              </div>
            </div>

            {inputMethod === 'upload' ? (
              /* Drag & Drop File Zone */
              <div
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-sky-300 hover:border-blue-500 bg-sky-50/40 hover:bg-sky-50/70 transition-all rounded-xl p-8 text-center cursor-pointer group"
              >
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".csv,.tsv,.txt"
                  className="hidden"
                />
                <div className="w-12 h-12 mx-auto rounded-full bg-blue-100 group-hover:bg-blue-200 flex items-center justify-center text-blue-600 transition-colors">
                  <CloudUpload className="w-6 h-6" />
                </div>
                <div className="mt-3">
                  <span className="text-xs font-bold text-blue-700 group-hover:underline">
                    Klik untuk memilih file
                  </span>{' '}
                  <span className="text-xs text-slate-600">atau tarik &amp; lepas file ke area ini</span>
                </div>
                <p className="text-[11px] text-slate-400 mt-1">
                  Mendukung format file CSV, TSV (Tab-Separated), atau file teks hasil ekspor spreadsheet.
                </p>
                {fileName && (
                  <div className="mt-3 inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold border border-emerald-300">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    File terpilih: {fileName}
                  </div>
                )}
              </div>
            ) : (
              /* Paste from Clipboard / Excel */
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-slate-600 font-medium">
                    Salin baris tabel dari Microsoft Excel atau Google Sheets, lalu tempel di bawah:
                  </span>
                  <button
                    onClick={handleLoadSampleToPaste}
                    className="text-xs font-bold text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <Sparkles className="w-3 h-3" /> Muat Contoh Teks
                  </button>
                </div>
                <textarea
                  value={pastedText}
                  onChange={(e) => setPastedText(e.target.value)}
                  placeholder={`Tempel baris CSV / TSV di sini...\nContoh:\n${generateCsvContent(selectedType, true).slice(1, 300)}...`}
                  rows={6}
                  className="w-full text-xs font-mono p-3 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-slate-50/50"
                />
                <button
                  onClick={handleProcessPastedText}
                  disabled={isProcessing}
                  className="px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold shadow-xs transition-colors flex items-center gap-2"
                >
                  {isProcessing ? <RefreshCw className="w-3.5 h-3.5 animate-spin" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  Analisis &amp; Validasi Data
                </button>
              </div>
            )}
          </div>

          {/* Step 3: Validation Results & Interactive Preview */}
          {parsedData !== null && (
            <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-xs space-y-4 animate-fadeIn">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-200">
                <div className="flex items-center gap-2">
                  <span className="w-6 h-6 rounded-full bg-blue-600 text-white text-xs font-bold flex items-center justify-center">
                    3
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900">
                      Hasil Analisis &amp; Pratinjau ({parsedData.length} Baris Valid dari {totalParsed} Baris)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Periksa data sebelum disimpan ke database Firebase Firestore dan memori aplikasi.
                    </p>
                  </div>
                </div>

                {/* Import Mode Selector */}
                <div className="flex items-center gap-2 text-xs">
                  <span className="text-slate-600 font-medium">Metode Simpan:</span>
                  <label className="flex items-center gap-1 cursor-pointer">
                    <input
                      type="radio"
                      name="importMode"
                      value="append"
                      checked={importMode === 'append'}
                      onChange={() => setImportMode('append')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">Tambah (Append)</span>
                  </label>
                  <label className="flex items-center gap-1 cursor-pointer ml-2">
                    <input
                      type="radio"
                      name="importMode"
                      value="replace"
                      checked={importMode === 'replace'}
                      onChange={() => setImportMode('replace')}
                      className="text-blue-600 focus:ring-blue-500"
                    />
                    <span className="font-semibold text-slate-800">Perbarui / Timpa (Merge)</span>
                  </label>
                </div>
              </div>

              {/* Validation Warning / Error Summary */}
              {validationIssues.length > 0 && (
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 text-xs text-amber-900 space-y-1.5">
                  <div className="font-bold flex items-center gap-1.5 text-amber-800">
                    <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                    <span>Ditemukan {validationIssues.length} catatan/peringatan pada baris impor:</span>
                  </div>
                  <ul className="list-disc list-inside space-y-0.5 text-[11px] text-amber-800 max-h-24 overflow-y-auto pl-1">
                    {validationIssues.slice(0, 5).map((iss, idx) => (
                      <li key={idx}>
                        Baris {iss.rowNumber} [{iss.field}]: {iss.message}
                      </li>
                    ))}
                    {validationIssues.length > 5 && (
                      <li className="font-semibold text-amber-900">
                        ...dan {validationIssues.length - 5} catatan lainnya.
                      </li>
                    )}
                  </ul>
                </div>
              )}

              {/* Preview Table */}
              <div className="border border-slate-200 rounded-xl overflow-hidden max-h-64 overflow-y-auto scrollbar-thin">
                <table className="min-w-full divide-y divide-slate-200 text-left text-xs">
                  <thead className="bg-slate-100/90 text-slate-700 font-bold sticky top-0 z-10">
                    <tr>
                      <th className="px-3 py-2">No</th>
                      {currentDef.columns.slice(0, 6).map((c) => (
                        <th key={c.key} className="px-3 py-2 whitespace-nowrap">
                          {c.label}
                        </th>
                      ))}
                      <th className="px-3 py-2 text-center">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 bg-white">
                    {parsedData.slice(0, 50).map((row: any, idx: number) => (
                      <tr key={idx} className="hover:bg-sky-50/40 transition-colors">
                        <td className="px-3 py-2 font-mono text-slate-400 text-[11px]">{idx + 1}</td>
                        {currentDef.columns.slice(0, 6).map((c) => (
                          <td key={c.key} className="px-3 py-2 text-slate-800 truncate max-w-[160px]">
                            {String(row[c.key] !== undefined ? row[c.key] : '-')}
                          </td>
                        ))}
                        <td className="px-3 py-2 text-center">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" /> Siap
                          </span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {parsedData.length > 50 && (
                <div className="text-[11px] text-slate-400 text-center">
                  Menampilkan 50 baris pertama dari total {parsedData.length} baris data yang siap diimpor.
                </div>
              )}

              {/* Success Banner */}
              {saveSuccessMessage && (
                <div className="bg-emerald-600 text-white rounded-xl p-3.5 text-xs font-semibold flex items-center gap-2 animate-fadeIn shadow-sm">
                  <CheckCircle2 className="w-4 h-4 text-emerald-200 shrink-0" />
                  <span>{saveSuccessMessage}</span>
                </div>
              )}

              {/* Action Buttons to Commit to Firestore & State */}
              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={handleResetImportState}
                  className="px-3.5 py-2 rounded-xl text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
                >
                  Batal / Reset Data
                </button>
                <button
                  onClick={handleCommitImport}
                  disabled={isSaving || parsedData.length === 0}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-700 hover:to-teal-700 text-white text-xs font-black shadow-md transition-all active:scale-95 disabled:opacity-50"
                >
                  {isSaving ? (
                    <RefreshCw className="w-4 h-4 animate-spin" />
                  ) : (
                    <CloudUpload className="w-4 h-4" />
                  )}
                  <span>
                    {isSaving
                      ? 'Menyimpan ke Firebase...'
                      : `Terapkan & Simpan ${parsedData.length} Data ke Firebase Firestore`}
                  </span>
                </button>
              </div>
            </div>
          )}

          {/* Google Sheets Alternate Integration Note */}
          <div className="bg-emerald-50/60 rounded-xl p-4 border border-emerald-200 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-lg bg-emerald-100 flex items-center justify-center text-emerald-700 shrink-0">
                <FileSpreadsheet className="w-5 h-5" />
              </div>
              <div>
                <strong className="text-emerald-950 font-bold block">
                  Punya Google Sheets langsung dari tim guru / staf TU?
                </strong>
                <span className="text-emerald-800 text-[11px]">
                  Anda juga dapat menghubungkan spreadsheet cloud Google Drive melalui integrasi Google Sheets API v4.
                </span>
              </div>
            </div>
            {onOpenGoogleSheets && (
              <button
                onClick={() => {
                  onClose();
                  onOpenGoogleSheets();
                }}
                className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 shadow-xs transition-colors"
              >
                Buka Google Sheets
              </button>
            )}
          </div>
        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 border-t border-slate-200 px-6 py-3 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-2">
            <Database className="w-3.5 h-3.5 text-blue-600" />
            <span>
              Target Database: <strong className="text-slate-800 font-mono">Cloud Firestore (siakad-smkwd-20265547)</strong>
            </span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-lg bg-white border border-slate-300 text-slate-700 hover:bg-slate-100 font-semibold transition-colors"
          >
            Tutup
          </button>
        </div>
      </div>
    </div>
  );
};
