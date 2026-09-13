import React from 'react';
import { SchoolInfo } from '../types';

interface OfficialReportHeaderProps {
  info: SchoolInfo;
  reportTypeTitle: string;
  subTitle?: string;
  solarDate?: string;
  lunarDate?: string;
  badgeText?: string;
}

export const OfficialReportHeader: React.FC<OfficialReportHeaderProps> = ({
  info,
  reportTypeTitle,
  subTitle,
  solarDate,
  lunarDate,
  badgeText,
}) => {
  return (
    <div className="official-report-header mb-6 select-none">
      {/* National Emblem & Motto */}
      <div className="text-center mb-4">
        <p className="font-moul text-sm text-slate-900 tracking-wider">
          {info.kingdomHeader || 'ព្រះរាជាណាចក្រកម្ពុជា'}
        </p>
        <p className="font-moul text-sm text-slate-900 mt-1 tracking-wider">
          {info.motto || 'ជាតិ សាសនា ព្រះមហាក្សត្រ'}
        </p>
        <div className="w-24 h-0.5 bg-slate-400 mx-auto mt-2 mb-2"></div>
      </div>

      {/* Administrative Hierarchy & Jurisdiction */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 mb-4 border-b border-slate-200 pb-3">
        <div className="space-y-0.5 text-xs text-slate-900">
          <p className="font-semibold">{info.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា'}</p>
          <p className="font-medium text-slate-700">{info.cluster || 'កម្រងសាលា'}</p>
          <p className="font-bold text-slate-900 text-sm">{info.schoolName || 'សាលាបឋមសិក្សា'}</p>
        </div>

        <div className="text-right text-[11px] text-slate-600 space-y-0.5">
          {lunarDate && <p className="font-medium text-slate-700">{lunarDate}</p>}
          <p className="font-medium text-slate-800">{solarDate || info.reportDateKhmerSolar || 'ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦'}</p>
          {badgeText && (
            <span className="inline-block mt-1 px-2 py-0.5 bg-slate-100 text-slate-700 rounded text-[10px] font-semibold border border-slate-300">
              {badgeText}
            </span>
          )}
        </div>
      </div>

      {/* Document Main Title */}
      <div className="text-center my-4">
        <h1 className="font-moul text-base text-slate-900 leading-normal tracking-wide">
          {reportTypeTitle}
        </h1>
        {subTitle && (
          <p className="font-bold text-xs text-slate-800 mt-1 tracking-wide">
            {subTitle}
          </p>
        )}
        <p className="text-xs text-slate-600 mt-0.5">
          ឆ្នាំសិក្សា {info.academicYear || '២០២៥-២០២៦'}
        </p>
      </div>
    </div>
  );
};
