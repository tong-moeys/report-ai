import React, { useState, useMemo } from 'react';
import { FailedStudentRecord, SchoolMeta, ClassGradebook, StudentScoreRow } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import { formatKhmerSolarDate, DEFAULT_OFFICIAL_LUNAR_DATE } from '../utils/khmerDate';
import {
  UserPlus,
  Printer,
  Download,
  Search,
  Filter,
  RefreshCw,
  Edit2,
  Trash2,
  AlertTriangle,
  Check,
  X,
  GraduationCap,
  Layers,
} from 'lucide-react';

interface Props {
  students: FailedStudentRecord[];
  onChange: (students: FailedStudentRecord[]) => void;
  meta: SchoolMeta;
  gradebooks?: ClassGradebook[];
  detailedStudents?: StudentScoreRow[];
}

export const TableFailedStudentsNominalRoll: React.FC<Props> = ({
  students,
  onChange,
  meta,
  gradebooks = [],
  detailedStudents = [],
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [rangeFilter, setRangeFilter] = useState<'all' | 'sub4' | 'under4'>('all');
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [genderFilter, setGenderFilter] = useState<'all' | 'female' | 'male'>('all');
  
  // Modal states for adding or editing
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState<FailedStudentRecord | null>(null);

  // Form states
  const [formData, setFormData] = useState<Omit<FailedStudentRecord, 'id'>>({
    gradeClass: 'ថ្នាក់ទី 1A',
    name: '',
    gender: 'ប្រុស',
    dob: '',
    sem1Avg: 4.5,
    sem2Avg: 4.5,
    yearAvg: 4.5,
    remarks: 'ត្រៀមប្រឡងសង (ម.ភាគ ៤.០០-៤.៩៩)',
  });

  // Calculate high-level statistics across all failed students
  const stats = useMemo(() => {
    const total = students.length;
    const female = students.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length;
    const sub4To5 = students.filter((s) => s.yearAvg >= 4.0 && s.yearAvg < 5.0);
    const sub4To5Female = sub4To5.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length;
    const under4 = students.filter((s) => s.yearAvg < 4.0);
    const under4Female = under4.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length;

    // Unique classes
    const classes = Array.from(new Set(students.map((s) => s.gradeClass).filter(Boolean)));

    return {
      total,
      female,
      sub4To5Count: sub4To5.length,
      sub4To5Female,
      under4Count: under4.length,
      under4Female,
      classesCount: classes.length,
      allClasses: classes.sort(),
    };
  }, [students]);

  // Available classes for dropdown
  const classOptions = useMemo(() => {
    const fromList = stats.allClasses;
    const fromGradebooks = gradebooks.map((g) => g.gradeName);
    const set = new Set([...fromList, ...fromGradebooks, 'ថ្នាក់ទី 1A', 'ថ្នាក់ទី 2A', 'ថ្នាក់ទី 2B', 'ថ្នាក់ទី 3A', 'ថ្នាក់ទី 3B', 'ថ្នាក់ទី 4A', 'ថ្នាក់ទី 4B', 'ថ្នាក់ទី 5A', 'ថ្នាក់ទី 5B', 'ថ្នាក់ទី 6A']);
    return Array.from(set).sort();
  }, [stats.allClasses, gradebooks]);

  // Filtered student list
  const filteredStudents = useMemo(() => {
    return students.filter((s) => {
      // Range filter: 0-4.99 total, 4.00-4.99 sub, 0.00-3.99 under
      if (rangeFilter === 'sub4' && (s.yearAvg < 4.0 || s.yearAvg >= 5.0)) return false;
      if (rangeFilter === 'under4' && s.yearAvg >= 4.0) return false;

      // Class filter
      if (selectedClass !== 'all' && s.gradeClass !== selectedClass) return false;

      // Gender filter
      const isF = s.gender === 'ស្រី' || s.gender === 'ស';
      if (genderFilter === 'female' && !isF) return false;
      if (genderFilter === 'male' && isF) return false;

      // Search term
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = s.name.toLowerCase().includes(query);
        const matchClass = s.gradeClass.toLowerCase().includes(query);
        const matchRemarks = (s.remarks || '').toLowerCase().includes(query);
        if (!matchName && !matchClass && !matchRemarks) return false;
      }

      return true;
    });
  }, [students, rangeFilter, selectedClass, genderFilter, searchTerm]);

  // Handler: Open Add Modal
  const handleOpenAddModal = () => {
    setEditingStudent(null);
    setFormData({
      gradeClass: classOptions[0] || 'ថ្នាក់ទី 1A',
      name: '',
      gender: 'ប្រុស',
      dob: '',
      sem1Avg: 4.5,
      sem2Avg: 4.5,
      yearAvg: 4.5,
      remarks: 'ត្រៀមប្រឡងសង (ម.ភាគ ៤.០០-៤.៩៩)',
    });
    setIsModalOpen(true);
  };

  // Handler: Open Edit Modal
  const handleOpenEditModal = (student: FailedStudentRecord) => {
    setEditingStudent(student);
    setFormData({
      gradeClass: student.gradeClass,
      name: student.name,
      gender: student.gender,
      dob: student.dob,
      sem1Avg: student.sem1Avg,
      sem2Avg: student.sem2Avg,
      yearAvg: student.yearAvg,
      remarks: student.remarks,
    });
    setIsModalOpen(true);
  };

  // Auto calculate yearAvg when sem1Avg or sem2Avg changes in form
  const handleSemScoreChange = (field: 'sem1Avg' | 'sem2Avg', val: number) => {
    const num = isNaN(val) ? 0 : Number(val);
    const newSem1 = field === 'sem1Avg' ? num : formData.sem1Avg;
    const newSem2 = field === 'sem2Avg' ? num : formData.sem2Avg;
    const computedYear = Number(((newSem1 + newSem2) / 2).toFixed(2));
    
    // Suggest remark based on average
    let suggestedRemark = formData.remarks;
    if (computedYear >= 4.0 && computedYear < 5.0) {
      suggestedRemark = 'ត្រៀមប្រឡងសង (ម.ភាគ ៤.០០-៤.៩៩)';
    } else if (computedYear < 4.0) {
      suggestedRemark = 'ត្រួតថ្នាក់ (ម.ភាគ < ៤.០០)';
    }

    setFormData((prev) => ({
      ...prev,
      [field]: num,
      yearAvg: computedYear,
      remarks: suggestedRemark,
    }));
  };

  // Save student (add or update)
  const handleSaveStudent = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    if (editingStudent) {
      // Update existing
      const updated = students.map((s) =>
        s.id === editingStudent.id
          ? {
              ...s,
              ...formData,
            }
          : s
      );
      onChange(updated);
    } else {
      // Create new
      const newRecord: FailedStudentRecord = {
        id: `fail-${Date.now()}`,
        no: students.length + 1,
        ...formData,
      };
      onChange([...students, newRecord]);
    }

    setIsModalOpen(false);
  };

  // Delete student
  const handleDeleteStudent = (id: string, name: string) => {
    if (window.confirm(`តើអ្នកពិតជាចង់លុបឈ្មោះសិស្ស «${name}» ចេញពីបញ្ជីសិស្សធ្លាក់មែនទេ?`)) {
      onChange(students.filter((s) => s.id !== id));
    }
  };

  // Sync / Scan all failed students from Gradebooks and Detailed Students
  const handleSyncFromGradebooks = () => {
    const found: FailedStudentRecord[] = [];
    const seenNames = new Set<string>();

    // 1. Scan from gradebooks
    gradebooks.forEach((gb) => {
      gb.students.forEach((st) => {
        const yAvg = st.yearAvg ?? ((st.sem1Avg + st.sem2Avg) / 2);
        if (yAvg < 5.0 && st.name) {
          const key = `${st.name}-${gb.gradeName}`;
          if (!seenNames.has(key)) {
            seenNames.add(key);
            found.push({
              id: `gb-fail-${st.id || Math.random()}`,
              gradeClass: gb.gradeName,
              name: st.name,
              gender: (st.gender === 'ស' || st.gender === 'ស្រី') ? 'ស្រី' : 'ប្រុស',
              dob: st.dob || '',
              sem1Avg: st.sem1Avg || 0,
              sem2Avg: st.sem2Avg || 0,
              yearAvg: Number(yAvg.toFixed(2)),
              remarks:
                yAvg >= 4.0
                  ? 'ត្រៀមប្រឡងសង (ម.ភាគ ៤.០០-៤.៩៩)'
                  : 'ត្រួតថ្នាក់ (ម.ភាគ < ៤.០០)',
            });
          }
        }
      });
    });

    // 2. Scan from detailedStudents
    detailedStudents.forEach((st) => {
      const yAvg = st.yearAvg ?? ((st.sem1Avg + st.sem2Avg) / 2);
      if (yAvg < 5.0 && st.name) {
        const gName = st.gradeClass?.startsWith('ថ្នាក់ទី')
          ? st.gradeClass
          : `ថ្នាក់ទី ${st.gradeClass || '1A'}`;
        const key = `${st.name}-${gName}`;
        if (!seenNames.has(key)) {
          seenNames.add(key);
          found.push({
            id: `dt-fail-${st.id || Math.random()}`,
            gradeClass: gName,
            name: st.name,
            gender: (st.gender === 'ស' || st.gender === 'ស្រី') ? 'ស្រី' : 'ប្រុស',
            dob: st.dob || '',
            sem1Avg: st.sem1Avg || 0,
            sem2Avg: st.sem2Avg || 0,
            yearAvg: Number(yAvg.toFixed(2)),
            remarks:
              yAvg >= 4.0
                ? 'ត្រៀមប្រឡងសង (ម.ភាគ ៤.០០-៤.៩៩)'
                : 'ត្រួតថ្នាក់ (ម.ភាគ < ៤.០០)',
          });
        }
      }
    });

    if (found.length === 0) {
      alert('ពុំមានសិស្សធ្លាក់មធ្យមភាគ (< ៥.០០) បន្ថែមនៅក្នុងសៀវភៅចំណាត់ថ្នាក់ឡើយ។');
      return;
    }

    // Merge without duplicates based on name and class
    const existingKeys = new Set(students.map((s) => `${s.name}-${s.gradeClass}`));
    const newItems = found.filter((item) => !existingKeys.has(`${item.name}-${item.gradeClass}`));

    if (newItems.length === 0) {
      alert('ទិន្នន័យសិស្សធ្លាក់ទាំងអស់ត្រូវបានធ្វើសមកាលកម្មរួចជាស្រេចហើយ។');
      return;
    }

    onChange([...students, ...newItems]);
    alert(`បានស្កេន និងទាញយកសិស្សធ្លាក់ចំនួន ${toKhmerNum(newItems.length)} នាក់បន្ថែមដោយជោគជ័យ!`);
  };

  // Export to CSV / Excel
  const handleExportCSV = () => {
    const headers = ['ល.រ', 'ថ្នាក់', 'គោត្តនាម និងនាម', 'ភេទ', 'ថ្ងៃខែឆ្នាំកំណើត', 'មធ្យមភាគឆមាស១', 'មធ្យមភាគឆមាស២', 'មធ្យមភាគដំណាច់ឆ្នាំ', 'សេចក្ដីបញ្ជាក់'];
    const rows = filteredStudents.map((s, idx) => [
      idx + 1,
      `"${s.gradeClass}"`,
      `"${s.name}"`,
      `"${s.gender}"`,
      `"${s.dob}"`,
      s.sem1Avg.toFixed(2),
      s.sem2Avg.toFixed(2),
      s.yearAvg.toFixed(2),
      `"${s.remarks}"`,
    ]);

    const csvContent = '\uFEFF' + [headers.join(','), ...rows.map((r) => r.join(','))].join('\r\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `បញ្ជីសិស្សធ្លាក់មធ្យមភាគ_${meta.schoolName || 'សាលា'}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div id="section-failed-students-roll" className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden print:border-none print:shadow-none">
      {/* Header Banner */}
      <div className="px-5 py-4 bg-gradient-to-r from-amber-50/80 via-orange-50/60 to-rose-50/80 border-b border-amber-200/80 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="w-9 h-9 rounded-xl bg-amber-500 text-white flex items-center justify-center font-bold text-sm shadow-xs shrink-0 mt-0.5">
            <AlertTriangle className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-amber-100 text-amber-900 border border-amber-300">
                ផ្នែក A • តារាងលទ្ធផលសិក្សាចុងឆ្នាំ
              </span>
              <span className="text-xs font-semibold text-rose-700 bg-rose-50 px-2 py-0.5 rounded-md border border-rose-200">
                មធ្យមភាគ ០.០០ - ៤.៩៩
              </span>
            </div>
            <h2 className="text-base sm:text-lg font-bold text-slate-900 mt-1">
              តារាងបញ្ជីរាយនាមសិស្សធ្លាក់មធ្យមភាគ ០.០០-៤.៩៩ (និង ៤.០០-៤.៩៩) ដំណាច់ឆ្នាំ
            </h2>
            <p className="text-xs text-slate-600 mt-0.5">
              បញ្ជីឈ្មោះលម្អិតសិស្សធ្លាក់មធ្យមភាគ ឆមាស១, ឆមាស២, ដំណាច់ឆ្នាំ និងសេចក្ដីបញ្ជាក់ សម្រាប់ត្រៀមការប្រឡងសង ឬត្រួតថ្នាក់
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="no-print flex items-center gap-2">
          <button
            id="btn-sync-failed-gradebooks"
            onClick={handleSyncFromGradebooks}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-50 text-slate-700 border border-slate-300 rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            title="ទាញយកសិស្សធ្លាក់ដោយស្វ័យប្រវត្តិពីសៀវភៅចំណាត់ថ្នាក់"
          >
            <RefreshCw className="w-3.5 h-3.5 text-blue-600" />
            <span>ទាញពីសៀវភៅចំណាត់ថ្នាក់</span>
          </button>

          <button
            id="btn-add-failed-student"
            onClick={handleOpenAddModal}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>+ បន្ថែមសិស្ស</span>
          </button>

          <button
            id="btn-export-failed-csv"
            onClick={handleExportCSV}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            title="ទាញយកជាឯកសារ Excel (CSV)"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Excel</span>
          </button>

          <button
            id="btn-print-failed-list"
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-800 hover:bg-slate-900 text-white rounded-lg text-xs font-medium transition-colors shadow-2xs cursor-pointer"
            title="បោះពុម្ពតារាងនេះ"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {/* Official Khmer Header on Print Only */}
      <div className="hidden print:block text-center pt-4 pb-2 border-b border-slate-300">
        <div className="font-moul text-xs text-slate-800">ព្រះរាជាណាចក្រកម្ពុជា</div>
        <div className="font-moul text-[11px] text-amber-700">ជាតិ សាសនា ព្រះមហាក្សត្រ</div>
        <div className="text-[9px] text-slate-400">~~~ ✤ ~~~</div>
        <div className="mt-2 text-xs font-semibold text-slate-600">
          {meta.province} • {meta.clusterOrDistrict} • {meta.schoolName}
        </div>
        <h3 className="font-bold text-sm text-slate-900 mt-1">
          បញ្ជីរាយនាមសិស្សធ្លាក់មធ្យមភាគ ០.០០ - ៤.៩៩ (និង ៤.០០ - ៤.៩៩) ចុងឆ្នាំ
        </h3>
        <p className="text-[11px] text-slate-500">
          ឆ្នាំសិក្សា {meta.academicYear} | កាលបរិច្ឆេទ ៖ {formatKhmerSolarDate(meta.reportDate, meta.clusterOrDistrict || 'ភ្នំស្រុក')}
        </p>
      </div>

      {/* KPI Statistic Cards (Summary) */}
      <div className="p-4 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/50 border-b border-slate-200">
        {/* Total Failed 0.00-4.99 */}
        <div className="p-3 bg-white border border-amber-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-slate-600">ធ្លាក់សរុប (០-៤.៩៩)</span>
            <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-800 text-[10px] font-bold flex items-center justify-center">
              ∑
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-amber-900">{toKhmerNum(stats.total)}</span>
            <span className="text-xs text-slate-500">នាក់ (ស្រី {toKhmerNum(stats.female)})</span>
          </div>
          <div className="text-[11px] text-amber-700 mt-0.5">
            ស្មើជួរ ៧ & ៩ ក្នុងតារាងទី២
          </div>
        </div>

        {/* Sub-range: 4.00 - 4.99 */}
        <div className="p-3 bg-white border border-orange-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-orange-900">ធ្លាក់ (៤.០០ - ៤.៩៩)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-orange-100 text-orange-800">
              តេស្តសង
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-orange-700">{toKhmerNum(stats.sub4To5Count)}</span>
            <span className="text-xs text-slate-500">នាក់ (ស្រី {toKhmerNum(stats.sub4To5Female)})</span>
          </div>
          <div className="text-[11px] text-orange-600 mt-0.5">
            ស្មើជួរ ១១ & ១៣ ក្នុងតារាងទី២
          </div>
        </div>

        {/* Severe deficit: 0.00 - 3.99 */}
        <div className="p-3 bg-white border border-rose-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-rose-900">ធ្លាក់ (០.០០ - ៣.៩៩)</span>
            <span className="px-1.5 py-0.2 rounded text-[10px] font-bold bg-rose-100 text-rose-800">
              ត្រួតថ្នាក់
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-rose-700">{toKhmerNum(stats.under4Count)}</span>
            <span className="text-xs text-slate-500">នាក់ (ស្រី {toKhmerNum(stats.under4Female)})</span>
          </div>
          <div className="text-[11px] text-rose-600 mt-0.5">
            ត្រូវត្រួតថ្នាក់ឆ្នាំក្រោយ
          </div>
        </div>

        {/* Impacted Classes */}
        <div className="p-3 bg-white border border-blue-200 rounded-xl shadow-2xs">
          <div className="flex items-center justify-between">
            <span className="text-xs font-medium text-blue-900">ចំនួនថ្នាក់មានសិស្សធ្លាក់</span>
            <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-800 text-[10px] font-bold flex items-center justify-center">
              🏫
            </span>
          </div>
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-xl font-bold text-blue-800">{toKhmerNum(stats.classesCount)}</span>
            <span className="text-xs text-slate-500">ថ្នាក់</span>
          </div>
          <div className="text-[11px] text-blue-600 mt-0.5 truncate">
            {stats.allClasses.slice(0, 3).join(', ')}{stats.allClasses.length > 3 ? '...' : ''}
          </div>
        </div>
      </div>

      {/* Filter and Search Bar (No Print) */}
      <div className="no-print p-3 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3 text-xs">
        {/* Category Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto">
          <button
            onClick={() => setRangeFilter('all')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              rangeFilter === 'all'
                ? 'bg-slate-900 text-white shadow-2xs'
                : 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-100'
            }`}
          >
            ធ្លាក់ទាំងអស់ (០-៤.៩៩) ({toKhmerNum(stats.total)})
          </button>
          <button
            onClick={() => setRangeFilter('sub4')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              rangeFilter === 'sub4'
                ? 'bg-orange-600 text-white shadow-2xs'
                : 'bg-white text-orange-800 border border-orange-300 hover:bg-orange-50'
            }`}
          >
            ក្រុម ៤.០០ - ៤.៩៩ ({toKhmerNum(stats.sub4To5Count)})
          </button>
          <button
            onClick={() => setRangeFilter('under4')}
            className={`px-3 py-1 rounded-lg font-medium transition-colors cursor-pointer whitespace-nowrap ${
              rangeFilter === 'under4'
                ? 'bg-rose-600 text-white shadow-2xs'
                : 'bg-white text-rose-800 border border-rose-300 hover:bg-rose-50'
            }`}
          >
            ក្រុម &lt; ៤.០០ ({toKhmerNum(stats.under4Count)})
          </button>
        </div>

        {/* Right filters: Class, Gender, Search */}
        <div className="flex flex-wrap items-center gap-2 ml-auto">
          {/* Class Select */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">ថ្នាក់:</span>
            <select
              value={selectedClass}
              onChange={(e) => setSelectedClass(e.target.value)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 outline-hidden"
            >
              <option value="all">ទាំងអស់</option>
              {classOptions.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
          </div>

          {/* Gender Select */}
          <div className="flex items-center gap-1">
            <span className="text-slate-500 font-medium">ភេទ:</span>
            <select
              value={genderFilter}
              onChange={(e) => setGenderFilter(e.target.value as any)}
              className="bg-white border border-slate-300 rounded-lg px-2 py-1 text-xs text-slate-800 outline-hidden"
            >
              <option value="all">ទាំងអស់</option>
              <option value="female">ស្រី</option>
              <option value="male">ប្រុស</option>
            </select>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2" />
            <input
              type="text"
              placeholder="ស្វែងរកឈ្មោះ..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-8 pr-3 py-1 bg-white border border-slate-300 rounded-lg text-xs outline-hidden w-36 sm:w-44 focus:border-amber-500 focus:ring-1 focus:ring-amber-500"
            />
            {searchTerm && (
              <button
                onClick={() => setSearchTerm('')}
                className="absolute right-2 top-1.5 text-slate-400 hover:text-slate-600"
              >
                <X className="w-3 h-3" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table */}
      <div className="overflow-x-auto table-scrollbar p-3">
        <table className="w-full border-collapse border border-slate-400 text-center text-xs sm:text-sm">
          <thead>
            {/* Header Row 1 */}
            <tr className="bg-slate-100 text-slate-800 font-bold">
              <th rowSpan={2} className="border border-slate-400 p-2 w-12">
                ល.រ
              </th>
              <th rowSpan={2} className="border border-slate-400 p-2 min-w-[90px]">
                ថ្នាក់
              </th>
              <th rowSpan={2} className="border border-slate-400 p-2 min-w-[160px] text-left pl-3">
                គោត្តនាម-នាម
              </th>
              <th rowSpan={2} className="border border-slate-400 p-2 w-14">
                ភេទ
              </th>
              <th rowSpan={2} className="border border-slate-400 p-2 min-w-[110px]">
                ថ្ងៃខែឆ្នាំកំណើត
              </th>
              <th colSpan={3} className="border border-slate-400 py-1.5 px-2 bg-amber-50 text-amber-950 font-bold">
                មធ្យមភាគ ទាំង៣
              </th>
              <th rowSpan={2} className="border border-slate-400 p-2 min-w-[180px]">
                សេចក្ដីបញ្ជាក់
              </th>
              <th rowSpan={2} className="no-print border border-slate-400 p-2 w-20">
                សកម្មភាព
              </th>
            </tr>

            {/* Header Row 2: Breakdown of the 3 averages */}
            <tr className="bg-amber-50/60 text-slate-800 font-semibold text-xs">
              <th className="border border-slate-400 px-2 py-1 min-w-[70px] bg-blue-50/70 text-blue-900">
                ឆមាស១
              </th>
              <th className="border border-slate-400 px-2 py-1 min-w-[70px] bg-indigo-50/70 text-indigo-900">
                ឆមាស២
              </th>
              <th className="border border-slate-400 px-2 py-1 min-w-[80px] bg-amber-100/80 text-amber-900 font-bold">
                ដំណាច់ឆ្នាំ
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredStudents.length === 0 ? (
              <tr>
                <td colSpan={10} className="p-8 text-center text-slate-500 bg-slate-50/50">
                  <div className="flex flex-col items-center justify-center gap-2">
                    <GraduationCap className="w-8 h-8 text-slate-300" />
                    <p className="text-sm font-medium">ពុំមានទិន្នន័យសិស្សធ្លាក់ត្រូវនឹងលក្ខខណ្ឌចម្រាញ់នេះឡើយ</p>
                    <button
                      onClick={handleOpenAddModal}
                      className="mt-2 text-xs font-semibold text-amber-700 bg-amber-50 hover:bg-amber-100 border border-amber-300 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      + ចុចទីនេះដើម្បីបន្ថែមសិស្សថ្មី
                    </button>
                  </div>
                </td>
              </tr>
            ) : (
              filteredStudents.map((s, idx) => {
                const isFemale = s.gender === 'ស្រី' || s.gender === 'ស';
                const isSub4To5 = s.yearAvg >= 4.0 && s.yearAvg < 5.0;
                const isUnder4 = s.yearAvg < 4.0;

                return (
                  <tr
                    key={s.id}
                    className={`hover:bg-slate-50/90 transition-colors ${
                      idx % 2 === 1 ? 'bg-slate-50/40' : 'bg-white'
                    }`}
                  >
                    {/* 1. No */}
                    <td className="border border-slate-400 py-2 px-1 text-slate-600 font-medium">
                      {toKhmerNum(idx + 1)}
                    </td>

                    {/* 2. Grade/Class */}
                    <td className="border border-slate-400 py-2 px-2 font-semibold text-slate-800">
                      <span className="inline-block px-2 py-0.5 bg-slate-100 text-slate-800 rounded border border-slate-200 text-xs">
                        {s.gradeClass}
                      </span>
                    </td>

                    {/* 3. Full Name */}
                    <td className="border border-slate-400 py-2 px-3 text-left font-bold text-slate-900">
                      {s.name}
                    </td>

                    {/* 4. Gender */}
                    <td
                      className={`border border-slate-400 py-2 px-1 font-semibold ${
                        isFemale ? 'text-pink-600' : 'text-blue-600'
                      }`}
                    >
                      {s.gender}
                    </td>

                    {/* 5. Date of Birth */}
                    <td className="border border-slate-400 py-2 px-2 text-slate-700 font-medium text-xs">
                      {s.dob || '—'}
                    </td>

                    {/* 6. Semester 1 Average */}
                    <td className="border border-slate-400 py-2 px-2 text-blue-900 font-medium">
                      {toKhmerNum(s.sem1Avg.toFixed(2))}
                    </td>

                    {/* 7. Semester 2 Average */}
                    <td className="border border-slate-400 py-2 px-2 text-indigo-900 font-medium">
                      {toKhmerNum(s.sem2Avg.toFixed(2))}
                    </td>

                    {/* 8. Year-End Average */}
                    <td
                      className={`border border-slate-400 py-2 px-2 font-bold ${
                        isSub4To5
                          ? 'bg-orange-50/80 text-orange-900'
                          : 'bg-rose-50/80 text-rose-900'
                      }`}
                    >
                      <div className="flex items-center justify-center gap-1">
                        <span>{toKhmerNum(s.yearAvg.toFixed(2))}</span>
                      </div>
                    </td>

                    {/* 9. Remarks / Specification */}
                    <td className="border border-slate-400 py-2 px-3 text-left">
                      <div className="flex flex-wrap items-center gap-1.5">
                        {isSub4To5 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-orange-100 text-orange-800 border border-orange-300">
                            ៤.០០ - ៤.៩៩
                          </span>
                        ) : isUnder4 ? (
                          <span className="inline-flex items-center px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-300">
                            &lt; ៤.០០
                          </span>
                        ) : null}
                        <span className="text-xs text-slate-800 font-medium">
                          {s.remarks}
                        </span>
                      </div>
                    </td>

                    {/* 10. Actions (Hidden on Print) */}
                    <td className="no-print border border-slate-400 py-1.5 px-1">
                      <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleOpenEditModal(s)}
                          className="p-1 text-blue-600 hover:bg-blue-50 rounded transition-colors"
                          title="កែប្រែព័ត៌មាន"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteStudent(s.id, s.name)}
                          className="p-1 text-rose-600 hover:bg-rose-50 rounded transition-colors"
                          title="លុបឈ្មោះសិស្ស"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })
            )}
          </tbody>

          {/* Footer Summary Row */}
          {filteredStudents.length > 0 && (
            <tfoot>
              <tr className="bg-slate-100 text-slate-900 font-bold">
                <td colSpan={3} className="border border-slate-400 py-2 px-3 text-center">
                  សរុបសិស្សក្នុងតារាងនេះ ៖ {toKhmerNum(filteredStudents.length)} នាក់
                </td>
                <td className="border border-slate-400 py-2 px-1 text-pink-600">
                  ស្រី {toKhmerNum(filteredStudents.filter((s) => s.gender === 'ស្រី' || s.gender === 'ស').length)}
                </td>
                <td className="border border-slate-400 py-2 px-1 text-slate-500">
                  —
                </td>
                {/* Average of Sem 1 */}
                <td className="border border-slate-400 py-2 px-1 text-blue-900">
                  {toKhmerNum(
                    (
                      filteredStudents.reduce((acc, c) => acc + c.sem1Avg, 0) /
                      filteredStudents.length
                    ).toFixed(2)
                  )}
                </td>
                {/* Average of Sem 2 */}
                <td className="border border-slate-400 py-2 px-1 text-indigo-900">
                  {toKhmerNum(
                    (
                      filteredStudents.reduce((acc, c) => acc + c.sem2Avg, 0) /
                      filteredStudents.length
                    ).toFixed(2)
                  )}
                </td>
                {/* Average of Year */}
                <td className="border border-slate-400 py-2 px-1 text-amber-900 bg-amber-100/60">
                  {toKhmerNum(
                    (
                      filteredStudents.reduce((acc, c) => acc + c.yearAvg, 0) /
                      filteredStudents.length
                    ).toFixed(2)
                  )}
                </td>
                <td className="border border-slate-400 py-2 px-3 text-left text-xs font-normal text-slate-600">
                  ក្រុម ៤.០០-៤.៩៩: {toKhmerNum(filteredStudents.filter((s) => s.yearAvg >= 4.0 && s.yearAvg < 5.0).length)} នាក់ | 
                  ក្រុម &lt; ៤.០០: {toKhmerNum(filteredStudents.filter((s) => s.yearAvg < 4.0).length)} នាក់
                </td>
                <td className="no-print border border-slate-400 py-2 px-1 text-slate-400 text-xs">
                  —
                </td>
              </tr>
            </tfoot>
          )}
        </table>
      </div>

      {/* Official Signatures for this Table */}
      <div className="p-6 bg-slate-50/50 border-t border-slate-200 mt-2">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 text-center text-xs sm:text-sm">
          {/* Left: Cluster Director */}
          <div className="flex flex-col items-center">
            <p className="font-semibold text-slate-700">បានឃើញ និងឯកភាព</p>
            <p className="font-moul text-xs text-slate-800 mt-1">នាយកកម្រង</p>
            <p className="text-xs text-slate-500 mt-1">
              {DEFAULT_OFFICIAL_LUNAR_DATE}
            </p>
            <p className="text-xs text-slate-500">
              {formatKhmerSolarDate(meta.reportDate, meta.clusterOrDistrict || 'ស្ពានស្រែង')}
            </p>
            <div className="h-20 flex items-end justify-center">
              <span className="text-xs text-slate-400 italic no-print">[ហត្ថលេខា និងត្រា]</span>
            </div>
          </div>

          {/* Middle: School Director */}
          <div className="flex flex-col items-center">
            <p className="font-semibold text-slate-700">បានឃើញ និងពិនិត្យត្រឹមត្រូវ</p>
            <p className="font-moul text-xs text-slate-800 mt-1">នាយកសាលា</p>
            <p className="text-xs text-slate-500 mt-1">
              {DEFAULT_OFFICIAL_LUNAR_DATE}
            </p>
            <p className="text-xs text-slate-500">
              {formatKhmerSolarDate(meta.reportDate, meta.clusterOrDistrict || 'ភូមិរោត')}
            </p>
            <div className="h-20 flex items-end justify-center">
              <span className="text-xs text-slate-400 italic no-print">[ហត្ថលេខា និងត្រា]</span>
            </div>
          </div>

          {/* Right: Class Teacher / Compiler */}
          <div className="flex flex-col items-center">
            <p className="font-semibold text-slate-700">កាលបរិច្ឆេទធ្វើតារាង</p>
            <p className="font-moul text-xs text-slate-800 mt-1">អ្នករៀបចំតារាង</p>
            <p className="text-xs text-slate-500 mt-1">
              {DEFAULT_OFFICIAL_LUNAR_DATE}
            </p>
            <p className="text-xs text-slate-500">
              {formatKhmerSolarDate(meta.reportDate, meta.clusterOrDistrict || 'ភូមិរោត')}
            </p>
            <div className="h-20 flex items-end justify-center">
              <span className="text-xs text-slate-400 italic no-print">[ហត្ថលេខា]</span>
            </div>
            <p className="font-medium text-slate-900 mt-2">
              {meta.reporterName || 'គ្រូទទួលបន្ទុកស្ថិតិ'}
            </p>
          </div>
        </div>
      </div>

      {/* Add / Edit Student Modal */}
      {isModalOpen && (
        <div className="no-print fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl border border-slate-200 w-full max-w-lg overflow-hidden animate-fadeIn">
            <div className="px-5 py-4 bg-amber-500 text-white flex items-center justify-between">
              <h3 className="font-bold text-sm sm:text-base flex items-center gap-2">
                <AlertTriangle className="w-5 h-5" />
                <span>{editingStudent ? 'កែសម្រួលព័ត៌មានសិស្សធ្លាក់' : 'បន្ថែមសិស្សធ្លាក់មធ្យមភាគ'}</span>
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 text-white/80 hover:text-white rounded-lg hover:bg-white/10 transition-colors"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveStudent} className="p-5 space-y-4 text-xs sm:text-sm">
              <div className="grid grid-cols-2 gap-3">
                {/* Class */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ថ្នាក់ *</label>
                  <select
                    value={formData.gradeClass}
                    onChange={(e) => setFormData({ ...formData, gradeClass: e.target.value })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-amber-500"
                    required
                  >
                    {classOptions.map((c) => (
                      <option key={c} value={c}>
                        {c}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Gender */}
                <div>
                  <label className="block text-slate-700 font-semibold mb-1">ភេទ *</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value as any })}
                    className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-amber-500"
                    required
                  >
                    <option value="ប្រុស">ប្រុស</option>
                    <option value="ស្រី">ស្រី</option>
                  </select>
                </div>
              </div>

              {/* Name */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">គោត្តនាម និងនាម *</label>
                <input
                  type="text"
                  placeholder="ឧ. ស៊ន វីរៈ"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              {/* Date of birth */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">ថ្ងៃខែឆ្នាំកំណើត</label>
                <input
                  type="text"
                  placeholder="ឧ. 12/04/2019"
                  value={formData.dob}
                  onChange={(e) => setFormData({ ...formData, dob: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-amber-500"
                />
              </div>

              {/* Three Averages Grid */}
              <div className="p-3 bg-amber-50/50 border border-amber-200 rounded-xl space-y-2">
                <span className="block font-bold text-amber-950 text-xs">
                  ពិន្ទុមធ្យមភាគ ទាំង៣ (ឆមាស១, ឆមាស២, ដំណាច់ឆ្នាំ)
                </span>
                <div className="grid grid-cols-3 gap-2">
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">ឆមាស១</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.sem1Avg}
                      onChange={(e) => handleSemScoreChange('sem1Avg', parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-blue-900 outline-hidden focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">ឆមាស២</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.sem2Avg}
                      onChange={(e) => handleSemScoreChange('sem2Avg', parseFloat(e.target.value))}
                      className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-indigo-900 outline-hidden focus:border-amber-500"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-slate-600 text-[11px] mb-0.5">ដំណាច់ឆ្នាំ</label>
                    <input
                      type="number"
                      step="0.01"
                      min="0"
                      max="10"
                      value={formData.yearAvg}
                      onChange={(e) => setFormData({ ...formData, yearAvg: parseFloat(e.target.value) || 0 })}
                      className="w-full bg-white border border-amber-400 rounded-lg px-2 py-1.5 text-xs text-center font-bold text-amber-900 outline-hidden focus:border-amber-600"
                      required
                    />
                  </div>
                </div>

                {/* Range category badge helper */}
                <div className="flex items-center gap-2 pt-1 text-[11px]">
                  <span className="text-slate-500">ចំណាត់ថ្នាក់ ៖</span>
                  {formData.yearAvg >= 4.0 && formData.yearAvg < 5.0 ? (
                    <span className="px-2 py-0.5 rounded font-bold bg-orange-100 text-orange-800 border border-orange-300">
                      សិស្សធ្លាក់មធ្យមភាគ ៤.០០ - ៤.៩៩ (ត្រៀមប្រឡងសង)
                    </span>
                  ) : formData.yearAvg < 4.0 ? (
                    <span className="px-2 py-0.5 rounded font-bold bg-rose-100 text-rose-800 border border-rose-300">
                      សិស្សធ្លាក់មធ្យមភាគ ០.០០ - ៣.៩៩ (ត្រួតថ្នាក់)
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded font-bold bg-emerald-100 text-emerald-800 border border-emerald-300">
                      សិស្សជាប់មធ្យមភាគ (≥ ៥.០០)
                    </span>
                  )}
                </div>
              </div>

              {/* Remarks */}
              <div>
                <label className="block text-slate-700 font-semibold mb-1">សេចក្ដីបញ្ជាក់ *</label>
                <input
                  type="text"
                  placeholder="ឧ. ត្រៀមប្រឡងសង (ម.ភាគ ៤.០០-៤.៩៩)"
                  value={formData.remarks}
                  onChange={(e) => setFormData({ ...formData, remarks: e.target.value })}
                  className="w-full bg-slate-50 border border-slate-300 rounded-lg px-3 py-2 text-xs outline-hidden focus:border-amber-500"
                  required
                />
              </div>

              {/* Modal Buttons */}
              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold transition-colors cursor-pointer"
                >
                  បោះបង់
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-amber-600 hover:bg-amber-700 text-white rounded-lg text-xs font-semibold transition-colors shadow-2xs cursor-pointer flex items-center gap-1.5"
                >
                  <Check className="w-4 h-4" />
                  <span>{editingStudent ? 'រក្សាទុកការកែប្រែ' : 'បញ្ចូលសិស្ស'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
