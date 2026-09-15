import React from 'react';
import { Table2RowInput } from '../types';
import { formatPct } from '../data/initialData';
import { Calculator } from 'lucide-react';

interface Props {
  rows: Table2RowInput[];
  onChange: (rows: Table2RowInput[]) => void;
  showFormulas: boolean;
}

export const Table2AcademicResultsView: React.FC<Props> = ({ rows, onChange, showFormulas }) => {
  const updateRow = (index: number, field: keyof Table2RowInput, val: number) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: num,
    };
    onChange(updated);
  };

  // Calculate row derived values
  const computedRows = rows.map((r) => {
    // 1 = 3 + 7 + 15
    const sem1Total = (Number(r.passedAvgTotal) || 0) + (Number(r.failedAvgTotal) || 0) + (Number(r.dropoutTotal) || 0);
    // 2 = 5 + 9 + 17
    const sem1Female = (Number(r.passedAvgFemale) || 0) + (Number(r.failedAvgFemale) || 0) + (Number(r.dropoutFemale) || 0);

    const c3 = Number(r.passedAvgTotal) || 0;
    const c4 = formatPct(c3, sem1Total);

    const c5 = Number(r.passedAvgFemale) || 0;
    const c6 = formatPct(c5, sem1Female);

    const c7 = Number(r.failedAvgTotal) || 0;
    const c8 = formatPct(c7, sem1Total);

    const c9 = Number(r.failedAvgFemale) || 0;
    const c10 = formatPct(c9, sem1Female);

    const c11 = Number(r.failedSubTotal) || 0;
    const c12 = formatPct(c11, c7);

    const c13 = Number(r.failedSubFemale) || 0;
    const c14 = formatPct(c13, c9);

    const c15 = Number(r.dropoutTotal) || 0;
    const c16 = formatPct(c15, sem1Total);

    const c17 = Number(r.dropoutFemale) || 0;
    const c18 = formatPct(c17, sem1Female);

    return {
      ...r,
      sem1Total,
      sem1Female,
      c3, c4, c5, c6,
      c7, c8, c9, c10,
      c11, c12, c13, c14,
      c15, c16, c17, c18,
    };
  });

  // Total Row calculations
  const totalSem1 = computedRows.reduce((a, b) => a + b.sem1Total, 0);
  const totalSem1Female = computedRows.reduce((a, b) => a + b.sem1Female, 0);

  const totalC3 = computedRows.reduce((a, b) => a + b.c3, 0);
  const totalC4 = formatPct(totalC3, totalSem1);
  const totalC5 = computedRows.reduce((a, b) => a + b.c5, 0);
  const totalC6 = formatPct(totalC5, totalSem1Female);

  const totalC7 = computedRows.reduce((a, b) => a + b.c7, 0);
  const totalC8 = formatPct(totalC7, totalSem1);
  const totalC9 = computedRows.reduce((a, b) => a + b.c9, 0);
  const totalC10 = formatPct(totalC9, totalSem1Female);

  const totalC11 = computedRows.reduce((a, b) => a + b.c11, 0);
  const totalC12 = formatPct(totalC11, totalC7);
  const totalC13 = computedRows.reduce((a, b) => a + b.c13, 0);
  const totalC14 = formatPct(totalC13, totalC9);

  const totalC15 = computedRows.reduce((a, b) => a + b.c15, 0);
  const totalC16 = formatPct(totalC15, totalSem1);
  const totalC17 = computedRows.reduce((a, b) => a + b.c17, 0);
  const totalC18 = formatPct(totalC17, totalSem1Female);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-emerald-100 text-emerald-800 text-xs font-bold flex items-center justify-center">២</span>
            <span>តារាងលទ្ធផលសិក្សា</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            លទ្ធផលសិក្សាឆមាសទី១ សិស្សជាប់មធ្យមភាគ ធ្លាក់មធ្យមភាគ (០-៤.៩៩ និង ៤.០០-៤.៩៩) និងសិស្សបោះបង់
          </p>
        </div>

        {showFormulas && (
          <div className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>គណនាស្វ័យប្រវត្ត: 1=3+7+15 | 2=5+9+17 | 4=3*100/1 | 6=5*100/2 | 8=7*100/1 ...</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto table-scrollbar p-3">
        <table className="w-full border-collapse border border-slate-400 text-center text-xs">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-slate-100 text-slate-800 font-semibold">
              <th rowSpan={4} className="border border-slate-400 p-2 min-w-[70px]">
                ថ្នាក់
              </th>
              <th colSpan={18} className="border border-slate-400 p-2 bg-emerald-50/70 text-slate-800 font-bold">
                សិស្សសរុបពីថ្នាក់ទី១ ដល់៦
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-slate-100 text-slate-700 font-medium">
              <th colSpan={2} className="border border-slate-400 px-1 py-1 bg-blue-50/70 text-blue-900 font-bold">
                ឆមាស១
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-emerald-50 text-emerald-900 font-bold">
                សិស្សជាប់មធ្យមភាគ
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-amber-50 text-amber-900 font-bold">
                សិស្សធ្លាក់មធ្យមភាគ 0-4.99
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-orange-50 text-orange-900 font-bold">
                សិស្សធ្លាក់មធ្យមភាគ 4.00-4.99
              </th>
              <th colSpan={4} className="border border-slate-400 px-1 py-1 bg-rose-50 text-rose-900 font-bold">
                សិស្សបោះបង់
              </th>
            </tr>

            {/* Header Row 3 */}
            <tr className="bg-slate-100 text-slate-700 font-medium">
              {/* Semester 1 */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Passed */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
              {/* Failed 0-4.99 */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
              {/* Failed 4.00-4.99 */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
              {/* Dropouts */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[38px] text-slate-500">%</th>
            </tr>

            {/* Header Row 4: Explicit Formula definitions matching prompt */}
            <tr className="bg-slate-200/90 text-slate-700 text-[10px] font-mono font-medium">
              <th className="border border-slate-400 px-0.5 py-1 bg-blue-100/60" title="ឆមាស១ សរុប = ជាប់(3) + ធ្លាក់(7) + បោះបង់(15)">1=3+7+15</th>
              <th className="border border-slate-400 px-0.5 py-1 bg-blue-100/60 text-pink-900" title="ឆមាស១ ស្រី = ស្រីជាប់(5) + ស្រីធ្លាក់(9) + ស្រីបោះបង់(17)">2=5+9+17</th>
              <th className="border border-slate-400 px-0.5 py-1">3</th>
              <th className="border border-slate-400 px-0.5 py-1 text-emerald-800">4=3x100/1</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">5</th>
              <th className="border border-slate-400 px-0.5 py-1 text-emerald-800">6=5x100/2</th>
              <th className="border border-slate-400 px-0.5 py-1">7</th>
              <th className="border border-slate-400 px-0.5 py-1 text-amber-800">8=7x100/1</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">9</th>
              <th className="border border-slate-400 px-0.5 py-1 text-amber-800">10=9x100/2</th>
              <th className="border border-slate-400 px-0.5 py-1">11</th>
              <th className="border border-slate-400 px-0.5 py-1 text-orange-800">12=11x100/7</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">13</th>
              <th className="border border-slate-400 px-0.5 py-1 text-orange-800">14=13x100/9</th>
              <th className="border border-slate-400 px-0.5 py-1">15</th>
              <th className="border border-slate-400 px-0.5 py-1 text-rose-800">16=15x100/1</th>
              <th className="border border-slate-400 px-0.5 py-1 text-pink-700">17</th>
              <th className="border border-slate-400 px-0.5 py-1 text-rose-800">18=17x100/2</th>
            </tr>
          </thead>

          <tbody>
            {computedRows.map((r, i) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-400 p-1 font-semibold text-slate-800 whitespace-nowrap bg-slate-50">
                  {r.gradeLabel}
                </td>

                {/* 1: Sem1 Total [AUTO-CALCULATED] */}
                <td className="border border-slate-400 p-1 bg-blue-50/70 font-bold text-blue-900">
                  <span id={`t2-${r.id}-sem1-total`} title="3+7+15">{r.sem1Total}</span>
                </td>
                {/* 2: Sem1 Female [AUTO-CALCULATED] */}
                <td className="border border-slate-400 p-1 bg-pink-50/70 font-bold text-pink-900">
                  <span id={`t2-${r.id}-sem1-female`} title="5+9+17">{r.sem1Female}</span>
                </td>

                {/* 3: Passed Avg Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c3`}
                    type="number"
                    min="0"
                    value={r.passedAvgTotal || ''}
                    onChange={(e) => updateRow(i, 'passedAvgTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 4: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-slate-700">
                  <span id={`t2-${r.id}-c4`}>{r.c4}</span>
                </td>

                {/* 5: Passed Avg Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c5`}
                    type="number"
                    min="0"
                    value={r.passedAvgFemale || ''}
                    onChange={(e) => updateRow(i, 'passedAvgFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 6: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-pink-700">
                  <span id={`t2-${r.id}-c6`}>{r.c6}</span>
                </td>

                {/* 7: Failed Avg 0-4.99 Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c7`}
                    type="number"
                    min="0"
                    value={r.failedAvgTotal || ''}
                    onChange={(e) => updateRow(i, 'failedAvgTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 8: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-slate-700">
                  <span id={`t2-${r.id}-c8`}>{r.c8}</span>
                </td>

                {/* 9: Failed Avg 0-4.99 Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c9`}
                    type="number"
                    min="0"
                    value={r.failedAvgFemale || ''}
                    onChange={(e) => updateRow(i, 'failedAvgFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 10: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-pink-700">
                  <span id={`t2-${r.id}-c10`}>{r.c10}</span>
                </td>

                {/* 11: Failed Sub 4.00-4.99 Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c11`}
                    type="number"
                    min="0"
                    value={r.failedSubTotal || ''}
                    onChange={(e) => updateRow(i, 'failedSubTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 12: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-slate-700">
                  <span id={`t2-${r.id}-c12`}>{r.c12}</span>
                </td>

                {/* 13: Failed Sub 4.00-4.99 Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c13`}
                    type="number"
                    min="0"
                    value={r.failedSubFemale || ''}
                    onChange={(e) => updateRow(i, 'failedSubFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 14: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-pink-700">
                  <span id={`t2-${r.id}-c14`}>{r.c14}</span>
                </td>

                {/* 15: Dropout Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c15`}
                    type="number"
                    min="0"
                    value={r.dropoutTotal || ''}
                    onChange={(e) => updateRow(i, 'dropoutTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 16: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-slate-700">
                  <span id={`t2-${r.id}-c16`}>{r.c16}</span>
                </td>

                {/* 17: Dropout Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t2-${r.id}-c17`}
                    type="number"
                    min="0"
                    value={r.dropoutFemale || ''}
                    onChange={(e) => updateRow(i, 'dropoutFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 18: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50/80 font-medium text-pink-700">
                  <span id={`t2-${r.id}-c18`}>{r.c18}</span>
                </td>
              </tr>
            ))}

            {/* Total Row [AUTO-CALCULATED ACROSS ALL COLUMNS] */}
            <tr className="bg-emerald-50/80 text-slate-900 font-bold border-t-2 border-slate-500">
              <td className="border border-slate-400 p-1.5 text-center font-bold text-emerald-950">
                សរុប
              </td>
              <td className="border border-slate-400 p-1 text-center bg-blue-100/70 font-bold text-blue-900">
                <span id="t2-total-sem1">{totalSem1}</span>
              </td>
              <td className="border border-slate-400 p-1 text-center bg-pink-100/70 font-bold text-pink-900">
                <span id="t2-total-sem1-female">{totalSem1Female}</span>
              </td>

              <td className="border border-slate-400 p-1 text-center">{totalC3}</td>
              <td className="border border-slate-400 p-1 text-center text-emerald-800">{totalC4}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC5}</td>
              <td className="border border-slate-400 p-1 text-center text-emerald-800">{totalC6}</td>

              <td className="border border-slate-400 p-1 text-center">{totalC7}</td>
              <td className="border border-slate-400 p-1 text-center text-amber-800">{totalC8}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC9}</td>
              <td className="border border-slate-400 p-1 text-center text-amber-800">{totalC10}</td>

              <td className="border border-slate-400 p-1 text-center">{totalC11}</td>
              <td className="border border-slate-400 p-1 text-center text-orange-800">{totalC12}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC13}</td>
              <td className="border border-slate-400 p-1 text-center text-orange-800">{totalC14}</td>

              <td className="border border-slate-400 p-1 text-center">{totalC15}</td>
              <td className="border border-slate-400 p-1 text-center text-rose-800">{totalC16}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC17}</td>
              <td className="border border-slate-400 p-1 text-center text-rose-800">{totalC18}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex flex-wrap items-center justify-between text-xs text-slate-500 gap-2">
        <div className="flex items-center gap-4">
          <span>សិស្សជាប់មធ្យមភាគសរុប: <strong className="text-emerald-700 font-bold">{totalC3}</strong> នាក់ ({totalC4})</span>
          <span>ធ្លាក់: <strong className="text-amber-700 font-bold">{totalC7}</strong> នាក់ ({totalC8})</span>
          <span>បោះបង់: <strong className="text-rose-700 font-bold">{totalC15}</strong> នាក់ ({totalC16})</span>
        </div>
      </div>
    </div>
  );
};
