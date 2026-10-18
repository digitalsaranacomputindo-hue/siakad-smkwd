import React from 'react';
import { Printer, X, CheckCircle2, ShieldCheck, QrCode, Award, Briefcase, FileCheck } from 'lucide-react';
import { SMK_PROFILE, DEFAULT_REPORT_CONFIG } from '../data/initialData.ts';
import type { BKRecord, GradeRecord, IndustryPartner, PKLPlacement, ReportCardConfig, SchoolProfile, Student, UKKRecord } from '../types/academic.ts';
import { convertScoreToScale, deriveK13Scores } from '../utils/smkLogic.ts';

export type PrintDocType = 'SKL' | 'STUDENT_CARD' | 'SP_LETTER' | 'PKL_CERT' | 'RAPOR';

interface PrintModalProps {
  isOpen: boolean;
  onClose: () => void;
  docType: PrintDocType;
  school?: SchoolProfile;
  data: {
    student?: Student;
    avgRapor?: number;
    ukkScore?: number;
    pklScore?: number;
    sklNumber?: string;
    warningType?: string;
    bkRecord?: BKRecord;
    placement?: PKLPlacement;
    partner?: IndustryPartner;
    grades?: GradeRecord[];
    ukk?: UKKRecord;
    reportConfig?: ReportCardConfig;
    schoolProfile?: SchoolProfile;
  };
}

export const PrintModal: React.FC<PrintModalProps> = ({
  isOpen,
  onClose,
  docType,
  school,
  data,
}) => {
  if (!isOpen) return null;

  const activeSchool: SchoolProfile = school || data.schoolProfile || SMK_PROFILE;

  const handlePrint = () => {
    window.print();
  };

  const student = data.student;

  return (
    <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto print:p-0 print:bg-white">
      <div className="bg-white rounded-2xl max-w-3xl w-full p-6 shadow-2xl relative my-8 print:shadow-none print:m-0 print:p-0 print:border-none">
        {/* Top Controls (Hidden in Print) */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-slate-200 print:hidden">
          <div className="flex items-center gap-2">
            <Printer className="w-5 h-5 text-blue-600" />
            <h3 className="font-bold text-slate-900 text-sm">
              Pratinjau Cetak Dokumen Resmi Sekolah
            </h3>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-bold text-xs flex items-center gap-1.5 shadow-sm"
            >
              <Printer className="w-4 h-4" /> Cetak Sekarang (Print / PDF)
            </button>
            <button
              onClick={onClose}
              className="p-2 text-slate-400 hover:text-slate-700 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Paper Area */}
        <div className="bg-white p-6 sm:p-8 text-slate-900 border border-slate-200 rounded-xl print:border-none print:p-4">
          {/* Header Kop Surat Resmi */}
          <div className="flex items-center justify-between border-b-2 border-slate-900 pb-3 mb-6 relative">
            <div className="w-16 h-16 flex items-center justify-center shrink-0">
              {activeSchool.logoUrl ? (
                <img
                  src={activeSchool.logoUrl}
                  alt="Logo Sekolah"
                  className="w-14 h-14 object-contain"
                />
              ) : (
                <div className="w-14 h-14 rounded-xl bg-slate-900 text-white flex items-center justify-center font-black text-xl">
                  SMK
                </div>
              )}
            </div>
            <div className="flex-1 text-center px-2">
              <div className="text-[11px] uppercase tracking-wider font-bold text-slate-600">
                {activeSchool.kopProvinsi || 'PEMERINTAH PROVINSI DAERAH KHUSUS JAKARTA'}
              </div>
              <div className="text-[10px] uppercase font-bold text-slate-700">
                {activeSchool.kopDinas || 'DINAS PENDIDIKAN DAN KEBUDAYAAN'}
              </div>
              <div className="text-base sm:text-lg font-black tracking-tight text-slate-900 uppercase mt-0.5">
                {activeSchool.name}
              </div>
              <div className="text-[10px] text-slate-600 font-medium">
                {activeSchool.status} • Akreditasi {activeSchool.accreditation}
              </div>
              <div className="text-[9px] text-slate-500 mt-0.5">
                {activeSchool.address} • Telp: {activeSchool.phone} • NPSN: {activeSchool.npsn}
              </div>
            </div>
            <div className="w-16 h-16 shrink-0 flex items-center justify-center">
              <QrCode className="w-10 h-10 text-slate-400" />
            </div>
          </div>

          {/* DOCUMENT TYPE 1: SKL (SURAT KETERANGAN LULUS) */}
          {docType === 'SKL' && student && (
            <div className="space-y-4 text-xs">
              <div className="text-center space-y-0.5">
                <h2 className="text-base font-black underline uppercase tracking-wide">
                  Surat Keterangan Lulus (SKL)
                </h2>
                <div className="text-[11px] font-mono text-slate-600">
                  Nomor: {data.sklNumber || `421.5/SKL/${student.major}/2026/014`}
                </div>
              </div>

              <p className="leading-relaxed text-justify">
                Kepala Sekolah Menengah Kejuruan ({activeSchool.name}), menerangkan bahwa:
              </p>

              <div className="grid grid-cols-3 gap-2 p-3.5 bg-slate-50 rounded-lg border border-slate-200 font-sans">
                <div className="space-y-1 text-slate-500">
                  <div>Nama Lengkap</div>
                  <div>NISN / NIK</div>
                  <div>Tempat, Tanggal Lahir</div>
                  <div>Program Keahlian</div>
                  <div>Konsentrasi Keahlian</div>
                </div>
                <div className="col-span-2 space-y-1 font-semibold text-slate-900">
                  <div>: {student.name}</div>
                  <div>: {student.nisn} / {student.nik}</div>
                  <div>: {student.birthPlace}, {student.birthDate}</div>
                  <div>: Teknologi &amp; Rekayasa Kejuruan</div>
                  <div>: {student.major} ({student.className})</div>
                </div>
              </div>

              <div className="p-3 bg-emerald-50 border border-emerald-300 rounded-lg text-center font-bold text-emerald-950 text-sm">
                DINYATAKAN: LULUS
              </div>

              <p className="leading-relaxed text-justify">
                Dari satuan pendidikan berdasarkan kriteria kelulusan yang ditetapkan, dengan rincian perolehan nilai akhir sebagai berikut:
              </p>

              <table className="w-full text-left border border-slate-300">
                <thead className="bg-slate-100 font-bold text-[11px]">
                  <tr>
                    <th className="p-2 border border-slate-300">Komponen Penilaian Kelulusan</th>
                    <th className="p-2 border border-slate-300 text-center">Nilai Angka</th>
                    <th className="p-2 border border-slate-300 text-center">Predikat / Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="p-2 border border-slate-300">Rata-rata Rapor (Semester 1 s/d 6)</td>
                    <td className="p-2 border border-slate-300 text-center font-bold">{data.avgRapor || 85}</td>
                    <td className="p-2 border border-slate-300 text-center">Memenuhi Syarat</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300">Uji Kompetensi Keahlian (UKK Asesor DU/DI &amp; BNSP)</td>
                    <td className="p-2 border border-slate-300 text-center font-bold">{data.ukkScore || 88}</td>
                    <td className="p-2 border border-slate-300 text-center font-bold text-emerald-800">KOMPETEN</td>
                  </tr>
                  <tr>
                    <td className="p-2 border border-slate-300">Praktik Kerja Lapangan (PKL Industri)</td>
                    <td className="p-2 border border-slate-300 text-center font-bold">{data.pklScore || 88}</td>
                    <td className="p-2 border border-slate-300 text-center">Sangat Baik</td>
                  </tr>
                </tbody>
              </table>

              <p className="text-[11px] text-slate-500 italic">
                * Surat Keterangan Lulus ini berlaku sah sebagai pengganti Ijazah sementara sampai dengan diterbitkannya Ijazah Asli dari Kementerian Pendidikan Dasar dan Menengah.
              </p>

              {/* Tanda Tangan & QR */}
              <div className="pt-6 flex justify-between items-end">
                <div className="text-center p-2 border border-slate-200 rounded-lg inline-block">
                  <div className="w-16 h-16 bg-slate-900 text-white flex items-center justify-center font-mono text-[9px] rounded">
                    [QR CODE VALIDASI]
                  </div>
                  <span className="text-[9px] text-slate-500 block mt-1">Scan Keabsahan</span>
                </div>

                <div className="text-right space-y-1">
                  <div className="text-[11px]">Jakarta, 28 Mei 2026</div>
                  <div className="text-[11px] font-semibold">Kepala Sekolah,</div>
                  <div className="h-14" />
                  <div className="font-bold underline text-xs">{activeSchool.principal}</div>
                  <div className="text-[10px] text-slate-500">NIP. 19720315 199702 1 002</div>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT TYPE 2: KARTU PELAJAR */}
          {docType === 'STUDENT_CARD' && student && (
            <div className="space-y-4">
              <div className="max-w-md mx-auto p-5 rounded-2xl bg-gradient-to-tr from-slate-900 via-blue-950 to-slate-900 text-white shadow-xl relative overflow-hidden border border-slate-800">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div>
                    <div className="text-[10px] font-bold tracking-widest text-emerald-400 uppercase">
                      KARTU TANDA PELAJAR SMK
                    </div>
                    <div className="text-xs font-bold text-white">{activeSchool.shortName}</div>
                  </div>
                  <ShieldCheck className="w-6 h-6 text-emerald-400" />
                </div>

                <div className="mt-4 flex gap-4 items-center">
                  <img
                    src={student.photoUrl}
                    alt={student.name}
                    className="w-20 h-24 rounded-lg object-cover ring-2 ring-emerald-400/50 shrink-0"
                  />
                  <div className="space-y-1 text-xs">
                    <div className="text-sm font-bold text-white">{student.name}</div>
                    <div className="text-emerald-300 font-mono text-[11px]">NISN: {student.nisn}</div>
                    <div className="text-slate-300 text-[11px]">{student.className} • {student.major}</div>
                    <div className="text-slate-400 text-[10px]">Lahir: {student.birthPlace}, {student.birthDate}</div>
                    <div className="text-slate-400 text-[10px]">Alamat: {student.address}</div>
                  </div>
                </div>

                <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>VALID THRU: 2027</span>
                  <span className="font-mono text-emerald-300">||| |||| || ||||| ||||</span>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT TYPE 3: SURAT PEMANGGILAN ORANG TUA / SP */}
          {docType === 'SP_LETTER' && student && (
            <div className="space-y-4 text-xs">
              <div className="flex justify-between items-start">
                <div>
                  <div>Nomor : 421.7/BK-SP/SMKN1/{student.major}/2026/044</div>
                  <div>Lampiran : -</div>
                  <div className="font-bold">
                    Perihal : {data.warningType || 'Surat Pemanggilan Orang Tua / Wali Siswa'}
                  </div>
                </div>
                <div className="text-right">Jakarta, {new Date().toLocaleDateString('id-ID')}</div>
              </div>

              <div className="pt-2">
                <div>Kepada Yth.</div>
                <div className="font-bold">Bapak / Ibu Orang Tua / Wali dari: {student.name}</div>
                <div>di Tempat</div>
              </div>

              <p className="leading-relaxed text-justify">
                Dengan hormat, sehubungan dengan evaluasi perkembangan kedisiplinan dan tata tertib siswa di lingkungan sekolah dan bengkel vokasi, kami mengharapkan kehadiran Bapak/Ibu pada:
              </p>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg space-y-1">
                <div>Hari / Tanggal : <strong>Senin, 3 hari sejak surat ini diterbitkan</strong></div>
                <div>Waktu : <strong>Pukul 09:00 WIB s/d selesai</strong></div>
                <div>Tempat : <strong>Ruang Bimbingan &amp; Konseling (BK) SMKN 1 Nusantara</strong></div>
                <div>Menemui : <strong>{activeSchool.counselingHead} (Guru BK)</strong></div>
              </div>

              {data.bkRecord && (
                <div className="p-2.5 bg-rose-50 border border-rose-200 rounded text-rose-900">
                  <div className="font-bold">Catatan Poin Masalah:</div>
                  <div>{data.bkRecord.title} — {data.bkRecord.description}</div>
                  <div className="mt-1 text-[11px] font-semibold">
                    Akumulasi Poin: {data.bkRecord.points} Poin (Status: {data.warningType || 'Peringatan'})
                  </div>
                </div>
              )}

              <p className="leading-relaxed">
                Mengingat pentingnya koordinasi demi masa depan dan kelanjutan pendidikan ananda di SMK, kehadiran Bapak/Ibu sangat kami harapkan tepat pada waktunya.
              </p>

              <div className="pt-6 flex justify-between items-end">
                <div>
                  <div className="text-[11px] font-semibold">Guru Bimbingan Konseling,</div>
                  <div className="h-14" />
                  <div className="font-bold underline text-xs">{activeSchool.counselingHead}</div>
                </div>
                <div className="text-right">
                  <div className="text-[11px] font-semibold">Mengetahui, Kepala Sekolah</div>
                  <div className="h-14" />
                  <div className="font-bold underline text-xs">{activeSchool.principal}</div>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT TYPE 4: SERTIFIKAT PKL DU/DI */}
          {docType === 'PKL_CERT' && student && data.placement && (
            <div className="space-y-4 text-xs border-4 border-double border-amber-600/40 p-6 rounded-xl">
              <div className="text-center space-y-1">
                <div className="text-amber-800 font-bold uppercase tracking-widest text-[11px]">
                  SERTIFIKAT PRAKTIK KERJA LAPANGAN (PKL) INDUSTRI
                </div>
                <div className="text-sm font-semibold text-slate-700">
                  Diberikan atas kerjasama:
                </div>
                <div className="text-base font-black text-slate-900">
                  {data.placement.companyName} &amp; {activeSchool.shortName}
                </div>
                <div className="text-[10px] font-mono text-slate-500">
                  Nomor Sertifikat: CERT-PKL/DUDI/{student.major}/2026/088
                </div>
              </div>

              <div className="text-center my-4">
                <div className="text-xs text-slate-500">Diberikan kepada:</div>
                <div className="text-lg font-black text-slate-900 underline mt-1">{student.name}</div>
                <div className="text-xs text-slate-600 font-mono">NISN: {student.nisn} • {student.className}</div>
              </div>

              <p className="text-center leading-relaxed max-w-lg mx-auto">
                Telah berhasil menyelesaikan Program Praktik Kerja Lapangan (PKL) Industri selama 6 (enam) bulan dengan predikat:
              </p>

              <div className="p-3 bg-amber-50 border border-amber-300 rounded-lg text-center font-bold text-amber-900 text-sm max-w-xs mx-auto">
                {data.placement.predicate} (Nilai: {data.placement.finalScore})
              </div>

              {data.placement.industryFeedback && (
                <p className="text-center italic text-slate-600 text-[11px]">
                  &ldquo;{data.placement.industryFeedback}&rdquo;
                </p>
              )}

              <div className="pt-6 flex justify-between items-end">
                <div className="text-center">
                  <div className="text-[11px] font-semibold">Pembimbing Industri (DU/DI),</div>
                  <div className="h-12" />
                  <div className="font-bold underline text-xs">{data.placement.industryMentor}</div>
                  <div className="text-[10px] text-slate-500">{data.placement.companyName}</div>
                </div>

                <div className="text-center">
                  <div className="text-[11px] font-semibold">Waka Hubungan Industri (Hubin),</div>
                  <div className="h-12" />
                  <div className="font-bold underline text-xs">{activeSchool.hubinHead}</div>
                  <div className="text-[10px] text-slate-500">{activeSchool.shortName}</div>
                </div>
              </div>
            </div>
          )}

          {/* DOCUMENT TYPE 5: RAPOR SISWA (DYNAMIC FORMAT CONFIG) */}
          {docType === 'RAPOR' && student && (() => {
            const cfg = data.reportConfig || DEFAULT_REPORT_CONFIG;
            const gradesList = data.grades || [];
            const ukkData = data.ukk;
            const pklPlacement = data.placement;

            return (
              <div className="space-y-4 text-xs">
                {/* Document Title Header */}
                <div className="text-center space-y-0.5 border-b border-slate-200 pb-2">
                  <h2 className="text-base font-black underline uppercase text-slate-900">
                    {cfg.titleHeader}
                  </h2>
                  <div className="text-[11px] text-slate-600 font-medium">{cfg.subHeader}</div>
                  <div className="text-[10px] text-blue-700 font-semibold uppercase tracking-wider">
                    Format: {cfg.templateType.replace(/_/g, ' ')}
                  </div>
                </div>

                {/* Student Info Box */}
                <div className="grid grid-cols-2 gap-2 p-3 bg-slate-50 rounded-lg border border-slate-200 font-sans">
                  <div className="space-y-0.5">
                    <div>Nama Siswa: <strong className="text-slate-900">{student.name}</strong></div>
                    <div>NISN / NIK: <strong className="text-slate-900">{student.nisn} / {student.nik}</strong></div>
                    <div>Kelas / Fase: <strong className="text-slate-900">{student.className}</strong></div>
                  </div>
                  <div className="space-y-0.5 text-right sm:text-left">
                    <div>Program Keahlian: <strong className="text-slate-900">{student.major}</strong></div>
                    <div>Semester / T.A.: <strong className="text-slate-900">Genap / {activeSchool.academicYear}</strong></div>
                    <div>Standar Ketuntasan (KKM): <strong className="text-blue-700">{cfg.kkmStandard}</strong></div>
                  </div>
                </div>

                {/* TEMPLATE A: KURIKULUM MERDEKA */}
                {cfg.templateType === 'KURIKULUM_MERDEKA' && (
                  <div className="space-y-3">
                    <table className="w-full text-left border border-slate-300">
                      <thead className="bg-slate-100 font-bold text-[11px]">
                        <tr>
                          <th className="p-2 border border-slate-300">Mata Pelajaran</th>
                          {cfg.showFormativeSumativeBreakdown && (
                            <>
                              <th className="p-2 border border-slate-300 text-center">Formatif (30%)</th>
                              <th className="p-2 border border-slate-300 text-center">Sumatif (40%)</th>
                              <th className="p-2 border border-slate-300 text-center">SAS (30%)</th>
                            </>
                          )}
                          <th className="p-2 border border-slate-300 text-center">
                            Nilai Akhir {cfg.gradingScale === '1-4' ? '(IPK 1-4)' : '(0-100)'}
                          </th>
                          <th className="p-2 border border-slate-300 text-center">Predikat</th>
                          {cfg.showCompetencyDescription && (
                            <th className="p-2 border border-slate-300">Capaian Kompetensi Pembelajaran</th>
                          )}
                        </tr>
                      </thead>
                      <tbody>
                        {gradesList.map((g) => {
                          const displayScore = convertScoreToScale(g.finalScore, cfg.gradingScale);
                          return (
                            <tr key={g.id}>
                              <td className="p-2 border border-slate-300 font-semibold text-slate-900">
                                {g.subjectName}
                                <span className="block text-[10px] text-slate-400 font-normal font-mono">{g.subjectCode}</span>
                              </td>
                              {cfg.showFormativeSumativeBreakdown && (
                                <>
                                  <td className="p-2 border border-slate-300 text-center">{g.formativeScore}</td>
                                  <td className="p-2 border border-slate-300 text-center">{g.sumativeMaterialScore}</td>
                                  <td className="p-2 border border-slate-300 text-center">{g.sumativeFinalScore}</td>
                                </>
                              )}
                              <td className="p-2 border border-slate-300 text-center font-bold text-blue-700">
                                {displayScore}
                              </td>
                              <td className="p-2 border border-slate-300 text-center font-bold">
                                {g.letterGrade}
                              </td>
                              {cfg.showCompetencyDescription && (
                                <td className="p-2 border border-slate-300 text-[11px] text-slate-600">
                                  {g.competencyAchievement}
                                </td>
                              )}
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TEMPLATE B: KURIKULUM 2013 (K13) */}
                {cfg.templateType === 'KURIKULUM_2013' && (
                  <div className="space-y-3">
                    <table className="w-full text-left border border-slate-300">
                      <thead className="bg-slate-100 font-bold text-[10px] uppercase">
                        <tr>
                          <th rowSpan={2} className="p-2 border border-slate-300">Mata Pelajaran</th>
                          <th rowSpan={2} className="p-2 border border-slate-300 text-center">KKM</th>
                          <th colSpan={2} className="p-2 border border-slate-300 text-center bg-blue-50/70">
                            Pengetahuan (KD-3)
                          </th>
                          <th colSpan={2} className="p-2 border border-slate-300 text-center bg-emerald-50/70">
                            Keterampilan (KD-4)
                          </th>
                        </tr>
                        <tr>
                          <th className="p-1 border border-slate-300 text-center">Angka</th>
                          <th className="p-1 border border-slate-300 text-center">Predikat</th>
                          <th className="p-1 border border-slate-300 text-center">Angka</th>
                          <th className="p-1 border border-slate-300 text-center">Predikat</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradesList.map((g) => {
                          const k13 = deriveK13Scores(g.finalScore, g.formativeScore, g.sumativeMaterialScore);
                          return (
                            <tr key={g.id}>
                              <td className="p-2 border border-slate-300 font-semibold">{g.subjectName}</td>
                              <td className="p-2 border border-slate-300 text-center font-medium">{cfg.kkmStandard}</td>
                              <td className="p-2 border border-slate-300 text-center font-bold text-slate-800">
                                {convertScoreToScale(k13.pengetahuan, cfg.gradingScale)}
                              </td>
                              <td className="p-2 border border-slate-300 text-center font-bold">{k13.predikatPengetahuan}</td>
                              <td className="p-2 border border-slate-300 text-center font-bold text-blue-700">
                                {convertScoreToScale(k13.keterampilan, cfg.gradingScale)}
                              </td>
                              <td className="p-2 border border-slate-300 text-center font-bold">{k13.predikatKeterampilan}</td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>

                    <div className="grid grid-cols-2 gap-2 p-2.5 bg-slate-50 border border-slate-200 rounded">
                      <div>
                        <span className="font-semibold block">Predikat Sikap Spiritual:</span>
                        <span className="text-emerald-700 font-bold">SANGAT BAIK (A)</span>
                        <p className="text-[10px] text-slate-500">Taat beribadah, berperilaku syukur dan toleran.</p>
                      </div>
                      <div>
                        <span className="font-semibold block">Predikat Sikap Sosial &amp; Kerja:</span>
                        <span className="text-emerald-700 font-bold">BAIK (B)</span>
                        <p className="text-[10px] text-slate-500">Jujur, disiplin bengkel, santun dan bertanggung jawab.</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* TEMPLATE C: DUAL SYSTEM & INDUSTRI TEFA */}
                {cfg.templateType === 'DUAL_SYSTEM_TEFA' && (
                  <div className="space-y-3">
                    <table className="w-full text-left border border-slate-300">
                      <thead className="bg-slate-100 font-bold text-[10px]">
                        <tr>
                          <th className="p-2 border border-slate-300">Unit Kompetensi / Klaster Kejuruan</th>
                          <th className="p-2 border border-slate-300 text-center">Teori Kejuruan (30%)</th>
                          <th className="p-2 border border-slate-300 text-center">Praktik TEFA Jobsheet (70%)</th>
                          <th className="p-2 border border-slate-300 text-center">Nilai Akhir Industri</th>
                          <th className="p-2 border border-slate-300 text-center">Standar BNSP</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradesList.map((g) => {
                          const displayScore = convertScoreToScale(g.finalScore, cfg.gradingScale);
                          return (
                            <tr key={g.id}>
                              <td className="p-2 border border-slate-300 font-semibold">
                                {g.subjectName}
                                <div className="text-[10px] text-slate-500">{g.category.replace(/_/g, ' ')}</div>
                              </td>
                              <td className="p-2 border border-slate-300 text-center">{g.formativeScore}</td>
                              <td className="p-2 border border-slate-300 text-center">{g.sumativeFinalScore}</td>
                              <td className="p-2 border border-slate-300 text-center font-bold text-emerald-700 text-sm">
                                {displayScore}
                              </td>
                              <td className="p-2 border border-slate-300 text-center">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-100 text-emerald-800">
                                  {g.finalScore >= cfg.kkmStandard ? 'KOMPETEN' : 'BELUM'}
                                </span>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* TEMPLATE D: TRANSKRIP RINGKAS 1 HALAMAN */}
                {cfg.templateType === 'TRANSKRIP_RINGKAS' && (
                  <div className="space-y-3">
                    <table className="w-full text-left border border-slate-300 text-[11px]">
                      <thead className="bg-slate-100 font-bold">
                        <tr>
                          <th className="p-1.5 border border-slate-300 text-center w-8">No</th>
                          <th className="p-1.5 border border-slate-300">Kode &amp; Mata Pelajaran</th>
                          <th className="p-1.5 border border-slate-300 text-center">Kelompok</th>
                          <th className="p-1.5 border border-slate-300 text-center">Nilai (0-100)</th>
                          <th className="p-1.5 border border-slate-300 text-center">Indeks Huruf</th>
                          <th className="p-1.5 border border-slate-300 text-center">Bobot SKS</th>
                        </tr>
                      </thead>
                      <tbody>
                        {gradesList.map((g, idx) => (
                          <tr key={g.id}>
                            <td className="p-1.5 border border-slate-300 text-center">{idx + 1}</td>
                            <td className="p-1.5 border border-slate-300 font-semibold">{g.subjectName}</td>
                            <td className="p-1.5 border border-slate-300 text-center text-[10px]">{g.category.replace(/_/g, ' ')}</td>
                            <td className="p-1.5 border border-slate-300 text-center font-bold">{g.finalScore}</td>
                            <td className="p-1.5 border border-slate-300 text-center font-bold text-blue-700">{g.letterGrade}</td>
                            <td className="p-1.5 border border-slate-300 text-center font-mono">
                              {g.letterGrade === 'A' ? '4.00' : g.letterGrade === 'B' ? '3.00' : '2.00'}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}

                {/* Optional UKK Section */}
                {cfg.showUKKSection && ukkData && (
                  <div className="p-2.5 bg-emerald-50/70 border border-emerald-200 rounded-lg space-y-1">
                    <div className="font-bold text-emerald-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Award className="w-4 h-4 text-emerald-600" />
                        Uji Kompetensi Keahlian (UKK) &amp; Sertifikasi Profesi LSP-P1 BNSP
                      </span>
                      <span className="px-2 py-0.5 rounded bg-emerald-200 text-emerald-900 font-bold text-[10px]">
                        {ukkData.predicate} ({ukkData.finalScore})
                      </span>
                    </div>
                    <div className="text-[11px] text-emerald-800">
                      Skema: {ukkData.schemeTitle} • Asesor Industri: {ukkData.externalAssessor} ({ukkData.assessorCompany})
                    </div>
                    {ukkData.certificateNo && (
                      <div className="text-[10px] font-mono text-slate-600">
                        No. Lisensi BNSP: {ukkData.certificateNo}
                      </div>
                    )}
                  </div>
                )}

                {/* Optional PKL Section */}
                {cfg.showPKLSection && pklPlacement && (
                  <div className="p-2.5 bg-amber-50/70 border border-amber-200 rounded-lg space-y-1">
                    <div className="font-bold text-amber-950 flex items-center justify-between">
                      <span className="flex items-center gap-1.5">
                        <Briefcase className="w-4 h-4 text-amber-600" />
                        Praktik Kerja Lapangan (PKL DU/DI)
                      </span>
                      <span className="px-2 py-0.5 rounded bg-amber-200 text-amber-900 font-bold text-[10px]">
                        {pklPlacement.predicate} ({pklPlacement.finalScore})
                      </span>
                    </div>
                    <div className="text-[11px] text-amber-800">
                      Perusahaan Mitra: <strong>{pklPlacement.companyName}</strong> • Pembimbing: {pklPlacement.industryMentor}
                    </div>
                  </div>
                )}

                {/* Optional Attendance & Extracurricular side-by-side */}
                {(cfg.showAttendanceTable || cfg.showExtracurricular) && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {cfg.showAttendanceTable && (
                      <div className="border border-slate-300 rounded p-2 text-[11px]">
                        <span className="font-bold block text-slate-800 mb-1">Ketidakhadiran (Presensi)</span>
                        <div className="space-y-0.5">
                          <div className="flex justify-between"><span>Sakit:</span> <strong>{student.attendance.sakit} hari</strong></div>
                          <div className="flex justify-between"><span>Izin:</span> <strong>{student.attendance.izin} hari</strong></div>
                          <div className="flex justify-between"><span>Tanpa Keterangan (Alpa):</span> <strong>{student.attendance.alpa} hari</strong></div>
                        </div>
                      </div>
                    )}

                    {cfg.showExtracurricular && (
                      <div className="border border-slate-300 rounded p-2 text-[11px]">
                        <span className="font-bold block text-slate-800 mb-1">Kegiatan Ekstrakurikuler</span>
                        <div className="space-y-0.5">
                          <div className="flex justify-between"><span>1. Pramuka Wajib Kejuruan:</span> <strong>A (Sangat Baik)</strong></div>
                          <div className="flex justify-between"><span>2. English Conversation Club:</span> <strong>A (Sangat Baik)</strong></div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Optional Teacher Notes */}
                {cfg.showTeacherNotes && (
                  <div className="p-2.5 bg-slate-50 border border-slate-300 rounded text-[11px]">
                    <span className="font-bold block text-slate-900 mb-0.5">Catatan &amp; Saran Wali Kelas:</span>
                    <p className="italic text-slate-700">
                      &ldquo;{cfg.teacherNotesTemplate}&rdquo;
                    </p>
                  </div>
                )}

                {/* Signatures */}
                <div className="pt-6 flex justify-between items-end border-t border-slate-200">
                  <div className="text-center">
                    <div className="text-[11px]">Mengetahui, Orang Tua / Wali</div>
                    <div className="h-14" />
                    <div className="font-bold underline text-xs">{student.parentName}</div>
                  </div>

                  {cfg.showPrincipalQR && (
                    <div className="text-center p-1.5 border border-slate-200 rounded">
                      <div className="w-14 h-14 bg-slate-900 text-white flex items-center justify-center font-mono text-[8px] rounded">
                        [QR RAPOR]
                      </div>
                      <span className="text-[8px] text-slate-400 block mt-0.5">E-Sign Valid</span>
                    </div>
                  )}

                  <div className="text-right">
                    <div className="text-[11px]">{cfg.reportDatePlace}</div>
                    <div className="text-[11px]">Kepala Sekolah,</div>
                    <div className="h-14" />
                    <div className="font-bold underline text-xs">{cfg.principalName}</div>
                    <div className="text-[10px] text-slate-500 font-mono">NIP. {cfg.principalNip}</div>
                  </div>
                </div>
              </div>
            );
          })()}

        </div>
      </div>
    </div>
  );
};
