import React from 'react';
import { SchoolMeta } from '../types';
import { DEFAULT_OFFICIAL_LUNAR_DATE, formatKhmerSolarDate } from '../utils/khmerDate';

interface Props {
  meta: SchoolMeta;
}

export const ReportSignatures: React.FC<Props> = ({ meta }) => {
  return (
    <div className="mt-8 pt-4 border-t border-slate-200 page-break-inside-avoid">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-8 text-center text-sm">
        {/* Left: Director approval */}
        <div className="flex flex-col items-center">
          <p className="font-semibold text-slate-800">បានឃើញ និងឯកភាព</p>
          <p className="text-xs text-slate-600 mt-1">{DEFAULT_OFFICIAL_LUNAR_DATE}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatKhmerSolarDate(meta.reportDate, meta.clusterOrDistrict || 'ភ្នំស្រុក')}
          </p>
          <p className="font-bold text-slate-900 mt-1.5">នាយកសាលា</p>
          <div className="h-20 flex items-end justify-center">
            <span className="text-xs text-slate-400 italic no-print">
              [ហត្ថលេខា និងត្រា]
            </span>
          </div>
        </div>

        {/* Right: Reporter */}
        <div className="flex flex-col items-center">
          <p className="text-xs text-slate-600">{DEFAULT_OFFICIAL_LUNAR_DATE}</p>
          <p className="text-xs text-slate-500 mt-0.5">
            {formatKhmerSolarDate(meta.reportDate, 'រោគ')}
          </p>
          <p className="font-bold text-slate-900 mt-1.5">អ្នកធ្វើតារាង / របាយការណ៍</p>
          <div className="h-20 flex items-end">
            <span className="text-xs text-slate-400 italic">
              [ហត្ថលេខា]
            </span>
          </div>
          <p className="font-medium text-slate-900 mt-2">{meta.preparedByName || 'អ្នករៀបចំ'}</p>
        </div>
      </div>
    </div>
  );
};

