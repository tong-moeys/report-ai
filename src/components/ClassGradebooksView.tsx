import React, { useState, useMemo, useEffect } from 'react';
import { ClassGradebook, StudentScoreRow, SchoolMeta, StaffMember } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import { DEFAULT_OFFICIAL_LUNAR_DATE } from '../utils/khmerDate';
import { Award, Printer, UserPlus, Edit2, Upload, Table, RefreshCw, Check, ArrowLeftRight } from 'lucide-react';

interface ClassGradebooksViewProps {
  meta: SchoolMeta;
  gradebooks: ClassGradebook[];
  staffList?: StaffMember[];
  onUpdateGradebooks: (gradebooks: ClassGradebook[]) => void;
  showAllClassesForPrint?: boolean;
  onOpenImportModal?: () => void;
  onNavigateToDetailedResults?: () => void;
}

/**
 * Match a gradebook class with the assigned teacher from the staff nominal roll (បញ្ជីរាយនាមបុគ្គលិក)
 */
export const getTeacherFromStaff = (
  gradeId: string,
  gradeName?: string,
  staffList?: StaffMember[]
): string | undefined => {
  if (!staffList || staffList.length === 0) return undefined;

  const norm = (s: string) =>
    s
      .toLowerCase()
      .replace(/^(ថ្នាក់ទី\s*|ថ្នាក់\s*|grade\s*)/i, '')
      .replace(/[\s\-_]/g, '')
      .trim();

  const targetId = norm(gradeId);
  const targetName = gradeName ? norm(gradeName) : targetId;

  // 1. Direct match with roleOrClass
  const found = staffList.find((st) => {
    if (!st.roleOrClass) return false;
    const r = norm(st.roleOrClass);
    return (
      r === targetId ||
      r === targetName ||
      st.roleOrClass.trim().toLowerCase() === gradeId.trim().toLowerCase() ||
      (gradeName && st.roleOrClass.trim().toLowerCase() === gradeName.trim().toLowerCase())
    );
  });

  if (found && found.name) return found.name.trim();

  // 2. Partial match (e.g. '1A' in 'ថ្នាក់ 1A' or '1A' in '1-A')
  const partial = staffList.find((st) => {
    if (!st.roleOrClass) return false;
    const r = norm(st.roleOrClass);
    return (
      (targetId.length >= 2 && r.includes(targetId)) ||
      (r.length >= 2 && targetId.includes(r))
    );
  });

  if (partial && partial.name) return partial.name.trim();

  return undefined;
};

export const ClassGradebooksView: React.FC<ClassGradebooksViewProps> = ({
  meta,
  gradebooks,
  staffList,
  onUpdateGradebooks,
  showAllClassesForPrint = false,
  onOpenImportModal,
  onNavigateToDetailedResults,
}) => {
  const [activeGradeId, setActiveGradeId] = useState<string>(gradebooks[0]?.gradeId || '3B');
  const [isEditing, setIsEditing] = useState(false);
  const [syncToast, setSyncToast] = useState(false);

  // Auto-sync teacher names from staffList into gradebooks whenever staffList changes
  useEffect(() => {
    if (!staffList || staffList.length === 0) return;
    const needsUpdate = gradebooks.some((gb) => {
      const matched = getTeacherFromStaff(gb.gradeId, gb.gradeName, staffList);
      return matched && matched !== gb.teacherName;
    });
    if (needsUpdate) {
      const updated = gradebooks.map((gb) => {
        const matched = getTeacherFromStaff(gb.gradeId, gb.gradeName, staffList);
        return matched && matched !== gb.teacherName ? { ...gb, teacherName: matched } : gb;
      });
      onUpdateGradebooks(updated);
    }
  }, [staffList]);

  // Mode for semester 1 & 2 columns: 'rank' (ចំ.ថ្នាក់) | 'grade' (និទ្ទេស) | 'both' (ទាំងពីរ)
  const [semesterColMode, setSemesterColMode] = useState<'rank' | 'grade' | 'both'>(() => {
    try {
      const saved = localStorage.getItem('kh_school_stat_semester_col_mode');
      if (saved === 'rank' || saved === 'grade' || saved === 'both') return saved;
    } catch {}
    return 'rank';
  });

  const handleSetSemesterColMode = (mode: 'rank' | 'grade' | 'both') => {
    setSemesterColMode(mode);
    try {
      localStorage.setItem('kh_school_stat_semester_col_mode', mode);
    } catch {}
  };

  const currentBook = gradebooks.find((g) => g.gradeId === activeGradeId) || gradebooks[0];

  // Helper for computing letter grade from average
  const computeGradeLetter = (avg: number): 'A' | 'B' | 'C' | 'D' | 'E' | 'F' => {
    if (avg >= 9.0) return 'A';
    if (avg >= 8.0) return 'B';
    if (avg >= 7.0) return 'C';
    if (avg >= 6.0) return 'D';
    if (avg >= 5.0) return 'E';
    return 'F';
  };

  // Re-rank students automatically across year and semesters
  const reRankStudents = (students: StudentScoreRow[]): StudentScoreRow[] => {
    const sorted = [...students].sort((a, b) => b.yearAvg - a.yearAvg);

    // Dynamic semester ranks if missing
    const sem1Sorted = [...sorted].sort((a, b) => (b.sem1Avg || 0) - (a.sem1Avg || 0));
    const sem1RankMap = new Map<string, number>();
    sem1Sorted.forEach((s, idx) => sem1RankMap.set(s.id, idx + 1));

    const sem2Sorted = [...sorted].sort((a, b) => (b.sem2Avg || 0) - (a.sem2Avg || 0));
    const sem2RankMap = new Map<string, number>();
    sem2Sorted.forEach((s, idx) => sem2RankMap.set(s.id, idx + 1));

    return sorted.map((st, idx) => ({
      ...st,
      no: idx + 1,
      yearRank: idx + 1,
      gradeLetter: computeGradeLetter(st.yearAvg),
      sem1Rank: st.sem1Rank ?? sem1RankMap.get(st.id) ?? (idx + 1),
      sem2Rank: st.sem2Rank ?? sem2RankMap.get(st.id) ?? (idx + 1),
      sem1Grade: st.sem1Grade || computeGradeLetter(st.sem1Avg || 0),
      sem2Grade: st.sem2Grade || computeGradeLetter(st.sem2Avg || 0),
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
      sem1Grade: 'C',
      sem2Avg: 7.0,
      sem2Rank: currentBook.students.length + 1,
      sem2Grade: 'C',
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

  // Helper to render colored badge for grade letters
  const renderGradeBadge = (grade: string | undefined) => {
    const g = grade || 'F';
    const colorClass =
      g === 'A'
        ? 'bg-emerald-100 text-emerald-800 font-extrabold border-emerald-300'
        : g === 'B'
        ? 'bg-blue-100 text-blue-800 font-bold border-blue-300'
        : g === 'C'
        ? 'bg-cyan-100 text-cyan-800 font-bold border-cyan-300'
        : g === 'D'
        ? 'bg-amber-100 text-amber-800 font-semibold border-amber-300'
        : g === 'E'
        ? 'bg-orange-100 text-orange-800 font-semibold border-orange-300'
        : 'bg-rose-100 text-rose-800 font-semibold border-rose-300';

    return (
      <span
        className={`inline-flex items-center justify-center px-1.5 py-0.2 rounded text-[10px] border ${colorClass}`}
      >
        {g}
      </span>
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

    // Semester rank maps for dynamic fallback
    const sem1RankMap = new Map<string, number>();
    [...students]
      .sort((a, b) => (b.sem1Avg || 0) - (a.sem1Avg || 0))
      .forEach((s, i) => sem1RankMap.set(s.id, i + 1));

    const sem2RankMap = new Map<string, number>();
    [...students]
      .sort((a, b) => (b.sem2Avg || 0) - (a.sem2Avg || 0))
      .forEach((s, i) => sem2RankMap.set(s.id, i + 1));

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

        {/* School & Supporting Institutions Hierarchy (3 Supporting Institutions + School) */}
        <div className="flex justify-between items-start text-xs text-slate-700 mb-3 pb-2 border-b border-slate-200">
          <div className="space-y-0.5">
            <p className="font-semibold text-slate-800 text-[11px]">ក្រសួងអប់រំ យុវជន និងកីឡា</p>
            <p className="text-slate-700 text-[11px]">
              {meta.province ? (meta.province.includes('មន្ទីរ') ? meta.province : `មន្ទីរអប់រំ យុវជន និងកីឡា${meta.province}`) : 'មន្ទីរអប់រំ យុវជន និងកីឡាខេត្តបន្ទាយមានជ័យ'}
            </p>
            <p className="text-slate-700 text-[11px]">
              {meta.clusterOrDistrict ? (meta.clusterOrDistrict.includes('ការិយាល័យ') ? meta.clusterOrDistrict : `ការិយាល័យអប់រំ យុវជន និងកីឡា${meta.clusterOrDistrict}`) : 'ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុកភ្នំស្រុក'}
            </p>
            <p className="font-bold text-blue-900 text-xs sm:text-sm pt-0.5">{meta.schoolName || 'សាលាបឋមសិក្សា រោគ'}</p>
          </div>
          <div className="text-right">
            <p>ឆ្នាំសិក្សា ៖ <strong>{meta.academicYear}</strong></p>
            {pageNumber && (
              <p className="text-[11px] text-slate-500 font-mono mt-0.5">ទំព័រទី {toKhmerNum(pageNumber)}</p>
            )}
          </div>
        </div>

        {/* Sheet Title */}
        <div className="text-center my-3">
          <h1 className="text-base sm:text-lg font-bold text-slate-900">
            សៀវភៅតាមដានការសិក្សា និងចំណាត់ថ្នាក់សិស្សប្រចាំឆ្នាំ
          </h1>
          {isEditing ? (
            <div className="flex items-center justify-center gap-2 mt-1.5 flex-wrap">
              <span className="text-xs font-bold text-slate-700">ថ្នាក់ទី ៖ {book.gradeName} | គ្រូប្រចាំថ្នាក់ ៖</span>
              <input
                type="text"
                value={book.teacherName}
                onChange={(e) => {
                  const val = e.target.value;
                  onUpdateGradebooks(
                    gradebooks.map((g) => (g.gradeId === book.gradeId ? { ...g, teacherName: val } : g))
                  );
                }}
                className="border border-emerald-400 rounded px-2 py-0.5 text-xs font-bold text-emerald-900 bg-emerald-50"
              />
              {staffList && staffList.length > 0 && (
                <select
                  value={book.teacherName}
                  onChange={(e) => {
                    const val = e.target.value;
                    if (val) {
                      onUpdateGradebooks(
                        gradebooks.map((g) => (g.gradeId === book.gradeId ? { ...g, teacherName: val } : g))
                      );
                    }
                  }}
                  className="border border-slate-300 rounded px-1.5 py-0.5 text-xs text-slate-700 bg-white"
                >
                  <option value="">-- រើសគ្រូពីបញ្ជីបុគ្គលិក --</option>
                  {staffList.filter((s) => s.category === 'teaching').map((s) => (
                    <option key={s.id} value={s.name.trim()}>
                      {s.name.trim()} (ថ្នាក់ {s.roleOrClass})
                    </option>
                  ))}
                </select>
              )}
            </div>
          ) : (
            <p className="text-xs font-semibold text-emerald-800 mt-1">
              ថ្នាក់ទី ៖ {book.gradeName} | គ្រូប្រចាំថ្នាក់ ៖ <strong className="text-slate-900">{getTeacherFromStaff(book.gradeId, book.gradeName, staffList) || book.teacherName}</strong>
            </p>
          )}
        </div>

        {/* Quick Legend / Switch helper notice */}
        <div className="no-print flex items-center justify-between text-[11px] text-slate-500 mb-1 px-1">
          <div className="flex items-center gap-1.5">
            <span className="font-medium">របៀបបង្ហាញ ៖</span>
            <span className="text-blue-700 font-semibold">
              {semesterColMode === 'rank'
                ? '🏅 បង្ហាញ ចំ.ថ្នាក់ (ចំណាត់ថ្នាក់ ឆ.១ និង ឆ.២)'
                : semesterColMode === 'grade'
                ? '🏷️ បង្ហាញ និទ្ទេស (និទ្ទេស ឆ.១ និង ឆ.២ : A, B, C...)'
                : '📊 បង្ហាញទាំងពីរ (ចំ.ថ្នាក់ & និទ្ទេស)'}
            </span>
          </div>
          <button
            type="button"
            onClick={() => handleSetSemesterColMode(semesterColMode === 'rank' ? 'grade' : 'rank')}
            className="flex items-center gap-1 text-emerald-700 hover:text-emerald-900 font-semibold cursor-pointer underline decoration-dotted"
          >
            <ArrowLeftRight className="w-3 h-3" />
            <span>ចុចត្រង់នេះដើម្បីប្ដូរ ({semesterColMode === 'rank' ? 'ទៅ និទ្ទេស' : 'ទៅ ចំ.ថ្នាក់'})</span>
          </button>
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

                {/* ឆមាសទី១ Header */}
                <th className="p-1.5 border-r border-slate-300 text-center w-12 bg-blue-50">ម.ឆ១</th>
                {(semesterColMode === 'rank' || semesterColMode === 'both') && (
                  <th
                    onClick={() => handleSetSemesterColMode(semesterColMode === 'rank' ? 'grade' : 'rank')}
                    className="p-1.5 border-r border-slate-300 text-center w-10 bg-blue-100/90 text-blue-950 font-bold cursor-pointer hover:bg-blue-200 select-none transition-colors"
                    title="ចុចដើម្បីប្ដូររវាង ចំ.ថ្នាក់ និង និទ្ទេស"
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <span>ចំ.១</span>
                      <ArrowLeftRight className="w-2.5 h-2.5 text-blue-600 opacity-70 no-print" />
                    </div>
                  </th>
                )}
                {(semesterColMode === 'grade' || semesterColMode === 'both') && (
                  <th
                    onClick={() => handleSetSemesterColMode(semesterColMode === 'grade' ? 'rank' : 'grade')}
                    className="p-1.5 border-r border-slate-300 text-center w-10 bg-indigo-100/90 text-indigo-950 font-bold cursor-pointer hover:bg-indigo-200 select-none transition-colors"
                    title="ចុចដើម្បីប្ដូររវាង និទ្ទេស និង ចំ.ថ្នាក់"
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <span>និ.១</span>
                      <ArrowLeftRight className="w-2.5 h-2.5 text-indigo-600 opacity-70 no-print" />
                    </div>
                  </th>
                )}

                {/* ឆមាសទី២ Header */}
                <th className="p-1.5 border-r border-slate-300 text-center w-12 bg-teal-50">ម.ឆ២</th>
                {(semesterColMode === 'rank' || semesterColMode === 'both') && (
                  <th
                    onClick={() => handleSetSemesterColMode(semesterColMode === 'rank' ? 'grade' : 'rank')}
                    className="p-1.5 border-r border-slate-300 text-center w-10 bg-teal-100/90 text-teal-950 font-bold cursor-pointer hover:bg-teal-200 select-none transition-colors"
                    title="ចុចដើម្បីប្ដូររវាង ចំ.ថ្នាក់ និង និទ្ទេស"
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <span>ចំ.២</span>
                      <ArrowLeftRight className="w-2.5 h-2.5 text-teal-600 opacity-70 no-print" />
                    </div>
                  </th>
                )}
                {(semesterColMode === 'grade' || semesterColMode === 'both') && (
                  <th
                    onClick={() => handleSetSemesterColMode(semesterColMode === 'grade' ? 'rank' : 'grade')}
                    className="p-1.5 border-r border-slate-300 text-center w-10 bg-emerald-100/90 text-emerald-950 font-bold cursor-pointer hover:bg-emerald-200 select-none transition-colors"
                    title="ចុចដើម្បីប្ដូររវាង និទ្ទេស និង ចំ.ថ្នាក់"
                  >
                    <div className="flex items-center justify-center gap-0.5">
                      <span>និ.២</span>
                      <ArrowLeftRight className="w-2.5 h-2.5 text-emerald-600 opacity-70 no-print" />
                    </div>
                  </th>
                )}

                {/* ប្រចាំឆ្នាំ Headers */}
                <th className="p-1.5 border-r border-slate-300 text-center w-12 bg-amber-50 font-bold text-amber-950">ម.ប្រចាំឆ្នាំ</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10 bg-amber-50 font-bold text-amber-950">ចំណាត់ថ្នាក់</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10 bg-amber-50 font-bold text-amber-950">និទ្ទេស</th>
                <th className="p-1.5 border-r border-slate-300 text-center w-10">អវត្តមាន</th>
                <th className="p-1.5 text-center w-14">លទ្ធផល</th>
              </tr>
            </thead>
            <tbody>
              {students.map((st, idx) => {
                const s1Rank = st.sem1Rank ?? sem1RankMap.get(st.id) ?? (idx + 1);
                const s2Rank = st.sem2Rank ?? sem2RankMap.get(st.id) ?? (idx + 1);
                const s1Grade = st.sem1Grade || computeGradeLetter(st.sem1Avg || 0);
                const s2Grade = st.sem2Grade || computeGradeLetter(st.sem2Avg || 0);

                return (
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

                    {/* ម.ឆ១ */}
                    <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-blue-50/40">
                      {toKhmerNum(st.sem1Avg.toFixed(2))}
                    </td>

                    {/* ចំ.១ */}
                    {(semesterColMode === 'rank' || semesterColMode === 'both') && (
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold bg-blue-50/40 text-blue-900">
                        {isEditing && !showAllClassesForPrint ? (
                          <input
                            type="number"
                            value={st.sem1Rank ?? s1Rank}
                            onChange={(e) =>
                              handleUpdateStudent({ ...st, sem1Rank: parseInt(e.target.value) || 1 }, book.gradeId)
                            }
                            className="w-10 border border-blue-300 rounded px-1 py-0.5 text-center text-[10px]"
                          />
                        ) : (
                          toKhmerNum(s1Rank)
                        )}
                      </td>
                    )}

                    {/* និ.១ */}
                    {(semesterColMode === 'grade' || semesterColMode === 'both') && (
                      <td className="p-1.5 border-r border-slate-200 text-center bg-indigo-50/30">
                        {isEditing && !showAllClassesForPrint ? (
                          <select
                            value={s1Grade}
                            onChange={(e) =>
                              handleUpdateStudent({ ...st, sem1Grade: e.target.value as any }, book.gradeId)
                            }
                            className="border border-indigo-300 rounded px-0.5 py-0.5 text-[10px] bg-white font-bold"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                          </select>
                        ) : (
                          renderGradeBadge(s1Grade)
                        )}
                      </td>
                    )}

                    {/* ម.ឆ២ */}
                    <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-teal-50/40">
                      {toKhmerNum(st.sem2Avg.toFixed(2))}
                    </td>

                    {/* ចំ.២ */}
                    {(semesterColMode === 'rank' || semesterColMode === 'both') && (
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold bg-teal-50/40 text-teal-900">
                        {isEditing && !showAllClassesForPrint ? (
                          <input
                            type="number"
                            value={st.sem2Rank ?? s2Rank}
                            onChange={(e) =>
                              handleUpdateStudent({ ...st, sem2Rank: parseInt(e.target.value) || 1 }, book.gradeId)
                            }
                            className="w-10 border border-teal-300 rounded px-1 py-0.5 text-center text-[10px]"
                          />
                        ) : (
                          toKhmerNum(s2Rank)
                        )}
                      </td>
                    )}

                    {/* និ.២ */}
                    {(semesterColMode === 'grade' || semesterColMode === 'both') && (
                      <td className="p-1.5 border-r border-slate-200 text-center bg-emerald-50/30">
                        {isEditing && !showAllClassesForPrint ? (
                          <select
                            value={s2Grade}
                            onChange={(e) =>
                              handleUpdateStudent({ ...st, sem2Grade: e.target.value as any }, book.gradeId)
                            }
                            className="border border-emerald-300 rounded px-0.5 py-0.5 text-[10px] bg-white font-bold"
                          >
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                            <option value="E">E</option>
                            <option value="F">F</option>
                          </select>
                        ) : (
                          renderGradeBadge(s2Grade)
                        )}
                      </td>
                    )}

                    {/* ប្រចាំឆ្នាំ Columns */}
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
                      {renderGradeBadge(st.gradeLetter)}
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
                );
              })}
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

        {/* Official Signatures Block matching Pages 12 to 21 with Lunar Date above Solar Date */}
        <div className="grid grid-cols-3 gap-3 text-center text-xs pt-3 border-t border-slate-300 page-break-inside-avoid">
          {/* 1. Cluster Director Approval (នាយកកម្រង) - No printed text name; blank space for signature & physical rubber stamp */}
          <div>
            <p className="font-bold text-slate-900 text-[11px]">បានឃើញ និងឯកភាព</p>
            <p className="text-[10px] text-slate-600 mt-1">{DEFAULT_OFFICIAL_LUNAR_DATE}</p>
            <p className="text-[10px] text-slate-500">ស្ពានស្រែង, ថ្ងៃទី២១ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-1 text-[11px]">នាយកកម្រង</p>
            <div className="h-16 sm:h-20 flex items-end justify-center pb-1">
              <span className="text-[9px] text-slate-300 italic no-print">[ត្រា និងហត្ថលេខា]</span>
            </div>
          </div>

          {/* 2. School Director Verification (នាយកសាលា) - No printed text name; blank space for signature & physical rubber stamp */}
          <div>
            <p className="font-bold text-slate-900 text-[11px]">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
            <p className="text-[10px] text-slate-600 mt-1">{DEFAULT_OFFICIAL_LUNAR_DATE}</p>
            <p className="text-[10px] text-slate-500">ភូមិរោត, ថ្ងៃទី២០ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-1 text-[11px]">នាយកសាលា</p>
            <div className="h-16 sm:h-20 flex items-end justify-center pb-1">
              <span className="text-[9px] text-slate-300 italic no-print">[ត្រា និងហត្ថលេខា]</span>
            </div>
          </div>

          {/* 3. Homeroom Teacher (គ្រូប្រចាំថ្នាក់) - Dynamic teacher name from Staff Nominal Roll */}
          <div>
            <p className="text-[10px] text-slate-600">{DEFAULT_OFFICIAL_LUNAR_DATE}</p>
            <p className="text-[10px] text-slate-500 mt-0.5">ភូមិរោត, ថ្ងៃទី១៩ ខែមីនា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-1 text-[11px]">គ្រូប្រចាំថ្នាក់</p>
            <div className="h-12 sm:h-14"></div>
            <div className="font-bold text-slate-900 text-xs">
              {getTeacherFromStaff(book.gradeId, book.gradeName, staffList) || book.teacherName}
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
            {/* View Mode Toggle: Rank vs Grade vs Both */}
            <div className="flex items-center bg-white border border-slate-300 rounded-lg p-0.5 shadow-2xs">
              <button
                type="button"
                onClick={() => handleSetSemesterColMode('rank')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                  semesterColMode === 'rank'
                    ? 'bg-blue-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="បង្ហាញចំណាត់ថ្នាក់ឆមាស (ចំ.១, ចំ.២)"
              >
                <span>🏅 ចំ.ថ្នាក់</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetSemesterColMode('grade')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                  semesterColMode === 'grade'
                    ? 'bg-indigo-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="បង្ហាញនិទ្ទេសឆមាស (និ.១, និ.២)"
              >
                <span>🏷️ និទ្ទេស</span>
              </button>
              <button
                type="button"
                onClick={() => handleSetSemesterColMode('both')}
                className={`flex items-center gap-1 px-2 py-1 text-xs rounded-md font-semibold transition-all cursor-pointer ${
                  semesterColMode === 'both'
                    ? 'bg-purple-600 text-white shadow-2xs font-bold'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
                title="បង្ហាញទាំង ចំ.ថ្នាក់ និង និទ្ទេស"
              >
                <span>📊 ទាំងពីរ</span>
              </button>
            </div>

            {staffList && staffList.length > 0 && (
              <button
                type="button"
                onClick={() => {
                  const updated = gradebooks.map((gb) => {
                    const matched = getTeacherFromStaff(gb.gradeId, gb.gradeName, staffList);
                    return matched ? { ...gb, teacherName: matched } : gb;
                  });
                  onUpdateGradebooks(updated);
                  setSyncToast(true);
                  setTimeout(() => setSyncToast(false), 2500);
                }}
                className={`flex items-center gap-1 px-2.5 py-1 text-xs font-medium rounded-lg border transition-all cursor-pointer ${
                  syncToast
                    ? 'bg-emerald-600 text-white border-emerald-600 shadow-2xs'
                    : 'border-slate-300 bg-white hover:bg-slate-50 text-slate-700'
                }`}
                title="ធ្វើសមកាលកម្មឈ្មោះគ្រូតាមបញ្ជីបុគ្គលិកទាំង ១៧នាក់"
              >
                {syncToast ? (
                  <>
                    <Check className="w-3 h-3 text-white" />
                    <span className="font-bold">បានភ្ជាប់ឈ្មោះគ្រូរួច!</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-3 h-3 text-emerald-600" />
                    <span>ភ្ជាប់ឈ្មោះគ្រូ</span>
                  </>
                )}
              </button>
            )}

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
