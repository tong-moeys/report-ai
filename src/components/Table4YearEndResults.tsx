import React from 'react';
import { Table4RowInput, Table4HeaderConfig, Table4Period } from '../types';
import { formatPct, getTable4Titles } from '../data/initialData';
import { Calculator, ArrowLeftRight } from 'lucide-react';

interface Props {
  rows: Table4RowInput[];
  onChange: (rows: Table4RowInput[]) => void;
  showFormulas: boolean;
  headerConfig: Table4HeaderConfig;
  onUpdateHeaderConfig: (cfg: Table4HeaderConfig) => void;
}

export const Table4YearEndResultsView: React.FC<Props> = ({
  rows,
  onChange,
  showFormulas,
  headerConfig,
  onUpdateHeaderConfig,
}) => {
  const updateRow = (index: number, field: keyof Table4RowInput, val: number) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: num,
    };
    onChange(updated);
  };

  const handlePeriodChange = (newPeriod: Table4Period) => {
    const titles = getTable4Titles(newPeriod, headerConfig.isSwapped);
    onUpdateHeaderConfig({
      ...headerConfig,
      period: newPeriod,
      col1Title: titles.col1,
      col2Title: titles.col2,
    });
  };

  const handleToggleSwap = () => {
    const newSwapped = !headerConfig.isSwapped;
    const titles = getTable4Titles(headerConfig.period, newSwapped);
    onUpdateHeaderConfig({
      ...headerConfig,
      isSwapped: newSwapped,
      col1Title: titles.col1,
      col2Title: titles.col2,
    });
  };

  // Dynamic table titles based on selected period
  const tableTitle =
    headerConfig.period === 'ឆមាស១'
      ? '៤. តារាងលទ្ធផលសិក្សា ឆមាសទី១'
      : headerConfig.period === 'ឆមាស២'
      ? '៤. តារាងលទ្ធផលសិក្សា ឆមាសទី២'
      : '៤. តារាងលទ្ធផលសិក្សា ក្រោយធ្វើតេស្តចុងឆ្នាំរួច (ដំណាច់ឆ្នាំ)';

  const tableSubTitle =
    headerConfig.period === 'ឆមាស១'
      ? 'លទ្ធផលសិក្សាឆមាសទី១ សិស្សជាប់មធ្យមភាគ ធ្វើតេស្តជាប់ ត្រួតថ្នាក់ និងបោះបង់ (គណនាស្វ័យប្រវត្ត)'
      : headerConfig.period === 'ឆមាស២'
      ? 'លទ្ធផលសិក្សាឆមាសទី២ សិស្សជាប់មធ្យមភាគ ធ្វើតេស្តជាប់ ត្រួតថ្នាក់ និងបោះបង់ (គណនាស្វ័យប្រវត្ត)'
      : 'លទ្ធផលសិក្សាចុងឆ្នាំ សិស្សជាប់មធ្យមភាគ ធ្វើតេស្តជាប់ សរុបជាប់ចុងឆ្នាំ ត្រួតថ្នាក់ និងបោះបង់ (គណនាស្វ័យប្រវត្ត)';

  // Calculate each row's auto values according to exact Ministry formulas
  const computedRows = rows.map((r) => {
    const c5 = Number(r.passedAvgTotal) || 0;
    const c7 = Number(r.passedAvgFemale) || 0;
    const c9 = Number(r.passedRetestTotal) || 0;
    const c11 = Number(r.passedRetestFemale) || 0;
    const c17 = Number(r.repeatersTotal) || 0;
    const c19 = Number(r.repeatersFemale) || 0;
    const c21 = Number(r.dropoutsTotal) || 0;
    const c23 = Number(r.dropoutsFemale) || 0;

    // 13 = 5 + 9 (សរុបជាប់ចុងឆ្នាំ)
    const c13 = c5 + c9;
    // 15 = 7 + 11 (ស្រីជាប់ចុងឆ្នាំ)
    const c15 = c7 + c11;

    // 3 = 13 + 17 (សិស្សចុងឆ្នាំ)
    const c3 = c13 + c17;
    // 4 = 15 + 19 (ស្រីចុងឆ្នាំ)
    const c4 = c15 + c19;

    // 1 = 3 + 21 (ឆមាសទី១ សរុប)
    const c1 = c3 + c21;
    // 2 = 4 + 23 (ឆមាសទី១ ស្រី)
    const c2 = c4 + c23;

    // Percentages relative to Semester 1 total (1) and female (2) as specified in formula row:
    const c6 = formatPct(c5, c1);
    const c8 = formatPct(c7, c2);
    const c10 = formatPct(c9, c1);
    const c12 = formatPct(c11, c2);
    const c14 = formatPct(c13, c1);
    const c16 = formatPct(c15, c2);
    const c18 = formatPct(c17, c1);
    const c20 = formatPct(c19, c2);
    const c22 = formatPct(c21, c1);
    const c24 = formatPct(c23, c2);

    return {
      ...r,
      c1, c2, c3, c4, c5, c6, c7, c8,
      c9, c10, c11, c12, c13, c14, c15, c16,
      c17, c18, c19, c20, c21, c22, c23, c24,
    };
  });

  // Totals across all rows
  const sum = (fn: (r: (typeof computedRows)[0]) => number) =>
    computedRows.reduce((acc, curr) => acc + fn(curr), 0);

  const totalC1 = sum((r) => r.c1);
  const totalC2 = sum((r) => r.c2);
  const totalC3 = sum((r) => r.c3);
  const totalC4 = sum((r) => r.c4);
  const totalC5 = sum((r) => r.c5);
  const totalC6 = formatPct(totalC5, totalC1);
  const totalC7 = sum((r) => r.c7);
  const totalC8 = formatPct(totalC7, totalC2);
  const totalC9 = sum((r) => r.c9);
  const totalC10 = formatPct(totalC9, totalC1);
  const totalC11 = sum((r) => r.c11);
  const totalC12 = formatPct(totalC11, totalC2);
  const totalC13 = sum((r) => r.c13);
  const totalC14 = formatPct(totalC13, totalC1);
  const totalC15 = sum((r) => r.c15);
  const totalC16 = formatPct(totalC15, totalC2);
  const totalC17 = sum((r) => r.c17);
  const totalC18 = formatPct(totalC17, totalC1);
  const totalC19 = sum((r) => r.c19);
  const totalC20 = formatPct(totalC19, totalC2);
  const totalC21 = sum((r) => r.c21);
  const totalC22 = formatPct(totalC21, totalC1);
  const totalC23 = sum((r) => r.c23);
  const totalC24 = formatPct(totalC23, totalC2);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-indigo-100 text-indigo-800 text-xs font-bold flex items-center justify-center">៤</span>
            <span>{tableTitle}</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            {tableSubTitle}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          {/* Quick period selector in toolbar */}
          <div className="flex items-center gap-1 bg-white border border-slate-300 rounded-lg p-1 shadow-2xs">
            <span className="text-[11px] text-slate-500 font-medium px-1.5 hidden sm:inline">ជ្រើសរើស:</span>
            {(['ឆមាស១', 'ឆមាស២', 'ដំណាច់ឆ្នាំ'] as Table4Period[]).map((p) => (
              <button
                key={p}
                type="button"
                id={`t4-btn-period-${p}`}
                onClick={() => handlePeriodChange(p)}
                className={`px-2.5 py-1 text-xs font-bold rounded-md transition-all cursor-pointer ${
                  headerConfig.period === p
                    ? 'bg-blue-600 text-white shadow-2xs'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                {p}
              </button>
            ))}
          </div>

          <button
            type="button"
            id="t4-btn-swap-order"
            onClick={handleToggleSwap}
            title="ប្តូរលំដាប់ជួរឈរ (ឆមាស ↔ បវេសនកាស/ចុងឆ្នាំ)"
            className="px-2.5 py-1.5 text-xs font-medium text-slate-700 bg-white border border-slate-300 hover:border-blue-400 hover:text-blue-700 rounded-lg shadow-2xs flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ArrowLeftRight className="w-3.5 h-3.5" />
            <span className="hidden md:inline">ប្តូរលំដាប់ជួរ</span>
          </button>

          {showFormulas && (
            <div className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
              <Calculator className="w-3.5 h-3.5" />
              <span>រូបមន្ត: 1=3+21 | 2=4+23 | 3=13+17 | 4=15+19 | 13=5+9 | 15=7+11</span>
            </div>
          )}
        </div>
      </div>

      <div className="overflow-x-auto table-scrollbar p-3">
        <table className="w-full border-collapse border border-slate-400 text-center text-xs">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-slate-100 text-slate-800 font-semibold">
              <th rowSpan={4} className="border border-slate-400 p-2 min-w-[70px]">
                ថ្នាក់
              </th>
              <th colSpan={24} className="border border-slate-400 p-2 bg-indigo-50/70 text-slate-800 font-bold">
                សិស្សសរុបពីថ្នាក់ទី១ ដល់៦
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-slate-100 text-slate-700 font-medium">
              {!headerConfig.isSwapped ? (
                <>
                  {/* Column 1-2: Select dropdown [ឆមាស១, ឆមាស២, ដំណាច់ឆ្នាំ] */}
                  <th colSpan={2} className="border border-slate-400 px-1 py-1.5 bg-blue-50 text-blue-900 font-bold">
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <div className="inline-flex items-center gap-1 bg-white border border-blue-400 rounded px-1.5 py-0.5 shadow-2xs print:hidden">
                        <label htmlFor="t4-period-select" className="sr-only">ជ្រើសរើសរបាយការណ៍</label>
                        <select
                          id="t4-period-select"
                          value={headerConfig.period}
                          onChange={(e) => handlePeriodChange(e.target.value as Table4Period)}
                          className="bg-transparent text-blue-950 font-bold text-xs cursor-pointer focus:outline-none pr-1"
                        >
                          <option value="ឆមាស១">ឆមាស១</option>
                          <option value="ឆមាស២">ឆមាស២</option>
                          <option value="ដំណាច់ឆ្នាំ">ដំណាច់ឆ្នាំ</option>
                        </select>
                      </div>
                      <span className="hidden print:inline font-bold text-xs">{headerConfig.period}</span>
                    </div>
                  </th>

                  {/* Column 3-4: Next Column (ជួរបន្ទាប់: បវេសនកាស / ឆមាស១ / ចុងឆ្នាំ) */}
                  <th colSpan={2} className="border border-slate-400 px-1 py-1.5 bg-sky-50 text-sky-950 font-bold">
                    <div className="flex items-center justify-center">
                      <span className="px-2 py-0.5 bg-sky-100/70 text-sky-950 rounded font-bold text-xs">
                        {headerConfig.col2Title}
                      </span>
                    </div>
                  </th>
                </>
              ) : (
                <>
                  {/* Swapped: Column 1-2 displays Next Column text */}
                  <th colSpan={2} className="border border-slate-400 px-1 py-1.5 bg-sky-50 text-sky-950 font-bold">
                    <div className="flex items-center justify-center">
                      <span className="px-2 py-0.5 bg-sky-100/70 text-sky-950 rounded font-bold text-xs">
                        {headerConfig.col1Title}
                      </span>
                    </div>
                  </th>

                  {/* Swapped: Column 3-4 displays Select dropdown */}
                  <th colSpan={2} className="border border-slate-400 px-1 py-1.5 bg-blue-50 text-blue-900 font-bold">
                    <div className="flex flex-col items-center justify-center gap-0.5">
                      <div className="inline-flex items-center gap-1 bg-white border border-blue-400 rounded px-1.5 py-0.5 shadow-2xs print:hidden">
                        <label htmlFor="t4-period-select-swapped" className="sr-only">ជ្រើសរើសរបាយការណ៍</label>
                        <select
                          id="t4-period-select-swapped"
                          value={headerConfig.period}
                          onChange={(e) => handlePeriodChange(e.target.value as Table4Period)}
                          className="bg-transparent text-blue-950 font-bold text-xs cursor-pointer focus:outline-none pr-1"
                        >
                          <option value="ឆមាស១">ឆមាស១</option>
                          <option value="ឆមាស២">ឆមាស២</option>
                          <option value="ដំណាច់ឆ្នាំ">ដំណាច់ឆ្នាំ</option>
                        </select>
                      </div>
                      <span className="hidden print:inline font-bold text-xs">{headerConfig.period}</span>
                    </div>
                  </th>
                </>
              )}

              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-emerald-50 text-emerald-900 font-bold">
                សិស្សជាប់មធ្យមភាគ
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-teal-50 text-teal-900 font-bold">
                សិស្សធ្វើតេស្តជាប់
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-green-100 text-green-950 font-bold">
                {headerConfig.period === 'ឆមាស១' ? 'សរុបជាប់ឆមាស១' : headerConfig.period === 'ឆមាស២' ? 'សរុបជាប់ឆមាស២' : 'សរុបជាប់ចុងឆ្នាំ'}
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-amber-50 text-amber-900 font-bold">
                សិស្សត្រួតថ្នាក់
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-rose-50 text-rose-900 font-bold">
                សិស្សបោះបង់
              </th>
            </tr>

            {/* Header Row 3 */}
            <tr className="bg-slate-100 text-slate-700 font-medium text-[11px]">
              {/* Sem 1 */}
              <th className="border border-slate-400 px-1 py-1 min-w-[40px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-pink-700">ស្រី</th>
              {/* Year End */}
              <th className="border border-slate-400 px-1 py-1 min-w-[40px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-pink-700">ស្រី</th>
              {/* Passed Avg */}
              <th className="border border-slate-400 px-1 py-1 min-w-[40px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              {/* Passed Test */}
              <th className="border border-slate-400 px-1 py-1 min-w-[40px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              {/* Total Passed Year End */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px] bg-green-100/70 text-green-950 font-bold">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] bg-green-100/70 text-pink-900 font-bold">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              {/* Repeaters */}
              <th className="border border-slate-400 px-1 py-1 min-w-[40px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              {/* Dropouts */}
              <th className="border border-slate-400 px-1 py-1 min-w-[40px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[36px] text-slate-500">%</th>
            </tr>

            {/* Header Row 4: Exact formula row from prompt */}
            <tr className="bg-slate-200/90 text-slate-700 text-[10px] font-mono font-medium">
              <th className="border border-slate-400 px-0.5 py-1 bg-blue-100/70" title={`${headerConfig.col1Title} សរុប = ${headerConfig.col2Title}(3) + បោះបង់(21)`}>1=3+21</th>
              <th className="border border-slate-400 px-0.5 py-1 bg-blue-100/70 text-pink-900" title={`${headerConfig.col1Title} ស្រី = ស្រី${headerConfig.col2Title}(4) + ស្រីបោះបង់(23)`}>2=4+23</th>
              <th className="border border-slate-400 px-0.5 py-1 bg-sky-100/70" title={`${headerConfig.col2Title} សរុប = ជាប់${headerConfig.col2Title}(13) + ត្រួត(17)`}>3=13+17</th>
              <th className="border border-slate-400 px-0.5 py-1 bg-sky-100/70 text-pink-900" title={`${headerConfig.col2Title} ស្រី = ស្រីជាប់(15) + ស្រីត្រួត(19)`}>4=15+19</th>
              <th className="border border-slate-400 px-0.5 py-1">5</th>
              <th className="border border-slate-400 px-0.5 py-1 text-emerald-800">6=5x10/1</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">7</th>
              <th className="border border-slate-400 px-0.5 py-1 text-emerald-800">8=7x10/2</th>
              <th className="border border-slate-400 px-0.5 py-1">9</th>
              <th className="border border-slate-400 px-0.5 py-1 text-teal-800">10=9x10/1</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">11</th>
              <th className="border border-slate-400 px-0.5 py-1 text-teal-800">12=11x10/2</th>
              <th className="border border-slate-400 px-0.5 py-1 bg-green-200/80 text-green-950" title="សរុបជាប់ = ជាប់មធ្យមភាគ(5) + ធ្វើតេស្តជាប់(9)">13=5+9</th>
              <th className="border border-slate-400 px-0.5 py-1 text-green-800">14=13x10/1</th>
              <th className="border border-slate-400 px-0.5 py-1 bg-green-200/80 text-pink-950" title="ស្រីជាប់ = ស្រីជាប់មធ្យមភាគ(7) + ស្រីធ្វើតេស្តជាប់(11)">15=7+11</th>
              <th className="border border-slate-400 px-0.5 py-1 text-green-800">16=15x10/2</th>
              <th className="border border-slate-400 px-0.5 py-1">17</th>
              <th className="border border-slate-400 px-0.5 py-1 text-amber-800">18=17x10/1</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">19</th>
              <th className="border border-slate-400 px-0.5 py-1 text-amber-800">20=19x10/2</th>
              <th className="border border-slate-400 px-0.5 py-1">21</th>
              <th className="border border-slate-400 px-0.5 py-1 text-rose-800">22=21x10/1</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">23</th>
              <th className="border border-slate-400 px-0.5 py-1 text-rose-800">24=23x10/2</th>
            </tr>
          </thead>

          <tbody>
            {computedRows.map((r, i) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-400 p-1 font-semibold text-slate-800 bg-slate-50 whitespace-nowrap">
                  {r.gradeLabel}
                </td>

                {/* 1: Sem 1 Total [AUTO: 3 + 21] */}
                <td className="border border-slate-400 p-1 bg-blue-50/70 font-bold text-blue-900">
                  <span id={`t4-${r.id}-c1`} title="3+21">{r.c1}</span>
                </td>
                {/* 2: Sem 1 Female [AUTO: 4 + 23] */}
                <td className="border border-slate-400 p-1 bg-pink-50/70 font-bold text-pink-900">
                  <span id={`t4-${r.id}-c2`} title="4+23">{r.c2}</span>
                </td>

                {/* 3: Year End Total [AUTO: 13 + 17] */}
                <td className="border border-slate-400 p-1 bg-sky-50/70 font-bold text-sky-900">
                  <span id={`t4-${r.id}-c3`} title="13+17">{r.c3}</span>
                </td>
                {/* 4: Year End Female [AUTO: 15 + 19] */}
                <td className="border border-slate-400 p-1 bg-pink-50/70 font-bold text-pink-900">
                  <span id={`t4-${r.id}-c4`} title="15+19">{r.c4}</span>
                </td>

                {/* 5: Passed Avg Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c5`}
                    type="number"
                    min="0"
                    value={r.passedAvgTotal || ''}
                    onChange={(e) => updateRow(i, 'passedAvgTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 6: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-slate-700">
                  <span id={`t4-${r.id}-c6`}>{r.c6}</span>
                </td>

                {/* 7: Passed Avg Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c7`}
                    type="number"
                    min="0"
                    value={r.passedAvgFemale || ''}
                    onChange={(e) => updateRow(i, 'passedAvgFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 8: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-pink-700">
                  <span id={`t4-${r.id}-c8`}>{r.c8}</span>
                </td>

                {/* 9: Passed Retest Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c9`}
                    type="number"
                    min="0"
                    value={r.passedRetestTotal || ''}
                    onChange={(e) => updateRow(i, 'passedRetestTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 10: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-slate-700">
                  <span id={`t4-${r.id}-c10`}>{r.c10}</span>
                </td>

                {/* 11: Passed Retest Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c11`}
                    type="number"
                    min="0"
                    value={r.passedRetestFemale || ''}
                    onChange={(e) => updateRow(i, 'passedRetestFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 12: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-pink-700">
                  <span id={`t4-${r.id}-c12`}>{r.c12}</span>
                </td>

                {/* 13: Total Pass Year End [AUTO: 5 + 9] */}
                <td className="border border-slate-400 p-1 bg-green-100/70 font-bold text-green-950">
                  <span id={`t4-${r.id}-c13`} title="5 + 9">{r.c13}</span>
                </td>
                {/* 14: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-bold text-green-800">
                  <span id={`t4-${r.id}-c14`}>{r.c14}</span>
                </td>

                {/* 15: Total Pass Female Year End [AUTO: 7 + 11] */}
                <td className="border border-slate-400 p-1 bg-green-100/70 font-bold text-pink-950">
                  <span id={`t4-${r.id}-c15`} title="7 + 11">{r.c15}</span>
                </td>
                {/* 16: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-bold text-pink-800">
                  <span id={`t4-${r.id}-c16`}>{r.c16}</span>
                </td>

                {/* 17: Repeaters Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c17`}
                    type="number"
                    min="0"
                    value={r.repeatersTotal || ''}
                    onChange={(e) => updateRow(i, 'repeatersTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 18: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-slate-700">
                  <span id={`t4-${r.id}-c18`}>{r.c18}</span>
                </td>

                {/* 19: Repeaters Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c19`}
                    type="number"
                    min="0"
                    value={r.repeatersFemale || ''}
                    onChange={(e) => updateRow(i, 'repeatersFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 20: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-pink-700">
                  <span id={`t4-${r.id}-c20`}>{r.c20}</span>
                </td>

                {/* 21: Dropouts Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c21`}
                    type="number"
                    min="0"
                    value={r.dropoutsTotal || ''}
                    onChange={(e) => updateRow(i, 'dropoutsTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 22: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-slate-700">
                  <span id={`t4-${r.id}-c22`}>{r.c22}</span>
                </td>

                {/* 23: Dropouts Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t4-${r.id}-c23`}
                    type="number"
                    min="0"
                    value={r.dropoutsFemale || ''}
                    onChange={(e) => updateRow(i, 'dropoutsFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 24: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-pink-700">
                  <span id={`t4-${r.id}-c24`}>{r.c24}</span>
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-indigo-50/80 text-slate-900 font-bold border-t-2 border-slate-500">
              <td className="border border-slate-400 p-1.5 text-center font-bold text-indigo-950">
                សរុប
              </td>
              <td className="border border-slate-400 p-1 text-center bg-blue-100/70 font-bold text-blue-900">
                <span id="t4-total-c1">{totalC1}</span>
              </td>
              <td className="border border-slate-400 p-1 text-center bg-pink-100/70 font-bold text-pink-900">
                <span id="t4-total-c2">{totalC2}</span>
              </td>

              <td className="border border-slate-400 p-1 text-center bg-sky-100/70 font-bold text-sky-900">
                <span id="t4-total-c3">{totalC3}</span>
              </td>
              <td className="border border-slate-400 p-1 text-center bg-pink-100/70 font-bold text-pink-900">
                <span id="t4-total-c4">{totalC4}</span>
              </td>

              <td className="border border-slate-400 p-1 text-center">{totalC5}</td>
              <td className="border border-slate-400 p-1 text-center text-emerald-800">{totalC6}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC7}</td>
              <td className="border border-slate-400 p-1 text-center text-emerald-800">{totalC8}</td>

              <td className="border border-slate-400 p-1 text-center">{totalC9}</td>
              <td className="border border-slate-400 p-1 text-center text-teal-800">{totalC10}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC11}</td>
              <td className="border border-slate-400 p-1 text-center text-teal-800">{totalC12}</td>

              <td className="border border-slate-400 p-1 text-center bg-green-200/90 text-green-950 font-bold">{totalC13}</td>
              <td className="border border-slate-400 p-1 text-center text-green-900 font-bold">{totalC14}</td>
              <td className="border border-slate-400 p-1 text-center bg-green-200/90 text-pink-950 font-bold">{totalC15}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-900 font-bold">{totalC16}</td>

              <td className="border border-slate-400 p-1 text-center">{totalC17}</td>
              <td className="border border-slate-400 p-1 text-center text-amber-800">{totalC18}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC19}</td>
              <td className="border border-slate-400 p-1 text-center text-amber-800">{totalC20}</td>

              <td className="border border-slate-400 p-1 text-center">{totalC21}</td>
              <td className="border border-slate-400 p-1 text-center text-rose-800">{totalC22}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC23}</td>
              <td className="border border-slate-400 p-1 text-center text-rose-800">{totalC24}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div>
          <span>
            {headerConfig.period === 'ឆមាស១' ? 'សរុបជាប់ឆមាស១' : headerConfig.period === 'ឆមាស២' ? 'សរុបជាប់ឆមាស២' : 'សរុបជាប់ចុងឆ្នាំ'}:{' '}
            <strong className="text-green-700 font-bold">{totalC13}</strong> នាក់ ({totalC14}) | ត្រួតថ្នាក់: <strong className="text-amber-700 font-bold">{totalC17}</strong> នាក់ ({totalC18}) | បោះបង់: <strong className="text-rose-700 font-bold">{totalC21}</strong> នាក់ ({totalC22})
          </span>
        </div>
      </div>
    </div>
  );
};
