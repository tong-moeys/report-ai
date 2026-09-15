import { StudentScoreRow } from '../types';
import { computeMoEYSGradeLetter, computeMoEYSStatus } from './studentAggregator';

/**
 * Parses numeric strings safely, including Khmer digits and comma decimals
 */
function parseScore(val: any): number {
  if (val === null || val === undefined || val === '') return 0;
  if (typeof val === 'number') return isNaN(val) ? 0 : val;

  // Convert Khmer numerals to Western
  const khmerNumerals = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  let str = String(val).trim();
  khmerNumerals.forEach((kh, i) => {
    str = str.split(kh).join(String(i));
  });

  // Replace comma with dot
  str = str.replace(',', '.');
  const num = parseFloat(str);
  return isNaN(num) ? 0 : parseFloat(num.toFixed(2));
}

function cleanString(val: any): string {
  if (val === null || val === undefined) return '';
  return String(val).trim();
}

function normalizeGender(g: any): 'ស្រី' | 'ប្រុស' | 'ស' | 'ប' {
  const s = cleanString(g).toLowerCase();
  if (s === 'ស្រី' || s === 'ស' || s === 'f' || s === 'female') return 'ស្រី';
  return 'ប្រុស';
}

/**
 * Parses an array of cell values representing a student row in standard 19-column order:
 * [0] ល.រ
 * [1] នាមត្រកូល និងនាម
 * [2] ភេទ
 * [3] ថ្ងៃខែឆ្នាំកំណើត
 * [4] ថ្នាក់
 * [5] ទីកន្លែងកំណើត
 * [6] ឆមាស១: ម.ភាគខែ
 * [7] ឆមាស១: ម.ភាគប្រឡង
 * [8] ឆមាស១: ម.ភាគប្រចាំ (Auto-computed if empty: (ម.ភាគខែ + ម.ភាគប្រឡង)/2)
 * [9] ឆមាស១: និទ្ទេស (Auto-computed if empty: >=9:A, >=8:B, >=7:C, >=6:D, >=5:E, <5:F)
 * [10] ឆមាស២: ម.ភាគខែ
 * [11] ឆមាស២: ម.ភាគប្រឡង
 * [12] ឆមាស២: ម.ភាគប្រចាំ (Auto-computed if empty: (ម.ភាគខែ + ម.ភាគប្រឡង)/2)
 * [13] ឆមាស២: និទ្ទេស (Auto-computed if empty: >=9:A, >=8:B, >=7:C, >=6:D, >=5:E, <5:F)
 * [14] ប្រចាំឆ្នាំ: ប្រ.ឆមាស១ (Auto-computed if empty: sem1Avg)
 * [15] ប្រចាំឆ្នាំ: ប្រ.ឆមាស២ (Auto-computed if empty: sem2Avg)
 * [16] ប្រចាំឆ្នាំ: ម.ប្រចាំឆ្នាំ (Auto-computed if empty: (ឆមាស១ + ឆមាស២)/2)
 * [17] ប្រចាំឆ្នាំ: និទ្ទេស (Auto-computed if empty: >=9:A, >=8:B, >=7:C, >=6:D, >=5:E, <5:F)
 * [18] ស្ថានភាព (Auto-computed if empty: IF(និទ្ទេស="F","ត្រួតថ្នាក់","ឡើងថ្នាក់"))
 */
export function parseRowCellsToStudent(cells: string[], index: number): StudentScoreRow | null {
  if (!cells || cells.length < 2) return null;

  // Safe accessor helper for cells array of variable lengths
  const getCell = (i: number) => (i < cells.length ? cleanString(cells[i]) : '');

  // Skip header rows
  const first = getCell(0);
  const second = getCell(1);
  if (
    first === 'ល.រ' ||
    second === 'នាមត្រកូល និងនាម' ||
    (first === '' && (cells.includes('ម.ភាគខែ') || cells.includes('ឆមាស១') || cells.includes('និទ្ទេស')))
  ) {
    return null;
  }

  // If first is not a number and second is empty, might be empty row
  if (!first && !second) return null;

  const no = parseInt(first, 10) || index + 1;
  const name = second || `សិស្ស #${no}`;
  const gender = normalizeGender(getCell(2));
  const dob = getCell(3) || '01/01/2019';
  const gradeClass = getCell(4) || '1-A';
  const pob = getCell(5) || 'រោគ, ស្ពានស្រែង, ភ្នំស្រុក';

  // -------------------------------------------------------------------------
  // ឆមាសទី១ (Semester 1):
  // User formula: ម.ភាគខែ + ម.ភាគប្រឡង = ម.ភាគប្រចាំ(I78) , និទ្ទេស(J78)
  // =IF(I78="","",IF(I78>=9,"A",IF(I78>=8,"B",IF(I78>=7,"C",IF(I78>=6,"D",IF(I78>=5,"E","F"))))))
  // -------------------------------------------------------------------------
  const sem1MonthlyAvg = parseScore(getCell(6));
  const sem1ExamAvg = parseScore(getCell(7));
  let sem1Avg = parseScore(getCell(8));

  // If empty or 0, auto-compute from monthly and exam
  if (!sem1Avg && (sem1MonthlyAvg > 0 || sem1ExamAvg > 0)) {
    if (sem1MonthlyAvg > 0 && sem1ExamAvg > 0) {
      sem1Avg = parseFloat(((sem1MonthlyAvg + sem1ExamAvg) / 2).toFixed(2));
    } else {
      sem1Avg = sem1MonthlyAvg || sem1ExamAvg;
    }
  }

  const rawSem1Grade = getCell(9).toUpperCase();
  const sem1Grade = ['A', 'B', 'C', 'D', 'E', 'F'].includes(rawSem1Grade)
    ? (rawSem1Grade as 'A' | 'B' | 'C' | 'D' | 'E' | 'F')
    : computeMoEYSGradeLetter(sem1Avg);

  // -------------------------------------------------------------------------
  // ឆមាសទី២ (Semester 2):
  // -------------------------------------------------------------------------
  const sem2MonthlyAvg = parseScore(getCell(10));
  const sem2ExamAvg = parseScore(getCell(11));
  let sem2Avg = parseScore(getCell(12));

  // If empty or 0, auto-compute from monthly and exam
  if (!sem2Avg && (sem2MonthlyAvg > 0 || sem2ExamAvg > 0)) {
    if (sem2MonthlyAvg > 0 && sem2ExamAvg > 0) {
      sem2Avg = parseFloat(((sem2MonthlyAvg + sem2ExamAvg) / 2).toFixed(2));
    } else {
      sem2Avg = sem2MonthlyAvg || sem2ExamAvg;
    }
  }

  const rawSem2Grade = getCell(13).toUpperCase();
  const sem2Grade = ['A', 'B', 'C', 'D', 'E', 'F'].includes(rawSem2Grade)
    ? (rawSem2Grade as 'A' | 'B' | 'C' | 'D' | 'E' | 'F')
    : computeMoEYSGradeLetter(sem2Avg);

  // -------------------------------------------------------------------------
  // ប្រចាំឆ្នាំ (Annual):
  // User formula: ម.ឆមាស១ + ម.ឆមាស២ = ម.ប្រចាំឆ្នាំ
  // -------------------------------------------------------------------------
  let annualSem1 = parseScore(getCell(14));
  if (!annualSem1 && sem1Avg > 0) {
    annualSem1 = sem1Avg;
  }

  let annualSem2 = parseScore(getCell(15));
  if (!annualSem2 && sem2Avg > 0) {
    annualSem2 = sem2Avg;
  }

  let yearAvg = parseScore(getCell(16));
  if (!yearAvg) {
    const s1 = annualSem1 || sem1Avg;
    const s2 = annualSem2 || sem2Avg;
    if (s1 > 0 && s2 > 0) {
      yearAvg = parseFloat(((s1 + s2) / 2).toFixed(2));
    } else {
      yearAvg = s1 || s2 || 0;
    }
  }

  const rawYearGrade = getCell(17).toUpperCase();
  const gradeLetter = ['A', 'B', 'C', 'D', 'E', 'F'].includes(rawYearGrade)
    ? (rawYearGrade as 'A' | 'B' | 'C' | 'D' | 'E' | 'F')
    : computeMoEYSGradeLetter(yearAvg);

  // -------------------------------------------------------------------------
  // ស្ថានភាព (Promotion Status):
  // User formula: ស្ថានភាព(K78) =IF(J78="F","ត្រួតថ្នាក់","ឡើងថ្នាក់")
  // -------------------------------------------------------------------------
  const rawStatus = getCell(18);
  const isDropped = rawStatus.includes('បោះបង់');
  const status = computeMoEYSStatus(gradeLetter, isDropped, rawStatus);

  return {
    id: `imp-${Date.now()}-${no}-${Math.random().toString(36).substring(2, 6)}`,
    no,
    name,
    gender,
    dob,
    gradeClass,
    pob,
    sem1MonthlyAvg,
    sem1ExamAvg,
    sem1Avg,
    sem1Grade,
    sem2MonthlyAvg,
    sem2ExamAvg,
    sem2Avg,
    sem2Grade,
    annualSem1,
    annualSem2,
    yearAvg,
    gradeLetter,
    status,
    isDropped,
    absentPermission: 0,
    absentNoPermission: 0,
    absentTotal: 0,
  };
}

/**
 * Main parser that parses raw text (JSON, CSV, TSV) or structured JSON object
 */
export function parseImportData(rawInput: string | any): {
  success: boolean;
  students: StudentScoreRow[];
  error?: string;
  formatDetected: 'moeys_json' | 'json_array' | 'csv_tsv' | 'unknown';
} {
  try {
    let data = rawInput;

    if (typeof rawInput === 'string') {
      const trimmed = rawInput.trim();
      if (!trimmed) {
        return { success: false, students: [], error: 'សូមបញ្ចូលទិន្នន័យជា JSON, CSV ឬចម្លងចេញពី Excel', formatDetected: 'unknown' };
      }

      // Try JSON first
      if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
        try {
          data = JSON.parse(trimmed);
        } catch {
          // If JSON parse fails, fall through to TSV / CSV parser
          data = null;
        }
      }
    }

    // 1. Check for the user's specific JSON structure:
    // { "តារាងលទ្ធផលសិក្សាលម្អិត": [ { "0": [...] }, { "1": [...] }, { "2": [...] } ] }
    if (data && typeof data === 'object') {
      const mainKey = Object.keys(data).find(
        (k) =>
          k.includes('តារាងលទ្ធផលសិក្សាលម្អិត') ||
          k.includes('លទ្ធផល') ||
          k.includes('students') ||
          k.includes('results')
      );

      const arrayData = mainKey ? data[mainKey] : Array.isArray(data) ? data : null;

      if (Array.isArray(arrayData)) {
        const students: StudentScoreRow[] = [];

        for (let i = 0; i < arrayData.length; i++) {
          const item = arrayData[i];

          // Sub-case A: Array of single-key objects: { "0": [...] }, { "1": [...] }, { "2": [...] }
          if (typeof item === 'object' && item !== null && !Array.isArray(item)) {
            const innerKeys = Object.keys(item);
            if (innerKeys.length === 1 && Array.isArray(item[innerKeys[0]])) {
              const cells = item[innerKeys[0]];
              const student = parseRowCellsToStudent(cells, i);
              if (student) students.push(student);
              continue;
            }

            // Sub-case B: Standard student object with properties (name, gender, etc.)
            const name = item.name || item['នាមត្រកូល និងនាម'] || item['ឈ្មោះ'] || item['គោត្តនាម និងនាម'];
            if (name) {
              const no = Number(item.no || item['ល.រ']) || students.length + 1;
              const gender = normalizeGender(item.gender || item['ភេទ']);
              const dob = cleanString(item.dob || item['ថ្ងៃខែឆ្នាំកំណើត']);
              const gradeClass = cleanString(item.gradeClass || item['ថ្នាក់'] || item.class || '1-A');
              const pob = cleanString(item.pob || item['ទីកន្លែងកំណើត']);

              const sem1MonthlyAvg = parseScore(item.sem1MonthlyAvg || item['ម.ភាគខែ១'] || item['ម.ភាគខែ']);
              const sem1ExamAvg = parseScore(item.sem1ExamAvg || item['ម.ភាគប្រឡង១'] || item['ម.ភាគប្រឡង']);
              let sem1Avg = parseScore(item.sem1Avg || item['ម.ភាគប្រចាំ១'] || item['ម.ឆ១']);
              if (!sem1Avg && (sem1MonthlyAvg > 0 || sem1ExamAvg > 0)) {
                sem1Avg = sem1MonthlyAvg > 0 && sem1ExamAvg > 0
                  ? parseFloat(((sem1MonthlyAvg + sem1ExamAvg) / 2).toFixed(2))
                  : sem1MonthlyAvg || sem1ExamAvg;
              }
              const sem1Grade = item.sem1Grade || computeMoEYSGradeLetter(sem1Avg);

              const sem2MonthlyAvg = parseScore(item.sem2MonthlyAvg || item['ម.ភាគខែ២']);
              const sem2ExamAvg = parseScore(item.sem2ExamAvg || item['ម.ភាគប្រឡង២']);
              let sem2Avg = parseScore(item.sem2Avg || item['ម.ភាគប្រចាំ២'] || item['ម.ឆ២']);
              if (!sem2Avg && (sem2MonthlyAvg > 0 || sem2ExamAvg > 0)) {
                sem2Avg = sem2MonthlyAvg > 0 && sem2ExamAvg > 0
                  ? parseFloat(((sem2MonthlyAvg + sem2ExamAvg) / 2).toFixed(2))
                  : sem2MonthlyAvg || sem2ExamAvg;
              }
              const sem2Grade = item.sem2Grade || computeMoEYSGradeLetter(sem2Avg);

              const annualSem1 = parseScore(item.annualSem1 || item['ប្រ.ឆមាស១']) || sem1Avg;
              const annualSem2 = parseScore(item.annualSem2 || item['ប្រ.ឆមាស២']) || sem2Avg;
              let yearAvg = parseScore(item.yearAvg || item['ម.ប្រចាំឆ្នាំ'] || item['មធ្យមភាគប្រចាំឆ្នាំ']);
              if (!yearAvg) {
                const s1 = annualSem1 || sem1Avg;
                const s2 = annualSem2 || sem2Avg;
                yearAvg = s1 > 0 && s2 > 0
                  ? parseFloat(((s1 + s2) / 2).toFixed(2))
                  : s1 || s2 || 0;
              }
              const gradeLetter = (item.gradeLetter || item['និទ្ទេស'] || computeMoEYSGradeLetter(yearAvg)) as any;
              const rawStatus = cleanString(item.status || item['ស្ថានភាព']);
              const isDropped = rawStatus.includes('បោះបង់');
              const status = computeMoEYSStatus(gradeLetter, isDropped, rawStatus);

              students.push({
                id: `imp-${Date.now()}-${no}`,
                no,
                name,
                gender,
                dob,
                gradeClass,
                pob,
                sem1MonthlyAvg,
                sem1ExamAvg,
                sem1Avg,
                sem1Grade,
                sem2MonthlyAvg,
                sem2ExamAvg,
                sem2Avg,
                sem2Grade,
                annualSem1,
                annualSem2,
                yearAvg,
                gradeLetter,
                status,
                isDropped,
                absentTotal: parseScore(item.absentTotal || item['អវត្តមាន']),
                absentPermission: 0,
                absentNoPermission: 0,
              });
              continue;
            }
          }

          // Sub-case C: Direct array of arrays: [ ["76", "ខាន់ ស្រីណាត", ...] ]
          if (Array.isArray(item)) {
            const student = parseRowCellsToStudent(item, i);
            if (student) students.push(student);
          }
        }

        if (students.length > 0) {
          return {
            success: true,
            students,
            formatDetected: 'moeys_json',
          };
        }
      }
    }

    // 2. Fallback: Parse as TSV (tab-separated copied directly from Excel) or CSV
    if (typeof rawInput === 'string') {
      const lines = rawInput.split(/\r?\n/).map((l) => l.trim()).filter(Boolean);
      const students: StudentScoreRow[] = [];

      lines.forEach((line, idx) => {
        // Detect tab or comma delimiter
        const delimiter = line.includes('\t') ? '\t' : ',';
        const cells = line.split(delimiter).map((c) => c.replace(/^["']|["']$/g, '').trim());
        const student = parseRowCellsToStudent(cells, idx);
        if (student) students.push(student);
      });

      if (students.length > 0) {
        return {
          success: true,
          students,
          formatDetected: 'csv_tsv',
        };
      }
    }

    return {
      success: false,
      students: [],
      error: 'មិនអាចស្គាល់ទម្រង់ទិន្នន័យបានទេ។ សូមពិនិត្យមើលទម្រង់ JSON ឬចម្លងជួរឈរពី Excel ឱ្យបានត្រឹមត្រូវ។',
      formatDetected: 'unknown',
    };
  } catch (err: any) {
    return {
      success: false,
      students: [],
      error: `កំហុសក្នុងការអានទិន្នន័យ៖ ${err.message || err}`,
      formatDetected: 'unknown',
    };
  }
}
