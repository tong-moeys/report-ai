import React from 'react';
import { Calculator, RotateCcw, Sparkles } from 'lucide-react';
import { FullSchoolReport, PostTestAcademicRow } from '../types';

interface PostTestAcademicTableProps {
  report: FullSchoolReport;
  onChange: (updated: FullSchoolReport) => void;
}

const DEFAULT_POST_TEST_ROWS: PostTestAcademicRow[] = [
  {
    grade: 'ថ្នាក់ទី ១',
    sem1Total: 31,
    sem1Female: 15,
    yearEndTotal: 31,
    yearEndFemale: 15,
    passedAvgTotal: 31,
    passedAvgTotalPct: '100%',
    passedAvgFemale: 15,
    passedAvgFemalePct: '100%',
    passedRetestTotal: 0,
    passedRetestTotalPct: '0%',
    passedRetestFemale: 0,
    passedRetestFemalePct: '0%',
    finalPassedTotal: 31,
    finalPassedTotalPct: '100%',
    finalPassedFemale: 15,
    finalPassedFemalePct: '100%',
    repeaterTotal: 0,
    repeaterTotalPct: '0%',
    repeaterFemale: 0,
    repeaterFemalePct: '0%',
    dropoutTotal: 0,
    dropoutTotalPct: '0%',
    dropoutFemale: 0,
    dropoutFemalePct: '0%',
  },
  {
    grade: 'ថ្នាក់ទី ២',
    sem1Total: 42,
    sem1Female: 21,
    yearEndTotal: 42,
    yearEndFemale: 21,
    passedAvgTotal: 42,
    passedAvgTotalPct: '100%',
    passedAvgFemale: 21,
    passedAvgFemalePct: '100%',
    passedRetestTotal: 0,
    passedRetestTotalPct: '0%',
    passedRetestFemale: 0,
    passedRetestFemalePct: '0%',
    finalPassedTotal: 42,
    finalPassedTotalPct: '100%',
    finalPassedFemale: 21,
    finalPassedFemalePct: '100%',
    repeaterTotal: 0,
    repeaterTotalPct: '0%',
    repeaterFemale: 0,
    repeaterFemalePct: '0%',
    dropoutTotal: 0,
    dropoutTotalPct: '0%',
    dropoutFemale: 0,
    dropoutFemalePct: '0%',
  },
  {
    grade: 'ថ្នាក់ទី ៣',
    sem1Total: 40,
    sem1Female: 21,
    yearEndTotal: 40,
    yearEndFemale: 21,
    passedAvgTotal: 40,
    passedAvgTotalPct: '100%',
    passedAvgFemale: 21,
    passedAvgFemalePct: '100%',
    passedRetestTotal: 0,
    passedRetestTotalPct: '0%',
    passedRetestFemale: 0,
    passedRetestFemalePct: '0%',
    finalPassedTotal: 40,
    finalPassedTotalPct: '100%',
    finalPassedFemale: 21,
    finalPassedFemalePct: '100%',
    repeaterTotal: 0,
    repeaterTotalPct: '0%',
    repeaterFemale: 0,
    repeaterFemalePct: '0%',
    dropoutTotal: 0,
    dropoutTotalPct: '0%',
    dropoutFemale: 0,
    dropoutFemalePct: '0%',
  },
  {
    grade: 'ថ្នាក់ទី ៤',
    sem1Total: 49,
    sem1Female: 21,
    yearEndTotal: 49,
    yearEndFemale: 21,
    passedAvgTotal: 49,
    passedAvgTotalPct: '100%',
    passedAvgFemale: 21,
    passedAvgFemalePct: '100%',
    passedRetestTotal: 0,
    passedRetestTotalPct: '0%',
    passedRetestFemale: 0,
    passedRetestFemalePct: '0%',
    finalPassedTotal: 49,
    finalPassedTotalPct: '100%',
    finalPassedFemale: 21,
    finalPassedFemalePct: '100%',
    repeaterTotal: 0,
    repeaterTotalPct: '0%',
    repeaterFemale: 0,
    repeaterFemalePct: '0%',
    dropoutTotal: 0,
    dropoutTotalPct: '0%',
    dropoutFemale: 0,
    dropoutFemalePct: '0%',
  },
  {
    grade: 'ថ្នាក់ទី ៥',
    sem1Total: 50,
    sem1Female: 24,
    yearEndTotal: 50,
    yearEndFemale: 24,
    passedAvgTotal: 50,
    passedAvgTotalPct: '100%',
    passedAvgFemale: 24,
    passedAvgFemalePct: '100%',
    passedRetestTotal: 0,
    passedRetestTotalPct: '0%',
    passedRetestFemale: 0,
    passedRetestFemalePct: '0%',
    finalPassedTotal: 50,
    finalPassedTotalPct: '100%',
    finalPassedFemale: 24,
    finalPassedFemalePct: '100%',
    repeaterTotal: 0,
    repeaterTotalPct: '0%',
    repeaterFemale: 0,
    repeaterFemalePct: '0%',
    dropoutTotal: 0,
    dropoutTotalPct: '0%',
    dropoutFemale: 0,
    dropoutFemalePct: '0%',
  },
  {
    grade: 'ថ្នាក់ទី ៦',
    sem1Total: 35,
    sem1Female: 17,
    yearEndTotal: 35,
    yearEndFemale: 17,
    passedAvgTotal: 35,
    passedAvgTotalPct: '100%',
    passedAvgFemale: 17,
    passedAvgFemalePct: '100%',
    passedRetestTotal: 0,
    passedRetestTotalPct: '0%',
    passedRetestFemale: 0,
    passedRetestFemalePct: '0%',
    finalPassedTotal: 35,
    finalPassedTotalPct: '100%',
    finalPassedFemale: 17,
    finalPassedFemalePct: '100%',
    repeaterTotal: 0,
    repeaterTotalPct: '0%',
    repeaterFemale: 0,
    repeaterFemalePct: '0%',
    dropoutTotal: 0,
    dropoutTotalPct: '0%',
    dropoutFemale: 0,
    dropoutFemalePct: '0%',
  },
  {
    grade: 'សរុប',
    sem1Total: 247,
    sem1Female: 119,
    yearEndTotal: 247,
    yearEndFemale: 119,
    passedAvgTotal: 247,
    passedAvgTotalPct: '100%',
    passedAvgFemale: 119,
    passedAvgFemalePct: '100%',
    passedRetestTotal: 0,
    passedRetestTotalPct: '0%',
    passedRetestFemale: 0,
    passedRetestFemalePct: '0%',
    finalPassedTotal: 247,
    finalPassedTotalPct: '100%',
    finalPassedFemale: 119,
    finalPassedFemalePct: '100%',
    repeaterTotal: 0,
    repeaterTotalPct: '0%',
    repeaterFemale: 0,
    repeaterFemalePct: '0%',
    dropoutTotal: 0,
    dropoutTotalPct: '0%',
    dropoutFemale: 0,
    dropoutFemalePct: '0%',
  },
];

export const PostTestAcademicTable: React.FC<PostTestAcademicTableProps> = ({ report, onChange }) => {
  const rows = (report.postTestAcademicResults && report.postTestAcademicResults.length > 0)
    ? report.postTestAcademicResults
    : DEFAULT_POST_TEST_ROWS;

  const updateRows = (newRows: PostTestAcademicRow[]) => {
    onChange({
      ...report,
      postTestAcademicResults: newRows,
    });
  };

  const handleCellChange = (rowIndex: number, field: keyof PostTestAcademicRow, value: any) => {
    const updated = [...rows];
    updated[rowIndex] = {
      ...updated[rowIndex],
      [field]: value,
    };
    updateRows(updated);
  };

  const handleRecalculateFormulas = () => {
    const updated = rows.map((r, idx) => {
      if (idx === rows.length - 1 && r.grade === 'សរុប') {
        return r; // we'll calculate total row separately
      }

      // Column formulas
      const finalPassedTotal = Number(r.passedAvgTotal || 0) + Number(r.passedRetestTotal || 0); // 13=5+9
      const finalPassedFemale = Number(r.passedAvgFemale || 0) + Number(r.passedRetestFemale || 0); // 15=7+11
      const yearEndTotal = finalPassedTotal + Number(r.repeaterTotal || 0); // 3=13+17
      const yearEndFemale = finalPassedFemale + Number(r.repeaterFemale || 0); // 4=15+19
      const sem1Total = yearEndTotal + Number(r.dropoutTotal || 0); // 1=3+21
      const sem1Female = yearEndFemale + Number(r.dropoutFemale || 0); // 2=4+23

      const calcPct = (num: number, denom: number) => {
        if (!denom || denom === 0) return '0%';
        const p = (num * 100) / denom;
        return `${Math.round(p)}%`;
      };

      return {
        ...r,
        sem1Total,
        sem1Female,
        yearEndTotal,
        yearEndFemale,
        finalPassedTotal,
        finalPassedFemale,
        passedAvgTotalPct: calcPct(r.passedAvgTotal, sem1Total),
        passedAvgFemalePct: calcPct(r.passedAvgFemale, sem1Female),
        passedRetestTotalPct: calcPct(r.passedRetestTotal, sem1Total),
        passedRetestFemalePct: calcPct(r.passedRetestFemale, sem1Female),
        finalPassedTotalPct: calcPct(finalPassedTotal, sem1Total),
        finalPassedFemalePct: calcPct(finalPassedFemale, sem1Female),
        repeaterTotalPct: calcPct(r.repeaterTotal, sem1Total),
        repeaterFemalePct: calcPct(r.repeaterFemale, sem1Female),
        dropoutTotalPct: calcPct(r.dropoutTotal, sem1Total),
        dropoutFemalePct: calcPct(r.dropoutFemale, sem1Female),
      };
    });

    // Recompute total row
    const gradeRows = updated.slice(0, 6);
    const sum = (fn: (item: PostTestAcademicRow) => number) => gradeRows.reduce((a, b) => a + (Number(fn(b)) || 0), 0);

    const sem1Total = sum(r => r.sem1Total);
    const sem1Female = sum(r => r.sem1Female);
    const yearEndTotal = sum(r => r.yearEndTotal);
    const yearEndFemale = sum(r => r.yearEndFemale);
    const passedAvgTotal = sum(r => r.passedAvgTotal);
    const passedAvgFemale = sum(r => r.passedAvgFemale);
    const passedRetestTotal = sum(r => r.passedRetestTotal);
    const passedRetestFemale = sum(r => r.passedRetestFemale);
    const finalPassedTotal = sum(r => r.finalPassedTotal);
    const finalPassedFemale = sum(r => r.finalPassedFemale);
    const repeaterTotal = sum(r => r.repeaterTotal);
    const repeaterFemale = sum(r => r.repeaterFemale);
    const dropoutTotal = sum(r => r.dropoutTotal);
    const dropoutFemale = sum(r => r.dropoutFemale);

    const calcPct = (num: number, denom: number) => {
      if (!denom || denom === 0) return '0%';
      const p = (num * 100) / denom;
      return `${Math.round(p)}%`;
    };

    updated[updated.length - 1] = {
      grade: 'សរុប',
      sem1Total,
      sem1Female,
      yearEndTotal,
      yearEndFemale,
      passedAvgTotal,
      passedAvgTotalPct: calcPct(passedAvgTotal, sem1Total),
      passedAvgFemale,
      passedAvgFemalePct: calcPct(passedAvgFemale, sem1Female),
      passedRetestTotal,
      passedRetestTotalPct: calcPct(passedRetestTotal, sem1Total),
      passedRetestFemale,
      passedRetestFemalePct: calcPct(passedRetestFemale, sem1Female),
      finalPassedTotal,
      finalPassedTotalPct: calcPct(finalPassedTotal, sem1Total),
      finalPassedFemale,
      finalPassedFemalePct: calcPct(finalPassedFemale, sem1Female),
      repeaterTotal,
      repeaterTotalPct: calcPct(repeaterTotal, sem1Total),
      repeaterFemale,
      repeaterFemalePct: calcPct(repeaterFemale, sem1Female),
      dropoutTotal,
      dropoutTotalPct: calcPct(dropoutTotal, sem1Total),
      dropoutFemale,
      dropoutFemalePct: calcPct(dropoutFemale, sem1Female),
    };

    updateRows(updated);
  };

  const handleResetToDefault = () => {
    if (window.confirm('តើអ្នកពិតជាចង់ផ្ទុកទិន្នន័យគំរូតារាងលទ្ធផលសិក្សា ក្រោយធ្វើតេស្តចុងឆ្នាំរួច ឡើងវិញមែនទេ?')) {
      updateRows(DEFAULT_POST_TEST_ROWS);
    }
  };

  return (
    <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-4">
      {/* Header with Title & Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
        <div>
          <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-moul text-sky-950">
            លទ្ធផលសិក្សា ក្រោយធ្វើតេស្តចុងឆ្នាំរួច
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            តារាងស្ថិតិសិស្សសរុបពីថ្នាក់ទី១ ដល់៦ តាមកម្រងរូបមន្តក្រសួង MoEYS
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={handleRecalculateFormulas}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-semibold shadow-2xs transition-colors"
            title="គណនាដោយស្វ័យប្រវត្តិតាមរូបមន្ត 1=3+21, 13=5+9, % ..."
          >
            <Calculator className="w-3.5 h-3.5" />
            <span>គណនាតាមរូបមន្ត</span>
          </button>

          <button
            type="button"
            onClick={handleResetToDefault}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 transition-colors shadow-2xs"
            title="ផ្ទុកទិន្នន័យគំរូដើម"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>គំរូដើម</span>
          </button>
        </div>
      </div>

      {/* Table with full MoEYS structure */}
      <div className="overflow-x-auto">
        <table className="w-full text-xs text-center border-collapse border border-slate-300">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-sky-50/80 text-slate-800 font-bold">
              <th rowSpan={4} className="border border-slate-300 p-2 min-w-[70px] bg-slate-100">
                ថ្នាក់
              </th>
              <th colSpan={24} className="border border-slate-300 p-2 bg-sky-100/70 text-slate-900 font-bold">
                សិស្សសរុបពីថ្នាក់ទី១ ដល់៦
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-slate-100 text-slate-800 font-semibold">
              <th colSpan={2} className="border border-slate-300 p-1 bg-amber-50/60">ឆមាសទី១</th>
              <th colSpan={2} className="border border-slate-300 p-1 bg-blue-50/60">សិស្សចុងឆ្នាំ</th>
              <th colSpan={4} className="border border-slate-300 p-1 bg-emerald-50/60">សិស្សជាប់មធ្យមភាគ</th>
              <th colSpan={4} className="border border-slate-300 p-1 bg-cyan-50/60">សិស្សធ្វើតេស្តជាប់</th>
              <th colSpan={4} className="border border-slate-300 p-1 bg-teal-50/60">សរុបជាប់ចុងឆ្នាំ</th>
              <th colSpan={4} className="border border-slate-300 p-1 bg-orange-50/60">សិស្សត្រួតថ្នាក់</th>
              <th colSpan={4} className="border border-slate-300 p-1 bg-rose-50/60">សិស្សបោះបង់</th>
            </tr>

            {/* Header Row 3 */}
            <tr className="bg-slate-50 text-[11px] text-slate-700">
              {/* ឆមាសទី១ */}
              <th className="border border-slate-300 p-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-300 p-1 min-w-[42px]">ស្រី</th>
              {/* សិស្សចុងឆ្នាំ */}
              <th className="border border-slate-300 p-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-300 p-1 min-w-[42px]">ស្រី</th>
              {/* សិស្សជាប់មធ្យមភាគ */}
              <th className="border border-slate-300 p-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              <th className="border border-slate-300 p-1 min-w-[42px]">ស្រី</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              {/* សិស្សធ្វើតេស្តជាប់ */}
              <th className="border border-slate-300 p-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              <th className="border border-slate-300 p-1 min-w-[42px]">ស្រី</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              {/* សរុបជាប់ចុងឆ្នាំ */}
              <th className="border border-slate-300 p-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              <th className="border border-slate-300 p-1 min-w-[42px]">ស្រី</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              {/* សិស្សត្រួតថ្នាក់ */}
              <th className="border border-slate-300 p-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              <th className="border border-slate-300 p-1 min-w-[42px]">ស្រី</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              {/* សិស្សបោះបង់ */}
              <th className="border border-slate-300 p-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
              <th className="border border-slate-300 p-1 min-w-[42px]">ស្រី</th>
              <th className="border border-slate-300 p-1 min-w-[40px]">%</th>
            </tr>

            {/* Header Row 4 (Formulas) */}
            <tr className="bg-slate-100/90 text-[10px] text-slate-500 font-mono">
              <th className="border border-slate-300 p-0.5">1=3+21</th>
              <th className="border border-slate-300 p-0.5">2=4+23</th>
              <th className="border border-slate-300 p-0.5">3=13+17</th>
              <th className="border border-slate-300 p-0.5">4=15+19</th>
              <th className="border border-slate-300 p-0.5">5</th>
              <th className="border border-slate-300 p-0.5">6=5x10/1</th>
              <th className="border border-slate-300 p-0.5">7</th>
              <th className="border border-slate-300 p-0.5">8=7x10/2</th>
              <th className="border border-slate-300 p-0.5">9</th>
              <th className="border border-slate-300 p-0.5">10=9x10/1</th>
              <th className="border border-slate-300 p-0.5">11</th>
              <th className="border border-slate-300 p-0.5">12=11x10/2</th>
              <th className="border border-slate-300 p-0.5">13=5+9</th>
              <th className="border border-slate-300 p-0.5">14=13x10/1</th>
              <th className="border border-slate-300 p-0.5">15=7+11</th>
              <th className="border border-slate-300 p-0.5">16=15x10/2</th>
              <th className="border border-slate-300 p-0.5">17</th>
              <th className="border border-slate-300 p-0.5">18=17x10/1</th>
              <th className="border border-slate-300 p-0.5">19</th>
              <th className="border border-slate-300 p-0.5">20=19x10/2</th>
              <th className="border border-slate-300 p-0.5">21</th>
              <th className="border border-slate-300 p-0.5">22=21x10/1</th>
              <th className="border border-slate-300 p-0.5">23</th>
              <th className="border border-slate-300 p-0.5">24=23x10/2</th>
            </tr>
          </thead>

          <tbody className="divide-y divide-slate-200">
            {rows.map((r, idx) => {
              const isTotal = r.grade === 'សរុប' || idx === rows.length - 1;
              return (
                <tr
                  key={r.grade || idx}
                  className={`hover:bg-sky-50/40 transition-colors ${
                    isTotal ? 'bg-slate-100/90 font-bold text-slate-900' : ''
                  }`}
                >
                  {/* Grade name */}
                  <td className={`border border-slate-300 p-1.5 font-medium ${isTotal ? 'bg-slate-200' : 'bg-slate-50'}`}>
                    {r.grade}
                  </td>

                  {/* 1. ឆមាសទី១ សរុប */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.sem1Total}
                      onChange={e => handleCellChange(idx, 'sem1Total', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                    />
                  </td>

                  {/* 2. ឆមាសទី១ ស្រី */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.sem1Female}
                      onChange={e => handleCellChange(idx, 'sem1Female', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                    />
                  </td>

                  {/* 3. សិស្សចុងឆ្នាំ សរុប */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.yearEndTotal}
                      onChange={e => handleCellChange(idx, 'yearEndTotal', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                    />
                  </td>

                  {/* 4. សិស្សចុងឆ្នាំ ស្រី */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.yearEndFemale}
                      onChange={e => handleCellChange(idx, 'yearEndFemale', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                    />
                  </td>

                  {/* 5. សិស្សជាប់មធ្យមភាគ សរុប */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.passedAvgTotal}
                      onChange={e => handleCellChange(idx, 'passedAvgTotal', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none font-semibold text-emerald-700"
                    />
                  </td>

                  {/* 6. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.passedAvgTotalPct || ''}
                      onChange={e => handleCellChange(idx, 'passedAvgTotalPct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>

                  {/* 7. សិស្សជាប់មធ្យមភាគ ស្រី */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.passedAvgFemale}
                      onChange={e => handleCellChange(idx, 'passedAvgFemale', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-emerald-700"
                    />
                  </td>

                  {/* 8. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.passedAvgFemalePct || ''}
                      onChange={e => handleCellChange(idx, 'passedAvgFemalePct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>

                  {/* 9. សិស្សធ្វើតេស្តជាប់ សរុប */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.passedRetestTotal || 0}
                      onChange={e => handleCellChange(idx, 'passedRetestTotal', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                    />
                  </td>

                  {/* 10. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.passedRetestTotalPct || '0%'}
                      onChange={e => handleCellChange(idx, 'passedRetestTotalPct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>

                  {/* 11. សិស្សធ្វើតេស្តជាប់ ស្រី */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.passedRetestFemale || 0}
                      onChange={e => handleCellChange(idx, 'passedRetestFemale', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none"
                    />
                  </td>

                  {/* 12. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.passedRetestFemalePct || '0%'}
                      onChange={e => handleCellChange(idx, 'passedRetestFemalePct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>

                  {/* 13. សរុបជាប់ចុងឆ្នាំ សរុប */}
                  <td className="border border-slate-300 p-1 bg-emerald-50/40">
                    <input
                      type="number"
                      value={r.finalPassedTotal}
                      onChange={e => handleCellChange(idx, 'finalPassedTotal', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none font-bold text-emerald-800"
                    />
                  </td>

                  {/* 14. % */}
                  <td className="border border-slate-300 p-1 bg-emerald-50/40">
                    <input
                      type="text"
                      value={r.finalPassedTotalPct || ''}
                      onChange={e => handleCellChange(idx, 'finalPassedTotalPct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px] font-semibold text-emerald-800"
                    />
                  </td>

                  {/* 15. សរុបជាប់ចុងឆ្នាំ ស្រី */}
                  <td className="border border-slate-300 p-1 bg-emerald-50/40">
                    <input
                      type="number"
                      value={r.finalPassedFemale}
                      onChange={e => handleCellChange(idx, 'finalPassedFemale', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none font-semibold text-emerald-800"
                    />
                  </td>

                  {/* 16. % */}
                  <td className="border border-slate-300 p-1 bg-emerald-50/40">
                    <input
                      type="text"
                      value={r.finalPassedFemalePct || ''}
                      onChange={e => handleCellChange(idx, 'finalPassedFemalePct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px] font-semibold text-emerald-800"
                    />
                  </td>

                  {/* 17. សិស្សត្រួតថ្នាក់ សរុប */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.repeaterTotal || 0}
                      onChange={e => handleCellChange(idx, 'repeaterTotal', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-rose-600"
                    />
                  </td>

                  {/* 18. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.repeaterTotalPct || '0%'}
                      onChange={e => handleCellChange(idx, 'repeaterTotalPct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>

                  {/* 19. សិស្សត្រួតថ្នាក់ ស្រី */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.repeaterFemale || 0}
                      onChange={e => handleCellChange(idx, 'repeaterFemale', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-rose-600"
                    />
                  </td>

                  {/* 20. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.repeaterFemalePct || '0%'}
                      onChange={e => handleCellChange(idx, 'repeaterFemalePct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>

                  {/* 21. សិស្សបោះបង់ សរុប */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.dropoutTotal || 0}
                      onChange={e => handleCellChange(idx, 'dropoutTotal', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-red-600"
                    />
                  </td>

                  {/* 22. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.dropoutTotalPct || '0%'}
                      onChange={e => handleCellChange(idx, 'dropoutTotalPct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>

                  {/* 23. សិស្សបោះបង់ ស្រី */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="number"
                      value={r.dropoutFemale || 0}
                      onChange={e => handleCellChange(idx, 'dropoutFemale', Number(e.target.value))}
                      className="w-12 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-red-600"
                    />
                  </td>

                  {/* 24. % */}
                  <td className="border border-slate-300 p-1">
                    <input
                      type="text"
                      value={r.dropoutFemalePct || '0%'}
                      onChange={e => handleCellChange(idx, 'dropoutFemalePct', e.target.value)}
                      className="w-11 text-center p-0.5 bg-transparent border-b border-transparent focus:border-sky-500 focus:outline-none text-[11px]"
                    />
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {/* Helper note */}
      <div className="flex items-center gap-2 p-2.5 rounded-lg bg-slate-50 border border-slate-200 text-xs text-slate-600">
        <Sparkles className="w-4 h-4 text-amber-500 shrink-0" />
        <span>
          <strong>រូបមន្តគណនារបស់ក្រសួង៖</strong> 1=3+21 (ឆមាសទី១=ចុងឆ្នាំ+បោះបង់), 3=13+17 (ចុងឆ្នាំ=ជាប់+ត្រួត), 13=5+9 (សរុបជាប់=មធ្យមភាគ+ធ្វើតេស្តជាប់)។ ចុច <strong>«គណនាតាមរូបមន្ត»</strong> ដើម្បីគណនាតម្លៃ និងភាគរយដោយស្វ័យប្រវត្តិ។
        </span>
      </div>
    </div>
  );
};
