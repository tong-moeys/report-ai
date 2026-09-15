import React, { useState, useMemo } from 'react';
import { StudentScoreRow, SchoolMeta } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import {
  computeMoEYSGradeLetter,
  computeMoEYSStatus,
  recalculateStudentFormulas,
} from '../utils/studentAggregator';
import {
  Upload,
  RefreshCw,
  Sparkles,
  Plus,
  Trash2,
  Search,
  Filter,
  Download,
  FileSpreadsheet,
  CheckCircle2,
  AlertCircle,
  HelpCircle,
  Calculator,
} from 'lucide-react';

interface DetailedAcademicResultsViewProps {
  meta: SchoolMeta;
  students: StudentScoreRow[];
  onUpdateStudents: (students: StudentScoreRow[]) => void;
  onOpenImportModal: () => void;
  onOpenAiReportModal: () => void;
  onSyncToSchoolReports: () => void;
  onLoadSampleData: () => void;
}

export const DetailedAcademicResultsView: React.FC<DetailedAcademicResultsViewProps> = ({
  meta,
  students,
  onUpdateStudents,
  onOpenImportModal,
  onOpenAiReportModal,
  onSyncToSchoolReports,
  onLoadSampleData,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedGender, setSelectedGender] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Extract unique classes sorted
  const availableClasses = useMemo(() => {
    const set = new Set<string>();
    students.forEach((s) => {
      if (s.gradeClass) set.add(s.gradeClass.trim());
    });
    return Array.from(set).sort();
  }, [students]);

  // Filter students based on UI controls
  const filteredStudents = useMemo(() => {
    return students.filter((st) => {
      if (selectedClass !== 'all' && st.gradeClass !== selectedClass) return false;
      if (selectedGender !== 'all') {
        const isF = st.gender === 'ស្រី' || st.gender === 'ស';
        if (selectedGender === 'ស្រី' && !isF) return false;
        if (selectedGender === 'ប្រុស' && isF) return false;
      }
      if (selectedStatus !== 'all') {
        if (selectedStatus === 'ឡើងថ្នាក់' && st.status !== 'ឡើងថ្នាក់') return false;
        if (selectedStatus === 'ត្រួតថ្នាក់' && st.status !== 'ត្រួតថ្នាក់') return false;
        if (selectedStatus === 'បោះបង់' && !st.isDropped && st.status !== 'បោះបង់') return false;
      }
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchName = st.name.toLowerCase().includes(query);
        const matchPob = st.pob.toLowerCase().includes(query);
        const matchNo = String(st.no).includes(query);
        if (!matchName && !matchPob && !matchNo) return false;
      }
      return true;
    });
  }, [students, selectedClass, selectedGender, selectedStatus, searchQuery]);

  // Overall statistics
  const stats = useMemo(() => {
    const total = filteredStudents.length;
    const female = filteredStudents.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length;
    const dropouts = filteredStudents.filter((s) => s.isDropped || s.status === 'បោះបង់').length;
    const passed = filteredStudents.filter((s) => !s.isDropped && s.status !== 'បោះបង់' && (s.yearAvg || 0) >= 5.0).length;
    const repeaters = filteredStudents.filter((s) => !s.isDropped && (s.status === 'ត្រួតថ្នាក់' || (s.yearAvg || 0) < 5.0)).length;
    const passRate = total > 0 ? ((passed / total) * 100).toFixed(1) : '0';
    const sumYearAvg = filteredStudents.reduce((acc, s) => acc + (s.yearAvg || 0), 0);
    const avgScore = total > 0 ? (sumYearAvg / total).toFixed(2) : '0.00';

    return { total, female, dropouts, passed, repeaters, passRate, avgScore };
  }, [filteredStudents]);

  // Handle cell edit and recalculate dependent formula fields
  const handleStudentFieldChange = (id: string, field: keyof StudentScoreRow, value: any) => {
    const updated = students.map((st) => {
      if (st.id !== id) return st;

      const newStudent: StudentScoreRow = { ...st, [field]: value };

      // Reactive calculations
      if (field === 'sem1MonthlyAvg' || field === 'sem1ExamAvg') {
        const m = field === 'sem1MonthlyAvg' ? Number(value) || 0 : st.sem1MonthlyAvg || 0;
        const e = field === 'sem1ExamAvg' ? Number(value) || 0 : st.sem1ExamAvg || 0;
        newStudent.sem1Avg = parseFloat(((m + e) / 2).toFixed(2));
        newStudent.sem1Grade = computeMoEYSGradeLetter(newStudent.sem1Avg);
        newStudent.annualSem1 = newStudent.sem1Avg;
      }

      if (field === 'sem2MonthlyAvg' || field === 'sem2ExamAvg') {
        const m = field === 'sem2MonthlyAvg' ? Number(value) || 0 : st.sem2MonthlyAvg || 0;
        const e = field === 'sem2ExamAvg' ? Number(value) || 0 : st.sem2ExamAvg || 0;
        newStudent.sem2Avg = parseFloat(((m + e) / 2).toFixed(2));
        newStudent.sem2Grade = computeMoEYSGradeLetter(newStudent.sem2Avg);
        newStudent.annualSem2 = newStudent.sem2Avg;
      }

      if (field === 'sem1Avg') {
        newStudent.sem1Avg = Number(value) || 0;
        newStudent.sem1Grade = computeMoEYSGradeLetter(newStudent.sem1Avg);
        newStudent.annualSem1 = newStudent.sem1Avg;
      }

      if (field === 'sem2Avg') {
        newStudent.sem2Avg = Number(value) || 0;
        newStudent.sem2Grade = computeMoEYSGradeLetter(newStudent.sem2Avg);
        newStudent.annualSem2 = newStudent.sem2Avg;
      }

      // Recompute annual average if semesters changed
      const sem1 = newStudent.annualSem1 ?? newStudent.sem1Avg ?? 0;
      const sem2 = newStudent.annualSem2 ?? newStudent.sem2Avg ?? 0;
      newStudent.yearAvg = parseFloat(((sem1 + sem2) / 2).toFixed(2));
      newStudent.gradeLetter = computeMoEYSGradeLetter(newStudent.yearAvg);

      if (field === 'status') {
        newStudent.isDropped = value === 'បោះបង់';
        newStudent.status = value;
      } else if (!newStudent.isDropped) {
        newStudent.status = computeMoEYSStatus(newStudent.gradeLetter, false, newStudent.status);
      }

      return newStudent;
    });

    onUpdateStudents(updated);
  };

  const handleRecalculateAllFormulas = () => {
    const recalculated = students.map((st) => recalculateStudentFormulas(st));
    onUpdateStudents(recalculated);
  };

  const handleAddNewStudent = () => {
    const nextNo = students.length > 0 ? Math.max(...students.map((s) => s.no || 0)) + 1 : 1;
    const newStudent: StudentScoreRow = {
      id: `st-new-${Date.now()}`,
      no: nextNo,
      name: 'សិស្សថ្មី',
      gender: 'ស្រី',
      dob: '01/01/2019',
      gradeClass: selectedClass !== 'all' ? selectedClass : '1-A',
      pob: `${meta.schoolName}, ${meta.clusterOrDistrict}`,
      sem1MonthlyAvg: 7.00,
      sem1ExamAvg: 7.00,
      sem1Avg: 7.00,
      sem1Grade: 'C',
      sem2MonthlyAvg: 7.00,
      sem2ExamAvg: 7.00,
      sem2Avg: 7.00,
      sem2Grade: 'C',
      annualSem1: 7.00,
      annualSem2: 7.00,
      yearAvg: 7.00,
      gradeLetter: 'C',
      status: 'ឡើងថ្នាក់',
      isDropped: false,
      absentPermission: 0,
      absentNoPermission: 0,
      absentTotal: 0,
    };
    onUpdateStudents([newStudent, ...students]);
    setEditingId(newStudent.id);
  };

  const handleDeleteStudent = (id: string) => {
    if (window.confirm('តើអ្នកពិតជាចង់លុបទិន្នន័យសិស្សនេះមែនទេ?')) {
      onUpdateStudents(students.filter((s) => s.id !== id));
    }
  };

  const handleExportCsv = () => {
    const headers = [
      'ល.រ',
      'នាមត្រកូល និងនាម',
      'ភេទ',
      'ថ្ងៃខែឆ្នាំកំណើត',
      'ថ្នាក់',
      'ទីកន្លែងកំណើត',
      'ឆមាស១_ម.ភាគខែ',
      'ឆមាស១_ម.ភាគប្រឡង',
      'ឆមាស១_ម.ភាគប្រចាំ',
      'ឆមាស១_និទ្ទេស',
      'ឆមាស២_ម.ភាគខែ',
      'ឆមាស២_ម.ភាគប្រឡង',
      'ឆមាស២_ម.ភាគប្រចាំ',
      'ឆមាស២_និទ្ទេស',
      'ប្រចាំឆ្នាំ_ប្រ.ឆមាស១',
      'ប្រចាំឆ្នាំ_ប្រ.ឆមាស២',
      'ប្រចាំឆ្នាំ_ម.ប្រចាំឆ្នាំ',
      'ប្រចាំឆ្នាំ_និទ្ទេស',
      'ស្ថានភាព',
    ];

    const rows = filteredStudents.map((st) => [
      st.no,
      `"${st.name}"`,
      st.gender,
      st.dob,
      st.gradeClass,
      `"${st.pob}"`,
      st.sem1MonthlyAvg ?? '',
      st.sem1ExamAvg ?? '',
      st.sem1Avg,
      st.sem1Grade ?? '',
      st.sem2MonthlyAvg ?? '',
      st.sem2ExamAvg ?? '',
      st.sem2Avg,
      st.sem2Grade ?? '',
      st.annualSem1 ?? '',
      st.annualSem2 ?? '',
      st.yearAvg,
      st.gradeLetter,
      st.status ?? '',
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `តារាងលទ្ធផលសិក្សាលម្អិត_${meta.schoolName}_${meta.academicYear}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-4">
      {/* Top Action Header */}
      <div className="no-print bg-white p-4 rounded-2xl border border-slate-200 shadow-2xs space-y-4">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xl">📑</span>
              <h2 className="text-base sm:text-lg font-bold text-slate-900">
                តារាងលទ្ធផលសិក្សាលម្អិត (Detailed Student Academic Results)
              </h2>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              គ្រប់គ្រងពិន្ទុសិស្សប្រចាំខែ ប្រឡង និងប្រចាំឆមាស ១-២ និងប្រចាំឆ្នាំតាមថ្នាក់ ស្របតាមក្បួនក្រសួង MoEYS
            </p>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Import Button */}
            <button
              id="btn-import-student-data"
              onClick={onOpenImportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5" />
              <span>នាំចូលទិន្នន័យ (Import)</span>
            </button>

            {/* Auto-Sync to School Reports */}
            <button
              id="btn-sync-to-school-reports"
              onClick={onSyncToSchoolReports}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-semibold shadow-2xs transition-colors cursor-pointer"
              title="គណនា និងបញ្ជូនស្ថិតិទៅកាន់តារាង១, តារាង២, តារាង៣, តារាង៤ និងផ្នែក B"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>គណនាបញ្ជូនទៅរបាយការណ៍ A, B & បូកសរុប</span>
            </button>

            {/* AI MOEYS Report Generator */}
            <button
              id="btn-moeys-ai-report"
              onClick={onOpenAiReportModal}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white rounded-xl text-xs font-bold shadow-2xs transition-all cursor-pointer"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>🤖 AI វិភាគបង្កើតរបាយការណ៍ MOEYS</span>
            </button>

            {/* Recalculate Formulas */}
            <button
              onClick={handleRecalculateAllFormulas}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-indigo-200 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 rounded-xl text-xs font-semibold transition-colors cursor-pointer shadow-xs"
              title="ដំណើរការគណនារូបមន្តស្វ័យប្រវត្តិឡើងវិញ (ម.ភាគប្រចាំ, និទ្ទេស, ស្ថានភាព)"
            >
              <Calculator className="w-3.5 h-3.5 text-indigo-600" />
              <span>គណនារូបមន្តស្វ័យប្រវត្តិ</span>
            </button>

            {/* Add student */}
            <button
              onClick={handleAddNewStudent}
              className="flex items-center gap-1.5 px-3 py-1.5 border border-slate-300 text-slate-700 hover:bg-slate-50 rounded-xl text-xs font-medium transition-colors cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5 text-blue-600" />
              <span>បន្ថែមសិស្ស</span>
            </button>

            {/* Sample Data Preset */}
            <button
              onClick={onLoadSampleData}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-amber-300 bg-amber-50 hover:bg-amber-100 text-amber-800 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              title="ផ្ទុកទិន្នន័យគំរូ ៧៦-៨០ ពីសំណើអ្នកប្រើប្រាស់"
            >
              <span>គំរូ ៧៦-៨០</span>
            </button>

            {/* Export CSV */}
            <button
              onClick={handleExportCsv}
              className="flex items-center gap-1.5 px-2.5 py-1.5 border border-slate-200 hover:bg-slate-50 text-slate-600 rounded-xl text-xs font-medium transition-colors cursor-pointer"
              title="ទាញយកឯកសារ CSV"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">CSV</span>
            </button>
          </div>
        </div>

        {/* Exact MoEYS Formulas Bar */}
        <div className="bg-gradient-to-r from-blue-50/90 via-indigo-50/70 to-purple-50/90 border border-blue-200/80 rounded-xl p-3 text-xs flex flex-wrap items-center justify-between gap-2.5 text-slate-700 shadow-xs">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[11px] font-bold bg-blue-600 text-white shadow-xs">
              📐 រូបមន្តស្វ័យប្រវត្តិ (Excel Formulas)
            </span>
            <span className="text-[11px] text-slate-600 hidden md:inline">
              ពេល Import ឬកែប្រែ ជួរទាំង ៣ នេះត្រូវបានគណនាស្វ័យប្រវត្តិតាមរូបមន្តក្រសួង៖
            </span>
          </div>
          <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
            <span className="bg-white/90 border border-cyan-300 px-2 py-0.5 rounded-md font-mono text-cyan-900">
              <strong>ម.ភាគប្រចាំ (I)</strong> = (ខែ + ប្រឡង) / ២
            </span>
            <span className="bg-white/90 border border-purple-300 px-2 py-0.5 rounded-md font-mono text-purple-900">
              <strong>និទ្ទេស (J)</strong> =IF(I&gt;=9,&quot;A&quot;,IF(I&gt;=8,&quot;B&quot;,IF(I&gt;=7,&quot;C&quot;,IF(I&gt;=6,&quot;D&quot;,IF(I&gt;=5,&quot;E&quot;,&quot;F&quot;)))))
            </span>
            <span className="bg-white/90 border border-emerald-300 px-2 py-0.5 rounded-md font-mono text-emerald-900">
              <strong>ស្ថានភាព (K)</strong> =IF(J=&quot;F&quot;,&quot;ត្រួតថ្នាក់&quot;,&quot;ឡើងថ្នាក់&quot;)
            </span>
            <span className="bg-white/90 border border-amber-300 px-2 py-0.5 rounded-md font-mono text-amber-900">
              <strong>ម.ប្រចាំឆ្នាំ</strong> = (ឆ១ + ឆ២) / ២
            </span>
          </div>
        </div>

        {/* KPI Mini Stats Bar */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 pt-1 text-xs">
          <div className="p-2.5 bg-blue-50/70 border border-blue-100 rounded-xl">
            <span className="text-[11px] text-blue-700 font-medium">សិស្សសរុប</span>
            <div className="text-base font-bold text-blue-900 mt-0.5">
              {toKhmerNum(stats.total)}{' '}
              <span className="text-[11px] font-normal text-blue-700">នាក់ (ស្រី {toKhmerNum(stats.female)})</span>
            </div>
          </div>

          <div className="p-2.5 bg-emerald-50/70 border border-emerald-100 rounded-xl">
            <span className="text-[11px] text-emerald-700 font-medium">ឡើងថ្នាក់</span>
            <div className="text-base font-bold text-emerald-900 mt-0.5">
              {toKhmerNum(stats.passed)}{' '}
              <span className="text-[11px] font-normal text-emerald-700">({toKhmerNum(stats.passRate)}%)</span>
            </div>
          </div>

          <div className="p-2.5 bg-amber-50/70 border border-amber-100 rounded-xl">
            <span className="text-[11px] text-amber-700 font-medium">ត្រួតថ្នាក់</span>
            <div className="text-base font-bold text-amber-900 mt-0.5">
              {toKhmerNum(stats.repeaters)}{' '}
              <span className="text-[11px] font-normal text-amber-700">នាក់</span>
            </div>
          </div>

          <div className="p-2.5 bg-rose-50/70 border border-rose-100 rounded-xl">
            <span className="text-[11px] text-rose-700 font-medium">បោះបង់ការសិក្សា</span>
            <div className="text-base font-bold text-rose-900 mt-0.5">
              {toKhmerNum(stats.dropouts)}{' '}
              <span className="text-[11px] font-normal text-rose-700">នាក់</span>
            </div>
          </div>

          <div className="p-2.5 bg-purple-50/70 border border-purple-100 rounded-xl">
            <span className="text-[11px] text-purple-700 font-medium">មធ្យមភាគរួម</span>
            <div className="text-base font-bold text-purple-900 mt-0.5">
              {toKhmerNum(stats.avgScore)}{' '}
              <span className="text-[11px] font-normal text-purple-700">/ 10</span>
            </div>
          </div>

          <div className="p-2.5 bg-slate-50 border border-slate-200 rounded-xl">
            <span className="text-[11px] text-slate-600 font-medium">ចំនួនថ្នាក់រៀន</span>
            <div className="text-base font-bold text-slate-800 mt-0.5">
              {toKhmerNum(availableClasses.length)}{' '}
              <span className="text-[11px] font-normal text-slate-500">ថ្នាក់</span>
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-2 pt-2 text-xs">
          {/* Class Filter */}
          <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1">
            <Filter className="w-3 h-3 text-slate-500" />
            <span className="text-slate-600 font-medium">ថ្នាក់ ៖</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-transparent font-bold text-blue-900 focus:outline-hidden cursor-pointer"
            >
              <option value="all">ទាំងអស់ ({students.length} នាក់)</option>
              {availableClasses.map((cls) => (
                <option key={cls} value={cls}>
                  ថ្នាក់ {cls} ({students.filter((s) => s.gradeClass === cls).length} នាក់)
                </option>
              ))}
            </select>
          </div>

          {/* Gender Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-slate-600 font-medium">ភេទ ៖</span>
            <select
              value={selectedGender}
              onChange={(e) => setSelectedGender(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">ទាំងអស់</option>
              <option value="ស្រី">ស្រី</option>
              <option value="ប្រុស">ប្រុស</option>
            </select>
          </div>

          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-50 border border-slate-200 rounded-lg px-2 py-1">
            <span className="text-slate-600 font-medium">ស្ថានភាព ៖</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="bg-transparent font-medium text-slate-800 focus:outline-hidden cursor-pointer"
            >
              <option value="all">ទាំងអស់</option>
              <option value="ឡើងថ្នាក់">ឡើងថ្នាក់</option>
              <option value="ត្រួតថ្នាក់">ត្រួតថ្នាក់</option>
              <option value="បោះបង់">បោះបង់</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="flex-1 min-w-[200px] relative">
            <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ស្វែងរកតាមឈ្មោះ, ល.រ ឬទីកន្លែងកំណើត..."
              className="w-full bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1 text-xs focus:outline-hidden focus:border-blue-400 focus:bg-white transition-all"
            />
          </div>

          {/* Result Count */}
          <div className="text-[11px] text-slate-500">
            បង្ហាញ <strong>{toKhmerNum(filteredStudents.length)}</strong> / {toKhmerNum(students.length)} នាក់
          </div>
        </div>
      </div>

      {/* Main Table Matching Image IMG_3830.jpeg exactly */}
      <div className="bg-white border border-slate-300 rounded-xl shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              {/* Row 1 Headers */}
              <tr className="border-b border-slate-300 text-center font-bold text-[11px]">
                <th rowSpan={2} className="p-2 border-r border-slate-300 bg-sky-100 text-sky-950 w-10">
                  ល.រ
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 bg-sky-100 text-sky-950 min-w-[140px] text-left">
                  នាមត្រកូល និងនាម
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 bg-sky-100 text-sky-950 w-12">
                  ភេទ
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 bg-sky-100 text-sky-950 w-24">
                  ថ្ងៃខែឆ្នាំកំណើត
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 bg-sky-100 text-sky-950 w-16">
                  ថ្នាក់
                </th>
                <th rowSpan={2} className="p-2 border-r border-slate-300 bg-sky-100 text-sky-950 min-w-[180px] text-left">
                  ទីកន្លែងកំណើត
                </th>

                {/* ឆមាស១ */}
                <th colSpan={4} className="p-1.5 border-r border-slate-300 bg-sky-200 text-sky-950">
                  ឆមាស១
                </th>

                {/* ឆមាស២ */}
                <th colSpan={4} className="p-1.5 border-r border-slate-300 bg-sky-300 text-sky-950">
                  ឆមាស២
                </th>

                {/* ប្រចាំឆ្នាំ */}
                <th colSpan={4} className="p-1.5 border-r border-slate-300 bg-amber-200 text-amber-950">
                  ប្រចាំឆ្នាំ
                </th>

                <th rowSpan={2} className="p-2 border-r border-slate-300 bg-slate-200 text-slate-800 w-20">
                  ស្ថានភាព
                </th>
                <th rowSpan={2} className="p-2 bg-slate-200 text-slate-800 w-12 no-print">
                  សកម្មភាព
                </th>
              </tr>

              {/* Row 2 Sub-Headers */}
              <tr className="border-b border-slate-300 text-center text-[10px] font-semibold">
                {/* ឆមាស១ Sub-headers */}
                <th className="p-1.5 border-r border-slate-300 bg-amber-100 text-amber-900 w-14">ម.ភាគខែ</th>
                <th className="p-1.5 border-r border-slate-300 bg-emerald-100 text-emerald-900 w-14">ម.ភាគប្រឡង</th>
                <th className="p-1.5 border-r border-slate-300 bg-cyan-100 text-cyan-900 font-bold w-14">ម.ភាគប្រចាំ</th>
                <th className="p-1.5 border-r border-slate-300 bg-purple-100 text-purple-900 font-bold w-12">និទ្ទេស</th>

                {/* ឆមាស២ Sub-headers */}
                <th className="p-1.5 border-r border-slate-300 bg-amber-100 text-amber-900 w-14">ម.ភាគខែ</th>
                <th className="p-1.5 border-r border-slate-300 bg-emerald-100 text-emerald-900 w-14">ម.ភាគប្រឡង</th>
                <th className="p-1.5 border-r border-slate-300 bg-cyan-100 text-cyan-900 font-bold w-14">ម.ភាគប្រចាំ</th>
                <th className="p-1.5 border-r border-slate-300 bg-purple-100 text-purple-900 font-bold w-12">និទ្ទេស</th>

                {/* ប្រចាំឆ្នាំ Sub-headers */}
                <th className="p-1.5 border-r border-slate-300 bg-cyan-50 text-cyan-950 w-14">ប្រ.ឆមាស១</th>
                <th className="p-1.5 border-r border-slate-300 bg-blue-50 text-blue-950 w-14">ប្រ.ឆមាស២</th>
                <th className="p-1.5 border-r border-slate-300 bg-amber-100 text-rose-700 font-extrabold w-14">ម.ប្រចាំឆ្នាំ</th>
                <th className="p-1.5 border-r border-slate-300 bg-amber-100 text-rose-700 font-extrabold w-12">និទ្ទេស</th>
              </tr>
            </thead>

            <tbody>
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={20} className="p-8 text-center text-slate-500">
                    <AlertCircle className="w-6 h-6 mx-auto text-slate-400 mb-1.5" />
                    <p className="font-semibold">មិនមានទិន្នន័យសិស្សត្រូវនឹងលក្ខខណ្ឌស្វែងរកទេ</p>
                    <p className="text-[11px] text-slate-400 mt-1">
                      ចុច &quot;នាំចូលទិន្នន័យ (Import)&quot; ឬ &quot;គំរូ ៧៦-៨០&quot; ដើម្បីផ្ទុកទិន្នន័យ
                    </p>
                  </td>
                </tr>
              ) : (
                filteredStudents.map((st, idx) => {
                  const isDropped = st.isDropped || st.status === 'បោះបង់';
                  return (
                    <tr
                      key={st.id}
                      className={`border-b border-slate-200 hover:bg-blue-50/40 transition-colors ${
                        isDropped ? 'bg-rose-50/40 text-rose-700' : idx % 2 === 1 ? 'bg-slate-50/50' : 'bg-white'
                      }`}
                    >
                      {/* ល.រ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono font-medium text-slate-700">
                        {toKhmerNum(st.no)}
                      </td>

                      {/* នាមត្រកូល និងនាម */}
                      <td className="p-1.5 border-r border-slate-200 font-medium">
                        <input
                          type="text"
                          value={st.name}
                          onChange={(e) => handleStudentFieldChange(st.id, 'name', e.target.value)}
                          className="w-full bg-transparent focus:bg-white border-transparent focus:border-blue-300 focus:outline-hidden rounded px-1 py-0.5 text-xs font-semibold text-slate-900"
                        />
                      </td>

                      {/* ភេទ */}
                      <td className="p-1.5 border-r border-slate-200 text-center">
                        <select
                          value={st.gender}
                          onChange={(e) => handleStudentFieldChange(st.id, 'gender', e.target.value)}
                          className="bg-transparent font-medium text-xs focus:outline-hidden cursor-pointer"
                        >
                          <option value="ស្រី">ស្រី</option>
                          <option value="ប្រុស">ប្រុស</option>
                        </select>
                      </td>

                      {/* ថ្ងៃខែឆ្នាំកំណើត */}
                      <td className="p-1.5 border-r border-slate-200 text-center text-[11px]">
                        <input
                          type="text"
                          value={st.dob}
                          onChange={(e) => handleStudentFieldChange(st.id, 'dob', e.target.value)}
                          className="w-full bg-transparent focus:bg-white text-center border-transparent focus:border-blue-300 focus:outline-hidden rounded px-0.5 py-0.5 text-[11px]"
                        />
                      </td>

                      {/* ថ្នាក់ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold text-blue-900">
                        <input
                          type="text"
                          value={st.gradeClass || '1-A'}
                          onChange={(e) => handleStudentFieldChange(st.id, 'gradeClass', e.target.value)}
                          className="w-full bg-transparent focus:bg-white text-center font-bold text-blue-900 border-transparent focus:border-blue-300 focus:outline-hidden rounded px-0.5 py-0.5 text-xs"
                        />
                      </td>

                      {/* ទីកន្លែងកំណើត */}
                      <td className="p-1.5 border-r border-slate-200 text-[11px] text-slate-600">
                        <input
                          type="text"
                          value={st.pob}
                          onChange={(e) => handleStudentFieldChange(st.id, 'pob', e.target.value)}
                          className="w-full bg-transparent focus:bg-white border-transparent focus:border-blue-300 focus:outline-hidden rounded px-1 py-0.5 text-[11px] text-slate-700 truncate"
                        />
                      </td>

                      {/* ឆមាស១: ម.ភាគខែ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-amber-50/30">
                        <input
                          type="number"
                          step="0.01"
                          value={st.sem1MonthlyAvg ?? ''}
                          onChange={(e) => handleStudentFieldChange(st.id, 'sem1MonthlyAvg', e.target.value)}
                          className="w-12 text-center bg-transparent focus:bg-white border-transparent focus:border-amber-300 rounded text-xs"
                        />
                      </td>

                      {/* ឆមាស១: ម.ភាគប្រឡង */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-emerald-50/30">
                        <input
                          type="number"
                          step="0.01"
                          value={st.sem1ExamAvg ?? ''}
                          onChange={(e) => handleStudentFieldChange(st.id, 'sem1ExamAvg', e.target.value)}
                          className="w-12 text-center bg-transparent focus:bg-white border-transparent focus:border-emerald-300 rounded text-xs"
                        />
                      </td>

                      {/* ឆមាស១: ម.ភាគប្រចាំ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold bg-cyan-50 text-cyan-950">
                        {toKhmerNum((st.sem1Avg || 0).toFixed(2))}
                      </td>

                      {/* ឆមាស១: និទ្ទេស */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold text-purple-900 bg-purple-50/40">
                        {st.sem1Grade || computeMoEYSGradeLetter(st.sem1Avg || 0)}
                      </td>

                      {/* ឆមាស២: ម.ភាគខែ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-amber-50/30">
                        <input
                          type="number"
                          step="0.01"
                          value={st.sem2MonthlyAvg ?? ''}
                          onChange={(e) => handleStudentFieldChange(st.id, 'sem2MonthlyAvg', e.target.value)}
                          className="w-12 text-center bg-transparent focus:bg-white border-transparent focus:border-amber-300 rounded text-xs"
                        />
                      </td>

                      {/* ឆមាស២: ម.ភាគប្រឡង */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-emerald-50/30">
                        <input
                          type="number"
                          step="0.01"
                          value={st.sem2ExamAvg ?? ''}
                          onChange={(e) => handleStudentFieldChange(st.id, 'sem2ExamAvg', e.target.value)}
                          className="w-12 text-center bg-transparent focus:bg-white border-transparent focus:border-emerald-300 rounded text-xs"
                        />
                      </td>

                      {/* ឆមាស២: ម.ភាគប្រចាំ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono font-bold bg-cyan-50 text-cyan-950">
                        {toKhmerNum((st.sem2Avg || 0).toFixed(2))}
                      </td>

                      {/* ឆមាស២: និទ្ទេស */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold text-purple-900 bg-purple-50/40">
                        {st.sem2Grade || computeMoEYSGradeLetter(st.sem2Avg || 0)}
                      </td>

                      {/* ប្រចាំឆ្នាំ: ប្រ.ឆមាស១ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-cyan-50/40">
                        {toKhmerNum((st.annualSem1 ?? st.sem1Avg ?? 0).toFixed(2))}
                      </td>

                      {/* ប្រចាំឆ្នាំ: ប្រ.ឆមាស២ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono bg-blue-50/40">
                        {toKhmerNum((st.annualSem2 ?? st.sem2Avg ?? 0).toFixed(2))}
                      </td>

                      {/* ប្រចាំឆ្នាំ: ម.ប្រចាំឆ្នាំ */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-mono font-extrabold bg-amber-100/70 text-rose-700">
                        {toKhmerNum((st.yearAvg || 0).toFixed(2))}
                      </td>

                      {/* ប្រចាំឆ្នាំ: និទ្ទេស */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-extrabold text-rose-700 bg-amber-100/70">
                        <span
                          className={`inline-block px-1.5 py-0.5 rounded text-[11px] font-bold ${
                            st.gradeLetter === 'A'
                              ? 'bg-emerald-100 text-emerald-800'
                              : st.gradeLetter === 'B'
                              ? 'bg-blue-100 text-blue-800'
                              : st.gradeLetter === 'C'
                              ? 'bg-indigo-100 text-indigo-800'
                              : st.gradeLetter === 'D'
                              ? 'bg-amber-100 text-amber-800'
                              : 'bg-rose-100 text-rose-800'
                          }`}
                        >
                          {st.gradeLetter || computeMoEYSGradeLetter(st.yearAvg || 0)}
                        </span>
                      </td>

                      {/* ស្ថានភាព */}
                      <td className="p-1.5 border-r border-slate-200 text-center font-bold text-xs">
                        <select
                          value={st.status || ((st.yearAvg || 0) >= 5.0 ? 'ឡើងថ្នាក់' : 'ត្រួតថ្នាក់')}
                          onChange={(e) => handleStudentFieldChange(st.id, 'status', e.target.value)}
                          className={`bg-transparent font-bold text-[11px] focus:outline-hidden cursor-pointer ${
                            st.status === 'ឡើងថ្នាក់'
                              ? 'text-emerald-700'
                              : st.status === 'បោះបង់'
                              ? 'text-rose-700 line-through'
                              : 'text-amber-800'
                          }`}
                        >
                          <option value="ឡើងថ្នាក់">ឡើងថ្នាក់</option>
                          <option value="ត្រួតថ្នាក់">ត្រួតថ្នាក់</option>
                          <option value="បោះបង់">បោះបង់</option>
                        </select>
                      </td>

                      {/* សកម្មភាព */}
                      <td className="p-1.5 text-center no-print">
                        <button
                          onClick={() => handleDeleteStudent(st.id)}
                          className="text-slate-400 hover:text-rose-600 p-1 rounded-md transition-colors cursor-pointer"
                          title="លុបសិស្ស"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
