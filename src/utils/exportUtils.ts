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
} from '../types';
import { formatPct } from '../data/initialData';

export function exportAllTablesToExcel(
  meta: SchoolMeta,
  t1Rooms: Table1SchoolRooms,
  t1Staff: Table1Staff,
  t2Rows: Table2RowInput[],
  t3Rows: Table3RowInput[],
  t4Rows: Table4RowInput[],
  t4HeaderConfig?: Table4HeaderConfig,
  library?: LibraryData,
  waterSanitation?: WaterSanitationData,
  healthSocial?: HealthSocialData,
  finance?: SchoolFinanceData
) {
  // Compute Table 1 sums
  const totalRooms = (Number(t1Rooms.teachingRooms) || 0) + (Number(t1Rooms.otherRooms) || 0);
  const gradesKeys: Array<keyof Pick<Table1SchoolRooms, 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'>> = [
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6'
  ];
  const t1TotalClasses = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].classes) || 0), 0);
  const t1TotalStudents = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].total) || 0), 0);
  const t1TotalFemale = gradesKeys.reduce((a, k) => a + (Number(t1Rooms[k].female) || 0), 0);

  // Compute Table 1(ត) sums
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
  const nonTeachingTotal =
    (Number(t1Staff.directorDeputy.total) || 0) + (Number(t1Staff.officeAdmin.total) || 0);
  const nonTeachingFemale =
    (Number(t1Staff.directorDeputy.female) || 0) + (Number(t1Staff.officeAdmin.female) || 0);
  const totalCadre = nonTeachingTotal + teachingTotal + (Number(t1Staff.assistTeaching.total) || 0);
  const totalCadreFemale = nonTeachingFemale + teachingFemale + (Number(t1Staff.assistTeaching.female) || 0);

  // HTML content formatted for Excel with borders, Khmer font, and headers
  const html = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/TR/REC-html40">
    <head>
      <meta charset="utf-8" />
      <!--[if gte mso 9]>
      <xml>
        <x:ExcelWorkbook>
          <x:ExcelWorksheets>
            <x:ExcelWorksheet>
              <x:Name>ស្ថិតិសាលា</x:Name>
              <x:WorksheetOptions>
                <x:DisplayGridlines/>
              </x:WorksheetOptions>
            </x:ExcelWorksheet>
          </x:ExcelWorksheets>
        </x:ExcelWorkbook>
      </xml>
      <![endif]-->
      <style>
        body { font-family: 'Kantumruy Pro', 'Khmer OS Siemreap', sans-serif; font-size: 11pt; }
        table { border-collapse: collapse; margin-bottom: 25px; width: 100%; }
        th, td { border: 1px solid #475569; padding: 6px 8px; text-align: center; }
        th { background-color: #f1f5f9; font-weight: bold; }
        .bg-calc { background-color: #e2e8f0; font-weight: bold; }
        .title { font-size: 14pt; font-weight: bold; text-align: center; margin: 15px 0 5px 0; }
        .header-box { text-align: center; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="header-box">
        <h3>ព្រះរាជាណាចក្រកម្ពុជា</h3>
        <h4>ជាតិ សាសនា ព្រះមហាក្សត្រ</h4>
        <p><strong>${meta.schoolName}</strong> | ឆ្នាំសិក្សា ${meta.academicYear}</p>
      </div>

      <div class="title">១. តារាងស្ថិតិសាលា អគារ បន្ទប់ សិស្ស</div>
      <table>
        <tr>
          <th rowspan="2">ឈ្មោះសាលា</th>
          <th rowspan="2">អគារ</th>
          <th colspan="3">ចំនួនបន្ទប់</th>
          <th colspan="3">ថ្នាក់ទី១</th>
          <th colspan="3">ថ្នាក់ទី២</th>
          <th colspan="3">ថ្នាក់ទី៣</th>
          <th colspan="3">ថ្នាក់ទី៤</th>
          <th colspan="3">ថ្នាក់ទី៥</th>
          <th colspan="3">ថ្នាក់ទី៦</th>
          <th colspan="3">សរុបរួម</th>
        </tr>
        <tr>
          <th>ប.បរ</th>
          <th>ផ្សេងៗ</th>
          <th>សរុប</th>
          <th>ថ្នាក់</th><th>សរុប</th><th>ស្រី</th>
          <th>ថ្នាក់</th><th>សរុប</th><th>ស្រី</th>
          <th>ថ្នាក់</th><th>សរុប</th><th>ស្រី</th>
          <th>ថ្នាក់</th><th>សរុប</th><th>ស្រី</th>
          <th>ថ្នាក់</th><th>សរុប</th><th>ស្រី</th>
          <th>ថ្នាក់</th><th>សរុប</th><th>ស្រី</th>
          <th>ថ្នាក់</th><th>សរុប</th><th>ស្រី</th>
        </tr>
        <tr>
          <td>${t1Rooms.schoolName}</td>
          <td>${t1Rooms.buildings}</td>
          <td>${t1Rooms.teachingRooms}</td>
          <td>${t1Rooms.otherRooms}</td>
          <td class="bg-calc">${totalRooms}</td>
          <td>${t1Rooms.g1.classes}</td><td>${t1Rooms.g1.total}</td><td>${t1Rooms.g1.female}</td>
          <td>${t1Rooms.g2.classes}</td><td>${t1Rooms.g2.total}</td><td>${t1Rooms.g2.female}</td>
          <td>${t1Rooms.g3.classes}</td><td>${t1Rooms.g3.total}</td><td>${t1Rooms.g3.female}</td>
          <td>${t1Rooms.g4.classes}</td><td>${t1Rooms.g4.total}</td><td>${t1Rooms.g4.female}</td>
          <td>${t1Rooms.g5.classes}</td><td>${t1Rooms.g5.total}</td><td>${t1Rooms.g5.female}</td>
          <td>${t1Rooms.g6.classes}</td><td>${t1Rooms.g6.total}</td><td>${t1Rooms.g6.female}</td>
          <td class="bg-calc">${t1TotalClasses}</td>
          <td class="bg-calc">${t1TotalStudents}</td>
          <td class="bg-calc">${t1TotalFemale}</td>
        </tr>
      </table>

      <div class="title">១. តារាងស្ថិតិសាលា អគារ បន្ទប់ សិស្ស (ត)</div>
      <table>
        <tr>
          <th rowspan="3">ឈ្មោះសាលា</th>
          <th colspan="4">មិនបង្រៀន</th>
          <th colspan="10">បុគ្គលិកបង្រៀន</th>
          <th colspan="2" rowspan="2">ក្នុងនោះ ២ពេល</th>
          <th colspan="2" rowspan="2">ជួយប.រ</th>
          <th colspan="2" rowspan="2">ក្របខ័ណ្ឌសរុប</th>
        </tr>
        <tr>
          <th colspan="2">នាយក+រង</th>
          <th colspan="2">ទីចាត់ការ</th>
          <th colspan="2">បរ.សុទ្ធ</th>
          <th colspan="2">គូប</th>
          <th colspan="2">នាយករង</th>
          <th colspan="2">កិ .ស</th>
          <th colspan="2">សរុប</th>
        </tr>
        <tr>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស</th>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>ស្រី</th>
        </tr>
        <tr>
          <td>${t1Staff.schoolName}</td>
          <td>${t1Staff.directorDeputy.total}</td><td>${t1Staff.directorDeputy.female}</td>
          <td>${t1Staff.officeAdmin.total}</td><td>${t1Staff.officeAdmin.female}</td>
          <td>${t1Staff.pureTeaching.total}</td><td>${t1Staff.pureTeaching.female}</td>
          <td>${t1Staff.multiGrade.total}</td><td>${t1Staff.multiGrade.female}</td>
          <td>${t1Staff.deputyTeaching.total}</td><td>${t1Staff.deputyTeaching.female}</td>
          <td>${t1Staff.contractTeaching.total}</td><td>${t1Staff.contractTeaching.female}</td>
          <td class="bg-calc">${teachingTotal}</td><td class="bg-calc">${teachingFemale}</td>
          <td>${t1Staff.twoShifts.total}</td><td>${t1Staff.twoShifts.female}</td>
          <td>${t1Staff.assistTeaching.total}</td><td>${t1Staff.assistTeaching.female}</td>
          <td class="bg-calc">${totalCadre}</td><td class="bg-calc">${totalCadreFemale}</td>
        </tr>
      </table>

      <div class="title">២. លទ្ធផលសិក្សា</div>
      <table>
        <tr>
          <th rowspan="4">ថ្នាក់</th>
          <th colspan="18">សិស្សសរុបពីថ្នាក់ទី១ ដល់៦</th>
        </tr>
        <tr>
          <th colspan="2">ឆមាស១</th>
          <th colspan="4">សិស្សជាប់មធ្យមភាគ</th>
          <th colspan="4">សិស្សធ្លាក់មធ្យមភាគ 0-4.99</th>
          <th colspan="4">សិស្សធ្លាក់មធ្យមភាគ 4.00-4.99</th>
          <th colspan="4">សិស្សបោះបង់</th>
        </tr>
        <tr>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
        </tr>
        <tr>
          <th>1=3+7+15</th><th>2=5+9+17</th><th>3</th><th>4=3x100/1</th><th>5</th><th>6=5x100/2</th>
          <th>7</th><th>8=7x100/1</th><th>9</th><th>10=9x100/2</th><th>11</th><th>12=11x100/7</th>
          <th>13</th><th>14=13x100/9</th><th>15</th><th>16=15x100/1</th><th>17</th><th>18=17x100/2</th>
        </tr>
        ${t2Rows.map((r) => {
          const sem1Total = r.passedAvgTotal + r.failedAvgTotal + r.dropoutTotal;
          const sem1Female = r.passedAvgFemale + r.failedAvgFemale + r.dropoutFemale;
          return `
            <tr>
              <td>${r.gradeLabel}</td>
              <td class="bg-calc">${sem1Total}</td>
              <td class="bg-calc">${sem1Female}</td>
              <td>${r.passedAvgTotal}</td>
              <td>${formatPct(r.passedAvgTotal, sem1Total)}</td>
              <td>${r.passedAvgFemale}</td>
              <td>${formatPct(r.passedAvgFemale, sem1Female)}</td>
              <td>${r.failedAvgTotal}</td>
              <td>${formatPct(r.failedAvgTotal, sem1Total)}</td>
              <td>${r.failedAvgFemale}</td>
              <td>${formatPct(r.failedAvgFemale, sem1Female)}</td>
              <td>${r.failedSubTotal}</td>
              <td>${formatPct(r.failedSubTotal, r.failedAvgTotal)}</td>
              <td>${r.failedSubFemale}</td>
              <td>${formatPct(r.failedSubFemale, r.failedAvgFemale)}</td>
              <td>${r.dropoutTotal}</td>
              <td>${formatPct(r.dropoutTotal, sem1Total)}</td>
              <td>${r.dropoutFemale}</td>
              <td>${formatPct(r.dropoutFemale, sem1Female)}</td>
            </tr>
          `;
        }).join('')}
      </table>

      <div class="title">៣. ស្ថិតិសិស្សធ្លាក់</div>
      <table>
        <tr>
          <th rowspan="4">ថ្នាក់</th>
          <th colspan="10">ថ្នាក់ទី ១ ដល់ ៦</th>
        </tr>
        <tr>
          <th colspan="2">ត្រួតសរុប</th>
          <th colspan="4">ធ្វើតេស្ដជាប់</th>
          <th colspan="4">ធ្វើតេស្ដធ្លាក់</th>
        </tr>
        <tr>
          <th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
        </tr>
        <tr>
          <th>1</th><th>2</th><th>3</th><th>4=3*100/1</th><th>5</th><th>6=5*100/2</th>
          <th>7=1-3</th><th>8=7*100/1</th><th>9=2-5</th><th>10=9*100/2</th>
        </tr>
        ${t3Rows.map((r) => {
          const failTotal = Math.max(0, r.testedTotal - r.passedTotal);
          const failFemale = Math.max(0, r.testedFemale - r.passedFemale);
          return `
            <tr>
              <td>${r.gradeLabel}</td>
              <td>${r.testedTotal}</td>
              <td>${r.testedFemale}</td>
              <td>${r.passedTotal}</td>
              <td>${formatPct(r.passedTotal, r.testedTotal)}</td>
              <td>${r.passedFemale}</td>
              <td>${formatPct(r.passedFemale, r.testedFemale)}</td>
              <td class="bg-calc">${failTotal}</td>
              <td>${formatPct(failTotal, r.testedTotal)}</td>
              <td class="bg-calc">${failFemale}</td>
              <td>${formatPct(failFemale, r.testedFemale)}</td>
            </tr>
          `;
        }).join('')}
      </table>

      <div class="title">៤. លទ្ធផលសិក្សា (${t4HeaderConfig?.period || 'ដំណាច់ឆ្នាំ'})</div>
      <table>
        <tr>
          <th rowspan="4">ថ្នាក់</th>
          <th colspan="24">សិស្សសរុបពីថ្នាក់ទី១ ដល់៦</th>
        </tr>
        <tr>
          <th colspan="2">${t4HeaderConfig?.col1Title || (t4HeaderConfig?.isSwapped ? 'ចុងឆ្នាំ' : 'ដំណាច់ឆ្នាំ')}</th>
          <th colspan="2">${t4HeaderConfig?.col2Title || (t4HeaderConfig?.isSwapped ? 'ដំណាច់ឆ្នាំ' : 'ចុងឆ្នាំ')}</th>
          <th colspan="4">សិស្សជាប់មធ្យមភាគ</th>
          <th colspan="4">សិស្សធ្វើតេស្តជាប់</th>
          <th colspan="4">${t4HeaderConfig?.period === 'ឆមាស១' ? 'សរុបជាប់ឆមាស១' : t4HeaderConfig?.period === 'ឆមាស២' ? 'សរុបជាប់ឆមាស២' : 'សរុបជាប់ចុងឆ្នាំ'}</th>
          <th colspan="4">សិស្សត្រួតថ្នាក់</th>
          <th colspan="4">សិស្សបោះបង់</th>
        </tr>
        <tr>
          <th>សរុប</th><th>ស្រី</th><th>សរុប</th><th>ស្រី</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
          <th>សរុប</th><th>%</th><th>ស្រី</th><th>%</th>
        </tr>
        <tr>
          <th>1=3+21</th><th>2=4+23</th><th>3=13+17</th><th>4=15+19</th>
          <th>5</th><th>6=5x10/1</th><th>7</th><th>8=7x10/2</th>
          <th>9</th><th>10=9x10/1</th><th>11</th><th>12=11x10/2</th>
          <th>13=5+9</th><th>14=13x10/1</th><th>15=7+11</th><th>16=15x10/2</th>
          <th>17</th><th>18=17x10/1</th><th>19</th><th>20=19x10/2</th>
          <th>21</th><th>22=21x10/1</th><th>23</th><th>24=23x10/2</th>
        </tr>
        ${t4Rows.map((r) => {
          const passYearTotal = r.passedAvgTotal + r.passedRetestTotal;
          const passYearFemale = r.passedAvgFemale + r.passedRetestFemale;
          const yearEndTotal = passYearTotal + r.repeatersTotal;
          const yearEndFemale = passYearFemale + r.repeatersFemale;
          const sem1Total = yearEndTotal + r.dropoutsTotal;
          const sem1Female = yearEndFemale + r.dropoutsFemale;
          return `
            <tr>
              <td>${r.gradeLabel}</td>
              <td class="bg-calc">${sem1Total}</td>
              <td class="bg-calc">${sem1Female}</td>
              <td class="bg-calc">${yearEndTotal}</td>
              <td class="bg-calc">${yearEndFemale}</td>
              <td>${r.passedAvgTotal}</td>
              <td>${formatPct(r.passedAvgTotal, sem1Total)}</td>
              <td>${r.passedAvgFemale}</td>
              <td>${formatPct(r.passedAvgFemale, sem1Female)}</td>
              <td>${r.passedRetestTotal}</td>
              <td>${formatPct(r.passedRetestTotal, sem1Total)}</td>
              <td>${r.passedRetestFemale}</td>
              <td>${formatPct(r.passedRetestFemale, sem1Female)}</td>
              <td class="bg-calc">${passYearTotal}</td>
              <td>${formatPct(passYearTotal, sem1Total)}</td>
              <td class="bg-calc">${passYearFemale}</td>
              <td>${formatPct(passYearFemale, sem1Female)}</td>
              <td>${r.repeatersTotal}</td>
              <td>${formatPct(r.repeatersTotal, sem1Total)}</td>
              <td>${r.repeatersFemale}</td>
              <td>${formatPct(r.repeatersFemale, sem1Female)}</td>
              <td>${r.dropoutsTotal}</td>
              <td>${formatPct(r.dropoutsTotal, sem1Total)}</td>
              <td>${r.dropoutsFemale}</td>
              <td>${formatPct(r.dropoutsFemale, sem1Female)}</td>
            </tr>
          `;
        }).join('')}
      </table>

      ${library && waterSanitation && healthSocial && finance ? `
        <div class="title">ផ្នែក B ៖ ស្ថិតិឯកទេស និងសង្គម (បណ្ណាល័យ ទឹកស្អាត ព្រូន សិស្សក្រីក្រ ពិការ និងថវិកា)</div>
        <table>
          <tr>
            <th colspan="2">១. បណ្ណាល័យ</th>
            <th colspan="2">២. ទឹកស្អាត និងបង្គន់</th>
            <th colspan="2">៣. សុខភាព និងសមធម៌</th>
            <th colspan="2">៤. ថវិកាដំណើរការ (PB)</th>
          </tr>
          <tr>
            <td>សៀវភៅសរុប</td>
            <td class="bg-calc">${(Number(library.storyBooks) || 0) + (Number(library.textBooks) || 0) + (Number(library.teacherGuides) || 0)} ក្បាល</td>
            <td>ប្រភពទឹក</td>
            <td>${waterSanitation.waterSource}</td>
            <td>ទម្លាក់ព្រូន ជុំទី១</td>
            <td class="bg-calc">${healthSocial.dewormingRound1.receivedTotal} នាក់ (${formatPct(healthSocial.dewormingRound1.receivedTotal, healthSocial.dewormingRound1.target || t1TotalStudents)})</td>
            <td>ថវិកាទទួល</td>
            <td class="bg-calc">${finance.budgetReceivedPB.toLocaleString()} ៛</td>
          </tr>
          <tr>
            <td>អ្នកអានប្រចាំខែ</td>
            <td>${library.readersMonthly.total} នាក់ (ស្រី ${library.readersMonthly.female})</td>
            <td>បង្គន់ដំណើរការ</td>
            <td class="bg-calc">${waterSanitation.functioningLatrines} បន្ទប់</td>
            <td>ទម្លាក់ព្រូន ជុំទី២</td>
            <td class="bg-calc">${healthSocial.dewormingRound2.receivedTotal} នាក់ (${formatPct(healthSocial.dewormingRound2.receivedTotal, healthSocial.dewormingRound2.target || t1TotalStudents)})</td>
            <td>ថវិកាចំណាយ</td>
            <td class="bg-calc">${finance.budgetExpendedPB.toLocaleString()} ៛</td>
          </tr>
          <tr>
            <td>សៀវភៅខ្ចី/ខែ</td>
            <td>${library.borrowingMonthly} ក្បាល</td>
            <td>កន្លែងលាងដៃ</td>
            <td>${waterSanitation.handwashingStations} កន្លែង</td>
            <td>សិស្សក្រីក្រ (ក្រ១+២)</td>
            <td>${(Number(healthSocial.idPoor1.total) || 0) + (Number(healthSocial.idPoor2.total) || 0)} នាក់</td>
            <td>សមតុល្យនៅសល់</td>
            <td class="bg-calc">${(Number(finance.budgetReceivedPB) - Number(finance.budgetExpendedPB)).toLocaleString()} ៛</td>
          </tr>
          <tr>
            <td>បណ្ណារក្ស</td>
            <td>${library.librarianName}</td>
            <td>មានសាប៊ូជាប្រចាំ</td>
            <td>${waterSanitation.hasSoapAvailable ? 'មាន' : 'គ្មាន'}</td>
            <td>សិស្សមានពិការភាព</td>
            <td>${(Number(healthSocial.disabledPhysical.total) || 0) + (Number(healthSocial.disabledVisual.total) || 0) + (Number(healthSocial.disabledHearing.total) || 0) + (Number(healthSocial.disabledIntellectual.total) || 0)} នាក់</td>
            <td>ចំណាយសម្ភារៈឧបទេស</td>
            <td>${finance.materialsExpended.toLocaleString()} ៛</td>
          </tr>
        </table>
      ` : ''}
    </body>
    </html>
  `;

  const blob = new Blob(['\ufeff', html], {
    type: 'application/vnd.ms-excel;charset=utf-8',
  });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `ស្ថិតិសាលា_${meta.schoolName || 'របាយការណ៍'}_${meta.academicYear.replace(/\s+/g, '')}.xls`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
