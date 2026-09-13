import React from 'react';
import { FullSchoolReport } from '../types';
import { OfficialReportHeader } from './OfficialReportHeader';

interface PrintablePartBProps {
  report: FullSchoolReport;
  num: (val: number | string | undefined | null) => string;
}

export const PrintablePartB: React.FC<PrintablePartBProps> = ({ report, num }) => {
  // Extract reactive student numbers from Part A to link directly with Part B
  const g1 = report.students.byGrade.find(g => g.grade === 1) || { total: 31, female: 15 };
  const g2 = report.students.byGrade.find(g => g.grade === 2) || { total: 42, female: 21 };
  const g3 = report.students.byGrade.find(g => g.grade === 3) || { total: 40, female: 21 };
  const g4 = report.students.byGrade.find(g => g.grade === 4) || { total: 49, female: 21 };
  const g5 = report.students.byGrade.find(g => g.grade === 5) || { total: 50, female: 24 };
  const g6 = report.students.byGrade.find(g => g.grade === 6) || { total: 35, female: 17 };

  const totalStudents = g1.total + g2.total + g3.total + g4.total + g5.total + g6.total;
  const totalFemales = g1.female + g2.female + g3.female + g4.female + g5.female + g6.female;

  // Girls in Grade 4, 5, 6 for Table 11 (Girls counseling)
  const targetGirlsTotal = g4.female + g5.female + g6.female;

  return (
    <div className="part-b-container space-y-6 text-slate-900 text-[11px] leading-snug">
      {/* Shared Official Header */}
      <OfficialReportHeader
        info={report.info}
        reportTypeTitle="របាយការណ៍ស្ថិតិសាលារៀន ចុងឆ្នាំសិក្សា"
        subTitle="ផ្នែក B ៖ ស្ថិតិបុគ្គលិក បណ្ណាល័យ សុខុមាលភាព សមធម៌ និងសហគមន៍"
        badgeText="ផ្នែក B (MoEYS Standard)"
      />

      {/* Table 5: Staff breakdown */}
      <div className="space-y-1 page-break-inside-avoid">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xs text-slate-900">
            ៥. ស្ថិតិមន្រ្តីបម្រើការ (ថ្នាក់សាលារៀន)
          </h3>
          <span className="text-[10px] text-slate-500 italic">ឯកសារ B - តារាង ៥ & ៥(ត)</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={5} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th colSpan={2} rowSpan={4} className="border border-slate-900 p-1 bg-slate-100">សរុបរួម</th>
                <th colSpan={14} className="border border-slate-900 p-1">បុគ្គលិកទីចាត់ការ</th>
                <th colSpan={8} className="border border-slate-900 p-1">គ្រូបង្រៀន</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th colSpan={2} rowSpan={3} className="border border-slate-900 p-0.5">សរុប</th>
                <th colSpan={6} className="border border-slate-900 p-0.5">នាយក</th>
                <th colSpan={6} className="border border-slate-900 p-0.5">នាយករង</th>
                <th colSpan={2} rowSpan={3} className="border border-slate-900 p-0.5">បង្រៀនសុទ្ធ</th>
                <th colSpan={2} rowSpan={3} className="border border-slate-900 p-0.5">ថ្នាក់គួប</th>
                <th colSpan={2} rowSpan={3} className="border border-slate-900 p-0.5">កិច្ចសន្យា</th>
                <th colSpan={2} rowSpan={3} className="border border-slate-900 p-0.5 bg-slate-100">សរុបគ្រូ</th>
              </tr>
              <tr className="text-[9px]">
                <th colSpan={2} rowSpan={2} className="border border-slate-900 p-0.5">សរុប</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">បង្រៀន</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">មិនបង្រៀន</th>
                <th colSpan={2} rowSpan={2} className="border border-slate-900 p-0.5">សរុប</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">បង្រៀន</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">មិនបង្រៀន</th>
              </tr>
              <tr className="text-[8px]">
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
              </tr>
              <tr className="text-[8px] bg-slate-100 font-mono">
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">ស</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(14)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(7)}</td>
                <td className="border border-slate-900 p-1 font-semibold">{num(3)}</td>
                <td className="border border-slate-900 p-1 font-semibold">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(10)}</td>
                <td className="border border-slate-900 p-1">{num(6)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(11)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(6)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 6: Library Activity */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ៦. ស្ថិតិ សកម្មភាពបណ្ណាល័យ (ការអាន និងការខ្ចីសៀវភៅ)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={2} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th colSpan={3} className="border border-slate-900 p-1">ស្ថានភាពបណ្ណាល័យ</th>
                <th colSpan={4} className="border border-slate-900 p-1">អ្នកចូលអានប្រចាំឆ្នាំ</th>
                <th colSpan={4} className="border border-slate-900 p-1">សៀវភៅបានខ្ចី</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th className="border border-slate-900 p-0.5">ដំណើរការល្អ</th>
                <th className="border border-slate-900 p-0.5">មធ្យម</th>
                <th className="border border-slate-900 p-0.5">គ្មាន</th>
                <th className="border border-slate-900 p-0.5">សិស្សសរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">គ្រូសរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សិស្សខ្ចី</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">ក្បាលសៀវភៅ</th>
                <th className="border border-slate-900 p-0.5">ផ្សេងៗ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-1">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-1">{num(14)}</td>
                <td className="border border-slate-900 p-1">{num(7)}</td>
                <td className="border border-slate-900 p-1">{num(185)}</td>
                <td className="border border-slate-900 p-1">{num(92)}</td>
                <td className="border border-slate-900 p-1">{num(420)}</td>
                <td className="border border-slate-900 p-1">—</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 7: WASH (Toilets & Clean Water) */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ៧. ស្ថិតិ សាលាមានការប្រើប្រាស់ បង្គន់អនាម័យ និង ទឹកស្អាត
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={2} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th colSpan={4} className="border border-slate-900 p-1">ចំនួនបង្គន់</th>
                <th colSpan={3} className="border border-slate-900 p-1">ស្រះទឹក</th>
                <th colSpan={3} className="border border-slate-900 p-1">អណ្ដូងលូ</th>
                <th colSpan={3} className="border border-slate-900 p-1">អណ្ដូងស្នប់</th>
                <th colSpan={3} className="border border-slate-900 p-1">អាងទឹក</th>
                <th colSpan={3} className="border border-slate-900 p-1">ធុងចម្រោះ</th>
                <th rowSpan={2} className="border border-slate-900 p-1">សេវាទឹកស្អាត</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th className="border border-slate-900 p-0.5">ចំ.ខ្នង</th>
                <th className="border border-slate-900 p-0.5">ចំ.បង្គន់</th>
                <th className="border border-slate-900 p-0.5">បានប្រើ</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">មាន</th>
                <th className="border border-slate-900 p-0.5">ប្រើ</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">មាន</th>
                <th className="border border-slate-900 p-0.5">ប្រើ</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">មាន</th>
                <th className="border border-slate-900 p-0.5">ប្រើ</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">មាន</th>
                <th className="border border-slate-900 p-0.5">ប្រើ</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">មាន</th>
                <th className="border border-slate-900 p-0.5">ប្រើ</th>
                <th className="border border-slate-900 p-0.5">%</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1">{num(6)}</td>
                <td className="border border-slate-900 p-1">{num(6)}</td>
                <td className="border border-slate-900 p-1">100%</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">100%</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">0%</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">100%</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1">100%</td>
                <td className="border border-slate-900 p-1">{num(4)}</td>
                <td className="border border-slate-900 p-1">{num(4)}</td>
                <td className="border border-slate-900 p-1">100%</td>
                <td className="border border-slate-900 p-1">មានប្រើប្រាស់</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 8 & 9: Deworming & First Aid (Connected directly to Part A student totals) */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ៨ & ៩. ស្ថិតិ ការទម្លាក់ព្រូន និង មានហិបសង្រ្គោះ (ភ្ជាប់ដោយស្វ័យប្រវត្តិពី ផ្នែក A)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={3} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th colSpan={6} className="border border-slate-900 p-1">ការទម្លាក់ព្រូន ជុំទី១</th>
                <th colSpan={6} className="border border-slate-900 p-1">ការទម្លាក់ព្រូន ជុំទី២</th>
                <th colSpan={4} className="border border-slate-900 p-1">ហិបសង្រ្គោះទទួល</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th colSpan={2} className="border border-slate-900 p-0.5">សិស្សគោលដៅ (ពីផ្នែក A)</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">ចំ.សិស្សបានទម្លាក់ព្រូន</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">សិស្សគោលដៅ (ពីផ្នែក A)</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">ចំ.សិស្សបានទម្លាក់ព្រូន</th>
                <th className="border border-slate-900 p-0.5">ក្រសួង</th>
                <th className="border border-slate-900 p-0.5">មន្ទីរ</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">ប្រភពផ្សេងៗ</th>
              </tr>
              <tr className="text-[9px]">
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">មាន</th>
                <th className="border border-slate-900 p-0.5">មាន</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">បរិយាយ</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1 font-bold">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-1 font-bold">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-1">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-1 font-semibold">100%</td>
                <td className="border border-slate-900 p-1">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-1 font-semibold">100%</td>

                <td className="border border-slate-900 p-1 font-bold">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-1 font-bold">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-1">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-1 font-semibold">100%</td>
                <td className="border border-slate-900 p-1">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-1 font-semibold">100%</td>

                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1">អង្គការដៃគូ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 10: Sports, Arts, Life Skills */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ១០. ស្ថិតិ សាលាបឋមសិក្សាមានសកម្មភាព កីឡា សិល្បៈ និង បំណិនជីវិត
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={2} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th colSpan={3} className="border border-slate-900 p-1">សកម្មភាពកីឡា</th>
                <th colSpan={3} className="border border-slate-900 p-1">សកម្មភាពសិល្បៈ</th>
                <th colSpan={3} className="border border-slate-900 p-1">បំណិនជីវិត</th>
                <th rowSpan={2} className="border border-slate-900 p-1">ផ្សេងៗ</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th className="border border-slate-900 p-0.5">ថ្នាក់សាលា</th>
                <th className="border border-slate-900 p-0.5">កម្រង</th>
                <th className="border border-slate-900 p-0.5">ស្រុក/ខេត្ត</th>
                <th className="border border-slate-900 p-0.5">សម្ដែង</th>
                <th className="border border-slate-900 p-0.5">កម្រង</th>
                <th className="border border-slate-900 p-0.5">ស្រុក/ខេត្ត</th>
                <th className="border border-slate-900 p-0.5">កម្មវិធី</th>
                <th className="border border-slate-900 p-0.5">សិស្សចូលរួម</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1">{num(10)} ថ្នាក់</td>
                <td className="border border-slate-900 p-1">{num(2)} លើក</td>
                <td className="border border-slate-900 p-1">{num(1)} លើក</td>
                <td className="border border-slate-900 p-1">{num(3)} លើក</td>
                <td className="border border-slate-900 p-1">{num(1)} លើក</td>
                <td className="border border-slate-900 p-1">—</td>
                <td className="border border-slate-900 p-1">កសិកម្ម/អនាម័យ</td>
                <td className="border border-slate-900 p-1">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-1">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-1">សកម្មភាពល្អប្រសើរ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 11: Girls Counseling (Grades 4-6 target girls dynamically fed from Part A) */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ១១. ស្ថិតិ សាលារៀនគោលដៅដែលបានអនុវត្ដកម្មវិធីទីប្រឹក្សាកុមារី (ភ្ជាប់ពី ផ្នែក A ថ្នាក់ទី ៤-៦)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={2} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th colSpan={4} className="border border-slate-900 p-1">ចំនួនកុមារីគោលដៅ ទី៤-៦ (ពីផ្នែក A)</th>
                <th colSpan={4} className="border border-slate-900 p-1">កុមារីមានបញ្ហាបានជួបប្រឹក្សា</th>
                <th colSpan={4} className="border border-slate-900 p-1">កុមារីទទួលបានការជួយដោះស្រាយ</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th className="border border-slate-900 p-0.5">ថ្នាក់ទី៤</th>
                <th className="border border-slate-900 p-0.5">ថ្នាក់ទី៥</th>
                <th className="border border-slate-900 p-0.5">ថ្នាក់ទី៦</th>
                <th className="border border-slate-900 p-0.5 bg-slate-100 font-bold">សរុប</th>
                <th className="border border-slate-900 p-0.5">ទី៤</th>
                <th className="border border-slate-900 p-0.5">ទី៥</th>
                <th className="border border-slate-900 p-0.5">ទី៦</th>
                <th className="border border-slate-900 p-0.5 font-bold">សរុប</th>
                <th className="border border-slate-900 p-0.5">ទី៤</th>
                <th className="border border-slate-900 p-0.5">ទី៥</th>
                <th className="border border-slate-900 p-0.5">ទី៦</th>
                <th className="border border-slate-900 p-0.5 font-bold">សរុប</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1">{num(g4.female)}</td>
                <td className="border border-slate-900 p-1">{num(g5.female)}</td>
                <td className="border border-slate-900 p-1">{num(g6.female)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(targetGirlsTotal)}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1">{num(3)}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1 font-bold">{num(7)}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1">{num(3)}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1 font-bold">{num(7)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 12 & 13: Poor & Disabled Students */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 page-break-inside-avoid mt-4">
        {/* Table 12: Poor students */}
        <div className="space-y-1">
          <h3 className="font-bold text-xs text-slate-900">
            ១២. ស្ថិតិ សិស្សក្រីក្រ (អាហារូបករណ៍)
          </h3>
          <table className="w-full text-center border-collapse border border-slate-900 text-[9px]">
            <thead className="bg-slate-50 font-semibold">
              <tr>
                <th className="border border-slate-900 p-0.5">ថ្នាក់</th>
                <th className="border border-slate-900 p-0.5">មានឪពុកម្ដាយ</th>
                <th className="border border-slate-900 p-0.5">កំព្រាឪពុក</th>
                <th className="border border-slate-900 p-0.5">កំព្រាម្ដាយ</th>
                <th className="border border-slate-900 p-0.5">កំព្រាទាំងពីរ</th>
                <th className="border border-slate-900 p-0.5 font-bold bg-slate-100">សរុប</th>
                <th className="border border-slate-900 p-0.5 font-bold bg-slate-100">ស្រី</th>
              </tr>
            </thead>
            <tbody>
              {[1, 2, 3, 4, 5, 6].map(gr => (
                <tr key={gr}>
                  <td className="border border-slate-900 p-0.5">ថ្នាក់ទី {num(gr)}</td>
                  <td className="border border-slate-900 p-0.5">{num(gr > 3 ? 4 : 2)}</td>
                  <td className="border border-slate-900 p-0.5">{num(1)}</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5 font-semibold bg-slate-50">{num(gr > 3 ? 5 : 3)}</td>
                  <td className="border border-slate-900 p-0.5 font-semibold bg-slate-50">{num(gr > 3 ? 3 : 2)}</td>
                </tr>
              ))}
              <tr className="font-bold bg-slate-100">
                <td className="border border-slate-900 p-0.5">សរុប</td>
                <td className="border border-slate-900 p-0.5">{num(18)}</td>
                <td className="border border-slate-900 p-0.5">{num(6)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(24)}</td>
                <td className="border border-slate-900 p-0.5">{num(15)}</td>
              </tr>
            </tbody>
          </table>
        </div>

        {/* Table 13: Disabled students */}
        <div className="space-y-1">
          <h3 className="font-bold text-xs text-slate-900">
            ១៣. ស្ថិតិ សិស្សពិការ
          </h3>
          <table className="w-full text-center border-collapse border border-slate-900 text-[9px]">
            <thead className="bg-slate-50 font-semibold">
              <tr>
                <th className="border border-slate-900 p-0.5">ប្រភេទពិការភាព</th>
                <th className="border border-slate-900 p-0.5">ថ្នាក់ទី១-៣</th>
                <th className="border border-slate-900 p-0.5">ថ្នាក់ទី៤-៦</th>
                <th className="border border-slate-900 p-0.5 font-bold bg-slate-100">សរុប</th>
                <th className="border border-slate-900 p-0.5 font-bold bg-slate-100">ស្រី</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-0.5 text-left pl-1">ពិការគំហើញ (ភ្នែក)</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-0.5 text-left pl-1">ពិការការស្តាប់ (ត្រចៀក/គ)</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-0.5 text-left pl-1">ពិការចលករ (អវយវៈ)</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-0.5 text-left pl-1">ពិការសតិបញ្ញា/រៀនយឺត</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
                <td className="border border-slate-900 p-0.5">{num(2)}</td>
                <td className="border border-slate-900 p-0.5">{num(1)}</td>
              </tr>
              <tr className="font-bold bg-slate-100">
                <td className="border border-slate-900 p-0.5 text-left pl-1">សរុបរួម</td>
                <td className="border border-slate-900 p-0.5">{num(2)}</td>
                <td className="border border-slate-900 p-0.5">{num(2)}</td>
                <td className="border border-slate-900 p-0.5">{num(4)}</td>
                <td className="border border-slate-900 p-0.5">{num(2)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 14 & 15: Community Work & Partner NGOs */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ១៤ & ១៥. ការងារសហគមន៍ សំណូមពរ និងការឧបត្ថម្ភគាំទ្រពីអង្គការ
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50 font-semibold">
              <tr>
                <th className="border border-slate-900 p-1">ល.រ</th>
                <th className="border border-slate-900 p-1">ឈ្មោះអង្គការ / សហគមន៍</th>
                <th className="border border-slate-900 p-1">សកម្មភាពគាំទ្រ និងឧបត្ថម្ភ</th>
                <th className="border border-slate-900 p-1">ថវិកា / សម្ភារ</th>
                <th className="border border-slate-900 p-1">ស្ថានភាពអនុវត្ត</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1 font-medium">អង្គការទស្សនៈពិភពលោក (WVSI)</td>
                <td className="border border-slate-900 p-1 text-left pl-2">អភិវឌ្ឍន៍សាលារៀន ទឹកស្អាត និងអាហារូបករណ៍កុមារី</td>
                <td className="border border-slate-900 p-1">សម្ភារ + ថវិកា</td>
                <td className="border border-slate-900 p-1 text-emerald-700 font-medium">អនុវត្តបានល្អប្រសើរ</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1 font-medium">អង្គការ SOF / HCC</td>
                <td className="border border-slate-900 p-1 text-left pl-2">ជួសជុលអគារសិក្សា និងបន្ទប់រៀនពហុបំណង</td>
                <td className="border border-slate-900 p-1">អគារ ២ខ្នង</td>
                <td className="border border-slate-900 p-1 text-emerald-700 font-medium">សម្រេច ១០០%</td>
              </tr>
              <tr>
                <td className="border border-slate-900 p-1">{num(3)}</td>
                <td className="border border-slate-900 p-1 font-medium">គណៈកម្មការទ្រទ្រង់សាលា & អាណាព្យាបាល</td>
                <td className="border border-slate-900 p-1 text-left pl-2">ចូលរួមកែលម្អបរិស្ថានសាលា ចាក់ដីទីធ្លា និងរបងការពារ</td>
                <td className="border border-slate-900 p-1">ពលកម្ម + ថវិកា</td>
                <td className="border border-slate-900 p-1 text-emerald-700 font-medium">សកម្មភាពជាប្រចាំ</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Official Signature Footer */}
      <div className="pt-8 pb-4 flex justify-between items-start text-xs page-break-inside-avoid">
        <div className="text-center w-48 space-y-1">
          <p className="font-semibold">បានឃើញ និងឯកភាព</p>
          <p className="text-[11px] text-slate-600">ប្រធានការិយាល័យអប់រំ យុវជន និងកីឡា</p>
          <div className="h-16"></div>
          <p className="text-slate-400 text-[10px]">................................................</p>
        </div>

        <div className="text-center w-56 space-y-1">
          <p className="text-[11px] text-slate-700">{report.info.reportDateKhmerSolar || 'ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦'}</p>
          <p className="font-semibold">នាយកសាលា</p>
          <div className="h-16"></div>
          <p className="font-medium text-slate-900">{report.info.schoolName || 'បស.រោគ'}</p>
        </div>
      </div>
    </div>
  );
};
