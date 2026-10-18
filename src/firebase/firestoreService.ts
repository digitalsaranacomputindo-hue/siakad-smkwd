import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  writeBatch,
  onSnapshot,
} from 'firebase/firestore';
import { db, handleFirestoreError, OperationType } from './config.ts';
import type {
  BKRecord,
  GradeRecord,
  PKLPlacement,
  ReportCardConfig,
  SchoolProfile,
  Student,
  TracerStudyRecord,
} from '../types/academic.ts';

const COLLECTIONS = {
  SETTINGS: 'settings',
  REPORT_CONFIGS: 'report_configs',
  STUDENTS: 'students',
  BK_RECORDS: 'bk_records',
  GRADES: 'grades',
  PKL_PLACEMENTS: 'pkl_placements',
  TRACER_STUDY: 'tracer_study',
};

// -------------------------------------------------------------
// School Profile
// -------------------------------------------------------------
export async function saveSchoolProfileToFirestore(profile: SchoolProfile): Promise<void> {
  const path = `${COLLECTIONS.SETTINGS}/school_profile`;
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'school_profile');
    await setDoc(docRef, {
      ...profile,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchSchoolProfileFromFirestore(): Promise<SchoolProfile | null> {
  const path = `${COLLECTIONS.SETTINGS}/school_profile`;
  try {
    const docRef = doc(db, COLLECTIONS.SETTINGS, 'school_profile');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as SchoolProfile;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeSchoolProfile(callback: (profile: SchoolProfile) => void) {
  const path = `${COLLECTIONS.SETTINGS}/school_profile`;
  return onSnapshot(
    doc(db, COLLECTIONS.SETTINGS, 'school_profile'),
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as SchoolProfile);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// -------------------------------------------------------------
// Report Card Config
// -------------------------------------------------------------
export async function saveReportConfigToFirestore(config: ReportCardConfig): Promise<void> {
  const path = `${COLLECTIONS.REPORT_CONFIGS}/default`;
  try {
    const docRef = doc(db, COLLECTIONS.REPORT_CONFIGS, 'default');
    await setDoc(docRef, {
      ...config,
      updatedAt: new Date().toISOString(),
    }, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchReportConfigFromFirestore(): Promise<ReportCardConfig | null> {
  const path = `${COLLECTIONS.REPORT_CONFIGS}/default`;
  try {
    const docRef = doc(db, COLLECTIONS.REPORT_CONFIGS, 'default');
    const snapshot = await getDoc(docRef);
    if (snapshot.exists()) {
      return snapshot.data() as ReportCardConfig;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

export function subscribeReportConfig(callback: (config: ReportCardConfig) => void) {
  const path = `${COLLECTIONS.REPORT_CONFIGS}/default`;
  return onSnapshot(
    doc(db, COLLECTIONS.REPORT_CONFIGS, 'default'),
    (snapshot) => {
      if (snapshot.exists()) {
        callback(snapshot.data() as ReportCardConfig);
      }
    },
    (error) => {
      handleFirestoreError(error, OperationType.GET, path);
    }
  );
}

// -------------------------------------------------------------
// Students
// -------------------------------------------------------------
export async function saveStudentToFirestore(student: Student): Promise<void> {
  const path = `${COLLECTIONS.STUDENTS}/${student.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.STUDENTS, student.id), student, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchStudentsFromFirestore(): Promise<Student[]> {
  const path = COLLECTIONS.STUDENTS;
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => d.data() as Student);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// -------------------------------------------------------------
// BK Records
// -------------------------------------------------------------
export async function saveBKRecordToFirestore(record: BKRecord): Promise<void> {
  const path = `${COLLECTIONS.BK_RECORDS}/${record.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.BK_RECORDS, record.id), record, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchBKRecordsFromFirestore(): Promise<BKRecord[]> {
  const path = COLLECTIONS.BK_RECORDS;
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => d.data() as BKRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// -------------------------------------------------------------
// Grades
// -------------------------------------------------------------
export async function saveGradeToFirestore(grade: GradeRecord): Promise<void> {
  const path = `${COLLECTIONS.GRADES}/${grade.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.GRADES, grade.id), grade, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchGradesFromFirestore(): Promise<GradeRecord[]> {
  const path = COLLECTIONS.GRADES;
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => d.data() as GradeRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// -------------------------------------------------------------
// PKL Placements
// -------------------------------------------------------------
export async function savePKLPlacementToFirestore(placement: PKLPlacement): Promise<void> {
  const path = `${COLLECTIONS.PKL_PLACEMENTS}/${placement.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.PKL_PLACEMENTS, placement.id), placement, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchPKLPlacementsFromFirestore(): Promise<PKLPlacement[]> {
  const path = COLLECTIONS.PKL_PLACEMENTS;
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => d.data() as PKLPlacement);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// -------------------------------------------------------------
// Tracer Study
// -------------------------------------------------------------
export async function saveTracerToFirestore(tracer: TracerStudyRecord): Promise<void> {
  const path = `${COLLECTIONS.TRACER_STUDY}/${tracer.id}`;
  try {
    await setDoc(doc(db, COLLECTIONS.TRACER_STUDY, tracer.id), tracer, { merge: true });
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

export async function fetchTracersFromFirestore(): Promise<TracerStudyRecord[]> {
  const path = COLLECTIONS.TRACER_STUDY;
  try {
    const snapshot = await getDocs(collection(db, path));
    return snapshot.docs.map((d) => d.data() as TracerStudyRecord);
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// -------------------------------------------------------------
// Batch Seed / Sync All Data to Firestore
// -------------------------------------------------------------
export async function seedInitialDataToFirestore(params: {
  schoolProfile: SchoolProfile;
  reportConfig: ReportCardConfig;
  students: Student[];
  bkRecords: BKRecord[];
  grades: GradeRecord[];
  pklPlacements: PKLPlacement[];
  tracers: TracerStudyRecord[];
}): Promise<{ success: boolean; message: string; count: number }> {
  try {
    const batch = writeBatch(db);
    let count = 0;

    // School Profile
    const profileRef = doc(db, COLLECTIONS.SETTINGS, 'school_profile');
    batch.set(profileRef, { ...params.schoolProfile, updatedAt: new Date().toISOString() });
    count++;

    // Report Config
    const reportRef = doc(db, COLLECTIONS.REPORT_CONFIGS, 'default');
    batch.set(reportRef, { ...params.reportConfig, updatedAt: new Date().toISOString() });
    count++;

    // Students
    for (const student of params.students) {
      const sRef = doc(db, COLLECTIONS.STUDENTS, student.id);
      batch.set(sRef, student);
      count++;
    }

    // BK
    for (const bk of params.bkRecords) {
      const bRef = doc(db, COLLECTIONS.BK_RECORDS, bk.id);
      batch.set(bRef, bk);
      count++;
    }

    // PKL
    for (const pkl of params.pklPlacements) {
      const pRef = doc(db, COLLECTIONS.PKL_PLACEMENTS, pkl.id);
      batch.set(pRef, pkl);
      count++;
    }

    // Tracers
    for (const tr of params.tracers) {
      const tRef = doc(db, COLLECTIONS.TRACER_STUDY, tr.id);
      batch.set(tRef, tr);
      count++;
    }

    await batch.commit();
    return {
      success: true,
      message: `Berhasil menyinkronkan ${count} data ke Firebase Firestore.`,
      count,
    };
  } catch (error) {
    console.error('Batch sync error:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'Gagal sinkronisasi data ke Firebase.',
      count: 0,
    };
  }
}

// -------------------------------------------------------------
// Granular Batch Save for Imported Data
// -------------------------------------------------------------

export async function batchSaveStudents(students: Student[]): Promise<void> {
  const batch = writeBatch(db);
  for (const s of students.slice(0, 450)) {
    batch.set(doc(db, COLLECTIONS.STUDENTS, s.id), s, { merge: true });
  }
  await batch.commit();
}

export async function batchSaveGrades(grades: GradeRecord[]): Promise<void> {
  const batch = writeBatch(db);
  for (const g of grades.slice(0, 450)) {
    batch.set(doc(db, COLLECTIONS.GRADES, g.id), g, { merge: true });
  }
  await batch.commit();
}

export async function batchSaveBKRecords(records: BKRecord[]): Promise<void> {
  const batch = writeBatch(db);
  for (const b of records.slice(0, 450)) {
    batch.set(doc(db, COLLECTIONS.BK_RECORDS, b.id), b, { merge: true });
  }
  await batch.commit();
}

export async function batchSavePKLPlacements(placements: PKLPlacement[]): Promise<void> {
  const batch = writeBatch(db);
  for (const p of placements.slice(0, 450)) {
    batch.set(doc(db, COLLECTIONS.PKL_PLACEMENTS, p.id), p, { merge: true });
  }
  await batch.commit();
}

export async function batchSaveTracers(tracers: TracerStudyRecord[]): Promise<void> {
  const batch = writeBatch(db);
  for (const t of tracers.slice(0, 450)) {
    batch.set(doc(db, COLLECTIONS.TRACER_STUDY, t.id), t, { merge: true });
  }
  await batch.commit();
}

