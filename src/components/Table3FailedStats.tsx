import React from 'react';
import { Table3RowInput } from '../types';
import { formatPct } from '../data/initialData';
import { Calculator } from 'lucide-react';

interface Props {
  rows: Table3RowInput[];
  onChange: (rows: Table3RowInput[]) => void;
  showFormulas: boolean;
}

export const Table3FailedStatsView: React.FC<Props> = ({ rows, onChange, showFormulas }) => {
  const updateRow = (index: number, field: keyof Table3RowInput, val: number) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    const updated = [...rows];
    updated[index] = {
      ...updated[index],
      [field]: num,
    };
    onChange(updated);
  };

  // Compute calculated columns for each row
  const computedRows = rows.map((r) => {
    const c1 = Number(r.testedTotal) || 0;
    const c2 = Number(r.testedFemale) || 0;
    const c3 = Number(r.passedTotal) || 0;
    const c4 = formatPct(c3, c1);
    const c5 = Number(r.passedFemale) || 0;
    const c6 = formatPct(c5, c2);

    // 7 = 1 - 3
    const c7 = Math.max(0, c1 - c3);
    const c8 = formatPct(c7, c1);

    // 9 = 2 - 5
    const c9 = Math.max(0, c2 - c5);
    const c10 = formatPct(c9, c2);

    return {
      ...r,
      c1, c2, c3, c4, c5, c6, c7, c8, c9, c10,
    };
  });

  // Total sums
  const totalC1 = computedRows.reduce((a, b) => a + b.c1, 0);
  const totalC2 = computedRows.reduce((a, b) => a + b.c2, 0);
  const totalC3 = computedRows.reduce((a, b) => a + b.c3, 0);
  const totalC4 = formatPct(totalC3, totalC1);
  const totalC5 = computedRows.reduce((a, b) => a + b.c5, 0);
  const totalC6 = formatPct(totalC5, totalC2);

  const totalC7 = Math.max(0, totalC1 - totalC3);
  const totalC8 = formatPct(totalC7, totalC1);
  const totalC9 = Math.max(0, totalC2 - totalC5);
  const totalC10 = formatPct(totalC9, totalC2);

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-amber-100 text-amber-800 text-xs font-bold flex items-center justify-center">៣</span>
            <span>តារាងស្ថិតិសិស្សធ្លាក់ (ការធ្វើតេស្តសិស្សធ្លាក់)</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ចំនួនសិស្សត្រួតសរុប សិស្សធ្វើតេស្តជាប់ និងសិស្សធ្វើតេស្តធ្លាក់ (គណនាស្វ័យប្រវត្ត)
          </p>
        </div>

        {showFormulas && (
          <div className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>រូបមន្ត: 4=3*100/1 | 6=5*100/2 | 7=1-3 | 8=7*100/1 | 9=2-5 | 10=9*100/2</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto table-scrollbar p-3">
        <table className="w-full border-collapse border border-slate-400 text-center text-xs sm:text-sm">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-slate-100 text-slate-800 font-semibold">
              <th rowSpan={4} className="border border-slate-400 p-2 min-w-[90px]">
                ថ្នាក់
              </th>
              <th colSpan={10} className="border border-slate-400 p-2 bg-amber-50/70 text-slate-800 font-bold">
                ថ្នាក់ទី ១ ដល់ ៦
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-slate-100 text-slate-700 font-medium">
              <th colSpan={2} className="border border-slate-400 px-2 py-1 bg-blue-50 text-blue-900 font-bold">
                ត្រួតសរុប
              </th>
              <th colSpan={4} className="border border-slate-400 px-2 py-1 bg-emerald-50 text-emerald-900 font-bold">
                ធ្វើតេស្ដជាប់
              </th>
              <th colSpan={4} className="border border-slate-400 px-2 py-1 bg-rose-50 text-rose-900 font-bold">
                ធ្វើតេស្ដធ្លាក់
              </th>
            </tr>

            {/* Header Row 3 */}
            <tr className="bg-slate-100 text-slate-700 font-medium text-xs">
              <th className="border border-slate-400 px-2 py-1 min-w-[55px]">សរុប</th>
              <th className="border border-slate-400 px-2 py-1 min-w-[50px] text-pink-700">ស្រី</th>

              <th className="border border-slate-400 px-2 py-1 min-w-[55px]">សរុប</th>
              <th className="border border-slate-400 px-2 py-1 min-w-[45px] text-slate-500">%</th>
              <th className="border border-slate-400 px-2 py-1 min-w-[50px] text-pink-700">ស្រី</th>
              <th className="border border-slate-400 px-2 py-1 min-w-[45px] text-slate-500">%</th>

              <th className="border border-slate-400 px-2 py-1 min-w-[55px] bg-rose-100/60 text-rose-900 font-bold">សរុប</th>
              <th className="border border-slate-400 px-2 py-1 min-w-[45px] text-slate-500">%</th>
              <th className="border border-slate-400 px-2 py-1 min-w-[50px] bg-rose-100/60 text-pink-900 font-bold">ស្រី</th>
              <th className="border border-slate-400 px-2 py-1 min-w-[45px] text-slate-500">%</th>
            </tr>

            {/* Header Row 4: Exact formula row */}
            <tr className="bg-slate-200/90 text-slate-700 text-[10px] font-mono font-medium">
              <th className="border border-slate-400 px-1 py-1">1</th>
              <th className="border border-slate-400 px-1 py-1 text-pink-700">2</th>
              <th className="border border-slate-400 px-1 py-1">3</th>
              <th className="border border-slate-400 px-1 py-1 text-emerald-800">4=3*100/1</th>
              <th className="border border-slate-400 px-1 py-1 text-pink-700">5</th>
              <th className="border border-slate-400 px-1 py-1 text-emerald-800">6=5*100/2</th>
              <th className="border border-slate-400 px-1 py-1 bg-rose-100/70 text-rose-900" title="ធ្លាក់សរុប = ត្រួតសរុប - ជាប់ (1-3)">7=1-3</th>
              <th className="border border-slate-400 px-1 py-1 text-rose-800">8=7*100/1</th>
              <th className="border border-slate-400 px-1 py-1 bg-rose-100/70 text-pink-900" title="ធ្លាក់ស្រី = ស្រីត្រួត - ស្រីជាប់ (2-5)">9=2-5</th>
              <th className="border border-slate-400 px-1 py-1 text-rose-800">10=9*100/2</th>
            </tr>
          </thead>

          <tbody>
            {computedRows.map((r, i) => (
              <tr key={r.id} className="hover:bg-slate-50 transition-colors">
                <td className="border border-slate-400 p-1.5 font-semibold text-slate-800 bg-slate-50 whitespace-nowrap">
                  {r.gradeLabel}
                </td>

                {/* 1: Tested Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t3-${r.id}-c1`}
                    type="number"
                    min="0"
                    value={r.testedTotal || ''}
                    onChange={(e) => updateRow(i, 'testedTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 2: Tested Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t3-${r.id}-c2`}
                    type="number"
                    min="0"
                    value={r.testedFemale || ''}
                    onChange={(e) => updateRow(i, 'testedFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>

                {/* 3: Pass Test Total (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t3-${r.id}-c3`}
                    type="number"
                    min="0"
                    value={r.passedTotal || ''}
                    onChange={(e) => updateRow(i, 'passedTotal', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                  />
                </td>
                {/* 4: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-slate-700">
                  <span id={`t3-${r.id}-c4`}>{r.c4}</span>
                </td>

                {/* 5: Pass Test Female (Input) */}
                <td className="border border-slate-400 p-1">
                  <input
                    id={`t3-${r.id}-c5`}
                    type="number"
                    min="0"
                    value={r.passedFemale || ''}
                    onChange={(e) => updateRow(i, 'passedFemale', parseInt(e.target.value) || 0)}
                    className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                  />
                </td>
                {/* 6: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-pink-700">
                  <span id={`t3-${r.id}-c6`}>{r.c6}</span>
                </td>

                {/* 7: Fail Test Total [AUTO: 1 - 3] */}
                <td className="border border-slate-400 p-1 bg-rose-50/70 font-bold text-rose-900">
                  <span id={`t3-${r.id}-c7`} title="1 - 3">{r.c7}</span>
                </td>
                {/* 8: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-rose-700">
                  <span id={`t3-${r.id}-c8`}>{r.c8}</span>
                </td>

                {/* 9: Fail Test Female [AUTO: 2 - 5] */}
                <td className="border border-slate-400 p-1 bg-rose-50/70 font-bold text-pink-900">
                  <span id={`t3-${r.id}-c9`} title="2 - 5">{r.c9}</span>
                </td>
                {/* 10: % [AUTO] */}
                <td className="border border-slate-400 p-1 bg-slate-50 font-medium text-rose-700">
                  <span id={`t3-${r.id}-c10`}>{r.c10}</span>
                </td>
              </tr>
            ))}

            {/* Total Row */}
            <tr className="bg-amber-50/80 text-slate-900 font-bold border-t-2 border-slate-500">
              <td className="border border-slate-400 p-2 text-center font-bold text-amber-950">
                សរុប
              </td>
              <td className="border border-slate-400 p-1 text-center">{totalC1}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC2}</td>
              <td className="border border-slate-400 p-1 text-center">{totalC3}</td>
              <td className="border border-slate-400 p-1 text-center text-emerald-800">{totalC4}</td>
              <td className="border border-slate-400 p-1 text-center text-pink-700">{totalC5}</td>
              <td className="border border-slate-400 p-1 text-center text-emerald-800">{totalC6}</td>
              <td className="border border-slate-400 p-1 text-center bg-rose-100/70 text-rose-900">{totalC7}</td>
              <td className="border border-slate-400 p-1 text-center text-rose-800">{totalC8}</td>
              <td className="border border-slate-400 p-1 text-center bg-rose-100/70 text-pink-900">{totalC9}</td>
              <td className="border border-slate-400 p-1 text-center text-rose-800">{totalC10}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div>
          <span>សិស្សធ្វើតេស្តសរុប: <strong className="text-slate-800 font-bold">{totalC1}</strong> នាក់ | ជាប់: <strong className="text-emerald-700 font-bold">{totalC3}</strong> នាក់ ({totalC4}) | ធ្លាក់: <strong className="text-rose-700 font-bold">{totalC7}</strong> នាក់ ({totalC8})</span>
        </div>
      </div>
    </div>
  );
};
