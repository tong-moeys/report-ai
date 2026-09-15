import React, { useState } from 'react';
import { ClassGradebook, StudentScoreRow, SchoolMeta } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import { Award, Printer, UserPlus, Trash2, Edit2, CheckCircle2, ChevronRight } from 'lucide-react';

interface ClassGradebooksViewProps {
  meta: SchoolMeta;
  gradebooks: ClassGradebook[];
  onUpdateGradebooks: (gradebooks: ClassGradebook[]) => void;
}

export const ClassGradebooksView: React.FC<ClassGradebooksViewProps> = ({
  meta,
  gradebooks,
  onUpdateGradebooks,
}) => {
  const [activeGradeId, setActiveGradeId] = useState<string>(gradebooks[0]?.gradeId || '3B');
  const [isEditing, setIsEditing] = useState(false);

  const currentBook = gradebooks.find((g) => g.gradeId === activeGradeId) || gradebooks[0];

  // Helper for computing letter grade from yearly average
  const computeGradeLetter = (avg: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
    if (avg >= 8.5) return 'A';
    if (avg >= 8.0) return 'B';
    if (avg >= 6.5) return 'C';
    if (avg >= 5.0) return 'D';
    if (avg >= 4.0) return 'E';
    return 'F';
  };

  // Re-rank students automatically
  const reRankStudents = (students: StudentScoreRow[]): StudentScoreRow[] => {
    // Sort descending by yearAvg
    const sorted = [...students].sort((a, b) => b.yearAvg - a.yearAvg);
    return sorted.map((st, idx) => ({
      ...st,
      no: idx + 1,
      yearRank: idx + 1,
      gradeLetter: computeGradeLetter(st.yearAvg),
    }));
  };

  const handleUpdateStudent = (updated: StudentScoreRow) => {
    const updatedStudents = currentBook.students.map((s) => (s.id === updated.id ? updated : s));
    const ranked = reRankStudents(updatedStudents);
    onUpdateGradebooks(
      gradebooks.map((g) => (g.gradeId === currentBook.gradeId ? { ...g, students: ranked } : g))
    );
  };

  const handleAddStudent = () => {
    const newStudent: StudentScoreRow = {
      id: `st-${Date.now()}`,
      no: currentBook.students.length + 1,
      name: 'សិស្សថ្មី',
      gender: 'ស្រី',
      dob: '01-Jan-2018',
      pob: 'ភូមិរោត ឃុំស្ពានស្រែង',
      sem1Avg: 7.0,
      sem1Rank: currentBook.students.length + 1,
      sem2Avg: 7.0,
      sem2Rank: currentBook.students.length + 1,
      yearAvg: 7.0,
      yearRank: currentBook.students.length + 1,
      gradeLetter: 'C',
      absentPermission: 0,
      absentNoPermission: 0,
      absentTotal: 0,
    };
    const ranked = reRankStudents([...currentBook.students, newStudent]);
    onUpdateGradebooks(
      gradebooks.map((g) => (g.gradeId === currentBook.gradeId ? { ...g, students: ranked } : g))
    );
  };

  const handleDeleteStudent = (id: string) => {
    if (confirm('តើអ្នកពិតជាចង់លុបឈ្មោះសិស្សនេះមែនទេ?')) {
      const remaining = currentBook.students.filter((s) => s.id !== id);
      const ranked = reRankStudents(remaining);
      onUpdateGradebooks(
        gradebooks.map((g) => (g.gradeId === currentBook.gradeId ? { ...g, students: ranked } : g))
      );
    }
  };

  // Compute statistics for the current class
  const students = currentBook.students;
  const totalStudents = students.length;
  const femaleStudents = students.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length;
  const maleStudents = totalStudents - femaleStudents;

  const femalePct = totalStudents > 0 ? Math.round((femaleStudents * 100) / totalStudents) : 0;
  const malePct = totalStudents > 0 ? 100 - femalePct : 0;

  // Grade distributions
  const gradeCounts = {
    A: students.filter((s) => s.gradeLetter === 'A'),
    B: students.filter((s) => s.gradeLetter === 'B'),
    C: students.filter((s) => s.gradeLetter === 'C'),
    D: students.filter((s) => s.gradeLetter === 'D'),
    E: students.filter((s) => s.gradeLetter === 'E'),
    F: students.filter((s) => s.gradeLetter === 'F'),
  };

  // Passed / Failed / Dropped
  const passedStudents = students.filter((s) => s.yearAvg >= 5.0 && !s.isDropped);
  const failedStudents = students.filter((s) => s.yearAvg < 5.0 && !s.isDropped);
  const droppedStudents = students.filter((s) => s.isDropped);

  const passedPct = totalStudents > 0 ? Math.round((passedStudents.length * 100) / totalStudents) : 0;
  const failedPct = totalStudents > 0 ? Math.round((failedStudents.length * 100) / totalStudents) : 0;
  const droppedPct = totalStudents > 0 ? Math.round((droppedStudents.length * 100) / totalStudents) : 0;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
      {/* Header & Grade Tabs */}
      <div className="no-print p-4 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-emerald-600 text-white flex items-center justify-center">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-sm">
                សៀវភៅចំណាត់ថ្នាក់ដំណាច់ឆ្នាំតាមថ្នាក់ (ទំព័រទី ១២ ដល់ ២១)
              </h3>
              <p className="text-xs text-slate-500">
                ជ្រើសរើសថ្នាក់ដើម្បីមើល និងបោះពុម្ពតារាងចំណាត់ថ្នាក់លម្អិត
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <Edit2 className="w-3.5 h-3.5" />
              <span>{isEditing ? 'បញ្ចប់ការកែប្រែ' : 'កែសម្រួលពិន្ទុ'}</span>
            </button>
            <button
              onClick={handleAddStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" />
              <span>បន្ថែមសិស្ស</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white cursor-pointer"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>បោះពុម្ពថ្នាក់នេះ</span>
            </button>
          </div>
        </div>

        {/* 10 Class Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {gradebooks.map((gb) => (
            <button
              key={gb.gradeId}
              onClick={() => setActiveGradeId(gb.gradeId)}
              className={`px-3 py-1.5 text-xs font-bold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
                activeGradeId === gb.gradeId
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-200'
              }`}
            >
              {gb.gradeName} ({toKhmerNum(gb.students.length)})
            </button>
          ))}
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="p-6 sm:p-10 max-w-5xl mx-auto font-sans leading-normal">
        {/* Kingdom Header */}
        <div className="text-center mb-5">
          <h2 className="font-bold text-base sm:text-lg text-slate-900 tracking-wider">ព្រះរាជាណាចក្រកម្ពុជា</h2>
          <h3 className="font-semibold text-sm sm:text-base text-slate-800 tracking-widest mt-0.5">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
          <div className="text-xs text-slate-400 mt-1">🙡 🙠 🙡 🙠</div>
        </div>

        {/* School Header Left */}
        <div className="mb-5 text-xs sm:text-sm text-slate-800 space-y-0.5">
          <p className="font-bold">រដ្ឋបាលស្រុកភ្នំស្រុក</p>
          <p className="font-medium">ការិយាល័យអប់រំ យុវជន និងកីឡាស្រុក</p>
          <p className="font-medium">កម្រងស្ពានស្រែង</p>
          <p className="font-medium">សាលាបឋមសិក្សា <span className="font-bold">{meta.schoolName}</span></p>
        </div>

        {/* Document Title */}
        <div className="text-center mb-5">
          <h1 className="font-bold text-base sm:text-lg text-slate-950">
            ចំណាត់ថ្នាក់ដំណាច់ឆ្នាំ (តម្រៀបតាមចំណាត់ថ្នាក់)
          </h1>
          <p className="font-bold text-sm text-slate-800 mt-1">
            {currentBook.gradeName} • ឆ្នាំសិក្សា {meta.academicYear}
          </p>
        </div>

        {/* Student Ranking Table */}
        <div className="overflow-x-auto border border-slate-400 rounded-xs mb-6">
          <table className="w-full text-xs text-center border-collapse">
            <thead>
              <tr className="bg-slate-100 border-b border-slate-400 font-bold text-slate-800">
                <th rowSpan={2} className="py-2 px-1 border-r border-slate-400 w-8">ល.រ</th>
                <th rowSpan={2} className="py-2 px-3 border-r border-slate-400 text-left min-w-[130px]">គោត្តនាម-នាម</th>
                <th rowSpan={2} className="py-2 px-1 border-r border-slate-400 w-10">ភេទ</th>
                <th rowSpan={2} className="py-2 px-2 border-r border-slate-400 min-w-[80px]">ថ្ងៃខែឆ្នាំកំណើត</th>
                <th rowSpan={2} className="py-2 px-2 border-r border-slate-400 text-left min-w-[130px]">ទីលំនៅបច្ចុប្បន្ន</th>
                <th colSpan={2} className="py-1 px-1 border-r border-slate-400 bg-blue-50/70">មធ្យមភាគប្រចាំឆម១</th>
                <th colSpan={2} className="py-1 px-1 border-r border-slate-400 bg-teal-50/70">មធ្យមភាគប្រចាំឆម២</th>
                <th colSpan={2} className="py-1 px-1 border-r border-slate-400 bg-amber-50/70 font-bold text-slate-900">មធ្យមភាគប្រចាំឆ្នាំ</th>
                <th rowSpan={2} className="py-2 px-1 border-r border-slate-400 font-bold w-12">និទ្ទេស</th>
                <th colSpan={3} className="py-1 px-1 border-r border-slate-400 bg-slate-200/60">អវត្តមាន</th>
                {isEditing && <th rowSpan={2} className="no-print py-2 px-1 w-14">សកម្មភាព</th>}
              </tr>
              <tr className="bg-slate-100 border-b border-slate-400 font-semibold text-slate-700 text-[11px]">
                <th className="py-1 px-1 border-r border-slate-400 w-12">មធ្យមភាគ</th>
                <th className="py-1 px-1 border-r border-slate-400 w-10">ចំណាត់ថ្នាក់</th>
                <th className="py-1 px-1 border-r border-slate-400 w-12">មធ្យមភាគ</th>
                <th className="py-1 px-1 border-r border-slate-400 w-10">ចំណាត់ថ្នាក់</th>
                <th className="py-1 px-1 border-r border-slate-400 w-12 font-bold">មធ្យមភាគ</th>
                <th className="py-1 px-1 border-r border-slate-400 w-10 font-bold">ចំណាត់ថ្នាក់</th>
                <th className="py-1 px-1 border-r border-slate-400 w-6">ច្ប</th>
                <th className="py-1 px-1 border-r border-slate-400 w-6">ឥត</th>
                <th className="py-1 px-1 border-r border-slate-400 w-8">សរុប</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st) => (
                <tr key={st.id} className="border-b border-slate-300 hover:bg-blue-50/30">
                  <td className="py-1.5 px-1 border-r border-slate-400 font-medium">{toKhmerNum(st.yearRank)}</td>
                  <td className="py-1.5 px-3 border-r border-slate-400 text-left font-bold text-slate-900">{st.name}</td>
                  <td className="py-1.5 px-1 border-r border-slate-400 text-slate-700">{st.gender}</td>
                  <td className="py-1.5 px-1 border-r border-slate-400 text-[11px] font-mono text-slate-600">{st.dob}</td>
                  <td className="py-1.5 px-2 border-r border-slate-400 text-left text-[11px] text-slate-600">{st.pob}</td>
                  {/* Sem 1 */}
                  <td className="py-1.5 px-1 border-r border-slate-400 font-mono font-semibold">{st.sem1Avg.toFixed(2)}</td>
                  <td className="py-1.5 px-1 border-r border-slate-400 font-medium">{toKhmerNum(st.sem1Rank)}</td>
                  {/* Sem 2 */}
                  <td className="py-1.5 px-1 border-r border-slate-400 font-mono font-semibold">{st.sem2Avg.toFixed(2)}</td>
                  <td className="py-1.5 px-1 border-r border-slate-400 font-medium">{toKhmerNum(st.sem2Rank)}</td>
                  {/* Annual */}
                  <td className="py-1.5 px-1 border-r border-slate-400 font-mono font-bold text-blue-900">{st.yearAvg.toFixed(2)}</td>
                  <td className="py-1.5 px-1 border-r border-slate-400 font-bold text-slate-900">{toKhmerNum(st.yearRank)}</td>
                  {/* Letter Grade */}
                  <td className="py-1.5 px-1 border-r border-slate-400 font-bold">
                    <span
                      className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                        st.gradeLetter === 'A' || st.gradeLetter === 'B'
                          ? 'bg-blue-100 text-blue-800'
                          : st.gradeLetter === 'C'
                          ? 'bg-teal-100 text-teal-800'
                          : st.gradeLetter === 'D'
                          ? 'bg-slate-100 text-slate-800'
                          : st.gradeLetter === 'E'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.gradeLetter}
                    </span>
                  </td>
                  {/* Attendance */}
                  <td className="py-1.5 px-1 border-r border-slate-400 text-slate-600 font-mono">{toKhmerNum(st.absentPermission)}</td>
                  <td className="py-1.5 px-1 border-r border-slate-400 text-slate-600 font-mono">{toKhmerNum(st.absentNoPermission)}</td>
                  <td className="py-1.5 px-1 border-r border-slate-400 text-slate-900 font-mono font-semibold">{toKhmerNum(st.absentTotal)}</td>
                  {isEditing && (
                    <td className="no-print py-1.5 px-1 text-center">
                      <button onClick={() => handleDeleteStudent(st.id)} className="text-rose-600 hover:text-rose-800 p-1">
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </td>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Statistics Breakdown Card (Exact format matching Pages 12 to 21) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-slate-50 border border-slate-300 rounded-xl text-xs text-slate-800 mb-8">
          {/* Left Column: Demographics & Grades */}
          <div className="space-y-2">
            <div>
              <p className="font-bold text-slate-900">
                👥 សិស្សទាំងអស់ ៖ <span className="text-blue-900">{toKhmerNum(totalStudents)} នាក់</span> (100%)
              </p>
              <div className="flex items-center gap-4 text-slate-700 ml-4 mt-0.5">
                <span>ប្រុស ៖ {toKhmerNum(maleStudents)} នាក់ ({toKhmerNum(malePct)}%)</span>
                <span>ស្រី ៖ <strong className="text-rose-800">{toKhmerNum(femaleStudents)} នាក់</strong> ({toKhmerNum(femalePct)}%)</span>
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200">
              <p className="font-bold text-slate-900">📊 ចំណាត់ថ្នាក់ដោយនិទ្ទេស ៖</p>
              <div className="grid grid-cols-2 gap-x-2 gap-y-1 ml-4 mt-1 text-slate-700">
                {gradeCounts.A.length > 0 && <span>• សិស្សនិទ្ទេស A ៖ {toKhmerNum(gradeCounts.A.length)} នាក់</span>}
                {gradeCounts.B.length > 0 && <span>• សិស្សនិទ្ទេស B ៖ {toKhmerNum(gradeCounts.B.length)} នាក់</span>}
                {gradeCounts.C.length > 0 && <span>• សិស្សនិទ្ទេស C ៖ {toKhmerNum(gradeCounts.C.length)} នាក់</span>}
                {gradeCounts.D.length > 0 && <span>• សិស្សនិទ្ទេស D ៖ {toKhmerNum(gradeCounts.D.length)} នាក់</span>}
                {gradeCounts.E.length > 0 && <span>• សិស្សនិទ្ទេស E ៖ {toKhmerNum(gradeCounts.E.length)} នាក់</span>}
                {gradeCounts.F.length > 0 && <span>• សិស្សនិទ្ទេស F ៖ {toKhmerNum(gradeCounts.F.length)} នាក់</span>}
              </div>
            </div>
          </div>

          {/* Right Column: Exam Outcomes & Pass Rates */}
          <div className="space-y-2 md:border-l md:border-slate-200 md:pl-4">
            <div>
              <p className="font-bold text-slate-900">
                ✅ លទ្ធផលការប្រឡង ៖
              </p>
              <div className="space-y-1 ml-4 mt-1 text-slate-700">
                <p className="text-emerald-700 font-bold">
                  - ជាប់ ៖ {toKhmerNum(passedStudents.length)} នាក់ ({toKhmerNum(passedPct)}%)
                  <span className="font-normal text-slate-600 ml-2">(ស្រី {toKhmerNum(passedStudents.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length)} នាក់)</span>
                </p>
                <p className="text-rose-700 font-bold">
                  - ធ្លាក់ ៖ {toKhmerNum(failedStudents.length)} នាក់ ({toKhmerNum(failedPct)}%)
                </p>
                {droppedStudents.length > 0 && (
                  <p className="text-amber-700">
                    - បោះបង់ ៖ {toKhmerNum(droppedStudents.length)} នាក់ ({toKhmerNum(droppedPct)}%)
                  </p>
                )}
              </div>
            </div>

            <div className="pt-2 border-t border-slate-200 text-slate-600">
              <p>📈 អត្រាជាប់រួម ៖ <strong className="text-emerald-700">{toKhmerNum(passedPct)}%</strong></p>
              <p>📉 អត្រាធ្លាក់រួម ៖ <strong>{toKhmerNum(failedPct)}%</strong></p>
            </div>
          </div>
        </div>

        {/* Official Signatures Block matching Pages 12 to 21 */}
        <div className="grid grid-cols-3 gap-4 text-center text-xs pt-4 border-t border-slate-200">
          <div>
            <p className="font-bold text-slate-900">បានឃើញ និងឯកភាព</p>
            <p className="text-[11px] text-slate-500 mt-0.5">ថ្ងៃពុធ ៣កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស.២៥៦០</p>
            <p className="text-[11px] text-slate-500">ស្ពានស្រែង, ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-2">នាយកសាលា</p>
            <div className="h-16 flex items-end justify-center font-bold text-slate-900">
              {meta.directorName}
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-900">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
            <p className="text-[11px] text-slate-500 mt-0.5">ថ្ងៃអង្គារ ២កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស.២៥៦០</p>
            <p className="text-[11px] text-slate-500">ភូមិរោត, ថ្ងៃទី២០ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-2">នាយករង / នាយិកាសាលា</p>
            <div className="h-16 flex items-end justify-center font-bold text-slate-900">
              យ៉េន ណាវី
            </div>
          </div>

          <div>
            <p className="text-[11px] text-slate-500">ថ្ងៃចន្ទ ១កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស.២៥៦០</p>
            <p className="text-[11px] text-slate-500">ភូមិរោត, ថ្ងៃទី១៩ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-2">គ្រូប្រចាំថ្នាក់</p>
            <div className="h-16 flex items-end justify-center font-bold text-slate-900">
              {currentBook.teacherName}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
