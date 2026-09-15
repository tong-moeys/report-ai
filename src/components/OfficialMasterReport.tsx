import React, { useState } from 'react';
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
} from '../types';
import { formatPct } from '../data/initialData';
import { toKhmerNum } from '../utils/khmerNumbers';
import {
  Printer,
  Sparkles,
  Download,
  Edit3,
  CheckCircle2,
  FileText,
  ShieldCheck,
  Building,
  GraduationCap,
  Heart,
  BookOpen,
  Award,
  AlertTriangle,
  Send,
  Loader2,
} from 'lucide-react';

interface OfficialMasterReportProps {
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
  onChangeNarrative: (narrative: MasterReportNarrative) => void;
  onExportExcel: () => void;
  onOpenAiMoeysModal?: () => void;
}

export const OfficialMasterReport: React.FC<OfficialMasterReportProps> = ({
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
  onChangeNarrative,
  onExportExcel,
  onOpenAiMoeysModal,
}) => {
  const [isEditingNarrative, setIsEditingNarrative] = useState(false);
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSuccessMessage, setAiSuccessMessage] = useState<string | null>(null);

  // --- Aggregate Computations ---
  const gradesKeys: Array<keyof Pick<Table1SchoolRooms, 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'>> = [
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6'
  ];
  const t1TotalClasses = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].classes) || 0), 0);
  const t1TotalStudents = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].total) || 0), 0);
  const t1TotalFemale = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].female) || 0), 0);
  const totalRooms = (Number(t1Rooms.teachingRooms) || 0) + (Number(t1Rooms.otherRooms) || 0);

  // Staff
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

  // Academic Results Table 2
  const t2TotalPassed = t2Rows.reduce((a, r) => a + (Number(r.passedAvgTotal) || 0), 0);
  const t2TotalPassedFem = t2Rows.reduce((a, r) => a + (Number(r.passedAvgFemale) || 0), 0);
  const t2TotalFailed = t2Rows.reduce((a, r) => a + (Number(r.failedAvgTotal) || 0), 0);
  const t2TotalFailedFem = t2Rows.reduce((a, r) => a + (Number(r.failedAvgFemale) || 0), 0);
  const t2TotalDropouts = t2Rows.reduce((a, r) => a + (Number(r.dropoutTotal) || 0), 0);
  const t2TotalDropoutsFem = t2Rows.reduce((a, r) => a + (Number(r.dropoutFemale) || 0), 0);

  // Table 4 Year-End Aggregates
  const t4TotalFinalPassed = t4Rows.reduce(
    (a, r) => a + (Number(r.passedAvgTotal) || 0) + (Number(r.passedRetestTotal) || 0),
    0
  );
  const t4TotalFinalPassedFem = t4Rows.reduce(
    (a, r) => a + (Number(r.passedAvgFemale) || 0) + (Number(r.passedRetestFemale) || 0),
    0
  );
  const t4TotalRepeaters = t4Rows.reduce((a, r) => a + (Number(r.repeatersTotal) || 0), 0);
  const t4TotalRepeatersFem = t4Rows.reduce((a, r) => a + (Number(r.repeatersFemale) || 0), 0);
  const t4TotalDropouts = t4Rows.reduce((a, r) => a + (Number(r.dropoutsTotal) || 0), 0);
  const t4TotalDropoutsFem = t4Rows.reduce((a, r) => a + (Number(r.dropoutsFemale) || 0), 0);

  // Rates
  const overallPassRate = formatPct(t4TotalFinalPassed, t1TotalStudents);
  const overallFemalePassRate = formatPct(t4TotalFinalPassedFem, t1TotalFemale);
  const overallDropoutRate = formatPct(t4TotalDropouts, t1TotalStudents);
  const overallRepeatRate = formatPct(t4TotalRepeaters, t1TotalStudents);

  // Deworming rates
  const dewormingR1Pct = formatPct(
    healthSocial.dewormingRound1.receivedTotal,
    healthSocial.dewormingRound1.target || t1TotalStudents
  );
  const dewormingR2Pct = formatPct(
    healthSocial.dewormingRound2.receivedTotal,
    healthSocial.dewormingRound2.target || t1TotalStudents
  );

  // Total disabled
  const totalDisabled =
    (Number(healthSocial.disabledPhysical.total) || 0) +
    (Number(healthSocial.disabledVisual.total) || 0) +
    (Number(healthSocial.disabledHearing.total) || 0) +
    (Number(healthSocial.disabledIntellectual.total) || 0);
  const totalDisabledFem =
    (Number(healthSocial.disabledPhysical.female) || 0) +
    (Number(healthSocial.disabledVisual.female) || 0) +
    (Number(healthSocial.disabledHearing.female) || 0) +
    (Number(healthSocial.disabledIntellectual.female) || 0);

  // Handle AI Executive Summary Generation
  const handleGenerateAiConclusion = async () => {
    setIsAiLoading(true);
    setAiSuccessMessage(null);
    try {
      const payload = {
        report: {
          info: {
            schoolName: meta.schoolName,
            academicYear: meta.academicYear,
            districtOffice: meta.clusterOrDistrict,
            cluster: meta.clusterOrDistrict,
            partnerNGOs: narrative.community.partnerNGOs,
          },
          students: {
            overall: { total: t1TotalStudents, female: t1TotalFemale },
          },
          staff: {
            overallStaff: { total: totalStaff, female: totalStaffFemale },
          },
          academicResults: t4Rows.map((r) => ({
            finalPassedTotal: (Number(r.passedAvgTotal) || 0) + (Number(r.passedRetestTotal) || 0),
            finalPassedFemale: (Number(r.passedAvgFemale) || 0) + (Number(r.passedRetestFemale) || 0),
            dropoutTotal: r.dropoutsTotal,
            repeaterTotal: r.repeatersTotal,
          })),
          health: {
            deworming: {
              rounds: [
                { total: healthSocial.dewormingRound1.receivedTotal },
                { total: healthSocial.dewormingRound2.receivedTotal },
              ],
            },
          },
          conclusion: {
            challenges: narrative.challenges.challenges,
          },
        },
      };

      const res = await fetch('/api/ai/executive-summary', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error('ការស្នើសុំមិនបានជោគជ័យ');
      }

      const data = await res.json();
      if (data.executiveSummary) {
        onChangeNarrative({
          ...narrative,
          conclusion: {
            ...narrative.conclusion,
            executiveSummary: data.executiveSummary,
            keyAchievements: Array.isArray(data.keyAchievements) && data.keyAchievements.length > 0
              ? data.keyAchievements
              : narrative.conclusion.keyAchievements,
            challengesToResolve: data.challengesToResolve || narrative.conclusion.challengesToResolve,
          },
        });
        setAiSuccessMessage('ជំនួយការ AI បានរៀបរៀងសេចក្ដីសន្និដ្ឋានផ្លូវការជូនលោកអ្នករួចរាល់!');
        setTimeout(() => setAiSuccessMessage(null), 4000);
      }
    } catch (err: any) {
      console.error('AI summary error:', err);
      // Generate intelligent client-side fallback synthesis
      const fallbackSummary = `ឆ្លងកាត់ការអនុវត្តផែនការប្រតិបត្តិប្រចាំឆ្នាំសិក្សា ${meta.academicYear} កន្លងមកនេះ ${meta.schoolName} សម្រេចបាននូវលទ្ធផលគួរជាទីមោទនៈ ស្របតាមគោលនយោបាយកំណែទម្រង់វិស័យអប់រំរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។

ទិដ្ឋភាពទូទៅនៃស្ថិតិសិស្ស និងលទ្ធផលសិក្សា៖ សាលាមានសិស្សសរុបចំនួន ${toKhmerNum(t1TotalStudents)} នាក់ (ស្រី ${toKhmerNum(t1TotalFemale)} នាក់) ក្នុងនោះសិស្សឡើងថ្នាក់ចុងឆ្នាំសរុបមាន ${toKhmerNum(t4TotalFinalPassed)} នាក់ ស្មើនឹង ${overallPassRate} (សិស្សស្រី ${toKhmerNum(t4TotalFinalPassedFem)} នាក់ ស្មើនឹង ${overallFemalePassRate})។ អត្រាសិស្សបោះបង់ការសិក្សាស្ថិតក្នុងកម្រិតទាបត្រឹម ${overallDropoutRate} (${toKhmerNum(t4TotalDropouts)} នាក់)។

ការងារគរុកោសល្យ និងសុខភាពសិក្សា៖ គណៈគ្រប់គ្រង និងលោកគ្រូអ្នកគ្រូចំនួន ${toKhmerNum(totalStaff)} នាក់ (ស្រី ${toKhmerNum(totalStaffFemale)} នាក់) បានបំពេញការងារយ៉ាងសកម្ម។ ការអនុវត្តកម្មវិធីសុខភាពសិក្សា និងការទម្លាក់ថ្នាំព្រូនសម្រេចបាន ${dewormingR1Pct} ក្នុងជុំទី១ និង ${dewormingR2Pct} ក្នុងជុំទី២។ សាលារក្សាបាននូវបរិស្ថានសិក្សាស្អាត បៃតង និងមានសុវត្ថិភាព។`;

      onChangeNarrative({
        ...narrative,
        conclusion: {
          ...narrative.conclusion,
          executiveSummary: fallbackSummary,
        },
      });
      setAiSuccessMessage('បានបង្កើតសេចក្ដីសន្និដ្ឋានស្វ័យប្រវត្តតាមទិន្នន័យជាក់ស្តែងរួចរាល់!');
      setTimeout(() => setAiSuccessMessage(null), 4000);
    } finally {
      setIsAiLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Non-Print Control Toolbar */}
      <div className="no-print bg-white border border-slate-200 rounded-xl p-3 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold text-xs">
            A+B
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">របាយការណ៍លម្អិតផ្លូវការ (Official Master Report)</h3>
            <p className="text-[11px] text-slate-500">
              ផ្គុំទិន្នន័យរួមពីផ្នែក A និងផ្នែក B ពេញលេញ ៧ផ្នែក ស្តង់ដាក្រសួងអប់រំ យុវជន និងកីឡា
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          <button
            onClick={() => setIsEditingNarrative(!isEditingNarrative)}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-colors ${
              isEditingNarrative
                ? 'bg-blue-50 text-blue-700 border-blue-300'
                : 'bg-white text-slate-700 border-slate-300 hover:bg-slate-50'
            }`}
          >
            <Edit3 className="w-3.5 h-3.5" />
            <span>{isEditingNarrative ? 'បិទការកែសម្រួល' : 'កែសម្រួលអត្ថបទបូកសរុប'}</span>
          </button>

          {onOpenAiMoeysModal && (
            <button
              onClick={onOpenAiMoeysModal}
              className="flex items-center gap-1.5 bg-gradient-to-r from-purple-600 via-indigo-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-all cursor-pointer"
              title="វិភាគរបាយការណ៍ MoEYS ពេញលេញតាម AI"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>AI វិភាគរបាយការណ៍ MoEYS</span>
            </button>
          )}

          <button
            onClick={handleGenerateAiConclusion}
            disabled={isAiLoading}
            className="flex items-center gap-1.5 bg-purple-100 text-purple-800 hover:bg-purple-200 border border-purple-300 px-3 py-1.5 rounded-lg text-xs font-semibold shadow-2xs disabled:opacity-50 transition-all cursor-pointer"
            title="ប្រើប្រាស់បញ្ញាសិប្បនិម្មិតដើម្បីចងក្រងសេចក្តីសន្និដ្ឋាន"
          >
            {isAiLoading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Sparkles className="w-3.5 h-3.5 text-purple-600" />}
            <span>{isAiLoading ? 'កំពុងសរសេរ...' : 'AI សេចក្តីសន្និដ្ឋាន'}</span>
          </button>

          <button
            onClick={onExportExcel}
            className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white px-3 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel (.xls)</span>
          </button>

          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 rounded-lg text-xs font-semibold shadow-xs transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ព A4 ភ្លាមៗ</span>
          </button>
        </div>
      </div>

      {/* AI Success Toast */}
      {aiSuccessMessage && (
        <div className="no-print p-3 bg-emerald-50 border border-emerald-200 text-emerald-800 rounded-xl text-xs flex items-center gap-2 animate-fadeIn">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>{aiSuccessMessage}</span>
        </div>
      )}

      {/* Narrative Editor Drawer (When toggled) */}
      {isEditingNarrative && (
        <div className="no-print bg-slate-50 border border-slate-300 rounded-xl p-4 space-y-4 text-xs">
          <div className="flex items-center justify-between border-b border-slate-200 pb-2">
            <h4 className="font-bold text-slate-800 text-sm flex items-center gap-2">
              <Edit3 className="w-4 h-4 text-blue-600" />
              កែសម្រួលផ្នែកទី IV ដល់ VII (អធិការកិច្ច, សហគមន៍, បញ្ហាប្រឈម & សន្និដ្ឋាន)
            </h4>
            <button onClick={() => setIsEditingNarrative(false)} className="text-slate-500 hover:text-slate-800">
              រួចរាល់ ✕
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* IV. Management & Inspection */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">ផ្នែក IV ៖ ការគ្រប់គ្រង និងអធិការកិច្ច</span>
              <div className="grid grid-cols-3 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">ប្រជុំ PLC (ដង)</span>
                  <input
                    type="number"
                    min={0}
                    value={narrative.management.plcMeetingsCount}
                    onChange={(e) =>
                      onChangeNarrative({
                        ...narrative,
                        management: { ...narrative.management, plcMeetingsCount: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">សង្កេតបង្រៀន (ដង)</span>
                  <input
                    type="number"
                    min={0}
                    value={narrative.management.classObservationsCount}
                    onChange={(e) =>
                      onChangeNarrative({
                        ...narrative,
                        management: { ...narrative.management, classObservationsCount: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">អធិការកិច្ច (ដង)</span>
                  <input
                    type="number"
                    min={0}
                    value={narrative.management.internalInspectionVisits}
                    onChange={(e) =>
                      onChangeNarrative({
                        ...narrative,
                        management: { ...narrative.management, internalInspectionVisits: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">សង្ខេបលទ្ធផលគ្រប់គ្រង</span>
                <textarea
                  rows={2}
                  value={narrative.management.summary}
                  onChange={(e) =>
                    onChangeNarrative({
                      ...narrative,
                      management: { ...narrative.management, summary: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
            </div>

            {/* V. Community Engagement */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">ផ្នែក V ៖ ការចូលរួមរបស់សហគមន៍ & គណៈកម្មការ (SSC)</span>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <span className="text-slate-500 text-[10px] block">ប្រជុំ SSC (ដង)</span>
                  <input
                    type="number"
                    min={0}
                    value={narrative.community.sscMeetingsCount}
                    onChange={(e) =>
                      onChangeNarrative({
                        ...narrative,
                        community: { ...narrative.community, sscMeetingsCount: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                  />
                </div>
                <div>
                  <span className="text-slate-500 text-[10px] block">ថវិកាសហគមន៍ចូលរួម (រៀល)</span>
                  <input
                    type="number"
                    min={0}
                    step={100000}
                    value={narrative.community.communityContributionAmount}
                    onChange={(e) =>
                      onChangeNarrative({
                        ...narrative,
                        community: { ...narrative.community, communityContributionAmount: parseInt(e.target.value) || 0 },
                      })
                    }
                    className="w-full border border-slate-300 rounded px-2 py-1 text-xs"
                  />
                </div>
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">អង្គការដៃគូ និងសកម្មភាពរួម</span>
                <textarea
                  rows={2}
                  value={narrative.community.communitySummary}
                  onChange={(e) =>
                    onChangeNarrative({
                      ...narrative,
                      community: { ...narrative.community, communitySummary: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
            </div>

            {/* VI. Challenges & Solutions */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">ផ្នែក VI ៖ បញ្ហាប្រឈម និងដំណោះស្រាយ</span>
              <div>
                <span className="text-slate-500 text-[10px] block">បញ្ហាប្រឈមចម្បងៗ</span>
                <textarea
                  rows={2}
                  value={narrative.challenges.challenges}
                  onChange={(e) =>
                    onChangeNarrative({
                      ...narrative,
                      challenges: { ...narrative.challenges, challenges: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">វិធានការដោះស្រាយ</span>
                <textarea
                  rows={2}
                  value={narrative.challenges.solutions}
                  onChange={(e) =>
                    onChangeNarrative({
                      ...narrative,
                      challenges: { ...narrative.challenges, solutions: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
            </div>

            {/* VII. Conclusion & Requests */}
            <div className="bg-white p-3 rounded-lg border border-slate-200 space-y-2">
              <span className="font-bold text-slate-800 block">ផ្នែក VII ៖ សេចក្ដីសន្និដ្ឋាន និងសំណូមពរ</span>
              <div>
                <span className="text-slate-500 text-[10px] block">សេចក្តីសន្និដ្ឋានរួម</span>
                <textarea
                  rows={3}
                  value={narrative.conclusion.executiveSummary}
                  onChange={(e) =>
                    onChangeNarrative({
                      ...narrative,
                      conclusion: { ...narrative.conclusion, executiveSummary: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
              <div>
                <span className="text-slate-500 text-[10px] block">សំណូមពរទៅការិយាល័យអប់រំ និងក្រសួង</span>
                <textarea
                  rows={2}
                  value={narrative.conclusion.requestsToDistrict}
                  onChange={(e) =>
                    onChangeNarrative({
                      ...narrative,
                      conclusion: { ...narrative.conclusion, requestsToDistrict: e.target.value },
                    })
                  }
                  className="w-full border border-slate-300 rounded p-1.5 text-xs"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =========================================================================
          OFFICIAL MASTER REPORT PRINTABLE CONTAINER (A4 FORMAT)
          ========================================================================= */}
      <article className="bg-white border border-slate-300 rounded-xl shadow-lg p-6 sm:p-10 max-w-5xl mx-auto print:border-none print:shadow-none print:p-0 text-slate-900 leading-relaxed font-kantumruy">
        {/* Official Kingdom Header */}
        <header className="border-b-2 border-slate-800 pb-4 mb-6">
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Left: Ministry Hierarchy */}
            <div className="text-center sm:text-left text-xs sm:text-sm space-y-1">
              <div className="font-bold uppercase tracking-wider text-slate-800">
                ក្រសួងអប់រំ យុវជន និងកីឡា
              </div>
              <div className="text-slate-700">
                {meta.province || 'មន្ទីរអប់រំ យុវជន និងកីឡា'}
              </div>
              <div className="text-slate-700">
                {meta.clusterOrDistrict || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}
              </div>
              <div className="font-bold text-blue-900 text-sm sm:text-base">
                {meta.schoolName || 'សាលាបឋមសិក្សា'}
              </div>
            </div>

            {/* Right: National Kingdom Emblem */}
            <div className="text-center">
              <h2 className="font-moul text-base sm:text-lg text-slate-900 tracking-wide">
                ព្រះរាជាណាចក្រកម្ពុជា
              </h2>
              <div className="font-moul text-xs sm:text-sm text-amber-800 mt-1">
                ជាតិ សាសនា ព្រះមហាក្សត្រ
              </div>
              <div className="text-xs text-slate-400 mt-0.5">~~~ ✤ ~~~</div>
            </div>
          </div>

          {/* Master Report Title */}
          <div className="text-center mt-6">
            <h1 className="font-moul text-base sm:text-xl text-slate-900 leading-relaxed">
              របាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំ និងស្ថិតិសាលារៀន
            </h1>
            <p className="text-xs sm:text-sm font-semibold text-slate-700 mt-1">
              ឆ្នាំសិក្សា {meta.academicYear} (ទិន្នន័យផ្ទៀងផ្ទាត់ផ្លូវការ)
            </p>
          </div>
        </header>

        {/* Master Content: 7 Chapters */}
        <div className="space-y-8 text-xs sm:text-sm">
          {/* ផ្នែកទី I: ស្ថានភាពទូទៅ */}
          <section className="space-y-3">
            <h2 className="font-bold text-sm sm:text-base text-blue-900 border-b border-blue-200 pb-1 flex items-center gap-2">
              <Building className="w-4 h-4 text-blue-700 no-print" />
              <span>ផ្នែកទី I ៖ ស្ថានភាពទូទៅ (សិស្ស បន្ទប់ អគារ គ្រូ និងហិរញ្ញវត្ថុ)</span>
            </h2>

            {/* 1.1 Infrastructure & Students */}
            <div className="space-y-2">
              <h3 className="font-semibold text-slate-800">១. ស្ថិតិហេដ្ឋារចនាសម្ព័ន្ធ និងសិស្សានុសិស្ស (ពីផ្នែក A)</h3>
              <p className="text-slate-700 leading-relaxed">
                សាលារៀនមានអគារសិក្សាសរុបចំនួន <strong>{toKhmerNum(t1Rooms.buildings)}</strong> ខ្នង មានបន្ទប់សរុបចំនួន <strong>{toKhmerNum(totalRooms)}</strong> បន្ទប់ (ក្នុងនោះបន្ទប់បង្រៀនចំនួន <strong>{toKhmerNum(t1Rooms.teachingRooms)}</strong> បន្ទប់ និងបន្ទប់ផ្សេងៗចំនួន <strong>{toKhmerNum(t1Rooms.otherRooms)}</strong> បន្ទប់)។
                ដំណើរការបង្រៀនសរុបមានចំនួន <strong>{toKhmerNum(t1TotalClasses)}</strong> ថ្នាក់ ចាប់ពីថ្នាក់ទី១ ដល់ថ្នាក់ទី៦ ដែលមានសិស្សានុសិស្សសរុបចំនួន <strong>{toKhmerNum(t1TotalStudents)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(t1TotalFemale)}</strong> នាក់ ស្មើនឹង <strong>{formatPct(t1TotalFemale, t1TotalStudents)}</strong>)។
              </p>

              {/* Mini Table of Grade Breakdown */}
              <div className="overflow-x-auto my-2">
                <table className="w-full border-collapse border border-slate-300 text-center text-xs">
                  <thead>
                    <tr className="bg-slate-100 text-slate-800">
                      <th className="border border-slate-300 py-1 px-2 font-semibold">កម្រិតថ្នាក់</th>
                      <th className="border border-slate-300 py-1 px-2">ថ្នាក់ទី១</th>
                      <th className="border border-slate-300 py-1 px-2">ថ្នាក់ទី២</th>
                      <th className="border border-slate-300 py-1 px-2">ថ្នាក់ទី៣</th>
                      <th className="border border-slate-300 py-1 px-2">ថ្នាក់ទី៤</th>
                      <th className="border border-slate-300 py-1 px-2">ថ្នាក់ទី៥</th>
                      <th className="border border-slate-300 py-1 px-2">ថ្នាក់ទី៦</th>
                      <th className="border border-slate-300 py-1 px-2 bg-blue-50 font-bold">សរុបរួម</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td className="border border-slate-300 py-1 px-2 text-left font-medium">ចំនួនថ្នាក់រៀន</td>
                      {gradesKeys.map((k) => (
                        <td key={k} className="border border-slate-300 py-1 px-2">{toKhmerNum(t1Rooms[k].classes)}</td>
                      ))}
                      <td className="border border-slate-300 py-1 px-2 font-bold bg-blue-50/50">{toKhmerNum(t1TotalClasses)}</td>
                    </tr>
                    <tr>
                      <td className="border border-slate-300 py-1 px-2 text-left font-medium">សិស្សសរុប (ស្រី)</td>
                      {gradesKeys.map((k) => (
                        <td key={k} className="border border-slate-300 py-1 px-2">
                          {toKhmerNum(t1Rooms[k].total)} ({toKhmerNum(t1Rooms[k].female)})
                        </td>
                      ))}
                      <td className="border border-slate-300 py-1 px-2 font-bold bg-blue-50/50 text-blue-950">
                        {toKhmerNum(t1TotalStudents)} ({toKhmerNum(t1TotalFemale)})
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>

            {/* 1.2 Staff */}
            <div className="space-y-1 pt-1">
              <h3 className="font-semibold text-slate-800">២. ស្ថិតិបុគ្គលិកអប់រំ និងគរុកោសល្យ</h3>
              <p className="text-slate-700 leading-relaxed">
                បុគ្គលិកអប់រំសរុបក្នុងសាលាមានចំនួន <strong>{toKhmerNum(totalStaff)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(totalStaffFemale)}</strong> នាក់)។
                ក្នុងនោះ៖ គណៈគ្រប់គ្រង និងរដ្ឋបាលមិនបង្រៀនចំនួន <strong>{toKhmerNum(Number(t1Staff.directorDeputy.total) + Number(t1Staff.officeAdmin.total))}</strong> នាក់ (ស្រី <strong>{toKhmerNum(Number(t1Staff.directorDeputy.female) + Number(t1Staff.officeAdmin.female))}</strong> នាក់),
                គ្រូបង្រៀនផ្ទាល់ចំនួន <strong>{toKhmerNum(teachingTotal)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(teachingFemale)}</strong> នាក់), និងបុគ្គលិកជួយបង្រៀនចំនួន <strong>{toKhmerNum(t1Staff.assistTeaching.total)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(t1Staff.assistTeaching.female)}</strong> នាក់)។
              </p>
            </div>

            {/* 1.3 School Finance PB */}
            <div className="space-y-1 pt-1">
              <h3 className="font-semibold text-slate-800">៣. ស្ថានភាពថវិកាដំណើរការសាលារៀន (Program Budget - PB)</h3>
              <p className="text-slate-700 leading-relaxed">
                ថវិកាគ្រោងសរុបចំនួន <strong>{toKhmerNum(finance.budgetPlanPB.toLocaleString())}</strong> រៀល។ ថវិកាដែលបានទទួលជាក់ស្តែងចំនួន <strong>{toKhmerNum(finance.budgetReceivedPB.toLocaleString())}</strong> រៀល និងបានចំណាយសរុបចំនួន <strong>{toKhmerNum(finance.budgetExpendedPB.toLocaleString())}</strong> រៀល (ស្មើនឹង <strong>{formatPct(finance.budgetExpendedPB, finance.budgetReceivedPB)}</strong> នៃថវិកាបានទទួល)។
                ថវិកាត្រូវបានបែងចែកយ៉ាងច្បាស់លាស់សម្រាប់៖ សម្ភារៈឧបទេស <strong>{toKhmerNum(finance.materialsExpended.toLocaleString())}</strong> រៀល, ជួសជុលកែលម្អ <strong>{toKhmerNum(finance.repairsExpended.toLocaleString())}</strong> រៀល, និងអនាម័យ-សុខភាព <strong>{toKhmerNum(finance.hygieneExpended.toLocaleString())}</strong> រៀល។
              </p>
            </div>
          </section>

          {/* ផ្នែកទី II: ការធានាគុណភាពអប់រំ និងលទ្ធផលសិក្សា */}
          <section className="space-y-3">
            <h2 className="font-bold text-sm sm:text-base text-blue-900 border-b border-blue-200 pb-1 flex items-center gap-2">
              <GraduationCap className="w-4 h-4 text-blue-700 no-print" />
              <span>ផ្នែកទី II ៖ ការធានាគុណភាពអប់រំ និងលទ្ធផលសិក្សា (លទ្ធផល ភាគរយ តេស្តចុងឆ្នាំ)</span>
            </h2>

            <p className="text-slate-700 leading-relaxed">
              ការវាយតម្លៃលទ្ធផលសិក្សារបស់សិស្សានុសិស្សត្រូវបានអនុវត្តយ៉ាងម៉ឺងម៉ាត់តាមសេចក្ដីណែនាំបច្ចេកទេសរបស់ក្រសួងអប់រំ យុវជន និងកីឡា ទាំងការប្រឡងឆមាសទី១ និងការវាយតម្លៃចុងឆ្នាំក្រោយការធ្វើតេស្តសងឡើងវិញ។
            </p>

            {/* Results KPI Summary Card */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center my-3">
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[11px] text-slate-600 block">ឡើងថ្នាក់ចុងឆ្នាំសរុប</span>
                <span className="font-bold text-emerald-800 text-sm sm:text-base">
                  {toKhmerNum(t4TotalFinalPassed)} នាក់ ({overallPassRate})
                </span>
              </div>
              <div className="p-2.5 bg-emerald-50 border border-emerald-200 rounded-lg">
                <span className="text-[11px] text-slate-600 block">សិស្សស្រីឡើងថ្នាក់</span>
                <span className="font-bold text-emerald-800 text-sm sm:text-base">
                  {toKhmerNum(t4TotalFinalPassedFem)} នាក់ ({overallFemalePassRate})
                </span>
              </div>
              <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg">
                <span className="text-[11px] text-slate-600 block">សិស្សត្រួតថ្នាក់</span>
                <span className="font-bold text-amber-800 text-sm sm:text-base">
                  {toKhmerNum(t4TotalRepeaters)} នាក់ ({overallRepeatRate})
                </span>
              </div>
              <div className="p-2.5 bg-rose-50 border border-rose-200 rounded-lg">
                <span className="text-[11px] text-slate-600 block">សិស្សបោះបង់ការសិក្សា</span>
                <span className="font-bold text-rose-800 text-sm sm:text-base">
                  {toKhmerNum(t4TotalDropouts)} នាក់ ({overallDropoutRate})
                </span>
              </div>
            </div>

            {/* Detailed Table 4 in Report */}
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-300 text-center text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-800">
                    <th rowSpan={2} className="border border-slate-300 py-1.5 px-2">កម្រិតថ្នាក់</th>
                    <th colSpan={2} className="border border-slate-300 py-1 px-2">ជាប់មធ្យមភាគ</th>
                    <th colSpan={2} className="border border-slate-300 py-1 px-2">ជាប់តេស្តឡើងវិញ</th>
                    <th colSpan={2} className="border border-slate-300 py-1 px-2 bg-emerald-50 font-bold">ឡើងថ្នាក់សរុប</th>
                    <th colSpan={2} className="border border-slate-300 py-1 px-2">ត្រួតថ្នាក់</th>
                    <th colSpan={2} className="border border-slate-300 py-1 px-2">បោះបង់</th>
                  </tr>
                  <tr className="bg-slate-50 text-slate-700">
                    <th className="border border-slate-300 py-1 px-1">សរុប</th>
                    <th className="border border-slate-300 py-1 px-1">ស្រី</th>
                    <th className="border border-slate-300 py-1 px-1">សរុប</th>
                    <th className="border border-slate-300 py-1 px-1">ស្រី</th>
                    <th className="border border-slate-300 py-1 px-1 bg-emerald-50 font-bold">សរុប</th>
                    <th className="border border-slate-300 py-1 px-1 bg-emerald-50 font-bold">ស្រី</th>
                    <th className="border border-slate-300 py-1 px-1">សរុប</th>
                    <th className="border border-slate-300 py-1 px-1">ស្រី</th>
                    <th className="border border-slate-300 py-1 px-1">សរុប</th>
                    <th className="border border-slate-300 py-1 px-1">ស្រី</th>
                  </tr>
                </thead>
                <tbody>
                  {t4Rows.map((r) => {
                    const rowPassedTot = (Number(r.passedAvgTotal) || 0) + (Number(r.passedRetestTotal) || 0);
                    const rowPassedFem = (Number(r.passedAvgFemale) || 0) + (Number(r.passedRetestFemale) || 0);
                    return (
                      <tr key={r.id}>
                        <td className="border border-slate-300 py-1 px-2 text-left font-medium">{r.gradeLabel}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.passedAvgTotal)}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.passedAvgFemale)}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.passedRetestTotal)}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.passedRetestFemale)}</td>
                        <td className="border border-slate-300 py-1 px-1 font-bold bg-emerald-50/50">{toKhmerNum(rowPassedTot)}</td>
                        <td className="border border-slate-300 py-1 px-1 font-bold bg-emerald-50/50">{toKhmerNum(rowPassedFem)}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.repeatersTotal)}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.repeatersFemale)}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.dropoutsTotal)}</td>
                        <td className="border border-slate-300 py-1 px-1">{toKhmerNum(r.dropoutsFemale)}</td>
                      </tr>
                    );
                  })}
                  <tr className="bg-slate-100 font-bold text-slate-900">
                    <td className="border border-slate-300 py-1.5 px-2 text-left">សរុបរួម</td>
                    <td className="border border-slate-300 py-1.5 px-1">{toKhmerNum(t4Rows.reduce((a, r) => a + (Number(r.passedAvgTotal) || 0), 0))}</td>
                    <td className="border border-slate-300 py-1.5 px-1">{toKhmerNum(t4Rows.reduce((a, r) => a + (Number(r.passedAvgFemale) || 0), 0))}</td>
                    <td className="border border-slate-300 py-1.5 px-1">{toKhmerNum(t4Rows.reduce((a, r) => a + (Number(r.passedRetestTotal) || 0), 0))}</td>
                    <td className="border border-slate-300 py-1.5 px-1">{toKhmerNum(t4Rows.reduce((a, r) => a + (Number(r.passedRetestFemale) || 0), 0))}</td>
                    <td className="border border-slate-300 py-1.5 px-1 bg-emerald-100 text-emerald-950">{toKhmerNum(t4TotalFinalPassed)}</td>
                    <td className="border border-slate-300 py-1.5 px-1 bg-emerald-100 text-emerald-950">{toKhmerNum(t4TotalFinalPassedFem)}</td>
                    <td className="border border-slate-300 py-1.5 px-1">{toKhmerNum(t4TotalRepeaters)}</td>
                    <td className="border border-slate-300 py-1.5 px-1">{toKhmerNum(t4TotalRepeatersFem)}</td>
                    <td className="border border-slate-300 py-1.5 px-1 text-rose-700">{toKhmerNum(t4TotalDropouts)}</td>
                    <td className="border border-slate-300 py-1.5 px-1 text-rose-700">{toKhmerNum(t4TotalDropoutsFem)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>

          {/* ផ្នែកទី III: សមធម៌ សុខភាពសិក្សា និងបរិយាបន្ន */}
          <section className="space-y-3">
            <h2 className="font-bold text-sm sm:text-base text-blue-900 border-b border-blue-200 pb-1 flex items-center gap-2">
              <Heart className="w-4 h-4 text-rose-600 no-print" />
              <span>ផ្នែកទី III ៖ សមធម៌ សុខភាពសិក្សា និងបរិយាបន្ន (ព្រូន ក្រីក្រ ពិការ និងបណ្ណាល័យ)</span>
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Health & Deworming */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">១. សុខភាពសិក្សា & ការទម្លាក់ថ្នាំព្រូន</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-1 text-xs">
                  <li>
                    <strong>ជុំទី ១៖</strong> បានទម្លាក់ជូនសិស្ស <strong>{toKhmerNum(healthSocial.dewormingRound1.receivedTotal)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(healthSocial.dewormingRound1.receivedFemale)}</strong>) សម្រេចបាន <strong>{dewormingR1Pct}</strong> នៃគោលដៅ។
                  </li>
                  <li>
                    <strong>ជុំទី ២៖</strong> បានទម្លាក់ជូនសិស្ស <strong>{toKhmerNum(healthSocial.dewormingRound2.receivedTotal)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(healthSocial.dewormingRound2.receivedFemale)}</strong>) សម្រេចបាន <strong>{dewormingR2Pct}</strong> នៃគោលដៅ។
                  </li>
                  <li>
                    <strong>ទឹកស្អាត និងអនាម័យ៖</strong> {waterSanitation.waterSource} ({waterSanitation.hasSafeDrinkingWater ? 'មានទឹកស្អាតបរិភោគ' : 'ត្រូវការធុងចម្រោះបន្ថែម'}), មានកន្លែងលាងដៃ <strong>{toKhmerNum(waterSanitation.handwashingStations)}</strong> កន្លែង ({waterSanitation.hasSoapAvailable ? 'មានសាប៊ូជាប្រចាំ' : 'ខ្វះខាតសាប៊ូ'}), បន្ទប់ទឹកដំណើរការ <strong>{toKhmerNum(waterSanitation.functioningLatrines)}</strong> បន្ទប់ (មធ្យមភាគ <strong>{toKhmerNum(Math.round(t1TotalStudents / Math.max(1, waterSanitation.functioningLatrines)))}</strong> សិស្ស/១បង្គន់)។
                  </li>
                </ul>
              </div>

              {/* Equity & Disabilities */}
              <div className="bg-slate-50 border border-slate-200 rounded-lg p-3 space-y-1.5">
                <h3 className="font-bold text-slate-800 text-xs sm:text-sm">២. សិស្សក្រីក្រ បរិយាបន្ន & បណ្ណាល័យ</h3>
                <ul className="list-disc list-inside text-slate-700 space-y-1 text-xs">
                  <li>
                    <strong>សិស្សក្រីក្រ (សមធម៌)៖</strong> កម្រិត១ (ក្រ១) ចំនួន <strong>{toKhmerNum(healthSocial.idPoor1.total)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(healthSocial.idPoor1.female)}</strong>), កម្រិត២ (ក្រ២) ចំនួន <strong>{toKhmerNum(healthSocial.idPoor2.total)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(healthSocial.idPoor2.female)}</strong>)។ សិស្សទទួលអាហារូបករណ៍រដ្ឋ/ដៃគូចំនួន <strong>{toKhmerNum(healthSocial.scholarships.total)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(healthSocial.scholarships.female)}</strong>)។
                  </li>
                  <li>
                    <strong>សិស្សមានពិការភាព៖</strong> សរុប <strong>{toKhmerNum(totalDisabled)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(totalDisabledFem)}</strong> នាក់) ទទួលបានការគាំទ្រ និងរួមបញ្ចូលក្នុងការរៀនសូត្រដោយពេញលេញ។
                  </li>
                  <li>
                    <strong>បណ្ណាល័យសាលា៖</strong> មានសៀវភៅសរុប <strong>{toKhmerNum(Number(library.storyBooks) + Number(library.textBooks) + Number(library.teacherGuides))}</strong> ក្បាល, មានអ្នកអានជាមធ្យម <strong>{toKhmerNum(library.readersMonthly.total)}</strong> នាក់/ខែ (ស្រី <strong>{toKhmerNum(library.readersMonthly.female)}</strong>) និងខ្ចីអានចំនួន <strong>{toKhmerNum(library.borrowingMonthly)}</strong> ក្បាល/ខែ។
                  </li>
                </ul>
              </div>
            </div>
          </section>

          {/* ផ្នែកទី IV ដល់ VII: អធិការកិច្ច សហគមន៍ បញ្ហាប្រឈម & សន្និដ្ឋាន */}
          <section className="space-y-4">
            <h2 className="font-bold text-sm sm:text-base text-blue-900 border-b border-blue-200 pb-1 flex items-center gap-2">
              <Award className="w-4 h-4 text-blue-700 no-print" />
              <span>ផ្នែកទី IV ដល់ VII ៖ ការគ្រប់គ្រង សហគមន៍ បញ្ហាប្រឈម និងសេចក្ដីសន្និដ្ឋាន</span>
            </h2>

            {/* IV. Management */}
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">ផ្នែកទី IV ៖ ការគ្រប់គ្រង និងអធិការកិច្ចផ្ទៃក្នុង</h3>
              <p className="text-slate-700 leading-relaxed pl-2 border-l-2 border-slate-200">
                សាលាបានរៀបចំកិច្ចប្រជុំបច្ចេកទេសគរុកោសល្យ (PLC) ចំនួន <strong>{toKhmerNum(narrative.management.plcMeetingsCount)}</strong> ដង,
                ចុះសង្កេត និងគាំទ្រការបង្រៀនរបស់គ្រូបានចំនួន <strong>{toKhmerNum(narrative.management.classObservationsCount)}</strong> លើក,
                និងចុះធ្វើអធិការកិច្ចផ្ទៃក្នុងបានចំនួន <strong>{toKhmerNum(narrative.management.internalInspectionVisits)}</strong> ដង។ {narrative.management.summary}
              </p>
            </div>

            {/* V. Community */}
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">ផ្នែកទី V ៖ ការចូលរួមរបស់សហគមន៍ និងគណៈកម្មការទ្រទ្រង់សាលា</h3>
              <p className="text-slate-700 leading-relaxed pl-2 border-l-2 border-slate-200">
                គណៈកម្មការទ្រទ្រង់សាលា (SSC) បានបើកកិច្ចប្រជុំពិគ្រោះយោបល់ចំនួន <strong>{toKhmerNum(narrative.community.sscMeetingsCount)}</strong> ដង
                និងបានកៀរគរការចូលរួមថវិកា និងសម្ភារៈពីសហគមន៍បានសរុបចំនួន <strong>{toKhmerNum(narrative.community.communityContributionAmount.toLocaleString())}</strong> រៀល។
                សាលាមានកិច្ចសហការយ៉ាងល្អជាមួយដៃគូអភិវឌ្ឍន៍ ({narrative.community.partnerNGOs})។ {narrative.community.communitySummary}
              </p>
            </div>

            {/* VI. Challenges & Solutions */}
            <div className="space-y-1">
              <h3 className="font-bold text-slate-800">ផ្នែកទី VI ៖ បញ្ហាប្រឈម និងវិធានការដោះស្រាយ</h3>
              <div className="pl-2 border-l-2 border-slate-200 space-y-1 text-slate-700">
                <p>
                  <strong>• បញ្ហាប្រឈម៖</strong> {narrative.challenges.challenges}
                </p>
                <p>
                  <strong>• វិធានការដោះស្រាយ៖</strong> {narrative.challenges.solutions}
                </p>
              </div>
            </div>

            {/* VII. Executive Conclusion & Recommendations */}
            <div className="space-y-2 bg-blue-50/50 border border-blue-100 rounded-lg p-4">
              <h3 className="font-bold text-blue-950 text-sm sm:text-base">
                ផ្នែកទី VII ៖ សេចក្ដីសន្និដ្ឋាន និងសំណូមពរ
              </h3>
              <p className="text-slate-800 leading-relaxed whitespace-pre-line text-xs sm:text-sm">
                {narrative.conclusion.executiveSummary}
              </p>

              {/* Key Achievements Bullet list */}
              {narrative.conclusion.keyAchievements && narrative.conclusion.keyAchievements.length > 0 && (
                <div className="pt-2">
                  <span className="font-semibold text-blue-900 block mb-1">សមិទ្ធផលគន្លឹះសម្រេចបាន៖</span>
                  <ul className="list-disc list-inside space-y-0.5 text-slate-700">
                    {narrative.conclusion.keyAchievements.map((item, idx) => (
                      <li key={idx}>{item}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Requests to District */}
              {narrative.conclusion.requestsToDistrict && (
                <div className="pt-2">
                  <span className="font-semibold text-blue-900 block mb-0.5">សំណូមពរ៖</span>
                  <p className="text-slate-700 italic">{narrative.conclusion.requestsToDistrict}</p>
                </div>
              )}
            </div>
          </section>
        </div>

        {/* Official Certification Signature Block */}
        <footer className="mt-12 pt-6 border-t-2 border-slate-800 page-break-inside-avoid">
          <div className="grid grid-cols-3 text-center text-xs sm:text-sm gap-4">
            {/* Left: District Office Verification */}
            <div className="space-y-1">
              <div className="font-semibold text-slate-700">បានឃើញ និងឯកភាព</div>
              <div className="font-semibold text-slate-800">
                ប្រធានការិយាល័យអប់រំ យុវជន និងកីឡា
              </div>
              <div className="h-20 sm:h-24"></div>
              <div className="font-bold text-slate-800 underline decoration-dotted">
                {meta.clusterOrDistrict || '...........................................'}
              </div>
            </div>

            {/* Middle: SSC Verification */}
            <div className="space-y-1">
              <div className="font-semibold text-slate-700">បានឃើញ និងបញ្ជាក់</div>
              <div className="font-semibold text-slate-800">
                ប្រធានគណៈកម្មការទ្រទ្រង់សាលា
              </div>
              <div className="h-20 sm:h-24"></div>
              <div className="font-bold text-slate-800 underline decoration-dotted">
                ...........................................
              </div>
            </div>

            {/* Right: School Director */}
            <div className="space-y-1">
              <div className="text-slate-600 italic">
                ធ្វើនៅ {meta.schoolName}, {meta.reportDate || 'ថ្ងៃទី..... ខែ..... ឆ្នាំ២០២...'}
              </div>
              <div className="font-bold text-slate-900">
                នាយក{meta.schoolName || 'សាលាបឋមសិក្សា'}
              </div>
              <div className="h-20 sm:h-24"></div>
              <div className="font-bold text-slate-900 text-sm">
                {meta.directorName || 'លោកនាយកសាលា'}
              </div>
            </div>
          </div>
        </footer>
      </article>
    </div>
  );
};
