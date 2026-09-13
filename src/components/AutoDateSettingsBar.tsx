import React, { useState } from 'react';
import {
  Calendar,
  Sparkles,
  RefreshCw,
  Clock,
  CheckCircle2,
  CalendarCheck,
  ChevronDown,
  Info
} from 'lucide-react';
import { FullSchoolReport } from '../types';
import { getKhmerLunarDateInfo, toKhmerDigits } from '../khmerCalendarData';

interface AutoDateSettingsBarProps {
  report: FullSchoolReport;
  onChange: (updated: FullSchoolReport) => void;
}

export const AutoDateSettingsBar: React.FC<AutoDateSettingsBarProps> = ({
  report,
  onChange,
}) => {
  const [isExpanded, setIsExpanded] = useState(false);

  const autoDateEnabled = report.info.autoDateEnabled ?? true;
  const customDateStr = report.info.customReportDate || '2026-03-21';

  // Apply a specific date
  const applyDate = (dateStr: string, isAuto: boolean = true) => {
    const parts = dateStr.split('-');
    const dateObj = new Date(Number(parts[0]), Number(parts[1]) - 1, Number(parts[2]));
    const lunarInfo = getKhmerLunarDateInfo(dateObj);

    const updated: FullSchoolReport = {
      ...report,
      info: {
        ...report.info,
        autoDateEnabled: isAuto,
        customReportDate: dateStr,
        reportDateKhmerLunar: lunarInfo.fullChhnamString,
        reportDateKhmerSolar: lunarInfo.solarDateStringKhmer,
      },
    };
    onChange(updated);
  };

  // Set today's date
  const setTodayDate = () => {
    const today = new Date();
    const mStr = String(today.getMonth() + 1).padStart(2, '0');
    const dStr = String(today.getDate()).padStart(2, '0');
    const todayStr = `${today.getFullYear()}-${mStr}-${dStr}`;
    applyDate(todayStr, true);
  };

  // Set official report milestone date (21 March 2026)
  const setOfficialMilestoneDate = () => {
    applyDate('2026-03-21', true);
  };

  const currentLunar = report.info.reportDateKhmerLunar || 'ថ្ងៃសៅរ៍ ១៥រោច ខែបុស្ស ឆ្នាំម្សាញ់ សប្ដស័ក ព.ស.២៥៦៩';
  const currentSolar = report.info.reportDateKhmerSolar || 'ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦';

  return (
    <div className="no-print bg-gradient-to-r from-amber-50/90 via-white to-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 shadow-xs transition-all">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
        {/* Left: Current Active Date preview with Lunar & Solar */}
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-lg bg-amber-100 text-amber-800 flex items-center justify-center shrink-0 border border-amber-300">
            <CalendarCheck className="w-5 h-5" />
          </div>

          <div className="space-y-0.5">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold text-amber-950 font-moul">
                កាលបរិច្ឆេទស្វ័យប្រវត្តិ (Auto-Date):
              </span>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-100 text-emerald-800 border border-emerald-200 flex items-center gap-1">
                <CheckCircle2 className="w-3 h-3" />
                <span>បានភ្ជាប់ហត្ថលេខា & ក្បាលឯកសារ</span>
              </span>
            </div>

            <p className="text-xs text-slate-800 font-medium leading-relaxed">
              <span className="text-amber-900 font-semibold">{currentLunar}</span>
              <span className="mx-1 text-slate-400">•</span>
              <span className="text-slate-700">{report.info.schoolName.replace(/^សាលាបឋមសិក្សា\s*/, '') || 'រោគ'}, {currentSolar}</span>
            </p>
          </div>
        </div>

        {/* Right: Quick actions & Expand button */}
        <div className="flex items-center gap-2 self-end md:self-center">
          <button
            onClick={setOfficialMilestoneDate}
            className="px-2.5 py-1.5 text-[11px] font-medium text-amber-900 bg-amber-100/80 hover:bg-amber-200/90 rounded-lg border border-amber-300 transition-colors"
            title="កំណត់ទៅថ្ងៃ ២១ មីនា ២០២៦"
          >
            ២១ មីនា ២០២៦
          </button>

          <button
            onClick={setTodayDate}
            className="px-2.5 py-1.5 text-[11px] font-medium text-slate-700 bg-white hover:bg-slate-100 rounded-lg border border-slate-200 transition-colors"
            title="កំណត់ទៅថ្ងៃនេះ (Real-time Today)"
          >
            ថ្ងៃនេះ
          </button>

          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="px-2.5 py-1.5 text-[11px] font-semibold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-lg transition-colors flex items-center gap-1"
          >
            <span>កែសម្រួលកាលបរិច្ឆេទ</span>
            <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isExpanded ? 'rotate-180' : ''}`} />
          </button>
        </div>
      </div>

      {/* Expanded Control Box */}
      {isExpanded && (
        <div className="mt-3 pt-3 border-t border-amber-200/60 grid grid-cols-1 md:grid-cols-3 gap-3 animate-in fade-in">
          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              ជ្រើសរើសថ្ងៃខែឆ្នាំ (Solar Date Picker)៖
            </label>
            <input
              type="date"
              value={customDateStr}
              onChange={e => applyDate(e.target.value, autoDateEnabled)}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              កាលបរិច្ឆេទចន្ទគតិខ្មែរ (ស្វ័យប្រវត្តិ ឬកែប្រែ)៖
            </label>
            <input
              type="text"
              value={report.info.reportDateKhmerLunar || ''}
              onChange={e => {
                onChange({
                  ...report,
                  info: {
                    ...report.info,
                    reportDateKhmerLunar: e.target.value,
                  },
                });
              }}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-slate-700 mb-1">
              កាលបរិច្ឆេទសុរិយគតិខ្មែរ (Solar Date String)៖
            </label>
            <input
              type="text"
              value={report.info.reportDateKhmerSolar || ''}
              onChange={e => {
                onChange({
                  ...report,
                  info: {
                    ...report.info,
                    reportDateKhmerSolar: e.target.value,
                  },
                });
              }}
              className="w-full p-2 text-xs border border-slate-300 rounded-lg bg-white focus:ring-1 focus:ring-amber-500 focus:outline-none"
            />
          </div>
        </div>
      )}
    </div>
  );
};
