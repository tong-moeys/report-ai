import React from 'react';
import { Loader2, FileText, CheckCircle2, AlertCircle } from 'lucide-react';
import { PdfProgressInfo } from '../utils/pdfExport';

interface PdfProgressModalProps {
  isOpen: boolean;
  progress: PdfProgressInfo;
  isComplete: boolean;
  error?: string | null;
  onClose: () => void;
}

export const PdfProgressModal: React.FC<PdfProgressModalProps> = ({
  isOpen,
  progress,
  isComplete,
  error,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-md p-6 overflow-hidden">
        {/* Top Icon & Title */}
        <div className="flex items-center gap-3.5 mb-4">
          <div
            className={`w-12 h-12 rounded-xl flex items-center justify-center shrink-0 ${
              error
                ? 'bg-rose-100 text-rose-600'
                : isComplete
                ? 'bg-emerald-100 text-emerald-600'
                : 'bg-blue-100 text-blue-700 animate-pulse'
            }`}
          >
            {error ? (
              <AlertCircle className="w-6 h-6" />
            ) : isComplete ? (
              <CheckCircle2 className="w-6 h-6" />
            ) : (
              <Loader2 className="w-6 h-6 animate-spin" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-slate-900">
              {error
                ? 'មានបញ្ហាក្នុងការទាញយក PDF'
                : isComplete
                ? 'បានទាញយក PDF រួចរាល់!'
                : 'កំពុងទាញយកសៀវភៅជា PDF (២៤ទំព័រ)'}
            </h3>
            <p className="text-xs text-slate-500 mt-0.5">
              {error
                ? 'សូមព្យាយាមម្តងទៀត ឬប្រើជម្រើសបោះពុម្ព (Print/PDF)'
                : isComplete
                ? 'ឯកសារត្រូវបានរក្សាទុកក្នុងកុំព្យូទ័ររបស់អ្នក'
                : 'បំបែកទំព័រ និងថែរក្សាពុម្ពអក្សរខ្មែរស្អាតល្អ'}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        {!error && (
          <div className="space-y-2 mb-4">
            <div className="flex justify-between items-center text-xs font-semibold">
              <span className="text-slate-700 flex items-center gap-1.5 truncate">
                <FileText className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                <span className="truncate">{progress.stage}</span>
              </span>
              <span className="text-blue-700 font-mono shrink-0 ml-2">
                {progress.percent}%
              </span>
            </div>

            <div className="w-full bg-slate-100 rounded-full h-3 overflow-hidden p-0.5 border border-slate-200">
              <div
                className="bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500 h-full rounded-full transition-all duration-300 ease-out"
                style={{ width: `${progress.percent}%` }}
              />
            </div>
          </div>
        )}

        {error && (
          <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-xl text-xs mb-4">
            <p className="font-semibold">{error}</p>
            <p className="mt-1 text-slate-600">
              អ្នកអាចចុចប៊ូតុង "បោះពុម្ព (Print)" រួចជ្រើសរើស "Save as PDF" ជំនួសវិញបាន។
            </p>
          </div>
        )}

        {/* Tip / Note */}
        {!error && !isComplete && (
          <div className="bg-slate-50 rounded-xl p-3 border border-slate-100 text-[11px] text-slate-500 leading-relaxed mb-4">
            💡 <strong>ចំណាំ ៖</strong> ដោយសាររបាយការណ៍មានចំនួន ២៤ទំព័រ និងតារាងស្ថិតិច្រើន ការដំណើរការអាចចំណាយពេលពីរបីវិនាទី ដើម្បីធានាថាទំព័រនីមួយៗបំបែកដាច់ពីគ្នាបានត្រឹមត្រូវ។
          </div>
        )}

        {/* Action Button */}
        <div className="flex justify-end gap-2">
          {isComplete || error ? (
            <button
              onClick={onClose}
              className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold rounded-xl transition-colors cursor-pointer"
            >
              បិទផ្ទាំងនេះ
            </button>
          ) : (
            <button
              onClick={onClose}
              className="px-3 py-1.5 border border-slate-200 hover:bg-slate-100 text-slate-600 text-xs rounded-xl transition-colors cursor-pointer"
            >
              បិទការរង់ចាំ
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
