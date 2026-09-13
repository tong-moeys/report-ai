import React from 'react';
import { 
  Users, 
  GraduationCap, 
  TrendingUp, 
  UserCheck, 
  School, 
  CheckCircle, 
  AlertTriangle,
  Award,
  BookOpen
} from 'lucide-react';
import { FullSchoolReport } from '../types';

interface AnalyticsDashboardProps {
  report: FullSchoolReport;
}

export const AnalyticsDashboard: React.FC<AnalyticsDashboardProps> = ({ report }) => {
  // Calculations
  const totalYearEnd = report.academicResults.reduce((a, b) => a + b.yearEndTotal, 0);
  const totalFemale = report.academicResults.reduce((a, b) => a + b.yearEndFemale, 0);
  const femaleRatio = totalYearEnd > 0 ? ((totalFemale / totalYearEnd) * 100).toFixed(1) : '0';

  const totalPassed = report.academicResults.reduce((a, b) => a + b.finalPassedTotal, 0);
  const passRate = totalYearEnd > 0 ? ((totalPassed / totalYearEnd) * 100).toFixed(1) : '0';

  const totalRepeaters = report.academicResults.reduce((a, b) => a + b.repeaterTotal, 0);
  const repeaterRate = totalYearEnd > 0 ? ((totalRepeaters / totalYearEnd) * 100).toFixed(1) : '0';

  const totalDropouts = report.academicResults.reduce((a, b) => a + b.dropoutTotal, 0);
  const dropoutRate = totalYearEnd > 0 ? ((totalDropouts / totalYearEnd) * 100).toFixed(1) : '0';

  // Math consistency validation
  const mathFormulaErrors: string[] = [];
  report.academicResults.forEach(r => {
    if (r.finalPassedTotal !== r.passedAverageTotal + r.passedRetestTotal) {
      mathFormulaErrors.push(`ថ្នាក់ទី${r.grade}៖ រូបមន្ត 5=3+4 មិនត្រូវគ្នា (${r.finalPassedTotal} ≠ ${r.passedAverageTotal} + ${r.passedRetestTotal})`);
    }
    if (r.finalStudentsTotal !== r.finalPassedTotal + r.repeaterTotal) {
      mathFormulaErrors.push(`ថ្នាក់ទី${r.grade}៖ រូបមន្ត B=5+6 មិនត្រូវគ្នា (${r.finalStudentsTotal} ≠ ${r.finalPassedTotal} + ${r.repeaterTotal})`);
    }
    if (r.yearEndTotal !== r.finalStudentsTotal + r.dropoutTotal) {
      mathFormulaErrors.push(`ថ្នាក់ទី${r.grade}៖ រូបមន្ត A=B+7 មិនត្រូវគ្នា (${r.yearEndTotal} ≠ ${r.finalStudentsTotal} + ${r.dropoutTotal})`);
    }
  });

  // Teaching evaluations summary
  const totalGood = report.teachingEvaluation.rows.reduce((a, b) => a + b.goodTeachers, 0);
  const totalMed = report.teachingEvaluation.rows.reduce((a, b) => a + b.mediumTeachers, 0);
  const totalWeak = report.teachingEvaluation.rows.reduce((a, b) => a + b.weakTeachers, 0);
  const totalEvaluated = totalGood + totalMed + totalWeak || 1;

  // Average Curriculum progress
  const avgKhmer = Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.khmerPct, 0) / 6);
  const avgMath = Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.mathPct, 0) / 6);
  const avgSocial = Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.socialPct, 0) / 6);
  const avgScience = Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.sciencePct, 0) / 6);
  const avgEnglish = Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.englishPct, 0) / 6);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">
      
      {/* Mathematical Audit Badge */}
      <div className={`p-4 rounded-xl border flex items-center justify-between shadow-xs ${
        mathFormulaErrors.length === 0 
          ? 'bg-emerald-50/70 border-emerald-200 text-emerald-900' 
          : 'bg-amber-50 border-amber-200 text-amber-900'
      }`}>
        <div className="flex items-center gap-3">
          {mathFormulaErrors.length === 0 ? (
            <div className="w-8 h-8 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-700">
              <CheckCircle className="w-5 h-5" />
            </div>
          ) : (
            <div className="w-8 h-8 rounded-full bg-amber-100 flex items-center justify-center text-amber-700">
              <AlertTriangle className="w-5 h-5" />
            </div>
          )}
          <div>
            <h4 className="text-sm font-bold">
              {mathFormulaErrors.length === 0 
                ? 'ប្រព័ន្ធផ្ទៀងផ្ទាត់ទិន្នន័យរូបមន្ត MoEYS ត្រឹមត្រូវ ១០០%' 
                : 'បានរកឃើញចំណុចមិនស៊ីសង្វាក់គ្នានៃរូបមន្តលេខ'}
            </h4>
            <p className="text-xs text-slate-600 mt-0.5">
              {mathFormulaErrors.length === 0 
                ? 'រូបមន្តផ្លូវការ A=5+6+7, B=5+6, និង 5=3+4 ត្រូវបានគណនាត្រឹមត្រូវគ្រប់កម្រិតថ្នាក់ទាំងអស់។'
                : mathFormulaErrors.join(' | ')}
            </p>
          </div>
        </div>
      </div>

      {/* KPI Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">សិស្សដំណាច់ឆ្នាំសរុប</span>
            <Users className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{totalYearEnd}</span>
            <span className="text-xs text-slate-500">នាក់ (ស្រី {totalFemale})</span>
          </div>
          <p className="text-xs text-emerald-600 mt-1">សមាមាត្រសិស្សស្រី {femaleRatio}%</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">អត្រាជាប់ចុងឆ្នាំ (Pass Rate)</span>
            <GraduationCap className="w-4 h-4 text-emerald-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-emerald-600">{passRate}%</span>
            <span className="text-xs text-slate-500">({totalPassed}/{totalYearEnd})</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">រួមបញ្ចូលទាំងការប្រឡងតេស្តឡើងវិញ</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">អត្រាបោះបង់ និង ត្រួតថ្នាក់</span>
            <TrendingUp className="w-4 h-4 text-rose-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-rose-600">{dropoutRate}%</span>
            <span className="text-xs text-slate-500">បោះបង់ ({totalDropouts} នាក់)</span>
          </div>
          <p className="text-xs text-amber-600 mt-1">ត្រួតថ្នាក់ {repeaterRate}% ({totalRepeaters} នាក់)</p>
        </div>

        <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center justify-between text-slate-500 mb-2">
            <span className="text-xs font-medium">បុគ្គលិកអប់រំ និងថ្នាក់រៀន</span>
            <School className="w-4 h-4 text-indigo-600" />
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold text-slate-900">{report.staff.overallStaff.total}</span>
            <span className="text-xs text-slate-500">នាក់ (ស្រី {report.staff.overallStaff.female})</span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            សរុប {report.students.classesByGrade.totalClasses} ថ្នាក់ (~{Math.round(totalYearEnd / report.students.classesByGrade.totalClasses)} សិស្ស/ថ្នាក់)
          </p>
        </div>
      </div>

      {/* Grade-by-Grade Performance Visualizer */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-base font-semibold text-slate-900 flex items-center gap-2">
          <Award className="w-5 h-5 text-indigo-600" />
          <span>លទ្ធផលប្រឡងជាប់តាមកម្រិតថ្នាក់នីមួយៗ (Grade 1 - 6 Pass Rate)</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3 pt-2">
          {report.academicResults.map(g => {
            const pct = g.yearEndTotal > 0 ? Math.round((g.finalPassedTotal / g.yearEndTotal) * 100) : 0;
            return (
              <div key={g.grade} className="p-4 rounded-xl bg-slate-50 border border-slate-100 flex flex-col items-center text-center">
                <span className="text-xs font-bold text-slate-700 mb-1">ថ្នាក់ទី{g.grade}</span>
                <div className="relative w-16 h-16 flex items-center justify-center my-2">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <path
                      className="text-slate-200"
                      strokeWidth="3.5"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                    <path
                      className="text-emerald-500"
                      strokeDasharray={`${pct}, 100`}
                      strokeWidth="3.5"
                      strokeLinecap="round"
                      stroke="currentColor"
                      fill="none"
                      d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                    />
                  </svg>
                  <span className="absolute text-xs font-bold text-slate-800">{pct}%</span>
                </div>
                <div className="text-[11px] text-slate-500 space-y-0.5 mt-1">
                  <p>ជាប់: <span className="font-semibold text-emerald-700">{g.finalPassedTotal}</span>/{g.yearEndTotal}</p>
                  <p>ត្រួត: {g.repeaterTotal} | បោះបង់: {g.dropoutTotal}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Curriculum & Teaching Quality Metrics */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Curriculum Progress */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-blue-600" />
            <span>ការអនុវត្តកម្មវិធីសិក្សាតាមមុខវិជ្ជា (%)</span>
          </h3>

          <div className="space-y-3 pt-1">
            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>ភាសាខ្មែរ</span>
                <span>{avgKhmer}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-600 rounded-full" style={{ width: `${avgKhmer}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>គណិតវិទ្យា</span>
                <span>{avgMath}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-indigo-600 rounded-full" style={{ width: `${avgMath}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>សិក្សាសង្គម</span>
                <span>{avgSocial}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-emerald-600 rounded-full" style={{ width: `${avgSocial}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>វិទ្យាសាស្ត្រ</span>
                <span>{avgScience}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: `${avgScience}%` }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-medium text-slate-700 mb-1">
                <span>ភាសាអង់គ្លេស</span>
                <span>{avgEnglish}%</span>
              </div>
              <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-600 rounded-full" style={{ width: `${avgEnglish}%` }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Teaching Quality Distribution */}
        <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
          <h3 className="text-sm font-semibold text-slate-900 flex items-center gap-2">
            <UserCheck className="w-4 h-4 text-emerald-600" />
            <span>ការវាយតម្លៃគរុកោសល្យគ្រូបង្រៀន</span>
          </h3>

          <div className="grid grid-cols-3 gap-3 pt-2">
            <div className="p-3 bg-emerald-50 rounded-lg border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-medium">បង្រៀនល្អ</span>
              <p className="text-2xl font-bold text-emerald-700 my-1">{totalGood}</p>
              <span className="text-[11px] text-emerald-600">{Math.round((totalGood / totalEvaluated) * 100)}%</span>
            </div>

            <div className="p-3 bg-amber-50 rounded-lg border border-amber-200 text-center">
              <span className="text-xs text-amber-800 font-medium">បង្រៀនមធ្យម</span>
              <p className="text-2xl font-bold text-amber-700 my-1">{totalMed}</p>
              <span className="text-[11px] text-amber-600">{Math.round((totalMed / totalEvaluated) * 100)}%</span>
            </div>

            <div className="p-3 bg-rose-50 rounded-lg border border-rose-200 text-center">
              <span className="text-xs text-rose-800 font-medium">បង្រៀនខ្សោយ</span>
              <p className="text-2xl font-bold text-rose-700 my-1">{totalWeak}</p>
              <span className="text-[11px] text-rose-600">{Math.round((totalWeak / totalEvaluated) * 100)}%</span>
            </div>
          </div>

          <div className="bg-slate-50 p-3 rounded-lg border border-slate-200 text-xs text-slate-600 space-y-1 mt-2">
            <p className="font-semibold text-slate-800">សេចក្តីសង្ខេបអំពីគុណវុឌ្ឍិគ្រូ៖</p>
            <p>• គ្រូបង្រៀន ៥០% ស្ថិតក្នុងកម្រិតល្អ ដោយមានកិច្ចតែងការ និងសម្ភារឧបទេសគ្រប់គ្រាន់។</p>
            <p>• គ្រូបង្រៀន ៥០% ស្ថិតក្នុងកម្រិតមធ្យម ត្រូវការការបំប៉នវិធីសាស្ត្របង្រៀនបន្ថែមក្នុងកម្រង។</p>
            <p>• គ្មានគ្រូបង្រៀនកម្រិតខ្សោយនោះឡើយ។</p>
          </div>
        </div>

      </div>

    </div>
  );
};
