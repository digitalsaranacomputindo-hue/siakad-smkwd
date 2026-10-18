import test from 'node:test';
import assert from 'node:assert/strict';
import {
  calculateFinalGrade,
  calculateUKKScore,
  calculatePKLScore,
  evaluateBKRecords,
  checkGraduationCriteria,
  calculateBMWStatistics,
  convertScoreToScale,
  deriveK13Scores,
} from './smkLogic.ts';
import type { BKRecord, TracerStudyRecord } from '../types/academic.ts';

test('calculateFinalGrade calculates weighted Kurikulum Merdeka score and letter', () => {
  // Formatif (90 * 0.3 = 27) + Sumatif (85 * 0.4 = 34) + SAS (90 * 0.3 = 27) = 88 => B
  const gradeB = calculateFinalGrade(90, 85, 90, 75);
  assert.equal(gradeB.finalScore, 88);
  assert.equal(gradeB.letterGrade, 'B');
  assert.equal(gradeB.isPassed, true);

  // High score >= 90 => A
  const gradeA = calculateFinalGrade(95, 92, 94, 75);
  assert.equal(gradeA.letterGrade, 'A');
  assert.equal(gradeA.isPassed, true);

  // Below KKTP 75 => D
  const gradeFail = calculateFinalGrade(60, 65, 55, 75);
  assert.equal(gradeFail.isPassed, false);
  assert.equal(gradeFail.letterGrade, 'D');
});

test('calculateUKKScore applies 60% practical, 20% theory, 20% portfolio', () => {
  // practical: 90 * 0.6 = 54, theory: 80 * 0.2 = 16, portfolio: 85 * 0.2 = 17 => 87 (KOMPETEN)
  const ukk1 = calculateUKKScore(90, 80, 85);
  assert.equal(ukk1.finalScore, 87);
  assert.equal(ukk1.predicate, 'KOMPETEN');
  assert.equal(ukk1.isCompetent, true);

  // 92 practical, 88 theory, 90 portfolio => 55.2 + 17.6 + 18 = 90.8 => 91 (SANGAT_KOMPETEN)
  const ukk2 = calculateUKKScore(92, 88, 90);
  assert.equal(ukk2.finalScore, 91);
  assert.equal(ukk2.predicate, 'SANGAT_KOMPETEN');
  assert.equal(ukk2.isCompetent, true);

  // Incompetent case (< 75)
  const ukkFail = calculateUKKScore(60, 70, 60);
  assert.equal(ukkFail.isCompetent, false);
  assert.equal(ukkFail.predicate, 'BELUM_KOMPETEN');
});

test('calculatePKLScore calculates technical, discipline and report weights', () => {
  const pkl = calculatePKLScore(85, 90, 80);
  // 85*0.4=34, 90*0.3=27, 80*0.3=24 => 85 => BAIK
  assert.equal(pkl.finalScore, 85);
  assert.equal(pkl.predicate, 'BAIK');
  assert.equal(pkl.passed, true);
});

test('evaluateBKRecords handles violation points, rewards, and warning levels', () => {
  const records: BKRecord[] = [
    {
      id: 'bk-1',
      studentId: 's1',
      studentName: 'Budi Santoso',
      studentClass: 'XI RPL 1',
      date: '2026-08-10',
      category: 'PELANGGARAN',
      severity: 'SEDANG',
      title: 'Terlambat lebih dari 3 kali',
      description: 'Terlambat masuk sekolah tanpa keterangan sah',
      points: 20,
      isReward: false,
      followUpAction: 'Teguran tertulis',
      status: 'SELESAI',
      counselorName: 'Dra. Siti Rahayu, M.Pd',
      parentNotified: false,
    },
    {
      id: 'bk-2',
      studentId: 's1',
      studentName: 'Budi Santoso',
      studentClass: 'XI RPL 1',
      date: '2026-09-12',
      category: 'PELANGGARAN',
      severity: 'BERAT',
      title: 'Merokok di area bengkel otomotif',
      description: 'Melanggar K3LH di lingkungan bengkel',
      points: 40,
      isReward: false,
      followUpAction: 'Surat Peringatan & Pembinaan BK',
      status: 'DALAM_PENANGANAN',
      counselorName: 'Dra. Siti Rahayu, M.Pd',
      parentNotified: true,
    },
    {
      id: 'bk-3',
      studentId: 's1',
      studentName: 'Budi Santoso',
      studentClass: 'XI RPL 1',
      date: '2026-10-01',
      category: 'PRESTASI',
      severity: 'PRESTASI',
      title: 'Juara 2 LKS Web Tech Kota',
      description: 'Mewakili sekolah lomba kejuruan',
      points: 20,
      isReward: true,
      followUpAction: 'Piagam & Apresiasi',
      status: 'SELESAI',
      counselorName: 'Dra. Siti Rahayu, M.Pd',
      parentNotified: false,
    },
  ];

  const evalResult = evaluateBKRecords(records);
  // Violations = 60, Rewards = 20, offset = min(10, 60) = 10, effective = 50
  assert.equal(evalResult.totalViolationPoints, 60);
  assert.equal(evalResult.totalRewardPoints, 20);
  assert.equal(evalResult.effectivePoint, 50);
  // 30 - 54 is SP1
  assert.equal(evalResult.warningLevel, 'SP1');
});

test('checkGraduationCriteria enforces all SMK graduation requirements', () => {
  // Passing student
  const pass = checkGraduationCriteria({
    averageRaporScore: 84.5,
    ukkScore: 86,
    isUkkCompetent: true,
    pklScore: 85,
    isPklPassed: true,
    effectiveBKPoints: 10,
    attitudePredicate: 'SANGAT_BAIK',
  });
  assert.equal(pass.isEligible, true);
  assert.equal(pass.reasons.length, 0);

  // Student failing due to UKK not competent and high BK violation
  const fail = checkGraduationCriteria({
    averageRaporScore: 78.0,
    ukkScore: 68,
    isUkkCompetent: false,
    pklScore: 80,
    isPklPassed: true,
    effectiveBKPoints: 95,
    attitudePredicate: 'BAIK',
  });
  assert.equal(fail.isEligible, false);
  assert.equal(fail.reasons.length >= 2, true);
});

test('calculateBMWStatistics accurately aggregates Bekerja, Melanjutkan, Wirausaha', () => {
  const tracers: TracerStudyRecord[] = [
    {
      id: 't-1',
      studentId: 's1',
      studentName: 'Ahmad Fauzan',
      nisn: '0061234567',
      major: 'RPL',
      graduationYear: 2025,
      statusBMW: 'BEKERJA',
      institutionOrCompanyName: 'PT GoTo Gojek Tokopedia',
      positionOrFieldOrMajor: 'Junior Frontend Engineer',
      monthlyIncome: '4 - 7 Juta',
      waitingPeriodMonths: '0-1 Bulan',
      curriculumRelevance: 'SANGAT_SELARAS',
      feedbackToSmk: 'Tingkatkan kurikulum Cloud & Docker',
      phone: '08123456789',
      email: 'ahmad@example.com',
      submittedAt: '2026-01-15',
    },
    {
      id: 't-2',
      studentId: 's2',
      studentName: 'Dewi Anggraini',
      nisn: '0061234568',
      major: 'RPL',
      graduationYear: 2025,
      statusBMW: 'MELANJUTKAN',
      institutionOrCompanyName: 'Politeknik Negeri Jakarta',
      positionOrFieldOrMajor: 'D4 Teknik Informatika',
      monthlyIncome: 'Belum Ada Penghasilan',
      waitingPeriodMonths: '0-1 Bulan',
      curriculumRelevance: 'SANGAT_SELARAS',
      feedbackToSmk: 'Sangat siap kuliah',
      phone: '08123456780',
      email: 'dewi@example.com',
      submittedAt: '2026-02-10',
    },
    {
      id: 't-3',
      studentId: 's3',
      studentName: 'Rian Pratama',
      nisn: '0061234569',
      major: 'TKRO',
      graduationYear: 2025,
      statusBMW: 'WIRAUSAHA',
      institutionOrCompanyName: 'Bengkel Mandiri Pratama Motor',
      positionOrFieldOrMajor: 'Owner & Mekanik Spesialis EFI',
      monthlyIncome: '4 - 7 Juta',
      waitingPeriodMonths: '1-3 Bulan',
      curriculumRelevance: 'SELARAS',
      feedbackToSmk: 'Perbanyak alat scanner EFI',
      phone: '08123456781',
      email: 'rian@example.com',
      submittedAt: '2026-02-20',
    },
    {
      id: 't-4',
      studentId: 's4',
      studentName: 'Citra Kirana',
      nisn: '0061234570',
      major: 'DKV',
      graduationYear: 2025,
      statusBMW: 'MENCARI_KERJA',
      institutionOrCompanyName: '-',
      positionOrFieldOrMajor: 'Freelance Desain Grafis',
      monthlyIncome: '< 2 Juta',
      waitingPeriodMonths: '> 6 Bulan',
      curriculumRelevance: 'KURANG_SELARAS',
      feedbackToSmk: 'Perlu bursa kerja khusus lebih banyak',
      phone: '08123456782',
      email: 'citra@example.com',
      submittedAt: '2026-03-01',
    },
  ];

  const stats = calculateBMWStatistics(tracers);
  assert.equal(stats.totalResponded, 4);
  assert.equal(stats.countBekerja, 1);
  assert.equal(stats.countMelanjutkan, 1);
  assert.equal(stats.countWirausaha, 1);
  assert.equal(stats.countMencariKerja, 1);
  // (3 / 4) * 100 = 75%
  assert.equal(stats.bmwAbsorptionRate, 75);
  // 3 out of 4 are SANGAT_SELARAS or SELARAS => 75%
  assert.equal(stats.alignmentHighPct, 75);
});

test('convertScoreToScale converts 0-100 to 1-4 scale properly', () => {
  assert.equal(convertScoreToScale(100, '0-100'), 100);
  assert.equal(convertScoreToScale(85, '0-100'), 85);
  // 100 / 25 = 4.0
  assert.equal(convertScoreToScale(100, '1-4'), 4.0);
  // 85 / 25 = 3.4
  assert.equal(convertScoreToScale(85, '1-4'), 3.4);
  // 75 / 25 = 3.0
  assert.equal(convertScoreToScale(75, '1-4'), 3.0);
});

test('deriveK13Scores generates Knowledge and Skills scores with predicates', () => {
  // formative: 80, sumative: 90 => pengetahuan = (80*0.4)+(90*0.6) = 32 + 54 = 86 (B)
  // finalScore: 88 => keterampilan = 88 (B)
  const k13 = deriveK13Scores(88, 80, 90);
  assert.equal(k13.pengetahuan, 86);
  assert.equal(k13.keterampilan, 88);
  assert.equal(k13.predikatPengetahuan, 'B');
  assert.equal(k13.predikatKeterampilan, 'B');
});

