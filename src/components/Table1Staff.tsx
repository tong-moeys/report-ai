import React from 'react';
import { Table1Staff, GenderCount } from '../types';
import { Users, Calculator } from 'lucide-react';

interface Props {
  data: Table1Staff;
  onChange: (data: Table1Staff) => void;
  showFormulas: boolean;
}

export const Table1StaffView: React.FC<Props> = ({ data, onChange, showFormulas }) => {
  // Calculations
  const teachingTotal =
    (Number(data.pureTeaching.total) || 0) +
    (Number(data.multiGrade.total) || 0) +
    (Number(data.deputyTeaching.total) || 0) +
    (Number(data.contractTeaching.total) || 0);

  const teachingFemale =
    (Number(data.pureTeaching.female) || 0) +
    (Number(data.multiGrade.female) || 0) +
    (Number(data.deputyTeaching.female) || 0) +
    (Number(data.contractTeaching.female) || 0);

  // Non-teaching total
  const nonTeachingTotal =
    (Number(data.directorDeputy.total) || 0) + (Number(data.officeAdmin.total) || 0);
  const nonTeachingFemale =
    (Number(data.directorDeputy.female) || 0) + (Number(data.officeAdmin.female) || 0);

  // Overall Cadre Total = Non-Teaching + Teaching Total + Assist Teaching
  const totalCadre =
    nonTeachingTotal + teachingTotal + (Number(data.assistTeaching.total) || 0);
  const totalCadreFemale =
    nonTeachingFemale + teachingFemale + (Number(data.assistTeaching.female) || 0);

  const updateCategory = (
    category: keyof Omit<Table1Staff, 'schoolName'>,
    field: keyof GenderCount,
    val: number
  ) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    onChange({
      ...data,
      [category]: {
        ...data[category],
        [field]: num,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">១(ត)</span>
            <span>តារាងស្ថិតិសាលា អគារ បន្ទប់ សិស្ស (ត) - បុគ្គលិកអប់រំ</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            ស្ថិតិគណៈគ្រប់គ្រង បុគ្គលិកទីចាត់ការ គ្រូបង្រៀន និងក្របខ័ណ្ឌសរុប (គណនាស្វ័យប្រវត្ត)
          </p>
        </div>

        {showFormulas && (
          <div className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>រូបមន្ត: សរុបបង្រៀន = បរ.សុទ្ធ + គូប + នាយករង + កិ.ស | ក្របខ័ណ្ឌសរុប = មិនបង្រៀន + បង្រៀន + ជួយប.រ</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto table-scrollbar p-3">
        <table className="w-full border-collapse border border-slate-400 text-center text-xs sm:text-sm">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-slate-100 text-slate-800 font-semibold">
              <th rowSpan={3} className="border border-slate-400 p-2 min-w-[110px]">
                ឈ្មោះសាលា
              </th>
              <th colSpan={4} className="border border-slate-400 p-2 bg-amber-50/60">
                មិនបង្រៀន
              </th>
              <th colSpan={10} className="border border-slate-400 p-2 bg-blue-50/60">
                បុគ្គលិកបង្រៀន
              </th>
              <th colSpan={2} rowSpan={2} className="border border-slate-400 p-1.5 bg-slate-50">
                <div>ក្នុងនោះ</div>
                <div className="text-xs text-slate-500">២ពេល</div>
              </th>
              <th colSpan={2} rowSpan={2} className="border border-slate-400 p-1.5 bg-slate-50">
                ជួយប.រ
              </th>
              <th colSpan={2} rowSpan={2} className="border border-slate-400 p-1.5 bg-emerald-100 text-emerald-900 font-bold">
                ក្របខ័ណ្ឌសរុប
              </th>
            </tr>

            {/* Header Row 2 */}
            <tr className="bg-slate-100 text-slate-700 font-medium text-xs">
              {/* Non-Teaching Subgroups */}
              <th colSpan={2} className="border border-slate-400 px-1 py-1">
                នាយក+រង
              </th>
              <th colSpan={2} className="border border-slate-400 px-1 py-1">
                ទីចាត់ការ
              </th>

              {/* Teaching Subgroups */}
              <th colSpan={2} className="border border-slate-400 px-1 py-1">
                បរ.សុទ្ធ
              </th>
              <th colSpan={2} className="border border-slate-400 px-1 py-1">
                គូប
              </th>
              <th colSpan={2} className="border border-slate-400 px-1 py-1">
                នាយករង
              </th>
              <th colSpan={2} className="border border-slate-400 px-1 py-1">
                កិ .ស
              </th>
              <th colSpan={2} className="border border-slate-400 px-1 py-1 bg-blue-100/70 text-blue-900 font-bold">
                សរុប
              </th>
            </tr>

            {/* Header Row 3: Gender headers */}
            <tr className="bg-slate-100 text-slate-700 font-medium text-xs">
              {/* Director/Deputy */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Office/Admin */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>

              {/* Teaching: Pure */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Multi-Grade */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Deputy Teaching */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Contract */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Teaching Total */}
              <th className="border border-slate-400 px-1 py-1 min-w-[45px] bg-blue-100/70 text-blue-900 font-bold">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[42px] bg-pink-100/70 text-pink-900 font-bold">ស្រី</th>

              {/* 2 Shifts */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Assist teaching */}
              <th className="border border-slate-400 px-1 py-1 min-w-[42px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[40px] text-pink-700">ស្រី</th>
              {/* Overall Cadre */}
              <th className="border border-slate-400 px-1 py-1 min-w-[48px] bg-emerald-100 text-emerald-900 font-bold">សរុប</th>
              <th className="border border-slate-400 px-1 py-1 min-w-[45px] bg-pink-100 text-pink-900 font-bold">ស្រី</th>
            </tr>
          </thead>

          <tbody>
            <tr className="hover:bg-blue-50/30 transition-colors">
              {/* School Name */}
              <td className="border border-slate-400 p-1 font-semibold text-slate-800">
                <input
                  id="t1-staff-school-name"
                  type="text"
                  value={data.schoolName}
                  onChange={(e) => onChange({ ...data, schoolName: e.target.value })}
                  className="w-full text-center py-1 px-1 bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>

              {/* Non-Teaching: Director + Deputy */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-director-total"
                  type="number"
                  min="0"
                  value={data.directorDeputy.total || ''}
                  onChange={(e) => updateCategory('directorDeputy', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-director-female"
                  type="number"
                  min="0"
                  value={data.directorDeputy.female || ''}
                  onChange={(e) => updateCategory('directorDeputy', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Non-Teaching: Office */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-office-total"
                  type="number"
                  min="0"
                  value={data.officeAdmin.total || ''}
                  onChange={(e) => updateCategory('officeAdmin', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-office-female"
                  type="number"
                  min="0"
                  value={data.officeAdmin.female || ''}
                  onChange={(e) => updateCategory('officeAdmin', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Teaching: Pure */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-pure-total"
                  type="number"
                  min="0"
                  value={data.pureTeaching.total || ''}
                  onChange={(e) => updateCategory('pureTeaching', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-pure-female"
                  type="number"
                  min="0"
                  value={data.pureTeaching.female || ''}
                  onChange={(e) => updateCategory('pureTeaching', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Teaching: Multi-Grade */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-multi-total"
                  type="number"
                  min="0"
                  value={data.multiGrade.total || ''}
                  onChange={(e) => updateCategory('multiGrade', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-multi-female"
                  type="number"
                  min="0"
                  value={data.multiGrade.female || ''}
                  onChange={(e) => updateCategory('multiGrade', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Teaching: Deputy */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-deputy-total"
                  type="number"
                  min="0"
                  value={data.deputyTeaching.total || ''}
                  onChange={(e) => updateCategory('deputyTeaching', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-deputy-female"
                  type="number"
                  min="0"
                  value={data.deputyTeaching.female || ''}
                  onChange={(e) => updateCategory('deputyTeaching', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Teaching: Contract */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-contract-total"
                  type="number"
                  min="0"
                  value={data.contractTeaching.total || ''}
                  onChange={(e) => updateCategory('contractTeaching', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-contract-female"
                  type="number"
                  min="0"
                  value={data.contractTeaching.female || ''}
                  onChange={(e) => updateCategory('contractTeaching', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Teaching Total [AUTO] */}
              <td className="border border-slate-400 p-1 bg-blue-50 font-bold text-blue-800">
                <span id="t1-staff-teaching-total">{teachingTotal}</span>
              </td>
              <td className="border border-slate-400 p-1 bg-pink-50 font-bold text-pink-800">
                <span id="t1-staff-teaching-female">{teachingFemale}</span>
              </td>

              {/* 2 Shifts */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-twoshifts-total"
                  type="number"
                  min="0"
                  value={data.twoShifts.total || ''}
                  onChange={(e) => updateCategory('twoShifts', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-twoshifts-female"
                  type="number"
                  min="0"
                  value={data.twoShifts.female || ''}
                  onChange={(e) => updateCategory('twoShifts', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Assist teaching */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-assist-total"
                  type="number"
                  min="0"
                  value={data.assistTeaching.total || ''}
                  onChange={(e) => updateCategory('assistTeaching', 'total', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-staff-assist-female"
                  type="number"
                  min="0"
                  value={data.assistTeaching.female || ''}
                  onChange={(e) => updateCategory('assistTeaching', 'female', parseInt(e.target.value) || 0)}
                  className="w-full text-center py-1 px-0.5 bg-white text-pink-700 border border-slate-200 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                />
              </td>

              {/* Overall Cadre [AUTO] */}
              <td className="border border-slate-400 p-1 bg-emerald-50 font-bold text-emerald-800 text-sm">
                <span id="t1-staff-cadre-total">{totalCadre}</span>
              </td>
              <td className="border border-slate-400 p-1 bg-pink-50 font-bold text-pink-800 text-sm">
                <span id="t1-staff-cadre-female">{totalCadreFemale}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-2">
          <Users className="w-3.5 h-3.5 text-slate-500" />
          <span>បុគ្គលិកបង្រៀនសរុប: <strong className="text-slate-800 font-bold">{teachingTotal}</strong> នាក់ (ស្រី <strong className="text-pink-700 font-bold">{teachingFemale}</strong> នាក់)</span>
        </div>
        <div>
          <span>ក្របខ័ណ្ឌសរុបទាំងអស់: <strong className="text-emerald-800 font-bold">{totalCadre}</strong> នាក់ (ស្រី <strong className="text-pink-700 font-bold">{totalCadreFemale}</strong> នាក់)</span>
        </div>
      </div>
    </div>
  );
};
