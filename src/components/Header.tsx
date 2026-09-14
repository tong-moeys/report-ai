import React from 'react';
import { 
  FileText, 
  Printer, 
  Sparkles, 
  BarChart3, 
  Edit3, 
  Save, 
  RotateCcw, 
  Download, 
  School,
  CheckCircle2,
  Calendar,
  Send,
  Cloud,
  LogIn,
  LogOut,
  User as UserIcon,
  Loader2
} from 'lucide-react';
import { User } from 'firebase/auth';
import { FullSchoolReport } from '../types';

interface HeaderProps {
  report: FullSchoolReport;
  activeTab: 'editor' | 'print' | 'analytics' | 'ai' | 'calendar';
  setActiveTab: (tab: 'editor' | 'print' | 'analytics' | 'ai' | 'calendar') => void;
  onSave: () => void;
  onReset: () => void;
  onPrint: () => void;
  onExport: () => void;
  hasUnsavedChanges: boolean;
  user: User | null;
  onSignIn: () => void;
  onSignOut: () => void;
  onOpenSubmissionModal: () => void;
  autoSaveStatus: 'idle' | 'saving' | 'saved' | 'error' | 'offline';
  lastAutoSavedTime: string | null;
  submissionCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  report,
  activeTab,
  setActiveTab,
  onSave,
  onReset,
  onPrint,
  onExport,
  hasUnsavedChanges,
  user,
  onSignIn,
  onSignOut,
  onOpenSubmissionModal,
  autoSaveStatus,
  lastAutoSavedTime,
  submissionCount,
}) => {
  return (
    <header className="no-print bg-white border-b border-slate-200 sticky top-0 z-40 shadow-xs">
      {/* Top Banner with Cambodian Emblem Style and School Meta */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="py-2.5 border-b border-slate-100 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 shrink-0 shadow-xs">
              <School className="w-5 h-5" />
            </div>
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="font-moul text-sm text-amber-900 tracking-wide">
                  {report.info.schoolName}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-slate-100 text-slate-700 border border-slate-200">
                  {report.info.cluster}
                </span>
                <span className="px-2 py-0.5 rounded text-xs font-medium bg-emerald-50 text-emerald-700 border border-emerald-200">
                  ឆ្នាំសិក្សា {report.info.academicYear}
                </span>
              </div>
              <p className="text-[11px] text-slate-500 mt-0.5">
                {report.info.districtOffice} • ប្រព័ន្ធគ្រប់គ្រង និងរៀបចំរបាយការណ៍បឋមសិក្សា MoEYS
              </p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-2 self-end md:self-center">
            {/* Auto-save & Cloud Status Indicator */}
            {autoSaveStatus === 'saving' ? (
              <span className="inline-flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 border border-sky-200 px-2.5 py-1 rounded-lg">
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
                <span>រក្សាទុកក្នុង Firestore...</span>
              </span>
            ) : user ? (
              <span
                className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-2.5 py-1 rounded-lg"
                title={lastAutoSavedTime ? `រក្សាទុកចុងក្រោយ៖ ${lastAutoSavedTime}` : 'រក្សាទុកដោយស្វ័យប្រវត្តិក្នុ​ង Cloud Firestore'}
              >
                <Cloud className="w-3.5 h-3.5 text-emerald-600" />
                <span className="font-medium">Cloud ស្វ័យប្រវត្តិ</span>
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-xs text-slate-600 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-lg">
                <Save className="w-3.5 h-3.5 text-slate-500" />
                <span>រក្សាទុកក្នុងម៉ាស៊ីន</span>
              </span>
            )}

            {/* Document Submission Button (បញ្ជូនឯកសារ) */}
            <button
              onClick={onOpenSubmissionModal}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold rounded-lg bg-sky-600 hover:bg-sky-700 text-white transition-all shadow-xs"
              title="បញ្ជូនឯកសាររបាយការណ៍ទៅកម្រង ឬការិយាល័យអប់រំស្រុក"
            >
              <Send className="w-3.5 h-3.5" />
              <span>បញ្ជូនឯកសារ</span>
              {submissionCount > 0 && (
                <span className="px-1.5 py-0.2 text-[10px] bg-white text-sky-800 rounded-full font-extrabold">
                  {submissionCount}
                </span>
              )}
            </button>

            {/* Print button */}
            <button
              onClick={onPrint}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-900 hover:bg-slate-800 text-white transition-colors shadow-xs"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </button>

            {/* Export JSON */}
            <button
              onClick={onExport}
              className="inline-flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-medium rounded-lg bg-white hover:bg-slate-50 text-slate-700 border border-slate-200 transition-colors"
              title="ទាញយកឯកសារ JSON"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">ទាញយក</span>
            </button>

            {/* Firebase Auth Controls */}
            {user ? (
              <div className="flex items-center gap-1.5 pl-1 border-l border-slate-200">
                <div
                  className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 py-1 px-2 rounded-lg text-xs"
                  title={`ចូលប្រើជា៖ ${user.displayName || user.email}`}
                >
                  {user.photoURL ? (
                    <img
                      src={user.photoURL}
                      alt={user.displayName || 'User'}
                      referrerPolicy="no-referrer"
                      className="w-5 h-5 rounded-full object-cover border border-slate-300"
                    />
                  ) : (
                    <UserIcon className="w-4 h-4 text-slate-600" />
                  )}
                  <span className="text-[11px] font-medium text-slate-800 max-w-[90px] truncate">
                    {user.displayName?.split(' ')[0] || user.email?.split('@')[0]}
                  </span>
                </div>
                <button
                  onClick={onSignOut}
                  className="p-1.5 text-slate-500 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                  title="ចាកចេញពីគណនី (Sign out)"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onSignIn}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-amber-500 hover:bg-amber-600 text-slate-950 transition-colors shadow-xs"
                title="ភ្ជាប់ជាមួយ Firebase Authentication"
              >
                <LogIn className="w-3.5 h-3.5" />
                <span>ចូលគណនី Google</span>
              </button>
            )}

            {/* Reset */}
            <button
              onClick={onReset}
              className="inline-flex items-center gap-1 p-1.5 text-xs font-medium rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 transition-colors"
              title="កំណត់ទិន្នន័យគំរូឡើងវិញ"
            >
              <RotateCcw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex overflow-x-auto space-x-1 py-1.5 scrollbar-none">
          <button
            onClick={() => setActiveTab('editor')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-all shrink-0 ${
              activeTab === 'editor'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Edit3 className="w-4 h-4" />
            <span>កែសម្រួលរបាយការណ៍</span>
          </button>

          <button
            onClick={() => setActiveTab('print')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-all shrink-0 ${
              activeTab === 'print'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>ទម្រង់បោះពុម្ពផ្លូវការ (MoEYS Form)</span>
          </button>

          <button
            onClick={() => setActiveTab('calendar')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-all shrink-0 ${
              activeTab === 'calendar'
                ? 'bg-amber-700 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <Calendar className="w-4 h-4 text-amber-500" />
            <span>ប្រតិទិនខ្មែរ & ថ្ងៃឈប់សម្រាក</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-all shrink-0 ${
              activeTab === 'analytics'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <BarChart3 className="w-4 h-4" />
            <span>ផ្ទាំងវិភាគទិន្នន័យ (Analytics)</span>
          </button>

          <button
            onClick={() => setActiveTab('ai')}
            className={`inline-flex items-center gap-2 px-3.5 py-2 text-sm font-medium rounded-md transition-all shrink-0 ${
              activeTab === 'ai'
                ? 'bg-amber-600 text-white shadow-xs'
                : 'text-amber-800 hover:text-amber-900 hover:bg-amber-50 font-semibold'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>ជំនួយការ AI សាលារៀន</span>
            <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-100 text-amber-900 font-bold border border-amber-300">
              AI
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
