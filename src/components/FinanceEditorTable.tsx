import React from 'react';
import { 
  Plus, 
  Trash2, 
  RotateCcw, 
  Coins, 
  Calendar,
  Sparkles,
  ArrowDown,
  ArrowUp
} from 'lucide-react';
import { FullSchoolReport, FinanceItemRow } from '../types';

interface FinanceEditorTableProps {
  report: FullSchoolReport;
  onChange: (updated: FullSchoolReport) => void;
}

const DEFAULT_ROWS_TEMPLATE: FinanceItemRow[] = [
  {
    id: 'fin-1',
    description: 'សាងសង់អគារសិក្សាពហុបំណង',
    quantity: '២ខ្នង ៣បន្ទប់',
    totalAmount: '',
    budgetSource: '- SOF\n- HCC\n- សហគមន៍',
    deficit: '',
  },
  {
    id: 'fin-2',
    description: 'ជួសជុលអគារ',
    quantity: '១ខ្នង ២បន្ទប់',
    totalAmount: '',
    budgetSource: '- SOF\n- HCC',
    deficit: '',
  },
  {
    id: 'fin-3',
    description: 'ធ្វើរបង(ភ្លើ)',
    quantity: '៤០ម៉ែត្រ',
    totalAmount: '',
    budgetSource: '- WVSI',
    deficit: '',
  },
  {
    id: 'fin-4',
    description: 'សង្គ្រោះនិងកែលម្អសោភ័ណភាពសាលា',
    quantity: 'ចាក់ដីទីធ្លាសាលា',
    totalAmount: '',
    budgetSource: '- WVSI\n- SOF\n- សហគមន៍',
    deficit: '',
  },
  {
    id: 'fin-5',
    description: 'សម្ភារបង្រៀន និងរៀន',
    quantity: 'សម្ភារតូចតាច សង្ខេប',
    totalAmount: '',
    budgetSource: '- SOF',
    deficit: '',
  },
  {
    id: 'fin-6',
    description: 'សម្ភារការិយាល័យ',
    quantity: 'គាំទ្រកិច្ចដំណើរ',
    totalAmount: '',
    budgetSource: '- SOF',
    deficit: '',
  },
];

const COMMON_SOURCES = ['SOF', 'HCC', 'សហគមន៍', 'WVSI', 'PB', 'សប្បុរសជន'];

export const FinanceEditorTable: React.FC<FinanceEditorTableProps> = ({ report, onChange }) => {
  const rows = report.finances?.tableRows || DEFAULT_ROWS_TEMPLATE;
  const periodNote = report.finances?.periodNote || 'ចាប់ពីខែ តុលា ដល់ ខែ កញ្ញា';

  const updateFinance = (updater: (prevFinances: typeof report.finances) => typeof report.finances) => {
    onChange({
      ...report,
      finances: updater(report.finances || {
        periodNote,
        tableRows: DEFAULT_ROWS_TEMPLATE,
      }),
    });
  };

  const handleRowChange = (index: number, field: keyof FinanceItemRow, value: string) => {
    updateFinance(prev => {
      const newRows = [...(prev.tableRows || DEFAULT_ROWS_TEMPLATE)];
      newRows[index] = {
        ...newRows[index],
        [field]: value,
      };
      return {
        ...prev,
        tableRows: newRows,
      };
    });
  };

  const handleAddRow = () => {
    updateFinance(prev => ({
      ...prev,
      tableRows: [
        ...(prev.tableRows || DEFAULT_ROWS_TEMPLATE),
        {
          id: `fin-${Date.now()}`,
          description: '',
          quantity: '',
          totalAmount: '',
          budgetSource: '- SOF',
          deficit: '',
        },
      ],
    }));
  };

  const handleDeleteRow = (index: number) => {
    if (rows.length <= 1) {
      alert('ត្រូវរក្សាទុកយ៉ាងហោចណាស់ ១ ជួរ');
      return;
    }
    updateFinance(prev => {
      const newRows = [...(prev.tableRows || DEFAULT_ROWS_TEMPLATE)];
      newRows.splice(index, 1);
      return {
        ...prev,
        tableRows: newRows,
      };
    });
  };

  const handleMoveRow = (index: number, direction: 'up' | 'down') => {
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= rows.length) return;

    updateFinance(prev => {
      const newRows = [...(prev.tableRows || DEFAULT_ROWS_TEMPLATE)];
      const temp = newRows[index];
      newRows[index] = newRows[targetIndex];
      newRows[targetIndex] = temp;
      return {
        ...prev,
        tableRows: newRows,
      };
    });
  };

  const handleResetToTemplate = () => {
    if (window.confirm('តើអ្នកពិតជាចង់ផ្ទុកទម្រង់តារាងហិរញ្ញប្បទានគំរូដើមតាមក្រសួងឡើងវិញមែនទេ?')) {
      updateFinance(prev => ({
        ...prev,
        periodNote: 'ចាប់ពីខែ តុលា ដល់ ខែ កញ្ញា',
        tableRows: DEFAULT_ROWS_TEMPLATE,
      }));
    }
  };

  const handleAddSourceTag = (rowIndex: number, sourceName: string) => {
    const currentRow = rows[rowIndex];
    const currentSources = currentRow.budgetSource || '';
    const formattedTag = currentSources.trim().length > 0 
      ? `${currentSources}\n- ${sourceName}` 
      : `- ${sourceName}`;
    handleRowChange(rowIndex, 'budgetSource', formattedTag);
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      {/* Header Bar */}
      <div className="p-4 sm:p-5 border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-gradient-to-r from-sky-50/50 via-white to-amber-50/30">
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-sky-100 text-sky-700 flex items-center justify-center font-bold">
              <Coins className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2 font-moul">
              .ហិរញ្ញប្បទាន:
            </h3>
            <div className="flex items-center gap-1.5 bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-700 shadow-2xs">
              <Calendar className="w-3.5 h-3.5 text-sky-600 shrink-0" />
              <input
                type="text"
                value={periodNote}
                onChange={e => updateFinance(prev => ({ ...prev, periodNote: e.target.value }))}
                className="font-medium text-slate-800 bg-transparent border-none focus:outline-none w-56 text-xs"
                placeholder="ឧ. ចាប់ពីខែ តុលា ដល់ ខែ កញ្ញា"
                title="កែសម្រួលកាលបរិច្ឆេទហិរញ្ញប្បទាន"
              />
            </div>
          </div>
          <p className="text-xs text-slate-500 pl-10">
            តារាងបញ្ចូលទិន្នន័យចំណាយ សំណង់ ជួសជុល សម្ភារ និងប្រភពថវិកា ដើម្បីបញ្ចូលស្រួល និងបោះពុម្ពតាមគំរូក្រសួង MoEYS
          </p>
        </div>

        <div className="flex items-center gap-2 self-end sm:self-center">
          <button
            type="button"
            onClick={handleResetToTemplate}
            className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg border border-slate-200 text-xs font-medium text-slate-600 hover:bg-slate-50 hover:text-slate-900 transition-colors shadow-2xs"
            title="ផ្ទុកទម្រង់តារាងគំរូដើមតាមរូបភាពក្រសួង"
          >
            <RotateCcw className="w-3 h-3 text-slate-500" />
            <span>គំរូដើម</span>
          </button>

          <button
            type="button"
            onClick={handleAddRow}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold shadow-xs transition-colors"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>បន្ថែមជួរថ្មី</span>
          </button>
        </div>
      </div>

      {/* Table Container */}
      <div className="overflow-x-auto p-4 sm:p-5">
        <table className="w-full text-xs text-left border-collapse border border-slate-300 rounded-lg overflow-hidden">
          <thead>
            <tr className="bg-sky-50/80 text-slate-800 text-center font-bold">
              <th className="border border-slate-300 p-2.5 w-12 text-slate-500">ល.រ</th>
              <th className="border border-slate-300 p-2.5 min-w-[220px] text-left">
                បរិយាយ
              </th>
              <th className="border border-slate-300 p-2.5 min-w-[150px]">
                បរិមាណ
              </th>
              <th className="border border-slate-300 p-2.5 min-w-[140px]">
                ទឹកប្រាក់សរុប
              </th>
              <th className="border border-slate-300 p-2.5 min-w-[180px] text-left">
                ប្រភពថវិកា
              </th>
              <th className="border border-slate-300 p-2.5 min-w-[130px]">
                កង្វះថវិកា
              </th>
              <th className="border border-slate-300 p-2 w-20 text-center no-print">
                សកម្មភាព
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-200">
            {rows.map((row, index) => (
              <tr key={row.id || index} className="hover:bg-slate-50/80 transition-colors">
                {/* Index number & move buttons */}
                <td className="border border-slate-300 p-2 text-center text-slate-500 bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center">
                    <span className="font-semibold text-slate-700">{index + 1}</span>
                    <div className="flex items-center gap-0.5 mt-1 no-print">
                      <button
                        type="button"
                        onClick={() => handleMoveRow(index, 'up')}
                        disabled={index === 0}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="រំកិលឡើងលើ"
                      >
                        <ArrowUp className="w-2.5 h-2.5" />
                      </button>
                      <button
                        type="button"
                        onClick={() => handleMoveRow(index, 'down')}
                        disabled={index === rows.length - 1}
                        className="p-0.5 text-slate-400 hover:text-slate-700 disabled:opacity-20"
                        title="រំកិលចុះក្រោម"
                      >
                        <ArrowDown className="w-2.5 h-2.5" />
                      </button>
                    </div>
                  </div>
                </td>

                {/* 1. បរិយាយ (Description) */}
                <td className="border border-slate-300 p-2">
                  <input
                    type="text"
                    value={row.description}
                    onChange={e => handleRowChange(index, 'description', e.target.value)}
                    placeholder="ឧ. សាងសង់អគារសិក្សាពហុបំណង..."
                    className="w-full px-2.5 py-1.5 text-xs font-medium text-slate-900 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                  />
                </td>

                {/* 2. បរិមាណ (Quantity / Scope) */}
                <td className="border border-slate-300 p-2">
                  <input
                    type="text"
                    value={row.quantity}
                    onChange={e => handleRowChange(index, 'quantity', e.target.value)}
                    placeholder="ឧ. ២ខ្នង ៣បន្ទប់, ៤០ម៉ែត្រ..."
                    className="w-full px-2.5 py-1.5 text-xs text-center text-slate-800 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                  />
                </td>

                {/* 3. ទឹកប្រាក់សរុប (Total Amount) */}
                <td className="border border-slate-300 p-2">
                  <input
                    type="text"
                    value={row.totalAmount}
                    onChange={e => handleRowChange(index, 'totalAmount', e.target.value)}
                    placeholder="បញ្ចូលទឹកប្រាក់..."
                    className="w-full px-2.5 py-1.5 text-xs text-center font-medium text-slate-900 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                  />
                </td>

                {/* 4. ប្រភពថវិកា (Budget Source) */}
                <td className="border border-slate-300 p-2">
                  <div className="space-y-1.5">
                    <textarea
                      rows={2}
                      value={row.budgetSource}
                      onChange={e => handleRowChange(index, 'budgetSource', e.target.value)}
                      placeholder="- SOF&#10;- HCC&#10;- សហគមន៍"
                      className="w-full px-2 py-1 text-xs text-slate-800 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white resize-none leading-relaxed"
                    />
                    {/* Quick Source Chips */}
                    <div className="flex flex-wrap items-center gap-1 no-print">
                      <span className="text-[10px] text-slate-400">ចុចបន្ថែម៖</span>
                      {COMMON_SOURCES.map(src => (
                        <button
                          key={src}
                          type="button"
                          onClick={() => handleAddSourceTag(index, src)}
                          className="px-1.5 py-0.5 text-[10px] bg-slate-100 hover:bg-sky-100 hover:text-sky-800 text-slate-600 rounded transition-colors"
                        >
                          +{src}
                        </button>
                      ))}
                    </div>
                  </div>
                </td>

                {/* 5. កង្វះថវិកា (Funding Gap / Deficit) */}
                <td className="border border-slate-300 p-2">
                  <input
                    type="text"
                    value={row.deficit}
                    onChange={e => handleRowChange(index, 'deficit', e.target.value)}
                    placeholder="កង្វះថវិកា (បើមាន)..."
                    className="w-full px-2.5 py-1.5 text-xs text-center text-slate-800 border border-slate-200 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 focus:border-sky-500 bg-white"
                  />
                </td>

                {/* Action: Delete Row */}
                <td className="border border-slate-300 p-2 text-center no-print">
                  <button
                    type="button"
                    onClick={() => handleDeleteRow(index)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-lg transition-colors"
                    title="លុបជួរនេះ"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Bottom helper & Add row shortcut */}
      <div className="p-3 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>លោកអ្នកអាចបញ្ចូលទិន្នន័យដោយផ្ទាល់ក្នុងក្រឡានីមួយៗ ឬចុចបន្ថែមប្រភពថវិការហ័ស (SOF, HCC, សហគមន៍, WVSI)។</span>
        </div>
        <button
          type="button"
          onClick={handleAddRow}
          className="inline-flex items-center gap-1 px-2.5 py-1 rounded bg-white hover:bg-slate-100 border border-slate-300 text-slate-700 font-medium transition-colors shadow-2xs"
        >
          <Plus className="w-3 h-3 text-sky-600" />
          <span>+ បន្ថែមជួរថ្មី</span>
        </button>
      </div>
    </div>
  );
};
