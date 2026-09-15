import React from 'react';
import {
  Table1SchoolRooms,
  Table1Staff,
  LibraryData,
  WaterSanitationData,
  HealthSocialData,
  SchoolFinanceData,
} from '../types';
import { formatPct } from '../data/initialData';
import { toKhmerNum } from '../utils/khmerNumbers';
import {
  BookOpen,
  Droplets,
  HeartHandshake,
  DollarSign,
  Users,
  CheckCircle2,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';

interface PartBViewProps {
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
  onNavigateToMaster: () => void;
}

export const PartBView: React.FC<PartBViewProps> = ({
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
}) => {
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

  // Budget balance
  const budgetBalance =
    (Number(finance.budgetReceivedPB) || 0) - (Number(finance.budgetExpendedPB) || 0);

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

  // Student-to-toilet ratio
  const functioningToilets = Math.max(1, Number(waterSanitation.functioningLatrines) || 1);
  const studentsPerToilet = Math.round(t1TotalStudents / functioningToilets);

  return (
    <div className="space-y-6">
      {/* Flow Banner: Automatic Flow from Part A */}
      <div className="bg-gradient-to-r from-teal-50 via-emerald-50 to-blue-50 border border-teal-200 rounded-xl p-4 shadow-2xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-lg bg-teal-600 text-white flex items-center justify-center font-bold text-base shadow-xs shrink-0">
              B
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-base font-bold text-slate-800 font-moul text-sm sm:text-base">
                  ផ្នែក B ៖ ស្ថិតិឯកទេស និងសង្គម
                </h2>
                <span className="inline-flex items-center gap-1 text-[11px] font-medium bg-emerald-100 text-emerald-800 px-2 py-0.5 rounded-full border border-emerald-300">
                  <Sparkles className="w-3 h-3 text-emerald-600" />
                  រត់ស្វ័យប្រវត្តិពីផ្នែក A
                </span>
              </div>
              <p className="text-xs text-slate-600 mt-0.5">
                ទិន្នន័យបុគ្គលិក បណ្ណាល័យ ទឹកស្អាត-អនាម័យ ការទម្លាក់ព្រូន សិស្សក្រីក្រ ពិការភាព និងថវិកាដំណើរការសាលា (PB)
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 text-xs bg-white/80 backdrop-blur-xs px-3 py-1.5 rounded-lg border border-teal-200 text-slate-700">
            <span>
              សិស្សមូលដ្ឋានផ្នែក A: <strong>{toKhmerNum(t1TotalStudents)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(t1TotalFemale)}</strong>)
            </span>
            <span className="text-slate-300">|</span>
            <span>
              បុគ្គលិកសរុប: <strong>{toKhmerNum(totalStaff)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(totalStaffFemale)}</strong>)
            </span>
          </div>
        </div>
      </div>

      {/* Grid of Part B Modules */}
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
                    សរុប {toKhmerNum(Number(library.storyBooks) + Number(library.textBooks) + Number(library.teacherGuides))} ក្បាល
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
              className="text-[11px] flex items-center gap-1 bg-rose-50 text-rose-700 hover:bg-rose-100 px-2 py-0.5 rounded-md border border-rose-200"
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
                  {toKhmerNum(finance.budgetReceivedPB.toLocaleString())} ៛
                </span>
              </div>
              <div>
                <span className="text-slate-500 text-[11px] block">បានចំណាយជាក់ស្តែង</span>
                <span className="font-bold text-emerald-800 text-xs sm:text-sm">
                  {toKhmerNum(finance.budgetExpendedPB.toLocaleString())} ៛
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

      {/* Next Step CTA: Go to Master Aggregated Report */}
      <div className="no-print bg-slate-900 text-white rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-md">
        <div>
          <h4 className="font-bold text-sm flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
            ទិន្នន័យផ្នែក A និងផ្នែក B ត្រូវបានផ្គុំរួចរាល់!
          </h4>
          <p className="text-xs text-slate-300 mt-0.5">
            ចុចប៊ូតុងខាងស្តាំដើម្បីពិនិត្យ <strong>របាយការណ៍លម្អិតផ្លូវការ (Master Report) ៧ផ្នែកពេញលេញ</strong> និងបោះពុម្ព A4 ភ្លាមៗ។
          </p>
        </div>

        <button
          onClick={onNavigateToMaster}
          className="cursor-pointer flex items-center gap-2 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold px-4 py-2.5 rounded-lg shadow-xs transition-colors whitespace-nowrap"
        >
          <span>ទៅកាន់របាយការណ៍លម្អិតផ្លូវការ</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
