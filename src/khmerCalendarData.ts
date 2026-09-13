// Khmer Lunar & Solar Calendar Helper & Official Holidays for Cambodia / MoEYS
// Includes national public holidays, MoEYS school calendar milestones, lunar day calculation & event notes

export interface KhmerHoliday {
  id: string;
  nameKhmer: string;
  nameEn?: string;
  date: string; // YYYY-MM-DD
  daysCount: number;
  type: 'public_holiday' | 'school_event' | 'buddhist_event' | 'exam_milestone';
  description?: string;
  isDayOff: boolean;
}

export interface SchoolCalendarEvent {
  id: string;
  title: string;
  date: string; // YYYY-MM-DD
  category: 'holiday' | 'exam' | 'meeting' | 'sports' | 'general';
  notes?: string;
  isImportant?: boolean;
}

// Official Cambodian Public Holidays & School Calendar 2025-2026 (Including MoEYS milestones)
export const OFFICIAL_KHMER_HOLIDAYS_2026: KhmerHoliday[] = [
  {
    id: 'ny-2026',
    nameKhmer: 'ទិវាចូលឆ្នាំសកល (International New Year)',
    date: '2026-01-01',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ទិវាឈប់សម្រាកចូលឆ្នាំសកលទូទាំងប្រទេស',
    isDayOff: true,
  },
  {
    id: 'victory-day-2026',
    nameKhmer: 'ទិវាជ័យជម្នះលើរបបប្រល័យពូជសាសន៍',
    date: '2026-01-07',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ខួបអនុស្សាវរីយ៍ទិវាជ័យជម្នះ ៧ មករា',
    isDayOff: true,
  },
  {
    id: 'meak-bochea-2026',
    nameKhmer: 'ពិធីបុណ្យមាឃបូជា (១៥កើត ខែមាឃ)',
    date: '2026-02-02',
    daysCount: 1,
    type: 'buddhist_event',
    description: 'ពិធីបុណ្យសាសនាព្រះពុទ្ធដ៏សំខាន់ (មាឃបូជា)',
    isDayOff: true,
  },
  {
    id: 'sem1-exam-2026',
    nameKhmer: 'ការប្រឡងឆមាសទី១ (Semester 1 Examination)',
    date: '2026-02-23',
    daysCount: 5,
    type: 'exam_milestone',
    description: 'ការប្រឡងបញ្ចប់ឆមាសទី១ សម្រាប់កម្រិតបឋមសិក្សា',
    isDayOff: false,
  },
  {
    id: 'women-day-2026',
    nameKhmer: 'ទិវាអន្តរជាតិនារី ៨ មីនា',
    date: '2026-03-08',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ទិវាសិទ្ធិនារីអន្តរជាតិ',
    isDayOff: true,
  },
  {
    id: 'sem1-break-2026',
    nameKhmer: 'វិស្សមកាលតូច (Short Vacation / Semester Break)',
    date: '2026-03-16',
    daysCount: 14,
    type: 'school_event',
    description: 'ការឈប់សម្រាកវិស្សមកាលតូចបន្ទាប់ពីបញ្ចប់ឆមាសទី១',
    isDayOff: true,
  },
  {
    id: 'khmer-new-year-2026',
    nameKhmer: 'ពិធីបុណ្យចូលឆ្នាំថ្មី ប្រពៃណីជាតិខ្មែរ (ឆ្នាំម្សាញ់)',
    date: '2026-04-14',
    daysCount: 4,
    type: 'public_holiday',
    description: 'មហាសង្ក្រាន្តឆ្នាំម្សាញ់ សប្តស័ក ព.ស.២៥៦៩-២៥៧០',
    isDayOff: true,
  },
  {
    id: 'visak-bochea-2026',
    nameKhmer: 'ពិធីបុណ្យវិសាខបូជា (១៥កើត ខែពិសាខ)',
    date: '2026-05-01',
    daysCount: 1,
    type: 'buddhist_event',
    description: 'ថ្ងៃប្រសូត ត្រាស់ដឹង និងបរិនិព្វាននៃព្រះសម្មាសម្ពុទ្ធ',
    isDayOff: true,
  },
  {
    id: 'labor-day-2026',
    nameKhmer: 'ទិវាពលកម្មអន្តរជាតិ (International Labor Day)',
    date: '2026-05-01',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ទិវាពលកម្មអន្តរជាតិ ១ ឧសភា',
    isDayOff: true,
  },
  {
    id: 'royal-ploughing-2026',
    nameKhmer: 'ព្រះរាជពិធីច្រត់ព្រះនង្គ័ល (Royal Ploughing Ceremony)',
    date: '2026-05-05',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ពិធីច្រត់ព្រះនង្គ័លប្រពៃណីជាតិ ៤រោច ខែពិសាខ',
    isDayOff: true,
  },
  {
    id: 'king-birthday-2026',
    nameKhmer: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះមហាក្សត្រ',
    date: '2026-05-14',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម ព្រះករុណា ព្រះបាទសម្ដេច ព្រះបរមនាថ នរោត្តម សីហមុនី',
    isDayOff: true,
  },
  {
    id: 'children-day-2026',
    nameKhmer: 'ទិវាកុមារអន្តរជាតិ ១ មិថុនា',
    date: '2026-06-01',
    daysCount: 1,
    type: 'school_event',
    description: 'ទិវាសិទ្ធិកុមារអន្តរជាតិ និងកុមារកម្ពុជា',
    isDayOff: false,
  },
  {
    id: 'queen-mother-birthday-2026',
    nameKhmer: 'ព្រះរាជពិធីបុណ្យចម្រើនព្រះជន្ម សម្តេចព្រះមហាក្សត្រី នរោត្តម មុនិនាថ សីហនុ',
    date: '2026-06-18',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ព្រះវររាជមាតាជាតិខ្មែរ',
    isDayOff: true,
  },
  {
    id: 'sem2-exam-2026',
    nameKhmer: 'ការប្រឡងឆមាសទី២ & ដំណាច់ឆ្នាំសិក្សា',
    date: '2026-07-20',
    daysCount: 5,
    type: 'exam_milestone',
    description: 'ការប្រឡងបញ្ចប់ឆមាសទី២ និងការវាយតម្លៃលទ្ធផលប្រចាំឆ្នាំ',
    isDayOff: false,
  },
  {
    id: 'grand-vacation-2026',
    nameKhmer: 'មហាវិស្សមកាល (Grand Vacation - សម្រាកដំណាច់ឆ្នាំ)',
    date: '2026-08-01',
    daysCount: 61,
    type: 'school_event',
    description: 'ការឈប់សម្រាកមហាវិស្សមកាលសម្រាប់លោកគ្រូ អ្នកគ្រូ និងសិស្សានុសិស្ស',
    isDayOff: true,
  },
  {
    id: 'constitution-day-2026',
    nameKhmer: 'ទិវាប្រកាសរដ្ឋធម្មនុញ្ញ (Constitution Day)',
    date: '2026-09-24',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ខួបនៃការប្រកាសឱ្យប្រើប្រាស់រដ្ឋធម្មនុញ្ញ',
    isDayOff: true,
  },
  {
    id: 'pchum-ben-2026',
    nameKhmer: 'ពិធីបុណ្យភ្ជុំបិណ្ឌ (Pchum Ben Festival)',
    date: '2026-10-10',
    daysCount: 3,
    type: 'public_holiday',
    description: 'ពិធីបុណ្យកាន់បិណ្ឌ និងភ្ជុំបិណ្ឌប្រពៃណីជាតិខ្មែរ',
    isDayOff: true,
  },
  {
    id: 'teacher-day-2026',
    nameKhmer: 'ទិវាគ្រូបង្រៀន ៥ តុលា (National Teachers Day)',
    date: '2026-10-05',
    daysCount: 1,
    type: 'school_event',
    description: 'ទិវាដឹងគុណ និងលើកតម្កើងគ្រូបង្រៀន',
    isDayOff: false,
  },
  {
    id: 'king-father-commemoration-2026',
    nameKhmer: 'ទិវាប្រារព្ធពិធីគោរពព្រះវិញ្ញាណក្ខន្ធ ព្រះបរមរតនកោដ្ឋ',
    date: '2026-10-15',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ព្រះបាទសម្តេច ព្រះនរោត្តម សីហនុ ព្រះបរមរតនកោដ្ឋ',
    isDayOff: true,
  },
  {
    id: 'coronation-day-2026',
    nameKhmer: 'ព្រះរាជពិធីគ្រងព្រះបរមរាជសម្បត្តិ ព្រះមហាក្សត្រ',
    date: '2026-10-29',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ខួបនៃការយាងគ្រងព្រះបរមរាជសម្បត្តិ',
    isDayOff: true,
  },
  {
    id: 'independence-day-2026',
    nameKhmer: 'ពិធីបុណ្យឯករាជ្យជាតិ ៩ វិច្ឆិកា (Independence Day)',
    date: '2026-11-09',
    daysCount: 1,
    type: 'public_holiday',
    description: 'ខួបបុណ្យឯករាជ្យជាតិពីអាណានិគមបារាំង',
    isDayOff: true,
  },
  {
    id: 'water-festival-2026',
    nameKhmer: 'ព្រះរាជពិធីបុណ្យអុំទូក បណ្តែតប្រទីប និងសំពះព្រះខែ អកអំបុក',
    date: '2026-11-23',
    daysCount: 3,
    type: 'public_holiday',
    description: 'ពិធីបុណ្យអុំទូកប្រពៃណីជាតិ',
    isDayOff: true,
  },
];

// Khmer Lunar Month Names
export const KHMER_LUNAR_MONTHS = [
  'មិគសិរ',
  'បុស្ស',
  'មាឃ',
  'ផល្គុន',
  'ចេត្រ',
  'ពិសាខ',
  'ជេស្ឋ',
  'អាសាឍ',
  'ស្រាពណ៍',
  'ភទ្របទ',
  'អស្សុជ',
  'កត្តិក',
];

// Khmer Days of the Week
export const KHMER_DAYS_OF_WEEK = [
  'ថ្ងៃអាទិត្យ',
  'ថ្ងៃចន្ទ',
  'ថ្ងៃអង្គារ',
  'ថ្ងៃពុធ',
  'ថ្ងៃព្រហស្បតិ៍',
  'ថ្ងៃសុក្រ',
  'ថ្ងៃសៅរ៍',
];

// Khmer Solar Months
export const KHMER_SOLAR_MONTHS = [
  'មករា',
  'កុម្ភៈ',
  'មីនា',
  'មេសា',
  'ឧសភា',
  'មិថុនា',
  'កក្កដា',
  'សីហា',
  'កញ្ញា',
  'តុលា',
  'វិច្ឆិកា',
  'ធ្នូ',
];

// Khmer Animal Years (រាសី/សត្វទាំង១២)
export const KHMER_ANIMAL_YEARS = [
  'ជូត',
  'ឆ្លូវ',
  'ខាល',
  'ថោះ',
  'រោង',
  'ម្សាញ់',
  'មមី',
  'មមែ',
  'វក',
  'រកា',
  'ច',
  'កុរ',
];

// Khmer Sork (ស័ក)
export const KHMER_SAK_NAMES = [
  'ឯកស័ក',
  'ទោស័ក',
  'ត្រីស័ក',
  'ចត្វាស័ក',
  'បញ្ចស័ក',
  'ឆស័ក',
  'សប្តស័ក',
  'អដ្ឋស័ក',
  'នព្វស័ក',
  'សំរឹទ្ធិស័ក',
];

// Convert Western digits to Khmer digits
export function toKhmerDigits(num: number | string): string {
  const khmerDigits = ['០', '១', '២', '៣', '៤', '៥', '៦', '៧', '៨', '៩'];
  return String(num).replace(/[0-9]/g, w => khmerDigits[parseInt(w, 10)]);
}

// Approximate Khmer Lunar Date for any solar date
// Given the known anchor: 2026-03-21 -> ថ្ងៃសៅរ៍ ១៥រោច ខែបុស្ស ឆ្នាំម្សាញ់ សប្ដស័ក ព.ស.២៥៦៩
export function getKhmerLunarDateInfo(solarDate: Date): {
  dayOfWeekKhmer: string;
  lunarDayString: string;
  lunarMonth: string;
  animalYear: string;
  sak: string;
  buddhistYear: string;
  solarDateStringKhmer: string;
  fullChhnamString: string;
} {
  const dayOfWeekIndex = solarDate.getDay();
  const dayOfWeekKhmer = KHMER_DAYS_OF_WEEK[dayOfWeekIndex];

  // Anchor date: 2026-03-21 is Saturday, 15 Roch, Khem Bos, Chhnam Masanh, Sabtasak, BE 2569
  const anchorTime = new Date(2026, 2, 21).getTime(); // Note: month is 0-indexed, 2 = March
  const targetTime = new Date(solarDate.getFullYear(), solarDate.getMonth(), solarDate.getDate()).getTime();
  const diffDays = Math.round((targetTime - anchorTime) / (1000 * 60 * 60 * 24));

  // Base values for 2026-03-21
  // Synodic lunar month is ~29.530588 days
  const lunarCycle = 29.530588;
  // Day in cycle: on 2026-03-21 it was 15 Roch (the 30th day of lunar month, or new moon)
  const basePhase = 29.5; 
  let phase = (basePhase + diffDays) % lunarCycle;
  if (phase < 0) phase += lunarCycle;

  let lunarDayString = '';
  if (phase < 15) {
    const day = Math.min(15, Math.max(1, Math.floor(phase) + 1));
    lunarDayString = `${toKhmerDigits(day)}កើត`;
  } else {
    const day = Math.min(15, Math.max(1, Math.floor(phase - 15) + 1));
    lunarDayString = `${toKhmerDigits(day)}រោច`;
  }

  // Lunar month calculation based on anchor (Bos at anchor)
  const anchorMonthIndex = 1; // Bos
  const elapsedMonths = Math.floor((basePhase + diffDays) / lunarCycle);
  let lunarMonthIndex = (anchorMonthIndex + elapsedMonths) % 12;
  if (lunarMonthIndex < 0) lunarMonthIndex += 12;
  const lunarMonth = KHMER_LUNAR_MONTHS[lunarMonthIndex];

  // Year info
  const animalYear = 'ម្សាញ់';
  const sak = 'សប្ដស័ក';
  const beYear = 2569;
  const buddhistYear = toKhmerDigits(beYear);

  const solarDay = toKhmerDigits(solarDate.getDate());
  const solarMonth = KHMER_SOLAR_MONTHS[solarDate.getMonth()];
  const solarYear = toKhmerDigits(solarDate.getFullYear());
  const solarDateStringKhmer = `ថ្ងៃទី${solarDay} ខែ${solarMonth} ឆ្នាំ${solarYear}`;

  const fullChhnamString = `${dayOfWeekKhmer} ${lunarDayString} ខែ${lunarMonth} ឆ្នាំ${animalYear} ${sak} ព.ស.${buddhistYear}`;

  return {
    dayOfWeekKhmer,
    lunarDayString,
    lunarMonth,
    animalYear,
    sak,
    buddhistYear,
    solarDateStringKhmer,
    fullChhnamString,
  };
}
