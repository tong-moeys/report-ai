export interface SchoolInfo {
  kingdomHeader: string;
  motto: string;
  districtOffice: string;
  cluster: string;
  schoolName: string;
  reportTitle: string;
  academicYear: string;
  locationType: 'urban' | 'normal' | 'remote' | 'abnormal';
  partnerNGOs: string;
  roomsTotal: number;
  roomsTeaching: number;
  roomsNonTeaching: number;
  reportDateKhmerLunar?: string;
  reportDateKhmerSolar?: string;
  autoDateEnabled?: boolean;
  customReportDate?: string;
}

export interface StudentGradeRow {
  grade: number;
  total: number;
  female: number;
  change: string;
  transferredIn: string;
  transferredOut: string;
}

export interface StudentSection {
  overall: {
    total: number;
    female: number;
    change: number;
    transferredIn: number;
    transferredOut: number;
  };
  byGrade: StudentGradeRow[];
  note: string;
  classesByGrade: {
    g1: number;
    g2: number;
    g3: number;
    g4: number;
    g5: number;
    g6: number;
    totalClasses: number;
    multigradeClasses: number;
  };
}

export interface StaffCategory {
  total: number;
  female: number;
  change: number;
  dropouts: number;
  retired: number;
}

export interface StaffSection {
  overallStaff: StaffCategory;
  singleClassTeachers: StaffCategory;
  doubleClassTeachers: StaffCategory;
  multigradeTeachers: StaffCategory;
  principalTeaching: StaffCategory;
  otherStaff: {
    total: number;
    female: number;
    description: string;
  };
}

export interface FinanceItemRow {
  id: string;
  description: string;   // បរិយាយ
  quantity: string;      // បរិមាណ
  totalAmount: string;   // ទឹកប្រាក់សរុប
  budgetSource: string;  // ប្រភពថវិកា
  deficit: string;       // កង្វះថវិកា
}

export interface FinanceSection {
  periodNote?: string;   // (ចាប់ពីខែ តុលា ដល់ ខែ កញ្ញា)
  tableRows: FinanceItemRow[];
  totalExpenditureRiel?: string;
  totalDeficitRiel?: string;
  newConstruction?: {
    buildings: number;
    rooms: number;
    costRiel: string;
    sources: string;
  };
  repair?: {
    buildings: number;
    rooms: number;
    costRiel: string;
    sources: string;
  };
  furnitureAndImprovement?: {
    costRiel: string;
    sources: string;
  };
  officeSupplies?: {
    costRiel: string;
    sources: string;
  };
}

export interface LibrarySection {
  activeRegular: number;
  suboptimal: number;
  none: number;
}

export interface AcademicGradeRow {
  grade: number; // 1 to 6
  // Col A = 5 + 6 + 7 (សិស្សដំណាច់ឆ្នាំ)
  yearEndTotal: number;
  yearEndFemale: number;
  // Col B = 5 + 6 (សិស្សចុងឆ្នាំ)
  finalStudentsTotal: number;
  finalStudentsFemale: number;
  // Col 3 (ជាប់មធ្យមភាគ)
  passedAverageTotal: number;
  passedAverageFemale: number;
  // Col 4 (ធ្វើតេស្ដជាប់)
  passedRetestTotal: number;
  passedRetestFemale: number;
  // Col 5 = 3 + 4 (ជាប់ចុងឆ្នាំ)
  finalPassedTotal: number;
  finalPassedFemale: number;
  // Col 6 (សិស្សត្រួតថ្នាក់)
  repeaterTotal: number;
  repeaterFemale: number;
  // Col 7 (សិស្សបោះបង់)
  dropoutTotal: number;
  dropoutFemale: number;
}

export interface AcademicPercentageRow {
  grade: string; // '1'..'6' or 'សរុប'
  passedBeforeTestPct: string; // Col 1
  passedRetestPct: string;     // Col 2
  finalPassedPct: string;      // Col 3 = 1 + 2
  repeaterPct: string;         // Col 4
  dropoutPct: string;          // Col 5
  notes: string;               // Col 6
}

export interface PostTestAcademicRow {
  grade: string; // 'ថ្នាក់ទី ១' ... 'ថ្នាក់ទី ៦', 'សរុប'
  sem1Total: number;          // 1=3+21 (ឆមាសទី១ សរុប)
  sem1Female: number;         // 2=4+23 (ឆមាសទី១ ស្រី)
  yearEndTotal: number;       // 3=13+17 (សិស្សចុងឆ្នាំ សរុប)
  yearEndFemale: number;      // 4=15+19 (សិស្សចុងឆ្នាំ ស្រី)
  passedAvgTotal: number;     // 5 (សិស្សជាប់មធ្យមភាគ សរុប)
  passedAvgTotalPct: string;  // 6=5x10/1
  passedAvgFemale: number;    // 7 (សិស្សជាប់មធ្យមភាគ ស្រី)
  passedAvgFemalePct: string; // 8=7x10/2
  passedRetestTotal: number;  // 9 (សិស្សធ្វើតេស្តជាប់ សរុប)
  passedRetestTotalPct: string; // 10=9x10/1
  passedRetestFemale: number; // 11 (សិស្សធ្វើតេស្តជាប់ ស្រី)
  passedRetestFemalePct: string; // 12=11x10/2
  finalPassedTotal: number;   // 13=5+9 (សរុបជាប់ចុងឆ្នាំ សរុប)
  finalPassedTotalPct: string;// 14=13x10/1
  finalPassedFemale: number;  // 15=7+11 (សរុបជាប់ចុងឆ្នាំ ស្រី)
  finalPassedFemalePct: string; // 16=15x10/2
  repeaterTotal: number;      // 17 (សិស្សត្រួតថ្នាក់ សរុប)
  repeaterTotalPct: string;   // 18=17x10/1
  repeaterFemale: number;     // 19 (សិស្សត្រួតថ្នាក់ ស្រី)
  repeaterFemalePct: string;  // 20=19x10/2
  dropoutTotal: number;       // 21 (សិស្សបោះបង់ សរុប)
  dropoutTotalPct: string;    // 22=21x10/1
  dropoutFemale: number;      // 23 (សិស្សបោះបង់ ស្រី)
  dropoutFemalePct: string;   // 24=23x10/2
}

export interface TeachingEvaluationRow {
  grade: number;
  goodTeachers: number;
  mediumTeachers: number;
  weakTeachers: number;
  khmerPct: number;
  mathPct: number;
  socialPct: number;
  sciencePct: number;
  englishPct: number;
}

export interface GirlsCounselingSection {
  rows: Array<{
    id: number;
    description: string;
    g4Total: number;
    g4Pct: string;
    g5Total: number;
    g5Pct: string;
    g6Total: number;
    g6Pct: string;
    other: string;
  }>;
  activities: string;
  challenges: string;
  requests: string;
}

export interface LifeSkillsProgramRow {
  name: string;
  schoolsCount: number;
  schoolsPct: string;
  studentsTotal: number;
  studentsTotalPct: string;
  studentsFemale: number;
  studentsFemalePct: string;
  notes: string;
}

export interface LifeSkillsSection {
  programs: LifeSkillsProgramRow[];
  activities: string;
  challenges: string;
  requests: string;
}

export interface DewormingRound {
  roundName: string;
  total: number;
  female: number;
  totalPct: string;
  femalePct: string;
  other: string;
}

export interface SanitationWaterItem {
  facility: string;
  schoolsCount: number;
  totalCount: number;
  totalPct: string;
  workingCount: number;
  workingPct: string;
  brokenCount: number;
  brokenPct: string;
}

export interface SchoolHealthSection {
  deworming: {
    rounds: DewormingRound[];
    activities: string;
    challenges: string;
    requests: string;
  };
  sanitation: {
    facilities: SanitationWaterItem[];
    activities: string;
    challenges: string;
    requests: string;
  };
  nutrition: {
    rations: {
      schoolsCount: number;
      schoolsPct: string;
      studentsTotal: number;
      studentsFemale: number;
    };
    breakfast: {
      schoolsCount: number;
      schoolsPct: string;
      studentsTotal: number;
      studentsFemale: number;
    };
    activities: string;
    challenges: string;
    requests: string;
  };
}

export interface ExtracurricularSection {
  socialWork: {
    content: string;
    result: string;
  };
  agriculture: {
    content: string;
    result: string;
  };
  studyTour: {
    content: string;
    result: string;
  };
  sports: {
    competitionsCount: number;
    schoolLevelClasses: number;
    clusterTimes: number;
    districtTimes: number;
    provinceTimes: number;
    content: string;
    result: string;
  };
  arts: {
    performancesCount: number;
    schoolLevelClasses: number;
    clusterTimes: number;
    districtTimes: number;
    provinceTimes: number;
    content: string;
    result: string;
  };
}

export interface InspectionLevelItem {
  levelName: string;
  schoolsCount: number;
  classesCount: number;
}

export interface InspectionSection {
  ministry: InspectionLevelItem;
  province: InspectionLevelItem;
  district: InspectionLevelItem;
  cluster: InspectionLevelItem;
  total: InspectionLevelItem;
  guidanceFeedback: string;
}

export interface CommunityWorkSection {
  cooperationDetails: string;
  result: string;
}

export interface VacationPrepSection {
  tasks: string[];
  scholarshipListStatus: string;
}

export interface ConclusionSection {
  generalSummary: string;
  keyAchievements: string[];
  challengesToResolve: string;
}

export interface FullSchoolReport {
  info: SchoolInfo;
  students: StudentSection;
  staff: StaffSection;
  finances: FinanceSection;
  library: LibrarySection;
  academicResults: AcademicGradeRow[];
  academicPercentages: AcademicPercentageRow[];
  postTestAcademicResults?: PostTestAcademicRow[];
  teachingEvaluation: {
    rows: TeachingEvaluationRow[];
    criteriaGood: string;
    criteriaMedium: string;
    criteriaWeak: string;
  };
  girlsCounseling: GirlsCounselingSection;
  lifeSkills: LifeSkillsSection;
  health: SchoolHealthSection;
  extracurricular: ExtracurricularSection;
  inspection: InspectionSection;
  communityWork: CommunityWorkSection;
  vacationPrep: VacationPrepSection;
  conclusion: ConclusionSection;
  aiExecutiveSummary?: string;
  aiRecommendations?: string[];
  lastUpdated?: string;
}
