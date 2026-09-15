import React, { useState, useMemo } from 'react';
import { StudentScoreRow } from '../types';
import { parseImportData } from '../utils/importParsers';
import { toKhmerNum } from '../utils/khmerNumbers';
import {
  Upload,
  FileText,
  ClipboardPaste,
  CheckCircle2,
  AlertTriangle,
  X,
  Sparkles,
  ArrowRight,
  Database,
  FileSpreadsheet,
} from 'lucide-react';

interface ImportDataModalProps {
  isOpen: boolean;
  onClose: () => void;
  onImportSuccess: (importedStudents: StudentScoreRow[], autoSync: boolean, mode: 'replace' | 'append') => void;
}

export const ImportDataModal: React.FC<ImportDataModalProps> = ({
  isOpen,
  onClose,
  onImportSuccess,
}) => {
  const [activeTab, setActiveTab] = useState<'paste' | 'file'>('paste');
  const [inputText, setInputText] = useState<string>('');
  const [importMode, setImportMode] = useState<'replace' | 'append'>('replace');
  const [autoSyncToReports, setAutoSyncToReports] = useState<boolean>(true);
  const [fileName, setFileName] = useState<string | null>(null);

  // User's exact prompt JSON sample
  const samplePromptJson = `{
  "តារាងលទ្ធផលសិក្សាលម្អិត": [
    {
      "0": [
        "ល.រ", "នាមត្រកូល និងនាម", "ភេទ", "ថ្ងៃខែឆ្នាំកំណើត", "ថ្នាក់", "ទីកន្លែងកំណើត",
        "ឆមាស១", "", "", "", "ឆមាស២", "", "", "", "ប្រចាំឆ្នាំ", "", "", "", "ស្ថានភាព"
      ]
    },
    {
      "1": [
        "", "", "", "", "", "",
        "ម.ភាគខែ", "ម.ភាគប្រឡង", "ម.ភាគប្រចាំ", "និទ្ទេស",
        "ម.ភាគខែ", "ម.ភាគប្រឡង", "ម.ភាគប្រចាំ", "និទ្ទេស",
        "ប្រ.ឆមាស១", "ប្រ.ឆមាស២", "ម.ប្រចាំឆ្នាំ", "និទ្ទេស", ""
      ]
    },
    {
      "2": [
        "76", "ខាន់ ស្រីណាត", "ស្រី", "01/11/2019", "1-A", "រោគ, ស្ពានស្រែង, ភ្នំស្រុក, ខេត្តបន្ទាយមានជ័យ",
        "6.75", "7", "6.88", "D", "6.47", "7", "6.74", "D", "6.88", "6.74", "6.81", "D", "ឡើងថ្នាក់"
      ]
    },
    {
      "3": [
        "77", "គ្រឿ វច្ឆិ", "ស្រី", "19/02/2019", "1-A", "រោគ, ស្ពានស្រែង, ភ្នំស្រុក, ខេត្តបន្ទាយមានជ័យ",
        "7.10", "7", "7.05", "C", "7.20", "7.5", "7.35", "C", "7.05", "7.35", "7.20", "C", "ឡើងថ្នាក់"
      ]
    },
    {
      "4": [
        "78", "ចិត្ត វ៉ាវី", "ស្រី", "05/01/2019", "1-A", "រោគ, ស្ពានស្រែង, ភ្នំស្រុក, ខេត្តបន្ទាយមានជ័យ",
        "6.50", "6.5", "6.50", "C", "6.60", "7", "6.80", "C", "6.50", "6.80", "6.65", "C", "ឡើងថ្នាក់"
      ]
    },
    {
      "5": [
        "79", "ឆន ចាន់ស្រី", "ស្រី", "19/09/2019", "1-A", "មុខឈ្នាង, ស្ពានស្រែង, ភ្នំស្រុក, ខេត្តបន្ទាយមានជ័យ",
        "7.80", "8", "7.90", "C", "8.10", "8.5", "8.30", "B", "7.90", "8.30", "8.10", "B", "ឡើងថ្នាក់"
      ]
    },
    {
      "6": [
        "80", "ឈួង ឆៃយុទ្ធ", "ប្រុស", "17/03/2020", "1-A", "មុខឈ្នាង, ស្ពានស្រែង, ភ្នំស្រុក, ខេត្តបន្ទាយមានជ័យ",
        "5.20", "5.5", "5.35", "D", "5.50", "6", "5.75", "D", "5.35", "5.75", "5.55", "D", "ឡើងថ្នាក់"
      ]
    }
  ]
}`;

  // Sample with completely blank formula columns (ម.ភាគប្រចាំ, និទ្ទេស, ស្ថានភាព empty)
  const sampleBlankFormulaColumnsJson = `{
  "តារាងលទ្ធផលសិក្សាលម្អិត": [
    {
      "0": [
        "ល.រ", "នាមត្រកូល និងនាម", "ភេទ", "ថ្ងៃខែឆ្នាំកំណើត", "ថ្នាក់", "ទីកន្លែងកំណើត",
        "ឆមាស១", "", "", "", "ឆមាស២", "", "", "", "ប្រចាំឆ្នាំ", "", "", "", "ស្ថានភាព"
      ]
    },
    {
      "1": [
        "", "", "", "", "", "",
        "ម.ភាគខែ", "ម.ភាគប្រឡង", "ម.ភាគប្រចាំ", "និទ្ទេស",
        "ម.ភាគខែ", "ម.ភាគប្រឡង", "ម.ភាគប្រចាំ", "និទ្ទេស",
        "ប្រ.ឆមាស១", "ប្រ.ឆមាស២", "ម.ប្រចាំឆ្នាំ", "និទ្ទេស", ""
      ]
    },
    {
      "2": [
        "76", "ខាន់ ស្រីណាត", "ស្រី", "01/11/2019", "1-A", "រោគ, ស្ពានស្រែង, ភ្នំស្រុក",
        "9.20", "9.50", "", "", "8.80", "9.20", "", "", "", "", "", "", ""
      ]
    },
    {
      "3": [
        "77", "គ្រឿ វច្ឆិ", "ស្រី", "19/02/2019", "1-A", "រោគ, ស្ពានស្រែង, ភ្នំស្រុក",
        "8.10", "8.50", "", "", "8.20", "8.00", "", "", "", "", "", "", ""
      ]
    },
    {
      "4": [
        "78", "ចិត្ត វ៉ាវី", "ស្រី", "05/01/2019", "1-A", "រោគ, ស្ពានស្រែង, ភ្នំស្រុក",
        "7.20", "7.00", "", "", "7.40", "7.20", "", "", "", "", "", "", ""
      ]
    },
    {
      "5": [
        "79", "ឆន ចាន់ស្រី", "ស្រី", "19/09/2019", "1-A", "មុខឈ្នាង, ស្ពានស្រែង, ភ្នំស្រុក",
        "6.20", "6.40", "", "", "6.10", "6.50", "", "", "", "", "", "", ""
      ]
    },
    {
      "6": [
        "80", "ឈួង ឆៃយុទ្ធ", "ប្រុស", "17/03/2020", "1-A", "មុខឈ្នាង, ស្ពានស្រែង, ភ្នំស្រុក",
        "4.50", "4.00", "", "", "4.80", "4.20", "", "", "", "", "", "", ""
      ]
    }
  ]
}`;

  // Parse on the fly
  const parseResult = useMemo(() => {
    if (!inputText.trim()) return null;
    return parseImportData(inputText);
  }, [inputText]);

  // Handle file drop or selection
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      if (content) {
        setInputText(content);
      }
    };
    reader.readAsText(file);
  };

  const handleApplyImport = () => {
    if (!parseResult || !parseResult.success || parseResult.students.length === 0) return;
    onImportSuccess(parseResult.students, autoSyncToReports, importMode);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-blue-600 text-white flex items-center justify-center shadow-xs">
              <Upload className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-slate-900">
                នាំចូលទិន្នន័យសិស្ស (Import Student Academic Results)
              </h3>
              <p className="text-xs text-slate-500">
                គាំទ្រទម្រង់ JSON ក្រសួង MoEYS, Excel Copy/Paste (TSV) និង CSV
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-200/60 rounded-xl transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selection */}
        <div className="flex items-center px-6 pt-3 border-b border-slate-200 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('paste')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'paste'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <ClipboardPaste className="w-4 h-4" />
            <span>បិទភ្ជាប់ទិន្នន័យ (Paste JSON / Excel)</span>
          </button>
          <button
            onClick={() => setActiveTab('file')}
            className={`pb-2.5 flex items-center gap-1.5 border-b-2 transition-all cursor-pointer ${
              activeTab === 'file'
                ? 'border-blue-600 text-blue-700'
                : 'border-transparent text-slate-500 hover:text-slate-700'
            }`}
          >
            <FileSpreadsheet className="w-4 h-4" />
            <span>បញ្ចូលឯកសារ (Upload File)</span>
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-4 flex-1 text-xs">
          {activeTab === 'paste' ? (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="font-semibold text-slate-700">
                  បិទភ្ជាប់ទិន្នន័យ JSON ឬ ចម្លងជួរឈរពី Excel នៅទីនេះ ៖
                </label>
                <button
                  type="button"
                  onClick={() => setInputText(samplePromptJson)}
                  className="flex items-center gap-1 text-[11px] text-blue-600 hover:text-blue-800 font-medium cursor-pointer"
                >
                  <Sparkles className="w-3 h-3" />
                  <span>បញ្ចូលគំរូទិន្នន័យ ៧៦-៨០ ពីសំណើ</span>
                </button>
              </div>
              <textarea
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder='{ "តារាងលទ្ធផលសិក្សាលម្អិត": [ { "0": ["ល.រ", "នាមត្រកូល និងនាម", ... ] } ] }'
                rows={9}
                className="w-full font-mono text-[11px] p-3 border border-slate-300 rounded-xl bg-slate-50/50 focus:bg-white focus:outline-hidden focus:border-blue-500 focus:ring-1 focus:ring-blue-500 transition-all"
              />
            </div>
          ) : (
            <div className="space-y-3">
              <label className="font-semibold text-slate-700 block">
                ជ្រើសរើស ឬទម្លាក់ឯកសារ (.json, .csv, .txt) ៖
              </label>
              <div className="border-2 border-dashed border-slate-300 hover:border-blue-500 rounded-2xl p-8 text-center bg-slate-50/50 hover:bg-blue-50/30 transition-all cursor-pointer relative">
                <input
                  type="file"
                  accept=".json,.csv,.tsv,.txt"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                />
                <div className="flex flex-col items-center justify-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-blue-100 text-blue-600 flex items-center justify-center">
                    <FileText className="w-6 h-6" />
                  </div>
                  <div className="text-slate-700 font-semibold">
                    {fileName ? fileName : 'ចុចទីនេះ ឬទម្លាក់ឯកសារទិន្នន័យនៅទីនេះ'}
                  </div>
                  <p className="text-[11px] text-slate-500">គាំទ្រឯកសារ .json, .csv, .tsv</p>
                </div>
              </div>

              {inputText && (
                <div className="text-[11px] text-slate-500">
                  ទំហំទិន្នន័យ ៖ {toKhmerNum(inputText.length)} តួអក្សរ
                </div>
              )}
            </div>
          )}

          {/* Validation / Preview Card */}
          {parseResult && (
            <div
              className={`p-4 rounded-xl border ${
                parseResult.success
                  ? 'bg-emerald-50/70 border-emerald-200'
                  : 'bg-rose-50/70 border-rose-200'
              }`}
            >
              <div className="flex items-center gap-2 font-bold mb-2">
                {parseResult.success ? (
                  <>
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span className="text-emerald-900">
                      បានអានទិន្នន័យដោយជោគជ័យ ៖ {toKhmerNum(parseResult.students.length)} នាក់
                    </span>
                  </>
                ) : (
                  <>
                    <AlertTriangle className="w-4 h-4 text-rose-600" />
                    <span className="text-rose-900">បរាជ័យក្នុងការអានទិន្នន័យ</span>
                  </>
                )}
              </div>

              {parseResult.success ? (
                <div className="space-y-2 text-[11px] text-emerald-950">
                  <div className="flex flex-wrap gap-x-4 gap-y-1">
                    <span>
                      • ស្រី ៖{' '}
                      <strong>
                        {toKhmerNum(
                          parseResult.students.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length
                        )}
                      </strong>{' '}
                      នាក់
                    </span>
                    <span>
                      • ប្រុស ៖{' '}
                      <strong>
                        {toKhmerNum(
                          parseResult.students.filter((s) => s.gender === 'ប្រុស' || s.gender === 'ប').length
                        )}
                      </strong>{' '}
                      នាក់
                    </span>
                    <span>
                      • ថ្នាក់ ៖{' '}
                      <strong>
                        {Array.from(new Set(parseResult.students.map((s) => s.gradeClass || '1-A'))).join(', ')}
                      </strong>
                    </span>
                  </div>

                  {/* Sample rows preview */}
                  <div className="mt-2 pt-2 border-t border-emerald-200/70">
                    <span className="font-semibold text-emerald-900 block mb-1">
                      គំរូទិន្នន័យ {Math.min(parseResult.students.length, 3)} នាក់ដំបូង ៖
                    </span>
                    <div className="overflow-x-auto bg-white rounded-lg border border-emerald-200">
                      <table className="w-full text-left text-[10px]">
                        <thead>
                          <tr className="bg-emerald-100/70 text-emerald-900 border-b border-emerald-200">
                            <th className="p-1 text-center w-8">ល.រ</th>
                            <th className="p-1">ឈ្មោះ</th>
                            <th className="p-1 text-center">ភេទ</th>
                            <th className="p-1 text-center">ថ្នាក់</th>
                            <th className="p-1 text-center">ម.ឆ១</th>
                            <th className="p-1 text-center">ម.ឆ២</th>
                            <th className="p-1 text-center">ម.ប្រចាំឆ្នាំ</th>
                            <th className="p-1 text-center">និទ្ទេស</th>
                            <th className="p-1 text-center">ស្ថានភាព</th>
                          </tr>
                        </thead>
                        <tbody>
                          {parseResult.students.slice(0, 3).map((st) => (
                            <tr key={st.id} className="border-b border-emerald-100 last:border-0">
                              <td className="p-1 text-center font-mono">{toKhmerNum(st.no)}</td>
                              <td className="p-1 font-semibold">{st.name}</td>
                              <td className="p-1 text-center">{st.gender}</td>
                              <td className="p-1 text-center">{st.gradeClass}</td>
                              <td className="p-1 text-center font-mono">{toKhmerNum(st.sem1Avg.toFixed(2))}</td>
                              <td className="p-1 text-center font-mono">{toKhmerNum(st.sem2Avg.toFixed(2))}</td>
                              <td className="p-1 text-center font-mono font-bold text-rose-700">
                                {toKhmerNum(st.yearAvg.toFixed(2))}
                              </td>
                              <td className="p-1 text-center font-bold">{st.gradeLetter}</td>
                              <td className="p-1 text-center text-emerald-700 font-semibold">{st.status}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                </div>
              ) : (
                <p className="text-xs text-rose-700">{parseResult.error}</p>
              )}
            </div>
          )}

          {/* Import Settings */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
            <h4 className="font-bold text-slate-800 flex items-center gap-1.5">
              <Database className="w-4 h-4 text-slate-600" />
              <span>ការកំណត់ការនាំចូល (Import Options)</span>
            </h4>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <label className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-blue-300">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'replace'}
                  onChange={() => setImportMode('replace')}
                  className="mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">ជំនួសទិន្នន័យចាស់ទាំងអស់ (Replace)</span>
                  <span className="text-[11px] text-slate-500">
                    លុបទិន្នន័យសិស្សចាស់ ហើយដាក់ទិន្នន័យថ្មីដែលបាននាំចូល
                  </span>
                </div>
              </label>

              <label className="flex items-start gap-2 p-2.5 rounded-lg border border-slate-200 bg-white cursor-pointer hover:border-blue-300">
                <input
                  type="radio"
                  name="importMode"
                  checked={importMode === 'append'}
                  onChange={() => setImportMode('append')}
                  className="mt-0.5"
                />
                <div>
                  <span className="font-semibold text-slate-800 block">បន្ថែមលើទិន្នន័យចាស់ (Append)</span>
                  <span className="text-[11px] text-slate-500">
                    រក្សាទុកសិស្សចាស់ ហើយបន្ថែមសិស្សថ្មីចូលទៅក្នុងបញ្ជី
                  </span>
                </div>
              </label>
            </div>

            {/* Auto-Sync Checkbox */}
            <label className="flex items-center gap-2 p-2.5 rounded-lg bg-emerald-50/70 border border-emerald-200 cursor-pointer">
              <input
                type="checkbox"
                checked={autoSyncToReports}
                onChange={(e) => setAutoSyncToReports(e.target.checked)}
                className="rounded text-emerald-600 focus:ring-emerald-500 cursor-pointer"
              />
              <span className="text-emerald-950 font-medium">
                គណនា និងធ្វើបច្ចុប្បន្នភាពស្វ័យប្រវត្តិទៅ <strong>របាយការណ៍ A, B និងបូកសរុប</strong> ភ្លាមៗ (Auto-Aggregate & Sync)
              </span>
            </label>
          </div>
        </div>

        {/* Modal Footer */}
        <div className="flex items-center justify-between px-6 py-4 border-t border-slate-200 bg-slate-50/50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-slate-300 text-slate-700 hover:bg-slate-100 rounded-xl font-medium transition-colors cursor-pointer"
          >
            បោះបង់
          </button>

          <button
            type="button"
            disabled={!parseResult || !parseResult.success || parseResult.students.length === 0}
            onClick={handleApplyImport}
            className={`flex items-center gap-2 px-5 py-2 rounded-xl font-bold shadow-xs transition-all cursor-pointer ${
              parseResult && parseResult.success && parseResult.students.length > 0
                ? 'bg-blue-600 hover:bg-blue-700 text-white'
                : 'bg-slate-200 text-slate-400 cursor-not-allowed'
            }`}
          >
            <span>យល់ព្រមនាំចូល</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
};
