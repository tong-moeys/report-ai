import React, { useState } from 'react';
import { AppUser, ReportSnapshotData, ReportVersionHistoryItem } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import {
  History,
  RotateCcw,
  Trash2,
  Download,
  PlusCircle,
  Clock,
  User,
  CheckCircle,
  AlertTriangle,
  X,
  ShieldCheck,
  FileSpreadsheet,
} from 'lucide-react';

interface SaveHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUser: AppUser | null;
  historyList: ReportVersionHistoryItem[];
  onSaveNewVersion: (note: string) => Promise<void>;
  onRestoreVersion: (version: ReportVersionHistoryItem) => void;
  onDeleteVersion: (versionId: string) => Promise<void>;
  isSaving: boolean;
}

export const SaveHistoryModal: React.FC<SaveHistoryModalProps> = ({
  isOpen,
  onClose,
  currentUser,
  historyList,
  onSaveNewVersion,
  onRestoreVersion,
  onDeleteVersion,
  isSaving,
}) => {
  const [newNote, setNewNote] = useState('');
  const [confirmRestoreId, setConfirmRestoreId] = useState<string | null>(null);
  const [selectedSnapshot, setSelectedSnapshot] = useState<ReportVersionHistoryItem | null>(null);

  if (!isOpen) return null;

  const handleSaveSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onSaveNewVersion(newNote);
    setNewNote('');
  };

  const handleDownloadSnapshotJson = (item: ReportVersionHistoryItem) => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(item.reportSnapshot, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute(
      'download',
      `Snapshot_v${item.versionNumber}_${item.schoolName}_${new Date(item.timestamp).toISOString().split('T')[0]}.json`
    );
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-3xl w-full shadow-2xl border border-slate-200 overflow-hidden max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="p-4 bg-gradient-to-r from-slate-900 via-indigo-950 to-blue-950 text-white flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center border border-white/20">
              <History className="w-5 h-5 text-amber-300" />
            </div>
            <div>
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <span>ប្រវត្តិនៃការរក្សាទុក & កំណែទិន្នន័យ (Version History)</span>
                <span className="text-[11px] bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded-full font-mono">
                  {toKhmerNum(historyList.length)} កំណែ
                </span>
              </h3>
              <p className="text-[11px] text-slate-300">
                កត់ត្រារាល់ការកែប្រែ ជាមួយលទ្ធភាពស្តារឡើងវិញ (Restore Snapshot)
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

        {/* Create New Snapshot Form */}
        <div className="p-3 bg-slate-50 border-b border-slate-200 shrink-0">
          <form onSubmit={handleSaveSubmit} className="flex flex-col sm:flex-row gap-2">
            <input
              type="text"
              value={newNote}
              onChange={(e) => setNewNote(e.target.value)}
              placeholder="បញ្ចូលចំណាំសម្រាប់ការរក្សាទុកកំណែនេះ (ឧ. បានបញ្ចូលពិន្ទុឆមាស២ចប់សព្វគ្រប់)..."
              className="flex-1 text-xs px-3 py-2 bg-white border border-slate-300 rounded-lg outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
            />
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center justify-center gap-1.5 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer whitespace-nowrap disabled:opacity-50"
            >
              <PlusCircle className="w-4 h-4" />
              <span>{isSaving ? 'កំពុងរក្សាទុក...' : 'រក្សាទុកកំណែថ្មី (Save Snapshot)'}</span>
            </button>
          </form>
          {currentUser && (
            <div className="flex items-center gap-2 mt-1.5 text-[11px] text-slate-500">
              <span className="flex items-center gap-1">
                <User className="w-3 h-3 text-slate-400" />
                អ្នករក្សាទុក ៖ <strong className="text-slate-700">{currentUser.displayName || currentUser.role}</strong>
              </span>
              <span>•</span>
              <span className="text-emerald-700 font-medium flex items-center gap-0.5">
                <ShieldCheck className="w-3 h-3" />
                បានភ្ជាប់ Firestore Cloud Sync
              </span>
            </div>
          )}
        </div>

        {/* History List */}
        <div className="flex-1 overflow-y-auto p-3 sm:p-4 space-y-3">
          {historyList.length === 0 ? (
            <div className="text-center py-12 text-slate-400">
              <History className="w-12 h-12 mx-auto mb-2 text-slate-300 stroke-1" />
              <p className="text-sm font-semibold text-slate-600">មិនទាន់មានប្រវត្តិរក្សាទុកនៅឡើយទេ</p>
              <p className="text-xs text-slate-400 mt-1 max-w-sm mx-auto">
                ចុចប៊ូតុង "រក្សាទុកកំណែថ្មី" ខាងលើ ដើម្បីបង្កើត snapshot កំណែទិន្នន័យដំបូងបង្អស់សម្រាប់សាលារៀនរបស់អ្នក។
              </p>
            </div>
          ) : (
            historyList.map((item) => {
              const isConfirming = confirmRestoreId === item.id;
              return (
                <div
                  key={item.id}
                  className="bg-white border border-slate-200 rounded-xl p-3 sm:p-3.5 hover:border-indigo-300 transition-all shadow-2xs space-y-2.5"
                >
                  {/* Top line: Version badge, type, timestamp */}
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2 py-0.5 bg-indigo-50 text-indigo-800 border border-indigo-200 rounded-md font-bold text-xs font-mono">
                        កំណែទី {toKhmerNum(item.versionNumber)}
                      </span>
                      <span
                        className={`text-[10px] px-2 py-0.5 rounded font-semibold ${
                          item.actionType === 'manual_save'
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : item.actionType === 'restore_version'
                            ? 'bg-amber-50 text-amber-700 border border-amber-200'
                            : 'bg-slate-100 text-slate-600'
                        }`}
                      >
                        {item.actionType === 'manual_save'
                          ? 'រក្សាទុកដោយដៃ'
                          : item.actionType === 'restore_version'
                          ? 'បានស្តារឡើងវិញ'
                          : 'ស្វ័យប្រវត្តិ'}
                      </span>
                    </div>

                    <div className="flex items-center gap-1.5 text-xs text-slate-500 font-mono">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{item.savedAt}</span>
                    </div>
                  </div>

                  {/* Middle details: User & summary */}
                  <div className="text-xs text-slate-700 bg-slate-50/70 p-2 rounded-lg flex flex-wrap items-center justify-between gap-2 border border-slate-150">
                    <div className="space-y-0.5">
                      <p className="font-semibold text-slate-900">
                        {item.summaryNotes || 'គ្មានកំណត់សម្គាល់'}
                      </p>
                      <p className="text-[11px] text-slate-500 flex items-center gap-1">
                        <span>ដោយ ៖ <strong>{item.userName}</strong> ({item.userRole})</span>
                        {item.userEmail && <span>• {item.userEmail}</span>}
                      </p>
                    </div>

                    <div className="text-right text-[11px] text-slate-600 font-mono">
                      <span>សិស្សសរុប ៖ <strong>{toKhmerNum(item.totalStudents)}</strong> នាក់</span>
                      <span className="mx-1.5">•</span>
                      <span>បុគ្គលិក ៖ <strong>{toKhmerNum(item.totalStaff)}</strong> នាក់</span>
                    </div>
                  </div>

                  {/* Confirmation Warning if clicked Restore */}
                  {isConfirming && (
                    <div className="p-2.5 bg-amber-50 border border-amber-300 rounded-lg text-xs text-amber-900 space-y-2 animate-in fade-in duration-150">
                      <div className="flex items-start gap-2">
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <div>
                          <p className="font-bold">តើអ្នកពិតជាចង់ស្តារទិន្នន័យទៅកាន់ "កំណែទី {toKhmerNum(item.versionNumber)}" នេះមែនទេ?</p>
                          <p className="text-[11px] text-amber-800 mt-0.5">
                            ទិន្នន័យបច្ចុប្បន្នទាំងអស់ (តារាងទី១ ដល់ ៤, បុគ្គលិក, ថ្នាក់រៀន, ស្ថិតិ B) នឹងត្រូវជំនួសដោយ snapshot នៃកំណែនេះ។
                          </p>
                        </div>
                      </div>
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => setConfirmRestoreId(null)}
                          className="px-2.5 py-1 bg-white border border-slate-300 text-slate-700 rounded text-xs cursor-pointer hover:bg-slate-50"
                        >
                          បោះបង់
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            onRestoreVersion(item);
                            setConfirmRestoreId(null);
                            onClose();
                          }}
                          className="px-3 py-1 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded text-xs cursor-pointer shadow-xs"
                        >
                          យល់ព្រមស្តារឡើងវិញ
                        </button>
                      </div>
                    </div>
                  )}

                  {/* Action Buttons */}
                  {!isConfirming && (
                    <div className="flex items-center justify-end gap-2 pt-1 border-t border-slate-100">
                      <button
                        type="button"
                        onClick={() => handleDownloadSnapshotJson(item)}
                        className="flex items-center gap-1 text-[11px] px-2 py-1 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded transition-colors cursor-pointer"
                        title="ទាញយកជាឯកសារ JSON Backup"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>JSON</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => onDeleteVersion(item.id)}
                        className="flex items-center gap-1 text-[11px] px-2 py-1 text-rose-600 hover:text-rose-800 hover:bg-rose-50 rounded transition-colors cursor-pointer"
                        title="លុបកំណែនេះចេញពីប្រវត្តិ"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>លុប</span>
                      </button>

                      <button
                        type="button"
                        onClick={() => setConfirmRestoreId(item.id)}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-white font-bold rounded-lg transition-colors cursor-pointer shadow-2xs"
                        title="ស្តារទិន្នន័យត្រឡប់ទៅកាន់ snapshot នេះ"
                      >
                        <RotateCcw className="w-3.5 h-3.5" />
                        <span>ស្តារកំណែនេះឡើងវិញ</span>
                      </button>
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-100 border-t border-slate-200 flex justify-between items-center text-xs text-slate-500 shrink-0">
          <span>រាល់ទិន្នន័យត្រូវបានកត់ត្រាលើ Google Cloud Firestore</span>
          <button
            type="button"
            onClick={onClose}
            className="px-3 py-1 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg cursor-pointer"
          >
            បិទ
          </button>
        </div>
      </div>
    </div>
  );
};
