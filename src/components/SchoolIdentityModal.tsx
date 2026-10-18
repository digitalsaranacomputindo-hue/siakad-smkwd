import React, { useState } from 'react';
import {
  Building2,
  X,
  Upload,
  Image as ImageIcon,
  Check,
  CheckCircle2,
  Sparkles,
  School,
  FileText,
  RotateCcw,
  CloudUpload,
} from 'lucide-react';
import type { SchoolProfile } from '../types/academic.ts';

interface SchoolIdentityModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: SchoolProfile;
  onSaveProfile: (profile: SchoolProfile) => void;
}

const PRESET_LOGOS = [
  {
    name: 'Lambang Vokasi Nusantara',
    url: 'https://images.unsplash.com/photo-1546410531-bb4caa6b424d?w=160&auto=format&fit=crop&q=80',
  },
  {
    name: 'Logo Teknologi Biru',
    url: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?w=160&auto=format&fit=crop&q=80',
  },
  {
    name: 'Logo Prestasi & Sains',
    url: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=160&auto=format&fit=crop&q=80',
  },
];

export const SchoolIdentityModal: React.FC<SchoolIdentityModalProps> = ({
  isOpen,
  onClose,
  profile,
  onSaveProfile,
}) => {
  const [formData, setFormData] = useState<SchoolProfile>(profile);
  const [activeTab, setActiveTab] = useState<'identitas' | 'logo' | 'kop' | 'pejabat'>('identitas');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [logoPreview, setLogoPreview] = useState<string>(profile.logoUrl || '');

  if (!isOpen) return null;

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        alert('Ukuran file maksimal 2 MB');
        return;
      }
      const reader = new FileReader();
      reader.onload = (event) => {
        const base64 = event.target?.result as string;
        setLogoPreview(base64);
        setFormData({ ...formData, logoUrl: base64 });
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveProfile({
      ...formData,
      logoUrl: logoPreview,
    });
    setSaveSuccess(true);
    setTimeout(() => {
      setSaveSuccess(false);
      onClose();
    }, 700);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-4xl w-full p-6 sm:p-7 shadow-2xl border border-sky-100 relative my-6">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-sky-500 to-blue-600 text-white flex items-center justify-center shadow-md shadow-sky-500/20">
              <School className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-slate-900 text-base sm:text-lg flex items-center gap-2">
                Identitas Sekolah &amp; Kelola Logo (Admin)
              </h3>
              <p className="text-xs text-slate-500">
                Data sekolah dan logo akan otomatis diterapkan pada Rapor, Kartu Pelajar, SKL, Surat Pemanggilan BK, dan Kop Resmi.
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

        {/* Tab navigation */}
        <div className="flex border-b border-slate-200 mt-4 text-xs font-semibold overflow-x-auto">
          <button
            type="button"
            onClick={() => setActiveTab('identitas')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'identitas'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Building2 className="w-4 h-4" /> 1. Data Umum Sekolah
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('logo')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'logo'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <ImageIcon className="w-4 h-4" /> 2. Upload / Ganti Logo
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('kop')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'kop'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" /> 3. Kop Surat &amp; Dinas
          </button>
          <button
            type="button"
            onClick={() => setActiveTab('pejabat')}
            className={`py-2.5 px-4 border-b-2 transition-colors whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'pejabat'
                ? 'border-sky-600 text-sky-600'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Sparkles className="w-4 h-4" /> 4. Kepala Sekolah &amp; Pejabat
          </button>
        </div>

        <form onSubmit={handleSubmit} className="mt-5 space-y-4 text-xs">
          {/* TAB 1: Identitas Umum */}
          {activeTab === 'identitas' && (
            <div className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Resmi Sekolah <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Contoh: SMK Negeri 1 Rekayasa Teknologi Nusantara"
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nama Singkat / Panggilan Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.shortName}
                    onChange={(e) => setFormData({ ...formData, shortName: e.target.value })}
                    placeholder="Contoh: SMKN 1 Nusantara"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Nomor Pokok Sekolah Nasional (NPSN) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.npsn}
                    onChange={(e) => setFormData({ ...formData, npsn: e.target.value })}
                    placeholder="Contoh: 20251945"
                    className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Status Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                    placeholder="Contoh: Negeri - SMK Pusat Keunggulan (SMK PK)"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">
                    Peringkat Akreditasi
                  </label>
                  <input
                    type="text"
                    value={formData.accreditation}
                    onChange={(e) => setFormData({ ...formData, accreditation: e.target.value })}
                    placeholder="Contoh: A (Unggul - Nilai 96)"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-700 mb-1">
                    Alamat Lengkap Sekolah
                  </label>
                  <input
                    type="text"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                    placeholder="Contoh: Jl. Industri Vokasi No. 45, Kawasan Pendidikan Terpadu"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Kota / Kabupaten</label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    placeholder="Contoh: Jakarta Pusat"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Provinsi</label>
                  <input
                    type="text"
                    value={formData.province}
                    onChange={(e) => setFormData({ ...formData, province: e.target.value })}
                    placeholder="Contoh: DKI Jakarta"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Telepon Resmi</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="Contoh: (021) 8765432"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-700 mb-1">Email Resmi Sekolah</label>
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="Contoh: info@smkn1nusantara.sch.id"
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: Upload / Ganti Logo */}
          {activeTab === 'logo' && (
            <div className="space-y-4">
              <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-xl flex flex-col sm:flex-row items-center gap-5">
                {/* Logo Preview */}
                <div className="w-28 h-28 rounded-2xl bg-white border-2 border-sky-200 shadow-sm flex items-center justify-center overflow-hidden shrink-0">
                  {logoPreview ? (
                    <img
                      src={logoPreview}
                      alt="Logo Sekolah"
                      className="w-full h-full object-contain p-2"
                      onError={() => setLogoPreview('')}
                    />
                  ) : (
                    <School className="w-12 h-12 text-sky-400" />
                  )}
                </div>

                <div className="flex-1 space-y-2 text-center sm:text-left">
                  <h4 className="font-bold text-slate-900 text-sm">Upload Logo Sekolah Anda</h4>
                  <p className="text-slate-500 text-xs">
                    Format file: PNG atau JPG transparan (disarankan resolusi 256x256 pixel, maks 2MB).
                  </p>
                  <div className="flex flex-wrap items-center gap-2 justify-center sm:justify-start pt-1">
                    <label className="cursor-pointer px-4 py-2 bg-sky-600 hover:bg-sky-700 text-white rounded-lg font-bold flex items-center gap-1.5 shadow-sm transition-all">
                      <Upload className="w-3.5 h-3.5" /> Pilih File Gambar
                      <input
                        type="file"
                        accept="image/png,image/jpeg,image/svg+xml"
                        onChange={handleFileUpload}
                        className="hidden"
                      />
                    </label>
                    {logoPreview && (
                      <button
                        type="button"
                        onClick={() => {
                          setLogoPreview('');
                          setFormData({ ...formData, logoUrl: '' });
                        }}
                        className="px-3 py-2 border border-rose-200 text-rose-600 hover:bg-rose-50 rounded-lg font-medium"
                      >
                        Hapus Logo
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* URL Input */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Atau Masukkan Tautan / URL Logo Online:
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={logoPreview}
                    onChange={(e) => {
                      setLogoPreview(e.target.value);
                      setFormData({ ...formData, logoUrl: e.target.value });
                    }}
                    placeholder="https://contoh-sekolah.sch.id/logo.png"
                    className="flex-1 p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                  />
                </div>
              </div>

              {/* Preset Logos */}
              <div>
                <label className="block font-semibold text-slate-700 mb-1.5">
                  Atau Pilih Contoh Logo Vokasi yang Tersedia:
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {PRESET_LOGOS.map((preset, idx) => (
                    <div
                      key={idx}
                      onClick={() => {
                        setLogoPreview(preset.url);
                        setFormData({ ...formData, logoUrl: preset.url });
                      }}
                      className="p-2.5 rounded-xl border border-slate-200 hover:border-sky-500 bg-white cursor-pointer flex items-center gap-3 transition-all hover:bg-sky-50/30"
                    >
                      <img
                        src={preset.url}
                        alt={preset.name}
                        className="w-10 h-10 object-cover rounded-lg border border-slate-200 shrink-0"
                      />
                      <div className="text-left">
                        <p className="font-semibold text-slate-800 text-[11px] leading-tight">
                          {preset.name}
                        </p>
                        <span className="text-[10px] text-sky-600 font-medium">Gunakan</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: Kop Surat & Dinas */}
          {activeTab === 'kop' && (
            <div className="space-y-3.5">
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-amber-800 text-xs">
                Kop surat akan dicetak pada bagian paling atas Rapor, Surat Panggilan BK / SP, SKL, dan Lembar Penempatan PKL.
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Baris 1 Kop (Pemerintah Provinsi / Yayasan)
                </label>
                <input
                  type="text"
                  value={formData.kopProvinsi || 'PEMERINTAH PROVINSI DAERAH KHUSUS JAKARTA'}
                  onChange={(e) => setFormData({ ...formData, kopProvinsi: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg uppercase font-semibold focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Baris 2 Kop (Dinas Pendidikan / Cabang Dinas)
                </label>
                <input
                  type="text"
                  value={formData.kopDinas || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                  onChange={(e) => setFormData({ ...formData, kopDinas: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg uppercase font-semibold focus:ring-2 focus:ring-sky-500"
                />
              </div>

              {/* Live Preview of Kop */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl">
                <p className="text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-2">
                  Pratinjau Kop Surat Resmi:
                </p>
                <div className="bg-white p-4 rounded-lg border border-slate-300 shadow-xs text-center flex items-center justify-between gap-4">
                  <div className="w-14 h-14 shrink-0 flex items-center justify-center">
                    {logoPreview ? (
                      <img src={logoPreview} alt="Logo" className="w-12 h-12 object-contain" />
                    ) : (
                      <School className="w-10 h-10 text-sky-600" />
                    )}
                  </div>
                  <div className="flex-1 text-center">
                    <p className="text-[11px] font-bold text-slate-800 tracking-wider">
                      {formData.kopProvinsi || 'PEMERINTAH PROVINSI DAERAH KHUSUS JAKARTA'}
                    </p>
                    <p className="text-[10px] font-bold text-slate-700">
                      {formData.kopDinas || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
                    </p>
                    <p className="text-sm font-black text-slate-900 uppercase">
                      {formData.name}
                    </p>
                    <p className="text-[9px] text-slate-500">
                      {formData.address} | Telp: {formData.phone} | NPSN: {formData.npsn}
                    </p>
                  </div>
                  <div className="w-14 h-14 shrink-0" />
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: Kepala Sekolah & Pejabat */}
          {activeTab === 'pejabat' && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Nama Kepala Sekolah &amp; Gelar
                </label>
                <input
                  type="text"
                  value={formData.principal}
                  onChange={(e) => setFormData({ ...formData, principal: e.target.value })}
                  placeholder="Contoh: Dr. Ir. H. Bambang Suryono, M.T."
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-bold text-slate-900 focus:ring-2 focus:ring-sky-500"
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
                  placeholder="Contoh: 19720315 199702 1 002"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-mono focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Kepala Bimbingan Konseling (BK)
                </label>
                <input
                  type="text"
                  value={formData.counselingHead}
                  onChange={(e) => setFormData({ ...formData, counselingHead: e.target.value })}
                  placeholder="Contoh: Dra. Hj. Siti Rahmawati, M.Pd."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">
                  Waka Hubungan Industri (Hubin / PKL)
                </label>
                <input
                  type="text"
                  value={formData.hubinHead}
                  onChange={(e) => setFormData({ ...formData, hubinHead: e.target.value })}
                  placeholder="Contoh: Enggar Prasetyo, S.T., M.Kom."
                  className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Tahun Ajaran Aktif</label>
                <input
                  type="text"
                  value={formData.academicYear}
                  onChange={(e) => setFormData({ ...formData, academicYear: e.target.value })}
                  placeholder="2025/2026"
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold focus:ring-2 focus:ring-sky-500"
                />
              </div>

              <div>
                <label className="block font-semibold text-slate-700 mb-1">Semester Aktif</label>
                <select
                  value={formData.semester}
                  onChange={(e) => setFormData({ ...formData, semester: e.target.value })}
                  className="w-full p-2.5 border border-slate-300 rounded-lg font-semibold focus:ring-2 focus:ring-sky-500"
                >
                  <option value="Ganjil">Semester Ganjil</option>
                  <option value="Genap">Semester Genap</option>
                </select>
              </div>
            </div>
          )}

          {/* Action Footer */}
          <div className="pt-4 border-t border-slate-200 flex flex-wrap items-center justify-between gap-3">
            <span className="text-slate-500 text-xs flex items-center gap-1.5">
              <CloudUpload className="w-3.5 h-3.5 text-sky-600" /> Tersimpan ke Firebase Firestore &amp; Local Storage
            </span>

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
                  saveSuccess
                    ? 'bg-emerald-600'
                    : 'bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 shadow-md shadow-sky-500/20'
                }`}
              >
                {saveSuccess ? (
                  <>
                    <Check className="w-4 h-4" /> Data Sekolah Diperbarui!
                  </>
                ) : (
                  'Simpan Identitas Sekolah'
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
