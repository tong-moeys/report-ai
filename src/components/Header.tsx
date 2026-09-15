import React, { useState } from 'react';
import { SchoolMeta, MainAppSection } from '../types';
import {
  Printer,
  Download,
  RefreshCw,
  Sparkles,
  Building2,
  Eye,
  EyeOff,
  Layers,
  FileCheck2,
  BookOpen,
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
  activeTab: 'all' | 't1' | 't1_staff' | 't2' | 't3' | 't4';
  setActiveTab: (tab: 'all' | 't1' | 't1_staff' | 't2' | 't3' | 't4') => void;
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
}) => {
  const [isEditingMeta, setIsEditingMeta] = useState(false);

  const handlePrint = () => {
    window.print();
  };

  return (
    <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
      {/* Official Cambodia Kingdom Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-4 pb-2">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 border-b border-slate-100 pb-3">
          {/* Left: Ministry & School */}
          <div className="text-center sm:text-left">
            <div className="text-xs font-semibold tracking-wider text-slate-500 uppercase">
              ក្រសួងអប់រំ យុវជន និងកីឡា
            </div>
            <div className="flex items-center gap-2 mt-1">
              <h1 className="text-xl sm:text-2xl font-bold text-slate-900 flex items-center gap-2">
                <span className="text-blue-700">🏫</span>
                <span>{meta.schoolName || 'បឋមសិក្សា'}</span>
              </h1>
              <button
                id="edit-school-info-btn"
                onClick={() => setIsEditingMeta(!isEditingMeta)}
                className="no-print text-xs px-2.5 py-1 text-blue-600 hover:text-blue-800 hover:bg-blue-50 rounded-md transition-colors border border-blue-200 cursor-pointer"
                title="កែសម្រួលព័ត៌មានសាលា"
              >
                {isEditingMeta ? 'បិទកែ' : 'កែព័ត៌មាន'}
              </button>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              ឆ្នាំសិក្សា {meta.academicYear} | {meta.clusterOrDistrict} | {meta.province}
            </p>
          </div>

          {/* Right: National Emblem / Kingdom motto (Official style) */}
          <div className="text-center">
            <div className="font-moul text-sm sm:text-base text-slate-800">
              ព្រះរាជាណាចក្រកម្ពុជា
            </div>
            <div className="font-moul text-xs text-amber-700 tracking-wide mt-0.5">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </div>
            <div className="text-xs text-slate-400 italic">
              ~~~ ✤ ~~~
            </div>
          </div>
        </div>

        {/* Primary App Flow Navigation */}
        <div className="no-print pt-3 pb-2 border-b border-slate-100">
          <nav aria-label="ផ្នែកនៃរបាយការណ៍" className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
            {/* 1. Part A */}
            <button
              id="nav-part-a"
              onClick={() => setMainSection('part_a')}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                mainSection === 'part_a'
                  ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                  mainSection === 'part_a' ? 'bg-blue-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                A
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">ផ្នែក A៖ គ្រឹះ & សិក្សា</div>
                <div className="text-[10px] text-slate-500">៤ តារាងស្តង់ដា</div>
              </div>
            </button>

            {/* 2. Part B */}
            <button
              id="nav-part-b"
              onClick={() => setMainSection('part_b')}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                mainSection === 'part_b'
                  ? 'bg-teal-50/90 border-teal-400 ring-2 ring-teal-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                  mainSection === 'part_b' ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                B
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">ផ្នែក B៖ ឯកទេស & សង្គម</div>
                <div className="text-[10px] text-slate-500">តារាង ៥-១៥</div>
              </div>
            </button>

            {/* 3. Staff Nominal Roll */}
            <button
              id="nav-staff-nominal"
              onClick={() => setMainSection('staff_nominal')}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                mainSection === 'staff_nominal'
                  ? 'bg-blue-50/90 border-blue-400 ring-2 ring-blue-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                  mainSection === 'staff_nominal' ? 'bg-blue-700 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                បុ
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">បញ្ជីបុគ្គលិក</div>
                <div className="text-[10px] text-slate-500">ទំព័រទី ៧ (១៧នាក់)</div>
              </div>
            </button>

            {/* 4. Class Rankings */}
            <button
              id="nav-class-rankings"
              onClick={() => setMainSection('class_rankings')}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                mainSection === 'class_rankings'
                  ? 'bg-emerald-50/90 border-emerald-400 ring-2 ring-emerald-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                  mainSection === 'class_rankings' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                ថ្នាក់
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">ចំណាត់ថ្នាក់តាមថ្នាក់</div>
                <div className="text-[10px] text-slate-500">ទំព័រ ១២-២១ (១០ថ្នាក់)</div>
              </div>
            </button>

            {/* 5. Master Report */}
            <button
              id="nav-master-report"
              onClick={() => setMainSection('master_report')}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                mainSection === 'master_report'
                  ? 'bg-indigo-50/90 border-indigo-400 ring-2 ring-indigo-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                  mainSection === 'master_report' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                បូក
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">របាយការណ៍បូកសរុប</div>
                <div className="text-[10px] text-slate-500">ទំព័រ ១-៦</div>
              </div>
            </button>

            {/* 6. Full Booklet */}
            <button
              id="nav-full-booklet"
              onClick={() => setMainSection('full_booklet')}
              className={`flex items-center gap-2 p-2 rounded-xl border text-left transition-all cursor-pointer ${
                mainSection === 'full_booklet'
                  ? 'bg-amber-50/90 border-amber-400 ring-2 ring-amber-500/20 shadow-xs'
                  : 'bg-white border-slate-200 hover:bg-slate-50'
              }`}
            >
              <div
                className={`w-6 h-6 rounded-md flex items-center justify-center font-bold text-xs shrink-0 ${
                  mainSection === 'full_booklet' ? 'bg-amber-600 text-white' : 'bg-slate-100 text-slate-700'
                }`}
              >
                សៀវ
              </div>
              <div className="min-w-0">
                <div className="text-xs font-bold text-slate-800 truncate">សៀវភៅទាំងមូល</div>
                <div className="text-[10px] text-amber-700 font-semibold">២៤ ទំព័រពេញលេញ</div>
              </div>
            </button>
          </nav>
        </div>

        {/* School Metadata Edit Drawer (Collapsible) */}
        {isEditingMeta && (
          <div className="no-print my-3 p-4 bg-blue-50/70 border border-blue-200 rounded-xl animate-fadeIn">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-bold text-blue-900 flex items-center gap-1.5">
                <Building2 className="w-4 h-4 text-blue-600" />
                ព័ត៌មានទូទៅរបស់សាលា និងរបាយការណ៍
              </h3>
              <button
                onClick={() => setIsEditingMeta(false)}
                className="text-xs text-slate-500 hover:text-slate-800 cursor-pointer"
              >
                រួចរាល់ ✕
              </button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3 text-xs">
              <div>
                <label className="block text-slate-600 font-medium mb-1">ឈ្មោះសាលា</label>
                <input
                  id="input-school-name"
                  type="text"
                  value={meta.schoolName}
                  onChange={(e) => onUpdateMeta({ ...meta, schoolName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="ឧ. បស.រោគ"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">ឆ្នាំសិក្សា</label>
                <input
                  id="input-academic-year"
                  type="text"
                  value={meta.academicYear}
                  onChange={(e) => onUpdateMeta({ ...meta, academicYear: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
                  placeholder="ឧ. ២០២៣ - ២០២៤"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">ស្រុក/ក្រុង/ខណ្ឌ</label>
                <input
                  id="input-district"
                  type="text"
                  value={meta.clusterOrDistrict}
                  onChange={(e) => onUpdateMeta({ ...meta, clusterOrDistrict: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">រាជធានី/ខេត្ត</label>
                <input
                  id="input-province"
                  type="text"
                  value={meta.province}
                  onChange={(e) => onUpdateMeta({ ...meta, province: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">ឈ្មោះនាយកសាលា</label>
                <input
                  id="input-director"
                  type="text"
                  value={meta.directorName}
                  onChange={(e) => onUpdateMeta({ ...meta, directorName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">អ្នករៀបចំរបាយការណ៍</label>
                <input
                  id="input-reporter"
                  type="text"
                  value={meta.preparedByName}
                  onChange={(e) => onUpdateMeta({ ...meta, preparedByName: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
              <div>
                <label className="block text-slate-600 font-medium mb-1">កាលបរិច្ឆេទរបាយការណ៍</label>
                <input
                  id="input-report-date"
                  type="date"
                  value={meta.reportDate}
                  onChange={(e) => onUpdateMeta({ ...meta, reportDate: e.target.value })}
                  className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 focus:ring-2 focus:ring-blue-500 outline-hidden"
                />
              </div>
            </div>
          </div>
        )}

        {/* Interactive Action Toolbar */}
        <div className="no-print flex flex-wrap items-center justify-between gap-3 pt-3 pb-2">
          {/* Sub-Tabs for Part A OR Context label for Part B / Master */}
          {mainSection === 'part_a' ? (
            <div className="flex items-center gap-1 overflow-x-auto py-1 text-xs">
              <button
                id="tab-view-all"
                onClick={() => setActiveTab('all')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 'all'
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ទាំងអស់ (៤ តារាង)
              </button>
              <button
                id="tab-view-t1"
                onClick={() => setActiveTab('t1')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't1'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ១. អគារ បន្ទប់ សិស្ស
              </button>
              <button
                id="tab-view-t1-staff"
                onClick={() => setActiveTab('t1_staff')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't1_staff'
                    ? 'bg-blue-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ១(ត). បុគ្គលិកអប់រំ
              </button>
              <button
                id="tab-view-t2"
                onClick={() => setActiveTab('t2')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't2'
                    ? 'bg-emerald-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ២. លទ្ធផលសិក្សា
              </button>
              <button
                id="tab-view-t3"
                onClick={() => setActiveTab('t3')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't3'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ៣. ស្ថិតិសិស្សធ្លាក់
              </button>
              <button
                id="tab-view-t4"
                onClick={() => setActiveTab('t4')}
                className={`px-3 py-1.5 rounded-lg font-medium whitespace-nowrap transition-colors cursor-pointer ${
                  activeTab === 't4'
                    ? 'bg-indigo-600 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-700 hover:bg-slate-200'
                }`}
              >
                ៤. លទ្ធផលចុងឆ្នាំ
              </button>
            </div>
          ) : mainSection === 'part_b' ? (
            <div className="flex items-center gap-2 text-xs text-teal-800 font-medium py-1">
              <span className="flex items-center gap-1.5 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-200">
                <Sparkles className="w-3.5 h-3.5 text-teal-600" />
                ស្ថិតិឯកទេស និងសង្គម ៖ បុគ្គលិក បណ្ណាល័យ ទឹកស្អាត-អនាម័យ ព្រូន ក្រីក្រ ពិការ និងថវិកា (PB)
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 text-xs text-indigo-800 font-medium py-1">
              <span className="flex items-center gap-1.5 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-200">
                <FileCheck2 className="w-3.5 h-3.5 text-indigo-600" />
                របាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំ និងស្ថិតិសាលារៀនផ្លូវការ (ផ្នែក I ដល់ VII)
              </span>
            </div>
          )}

          {/* Action Tools */}
          <div className="flex items-center gap-2">
            {/* Toggle Formulas Badge (in Part A) */}
            {mainSection === 'part_a' && (
              <button
                id="btn-toggle-formulas"
                onClick={onToggleFormulas}
                className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-medium border transition-colors cursor-pointer ${
                  showFormulas
                    ? 'bg-purple-50 text-purple-700 border-purple-300 hover:bg-purple-100'
                    : 'bg-slate-50 text-slate-600 border-slate-200 hover:bg-slate-100'
                }`}
                title="បង្ហាញ ឬលាក់រូបមន្តគណនា (ឧ. 1=3+7+15)"
              >
                {showFormulas ? <Eye className="w-3.5 h-3.5" /> : <EyeOff className="w-3.5 h-3.5" />}
                <span>{showFormulas ? 'រូបមន្ត: បើក' : 'រូបមន្ត: បិទ'}</span>
              </button>
            )}

            {/* Sync from Table 1 */}
            <button
              id="btn-sync-data"
              onClick={onSyncFromTable1}
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200 rounded-lg text-xs font-medium transition-colors cursor-pointer"
              title="ចម្លងចំនួនសិស្សពីតារាងទី១ ទៅតារាងទី២ ទី៤ និងផ្នែក B ដោយស្វ័យប្រវត្តិ"
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              <span className="hidden sm:inline">ទាញពីតារាង១</span>
            </button>

            {/* Export Excel */}
            <button
              id="btn-export-excel"
              onClick={onExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Excel</span>
            </button>

            {/* Print / PDF */}
            <button
              id="btn-print-report"
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ព</span>
            </button>

            {/* Reset */}
            <button
              id="btn-reset-default"
              onClick={onReset}
              className="p-1.5 text-slate-500 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors border border-slate-200 cursor-pointer"
              title="កំណត់ទិន្នន័យដើមឡើងវិញ"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

