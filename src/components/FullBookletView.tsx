import React from 'react';
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
} from '../types';
import { Table1SchoolRoomsView } from './Table1SchoolRooms';
import { Table1StaffView } from './Table1Staff';
import { Table2AcademicResultsView } from './Table2AcademicResults';
import { Table3FailedStatsView } from './Table3FailedStats';
import { Table4YearEndResultsView } from './Table4YearEndResults';
import { StaffNominalRoll } from './StaffNominalRoll';
import { ClassGradebooksView } from './ClassGradebooksView';
import { PartBView } from './PartBView';
import { OfficialMasterReport } from './OfficialMasterReport';
import { Printer, BookOpen, Layers } from 'lucide-react';

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
  onChangeNarrative: (n: MasterReportNarrative) => void;
  onUpdateStaffList: (l: StaffMember[]) => void;
  onUpdateGradebooks: (g: ClassGradebook[]) => void;
  onExportExcel: () => void;
}

export const FullBookletView: React.FC<FullBookletViewProps> = (props) => {
  return (
    <div className="space-y-10">
      {/* Top Banner */}
      <div className="no-print p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-800 text-white rounded-2xl shadow-lg flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
            <BookOpen className="w-6 h-6 text-yellow-300" />
          </div>
          <div>
            <h2 className="text-base sm:text-lg font-bold">
              សៀវភៅរបាយការណ៍ដំណាច់ឆ្នាំផ្លូវការពេញលេញ (Full Official Booklet)
            </h2>
            <p className="text-xs text-blue-100 mt-0.5">
              រៀបចំតាមទម្រង់ស្តង់ដា ២៤ទំព័រ របស់{props.meta.schoolName} ({props.meta.academicYear})
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 px-4 py-2 text-xs font-bold bg-yellow-400 hover:bg-yellow-300 text-slate-950 rounded-xl shadow-md cursor-pointer transition-all"
          >
            <Printer className="w-4 h-4" />
            <span>បោះពុម្ពសៀវភៅទាំងមូល (Print All)</span>
          </button>
        </div>
      </div>

      {/* Part 1: Official Narrative Report (Pages 1 to 6) */}
      <section className="print-page-break">
        <div className="no-print mb-3 flex items-center gap-2 text-xs font-bold text-indigo-900 bg-indigo-50 px-3 py-2 rounded-lg border border-indigo-100">
          <Layers className="w-4 h-4 text-indigo-600" />
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
      <section className="print-page-break">
        <div className="no-print mb-3 flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>ផ្នែកទី ២ ៖ បញ្ជីរាយនាមបុគ្គលិកអប់រំឆមាសទី១ និងដំណាច់ឆ្នាំ (ទំព័រ ៧)</span>
        </div>
        <StaffNominalRoll
          meta={props.meta}
          staffList={props.staffList}
          onUpdateStaffList={props.onUpdateStaffList}
        />
      </section>

      {/* Part 3: Specialized Statistics (Part B, Pages 8 to 11) */}
      <section className="print-page-break">
        <div className="no-print mb-3 flex items-center gap-2 text-xs font-bold text-teal-900 bg-teal-50 px-3 py-2 rounded-lg border border-teal-100">
          <Layers className="w-4 h-4 text-teal-600" />
          <span>ផ្នែកទី ៣ ៖ ស្ថិតិឯកទេសដំណាច់ឆ្នាំ (ផ្នែក B - ទំព័រ ៨ ដល់ ១១)</span>
        </div>
        <PartBView
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
      <section className="print-page-break">
        <div className="no-print mb-3 flex items-center gap-2 text-xs font-bold text-emerald-900 bg-emerald-50 px-3 py-2 rounded-lg border border-emerald-100">
          <Layers className="w-4 h-4 text-emerald-600" />
          <span>ផ្នែកទី ៤ ៖ សៀវភៅចំណាត់ថ្នាក់តាមថ្នាក់នីមួយៗ (ទំព័រ ១២ ដល់ ២១)</span>
        </div>
        <ClassGradebooksView
          meta={props.meta}
          gradebooks={props.gradebooks}
          onUpdateGradebooks={props.onUpdateGradebooks}
        />
      </section>

      {/* Part 5: Core 4 Tables (Part A, Pages 22 to 24) */}
      <section className="print-page-break space-y-6">
        <div className="no-print mb-3 flex items-center gap-2 text-xs font-bold text-blue-900 bg-blue-50 px-3 py-2 rounded-lg border border-blue-100">
          <Layers className="w-4 h-4 text-blue-600" />
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
      </section>
    </div>
  );
};
