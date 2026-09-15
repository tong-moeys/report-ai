import {
  SchoolMeta,
  Table1SchoolRooms,
  Table1Staff,
  Table2RowInput,
  Table3RowInput,
  Table4RowInput,
  Table4Period,
  Table4HeaderConfig,
  LibraryData,
  WaterSanitationData,
  HealthSocialData,
  SchoolFinanceData,
  MasterReportNarrative,
} from '../types';

export const initialSchoolMeta: SchoolMeta = {
  schoolName: 'បស.រោគ',
  clusterOrDistrict: 'ស្រុក/ក្រុង...',
  province: 'ខេត្ត...',
  academicYear: '២០២៣ - ២០២៤',
  directorName: 'លោកនាយកសាលា',
  preparedByName: 'អ្នករៀបចំរបាយការណ៍',
  reportDate: new Date().toISOString().split('T')[0],
};

export const initialTable1Rooms: Table1SchoolRooms = {
  schoolName: 'បស.រោគ',
  buildings: 4,
  teachingRooms: 12,
  otherRooms: 3,
  g1: { classes: 1, total: 31, female: 15 },
  g2: { classes: 2, total: 42, female: 21 },
  g3: { classes: 2, total: 40, female: 21 },
  g4: { classes: 2, total: 49, female: 21 },
  g5: { classes: 2, total: 50, female: 24 },
  g6: { classes: 1, total: 35, female: 17 },
};

export const initialTable1Staff: Table1Staff = {
  schoolName: 'បស.រោគ',
  directorDeputy: { total: 2, female: 1 },
  officeAdmin: { total: 1, female: 0 },
  pureTeaching: { total: 10, female: 9 },
  multiGrade: { total: 0, female: 0 },
  deputyTeaching: { total: 0, female: 0 },
  contractTeaching: { total: 0, female: 0 },
  twoShifts: { total: 0, female: 0 },
  assistTeaching: { total: 3, female: 2 },
};

export const initialTable2Rows: Table2RowInput[] = [
  { id: 'g1', gradeLabel: 'ថ្នាក់ទី ១', passedAvgTotal: 31, passedAvgFemale: 15, failedAvgTotal: 0, failedAvgFemale: 0, failedSubTotal: 0, failedSubFemale: 0, dropoutTotal: 0, dropoutFemale: 0 },
  { id: 'g2', gradeLabel: 'ថ្នាក់ទី ២', passedAvgTotal: 42, passedAvgFemale: 21, failedAvgTotal: 0, failedAvgFemale: 0, failedSubTotal: 0, failedSubFemale: 0, dropoutTotal: 0, dropoutFemale: 0 },
  { id: 'g3', gradeLabel: 'ថ្នាក់ទី ៣', passedAvgTotal: 40, passedAvgFemale: 21, failedAvgTotal: 0, failedAvgFemale: 0, failedSubTotal: 0, failedSubFemale: 0, dropoutTotal: 0, dropoutFemale: 0 },
  { id: 'g4', gradeLabel: 'ថ្នាក់ទី ៤', passedAvgTotal: 49, passedAvgFemale: 21, failedAvgTotal: 0, failedAvgFemale: 0, failedSubTotal: 0, failedSubFemale: 0, dropoutTotal: 0, dropoutFemale: 0 },
  { id: 'g5', gradeLabel: 'ថ្នាក់ទី ៥', passedAvgTotal: 50, passedAvgFemale: 24, failedAvgTotal: 0, failedAvgFemale: 0, failedSubTotal: 0, failedSubFemale: 0, dropoutTotal: 0, dropoutFemale: 0 },
  { id: 'g6', gradeLabel: 'ថ្នាក់ទី ៦', passedAvgTotal: 35, passedAvgFemale: 17, failedAvgTotal: 0, failedAvgFemale: 0, failedSubTotal: 0, failedSubFemale: 0, dropoutTotal: 0, dropoutFemale: 0 },
];

export const initialTable3Rows: Table3RowInput[] = [
  { id: 'g1', gradeLabel: 'ថ្នាក់ទី ១', testedTotal: 0, testedFemale: 0, passedTotal: 0, passedFemale: 0 },
  { id: 'g2', gradeLabel: 'ថ្នាក់ទី ២', testedTotal: 0, testedFemale: 0, passedTotal: 0, passedFemale: 0 },
  { id: 'g3', gradeLabel: 'ថ្នាក់ទី ៣', testedTotal: 0, testedFemale: 0, passedTotal: 0, passedFemale: 0 },
  { id: 'g4', gradeLabel: 'ថ្នាក់ទី ៤', testedTotal: 0, testedFemale: 0, passedTotal: 0, passedFemale: 0 },
  { id: 'g5', gradeLabel: 'ថ្នាក់ទី ៥', testedTotal: 0, testedFemale: 0, passedTotal: 0, passedFemale: 0 },
  { id: 'g6', gradeLabel: 'ថ្នាក់ទី ៦', testedTotal: 0, testedFemale: 0, passedTotal: 0, passedFemale: 0 },
];

export const initialTable4Rows: Table4RowInput[] = [
  { id: 'g1', gradeLabel: 'ថ្នាក់ទី ១', passedAvgTotal: 31, passedAvgFemale: 15, passedRetestTotal: 0, passedRetestFemale: 0, repeatersTotal: 0, repeatersFemale: 0, dropoutsTotal: 0, dropoutsFemale: 0 },
  { id: 'g2', gradeLabel: 'ថ្នាក់ទី ២', passedAvgTotal: 42, passedAvgFemale: 21, passedRetestTotal: 0, passedRetestFemale: 0, repeatersTotal: 0, repeatersFemale: 0, dropoutsTotal: 0, dropoutsFemale: 0 },
  { id: 'g3', gradeLabel: 'ថ្នាក់ទី ៣', passedAvgTotal: 40, passedAvgFemale: 21, passedRetestTotal: 0, passedRetestFemale: 0, repeatersTotal: 0, repeatersFemale: 0, dropoutsTotal: 0, dropoutsFemale: 0 },
  { id: 'g4', gradeLabel: 'ថ្នាក់ទី ៤', passedAvgTotal: 49, passedAvgFemale: 21, passedRetestTotal: 0, passedRetestFemale: 0, repeatersTotal: 0, repeatersFemale: 0, dropoutsTotal: 0, dropoutsFemale: 0 },
  { id: 'g5', gradeLabel: 'ថ្នាក់ទី ៥', passedAvgTotal: 50, passedAvgFemale: 24, passedRetestTotal: 0, passedRetestFemale: 0, repeatersTotal: 0, repeatersFemale: 0, dropoutsTotal: 0, dropoutsFemale: 0 },
  { id: 'g6', gradeLabel: 'ថ្នាក់ទី ៦', passedAvgTotal: 35, passedAvgFemale: 17, passedRetestTotal: 0, passedRetestFemale: 0, repeatersTotal: 0, repeatersFemale: 0, dropoutsTotal: 0, dropoutsFemale: 0 },
];

export const initialTable4HeaderConfig: Table4HeaderConfig = {
  period: 'ដំណាច់ឆ្នាំ',
  isSwapped: false,
  col1Title: 'ដំណាច់ឆ្នាំ',
  col2Title: 'ចុងឆ្នាំ',
};

export function getTable4Titles(period: Table4Period, isSwapped: boolean) {
  const selectCol = period; // 'ឆមាស១' | 'ឆមាស២' | 'ដំណាច់ឆ្នាំ'
  let nextCol = 'ចុងឆ្នាំ';
  if (period === 'ឆមាស១') {
    nextCol = 'បវេសនកាស';
  } else if (period === 'ឆមាស២') {
    nextCol = 'ឆមាស១';
  } else if (period === 'ដំណាច់ឆ្នាំ') {
    nextCol = 'ចុងឆ្នាំ';
  }

  if (!isSwapped) {
    return {
      col1: selectCol,
      col2: nextCol,
    };
  } else {
    return {
      col1: nextCol,
      col2: selectCol,
    };
  }
}

export function formatPct(numerator: number, denominator: number): string {
  if (!denominator || denominator <= 0) return '0%';
  const val = (numerator * 100) / denominator;
  if (isNaN(val) || !isFinite(val)) return '0%';
  // If integer, return without decimals; else 1 or 2 decimal places
  const formatted = val % 1 === 0 ? val.toString() : val.toFixed(1).replace(/\.0$/, '');
  return `${formatted}%`;
}

// ផ្នែក B (ស្ថិតិឯកទេស & សង្គម) - Initial Data
export const initialLibraryData: LibraryData = {
  totalBooks: 1450,
  storyBooks: 680,
  textBooks: 520,
  teacherGuides: 250,
  readersMonthly: { total: 185, female: 98 },
  borrowingMonthly: 120,
  hasReadingTimetable: true,
  librarianName: 'អ្នកគ្រូ បណ្ណារក្ស',
};

export const initialWaterSanitationData: WaterSanitationData = {
  waterSource: 'អណ្តូងស្នប់ និងធុងចម្រោះទឹកស្អាត',
  hasSafeDrinkingWater: true,
  handwashingStations: 6,
  hasSoapAvailable: true,
  totalLatrines: 6,
  teacherLatrines: 1,
  boysLatrines: 2,
  girlsLatrines: 3,
  functioningLatrines: 6,
  wasteDisposalMethod: 'ឡដុតសំរាម និងរណ្តៅជីកំប៉ុស',
  hasGreenSchoolCert: true,
};

export const initialHealthSocialData: HealthSocialData = {
  dewormingRound1: { target: 247, receivedTotal: 242, receivedFemale: 118 },
  dewormingRound2: { target: 247, receivedTotal: 245, receivedFemale: 119 },
  idPoor1: { total: 18, female: 9 },
  idPoor2: { total: 24, female: 13 },
  scholarships: { total: 15, female: 8 },
  disabledPhysical: { total: 1, female: 0 },
  disabledVisual: { total: 0, female: 0 },
  disabledHearing: { total: 1, female: 1 },
  disabledIntellectual: { total: 0, female: 0 },
};

export const initialSchoolFinanceData: SchoolFinanceData = {
  budgetPlanPB: 24500000,     // ២៤.៥ លានរៀល
  budgetReceivedPB: 24500000,
  budgetExpendedPB: 23800000,
  materialsExpended: 9500000,
  repairsExpended: 8200000,
  hygieneExpended: 6100000,
};

export const initialMasterReportNarrative: MasterReportNarrative = {
  management: {
    plcMeetingsCount: 18,
    classObservationsCount: 24,
    internalInspectionVisits: 6,
    summary: 'គណៈគ្រប់គ្រងសាលាបានរៀបចំកិច្ចប្រជុំបច្ចេកទេស (PLC) រៀងរាល់ ២សប្តាហ៍ម្តង ដើម្បីដោះស្រាយបញ្ហាគរុកោសល្យ និងបានចុះសង្កេតការបង្រៀនគ្រូគ្រប់រូបយ៉ាងតិច ២ដងក្នុងមួយឆមាស។',
  },
  community: {
    sscMeetingsCount: 4,
    communityContributionAmount: 3200000,
    partnerNGOs: 'អង្គការទស្សនៈពិភពលោក (WVSI), អង្គការសាលារៀនបៃតង',
    communitySummary: 'គណៈកម្មការទ្រទ្រង់សាលា (SSC) និងអាជ្ញាធរឃុំបានចូលរួមឧបត្ថម្ភសម្ភារៈ និងថវិកាជួសជុលរបងសាលា ព្រមទាំងចូលរួមយុទ្ធនាការកុមារគ្រប់រូបត្រូវទទួលបានការអប់រំ។',
  },
  challenges: {
    challenges: 'សិស្សបោះបង់ការសិក្សាចំនួន ៤នាក់បណ្តាលមកពីការចំណាកស្រុករបស់អាណាព្យាបាល, ត្រូវការបន្ទប់អនាម័យបន្ថែមសម្រាប់សិស្សស្រី, និងសម្ភារៈឧបទេសបង្រៀនវិទ្យាសាស្ត្រនៅខ្វះខាត។',
    solutions: 'ចុះជួបអប់រំដល់ខ្នងផ្ទះអាណាព្យាបាលសិស្សប្រឈមការបោះបង់, រៀបចំផែនការស្នើសុំបន្ទប់ទឹកតាមរយៈគម្រោងអភិវឌ្ឍន៍ឃុំ, និងផលិតសម្ភារៈឧបទេសពីវត្ថុធាតុក្នុងមូលដ្ឋាន។',
  },
  conclusion: {
    executiveSummary: 'ឆ្លងកាត់ការអនុវត្តផែនការប្រតិបត្តិប្រចាំឆ្នាំសិក្សា សាលាសម្រេចបានលទ្ធផលល្អប្រសើរលើការងារគ្រប់គ្រង បង្រៀន និងរៀន ស្របតាមស្តង់ដាសាលារៀនកុមារមេត្រី និងគោលនយោបាយកំណែទម្រង់វិស័យអប់រំ។ អត្រាឡើងថ្នាក់រួមសម្រេចបានខ្ពស់ សិស្សានុសិស្សទទួលបានការថែទាំសុខភាព និងបរិយាបន្នពេញលេញ។',
    keyAchievements: [
      'អត្រាសិស្សប្រឡងជាប់ឡើងថ្នាក់ចុងឆ្នាំសម្រេចបានលើសពី ៩៦%',
      'ការអនុវត្តកម្មវិធីកែលម្អការអាន និងគណិតវិទ្យាថ្នាក់ដំបូងទទួលបានលទ្ធផលគាប់ប្រសើរ',
      'ការអនុវត្តកម្មវិធីសុខភាពសិក្សា និងការទម្លាក់ព្រូនបានសម្រេចជាង ៩៨%',
      'កិច្ចសហការរវាងសាលា សហគមន៍ និងអាជ្ញាធរមូលដ្ឋានមានភាពស្អិតរមួត និងប្រកបដោយប្រសិទ្ធភាព',
    ],
    challengesToResolve: 'បន្តកាត់បន្ថយអត្រាសិស្សបោះបង់ការសិក្សាដោយសារចំណាកស្រុក និងពង្រឹងការអានសៀវភៅនៅបណ្ណាល័យបន្ថែមទៀត។',
    requestsToDistrict: 'ស្នើសុំការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុក/ខេត្ត ជួយបណ្តុះបណ្តាលវិធីសាស្ត្របង្រៀនគន្លឹះថ្មីៗដល់គ្រូបឋមសិក្សា និងជួយសម្របសម្រួលថវិកាកែលម្អហេដ្ឋារចនាសម្ព័ន្ធ។',
  },
};

