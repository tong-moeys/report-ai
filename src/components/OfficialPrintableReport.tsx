import React, { useState } from 'react';
import { Printer, Download, ToggleLeft, ToggleRight, ArrowLeft } from 'lucide-react';
import { FullSchoolReport } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';

interface OfficialPrintableReportProps {
  report: FullSchoolReport;
  onBackToEditor?: () => void;
}

export const OfficialPrintableReport: React.FC<OfficialPrintableReportProps> = ({
  report,
  onBackToEditor,
}) => {
  const [useKhmerNumerals, setUseKhmerNumerals] = useState<boolean>(false);

  const num = (val: number | string | undefined | null) => {
    if (val === undefined || val === null) return '';
    return useKhmerNumerals ? toKhmerNum(val) : String(val);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="min-h-screen bg-slate-100 py-6 px-2 sm:px-4">
      {/* Control Bar (Hidden when printing) */}
      <div className="no-print max-w-4xl mx-auto mb-6 bg-white p-3.5 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {onBackToEditor && (
            <button
              onClick={onBackToEditor}
              className="inline-flex items-center gap-1 text-xs font-medium text-slate-600 hover:text-slate-900 bg-slate-50 hover:bg-slate-100 border border-slate-200 px-3 py-1.5 rounded-md transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              ត្រឡប់ទៅផ្ទាំងកែសម្រួល
            </button>
          )}
          <span className="text-xs font-semibold text-slate-800">
            ទម្រង់ឯកសាររដ្ឋបាលបឋមសិក្សា (MoEYS Standard A4)
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Toggle Khmer Numerals */}
          <button
            onClick={() => setUseKhmerNumerals(!useKhmerNumerals)}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200 transition-colors"
          >
            {useKhmerNumerals ? (
              <ToggleRight className="w-4 h-4 text-emerald-600" />
            ) : (
              <ToggleLeft className="w-4 h-4 text-slate-400" />
            )}
            <span>លេខខ្មែរ (១ ២ ៣)៖ {useKhmerNumerals ? 'បើក' : 'បិទ'}</span>
          </button>

          <button
            onClick={handlePrint}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 text-xs font-medium rounded-md bg-slate-900 hover:bg-slate-800 text-white shadow-xs transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            បោះពុម្ពឯកសារ (Print)
          </button>
        </div>
      </div>

      {/* A4 Paper Canvas */}
      <div className="max-w-4xl mx-auto bg-white border border-slate-200 shadow-md print:shadow-none print:border-none p-8 sm:p-12 text-slate-900 text-[13px] leading-relaxed">
        
        {/* National Emblem & Motto Header */}
        <div className="text-center mb-6">
          <p className="font-moul text-sm text-slate-900 tracking-wider">
            {report.info.kingdomHeader}
          </p>
          <p className="font-moul text-sm text-slate-900 mt-1 tracking-wider">
            {report.info.motto}
          </p>
          <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-2 mb-4"></div>
        </div>

        {/* Administrative Jurisdiction Header */}
        <div className="mb-6 space-y-0.5">
          <p className="font-medium text-slate-900">{report.info.districtOffice}</p>
          <p className="font-medium text-slate-900">{report.info.cluster}</p>
          <p className="font-bold text-slate-900">{report.info.schoolName}</p>
        </div>

        {/* Report Title */}
        <div className="text-center my-6">
          <h1 className="font-moul text-base text-slate-900 leading-snug">
            {report.info.reportTitle}
          </h1>
          <p className="font-bold text-sm text-slate-800 mt-1">
            ផ្នែកបឋមសិក្សាឆ្នាំសិក្សា {report.info.academicYear}
          </p>
        </div>

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
          <div className="space-y-1 pl-2">
            <p className="font-semibold text-slate-800">អំពីសិស្សៈ (ប្រៀបធៀបនឹងឆមាសទី១)</p>
            <p className="pl-4">
              - សិស្សសរុបរួមៈ <span className="font-semibold">{num(report.students.overall.total)} នាក់</span> ស្រី : <span className="font-semibold">{num(report.students.overall.female)} នាក់</span> កើន/ថយ : <span className="font-medium">{num(report.students.overall.change)} នាក់</span> មូលហេតុ ផ្ទេរចូល : <span className="font-medium">{num(report.students.overall.transferredIn)} នាក់</span> ផ្ទេរចេញ/ចំណាកស្រុក : <span className="font-medium">… នាក់</span>
            </p>
            {report.students.byGrade.map(g => (
              <p key={g.grade} className="pl-4">
                - សិស្សសរុបថ្នាក់ទី{num(g.grade)} : <span className="font-medium">{num(g.total)} នាក់</span> ស្រី : <span className="font-medium">{num(g.female)} នាក់</span> កើន/ថយ : <span className="font-medium">{g.change !== '0' ? num(g.change) : '…'} នាក់</span> មូលហេតុ ផ្ទេរចូល : <span className="font-medium">{g.transferredIn !== '0' ? num(g.transferredIn) : '…'} នាក់</span> ផ្ទេរចេញ/ចំណាកស្រុក : <span className="font-medium">… នាក់</span>
              </p>
            ))}
            <p className="pl-4 text-xs italic text-slate-700">
              - បញ្ជាក់ ៖ <span className="font-medium">{report.students.note}</span>
            </p>
          </div>

          {/* Classes */}
          <div className="space-y-1 pl-2">
            <p className="font-semibold text-slate-800">ចំនួនថ្នាក់តាមកម្រិត (មិនគិតថ្នាក់គួប)</p>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-1 pl-4">
              <p>- ថ្នាក់ទី១ : <span className="font-medium">{num(report.students.classesByGrade.g1)} ថ្នាក់</span></p>
              <p>- ថ្នាក់ទី២ : <span className="font-medium">{num(report.students.classesByGrade.g2)} ថ្នាក់</span></p>
              <p>- ថ្នាក់ទី៣ : <span className="font-medium">{num(report.students.classesByGrade.g3)} ថ្នាក់</span></p>
              <p>- ថ្នាក់ទី៤ : <span className="font-medium">{num(report.students.classesByGrade.g4)} ថ្នាក់</span></p>
              <p>- ថ្នាក់ទី៥ : <span className="font-medium">{num(report.students.classesByGrade.g5)} ថ្នាក់</span></p>
              <p>- ថ្នាក់ទី៦ : <span className="font-medium">{num(report.students.classesByGrade.g6)} ថ្នាក់</span></p>
            </div>
            <p className="pl-4">
              - សរុបថ្នាក់ : <span className="font-semibold">{num(report.students.classesByGrade.totalClasses)} ថ្នាក់</span> | ថ្នាក់គួប : <span className="font-medium">{num(report.students.classesByGrade.multigradeClasses)} ថ្នាក់</span>
            </p>
          </div>

          {/* Personnel */}
          <div className="space-y-1 pl-2">
            <p className="font-semibold text-slate-800">អំពីមន្រ្តីអប់រំ</p>
            <p className="pl-4">
              - បុគ្គលិកសរុបរួម : <span className="font-semibold">{num(report.staff.overallStaff.total)} នាក់</span> ស្រី : <span className="font-semibold">{num(report.staff.overallStaff.female)} នាក់</span> កើន/ថយ : <span className="font-medium">{num(report.staff.overallStaff.change)} នាក់</span> មូលហេតុ បោះបង់ : <span className="font-medium">{num(report.staff.overallStaff.dropouts)} នាក់</span> ចូលនិវត្តន៍ : <span className="font-medium">{num(report.staff.overallStaff.retired)} នាក់</span>
            </p>
            <p className="pl-4">
              - សរុបគ្រូបង្រៀន១ថ្នាក់ : <span className="font-medium">{num(report.staff.singleClassTeachers.total)} នាក់</span> ស្រី : <span className="font-medium">{num(report.staff.singleClassTeachers.female)} នាក់</span>
            </p>
            <p className="pl-4">
              - សរុបគ្រូបង្រៀន២ថ្នាក់ : <span className="font-medium">{num(report.staff.doubleClassTeachers.total)} នាក់</span> ស្រី : <span className="font-medium">{num(report.staff.doubleClassTeachers.female)} នាក់</span>
            </p>
            <p className="pl-4">
              - សរុបគ្រូបង្រៀនថ្នាក់គួប : <span className="font-medium">{num(report.staff.multigradeTeachers.total)} នាក់</span> ស្រី : <span className="font-medium">{num(report.staff.multigradeTeachers.female)} នាក់</span>
            </p>
            <p className="pl-4">
              - សរុបនាយក.រងជួយបង្រៀន : <span className="font-medium">{num(report.staff.principalTeaching.total)} នាក់</span> ស្រី : <span className="font-medium">{num(report.staff.principalTeaching.female)} នាក់</span>
            </p>
            <p className="pl-4">
              - បុគ្គលិកផ្សេងៗ : <span className="font-medium">{num(report.staff.otherStaff.total)} នាក់</span> ស្រី : <span className="font-medium">{num(report.staff.otherStaff.female)} នាក់</span> ({report.staff.otherStaff.description})
            </p>
          </div>

          {/* Finances Table matching MoEYS standard */}
          <div className="space-y-2 pl-2">
            <p className="font-semibold text-slate-900 text-sm">
              .ហិរញ្ញប្បទាន: ({report.finances.periodNote || 'ចាប់ពីខែ តុលា ដល់ ខែ កញ្ញា'})
            </p>
            
            <div className="overflow-x-auto">
              <table className="w-full border-collapse border border-slate-900 text-xs">
                <thead>
                  <tr className="bg-slate-100 text-slate-900">
                    <th className="border border-slate-900 py-1.5 px-2 text-center font-bold w-[30%]">
                      បរិយាយ
                    </th>
                    <th className="border border-slate-900 py-1.5 px-2 text-center font-bold w-[20%]">
                      បរិមាណ
                    </th>
                    <th className="border border-slate-900 py-1.5 px-2 text-center font-bold w-[16%]">
                      ទឹកប្រាក់សរុប
                    </th>
                    <th className="border border-slate-900 py-1.5 px-2 text-center font-bold w-[18%]">
                      ប្រភពថវិកា
                    </th>
                    <th className="border border-slate-900 py-1.5 px-2 text-center font-bold w-[16%]">
                      កង្វះថវិកា
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {report.finances.tableRows && report.finances.tableRows.length > 0 ? (
                    report.finances.tableRows.map((row, idx) => (
                      <tr key={row.id || idx}>
                        <td className="border border-slate-900 py-1.5 px-2.5 text-left font-medium">
                          {row.description}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center">
                          {num(row.quantity)}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center font-medium">
                          {row.totalAmount ? num(row.totalAmount) : ''}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2.5 text-left whitespace-pre-line leading-relaxed text-[11px]">
                          {row.budgetSource}
                        </td>
                        <td className="border border-slate-900 py-1.5 px-2 text-center">
                          {row.deficit ? num(row.deficit) : ''}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <>
                      {report.finances.newConstruction && (
                        <tr>
                          <td className="border border-slate-900 py-1 px-2 text-left font-medium">សាងសង់អគារសិក្សាពហុបំណង</td>
                          <td className="border border-slate-900 py-1 px-2 text-center">{num(report.finances.newConstruction.buildings)} ខ្នង {num(report.finances.newConstruction.rooms)} បន្ទប់</td>
                          <td className="border border-slate-900 py-1 px-2 text-center">{num(report.finances.newConstruction.costRiel)}</td>
                          <td className="border border-slate-900 py-1 px-2 text-left whitespace-pre-line">{report.finances.newConstruction.sources}</td>
                          <td className="border border-slate-900 py-1 px-2 text-center">-</td>
                        </tr>
                      )}
                      {report.finances.repair && (
                        <tr>
                          <td className="border border-slate-900 py-1 px-2 text-left font-medium">ជួសជុលអគារ</td>
                          <td className="border border-slate-900 py-1 px-2 text-center">{num(report.finances.repair.buildings)} ខ្នង {num(report.finances.repair.rooms)} បន្ទប់</td>
                          <td className="border border-slate-900 py-1 px-2 text-center">{num(report.finances.repair.costRiel)}</td>
                          <td className="border border-slate-900 py-1 px-2 text-left whitespace-pre-line">{report.finances.repair.sources}</td>
                          <td className="border border-slate-900 py-1 px-2 text-center">-</td>
                        </tr>
                      )}
                    </>
                  )}
                </tbody>
              </table>
            </div>
          </div>

          {/* Library */}
          <div className="space-y-1 pl-2">
            <p className="font-semibold text-slate-800">ការងារបណ្ណាល័យ</p>
            <p className="pl-4">- បណ្ណាល័យដំណើរការជាប្រចាំចំនួន : <span className="font-medium">{num(report.library.activeRegular)}</span></p>
            <p className="pl-4">- បណ្ណាល័យតែដំណើរការមិនសូវបានល្អចំនួន : <span className="font-medium">{num(report.library.suboptimal)}</span></p>
            <p className="pl-4">- គ្មានបណ្ណាល័យសោះចំនួន : <span className="font-medium">{num(report.library.none)}</span></p>
          </div>
        </div>

        {/* SECTION II */}
        <div className="space-y-4 mb-6 page-break-after">
          <h2 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
            II-ការធានាគុណភាព
          </h2>

          {/* Academic Table 1 */}
          <div className="space-y-2">
            <p className="font-semibold text-slate-800">លទ្ធផលសិក្សាដំណាច់ឆ្នាំសិក្សា</p>
            
            <table className="w-full text-center border-collapse border border-slate-900 text-xs">
              <tbody>
                <tr>
                  <td rowSpan={4} className="border border-slate-900 p-1 font-bold">ថ្នាក់ទី</td>
                  <td colSpan={14} className="border border-slate-900 p-1 font-bold">លទ្ធផលសិក្សារបស់សិស្ស</td>
                </tr>
                <tr>
                  <td colSpan={2} className="border border-slate-900 p-1">សិស្សដំណាច់ឆ្នាំ</td>
                  <td colSpan={2} className="border border-slate-900 p-1">សិស្សចុងឆ្នាំ</td>
                  <td colSpan={2} className="border border-slate-900 p-1">ជាប់មធ្យមភាគ</td>
                  <td colSpan={2} className="border border-slate-900 p-1">ធ្វើតេស្តជាប់</td>
                  <td colSpan={2} className="border border-slate-900 p-1">ជាប់ចុងឆ្នាំ</td>
                  <td colSpan={2} className="border border-slate-900 p-1">សិស្សត្រួតថ្នាក់</td>
                  <td colSpan={2} className="border border-slate-900 p-1">សិស្សបោះបង់</td>
                </tr>
                <tr className="text-[11px]">
                  <td className="border border-slate-900 p-0.5">សរុប</td>
                  <td className="border border-slate-900 p-0.5">ស្រី</td>
                  <td className="border border-slate-900 p-0.5">សរុប</td>
                  <td className="border border-slate-900 p-0.5">ស្រី</td>
                  <td className="border border-slate-900 p-0.5">សរុប</td>
                  <td className="border border-slate-900 p-0.5">ស្រី</td>
                  <td className="border border-slate-900 p-0.5">សរុប</td>
                  <td className="border border-slate-900 p-0.5">ស្រី</td>
                  <td className="border border-slate-900 p-0.5">សរុប</td>
                  <td className="border border-slate-900 p-0.5">ស្រី</td>
                  <td className="border border-slate-900 p-0.5">សរុប</td>
                  <td className="border border-slate-900 p-0.5">ស្រី</td>
                  <td className="border border-slate-900 p-0.5">សរុប</td>
                  <td className="border border-slate-900 p-0.5">ស្រី</td>
                </tr>
                <tr className="text-[10px] bg-slate-50">
                  <td colSpan={2} className="border border-slate-900 p-0.5">A=5+6+7</td>
                  <td colSpan={2} className="border border-slate-900 p-0.5">B=5+6</td>
                  <td colSpan={2} className="border border-slate-900 p-0.5">3</td>
                  <td colSpan={2} className="border border-slate-900 p-0.5">4</td>
                  <td colSpan={2} className="border border-slate-900 p-0.5">5=3+4</td>
                  <td colSpan={2} className="border border-slate-900 p-0.5">6</td>
                  <td colSpan={2} className="border border-slate-900 p-0.5">7</td>
                </tr>
                {report.academicResults.map(r => (
                  <tr key={r.grade}>
                    <td className="border border-slate-900 p-1 font-bold">{num(r.grade)}</td>
                    <td className="border border-slate-900 p-1">{num(r.yearEndTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(r.yearEndFemale)}</td>
                    <td className="border border-slate-900 p-1">{num(r.finalStudentsTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(r.finalStudentsFemale)}</td>
                    <td className="border border-slate-900 p-1">{num(r.passedAverageTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(r.passedAverageFemale)}</td>
                    <td className="border border-slate-900 p-1">{num(r.passedRetestTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(r.passedRetestFemale)}</td>
                    <td className="border border-slate-900 p-1 font-semibold">{num(r.finalPassedTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(r.finalPassedFemale)}</td>
                    <td className="border border-slate-900 p-1">{num(r.repeaterTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(r.repeaterFemale)}</td>
                    <td className="border border-slate-900 p-1">{num(r.dropoutTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(r.dropoutFemale)}</td>
                  </tr>
                ))}
                <tr className="font-bold bg-slate-100">
                  <td className="border border-slate-900 p-1">សរុប</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.yearEndTotal, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.yearEndFemale, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.finalStudentsTotal, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.finalStudentsFemale, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.passedAverageTotal, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.passedAverageFemale, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.passedRetestTotal, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.passedRetestFemale, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.finalPassedTotal, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.finalPassedFemale, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.repeaterTotal, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.repeaterFemale, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.dropoutTotal, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.academicResults.reduce((a, b) => a + b.dropoutFemale, 0))}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Academic Table 2: Percentages */}
          <div className="space-y-2 mt-4">
            <p className="font-semibold text-slate-800">លទ្ធផលសិក្សាដំណាច់ឆ្នាំគិតជាភាគរយ</p>
            
            <table className="w-full text-center border-collapse border border-slate-900 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th className="border border-slate-900 p-1">ថ្នាក់ទី</th>
                  <th className="border border-slate-900 p-1">%ជាប់មុនតេស្ត</th>
                  <th className="border border-slate-900 p-1">%ធ្វើតេស្តជាប់</th>
                  <th className="border border-slate-900 p-1">%ជាប់ចុងឆ្នាំ</th>
                  <th className="border border-slate-900 p-1">%ត្រួត</th>
                  <th className="border border-slate-900 p-1">%បោះបង់</th>
                  <th className="border border-slate-900 p-1">ផ្សេងៗ</th>
                </tr>
                <tr className="text-[10px]">
                  <th className="border border-slate-900 p-0.5">1</th>
                  <th className="border border-slate-900 p-0.5">2</th>
                  <th className="border border-slate-900 p-0.5">3=1+2</th>
                  <th className="border border-slate-900 p-0.5">4</th>
                  <th className="border border-slate-900 p-0.5">5</th>
                  <th className="border border-slate-900 p-0.5">6</th>
                  <th className="border border-slate-900 p-0.5"></th>
                </tr>
              </thead>
              <tbody>
                {report.academicPercentages.map(p => (
                  <tr key={p.grade} className={p.grade === 'សរុប' ? 'font-bold bg-slate-100' : ''}>
                    <td className="border border-slate-900 p-1">{num(p.grade)}</td>
                    <td className="border border-slate-900 p-1">{num(p.passedBeforeTestPct)}</td>
                    <td className="border border-slate-900 p-1">{num(p.passedRetestPct)}</td>
                    <td className="border border-slate-900 p-1">{num(p.finalPassedPct)}</td>
                    <td className="border border-slate-900 p-1">{num(p.repeaterPct)}</td>
                    <td className="border border-slate-900 p-1">{num(p.dropoutPct)}</td>
                    <td className="border border-slate-900 p-1">{p.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Academic Table 3: Post-Test Academic Results */}
          {report.postTestAcademicResults && report.postTestAcademicResults.length > 0 && (
            <div className="space-y-2 mt-4 page-break-inside-avoid">
              <p className="font-semibold text-slate-800">លទ្ធផលសិក្សា ក្រោយធ្វើតេស្តចុងឆ្នាំរួច</p>
              
              <div className="overflow-x-auto">
                <table className="w-full text-center border-collapse border border-slate-900 text-[10px] leading-tight">
                  <thead>
                    <tr className="font-bold">
                      <th rowSpan={4} className="border border-slate-900 p-0.5">ថ្នាក់</th>
                      <th colSpan={24} className="border border-slate-900 p-0.5">សិស្សសរុបពីថ្នាក់ទី១ ដល់៦</th>
                    </tr>
                    <tr className="font-semibold text-[10px]">
                      <th colSpan={2} className="border border-slate-900 p-0.5">ឆមាសទី១</th>
                      <th colSpan={2} className="border border-slate-900 p-0.5">សិស្សចុងឆ្នាំ</th>
                      <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សជាប់មធ្យមភាគ</th>
                      <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សធ្វើតេស្តជាប់</th>
                      <th colSpan={4} className="border border-slate-900 p-0.5">សរុបជាប់ចុងឆ្នាំ</th>
                      <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សត្រួតថ្នាក់</th>
                      <th colSpan={4} className="border border-slate-900 p-0.5">សិស្សបោះបង់</th>
                    </tr>
                    <tr className="text-[9px]">
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
                    <tr className="text-[8px] bg-slate-50 font-mono">
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

          {/* Teaching & Curriculum Table */}
          <div className="space-y-2 mt-4">
            <p className="font-semibold text-slate-800">ការបង្រៀន និង ការអនុវត្ដកម្មវិធីសិក្សា</p>
            
            <table className="w-full text-center border-collapse border border-slate-900 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th rowSpan={2} className="border border-slate-900 p-1">ថ្នាក់</th>
                  <th colSpan={3} className="border border-slate-900 p-1">ចំនួនគ្រូបង្រៀនល្អ</th>
                  <th colSpan={5} className="border border-slate-900 p-1">ការអនុវត្តកម្មវិធី</th>
                </tr>
                <tr className="text-[11px]">
                  <th className="border border-slate-900 p-0.5">បង្រៀនល្អ</th>
                  <th className="border border-slate-900 p-0.5">បង្រៀនមធ្យម</th>
                  <th className="border border-slate-900 p-0.5">បង្រៀនខ្សោយ</th>
                  <th className="border border-slate-900 p-0.5">%ខ្មែរ</th>
                  <th className="border border-slate-900 p-0.5">%គណិត</th>
                  <th className="border border-slate-900 p-0.5">%សិក្សាសង្គម</th>
                  <th className="border border-slate-900 p-0.5">%វិទ្យាសាស្ត្រ</th>
                  <th className="border border-slate-900 p-0.5">%អង់គ្លេស</th>
                </tr>
              </thead>
              <tbody>
                {report.teachingEvaluation.rows.map(t => (
                  <tr key={t.grade}>
                    <td className="border border-slate-900 p-1 font-semibold">{num(t.grade)}</td>
                    <td className="border border-slate-900 p-1">{num(t.goodTeachers)}</td>
                    <td className="border border-slate-900 p-1">{num(t.mediumTeachers)}</td>
                    <td className="border border-slate-900 p-1">{num(t.weakTeachers)}</td>
                    <td className="border border-slate-900 p-1">{num(t.khmerPct)}%</td>
                    <td className="border border-slate-900 p-1">{num(t.mathPct)}%</td>
                    <td className="border border-slate-900 p-1">{num(t.socialPct)}%</td>
                    <td className="border border-slate-900 p-1">{num(t.sciencePct)}%</td>
                    <td className="border border-slate-900 p-1">{num(t.englishPct)}%</td>
                  </tr>
                ))}
                <tr className="font-bold bg-slate-100">
                  <td className="border border-slate-900 p-1">សរុប</td>
                  <td className="border border-slate-900 p-1">{num(report.teachingEvaluation.rows.reduce((a, b) => a + b.goodTeachers, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.teachingEvaluation.rows.reduce((a, b) => a + b.mediumTeachers, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(report.teachingEvaluation.rows.reduce((a, b) => a + b.weakTeachers, 0))}</td>
                  <td className="border border-slate-900 p-1">{num(Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.khmerPct, 0) / 6))}%</td>
                  <td className="border border-slate-900 p-1">{num(Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.mathPct, 0) / 6))}%</td>
                  <td className="border border-slate-900 p-1">{num(Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.socialPct, 0) / 6))}%</td>
                  <td className="border border-slate-900 p-1">{num(Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.sciencePct, 0) / 6))}%</td>
                  <td className="border border-slate-900 p-1">{num(Math.round(report.teachingEvaluation.rows.reduce((a, b) => a + b.englishPct, 0) / 6))}%</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Criteria description */}
          <div className="space-y-1 pl-2 text-xs pt-2">
            <h3 className="font-bold text-slate-900">លក្ខណៈវិនិច្ឆ័យ</h3>
            <p>- ល្អ ៖ <span className="font-medium">{report.teachingEvaluation.criteriaGood}</span></p>
            <p>- មធ្យម ៖ <span className="font-medium">{report.teachingEvaluation.criteriaMedium}</span></p>
            <p>- ខ្សោយ ៖ <span className="font-medium">{report.teachingEvaluation.criteriaWeak}</span></p>
          </div>

          {/* Girls Counseling */}
          <div className="space-y-2 mt-4">
            <p className="font-semibold text-slate-800">ទីប្រឹក្សាកុមារី</p>
            <div className="pl-4 space-y-1 text-xs">
              <p>- សកម្មភាពអនុវត្ដៈ <span className="font-medium">{report.girlsCounseling.activities}</span></p>
              <p>- បញ្ហាប្រឈមៈ <span className="font-medium">{report.girlsCounseling.challenges}</span></p>
              <p>- សំណូមពរៈ <span className="font-medium">{report.girlsCounseling.requests}</span></p>
            </div>
          </div>

          {/* Life Skills */}
          <div className="space-y-2 mt-4">
            <p className="font-semibold text-slate-800">កម្មវិធីបំណិនជីវិត</p>
            
            <table className="w-full text-center border-collapse border border-slate-900 text-xs">
              <thead className="bg-slate-50">
                <tr>
                  <th rowSpan={2} className="border border-slate-900 p-1 text-left">បរិយាយ</th>
                  <th colSpan={2} className="border border-slate-900 p-1">ចំនួនសាលា</th>
                  <th colSpan={4} className="border border-slate-900 p-1">ចំនួនសិស្ស</th>
                  <th rowSpan={2} className="border border-slate-900 p-1">ផ្សេងៗ</th>
                </tr>
                <tr className="text-[10px]">
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">សរុប</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                  <th className="border border-slate-900 p-0.5">ស្រី</th>
                  <th className="border border-slate-900 p-0.5">%</th>
                </tr>
              </thead>
              <tbody>
                {report.lifeSkills.programs.map(p => (
                  <tr key={p.name}>
                    <td className="border border-slate-900 p-1 text-left">{p.name}</td>
                    <td className="border border-slate-900 p-1">{num(p.schoolsCount)}</td>
                    <td className="border border-slate-900 p-1">{num(p.schoolsPct)}</td>
                    <td className="border border-slate-900 p-1">{num(p.studentsTotal)}</td>
                    <td className="border border-slate-900 p-1">{num(p.studentsTotalPct)}</td>
                    <td className="border border-slate-900 p-1">{num(p.studentsFemale)}</td>
                    <td className="border border-slate-900 p-1">{num(p.studentsFemalePct)}</td>
                    <td className="border border-slate-900 p-1">{p.notes || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div className="pl-4 space-y-1 text-xs pt-1">
              <p>- សកម្មភាពអនុវត្ដៈ <span className="font-medium">{report.lifeSkills.activities}</span></p>
              <p>- បញ្ហាប្រឈមៈ <span className="font-medium">{report.lifeSkills.challenges}</span></p>
              <p>- សំណូមពរៈ <span className="font-medium">{report.lifeSkills.requests}</span></p>
            </div>
          </div>

          {/* School Health */}
          <div className="space-y-3 mt-4">
            <p className="font-semibold text-slate-800">សុខភាពសិក្សា</p>

            {/* Deworming */}
            <div className="pl-2 space-y-2">
              <h4 className="font-semibold text-xs">ក.ការទម្លាក់ព្រូន</h4>
              
              <table className="w-full text-center border-collapse border border-slate-900 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th rowSpan={2} className="border border-slate-900 p-1">បរិយាយ</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ចំនួនសិស្សទទួលថ្នាំ</th>
                    <th colSpan={2} className="border border-slate-900 p-1">គិតជាភាគរយ</th>
                    <th rowSpan={2} className="border border-slate-900 p-1">ផ្សេងៗ</th>
                  </tr>
                  <tr className="text-[10px]">
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">ស្រី</th>
                    <th className="border border-slate-900 p-0.5">ភាគរយសរុប</th>
                    <th className="border border-slate-900 p-0.5">ភាគរយស្រី</th>
                  </tr>
                </thead>
                <tbody>
                  {report.health.deworming.rounds.map(r => (
                    <tr key={r.roundName}>
                      <td className="border border-slate-900 p-1">{r.roundName}</td>
                      <td className="border border-slate-900 p-1">{num(r.total)}</td>
                      <td className="border border-slate-900 p-1">{num(r.female)}</td>
                      <td className="border border-slate-900 p-1">{num(r.totalPct)}</td>
                      <td className="border border-slate-900 p-1">{num(r.femalePct)}</td>
                      <td className="border border-slate-900 p-1">{num(r.other)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pl-2 space-y-1 text-xs">
                <p>- សកម្មភាពអនុវត្ដៈ <span className="font-medium">{report.health.deworming.activities}</span></p>
                <p>- បញ្ហាប្រឈមៈ <span className="font-medium">{report.health.deworming.challenges}</span></p>
                <p>- សំណូមពរៈ <span className="font-medium">{report.health.deworming.requests}</span></p>
              </div>
            </div>

            {/* Sanitation & Water */}
            <div className="pl-2 space-y-2 mt-3">
              <h4 className="font-semibold text-xs">ខ.ការរៀបចំបង្គន់អនាម័យ និង ទឹកស្អាត</h4>
              
              <table className="w-full text-center border-collapse border border-slate-900 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th rowSpan={2} className="border border-slate-900 p-1 text-left">បរិយាយ</th>
                    <th rowSpan={2} className="border border-slate-900 p-1">ចំនួនសាលា</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ចំនួនបង្គន់ឬប្រភពទឹក</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ប្រើប្រាស់បាន</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ខូចប្រើមិនបាន</th>
                  </tr>
                  <tr className="text-[10px]">
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">%</th>
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">%</th>
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">%</th>
                  </tr>
                </thead>
                <tbody>
                  {report.health.sanitation.facilities.map(f => (
                    <tr key={f.facility}>
                      <td className="border border-slate-900 p-1 text-left">{f.facility}</td>
                      <td className="border border-slate-900 p-1">{num(f.schoolsCount)}</td>
                      <td className="border border-slate-900 p-1">{num(f.totalCount)}</td>
                      <td className="border border-slate-900 p-1">{num(f.totalPct)}</td>
                      <td className="border border-slate-900 p-1">{num(f.workingCount)}</td>
                      <td className="border border-slate-900 p-1">{num(f.workingPct)}</td>
                      <td className="border border-slate-900 p-1">{num(f.brokenCount)}</td>
                      <td className="border border-slate-900 p-1">{num(f.brokenPct)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>

              <div className="pl-2 space-y-1 text-xs">
                <p>- សកម្មភាពអនុវត្ដៈ <span className="font-medium">{report.health.sanitation.activities}</span></p>
                <p>- បញ្ហាប្រឈមៈ <span className="font-medium">{report.health.sanitation.challenges}</span></p>
                <p>- សំណូមពរៈ <span className="font-medium">{report.health.sanitation.requests}</span></p>
              </div>
            </div>

            {/* Breakfast & Food Rations */}
            <div className="pl-2 space-y-2 mt-3">
              <h4 className="font-semibold text-xs">គ.ការផ្ដល់អាហារពេលព្រឹក និង របបស្បៀងយកទៅផ្ទះ</h4>
              
              <table className="w-full text-center border-collapse border border-slate-900 text-xs">
                <thead className="bg-slate-50">
                  <tr>
                    <th colSpan={2} rowSpan={2} className="border border-slate-900 p-1">បរិយាយ</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ចំនួនសាលាទទួលបាន</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ចំនួនសិស្ស</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ចំនួនសាលាទទួលបាន</th>
                    <th colSpan={2} className="border border-slate-900 p-1">ចំនួនសិស្ស</th>
                  </tr>
                  <tr className="text-[10px]">
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">%</th>
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">ស្រី</th>
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">%</th>
                    <th className="border border-slate-900 p-0.5">សរុប</th>
                    <th className="border border-slate-900 p-0.5">ស្រី</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td colSpan={2} className="border border-slate-900 p-1">របបស្បៀង</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num('0%')}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num('0%')}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                  </tr>
                  <tr>
                    <td colSpan={2} className="border border-slate-900 p-1">អាហារពេលព្រឹក</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num('0%')}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num('0%')}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                    <td className="border border-slate-900 p-1">{num(0)}</td>
                  </tr>
                </tbody>
              </table>

              <div className="pl-2 space-y-1 text-xs">
                <p>- សកម្មភាពអនុវត្ដៈ <span className="font-medium">{report.health.nutrition.activities}</span></p>
                <p>- បញ្ហាប្រឈមៈ <span className="font-medium">{report.health.nutrition.challenges}</span></p>
                <p>- សំណូមពរៈ <span className="font-medium">{report.health.nutrition.requests}</span></p>
              </div>
            </div>
          </div>

          {/* Extracurricular Activities */}
          <div className="space-y-3 mt-5">
            <p className="font-semibold text-slate-800">សកម្មភាពអប់រំក្រៅសាលា ក្រៅថ្នាក់</p>

            <div className="pl-4 space-y-3 text-xs">
              {/* ក.ការងារសង្គម */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">ក.ការងារសង្គម</p>
                <p className="pl-3">- ខ្លឹមសារ ៖ <span className="font-medium">{report.extracurricular.socialWork.content}</span></p>
                <p className="pl-3">- លទ្ធផល ៖ <span className="font-medium">{report.extracurricular.socialWork.result}</span></p>
              </div>

              {/* ខ.ពលកម្មបង្កបង្កើនផល */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">ខ.ពលកម្មបង្កបង្កើនផល</p>
                <p className="pl-3">- ខ្លឹមសារ ៖ <span className="font-medium">{report.extracurricular.agriculture.content}</span></p>
                <p className="pl-3">- លទ្ធផល ៖ <span className="font-medium">{report.extracurricular.agriculture.result}</span></p>
              </div>

              {/* គ.ទស្សនៈកិច្ចសិក្សា */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">គ.ទស្សនៈកិច្ចសិក្សា</p>
                <p className="pl-3">- ខ្លឹមសារ ៖ <span className="font-medium">{report.extracurricular.studyTour.content}</span></p>
                <p className="pl-3">- លទ្ធផល ៖ <span className="font-medium">{report.extracurricular.studyTour.result}</span></p>
              </div>

              {/* ឃ.កីឡា */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">ឃ.កីឡា</p>
                <p className="pl-3">
                  - ការប្រកួត ៖ <span className="font-medium">{num(report.extracurricular.sports.competitionsCount)} លើក</span> | កម្រិតក្នុងសាលា <span className="font-medium">{num(report.extracurricular.sports.schoolLevelClasses)} ថ្នាក់</span> | ថ្នាក់កម្រង <span className="font-medium">{num(report.extracurricular.sports.clusterTimes)} ដង</span> | ស្រុក <span className="font-medium">{num(report.extracurricular.sports.districtTimes)} ដង</span> | ខេត្ដ <span className="font-medium">{num(report.extracurricular.sports.provinceTimes)} ដង</span>
                </p>
                <p className="pl-3">- ខ្លឹមសារ ៖ <span className="font-medium">{report.extracurricular.sports.content}</span></p>
                <p className="pl-3">- លទ្ធផល ៖ <span className="font-medium">{report.extracurricular.sports.result}</span></p>
              </div>

              {/* ង.សិល្បៈ */}
              <div className="space-y-1">
                <p className="font-semibold text-slate-800">ង.សិល្បៈ</p>
                <p className="pl-3">
                  - ការសម្ដែង ៖ <span className="font-medium">{num(report.extracurricular.arts.performancesCount)} លើក</span> | កម្រិតក្នុងសាលា <span className="font-medium">{num(report.extracurricular.arts.schoolLevelClasses)} ថ្នាក់</span> | ថ្នាក់កម្រង <span className="font-medium">{num(report.extracurricular.arts.clusterTimes)} ដង</span> | ស្រុក <span className="font-medium">{num(report.extracurricular.arts.districtTimes)} ដង</span> | ខេត្ដ <span className="font-medium">{num(report.extracurricular.arts.provinceTimes)} ដង</span>
                </p>
                <p className="pl-3">- ខ្លឹមសារ ៖ <span className="font-medium">{report.extracurricular.arts.content}</span></p>
                <p className="pl-3">- លទ្ធផល ៖ <span className="font-medium">{report.extracurricular.arts.result}</span></p>
              </div>
            </div>
          </div>

          {/* Inspection Section */}
          <div className="space-y-2 mt-5">
            <p className="font-semibold text-slate-800">អធិការកិច្ច</p>
            <div className="pl-4 space-y-1 text-xs">
              <p>- ថ្នាក់ក្រសួងពិនិត្យបាន <span className="font-medium">{num(report.inspection.ministry.schoolsCount)} សាលា</span> ស្មើ <span className="font-medium">{num(report.inspection.ministry.classesCount)} ថ្នាក់</span></p>
              <p>- ថ្នាក់ខេត្ដចុះពិនិត្យបាន <span className="font-medium">{num(report.inspection.province.schoolsCount)} សាលា</span> ស្មើ <span className="font-medium">{num(report.inspection.province.classesCount)} ថ្នាក់</span></p>
              <p>- ថ្នាក់ស្រុកចុះពិនិត្យបាន <span className="font-medium">{num(report.inspection.district.schoolsCount)} សាលា</span> ស្មើ <span className="font-medium">{num(report.inspection.district.classesCount)} ថ្នាក់</span></p>
              <p>- ថ្នាក់កម្រងចុះពិនិត្យបាន <span className="font-medium">{num(report.inspection.cluster.schoolsCount)} សាលា</span> ស្មើ <span className="font-medium">{num(report.inspection.cluster.classesCount)} ថ្នាក់</span></p>
              <p>- សរុបថ្នាក់ចុះពិនិត្យបាន <span className="font-medium">{num(report.inspection.total.schoolsCount)} សាលា</span> ស្មើ <span className="font-medium">{num(report.inspection.total.classesCount)} ថ្នាក់</span></p>
              <p>- ខ្លឹមសារជួយណែនាំ + បទពិសោធន៏ការងារ ៖ <span className="font-medium">{report.inspection.guidanceFeedback}</span></p>
            </div>
          </div>

          {/* Community Work Section */}
          <div className="space-y-2 mt-5">
            <p className="font-semibold text-slate-800">ការងារសហគមន៏</p>
            <div className="pl-4 space-y-1 text-xs">
              <p>- សហគមន៏ចូលរួមសហការអភិវឌ្ឍល្អ ៖ <span className="font-medium">{report.communityWork.cooperationDetails}</span></p>
              <p>- លទ្ធផល ៖ <span className="font-medium">{report.communityWork.result}</span></p>
            </div>
          </div>
        </div>

        {/* SECTION III: VACATION PREPARATION */}
        <div className="space-y-4 mb-6 page-break-after">
          <h2 className="font-bold text-sm text-slate-900 border-b border-slate-300 pb-1">
            III-លក្ខណៈត្រៀមមហាវិស្សមកាល
          </h2>
          <div className="pl-4 space-y-2 text-xs">
            <ul className="list-disc pl-5 space-y-1">
              {report.vacationPrep.tasks.map((task, idx) => (
                <li key={idx} className="font-medium">{task}</li>
              ))}
            </ul>
            <p className="pt-1">
              - បញ្ជីឈ្មោះសិស្សអាហារូបករណ៍ ៖ <span className="font-medium">{report.vacationPrep.scholarshipListStatus}</span>
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
    </div>
  );
};
