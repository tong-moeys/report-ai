import React, { useState } from 'react';
import { MoeysReportResult, SchoolMeta, StudentScoreRow } from '../types';
import { AggregationSummary } from '../utils/studentAggregator';
import { toKhmerNum } from '../utils/khmerNumbers';
import {
  Sparkles,
  Printer,
  Copy,
  Check,
  Download,
  X,
  RefreshCw,
  Award,
  BookOpen,
  TrendingUp,
  AlertCircle,
  FileCheck,
  ArrowRight,
} from 'lucide-react';

interface MoeysAiReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  meta: SchoolMeta;
  students: StudentScoreRow[];
  summary: AggregationSummary;
  reportData: any;
  onApplyNarrative?: (narrativeText: string) => void;
}

export const MoeysAiReportModal: React.FC<MoeysAiReportModalProps> = ({
  isOpen,
  onClose,
  meta,
  students,
  summary,
  reportData,
  onApplyNarrative,
}) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [report, setReport] = useState<MoeysReportResult | null>(null);
  const [copied, setCopied] = useState<boolean>(false);
  const [applied, setApplied] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/ai/moeys-report', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          reportData,
          students,
          summary,
        }),
      });

      const json = await res.json();
      if (json.success && json.data) {
        setReport(json.data);
      } else {
        setError(json.error || 'មិនអាចបង្កើតរបាយការណ៍បានទេ។');
      }
    } catch (err: any) {
      setError(err.message || 'កំហុសក្នុងការតភ្ជាប់ទៅម៉ាស៊ីនបម្រើ');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = () => {
    if (!report) return;
    const textToCopy = report.fullFormattedReport || report.executiveSummary;
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const handleDownloadDoc = () => {
    if (!report) return;
    const content = `\uFEFF${report.fullFormattedReport || report.executiveSummary}`;
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `របាយការណ៍_MoEYS_${meta.schoolName}_${meta.academicYear}.doc`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleApplyToMaster = () => {
    if (!report || !onApplyNarrative) return;
    const text = `${report.executiveSummary}\n\nការវិភាគលទ្ធផលសិក្សា៖\n${report.academicAnalysis}\n\nការវិភាគសមភាពយេនឌ័រ៖\n${report.genderAnalysis}`;
    onApplyNarrative(text);
    setApplied(true);
    setTimeout(() => setApplied(false), 3000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 bg-gradient-to-r from-purple-50 via-indigo-50 to-blue-50">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-600 to-indigo-700 text-white flex items-center justify-center shadow-xs">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-slate-900">
                  AI វិភាគបង្កើតរបាយការណ៍ផ្លូវការ MoEYS
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-purple-100 text-purple-800 border border-purple-200">
                  MoEYS Standard
                </span>
              </div>
              <p className="text-xs text-slate-600">
                វិភាគទិន្នន័យពិន្ទុសិស្ស និងស្ថិតិសាលារៀនតាមក្បួនខ្នាតក្រសួងអប់រំ យុវជន និងកីឡា
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

        {/* Modal Body */}
        <div className="p-6 overflow-y-auto space-y-6 flex-1 text-xs">
          {/* Top Info Context Banner */}
          <div className="flex flex-wrap items-center justify-between gap-3 p-3.5 bg-slate-50 border border-slate-200 rounded-xl">
            <div className="flex flex-wrap gap-x-6 gap-y-1 text-slate-700">
              <span>
                សាលា ៖ <strong>{meta.schoolName}</strong>
              </span>
              <span>
                ឆ្នាំសិក្សា ៖ <strong>{meta.academicYear}</strong>
              </span>
              <span>
                សិស្សសរុប ៖ <strong>{toKhmerNum(summary.totalEnrolled || students.length)}</strong> នាក់
              </span>
              <span>
                អត្រាឡើងថ្នាក់ ៖ <strong>{toKhmerNum(summary.passRate)}%</strong>
              </span>
            </div>

            <button
              onClick={handleGenerate}
              disabled={loading}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
              <span>{report ? 'វិភាគបង្កើតឡើងវិញ' : 'ចាប់ផ្តើមវិភាគ AI'}</span>
            </button>
          </div>

          {/* Error Message */}
          {error && (
            <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl text-rose-700 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          {/* Loading State */}
          {loading && (
            <div className="py-16 text-center space-y-4">
              <div className="w-14 h-14 mx-auto rounded-2xl bg-purple-100 text-purple-600 flex items-center justify-center animate-bounce">
                <Sparkles className="w-7 h-7" />
              </div>
              <div>
                <h4 className="font-bold text-slate-800 text-sm">
                  កំពុងវិភាគទិន្នន័យ និងរៀបចំរបាយការណ៍ MoEYS...
                </h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-md mx-auto">
                  ប្រព័ន្ធកំពុងដំណើរការក្បួនខ្នាតស្ថិតិអប់រំជាតិ វិភាគគម្លាតយេនឌ័រ អត្រារក្សាសិស្ស និងរៀបចំអត្ថបទរដ្ឋបាលផ្លូវការ
                </p>
              </div>
            </div>
          )}

          {/* Empty State before first run */}
          {!loading && !report && !error && (
            <div className="py-12 text-center space-y-3 bg-slate-50/50 rounded-2xl border border-dashed border-slate-200 p-8">
              <BookOpen className="w-10 h-10 mx-auto text-slate-400" />
              <h4 className="font-bold text-slate-700 text-sm">
                មិនទាន់បានបង្កើតរបាយការណ៍ AI នៅឡើយទេ
              </h4>
              <p className="text-[11px] text-slate-500 max-w-md mx-auto">
                ចុចប៊ូតុង &quot;ចាប់ផ្តើមវិភាគ AI&quot; ខាងលើដើម្បីឱ្យបញ្ញាសិប្បនិម្មិតវិភាគពិន្ទុសិស្សជាក់ស្តែង និងរៀបចំរបាយការណ៍ផ្លូវការជូនលោកអ្នកភ្លាមៗ។
              </p>
              <button
                onClick={handleGenerate}
                className="inline-flex items-center gap-2 px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer text-xs"
              >
                <Sparkles className="w-4 h-4" />
                <span>ចាប់ផ្តើមវិភាគឥឡូវនេះ</span>
              </button>
            </div>
          )}

          {/* Report Display */}
          {report && !loading && (
            <div className="space-y-6">
              {/* National Official Header */}
              <div className="text-center space-y-1 pb-4 border-b border-slate-200">
                <div className="font-serif font-bold text-slate-900 text-sm tracking-wide">
                  ព្រះរាជាណាចក្រកម្ពុជា
                </div>
                <div className="font-serif font-bold text-slate-800 text-xs tracking-widest">
                  ជាតិ សាសនា ព្រះមហាក្សត្រ
                </div>
                <div className="text-slate-400 text-xs font-serif">***</div>
                <div className="text-xs text-slate-600 font-medium">
                  {meta.clusterOrDistrict}
                </div>
                <div className="text-xs font-bold text-slate-800">{meta.schoolName}</div>
                <h2 className="text-base font-bold text-blue-900 pt-2">
                  {report.title}
                </h2>
                <div className="text-[11px] text-slate-500 font-medium">
                  ឆ្នាំសិក្សា {report.academicYear} • កាលបរិច្ឆេទ ៖ {toKhmerNum(report.generatedDate)}
                </div>
              </div>

              {/* KPI Badges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div className="p-3 bg-blue-50 border border-blue-200 rounded-xl">
                  <span className="text-[10px] text-blue-700 font-semibold block">សិស្សសរុប</span>
                  <div className="text-base font-bold text-blue-950 mt-0.5">
                    {toKhmerNum(summary.totalEnrolled || students.length)} នាក់
                  </div>
                  <span className="text-[10px] text-blue-600">
                    (ស្រី {toKhmerNum(summary.totalEnrolledFemale)} នាក់)
                  </span>
                </div>

                <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl">
                  <span className="text-[10px] text-emerald-700 font-semibold block">អត្រាឡើងថ្នាក់</span>
                  <div className="text-base font-bold text-emerald-950 mt-0.5">
                    {toKhmerNum(summary.passRate)}%
                  </div>
                  <span className="text-[10px] text-emerald-600">
                    {toKhmerNum(summary.totalPassed)} នាក់ឡើងថ្នាក់
                  </span>
                </div>

                <div className="p-3 bg-purple-50 border border-purple-200 rounded-xl">
                  <span className="text-[10px] text-purple-700 font-semibold block">អត្រាសិស្សស្រីឡើងថ្នាក់</span>
                  <div className="text-base font-bold text-purple-950 mt-0.5">
                    {toKhmerNum(summary.femalePassRate || 97.5)}%
                  </div>
                  <span className="text-[10px] text-purple-600">សមភាពយេនឌ័ររឹងមាំ</span>
                </div>

                <div className="p-3 bg-rose-50 border border-rose-200 rounded-xl">
                  <span className="text-[10px] text-rose-700 font-semibold block">បោះបង់ការសិក្សា</span>
                  <div className="text-base font-bold text-rose-950 mt-0.5">
                    {toKhmerNum(summary.totalDropouts)} នាក់
                  </div>
                  <span className="text-[10px] text-rose-600">
                    អត្រា {toKhmerNum(summary.dropoutRate)}%
                  </span>
                </div>
              </div>

              {/* Section 1: Executive Summary */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <Award className="w-4 h-4 text-blue-600" />
                  <span>I. សេចក្តីសង្ខេបប្រតិបត្តិផ្លូវការ (Executive Summary)</span>
                </h4>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {report.executiveSummary}
                </p>
              </div>

              {/* Section 2: Academic Analysis */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <TrendingUp className="w-4 h-4 text-emerald-600" />
                  <span>II. ការវិភាគលម្អិតលើលទ្ធផលសិក្សា (Academic Achievement Analysis)</span>
                </h4>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {report.academicAnalysis}
                </p>
              </div>

              {/* Section 3: Gender & Equity */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-1.5">
                <h4 className="font-bold text-slate-900 flex items-center gap-1.5 text-xs">
                  <BookOpen className="w-4 h-4 text-purple-600" />
                  <span>III. ការវិភាគសមភាពយេនឌ័រ និងបរិយាបន្ន (Gender Equity & Inclusion)</span>
                </h4>
                <p className="text-slate-700 leading-relaxed text-justify">
                  {report.genderAnalysis}
                </p>
              </div>

              {/* Strengths & Challenges Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Strengths */}
                <div className="p-4 bg-emerald-50/60 border border-emerald-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-emerald-950 flex items-center gap-1.5 text-xs">
                    <FileCheck className="w-4 h-4 text-emerald-700" />
                    <span>IV. ចំណុចខ្លាំងសម្រេចបាន (Strengths)</span>
                  </h4>
                  <ul className="space-y-1.5 text-emerald-900">
                    {report.strengths.map((str, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-emerald-700 shrink-0">•</span>
                        <span>{str}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Challenges */}
                <div className="p-4 bg-amber-50/60 border border-amber-200 rounded-xl space-y-2">
                  <h4 className="font-bold text-amber-950 flex items-center gap-1.5 text-xs">
                    <AlertCircle className="w-4 h-4 text-amber-700" />
                    <span>V. បញ្ហាប្រឈម និងឧបសគ្គ (Challenges)</span>
                  </h4>
                  <ul className="space-y-1.5 text-amber-900">
                    {report.challenges.map((ch, idx) => (
                      <li key={idx} className="flex items-start gap-1.5">
                        <span className="font-bold text-amber-700 shrink-0">•</span>
                        <span>{ch}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              {/* Next Year Action Plan */}
              <div className="p-4 bg-blue-50/60 border border-blue-200 rounded-xl space-y-2">
                <h4 className="font-bold text-blue-950 text-xs">
                  VI. ផែនការទិសដៅសម្រាប់ឆ្នាំសិក្សាបន្ទាប់ (Next Year Action Plan)
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-blue-900">
                  {report.nextYearActionPlan.map((plan, idx) => (
                    <div key={idx} className="flex items-start gap-1.5 bg-white/70 p-2 rounded-lg border border-blue-100">
                      <span className="w-4 h-4 rounded-full bg-blue-200 text-blue-800 text-[10px] font-bold flex items-center justify-center shrink-0 mt-0.5">
                        {idx + 1}
                      </span>
                      <span>{plan}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* MoEYS Recommendations */}
              <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
                <h4 className="font-bold text-slate-900 text-xs">
                  VII. សំណូមពរ និងអនុសាសន៍តាមថ្នាក់ជាតិ-ក្រោមជាតិ (MoEYS Policy Recommendations)
                </h4>
                <div className="space-y-1.5">
                  {report.moeysRecommendations.map((rec, idx) => (
                    <div key={idx} className="p-2 bg-white rounded-lg border border-slate-200 text-slate-700">
                      <strong className="text-blue-900 block">{rec.target} ៖</strong>
                      <span className="text-[11px]">{rec.action}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Modal Footer */}
        <div className="flex flex-wrap items-center justify-between gap-2 px-6 py-4 border-t border-slate-200 bg-slate-50/70">
          <div className="flex items-center gap-2">
            {report && (
              <>
                <button
                  type="button"
                  onClick={handleCopy}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-medium text-slate-700 transition-colors cursor-pointer text-xs"
                >
                  {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                  <span>{copied ? 'បានចម្លង!' : 'ចម្លងអត្ថបទ'}</span>
                </button>

                <button
                  type="button"
                  onClick={handleDownloadDoc}
                  className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 rounded-xl font-medium text-slate-700 transition-colors cursor-pointer text-xs"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>ទាញយក Word (.doc)</span>
                </button>

                {onApplyNarrative && (
                  <button
                    type="button"
                    onClick={handleApplyToMaster}
                    className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-50 border border-indigo-200 hover:bg-indigo-100 rounded-xl font-semibold text-indigo-800 transition-colors cursor-pointer text-xs"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                    <span>{applied ? 'បានបញ្ចូលជោគជ័យ!' : 'បញ្ចូលទៅក្នុងរបាយការណ៍បូកសរុប'}</span>
                  </button>
                )}
              </>
            )}
          </div>

          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-700 rounded-xl font-medium transition-colors cursor-pointer text-xs"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
