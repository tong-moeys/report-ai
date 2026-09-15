import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  signInAnonymously,
  signOut,
  onAuthStateChanged,
  User,
  updateProfile,
} from 'firebase/auth';
import {
  getFirestore,
  doc,
  setDoc,
  getDoc,
  getDocFromServer,
  collection,
  query,
  where,
  getDocs,
  deleteDoc,
  Firestore,
} from 'firebase/firestore';
import { AppUser, ReportSnapshotData, ReportVersionHistoryItem, UserRole } from './types';
import firebaseConfig from '../firebase-applet-config.json';

// Initialize Firebase App
export const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

// Initialize Firebase Auth
export const auth = getAuth(app);
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: 'select_account' });

// Initialize Firestore (support custom databaseId from config)
export const db: Firestore = firebaseConfig.firestoreDatabaseId
  ? getFirestore(app, firebaseConfig.firestoreDatabaseId)
  : getFirestore(app);

// Public Firestore info and direct Firebase Console link to the exact named database
export const FIRESTORE_CONFIG_INFO = {
  projectId: firebaseConfig.projectId,
  databaseId: firebaseConfig.firestoreDatabaseId,
  consoleUrl: `https://console.firebase.google.com/project/${firebaseConfig.projectId}/firestore/databases/${firebaseConfig.firestoreDatabaseId}/data`,
  collections: [
    { id: 'school_reports', name: 'school_reports', desc: 'ឯកសារទិន្នន័យរបាយការណ៍បច្ចុប្បន្ន (Current Working Report)' },
    { id: 'report_history', name: 'report_history', desc: 'ប្រវត្តិកំណែ និងរូបថតទិន្នន័យ (Snapshots / Audit Trail)' },
    { id: 'report_submissions', name: 'report_submissions', desc: 'កំណត់ត្រាដាក់ស្នើរបាយការណ៍ (Submitted Reports)' },
  ],
};

// Skill-mandated error structures
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

export function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
      tenantId: auth.currentUser?.tenantId,
      providerInfo: auth.currentUser?.providerData?.map((provider) => ({
        providerId: provider.providerId,
        email: provider.email,
      })) || [],
    },
    operationType,
    path,
  };
  console.error('Firestore Error:', JSON.stringify(errInfo));
  return errInfo;
}

// Test live connection to Firestore
export async function testFirestoreConnection(): Promise<{ success: boolean; message: string; latencyMs?: number }> {
  const start = Date.now();
  try {
    await getDocFromServer(doc(db, 'test', 'connection'));
    const latency = Date.now() - start;
    return {
      success: true,
      message: `បានតភ្ជាប់ទៅ Cloud Firestore ជោគជ័យ (${latency}ms)`,
      latencyMs: latency,
    };
  } catch (error: any) {
    const errInfo = handleFirestoreError(error, OperationType.GET, 'test/connection');
    return {
      success: false,
      message: errInfo.error || 'មិនអាចភ្ជាប់ទៅកាន់ Firestore បានទេ',
    };
  }
}

// Run initial connection test silently
testFirestoreConnection().catch(() => {});

// Role storage helper key
const USER_ROLE_STORAGE_KEY = 'school_report_user_role';
const LOCAL_HISTORY_STORAGE_KEY = 'school_report_local_history';

// Determine default role based on display name or storage
export function getSavedUserRole(uid: string): UserRole {
  try {
    const saved = localStorage.getItem(`${USER_ROLE_STORAGE_KEY}_${uid}`);
    if (saved && ['នាយកសាលា', 'នាយករង', 'មន្ត្រីស្ថិតិ', 'គ្រូបង្រៀន'].includes(saved)) {
      return saved as UserRole;
    }
  } catch (e) {
    console.warn('LocalStorage error:', e);
  }
  return 'នាយកសាលា';
}

export function saveUserRole(uid: string, role: UserRole) {
  try {
    localStorage.setItem(`${USER_ROLE_STORAGE_KEY}_${uid}`, role);
  } catch (e) {
    console.warn('LocalStorage save error:', e);
  }
}

// Convert Firebase User to AppUser
export function mapFirebaseUser(user: User | null, customRole?: UserRole): AppUser | null {
  if (!user) return null;
  const role = customRole || getSavedUserRole(user.uid);
  return {
    uid: user.uid,
    email: user.email,
    displayName: user.displayName || (user.isAnonymous ? `គណនី${role}` : 'អ្នកគ្រប់គ្រងសាលា'),
    photoURL: user.photoURL,
    role,
    isAnonymous: user.isAnonymous,
  };
}

// Sign In With Google
export async function loginWithGoogle(): Promise<AppUser> {
  const result = await signInWithPopup(auth, googleProvider);
  const appUser = mapFirebaseUser(result.user);
  return appUser!;
}

// Quick Role Login (Uses Firebase Anonymous Auth + Custom Profile)
export async function loginWithRole(role: UserRole, customName?: string): Promise<AppUser> {
  let user = auth.currentUser;
  if (!user) {
    const result = await signInAnonymously(auth);
    user = result.user;
  }
  saveUserRole(user.uid, role);
  const displayName = customName || `គណនី${role}`;
  try {
    await updateProfile(user, { displayName });
  } catch (e) {
    console.warn('Profile update warning:', e);
  }
  return {
    uid: user.uid,
    email: user.email || `${role.toLowerCase().replace(/\s+/g, '')}@moeys.gov.kh`,
    displayName,
    photoURL: user.photoURL || null,
    role,
    isAnonymous: user.isAnonymous,
  };
}

// Sign Out
export async function logoutUser(): Promise<void> {
  await signOut(auth);
}

// Result of saving report version
export interface SaveReportResult {
  historyItem: ReportVersionHistoryItem;
  savedToCloud: boolean;
  cloudError?: string;
}

// Save Report and create a version history entry in Firestore + LocalStorage fallback
export async function saveReportVersion(
  reportId: string,
  snapshot: ReportSnapshotData,
  user: AppUser,
  actionType: 'manual_save' | 'auto_save' | 'restore_version' | 'initial_setup' = 'manual_save',
  note: string = ''
): Promise<SaveReportResult> {
  const now = Date.now();
  const dateObj = new Date(now);
  const formattedDate = dateObj.toLocaleDateString('km-KH', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  // Calculate total students and staff
  const totalStudents = snapshot.t1Rooms.g1.total +
    snapshot.t1Rooms.g2.total +
    snapshot.t1Rooms.g3.total +
    snapshot.t1Rooms.g4.total +
    snapshot.t1Rooms.g5.total +
    snapshot.t1Rooms.g6.total;

  const totalStaff = snapshot.t1Staff.directorDeputy.total +
    snapshot.t1Staff.officeAdmin.total +
    snapshot.t1Staff.pureTeaching.total +
    snapshot.t1Staff.multiGrade.total +
    snapshot.t1Staff.deputyTeaching.total +
    snapshot.t1Staff.contractTeaching.total;

  // Generate unique history id (safe string matching ^[a-zA-Z0-9_-]+$)
  const historyId = `hist_${now}_${Math.random().toString(36).substring(2, 7)}`;

  // Determine sequential version number
  const existingHistory = await getReportHistory(reportId);
  const nextVersion = existingHistory.length > 0 ? existingHistory[0].versionNumber + 1 : 1;

  const historyItem: ReportVersionHistoryItem = {
    id: historyId,
    reportId,
    userId: user.uid,
    userEmail: user.email || `${user.role}@moeys.gov.kh`,
    userName: user.displayName || user.role,
    userRole: user.role,
    versionNumber: nextVersion,
    actionType,
    summaryNotes: note || (actionType === 'manual_save' ? 'បានរក្សាទុកដោយដៃ' : 'រក្សាទុកស្វ័យប្រវត្តិ'),
    schoolName: snapshot.meta.schoolName,
    academicYear: snapshot.meta.academicYear,
    totalStudents,
    totalStaff,
    reportSnapshot: snapshot,
    savedAt: formattedDate,
    timestamp: now,
  };

  let savedToCloud = false;
  let cloudError: string | undefined;

  // 1. Save to Firestore
  try {
    // Save main report document
    const reportRef = doc(db, 'school_reports', reportId);
    await setDoc(reportRef, {
      id: reportId,
      userId: user.uid,
      userEmail: user.email || '',
      schoolName: snapshot.meta.schoolName || 'សាលាបឋមសិក្សា',
      academicYear: snapshot.meta.academicYear || '២០២៥-២០២៦',
      reportData: snapshot,
      status: 'draft',
      autoSaveTimestamp: now,
      updatedAt: new Date().toISOString(),
    });

    // Save version history document
    const historyRef = doc(db, 'report_history', historyId);
    await setDoc(historyRef, historyItem);

    savedToCloud = true;
  } catch (err: any) {
    const errInfo = handleFirestoreError(err, OperationType.WRITE, `school_reports/${reportId}`);
    cloudError = errInfo.error;
    console.warn('Firestore cloud save encountered error, keeping in local backup:', err);
  }

  // 2. Always maintain local backup cache for instant offline access and history preservation
  saveLocalHistoryItem(historyItem);

  return {
    historyItem,
    savedToCloud,
    cloudError,
  };
}

// Load the latest report data from Firestore
export async function loadLatestReport(reportId: string): Promise<ReportSnapshotData | null> {
  // 1. Try to load from school_reports doc
  try {
    const reportRef = doc(db, 'school_reports', reportId);
    const snap = await getDoc(reportRef);
    if (snap.exists()) {
      const data = snap.data();
      if (data && data.reportData) {
        return data.reportData as ReportSnapshotData;
      }
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.GET, `school_reports/${reportId}`);
  }

  // 2. Fallback: try latest item from report_history
  try {
    const historyCol = collection(db, 'report_history');
    const q = query(historyCol, where('reportId', '==', reportId));
    const snap = await getDocs(q);
    let latestItem: ReportVersionHistoryItem | null = null;
    snap.forEach((docSnap) => {
      const item = docSnap.data() as ReportVersionHistoryItem;
      if (!latestItem || item.timestamp > latestItem.timestamp) {
        latestItem = item;
      }
    });
    if (latestItem && (latestItem as ReportVersionHistoryItem).reportSnapshot) {
      return (latestItem as ReportVersionHistoryItem).reportSnapshot;
    }
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'report_history');
  }

  return null;
}

// Fetch version history for a report across all sessions
export async function getReportHistory(reportId: string): Promise<ReportVersionHistoryItem[]> {
  const items: ReportVersionHistoryItem[] = [];

  // Try Firestore first
  try {
    const historyCol = collection(db, 'report_history');
    const q = query(historyCol, where('reportId', '==', reportId));
    const snap = await getDocs(q);
    snap.forEach((docSnap) => {
      items.push(docSnap.data() as ReportVersionHistoryItem);
    });
  } catch (err) {
    handleFirestoreError(err, OperationType.LIST, 'report_history');
  }

  // Merge with local storage history items
  const localItems = getLocalHistoryItems(reportId);
  const map = new Map<string, ReportVersionHistoryItem>();

  // Add cloud items
  items.forEach((item) => map.set(item.id, item));
  // Add local items
  localItems.forEach((item) => {
    if (!map.has(item.id)) {
      map.set(item.id, item);
    }
  });

  const combined = Array.from(map.values());
  // Sort descending by timestamp (newest first)
  combined.sort((a, b) => b.timestamp - a.timestamp);
  return combined;
}

// Delete a history record
export async function deleteReportVersion(historyId: string, reportId: string): Promise<void> {
  try {
    const historyRef = doc(db, 'report_history', historyId);
    await deleteDoc(historyRef);
  } catch (e) {
    handleFirestoreError(e, OperationType.DELETE, `report_history/${historyId}`);
  }
  deleteLocalHistoryItem(historyId, reportId);
}

// Local storage history helpers
function getLocalHistoryItems(reportId: string): ReportVersionHistoryItem[] {
  try {
    const raw = localStorage.getItem(`${LOCAL_HISTORY_STORAGE_KEY}_${reportId}`);
    if (raw) {
      return JSON.parse(raw);
    }
  } catch (e) {
    console.warn('LocalStorage error reading history:', e);
  }
  return [];
}

function saveLocalHistoryItem(item: ReportVersionHistoryItem) {
  try {
    const key = `${LOCAL_HISTORY_STORAGE_KEY}_${item.reportId}`;
    const items = getLocalHistoryItems(item.reportId);
    const updated = [item, ...items.filter((i) => i.id !== item.id)].slice(0, 30); // keep last 30
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage error saving history:', e);
  }
}

function deleteLocalHistoryItem(historyId: string, reportId: string) {
  try {
    const key = `${LOCAL_HISTORY_STORAGE_KEY}_${reportId}`;
    const items = getLocalHistoryItems(reportId);
    const updated = items.filter((i) => i.id !== historyId);
    localStorage.setItem(key, JSON.stringify(updated));
  } catch (e) {
    console.warn('LocalStorage error deleting history:', e);
  }
}
