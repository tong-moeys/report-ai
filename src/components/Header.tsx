import React, { useState } from 'react';
import { SchoolMeta, MainAppSection, AppUser, UserRole } from '../types';
import { UserProfileMenu } from './UserProfileMenu';
import {
  Printer,
  Download,
  RefreshCw,
  Sparkles,
  Building2,
  Eye,
  EyeOff,
  MoreHorizontal,
  FileCheck2,
  BookOpen,
  Database,
} from 'lucide-react';

interface HeaderProps {
  meta: SchoolMeta;
  onUpdateMeta: (meta: SchoolMeta) => void;
  onReset: () => void;
  onSyncFromTable1: () => void;
  onExportExcel: () => void;
  showFormulas: boolean;
  onToggleFormulas: () => void;
  mainSection: MainAppSection;
  setMainSection: (section: MainAppSection) => void;
  activeTab: 'all' | 't1' | 't1_staff' | 't2' | 't3' | 't4' | 'failed_students';
  setActiveTab: (tab: 'all' | 't1' | 't1_staff' | 't2' | 't3' | 't4' | 'failed_students') => void;
  currentUser: AppUser | null;
  onOpenAuthModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenFirestoreModal: () => void;
  onQuickSave: () => void;
  isSaving: boolean;
  historyCount: number;
  lastSavedTime: string | null;
  onChangeRole: (newRole: UserRole) => void;
}

export const Header: React.FC<HeaderProps> = ({
  meta,
  onUpdateMeta,
  onReset,
  onSyncFromTable1,
  onExportExcel,
  showFormulas,
  onToggleFormulas,
  mainSection,
  setMainSection,
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuthModal,
  onOpenHistoryModal,
  onOpenFirestoreModal,
  onQuickSave,
  isSaving,
  historyCount,
  lastSavedTime,
  onChangeRole,
}) => {
  const [isEditingMeta, setIsEditingMeta] = useState(false);
  const [showMoreTools, setShowMoreTools] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-2xs">
      {/* Official Cambodia Kingdom Header */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 pt-3 pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-2 sm:gap-4 border-b border-slate-100 pb-2">
          {/* Left: Ministry & School */}
          <div className="text-center sm:text-left">
            <div className="text-[11px] font-semibold tracking-wider text-slate-500 uppercase">
              ក្រសួងអប់រំ យុវជន និងកីឡា
            </div>
            <div className="flex items-center justify-center sm:justify-start gap-1.5 mt-0.5">
              <h1 className="text-lg sm:text-xl font-bold text-slate-900 flex items-center gap-1.5">
                <span className="text-blue-700 text-base">🏫</span>
                <span>{meta.schoolName || 'បឋមសិក្សា'}</span>
              </h1>
              <button
                id="edit-school-info-btn"
                onClick={() => setIsEditingMeta(!isEditingMeta)}
                className="no-print text-[11px] px-2 py-0.5 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors border border-blue-200 cursor-pointer"
                title="កែសម្រួលព័ត៌មានសាលា"
              >
                {isEditingMeta ? 'បិទកែ' : 'កែព័ត៌មាន'}
              </button>
            </div>
            <p className="text-[11px] text-slate-500">
              ឆ្នាំសិក្សា {meta.academicYear} | {meta.clusterOrDistrict} | {meta.province}
            </p>
          </div>

          {/* Right: National Emblem & User Profile Menu */}
          <div className="flex items-center gap-3 sm:gap-4">
            <div className="text-center hidden sm:block">
              <div className="font-moul text-xs sm:text-sm text-slate-800">
                ព្រះរាជាណាចក្រកម្ពុជា
              </div>
              <div className="font-moul text-[11px] text-amber-700 tracking-wide mt-0.5">
                ជាតិ សាសនា ព្រះមហាក្សត្រ
              </div>
              <div className="text-[10px] text-slate-400 italic">
                ~~~ ✤ ~~~
              </div>
            </div>

            {/* Authentication & History Menu */}
            <div className="no-print sm:pl-3 sm:border-l sm:border-slate-200">
              <UserProfileMenu
                currentUser={currentUser}
                onOpenAuthModal={onOpenAuthModal}
                onOpenHistoryModal={onOpenHistoryModal}
                onOpenFirestoreModal={onOpenFirestoreModal}
                onQuickSave={onQuickSave}
                isSaving={isSaving}
                historyCount={historyCount}
                lastSavedTime={lastSavedTime}
                onChangeRole={onChangeRole}
              />
            </div>
          </div>
        </div>

        {/* Primary Navigation - Compact Sleek Bar */}
        <div className="no-print pt-2 pb-1 border-b border-slate-100">
          <nav aria-label="ផ្នែកនៃរបាយការណ៍" className="flex items-center gap-1 overflow-x-auto py-1 scrollbar-none text-xs">
            {/* 1. Part A */}
            <button
              id="nav-part-a"
              onClick={() => setMainSection('part_a')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                mainSection === 'part_a'
                  ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                mainSection === 'part_a' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                A
              </span>
              <span>ផ្នែក A</span>
            </button>

            {/* 2. Part B */}
            <button
              id="nav-part-b"
              onClick={() => setMainSection('part_b')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                mainSection === 'part_b'
                  ? 'bg-teal-50 text-teal-800 border-teal-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                mainSection === 'part_b' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                B
              </span>
              <span>ផ្នែក B</span>
            </button>

            {/* 2.5 Detailed Student Academic Results (User's requested dataset & import) */}
            <button
              id="nav-detailed-results"
              onClick={() => setMainSection('detailed_results')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                mainSection === 'detailed_results'
                  ? 'bg-amber-50 text-amber-900 border-amber-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                mainSection === 'detailed_results' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                ល
              </span>
              <span>លទ្ធផលលម្អិត</span>
            </button>

            {/* 3. Staff Nominal Roll */}
            <button
              id="nav-staff-nominal"
              onClick={() => setMainSection('staff_nominal')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                mainSection === 'staff_nominal'
                  ? 'bg-blue-50 text-blue-800 border-blue-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                mainSection === 'staff_nominal' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                បុ
              </span>
              <span>បុគ្គលិក</span>
            </button>

            {/* 4. Class Rankings */}
            <button
              id="nav-class-rankings"
              onClick={() => setMainSection('class_rankings')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                mainSection === 'class_rankings'
                  ? 'bg-emerald-50 text-emerald-800 border-emerald-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                mainSection === 'class_rankings' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                ថ្នាក់
              </span>
              <span>ចំណាត់ថ្នាក់</span>
            </button>

            {/* 5. Master Report */}
            <button
              id="nav-master-report"
              onClick={() => setMainSection('master_report')}
              className={`flex items-center gap-1.5 px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                mainSection === 'master_report'
                  ? 'bg-indigo-50 text-indigo-800 border-indigo-300 font-bold shadow-2xs'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <span className={`w-4 h-4 rounded text-[10px] flex items-center justify-center font-bold ${
                mainSection === 'master_report' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
              }`}>
                បូក
              </span>
              <span>បូកសរុប</span>
            </button>

            {/* 6. Full Booklet */}
            <button
              id="nav-full-booklet"
              onClick={() => setMainSection('full_booklet')}
              className={`flex items-center gap-1 px-2 py-1 rounded-lg border font-medium whitespace-nowrap transition-all cursor-pointer ${
                mainSection === 'full_booklet'
                  ? 'bg-amber-50 text-amber-900 border-amber-400 font-bold ring-1 ring-amber-400/30'
                  : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-50'
              }`}
            >
              <BookOpen className={`w-3.5 h-3.5 ${mainSection === 'full_booklet' ? 'text-amber-700' : 'text-slate-500'}`} />
              <span className="font-bold">សៀវភៅ ២៤ទ.</span>
            </button>
          </nav>
        </div>

        {/* School Metadata Edit Drawer (Collapsible) */}
        {isEditingMeta && (
          <div className="no-print my-2 p-3 bg-blue-50/70 border border-blue-200 rounded-xl">
            <div className="flex items-center justify-between mb-2">
              <h3 className="text-xs font-bold text-blue-900 flex items-center gap-1.5">
                <Building2 className="w-3.5 h-3.5 text-blue-600" />
                ព័ត៌មានទូទៅរបស់សាលា និងរបាយការណ៍
              </h3>
              <button
                onClick={() => setIsEditingMeta(false)}
                className="text-[11px] text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                រួចរាល់ ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-0.5 text-[11px]">ឈ្មោះសាលា</label>
                <input
                  id="input-school-name"
                  type="text"
                  value={meta.schoolName}
                  onChange={(e) => onUpdateMeta({ ...meta, schoolName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs outline-hidden"
                  placeholder="ឧ. បស.រោគ"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5 text-[11px]">ឈ្មោះនាយកសាលា</label>
                <input
                  id="input-director"
                  type="text"
                  value={meta.directorName}
                  onChange={(e) => onUpdateMeta({ ...meta, directorName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5 text-[11px]">អ្នករៀបចំរបាយការណ៍</label>
                <input
                  id="input-reporter"
                  type="text"
                  value={meta.preparedByName}
                  onChange={(e) => onUpdateMeta({ ...meta, preparedByName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-0.5 text-[11px]">កាលបរិច្ឆេទរបាយការណ៍</label>
                <input
                  id="input-report-date"
                  type="date"
                  value={meta.reportDate}
                  onChange={(e) => onUpdateMeta({ ...meta, reportDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Compact Action Toolbar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-2 pt-2 pb-1 text-xs">
          {/* Sub-Tabs for Part A OR Context label */}
          {mainSection === 'part_a' ? (
            <div className="flex items-center gap-1 overflow-x-auto py-0.5 text-[11px]">
              <button
                id="tab-view-all"
                onClick={() => setActiveTab('all')}
                className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ទាំងអស់
              </button>
              <button
                id="tab-view-t1"
                onClick={() => setActiveTab('t1')}
                className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't1'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ១. សិស្ស
              </button>
              <button
                id="tab-view-t1-staff"
                onClick={() => setActiveTab('t1_staff')}
                className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't1_staff'
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ១-ត. បុគ្គលិក
              </button>
              <button
                id="tab-view-t2"
                onClick={() => setActiveTab('t2')}
                className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't2'
                    ? 'bg-emerald-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ២. លទ្ធផល
              </button>
              <button
                id="tab-view-t3"
                onClick={() => setActiveTab('t3')}
                className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't3'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ៣. ធ្លាក់
              </button>
              <button
                id="tab-view-t4"
                onClick={() => setActiveTab('t4')}
                className={`px-2 py-1 rounded-md font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't4'
                    ? 'bg-indigo-600 text-white shadow-2xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ៤. ចុងឆ្នាំ
              </button>
              <button
                id="tab-view-failed-students"
                onClick={() => setActiveTab('failed_students')}
                className={`px-2 py-1 rounded-md font-semibold whitespace-nowrap transition-colors cursor-pointer flex items-center gap-1 ${
                  activeTab === 'failed_students'
                    ? 'bg-rose-700 text-white shadow-2xs'
                    : 'bg-rose-50 text-rose-800 border border-rose-200 hover:bg-rose-100'
                }`}
              >
                <span>បញ្ជីសិស្សធ្លាក់ (០-៤.៩៩)</span>
              </button>
            </div>
          ) : mainSection === 'part_b' ? (
            <div className="flex items-center gap-1.5 text-xs text-teal-800 font-medium py-0.5">
              <span className="flex items-center gap-1 bg-teal-50 px-2 py-1 rounded-md border border-teal-200 text-[11px]">
                <Sparkles className="w-3 h-3 text-teal-600" />
                ស្ថិតិឯកទេស និងសង្គម ៖ បុគ្គលិក បណ្ណាល័យ ទឹកស្អាត-អនាម័យ ព្រូន ក្រីក្រ ពិការ និងថវិកា (PB)
              </span>
            </div>
          ) : mainSection === 'full_booklet' ? (
            <div className="flex items-center gap-1.5 text-xs text-amber-900 font-medium py-0.5">
              <span className="flex items-center gap-1 bg-amber-50 px-2.5 py-1 rounded-md border border-amber-200 text-[11px] font-semibold">
                <BookOpen className="w-3 h-3 text-amber-700" />
                សៀវភៅរបាយការណ៍ផ្លូវការ ២៤ ទំព័រពេញលេញ
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-1.5 text-xs text-indigo-800 font-medium py-0.5">
              <span className="flex items-center gap-1 bg-indigo-50 px-2 py-1 rounded-md border border-indigo-200 text-[11px]">
                <FileCheck2 className="w-3 h-3 text-indigo-600" />
                របាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំ និងស្ថិតិសាលារៀនផ្លូវការ (ផ្នែក I ដល់ VII)
              </span>
            </div>
          )}

          {/* Compact Primary Actions */}
          <div className="flex items-center gap-1 sm:gap-1.5 ml-auto">
            {/* Direct Firestore Button */}
            <button
              id="btn-header-firestore"
              onClick={onOpenFirestoreModal}
              className="flex items-center gap-1 px-2 py-1 bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-md text-[11px] font-bold shadow-2xs transition-colors cursor-pointer"
              title="ពិនិត្យទីតាំងទិន្នន័យលើ Cloud Firestore Database"
            >
              <Database className="w-3 h-3 text-amber-700" />
              <span className="font-mono">Firestore</span>
            </button>

            {/* Full Booklet Button if not currently on full_booklet */}
            {mainSection !== 'full_booklet' && (
              <button
                id="btn-goto-booklet-pdf"
                onClick={() => setMainSection('full_booklet')}
                className="flex items-center gap-1 px-2 py-1 bg-amber-100 hover:bg-amber-200 text-amber-900 border border-amber-300 rounded-md text-[11px] font-bold transition-colors cursor-pointer"
                title="បើកមើលសៀវភៅ និងទាញយកជា PDF ២៤ទំព័រ"
              >
                <BookOpen className="w-3 h-3 text-amber-700" />
                <span>សៀវភៅ ២៤ទ.</span>
              </button>
            )}

            {/* Export Excel */}
            <button
              id="btn-export-excel"
              onClick={onExportExcel}
              className="flex items-center gap-1 px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded-md text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer"
              title="ទាញយកជា Excel (.xlsx)"
            >
              <Download className="w-3 h-3" />
              <span>Excel</span>
            </button>

            {/* Print / Save as PDF */}
            <button
              id="btn-print-report"
              onClick={handlePrint}
              className="flex items-center gap-1 px-2 py-1 bg-slate-800 hover:bg-slate-900 text-white rounded-md text-[11px] font-semibold shadow-2xs transition-colors cursor-pointer"
              title="បោះពុម្ព ឬរក្សាទុកជា PDF"
            >
              <Printer className="w-3 h-3" />
              <span>បោះពុម្ព</span>
            </button>

            {/* Hidden / Secondary Tools Menu */}
            <div className="relative">
              <button
                id="btn-toggle-more-tools"
                onClick={() => setShowMoreTools(!showMoreTools)}
                className="p-1 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors border border-slate-200 cursor-pointer"
                title="ឧបករណ៍បន្ថែម (រូបមន្ត, ទាញទិន្នន័យ, កំណត់ដើម)"
              >
                <MoreHorizontal className="w-3.5 h-3.5" />
              </button>

              {showMoreTools && (
                <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-lg shadow-lg p-1.5 z-50 text-[11px] space-y-1">
                  {mainSection === 'part_a' && (
                    <button
                      onClick={() => {
                        onToggleFormulas();
                        setShowMoreTools(false);
                      }}
                      className="w-full flex items-center justify-between px-2 py-1 text-left rounded hover:bg-slate-50 text-slate-700"
                    >
                      <span className="flex items-center gap-1.5">
                        {showFormulas ? <Eye className="w-3 h-3 text-purple-600" /> : <EyeOff className="w-3 h-3 text-slate-400" />}
                        <span>រូបមន្តគណនា</span>
                      </span>
                      <span className={`text-[10px] font-semibold px-1 rounded ${showFormulas ? 'bg-purple-100 text-purple-800' : 'bg-slate-100 text-slate-600'}`}>
                        {showFormulas ? 'បើក' : 'បិទ'}
                      </span>
                    </button>
                  )}

                  <button
                    onClick={() => {
                      onSyncFromTable1();
                      setShowMoreTools(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1 text-left rounded hover:bg-blue-50 text-blue-700"
                  >
                    <Sparkles className="w-3 h-3 text-blue-600" />
                    <span>ទាញទិន្នន័យពីតារាង១</span>
                  </button>

                  <div className="border-t border-slate-100 my-1" />

                  <button
                    onClick={() => {
                      onReset();
                      setShowMoreTools(false);
                    }}
                    className="w-full flex items-center gap-1.5 px-2 py-1 text-left rounded hover:bg-rose-50 text-rose-700"
                  >
                    <RefreshCw className="w-3 h-3 text-rose-600" />
                    <span>កំណត់ទិន្នន័យដើម</span>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};
