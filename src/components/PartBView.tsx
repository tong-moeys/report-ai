import React, { useState } from 'react';
import {
  SchoolMeta,
  Table1SchoolRooms,
  Table1Staff,
  LibraryData,
  WaterSanitationData,
  HealthSocialData,
  SchoolFinanceData,
} from '../types';
import { formatPct, initialSchoolMeta } from '../data/initialData';
import { toKhmerNum } from '../utils/khmerNumbers';
import { exportPartBToExcel } from '../utils/exportUtils';
import {
  BookOpen,
  Droplets,
  HeartHandshake,
  DollarSign,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ArrowLeft,
  ShieldCheck,
  AlertCircle,
  Printer,
  Download,
  FileSpreadsheet,
  Eye,
  Edit3,
  Building,
} from 'lucide-react';

interface PartBViewProps {
  meta?: SchoolMeta;
  t1Rooms: Table1SchoolRooms;
  t1Staff: Table1Staff;
  library: LibraryData;
  onChangeLibrary: (lib: LibraryData) => void;
  waterSanitation: WaterSanitationData;
  onChangeWaterSanitation: (ws: WaterSanitationData) => void;
  healthSocial: HealthSocialData;
  onChangeHealthSocial: (hs: HealthSocialData) => void;
  finance: SchoolFinanceData;
  onChangeFinance: (fin: SchoolFinanceData) => void;
  onNavigateToMaster?: () => void;
  onNavigateToPartA?: () => void;
}

export const PartBView: React.FC<PartBViewProps> = ({
  meta = initialSchoolMeta,
  t1Rooms,
  t1Staff,
  library,
  onChangeLibrary,
  waterSanitation,
  onChangeWaterSanitation,
  healthSocial,
  onChangeHealthSocial,
  finance,
  onChangeFinance,
  onNavigateToMaster,
  onNavigateToPartA,
}) => {
  // View display mode: Official Table (like Ministry paper) vs Interactive Cards
  const [viewMode, setViewMode] = useState<'official_table' | 'interactive'>('official_table');

  // Compute student sums from Part A
  const gradesKeys: Array<keyof Pick<Table1SchoolRooms, 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'>> = [
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6'
  ];
  const t1TotalStudents = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].total) || 0), 0);
  const t1TotalFemale = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].female) || 0), 0);

  // Compute staff from Table 1(ត)
  const teachingTotal =
    (Number(t1Staff.pureTeaching.total) || 0) +
    (Number(t1Staff.multiGrade.total) || 0) +
    (Number(t1Staff.deputyTeaching.total) || 0) +
    (Number(t1Staff.contractTeaching.total) || 0);
  const teachingFemale =
    (Number(t1Staff.pureTeaching.female) || 0) +
    (Number(t1Staff.multiGrade.female) || 0) +
    (Number(t1Staff.deputyTeaching.female) || 0) +
    (Number(t1Staff.contractTeaching.female) || 0);
  const totalStaff =
    (Number(t1Staff.directorDeputy.total) || 0) +
    (Number(t1Staff.officeAdmin.total) || 0) +
    teachingTotal +
    (Number(t1Staff.assistTeaching.total) || 0);
  const totalStaffFemale =
    (Number(t1Staff.directorDeputy.female) || 0) +
    (Number(t1Staff.officeAdmin.female) || 0) +
    teachingFemale +
    (Number(t1Staff.assistTeaching.female) || 0);

  // Total books
  const totalBooks =
    (Number(library.storyBooks) || 0) +
    (Number(library.textBooks) || 0) +
    (Number(library.teacherGuides) || 0);

  // Total disabled calculation
  const totalDisabled =
    (Number(healthSocial.disabledPhysical.total) || 0) +
    (Number(healthSocial.disabledVisual.total) || 0) +
    (Number(healthSocial.disabledHearing.total) || 0) +
    (Number(healthSocial.disabledIntellectual.total) || 0);
  const totalDisabledFemale =
    (Number(healthSocial.disabledPhysical.female) || 0) +
    (Number(healthSocial.disabledVisual.female) || 0) +
    (Number(healthSocial.disabledHearing.female) || 0) +
    (Number(healthSocial.disabledIntellectual.female) || 0);

  // Total poor students
  const totalPoorStudents =
    (Number(healthSocial.idPoor1.total) || 0) + (Number(healthSocial.idPoor2.total) || 0);
  const totalPoorFemale =
    (Number(healthSocial.idPoor1.female) || 0) + (Number(healthSocial.idPoor2.female) || 0);

  // Budget balance
  const budgetBalance =
    (Number(finance.budgetReceivedPB) || 0) - (Number(finance.budgetExpendedPB) || 0);

  // Student-to-toilet ratio
  const functioningToilets = Math.max(1, Number(waterSanitation.functioningLatrines) || 1);
  const studentsPerToilet = Math.round(t1TotalStudents / functioningToilets);

  // Auto-sync deworming target from Part A
  const handleAutoSyncDeworming = () => {
    onChangeHealthSocial({
      ...healthSocial,
      dewormingRound1: {
        ...healthSocial.dewormingRound1,
        target: t1TotalStudents,
      },
      dewormingRound2: {
        ...healthSocial.dewormingRound2,
        target: t1TotalStudents,
      },
    });
  };

  // Trigger Print for Part B
  const handlePrintPartB = () => {
    window.print();
  };

  // Trigger Excel Export for Part B
  const handleExportExcel = () => {
    exportPartBToExcel(
      meta,
      t1Rooms,
      t1Staff,
      library,
      waterSanitation,
      healthSocial,
      finance
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Control Toolbar */}
      <div className="no-print bg-gradient-to-r from-teal-50 via-emerald-50 to-blue-50 border border-teal-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-teal-600 text-white flex items-center justify-center font-bold text-lg shadow-xs shrink-0">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base sm:text-lg font-bold text-slate-900 font-moul">
                  ផ្នែក B ៖ ស្ថិតិឯកទេស និងសង្គម
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-emerald-100 text-emerald-800 px-2.5 py-0.5 rounded-full border border-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  រត់ស្វ័យប្រវត្តិពីផ្នែក A
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                ស្ថិតិបុគ្គលិក បណ្ណាល័យ ទឹកស្អាត-អនាម័យ (WASH) ការទម្លាក់ព្រូន សិស្សក្រីក្រ ពិការភាព និងថវិកាដំណើរការសាលា (PB)
              </p>
            </div>
          </div>

          {/* Action Tools: Switch View, Print, Export */}
          <div className="flex flex-wrap items-center gap-2">
            {/* View Mode Toggle */}
            <div className="bg-white p-1 rounded-lg border border-teal-200 flex items-center shadow-2xs text-xs">
              <button
                id="btn-view-official-table"
                onClick={() => setViewMode('official_table')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === 'official_table'
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                <span>ទម្រង់តារាងផ្លូវការក្រសួង A4</span>
              </button>
              <button
                id="btn-view-interactive-cards"
                onClick={() => setViewMode('interactive')}
                className={`flex items-center gap-1.5 px-3 py-1.5 rounded-md font-medium transition-all cursor-pointer ${
                  viewMode === 'interactive'
                    ? 'bg-teal-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Edit3 className="w-3.5 h-3.5" />
                <span>ទម្រង់កែសម្រួល & គណនា</span>
              </button>
            </div>

            {/* Sync from Part A Button */}
            <button
              onClick={handleAutoSyncDeworming}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-teal-800 border border-teal-200 rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="កំណត់គោលដៅទម្លាក់ព្រូនស្មើនឹងចំនួនសិស្សតារាង១"
            >
              <Sparkles className="w-3.5 h-3.5 text-teal-600" />
              <span className="hidden sm:inline">ធ្វើបច្ចុប្បន្នភាព</span>គោលដៅព្រូន
            </button>

            {/* Export Excel Button */}
            <button
              id="btn-export-part-b-excel"
              onClick={handleExportExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-700 hover:bg-emerald-600 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="ទាញយកតារាងផ្នែក B ជាទម្រង់ Excel"
            >
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>ទាញយក Excel</span>
            </button>

            {/* Print A4 Button */}
            <button
              id="btn-print-part-b"
              onClick={handlePrintPartB}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="បោះពុម្ពទម្រង់តារាងផ្លូវការ A4"
            >
              <Printer className="w-3.5 h-3.5 text-yellow-400" />
              <span>បោះពុម្ព A4</span>
            </button>
          </div>
        </div>

        {/* Quick Context Strip */}
        <div className="mt-3 pt-3 border-t border-teal-100 flex flex-wrap items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex flex-wrap items-center gap-2 sm:gap-4">
            <span>
              សិស្សមូលដ្ឋានផ្នែក A: <strong className="text-teal-900">{toKhmerNum(t1TotalStudents)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(t1TotalFemale)}</strong>)
            </span>
            <span className="text-slate-300">•</span>
            <span>
              បុគ្គលិកសរុប: <strong className="text-teal-900">{toKhmerNum(totalStaff)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(totalStaffFemale)}</strong>)
            </span>
            <span className="text-slate-300">•</span>
            <span>
              បង្គន់ដំណើរការ: <strong className="text-teal-900">{toKhmerNum(waterSanitation.functioningLatrines)}</strong> បន្ទប់ ({toKhmerNum(studentsPerToilet)} សិស្ស/បង្គន់)
            </span>
          </div>

          <div className="text-slate-500 font-medium">
            ឆ្នាំសិក្សា {toKhmerNum(meta.academicYear)} • {meta.schoolName || 'សាលាបឋមសិក្សា'}
          </div>
        </div>
      </div>

      {/* ========================================================================= */}
      {/* MODE 1: OFFICIAL MINISTRY TABULAR SHEET (ទម្រង់តារាងផ្លូវការក្រសួង A4) */}
      {/* ========================================================================= */}
      {viewMode === 'official_table' && (
        <div className="bg-white border border-slate-300 rounded-xl shadow-xs p-4 sm:p-6 print:p-0 print:border-none space-y-6">
          {/* Official Administrative Heading */}
          <div className="text-center space-y-1 pb-4 border-b border-slate-200">
            <div className="font-moul text-sm sm:text-base text-slate-900">
              ព្រះរាជាណាចក្រកម្ពុជា
            </div>
            <div className="font-moul text-xs sm:text-sm text-slate-800">
              ជាតិ សាសនា ព្រះមហាក្សត្រ
            </div>
            <div className="text-xs text-slate-400 italic">~~~ ✤ ~~~</div>

            <div className="flex flex-col sm:flex-row items-center justify-between text-xs text-slate-700 pt-2 px-2">
              <div className="text-left space-y-0.5">
                <div>មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត៖ <strong>{meta.province || '..........'}</strong></div>
                <div>ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុក/ខណ្ឌ៖ <strong>{meta.district || meta.clusterOrDistrict || '..........'}</strong></div>
                <div>សាលាបឋមសិក្សា៖ <strong>{meta.schoolName || '..........'}</strong> {meta.schoolCode ? `(កូដ៖ ${toKhmerNum(meta.schoolCode)})` : ''}</div>
              </div>
              <div className="text-right mt-2 sm:mt-0">
                <span className="inline-block bg-teal-50 border border-teal-300 text-teal-900 px-3 py-1 rounded text-xs font-bold">
                  ផ្នែក B ៖ ស្ថិតិឯកទេស
                </span>
              </div>
            </div>

            <h1 className="font-moul text-base sm:text-lg text-slate-900 pt-3">
              របាយការណ៍ស្ថិតិឯកទេស និងសង្គម ដំណាច់ឆ្នាំសិក្សា {toKhmerNum(meta.academicYear)}
            </h1>
          </div>

          {/* Table 1: Staff & Library (ស្ថិតិបុគ្គលិកអប់រំ និងបណ្ណាល័យសាលា) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-teal-700" />
                <span>តារាងទី១ ៖ ស្ថិតិបុគ្គលិកអប់រំ និងបណ្ណាល័យសាលា (ភ្ជាប់ពីតារាង ១-ត)</span>
              </h3>
              <span className="text-[11px] text-slate-500">ខ្នាតគិតជា «នាក់» និង «ក្បាល»</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-400 text-center">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-400 px-2 py-1.5">បុគ្គលិកសរុប</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-rose-800">ស្រី</th>
                    <th className="border border-slate-400 px-2 py-1.5">គ្រូបង្រៀនផ្ទាល់</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-rose-800">ស្រី</th>
                    <th className="border border-slate-400 px-2 py-1.5">បណ្ណារក្សទទួលបន្ទុក</th>
                    <th className="border border-slate-400 px-2 py-1.5">កាលវិភាគអាន</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="bg-white">
                    <td className="border border-slate-400 px-2 py-1.5 font-bold bg-teal-50/50">{toKhmerNum(totalStaff)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold text-rose-700 bg-rose-50/30">{toKhmerNum(totalStaffFemale)}</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(teachingTotal)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 text-rose-700">{toKhmerNum(teachingFemale)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-medium">{library.librarianName || 'មិនទាន់បញ្ជាក់'}</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {library.hasReadingTimetable ? (
                        <span className="text-emerald-700 font-semibold">មានកាលវិភាគអាន</span>
                      ) : (
                        <span className="text-slate-500">គ្មានកាលវិភាគ</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Sub-table for books breakdown */}
              <table className="w-full text-xs border-collapse border border-slate-400 text-center mt-2">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold">
                    <th className="border border-slate-400 px-2 py-1">សៀវភៅរឿង/អាន</th>
                    <th className="border border-slate-400 px-2 py-1">សៀវភៅពុម្ព</th>
                    <th className="border border-slate-400 px-2 py-1">ឯកសារណែនាំគ្រូ</th>
                    <th className="border border-slate-400 px-2 py-1 bg-teal-100/70 text-teal-900">សៀវភៅសរុប</th>
                    <th className="border border-slate-400 px-2 py-1">អ្នកអានប្រចាំខែ (សរុប/ស្រី)</th>
                    <th className="border border-slate-400 px-2 py-1">សៀវភៅខ្ចី/ខែ</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(library.storyBooks)}</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(library.textBooks)}</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(library.teacherGuides)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold bg-teal-50 text-teal-900">{toKhmerNum(totalBooks)} ក្បាល</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {toKhmerNum(library.readersMonthly.total)} (ស្រី {toKhmerNum(library.readersMonthly.female)})
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(library.borrowingMonthly)} ក្បាល</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 2: WASH (ស្ថិតិទឹកស្អាត និងបង្គន់អនាម័យ) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <Droplets className="w-4 h-4 text-cyan-700" />
                <span>តារាងទី២ ៖ ស្ថិតិទឹកស្អាត និងបង្គន់អនាម័យក្នុងសាលារៀន (WASH)</span>
              </h3>
              <span className="text-[11px] text-cyan-800 bg-cyan-50 px-2 py-0.5 rounded border border-cyan-200 font-semibold">
                អត្រា៖ {toKhmerNum(studentsPerToilet)} សិស្ស/១បង្គន់ដំណើរការ
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-400 text-center">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-400 px-2 py-1.5">ប្រភពទឹកចម្បង</th>
                    <th className="border border-slate-400 px-2 py-1.5">ទឹកផឹកមានសុវត្ថិភាព</th>
                    <th className="border border-slate-400 px-2 py-1.5">កន្លែងលាងដៃ</th>
                    <th className="border border-slate-400 px-2 py-1.5">មានសាប៊ូជាប្រចាំ</th>
                    <th className="border border-slate-400 px-2 py-1.5">វិធីទុកដាក់សំរាម</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5">{waterSanitation.waterSource || 'មិនទាន់បញ្ជាក់'}</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {waterSanitation.hasSafeDrinkingWater ? (
                        <span className="text-emerald-700 font-semibold">មាន</span>
                      ) : (
                        <span className="text-rose-600">គ្មាន</span>
                      )}
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(waterSanitation.handwashingStations)} កន្លែង</td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {waterSanitation.hasSoapAvailable ? (
                        <span className="text-emerald-700 font-semibold">មាន</span>
                      ) : (
                        <span className="text-rose-600">គ្មាន</span>
                      )}
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5">{waterSanitation.wasteDisposalMethod || 'មិនទាន់បញ្ជាក់'}</td>
                  </tr>
                </tbody>
              </table>

              {/* Latrines breakdown */}
              <table className="w-full text-xs border-collapse border border-slate-400 text-center mt-2">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold">
                    <th className="border border-slate-400 px-2 py-1">បន្ទប់គ្រូ</th>
                    <th className="border border-slate-400 px-2 py-1">សិស្សប្រុស</th>
                    <th className="border border-slate-400 px-2 py-1 text-rose-800">សិស្សស្រី</th>
                    <th className="border border-slate-400 px-2 py-1 bg-cyan-100/70 text-cyan-900">សរុបបន្ទប់បង្គន់</th>
                    <th className="border border-slate-400 px-2 py-1 bg-teal-100 text-teal-900">កំពុងដំណើរការ</th>
                    <th className="border border-slate-400 px-2 py-1">ចំនួនសិស្សតារាង១</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(waterSanitation.teacherLatrines)}</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(waterSanitation.boysLatrines)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 text-rose-700">{toKhmerNum(waterSanitation.girlsLatrines)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold">
                      {toKhmerNum((Number(waterSanitation.teacherLatrines) || 0) + (Number(waterSanitation.boysLatrines) || 0) + (Number(waterSanitation.girlsLatrines) || 0))} បន្ទប់
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold text-teal-800 bg-teal-50">
                      {toKhmerNum(waterSanitation.functioningLatrines)} បន្ទប់
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 font-semibold text-slate-800">{toKhmerNum(t1TotalStudents)} នាក់</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 3: Health & Social (ការទម្លាក់ព្រូន, សិស្សក្រីក្រ, សិស្សពិការ) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <HeartHandshake className="w-4 h-4 text-rose-700" />
                <span>តារាងទី៣ ៖ ស្ថិតិការផ្ដល់ថ្នាំទម្លាក់ព្រូន សិស្សក្រីក្រ និងពិការភាព</span>
              </h3>
              <span className="text-[11px] text-slate-500">សុខភាពសិក្សា និងសមធម៌សង្គម</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-400 text-center">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-400 px-2 py-1.5">កម្មវិធីទម្លាក់ព្រូន</th>
                    <th className="border border-slate-400 px-2 py-1.5">គោលដៅ (សិស្ស)</th>
                    <th className="border border-slate-400 px-2 py-1.5">ទទួលសរុប</th>
                    <th className="border border-slate-400 px-2 py-1.5 text-rose-800">ស្រី</th>
                    <th className="border border-slate-400 px-2 py-1.5">ភាគរយសម្រេច (%)</th>
                    <th className="border border-slate-400 px-2 py-1.5">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 font-medium">ជុំទី ១ (ឆមាសទី ១)</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(healthSocial.dewormingRound1.target || t1TotalStudents)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold text-rose-700">{toKhmerNum(healthSocial.dewormingRound1.receivedTotal)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 text-rose-700">{toKhmerNum(healthSocial.dewormingRound1.receivedFemale)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold bg-emerald-50 text-emerald-800">
                      {formatPct(healthSocial.dewormingRound1.receivedTotal, healthSocial.dewormingRound1.target || t1TotalStudents)}%
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 text-slate-600">អនុវត្តរួចរាល់</td>
                  </tr>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 font-medium">ជុំទី ២ (ឆមាសទី ២)</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(healthSocial.dewormingRound2.target || t1TotalStudents)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold text-rose-700">{toKhmerNum(healthSocial.dewormingRound2.receivedTotal)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 text-rose-700">{toKhmerNum(healthSocial.dewormingRound2.receivedFemale)}</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold bg-emerald-50 text-emerald-800">
                      {formatPct(healthSocial.dewormingRound2.receivedTotal, healthSocial.dewormingRound2.target || t1TotalStudents)}%
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 text-slate-600">អនុវត្តរួចរាល់</td>
                  </tr>
                </tbody>
              </table>

              {/* Poor students and Disabilities table */}
              <table className="w-full text-xs border-collapse border border-slate-400 text-center mt-2">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold">
                    <th className="border border-slate-400 px-2 py-1">ក្រីក្រកម្រិត ១ (សរុប/ស្រី)</th>
                    <th className="border border-slate-400 px-2 py-1">ក្រីក្រកម្រិត ២ (សរុប/ស្រី)</th>
                    <th className="border border-slate-400 px-2 py-1 bg-amber-100 text-amber-900 font-bold">សរុបសិស្សក្រីក្រ</th>
                    <th className="border border-slate-400 px-2 py-1">អាហារូបករណ៍ (សរុប/ស្រី)</th>
                    <th className="border border-slate-400 px-2 py-1 bg-rose-100 text-rose-900 font-bold">សិស្សពិការសរុប</th>
                    <th className="border border-slate-400 px-2 py-1 text-left">ប្រភេទពិការភាព (កាយសម្បទា, គំហើញ, សោត, សតិបញ្ញា)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {toKhmerNum(healthSocial.idPoor1.total)} (ស្រី {toKhmerNum(healthSocial.idPoor1.female)})
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {toKhmerNum(healthSocial.idPoor2.total)} (ស្រី {toKhmerNum(healthSocial.idPoor2.female)})
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold bg-amber-50 text-amber-900">
                      {toKhmerNum(totalPoorStudents)} (ស្រី {toKhmerNum(totalPoorFemale)})
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 text-emerald-800 font-semibold">
                      {toKhmerNum(healthSocial.scholarships.total)} (ស្រី {toKhmerNum(healthSocial.scholarships.female)})
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold bg-rose-50 text-rose-900">
                      {toKhmerNum(totalDisabled)} (ស្រី {toKhmerNum(totalDisabledFemale)})
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 text-left text-slate-700">
                      កាយសម្បទា: <strong>{toKhmerNum(healthSocial.disabledPhysical.total)}</strong> • គំហើញ: <strong>{toKhmerNum(healthSocial.disabledVisual.total)}</strong> • សោត: <strong>{toKhmerNum(healthSocial.disabledHearing.total)}</strong> • សតិបញ្ញា: <strong>{toKhmerNum(healthSocial.disabledIntellectual.total)}</strong>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Table 4: Finance PB (ថវិកាដំណើរការសាលា) */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-xs sm:text-sm font-bold text-slate-800 flex items-center gap-1.5">
                <DollarSign className="w-4 h-4 text-emerald-700" />
                <span>តារាងទី៤ ៖ ស្ថិតិថវិកាដំណើរការសាលារៀន (Program Budgeting - PB)</span>
              </h3>
              <span className="text-[11px] text-slate-500">គិតជា «រៀល»</span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border-collapse border border-slate-400 text-center">
                <thead>
                  <tr className="bg-slate-100 text-slate-800 font-bold">
                    <th className="border border-slate-400 px-2 py-1.5">ថវិកាគ្រោងសរុប (រៀល)</th>
                    <th className="border border-slate-400 px-2 py-1.5">ថវិកាបានទទួល (រៀល)</th>
                    <th className="border border-slate-400 px-2 py-1.5">បានចំណាយជាក់ស្តែង (រៀល)</th>
                    <th className="border border-slate-400 px-2 py-1.5 bg-blue-100 text-blue-950 font-bold">សមតុល្យនៅសល់ (រៀល)</th>
                    <th className="border border-slate-400 px-2 py-1.5">ភាគរយអនុវត្ត</th>
                    <th className="border border-slate-400 px-2 py-1.5">ស្ថានភាព</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5 font-medium">{toKhmerNum(Number(finance.budgetPlanPB || 0).toLocaleString())} ៛</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold text-slate-900 bg-slate-50">{toKhmerNum(Number(finance.budgetReceivedPB || 0).toLocaleString())} ៛</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold text-emerald-800 bg-emerald-50/50">{toKhmerNum(Number(finance.budgetExpendedPB || 0).toLocaleString())} ៛</td>
                    <td className={`border border-slate-400 px-2 py-1.5 font-bold ${budgetBalance >= 0 ? 'bg-blue-50 text-blue-800' : 'bg-rose-50 text-rose-700'}`}>
                      {toKhmerNum(budgetBalance.toLocaleString())} ៛
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold">
                      {formatPct(finance.budgetExpendedPB, finance.budgetReceivedPB || 1)}%
                    </td>
                    <td className="border border-slate-400 px-2 py-1.5">
                      {budgetBalance >= 0 ? (
                        <span className="text-emerald-700 font-semibold">សមតុល្យវិជ្ជមាន</span>
                      ) : (
                        <span className="text-rose-600 font-semibold">លើសចំណាយ</span>
                      )}
                    </td>
                  </tr>
                </tbody>
              </table>

              {/* Budget Expenditures Breakdown */}
              <table className="w-full text-xs border-collapse border border-slate-400 text-center mt-2">
                <thead>
                  <tr className="bg-slate-50 text-slate-700 font-semibold">
                    <th className="border border-slate-400 px-2 py-1">១. សម្ភារៈឧបទេសបង្រៀន</th>
                    <th className="border border-slate-400 px-2 py-1">២. ជួសជុល និងកែលម្អ</th>
                    <th className="border border-slate-400 px-2 py-1">៣. អនាម័យ និងសុខភាព</th>
                    <th className="border border-slate-400 px-2 py-1 bg-emerald-100 text-emerald-950 font-bold">សរុបចំណាយជាក់ស្តែង</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(Number(finance.materialsExpended || 0).toLocaleString())} ៛</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(Number(finance.repairsExpended || 0).toLocaleString())} ៛</td>
                    <td className="border border-slate-400 px-2 py-1.5">{toKhmerNum(Number(finance.hygieneExpended || 0).toLocaleString())} ៛</td>
                    <td className="border border-slate-400 px-2 py-1.5 font-bold bg-emerald-50 text-emerald-900">
                      {toKhmerNum(Number(finance.budgetExpendedPB || 0).toLocaleString())} ៛
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Official Signatures Section (3-column) */}
          <div className="pt-6 border-t border-slate-200 mt-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs">
              <div className="space-y-1">
                <div className="text-slate-600">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</div>
                <div className="font-moul text-slate-800 pt-1">នាយករងសាលា</div>
                <div className="h-16"></div>
                <div className="border-t border-dashed border-slate-400 mx-8 pt-1 text-slate-400 italic">
                  ហត្ថលេខា និងឈ្មោះ
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-600">រៀបចំដោយ</div>
                <div className="font-moul text-slate-800 pt-1">អ្នកធ្វើរបាយការណ៍</div>
                <div className="h-16"></div>
                <div className="border-t border-dashed border-slate-400 mx-8 pt-1 text-slate-400 italic">
                  ហត្ថលេខា និងឈ្មោះ
                </div>
              </div>

              <div className="space-y-1">
                <div className="text-slate-600">{meta.reportDate || 'ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២៥'}</div>
                <div className="font-moul text-slate-800 pt-1">នាយកសាលាបឋមសិក្សា</div>
                <div className="h-16"></div>
                <div className="border-t border-dashed border-slate-400 mx-8 pt-1 text-slate-400 italic">
                  ហត្ថលេខា និងត្រា
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ========================================================================= */}
      {/* MODE 2: INTERACTIVE EDITING FORM CARDS (ទម្រង់កែសម្រួល & គណនាស្វ័យប្រវត្ត) */}
      {/* ========================================================================= */}
      {viewMode === 'interactive' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* 1. Personnel & Library */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <BookOpen className="w-4 h-4 text-indigo-600" />
                <h3 className="font-bold text-slate-800 text-sm">១. បុគ្គលិក និងបណ្ណាល័យសាលា</h3>
              </div>
              <span className="text-xs bg-indigo-50 text-indigo-700 px-2 py-0.5 rounded-md border border-indigo-200 font-medium">
                បណ្ណាល័យកុមារមេត្រី
              </span>
            </div>

            <div className="p-4 space-y-4">
              {/* Staff Connection Card */}
              <div className="bg-indigo-50/50 border border-indigo-100 rounded-lg p-3 text-xs text-slate-700 flex items-center justify-between">
                <div>
                  <span className="font-semibold text-indigo-900">បុគ្គលិកអប់រំ (ភ្ជាប់ពីតារាង ១-ត):</span>
                  <div className="mt-1 text-slate-600">
                    សរុប <strong className="text-slate-800">{toKhmerNum(totalStaff)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(totalStaffFemale)}</strong>) • គ្រូបង្រៀនផ្ទាល់ <strong>{toKhmerNum(teachingTotal)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(teachingFemale)}</strong>)
                  </div>
                </div>
                <span className="text-[11px] text-indigo-600 bg-white px-2 py-1 rounded border border-indigo-200">
                  ស្វ័យប្រវត្តិ
                </span>
              </div>

              {/* Library Details */}
              <div className="space-y-3 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">ឈ្មោះបណ្ណារក្សទទួលបន្ទុក</label>
                    <input
                      type="text"
                      value={library.librarianName}
                      onChange={(e) => onChangeLibrary({ ...library, librarianName: e.target.value })}
                      className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 font-medium mb-1">មានកាលវិភាគម៉ោងអានទៀងទាត់?</label>
                    <select
                      value={library.hasReadingTimetable ? 'yes' : 'no'}
                      onChange={(e) => onChangeLibrary({ ...library, hasReadingTimetable: e.target.value === 'yes' })}
                      className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-indigo-500 outline-hidden"
                    >
                      <option value="yes">មានកាលវិភាគអានច្បាស់លាស់</option>
                      <option value="no">មិនទាន់មានកាលវិភាគជាក់លាក់</option>
                    </select>
                  </div>
                </div>

                {/* Books Inventory Grid */}
                <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                  <div className="font-semibold text-slate-700 mb-2 flex items-center justify-between">
                    <span>ស្ថិតិសៀវភៅក្នុងបណ្ណាល័យ</span>
                    <span className="text-indigo-700 font-bold">
                      សរុប {toKhmerNum(totalBooks)} ក្បាល
                    </span>
                  </div>
                  <div className="grid grid-cols-3 gap-2">
                    <div>
                      <span className="text-slate-500 text-[11px] block">សៀវភៅរឿង/អាន</span>
                      <input
                        type="number"
                        min={0}
                        value={library.storyBooks || ''}
                        onChange={(e) => onChangeLibrary({ ...library, storyBooks: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">សៀវភៅពុម្ពសិក្សា</span>
                      <input
                        type="number"
                        min={0}
                        value={library.textBooks || ''}
                        onChange={(e) => onChangeLibrary({ ...library, textBooks: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-slate-500 text-[11px] block">ឯកសារណែនាំគ្រូ</span>
                      <input
                        type="number"
                        min={0}
                        value={library.teacherGuides || ''}
                        onChange={(e) => onChangeLibrary({ ...library, teacherGuides: parseInt(e.target.value) || 0 })}
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                {/* Readers & Borrowing */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-slate-600 block mb-1">អ្នកអានប្រចាំខែ (សរុប)</span>
                    <input
                      type="number"
                      min={0}
                      value={library.readersMonthly.total || ''}
                      onChange={(e) =>
                        onChangeLibrary({
                          ...library,
                          readersMonthly: { ...library.readersMonthly, total: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-600 block mb-1">អ្នកអានប្រចាំខែ (ស្រី)</span>
                    <input
                      type="number"
                      min={0}
                      value={library.readersMonthly.female || ''}
                      onChange={(e) =>
                        onChangeLibrary({
                          ...library,
                          readersMonthly: { ...library.readersMonthly, female: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-600 block mb-1">ចំនួនសៀវភៅខ្ចី/ខែ</span>
                    <input
                      type="number"
                      min={0}
                      value={library.borrowingMonthly || ''}
                      onChange={(e) =>
                        onChangeLibrary({
                          ...library,
                          borrowingMonthly: parseInt(e.target.value) || 0,
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2.5 py-1.5 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 2. Water, Sanitation & Hygiene (WASH) */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Droplets className="w-4 h-4 text-cyan-600" />
                <h3 className="font-bold text-slate-800 text-sm">២. ទឹកស្អាត និងបង្គន់អនាម័យ (WASH)</h3>
              </div>
              <span className="text-xs bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded-md border border-cyan-200 font-medium">
                សុខភាពសិក្សា
              </span>
            </div>

            <div className="p-4 space-y-3.5 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ប្រភពទឹកប្រើប្រាស់ចម្បង</label>
                  <input
                    type="text"
                    value={waterSanitation.waterSource}
                    onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, waterSource: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">វិធីគ្រប់គ្រងកាកសំណល់/សំរាម</label>
                  <input
                    type="text"
                    value={waterSanitation.wasteDisposalMethod}
                    onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, wasteDisposalMethod: e.target.value })}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-cyan-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Checkboxes for safe water & soap */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={waterSanitation.hasSafeDrinkingWater}
                    onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, hasSafeDrinkingWater: e.target.checked })}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-slate-700">មានទឹកស្អាតមានសុវត្ថិភាពសម្រាប់ទទួលទាន</span>
                </label>

                <label className="flex items-center gap-2 p-2 bg-slate-50 border border-slate-200 rounded-lg cursor-pointer hover:bg-slate-100">
                  <input
                    type="checkbox"
                    checked={waterSanitation.hasSoapAvailable}
                    onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, hasSoapAvailable: e.target.checked })}
                    className="rounded border-slate-300 text-cyan-600 focus:ring-cyan-500"
                  />
                  <span className="text-slate-700">មានសាប៊ូនៅកន្លែងលាងដៃជាប្រចាំ</span>
                </label>
              </div>

              {/* Handwashing and Latrine breakdown */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-slate-700">ស្ថិតិបន្ទប់អនាម័យ និងកន្លែងលាងដៃ</span>
                  <span className="text-[11px] text-cyan-800 bg-cyan-100 px-2 py-0.5 rounded border border-cyan-300">
                    មធ្យមភាគ {toKhmerNum(studentsPerToilet)} សិស្ស/១បង្គន់
                  </span>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <span className="text-slate-500 text-[11px] block">កន្លែងលាងដៃ</span>
                    <input
                      type="number"
                      min={0}
                      value={waterSanitation.handwashingStations || ''}
                      onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, handwashingStations: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">បន្ទប់គ្រូ</span>
                    <input
                      type="number"
                      min={0}
                      value={waterSanitation.teacherLatrines || ''}
                      onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, teacherLatrines: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">សិស្សប្រុស</span>
                    <input
                      type="number"
                      min={0}
                      value={waterSanitation.boysLatrines || ''}
                      onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, boysLatrines: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">សិស្សស្រី</span>
                    <input
                      type="number"
                      min={0}
                      value={waterSanitation.girlsLatrines || ''}
                      onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, girlsLatrines: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-slate-500 text-[11px] block">កំពុងដំណើរការ</span>
                    <input
                      type="number"
                      min={0}
                      value={waterSanitation.functioningLatrines || ''}
                      onChange={(e) => onChangeWaterSanitation({ ...waterSanitation, functioningLatrines: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-cyan-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 3. Deworming, Poor Students & Disabilities */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <HeartHandshake className="w-4 h-4 text-rose-600" />
                <h3 className="font-bold text-slate-800 text-sm">៣. ទម្លាក់ព្រូន សិស្សក្រីក្រ និងពិការភាព</h3>
              </div>
              <button
                onClick={handleAutoSyncDeworming}
                className="text-[11px] flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200 cursor-pointer"
                title="កំណត់គោលដៅស្មើនឹងចំនួនសិស្សតារាង១"
              >
                <Sparkles className="w-3 h-3 text-rose-600" />
                ធ្វើបច្ចុប្បន្នភាពគោលដៅ
              </button>
            </div>

            <div className="p-4 space-y-4 text-xs">
              {/* Deworming Rounds */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50 space-y-2">
                <div className="font-semibold text-slate-700 flex items-center justify-between">
                  <span>កម្មវិធីទម្លាក់ថ្នាំព្រូនប្រចាំឆ្នាំ (សុខភាពសិក្សា)</span>
                  <span className="text-[11px] text-slate-500">គោលដៅសិស្សសរុប៖ {toKhmerNum(t1TotalStudents)}</span>
                </div>

                {/* Round 1 */}
                <div className="grid grid-cols-4 gap-2 items-center text-xs">
                  <span className="font-medium text-slate-700">ជុំទី ១ (ឆមាស១):</span>
                  <div>
                    <span className="text-[10px] text-slate-500 block">គោលដៅ</span>
                    <input
                      type="number"
                      min={0}
                      value={healthSocial.dewormingRound1.target || ''}
                      onChange={(e) =>
                        onChangeHealthSocial({
                          ...healthSocial,
                          dewormingRound1: { ...healthSocial.dewormingRound1, target: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ទទួលសរុប</span>
                    <input
                      type="number"
                      min={0}
                      value={healthSocial.dewormingRound1.receivedTotal || ''}
                      onChange={(e) =>
                        onChangeHealthSocial({
                          ...healthSocial,
                          dewormingRound1: { ...healthSocial.dewormingRound1, receivedTotal: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-rose-700"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-500 block">ស្រី</span>
                    <input
                      type="number"
                      min={0}
                      value={healthSocial.dewormingRound1.receivedFemale || ''}
                      onChange={(e) =>
                        onChangeHealthSocial({
                          ...healthSocial,
                          dewormingRound1: { ...healthSocial.dewormingRound1, receivedFemale: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>

                {/* Round 2 */}
                <div className="grid grid-cols-4 gap-2 items-center text-xs pt-1">
                  <span className="font-medium text-slate-700">ជុំទី ២ (ឆមាស២):</span>
                  <div>
                    <input
                      type="number"
                      min={0}
                      value={healthSocial.dewormingRound2.target || ''}
                      onChange={(e) =>
                        onChangeHealthSocial({
                          ...healthSocial,
                          dewormingRound2: { ...healthSocial.dewormingRound2, target: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min={0}
                      value={healthSocial.dewormingRound2.receivedTotal || ''}
                      onChange={(e) =>
                        onChangeHealthSocial({
                          ...healthSocial,
                          dewormingRound2: { ...healthSocial.dewormingRound2, receivedTotal: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-semibold text-rose-700"
                    />
                  </div>
                  <div>
                    <input
                      type="number"
                      min={0}
                      value={healthSocial.dewormingRound2.receivedFemale || ''}
                      onChange={(e) =>
                        onChangeHealthSocial({
                          ...healthSocial,
                          dewormingRound2: { ...healthSocial.dewormingRound2, receivedFemale: parseInt(e.target.value) || 0 },
                        })
                      }
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>

              {/* Social Equity: IDPoor and Scholarships */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="border border-slate-200 rounded-lg p-2.5">
                  <span className="font-semibold text-slate-700 block mb-1.5">ក្រីក្រកម្រិត ១ (ក្រ១)</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <span className="text-[10px] text-slate-500 block">សរុប</span>
                      <input
                        type="number"
                        min={0}
                        value={healthSocial.idPoor1.total || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            idPoor1: { ...healthSocial.idPoor1, total: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ស្រី</span>
                      <input
                        type="number"
                        min={0}
                        value={healthSocial.idPoor1.female || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            idPoor1: { ...healthSocial.idPoor1, female: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-2.5">
                  <span className="font-semibold text-slate-700 block mb-1.5">ក្រីក្រកម្រិត ២ (ក្រ២)</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <span className="text-[10px] text-slate-500 block">សរុប</span>
                      <input
                        type="number"
                        min={0}
                        value={healthSocial.idPoor2.total || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            idPoor2: { ...healthSocial.idPoor2, total: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ស្រី</span>
                      <input
                        type="number"
                        min={0}
                        value={healthSocial.idPoor2.female || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            idPoor2: { ...healthSocial.idPoor2, female: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>

                <div className="border border-slate-200 rounded-lg p-2.5">
                  <span className="font-semibold text-slate-700 block mb-1.5">ទទួលអាហារូបករណ៍</span>
                  <div className="grid grid-cols-2 gap-1.5">
                    <div>
                      <span className="text-[10px] text-slate-500 block">សរុប</span>
                      <input
                        type="number"
                        min={0}
                        value={healthSocial.scholarships.total || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            scholarships: { ...healthSocial.scholarships, total: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs font-medium text-emerald-700"
                      />
                    </div>
                    <div>
                      <span className="text-[10px] text-slate-500 block">ស្រី</span>
                      <input
                        type="number"
                        min={0}
                        value={healthSocial.scholarships.female || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            scholarships: { ...healthSocial.scholarships, female: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>

              {/* Disabilities Breakdown */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <div className="font-semibold text-slate-700 mb-2 flex items-center justify-between">
                  <span>សិស្សមានពិការភាព (បរិយាបន្នអប់រំ)</span>
                  <span className="text-rose-700 font-bold">
                    សរុប {toKhmerNum(totalDisabled)} នាក់ (ស្រី {toKhmerNum(totalDisabledFemale)})
                  </span>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block">កាយសម្បទា (សរុប/ស្រី)</span>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={0}
                        placeholder="សរុប"
                        value={healthSocial.disabledPhysical.total || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledPhysical: { ...healthSocial.disabledPhysical, total: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="ស្រី"
                        value={healthSocial.disabledPhysical.female || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledPhysical: { ...healthSocial.disabledPhysical, female: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">គំហើញ (សរុប/ស្រី)</span>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={0}
                        placeholder="សរុប"
                        value={healthSocial.disabledVisual.total || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledVisual: { ...healthSocial.disabledVisual, total: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="ស្រី"
                        value={healthSocial.disabledVisual.female || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledVisual: { ...healthSocial.disabledVisual, female: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">សោតវិញ្ញាណ (សរុប/ស្រី)</span>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={0}
                        placeholder="សរុប"
                        value={healthSocial.disabledHearing.total || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledHearing: { ...healthSocial.disabledHearing, total: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="ស្រី"
                        value={healthSocial.disabledHearing.female || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledHearing: { ...healthSocial.disabledHearing, female: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[11px] text-slate-500 block">សតិបញ្ញា (សរុប/ស្រី)</span>
                    <div className="flex gap-1">
                      <input
                        type="number"
                        min={0}
                        placeholder="សរុប"
                        value={healthSocial.disabledIntellectual.total || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledIntellectual: { ...healthSocial.disabledIntellectual, total: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                      <input
                        type="number"
                        min={0}
                        placeholder="ស្រី"
                        value={healthSocial.disabledIntellectual.female || ''}
                        onChange={(e) =>
                          onChangeHealthSocial({
                            ...healthSocial,
                            disabledIntellectual: { ...healthSocial.disabledIntellectual, female: parseInt(e.target.value) || 0 },
                          })
                        }
                        className="w-1/2 bg-white border border-slate-300 rounded px-1.5 py-1 text-xs"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* 4. Finance & Program Budget (PB) */}
          <section className="bg-white border border-slate-200 rounded-xl shadow-xs overflow-hidden">
            <div className="bg-slate-50 border-b border-slate-200 px-4 py-3 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <DollarSign className="w-4 h-4 text-emerald-600" />
                <h3 className="font-bold text-slate-800 text-sm">៤. ថវិកាដំណើរការសាលា (Program Budget - PB)</h3>
              </div>
              <span className="text-xs bg-emerald-50 text-emerald-700 px-2 py-0.5 rounded-md border border-emerald-200 font-medium">
                ហិរញ្ញវត្ថុសាលា
              </span>
            </div>

            <div className="p-4 space-y-3 text-xs">
              {/* Budget Balance Banner */}
              <div className="grid grid-cols-3 gap-2 bg-emerald-50/70 border border-emerald-100 rounded-lg p-3 text-center">
                <div>
                  <span className="text-slate-500 text-[11px] block">ថវិកាបានទទួល</span>
                  <span className="font-bold text-slate-800 text-xs sm:text-sm">
                    {toKhmerNum(Number(finance.budgetReceivedPB || 0).toLocaleString())} ៛
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">បានចំណាយជាក់ស្តែង</span>
                  <span className="font-bold text-emerald-800 text-xs sm:text-sm">
                    {toKhmerNum(Number(finance.budgetExpendedPB || 0).toLocaleString())} ៛
                  </span>
                </div>
                <div>
                  <span className="text-slate-500 text-[11px] block">សមតុល្យនៅសល់</span>
                  <span className={`font-bold text-xs sm:text-sm ${budgetBalance >= 0 ? 'text-blue-700' : 'text-rose-700'}`}>
                    {toKhmerNum(budgetBalance.toLocaleString())} ៛
                  </span>
                </div>
              </div>

              {/* Inputs */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ថវិកាគ្រោងសរុប (រៀល)</label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={finance.budgetPlanPB || ''}
                    onChange={(e) => onChangeFinance({ ...finance, budgetPlanPB: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
                <div>
                  <label className="block text-slate-600 font-medium mb-1">ថវិកាបានទទួលជាក់ស្តែង (រៀល)</label>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={finance.budgetReceivedPB || ''}
                    onChange={(e) => onChangeFinance({ ...finance, budgetReceivedPB: parseInt(e.target.value) || 0 })}
                    className="w-full bg-white border border-slate-300 rounded-md px-2.5 py-1.5 text-xs focus:ring-2 focus:ring-emerald-500 outline-hidden"
                  />
                </div>
              </div>

              {/* Major Expenditure Categories */}
              <div className="border border-slate-200 rounded-lg p-3 bg-slate-50/50">
                <span className="font-semibold text-slate-700 block mb-2">ការបែងចែកចំណាយចម្បងៗ</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  <div>
                    <span className="text-[11px] text-slate-500 block">សម្ភារៈឧបទេសបង្រៀន</span>
                    <input
                      type="number"
                      min={0}
                      step={100000}
                      value={finance.materialsExpended || ''}
                      onChange={(e) => onChangeFinance({ ...finance, materialsExpended: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">ជួសជុល និងកែលម្អ</span>
                    <input
                      type="number"
                      min={0}
                      step={100000}
                      value={finance.repairsExpended || ''}
                      onChange={(e) => onChangeFinance({ ...finance, repairsExpended: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500 block">អនាម័យ និងសុខភាព</span>
                    <input
                      type="number"
                      min={0}
                      step={100000}
                      value={finance.hygieneExpended || ''}
                      onChange={(e) => onChangeFinance({ ...finance, hygieneExpended: parseInt(e.target.value) || 0 })}
                      className="w-full bg-white border border-slate-300 rounded px-2 py-1 text-xs"
                    />
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}

      {/* Navigation Footers / Quick Actions */}
      <div className="no-print bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div className="flex items-center gap-3">
          {onNavigateToPartA && (
            <button
              onClick={onNavigateToPartA}
              className="cursor-pointer flex items-center gap-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium px-3 py-2 rounded-lg border border-slate-700 transition-colors whitespace-nowrap"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>ត្រឡប់ទៅផ្នែក A</span>
            </button>
          )}
          <div>
            <h4 className="font-bold text-sm flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-emerald-400" />
              ទិន្នន័យផ្នែក A និងផ្នែក B ត្រូវបានផ្គុំរួចរាល់!
            </h4>
            <p className="text-xs text-slate-300 mt-0.5">
              លោកអ្នកអាចបោះពុម្ពតារាងផ្លូវការ A4 ឬបន្តទៅពិនិត្យ <strong>របាយការណ៍លម្អិតផ្លូវការ (Master Report)</strong>។
            </p>
          </div>
        </div>

        {onNavigateToMaster && (
          <button
            id="btn-part-b-to-master"
            onClick={onNavigateToMaster}
            className="cursor-pointer flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors whitespace-nowrap"
          >
            <span>ទៅកាន់របាយការណ៍បូកសរុប (Master Report)</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
};
