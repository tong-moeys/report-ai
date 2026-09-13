import React, { useState } from 'react';
import { Printer, Download, ToggleLeft, ToggleRight, ArrowLeft, FileText, Table, CheckSquare, Layers } from 'lucide-react';
import { FullSchoolReport } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import { PrintableMasterReport } from './PrintableMasterReport';
import { PrintablePartA } from './PrintablePartA';
import { PrintablePartB } from './PrintablePartB';
import { exportReportAsHtml } from '../utils/exportDocument';

export type ReportPrintSection = 'master' | 'partA' | 'partB' | 'all';

interface OfficialPrintableReportProps {
  report: FullSchoolReport;
  onBackToEditor?: () => void;
  defaultSection?: ReportPrintSection;
}

export const OfficialPrintableReport: React.FC<OfficialPrintableReportProps> = ({
  report,
  onBackToEditor,
  defaultSection = 'master',
}) => {
  const [activeSection, setActiveSection] = useState<ReportPrintSection>(defaultSection);
  const [useKhmerNumerals, setUseKhmerNumerals] = useState<boolean>(false);
  const [isDownloadMenuOpen, setIsDownloadMenuOpen] = useState<boolean>(false);

  const num = (val: number | string | undefined | null) => {
    if (val === undefined || val === null) return '';
    return useKhmerNumerals ? toKhmerNum(val) : String(val);
  };

  const handlePrint = () => {
    window.print();
  };

  const handleDownload = (sectionToDownload: ReportPrintSection) => {
    setIsDownloadMenuOpen(false);
    const schoolName = report.info.schoolName || 'សាលារៀន';
    const cleanSchoolName = schoolName.replace(/\s+/g, '_');

    if (sectionToDownload === 'master') {
      exportReportAsHtml(
        'printable-master-report',
        `របាយការណ៍បូកសរុបលម្អិត_${cleanSchoolName}`,
        `របាយការណ៍បូកសរុបលទ្ធផលការងារដំណាច់ឆ្នាំ - ${schoolName}`
      );
    } else if (sectionToDownload === 'partA') {
      exportReportAsHtml(
        'printable-part-a',
        `តារាងស្ថិតិ_ផ្នែកA_${cleanSchoolName}`,
        `តារាងស្ថិតិសាលារៀន ផ្នែក A - ${schoolName}`
      );
    } else if (sectionToDownload === 'partB') {
      exportReportAsHtml(
        'printable-part-b',
        `តារាងស្ថិតិ_ផ្នែកB_${cleanSchoolName}`,
        `តារាងស្ថិតិសាលារៀន ផ្នែក B - ${schoolName}`
      );
    } else {
      exportReportAsHtml(
        'printable-all-package',
        `កញ្ចប់របាយការណ៍ទាំង៣_${cleanSchoolName}`,
        `កញ្ចប់របាយការណ៍ចុងឆ្នាំពេញលេញ (Master + A + B) - ${schoolName}`
      );
    }
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-2 sm:px-4">
      {/* Control Bar (Hidden during print) */}
      <div className="no-print max-w-5xl mx-auto mb-6 bg-white p-3.5 rounded-xl border border-slate-200 shadow-sm flex flex-col gap-3">
        {/* Top row: Back button, title, and primary actions */}
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            {onBackToEditor && (
              <button
                onClick={onBackToEditor}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-slate-700 hover:text-slate-900 bg-slate-100 hover:bg-slate-200 border border-slate-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
              >
                <ArrowLeft className="w-3.5 h-3.5" />
                ត្រឡប់ទៅកែប្រែទិន្នន័យ
              </button>
            )}
            <div>
              <span className="text-xs font-bold text-slate-900 block">
                មជ្ឈមណ្ឌលបោះពុម្ព & ទាញយករបាយការណ៍ (MoEYS Standard A4)
              </span>
              <span className="text-[11px] text-slate-500">
                ក្បាលរបាយការណ៍ផ្លូវការដូចគ្នានៅគ្រប់ផ្នែកទាំង ៣
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {/* Toggle Khmer Numerals */}
            <button
              onClick={() => setUseKhmerNumerals(!useKhmerNumerals)}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-lg bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors cursor-pointer"
            >
              {useKhmerNumerals ? (
                <ToggleRight className="w-4 h-4 text-emerald-600" />
              ) : (
                <ToggleLeft className="w-4 h-4 text-slate-400" />
              )}
              <span>លេខខ្មែរ (១ ២ ៣)៖ {useKhmerNumerals ? 'បើក' : 'បិទ'}</span>
            </button>

            {/* Download Dropdown / Button */}
            <div className="relative">
              <button
                onClick={() => setIsDownloadMenuOpen(!isDownloadMenuOpen)}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-colors cursor-pointer"
              >
                <Download className="w-3.5 h-3.5" />
                <span>ទាញយក (Download)</span>
              </button>

              {isDownloadMenuOpen && (
                <div className="absolute right-0 mt-1 w-64 bg-white rounded-lg shadow-xl border border-slate-200 py-1.5 z-50 animate-in fade-in">
                  <div className="px-3 py-1 text-[11px] font-semibold text-slate-400 border-b border-slate-100">
                    ជ្រើសរើសផ្នែកដែលត្រូវទាញយក (Word / HTML)
                  </div>
                  <button
                    onClick={() => handleDownload('partA')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Table className="w-3.5 h-3.5 text-blue-600" />
                    <span>ទាញយក <b>ផ្នែក A</b> (តារាង ១-៤)</span>
                  </button>
                  <button
                    onClick={() => handleDownload('partB')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Table className="w-3.5 h-3.5 text-indigo-600" />
                    <span>ទាញយក <b>ផ្នែក B</b> (តារាង ៥-១៥)</span>
                  </button>
                  <button
                    onClick={() => handleDownload('master')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-700 hover:bg-slate-50 flex items-center gap-2 cursor-pointer"
                  >
                    <FileText className="w-3.5 h-3.5 text-amber-600" />
                    <span>ទាញយក <b>របាយការណ៍លម្អិតផ្លូវការ</b></span>
                  </button>
                  <div className="border-t border-slate-100 my-1"></div>
                  <button
                    onClick={() => handleDownload('all')}
                    className="w-full text-left px-3 py-2 text-xs text-slate-900 font-semibold hover:bg-emerald-50 flex items-center gap-2 cursor-pointer"
                  >
                    <Layers className="w-3.5 h-3.5 text-emerald-600" />
                    <span>ទាញយក <b>កញ្ចប់ទាំង ៣ រួមគ្នា</b></span>
                  </button>
                </div>
              )}
            </div>

            {/* Print Button */}
            <button
              onClick={handlePrint}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold rounded-lg bg-slate-900 hover:bg-slate-800 text-white shadow-sm transition-colors cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              បោះពុម្ព (Print)
            </button>
          </div>
        </div>

        {/* Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-1.5 border-t border-slate-100 pt-2.5">
          <span className="text-[11px] font-semibold text-slate-500 mr-1">មើលផ្នែក៖</span>

          <button
            onClick={() => setActiveSection('master')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer ${
              activeSection === 'master'
                ? 'bg-amber-100 text-amber-900 border border-amber-300 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-amber-700" />
            <span>១. របាយការណ៍លម្អិតផ្លូវការ (Master)</span>
          </button>

          <button
            onClick={() => setActiveSection('partA')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer ${
              activeSection === 'partA'
                ? 'bg-blue-100 text-blue-900 border border-blue-300 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-blue-700" />
            <span>២. តារាងស្ថិតិ ផ្នែក A (តារាង ១-៤)</span>
          </button>

          <button
            onClick={() => setActiveSection('partB')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer ${
              activeSection === 'partB'
                ? 'bg-indigo-100 text-indigo-900 border border-indigo-300 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Table className="w-3.5 h-3.5 text-indigo-700" />
            <span>៣. តារាងស្ថិតិ ផ្នែក B (តារាង ៥-១៥)</span>
          </button>

          <button
            onClick={() => setActiveSection('all')}
            className={`inline-flex items-center gap-1.5 px-3 py-1.5 text-xs rounded-md font-medium transition-all cursor-pointer ${
              activeSection === 'all'
                ? 'bg-emerald-100 text-emerald-900 border border-emerald-300 shadow-xs'
                : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-emerald-700" />
            <span>៤. កញ្ចប់ទាំង ៣ ពេញលេញ</span>
          </button>
        </div>
      </div>

      {/* Main Printable Canvas Area */}
      <div className="max-w-5xl mx-auto space-y-8">

        {/* 1. MASTER REPORT */}
        {(activeSection === 'master' || activeSection === 'all') && (
          <div
            id="printable-master-report"
            className="bg-white border border-slate-200 shadow-md print:shadow-none print:border-none p-8 sm:p-12 page-break-after-always"
          >
            <PrintableMasterReport
              report={report}
              num={num}
              useKhmerNumerals={useKhmerNumerals}
            />
          </div>
        )}

        {/* 2. PART A */}
        {(activeSection === 'partA' || activeSection === 'all') && (
          <div
            id="printable-part-a"
            className="bg-white border border-slate-200 shadow-md print:shadow-none print:border-none p-8 sm:p-12 page-break-after-always"
          >
            <PrintablePartA
              report={report}
              num={num}
            />
          </div>
        )}

        {/* 3. PART B */}
        {(activeSection === 'partB' || activeSection === 'all') && (
          <div
            id="printable-part-b"
            className="bg-white border border-slate-200 shadow-md print:shadow-none print:border-none p-8 sm:p-12 page-break-after-always"
          >
            <PrintablePartB
              report={report}
              num={num}
            />
          </div>
        )}

        {/* Hidden Container for Combined Full Package Export */}
        <div id="printable-all-package" className="hidden">
          <div className="page-break-after-always">
            <PrintableMasterReport
              report={report}
              num={num}
              useKhmerNumerals={useKhmerNumerals}
            />
          </div>
          <div style={{ pageBreakBefore: 'always', marginTop: '30px' }}>
            <PrintablePartA
              report={report}
              num={num}
            />
          </div>
          <div style={{ pageBreakBefore: 'always', marginTop: '30px' }}>
            <PrintablePartB
              report={report}
              num={num}
            />
          </div>
        </div>

      </div>
    </div>
  );
};
