import React, { useState } from 'react';
import {
  Settings,
  Sliders,
  X,
  CheckCircle2,
  BookOpen,
  FileText,
  RotateCcw,
  Sparkles,
  Building2,
  Award,
  Calendar,
  Check
} from 'lucide-react';
import type { ReportCardConfig, ReportTemplateType } from '../types/academic.ts';
import { DEFAULT_REPORT_CONFIG } from '../data/initialData.ts';

interface ReportConfigModalProps {
  isOpen: boolean;
  onClose: () => void;
  config: ReportCardConfig;
  onSaveConfig: (newConfig: ReportCardConfig) => void;
}

export const ReportConfigModal: React.FC<ReportConfigModalProps> = ({
  isOpen,
  onClose,
  config,
  onSaveConfig,
}) => {
  const [formData, setFormData] = useState<ReportCardConfig>(config);
  const [activeTab, setActiveTab] = useState<'template' | 'components' | 'identity'>('template');
  const [saveSuccess, setSaveSuccess] = useState(false);

  if (!isOpen) return null;

  // Preset Template loader
  const handleSelectTemplate = (tpl: ReportTemplateType) => {
    if (tpl === 'KURIKULUM_MERDEKA') {
      setFormData({
        ...formData,
        templateType: 'KURIKULUM_MERDEKA',
        titleHeader: 'Laporan Hasil Belajar (Rapor Siswa)',
        subHeader: 'Kurikulum Merdeka - SMK Pusat Keunggulan',
        showFormativeSumativeBreakdown: false,
        showCompetencyDescription: true,
        showAttendanceTable: true,
        showExtracurricular: true,
        showUKKSection: true,
        showPKLSection: true,
        showTeacherNotes: true,
        showPrincipalQR: true,
        gradingScale: '0-100',
      });
    } else if (tpl === 'KURIKULUM_2013') {
      setFormData({
        ...formData,
        templateType: 'KURIKULUM_2013',
        titleHeader: 'Laporan Capaian Kompetensi Peserta Didik (Rapor K13)',
        subHeader: 'Kurikulum 2013 Revisi - Bidang Keahlian Teknologi & Rekayasa',
        showFormativeSumativeBreakdown: true,
        showCompetencyDescription: false,
        showAttendanceTable: true,
        showExtracurricular: true,
        showUKKSection: true,
        showPKLSection: true,
        showTeacherNotes: true,
        showPrincipalQR: true,
        gradingScale: '0-100',
      });
    } else if (tpl === 'DUAL_SYSTEM_TEFA') {
      setFormData({
        ...formData,
        templateType: 'DUAL_SYSTEM_TEFA',
        titleHeader: 'Laporan Hasil Belajar Sistem Ganda & Teaching Factory (TEFA)',
        subHeader: 'Standar Industri & LSP-P1 Badan Nasional Sertifikasi Profesi (BNSP)',
        showFormativeSumativeBreakdown: true,
        showCompetencyDescription: true,
        showAttendanceTable: true,
        showExtracurricular: false,
        showUKKSection: true,
        showPKLSection: true,
        showTeacherNotes: true,
        showPrincipalQR: true,
        gradingScale: '0-100',
      });
    } else if (tpl === 'TRANSKRIP_RINGKAS') {
      setFormData({
        ...formData,
        templateType: 'TRANSKRIP_RINGKAS',
        titleHeader: 'Transkrip Nilai Akademik & Kejuruan Siswa',
        subHeader: 'Dokumen Ringkas Seleksi Nasional Penerimaan Mahasiswa / Beasiswa Kedinasan',
        showFormativeSumativeBreakdown: false,
        showCompetencyDescription: false,
        showAttendanceTable: false,
        showExtracurricular: false,
        showUKKSection: true,
        showPKLSection: true,
        showTeacherNotes: false,
        showPrincipalQR: true,
        gradingScale: '0-100',
      });
    }
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveConfig(formData);
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 800);
  };

  const handleResetToDefault = () => {
    if (confirm('Kembalikan format rapor ke pengaturan standar Kurikulum Merdeka?')) {
      setFormData(DEFAULT_REPORT_CONFIG);
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-blue-100 text-blue-700 flex items-center justify-center">
              <Sliders className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base flex items-center gap-2">
                Konfigurator &amp; Format Rapor SMK (Admin)
              </h3>
              <p className="text-xs text-slate-500">
                Ubah template, komponen nilai, KKM, kop resmi, dan struktur cetak rapor siswa sesuai kebijakan sekolah.
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Navigation in Modal */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold">
          <button
            type="button"
            onClick={() => setActiveTab('template')}
            className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'template'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <BookOpen className="w-4 h-4" /> 1. Pilihan Template Kurikulum
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('components')}
            className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'components'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> 2. Komponen &amp; Kolom Nilai
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('identity')}
            className={`py-2.5 px-4 border-b-2 transition-colors flex items-center gap-1.5 ${
              activeTab === 'identity'
                ? 'border-blue-600 text-blue-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> 3. Kop Surat &amp; Tanda Tangan
          </button>
        </div>

        <form onSubmit={handleSave} className="mt-5 space-y-5 text-xs">
          {/* TAB 1: Template Selection */}
          {activeTab === 'template' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {/* Option 1: Kurikulum Merdeka */}
                <div
                  onClick={() => handleSelectTemplate('KURIKULUM_MERDEKA')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    formData.templateType === 'KURIKULUM_MERDEKA'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {formData.templateType === 'KURIKULUM_MERDEKA' && (
                    <span className="absolute top-3 right-3 text-blue-600">
                      <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-blue-100 text-blue-800">
                    Standar SMK PK
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">
                    Kurikulum Merdeka (Fase E &amp; F)
                  </h4>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                    Format resmi Kemendikbudristek: Nilai Akhir tunggal terintegrasi Capaian Pembelajaran (CP) dan deskripsi naratif ketercapaian kompetensi kejuruan.
                  </p>
                </div>

                {/* Option 2: Kurikulum 2013 */}
                <div
                  onClick={() => handleSelectTemplate('KURIKULUM_2013')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    formData.templateType === 'KURIKULUM_2013'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {formData.templateType === 'KURIKULUM_2013' && (
                    <span className="absolute top-3 right-3 text-blue-600">
                      <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-100 text-amber-800">
                    K13 Vokasi
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">
                    Kurikulum 2013 Revisi (K13)
                  </h4>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                    Pemisahan tegas kolom <strong>Nilai Pengetahuan (KD-3)</strong> dan <strong>Nilai Keterampilan Praktik (KD-4)</strong> dengan predikat masing-masing.
                  </p>
                </div>

                {/* Option 3: Dual System / TEFA */}
                <div
                  onClick={() => handleSelectTemplate('DUAL_SYSTEM_TEFA')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    formData.templateType === 'DUAL_SYSTEM_TEFA'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {formData.templateType === 'DUAL_SYSTEM_TEFA' && (
                    <span className="absolute top-3 right-3 text-blue-600">
                      <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                    Teaching Factory
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">
                    Dual System &amp; Industri TEFA
                  </h4>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                    Dirancang untuk kelas industri: Mengintegrasikan nilai praktikum bengkel, sertifikasi BNSP / LSP-P1, dan evaluasi berkala DU/DI mitra.
                  </p>
                </div>

                {/* Option 4: Transkrip Ringkas */}
                <div
                  onClick={() => handleSelectTemplate('TRANSKRIP_RINGKAS')}
                  className={`p-4 rounded-xl border-2 transition-all cursor-pointer relative ${
                    formData.templateType === 'TRANSKRIP_RINGKAS'
                      ? 'border-blue-600 bg-blue-50/50 shadow-xs'
                      : 'border-slate-200 hover:border-slate-300 bg-white'
                  }`}
                >
                  {formData.templateType === 'TRANSKRIP_RINGKAS' && (
                    <span className="absolute top-3 right-3 text-blue-600">
                      <CheckCircle2 className="w-5 h-5 fill-blue-600 text-white" />
                    </span>
                  )}
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-purple-100 text-purple-800">
                    Transkrip 1 Halaman
                  </span>
                  <h4 className="font-bold text-slate-900 text-sm mt-2">
                    Transkrip Akademik Ringkas
                  </h4>
                  <p className="text-slate-600 mt-1 text-[11px] leading-relaxed">
                    Format padat efisien satu halaman tanpa deskripsi naratif panjang. Cocok untuk pendaftaran perguruan tinggi vokasi (SNPMB) atau kedinasan.
                  </p>
                </div>
              </div>

              {/* Title & Subtitle customizer */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Judul Dokumen Rapor</label>
                  <input
                    type="text"
                    value={formData.titleHeader}
                    onChange={(e) => setFormData({ ...formData, titleHeader: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Sub-Judul Dokumen</label>
                  <input
                    type="text"
                    value={formData.subHeader}
                    onChange={(e) => setFormData({ ...formData, subHeader: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Components & Columns */}
          {activeTab === 'components' && (
            <div className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Standard KKM & Grading Scale */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                  <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                    <Award className="w-4 h-4 text-blue-600" /> Standar KKM / KKTP Sekolah
                  </h4>
                  <div>
                    <label className="block text-slate-600 mb-1">KKM / Kriteria Minimum Ketuntasan</label>
                    <div className="flex items-center gap-2">
                      <input
                        type="number"
                        min={60}
                        max={90}
                        value={formData.kkmStandard}
                        onChange={(e) => setFormData({ ...formData, kkmStandard: Number(e.target.value) })}
                        className="w-24 p-2 border border-slate-300 rounded-lg font-bold text-center text-sm"
                      />
                      <span className="text-slate-500">Skala 0 - 100 (Default SMK: 75)</span>
                    </div>
                  </div>

                  <div>
                    <label className="block text-slate-600 mb-1">Format Skala Tampilan Nilai</label>
                    <div className="flex items-center gap-3">
                      <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="scale"
                          value="0-100"
                          checked={formData.gradingScale === '0-100'}
                          onChange={() => setFormData({ ...formData, gradingScale: '0-100' })}
                          className="text-blue-600"
                        />
                        <span>Skala Puluhan (0 - 100)</span>
                      </label>
                      <label className="flex items-center gap-1.5 font-medium cursor-pointer">
                        <input
                          type="radio"
                          name="scale"
                          value="1-4"
                          checked={formData.gradingScale === '1-4'}
                          onChange={() => setFormData({ ...formData, gradingScale: '1-4' })}
                          className="text-blue-600"
                        />
                        <span>Skala Indeks IPK (1.00 - 4.00)</span>
                      </label>
                    </div>
                  </div>
                </div>

                {/* Elements Checklist */}
                <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-2.5">
                  <h4 className="font-bold text-slate-900">Komponen yang Ditampilkan di Rapor</h4>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showFormativeSumativeBreakdown}
                      onChange={(e) =>
                        setFormData({ ...formData, showFormativeSumativeBreakdown: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                    <span>Rincian Nilai Formatif (30%), Sumatif (40%), dan SAS (30%)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showCompetencyDescription}
                      onChange={(e) =>
                        setFormData({ ...formData, showCompetencyDescription: e.target.checked })
                      }
                      className="rounded text-blue-600"
                    />
                    <span>Kolom Deskripsi Capaian Kompetensi / Catatan Pembelajaran</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showUKKSection}
                      onChange={(e) => setFormData({ ...formData, showUKKSection: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Sertakan Nilai &amp; Sertifikat Uji Kompetensi Keahlian (UKK BNSP)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showPKLSection}
                      onChange={(e) => setFormData({ ...formData, showPKLSection: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Sertakan Nilai Praktik Kerja Lapangan (PKL DU/DI)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showAttendanceTable}
                      onChange={(e) => setFormData({ ...formData, showAttendanceTable: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Tabel Ketidakhadiran (Sakit, Izin, Alpa)</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showExtracurricular}
                      onChange={(e) => setFormData({ ...formData, showExtracurricular: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Tabel Nilai Kegiatan Ekstrakurikuler</span>
                  </label>

                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={formData.showTeacherNotes}
                      onChange={(e) => setFormData({ ...formData, showTeacherNotes: e.target.checked })}
                      className="rounded text-blue-600"
                    />
                    <span>Catatan dan Rekomendasi Wali Kelas</span>
                  </label>
                </div>
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Template Catatan Wali Kelas (Default):
                </label>
                <input
                  type="text"
                  value={formData.teacherNotesTemplate}
                  onChange={(e) => setFormData({ ...formData, teacherNotesTemplate: e.target.value })}
                  className="w-full p-2 border border-slate-300 rounded-lg text-xs"
                />
              </div>
            </div>
          )}

          {/* TAB 3: Kop Surat & Penandatangan */}
          {activeTab === 'identity' && (
            <div className="space-y-4">
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-xl space-y-3">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5">
                  <Building2 className="w-4 h-4 text-blue-600" /> Header &amp; Kop Surat Resmi
                </h4>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showKop}
                    onChange={(e) => setFormData({ ...formData, showKop: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Tampilkan Kop Surat Resmi (Dinas Pendidikan &amp; Nama Sekolah)</span>
                </label>

                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formData.showPrincipalQR}
                    onChange={(e) => setFormData({ ...formData, showPrincipalQR: e.target.checked })}
                    className="rounded text-blue-600"
                  />
                  <span>Tampilkan QR Code Verifikasi Keabsahan Kepala Sekolah</span>
                </label>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Titik Mangsa (Tempat &amp; Tanggal Penerbitan Rapor)
                  </label>
                  <input
                    type="text"
                    value={formData.reportDatePlace}
                    onChange={(e) => setFormData({ ...formData, reportDatePlace: e.target.value })}
                    placeholder="Contoh: Jakarta, 20 Juni 2026"
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Lengkap Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.principalName}
                    onChange={(e) => setFormData({ ...formData, principalName: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-semibold"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    NIP Kepala Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.principalNip}
                    onChange={(e) => setFormData({ ...formData, principalNip: e.target.value })}
                    className="w-full p-2 border border-slate-300 rounded-lg font-mono"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Footer Action Buttons */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <button
              type="button"
              onClick={handleResetToDefault}
              className="flex items-center gap-1.5 text-slate-500 hover:text-slate-800 text-xs font-medium"
            >
              <RotateCcw className="w-3.5 h-3.5" /> Reset Pengaturan Standar
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50 font-medium"
              >
                Batal
              </button>
              <button
                type="submit"
                className={`px-5 py-2 text-white rounded-lg font-bold flex items-center gap-1.5 transition-all ${
                  saveSuccess ? 'bg-emerald-600' : 'bg-blue-600 hover:bg-blue-700 shadow-sm'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Tersimpan!
                  </>
                ) : (
                  'Terapkan Format Rapor'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
