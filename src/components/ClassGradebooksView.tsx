import React, { useState } from 'react';
import { ClassGradebook, StudentScoreRow, SchoolMeta } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import { Award, Printer, UserPlus, Edit2, Upload, Table } from 'lucide-react';

interface ClassGradebooksViewProps {
  meta: SchoolMeta;
  gradebooks: ClassGradebook[];
  onUpdateGradebooks: (gradebooks: ClassGradebook[]) => void;
  showAllClassesForPrint?: boolean;
  onOpenImportModal?: () => void;
  onNavigateToDetailedResults?: () => void;
}

export const ClassGradebooksView: React.FC<ClassGradebooksViewProps> = ({
  meta,
  gradebooks,
  onUpdateGradebooks,
  showAllClassesForPrint = false,
  onOpenImportModal,
  onNavigateToDetailedResults,
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
    const sorted = [...students].sort((a, b) => b.yearAvg - a.yearAvg);
    return sorted.map((st, idx) => ({
      ...st,
      no: idx + 1,
      yearRank: idx + 1,
      gradeLetter: computeGradeLetter(st.yearAvg),
    }));
  };

  const handleUpdateStudent = (updated: StudentScoreRow, bookGradeId: string = currentBook.gradeId) => {
    const targetBook = gradebooks.find((g) => g.gradeId === bookGradeId) || currentBook;
    const updatedStudents = targetBook.students.map((s) => (s.id === updated.id ? updated : s));
    const ranked = reRankStudents(updatedStudents);
    onUpdateGradebooks(
      gradebooks.map((g) => (g.gradeId === bookGradeId ? { ...g, students: ranked } : g))
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

  // Render individual sheet helper
  const renderSingleClassSheet = (book: ClassGradebook, pageNumber?: number) => {
    const students = book.students;
    const totalStudents = students.length;
    const femaleStudents = students.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length;
    const maleStudents = totalStudents - femaleStudents;
    const femalePct = totalStudents > 0 ? Math.round((femaleStudents * 100) / totalStudents) : 0;
    const malePct = totalStudents > 0 ? 100 - femalePct : 0;

    const gradeCounts = {
      A: students.filter((s) => s.gradeLetter === 'A'),
      B: students.filter((s) => s.gradeLetter === 'B'),
      C: students.filter((s) => s.gradeLetter === 'C'),
      D: students.filter((s) => s.gradeLetter === 'D'),
      E: students.filter((s) => s.gradeLetter === 'E'),
      F: students.filter((s) => s.gradeLetter === 'F'),
    };

    const passedStudents = students.filter((s) => s.yearAvg >= 5.0 && !s.isDropped);
    const failedStudents = students.filter((s) => s.yearAvg < 5.0 && !s.isDropped);
    const droppedStudents = students.filter((s) => s.isDropped);

    const passedPct = totalStudents > 0 ? Math.round((passedStudents.length * 100) / totalStudents) : 0;
    const failedPct = totalStudents > 0 ? Math.round((failedStudents.length * 100) / totalStudents) : 0;
    const droppedPct = totalStudents > 0 ? Math.round((droppedStudents.length * 100) / totalStudents) : 0;

    return (
      <div
        key={book.gradeId}
        className="p-4 sm:p-8 max-w-5xl mx-auto font-sans leading-normal print-page-break html2pdf__page-break bg-white mb-6 border border-slate-200 rounded-xl print:border-none print:shadow-none"
      >
        {/* Kingdom Header */}
        <div className="text-center mb-3">
          <h2 className="font-bold text-sm sm:text-base text-slate-900 tracking-wider">ព្រះរាជាណាចក្រកម្ពុជា</h2>
          <h3 className="text-xs text-amber-800 font-semibold mt-0.5">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
          <div className="w-16 h-0.5 bg-amber-600/30 mx-auto my-1.5" />
        </div>

        {/* School & District Header */}
        <div className="flex justify-between items-start text-xs text-slate-700 mb-3 pb-2 border-b border-slate-200">
          <div>
            <p className="font-bold">ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុកភ្នំស្រុក</p>
            <p className="font-bold text-blue-900">{meta.schoolName}</p>
          </div>
          <div className="text-right">
            <p>ឆ្នាំសិក្សា ៖ <strong>{meta.academicYear}</strong></p>
            {pageNumber && (
              <p className="text-[11px] text-slate-500 font-mono">ទំព័រទី {toKhmerNum(pageNumber)}</p>
            )}
          </div>
        </div>

        {/* Sheet Title */}
        <div className="text-center my-3">
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            សៀវភៅតាមដានការសិក្សា និងចំណាត់ថ្នាក់សិស្សប្រចាំឆ្នាំ
          </h1>
          <p className="text-xs font-semibold text-emerald-800 mt-1">
            ថ្នាក់ទី ៖ {book.gradeName} | គ្រូប្រចាំថ្នាក់ ៖ {book.teacherName}
          </p>
        </div>

        {/* Student Score Table */}
        <div className="overflow-x-auto border border-slate-300 rounded-lg mb-4 text-[11px]">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-800 border-b border-slate-300 text-center text-[10px]">
                <th className="p-1.5 border-r border-slate-300 w-8">ល.រ</th>
                <th className="p-1.5 border-r border-slate-300 min-w-[110px] text-left">គោត្តនាម និងនាម</th>
                <th className="p-1.5 border-r border-slate-300 w-10">ភេទ</th>
                <th className="p-1.5 border-r border-slate-300 w-24">ថ្ងៃខែឆ្នាំកំណើត</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-12 bg-blue-50">ម.ឆ១</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10 bg-blue-50">ធ្ន.១</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-12 bg-teal-50">ម.ឆ២</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10 bg-teal-50">ធ្ន.២</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-12 bg-amber-50 font-bold">ម.ប្រចាំឆ្នាំ</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10 bg-amber-50 font-bold">ចំណាត់ថ្នាក់</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10">និទ្ទេស</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10">អវត្តមាន</th>
                <th className="p-1.5 text-center w-14">លទ្ធផល</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st, idx) => (
                <tr
                  key={st.id}
                  className={`border-b border-slate-200 hover:bg-slate-50 transition-colors ${
                    st.isDropped ? 'bg-rose-50/50 text-rose-700 line-through' : ''
                  }`}
                >
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono">
                    {toKhmerNum(idx + 1)}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 font-medium">
                    {isEditing && !showAllClassesForPrint ? (
                      <input
                        type="text"
                        value={st.name}
                        onChange={(e) => handleUpdateStudent({ ...st, name: e.target.value }, book.gradeId)}
                        className="w-full border border-blue-300 rounded px-1 py-0.5 text-[11px]"
                      />
                    ) : (
                      st.name
                    )}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center">
                    {st.gender}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center text-[10px] text-slate-600">
                    {st.dob}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-blue-50/40">
                    {toKhmerNum(st.sem1Avg.toFixed(2))}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-blue-50/40">
                    {toKhmerNum(st.sem1Rank)}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-teal-50/40">
                    {toKhmerNum(st.sem2Avg.toFixed(2))}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-teal-50/40">
                    {toKhmerNum(st.sem2Rank)}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold bg-amber-50 text-amber-900">
                    {isEditing && !showAllClassesForPrint ? (
                      <input
                        type="number"
                        step="0.01"
                        value={st.yearAvg}
                        onChange={(e) =>
                          handleUpdateStudent({ ...st, yearAvg: parseFloat(e.target.value) || 0 }, book.gradeId)
                        }
                        className="w-12 border border-blue-300 rounded px-1 py-0.5 text-center"
                      />
                    ) : (
                      toKhmerNum(st.yearAvg.toFixed(2))
                    )}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold bg-amber-50">
                    {toKhmerNum(st.yearRank)}
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-bold">
                    <span
                      className={`inline-block px-1.5 py-0.2 rounded text-[10px] ${
                        st.gradeLetter === 'A'
                          ? 'bg-emerald-100 text-emerald-800 font-extrabold'
                          : st.gradeLetter === 'B'
                          ? 'bg-blue-100 text-blue-800'
                          : st.gradeLetter === 'C'
                          ? 'bg-indigo-100 text-indigo-800'
                          : st.gradeLetter === 'D'
                          ? 'bg-amber-100 text-amber-800'
                          : 'bg-rose-100 text-rose-800'
                      }`}
                    >
                      {st.gradeLetter}
                    </span>
                  </td>
                  <td className="p-1.5 border-r border-slate-200 text-center font-mono text-slate-500">
                    {toKhmerNum(st.absentTotal || 0)}
                  </td>
                  <td className="p-1.5 text-center font-bold">
                    {st.isDropped ? (
                      <span className="text-rose-600 text-[10px]">បោះបង់</span>
                    ) : st.yearAvg >= 5.0 ? (
                      <span className="text-emerald-700 text-[10px]">ឡើងថ្នាក់</span>
                    ) : (
                      <span className="text-rose-600 text-[10px]">ត្រួតថ្នាក់</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Statistical Summary of the class */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-xs bg-slate-50 p-3 rounded-lg border border-slate-200 mb-4 page-break-inside-avoid">
          <div className="space-y-1.5">
            <p className="font-bold text-slate-900">
              📊 ស្ថិតិរួមថ្នាក់ {book.gradeName} ៖
            </p>
            <div className="space-y-0.5 ml-2 text-slate-700 text-[11px]">
              <p>• សិស្សសរុប ៖ <strong>{toKhmerNum(totalStudents)}</strong> នាក់ (ស្រី <strong>{toKhmerNum(femaleStudents)}</strong> នាក់ = {toKhmerNum(femalePct)}%, ប្រុស <strong>{toKhmerNum(maleStudents)}</strong> នាក់ = {toKhmerNum(malePct)}%)</p>
              <p className="text-emerald-700 font-semibold">• ឡើងថ្នាក់ (ជាប់) ៖ <strong>{toKhmerNum(passedStudents.length)}</strong> នាក់ ({toKhmerNum(passedPct)}%)</p>
              <p className="text-rose-700 font-semibold">• ត្រួតថ្នាក់ (ធ្លាក់) ៖ <strong>{toKhmerNum(failedStudents.length)}</strong> នាក់ ({toKhmerNum(failedPct)}%)</p>
              {droppedStudents.length > 0 && (
                <p className="text-amber-700">• បោះបង់ ៖ <strong>{toKhmerNum(droppedStudents.length)}</strong> នាក់ ({toKhmerNum(droppedPct)}%)</p>
              )}
            </div>
          </div>

          <div className="space-y-1.5 md:border-l md:border-slate-200 md:pl-3">
            <p className="font-bold text-slate-900">
              🏅 ការបែងចែកនិទ្ទេស (Grade Distribution) ៖
            </p>
            <div className="grid grid-cols-3 gap-1 ml-2 text-[11px] text-slate-700">
              <span>និទ្ទេស A: <strong>{toKhmerNum(gradeCounts.A.length)}</strong></span>
              <span>និទ្ទេស B: <strong>{toKhmerNum(gradeCounts.B.length)}</strong></span>
              <span>និទ្ទេស C: <strong>{toKhmerNum(gradeCounts.C.length)}</strong></span>
              <span>និទ្ទេស D: <strong>{toKhmerNum(gradeCounts.D.length)}</strong></span>
              <span>និទ្ទេស E: <strong>{toKhmerNum(gradeCounts.E.length)}</strong></span>
              <span>និទ្ទេស F: <strong>{toKhmerNum(gradeCounts.F.length)}</strong></span>
            </div>
            <div className="pt-1 text-[11px] text-slate-600 border-t border-slate-200">
              អត្រាជាប់រួម ៖ <strong className="text-emerald-700">{toKhmerNum(passedPct)}%</strong> | អត្រាធ្លាក់ ៖ <strong>{toKhmerNum(failedPct)}%</strong>
            </div>
          </div>
        </div>

        {/* Official Signatures Block matching Pages 12 to 21 */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs pt-3 border-t border-slate-300 page-break-inside-avoid">
          <div>
            <p className="font-bold text-slate-900 text-[11px]">បានឃើញ និងឯកភាព</p>
            <p className="text-[10px] text-slate-500">ស្ពានស្រែង, ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-1 text-[11px]">នាយកសាលា</p>
            <div className="h-12 flex items-end justify-center font-bold text-slate-900 text-xs">
              {meta.directorName}
            </div>
          </div>

          <div>
            <p className="font-bold text-slate-900 text-[11px]">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
            <p className="text-[10px] text-slate-500">ភូមិរោត, ថ្ងៃទី២០ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-1 text-[11px]">នាយករងសាលា</p>
            <div className="h-12 flex items-end justify-center font-bold text-slate-900 text-xs">
              យ៉េន ណាវី
            </div>
          </div>

          <div>
            <p className="text-[10px] text-slate-500">ភូមិរោត, ថ្ងៃទី១៩ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-1 text-[11px]">គ្រូប្រចាំថ្នាក់</p>
            <div className="h-12 flex items-end justify-center font-bold text-slate-900 text-xs">
              {book.teacherName}
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (showAllClassesForPrint) {
    return (
      <div className="space-y-6">
        {gradebooks.map((gb, idx) => renderSingleClassSheet(gb, 12 + idx))}
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl shadow-xs border border-slate-200 overflow-hidden print:border-none print:shadow-none">
      {/* Header & Grade Tabs */}
      <div className="no-print p-3 bg-slate-50 border-b border-slate-200">
        <div className="flex flex-wrap items-center justify-between gap-2 mb-2.5">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-emerald-600 text-white flex items-center justify-center shrink-0">
              <Award className="w-4 h-4" />
            </div>
            <div>
              <h3 className="font-bold text-slate-800 text-xs sm:text-sm">
                សៀវភៅចំណាត់ថ្នាក់ដំណាច់ឆ្នាំតាមថ្នាក់ (ទំព័រទី ១២ ដល់ ២១)
              </h3>
              <p className="text-[11px] text-slate-500">
                ជ្រើសរើសថ្នាក់ដើម្បីមើល និងកែសម្រួលពិន្ទុសិស្ស
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1.5 flex-wrap">
            {onOpenImportModal && (
              <button
                onClick={onOpenImportModal}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-semibold rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white cursor-pointer shadow-2xs"
                title="នាំចូលទិន្នន័យពិន្ទុ"
              >
                <Upload className="w-3 h-3" />
                <span>នាំចូល</span>
              </button>
            )}
            {onNavigateToDetailedResults && (
              <button
                onClick={onNavigateToDetailedResults}
                className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
                title="តារាងលទ្ធផលសិក្សាលម្អិតទាំងអស់"
              >
                <Table className="w-3 h-3 text-amber-600" />
                <span>លទ្ធផលលម្អិត</span>
              </button>
            )}
            <button
              onClick={() => setIsEditing(!isEditing)}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
            >
              <Edit2 className="w-3 h-3" />
              <span>{isEditing ? 'រួចរាល់' : 'កែពិន្ទុ'}</span>
            </button>
            <button
              onClick={handleAddStudent}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white cursor-pointer"
            >
              <UserPlus className="w-3 h-3" />
              <span>ថែមសិស្ស</span>
            </button>
            <button
              onClick={() => window.print()}
              className="flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg bg-slate-800 hover:bg-slate-900 text-white cursor-pointer"
            >
              <Printer className="w-3 h-3" />
              <span>បោះពុម្ព</span>
            </button>
          </div>
        </div>

        {/* 10 Class Pills */}
        <div className="flex items-center gap-1 overflow-x-auto pb-0.5">
          {gradebooks.map((gb) => (
            <button
              key={gb.gradeId}
              onClick={() => setActiveGradeId(gb.gradeId)}
              className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition-all whitespace-nowrap cursor-pointer ${
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

      {/* Single Printable Sheet for active class */}
      {renderSingleClassSheet(currentBook)}
    </div>
  );
};
