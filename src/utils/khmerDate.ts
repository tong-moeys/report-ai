import { toKhmerNum } from './khmerNumbers';

export interface KhmerDateDetails {
  lunarDate: string;
  solarDate: string;
  fullKhmerDate: string;
}

const KHMER_DAYS = ['អាទិត្យ', 'ច័ន្ទ', 'អង្គារ', 'ពុធ', 'ព្រហស្បតិ៍', 'សុក្រ', 'សៅរ៍'];
const KHMER_MONTHS = [
  'មករា', 'កុម្ភៈ', 'មីនា', 'មេសា', 'ឧសភា', 'មិថុនា',
  'កក្កដា', 'សីហា', 'កញ្ញា', 'តុលា', 'វិច្ឆិកា', 'ធ្នូ'
];

/**
 * Approximate Khmer Lunar Date for official educational paperwork.
 * Default official date for end-of-year school report:
 * ថ្ងៃពុធ ៣កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស.២៥៦០
 */
export const DEFAULT_OFFICIAL_LUNAR_DATE = 'ថ្ងៃពុធ ៣កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស.២៥៦០';

/**
 * Returns formatted solar date in Khmer:
 * e.g. "ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦" or "ភូមិរោត, ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦"
 */
export function formatKhmerSolarDate(dateInput?: string | Date, location?: string): string {
  const d = dateInput ? new Date(dateInput) : new Date();
  const day = isNaN(d.getDate()) ? 21 : d.getDate();
  const monthIdx = isNaN(d.getMonth()) ? 2 : d.getMonth();
  const year = isNaN(d.getFullYear()) ? 2026 : d.getFullYear();

  const formatted = `ថ្ងៃទី${toKhmerNum(day)} ខែ${KHMER_MONTHS[monthIdx]} ឆ្នាំ${toKhmerNum(year)}`;
  return location ? `${location}, ${formatted}` : formatted;
}
