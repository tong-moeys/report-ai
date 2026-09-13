import { initializeApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signOut,
  onAuthStateChanged,
  User
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  getDocs,
  collection,
  query,
  where,
  orderBy,
  deleteDoc,
  getDocFromServer,
  serverTimestamp
} from 'firebase/firestore';
import firebaseConfig from '../firebase-applet-config.json';
import { FullSchoolReport } from './types';
import { getKhmerLunarDateInfo, toKhmerDigits } from './khmerCalendarData';

// Initialize Firebase App
const app = initializeApp(firebaseConfig);

// CRITICAL: Initialize Firestore with firestoreDatabaseId from config as mandated
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId);
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();

// Operation Types for error handling
export enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

export interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
    tenantId?: string | null;
    providerInfo?: {
      providerId?: string | null;
      email?: string | null;
    }[];
  };
}

// Mandatory Firestore Error Handler per skill guidelines
export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null): never {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map(provider => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Test connection on boot per skill guidelines
export async function testFirestoreConnection(): Promise<boolean> {
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    console.log('Firestore connection verified successfully.');
    return true;
  } catch (error) {
    if (error instanceof Error && error.message.includes('the client is offline')) {
      console.warn('Firebase client is offline or waiting for network.');
    } else {
      console.log('Firestore connection test note:', error);
    }
    return false;
  }
}

// Interface for saved Firestore Report
export interface FirestoreSchoolReport {
  id: string;
  userId: string;
  userEmail: string;
  schoolName: string;
  academicYear: string;
  reportData: FullSchoolReport;
  status: 'draft' | 'submitted' | 'reviewed' | 'approved';
  khmerLunarDate: string;
  khmerSolarDate: string;
  autoSaveTimestamp: number;
  createdAt: string;
  updatedAt: string;
}

// Interface for Report Submission Record
export interface FirestoreReportSubmission {
  id: string;
  reportId: string;
  userId: string;
  senderName: string;
  senderEmail: string;
  schoolName: string;
  recipientOffice: string;
  submissionNotes: string;
  status: 'submitted' | 'acknowledged' | 'accepted' | 'returned';
  submittedAt: string;
  khmerDateText: string;
}

// Generate automatic Khmer date strings for current or specific date
export function getAutoKhmerDate(targetDate: Date = new Date()) {
  const info = getKhmerLunarDateInfo(targetDate);
  return {
    khmerLunarDate: info.fullChhnamString,
    khmerSolarDate: `${info.solarDateStringKhmer}`,
    rawDate: targetDate.toISOString().split('T')[0],
  };
}

// Auto-save or Save report to Firestore
export async function saveReportToFirestore(
  report: FullSchoolReport,
  user: User,
  reportId: string = 'default_school_report'
): Promise<FirestoreSchoolReport> {
  const path = `school_reports/${reportId}`;
  const now = new Date();
  const autoDate = getAutoKhmerDate(now);

  const payload: FirestoreSchoolReport = {
    id: reportId,
    userId: user.uid,
    userEmail: user.email || '',
    schoolName: report.info.schoolName,
    academicYear: report.info.academicYear,
    reportData: report,
    status: 'draft',
    khmerLunarDate: autoDate.khmerLunarDate,
    khmerSolarDate: autoDate.khmerSolarDate,
    autoSaveTimestamp: now.getTime(),
    createdAt: now.toISOString(),
    updatedAt: now.toISOString(),
  };

  try {
    await setDoc(doc(db, 'school_reports', reportId), payload, { merge: true });
    return payload;
  } catch (error) {
    handleFirestoreError(error, OperationType.WRITE, path);
  }
}

// Fetch report from Firestore
export async function loadReportFromFirestore(
  reportId: string = 'default_school_report'
): Promise<FirestoreSchoolReport | null> {
  const path = `school_reports/${reportId}`;
  try {
    const docSnap = await getDoc(doc(db, 'school_reports', reportId));
    if (docSnap.exists()) {
      return docSnap.data() as FirestoreSchoolReport;
    }
    return null;
  } catch (error) {
    handleFirestoreError(error, OperationType.GET, path);
  }
}

// List user's reports
export async function listUserReports(userId: string): Promise<FirestoreSchoolReport[]> {
  const path = 'school_reports';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const reports: FirestoreSchoolReport[] = [];
    querySnapshot.forEach(docSnap => {
      reports.push(docSnap.data() as FirestoreSchoolReport);
    });
    return reports;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}

// Submit report document (បញ្ជូនឯកសារ)
export async function submitReportToOffice(
  report: FullSchoolReport,
  user: User,
  options: {
    recipientOffice: string;
    submissionNotes: string;
    senderName: string;
  }
): Promise<FirestoreReportSubmission> {
  const submissionId = `sub_${Date.now()}`;
  const path = `report_submissions/${submissionId}`;
  const now = new Date();
  const autoDate = getAutoKhmerDate(now);

  const submissionPayload: FirestoreReportSubmission = {
    id: submissionId,
    reportId: 'default_school_report',
    userId: user.uid,
    senderName: options.senderName || user.displayName || 'អ្នករៀបចំរបាយការណ៍',
    senderEmail: user.email || '',
    schoolName: report.info.schoolName,
    recipientOffice: options.recipientOffice,
    submissionNotes: options.submissionNotes,
    status: 'submitted',
    submittedAt: now.toISOString(),
    khmerDateText: `${autoDate.khmerLunarDate} - ${autoDate.khmerSolarDate}`,
  };

  try {
    // 1. Save submission record
    await setDoc(doc(db, 'report_submissions', submissionId), submissionPayload);

    // 2. Update report status in school_reports
    const reportPath = `school_reports/default_school_report`;
    await setDoc(
      doc(db, 'school_reports', 'default_school_report'),
      {
        status: 'submitted',
        updatedAt: now.toISOString(),
      },
      { merge: true }
    );

    return submissionPayload;
  } catch (error) {
    handleFirestoreError(error, OperationType.CREATE, path);
  }
}

// List submission history for user
export async function listUserSubmissions(userId: string): Promise<FirestoreReportSubmission[]> {
  const path = 'report_submissions';
  try {
    const q = query(
      collection(db, path),
      where('userId', '==', userId)
    );
    const querySnapshot = await getDocs(q);
    const list: FirestoreReportSubmission[] = [];
    querySnapshot.forEach(docSnap => {
      list.push(docSnap.data() as FirestoreReportSubmission);
    });
    // Sort descending by date
    list.sort((a, b) => new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime());
    return list;
  } catch (error) {
    handleFirestoreError(error, OperationType.LIST, path);
  }
}
