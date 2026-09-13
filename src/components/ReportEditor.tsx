import React, { useState } from 'react';
import { 
  Building2, 
  Users, 
  GraduationCap, 
  BookOpen, 
  HeartHandshake, 
  FileCheck, 
  Calculator, 
  Sparkles,
  AlertCircle,
  Plus,
  Trash2,
  Trophy,
  Palette,
  CalendarCheck,
  ClipboardList
} from 'lucide-react';
import { FullSchoolReport, AcademicGradeRow, TeachingEvaluationRow } from '../types';
import { AutoDateSettingsBar } from './AutoDateSettingsBar';
import { FinanceEditorTable } from './FinanceEditorTable';
import { PostTestAcademicTable } from './PostTestAcademicTable';

interface ReportEditorProps {
  report: FullSchoolReport;
  onChange: (updated: FullSchoolReport) => void;
  onOpenAiHelper?: (section: string) => void;
}

export const ReportEditor: React.FC<ReportEditorProps> = ({
  report,
  onChange,
  onOpenAiHelper,
}) => {
  const [subTab, setSubTab] = useState<'quantity' | 'academic' | 'teaching' | 'health' | 'activities' | 'vacation_conclusion' | 'narrative'>('academic');
  const [aiGeneratingSection, setAiGeneratingSection] = useState<string | null>(null);

  // Helper to deep update
  const updateField = (updater: (prev: FullSchoolReport) => FullSchoolReport) => {
    onChange(updater(report));
  };

  // Math Auto-Calculator for Academic Results
  const recalculateAcademicMath = () => {
    const updatedRows = report.academicResults.map(row => {
      const finalPassedTotal = Number(row.passedAverageTotal || 0) + Number(row.passedRetestTotal || 0);
      const finalPassedFemale = Number(row.passedAverageFemale || 0) + Number(row.passedRetestFemale || 0);

      const finalStudentsTotal = finalPassedTotal + Number(row.repeaterTotal || 0);
      const finalStudentsFemale = finalPassedFemale + Number(row.repeaterFemale || 0);

      const yearEndTotal = finalStudentsTotal + Number(row.dropoutTotal || 0);
      const yearEndFemale = finalStudentsFemale + Number(row.dropoutFemale || 0);

      return {
        ...row,
        finalPassedTotal,
        finalPassedFemale,
        finalStudentsTotal,
        finalStudentsFemale,
        yearEndTotal,
        yearEndFemale,
      };
    });

    // Recalculate percentages
    const updatedPcts = updatedRows.map(row => {
      const yearEnd = row.yearEndTotal || 1;
      const passedBefore = ((row.passedAverageTotal / yearEnd) * 100).toFixed(0) + '%';
      const passedRetest = ((row.passedRetestTotal / yearEnd) * 100).toFixed(0) + '%';
      const finalPassed = ((row.finalPassedTotal / yearEnd) * 100).toFixed(0) + '%';
      const repeater = ((row.repeaterTotal / yearEnd) * 100).toFixed(0) + '%';
      const dropout = ((row.dropoutTotal / yearEnd) * 100).toFixed(0) + '%';

      return {
        grade: String(row.grade),
        passedBeforeTestPct: passedBefore,
        passedRetestPct: passedRetest,
        finalPassedPct: finalPassed,
        repeaterPct: repeater,
        dropoutPct: dropout,
        notes: '',
      };
    });

    // Add total row
    const totalYearEnd = updatedRows.reduce((a, b) => a + b.yearEndTotal, 0) || 1;
    const totalPassedAvg = updatedRows.reduce((a, b) => a + b.passedAverageTotal, 0);
    const totalRetest = updatedRows.reduce((a, b) => a + b.passedRetestTotal, 0);
    const totalPassed = updatedRows.reduce((a, b) => a + b.finalPassedTotal, 0);
    const totalRepeater = updatedRows.reduce((a, b) => a + b.repeaterTotal, 0);
    const totalDropout = updatedRows.reduce((a, b) => a + b.dropoutTotal, 0);

    updatedPcts.push({
      grade: 'សរុប',
      passedBeforeTestPct: ((totalPassedAvg / totalYearEnd) * 100).toFixed(0) + '%',
      passedRetestPct: ((totalRetest / totalYearEnd) * 100).toFixed(1) + '%',
      finalPassedPct: ((totalPassed / totalYearEnd) * 100).toFixed(1) + '%',
      repeaterPct: ((totalRepeater / totalYearEnd) * 100).toFixed(0) + '%',
      dropoutPct: ((totalDropout / totalYearEnd) * 100).toFixed(1) + '%',
      notes: '',
    });

    updateField(prev => ({
      ...prev,
      academicResults: updatedRows,
      academicPercentages: updatedPcts,
    }));
  };

  // Quick AI Section Polish
  const handlePolishSectionWithAi = async (sectionKey: string, sectionTitle: string) => {
    setAiGeneratingSection(sectionKey);
    try {
      let curAct = '';
      let curChal = '';
      let curReq = '';

      if (sectionKey === 'lifeSkills') {
        curAct = report.lifeSkills.activities;
        curChal = report.lifeSkills.challenges;
        curReq = report.lifeSkills.requests;
      } else if (sectionKey === 'deworming') {
        curAct = report.health.deworming.activities;
        curChal = report.health.deworming.challenges;
        curReq = report.health.deworming.requests;
      } else if (sectionKey === 'sanitation') {
        curAct = report.health.sanitation.activities;
        curChal = report.health.sanitation.challenges;
        curReq = report.health.sanitation.requests;
      } else if (sectionKey === 'girlsCounseling') {
        curAct = report.girlsCounseling.activities;
        curChal = report.girlsCounseling.challenges;
        curReq = report.girlsCounseling.requests;
      }

      const res = await fetch('/api/ai/generate-narrative', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          sectionName: sectionTitle,
          currentActivities: curAct,
          currentChallenges: curChal,
          currentRequests: curReq,
          extraContext: `សាលាបឋមសិក្សា ${report.info.schoolName}, កម្រង ${report.info.cluster}`,
        }),
      });

      const data = await res.json();
      if (data.success) {
        updateField(prev => {
          const next = { ...prev };
          if (sectionKey === 'lifeSkills') {
            next.lifeSkills = {
              ...next.lifeSkills,
              activities: data.activities,
              challenges: data.challenges,
              requests: data.requests,
            };
          } else if (sectionKey === 'deworming') {
            next.health.deworming = {
              ...next.health.deworming,
              activities: data.activities,
              challenges: data.challenges,
              requests: data.requests,
            };
          } else if (sectionKey === 'sanitation') {
            next.health.sanitation = {
              ...next.health.sanitation,
              activities: data.activities,
              challenges: data.challenges,
              requests: data.requests,
            };
          } else if (sectionKey === 'girlsCounseling') {
            next.girlsCounseling = {
              ...next.girlsCounseling,
              activities: data.activities,
              challenges: data.challenges,
              requests: data.requests,
            };
          }
          return next;
        });
      }
    } catch (e) {
      console.error(e);
    } finally {
      setAiGeneratingSection(null);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      {/* Auto-Date & Lunar/Solar Configuration Bar */}
      <AutoDateSettingsBar report={report} onChange={onChange} />

      {/* Sub-Tabs Bar */}
      <div className="bg-white p-2 rounded-xl border border-slate-200 shadow-xs flex flex-wrap gap-1.5">
        <button
          onClick={() => setSubTab('quantity')}
          className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'quantity'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Building2 className="w-4 h-4" />
          <span>I. ការប្រែប្រួលខាងបរិមាណ</span>
        </button>

        <button
          onClick={() => setSubTab('academic')}
          className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'academic'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <GraduationCap className="w-4 h-4" />
          <span>II. លទ្ធផលសិក្សាដំណាច់ឆ្នាំ</span>
        </button>

        <button
          onClick={() => setSubTab('teaching')}
          className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'teaching'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>III. ការបង្រៀន & កម្មវិធីសិក្សា</span>
        </button>

        <button
          onClick={() => setSubTab('health')}
          className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'health'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <HeartHandshake className="w-4 h-4" />
          <span>IV. សុខភាពសិក្សា & បំណិនជីវិត</span>
        </button>

        <button
          onClick={() => setSubTab('activities')}
          className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'activities'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <Trophy className="w-4 h-4" />
          <span>V. សកម្មភាពក្រៅថ្នាក់, អធិការកិច្ច & សហគមន៍</span>
        </button>

        <button
          onClick={() => setSubTab('vacation_conclusion')}
          className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'vacation_conclusion'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <CalendarCheck className="w-4 h-4" />
          <span>VI. ត្រៀមវិស្សមកាល & សន្និដ្ឋាន</span>
        </button>

        <button
          onClick={() => setSubTab('narrative')}
          className={`px-3.5 py-2 rounded-lg text-xs md:text-sm font-medium transition-colors flex items-center gap-2 ${
            subTab === 'narrative'
              ? 'bg-slate-900 text-white'
              : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>VII. បញ្ហាប្រឈម & សំណូមពរ</span>
        </button>
      </div>

      {/* SUB-TAB 1: QUANTITATIVE INFORMATION */}
      {subTab === 'quantity' && (
        <div className="space-y-6">
          {/* School Identification */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Building2 className="w-5 h-5 text-amber-600" />
              <span>ព័ត៌មានអត្តសញ្ញាណសាលារៀន</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ឈ្មោះសាលារៀន</label>
                <input
                  type="text"
                  value={report.info.schoolName}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, schoolName: e.target.value } }))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">កម្រងសាលា</label>
                <input
                  type="text"
                  value={report.info.cluster}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, cluster: e.target.value } }))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ការិយាល័យអប់រំ ស្រុក/ខណ្ឌ</label>
                <input
                  type="text"
                  value={report.info.districtOffice}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, districtOffice: e.target.value } }))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ឆ្នាំសិក្សា</label>
                <input
                  type="text"
                  value={report.info.academicYear}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, academicYear: e.target.value } }))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ទីតាំងតំបន់សាលារៀន</label>
                <select
                  value={report.info.locationType}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, locationType: e.target.value as any } }))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                >
                  <option value="urban">នៅទីប្រជុំជន</option>
                  <option value="normal">តំបន់ធម្មតា</option>
                  <option value="remote">តំបន់ដាច់ស្រយាល</option>
                  <option value="abnormal">តំបន់មិនធម្មតា</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">អង្គការដៃគូនានា</label>
                <input
                  type="text"
                  value={report.info.partnerNGOs}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, partnerNGOs: e.target.value } }))}
                  className="w-full text-sm px-3 py-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-4 pt-2 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <div>
                <label className="block text-xs text-slate-600 mb-1">ចំនួនបន្ទប់សរុប</label>
                <input
                  type="number"
                  value={report.info.roomsTotal}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, roomsTotal: Number(e.target.value) } }))}
                  className="w-full text-sm px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">បន្ទប់បង្រៀន</label>
                <input
                  type="number"
                  value={report.info.roomsTeaching}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, roomsTeaching: Number(e.target.value) } }))}
                  className="w-full text-sm px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                />
              </div>
              <div>
                <label className="block text-xs text-slate-600 mb-1">បន្ទប់មិនបង្រៀន</label>
                <input
                  type="number"
                  value={report.info.roomsNonTeaching}
                  onChange={e => updateField(p => ({ ...p, info: { ...p.info, roomsNonTeaching: Number(e.target.value) } }))}
                  className="w-full text-sm px-2.5 py-1.5 border border-slate-300 rounded-md bg-white"
                />
              </div>
            </div>
          </div>

          {/* Student Stats by Grade */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                <Users className="w-5 h-5 text-blue-600" />
                <span>ស្ថិតិសិស្សតាមកម្រិតថ្នាក់ (ប្រៀបធៀបឆមាសទី១)</span>
              </h3>
              <span className="text-xs text-slate-500 bg-slate-100 px-2.5 py-1 rounded">
                សរុបរួម៖ {report.students.overall.total} នាក់ (ស្រី {report.students.overall.female} នាក់)
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 text-center font-medium">
                  <tr>
                    <th className="border border-slate-200 p-2">ថ្នាក់</th>
                    <th className="border border-slate-200 p-2">សិស្សសរុប</th>
                    <th className="border border-slate-200 p-2">ស្រី</th>
                    <th className="border border-slate-200 p-2">កើន / ថយ</th>
                    <th className="border border-slate-200 p-2">ផ្ទេរចូល</th>
                    <th className="border border-slate-200 p-2">ផ្ទេរចេញ / ចំណាកស្រុក</th>
                  </tr>
                </thead>
                <tbody>
                  {report.students.byGrade.map((row, idx) => (
                    <tr key={row.grade} className="text-center hover:bg-slate-50">
                      <td className="border border-slate-200 p-2 font-semibold">ថ្នាក់ទី{row.grade}</td>
                      <td className="border border-slate-200 p-1.5">
                        <input
                          type="number"
                          value={row.total}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const newByGrade = [...p.students.byGrade];
                              newByGrade[idx] = { ...newByGrade[idx], total: val };
                              const newTotal = newByGrade.reduce((a, b) => a + b.total, 0);
                              return {
                                ...p,
                                students: {
                                  ...p.students,
                                  byGrade: newByGrade,
                                  overall: { ...p.students.overall, total: newTotal },
                                },
                              };
                            });
                          }}
                          className="w-20 text-center px-1.5 py-1 border border-slate-300 rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <input
                          type="number"
                          value={row.female}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const newByGrade = [...p.students.byGrade];
                              newByGrade[idx] = { ...newByGrade[idx], female: val };
                              const newFemale = newByGrade.reduce((a, b) => a + b.female, 0);
                              return {
                                ...p,
                                students: {
                                  ...p.students,
                                  byGrade: newByGrade,
                                  overall: { ...p.students.overall, female: newFemale },
                                },
                              };
                            });
                          }}
                          className="w-20 text-center px-1.5 py-1 border border-slate-300 rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <input
                          type="text"
                          value={row.change}
                          onChange={e => {
                            const val = e.target.value;
                            updateField(p => {
                              const newByGrade = [...p.students.byGrade];
                              newByGrade[idx] = { ...newByGrade[idx], change: val };
                              return { ...p, students: { ...p.students, byGrade: newByGrade } };
                            });
                          }}
                          className="w-20 text-center px-1.5 py-1 border border-slate-300 rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <input
                          type="text"
                          value={row.transferredIn}
                          onChange={e => {
                            const val = e.target.value;
                            updateField(p => {
                              const newByGrade = [...p.students.byGrade];
                              newByGrade[idx] = { ...newByGrade[idx], transferredIn: val };
                              return { ...p, students: { ...p.students, byGrade: newByGrade } };
                            });
                          }}
                          className="w-20 text-center px-1.5 py-1 border border-slate-300 rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1.5">
                        <input
                          type="text"
                          value={row.transferredOut}
                          onChange={e => {
                            const val = e.target.value;
                            updateField(p => {
                              const newByGrade = [...p.students.byGrade];
                              newByGrade[idx] = { ...newByGrade[idx], transferredOut: val };
                              return { ...p, students: { ...p.students, byGrade: newByGrade } };
                            });
                          }}
                          className="w-20 text-center px-1.5 py-1 border border-slate-300 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                  <tr className="bg-slate-100 text-center font-bold">
                    <td className="border border-slate-200 p-2">សរុបរួម</td>
                    <td className="border border-slate-200 p-2">{report.students.overall.total} នាក់</td>
                    <td className="border border-slate-200 p-2">{report.students.overall.female} នាក់</td>
                    <td className="border border-slate-200 p-2">{report.students.overall.change} នាក់</td>
                    <td className="border border-slate-200 p-2">{report.students.overall.transferredIn} នាក់</td>
                    <td className="border border-slate-200 p-2">{report.students.overall.transferredOut} នាក់</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Note & Class counts */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">កំណត់សម្គាល់សិស្ស</label>
                <input
                  type="text"
                  value={report.students.note}
                  onChange={e => updateField(p => ({ ...p, students: { ...p.students, note: e.target.value } }))}
                  className="w-full text-xs px-3 py-2 border border-slate-300 rounded-md"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">ចំនួនថ្នាក់តាមកម្រិត (សរុប {report.students.classesByGrade.totalClasses} ថ្នាក់)</label>
                <div className="grid grid-cols-6 gap-1 text-center text-xs">
                  <div>
                    <span className="block text-slate-500">ថ្នាក់ទី១</span>
                    <input
                      type="number"
                      value={report.students.classesByGrade.g1}
                      onChange={e => updateField(p => ({ ...p, students: { ...p.students, classesByGrade: { ...p.students.classesByGrade, g1: Number(e.target.value) } } }))}
                      className="w-full text-center border border-slate-300 rounded p-1"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-500">ថ្នាក់ទី២</span>
                    <input
                      type="number"
                      value={report.students.classesByGrade.g2}
                      onChange={e => updateField(p => ({ ...p, students: { ...p.students, classesByGrade: { ...p.students.classesByGrade, g2: Number(e.target.value) } } }))}
                      className="w-full text-center border border-slate-300 rounded p-1"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-500">ថ្នាក់ទី៣</span>
                    <input
                      type="number"
                      value={report.students.classesByGrade.g3}
                      onChange={e => updateField(p => ({ ...p, students: { ...p.students, classesByGrade: { ...p.students.classesByGrade, g3: Number(e.target.value) } } }))}
                      className="w-full text-center border border-slate-300 rounded p-1"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-500">ថ្នាក់ទី៤</span>
                    <input
                      type="number"
                      value={report.students.classesByGrade.g4}
                      onChange={e => updateField(p => ({ ...p, students: { ...p.students, classesByGrade: { ...p.students.classesByGrade, g4: Number(e.target.value) } } }))}
                      className="w-full text-center border border-slate-300 rounded p-1"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-500">ថ្នាក់ទី៥</span>
                    <input
                      type="number"
                      value={report.students.classesByGrade.g5}
                      onChange={e => updateField(p => ({ ...p, students: { ...p.students, classesByGrade: { ...p.students.classesByGrade, g5: Number(e.target.value) } } }))}
                      className="w-full text-center border border-slate-300 rounded p-1"
                    />
                  </div>
                  <div>
                    <span className="block text-slate-500">ថ្នាក់ទី៦</span>
                    <input
                      type="number"
                      value={report.students.classesByGrade.g6}
                      onChange={e => updateField(p => ({ ...p, students: { ...p.students, classesByGrade: { ...p.students.classesByGrade, g6: Number(e.target.value) } } }))}
                      className="w-full text-center border border-slate-300 rounded p-1"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Educational Personnel (មន្រ្តីអប់រំ) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5 text-emerald-600" />
              <span>អំពីមន្ត្រីអប់រំ និងគ្រូបង្រៀន</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="block text-xs font-semibold text-slate-800 mb-2">បុគ្គលិកសរុបរួម</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-500">សរុប (នាក់)</label>
                    <input
                      type="number"
                      value={report.staff.overallStaff.total}
                      onChange={e => updateField(p => ({ ...p, staff: { ...p.staff, overallStaff: { ...p.staff.overallStaff, total: Number(e.target.value) } } }))}
                      className="w-full p-1 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500">ស្រី (នាក់)</label>
                    <input
                      type="number"
                      value={report.staff.overallStaff.female}
                      onChange={e => updateField(p => ({ ...p, staff: { ...p.staff, overallStaff: { ...p.staff.overallStaff, female: Number(e.target.value) } } }))}
                      className="w-full p-1 border rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="block text-xs font-semibold text-slate-800 mb-2">សរុបគ្រូបង្រៀន ១ថ្នាក់</span>
                <div className="grid grid-cols-2 gap-2 text-xs">
                  <div>
                    <label className="text-slate-500">សរុប (នាក់)</label>
                    <input
                      type="number"
                      value={report.staff.singleClassTeachers.total}
                      onChange={e => updateField(p => ({ ...p, staff: { ...p.staff, singleClassTeachers: { ...p.staff.singleClassTeachers, total: Number(e.target.value) } } }))}
                      className="w-full p-1 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500">ស្រី (នាក់)</label>
                    <input
                      type="number"
                      value={report.staff.singleClassTeachers.female}
                      onChange={e => updateField(p => ({ ...p, staff: { ...p.staff, singleClassTeachers: { ...p.staff.singleClassTeachers, female: Number(e.target.value) } } }))}
                      className="w-full p-1 border rounded bg-white"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="block text-xs font-semibold text-slate-800 mb-2">បុគ្គលិកផ្សេងៗ</span>
                <div className="grid grid-cols-2 gap-2 text-xs mb-2">
                  <div>
                    <label className="text-slate-500">សរុប</label>
                    <input
                      type="number"
                      value={report.staff.otherStaff.total}
                      onChange={e => updateField(p => ({ ...p, staff: { ...p.staff, otherStaff: { ...p.staff.otherStaff, total: Number(e.target.value) } } }))}
                      className="w-full p-1 border rounded bg-white"
                    />
                  </div>
                  <div>
                    <label className="text-slate-500">ស្រី</label>
                    <input
                      type="number"
                      value={report.staff.otherStaff.female}
                      onChange={e => updateField(p => ({ ...p, staff: { ...p.staff, otherStaff: { ...p.staff.otherStaff, female: Number(e.target.value) } } }))}
                      className="w-full p-1 border rounded bg-white"
                    />
                  </div>
                </div>
                <input
                  type="text"
                  placeholder="ការពិពណ៌នា..."
                  value={report.staff.otherStaff.description}
                  onChange={e => updateField(p => ({ ...p, staff: { ...p.staff, otherStaff: { ...p.staff.otherStaff, description: e.target.value } } }))}
                  className="w-full p-1 text-xs border rounded bg-white"
                />
              </div>
            </div>
          </div>

          {/* Financing Table (ជំនួសតារាងហិរញ្ញប្បទាន ដើម្បីបញ្ចូលស្រួល) */}
          <FinanceEditorTable report={report} onChange={onChange} />

          {/* Library (ការងារបណ្ណាល័យ) */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-emerald-600" />
              <span>ការងារបណ្ណាល័យ (Library Services)</span>
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="flex items-center justify-between p-3 bg-emerald-50/50 rounded-lg border border-emerald-100">
                <span className="font-medium text-slate-800">បណ្ណាល័យដំណើរការជាប្រចាំ</span>
                <input
                  type="number"
                  value={report.library.activeRegular}
                  onChange={e => updateField(p => ({ ...p, library: { ...p.library, activeRegular: Number(e.target.value) } }))}
                  className="w-16 p-1.5 border border-slate-300 rounded text-center bg-white font-bold"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-amber-50/50 rounded-lg border border-amber-100">
                <span className="font-medium text-slate-800">បណ្ណាល័យដំណើរការមិនសូវបានល្អ</span>
                <input
                  type="number"
                  value={report.library.suboptimal}
                  onChange={e => updateField(p => ({ ...p, library: { ...p.library, suboptimal: Number(e.target.value) } }))}
                  className="w-16 p-1.5 border border-slate-300 rounded text-center bg-white font-bold"
                />
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 rounded-lg border border-slate-200">
                <span className="font-medium text-slate-800">គ្មានបណ្ណាល័យសោះ</span>
                <input
                  type="number"
                  value={report.library.none}
                  onChange={e => updateField(p => ({ ...p, library: { ...p.library, none: Number(e.target.value) } }))}
                  className="w-16 p-1.5 border border-slate-300 rounded text-center bg-white font-bold"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 2: ACADEMIC RESULTS */}
      {subTab === 'academic' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3 border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
                  <GraduationCap className="w-5 h-5 text-indigo-600" />
                  <span>តារាងលទ្ធផលសិក្សាដំណាច់ឆ្នាំសិក្សា (Academic Results by Grade)</span>
                </h3>
                <p className="text-xs text-slate-500 mt-0.5">
                  រូបមន្តផ្លូវការ៖ A = 5 + 6 + 7 (សិស្សដំណាច់ឆ្នាំ) • B = 5 + 6 (សិស្សចុងឆ្នាំ) • 5 = 3 + 4 (ជាប់ចុងឆ្នាំ)
                </p>
              </div>

              <button
                onClick={recalculateAcademicMath}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-medium shadow-xs transition-colors self-start md:self-auto"
              >
                <Calculator className="w-3.5 h-3.5" />
                <span>ផ្ទៀងផ្ទាត់ & គណនារូបមន្តស្វ័យប្រវត្តិ</span>
              </button>
            </div>

            {/* Academic Grade Breakdown Table */}
            <div className="overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead className="bg-slate-100 text-slate-800 text-center font-medium">
                  <tr>
                    <th rowSpan={3} className="border border-slate-300 p-2">ថ្នាក់ទី</th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-amber-50/70">
                      សិស្សដំណាច់ឆ្នាំ<br/><span className="text-[10px] text-amber-800 font-normal">A = 5+6+7</span>
                    </th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-blue-50/70">
                      សិស្សចុងឆ្នាំ<br/><span className="text-[10px] text-blue-800 font-normal">B = 5+6</span>
                    </th>
                    <th colSpan={2} className="border border-slate-300 p-1">
                      ជាប់មធ្យមភាគ<br/><span className="text-[10px] text-slate-500 font-normal">(3)</span>
                    </th>
                    <th colSpan={2} className="border border-slate-300 p-1">
                      ធ្វើតេស្តជាប់<br/><span className="text-[10px] text-slate-500 font-normal">(4)</span>
                    </th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-emerald-50/70">
                      ជាប់ចុងឆ្នាំ<br/><span className="text-[10px] text-emerald-800 font-normal">5 = 3+4</span>
                    </th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-rose-50/70">
                      សិស្សត្រួតថ្នាក់<br/><span className="text-[10px] text-rose-800 font-normal">(6)</span>
                    </th>
                    <th colSpan={2} className="border border-slate-300 p-1 bg-red-50/70">
                      សិស្សបោះបង់<br/><span className="text-[10px] text-red-800 font-normal">(7)</span>
                    </th>
                  </tr>
                  <tr className="bg-slate-50 text-[11px]">
                    <th className="border border-slate-300 p-1">សរុប</th>
                    <th className="border border-slate-300 p-1">ស្រី</th>
                    <th className="border border-slate-300 p-1">សរុប</th>
                    <th className="border border-slate-300 p-1">ស្រី</th>
                    <th className="border border-slate-300 p-1">សរុប</th>
                    <th className="border border-slate-300 p-1">ស្រី</th>
                    <th className="border border-slate-300 p-1">សរុប</th>
                    <th className="border border-slate-300 p-1">ស្រី</th>
                    <th className="border border-slate-300 p-1">សរុប</th>
                    <th className="border border-slate-300 p-1">ស្រី</th>
                    <th className="border border-slate-300 p-1">សរុប</th>
                    <th className="border border-slate-300 p-1">ស្រី</th>
                    <th className="border border-slate-300 p-1">សរុប</th>
                    <th className="border border-slate-300 p-1">ស្រី</th>
                  </tr>
                </thead>
                <tbody>
                  {report.academicResults.map((row, idx) => (
                    <tr key={row.grade} className="text-center hover:bg-slate-50">
                      <td className="border border-slate-300 p-2 font-bold bg-slate-50">{row.grade}</td>
                      {/* Col A */}
                      <td className="border border-slate-300 p-1 bg-amber-50/30 font-semibold">{row.yearEndTotal}</td>
                      <td className="border border-slate-300 p-1 bg-amber-50/30">{row.yearEndFemale}</td>
                      {/* Col B */}
                      <td className="border border-slate-300 p-1 bg-blue-50/30 font-semibold">{row.finalStudentsTotal}</td>
                      <td className="border border-slate-300 p-1 bg-blue-50/30">{row.finalStudentsFemale}</td>
                      {/* Col 3: passed avg */}
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.passedAverageTotal}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], passedAverageTotal: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.passedAverageFemale}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], passedAverageFemale: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                      {/* Col 4: retest */}
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.passedRetestTotal}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], passedRetestTotal: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.passedRetestFemale}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], passedRetestFemale: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                      {/* Col 5: final passed */}
                      <td className="border border-slate-300 p-1 bg-emerald-50/40 font-bold text-emerald-800">{row.finalPassedTotal}</td>
                      <td className="border border-slate-300 p-1 bg-emerald-50/40 text-emerald-800">{row.finalPassedFemale}</td>
                      {/* Col 6: repeater */}
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.repeaterTotal}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], repeaterTotal: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.repeaterFemale}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], repeaterFemale: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                      {/* Col 7: dropout */}
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.dropoutTotal}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], dropoutTotal: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                      <td className="border border-slate-300 p-1">
                        <input
                          type="number"
                          value={row.dropoutFemale}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.academicResults];
                              list[idx] = { ...list[idx], dropoutFemale: val };
                              return { ...p, academicResults: list };
                            });
                          }}
                          className="w-12 text-center p-0.5 border rounded"
                        />
                      </td>
                    </tr>
                  ))}
                  {/* Totals Row */}
                  <tr className="bg-slate-100 text-center font-bold text-slate-900">
                    <td className="border border-slate-300 p-2">សរុប</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.yearEndTotal, 0)}</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.yearEndFemale, 0)}</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.finalStudentsTotal, 0)}</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.finalStudentsFemale, 0)}</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.passedAverageTotal, 0)}</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.passedAverageFemale, 0)}</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.passedRetestTotal, 0)}</td>
                    <td className="border border-slate-300 p-1.5">{report.academicResults.reduce((a, b) => a + b.passedRetestFemale, 0)}</td>
                    <td className="border border-slate-300 p-1.5 text-emerald-700">{report.academicResults.reduce((a, b) => a + b.finalPassedTotal, 0)}</td>
                    <td className="border border-slate-300 p-1.5 text-emerald-700">{report.academicResults.reduce((a, b) => a + b.finalPassedFemale, 0)}</td>
                    <td className="border border-slate-300 p-1.5 text-rose-700">{report.academicResults.reduce((a, b) => a + b.repeaterTotal, 0)}</td>
                    <td className="border border-slate-300 p-1.5 text-rose-700">{report.academicResults.reduce((a, b) => a + b.repeaterFemale, 0)}</td>
                    <td className="border border-slate-300 p-1.5 text-red-700">{report.academicResults.reduce((a, b) => a + b.dropoutTotal, 0)}</td>
                    <td className="border border-slate-300 p-1.5 text-red-700">{report.academicResults.reduce((a, b) => a + b.dropoutFemale, 0)}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Academic Percentages Table */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-2">
              លទ្ធផលសិក្សាដំណាច់ឆ្នាំគិតជាភាគរយ (%)
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-medium">
                  <tr>
                    <th className="border border-slate-200 p-2">ថ្នាក់ទី</th>
                    <th className="border border-slate-200 p-2">% ជាប់មុនតេស្ត (1)</th>
                    <th className="border border-slate-200 p-2">% ធ្វើតេស្តជាប់ (2)</th>
                    <th className="border border-slate-200 p-2 bg-emerald-50 text-emerald-800">% ជាប់ចុងឆ្នាំ (3=1+2)</th>
                    <th className="border border-slate-200 p-2">% ត្រួត (4)</th>
                    <th className="border border-slate-200 p-2">% បោះបង់ (5)</th>
                    <th className="border border-slate-200 p-2">ផ្សេងៗ (6)</th>
                  </tr>
                </thead>
                <tbody>
                  {report.academicPercentages.map((pct, idx) => (
                    <tr key={pct.grade} className={`hover:bg-slate-50 ${pct.grade === 'សរុប' ? 'bg-slate-100 font-bold' : ''}`}>
                      <td className="border border-slate-200 p-2 font-medium">{pct.grade}</td>
                      <td className="border border-slate-200 p-1.5">{pct.passedBeforeTestPct}</td>
                      <td className="border border-slate-200 p-1.5">{pct.passedRetestPct}</td>
                      <td className="border border-slate-200 p-1.5 font-bold text-emerald-700">{pct.finalPassedPct}</td>
                      <td className="border border-slate-200 p-1.5">{pct.repeaterPct}</td>
                      <td className="border border-slate-200 p-1.5 text-rose-600">{pct.dropoutPct}</td>
                      <td className="border border-slate-200 p-1.5">
                        <input
                          type="text"
                          value={pct.notes}
                          onChange={e => {
                            const val = e.target.value;
                            updateField(p => {
                              const list = [...p.academicPercentages];
                              list[idx] = { ...list[idx], notes: val };
                              return { ...p, academicPercentages: list };
                            });
                          }}
                          placeholder="—"
                          className="w-full text-center text-xs p-1 border border-slate-200 rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* TABLE 3: POST-TEST ACADEMIC RESULTS */}
          <PostTestAcademicTable report={report} onChange={onChange} />
        </div>
      )}

      {/* SUB-TAB 3: TEACHING & CURRICULUM */}
      {subTab === 'teaching' && (
        <div className="space-y-6">
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-amber-600" />
              <span>ការបង្រៀន និងការអនុវត្តកម្មវិធីសិក្សា</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-medium">
                  <tr>
                    <th rowSpan={2} className="border border-slate-200 p-2">ថ្នាក់</th>
                    <th colSpan={3} className="border border-slate-200 p-1 bg-amber-50">ចំនួនគ្រូបង្រៀន</th>
                    <th colSpan={5} className="border border-slate-200 p-1 bg-blue-50">ការអនុវត្តកម្មវិធីសិក្សា (%)</th>
                  </tr>
                  <tr className="bg-slate-50 text-[11px]">
                    <th className="border border-slate-200 p-1">បង្រៀនល្អ</th>
                    <th className="border border-slate-200 p-1">បង្រៀនមធ្យម</th>
                    <th className="border border-slate-200 p-1">បង្រៀនខ្សោយ</th>
                    <th className="border border-slate-200 p-1">% ភាសាខ្មែរ</th>
                    <th className="border border-slate-200 p-1">% គណិតវិទ្យា</th>
                    <th className="border border-slate-200 p-1">% សិក្សាសង្គម</th>
                    <th className="border border-slate-200 p-1">% វិទ្យាសាស្ត្រ</th>
                    <th className="border border-slate-200 p-1">% អង់គ្លេស</th>
                  </tr>
                </thead>
                <tbody>
                  {report.teachingEvaluation.rows.map((row, idx) => (
                    <tr key={row.grade} className="hover:bg-slate-50">
                      <td className="border border-slate-200 p-2 font-bold bg-slate-50">ថ្នាក់ទី{row.grade}</td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.goodTeachers}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], goodTeachers: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.mediumTeachers}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], mediumTeachers: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.weakTeachers}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], weakTeachers: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.khmerPct}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], khmerPct: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.mathPct}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], mathPct: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.socialPct}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], socialPct: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.sciencePct}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], sciencePct: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={row.englishPct}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.teachingEvaluation.rows];
                              list[idx] = { ...list[idx], englishPct: val };
                              return { ...p, teachingEvaluation: { ...p.teachingEvaluation, rows: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                    </tr>
                  ))}
                  {/* Totals / Averages */}
                  <tr className="bg-slate-100 font-bold text-center">
                    <td className="border border-slate-200 p-2">សរុប</td>
                    <td className="border border-slate-200 p-1.5">{report.teachingEvaluation.rows.reduce((a, b) => a + b.goodTeachers, 0)}</td>
                    <td className="border border-slate-200 p-1.5">{report.teachingEvaluation.rows.reduce((a, b) => a + b.mediumTeachers, 0)}</td>
                    <td className="border border-slate-200 p-1.5">{report.teachingEvaluation.rows.reduce((a, b) => a + b.weakTeachers, 0)}</td>
                    <td className="border border-slate-200 p-1.5">{Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.khmerPct, 0) / 6)}%</td>
                    <td className="border border-slate-200 p-1.5">{Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.mathPct, 0) / 6)}%</td>
                    <td className="border border-slate-200 p-1.5">{Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.socialPct, 0) / 6)}%</td>
                    <td className="border border-slate-200 p-1.5">{Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.sciencePct, 0) / 6)}%</td>
                    <td className="border border-slate-200 p-1.5">{Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.englishPct, 0) / 6)}%</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Criteria description */}
            <div className="space-y-3 pt-3">
              <h4 className="text-sm font-semibold text-slate-800">លក្ខណៈវិនិច្ឆ័យគុណភាពបង្រៀន</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs">
                <div className="p-3 rounded-lg bg-emerald-50/50 border border-emerald-200">
                  <span className="font-bold text-emerald-800 block mb-1">ល្អ៖</span>
                  <textarea
                    rows={3}
                    value={report.teachingEvaluation.criteriaGood}
                    onChange={e => updateField(p => ({ ...p, teachingEvaluation: { ...p.teachingEvaluation, criteriaGood: e.target.value } }))}
                    className="w-full text-xs p-1.5 bg-white border border-emerald-200 rounded"
                  />
                </div>
                <div className="p-3 rounded-lg bg-amber-50/50 border border-amber-200">
                  <span className="font-bold text-amber-800 block mb-1">មធ្យម៖</span>
                  <textarea
                    rows={3}
                    value={report.teachingEvaluation.criteriaMedium}
                    onChange={e => updateField(p => ({ ...p, teachingEvaluation: { ...p.teachingEvaluation, criteriaMedium: e.target.value } }))}
                    className="w-full text-xs p-1.5 bg-white border border-amber-200 rounded"
                  />
                </div>
                <div className="p-3 rounded-lg bg-rose-50/50 border border-rose-200">
                  <span className="font-bold text-rose-800 block mb-1">ខ្សោយ៖</span>
                  <textarea
                    rows={3}
                    value={report.teachingEvaluation.criteriaWeak}
                    onChange={e => updateField(p => ({ ...p, teachingEvaluation: { ...p.teachingEvaluation, criteriaWeak: e.target.value } }))}
                    className="w-full text-xs p-1.5 bg-white border border-rose-200 rounded"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 4: HEALTH & LIFE SKILLS */}
      {subTab === 'health' && (
        <div className="space-y-6">
          {/* Life Skills Programs */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 border-b border-slate-100 pb-3 flex items-center gap-2">
              <HeartHandshake className="w-5 h-5 text-rose-600" />
              <span>កម្មវិធីបំណិនជីវិត</span>
            </h3>

            <div className="overflow-x-auto">
              <table className="w-full text-xs text-center border-collapse border border-slate-200">
                <thead className="bg-slate-100 text-slate-700 font-medium">
                  <tr>
                    <th rowSpan={2} className="border border-slate-200 p-2 text-left">បរិយាយកម្មវិធី</th>
                    <th colSpan={2} className="border border-slate-200 p-1">ចំនួនសាលា</th>
                    <th colSpan={4} className="border border-slate-200 p-1">ចំនួនសិស្សទទួលផល</th>
                    <th rowSpan={2} className="border border-slate-200 p-2">ផ្សេងៗ</th>
                  </tr>
                  <tr className="bg-slate-50 text-[11px]">
                    <th className="border border-slate-200 p-1">សរុប</th>
                    <th className="border border-slate-200 p-1">%</th>
                    <th className="border border-slate-200 p-1">សរុប</th>
                    <th className="border border-slate-200 p-1">%</th>
                    <th className="border border-slate-200 p-1">ស្រី</th>
                    <th className="border border-slate-200 p-1">%</th>
                  </tr>
                </thead>
                <tbody>
                  {report.lifeSkills.programs.map((prog, idx) => (
                    <tr key={prog.name} className="hover:bg-slate-50">
                      <td className="border border-slate-200 p-2 text-left font-medium">{prog.name}</td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={prog.schoolsCount}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.lifeSkills.programs];
                              list[idx] = { ...list[idx], schoolsCount: val, schoolsPct: val > 0 ? '100%' : '0%' };
                              return { ...p, lifeSkills: { ...p.lifeSkills, programs: list } };
                            });
                          }}
                          className="w-12 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">{prog.schoolsPct}</td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={prog.studentsTotal}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.lifeSkills.programs];
                              list[idx] = { ...list[idx], studentsTotal: val };
                              return { ...p, lifeSkills: { ...p.lifeSkills, programs: list } };
                            });
                          }}
                          className="w-14 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">{prog.studentsTotalPct}</td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="number"
                          value={prog.studentsFemale}
                          onChange={e => {
                            const val = Number(e.target.value);
                            updateField(p => {
                              const list = [...p.lifeSkills.programs];
                              list[idx] = { ...list[idx], studentsFemale: val };
                              return { ...p, lifeSkills: { ...p.lifeSkills, programs: list } };
                            });
                          }}
                          className="w-14 text-center p-1 border rounded"
                        />
                      </td>
                      <td className="border border-slate-200 p-1">{prog.studentsFemalePct}</td>
                      <td className="border border-slate-200 p-1">
                        <input
                          type="text"
                          value={prog.notes}
                          onChange={e => {
                            const val = e.target.value;
                            updateField(p => {
                              const list = [...p.lifeSkills.programs];
                              list[idx] = { ...list[idx], notes: val };
                              return { ...p, lifeSkills: { ...p.lifeSkills, programs: list } };
                            });
                          }}
                          placeholder="—"
                          className="w-full text-center p-1 border rounded"
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Deworming & Sanitation */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Deworming */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2 flex items-center justify-between">
                <span>ក. ការទម្លាក់ព្រូន (Deworming)</span>
                <span className="text-xs text-emerald-600 font-normal">អនុវត្តបាន ៩៨% - ៩៩%</span>
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="border border-slate-200 p-1.5">លើកទី</th>
                      <th className="border border-slate-200 p-1.5">សរុប</th>
                      <th className="border border-slate-200 p-1.5">ស្រី</th>
                      <th className="border border-slate-200 p-1.5">% សរុប</th>
                      <th className="border border-slate-200 p-1.5">% ស្រី</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.health.deworming.rounds.map((round, idx) => (
                      <tr key={round.roundName} className="hover:bg-slate-50">
                        <td className="border border-slate-200 p-1.5 font-medium">{round.roundName}</td>
                        <td className="border border-slate-200 p-1">
                          <input
                            type="number"
                            value={round.total}
                            onChange={e => {
                              const val = Number(e.target.value);
                              updateField(p => {
                                const list = [...p.health.deworming.rounds];
                                list[idx] = { ...list[idx], total: val };
                                return { ...p, health: { ...p.health, deworming: { ...p.health.deworming, rounds: list } } };
                              });
                            }}
                            className="w-14 text-center p-0.5 border rounded"
                          />
                        </td>
                        <td className="border border-slate-200 p-1">
                          <input
                            type="number"
                            value={round.female}
                            onChange={e => {
                              const val = Number(e.target.value);
                              updateField(p => {
                                const list = [...p.health.deworming.rounds];
                                list[idx] = { ...list[idx], female: val };
                                return { ...p, health: { ...p.health, deworming: { ...p.health.deworming, rounds: list } } };
                              });
                            }}
                            className="w-14 text-center p-0.5 border rounded"
                          />
                        </td>
                        <td className="border border-slate-200 p-1">{round.totalPct}</td>
                        <td className="border border-slate-200 p-1">{round.femalePct}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Sanitation and Water */}
            <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
              <h3 className="text-sm font-semibold text-slate-900 border-b border-slate-100 pb-2">
                ខ. ការរៀបចំបង្គន់អនាម័យ និងទឹកស្អាត
              </h3>

              <div className="overflow-x-auto">
                <table className="w-full text-xs text-center border-collapse border border-slate-200">
                  <thead className="bg-slate-100 text-slate-700">
                    <tr>
                      <th className="border border-slate-200 p-1.5 text-left">បរិយាយ</th>
                      <th className="border border-slate-200 p-1.5">សរុប</th>
                      <th className="border border-slate-200 p-1.5 bg-emerald-50">ប្រើបាន</th>
                      <th className="border border-slate-200 p-1.5 bg-rose-50">ខូច</th>
                    </tr>
                  </thead>
                  <tbody>
                    {report.health.sanitation.facilities.map((fac, idx) => (
                      <tr key={fac.facility} className="hover:bg-slate-50">
                        <td className="border border-slate-200 p-1.5 text-left font-medium">{fac.facility}</td>
                        <td className="border border-slate-200 p-1">
                          <input
                            type="number"
                            value={fac.totalCount}
                            onChange={e => {
                              const val = Number(e.target.value);
                              updateField(p => {
                                const list = [...p.health.sanitation.facilities];
                                list[idx] = { ...list[idx], totalCount: val };
                                return { ...p, health: { ...p.health, sanitation: { ...p.health.sanitation, facilities: list } } };
                              });
                            }}
                            className="w-12 text-center p-0.5 border rounded"
                          />
                        </td>
                        <td className="border border-slate-200 p-1">
                          <input
                            type="number"
                            value={fac.workingCount}
                            onChange={e => {
                              const val = Number(e.target.value);
                              updateField(p => {
                                const list = [...p.health.sanitation.facilities];
                                list[idx] = { ...list[idx], workingCount: val };
                                return { ...p, health: { ...p.health, sanitation: { ...p.health.sanitation, facilities: list } } };
                              });
                            }}
                            className="w-12 text-center p-0.5 border rounded"
                          />
                        </td>
                        <td className="border border-slate-200 p-1">
                          <input
                            type="number"
                            value={fac.brokenCount}
                            onChange={e => {
                              const val = Number(e.target.value);
                              updateField(p => {
                                const list = [...p.health.sanitation.facilities];
                                list[idx] = { ...list[idx], brokenCount: val };
                                return { ...p, health: { ...p.health, sanitation: { ...p.health.sanitation, facilities: list } } };
                              });
                            }}
                            className="w-12 text-center p-0.5 border rounded"
                          />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB 5: NARRATIVE, CHALLENGES & REQUESTS */}
      {subTab === 'narrative' && (
        <div className="space-y-6">
          <div className="bg-amber-50/70 border border-amber-200 p-4 rounded-xl flex items-start gap-3 text-xs text-amber-900">
            <Sparkles className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold block text-sm">មុខងារសរសេរ និងកែលម្អអត្ថបទរដ្ឋបាលដោយ AI (AI Narrative Assist)</span>
              <p className="mt-0.5 text-amber-800 leading-relaxed">
                ចុចប៊ូតុង <strong>"✨ សរសេរដោយ AI"</strong> នៅផ្នែកនីមួយៗខាងក្រោម ដើម្បីឱ្យ AI ជួយតាក់តែងខ្លឹមសារ សកម្មភាពអនុវត្ត បញ្ហាប្រឈម និងសំណូមពរ ស្របតាមក្បួនខ្នាតរដ្ឋបាលផ្លូវការរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។
              </p>
            </div>
          </div>

          {/* Section: Life Skills */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-900">១. ការងារបំណិនជីវិត និងអនាម័យសិស្ស</h3>
              <button
                disabled={aiGeneratingSection === 'lifeSkills'}
                onClick={() => handlePolishSectionWithAi('lifeSkills', 'ការងារបំណិនជីវិត និងអនាម័យ')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiGeneratingSection === 'lifeSkills' ? 'កំពុងសរសេរ...' : '✨ សរសេរដោយ AI'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">សកម្មភាពអនុវត្ត៖</label>
                <textarea
                  rows={2}
                  value={report.lifeSkills.activities}
                  onChange={e => updateField(p => ({ ...p, lifeSkills: { ...p.lifeSkills, activities: e.target.value } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">បញ្ហាប្រឈម៖</label>
                <textarea
                  rows={2}
                  value={report.lifeSkills.challenges}
                  onChange={e => updateField(p => ({ ...p, lifeSkills: { ...p.lifeSkills, challenges: e.target.value } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">សំណូមពរ៖</label>
                <textarea
                  rows={2}
                  value={report.lifeSkills.requests}
                  onChange={e => updateField(p => ({ ...p, lifeSkills: { ...p.lifeSkills, requests: e.target.value } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Deworming */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-900">២. ការទម្លាក់ព្រូន</h3>
              <button
                disabled={aiGeneratingSection === 'deworming'}
                onClick={() => handlePolishSectionWithAi('deworming', 'ការទម្លាក់ព្រូនដល់សិស្សានុសិស្ស')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiGeneratingSection === 'deworming' ? 'កំពុងសរសេរ...' : '✨ សរសេរដោយ AI'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">សកម្មភាពអនុវត្ត៖</label>
                <textarea
                  rows={2}
                  value={report.health.deworming.activities}
                  onChange={e => updateField(p => ({ ...p, health: { ...p.health, deworming: { ...p.health.deworming, activities: e.target.value } } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">បញ្ហាប្រឈម៖</label>
                <textarea
                  rows={2}
                  value={report.health.deworming.challenges}
                  onChange={e => updateField(p => ({ ...p, health: { ...p.health, deworming: { ...p.health.deworming, challenges: e.target.value } } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">សំណូមពរ៖</label>
                <textarea
                  rows={2}
                  value={report.health.deworming.requests}
                  onChange={e => updateField(p => ({ ...p, health: { ...p.health, deworming: { ...p.health.deworming, requests: e.target.value } } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Sanitation & Water */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2">
              <h3 className="text-sm font-semibold text-slate-900">៣. ការរៀបចំបង្គន់អនាម័យ និងទឹកស្អាត</h3>
              <button
                disabled={aiGeneratingSection === 'sanitation'}
                onClick={() => handlePolishSectionWithAi('sanitation', 'ការរៀបចំបង្គន់អនាម័យ និងទឹកស្អាត')}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 text-xs font-medium transition-colors"
              >
                <Sparkles className="w-3.5 h-3.5" />
                {aiGeneratingSection === 'sanitation' ? 'កំពុងសរសេរ...' : '✨ សរសេរដោយ AI'}
              </button>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">សកម្មភាពអនុវត្ត៖</label>
                <textarea
                  rows={2}
                  value={report.health.sanitation.activities}
                  onChange={e => updateField(p => ({ ...p, health: { ...p.health, sanitation: { ...p.health.sanitation, activities: e.target.value } } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">បញ្ហាប្រឈម៖</label>
                <textarea
                  rows={2}
                  value={report.health.sanitation.challenges}
                  onChange={e => updateField(p => ({ ...p, health: { ...p.health, sanitation: { ...p.health.sanitation, challenges: e.target.value } } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">សំណូមពរ៖</label>
                <textarea
                  rows={2}
                  value={report.health.sanitation.requests}
                  onChange={e => updateField(p => ({ ...p, health: { ...p.health, sanitation: { ...p.health.sanitation, requests: e.target.value } } }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: EXTRACURRICULAR, INSPECTION & COMMUNITY */}
      {subTab === 'activities' && (
        <div className="space-y-6">
          {/* Section: Extracurricular Activities */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-5">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Trophy className="w-5 h-5 text-amber-600" />
              <span>សកម្មភាពអប់រំក្រៅសាលា ក្រៅថ្នាក់</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              {/* ក.ការងារសង្គម */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <p className="font-bold text-slate-800 text-sm">ក. ការងារសង្គម</p>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ខ្លឹមសារ៖</label>
                  <textarea
                    rows={2}
                    value={report.extracurricular.socialWork.content}
                    onChange={e => updateField(p => ({
                      ...p,
                      extracurricular: {
                        ...p.extracurricular,
                        socialWork: { ...p.extracurricular.socialWork, content: e.target.value }
                      }
                    }))}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">លទ្ធផល៖</label>
                  <textarea
                    rows={2}
                    value={report.extracurricular.socialWork.result}
                    onChange={e => updateField(p => ({
                      ...p,
                      extracurricular: {
                        ...p.extracurricular,
                        socialWork: { ...p.extracurricular.socialWork, result: e.target.value }
                      }
                    }))}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* ខ.ពលកម្មបង្កបង្កើនផល */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2">
                <p className="font-bold text-slate-800 text-sm">ខ. ពលកម្មបង្កបង្កើនផល</p>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">ខ្លឹមសារ៖</label>
                  <textarea
                    rows={2}
                    value={report.extracurricular.agriculture.content}
                    onChange={e => updateField(p => ({
                      ...p,
                      extracurricular: {
                        ...p.extracurricular,
                        agriculture: { ...p.extracurricular.agriculture, content: e.target.value }
                      }
                    }))}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="block text-slate-700 font-medium mb-1">លទ្ធផល៖</label>
                  <textarea
                    rows={2}
                    value={report.extracurricular.agriculture.result}
                    onChange={e => updateField(p => ({
                      ...p,
                      extracurricular: {
                        ...p.extracurricular,
                        agriculture: { ...p.extracurricular.agriculture, result: e.target.value }
                      }
                    }))}
                    className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>
              </div>

              {/* គ.ទស្សនៈកិច្ចសិក្សា */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-2 md:col-span-2">
                <p className="font-bold text-slate-800 text-sm">គ. ទស្សនៈកិច្ចសិក្សា</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">ខ្លឹមសារ៖</label>
                    <input
                      type="text"
                      value={report.extracurricular.studyTour.content}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          studyTour: { ...p.extracurricular.studyTour, content: e.target.value }
                        }
                      }))}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">លទ្ធផល៖</label>
                    <input
                      type="text"
                      value={report.extracurricular.studyTour.result}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          studyTour: { ...p.extracurricular.studyTour, result: e.target.value }
                        }
                      }))}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ឃ.កីឡា */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3 md:col-span-2">
                <p className="font-bold text-slate-800 text-sm">ឃ. កីឡា</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ការប្រកួត (លើក)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.sports.competitionsCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          sports: { ...p.extracurricular.sports, competitionsCount: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ក្នុងសាលា (ថ្នាក់)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.sports.schoolLevelClasses}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          sports: { ...p.extracurricular.sports, schoolLevelClasses: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ថ្នាក់កម្រង (ដង)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.sports.clusterTimes}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          sports: { ...p.extracurricular.sports, clusterTimes: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ស្រុក (ដង)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.sports.districtTimes}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          sports: { ...p.extracurricular.sports, districtTimes: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ខេត្ត (ដង)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.sports.provinceTimes}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          sports: { ...p.extracurricular.sports, provinceTimes: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">ខ្លឹមសារ៖</label>
                    <input
                      type="text"
                      value={report.extracurricular.sports.content}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          sports: { ...p.extracurricular.sports, content: e.target.value }
                        }
                      }))}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">លទ្ធផល៖</label>
                    <input
                      type="text"
                      value={report.extracurricular.sports.result}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          sports: { ...p.extracurricular.sports, result: e.target.value }
                        }
                      }))}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>

              {/* ង.សិល្បៈ */}
              <div className="p-3.5 bg-slate-50 border border-slate-200 rounded-lg space-y-3 md:col-span-2">
                <p className="font-bold text-slate-800 text-sm">ង. សិល្បៈ</p>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ការសម្ដែង (លើក)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.arts.performancesCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          arts: { ...p.extracurricular.arts, performancesCount: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ក្នុងសាលា (ថ្នាក់)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.arts.schoolLevelClasses}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          arts: { ...p.extracurricular.arts, schoolLevelClasses: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ថ្នាក់កម្រង (ដង)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.arts.clusterTimes}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          arts: { ...p.extracurricular.arts, clusterTimes: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ស្រុក (ដង)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.arts.districtTimes}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          arts: { ...p.extracurricular.arts, districtTimes: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-1">ខេត្ត (ដង)៖</label>
                    <input
                      type="number"
                      value={report.extracurricular.arts.provinceTimes}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          arts: { ...p.extracurricular.arts, provinceTimes: Number(e.target.value) || 0 }
                        }
                      }))}
                      className="w-full p-1.5 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">ខ្លឹមសារ៖</label>
                    <input
                      type="text"
                      value={report.extracurricular.arts.content}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          arts: { ...p.extracurricular.arts, content: e.target.value }
                        }
                      }))}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">លទ្ធផល៖</label>
                    <input
                      type="text"
                      value={report.extracurricular.arts.result}
                      onChange={e => updateField(p => ({
                        ...p,
                        extracurricular: {
                          ...p.extracurricular,
                          arts: { ...p.extracurricular.arts, result: e.target.value }
                        }
                      }))}
                      className="w-full p-2 border border-slate-300 rounded-md bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Section: Inspection */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              <span>ការងារអធិការកិច្ច</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 text-xs">
              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">ថ្នាក់ក្រសួង</p>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[11px] text-slate-500">ចំនួនសាលា៖</span>
                    <input
                      type="number"
                      value={report.inspection.ministry.schoolsCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, ministry: { ...p.inspection.ministry, schoolsCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">ស្មើថ្នាក់៖</span>
                    <input
                      type="number"
                      value={report.inspection.ministry.classesCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, ministry: { ...p.inspection.ministry, classesCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">ថ្នាក់ខេត្ត</p>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[11px] text-slate-500">ចំនួនសាលា៖</span>
                    <input
                      type="number"
                      value={report.inspection.province.schoolsCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, province: { ...p.inspection.province, schoolsCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">ស្មើថ្នាក់៖</span>
                    <input
                      type="number"
                      value={report.inspection.province.classesCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, province: { ...p.inspection.province, classesCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">ថ្នាក់ស្រុក</p>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[11px] text-slate-500">ចំនួនសាលា៖</span>
                    <input
                      type="number"
                      value={report.inspection.district.schoolsCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, district: { ...p.inspection.district, schoolsCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">ស្មើថ្នាក់៖</span>
                    <input
                      type="number"
                      value={report.inspection.district.classesCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, district: { ...p.inspection.district, classesCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-slate-50 border border-slate-200 rounded-lg">
                <p className="font-semibold text-slate-800 mb-2">ថ្នាក់កម្រង</p>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[11px] text-slate-500">ចំនួនសាលា៖</span>
                    <input
                      type="number"
                      value={report.inspection.cluster.schoolsCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, cluster: { ...p.inspection.cluster, schoolsCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-slate-500">ស្មើថ្នាក់៖</span>
                    <input
                      type="number"
                      value={report.inspection.cluster.classesCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, cluster: { ...p.inspection.cluster, classesCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-slate-300 rounded bg-white text-center"
                    />
                  </div>
                </div>
              </div>

              <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg">
                <p className="font-semibold text-amber-900 mb-2">សរុបថ្នាក់ចុះពិនិត្យ</p>
                <div className="space-y-1.5">
                  <div>
                    <span className="text-[11px] text-amber-700">ចំនួនសាលា៖</span>
                    <input
                      type="number"
                      value={report.inspection.total.schoolsCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, total: { ...p.inspection.total, schoolsCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-amber-300 rounded bg-white text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[11px] text-amber-700">ស្មើថ្នាក់៖</span>
                    <input
                      type="number"
                      value={report.inspection.total.classesCount}
                      onChange={e => updateField(p => ({
                        ...p,
                        inspection: { ...p.inspection, total: { ...p.inspection.total, classesCount: Number(e.target.value) || 0 } }
                      }))}
                      className="w-full p-1 border border-amber-300 rounded bg-white text-center"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="text-xs pt-2">
              <label className="block text-slate-700 font-medium mb-1">ខ្លឹមសារជួយណែនាំ + បទពិសោធន៍ការងារ៖</label>
              <textarea
                rows={2}
                value={report.inspection.guidanceFeedback}
                onChange={e => updateField(p => ({
                  ...p,
                  inspection: { ...p.inspection, guidanceFeedback: e.target.value }
                }))}
                className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
              />
            </div>
          </div>

          {/* Section: Community Work */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <Users className="w-5 h-5 text-amber-600" />
              <span>ការងារសហគមន៍</span>
            </h3>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">សហគមន៍ចូលរួមសហការអភិវឌ្ឍល្អ៖</label>
                <textarea
                  rows={2}
                  value={report.communityWork.cooperationDetails}
                  onChange={e => updateField(p => ({
                    ...p,
                    communityWork: { ...p.communityWork, cooperationDetails: e.target.value }
                  }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
              <div>
                <label className="block text-slate-700 font-medium mb-1">លទ្ធផល៖</label>
                <textarea
                  rows={2}
                  value={report.communityWork.result}
                  onChange={e => updateField(p => ({
                    ...p,
                    communityWork: { ...p.communityWork, result: e.target.value }
                  }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* SUB-TAB: VACATION PREPARATION & CONCLUSION */}
      {subTab === 'vacation_conclusion' && (
        <div className="space-y-6">
          {/* Section III: Vacation Preparation */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <CalendarCheck className="w-5 h-5 text-amber-600" />
              <span>III. លក្ខណៈត្រៀមមហាវិស្សមកាល</span>
            </h3>

            <div className="space-y-3 text-xs">
              <p className="font-semibold text-slate-800">កិច្ចការដែលបានត្រៀមរៀបចំ៖</p>
              <div className="space-y-2">
                {report.vacationPrep.tasks.map((task, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <span className="w-6 text-slate-400 font-mono text-center">{idx + 1}.</span>
                    <input
                      type="text"
                      value={task}
                      onChange={e => {
                        const newTasks = [...report.vacationPrep.tasks];
                        newTasks[idx] = e.target.value;
                        updateField(p => ({ ...p, vacationPrep: { ...p.vacationPrep, tasks: newTasks } }));
                      }}
                      className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                    <button
                      onClick={() => {
                        const newTasks = report.vacationPrep.tasks.filter((_, i) => i !== idx);
                        updateField(p => ({ ...p, vacationPrep: { ...p.vacationPrep, tasks: newTasks } }));
                      }}
                      className="p-2 text-rose-500 hover:bg-rose-50 rounded"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
                <button
                  onClick={() => {
                    updateField(p => ({
                      ...p,
                      vacationPrep: {
                        ...p.vacationPrep,
                        tasks: [...p.vacationPrep.tasks, '']
                      }
                    }));
                  }}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>បន្ថែមភារកិច្ចត្រៀម</span>
                </button>
              </div>

              <div className="pt-3 border-t border-slate-100">
                <label className="block text-slate-700 font-medium mb-1">ស្ថានភាពបញ្ជីឈ្មោះសិស្សអាហារូបករណ៍៖</label>
                <input
                  type="text"
                  value={report.vacationPrep.scholarshipListStatus}
                  onChange={e => updateField(p => ({
                    ...p,
                    vacationPrep: { ...p.vacationPrep, scholarshipListStatus: e.target.value }
                  }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section IV: Conclusion */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <FileCheck className="w-5 h-5 text-amber-600" />
              <span>IV. សន្និដ្ឋាន</span>
            </h3>

            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-slate-700 font-medium mb-1">ការវាយតម្លៃសន្និដ្ឋានទូទៅ៖</label>
                <textarea
                  rows={3}
                  value={report.conclusion.generalSummary}
                  onChange={e => updateField(p => ({
                    ...p,
                    conclusion: { ...p.conclusion, generalSummary: e.target.value }
                  }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-slate-700 font-medium">សមិទ្ធផលសំខាន់ៗដែលសម្រេចបាន៖</label>
                  <button
                    onClick={() => {
                      updateField(p => ({
                        ...p,
                        conclusion: {
                          ...p.conclusion,
                          keyAchievements: [...p.conclusion.keyAchievements, '']
                        }
                      }));
                    }}
                    className="inline-flex items-center gap-1 px-2 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded"
                  >
                    <Plus className="w-3 h-3" />
                    <span>បន្ថែមចំណុច</span>
                  </button>
                </div>
                <div className="space-y-2">
                  {report.conclusion.keyAchievements.map((item, idx) => (
                    <div key={idx} className="flex items-start gap-2">
                      <span className="w-6 text-slate-400 font-mono text-center pt-2">{idx + 1}.</span>
                      <textarea
                        rows={2}
                        value={item}
                        onChange={e => {
                          const updatedList = [...report.conclusion.keyAchievements];
                          updatedList[idx] = e.target.value;
                          updateField(p => ({
                            ...p,
                            conclusion: { ...p.conclusion, keyAchievements: updatedList }
                          }));
                        }}
                        className="flex-1 p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                      />
                      <button
                        onClick={() => {
                          const updatedList = report.conclusion.keyAchievements.filter((_, i) => i !== idx);
                          updateField(p => ({
                            ...p,
                            conclusion: { ...p.conclusion, keyAchievements: updatedList }
                          }));
                        }}
                        className="p-2 text-rose-500 hover:bg-rose-50 rounded mt-1"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">បញ្ហាប្រឈមដែលត្រូវបន្តដោះស្រាយ៖</label>
                <textarea
                  rows={2}
                  value={report.conclusion.challengesToResolve}
                  onChange={e => updateField(p => ({
                    ...p,
                    conclusion: { ...p.conclusion, challengesToResolve: e.target.value }
                  }))}
                  className="w-full p-2 border border-slate-300 rounded-md focus:ring-1 focus:ring-slate-900 focus:outline-none"
                />
              </div>
            </div>
          </div>

          {/* Section: Signatures Preview & Configuration */}
          <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
            <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2 border-b border-slate-100 pb-3">
              <ClipboardList className="w-5 h-5 text-amber-600" />
              <span>ផ្នែកចុះហត្ថលេខា និងកាលបរិច្ឆេទ (Official Signatures)</span>
            </h3>

            <div className="bg-slate-50 p-4 rounded-xl border border-slate-200">
              <p className="text-xs font-semibold text-slate-700 mb-3">ទម្រង់ហត្ថលេខាផ្លូវការលើរបាយការណ៍បោះពុម្ព (Print Preview)</p>
              
              <div className="grid grid-cols-2 gap-4 text-center text-xs bg-white p-4 rounded-lg border border-slate-200 shadow-xs">
                {/* Left */}
                <div className="p-3 border-r border-slate-100 space-y-3">
                  <p className="font-bold text-slate-900 text-sm">បានឃើញ និងឯកភាព</p>
                  <p className="font-bold text-slate-800">នាយកសាលា</p>
                  <div className="pt-8 pb-2">
                    <div className="border-b border-dotted border-slate-300 w-32 mx-auto"></div>
                    <p className="text-[10px] text-slate-400 mt-1 italic">(ហត្ថលេខា និងត្រា)</p>
                  </div>
                </div>

                {/* Right */}
                <div className="p-3 space-y-2">
                  <p className="font-medium text-slate-800">
                    {report.info.reportDateKhmerLunar || 'ថ្ងៃសៅរ៍ ១៥រោច ខែបុស្ស ឆ្នាំម្សាញ់ សប្ដស័ក ព.ស.២៥៦៩'}
                  </p>
                  <p className="font-medium text-slate-800">
                    {report.info.schoolName.replace(/^សាលាបឋមសិក្សា\s*/, '') || 'រោគ'}, {report.info.reportDateKhmerSolar || 'ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦'}
                  </p>
                  <p className="font-bold text-slate-900 pt-2">
                    អ្នករៀបចំរបាយការណ៍
                  </p>
                  <div className="pt-6 pb-2">
                    <div className="border-b border-dotted border-slate-300 w-32 mx-auto"></div>
                    <p className="text-[10px] text-slate-400 mt-1 italic">(ហត្ថលេខា និងឈ្មោះ)</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
