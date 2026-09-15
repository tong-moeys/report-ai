import React, { useState } from 'react';
import { StaffMember, SchoolMeta } from '../types';
import { toKhmerNum } from '../utils/khmerNumbers';
import { Users, UserPlus, Phone, Printer, Check, Plus, Trash2, Edit2 } from 'lucide-react';

interface StaffNominalRollProps {
  meta: SchoolMeta;
  staffList: StaffMember[];
  onUpdateStaffList: (list: StaffMember[]) => void;
}

export const StaffNominalRoll: React.FC<StaffNominalRollProps> = ({
  meta,
  staffList,
  onUpdateStaffList,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [editingMember, setEditingMember] = useState<StaffMember | null>(null);

  // Group staff into categories
  const adminStaff = staffList.filter((s) => s.category === 'admin');
  const teachingStaff = staffList.filter((s) => s.category === 'teaching');
  const kindergartenStaff = staffList.filter((s) => s.category === 'kindergarten');

  // Counts
  const totalStaff = staffList.length;
  const femaleStaff = staffList.filter((s) => s.gender === 'ស' || s.gender === 'ស្រី').length;
  const primaryTeaching = staffList.filter((s) => s.category === 'teaching' && s.roleOrClass !== 'កសិកម្ម' && s.roleOrClass !== 'បណ្ណារក្ស');
  const primaryFemale = primaryTeaching.filter((s) => s.gender === 'ស' || s.gender === 'ស្រី').length;

  const totalPrimaryStudents = teachingStaff.reduce((sum, s) => sum + (s.studentsTotal || 0), 0);
  const totalPrimaryFemales = teachingStaff.reduce((sum, s) => sum + (s.studentsFemale || 0), 0);

  const totalKindergartenStudents = kindergartenStaff.reduce((sum, s) => sum + (s.studentsTotal || 0), 0);
  const totalKindergartenFemales = kindergartenStaff.reduce((sum, s) => sum + (s.studentsFemale || 0), 0);

  const grandTotalStudents = totalPrimaryStudents + totalKindergartenStudents;
  const grandTotalFemales = totalPrimaryFemales + totalKindergartenFemales;

  const handleSaveMember = (member: StaffMember) => {
    if (staffList.some((s) => s.id === member.id)) {
      onUpdateStaffList(staffList.map((s) => (s.id === member.id ? member : s)));
    } else {
      onUpdateStaffList([...staffList, member]);
    }
    setEditingMember(null);
  };

  const handleDeleteMember = (id: string) => {
    if (confirm('តើអ្នកពិតជាចង់លុបបុគ្គលិកនេះចេញមែនទេ?')) {
      onUpdateStaffList(staffList.filter((s) => s.id !== id));
    }
  };

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden print:border-none print:shadow-none">
      {/* Action Toolbar */}
      <div className="no-print p-4 bg-slate-50 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-blue-600 text-white flex items-center justify-center">
            <Users className="w-4 h-4" />
          </div>
          <div>
            <h3 className="font-bold text-slate-800 text-sm">បញ្ជីរាយនាមបុគ្គលិកអប់រំ (ទំព័រទី ៧ នៃរបាយការណ៍ផ្លូវការ)</h3>
            <p className="text-xs text-slate-500">បុគ្គលិកសរុប {toKhmerNum(totalStaff)} នាក់ (ស្រី {toKhmerNum(femaleStaff)} នាក់)</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setIsEditing(!isEditing)}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg border border-slate-300 bg-white hover:bg-slate-50 text-slate-700 cursor-pointer"
          >
            <Edit2 className="w-3.5 h-3.5" />
            <span>{isEditing ? 'បញ្ចប់ការកែប្រែ' : 'កែសម្រួលបញ្ជី'}</span>
          </button>
          <button
            onClick={() =>
              setEditingMember({
                id: `s-${Date.now()}`,
                no: staffList.length + 1,
                name: '',
                gender: 'ស',
                qualification: 'គ្រូបឋម',
                educationLevel: 'ស.ទុតិយភូមិ',
                roleOrClass: '',
                studentsTotal: 0,
                studentsFemale: 0,
                shift: 'ព្រឹក',
                phone: '',
                category: 'teaching',
              })
            }
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-blue-600 hover:bg-blue-700 text-white cursor-pointer"
          >
            <UserPlus className="w-3.5 h-3.5" />
            <span>បន្ថែមបុគ្គលិក</span>
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold rounded-lg bg-slate-800 hover:bg-slate-900 text-white cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>បោះពុម្ព</span>
          </button>
        </div>
      </div>

      {/* Printable Sheet */}
      <div className="p-6 sm:p-10 max-w-5xl mx-auto font-sans leading-normal">
        {/* Kingdom Header */}
        <div className="text-center mb-6">
          <h2 className="font-bold text-base sm:text-lg text-slate-900 tracking-wider">ព្រះរាជាណាចក្រកម្ពុជា</h2>
          <h3 className="font-semibold text-sm sm:text-base text-slate-800 tracking-widest mt-0.5">ជាតិ សាសនា ព្រះមហាក្សត្រ</h3>
          <div className="text-xs text-slate-400 mt-1">🙡 🙠 🙡 🙠</div>
        </div>

        {/* Administration Header Left */}
        <div className="mb-6 text-xs sm:text-sm text-slate-800 space-y-0.5">
          <p className="font-bold">{meta.clusterOrDistrict.includes('ស្រុក') ? 'រដ្ឋបាលស្រុកភ្នំស្រុក' : 'រដ្ឋបាលស្រុក'}</p>
          <p className="font-medium">ការិយាល័យអប់រំ យុវជន និងកីឡា</p>
          <p className="font-medium">កម្រងសាលារៀន: <span className="font-bold">ស្ពានស្រែង</span></p>
          <p className="font-medium">សាលាបឋមសិក្សា: <span className="font-bold">{meta.schoolName}</span></p>
        </div>

        {/* Document Title */}
        <div className="text-center mb-6">
          <h1 className="font-bold text-base sm:text-lg text-slate-950">
            បញ្ជីរាយនាមបុគ្គលិកឆមាសទី១ និងដំណាច់ឆ្នាំ ឆ្នាំសិក្សា {meta.academicYear}
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">(តារាង ៖ ប.បរភស្តុតាង, ឆមាសទី១ និង ដំណាច់ឆ្នាំ)</p>
        </div>

        {/* Table I: Management & Administration */}
        <div className="mb-6">
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">I - បុគ្គលិកចាត់តាំង ៖</h4>
          <div className="overflow-x-auto border border-slate-400 rounded-xs">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-400 font-bold text-slate-800">
                  <th className="py-2 px-2 border-r border-slate-400 w-10">ល.រ</th>
                  <th className="py-2 px-3 border-r border-slate-400 text-left min-w-[140px]">នាមត្រកូល-នាមខ្លួន</th>
                  <th className="py-2 px-2 border-r border-slate-400 w-12">ភេទ</th>
                  <th className="py-2 px-2 border-r border-slate-400">ក្របខ័ណ្ឌ</th>
                  <th className="py-2 px-2 border-r border-slate-400">កម្រិតវប្បធម៌</th>
                  <th className="py-2 px-3 border-r border-slate-400 font-bold">មុខងារ</th>
                  <th className="py-2 px-3 border-r border-slate-400 min-w-[120px]">ផ្សេងៗ / ទូរស័ព្ទ</th>
                  {isEditing && <th className="no-print py-2 px-2 w-16">សកម្មភាព</th>}
                </tr>
              </thead>
              <tbody>
                {adminStaff.map((staff, idx) => (
                  <tr key={staff.id} className="border-b border-slate-300 hover:bg-blue-50/40">
                    <td className="py-2 px-1 border-r border-slate-400 font-medium">{toKhmerNum(idx + 1)}</td>
                    <td className="py-2 px-3 border-r border-slate-400 text-left font-bold text-slate-900">{staff.name}</td>
                    <td className="py-2 px-1 border-r border-slate-400 font-medium">{staff.gender}</td>
                    <td className="py-2 px-2 border-r border-slate-400">{staff.qualification}</td>
                    <td className="py-2 px-2 border-r border-slate-400">{staff.educationLevel}</td>
                    <td className="py-2 px-3 border-r border-slate-400 font-bold text-blue-900">{staff.roleOrClass}</td>
                    <td className="py-2 px-3 border-r border-slate-400 font-mono text-slate-700">{staff.phone}</td>
                    {isEditing && (
                      <td className="no-print py-2 px-1 text-center">
                        <button onClick={() => setEditingMember(staff)} className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteMember(staff.id)} className="text-rose-600 hover:text-rose-800 p-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Table II: Teaching Staff */}
        <div className="mb-6">
          <h4 className="font-bold text-xs sm:text-sm text-slate-900 mb-2">II - បុគ្គលិកបង្រៀន ៖</h4>
          <div className="overflow-x-auto border border-slate-400 rounded-xs">
            <table className="w-full text-xs text-center border-collapse">
              <thead>
                <tr className="bg-slate-100 border-b border-slate-400 font-bold text-slate-800">
                  <th rowSpan={2} className="py-2 px-2 border-r border-slate-400 w-10">ល.រ</th>
                  <th rowSpan={2} className="py-2 px-3 border-r border-slate-400 text-left min-w-[140px]">នាមត្រកូល-នាមខ្លួន</th>
                  <th rowSpan={2} className="py-2 px-2 border-r border-slate-400 w-10">ភេទ</th>
                  <th rowSpan={2} className="py-2 px-2 border-r border-slate-400">ក្របខ័ណ្ឌ</th>
                  <th rowSpan={2} className="py-2 px-2 border-r border-slate-400">កម្រិតវប្បធម៌</th>
                  <th rowSpan={2} className="py-2 px-2 border-r border-slate-400 font-bold">ថ្នាក់</th>
                  <th colSpan={2} className="py-1 px-2 border-r border-slate-400 bg-slate-200/70">ចំនួនសិស្ស</th>
                  <th colSpan={2} className="py-1 px-2 border-r border-slate-400 bg-slate-200/70">វេន</th>
                  <th rowSpan={2} className="py-2 px-3 border-r border-slate-400 min-w-[120px]">ផ្សេងៗ / ទូរស័ព្ទ</th>
                  {isEditing && <th rowSpan={2} className="no-print py-2 px-2 w-16">សកម្មភាព</th>}
                </tr>
                <tr className="bg-slate-100 border-b border-slate-400 font-semibold text-slate-700 text-[11px]">
                  <th className="py-1 px-2 border-r border-slate-400 w-12">សរុប</th>
                  <th className="py-1 px-2 border-r border-slate-400 w-12">ស្រី</th>
                  <th className="py-1 px-1 border-r border-slate-400 w-10">ព្រឹក</th>
                  <th className="py-1 px-1 border-r border-slate-400 w-10">ល្ងាច</th>
                </tr>
              </thead>
              <tbody>
                {teachingStaff.map((staff, idx) => (
                  <tr key={staff.id} className="border-b border-slate-300 hover:bg-blue-50/40">
                    <td className="py-2 px-1 border-r border-slate-400 font-medium">{toKhmerNum(adminStaff.length + idx + 1)}</td>
                    <td className="py-2 px-3 border-r border-slate-400 text-left font-bold text-slate-900">{staff.name}</td>
                    <td className="py-2 px-1 border-r border-slate-400">{staff.gender}</td>
                    <td className="py-2 px-2 border-r border-slate-400">{staff.qualification}</td>
                    <td className="py-2 px-2 border-r border-slate-400">{staff.educationLevel}</td>
                    <td className="py-2 px-2 border-r border-slate-400 font-bold text-slate-900">{staff.roleOrClass}</td>
                    <td className="py-2 px-2 border-r border-slate-400 font-semibold">{staff.studentsTotal ? toKhmerNum(staff.studentsTotal) : '-'}</td>
                    <td className="py-2 px-2 border-r border-slate-400 font-semibold text-rose-700">{staff.studentsFemale ? toKhmerNum(staff.studentsFemale) : '-'}</td>
                    <td className="py-2 px-1 border-r border-slate-400 text-emerald-600 font-bold">{staff.shift === 'ព្រឹក' ? '✔' : ''}</td>
                    <td className="py-2 px-1 border-r border-slate-400 text-emerald-600 font-bold">{staff.shift === 'ល្ងាច' ? '✔' : ''}</td>
                    <td className="py-2 px-3 border-r border-slate-400 font-mono text-slate-700">{staff.phone}</td>
                    {isEditing && (
                      <td className="no-print py-2 px-1 text-center">
                        <button onClick={() => setEditingMember(staff)} className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteMember(staff.id)} className="text-rose-600 hover:text-rose-800 p-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
                {/* Subtotal Primary */}
                <tr className="bg-slate-200/80 font-bold text-slate-900 border-b border-slate-400">
                  <td colSpan={6} className="py-2 px-3 border-r border-slate-400 text-right">សរុបរួមបឋម ៖</td>
                  <td className="py-2 px-2 border-r border-slate-400 text-blue-900">{toKhmerNum(totalPrimaryStudents)}</td>
                  <td className="py-2 px-2 border-r border-slate-400 text-rose-900">{toKhmerNum(totalPrimaryFemales)}</td>
                  <td colSpan={3} className="py-2 px-2 border-r border-slate-400"></td>
                  {isEditing && <td className="no-print"></td>}
                </tr>

                {/* Kindergarten section */}
                {kindergartenStaff.map((staff, idx) => (
                  <tr key={staff.id} className="border-b border-slate-300 hover:bg-amber-50/40">
                    <td className="py-2 px-1 border-r border-slate-400 font-medium">{toKhmerNum(adminStaff.length + teachingStaff.length + idx + 1)}</td>
                    <td className="py-2 px-3 border-r border-slate-400 text-left font-bold text-slate-900">{staff.name}</td>
                    <td className="py-2 px-1 border-r border-slate-400">{staff.gender}</td>
                    <td className="py-2 px-2 border-r border-slate-400">{staff.qualification}</td>
                    <td className="py-2 px-2 border-r border-slate-400">{staff.educationLevel}</td>
                    <td className="py-2 px-2 border-r border-slate-400 font-bold text-amber-900">{staff.roleOrClass}</td>
                    <td className="py-2 px-2 border-r border-slate-400 font-semibold">{staff.studentsTotal ? toKhmerNum(staff.studentsTotal) : '-'}</td>
                    <td className="py-2 px-2 border-r border-slate-400 font-semibold text-rose-700">{staff.studentsFemale ? toKhmerNum(staff.studentsFemale) : '-'}</td>
                    <td className="py-2 px-1 border-r border-slate-400 text-emerald-600 font-bold">{staff.shift === 'ព្រឹក' ? '✔' : ''}</td>
                    <td className="py-2 px-1 border-r border-slate-400 text-emerald-600 font-bold">{staff.shift === 'ល្ងាច' ? '✔' : ''}</td>
                    <td className="py-2 px-3 border-r border-slate-400 font-mono text-slate-700">{staff.phone}</td>
                    {isEditing && (
                      <td className="no-print py-2 px-1 text-center">
                        <button onClick={() => setEditingMember(staff)} className="text-blue-600 hover:text-blue-800 p-1">
                          <Edit2 className="w-3 h-3" />
                        </button>
                        <button onClick={() => handleDeleteMember(staff.id)} className="text-rose-600 hover:text-rose-800 p-1">
                          <Trash2 className="w-3 h-3" />
                        </button>
                      </td>
                    )}
                  </tr>
                ))}

                {/* Grand Total Row */}
                <tr className="bg-slate-300 font-bold text-slate-950 border-b border-slate-500">
                  <td colSpan={6} className="py-2 px-3 border-r border-slate-400 text-right">សរុបរួមទាំងអស់ ៖</td>
                  <td className="py-2 px-2 border-r border-slate-400 text-blue-950">{toKhmerNum(grandTotalStudents)}</td>
                  <td className="py-2 px-2 border-r border-slate-400 text-rose-950">{toKhmerNum(grandTotalFemales)}</td>
                  <td colSpan={3} className="py-2 px-2 border-r border-slate-400"></td>
                  {isEditing && <td className="no-print"></td>}
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Note / Verification Summary Box (Exact matching PDF page 7) */}
        <div className="p-3 bg-slate-50 border border-slate-300 rounded-md text-xs text-slate-800 space-y-1 mb-8">
          <p className="font-bold">បញ្ជាក់ ៖</p>
          <ul className="list-disc list-inside space-y-0.5 text-slate-700 ml-2">
            <li>បុគ្គលិកសរុបចំនួន ៖ <strong>{toKhmerNum(totalStaff)} នាក់</strong> / ស្រី <strong>{toKhmerNum(femaleStaff)} នាក់</strong></li>
            <li>បុគ្គលិកបង្រៀន បឋម ៖ <strong>{toKhmerNum(primaryTeaching.length)} នាក់</strong> / ស្រី <strong>{toKhmerNum(primaryFemale)} នាក់</strong></li>
            <li>បុគ្គលិកបង្រៀន មត្តេយ្យ ៖ <strong>{toKhmerNum(kindergartenStaff.length)} នាក់</strong> / ស្រី <strong>{toKhmerNum(kindergartenStaff.filter((s) => s.gender === 'ស' || s.gender === 'ស្រី').length)} នាក់</strong></li>
            <li>បុគ្គលិកចាត់តាំង ៖ <strong>{toKhmerNum(adminStaff.length)} នាក់</strong> / ស្រី <strong>{toKhmerNum(adminStaff.filter((s) => s.gender === 'ស' || s.gender === 'ស្រី').length)} នាក់</strong></li>
          </ul>
        </div>

        {/* Official Signatures Block matching Page 7 */}
        <div className="grid grid-cols-2 gap-8 text-center text-xs sm:text-sm pt-4 border-t border-slate-200">
          <div>
            <p className="font-bold text-slate-900">បានឃើញ និងឯកភាព</p>
            <p className="text-xs text-slate-500 mt-1">ថ្ងៃទី....... ខែ....... ឆ្នាំ ២០២៦</p>
            <p className="font-bold text-slate-900 mt-2">ប្រធានការិយាល័យអប់រំ យុវជន និងកីឡានៃរដ្ឋបាលស្រុក</p>
            <div className="h-20"></div>
          </div>
          <div>
            <p className="text-xs text-slate-600">ថ្ងៃពុធ ៣កើត ខែភទ្របទ ឆ្នាំរោង ឆស័ក ព.ស.២៥៦០</p>
            <p className="text-xs text-slate-500 mt-0.5">រោត, ថ្ងៃទី១៤ ខែកញ្ញា ឆ្នាំ២០២៦</p>
            <p className="font-bold text-slate-900 mt-2">ប្រធានអង្គភាព</p>
            <div className="h-16 flex items-end justify-center font-bold text-slate-900">
              {meta.directorName}
            </div>
          </div>
        </div>
      </div>

      {/* Edit / Add Modal */}
      {editingMember && (
        <div className="no-print fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full shadow-2xl space-y-4">
            <h3 className="font-bold text-base text-slate-900">
              {staffList.some((s) => s.id === editingMember.id) ? 'កែសម្រួលបុគ្គលិក' : 'បន្ថែមបុគ្គលិកថ្មី'}
            </h3>
            <div className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">នាមត្រកូល-នាមខ្លួន</label>
                <input
                  type="text"
                  value={editingMember.name}
                  onChange={(e) => setEditingMember({ ...editingMember, name: e.target.value })}
                  className="w-full border border-slate-300 rounded-lg p-2 font-medium"
                  placeholder="ឧ. សួន ណាប៉ែន"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ភេទ</label>
                  <select
                    value={editingMember.gender}
                    onChange={(e) => setEditingMember({ ...editingMember, gender: e.target.value as 'ស' | 'ប' })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="ស">ស្រី (ស)</option>
                    <option value="ប">ប្រុស (ប)</option>
                  </select>
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ប្រភេទ</label>
                  <select
                    value={editingMember.category}
                    onChange={(e) => setEditingMember({ ...editingMember, category: e.target.value as any })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  >
                    <option value="teaching">បង្រៀនបឋម</option>
                    <option value="admin">ចាត់តាំង/រដ្ឋបាល</option>
                    <option value="kindergarten">មត្តេយ្យ</option>
                  </select>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">ក្របខ័ណ្ឌ</label>
                  <input
                    type="text"
                    value={editingMember.qualification}
                    onChange={(e) => setEditingMember({ ...editingMember, qualification: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">កម្រិតវប្បធម៌</label>
                  <input
                    type="text"
                    value={editingMember.educationLevel}
                    onChange={(e) => setEditingMember({ ...editingMember, educationLevel: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">មុខងារ / ថ្នាក់</label>
                  <input
                    type="text"
                    value={editingMember.roleOrClass}
                    onChange={(e) => setEditingMember({ ...editingMember, roleOrClass: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2"
                    placeholder="1A, 5A, នាយិកា..."
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">លេខទូរស័ព្ទ</label>
                  <input
                    type="text"
                    value={editingMember.phone}
                    onChange={(e) => setEditingMember({ ...editingMember, phone: e.target.value })}
                    className="w-full border border-slate-300 rounded-lg p-2 font-mono"
                    placeholder="089 xxx xxx"
                  />
                </div>
              </div>
            </div>
            <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-200">
              <button
                onClick={() => setEditingMember(null)}
                className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
              >
                បោះបង់
              </button>
              <button
                onClick={() => handleSaveMember(editingMember)}
                className="px-4 py-2 text-xs font-semibold bg-blue-600 hover:bg-blue-700 text-white rounded-lg"
              >
                រក្សាទុក
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
