import React, { useState } from 'react';
import {
  GraduationCap,
  CheckCircle2,
  AlertCircle,
  FileText,
  Printer,
  Sparkles,
  Users,
  Search,
  Filter,
  CheckCheck
} from 'lucide-react';
import confetti from 'canvas-confetti';
import type {
  BKRecord,
  GradeRecord,
  PKLPlacement,
  Student,
  UKKRecord
} from '../types/academic.ts';
import { checkGraduationCriteria, evaluateBKRecords } from '../utils/smkLogic.ts';
import { SMK_PROFILE } from '../data/initialData.ts';

interface GraduationSKLViewProps {
  students: Student[];
  grades: GradeRecord[];
  ukkRecords: UKKRecord[];
  pklPlacements: PKLPlacement[];
  bkRecords: BKRecord[];
  onPrintSKL: (student: Student, avgRapor: number, ukkScore: number, pklScore: number, sklNumber: string) => void;
  onPromoteToAlumni: (studentIds: string[]) => void;
}

export const GraduationSKLView: React.FC<GraduationSKLViewProps> = ({
  students,
  grades,
  ukkRecords,
  pklPlacements,
  bkRecords,
  onPrintSKL,
  onPromoteToAlumni,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMajor, setSelectedMajor] = useState<string>('ALL');

  // Filter 12th graders and recent alumni
  const finalGradeStudents = students.filter(
    (s) => s.classLevel === 'XII' || s.classLevel === 'ALUMNI'
  );

  const filteredStudents = finalGradeStudents.filter((s) => {
    if (selectedMajor !== 'ALL' && s.major !== selectedMajor) return false;
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return s.name.toLowerCase().includes(q) || s.nisn.includes(q) || s.className.toLowerCase().includes(q);
    }
    return true;
  });

  // Calculate eligibility for each student
  const studentEvaluations = filteredStudents.map((st) => {
    const studentGrades = grades.filter((g) => g.studentId === st.id);
    const avgRapor =
      studentGrades.length > 0
        ? Math.round(studentGrades.reduce((acc, g) => acc + g.finalScore, 0) / studentGrades.length)
        : 80; // default passing if not fully populated

    const ukk = ukkRecords.find((u) => u.studentId === st.id);
    const ukkScore = ukk?.finalScore || 85;
    const isUkkComp = ukk?.predicate === 'KOMPETEN' || ukk?.predicate === 'SANGAT_KOMPETEN' || ukkScore >= 75;

    const pkl = pklPlacements.find((p) => p.studentId === st.id);
    const pklScore = pkl?.finalScore || 85;
    const isPklPassed = pklScore >= 75;

    const studentBK = bkRecords.filter((b) => b.studentId === st.id);
    const bkEval = evaluateBKRecords(studentBK);

    const gradCriteria = checkGraduationCriteria({
      averageRaporScore: avgRapor,
      ukkScore,
      isUkkCompetent: isUkkComp,
      pklScore,
      isPklPassed,
      effectiveBKPoints: bkEval.effectivePoint,
      attitudePredicate: bkEval.effectivePoint >= 80 ? 'CUKUP' : 'BAIK',
    });

    const sklNumber = `421.5/SKL-SMKN1/${st.major}/${st.academicYear.split('/')[0]}/${st.nisn.slice(-4)}`;

    return {
      student: st,
      avgRapor,
      ukkScore,
      pklScore,
      effectiveBKPoints: bkEval.effectivePoint,
      isEligible: gradCriteria.isEligible,
      reasons: gradCriteria.reasons,
      sklNumber,
    };
  });

  const totalEligible = studentEvaluations.filter((e) => e.isEligible).length;

  const handleRunPlenoConfetti = () => {
    confetti({
      particleCount: 100,
      spread: 70,
      origin: { y: 0.6 },
    });

    const eligibleIds = studentEvaluations.filter((e) => e.isEligible && e.student.classLevel === 'XII').map((e) => e.student.id);
    if (eligibleIds.length > 0) {
      onPromoteToAlumni(eligibleIds);
    }
  };

  return (
    <div className="space-y-6">
      {/* View Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
        <div>
          <h2 className="text-lg font-bold text-slate-900 flex items-center gap-2">
            <GraduationCap className="w-5 h-5 text-emerald-600" />
            Sidang Pleno Kelulusan &amp; Penerbitan SKL Resmi
          </h2>
          <p className="text-xs text-slate-500">
            Penetapan kelulusan siswa tingkat akhir berdasarkan 4 kriteria: Rapor 6 Semester, Nilai PKL DU/DI, UKK Asesor Industri, dan Sikap BK.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={handleRunPlenoConfetti}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 shadow-sm transition-all"
          >
            <Sparkles className="w-4 h-4" />
            Pleno &amp; Tetapkan Kelulusan Siswa
          </button>
        </div>
      </div>

      {/* Criteria Info & Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase">Siswa Tingkat Akhir</span>
          <div className="mt-1 text-2xl font-bold text-slate-900">{studentEvaluations.length} Siswa</div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            {totalEligible} Siswa Memenuhi Syarat
          </div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase">Syarat 1: Rapor</span>
          <div className="mt-1 text-base font-bold text-slate-800">Rata-rata &gt;= 75.0</div>
          <div className="text-[11px] text-slate-500 mt-1">Semester 1 s/d Semester 6</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase">Syarat 2: UKK Kejuruan</span>
          <div className="mt-1 text-base font-bold text-slate-800">Minimal KOMPETEN</div>
          <div className="text-[11px] text-slate-500 mt-1">Bersama Asesor DU/DI Mitra</div>
        </div>
        <div className="p-4 rounded-xl bg-white border border-slate-200 shadow-xs">
          <span className="text-[11px] font-medium text-slate-500 uppercase">Syarat 3 &amp; 4: PKL &amp; BK</span>
          <div className="mt-1 text-base font-bold text-slate-800">PKL Lulus &amp; Poin BK &lt; 80</div>
          <div className="text-[11px] text-slate-500 mt-1">Predikat Sikap Minimal BAIK</div>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs text-slate-500 font-medium">
            <Filter className="w-3.5 h-3.5" /> Konsentrasi:
          </div>
          {['ALL', 'RPL', 'TKJ', 'TKRO', 'DKV', 'AKL'].map((maj) => (
            <button
              key={maj}
              onClick={() => setSelectedMajor(maj)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-colors ${
                selectedMajor === maj
                  ? 'bg-emerald-100 text-emerald-800 border border-emerald-300'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {maj === 'ALL' ? 'Semua' : maj}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Cari siswa tingkat akhir..."
            className="w-full text-xs pl-9 pr-3 py-1.5 rounded-lg border border-slate-300 focus:outline-none focus:ring-2 focus:ring-emerald-500"
          />
        </div>
      </div>

      {/* Graduation Candidates Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 uppercase font-semibold text-[11px] border-b border-slate-200">
              <tr>
                <th className="py-3 px-4">Siswa Tingkat Akhir</th>
                <th className="py-3 px-4">Jurusan</th>
                <th className="py-3 px-4 text-center">Rata-rata Rapor</th>
                <th className="py-3 px-4 text-center">Nilai UKK</th>
                <th className="py-3 px-4 text-center">Nilai PKL</th>
                <th className="py-3 px-4 text-center">Poin Disiplin</th>
                <th className="py-3 px-4 text-center">Keputusan Pleno</th>
                <th className="py-3 px-4 text-right">Aksi SKL</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {studentEvaluations.map(
                ({ student, avgRapor, ukkScore, pklScore, effectiveBKPoints, isEligible, reasons, sklNumber }) => (
                  <tr key={student.id} className="hover:bg-slate-50/60">
                    <td className="py-3 px-4 flex items-center gap-3">
                      <img
                        src={student.photoUrl}
                        alt={student.name}
                        className="w-9 h-9 rounded-full object-cover shrink-0 ring-1 ring-slate-200"
                      />
                      <div>
                        <div className="font-bold text-slate-900">{student.name}</div>
                        <div className="text-[11px] text-slate-400">NISN: {student.nisn}</div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="font-semibold text-slate-800">{student.className}</span>
                      <div className="text-[10px] text-slate-400 font-medium">{student.major}</div>
                    </td>
                    <td className="py-3 px-4 text-center font-bold text-slate-800">{avgRapor}</td>
                    <td className="py-3 px-4 text-center font-bold text-emerald-700">{ukkScore}</td>
                    <td className="py-3 px-4 text-center font-bold text-blue-700">{pklScore}</td>
                    <td className="py-3 px-4 text-center">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          effectiveBKPoints >= 55 ? 'bg-rose-100 text-rose-800' : 'bg-slate-100 text-slate-700'
                        }`}
                      >
                        {effectiveBKPoints} Pts
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {isEligible ? (
                        <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200 inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" /> LULUS
                        </span>
                      ) : (
                        <div className="inline-flex flex-col items-center">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-amber-100 text-amber-800 border border-amber-200 inline-flex items-center gap-1">
                            <AlertCircle className="w-3 h-3 text-amber-600" /> DITANGGUHKAN
                          </span>
                          <span className="text-[9px] text-rose-600 mt-0.5 max-w-[140px] truncate" title={reasons.join(', ')}>
                            {reasons[0]}
                          </span>
                        </div>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {isEligible && (
                        <button
                          onClick={() => onPrintSKL(student, avgRapor, ukkScore, pklScore, sklNumber)}
                          className="px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold flex items-center gap-1.5 ml-auto shadow-xs"
                        >
                          <Printer className="w-3.5 h-3.5" /> Cetak SKL
                        </button>
                      )}
                    </td>
                  </tr>
                )
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
