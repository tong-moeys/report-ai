import React, { useState, useEffect, useRef } from 'react';
import { User, signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { Header } from './components/Header';
import { ReportEditor } from './components/ReportEditor';
import { OfficialPrintableReport } from './components/OfficialPrintableReport';
import { AnalyticsDashboard } from './components/AnalyticsDashboard';
import { AiAssistantCenter } from './components/AiAssistantCenter';
import { KhmerCalendarView } from './components/KhmerCalendarView';
import { DocumentSubmissionModal } from './components/DocumentSubmissionModal';
import { FullSchoolReport } from './types';
import { initialSchoolReport } from './initialData';
import {
  auth,
  googleProvider,
  saveReportToFirestore,
  loadReportFromFirestore,
  testFirestoreConnection,
  listUserSubmissions,
  FirestoreReportSubmission
} from './firebase';

export function App() {
  const [report, setReport] = useState<FullSchoolReport>(() => {
    try {
      const saved = localStorage.getItem('moeys_school_report_data');
      if (saved) {
        const parsed = JSON.parse(saved);
        return {
          ...initialSchoolReport,
          ...parsed,
          info: {
            ...initialSchoolReport.info,
            ...parsed.info,
          },
          students: {
            ...initialSchoolReport.students,
            ...parsed.students,
          },
          academicResults: parsed.academicResults || initialSchoolReport.academicResults,
          academicPercentages: parsed.academicPercentages || initialSchoolReport.academicPercentages,
          postTestAcademicResults: (parsed.postTestAcademicResults && parsed.postTestAcademicResults.length > 0)
            ? parsed.postTestAcademicResults
            : initialSchoolReport.postTestAcademicResults,
          teachingEvaluation: parsed.teachingEvaluation || initialSchoolReport.teachingEvaluation,
          finances: {
            ...initialSchoolReport.finances,
            ...parsed.finances,
            periodNote: parsed.finances?.periodNote || initialSchoolReport.finances.periodNote,
            tableRows: (parsed.finances?.tableRows && parsed.finances.tableRows.length > 0)
              ? parsed.finances.tableRows
              : initialSchoolReport.finances.tableRows,
          },
          extracurricular: parsed.extracurricular || initialSchoolReport.extracurricular,
          inspection: parsed.inspection || initialSchoolReport.inspection,
          communityWork: parsed.communityWork || initialSchoolReport.communityWork,
          vacationPrep: parsed.vacationPrep || initialSchoolReport.vacationPrep,
          conclusion: parsed.conclusion || initialSchoolReport.conclusion,
        };
      }
    } catch (e) {
      console.error('Failed to parse saved report from localStorage', e);
    }
    return initialSchoolReport;
  });

  const [activeTab, setActiveTab] = useState<'editor' | 'print' | 'analytics' | 'ai' | 'calendar'>('editor');
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Firebase Auth State
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'idle' | 'saving' | 'saved' | 'error' | 'offline'>('idle');
  const [lastAutoSavedTime, setLastAutoSavedTime] = useState<string | null>(null);
  const [isSubmissionModalOpen, setIsSubmissionModalOpen] = useState<boolean>(false);
  const [submissionCount, setSubmissionCount] = useState<number>(0);

  const debounceTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  // Test connection on boot & listen to Auth state changes
  useEffect(() => {
    testFirestoreConnection();

    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        showToast(`បានភ្ជាប់គណនី៖ ${user.displayName || user.email}`);
        // Fetch submission history count
        try {
          const subs = await listUserSubmissions(user.uid);
          setSubmissionCount(subs.length);
        } catch (err) {
          console.warn('Could not fetch submissions count:', err);
        }

        // Try to load user's cloud report if exists
        try {
          const remote = await loadReportFromFirestore('default_school_report');
          if (remote && remote.reportData) {
            setReport(prev => ({
              ...prev,
              ...remote.reportData,
            }));
            showToast('បានទាញយកទិន្នន័យពី Cloud Firestore រួចរាល់');
          }
        } catch (err) {
          console.warn('Error fetching cloud report on login:', err);
        }
      }
    });

    return () => unsubscribe();
  }, []);

  // Structured Auto-Save Effect (Debounced 1.5s)
  useEffect(() => {
    // 1. Immediately backup to localStorage
    try {
      localStorage.setItem('moeys_school_report_data', JSON.stringify(report));
    } catch (e) {
      console.error('LocalStorage save error:', e);
    }

    // 2. If user is signed in, trigger Firestore Cloud structured auto-save
    if (!currentUser) {
      setAutoSaveStatus('offline');
      return;
    }

    setAutoSaveStatus('saving');

    if (debounceTimeoutRef.current) {
      clearTimeout(debounceTimeoutRef.current);
    }

    debounceTimeoutRef.current = setTimeout(async () => {
      try {
        await saveReportToFirestore(report, currentUser, 'default_school_report');
        setAutoSaveStatus('saved');
        setHasUnsavedChanges(false);
        const timeStr = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
        setLastAutoSavedTime(timeStr);
      } catch (err) {
        console.error('Firestore Auto-save error:', err);
        setAutoSaveStatus('error');
      }
    }, 1500);

    return () => {
      if (debounceTimeoutRef.current) {
        clearTimeout(debounceTimeoutRef.current);
      }
    };
  }, [report, currentUser]);

  // Google Sign-In with popup
  const handleSignIn = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (result.user) {
        showToast(`ស្វាគមន៍! ចូលប្រើជា ${result.user.displayName || result.user.email}`);
      }
    } catch (error: any) {
      console.error('Sign-in error:', error);
      showToast('ការចូលគណនីត្រូវបានបោះបង់ ឬមិនបានសម្រេច');
    }
  };

  // Sign Out
  const handleSignOut = async () => {
    try {
      await signOut(auth);
      setCurrentUser(null);
      setAutoSaveStatus('offline');
      showToast('បានចាកចេញពីគណនី');
    } catch (error) {
      console.error('Sign-out error:', error);
    }
  };

  // Manual Save (local + cloud)
  const handleSave = async () => {
    try {
      localStorage.setItem('moeys_school_report_data', JSON.stringify(report));
      if (currentUser) {
        setAutoSaveStatus('saving');
        await saveReportToFirestore(report, currentUser, 'default_school_report');
        setAutoSaveStatus('saved');
        const timeStr = new Date().toLocaleTimeString('km-KH', { hour: '2-digit', minute: '2-digit' });
        setLastAutoSavedTime(timeStr);
      }
      setHasUnsavedChanges(false);
      showToast('ទិន្នន័យត្រូវបានរក្សាទុកដោយជោគជ័យ!');
    } catch (e) {
      console.error(e);
      showToast('បរាជ័យក្នុងការរក្សាទុកទិន្នន័យ');
    }
  };

  // Reset to initial sample
  const handleReset = () => {
    if (window.confirm('តើអ្នកពិតជាចង់កំណត់ទិន្នន័យត្រឡប់ទៅទម្រង់ដើមវិញមែនទេ?')) {
      setReport(initialSchoolReport);
      localStorage.removeItem('moeys_school_report_data');
      setHasUnsavedChanges(false);
      showToast('បានកំណត់ទិន្នន័យគំរូដើមឡើងវិញរួចរាល់');
    }
  };

  // Export JSON file
  const handleExport = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(report, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `school_report_${report.info.academicYear.replace('/', '_')}.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showToast('បានទាញយកឯកសារ JSON រួចរាល់');
  };

  // Print
  const handlePrint = () => {
    if (activeTab !== 'print') {
      setActiveTab('print');
      setTimeout(() => {
        window.print();
      }, 300);
    } else {
      window.print();
    }
  };

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 3500);
  };

  const handleReportChange = (updated: FullSchoolReport) => {
    setReport(updated);
    setHasUnsavedChanges(true);
  };

  const handleSubmissionSuccess = (submission: FirestoreReportSubmission) => {
    setSubmissionCount(prev => prev + 1);
    showToast(`ឯកសារលេខ ${submission.id} ត្រូវបានបញ្ជូនទៅ ${submission.recipientOffice} ដោយជោគជ័យ!`);
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900 font-sans antialiased flex flex-col">
      <Header
        report={report}
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        onSave={handleSave}
        onReset={handleReset}
        onPrint={handlePrint}
        onExport={handleExport}
        hasUnsavedChanges={hasUnsavedChanges}
        user={currentUser}
        onSignIn={handleSignIn}
        onSignOut={handleSignOut}
        onOpenSubmissionModal={() => setIsSubmissionModalOpen(true)}
        autoSaveStatus={autoSaveStatus}
        lastAutoSavedTime={lastAutoSavedTime}
        submissionCount={submissionCount}
      />

      <main className="flex-1">
        {activeTab === 'editor' && (
          <ReportEditor
            report={report}
            onChange={handleReportChange}
          />
        )}

        {activeTab === 'print' && (
          <OfficialPrintableReport
            report={report}
            onBackToEditor={() => setActiveTab('editor')}
          />
        )}

        {activeTab === 'analytics' && (
          <AnalyticsDashboard
            report={report}
          />
        )}

        {activeTab === 'ai' && (
          <AiAssistantCenter
            report={report}
          />
        )}

        {activeTab === 'calendar' && (
          <KhmerCalendarView
            schoolName={report.info.schoolName}
          />
        )}
      </main>

      {/* Document Submission Modal (បញ្ជូនឯកសារ) */}
      <DocumentSubmissionModal
        isOpen={isSubmissionModalOpen}
        onClose={() => setIsSubmissionModalOpen(false)}
        report={report}
        user={currentUser}
        onSignIn={handleSignIn}
        onSubmissionSuccess={handleSubmissionSuccess}
      />

      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 bg-slate-900 text-white text-xs font-medium px-4 py-2.5 rounded-lg shadow-lg border border-slate-700 animate-in fade-in slide-in-from-bottom-2 flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
          <span>{toastMessage}</span>
        </div>
      )}
    </div>
  );
}

export default App;
