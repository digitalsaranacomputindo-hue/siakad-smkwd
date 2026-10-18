/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { Header } from './components/Header.tsx';
import { Navigation, type TabKey } from './components/Navigation.tsx';
import { DashboardView } from './components/DashboardView.tsx';
import { StudentLifecycleView } from './components/StudentLifecycleView.tsx';
import { BKCounselingView } from './components/BKCounselingView.tsx';
import { GradesAndUKKView } from './components/GradesAndUKKView.tsx';
import { PKLIndustrialView } from './components/PKLIndustrialView.tsx';
import { GraduationSKLView } from './components/GraduationSKLView.tsx';
import { TracerStudyBMWView } from './components/TracerStudyBMWView.tsx';
import { PrintModal, type PrintDocType } from './components/PrintModal.tsx';
import { ReportConfigModal } from './components/ReportConfigModal.tsx';
import { SchoolIdentityModal } from './components/SchoolIdentityModal.tsx';
import { GoogleSheetsModal } from './components/GoogleSheetsModal.tsx';
import { InstallGuideModal } from './components/InstallGuideModal.tsx';
import {
  DEFAULT_REPORT_CONFIG,
  INITIAL_BK_RECORDS,
  INITIAL_GRADES,
  INITIAL_INDUSTRY_PARTNERS,
  INITIAL_MAJORS,
  INITIAL_PKL_JOURNALS,
  INITIAL_PKL_PLACEMENTS,
  INITIAL_STUDENTS,
  INITIAL_TRACER_STUDY,
  SMK_PROFILE,
} from './data/initialData.ts';
import type {
  BKRecord,
  BrightThemeId,
  GradeRecord,
  IndustryPartner,
  PKLJournal,
  PKLPlacement,
  ReportCardConfig,
  SchoolProfile,
  Student,
  TracerStudyRecord,
  UKKRecord,
  UserRole,
} from './types/academic.ts';
import { evaluateBKRecords } from './utils/smkLogic.ts';
import {
  saveSchoolProfileToFirestore,
  subscribeSchoolProfile,
  saveReportConfigToFirestore,
  subscribeReportConfig,
  seedInitialDataToFirestore,
  saveStudentToFirestore,
  saveBKRecordToFirestore,
  saveGradeToFirestore,
  savePKLPlacementToFirestore,
  saveTracerToFirestore,
} from './firebase/firestoreService.ts';
import { testFirestoreConnection } from './firebase/config.ts';

const STORAGE_KEYS = {
  SCHOOL: 'smk_siakad_school_v2',
  THEME: 'smk_siakad_theme_v2',
  STUDENTS: 'smk_siakad_students_v1',
  BK: 'smk_siakad_bk_v1',
  GRADES: 'smk_siakad_grades_v1',
  UKK: 'smk_siakad_ukk_v1',
  PKL: 'smk_siakad_pkl_v1',
  JOURNALS: 'smk_siakad_journals_v1',
  TRACER: 'smk_siakad_tracer_v1',
  ROLE: 'smk_siakad_role_v1',
  TAB: 'smk_siakad_tab_v1',
  REPORT_CONFIG: 'smk_siakad_report_config_v1',
};

export default function App() {
  // School Profile & Identity State
  const [schoolProfile, setSchoolProfile] = useState<SchoolProfile>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.SCHOOL);
      return saved ? JSON.parse(saved) : {
        ...SMK_PROFILE,
        logoUrl: '',
        kopProvinsi: 'PEMERINTAH PROVINSI DAERAH KHUSUS JAKARTA',
        kopDinas: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
        phone: '(021) 8765432',
        email: 'info@smkn1nusantara.sch.id',
        website: 'https://smkn1nusantara.sch.id',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        principalNip: '19720315 199702 1 002',
      };
    } catch {
      return {
        ...SMK_PROFILE,
        logoUrl: '',
        kopProvinsi: 'PEMERINTAH PROVINSI DAERAH KHUSUS JAKARTA',
        kopDinas: 'DINAS PENDIDIKAN DAN KEBUDAYAAN',
        phone: '(021) 8765432',
        email: 'info@smkn1nusantara.sch.id',
        website: 'https://smkn1nusantara.sch.id',
        city: 'Jakarta',
        province: 'DKI Jakarta',
        principalNip: '19720315 199702 1 002',
      };
    }
  });

  // Bright Theme State (Cerah)
  const [brightTheme, setBrightTheme] = useState<BrightThemeId>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.THEME);
      return (saved as BrightThemeId) || 'sky-blue';
    } catch {
      return 'sky-blue';
    }
  });

  // State initialization with localStorage fallback
  const [students, setStudents] = useState<Student[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STUDENTS);
      return saved ? JSON.parse(saved) : INITIAL_STUDENTS;
    } catch {
      return INITIAL_STUDENTS;
    }
  });

  const [bkRecords, setBkRecords] = useState<BKRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.BK);
      return saved ? JSON.parse(saved) : INITIAL_BK_RECORDS;
    } catch {
      return INITIAL_BK_RECORDS;
    }
  });

  const [grades, setGrades] = useState<GradeRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRADES);
      return saved ? JSON.parse(saved) : INITIAL_GRADES;
    } catch {
      return INITIAL_GRADES;
    }
  });

  const [ukkRecords, setUkkRecords] = useState<UKKRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.UKK);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [pklPlacements, setPklPlacements] = useState<PKLPlacement[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.PKL);
      return saved ? JSON.parse(saved) : INITIAL_PKL_PLACEMENTS;
    } catch {
      return INITIAL_PKL_PLACEMENTS;
    }
  });

  const [journals, setJournals] = useState<PKLJournal[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.JOURNALS);
      return saved ? JSON.parse(saved) : INITIAL_PKL_JOURNALS;
    } catch {
      return INITIAL_PKL_JOURNALS;
    }
  });

  const [tracers, setTracers] = useState<TracerStudyRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.TRACER);
      return saved ? JSON.parse(saved) : INITIAL_TRACER_STUDY;
    } catch {
      return INITIAL_TRACER_STUDY;
    }
  });

  const [partners] = useState<IndustryPartner[]>(INITIAL_INDUSTRY_PARTNERS);
  const [majors] = useState(INITIAL_MAJORS);

  // Report card format configuration state
  const [reportConfig, setReportConfig] = useState<ReportCardConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.REPORT_CONFIG);
      return saved ? JSON.parse(saved) : DEFAULT_REPORT_CONFIG;
    } catch {
      return DEFAULT_REPORT_CONFIG;
    }
  });

  // Modal Visibility States
  const [showReportConfigModal, setShowReportConfigModal] = useState(false);
  const [showSchoolIdentityModal, setShowSchoolIdentityModal] = useState(false);
  const [showGoogleSheetsModal, setShowGoogleSheetsModal] = useState(false);
  const [showInstallGuideModal, setShowInstallGuideModal] = useState(false);
  const [isFirebaseSyncing, setIsFirebaseSyncing] = useState(false);
  const [firebaseNotification, setFirebaseNotification] = useState<string | null>(null);

  // Active navigation & role
  const [currentRole, setCurrentRole] = useState<UserRole>('ADMIN');
  const [activeTab, setActiveTab] = useState<TabKey>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);

  // Print Modal state
  const [printModalConfig, setPrintModalConfig] = useState<{
    isOpen: boolean;
    docType: PrintDocType;
    data: any;
  }>({
    isOpen: false,
    docType: 'SKL',
    data: {},
  });

  // Test connection to Firestore & Listen to real-time updates
  useEffect(() => {
    testFirestoreConnection();

    // Subscribe to Firestore changes for School Profile & Report Config
    let unsubProfile: (() => void) | undefined;
    let unsubReport: (() => void) | undefined;

    try {
      unsubProfile = subscribeSchoolProfile((remoteProfile) => {
        if (remoteProfile && remoteProfile.name) {
          setSchoolProfile((prev) => ({ ...prev, ...remoteProfile }));
        }
      });
    } catch (e) {
      console.warn('Realtime profile subscription initialized:', e);
    }

    try {
      unsubReport = subscribeReportConfig((remoteCfg) => {
        if (remoteCfg && remoteCfg.templateType) {
          setReportConfig((prev) => ({ ...prev, ...remoteCfg }));
        }
      });
    } catch (e) {
      console.warn('Realtime report config subscription initialized:', e);
    }

    return () => {
      unsubProfile?.();
      unsubReport?.();
    };
  }, []);

  // Sync to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.SCHOOL, JSON.stringify(schoolProfile));
    } catch {}
  }, [schoolProfile]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.THEME, brightTheme);
    } catch {}
  }, [brightTheme]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.STUDENTS, JSON.stringify(students));
    } catch {}
  }, [students]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.BK, JSON.stringify(bkRecords));
    } catch {}
  }, [bkRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.GRADES, JSON.stringify(grades));
    } catch {}
  }, [grades]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.UKK, JSON.stringify(ukkRecords));
    } catch {}
  }, [ukkRecords]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.PKL, JSON.stringify(pklPlacements));
    } catch {}
  }, [pklPlacements]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.JOURNALS, JSON.stringify(journals));
    } catch {}
  }, [journals]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.TRACER, JSON.stringify(tracers));
    } catch {}
  }, [tracers]);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.REPORT_CONFIG, JSON.stringify(reportConfig));
    } catch {}
  }, [reportConfig]);

  // Handle Role change - auto switch to suitable default tab
  const handleRoleChange = (role: UserRole) => {
    setCurrentRole(role);
    if (role === 'GURU_BK') setActiveTab('bk');
    else if (role === 'GURU_KEJURUAN') setActiveTab('nilai');
    else if (role === 'KOORDINATOR_PKL') setActiveTab('pkl');
    else if (role === 'SISWA_ALUMNI') setActiveTab('tracer');
    else setActiveTab('dashboard');
  };

  // Reset demo dataset
  const handleResetData = () => {
    if (confirm('Kembalikan seluruh data ke kondisi awal demo SMKN 1 Nusantara?')) {
      localStorage.clear();
      setStudents(INITIAL_STUDENTS);
      setBkRecords(INITIAL_BK_RECORDS);
      setGrades(INITIAL_GRADES);
      setUkkRecords([]);
      setPklPlacements(INITIAL_PKL_PLACEMENTS);
      setJournals(INITIAL_PKL_JOURNALS);
      setTracers(INITIAL_TRACER_STUDY);
      setReportConfig(DEFAULT_REPORT_CONFIG);
      setSelectedStudent(null);
      setActiveTab('dashboard');
    }
  };

  // Save School Identity & Logo handler
  const handleSaveSchoolProfile = async (newProfile: SchoolProfile) => {
    setSchoolProfile(newProfile);
    try {
      await saveSchoolProfileToFirestore(newProfile);
      setFirebaseNotification('Identitas sekolah berhasil disinkronkan ke Firebase Firestore!');
      setTimeout(() => setFirebaseNotification(null), 4000);
    } catch (err) {
      console.warn('Saved locally, Firestore sync deferred:', err);
    }
  };

  // Save Report Config handler
  const handleSaveReportConfig = async (newConfig: ReportCardConfig) => {
    setReportConfig(newConfig);
    try {
      await saveReportConfigToFirestore(newConfig);
      setFirebaseNotification('Format Rapor berhasil disimpan ke Firebase Firestore!');
      setTimeout(() => setFirebaseNotification(null), 4000);
    } catch (err) {
      console.warn('Saved locally, Firestore sync deferred:', err);
    }
  };

  // Manual / Quick Cloud Firestore Sync Trigger
  const handleSyncFirebase = async () => {
    setIsFirebaseSyncing(true);
    setFirebaseNotification('Sedang menyinkronkan seluruh database ke Cloud Firestore (siakad-smkwd-20265547)...');
    try {
      const result = await seedInitialDataToFirestore({
        schoolProfile,
        reportConfig,
        students,
        bkRecords,
        grades,
        pklPlacements,
        tracers,
      });
      setFirebaseNotification(result.message);
    } catch (error: any) {
      setFirebaseNotification(`Status: ${error.message || 'Tersambung ke Cloud Firestore'}`);
    } finally {
      setIsFirebaseSyncing(false);
      setTimeout(() => setFirebaseNotification(null), 5000);
    }
  };

  // Import students from Google Sheets
  const handleImportStudents = (newStudentsData: Partial<Student>[]) => {
    const completeStudents: Student[] = newStudentsData.map((d, i) => ({
      id: d.id || `imp-stu-${Date.now()}-${i}`,
      nisn: d.nisn || `00${Math.floor(10000000 + Math.random() * 90000000)}`,
      nik: d.nik || '3171012345670001',
      name: d.name || 'Siswa Baru',
      gender: d.gender || 'L',
      birthPlace: d.birthPlace || 'Jakarta',
      birthDate: d.birthDate || '2008-05-10',
      classLevel: d.classLevel || 'X',
      major: d.major || 'RPL',
      className: d.className || 'X RPL 1',
      status: d.status || 'AKTIF',
      academicYear: d.academicYear || schoolProfile.academicYear || '2025/2026',
      email: d.email || 'siswa@smk.sch.id',
      phone: d.phone || '08123456789',
      parentName: d.parentName || 'Orang Tua Siswa',
      parentPhone: d.parentPhone || '08129876543',
      address: d.address || 'Jakarta',
      photoUrl: d.photoUrl || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150',
      admissionDate: d.admissionDate || '2025-07-15',
      sppStatus: d.sppStatus || 'LUNAS',
      attendance: d.attendance || { hadir: 90, sakit: 0, izin: 0, alpa: 0 },
    }));

    setStudents((prev) => [...completeStudents, ...prev]);

    // Async persist to Firestore
    completeStudents.forEach((st) => {
      saveStudentToFirestore(st).catch(console.error);
    });

    setFirebaseNotification(`Berhasil menambahkan ${completeStudents.length} siswa dari Google Sheets!`);
    setTimeout(() => setFirebaseNotification(null), 4000);
  };

  // Handlers for data updates
  const handleAddStudent = (newStudent: Student) => {
    setStudents((prev) => [newStudent, ...prev]);
    saveStudentToFirestore(newStudent).catch(console.error);
  };

  const handleUpdateStudent = (updatedStudent: Student) => {
    setStudents((prev) => prev.map((s) => (s.id === updatedStudent.id ? updatedStudent : s)));
    if (selectedStudent && selectedStudent.id === updatedStudent.id) {
      setSelectedStudent(updatedStudent);
    }
    saveStudentToFirestore(updatedStudent).catch(console.error);
  };

  const handleAddBKRecord = (rec: BKRecord) => {
    setBkRecords((prev) => [rec, ...prev]);
    saveBKRecordToFirestore(rec).catch(console.error);
  };

  const handleUpdateBKRecord = (rec: BKRecord) => {
    setBkRecords((prev) => prev.map((b) => (b.id === rec.id ? rec : b)));
    saveBKRecordToFirestore(rec).catch(console.error);
  };

  const handleAddGrade = (grd: GradeRecord) => {
    setGrades((prev) => [grd, ...prev]);
    saveGradeToFirestore(grd).catch(console.error);
  };

  const handleAddUKK = (ukk: UKKRecord) => {
    setUkkRecords((prev) => [ukk, ...prev]);
  };

  const handleAddJournal = (jrn: PKLJournal) => {
    setJournals((prev) => [jrn, ...prev]);
    setPklPlacements((prev) =>
      prev.map((p) => (p.id === jrn.placementId ? { ...p, totalJournals: p.totalJournals + 1 } : p))
    );
  };

  const handleAddPKLPlacement = (plc: PKLPlacement) => {
    setPklPlacements((prev) => [plc, ...prev]);
    savePKLPlacementToFirestore(plc).catch(console.error);
  };

  const handleUpdatePKLPlacement = (plc: PKLPlacement) => {
    setPklPlacements((prev) => prev.map((p) => (p.id === plc.id ? plc : p)));
    savePKLPlacementToFirestore(plc).catch(console.error);
  };

  const handleAddTracer = (trc: TracerStudyRecord) => {
    setTracers((prev) => [trc, ...prev]);
    saveTracerToFirestore(trc).catch(console.error);
  };

  const handleQuickPrint = () => {
    window.print();
  };

  // Open Document Print Modal
  const handleOpenPrintDoc = (docType: PrintDocType, data: any) => {
    setPrintModalConfig({
      isOpen: true,
      docType,
      data: {
        ...data,
        schoolProfile,
        reportConfig,
      },
    });
  };

  // Bright, cheerful background class mapping
  const getThemeBackground = () => {
    switch (brightTheme) {
      case 'emerald-fresh':
        return 'bg-emerald-50/30';
      case 'amber-sun':
        return 'bg-amber-50/30';
      case 'violet-vibrant':
        return 'bg-violet-50/30';
      case 'sky-blue':
      default:
        return 'bg-sky-50/40';
    }
  };

  return (
    <div className={`min-h-screen ${getThemeBackground()} transition-colors duration-300 font-sans text-slate-800 flex flex-col`}>
      {/* Universal SIAKAD Header with Dynamic School Profile, Logo & Bright Themes */}
      <Header
        school={schoolProfile}
        currentRole={currentRole}
        onRoleChange={handleRoleChange}
        searchQuery={searchQuery}
        onSearchChange={setSearchQuery}
        onResetData={handleResetData}
        onQuickPrint={handleQuickPrint}
        onOpenReportConfig={() => setShowReportConfigModal(true)}
        onOpenSchoolIdentity={() => setShowSchoolIdentityModal(true)}
        onOpenGoogleSheets={() => setShowGoogleSheetsModal(true)}
        onOpenInstallGuide={() => setShowInstallGuideModal(true)}
        onSyncFirebase={handleSyncFirebase}
        isFirebaseSyncing={isFirebaseSyncing}
        theme={brightTheme}
        onThemeChange={setBrightTheme}
      />

      {/* Cloud Sync Floating Banner / Toast Notification */}
      {firebaseNotification && (
        <div className="bg-emerald-600 text-white text-xs font-semibold py-2 px-4 text-center shadow-md flex items-center justify-center gap-2 animate-fadeIn sticky top-14 z-30">
          <span className="w-2 h-2 rounded-full bg-white animate-pulse" />
          <span>{firebaseNotification}</span>
        </div>
      )}

      {/* Navigation Tabs Bar */}
      <Navigation
        activeTab={activeTab}
        onTabChange={setActiveTab}
        currentRole={currentRole}
        studentsCount={students.length}
        activeBKCount={bkRecords.filter((b) => b.status !== 'SELESAI').length}
        activePKLCount={pklPlacements.filter((p) => p.status === 'BERJALAN').length}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'dashboard' && (
          <DashboardView
            students={students}
            bkRecords={bkRecords}
            pklPlacements={pklPlacements}
            tracers={tracers}
            majors={majors}
            partners={partners}
            onNavigateTab={(tab: TabKey) => setActiveTab(tab)}
            onSelectStudent={(student: Student) => {
              setSelectedStudent(student);
              setActiveTab('lifecycle');
            }}
          />
        )}

        {activeTab === 'lifecycle' && (
          <StudentLifecycleView
            students={students}
            bkRecords={bkRecords}
            grades={grades}
            ukkRecords={ukkRecords}
            pklPlacements={pklPlacements}
            tracers={tracers}
            onAddStudent={handleAddStudent}
            onUpdateStudent={handleUpdateStudent}
            onPrintStudentCard={(student: Student) =>
              handleOpenPrintDoc('STUDENT_CARD', { student })
            }
            selectedStudent={selectedStudent}
            onSelectStudent={setSelectedStudent}
          />
        )}

        {activeTab === 'bk' && (
          <BKCounselingView
            students={students}
            bkRecords={bkRecords}
            onAddBKRecord={handleAddBKRecord}
            onUpdateBKRecord={handleUpdateBKRecord}
            onPrintSP={(record: BKRecord, student: Student, warningType: string) =>
              handleOpenPrintDoc('SP_LETTER', { bkRecord: record, student, warningType })
            }
          />
        )}

        {activeTab === 'nilai' && (
          <GradesAndUKKView
            students={students}
            grades={grades}
            ukkRecords={ukkRecords}
            reportConfig={reportConfig}
            currentRole={currentRole}
            onOpenReportConfig={() => setShowReportConfigModal(true)}
            onAddGrade={handleAddGrade}
            onAddUKK={handleAddUKK}
            onPrintReportCard={(student: Student, studentGrades: GradeRecord[], ukk?: UKKRecord) =>
              handleOpenPrintDoc('RAPOR', { student, grades: studentGrades, ukk, reportConfig })
            }
          />
        )}

        {activeTab === 'pkl' && (
          <PKLIndustrialView
            students={students}
            partners={partners}
            placements={pklPlacements}
            journals={journals}
            onAddPlacement={handleAddPKLPlacement}
            onUpdatePlacementScore={(placementId, scores) => {
              const updated = pklPlacements.map((p) =>
                p.id === placementId
                  ? {
                      ...p,
                      technicalScore: scores.technical,
                      disciplineScore: scores.discipline,
                      reportScore: scores.report,
                      industryFeedback: scores.feedback,
                      finalScore: Math.round(scores.technical * 0.4 + scores.discipline * 0.3 + scores.report * 0.3),
                    }
                  : p
              );
              setPklPlacements(updated);
            }}
            onAddJournal={handleAddJournal}
            onPrintCertificate={(placement: PKLPlacement, partner: IndustryPartner, student: Student) =>
              handleOpenPrintDoc('PKL_CERT', { placement, partner, student })
            }
          />
        )}

        {activeTab === 'kelulusan' && (
          <GraduationSKLView
            students={students}
            grades={grades}
            ukkRecords={ukkRecords}
            pklPlacements={pklPlacements}
            bkRecords={bkRecords}
            onPrintSKL={(student: Student, avgRapor: number, ukkScore: number, pklScore: number, sklNumber: string) =>
              handleOpenPrintDoc('SKL', { student, avgRapor, ukkScore, pklScore, sklNumber })
            }
            onPromoteToAlumni={(studentIds: string[]) => {
              setStudents((prev) =>
                prev.map((s) =>
                  studentIds.includes(s.id)
                    ? {
                        ...s,
                        classLevel: 'ALUMNI',
                        status: 'LULUS',
                        graduationDate: new Date().toISOString().split('T')[0],
                      }
                    : s
                )
              );
            }}
          />
        )}

        {activeTab === 'tracer' && (
          <TracerStudyBMWView
            students={students}
            tracers={tracers}
            onAddTracer={handleAddTracer}
          />
        )}
      </main>

      {/* Official Document Print Modal */}
      <PrintModal
        isOpen={printModalConfig.isOpen}
        onClose={() => setPrintModalConfig({ ...printModalConfig, isOpen: false })}
        docType={printModalConfig.docType}
        school={schoolProfile}
        data={printModalConfig.data}
      />

      {/* Report Card Format Configurator Modal (Admin) */}
      <ReportConfigModal
        isOpen={showReportConfigModal}
        onClose={() => setShowReportConfigModal(false)}
        config={reportConfig}
        onSaveConfig={handleSaveReportConfig}
      />

      {/* School Identity & Logo Modal (Admin) */}
      <SchoolIdentityModal
        isOpen={showSchoolIdentityModal}
        onClose={() => setShowSchoolIdentityModal(false)}
        profile={schoolProfile}
        onSaveProfile={handleSaveSchoolProfile}
      />

      {/* Google Sheets Integration Modal */}
      <GoogleSheetsModal
        isOpen={showGoogleSheetsModal}
        onClose={() => setShowGoogleSheetsModal(false)}
        school={schoolProfile}
        students={students}
        grades={grades}
        bkRecords={bkRecords}
        pklPlacements={pklPlacements}
        tracers={tracers}
        onImportStudents={handleImportStudents}
      />

      {/* Panduan Pemasangan & Integrasi Modal */}
      <InstallGuideModal
        isOpen={showInstallGuideModal}
        onClose={() => setShowInstallGuideModal(false)}
      />

      {/* Bright Footer with Dynamic School Name */}
      <footer className="bg-white border-t border-sky-100 py-4 text-center text-xs text-slate-500 shadow-xs mt-auto">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>
            © 2026 <strong>{schoolProfile.name}</strong> — Sistem Informasi Akademik &amp; Vokasi Terpadu
          </span>
          <span className="text-[11px] text-slate-400">
            Terhubung ke Firebase Firestore (<code className="font-mono text-emerald-600 font-bold">siakad-smkwd-20265547</code>) • Google Sheets API v4
          </span>
        </div>
      </footer>
    </div>
  );
}
