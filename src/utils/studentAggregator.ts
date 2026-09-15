import {
  StudentScoreRow,
  Table1SchoolRooms,
  Table2RowInput,
  Table3RowInput,
  Table4RowInput,
  ClassGradebook,
} from '../types';

export interface AggregationSummary {
  totalEnrolled: number;
  totalEnrolledFemale: number;
  totalTested: number;
  totalTestedFemale: number;
  totalPassed: number;
  totalPassedFemale: number;
  totalFailed: number;
  totalFailedFemale: number;
  totalDropouts: number;
  totalDropoutsFemale: number;
  totalRepeaters: number;
  totalRepeatersFemale: number;
  passRate: number;
  femalePassRate: number;
  dropoutRate: number;
  classCount: number;
  classesList: string[];
}

/**
 * Normalizes grade class strings like "1-A", "1A", "ថ្នាក់ទី 1A", "ថ្នាក់ទី១" to grade number (1-6)
 */
export function extractGradeLevel(gradeClass?: string): number {
  if (!gradeClass) return 1;
  const cleaned = gradeClass.trim();
  // Check for Khmer digits
  if (cleaned.includes('១') || cleaned.startsWith('1')) return 1;
  if (cleaned.includes('២') || cleaned.startsWith('2')) return 2;
  if (cleaned.includes('៣') || cleaned.startsWith('3')) return 3;
  if (cleaned.includes('៤') || cleaned.startsWith('4')) return 4;
  if (cleaned.includes('៥') || cleaned.startsWith('5')) return 5;
  if (cleaned.includes('៦') || cleaned.startsWith('6')) return 6;

  // Search any digit 1-6
  const match = cleaned.match(/[1-6]/);
  return match ? parseInt(match[0], 10) : 1;
}

/**
 * Normalizes class ID like "1-A" -> "1A"
 */
export function normalizeClassId(gradeClass?: string): string {
  if (!gradeClass) return '1A';
  return gradeClass.replace(/\s+/g, '').replace('-', '').toUpperCase();
}

/**
 * Computes letter grade according to the exact MoEYS formula specified by the user:
 * =IF(I78="","",IF(I78>=9,"A",IF(I78>=8,"B",IF(I78>=7,"C",IF(I78>=6,"D",IF(I78>=5,"E","F"))))))
 */
export function computeMoEYSGradeLetter(avg: number | undefined | null): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' {
  if (avg === undefined || avg === null || isNaN(avg) || avg <= 0) return 'F';
  if (avg >= 9.0) return 'A'; // ល្អប្រសើរ
  if (avg >= 8.0) return 'B'; // ល្អណាស់
  if (avg >= 7.0) return 'C'; // ល្អ
  if (avg >= 6.0) return 'D'; // ល្អបង្គួរ
  if (avg >= 5.0) return 'E'; // មធ្យម
  return 'F';                 // ធ្លាក់ / ត្រួតថ្នាក់
}

/**
 * Computes promotion status according to the exact MoEYS formula:
 * =IF(J78="F","ត្រួតថ្នាក់","ឡើងថ្នាក់")
 */
export function computeMoEYSStatus(
  gradeLetter: string | undefined | null,
  isDropped?: boolean,
  rawStatus?: string
): 'ឡើងថ្នាក់' | 'ត្រួតថ្នាក់' | 'បោះបង់' {
  if (isDropped || (rawStatus && rawStatus.includes('បោះបង់'))) {
    return 'បោះបង់';
  }
  return gradeLetter === 'F' ? 'ត្រួតថ្នាក់' : 'ឡើងថ្នាក់';
}

/**
 * Recalculates all dependent formula fields for a student row according to MoEYS standards:
 * - Sem 1: ម.ភាគប្រចាំ = (ម.ភាគខែ + ម.ភាគប្រឡង) / 2
 * - Sem 1 Grade (J): =IF(I="","",IF(I>=9,"A",IF(I>=8,"B",IF(I>=7,"C",IF(I>=6,"D",IF(I>=5,"E","F"))))))
 * - Sem 2: ម.ភាគប្រចាំ = (ម.ភាគខែ + ម.ភាគប្រឡង) / 2
 * - Sem 2 Grade: Same formula
 * - Annual: ម.ប្រចាំឆ្នាំ = (ម.ឆ១ + ម.ឆ២) / 2
 * - Annual Grade: Same formula
 * - Status (K): =IF(J="F","ត្រួតថ្នាក់","ឡើងថ្នាក់")
 */
export function recalculateStudentFormulas(student: StudentScoreRow): StudentScoreRow {
  const m1 = typeof student.sem1MonthlyAvg === 'number' ? student.sem1MonthlyAvg : 0;
  const e1 = typeof student.sem1ExamAvg === 'number' ? student.sem1ExamAvg : 0;
  let sem1Avg = student.sem1Avg;

  // If semester 1 average is missing or 0, calculate from monthly and exam
  if (!sem1Avg && (m1 > 0 || e1 > 0)) {
    sem1Avg = m1 > 0 && e1 > 0 ? parseFloat(((m1 + e1) / 2).toFixed(2)) : m1 || e1;
  }
  const sem1Grade = computeMoEYSGradeLetter(sem1Avg);

  const m2 = typeof student.sem2MonthlyAvg === 'number' ? student.sem2MonthlyAvg : 0;
  const e2 = typeof student.sem2ExamAvg === 'number' ? student.sem2ExamAvg : 0;
  let sem2Avg = student.sem2Avg;

  // If semester 2 average is missing or 0, calculate from monthly and exam
  if (!sem2Avg && (m2 > 0 || e2 > 0)) {
    sem2Avg = m2 > 0 && e2 > 0 ? parseFloat(((m2 + e2) / 2).toFixed(2)) : m2 || e2;
  }
  const sem2Grade = computeMoEYSGradeLetter(sem2Avg);

  // Annual
  let annualSem1 = student.annualSem1;
  if (!annualSem1 && sem1Avg > 0) annualSem1 = sem1Avg;

  let annualSem2 = student.annualSem2;
  if (!annualSem2 && sem2Avg > 0) annualSem2 = sem2Avg;

  let yearAvg = student.yearAvg;
  if (!yearAvg) {
    const s1 = annualSem1 || sem1Avg || 0;
    const s2 = annualSem2 || sem2Avg || 0;
    if (s1 > 0 && s2 > 0) {
      yearAvg = parseFloat(((s1 + s2) / 2).toFixed(2));
    } else {
      yearAvg = s1 || s2 || 0;
    }
  }

  const gradeLetter = computeMoEYSGradeLetter(yearAvg);
  const isDropped = student.isDropped || (student.status && student.status.includes('បោះបង់'));
  const status = computeMoEYSStatus(gradeLetter, isDropped, student.status);

  return {
    ...student,
    sem1Avg,
    sem1Grade,
    sem2Avg,
    sem2Grade,
    annualSem1,
    annualSem2,
    yearAvg,
    gradeLetter,
    status,
    isDropped: Boolean(isDropped),
  };
}

/**
 * Re-ranks students within a class by yearAvg descending
 */
export function rankStudentsInClass(students: StudentScoreRow[]): StudentScoreRow[] {
  const sorted = [...students].sort((a, b) => {
    // Non-dropouts first, sorted by score descending
    if (a.isDropped && !b.isDropped) return 1;
    if (!a.isDropped && b.isDropped) return -1;
    return (b.yearAvg || 0) - (a.yearAvg || 0);
  });

  return sorted.map((st, idx) => {
    const grade = computeMoEYSGradeLetter(st.yearAvg || 0);
    return {
      ...st,
      no: idx + 1,
      yearRank: st.isDropped ? 0 : idx + 1,
      gradeLetter: grade,
      status: computeMoEYSStatus(grade, st.isDropped, st.status),
    };
  });
}

/**
 * Aggregates detailed student scores into Table 1, Table 2, Table 3, Table 4, and Class Gradebooks
 */
export function aggregateStudentsToSchoolData(
  students: StudentScoreRow[],
  currentT1: Table1SchoolRooms,
  currentT2: Table2RowInput[],
  currentT3: Table3RowInput[],
  currentT4: Table4RowInput[],
  currentGradebooks: ClassGradebook[]
): {
  updatedT1Rooms: Table1SchoolRooms;
  updatedT2Rows: Table2RowInput[];
  updatedT3Rows: Table3RowInput[];
  updatedT4Rows: Table4RowInput[];
  updatedGradebooks: ClassGradebook[];
  summary: AggregationSummary;
} {
  // If no students provided, return existing state with zero summary
  if (!students || students.length === 0) {
    return {
      updatedT1Rooms: currentT1,
      updatedT2Rows: currentT2,
      updatedT3Rows: currentT3,
      updatedT4Rows: currentT4,
      updatedGradebooks: currentGradebooks,
      summary: {
        totalEnrolled: 0,
        totalEnrolledFemale: 0,
        totalTested: 0,
        totalTestedFemale: 0,
        totalPassed: 0,
        totalPassedFemale: 0,
        totalFailed: 0,
        totalFailedFemale: 0,
        totalDropouts: 0,
        totalDropoutsFemale: 0,
        totalRepeaters: 0,
        totalRepeatersFemale: 0,
        passRate: 0,
        femalePassRate: 0,
        dropoutRate: 0,
        classCount: 0,
        classesList: [],
      },
    };
  }

  // 1. Group students by grade 1 to 6
  const gradeStudentsMap: Record<number, StudentScoreRow[]> = {
    1: [],
    2: [],
    3: [],
    4: [],
    5: [],
    6: [],
  };

  // Group by exact class ID (e.g. "1A", "1B")
  const classStudentsMap: Record<string, StudentScoreRow[]> = {};

  students.forEach((st) => {
    const gLevel = extractGradeLevel(st.gradeClass);
    const validLevel = gLevel >= 1 && gLevel <= 6 ? gLevel : 1;
    gradeStudentsMap[validLevel].push(st);

    const cId = normalizeClassId(st.gradeClass);
    if (!classStudentsMap[cId]) {
      classStudentsMap[cId] = [];
    }
    classStudentsMap[cId].push(st);
  });

  const isFemale = (g: string) => g === 'ស្រី' || g === 'ស' || g === 'F';

  // 2. Build updated Table 1 School Rooms (Enrolled classes and counts per grade)
  const computeGrade1Data = (level: number) => {
    const list = gradeStudentsMap[level];
    const uniqueClasses = new Set(list.map((s) => normalizeClassId(s.gradeClass)));
    return {
      classes: Math.max(uniqueClasses.size, list.length > 0 ? 1 : 0),
      total: list.length,
      female: list.filter((s) => isFemale(s.gender)).length,
    };
  };

  const updatedT1Rooms: Table1SchoolRooms = {
    ...currentT1,
    g1: computeGrade1Data(1),
    g2: computeGrade1Data(2),
    g3: computeGrade1Data(3),
    g4: computeGrade1Data(4),
    g5: computeGrade1Data(5),
    g6: computeGrade1Data(6),
  };

  // 3. Build updated Table 2 (Academic results per grade: tested, passed, failed, sub-failed, dropouts)
  const updatedT2Rows: Table2RowInput[] = [1, 2, 3, 4, 5, 6].map((level) => {
    const list = gradeStudentsMap[level];
    const existing = currentT2.find((r) => r.id === `g${level}`) || {
      id: `g${level}`,
      gradeLabel: `ថ្នាក់ទី ${level}`,
      passedAvgTotal: 0,
      passedAvgFemale: 0,
      failedAvgTotal: 0,
      failedAvgFemale: 0,
      failedSubTotal: 0,
      failedSubFemale: 0,
      dropoutTotal: 0,
      dropoutFemale: 0,
    };

    if (list.length === 0) {
      return existing;
    }

    const dropouts = list.filter((s) => s.isDropped || s.status === 'បោះបង់');
    const tested = list.filter((s) => !s.isDropped && s.status !== 'បោះបង់');
    const passed = tested.filter((s) => (s.yearAvg || 0) >= 5.0);
    const failed = tested.filter((s) => (s.yearAvg || 0) < 5.0);
    const failedSub = failed.filter((s) => (s.yearAvg || 0) >= 4.0 && (s.yearAvg || 0) < 5.0);

    return {
      id: `g${level}`,
      gradeLabel: `ថ្នាក់ទី ${['១', '២', '៣', '៤', '៥', '៦'][level - 1]}`,
      passedAvgTotal: passed.length,
      passedAvgFemale: passed.filter((s) => isFemale(s.gender)).length,
      failedAvgTotal: failed.length,
      failedAvgFemale: failed.filter((s) => isFemale(s.gender)).length,
      failedSubTotal: failedSub.length,
      failedSubFemale: failedSub.filter((s) => isFemale(s.gender)).length,
      dropoutTotal: dropouts.length,
      dropoutFemale: dropouts.filter((s) => isFemale(s.gender)).length,
      customSem1Total: list.length,
      customSem1Female: list.filter((s) => isFemale(s.gender)).length,
    };
  });

  // 4. Build updated Table 3 (Failed students / retesting stats)
  const updatedT3Rows: Table3RowInput[] = [1, 2, 3, 4, 5, 6].map((level) => {
    const list = gradeStudentsMap[level];
    const existing = currentT3.find((r) => r.id === `g${level}`) || {
      id: `g${level}`,
      gradeLabel: `ថ្នាក់ទី ${level}`,
      testedTotal: 0,
      testedFemale: 0,
      passedTotal: 0,
      passedFemale: 0,
    };

    if (list.length === 0) {
      return existing;
    }

    const failed = list.filter((s) => !s.isDropped && (s.yearAvg || 0) < 5.0);
    const passedRetest = failed.filter((s) => s.status === 'ឡើងថ្នាក់');

    return {
      id: `g${level}`,
      gradeLabel: `ថ្នាក់ទី ${['១', '២', '៣', '៤', '៥', '៦'][level - 1]}`,
      testedTotal: failed.length,
      testedFemale: failed.filter((s) => isFemale(s.gender)).length,
      passedTotal: passedRetest.length,
      passedFemale: passedRetest.filter((s) => isFemale(s.gender)).length,
    };
  });

  // 5. Build updated Table 4 (Year-end results: passed, repeaters, dropouts)
  const updatedT4Rows: Table4RowInput[] = [1, 2, 3, 4, 5, 6].map((level) => {
    const list = gradeStudentsMap[level];
    const existing = currentT4.find((r) => r.id === `g${level}`) || {
      id: `g${level}`,
      gradeLabel: `ថ្នាក់ទី ${level}`,
      passedAvgTotal: 0,
      passedAvgFemale: 0,
      passedRetestTotal: 0,
      passedRetestFemale: 0,
      repeatersTotal: 0,
      repeatersFemale: 0,
      dropoutsTotal: 0,
      dropoutsFemale: 0,
    };

    if (list.length === 0) {
      return existing;
    }

    const dropouts = list.filter((s) => s.isDropped || s.status === 'បោះបង់');
    const repeaters = list.filter((s) => !s.isDropped && (s.status === 'ត្រួតថ្នាក់' || (s.yearAvg || 0) < 5.0));
    const passed = list.filter((s) => !s.isDropped && (s.status === 'ឡើងថ្នាក់' || (s.yearAvg || 0) >= 5.0));

    return {
      id: `g${level}`,
      gradeLabel: `ថ្នាក់ទី ${['១', '២', '៣', '៤', '៥', '៦'][level - 1]}`,
      passedAvgTotal: passed.length,
      passedAvgFemale: passed.filter((s) => isFemale(s.gender)).length,
      passedRetestTotal: 0,
      passedRetestFemale: 0,
      repeatersTotal: repeaters.length,
      repeatersFemale: repeaters.filter((s) => isFemale(s.gender)).length,
      dropoutsTotal: dropouts.length,
      dropoutsFemale: dropouts.filter((s) => isFemale(s.gender)).length,
    };
  });

  // 6. Build updated Class Gradebooks (10 classes booklet)
  // Preserve existing teachers or defaults
  const teacherMap: Record<string, string> = {
    '1A': 'ជែម សុភក្តិ',
    '2A': 'ចោម ស្រីពេជ្រ',
    '2B': 'លេង ចាន់ណារ',
    '3A': 'ប៊ូ ពិសី',
    '3B': 'អេង ផល្លាន',
    '4A': 'ខេន សាវ៉ា',
    '4B': 'អៀន សុខឿប',
    '5A': 'ឡាង ម៉ារ៉ាដ្យែ',
    '5B': 'យ៉ែម សម្បូរស្បៃ',
    '6A': 'ឈួន សេរីរ៉ុម',
  };

  currentGradebooks.forEach((gb) => {
    teacherMap[gb.gradeId] = gb.teacherName;
  });

  // Build list of all active class IDs
  const allClassIds = Array.from(
    new Set([
      ...Object.keys(classStudentsMap),
      ...currentGradebooks.map((g) => g.gradeId),
    ])
  ).sort();

  const updatedGradebooks: ClassGradebook[] = allClassIds.map((cId) => {
    const rawClassStudents = classStudentsMap[cId];
    if (rawClassStudents && rawClassStudents.length > 0) {
      const ranked = rankStudentsInClass(rawClassStudents);
      return {
        gradeId: cId,
        gradeName: `ថ្នាក់ទី ${cId}`,
        teacherName: teacherMap[cId] || 'គ្រូប្រចាំថ្នាក់',
        students: ranked,
      };
    }

    const existingBook = currentGradebooks.find((g) => g.gradeId === cId);
    if (existingBook) {
      return existingBook;
    }

    return {
      gradeId: cId,
      gradeName: `ថ្នាក់ទី ${cId}`,
      teacherName: teacherMap[cId] || 'គ្រូប្រចាំថ្នាក់',
      students: [],
    };
  });

  // 7. Calculate overall school summary stats
  const totalEnrolled = students.length;
  const totalEnrolledFemale = students.filter((s) => isFemale(s.gender)).length;
  const dropoutsAll = students.filter((s) => s.isDropped || s.status === 'បោះបង់');
  const totalDropouts = dropoutsAll.length;
  const totalDropoutsFemale = dropoutsAll.filter((s) => isFemale(s.gender)).length;

  const testedAll = students.filter((s) => !s.isDropped && s.status !== 'បោះបង់');
  const totalTested = testedAll.length;
  const totalTestedFemale = testedAll.filter((s) => isFemale(s.gender)).length;

  const passedAll = testedAll.filter((s) => (s.yearAvg || 0) >= 5.0);
  const totalPassed = passedAll.length;
  const totalPassedFemale = passedAll.filter((s) => isFemale(s.gender)).length;

  const failedAll = testedAll.filter((s) => (s.yearAvg || 0) < 5.0);
  const totalFailed = failedAll.length;
  const totalFailedFemale = failedAll.filter((s) => isFemale(s.gender)).length;

  const repeatersAll = students.filter((s) => !s.isDropped && (s.status === 'ត្រួតថ្នាក់' || (s.yearAvg || 0) < 5.0));
  const totalRepeaters = repeatersAll.length;
  const totalRepeatersFemale = repeatersAll.filter((s) => isFemale(s.gender)).length;

  const passRate = totalEnrolled > 0 ? parseFloat(((totalPassed / totalEnrolled) * 100).toFixed(1)) : 0;
  const femalePassRate = totalEnrolledFemale > 0 ? parseFloat(((totalPassedFemale / totalEnrolledFemale) * 100).toFixed(1)) : 0;
  const dropoutRate = totalEnrolled > 0 ? parseFloat(((totalDropouts / totalEnrolled) * 100).toFixed(1)) : 0;

  const classesList = Object.keys(classStudentsMap).filter((k) => classStudentsMap[k].length > 0);

  return {
    updatedT1Rooms,
    updatedT2Rows,
    updatedT3Rows,
    updatedT4Rows,
    updatedGradebooks,
    summary: {
      totalEnrolled,
      totalEnrolledFemale,
      totalTested,
      totalTestedFemale,
      totalPassed,
      totalPassedFemale,
      totalFailed,
      totalFailedFemale,
      totalDropouts,
      totalDropoutsFemale,
      totalRepeaters,
      totalRepeatersFemale,
      passRate,
      femalePassRate,
      dropoutRate,
      classCount: classesList.length,
      classesList,
    },
  };
}
