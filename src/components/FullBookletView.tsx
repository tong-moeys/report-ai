import React, { useState, useRef } from 'react';
import {
  SchoolMeta,
  Table1SchoolRooms,
  Table1Staff,
  Table2RowInput,
  Table3RowInput,
  Table4RowInput,
  Table4HeaderConfig,
  LibraryData,
  WaterSanitationData,
  HealthSocialData,
  SchoolFinanceData,
  MasterReportNarrative,
  StaffMember,
  ClassGradebook,
  FailedStudentRecord,
  StudentScoreRow,
} from '../types';
import { Table1SchoolRoomsView } from './Table1SchoolRooms';
import { Table1StaffView } from './Table1Staff';
import { Table2AcademicResultsView } from './Table2AcademicResults';
import { Table3FailedStatsView } from './Table3FailedStats';
import { Table4YearEndResultsView } from './Table4YearEndResults';
import { TableFailedStudentsNominalRoll } from './TableFailedStudentsNominalRoll';
import { StaffNominalRoll } from './StaffNominalRoll';
import { ClassGradebooksView } from './ClassGradebooksView';
import { PartBView } from './PartBView';
import { OfficialMasterReport } from './OfficialMasterReport';
import { PdfProgressModal } from './PdfProgressModal';
import { exportElementToPdf, PdfProgressInfo } from '../utils/pdfExport';
import { Printer, BookOpen, Layers, FileDown } from 'lucide-react';

interface FullBookletViewProps {
  meta: SchoolMeta;
  t1Rooms: Table1SchoolRooms;
  t1Staff: Table1Staff;
  t2Rows: Table2RowInput[];
  t3Rows: Table3RowInput[];
  t4Rows: Table4RowInput[];
  t4HeaderConfig: Table4HeaderConfig;
  library: LibraryData;
  waterSanitation: WaterSanitationData;
  healthSocial: HealthSocialData;
  finance: SchoolFinanceData;
  narrative: MasterReportNarrative;
  staffList: StaffMember[];
  gradebooks: ClassGradebook[];
  failedStudents?: FailedStudentRecord[];
  detailedStudents?: StudentScoreRow[];
  onChangeNarrative: (n: MasterReportNarrative) => void;
  onUpdateStaffList: (l: StaffMember[]) => void;
  onUpdateGradebooks: (g: ClassGradebook[]) => void;
  onUpdateFailedStudents?: (students: FailedStudentRecord[]) => void;
  onExportExcel: () => void;
}

export const FullBookletView: React.FC<FullBookletViewProps> = (props) => {
  const bookletContainerRef = useRef<HTMLDivElement>(null);
  const [isDownloadingPdf, setIsDownloadingPdf] = useState(false);
  const [progressInfo, setProgressInfo] = useState<PdfProgressInfo>({
    percent: 0,
    stage: 'កំពុងរៀបចំ...',
  });
  const [isComplete, setIsComplete] = useState(false);
  const [pdfError, setPdfError] = useState<string | null>(null);

  const handleDownloadPdf = async () => {
    if (!bookletContainerRef.current) return;
    setIsDownloadingPdf(true);
    setIsComplete(false);
    setPdfError(null);
    setProgressInfo({ percent: 5, stage: 'កំពុងរៀបចំទំព័រ ២៤ ទំព័រ...' });

    try {
      const filename = `របាយការណ៍បូកសរុប_${props.meta.schoolName || 'សាលារៀន'}_២៤ទំព័រ_${props.meta.academicYear || '២០២៥-២០២៦'}`;
      await exportElementToPdf(bookletContainerRef.current, filename, (progress) => {
        setProgressInfo(progress);
      });
      setIsComplete(true);
    } catch (err: any) {
      console.error('PDF generation error:', err);
      setPdfError(
        'ដំណើរការបំប្លែងជា PDF មានបញ្ហាបន្តិចបន្តួច។ អ្នកអាចប្រើប្រាស់ប៊ូតុង "បោះពុម្ព" រួចជ្រើសរើស "Save as PDF" ជំនួសវិញបាន។'
      );
    }
  };

  return (
    <div className="space-y-6">
      {/* Visual Progress Modal for PDF Export */}
      <PdfProgressModal
        isOpen={isDownloadingPdf}
        progress={progressInfo}
        isComplete={isComplete}
        error={pdfError}
        onClose={() => setIsDownloadingPdf(false)}
      />

      {/* Top Banner with Compact Action Buttons */}
      <div className="no-print p-3 sm:p-4 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 text-white rounded-xl shadow-md flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-lg bg-white/15 flex items-center justify-center border border-white/20 shrink-0">
            <BookOpen className="w-5 h-5 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-sm sm:text-base font-bold">
              សៀវភៅរបាយការណ៍ផ្លូវការពេញលេញ (២៤ ទំព័រ)
            </h2>
            <p className="text-[11px] text-blue-100">
              {props.meta.schoolName} ({props.meta.academicYear}) | បំបែកទំព័រតាមស្តង់ដា A4
            </p>
          </div>
        </div>

        {/* Compact Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            id="btn-download-booklet-pdf"
            onClick={handleDownloadPdf}
            disabled={isDownloadingPdf}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-lg shadow-xs cursor-pointer transition-all disabled:opacity-50"
            title="ទាញយកឯកសារជា PDF ពេញលេញ ២៤ទំព័រ"
          >
            <FileDown className="w-4 h-4" />
            <span>ទាញយកជា PDF (២៤ទំព័រ)</span>
          </button>

          <button
            id="btn-print-booklet-native"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-2.5 py-1.5 text-xs font-semibold bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 cursor-pointer transition-colors"
            title="បោះពុម្ព ឬរក្សាទុក PDF តាមប្រព័ន្ធ Browser"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {/* Printable 24-Page Booklet Container */}
      <div ref={bookletContainerRef} className="space-y-8 bg-white/50 p-2 sm:p-4 rounded-xl">
        {/* Part 1: Official Narrative Report (Pages 1 to 6) */}
        <section className="print-page-break html2pdf__page-break">
          <div className="no-print mb-2.5 flex items-center gap-2 text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-1.5 rounded-lg border border-indigo-100">
            <Layers className="w-3.5 h-3.5 text-indigo-600" />
            <span>ផ្នែកទី ១ ៖ របាយការណ៍បូកសរុបលទ្ធផលការងារដំណាច់ឆ្នាំ (ទំព័រ ១ ដល់ ៦)</span>
          </div>
          <OfficialMasterReport
            meta={props.meta}
            t1Rooms={props.t1Rooms}
            t1Staff={props.t1Staff}
            t2Rows={props.t2Rows}
            t3Rows={props.t3Rows}
            t4Rows={props.t4Rows}
            t4HeaderConfig={props.t4HeaderConfig}
            library={props.library}
            waterSanitation={props.waterSanitation}
            healthSocial={props.healthSocial}
            finance={props.finance}
            narrative={props.narrative}
            onChangeNarrative={props.onChangeNarrative}
            onExportExcel={props.onExportExcel}
          />
        </section>

        {/* Part 2: Staff Nominal Roll (Page 7) */}
        <section className="print-page-break html2pdf__page-break page-break-before">
          <div className="no-print mb-2.5 flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>ផ្នែកទី ២ ៖ បញ្ជីរាយនាមបុគ្គលិកអប់រំឆមាសទី១ និងដំណាច់ឆ្នាំ (ទំព័រ ៧)</span>
          </div>
          <StaffNominalRoll
            meta={props.meta}
            staffList={props.staffList}
            onUpdateStaffList={props.onUpdateStaffList}
          />
        </section>

        {/* Part 3: Specialized Statistics (Part B, Pages 8 to 11) */}
        <section className="print-page-break html2pdf__page-break page-break-before">
          <div className="no-print mb-2.5 flex items-center gap-2 text-xs font-bold text-teal-900 bg-teal-50 px-3 py-1.5 rounded-lg border border-teal-100">
            <Layers className="w-3.5 h-3.5 text-teal-600" />
            <span>ផ្នែកទី ៣ ៖ ស្ថិតិឯកទេសដំណាច់ឆ្នាំ (ផ្នែក B - ទំព័រ ៨ ដល់ ១១)</span>
          </div>
          <PartBView
            meta={props.meta}
            t1Rooms={props.t1Rooms}
            t1Staff={props.t1Staff}
            library={props.library}
            onChangeLibrary={() => {}}
            waterSanitation={props.waterSanitation}
            onChangeWaterSanitation={() => {}}
            healthSocial={props.healthSocial}
            onChangeHealthSocial={() => {}}
            finance={props.finance}
            onChangeFinance={() => {}}
            onNavigateToMaster={() => {}}
          />
        </section>

        {/* Part 4: Class Gradebooks & Student Rankings (Pages 12 to 21) */}
        <section className="print-page-break html2pdf__page-break page-break-before">
          <div className="no-print mb-2.5 flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-1.5 rounded-lg border border-emerald-100">
            <Layers className="w-3.5 h-3.5 text-emerald-600" />
            <span>ផ្នែកទី ៤ ៖ សៀវភៅចំណាត់ថ្នាក់តាមថ្នាក់នីមួយៗ (ទំព័រ ១២ ដល់ ២១)</span>
          </div>
          <ClassGradebooksView
            meta={props.meta}
            gradebooks={props.gradebooks}
            staffList={props.staffList}
            onUpdateGradebooks={props.onUpdateGradebooks}
            showAllClassesForPrint={true}
          />
        </section>

        {/* Part 5: Core 4 Tables (Part A, Pages 22 to 24) */}
        <section className="print-page-break html2pdf__page-break page-break-before space-y-6">
          <div className="no-print mb-2.5 flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-1.5 rounded-lg border border-blue-100">
            <Layers className="w-3.5 h-3.5 text-blue-600" />
            <span>ផ្នែកទី ៥ ៖ ស្ថិតិគ្រឹះ ៤ តារាង (ផ្នែក A - ទំព័រ ២២ ដល់ ២៤)</span>
          </div>
          <Table1SchoolRoomsView data={props.t1Rooms} onChange={() => {}} showFormulas={true} />
          <Table1StaffView data={props.t1Staff} onChange={() => {}} showFormulas={true} />
          <Table2AcademicResultsView rows={props.t2Rows} onChange={() => {}} showFormulas={true} />
          <Table3FailedStatsView rows={props.t3Rows} onChange={() => {}} showFormulas={true} />
          <Table4YearEndResultsView
            rows={props.t4Rows}
            onChange={() => {}}
            showFormulas={true}
            headerConfig={props.t4HeaderConfig}
            onUpdateHeaderConfig={() => {}}
          />
          {props.failedStudents && (
            <div className="mt-8">
              <TableFailedStudentsNominalRoll
                students={props.failedStudents}
                onChange={props.onUpdateFailedStudents || (() => {})}
                meta={props.meta}
                gradebooks={props.gradebooks}
                detailedStudents={props.detailedStudents}
              />
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
