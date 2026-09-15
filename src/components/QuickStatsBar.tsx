import React from 'react';
import { Table1SchoolRooms, Table1Staff, Table2RowInput } from '../types';
import { Building, Users, GraduationCap, CheckCircle2 } from 'lucide-react';
import { formatPct } from '../data/initialData';

interface Props {
  t1Rooms: Table1SchoolRooms;
  t1Staff: Table1Staff;
  t2Rows: Table2RowInput[];
}

export const QuickStatsBar: React.FC<Props> = ({ t1Rooms, t1Staff, t2Rows }) => {
  const totalRooms = (Number(t1Rooms.teachingRooms) || 0) + (Number(t1Rooms.otherRooms) || 0);
  
  const gradesList: Array<keyof Pick<Table1SchoolRooms, 'g1' | 'g2' | 'g3' | 'g4' | 'g5' | 'g6'>> = [
    'g1', 'g2', 'g3', 'g4', 'g5', 'g6'
  ];
  const totalStudents = gradesList.reduce((acc, k) => acc + (Number(t1Rooms[k].total) || 0), 0);
  const totalFemale = gradesList.reduce((acc, k) => acc + (Number(t1Rooms[k].female) || 0), 0);
  const totalClasses = gradesList.reduce((acc, k) => acc + (Number(t1Rooms[k].classes) || 0), 0);

  const nonTeachingTotal = (Number(t1Staff.directorDeputy.total) || 0) + (Number(t1Staff.officeAdmin.total) || 0);
  const teachingTotal =
    (Number(t1Staff.pureTeaching.total) || 0) +
    (Number(t1Staff.multiGrade.total) || 0) +
    (Number(t1Staff.deputyTeaching.total) || 0) +
    (Number(t1Staff.contractTeaching.total) || 0);
  const totalStaff = nonTeachingTotal + teachingTotal + (Number(t1Staff.assistTeaching.total) || 0);

  const totalPassed = t2Rows.reduce((a, b) => a + (Number(b.passedAvgTotal) || 0), 0);
  const totalSem1 = t2Rows.reduce(
    (a, b) => a + (Number(b.passedAvgTotal) || 0) + (Number(b.failedAvgTotal) || 0) + (Number(b.dropoutTotal) || 0),
    0
  );
  const passRate = formatPct(totalPassed, totalSem1 || totalStudents);

  return (
    <div className="no-print grid grid-cols-2 sm:grid-cols-4 gap-3 my-4">
      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center shrink-0">
          <Building className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">អគារ & បន្ទប់</p>
          <p className="text-base font-bold text-slate-900">
            {t1Rooms.buildings} <span className="text-xs font-normal text-slate-500">អគារ</span> / {totalRooms} <span className="text-xs font-normal text-slate-500">បន្ទប់</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-indigo-50 text-indigo-600 flex items-center justify-center shrink-0">
          <GraduationCap className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">សិស្សសរុប ({totalClasses} ថ្នាក់)</p>
          <p className="text-base font-bold text-slate-900">
            {totalStudents} <span className="text-xs font-normal text-slate-500">នាក់</span> <span className="text-xs text-pink-600 font-medium">(ស្រី {totalFemale})</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
          <Users className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">បុគ្គលិកអប់រំសរុប</p>
          <p className="text-base font-bold text-slate-900">
            {totalStaff} <span className="text-xs font-normal text-slate-500">នាក់</span> <span className="text-xs text-slate-500 font-normal">(បង្រៀន {teachingTotal})</span>
          </p>
        </div>
      </div>

      <div className="bg-white border border-slate-200 rounded-xl p-3 shadow-2xs flex items-center gap-3">
        <div className="w-10 h-10 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0">
          <CheckCircle2 className="w-5 h-5" />
        </div>
        <div>
          <p className="text-xs text-slate-500 font-medium">អត្រាជាប់មធ្យមភាគ</p>
          <p className="text-base font-bold text-emerald-700">
            {passRate} <span className="text-xs font-normal text-slate-500">({totalPassed}/{totalSem1 || totalStudents})</span>
          </p>
        </div>
      </div>
    </div>
  );
};
