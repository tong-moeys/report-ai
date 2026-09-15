import React, { useState } from 'react';
import {
  Database,
  ExternalLink,
  RefreshCw,
  CheckCircle2,
  AlertCircle,
  Clock,
  HardDrive,
  Copy,
  Check,
  X,
  ShieldCheck,
  FolderTree,
  CloudDownload,
  CloudUpload,
} from 'lucide-react';
import { FIRESTORE_CONFIG_INFO, testFirestoreConnection } from '../firebase';

interface FirestoreModalProps {
  isOpen: boolean;
  onClose: () => void;
  reportId: string;
  lastSavedTime: string | null;
  onFetchFromCloud: () => Promise<void>;
  onPushToCloud: () => Promise<void>;
  isSyncing: boolean;
}

export const FirestoreModal: React.FC<FirestoreModalProps> = ({
  isOpen,
  onClose,
  reportId,
  lastSavedTime,
  onFetchFromCloud,
  onPushToCloud,
  isSyncing,
}) => {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latencyMs?: number } | null>(null);
  const [isTesting, setIsTesting] = useState(false);

  if (!isOpen) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  const handleTestPing = async () => {
    setIsTesting(true);
    setTestResult(null);
    try {
      const res = await testFirestoreConnection();
      setTestResult(res);
    } finally {
      setIsTesting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-2xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[92vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-amber-900 via-orange-950 to-slate-900 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 flex items-center justify-center border border-amber-400/30">
              <Database className="w-5 h-5 text-amber-400" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-bold text-sm sm:text-base">
                  ព័ត៌មាន Cloud Firestore Database
                </h3>
                <span className="text-[10px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold">
                  Enterprise DB
                </span>
              </div>
              <p className="text-[11px] text-slate-300">
                ទីតាំងផ្ទុកទិន្នន័យពិតប្រាកដលើ Google Cloud Firestore
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4 text-xs">
          {/* Important Notice Callout */}
          <div className="p-3.5 bg-amber-50 border border-amber-200 rounded-xl text-amber-950 leading-relaxed">
            <div className="flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <div>
                <strong className="text-xs font-bold text-amber-900">
                  ហេតុអ្វីមិនឃើញទិន្នន័យនៅកន្លែងរំពឹងទុកក្នុង Firebase Console?
                </strong>
                <p className="text-[11px] text-amber-900/90 mt-1">
                  គម្រោងនេះប្រើប្រាស់ <strong>Named Database</strong> ផ្ទាល់ខ្លួនឈ្មោះ <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px] font-bold text-amber-900">{FIRESTORE_CONFIG_INFO.databaseId}</code>។
                  នៅពេលអ្នកបើក Firebase Console ជាទូទៅ ប្រព័ន្ធច្រើនតែបើកបង្ហាញ database <code className="bg-amber-100 px-1 py-0.5 rounded font-mono text-[10px]">(default)</code> ដែលគ្មានទិន្នន័យឡើយ។
                </p>
                <p className="text-[11px] text-amber-900/90 mt-1 font-semibold">
                  👉 សូមចុចប៊ូតុង «បើក Firebase Console ផ្ទាល់» ខាងក្រោមដើម្បីចូលទៅចំទីតាំង Database នេះតែម្តង!
                </p>
              </div>
            </div>
          </div>

          {/* Quick Actions Bar */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
            <a
              href={FIRESTORE_CONFIG_INFO.consoleUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-amber-600 to-orange-600 hover:from-amber-700 hover:to-orange-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer text-center text-xs"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>បើក Firebase Console</span>
            </a>

            <button
              onClick={onFetchFromCloud}
              disabled={isSyncing}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer text-xs disabled:opacity-50"
            >
              <CloudDownload className="w-3.5 h-3.5" />
              <span>{isSyncing ? 'កំពុងទាញ...' : 'ទាញទិន្នន័យពី Cloud'}</span>
            </button>

            <button
              onClick={onPushToCloud}
              disabled={isSyncing}
              className="flex items-center justify-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl font-bold shadow-xs transition-colors cursor-pointer text-xs disabled:opacity-50"
            >
              <CloudUpload className="w-3.5 h-3.5" />
              <span>{isSyncing ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកទៅ Cloud ឥឡូវ'}</span>
            </button>
          </div>

          {/* Connection Test Block */}
          <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl flex flex-wrap items-center justify-between gap-2">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="font-semibold text-slate-800 text-xs">ស្ថានភាពតភ្ជាប់ Firestore (Ping):</span>
              {testResult && (
                <span
                  className={`text-[11px] font-medium px-2 py-0.5 rounded-md ${
                    testResult.success
                      ? 'bg-emerald-100 text-emerald-800'
                      : 'bg-rose-100 text-rose-800'
                  }`}
                >
                  {testResult.message}
                </span>
              )}
            </div>
            <button
              onClick={handleTestPing}
              disabled={isTesting}
              className="flex items-center gap-1 px-2.5 py-1 text-[11px] bg-white hover:bg-slate-100 border border-slate-300 rounded-lg text-slate-700 font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              <RefreshCw className={`w-3 h-3 ${isTesting ? 'animate-spin' : ''}`} />
              <span>{isTesting ? 'កំពុងតេស្ត...' : 'តេស្ត Connection'}</span>
            </button>
          </div>

          {/* Configuration Identifiers Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 font-bold text-[11px] text-slate-700 flex items-center gap-1.5">
              <HardDrive className="w-3.5 h-3.5 text-slate-500" />
              <span>អត្តសញ្ញាណបច្ចេកទេស Firestore (Technical Identifiers)</span>
            </div>
            <div className="divide-y divide-slate-100">
              {/* Project ID */}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-white">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Project ID</div>
                  <div className="font-mono text-xs font-semibold text-slate-900">{FIRESTORE_CONFIG_INFO.projectId}</div>
                </div>
                <button
                  onClick={() => handleCopy(FIRESTORE_CONFIG_INFO.projectId, 'pid')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                  title="Copy"
                >
                  {copiedKey === 'pid' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Database ID */}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-amber-50/40">
                <div>
                  <div className="text-[10px] text-amber-800 font-bold uppercase flex items-center gap-1">
                    <span>Database ID (សំខាន់បំផុត)</span>
                    <span className="bg-amber-200 text-amber-900 px-1 rounded text-[9px]">Named DB</span>
                  </div>
                  <div className="font-mono text-xs font-bold text-amber-950 break-all">{FIRESTORE_CONFIG_INFO.databaseId}</div>
                </div>
                <button
                  onClick={() => handleCopy(FIRESTORE_CONFIG_INFO.databaseId, 'dbid')}
                  className="p-1 text-amber-600 hover:text-amber-900 rounded hover:bg-amber-100 cursor-pointer"
                  title="Copy"
                >
                  {copiedKey === 'dbid' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Current Report Document Path */}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-white">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">Document Path សាលាបច្ចុប្បន្ន</div>
                  <div className="font-mono text-xs font-medium text-slate-800">
                    school_reports/<span className="font-bold text-blue-700">{reportId}</span>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(`school_reports/${reportId}`, 'docpath')}
                  className="p-1 text-slate-400 hover:text-slate-700 rounded hover:bg-slate-100 cursor-pointer"
                  title="Copy"
                >
                  {copiedKey === 'docpath' ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              {/* Last Saved Time */}
              <div className="p-2.5 flex items-center justify-between gap-2 bg-white">
                <div>
                  <div className="text-[10px] text-slate-400 font-bold uppercase">រក្សាទុកចុងក្រោយ</div>
                  <div className="text-xs text-slate-700 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{lastSavedTime || 'មិនទាន់មានកំណត់ត្រា'}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Collections List */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-100 px-3 py-1.5 border-b border-slate-200 font-bold text-[11px] text-slate-700 flex items-center gap-1.5">
              <FolderTree className="w-3.5 h-3.5 text-slate-500" />
              <span>បញ្ជី Collections ក្នុង Database នេះ</span>
            </div>
            <div className="divide-y divide-slate-100">
              {FIRESTORE_CONFIG_INFO.collections.map((col) => (
                <div key={col.id} className="p-2.5 flex items-start gap-2.5 bg-white">
                  <span className="w-2 h-2 rounded-full bg-blue-500 shrink-0 mt-1.5" />
                  <div>
                    <code className="font-mono text-xs font-bold text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded">
                      /{col.name}
                    </code>
                    <p className="text-[11px] text-slate-500 mt-0.5">{col.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500 shrink-0">
          <div className="flex items-center gap-1 text-emerald-700 font-medium">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span>បានភ្ជាប់ Firebase Security Rules និង Firestore Auth រួចរាល់</span>
          </div>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 font-semibold rounded-lg cursor-pointer"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
