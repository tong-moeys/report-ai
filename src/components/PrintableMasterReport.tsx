import React from 'react';
import { FullSchoolReport } from '../types';
import { OfficialReportHeader } from './OfficialReportHeader';
import { PostTestAcademicTable } from './PostTestAcademicTable';

interface PrintableMasterReportProps {
  report: FullSchoolReport;
  num: (val: number | string | undefined | null) => string;
  useKhmerNumerals: boolean;
}

export const PrintableMasterReport: React.FC<PrintableMasterReportProps> = ({
  report,
  num,
  useKhmerNumerals,
}) => {
  return (
    <div className="master-report-container text-slate-900 text-[13px] leading-relaxed">
      {/* Shared Unified Header */}
      <OfficialReportHeader
        info={report.info}
        reportTypeTitle={report.info.reportTitle || 'របាយការណ៍បូកសរុបលទ្ធផលការងារដំណាច់ឆ្នាំ'}
        subTitle={`ផ្នែកបឋមសិក្សា ឆ្នាំសិក្សា ${report.info.academicYear || '២០២៥-២០២៦'}`}
        solarDate={report.info.reportDateKhmerSolar}
        lunarDate={report.info.reportDateKhmerLunar}
        badgeText="របាយការណ៍លម្អិតផ្លូវការ (Master Report)"
      />

      {/* SECTION I */}
      <div className="space-y-4 mb-6">
        <h2 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
          I-ការប្រែប្រួលខាងបរិមាណ
        </h2>

        {/* School info */}
        <div className="space-y-1 pl-2">
          <p className="font-semibold text-slate-800">សាលារៀន</p>
          <p className="pl-4">
            - ចំនួនសាលារៀនសរុប : <span className="font-medium">{num(1)} នៅទីប្រជុំជន ……. តំបន់ធម្មតា …… ដាច់ស្រយាល {report.info.locationType === 'remote' ? '✅' : '……'} មិនធម្មតា …….។</span>
          </p>
          <p className="pl-4">
            - អង្គការចំនួន : <span className="font-medium">{num(3)} ឈ្មោះអង្គការ : {report.info.partnerNGOs}។</span>
          </p>
          <p className="pl-4">
            - ចំនួនបន្ទប់សរុប :​ <span className="font-medium">{num(report.info.roomsTotal)} បន្ទប់ បង្រៀនចំនួន {num(report.info.roomsTeaching)} បន្ទប់ មិនបង្រៀនចំនួន {num(report.info.roomsNonTeaching)} បន្ទប់ ។</span>
          </p>
        </div>

        {/* Student stats */}
        <div className="space-y-2 pl-2">
          <p className="font-semibold text-slate-800">សិស្ស</p>
          <p className="pl-4">
            - សិស្សសរុប : <span className="font-medium">{num(report.students.overall.total)} នាក់ ស្រី {num(report.students.overall.female)} នាក់ កើន {num(report.students.overall.change)} នាក់ ស្រី {num(report.students.overall.change)} នាក់ ចូល {num(report.students.overall.transferredIn)} នាក់ ស្រី {num(report.students.overall.transferredIn)} នាក់ ចេញ {num(report.students.overall.transferredOut)} នាក់ ស្រី {num(report.students.overall.transferredOut)} នាក់ ។</span>
          </p>
          <p className="pl-6 text-xs text-slate-600">
            {report.students.note}
          </p>

          {/* By Grade Table */}
          <div className="pl-4 my-2">
            <table className="w-full text-center border-collapse border border-slate-300 text-xs">
              <thead className="bg-slate-100">
                <tr>
                  <th className="border border-slate-300 p-1.5 font-semibold">ថ្នាក់</th>
                  <th className="border border-slate-300 p-1.5 font-semibold">សរុប</th>
                  <th className="border border-slate-300 p-1.5 font-semibold">ស្រី</th>
                  <th className="border border-slate-300 p-1.5 font-semibold">កើន/ថយ</th>
                  <th className="border border-slate-300 p-1.5 font-semibold">ចូល</th>
                  <th className="border border-slate-300 p-1.5 font-semibold">ចេញ</th>
                </tr>
              </thead>
              <tbody>
                {report.students.byGrade.map((row) => (
                  <tr key={row.grade}>
                    <td className="border border-slate-300 p-1">ថ្នាក់ទី {num(row.grade)}</td>
                    <td className="border border-slate-300 p-1">{num(row.total)}</td>
                    <td className="border border-slate-300 p-1">{num(row.female)}</td>
                    <td className="border border-slate-300 p-1">{num(row.change)}</td>
                    <td className="border border-slate-300 p-1">{num(row.transferredIn)}</td>
                    <td className="border border-slate-300 p-1">{num(row.transferredOut)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <p className="pl-4">
            - ចំនួនថ្នាក់សរុប : <span className="font-medium">{num(report.students.classesByGrade?.totalClasses || 10)} ថ្នាក់ (ថ្នាក់ទី១={num(report.students.classesByGrade?.g1 || 1)}, ទី២={num(report.students.classesByGrade?.g2 || 2)}, ទី៣={num(report.students.classesByGrade?.g3 || 2)}, ទី៤={num(report.students.classesByGrade?.g4 || 2)}, ទី៥={num(report.students.classesByGrade?.g5 || 2)}, ទី៦={num(report.students.classesByGrade?.g6 || 1)})</span>
          </p>
        </div>

        {/* Staff stats */}
        <div className="space-y-1 pl-2">
          <p className="font-semibold text-slate-800">បុគ្គលិកអប់រំ</p>
          <p className="pl-4">
            - បុគ្គលិកសរុប : <span className="font-medium">{num(report.staff.overallStaff.total)} នាក់ ស្រី {num(report.staff.overallStaff.female)} នាក់</span>
          </p>
          <p className="pl-4">
            - គ្រូបង្រៀនថ្នាក់ទោល : <span className="font-medium">{num(report.staff.singleClassTeachers.total)} នាក់ ស្រី {num(report.staff.singleClassTeachers.female)} នាក់</span>
          </p>
          <p className="pl-4">
            - បុគ្គលិកផ្សេងទៀត : <span className="font-medium">{num(report.staff.otherStaff.total)} នាក់ ស្រី {num(report.staff.otherStaff.female)} នាក់ ({report.staff.otherStaff.description})</span>
          </p>
        </div>
      </div>

      {/* SECTION II: ACADEMIC RESULTS */}
      <div className="space-y-4 mb-6">
        <h2 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
          II-លទ្ធផលសិក្សាដំណាច់ឆ្នាំ
        </h2>

        {/* Academic Results Table */}
        <div className="my-2">
          <table className="w-full text-center border-collapse border border-slate-300 text-xs">
            <thead className="bg-slate-100">
              <tr>
                <th rowSpan={2} className="border border-slate-300 p-1 font-semibold">កម្រិតថ្នាក់</th>
                <th colSpan={2} className="border border-slate-300 p-1 font-semibold">សិស្សចុងឆ្នាំ</th>
                <th colSpan={2} className="border border-slate-300 p-1 font-semibold">សិស្សជាប់មធ្យមភាគ</th>
                <th colSpan={2} className="border border-slate-300 p-1 font-semibold">សិស្សត្រួតថ្នាក់</th>
                <th colSpan={2} className="border border-slate-300 p-1 font-semibold">សិស្សបោះបង់</th>
              </tr>
              <tr>
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
              {report.academicResults.map((row) => (
                <tr key={row.grade}>
                  <td className="border border-slate-300 p-1 font-medium">ថ្នាក់ទី {num(row.grade)}</td>
                  <td className="border border-slate-300 p-1">{num(row.yearEndTotal)}</td>
                  <td className="border border-slate-300 p-1">{num(row.yearEndFemale)}</td>
                  <td className="border border-slate-300 p-1">{num(row.passedAverageTotal)}</td>
                  <td className="border border-slate-300 p-1">{num(row.passedAverageFemale)}</td>
                  <td className="border border-slate-300 p-1">{num(row.repeaterTotal)}</td>
                  <td className="border border-slate-300 p-1">{num(row.repeaterFemale)}</td>
                  <td className="border border-slate-300 p-1">{num(row.dropoutTotal)}</td>
                  <td className="border border-slate-300 p-1">{num(row.dropoutFemale)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Post-Test Academic Results Table (The 24 columns table) */}
        {report.postTestAcademicResults && report.postTestAcademicResults.length > 0 && (
          <div className="pt-4 page-break-inside-avoid">
            <PostTestAcademicTable
              results={report.postTestAcademicResults}
              num={num}
            />
          </div>
        )}
      </div>

      {/* SECTION III: OPERATION RESULTS */}
      <div className="space-y-4 mb-6">
        <h2 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
          III-លទ្ធផលនៃការអនុវត្តផែនការប្រតិបត្តិប្រចាំឆ្នាំ
        </h2>

        <div className="space-y-3 pl-2 text-xs">
          <p>
            <span className="font-semibold text-slate-800">១. ការលើកកម្ពស់គុណភាព និងការបង្រៀន៖</span> {report.curriculumManagement?.teachingImprovement || 'ពង្រឹងការបង្រៀនតាមវិធីសាស្រ្តសកម្ម ការរៀបចំកិច្ចតែងការ និងសម្ភារឧបទេស។'}
          </p>
          <p>
            <span className="font-semibold text-slate-800">២. ការងារបណ្ណាល័យ និងការអាន៖</span> {report.libraryWork?.readingPromotion || 'រៀបចំកាលវិភាគអានសៀវភៅ និងចលនាសិស្សខ្ចីសៀវភៅអាននៅផ្ទះ។'}
          </p>
          <p>
            <span className="font-semibold text-slate-800">៣. សុខភាព និងអនាម័យសិក្សា (WASH)៖</span> {report.healthWASH?.drinkingWater || 'មានទឹកស្អាត និងបង្គន់អនាម័យប្រើប្រាស់ទៀងទាត់ ព្រមទាំងអនុវត្តការទម្លាក់ព្រូនជុំទី១ និងជុំទី២ បាន ១០០%។'}
          </p>
          <p>
            <span className="font-semibold text-slate-800">៤. ការងារទីប្រឹក្សាកុមារី និងសមធម៌៖</span> {report.genderEquity?.girlsCounselingNetwork || 'ផ្តល់ការប្រឹក្សាយោបល់ដល់កុមារី និងជួយដោះស្រាយបញ្ហាទាន់ពេលវេលា។'}
          </p>
          <p>
            <span className="font-semibold text-slate-800">៥. កិច្ចសហការជាមួយសហគមន៍ និងអង្គការដៃគូ៖</span> {report.communityAndNGOs?.ngoAssistance || 'សហការយ៉ាងជិតស្និទ្ធជាមួយគណៈកម្មការទ្រទ្រង់សាលា អាជ្ញាធរមូលដ្ឋាន និងអង្គការដៃគូ។'}
          </p>
        </div>
      </div>

      {/* SECTION IV: CONCLUSION */}
      <div className="space-y-4 mb-6">
        <h2 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
          IV-សន្និដ្ឋាន
        </h2>
        <div className="pl-4 space-y-3 text-xs">
          <p className="leading-relaxed font-normal">{report.conclusion.generalSummary}</p>
          <div className="space-y-1">
            <p className="font-semibold text-slate-800">
              ជាមួយសមិទ្ធផលនៃការអនុវត្តផែនការប្រតិបត្តិប្រចាំឆ្នាំ{useKhmerNumerals ? '២០២៦' : '2026'} ក្នុងឆមាស២ {report.info.schoolName} សម្រេចបាននូវលទ្ធផលសំខាន់ៗរួមមាន៖
            </p>
            <ul className="list-disc pl-5 space-y-1">
              {report.conclusion.keyAchievements.map((item, idx) => (
                <li key={idx} className="leading-relaxed">{item}</li>
              ))}
            </ul>
          </div>
          <p className="leading-relaxed font-normal pt-1">{report.conclusion.challengesToResolve}</p>
        </div>
      </div>

      {/* Official Signatures & Verification Stamp Block */}
      <div className="mt-12 pt-6 border-t border-slate-300 page-break-inside-avoid">
        <div className="grid grid-cols-2 text-center text-xs">
          {/* Left: បានឃើញ និងឯកភាព / នាយកសាលា */}
          <div className="space-y-20 flex flex-col justify-between">
            <div>
              <p className="font-bold text-sm text-slate-900 leading-relaxed">បានឃើញ និងឯកភាព</p>
              <p className="font-bold text-xs text-slate-800 mt-1">នាយកសាលា</p>
            </div>
            <div>
              <div className="border-b border-dotted border-slate-400 w-40 mx-auto"></div>
              <p className="text-[11px] text-slate-400 mt-1 italic">(ហត្ថលេខា និងត្រា)</p>
            </div>
          </div>

          {/* Right: Khmer Lunar Date, Solar Date, School Name, and អ្នករៀបចំរបាយការណ៍ */}
          <div className="space-y-16 flex flex-col justify-between">
            <div className="space-y-1">
              <p className="font-medium text-slate-800">
                {report.info.reportDateKhmerLunar || 'ថ្ងៃសៅរ៍ ១៥រោច ខែបុស្ស ឆ្នាំម្សាញ់ សប្ដស័ក ព.ស.២៥៦៩'}
              </p>
              <p className="font-medium text-slate-800">
                {report.info.schoolName.replace(/^សាលាបឋមសិក្សា\s*/, '') || 'រោគ'}, {report.info.reportDateKhmerSolar || 'ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦'}
              </p>
              <p className="font-bold text-xs text-slate-900 mt-3 pt-2">
                អ្នករៀបចំរបាយការណ៍
              </p>
            </div>
            <div>
              <div className="border-b border-dotted border-slate-400 w-40 mx-auto"></div>
              <p className="text-[11px] text-slate-400 mt-1 italic">(ហត្ថលេខា និងឈ្មោះ)</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
