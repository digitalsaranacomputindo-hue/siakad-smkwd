import type {
  BKRecord,
  GradeRecord,
  GraduationSummary,
  PKLPlacement,
  TracerStudyRecord,
  UKKRecord
} from '../types/academic.ts';

/**
 * Hitung nilai akhir mata pelajaran Kurikulum Merdeka SMK
 * Bobot: Formatif 30%, Sumatif Materi 40%, Sumatif Akhir Semester (SAS) 30%
 */
export function calculateFinalGrade(
  formative: number,
  sumativeMaterial: number,
  sumativeFinal: number,
  kkm = 75
): {
  finalScore: number;
  letterGrade: 'A' | 'B' | 'C' | 'D';
  isPassed: boolean;
  competencyText: string;
} {
  const f = Math.max(0, Math.min(100, formative));
  const sm = Math.max(0, Math.min(100, sumativeMaterial));
  const sf = Math.max(0, Math.min(100, sumativeFinal));

  const weighted = Math.round((f * 0.3) + (sm * 0.4) + (sf * 0.3));

  let letterGrade: 'A' | 'B' | 'C' | 'D' = 'D';
  let competencyText = 'Perlu bimbingan intensif dalam menguasai capaian pembelajaran.';

  if (weighted >= 90) {
    letterGrade = 'A';
    competencyText = 'Menunjukkan penguasaan yang sangat unggul dan komprehensif pada seluruh capaian pembelajaran.';
  } else if (weighted >= 80) {
    letterGrade = 'B';
    competencyText = 'Menunjukkan penguasaan yang baik dan tuntas dalam capaian pembelajaran pokok.';
  } else if (weighted >= kkm) {
    letterGrade = 'C';
    competencyText = 'Telah mencapai kriteria ketercapaian tujuan pembelajaran minimum dengan cukup baik.';
  } else {
    letterGrade = 'D';
    competencyText = 'Belum mencapai kriteria minimum (KKTP), direkomendasikan perbaikan & remedial.';
  }

  return {
    finalScore: weighted,
    letterGrade,
    isPassed: weighted >= kkm,
    competencyText,
  };
}

/**
 * Perhitungan Uji Kompetensi Keahlian (UKK) Standar BNSP / LSP-P1 SMK
 * Bobot: Praktik Kejuruan 60%, Teori Kejuruan 20%, Portofolio 20%
 */
export function calculateUKKScore(
  practical: number,
  theory: number,
  portfolio: number
): {
  finalScore: number;
  predicate: 'SANGAT_KOMPETEN' | 'KOMPETEN' | 'BELUM_KOMPETEN';
  isCompetent: boolean;
} {
  const p = Math.max(0, Math.min(100, practical));
  const t = Math.max(0, Math.min(100, theory));
  const pf = Math.max(0, Math.min(100, portfolio));

  const score = Math.round((p * 0.6) + (t * 0.2) + (pf * 0.2));

  let predicate: 'SANGAT_KOMPETEN' | 'KOMPETEN' | 'BELUM_KOMPETEN' = 'BELUM_KOMPETEN';
  if (score >= 88) {
    predicate = 'SANGAT_KOMPETEN';
  } else if (score >= 75) {
    predicate = 'KOMPETEN';
  } else {
    predicate = 'BELUM_KOMPETEN';
  }

  return {
    finalScore: score,
    predicate,
    isCompetent: score >= 75,
  };
}

/**
 * Perhitungan Nilai PKL (Praktik Kerja Lapangan) DU/DI
 * Bobot: Teknis (40%), Kedisiplinan/K3LH (30%), Laporan PKL & Presentasi (30%)
 */
export function calculatePKLScore(
  technical: number,
  disciplineAndSafety: number,
  report: number
): {
  finalScore: number;
  predicate: 'SANGAT_BAIK' | 'BAIK' | 'CUKUP' | 'KURANG';
  passed: boolean;
} {
  const t = Math.max(0, Math.min(100, technical));
  const ds = Math.max(0, Math.min(100, disciplineAndSafety));
  const r = Math.max(0, Math.min(100, report));

  const finalScore = Math.round((t * 0.4) + (ds * 0.3) + (r * 0.3));

  let predicate: 'SANGAT_BAIK' | 'BAIK' | 'CUKUP' | 'KURANG' = 'KURANG';
  if (finalScore >= 88) predicate = 'SANGAT_BAIK';
  else if (finalScore >= 78) predicate = 'BAIK';
  else if (finalScore >= 70) predicate = 'CUKUP';

  return {
    finalScore,
    predicate,
    passed: finalScore >= 75,
  };
}

/**
 * Evaluasi Buku Saku Catatan BK & Poin Pelanggaran / Prestasi
 * Skala Aturan SMK:
 * 0 - 29: Kondisi Normal
 * 30 - 54: Peringatan Lisan & Bimbingan Wali Kelas
 * 55 - 79: Peringatan Tertulis 1 (SP1) & Pemanggilan Orang Tua I
 * 80 - 99: Peringatan Tertulis 2 (SP2) & Skorsing Edukatif
 * >= 100: Peringatan Terakhir (SP3) / Konferensi Kasus Dewan Guru
 */
export function evaluateBKRecords(records: BKRecord[]): {
  totalViolationPoints: number;
  totalRewardPoints: number;
  effectivePoint: number;
  warningLevel: 'NORMAL' | 'PERINGATAN_LISAN' | 'SP1' | 'SP2' | 'SP3_PANGGILAN_ORTU' | 'KONFERENSI_KASUS';
  badgeColor: string;
  recommendation: string;
} {
  let violations = 0;
  let rewards = 0;

  for (const r of records) {
    if (r.isReward || r.category === 'PRESTASI') {
      rewards += Math.abs(r.points || 0);
    } else if (r.category === 'PELANGGARAN') {
      violations += Math.abs(r.points || 0);
    }
  }

  // Net point reduction: Prestasi can offset some minor points up to 50%
  const offset = Math.min(Math.floor(rewards * 0.5), violations);
  const effective = violations - offset;

  let warningLevel: 'NORMAL' | 'PERINGATAN_LISAN' | 'SP1' | 'SP2' | 'SP3_PANGGILAN_ORTU' | 'KONFERENSI_KASUS' = 'NORMAL';
  let badgeColor = 'bg-emerald-100 text-emerald-800 border-emerald-300';
  let recommendation = 'Catatan kedisiplinan baik, pertahankan tata tertib sekolah.';

  if (effective >= 100) {
    warningLevel = 'KONFERENSI_KASUS';
    badgeColor = 'bg-rose-200 text-rose-900 border-rose-400 font-bold';
    recommendation = 'Poin pelanggaran mencapai batas kritis! Diperlukan Konferensi Kasus Dewan Guru dan Kepala Sekolah.';
  } else if (effective >= 80) {
    warningLevel = 'SP3_PANGGILAN_ORTU';
    badgeColor = 'bg-red-100 text-red-800 border-red-300';
    recommendation = 'Penerbitan Surat Peringatan III (SP3) dan Pemanggilan Mendesak Orang Tua/Wali.';
  } else if (effective >= 55) {
    warningLevel = 'SP2';
    badgeColor = 'bg-amber-100 text-amber-800 border-amber-300';
    recommendation = 'Penerbitan Surat Peringatan II (SP2) dan Konseling Khusus Guru BK.';
  } else if (effective >= 30) {
    warningLevel = 'SP1';
    badgeColor = 'bg-yellow-100 text-yellow-800 border-yellow-300';
    recommendation = 'Peringatan Tertulis I (SP1) & Pembinaan oleh Wali Kelas dan Guru BK.';
  } else if (effective >= 15) {
    warningLevel = 'PERINGATAN_LISAN';
    badgeColor = 'bg-blue-100 text-blue-800 border-blue-300';
    recommendation = 'Bimbingan lisan dan pengingat tata tertib bengkel/sekolah.';
  }

  return {
    totalViolationPoints: violations,
    totalRewardPoints: rewards,
    effectivePoint: effective,
    warningLevel,
    badgeColor,
    recommendation,
  };
}

/**
 * Validasi Syarat Kelulusan SMK:
 * 1. Menyelesaikan seluruh program pembelajaran semester 1 - 6 (Rata-rata Rapor >= 75)
 * 2. Nilai Sikap / Perilaku minimal 'BAIK' (Poin pelanggaran BK < 80)
 * 3. Lulus Uji Kompetensi Keahlian (UKK) dengan predikat minimal KOMPETEN (>= 75)
 * 4. Lulus Praktik Kerja Lapangan (PKL) minimal BAIK (>= 75)
 */
export function checkGraduationCriteria(params: {
  averageRaporScore: number;
  ukkScore: number;
  isUkkCompetent: boolean;
  pklScore: number;
  isPklPassed: boolean;
  effectiveBKPoints: number;
  attitudePredicate: 'SANGAT_BAIK' | 'BAIK' | 'CUKUP';
}): {
  isEligible: boolean;
  reasons: string[];
} {
  const reasons: string[] = [];

  if (params.averageRaporScore < 75) {
    reasons.push(`Rata-rata Rapor (${params.averageRaporScore}) di bawah standar kelulusan minimum (75.00).`);
  }

  if (!params.isUkkCompetent || params.ukkScore < 75) {
    reasons.push(`Uji Kompetensi Keahlian (UKK: ${params.ukkScore}) belum mencapai predikat KOMPETEN (min 75.00).`);
  }

  if (!params.isPklPassed || params.pklScore < 75) {
    reasons.push(`Praktik Kerja Lapangan (PKL: ${params.pklScore}) belum dinyatakan Lulus / tuntas oleh DU/DI mitra.`);
  }

  if (params.effectiveBKPoints >= 80) {
    reasons.push(`Catatan kedisiplinan memiliki poin pelanggaran kumulatif tinggi (${params.effectiveBKPoints} poin).`);
  }

  if (params.attitudePredicate === 'CUKUP') {
    reasons.push(`Predikat sikap siswa masih berkategori Cukup (syarat minimal BAIK).`);
  }

  return {
    isEligible: reasons.length === 0,
    reasons,
  };
}

/**
 * Hitung Statistik Tracer Study Lulusan SMK (BMW: Bekerja, Melanjutkan, Wirausaha)
 */
export function calculateBMWStatistics(tracers: TracerStudyRecord[]): {
  totalResponded: number;
  countBekerja: number;
  countMelanjutkan: number;
  countWirausaha: number;
  countMencariKerja: number;
  pctBekerja: number;
  pctMelanjutkan: number;
  pctWirausaha: number;
  pctMencariKerja: number;
  bmwAbsorptionRate: number; // (Bekerja + Melanjutkan + Wirausaha) / Total * 100
  alignmentHighPct: number; // Keselarasan sangat selaras + selaras
} {
  const total = tracers.length;
  if (total === 0) {
    return {
      totalResponded: 0,
      countBekerja: 0,
      countMelanjutkan: 0,
      countWirausaha: 0,
      countMencariKerja: 0,
      pctBekerja: 0,
      pctMelanjutkan: 0,
      pctWirausaha: 0,
      pctMencariKerja: 0,
      bmwAbsorptionRate: 0,
      alignmentHighPct: 0,
    };
  }

  let bekerja = 0;
  let melanjutkan = 0;
  let wirausaha = 0;
  let mencariKerja = 0;
  let aligned = 0;

  for (const t of tracers) {
    if (t.statusBMW === 'BEKERJA') bekerja++;
    else if (t.statusBMW === 'MELANJUTKAN') melanjutkan++;
    else if (t.statusBMW === 'WIRAUSAHA') wirausaha++;
    else mencariKerja++;

    if (t.curriculumRelevance === 'SANGAT_SELARAS' || t.curriculumRelevance === 'SELARAS') {
      aligned++;
    }
  }

  const bmwCount = bekerja + melanjutkan + wirausaha;
  const bmwRate = Math.round((bmwCount / total) * 100);
  const alignRate = Math.round((aligned / total) * 100);

  return {
    totalResponded: total,
    countBekerja: bekerja,
    countMelanjutkan: melanjutkan,
    countWirausaha: wirausaha,
    countMencariKerja: mencariKerja,
    pctBekerja: Math.round((bekerja / total) * 100),
    pctMelanjutkan: Math.round((melanjutkan / total) * 100),
    pctWirausaha: Math.round((wirausaha / total) * 100),
    pctMencariKerja: Math.round((mencariKerja / total) * 100),
    bmwAbsorptionRate: bmwRate,
    alignmentHighPct: alignRate,
  };
}

/**
 * Konversi skala nilai jika admin memilih skala 1-4 (IPK)
 */
export function convertScoreToScale(score: number, scale: '0-100' | '1-4'): number {
  if (scale === '0-100') return Math.round(score);
  // Scale 1 - 4.00 standard
  const converted = Math.max(1.0, Math.min(4.0, Number((score / 25).toFixed(2))));
  return converted;
}

/**
 * Pemisahan Nilai Pengetahuan & Keterampilan untuk Format Kurikulum 2013 (K13)
 */
export function deriveK13Scores(finalScore: number, formative: number, sumative: number): {
  pengetahuan: number;
  keterampilan: number;
  predikatPengetahuan: 'A' | 'B' | 'C' | 'D';
  predikatKeterampilan: 'A' | 'B' | 'C' | 'D';
} {
  const pengetahuan = Math.round((formative * 0.4) + (sumative * 0.6));
  const keterampilan = Math.round(finalScore);

  const getPred = (val: number): 'A' | 'B' | 'C' | 'D' => {
    if (val >= 90) return 'A';
    if (val >= 80) return 'B';
    if (val >= 75) return 'C';
    return 'D';
  };

  return {
    pengetahuan,
    keterampilan,
    predikatPengetahuan: getPred(pengetahuan),
    predikatKeterampilan: getPred(keterampilan),
  };
}

