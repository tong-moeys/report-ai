import React from 'react';
import { FullSchoolReport } from '../types';
import { OfficialReportHeader } from './OfficialReportHeader';

interface PrintablePartAProps {
  report: FullSchoolReport;
  num: (val: number | string | undefined | null) => string;
}

export const PrintablePartA: React.FC<PrintablePartAProps> = ({ report, num }) => {
  const g1 = report.students.byGrade.find(g => g.grade === 1) || { total: 31, female: 15 };
  const g2 = report.students.byGrade.find(g => g.grade === 2) || { total: 42, female: 21 };
  const g3 = report.students.byGrade.find(g => g.grade === 3) || { total: 40, female: 21 };
  const g4 = report.students.byGrade.find(g => g.grade === 4) || { total: 49, female: 21 };
  const g5 = report.students.byGrade.find(g => g.grade === 5) || { total: 50, female: 24 };
  const g6 = report.students.byGrade.find(g => g.grade === 6) || { total: 35, female: 17 };

  const classes = report.students.classesByGrade || {
    g1: 1, g2: 2, g3: 2, g4: 2, g5: 2, g6: 1, totalClasses: 10
  };

  const totalStudents = g1.total + g2.total + g3.total + g4.total + g5.total + g6.total;
  const totalFemales = g1.female + g2.female + g3.female + g4.female + g5.female + g6.female;

  // Table 2 & 3 calculation helper from academicResults or fallback
  const grades = [1, 2, 3, 4, 5, 6];

  const getAcademicRow = (gradeNum: number) => {
    const found = report.academicResults.find(r => r.grade === gradeNum);
    if (found) return found;
    return {
      grade: gradeNum,
      yearEndTotal: gradeNum === 1 ? 31 : gradeNum === 2 ? 42 : gradeNum === 3 ? 40 : gradeNum === 4 ? 49 : gradeNum === 5 ? 50 : 35,
      yearEndFemale: gradeNum === 1 ? 15 : gradeNum === 2 ? 21 : gradeNum === 3 ? 21 : gradeNum === 4 ? 21 : gradeNum === 5 ? 24 : 17,
      passedAverageTotal: gradeNum === 1 ? 31 : gradeNum === 2 ? 42 : gradeNum === 3 ? 40 : gradeNum === 4 ? 49 : gradeNum === 5 ? 50 : 35,
      passedAverageFemale: gradeNum === 1 ? 15 : gradeNum === 2 ? 21 : gradeNum === 3 ? 21 : gradeNum === 4 ? 21 : gradeNum === 5 ? 24 : 17,
      passedRetestTotal: 0,
      passedRetestFemale: 0,
      finalPassedTotal: gradeNum === 1 ? 31 : gradeNum === 2 ? 42 : gradeNum === 3 ? 40 : gradeNum === 4 ? 49 : gradeNum === 5 ? 50 : 35,
      finalPassedFemale: gradeNum === 1 ? 15 : gradeNum === 2 ? 21 : gradeNum === 3 ? 21 : gradeNum === 4 ? 21 : gradeNum === 5 ? 24 : 17,
      repeaterTotal: 0,
      repeaterFemale: 0,
      dropoutTotal: 0,
      dropoutFemale: 0,
    };
  };

  return (
    <div className="part-a-container space-y-6 text-slate-900 text-[11px] leading-snug">
      {/* Shared Official Header */}
      <OfficialReportHeader
        info={report.info}
        reportTypeTitle="របាយការណ៍ស្ថិតិសាលារៀន ចុងឆ្នាំសិក្សា"
        subTitle="ផ្នែក A ៖ ស្ថិតិសាលា អគារ បន្ទប់ សិស្ស និងលទ្ធផលសិក្សា"
        badgeText="ផ្នែក A (MoEYS Standard)"
      />

      {/* Table 1: School, Buildings, Rooms, Students */}
      <div className="space-y-1 page-break-inside-avoid">
        <div className="flex justify-between items-center">
          <h3 className="font-bold text-xs text-slate-900">
            ១. តារាងស្ថិតិសាលា អគារ បន្ទប់ សិស្ស
          </h3>
          <span className="text-[10px] text-slate-500 italic">ឯកសារ A - តារាង ១</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={2} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th rowSpan={2} className="border border-slate-900 p-1">អគារ</th>
                <th colSpan={3} className="border border-slate-900 p-1">ចំនួនបន្ទប់</th>
                <th colSpan={3} className="border border-slate-900 p-1">ថ្នាក់ទី១</th>
                <th colSpan={3} className="border border-slate-900 p-1">ថ្នាក់ទី២</th>
                <th colSpan={3} className="border border-slate-900 p-1">ថ្នាក់ទី៣</th>
                <th colSpan={3} className="border border-slate-900 p-1">ថ្នាក់ទី៤</th>
                <th colSpan={3} className="border border-slate-900 p-1">ថ្នាក់ទី៥</th>
                <th colSpan={3} className="border border-slate-900 p-1">ថ្នាក់ទី៦</th>
                <th colSpan={3} className="border border-slate-900 p-1 bg-slate-100">សរុបរួម</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th className="border border-slate-900 p-0.5">ប.បរ</th>
                <th className="border border-slate-900 p-0.5">ផ្សេងៗ</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                {/* Grades 1-6 subheaders */}
                {[1, 2, 3, 4, 5, 6].map(gr => (
                  <React.Fragment key={gr}>
                    <th className="border border-slate-900 p-0.5">ថ្នាក់</th>
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">ស្រី</th>
                  </React.Fragment>
                ))}
                {/* Total */}
                <th className="border border-slate-900 p-0.5 bg-slate-100">ថ្នាក់</th>
                <th className="border border-slate-900 p-0.5 bg-slate-100">សរុប</th>
                <th className="border border-slate-900 p-0.5 bg-slate-100">ស្រី</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1">{num(4)}</td>
                <td className="border border-slate-900 p-1">{num(report.info.roomsTeaching || 12)}</td>
                <td className="border border-slate-900 p-1">{num(report.info.roomsNonTeaching || 3)}</td>
                <td className="border border-slate-900 p-1 font-semibold">{num(report.info.roomsTotal || 15)}</td>

                <td className="border border-slate-900 p-1">{num(classes.g1)}</td>
                <td className="border border-slate-900 p-1">{num(g1.total)}</td>
                <td className="border border-slate-900 p-1">{num(g1.female)}</td>

                <td className="border border-slate-900 p-1">{num(classes.g2)}</td>
                <td className="border border-slate-900 p-1">{num(g2.total)}</td>
                <td className="border border-slate-900 p-1">{num(g2.female)}</td>

                <td className="border border-slate-900 p-1">{num(classes.g3)}</td>
                <td className="border border-slate-900 p-1">{num(g3.total)}</td>
                <td className="border border-slate-900 p-1">{num(g3.female)}</td>

                <td className="border border-slate-900 p-1">{num(classes.g4)}</td>
                <td className="border border-slate-900 p-1">{num(g4.total)}</td>
                <td className="border border-slate-900 p-1">{num(g4.female)}</td>

                <td className="border border-slate-900 p-1">{num(classes.g5)}</td>
                <td className="border border-slate-900 p-1">{num(g5.total)}</td>
                <td className="border border-slate-900 p-1">{num(g5.female)}</td>

                <td className="border border-slate-900 p-1">{num(classes.g6)}</td>
                <td className="border border-slate-900 p-1">{num(g6.total)}</td>
                <td className="border border-slate-900 p-1">{num(g6.female)}</td>

                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(classes.totalClasses || 10)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(totalFemales)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 1(ត): Staff breakdown */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ១. តារាងស្ថិតិសាលា អគារ បន្ទប់ សិស្ស (ត) ៖ បុគ្គលិកអប់រំ
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={3} className="border border-slate-900 p-1">ឈ្មោះសាលា</th>
                <th colSpan={4} className="border border-slate-900 p-1">មិនបង្រៀន</th>
                <th colSpan={10} className="border border-slate-900 p-1">បុគ្គលិកបង្រៀន</th>
                <th colSpan={2} rowSpan={2} className="border border-slate-900 p-1">ក្នុងនោះ ២ពេល</th>
                <th colSpan={2} rowSpan={2} className="border border-slate-900 p-1">ជួយប.រ</th>
                <th colSpan={2} rowSpan={2} className="border border-slate-900 p-1 bg-slate-100">ក្របខ័ណ្ឌសរុប</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th colSpan={2} className="border border-slate-900 p-0.5">នាយក+រង</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">ទីចាត់ការ</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">បរ.សុទ្ធ</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">គូប</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">នាយករង</th>
                <th colSpan={2} className="border border-slate-900 p-0.5">កិ .ស</th>
                <th colSpan={2} className="border border-slate-900 p-0.5 font-bold">សរុប</th>
              </tr>
              <tr className="text-[9px]">
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
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5 bg-slate-100 font-bold">សរុប</th>
                <th className="border border-slate-900 p-0.5 bg-slate-100 font-bold">ស្រី</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="border border-slate-900 p-1 font-semibold">{report.info.schoolName || 'បស.រោគ'}</td>
                <td className="border border-slate-900 p-1">{num(2)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(10)}</td>
                <td className="border border-slate-900 p-1">{num(6)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(1)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1 font-bold">{num(11)}</td>
                <td className="border border-slate-900 p-1 font-bold">{num(6)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1">{num(0)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(14)}</td>
                <td className="border border-slate-900 p-1 font-bold bg-slate-100">{num(7)}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 2: Academic Results */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ២. លទ្ធផលសិក្សា (ដំណាច់ឆ្នាំ)
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={4} className="border border-slate-900 p-1">ថ្នាក់</th>
                <th colSpan={18} className="border border-slate-900 p-1">សិស្សសរុបពីថ្នាក់ទី១ ដល់៦</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th colSpan={2} className="border border-slate-900 p-0.5">ដំណាច់ឆ្នាំ</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សជាប់មធ្យមភាគ</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សធ្លាក់មធ្យមភាគ 0-4.99</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សធ្លាក់មធ្យមភាគ 4.00-4.99</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សបោះបង់</th>
              </tr>
              <tr className="text-[9px]">
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
              </tr>
              <tr className="text-[8px] bg-slate-100 font-mono">
                <th className="border border-slate-900 p-0.5">1=3+7+15</th>
                <th className="border border-slate-900 p-0.5">2=5+9+17</th>
                <th className="border border-slate-900 p-0.5">3</th>
                <th className="border border-slate-900 p-0.5">4=3x100/1</th>
                <th className="border border-slate-900 p-0.5">5</th>
                <th className="border border-slate-900 p-0.5">6=5x100/2</th>
                <th className="border border-slate-900 p-0.5">7</th>
                <th className="border border-slate-900 p-0.5">8=7x100/1</th>
                <th className="border border-slate-900 p-0.5">9</th>
                <th className="border border-slate-900 p-0.5">10=9x100/2</th>
                <th className="border border-slate-900 p-0.5">11</th>
                <th className="border border-slate-900 p-0.5">12=11x100/7</th>
                <th className="border border-slate-900 p-0.5">13</th>
                <th className="border border-slate-900 p-0.5">14=13x100/9</th>
                <th className="border border-slate-900 p-0.5">15</th>
                <th className="border border-slate-900 p-0.5">16=15x100/1</th>
                <th className="border border-slate-900 p-0.5">17</th>
                <th className="border border-slate-900 p-0.5">18=17x100/2</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(gr => {
                const r = getAcademicRow(gr);
                const pctPassedTot = r.yearEndTotal > 0 ? ((r.passedAverageTotal * 100) / r.yearEndTotal).toFixed(0) : '0';
                const pctPassedFem = r.yearEndFemale > 0 ? ((r.passedAverageFemale * 100) / r.yearEndFemale).toFixed(0) : '0';
                const pctRepTot = r.yearEndTotal > 0 ? ((r.repeaterTotal * 100) / r.yearEndTotal).toFixed(0) : '0';
                const pctRepFem = r.yearEndFemale > 0 ? ((r.repeaterFemale * 100) / r.yearEndFemale).toFixed(0) : '0';
                const pctDropTot = r.yearEndTotal > 0 ? ((r.dropoutTotal * 100) / r.yearEndTotal).toFixed(0) : '0';
                const pctDropFem = r.yearEndFemale > 0 ? ((r.dropoutFemale * 100) / r.yearEndFemale).toFixed(0) : '0';

                return (
                  <tr key={gr}>
                    <td className="border border-slate-900 p-0.5 font-medium">ថ្នាក់ទី {num(gr)}</td>
                    <td className="border border-slate-900 p-0.5">{num(r.yearEndTotal)}</td>
                    <td className="border border-slate-900 p-0.5">{num(r.yearEndFemale)}</td>
                    <td className="border border-slate-900 p-0.5">{num(r.passedAverageTotal)}</td>
                    <td className="border border-slate-900 p-0.5">{num(pctPassedTot)}%</td>
                    <td className="border border-slate-900 p-0.5">{num(r.passedAverageFemale)}</td>
                    <td className="border border-slate-900 p-0.5">{num(pctPassedFem)}%</td>
                    <td className="border border-slate-900 p-0.5">{num(r.repeaterTotal)}</td>
                    <td className="border border-slate-900 p-0.5">{num(pctRepTot)}%</td>
                    <td className="border border-slate-900 p-0.5">{num(r.repeaterFemale)}</td>
                    <td className="border border-slate-900 p-0.5">{num(pctRepFem)}%</td>
                    <td className="border border-slate-900 p-0.5">—</td>
                    <td className="border border-slate-900 p-0.5">0%</td>
                    <td className="border border-slate-900 p-0.5">—</td>
                    <td className="border border-slate-900 p-0.5">0%</td>
                    <td className="border border-slate-900 p-0.5">{num(r.dropoutTotal)}</td>
                    <td className="border border-slate-900 p-0.5">{num(pctDropTot)}%</td>
                    <td className="border border-slate-900 p-0.5">{num(r.dropoutFemale)}</td>
                    <td className="border border-slate-900 p-0.5">{num(pctDropFem)}%</td>
                  </tr>
                );
              })}
              {/* Total Row */}
              <tr className="font-bold bg-slate-100">
                <td className="border border-slate-900 p-0.5">សរុប</td>
                <td className="border border-slate-900 p-0.5">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-0.5">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-0.5">{num(totalStudents)}</td>
                <td className="border border-slate-900 p-0.5">{num(100)}%</td>
                <td className="border border-slate-900 p-0.5">{num(totalFemales)}</td>
                <td className="border border-slate-900 p-0.5">{num(100)}%</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}%</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}%</td>
                <td className="border border-slate-900 p-0.5">—</td>
                <td className="border border-slate-900 p-0.5">0%</td>
                <td className="border border-slate-900 p-0.5">—</td>
                <td className="border border-slate-900 p-0.5">0%</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}%</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 3: Failing Students & Retest Results */}
      <div className="space-y-1 page-break-inside-avoid mt-4">
        <h3 className="font-bold text-xs text-slate-900">
          ៣. ស្ថិតិសិស្សធ្លាក់
        </h3>

        <div className="overflow-x-auto">
          <table className="w-full text-center border-collapse border border-slate-900 text-[10px]">
            <thead className="bg-slate-50">
              <tr className="font-bold">
                <th rowSpan={4} className="border border-slate-900 p-1">ថ្នាក់</th>
                <th colSpan={10} className="border border-slate-900 p-1">ថ្នាក់ទី ១ ដល់ ៦</th>
              </tr>
              <tr className="font-semibold text-[9px]">
                <th colSpan={2} className="border border-slate-900 p-0.5">ត្រួតសរុប</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">ធ្វើតេស្ដជាប់</th>
                <th colSpan={4} className="border border-slate-900 p-0.5">ធ្វើតេស្ដធ្លាក់</th>
              </tr>
              <tr className="text-[9px]">
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">សរុប</th>
                <th className="border border-slate-900 p-0.5">%</th>
                <th className="border border-slate-900 p-0.5">ស្រី</th>
                <th className="border border-slate-900 p-0.5">%</th>
              </tr>
              <tr className="text-[8px] bg-slate-100 font-mono">
                <th className="border border-slate-900 p-0.5">1</th>
                <th className="border border-slate-900 p-0.5">2</th>
                <th className="border border-slate-900 p-0.5">3</th>
                <th className="border border-slate-900 p-0.5">4=3*100/1</th>
                <th className="border border-slate-900 p-0.5">5</th>
                <th className="border border-slate-900 p-0.5">6=5*100/2</th>
                <th className="border border-slate-900 p-0.5">7=1-3</th>
                <th className="border border-slate-900 p-0.5">8=7*100/1</th>
                <th className="border border-slate-900 p-0.5">9=2-5</th>
                <th className="border border-slate-900 p-0.5">10=9*100/2</th>
              </tr>
            </thead>
            <tbody>
              {grades.map(gr => (
                <tr key={gr}>
                  <td className="border border-slate-900 p-0.5 font-medium">ថ្នាក់ទី {num(gr)}</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5">0%</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5">0%</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5">0%</td>
                  <td className="border border-slate-900 p-0.5">{num(0)}</td>
                  <td className="border border-slate-900 p-0.5">0%</td>
                </tr>
              ))}
              <tr className="font-bold bg-slate-100">
                <td className="border border-slate-900 p-0.5">សរុប</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">0%</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">0%</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">0%</td>
                <td className="border border-slate-900 p-0.5">{num(0)}</td>
                <td className="border border-slate-900 p-0.5">0%</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      {/* Table 4: Post-Test Academic Results (The 24 columns table) */}
      {report.postTestAcademicResults && report.postTestAcademicResults.length > 0 && (
        <div className="space-y-1 page-break-inside-avoid mt-4">
          <h3 className="font-bold text-xs text-slate-900">
            ៤. លទ្ធផលសិក្សា ក្រោយធ្វើតេស្តចុងឆ្នាំរួច
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-center border-collapse border border-slate-900 text-[9px] leading-tight">
              <thead className="bg-slate-50">
                <tr className="font-bold">
                  <th rowSpan={4} className="border border-slate-900 p-0.5">ថ្នាក់</th>
                  <th colSpan={24} className="border border-slate-900 p-0.5">សិស្សសរុបពីថ្នាក់ទី១ ដល់៦</th>
                </tr>
                <tr className="font-semibold text-[9px]">
                  <th colSpan={2} className="border border-slate-900 p-0.5">ឆមាសទី១</th>
                  <th colSpan={2} className="border border-slate-900 p-0.5">សិស្សចុងឆ្នាំ</th>
                  <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សជាប់មធ្យមភាគ</th>
                  <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សធ្វើតេស្តជាប់</th>
                  <th colSpan={4} className="border border-slate-900 p-0.5">សរុបជាប់ចុងឆ្នាំ</th>
                  <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សត្រួតថ្នាក់</th>
                  <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សបោះបង់</th>
                </tr>
                <tr className="text-[8px]">
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                </tr>
                <tr className="text-[7px] bg-slate-100 font-mono">
                  <th className="border border-slate-900 p-0.5">1=3+21</th>
                  <th className="border border-slate-900 p-0.5">2=4+23</th>
                  <th className="border border-slate-900 p-0.5">3=13+17</th>
                  <th className="border border-slate-900 p-0.5">4=15+19</th>
                  <th className="border border-slate-900 p-0.5">5</th>
                  <th className="border border-slate-900 p-0.5">6=5x10/1</th>
                  <th className="border border-slate-900 p-0.5">7</th>
                  <th className="border border-slate-900 p-0.5">8=7x10/2</th>
                  <th className="border border-slate-900 p-0.5">9</th>
                  <th className="border border-slate-900 p-0.5">10=9x10/1</th>
                  <th className="border border-slate-900 p-0.5">11</th>
                  <th className="border border-slate-900 p-0.5">12=11x10/2</th>
                  <th className="border border-slate-900 p-0.5">13=5+9</th>
                  <th className="border border-slate-900 p-0.5">14=13x10/1</th>
                  <th className="border border-slate-900 p-0.5">15=7+11</th>
                  <th className="border border-slate-900 p-0.5">16=15x10/2</th>
                  <th className="border border-slate-900 p-0.5">17</th>
                  <th className="border border-slate-900 p-0.5">18=17x10/1</th>
                  <th className="border border-slate-900 p-0.5">19</th>
                  <th className="border border-slate-900 p-0.5">20=19x10/2</th>
                  <th className="border border-slate-900 p-0.5">21</th>
                  <th className="border border-slate-900 p-0.5">22=21x10/1</th>
                  <th className="border border-slate-900 p-0.5">23</th>
                  <th className="border border-slate-900 p-0.5">24=23x10/2</th>
                </tr>
              </thead>
              <tbody>
                {report.postTestAcademicResults.map((r, idx) => {
                  const isTotal = r.grade === 'សរុប' || idx === report.postTestAcademicResults!.length - 1;
                  return (
                    <tr key={r.grade || idx} className={isTotal ? 'font-bold bg-slate-100' : ''}>
                      <td className="border border-slate-900 p-0.5 whitespace-nowrap">{r.grade}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.sem1Total)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.sem1Female)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.yearEndTotal)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.yearEndFemale)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedAvgTotal)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedAvgTotalPct)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedAvgFemale)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedAvgFemalePct)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedRetestTotal)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedRetestTotalPct)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedRetestFemale)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.passedRetestFemalePct)}</td>
                      <td className="border border-slate-900 p-0.5 font-semibold">{num(r.finalPassedTotal)}</td>
                      <td className="border border-slate-900 p-0.5 font-semibold">{num(r.finalPassedTotalPct)}</td>
                      <td className="border border-slate-900 p-0.5 font-semibold">{num(r.finalPassedFemale)}</td>
                      <td className="border border-slate-900 p-0.5 font-semibold">{num(r.finalPassedFemalePct)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.repeaterTotal)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.repeaterTotalPct)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.repeaterFemale)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.repeaterFemalePct)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.dropoutTotal)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.dropoutTotalPct)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.dropoutFemale)}</td>
                      <td className="border border-slate-900 p-0.5">{num(r.dropoutFemalePct)}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

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
