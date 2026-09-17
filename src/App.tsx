import { useState, useEffect, useMemo } from 'react';
import {
  SchoolMeta,
  Table1SchoolRooms,
  Table1Staff,
  Table2RowInput,
  Table3RowInput,
  Table4RowInput,
  Table4HeaderConfig,
  MainAppSection,
  LibraryData,
  WaterSanitationData,
  HealthSocialData,
  SchoolFinanceData,
  MasterReportNarrative,
  StaffMember,
  ClassGradebook,
  AppUser,
  ReportSnapshotData,
  ReportVersionHistoryItem,
  UserRole,
  StudentScoreRow,
  FailedStudentRecord,
} from './types';
import {
  initialSchoolMeta,
  initialTable1Rooms,
  initialTable1Staff,
  initialTable2Rows,
  initialTable3Rows,
  initialTable4Rows,
  initialTable4HeaderConfig,
  initialLibraryData,
  initialWaterSanitationData,
  initialHealthSocialData,
  initialSchoolFinanceData,
  initialMasterReportNarrative,
  initialFailedStudents,
} from './data/initialData';
import { initialStaffList, initialClassGradebooks } from './data/schoolDataRot';
import { sampleDetailedStudents } from './data/sampleDetailedStudents';
import { aggregateStudentsToSchoolData } from './utils/studentAggregator';
import { Header } from './components/Header';
import { QuickStatsBar } from './components/QuickStatsBar';
import { Table1SchoolRoomsView } from './components/Table1SchoolRooms';
import { Table1StaffView } from './components/Table1Staff';
import { Table2AcademicResultsView } from './components/Table2AcademicResults';
import { Table3FailedStatsView } from './components/Table3FailedStats';
import { Table4YearEndResultsView } from './components/Table4YearEndResults';
import { TableFailedStudentsNominalRoll } from './components/TableFailedStudentsNominalRoll';
import { ReportSignatures } from './components/ReportSignatures';
import { PartBView } from './components/PartBView';
import { OfficialMasterReport } from './components/OfficialMasterReport';
import { StaffNominalRoll } from './components/StaffNominalRoll';
import { ClassGradebooksView } from './components/ClassGradebooksView';
import { DetailedAcademicResultsView } from './components/DetailedAcademicResultsView';
import { ImportDataModal } from './components/ImportDataModal';
import { MoeysAiReportModal } from './components/MoeysAiReportModal';
import { FullBookletView } from './components/FullBookletView';
import { exportAllTablesToExcel } from './utils/exportUtils';
import { toKhmerNum } from './utils/khmerNumbers';
import {
  auth,
  saveReportVersion,
  getReportHistory,
  loadLatestReport,
  deleteReportVersion,
  mapFirebaseUser,
  saveUserRole,
  loginWithRole,
} from './firebase';
import { onAuthStateChanged } from 'firebase/auth';
import { AuthModal } from './components/AuthModal';
import { SaveHistoryModal } from './components/SaveHistoryModal';
import { FirestoreModal } from './components/FirestoreModal';
import { Info, CheckCircle, Sparkles, ArrowRight, ArrowLeft, FileCheck2, Layers, History, Shield, Database } from 'lucide-react';

const STORAGE_KEYS = {
  MAIN_SECTION: 'kh_school_stat_main_section',
  META: 'kh_school_stat_meta',
  T1_ROOMS: 'kh_school_stat_t1_rooms',
  T1_STAFF: 'kh_school_stat_t1_staff',
  T2_ROWS: 'kh_school_stat_t2_rows',
  T3_ROWS: 'kh_school_stat_t3_rows',
  T4_ROWS: 'kh_school_stat_t4_rows',
  T4_CONFIG: 'kh_school_stat_t4_config',
  LIBRARY: 'kh_school_stat_library',
  WATER_SANITATION: 'kh_school_stat_water_sanitation',
  HEALTH_SOCIAL: 'kh_school_stat_health_social',
  FINANCE: 'kh_school_stat_finance',
  NARRATIVE: 'kh_school_stat_narrative',
  STAFF_LIST: 'kh_school_stat_staff_list',
  GRADEBOOKS: 'kh_school_stat_gradebooks',
  DETAILED_STUDENTS: 'kh_school_stat_detailed_students',
  FAILED_STUDENTS: 'kh_school_stat_failed_students',
};

export default function App() {
  // Main Navigation: Part A -> Part B -> Master Report
  const [mainSection, setMainSection] = useState<MainAppSection>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.MAIN_SECTION);
      return (saved as MainAppSection) || 'part_b';
    } catch {
      return 'part_b';
    }
  });

  // 1. School Metadata
  const [meta, setMeta] = useState<SchoolMeta>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.META);
      return saved ? JSON.parse(saved) : initialSchoolMeta;
    } catch {
      return initialSchoolMeta;
    }
  });

  // 2. Table 1 (School, Building, Rooms, Students G1-G6)
  const [t1Rooms, setT1Rooms] = useState<Table1SchoolRooms>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.T1_ROOMS);
      return saved ? JSON.parse(saved) : initialTable1Rooms;
    } catch {
      return initialTable1Rooms;
    }
  });

  // 3. Table 1(ត) (Educational Staff)
  const [t1Staff, setT1Staff] = useState<Table1Staff>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.T1_STAFF);
      return saved ? JSON.parse(saved) : initialTable1Staff;
    } catch {
      return initialTable1Staff;
    }
  });

  // 4. Table 2 (Academic Results)
  const [t2Rows, setT2Rows] = useState<Table2RowInput[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.T2_ROWS);
      return saved ? JSON.parse(saved) : initialTable2Rows;
    } catch {
      return initialTable2Rows;
    }
  });

  // 5. Table 3 (Failed Students Stats)
  const [t3Rows, setT3Rows] = useState<Table3RowInput[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.T3_ROWS);
      return saved ? JSON.parse(saved) : initialTable3Rows;
    } catch {
      return initialTable3Rows;
    }
  });

  // 6. Table 4 (Year-End Results After Retesting)
  const [t4Rows, setT4Rows] = useState<Table4RowInput[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.T4_ROWS);
      return saved ? JSON.parse(saved) : initialTable4Rows;
    } catch {
      return initialTable4Rows;
    }
  });

  // Table 4 Header & Period Configuration
  const [t4HeaderConfig, setT4HeaderConfig] = useState<Table4HeaderConfig>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.T4_CONFIG);
      return saved ? JSON.parse(saved) : initialTable4HeaderConfig;
    } catch {
      return initialTable4HeaderConfig;
    }
  });

  // Part B: Specialized & Social Data
  const [library, setLibrary] = useState<LibraryData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.LIBRARY);
      return saved ? JSON.parse(saved) : initialLibraryData;
    } catch {
      return initialLibraryData;
    }
  });

  const [waterSanitation, setWaterSanitation] = useState<WaterSanitationData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.WATER_SANITATION);
      return saved ? JSON.parse(saved) : initialWaterSanitationData;
    } catch {
      return initialWaterSanitationData;
    }
  });

  const [healthSocial, setHealthSocial] = useState<HealthSocialData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.HEALTH_SOCIAL);
      return saved ? JSON.parse(saved) : initialHealthSocialData;
    } catch {
      return initialHealthSocialData;
    }
  });

  const [finance, setFinance] = useState<SchoolFinanceData>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FINANCE);
      return saved ? JSON.parse(saved) : initialSchoolFinanceData;
    } catch {
      return initialSchoolFinanceData;
    }
  });

  // Master Report Narrative & Additional Chapters
  const [narrative, setNarrative] = useState<MasterReportNarrative>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.NARRATIVE);
      return saved ? JSON.parse(saved) : initialMasterReportNarrative;
    } catch {
      return initialMasterReportNarrative;
    }
  });

  // Staff Nominal Roll (Page 7)
  const [staffList, setStaffList] = useState<StaffMember[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.STAFF_LIST);
      return saved ? JSON.parse(saved) : initialStaffList;
    } catch {
      return initialStaffList;
    }
  });

  // Class Gradebooks (Pages 12 to 21)
  const [gradebooks, setGradebooks] = useState<ClassGradebook[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.GRADEBOOKS);
      return saved ? JSON.parse(saved) : initialClassGradebooks;
    } catch {
      return initialClassGradebooks;
    }
  });

  // Detailed Academic Results (User requested dataset & import)
  const [detailedStudents, setDetailedStudents] = useState<StudentScoreRow[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.DETAILED_STUDENTS);
      return saved ? JSON.parse(saved) : sampleDetailedStudents;
    } catch {
      return sampleDetailedStudents;
    }
  });

  // Failed Students Detailed Nominal Roll (0.00-4.99 and 4.00-4.99)
  const [failedStudents, setFailedStudents] = useState<FailedStudentRecord[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEYS.FAILED_STUDENTS);
      return saved ? JSON.parse(saved) : initialFailedStudents;
    } catch {
      return initialFailedStudents;
    }
  });

  const [isImportModalOpen, setIsImportModalOpen] = useState(false);
  const [isAiMoeysModalOpen, setIsAiMoeysModalOpen] = useState(false);

  // UI state
  const [activeTab, setActiveTab] = useState<'all' | 't1' | 't1_staff' | 't2' | 't3' | 't4' | 'failed_students'>('all');
  const [showFormulas, setShowFormulas] = useState(true);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Authentication & Cloud Save History State
  const [currentUser, setCurrentUser] = useState<AppUser | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isHistoryModalOpen, setIsHistoryModalOpen] = useState(false);
  const [isFirestoreModalOpen, setIsFirestoreModalOpen] = useState(false);
  const [historyList, setHistoryList] = useState<ReportVersionHistoryItem[]>([]);
  const [isSavingCloud, setIsSavingCloud] = useState(false);
  const [isSyncingCloud, setIsSyncingCloud] = useState(false);
  const [lastSavedTime, setLastSavedTime] = useState<string | null>(null);

  // Consistent Report Identifier for Firestore
  const reportId = 'report_primary_school_2025_2026';

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  // Helper to serialize full working state snapshot
  const getCurrentSnapshot = (): ReportSnapshotData => ({
    meta,
    t1Rooms,
    t1Staff,
    t2Rows,
    t3Rows,
    t4Rows,
    t4HeaderConfig,
    library,
    waterSanitation,
    healthSocial,
    finance,
    narrative,
    staffList,
    gradebooks,
    detailedStudents,
    failedStudents,
  });

  // Helper to apply snapshot to state
  const applySnapshot = (snap: ReportSnapshotData) => {
    if (!snap) return;
    if (snap.meta) setMeta(snap.meta);
    if (snap.t1Rooms) setT1Rooms(snap.t1Rooms);
    if (snap.t1Staff) setT1Staff(snap.t1Staff);
    if (snap.t2Rows) setT2Rows(snap.t2Rows);
    if (snap.t3Rows) setT3Rows(snap.t3Rows);
    if (snap.t4Rows) setT4Rows(snap.t4Rows);
    if (snap.t4HeaderConfig) setT4HeaderConfig(snap.t4HeaderConfig);
    if (snap.library) setLibrary(snap.library);
    if (snap.waterSanitation) setWaterSanitation(snap.waterSanitation);
    if (snap.healthSocial) setHealthSocial(snap.healthSocial);
    if (snap.finance) setFinance(snap.finance);
    if (snap.narrative) setNarrative(snap.narrative);
    if (snap.staffList) setStaffList(snap.staffList);
    if (snap.gradebooks) setGradebooks(snap.gradebooks);
    if (snap.detailedStudents) setDetailedStudents(snap.detailedStudents);
    if (snap.failedStudents) setFailedStudents(snap.failedStudents);
  };

  // Listen to Firebase Auth state & sync latest Cloud Firestore state on load
  useEffect(() => {
    let isMounted = true;
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      if (firebaseUser) {
        const appUser = mapFirebaseUser(firebaseUser);
        if (isMounted) setCurrentUser(appUser);
        if (appUser) {
          try {
            const [list, cloudData] = await Promise.all([
              getReportHistory(reportId),
              loadLatestReport(reportId),
            ]);
            if (isMounted) {
              setHistoryList(list);
              if (list.length > 0) {
                setLastSavedTime(list[0].savedAt);
              }
              // Overwrite local state with latest saved Cloud state
              if (cloudData) {
                applySnapshot(cloudData);
                console.log('Successfully synced latest report snapshot from Cloud Firestore');
              }
            }
          } catch (err) {
            console.warn('Initial cloud sync error:', err);
          }
        }
      } else {
        // Auto-initialize standard educational session for immediate seamless authorization
        try {
          const defaultUser = await loginWithRole('នាយកសាលា', `លោកនាយក ${meta.schoolName || 'សាលាបឋមសិក្សា'}`);
          if (isMounted) setCurrentUser(defaultUser);
        } catch (e) {
          console.warn('Auto-init educational session note:', e);
        }
      }
    });
    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [reportId, meta.schoolName]);

  // Handle Save New Version (Snapshot & History log)
  const handleSaveNewVersion = async (note: string) => {
    let userToUse = currentUser;
    if (!userToUse) {
      setIsAuthModalOpen(true);
      return;
    }
    setIsSavingCloud(true);
    try {
      const snapshot = getCurrentSnapshot();
      const result = await saveReportVersion(
        reportId,
        snapshot,
        userToUse,
        'manual_save',
        note || 'បានរក្សាទុកកំណែដោយដៃ'
      );
      setHistoryList((prev) => [result.historyItem, ...prev.filter((i) => i.id !== result.historyItem.id)]);
      setLastSavedTime(result.historyItem.savedAt);
      if (result.savedToCloud) {
        showToast(`បានរក្សាទុកកំណែទី ${toKhmerNum(result.historyItem.versionNumber)} លើ Cloud Firestore ដោយជោគជ័យ!`);
      } else {
        showToast(`បានរក្សាទុកក្នុងកុំព្យូទ័រ (Local Cache) - Cloud កំពុងតភ្ជាប់...`);
      }
    } catch (err: any) {
      console.error('Save version error:', err);
      showToast('បានរក្សាទុកក្នុងកុំព្យូទ័រ (Local Cache) រួចរាល់');
    } finally {
      setIsSavingCloud(false);
    }
  };

  // Manual Fetch from Cloud
  const handleFetchFromCloud = async () => {
    setIsSyncingCloud(true);
    try {
      const cloudData = await loadLatestReport(reportId);
      if (cloudData) {
        applySnapshot(cloudData);
        showToast('បានទាញយកទិន្នន័យចុងក្រោយពី Cloud Firestore ដោយជោគជ័យ!');
      } else {
        showToast('មិនទាន់មានទិន្នន័យលើ Cloud Firestore នៅឡើយទេ');
      }
      const list = await getReportHistory(reportId);
      setHistoryList(list);
      if (list.length > 0) {
        setLastSavedTime(list[0].savedAt);
      }
    } catch (e: any) {
      console.error('Fetch cloud error:', e);
      showToast('បរាជ័យក្នុងការទាញយកពី Cloud Firestore');
    } finally {
      setIsSyncingCloud(false);
    }
  };

  // Manual Push to Cloud
  const handlePushToCloud = async () => {
    await handleSaveNewVersion('បានរក្សាទុកដោយផ្ទាល់ពីបន្ទះ Firestore');
  };

  // Quick Save button from top bar
  const handleQuickSave = () => {
    if (!currentUser) {
      setIsAuthModalOpen(true);
    } else {
      handleSaveNewVersion('');
    }
  };

  // Handle Restore from a historic version
  const handleRestoreVersion = async (item: ReportVersionHistoryItem) => {
    const snap = item.reportSnapshot;
    if (!snap) return;
    if (snap.meta) setMeta(snap.meta);
    if (snap.t1Rooms) setT1Rooms(snap.t1Rooms);
    if (snap.t1Staff) setT1Staff(snap.t1Staff);
    if (snap.t2Rows) setT2Rows(snap.t2Rows);
    if (snap.t3Rows) setT3Rows(snap.t3Rows);
    if (snap.t4Rows) setT4Rows(snap.t4Rows);
    if (snap.t4HeaderConfig) setT4HeaderConfig(snap.t4HeaderConfig);
    if (snap.library) setLibrary(snap.library);
    if (snap.waterSanitation) setWaterSanitation(snap.waterSanitation);
    if (snap.healthSocial) setHealthSocial(snap.healthSocial);
    if (snap.finance) setFinance(snap.finance);
    if (snap.narrative) setNarrative(snap.narrative);
    if (snap.staffList) setStaffList(snap.staffList);
    if (snap.gradebooks) setGradebooks(snap.gradebooks);

    showToast(`បានស្តារទិន្នន័យត្រឡប់ទៅ «កំណែទី ${toKhmerNum(item.versionNumber)}» ជោគជ័យ!`);

    // Log the restoration event in version history
    if (currentUser) {
      try {
        const restoreLog = await saveReportVersion(
          reportId,
          snap,
          currentUser,
          'restore_version',
          `បានស្តារពីកំណែទី ${toKhmerNum(item.versionNumber)} (${item.savedAt})`
        );
        setHistoryList((prev) => [restoreLog.historyItem, ...prev.filter((i) => i.id !== restoreLog.historyItem.id)]);
      } catch (e) {
        console.warn('Restore log save note:', e);
      }
    }
  };

  // Delete a history record
  const handleDeleteVersion = async (versionId: string) => {
    if (!currentUser) return;
    try {
      await deleteReportVersion(versionId, reportId);
      setHistoryList((prev) => prev.filter((i) => i.id !== versionId));
      showToast('បានលុបកំណែចេញពីប្រវត្តិ');
    } catch (e) {
      console.warn('Delete error:', e);
    }
  };

  // Switch educational role
  const handleChangeRole = (newRole: UserRole) => {
    if (!currentUser) return;
    saveUserRole(currentUser.uid, newRole);
    setCurrentUser((prev) => (prev ? { ...prev, role: newRole } : null));
    showToast(`បានប្តូរតួនាទីទៅជា «${newRole}»`);
  };

  // Auto-save to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEYS.MAIN_SECTION, mainSection);
      localStorage.setItem(STORAGE_KEYS.META, JSON.stringify(meta));
      localStorage.setItem(STORAGE_KEYS.T1_ROOMS, JSON.stringify(t1Rooms));
      localStorage.setItem(STORAGE_KEYS.T1_STAFF, JSON.stringify(t1Staff));
      localStorage.setItem(STORAGE_KEYS.T2_ROWS, JSON.stringify(t2Rows));
      localStorage.setItem(STORAGE_KEYS.T3_ROWS, JSON.stringify(t3Rows));
      localStorage.setItem(STORAGE_KEYS.T4_ROWS, JSON.stringify(t4Rows));
      localStorage.setItem(STORAGE_KEYS.T4_CONFIG, JSON.stringify(t4HeaderConfig));
      localStorage.setItem(STORAGE_KEYS.LIBRARY, JSON.stringify(library));
      localStorage.setItem(STORAGE_KEYS.WATER_SANITATION, JSON.stringify(waterSanitation));
      localStorage.setItem(STORAGE_KEYS.HEALTH_SOCIAL, JSON.stringify(healthSocial));
      localStorage.setItem(STORAGE_KEYS.FINANCE, JSON.stringify(finance));
      localStorage.setItem(STORAGE_KEYS.NARRATIVE, JSON.stringify(narrative));
      localStorage.setItem(STORAGE_KEYS.STAFF_LIST, JSON.stringify(staffList));
      localStorage.setItem(STORAGE_KEYS.GRADEBOOKS, JSON.stringify(gradebooks));
      localStorage.setItem(STORAGE_KEYS.DETAILED_STUDENTS, JSON.stringify(detailedStudents));
      localStorage.setItem(STORAGE_KEYS.FAILED_STUDENTS, JSON.stringify(failedStudents));
    } catch {
      // ignore storage write errors
    }
  }, [
    mainSection,
    meta,
    t1Rooms,
    t1Staff,
    t2Rows,
    t3Rows,
    t4Rows,
    t4HeaderConfig,
    library,
    waterSanitation,
    healthSocial,
    finance,
    narrative,
    staffList,
    gradebooks,
    detailedStudents,
    failedStudents,
  ]);

  // Keep school names in sync when modified in metadata
  const handleUpdateMeta = (newMeta: SchoolMeta) => {
    setMeta(newMeta);
    if (newMeta.schoolName !== t1Rooms.schoolName) {
      setT1Rooms((prev) => ({ ...prev, schoolName: newMeta.schoolName }));
      setT1Staff((prev) => ({ ...prev, schoolName: newMeta.schoolName }));
    }
  };

  // Sync student numbers from Table 1 into Tables 2, 4, and Part B (Deworming target)
  const handleSyncFromTable1 = () => {
    const gradesList: Array<keyof Pick<Table1SchoolRooms, 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'>> = [
      'g1', 'g2', 'g3', 'g4', 'g5', 'g6'
    ];

    const totalStudents = gradesList.reduce((acc, k) => acc + (Number(t1Rooms[k].total) || 0), 0);

    // Update Table 2: Adjust passed students to match table 1 student counts if failed/dropouts are 0
    const newT2 = t2Rows.map((row, i) => {
      const gKey = gradesList[i];
      const t1Data = t1Rooms[gKey];
      const failed = row.failedAvgTotal || 0;
      const failedFem = row.failedAvgFemale || 0;
      const dropout = row.dropoutTotal || 0;
      const dropoutFem = row.dropoutFemale || 0;

      const passedTot = Math.max(0, t1Data.total - failed - dropout);
      const passedFem = Math.max(0, t1Data.female - failedFem - dropoutFem);

      return {
        ...row,
        passedAvgTotal: passedTot,
        passedAvgFemale: passedFem,
      };
    });
    setT2Rows(newT2);

    // Update Table 4: Adjust passed students
    const newT4 = t4Rows.map((row, i) => {
      const gKey = gradesList[i];
      const t1Data = t1Rooms[gKey];
      const retest = row.passedRetestTotal || 0;
      const retestFem = row.passedRetestFemale || 0;
      const repeat = row.repeatersTotal || 0;
      const repeatFem = row.repeatersFemale || 0;
      const drop = row.dropoutsTotal || 0;
      const dropFem = row.dropoutsFemale || 0;

      const passedTot = Math.max(0, t1Data.total - retest - repeat - drop);
      const passedFem = Math.max(0, t1Data.female - retestFem - repeatFem - dropFem);

      return {
        ...row,
        passedAvgTotal: passedTot,
        passedAvgFemale: passedFem,
      };
    });
    setT4Rows(newT4);

    // Update Health Deworming Target in Part B automatically
    setHealthSocial((prev) => ({
      ...prev,
      dewormingRound1: {
        ...prev.dewormingRound1,
        target: totalStudents,
      },
      dewormingRound2: {
        ...prev.dewormingRound2,
        target: totalStudents,
      },
    }));

    showToast('ទាញទិន្នន័យពីតារាងទី១ ទៅតារាងទី២ ទី៤ និងផ្នែក B បានជោគជ័យ!');
  };

  // Reset to original sample data
  const handleReset = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យទាំងអស់ឡើងវិញទៅទម្រង់គំរូដើមមែនទេ?')) {
      setMeta(initialSchoolMeta);
      setT1Rooms(initialTable1Rooms);
      setT1Staff(initialTable1Staff);
      setT2Rows(initialTable2Rows);
      setT3Rows(initialTable3Rows);
      setT4Rows(initialTable4Rows);
      setT4HeaderConfig(initialTable4HeaderConfig);
      setLibrary(initialLibraryData);
      setWaterSanitation(initialWaterSanitationData);
      setHealthSocial(initialHealthSocialData);
      setFinance(initialSchoolFinanceData);
      setNarrative(initialMasterReportNarrative);
      setDetailedStudents(sampleDetailedStudents);
      setFailedStudents(initialFailedStudents);
      setStaffList(initialStaffList);
      setGradebooks(initialClassGradebooks);
      showToast('បានកំណត់ទិន្នន័យដើមឡើងវិញរួចរាល់!');
    }
  };

  // Summary memo of current detailed students
  const currentSummary = useMemo(() => {
    return aggregateStudentsToSchoolData(
      detailedStudents,
      t1Rooms,
      t2Rows,
      t3Rows,
      t4Rows,
      gradebooks
    ).summary;
  }, [detailedStudents, t1Rooms, t2Rows, t3Rows, t4Rows, gradebooks]);

  // Sync detailed students to all official school reports (Tables A, B, Master Report & Class Gradebooks)
  const handleSyncDetailedToSchoolReports = () => {
    const result = aggregateStudentsToSchoolData(
      detailedStudents,
      t1Rooms,
      t2Rows,
      t3Rows,
      t4Rows,
      gradebooks
    );

    setT1Rooms(result.updatedT1Rooms);
    setT2Rows(result.updatedT2Rows);
    setT3Rows(result.updatedT3Rows);
    setT4Rows(result.updatedT4Rows);
    setGradebooks(result.updatedGradebooks);

    // Sync health deworming target
    const totalCount = result.summary.totalEnrolled;
    setHealthSocial((prev) => ({
      ...prev,
      dewormingRound1: {
        ...prev.dewormingRound1,
        target: totalCount,
      },
      dewormingRound2: {
        ...prev.dewormingRound2,
        target: totalCount,
      },
    }));

    showToast(
      `បានគណនា និងធ្វើបច្ចុប្បន្នភាពទៅរបាយការណ៍ A, B, បូកសរុប និងចំណាត់ថ្នាក់ (${toKhmerNum(
        result.summary.totalEnrolled
      )} នាក់)!`
    );
  };

  // Import handler with optional auto-calculation
  const handleImportSuccess = (
    importedStudents: StudentScoreRow[],
    autoSync: boolean,
    mode: 'replace' | 'append'
  ) => {
    const nextStudents = mode === 'replace' ? importedStudents : [...detailedStudents, ...importedStudents];
    const indexed = nextStudents.map((s, idx) => ({ ...s, no: s.no || idx + 1 }));
    setDetailedStudents(indexed);

    if (autoSync) {
      const result = aggregateStudentsToSchoolData(
        indexed,
        t1Rooms,
        t2Rows,
        t3Rows,
        t4Rows,
        gradebooks
      );
      setT1Rooms(result.updatedT1Rooms);
      setT2Rows(result.updatedT2Rows);
      setT3Rows(result.updatedT3Rows);
      setT4Rows(result.updatedT4Rows);
      setGradebooks(result.updatedGradebooks);
      showToast(`បាននាំចូល និងគណនាស្វ័យប្រវត្តទៅរបាយការណ៍សាលាជោគជ័យ (${toKhmerNum(indexed.length)} នាក់)!`);
    } else {
      showToast(`បាននាំចូលទិន្នន័យសិស្ស ${toKhmerNum(importedStudents.length)} នាក់ជោគជ័យ!`);
    }
  };

  const handleLoadSampleData = () => {
    setDetailedStudents(sampleDetailedStudents);
    showToast('បានផ្ទុកទិន្នន័យគំរូ ៧៦-៨០ ពីសំណើអ្នកប្រើប្រាស់រួចរាល់!');
  };

  // Export to Excel / XLS (Includes Part A & Part B)
  const handleExportExcel = () => {
    exportAllTablesToExcel(
      meta,
      t1Rooms,
      t1Staff,
      t2Rows,
      t3Rows,
      t4Rows,
      t4HeaderConfig,
      library,
      waterSanitation,
      healthSocial,
      finance
    );
    showToast('កំពុងទាញយកឯកសារ Excel (.xls)...');
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      {/* Sticky Header with 3-Way Flow Navigation */}
      <Header
        meta={meta}
        onUpdateMeta={handleUpdateMeta}
        onReset={handleReset}
        onSyncFromTable1={handleSyncFromTable1}
        onExportExcel={handleExportExcel}
        showFormulas={showFormulas}
        onToggleFormulas={() => setShowFormulas(!showFormulas)}
        mainSection={mainSection}
        setMainSection={setMainSection}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        currentUser={currentUser}
        onOpenAuthModal={() => setIsAuthModalOpen(true)}
        onOpenHistoryModal={() => setIsHistoryModalOpen(true)}
        onOpenFirestoreModal={() => setIsFirestoreModalOpen(true)}
        onQuickSave={handleQuickSave}
        isSaving={isSavingCloud}
        historyCount={historyList.length}
        lastSavedTime={lastSavedTime}
        onChangeRole={handleChangeRole}
      />

      {/* Toast Alert Notification */}
      {toastMessage && (
        <div className="no-print fixed bottom-5 right-5 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg flex items-center gap-2.5 text-xs animate-slideUp">
          <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-4">
        {/* KPI Quick Stats Overview (Visible on Part A & Part B) */}
        {mainSection !== 'master_report' && (
          <QuickStatsBar t1Rooms={t1Rooms} t1Staff={t1Staff} t2Rows={t2Rows} />
        )}

        {/* -------------------------------------------------- */}
        {/* SECTION A: Foundational Infrastructure & Academic Results */}
        {/* -------------------------------------------------- */}
        {mainSection === 'part_a' && (
          <div>
            {/* Informative Guidance Banner */}
            <div className="no-print mb-4 p-3 bg-gradient-to-r from-blue-50/70 to-indigo-50/70 border border-blue-100 rounded-xl flex items-start gap-3 text-xs text-slate-600">
              <Info className="w-4 h-4 text-blue-600 shrink-0 mt-0.5" />
              <div className="flex-1 leading-relaxed">
                <strong>ផ្នែក A (ទិន្នន័យគ្រឹះ & សិក្សា) :</strong> បញ្ចូលតួលេខក្នុងប្រអប់ពណ៌ស។ រាល់ផលបូក ផលដក និងភាគរយ (<span className="text-emerald-700 font-semibold">%</span>) ត្រូវបានគណនាស្វ័យប្រវត្ត។ ទិន្នន័យសិស្ស និងបុគ្គលិកនឹងរត់បន្តទៅ <strong>ផ្នែក B</strong> និង <strong>របាយការណ៍ផ្លូវការ (Master Report)</strong> ដោយស្វ័យប្រវត្ត។
              </div>
              <button
                onClick={handleSyncFromTable1}
                className="hidden sm:flex items-center gap-1 text-xs font-semibold text-blue-700 hover:text-blue-900 bg-white px-2.5 py-1 rounded-md border border-blue-200 shadow-2xs whitespace-nowrap cursor-pointer"
              >
                <Sparkles className="w-3 h-3 text-blue-600" />
                ទាញទិន្នន័យពីតារាង១
              </button>
            </div>

            {/* Tables according to Active Tab */}
            <div className="space-y-6">
              {/* Table 1: School, Buildings, Rooms, Students */}
              {(activeTab === 'all' || activeTab === 't1') && (
                <section id="section-t1" className="scroll-mt-24">
                  <Table1SchoolRoomsView
                    data={t1Rooms}
                    onChange={(d) => {
                      setT1Rooms(d);
                      if (d.schoolName !== meta.schoolName) {
                        setMeta((m) => ({ ...m, schoolName: d.schoolName }));
                      }
                    }}
                    showFormulas={showFormulas}
                  />
                </section>
              )}

              {/* Table 1(ត): Educational Staff */}
              {(activeTab === 'all' || activeTab === 't1_staff') && (
                <section id="section-t1-staff" className="scroll-mt-24">
                  <Table1StaffView
                    data={t1Staff}
                    onChange={(d) => {
                      setT1Staff(d);
                      if (d.schoolName !== meta.schoolName) {
                        setMeta((m) => ({ ...m, schoolName: d.schoolName }));
                      }
                    }}
                    showFormulas={showFormulas}
                  />
                </section>
              )}

              {/* Table 2: Academic Results */}
              {(activeTab === 'all' || activeTab === 't2') && (
                <section id="section-t2" className="scroll-mt-24">
                  <Table2AcademicResultsView
                    rows={t2Rows}
                    onChange={setT2Rows}
                    showFormulas={showFormulas}
                  />
                </section>
              )}

              {/* Table 3: Failed Students Stats */}
              {(activeTab === 'all' || activeTab === 't3') && (
                <section id="section-t3" className="scroll-mt-24">
                  <Table3FailedStatsView
                    rows={t3Rows}
                    onChange={setT3Rows}
                    showFormulas={showFormulas}
                  />
                </section>
              )}

              {/* Table 4: Year-End Results After Retesting */}
              {(activeTab === 'all' || activeTab === 't4') && (
                <section id="section-t4" className="scroll-mt-24">
                  <Table4YearEndResultsView
                    rows={t4Rows}
                    onChange={setT4Rows}
                    showFormulas={showFormulas}
                    headerConfig={t4HeaderConfig}
                    onUpdateHeaderConfig={setT4HeaderConfig}
                  />
                </section>
              )}

              {/* Table: Detailed Nominal Roll of Failed Students (0.00-4.99 and 4.00-4.99) */}
              {(activeTab === 'all' || activeTab === 'failed_students') && (
                <section id="section-failed-students-roll" className="scroll-mt-24">
                  <TableFailedStudentsNominalRoll
                    students={failedStudents}
                    onChange={setFailedStudents}
                    meta={meta}
                    gradebooks={gradebooks}
                    detailedStudents={detailedStudents}
                  />
                </section>
              )}

              {/* Official Signatures Block */}
              <ReportSignatures meta={meta} />

              {/* Flow Next Step Card (Part A -> Part B) */}
              <div className="no-print mt-8 p-5 bg-gradient-to-r from-teal-50 to-blue-50 border border-teal-200 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-sm shrink-0 shadow-xs">
                    B
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">
                      ជំហានបន្ទាប់ ៖ បញ្ចូលទិន្នន័យផ្នែក B (ស្ថិតិឯកទេស & សង្គម)
                    </h4>
                    <p className="text-xs text-slate-500 mt-0.5">
                      ទិន្នន័យសិស្សពីតារាងទី១ ត្រូវបានបញ្ជូនទៅផ្នែក B ដោយស្វ័យប្រវត្តិរួចជាស្រេច (Target ទម្លាក់ព្រូន, បង្គន់អនាម័យ...)
                    </p>
                  </div>
                </div>
                <button
                  id="btn-goto-part-b"
                  onClick={() => {
                    setMainSection('part_b');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-2 px-4 py-2 bg-teal-600 hover:bg-teal-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors whitespace-nowrap cursor-pointer"
                >
                  <span>បន្តទៅផ្នែក B</span>
                  <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* SECTION B: Specialized & Social Statistics */}
        {/* -------------------------------------------------- */}
        {mainSection === 'part_b' && (
          <div>
            <PartBView
              meta={meta}
              t1Rooms={t1Rooms}
              t1Staff={t1Staff}
              library={library}
              onChangeLibrary={setLibrary}
              waterSanitation={waterSanitation}
              onChangeWaterSanitation={setWaterSanitation}
              healthSocial={healthSocial}
              onChangeHealthSocial={setHealthSocial}
              finance={finance}
              onChangeFinance={setFinance}
              onNavigateToMaster={() => {
                setMainSection('master_report');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onNavigateToPartA={() => {
                setMainSection('part_a');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Navigation Flow: Back to Part A or Forward to Staff Nominal Roll */}
            <div className="no-print mt-8 flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <button
                id="btn-backto-part-a"
                onClick={() => {
                  setMainSection('part_a');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ត្រឡប់ទៅផ្នែក A (ទិន្នន័យគ្រឹះ)</span>
              </button>

              <button
                id="btn-goto-staff"
                onClick={() => {
                  setMainSection('staff_nominal');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>បន្តទៅបញ្ជីបុគ្គលិក (ទំព័រទី ៧)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* SECTION: Detailed Academic Results (User requested dataset & import) */}
        {/* -------------------------------------------------- */}
        {mainSection === 'detailed_results' && (
          <div className="space-y-6">
            <DetailedAcademicResultsView
              meta={meta}
              students={detailedStudents}
              onUpdateStudents={setDetailedStudents}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onOpenAiReportModal={() => setIsAiMoeysModalOpen(true)}
              onSyncToSchoolReports={handleSyncDetailedToSchoolReports}
              onLoadSampleData={handleLoadSampleData}
            />

            <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <button
                onClick={() => {
                  setMainSection('part_b');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ត្រឡប់ទៅផ្នែក B</span>
              </button>

              <button
                onClick={() => {
                  setMainSection('class_rankings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>បន្តទៅចំណាត់ថ្នាក់តាមថ្នាក់ (ទំព័រ ១២-២១)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* SECTION: Staff Nominal Roll (Page 7) */}
        {/* -------------------------------------------------- */}
        {mainSection === 'staff_nominal' && (
          <div className="space-y-6">
            <StaffNominalRoll
              meta={meta}
              staffList={staffList}
              onUpdateStaffList={setStaffList}
            />

            <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <button
                onClick={() => {
                  setMainSection('part_b');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ត្រឡប់ទៅផ្នែក B</span>
              </button>

              <button
                onClick={() => {
                  setMainSection('class_rankings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>បន្តទៅចំណាត់ថ្នាក់តាមថ្នាក់ (ទំព័រ ១២-២១)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* SECTION: Class Gradebooks & Rankings (Pages 12-21) */}
        {/* -------------------------------------------------- */}
        {mainSection === 'class_rankings' && (
          <div className="space-y-6">
            <ClassGradebooksView
              meta={meta}
              gradebooks={gradebooks}
              staffList={staffList}
              onUpdateGradebooks={setGradebooks}
              onOpenImportModal={() => setIsImportModalOpen(true)}
              onNavigateToDetailedResults={() => {
                setMainSection('detailed_results');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            <div className="no-print flex flex-col sm:flex-row items-center justify-between gap-3 p-4 bg-white border border-slate-200 rounded-2xl shadow-xs">
              <button
                onClick={() => {
                  setMainSection('detailed_results');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 text-xs font-medium rounded-xl transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>ត្រឡប់ទៅលទ្ធផលលម្អិត</span>
              </button>

              <button
                onClick={() => {
                  setMainSection('master_report');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors cursor-pointer"
              >
                <span>បន្តទៅរបាយការណ៍បូកសរុប (Master Report)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* MASTER AGGREGATED REPORT (Official MoEYS 7 Chapters) */}
        {/* -------------------------------------------------- */}
        {mainSection === 'master_report' && (
          <div>
            {/* Quick Action bar above master report */}
            <div className="no-print mb-4 flex items-center justify-between">
              <button
                onClick={() => {
                  setMainSection('class_rankings');
                  window.scrollTo({ top: 0, behavior: 'smooth' });
                }}
                className="flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-900 bg-white px-3 py-1.5 rounded-lg border border-slate-200 cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                <span>ត្រឡប់ទៅចំណាត់ថ្នាក់តាមថ្នាក់</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setMainSection('full_booklet');
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                  className="flex items-center gap-1.5 text-xs text-amber-800 hover:text-amber-950 bg-amber-100 px-3 py-1.5 rounded-lg border border-amber-300 cursor-pointer font-bold"
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>មើលសៀវភៅទាំងមូល ២៤ទំព័រ</span>
                </button>
              </div>
            </div>

            <OfficialMasterReport
              meta={meta}
              t1Rooms={t1Rooms}
              t1Staff={t1Staff}
              t2Rows={t2Rows}
              t3Rows={t3Rows}
              t4Rows={t4Rows}
              t4HeaderConfig={t4HeaderConfig}
              library={library}
              waterSanitation={waterSanitation}
              healthSocial={healthSocial}
              finance={finance}
              narrative={narrative}
              onChangeNarrative={setNarrative}
              onExportExcel={handleExportExcel}
              onOpenAiMoeysModal={() => setIsAiMoeysModalOpen(true)}
            />
          </div>
        )}

        {/* -------------------------------------------------- */}
        {/* FULL BOOKLET (Complete 24-Page Official Booklet) */}
        {/* -------------------------------------------------- */}
        {mainSection === 'full_booklet' && (
          <FullBookletView
            meta={meta}
            t1Rooms={t1Rooms}
            t1Staff={t1Staff}
            t2Rows={t2Rows}
            t3Rows={t3Rows}
            t4Rows={t4Rows}
            t4HeaderConfig={t4HeaderConfig}
            library={library}
            waterSanitation={waterSanitation}
            healthSocial={healthSocial}
            finance={finance}
            narrative={narrative}
            staffList={staffList}
            gradebooks={gradebooks}
            failedStudents={failedStudents}
            onChangeNarrative={setNarrative}
            onUpdateStaffList={setStaffList}
            onUpdateGradebooks={setGradebooks}
            onUpdateFailedStudents={setFailedStudents}
            onExportExcel={handleExportExcel}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="no-print mt-auto border-t border-slate-200 bg-white py-4 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© {meta.academicYear} | ប្រព័ន្ធគំរូតារាងបញ្ចូលទិន្នន័យ និងគណនាស្វ័យប្រវត្តសម្រាប់សាលាបឋមសិក្សា (ផ្នែក A, ផ្នែក B និងរបាយការណ៍រួម)</p>
          <div className="flex items-center gap-3 text-slate-400">
            <button
              id="btn-footer-open-firestore"
              onClick={() => setIsFirestoreModalOpen(true)}
              className="flex items-center gap-1.5 text-amber-800 hover:text-amber-900 bg-amber-50 hover:bg-amber-100 px-2 py-0.5 rounded border border-amber-200 font-medium cursor-pointer transition-colors"
              title="ពិនិត្យទីតាំង Cloud Firestore Database"
            >
              <Database className="w-3.5 h-3.5 text-amber-700" />
              <span>Firestore Console</span>
            </button>
            <span>•</span>
            <button
              id="btn-footer-open-history"
              onClick={() => setIsHistoryModalOpen(true)}
              className="text-indigo-600 hover:underline cursor-pointer font-medium"
            >
              ប្រវត្តិរក្សាទុក ({toKhmerNum(historyList.length)})
            </button>
            <span>•</span>
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="text-blue-600 hover:underline cursor-pointer"
            >
              ត្រឡប់ទៅលើ
            </button>
          </div>
        </div>
      </footer>

      {/* Authentication Dialog */}
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => setIsAuthModalOpen(false)}
        onLoginSuccess={(user) => {
          setCurrentUser(user);
          showToast(`សូមស្វាគមន៍! បានចូលប្រព័ន្ធជា «${user.displayName || user.role}»`);
        }}
      />

      {/* Firestore Database Transparency & Live Sync Dialog */}
      <FirestoreModal
        isOpen={isFirestoreModalOpen}
        onClose={() => setIsFirestoreModalOpen(false)}
        currentUser={currentUser}
        onFetchFromCloud={handleFetchFromCloud}
        onPushToCloud={handlePushToCloud}
        isSyncing={isSyncingCloud || isSavingCloud}
      />

      {/* Save Version History & Audit Trail Dialog */}
      <SaveHistoryModal
        isOpen={isHistoryModalOpen}
        onClose={() => setIsHistoryModalOpen(false)}
        currentUser={currentUser}
        historyList={historyList}
        onSaveNewVersion={handleSaveNewVersion}
        onRestoreVersion={handleRestoreVersion}
        onDeleteVersion={handleDeleteVersion}
        isSaving={isSavingCloud}
      />

      {/* Import Data Modal */}
      <ImportDataModal
        isOpen={isImportModalOpen}
        onClose={() => setIsImportModalOpen(false)}
        onImportSuccess={handleImportSuccess}
      />

      {/* MoEYS AI Official Report Modal */}
      <MoeysAiReportModal
        isOpen={isAiMoeysModalOpen}
        onClose={() => setIsAiMoeysModalOpen(false)}
        meta={meta}
        students={detailedStudents}
        summary={currentSummary}
        reportData={getCurrentSnapshot()}
        onApplyNarrative={(text) => {
          setNarrative((prev) => ({
            ...prev,
            conclusion: text,
          }));
          showToast('បានបញ្ចូលសេចក្តីវិភាគ AI ទៅក្នុងរបាយការណ៍បូកសរុប!');
        }}
      />
    </div>
  );
}

