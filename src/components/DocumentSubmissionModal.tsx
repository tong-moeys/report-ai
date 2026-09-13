import React, { useState, useEffect } from 'react';
import {
  Send,
  FileCheck2,
  Building2,
  UserCheck,
  Clock,
  CheckCircle2,
  AlertCircle,
  FileText,
  History,
  X,
  Printer,
  ChevronRight,
  ShieldCheck,
  Sparkles
} from 'lucide-react';
import { User } from 'firebase/auth';
import { FullSchoolReport } from '../types';
import {
  submitReportToOffice,
  listUserSubmissions,
  FirestoreReportSubmission,
  getAutoKhmerDate
} from '../firebase';
import { toKhmerDigits } from '../khmerCalendarData';

interface DocumentSubmissionModalProps {
  isOpen: boolean;
  onClose: () => void;
  report: FullSchoolReport;
  user: User | null;
  onSignIn: () => void;
  onSubmissionSuccess: (submission: FirestoreReportSubmission) => void;
}

export const DocumentSubmissionModal: React.FC<DocumentSubmissionModalProps> = ({
  isOpen,
  onClose,
  report,
  user,
  onSignIn,
  onSubmissionSuccess,
}) => {
  const [activeSubTab, setActiveSubTab] = useState<'submit' | 'history'>('submit');
  const [recipientOffice, setRecipientOffice] = useState('ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលស្រុក');
  const [senderName, setSenderName] = useState(user?.displayName || 'អ្នករៀបចំរបាយការណ៍');
  const [submissionNotes, setSubmissionNotes] = useState('សូមគោរពជូនឯកសាររបាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំដំណាច់ឆ្នាំសិក្សា ២០២៥-២០២៦ របស់សាលាបឋមសិក្សា ដើម្បីពិនិត្យ និងផ្តល់ការឯកភាព។');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionsList, setSubmissionsList] = useState<FirestoreReportSubmission[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [successReceipt, setSuccessReceipt] = useState<FirestoreReportSubmission | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Load history when modal opens or tab changes
  useEffect(() => {
    if (isOpen && user && activeSubTab === 'history') {
      loadHistory();
    }
  }, [isOpen, user, activeSubTab]);

  const loadHistory = async () => {
    if (!user) return;
    setIsLoadingHistory(true);
    try {
      const list = await listUserSubmissions(user.uid);
      setSubmissionsList(list);
    } catch (err: any) {
      console.error('Error loading submissions:', err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) {
      onSignIn();
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    try {
      const submission = await submitReportToOffice(report, user, {
        recipientOffice,
        submissionNotes,
        senderName,
      });

      setSuccessReceipt(submission);
      onSubmissionSuccess(submission);
      loadHistory();
    } catch (err: any) {
      console.error('Failed to submit report:', err);
      setErrorMsg('មានបញ្ហាក្នុងការបញ្ជូនឯកសារ។ សូមព្យាយាមម្តងទៀត។');
    } finally {
      setIsSubmitting(false);
    }
  };

  const currentDateKhmer = getAutoKhmerDate();

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/50 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95">
        {/* Header */}
        <div className="p-5 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="p-2.5 bg-sky-50 text-sky-700 border border-sky-200 rounded-xl">
              <Send className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-base font-bold text-slate-900 font-moul">
                បញ្ជូនឯកសាររបាយការណ៍ផ្លូវការ (Submit Report Document)
              </h2>
              <p className="text-xs text-slate-500">
                បញ្ជូនរបាយការណ៍ទៅកម្រង ឬការិយាល័យអប់រំស្រុក តាមរយៈប្រព័ន្ធ Firebase Cloud
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Toggle */}
        <div className="px-5 pt-3 border-b border-slate-100 flex gap-4">
          <button
            onClick={() => {
              setActiveSubTab('submit');
              setSuccessReceipt(null);
            }}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'submit'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <Send className="w-3.5 h-3.5" />
            <span>ទម្រង់បញ្ជូនឯកសារ</span>
          </button>
          <button
            onClick={() => setActiveSubTab('history')}
            className={`pb-2.5 text-xs font-semibold border-b-2 transition-colors flex items-center gap-1.5 ${
              activeSubTab === 'history'
                ? 'border-slate-900 text-slate-900'
                : 'border-transparent text-slate-500 hover:text-slate-800'
            }`}
          >
            <History className="w-3.5 h-3.5" />
            <span>ប្រវត្តិការបញ្ជូន ({submissionsList.length})</span>
          </button>
        </div>

        {/* Content Body */}
        <div className="p-5 overflow-y-auto flex-1 space-y-4">
          {!user ? (
            /* If not logged in */
            <div className="text-center py-8 px-4 space-y-4 bg-amber-50/50 rounded-xl border border-amber-200">
              <div className="w-12 h-12 bg-amber-100 text-amber-700 rounded-full flex items-center justify-center mx-auto">
                <ShieldCheck className="w-6 h-6" />
              </div>
              <div className="space-y-1">
                <h3 className="text-sm font-bold text-slate-900 font-moul">
                  តម្រូវឱ្យចូលប្រើគណនី (Authentication Required)
                </h3>
                <p className="text-xs text-slate-600 max-w-md mx-auto leading-relaxed">
                  ដើម្បីធានាសុវត្ថិភាពទិន្នន័យផ្លូវការ និងកត់ត្រាអត្តសញ្ញាណអ្នកបញ្ជូនឯកសារ សូមចូលប្រើប្រាស់តាមរយៈគណនី Google ជាមួយ Firebase Authentication។
                </p>
              </div>
              <button
                onClick={onSignIn}
                className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 hover:bg-slate-800 rounded-xl transition-all shadow-xs inline-flex items-center gap-2"
              >
                <span>ចូលប្រើប្រាស់ជាមួយ Google (Firebase Auth)</span>
              </button>
            </div>
          ) : activeSubTab === 'submit' ? (
            successReceipt ? (
              /* Success Receipt View */
              <div className="bg-emerald-50 border border-emerald-200 rounded-xl p-5 space-y-4 animate-in fade-in">
                <div className="flex items-center gap-3">
                  <span className="p-2 bg-emerald-100 text-emerald-800 rounded-full">
                    <CheckCircle2 className="w-6 h-6" />
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-emerald-950 font-moul">
                      ការបញ្ជូនឯកសារបានជោគជ័យ!
                    </h3>
                    <p className="text-xs text-emerald-700">
                      ឯកសាររបាយការណ៍ត្រូវបានកត់ត្រាក្នុងប្រព័ន្ធ Cloud Firestore រួចរាល់
                    </p>
                  </div>
                </div>

                <div className="bg-white p-4 rounded-lg border border-emerald-200 text-xs space-y-2 text-slate-700">
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">លេខកូដបញ្ជូន (ID)៖</span>
                    <span className="font-mono font-bold text-slate-900">{successReceipt.id}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">ស្ថាប័នទទួល៖</span>
                    <span className="font-medium text-slate-900">{successReceipt.recipientOffice}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">សាលារៀន៖</span>
                    <span className="font-medium text-slate-900">{successReceipt.schoolName}</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">អ្នកបញ្ជូន៖</span>
                    <span className="font-medium text-slate-900">{successReceipt.senderName} ({successReceipt.senderEmail})</span>
                  </div>
                  <div className="flex justify-between py-1 border-b border-slate-100">
                    <span className="text-slate-500">កាលបរិច្ឆេទបញ្ជូន៖</span>
                    <span className="font-medium text-slate-900">{successReceipt.khmerDateText}</span>
                  </div>
                  <div className="py-1">
                    <span className="text-slate-500 block mb-0.5">ខ្លឹមសារលិខិតភ្ជាប់៖</span>
                    <p className="text-slate-800 italic bg-slate-50 p-2 rounded">{successReceipt.submissionNotes}</p>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button
                    onClick={() => setActiveSubTab('history')}
                    className="px-3.5 py-1.5 text-xs text-slate-700 hover:bg-emerald-100/60 rounded-lg transition-colors font-medium"
                  >
                    មើលប្រវត្តិទាំងអស់
                  </button>
                  <button
                    onClick={() => window.print()}
                    className="px-3.5 py-1.5 text-xs text-white bg-emerald-700 hover:bg-emerald-800 rounded-lg transition-colors font-medium inline-flex items-center gap-1.5"
                  >
                    <Printer className="w-3.5 h-3.5" />
                    <span>បោះពុម្ពបង្កាន់ដៃ</span>
                  </button>
                </div>
              </div>
            ) : (
              /* Submission Form */
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                {errorMsg && (
                  <div className="p-3 bg-rose-50 border border-rose-200 text-rose-800 rounded-lg flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 shrink-0" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Summary Box */}
                <div className="bg-slate-50 p-3.5 rounded-xl border border-slate-200 space-y-1.5">
                  <div className="flex items-center justify-between text-[11px] text-slate-500">
                    <span>ឯកសារដែលត្រូវបញ្ជូន៖</span>
                    <span className="font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                      ត្រៀមរួចរាល់
                    </span>
                  </div>
                  <p className="font-bold text-slate-900 text-xs">
                    {report.info.reportTitle} - {report.info.schoolName}
                  </p>
                  <p className="text-[11px] text-slate-600">
                    ឆ្នាំសិក្សា {report.info.academicYear} | សិស្សសរុប {report.students.overall.total} នាក់ | បន្ទប់សរុប {report.info.roomsTotal}
                  </p>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-800">
                    ស្ថាប័ន / អង្គភាពទទួលឯកសារ៖
                  </label>
                  <select
                    value={recipientOffice}
                    onChange={e => setRecipientOffice(e.target.value)}
                    className="w-full p-2.5 border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  >
                    <option value="ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលស្រុក">
                      ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលស្រុក
                    </option>
                    <option value={`កម្រងសាលាបឋមសិក្សា ${report.info.cluster || 'ស្ពានស្រែង'}`}>
                      កម្រងសាលាបឋមសិក្សា {report.info.cluster || 'ស្ពានស្រែង'}
                    </option>
                    <option value="មន្ទីរអប់រំ យុវជន និងកីឡាខេត្ត">
                      មន្ទីរអប់រំ យុវជន និងកីឡាខេត្ត
                    </option>
                  </select>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-800">
                      ឈ្មោះអ្នករៀបចំ និងបញ្ជូន៖
                    </label>
                    <input
                      type="text"
                      required
                      value={senderName}
                      onChange={e => setSenderName(e.target.value)}
                      className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="block font-semibold text-slate-800">
                      កាលបរិច្ឆេទបញ្ជូន (ស្វ័យប្រវត្ត)៖
                    </label>
                    <input
                      type="text"
                      readOnly
                      disabled
                      value={currentDateKhmer.khmerSolarDate}
                      className="w-full p-2.5 bg-slate-100 border border-slate-200 rounded-lg text-slate-600"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="block font-semibold text-slate-800">
                    កំណត់ចំណាំ ឬលិខិតអមការបញ្ជូន៖
                  </label>
                  <textarea
                    rows={3}
                    value={submissionNotes}
                    onChange={e => setSubmissionNotes(e.target.value)}
                    placeholder="បញ្ចូលខ្លឹមសារលិខិតអម ឬការបញ្ជាក់បន្ថែម..."
                    className="w-full p-2.5 border border-slate-300 rounded-lg focus:ring-1 focus:ring-slate-900 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-amber-50/60 border border-amber-200/80 rounded-lg flex items-start gap-2 text-[11px] text-amber-900">
                  <Sparkles className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                  <span>
                    ឯកសារនឹងត្រូវបានរក្សាទុកស្វ័យប្រវត្តិក្នុ​ង **Firestore Collection (`report_submissions`)** ជាមួយអត្តសញ្ញាណអ្នកប្រើប្រាស់ និងត្រួតពិនិត្យតាមច្បាប់សុវត្ថិភាពទិន្នន័យ។
                  </span>
                </div>

                <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
                  <button
                    type="button"
                    onClick={onClose}
                    className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
                  >
                    បោះបង់
                  </button>
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 text-xs font-bold text-white bg-sky-700 hover:bg-sky-800 rounded-lg transition-all shadow-xs inline-flex items-center gap-2 disabled:opacity-50"
                  >
                    {isSubmitting ? (
                      <>
                        <span className="w-3.5 h-3.5 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                        <span>កំពុងបញ្ជូន...</span>
                      </>
                    ) : (
                      <>
                        <Send className="w-3.5 h-3.5" />
                        <span>បញ្ជាក់ និងបញ្ជូនឯកសារផ្លូវការ</span>
                      </>
                    )}
                  </button>
                </div>
              </form>
            )
          ) : (
            /* Submissions History List */
            <div className="space-y-3">
              {isLoadingHistory ? (
                <div className="py-12 text-center text-slate-400 text-xs flex items-center justify-center gap-2">
                  <span className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin"></span>
                  <span>កំពុងទាញយកប្រវត្តិការបញ្ជូន...</span>
                </div>
              ) : submissionsList.length === 0 ? (
                <div className="py-12 text-center text-slate-400 text-xs bg-slate-50 rounded-xl border border-dashed border-slate-200">
                  មិនទាន់មានប្រវត្តិការបញ្ជូនឯកសារនៅឡើយទេ
                </div>
              ) : (
                <div className="space-y-2.5">
                  {submissionsList.map(sub => (
                    <div
                      key={sub.id}
                      className="p-4 bg-white border border-slate-200 rounded-xl shadow-xs hover:border-slate-300 transition-colors text-xs space-y-2"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-slate-800 bg-slate-100 px-2 py-0.5 rounded text-[10px]">
                          {sub.id}
                        </span>
                        <span className="px-2 py-0.5 text-[10px] rounded font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>បានបញ្ជូន</span>
                        </span>
                      </div>

                      <div>
                        <p className="font-bold text-slate-900 text-xs">{sub.recipientOffice}</p>
                        <p className="text-[11px] text-slate-500 mt-0.5">{sub.khmerDateText}</p>
                      </div>

                      {sub.submissionNotes && (
                        <p className="text-slate-600 bg-slate-50 p-2 rounded text-[11px] italic">
                          "{sub.submissionNotes}"
                        </p>
                      )}

                      <div className="pt-1 flex items-center justify-between text-[10px] text-slate-400 border-t border-slate-100">
                        <span>អ្នកបញ្ជូន៖ {sub.senderName}</span>
                        <span>{new Date(sub.submittedAt).toLocaleString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
