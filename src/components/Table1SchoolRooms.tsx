import React from 'react';
import { Table1SchoolRooms, GradeClassData } from '../types';
import { Calculator } from 'lucide-react';

interface Props {
  data: Table1SchoolRooms;
  onChange: (data: Table1SchoolRooms) => void;
  showFormulas: boolean;
}

export const Table1SchoolRoomsView: React.FC<Props> = ({ data, onChange, showFormulas }) => {
  // Calculations
  const totalRooms = (Number(data.teachingRooms) || 0) + (Number(data.otherRooms) || 0);

  const gradesList: Array<keyof Pick<Table1SchoolRooms, 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'>> = [
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6'
  ];

  const totalClasses = gradesList.reduce((acc, k) => acc + (Number(data[k].classes) || 0), 0);
  const totalStudents = gradesList.reduce((acc, k) => acc + (Number(data[k].total) || 0), 0);
  const totalFemale = gradesList.reduce((acc, k) => acc + (Number(data[k].female) || 0), 0);

  const updateGrade = (
    gradeKey: 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6',
    field: keyof GradeClassData,
    val: number
  ) => {
    const num = isNaN(val) ? 0 : Math.max(0, val);
    onChange({
      ...data,
      [gradeKey]: {
        ...data[gradeKey],
        [field]: num,
      },
    });
  };

  return (
    <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
      <div className="px-5 py-3.5 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-bold text-slate-800 flex items-center gap-2">
            <span className="w-6 h-6 rounded-md bg-blue-100 text-blue-800 text-xs font-bold flex items-center justify-center">១</span>
            <span>តារាងស្ថិតិសាលា អគារ បន្ទប់ សិស្ស</span>
          </h2>
          <p className="text-xs text-slate-500 mt-0.5">
            បញ្ចូលចំនួនអគារ បន្ទប់បង្រៀន និងចំនួនថ្នាក់ សិស្សសរុប និងសិស្សស្រីតាមកម្រិតថ្នាក់ (គណនាស្វ័យប្រវត្ត)
          </p>
        </div>

        {showFormulas && (
          <div className="text-xs bg-purple-50 text-purple-700 border border-purple-200 px-2.5 py-1 rounded-md flex items-center gap-1.5">
            <Calculator className="w-3.5 h-3.5" />
            <span>រូបមន្ត: បន្ទប់សរុប = ប.បរ + ផ្សេងៗ | សរុបរួម = ថ្នាក់ទី១ + ... + ថ្នាក់ទី៦</span>
          </div>
        )}
      </div>

      <div className="overflow-x-auto table-scrollbar p-3">
        <table className="w-full border-collapse border border-slate-400 text-center text-xs sm:text-sm">
          <thead>
            <tr className="bg-slate-100 text-slate-800 font-semibold">
              <th rowSpan={2} className="border border-slate-400 p-2 min-w-[110px]">
                ឈ្មោះសាលា
              </th>
              <th rowSpan={2} className="border border-slate-400 p-2 min-w-[65px]">
                អគារ
              </th>
              <th colSpan={3} className="border border-slate-400 p-2 bg-blue-50/60">
                ចំនួនបន្ទប់
              </th>
              <th colSpan={3} className="border border-slate-400 p-2">
                ថ្នាក់ទី១
              </th>
              <th colSpan={3} className="border border-slate-400 p-2">
                ថ្នាក់ទី២
              </th>
              <th colSpan={3} className="border border-slate-400 p-2">
                ថ្នាក់ទី៣
              </th>
              <th colSpan={3} className="border border-slate-400 p-2">
                ថ្នាក់ទី៤
              </th>
              <th colSpan={3} className="border border-slate-400 p-2">
                ថ្នាក់ទី៥
              </th>
              <th colSpan={3} className="border border-slate-400 p-2">
                ថ្នាក់ទី៦
              </th>
              <th colSpan={3} className="border border-slate-400 p-2 bg-emerald-50 text-emerald-900 font-bold">
                សរុបរួម (ស្វ័យប្រវត្ត)
              </th>
            </tr>
            <tr className="bg-slate-100 text-slate-700 font-medium text-xs">
              {/* Rooms */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[55px]">ប.បរ</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[55px]">ផ្សេងៗ</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[55px] bg-blue-100/70 text-blue-900 font-bold">សរុប</th>
              {/* Grade 1 */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px]">ថ្នាក់</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px] text-pink-700">ស្រី</th>
              {/* Grade 2 */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px]">ថ្នាក់</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px] text-pink-700">ស្រី</th>
              {/* Grade 3 */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px]">ថ្នាក់</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px] text-pink-700">ស្រី</th>
              {/* Grade 4 */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px]">ថ្នាក់</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px] text-pink-700">ស្រី</th>
              {/* Grade 5 */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px]">ថ្នាក់</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px] text-pink-700">ស្រី</th>
              {/* Grade 6 */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px]">ថ្នាក់</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px]">សរុប</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[48px] text-pink-700">ស្រី</th>
              {/* Overall Total */}
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px] bg-emerald-100/70 text-emerald-900 font-bold">ថ្នាក់</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[56px] bg-emerald-100/70 text-emerald-900 font-bold">សរុប</th>
              <th className="border border-slate-400 px-1 py-1.5 min-w-[52px] bg-pink-100/70 text-pink-900 font-bold">ស្រី</th>
            </tr>
          </thead>
          <tbody>
            <tr className="hover:bg-blue-50/30 transition-colors">
              {/* School Name */}
              <td className="border border-slate-400 p-1 font-semibold text-slate-800">
                <input
                  id="t1-school-name"
                  type="text"
                  value={data.schoolName}
                  onChange={(e) => onChange({ ...data, schoolName: e.target.value })}
                  className="w-full text-center py-1 px-1 bg-transparent hover:bg-slate-100 focus:bg-white focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>

              {/* Buildings */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-buildings"
                  type="number"
                  min="0"
                  value={data.buildings || ''}
                  onChange={(e) => onChange({ ...data, buildings: parseInt(e.target.value) || 0 })}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>

              {/* Rooms: teaching */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-teaching-rooms"
                  type="number"
                  min="0"
                  value={data.teachingRooms || ''}
                  onChange={(e) => onChange({ ...data, teachingRooms: parseInt(e.target.value) || 0 })}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>

              {/* Rooms: other */}
              <td className="border border-slate-400 p-1">
                <input
                  id="t1-other-rooms"
                  type="number"
                  min="0"
                  value={data.otherRooms || ''}
                  onChange={(e) => onChange({ ...data, otherRooms: parseInt(e.target.value) || 0 })}
                  className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                />
              </td>

              {/* Rooms: Total [AUTO] */}
              <td className="border border-slate-400 p-1 bg-blue-50 font-bold text-blue-800">
                <span id="t1-total-rooms" title="ប.បរ + ផ្សេងៗ">
                  {totalRooms}
                </span>
              </td>

              {/* Grades G1 - G6 */}
              {gradesList.map((gKey, idx) => (
                <React.Fragment key={gKey}>
                  {/* Classes */}
                  <td className="border border-slate-400 p-1">
                    <input
                      id={`t1-${gKey}-classes`}
                      type="number"
                      min="0"
                      value={data[gKey].classes || ''}
                      onChange={(e) => updateGrade(gKey, 'classes', parseInt(e.target.value) || 0)}
                      className="w-full text-center py-1 px-0.5 bg-white border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                      title={`ថ្នាក់ទី ${idx + 1} ចំនួនថ្នាក់`}
                    />
                  </td>
                  {/* Total Students */}
                  <td className="border border-slate-400 p-1">
                    <input
                      id={`t1-${gKey}-total`}
                      type="number"
                      min="0"
                      value={data[gKey].total || ''}
                      onChange={(e) => updateGrade(gKey, 'total', parseInt(e.target.value) || 0)}
                      className="w-full text-center py-1 px-0.5 bg-white font-medium text-slate-900 border border-slate-200 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 rounded outline-hidden"
                      title={`ថ្នាក់ទី ${idx + 1} សិស្សសរុប`}
                    />
                  </td>
                  {/* Female Students */}
                  <td className="border border-slate-400 p-1">
                    <input
                      id={`t1-${gKey}-female`}
                      type="number"
                      min="0"
                      value={data[gKey].female || ''}
                      onChange={(e) => updateGrade(gKey, 'female', parseInt(e.target.value) || 0)}
                      className="w-full text-center py-1 px-0.5 bg-white font-medium text-pink-700 border border-slate-200 focus:border-pink-500 focus:ring-1 focus:ring-pink-500 rounded outline-hidden"
                      title={`ថ្នាក់ទី ${idx + 1} សិស្សស្រី`}
                    />
                  </td>
                </React.Fragment>
              ))}

              {/* Overall Total [AUTO-CALCULATED] */}
              <td className="border border-slate-400 p-1 bg-emerald-50 font-bold text-emerald-800">
                <span id="t1-overall-classes">{totalClasses}</span>
              </td>
              <td className="border border-slate-400 p-1 bg-emerald-50 font-bold text-emerald-800 text-sm">
                <span id="t1-overall-total">{totalStudents}</span>
              </td>
              <td className="border border-slate-400 p-1 bg-pink-50 font-bold text-pink-800 text-sm">
                <span id="t1-overall-female">{totalFemale}</span>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <div className="px-5 py-2.5 bg-slate-50 border-t border-slate-200 flex items-center justify-between text-xs text-slate-500">
        <div className="flex items-center gap-4">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-white border border-slate-300"></span>
            ប្រអប់បញ្ចូលទិន្នន័យ (កែបាន)
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-sm bg-emerald-100 border border-emerald-300"></span>
            ប្រអប់គណនាស្វ័យប្រវត្ត (Auto-sum)
          </span>
        </div>
        <div>
          <span>សរុបសិស្សទាំងអស់: <strong className="text-slate-800 font-bold">{totalStudents}</strong> នាក់ (ស្រី <strong className="text-pink-700 font-bold">{totalFemale}</strong> នាក់)</span>
        </div>
      </div>
    </div>
  );
};
