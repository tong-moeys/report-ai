import React, { useState } from 'react';
import { AppUser, UserRole } from '../types';
import { loginWithGoogle, loginWithRole } from '../firebase';
import { LogIn, Shield, UserCheck, AlertCircle, Sparkles, X, School, CheckCircle2 } from 'lucide-react';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: AppUser) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, onLoginSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRole, setSelectedRole] = useState<UserRole>('នាយកសាលា');
  const [customName, setCustomName] = useState('');

  if (!isOpen) return null;

  const handleGoogleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithGoogle();
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Google Sign-in failed:', err);
      setError(
        'ការចូលគណនី Google អាចនឹងត្រូវរារាំងដោយកម្មវិធីរុករកក្នុង iFrame។ សូមសាកល្បងជម្រើស "ចូលតាមតួនាទីអប់រំ" ខាងក្រោមដើម្បីដំណើរការភ្លាមៗ!'
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRoleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      const user = await loginWithRole(selectedRole, customName.trim() || undefined);
      onLoginSuccess(user);
      onClose();
    } catch (err: any) {
      console.error('Role login failed:', err);
      setError('មិនអាចបង្កើតសម័យចូលប្រើប្រាស់បានទេ៖ ' + (err.message || 'សូមព្យាយាមម្តងទៀត'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-200">
      <div className="bg-white rounded-2xl max-w-md w-full shadow-2xl border border-slate-200 overflow-hidden">
        {/* Modal Header */}
        <div className="p-4 sm:p-5 bg-gradient-to-r from-blue-700 via-indigo-700 to-slate-900 text-white relative">
          <button
            onClick={onClose}
            className="absolute top-3 right-3 p-1 text-white/70 hover:text-white rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center border border-white/20 shrink-0">
              <Shield className="w-5 h-5 text-yellow-300" />
            </div>
            <div>
              <h3 className="font-bold text-base sm:text-lg">
                ផ្ទៀងផ្ទាត់អត្តសញ្ញាណ & ចូលប្រព័ន្ធ
              </h3>
              <p className="text-xs text-blue-100">
                ប្រព័ន្ធគ្រប់គ្រង និងកត់ត្រាប្រវត្តិរបាយការណ៍សាលារៀន
              </p>
            </div>
          </div>
        </div>

        <div className="p-4 sm:p-5 space-y-4">
          {/* Why Authentication Matters */}
          <div className="p-3 bg-blue-50/60 border border-blue-100 rounded-xl text-xs space-y-1.5 text-slate-700">
            <p className="font-bold text-blue-900 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              អត្ថប្រយោជន៍នៃការចូលគណនីក្នុងប្រព័ន្ធ ៖
            </p>
            <ul className="space-y-1 text-[11px] text-slate-600 pl-4 list-disc">
              <li>រក្សាទុករបាយការណ៍លើ Cloud Firestore ដោយសុវត្ថិភាព</li>
              <li>កត់ត្រាប្រវត្តិការកែប្រែ (Audit Trail & Version History)</li>
              <li>អាច Restore ឬទាញយកទិន្នន័យចាស់ៗមកវិញបានគ្រប់ពេលវេលា</li>
            </ul>
          </div>

          {error && (
            <div className="p-2.5 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900 flex items-start gap-2">
              <AlertCircle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
              <span>{error}</span>
            </div>
          )}

          {/* Method 1: Google Authentication */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1.5">
              ជម្រើសទី ១ ៖ ចូលគណនីផ្លូវការជាមួយ Google
            </label>
            <button
              id="btn-login-google"
              onClick={handleGoogleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-2.5 py-2.5 px-4 bg-white hover:bg-slate-50 text-slate-800 border border-slate-300 rounded-xl font-medium text-xs shadow-xs transition-all cursor-pointer hover:border-blue-400 disabled:opacity-50"
            >
              <svg className="w-4 h-4" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'កំពុងភ្ជាប់...' : 'ចូលគណនីជាមួយ Google Account'}</span>
            </button>
          </div>

          <div className="relative flex items-center justify-center my-1">
            <div className="border-t border-slate-200 w-full" />
            <span className="bg-white px-2 text-[10px] text-slate-400 font-medium uppercase absolute">
              ឬ ចូលតាមតួនាទីអប់រំ
            </span>
          </div>

          {/* Method 2: Role-based Educational Login (Always reliable in iFrame) */}
          <div className="space-y-2 bg-slate-50 p-3 rounded-xl border border-slate-200">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800">
              <School className="w-4 h-4 text-indigo-600" />
              <span>ជម្រើសទី ២ ៖ ជ្រើសរើសតួនាទីក្នុងសាលា</span>
            </div>

            <div className="grid grid-cols-2 gap-1.5 pt-1">
              {(['នាយកសាលា', 'នាយករង', 'មន្ត្រីស្ថិតិ', 'គ្រូបង្រៀន'] as UserRole[]).map((role) => (
                <button
                  key={role}
                  type="button"
                  onClick={() => setSelectedRole(role)}
                  className={`px-2.5 py-1.5 rounded-lg text-xs font-medium border text-left transition-all flex items-center justify-between cursor-pointer ${
                    selectedRole === role
                      ? 'bg-indigo-600 text-white border-indigo-700 shadow-xs'
                      : 'bg-white text-slate-700 border-slate-200 hover:bg-slate-100'
                  }`}
                >
                  <span>{role}</span>
                  {selectedRole === role && <CheckCircle2 className="w-3.5 h-3.5" />}
                </button>
              ))}
            </div>

            <div className="pt-1">
              <label className="block text-[11px] text-slate-600 font-medium mb-1">
                ឈ្មោះអ្នកប្រើប្រាស់ (ស្រេចចិត្ត)
              </label>
              <input
                type="text"
                value={customName}
                onChange={(e) => setCustomName(e.target.value)}
                placeholder={`ឧ. លោក ${selectedRole} សាលាបឋមសិក្សា`}
                className="w-full text-xs px-2.5 py-1.5 bg-white border border-slate-300 rounded-lg outline-hidden focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500"
              />
            </div>

            <button
              id="btn-login-role"
              onClick={handleRoleLogin}
              disabled={loading}
              className="w-full flex items-center justify-center gap-1.5 py-2 px-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-bold text-xs shadow-xs transition-colors cursor-pointer mt-2 disabled:opacity-50"
            >
              <UserCheck className="w-4 h-4" />
              <span>{loading ? 'កំពុងចូល...' : `ចូលប្រើប្រាស់ជា «${selectedRole}»`}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
