import React, { useState } from 'react';
import { AppUser, UserRole } from '../types';
import { logoutUser, FIRESTORE_CONFIG_INFO } from '../firebase';
import { toKhmerNum } from '../utils/khmerNumbers';
import {
  LogIn,
  LogOut,
  User,
  History,
  Save,
  CheckCircle2,
  ChevronDown,
  Cloud,
  Shield,
  RefreshCw,
  Database,
  ExternalLink,
} from 'lucide-react';

interface UserProfileMenuProps {
  currentUser: AppUser | null;
  onOpenAuthModal: () => void;
  onOpenHistoryModal: () => void;
  onOpenFirestoreModal: () => void;
  onQuickSave: () => void;
  isSaving: boolean;
  historyCount: number;
  lastSavedTime: string | null;
  onChangeRole: (newRole: UserRole) => void;
}

export const UserProfileMenu: React.FC<UserProfileMenuProps> = ({
  currentUser,
  onOpenAuthModal,
  onOpenHistoryModal,
  onOpenFirestoreModal,
  onQuickSave,
  isSaving,
  historyCount,
  lastSavedTime,
  onChangeRole,
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  const handleLogout = async () => {
    setIsDropdownOpen(false);
    await logoutUser();
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'នាយកសាលា':
        return 'bg-blue-600 text-white';
      case 'នាយករង':
        return 'bg-indigo-600 text-white';
      case 'មន្ត្រីស្ថិតិ':
        return 'bg-teal-600 text-white';
      case 'គ្រូបង្រៀន':
        return 'bg-emerald-600 text-white';
      default:
        return 'bg-slate-700 text-white';
    }
  };

  if (!currentUser) {
    return (
      <div className="flex items-center gap-1.5">
        <button
          id="btn-login-header"
          onClick={onOpenAuthModal}
          className="flex items-center gap-1 px-2.5 py-1.5 bg-gradient-to-r from-blue-700 to-indigo-700 hover:from-blue-800 hover:to-indigo-800 text-white text-xs font-bold rounded-lg shadow-xs transition-all cursor-pointer"
          title="ចូលប្រព័ន្ធដើម្បីបើកដំណើរការ Cloud Sync & ប្រវត្តិរក្សាទុក"
        >
          <LogIn className="w-3.5 h-3.5" />
          <span>ចូលប្រព័ន្ធ (Login)</span>
        </button>
      </div>
    );
  }

  return (
    <div className="relative flex items-center gap-1 sm:gap-1.5">
      {/* Firestore DB Button - Compact with Short Label */}
      <button
        id="btn-open-firestore-modal"
        onClick={onOpenFirestoreModal}
        className="flex items-center gap-1 px-2 py-1 text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-900 border border-amber-300 rounded-lg shadow-2xs transition-colors cursor-pointer"
        title="ពិនិត្យទីតាំងទិន្នន័យលើ Cloud Firestore Database"
      >
        <Database className="w-3.5 h-3.5 text-amber-700" />
        <span className="font-mono text-[11px] font-bold">Firestore</span>
      </button>

      {/* Quick Save Snapshot Button */}
      <button
        id="btn-quick-save-snapshot"
        onClick={onQuickSave}
        disabled={isSaving}
        className="flex items-center gap-1 px-2.5 py-1 text-xs font-bold bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg shadow-2xs transition-colors cursor-pointer disabled:opacity-50"
        title="រក្សាទុកទិន្នន័យទៅ Cloud Firestore ភ្លាមៗ"
      >
        {isSaving ? <RefreshCw className="w-3 h-3 animate-spin" /> : <Save className="w-3 h-3" />}
        <span>{isSaving ? 'កំពុងសេវ...' : 'រក្សាទុក'}</span>
      </button>

      {/* History Button with Counter Badge */}
      <button
        id="btn-open-history-header"
        onClick={onOpenHistoryModal}
        className="flex items-center gap-1 px-2 py-1 text-xs font-semibold bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg shadow-2xs transition-colors cursor-pointer"
        title="មើលប្រវត្តិនៃការរក្សាទុក និងស្តារកំណែចាស់ៗ"
      >
        <History className="w-3.5 h-3.5 text-amber-600" />
        <span>ប្រវត្តិ</span>
        {historyCount > 0 && (
          <span className="ml-0.5 px-1 py-0.2 bg-amber-100 text-amber-900 rounded-full font-mono text-[10px] font-bold">
            {toKhmerNum(historyCount)}
          </span>
        )}
      </button>

      {/* User Profile Pill & Dropdown Toggle */}
      <div className="relative">
        <button
          id="btn-user-profile-toggle"
          onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          className="flex items-center gap-1.5 px-2 py-1 bg-slate-100 hover:bg-slate-200 border border-slate-200 rounded-lg text-xs font-medium text-slate-800 transition-colors cursor-pointer"
        >
          {currentUser.photoURL ? (
            <img
              src={currentUser.photoURL}
              alt=""
              className="w-5 h-5 rounded-full object-cover"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className={`w-5 h-5 rounded-full flex items-center justify-center text-[10px] font-bold ${getRoleColor(currentUser.role)}`}>
              {currentUser.role.charAt(0)}
            </div>
          )}
          <span className="max-w-[70px] sm:max-w-[100px] truncate text-slate-900 font-bold">
            {currentUser.displayName || currentUser.role}
          </span>
          <span className={`text-[10px] px-1 rounded font-semibold hidden md:inline-block ${getRoleColor(currentUser.role)}`}>
            {currentUser.role}
          </span>
          <ChevronDown className="w-3 h-3 text-slate-500" />
        </button>

        {/* Dropdown Menu */}
        {isDropdownOpen && (
          <div className="absolute right-0 mt-1 w-64 bg-white border border-slate-200 rounded-xl shadow-xl p-2 z-50 text-xs animate-in fade-in duration-150">
            {/* Account Info */}
            <div className="p-2 border-b border-slate-100 mb-1">
              <div className="flex items-center gap-2">
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${getRoleColor(currentUser.role)}`}>
                  {currentUser.role.charAt(0)}
                </div>
                <div className="overflow-hidden">
                  <p className="font-bold text-slate-900 truncate">
                    {currentUser.displayName || 'អ្នកប្រើប្រាស់'}
                  </p>
                  <p className="text-[11px] text-slate-500 truncate font-mono">
                    {currentUser.email || 'គណនីអប់រំ'}
                  </p>
                </div>
              </div>

              <div className="mt-2 pt-1 border-t border-slate-100 flex items-center justify-between text-[10px] text-slate-500">
                <span className="flex items-center gap-1 text-emerald-700 font-medium">
                  <Cloud className="w-3 h-3" />
                  Firestore Sync
                </span>
                {lastSavedTime && (
                  <span className="truncate">ចុងក្រោយ ៖ {lastSavedTime}</span>
                )}
              </div>
            </div>

            {/* Firestore Direct Links inside Dropdown */}
            <div className="p-1 space-y-1">
              <button
                onClick={() => {
                  onOpenFirestoreModal();
                  setIsDropdownOpen(false);
                }}
                className="w-full flex items-center justify-between px-2 py-1.5 text-amber-900 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors cursor-pointer font-medium"
              >
                <span className="flex items-center gap-1.5">
                  <Database className="w-3.5 h-3.5 text-amber-600" />
                  <span>ព័ត៌មាន Firestore DB</span>
                </span>
                <span className="text-[9px] bg-amber-200 text-amber-800 px-1 py-0.5 rounded font-mono font-bold">
                  Console
                </span>
              </button>

              <a
                href={FIRESTORE_CONFIG_INFO.consoleUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full flex items-center justify-between px-2 py-1.5 text-slate-700 hover:bg-slate-50 rounded-lg transition-colors cursor-pointer font-medium"
              >
                <span className="flex items-center gap-1.5">
                  <ExternalLink className="w-3.5 h-3.5 text-slate-500" />
                  <span>បើក Firebase Console</span>
                </span>
              </a>
            </div>

            <div className="border-t border-slate-100 my-1" />

            {/* Change Role Quick Switch */}
            <div className="p-1.5 space-y-1">
              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider px-1">
                ប្តូរតួនាទី (Switch Role)
              </p>
              {(['នាយកសាលា', 'នាយករង', 'មន្ត្រីស្ថិតិ', 'គ្រូបង្រៀន'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  onClick={() => {
                    onChangeRole(role);
                    setIsDropdownOpen(false);
                  }}
                  className={`w-full text-left px-2 py-1 rounded flex items-center justify-between transition-colors cursor-pointer ${
                    currentUser.role === role ? 'bg-indigo-50 text-indigo-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{role}</span>
                  {currentUser.role === role && <CheckCircle2 className="w-3 h-3 text-indigo-600" />}
                </button>
              ))}
            </div>

            <div className="border-t border-slate-100 my-1" />

            {/* Logout */}
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2 px-2 py-1.5 text-rose-600 hover:bg-rose-50 rounded-lg transition-colors cursor-pointer font-medium"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>ចាកចេញ (Logout)</span>
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
