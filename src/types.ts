export interface SchoolMeta {
  schoolName: string;
  clusterOrDistrict: string;
  province: string;
  academicYear: string;
  directorName: string;
  preparedByName: string;
  reportDate: string;
}

export interface GradeClassData {
  classes: number;
  total: number;
  female: number;
}

export interface Table1SchoolRooms {
  schoolName: string;
  buildings: number;
  teachingRooms: number; // ប.បរ
  otherRooms: number;    // ផ្សេងៗ
  g1: GradeClassData;
  g2: GradeClassData;
  g3: GradeClassData;
  g4: GradeClassData;
  g5: GradeClassData;
  g6: GradeClassData;
}

export interface GenderCount {
  total: number;
  female: number;
}

export interface Table1Staff {
  schoolName: string;
  directorDeputy: GenderCount;    // នាយក+រង (មិនបង្រៀន)
  officeAdmin: GenderCount;       // ទីចាត់ការ (មិនបង្រៀន)
  pureTeaching: GenderCount;      // បរ.សុទ្ធ
  multiGrade: GenderCount;        // គូប
  deputyTeaching: GenderCount;    // នាយករងបង្រៀន
  contractTeaching: GenderCount;  // កិ .ស
  twoShifts: GenderCount;         // ក្នុងនោះ ២ពេល
  assistTeaching: GenderCount;    // ជួយប.រ
}

export interface Table2RowInput {
  id: string;
  gradeLabel: string;
  // User enters or derived:
  passedAvgTotal: number;  // 3
  passedAvgFemale: number; // 5
  failedAvgTotal: number;  // 7
  failedAvgFemale: number; // 9
  failedSubTotal: number;  // 11 (មធ្យមភាគ 4.00-4.99)
  failedSubFemale: number; // 13
  dropoutTotal: number;    // 15
  dropoutFemale: number;   // 17
  // Custom override for semester 1 if not formula-based:
  customSem1Total?: number;
  customSem1Female?: number;
}

export interface Table3RowInput {
  id: string;
  gradeLabel: string;
  testedTotal: number;    // 1
  testedFemale: number;   // 2
  passedTotal: number;    // 3
  passedFemale: number;   // 5
}

export interface Table4RowInput {
  id: string;
  gradeLabel: string;
  passedAvgTotal: number;   // 5
  passedAvgFemale: number;  // 7
  passedRetestTotal: number; // 9
  passedRetestFemale: number; // 11
  repeatersTotal: number;   // 17
  repeatersFemale: number;  // 19
  dropoutsTotal: number;    // 21
  dropoutsFemale: number;   // 23
}

export type Table4Period = 'ឆមាស១' | 'ឆមាស២' | 'ដំណាច់ឆ្នាំ';

export interface Table4HeaderConfig {
  period: Table4Period;
  isSwapped: boolean;
  col1Title: string;
  col2Title: string;
}

// ==========================================
// ផ្នែក B (ស្ថិតិឯកទេស & សង្គម)
// ==========================================

// 1. បុគ្គលិក & បណ្ណាល័យ (Staff & Library)
export interface LibraryData {
  totalBooks: number;
  storyBooks: number;
  textBooks: number;
  teacherGuides: number;
  readersMonthly: GenderCount;
  borrowingMonthly: number;
  hasReadingTimetable: boolean;
  librarianName: string;
}

// 2. ទឹកស្អាត & បង្គន់អនាម័យ (Water & Sanitation)
export interface WaterSanitationData {
  waterSource: string; // e.g. អណ្តូងស្នប់ / ទឹកម៉ាស៊ីន / ធុងចម្រោះ
  hasSafeDrinkingWater: boolean;
  handwashingStations: number;
  hasSoapAvailable: boolean;
  totalLatrines: number;
  teacherLatrines: number;
  boysLatrines: number;
  girlsLatrines: number;
  functioningLatrines: number;
  wasteDisposalMethod: string; // ឡដុត / ជីកកប់ / សេវាដឹកជញ្ជូន
  hasGreenSchoolCert: boolean;
}

// 3. សុខភាព, សិស្សក្រីក្រ & ពិការ (Health, Equity & Inclusion)
export interface DewormingRound {
  target: number;
  receivedTotal: number;
  receivedFemale: number;
}

export interface HealthSocialData {
  dewormingRound1: DewormingRound;
  dewormingRound2: DewormingRound;
  idPoor1: GenderCount;
  idPoor2: GenderCount;
  scholarships: GenderCount;
  disabledPhysical: GenderCount;
  disabledVisual: GenderCount;
  disabledHearing: GenderCount;
  disabledIntellectual: GenderCount;
}

// 4. ហិរញ្ញវត្ថុ / ថវិកាដំណើរការសាលា (PB School Budget)
export interface SchoolFinanceData {
  budgetPlanPB: number;
  budgetReceivedPB: number;
  budgetExpendedPB: number;
  materialsExpended: number;
  repairsExpended: number;
  hygieneExpended: number;
}

// ==========================================
// ផ្នែក IV ដល់ VII (របាយការណ៍សង្ខេប & អធិការកិច្ច)
// ==========================================
export interface ManagementInspectionData {
  plcMeetingsCount: number;
  classObservationsCount: number;
  internalInspectionVisits: number;
  summary: string;
}

export interface CommunityData {
  sscMeetingsCount: number;
  communityContributionAmount: number;
  partnerNGOs: string;
  communitySummary: string;
}

export interface ChallengesData {
  challenges: string;
  solutions: string;
}

export interface ConclusionData {
  executiveSummary: string;
  keyAchievements: string[];
  challengesToResolve: string;
  requestsToDistrict: string;
}

export interface MasterReportNarrative {
  management: ManagementInspectionData;
  community: CommunityData;
  challenges: ChallengesData;
  conclusion: ConclusionData;
}

// ==========================================
// បញ្ជីរាយនាមបុគ្គលិក (Staff Nominal Roll - Page 7)
// ==========================================
export interface StaffMember {
  id: string;
  no: number;
  name: string;
  gender: 'ស' | 'ប' | 'ស្រី' | 'ប្រុស';
  qualification: string; // ក្របខ័ណ្ឌ ឧ. គ្រូបឋម, គ្រូមត្តេយ្យ
  educationLevel: string; // កម្រិតវប្បធម៌ ឧ. ថ្នាក់ទី១២, ស.ទុតិយភូមិ, ស.បឋមភូមិ, ស.បច្ចេកទេស
  roleOrClass: string; // មុខងារ/ថ្នាក់ទទួលបន្ទុក ឧ. នាយិកាសាលា, 1A, 5A, បណ្ណារក្ស, កសិកម្ម
  studentsTotal?: number;
  studentsFemale?: number;
  shift: string; // វេន ឧ. ព្រឹក, ល្ងាច
  phone: string; // លេខទូរស័ព្ទ
  category: 'admin' | 'teaching' | 'kindergarten';
}

// ==========================================
// ចំណាត់ថ្នាក់តាមថ្នាក់ (Class Gradebook & Ranking - Pages 12-21)
// ==========================================
export interface StudentScoreRow {
  id: string;
  no: number;
  name: string;
  gender: 'ស' | 'ប' | 'ស្រី' | 'ប្រុស';
  dob: string;
  pob: string;
  sem1Avg: number;
  sem1Rank: number;
  sem2Avg: number;
  sem2Rank: number;
  yearAvg: number;
  yearRank: number;
  gradeLetter: 'A' | 'B' | 'C' | 'D' | 'E' | 'F';
  isDropped?: boolean;
  absentPermission: number;
  absentNoPermission: number;
  absentTotal: number;
}

export interface ClassGradebook {
  gradeId: string; // '1A', '2A', '2B', '3A', '3B', '4A', '4B', '5A', '5B', '6A'
  gradeName: string; // 'ថ្នាក់ទី 1A', ...
  teacherName: string; // 'ជែម សុភក្តិ', ...
  students: StudentScoreRow[];
}

export type MainAppSection =
  | 'part_a'
  | 'part_b'
  | 'staff_nominal'
  | 'class_rankings'
  | 'master_report'
  | 'full_booklet';

