import { StaffMember, ClassGradebook, SchoolMeta } from '../types';

export const rotSchoolMeta: SchoolMeta = {
  schoolName: 'សាលាបឋមសិក្សា រោត',
  clusterOrDistrict: 'កម្រង ស្ពានស្រែង • ការិយាល័យអប់រំ យុវជន និងកីឡា នៃរដ្ឋបាលស្រុកភ្នំស្រុក',
  province: 'ខេត្តបន្ទាយមានជ័យ',
  academicYear: '២០២៥-២០២៦',
  directorName: 'សួន ណាប៉ែន',
  preparedByName: 'អ៊ុន ប៊ុនធួន',
  reportDate: '២០២៦-០៣-២១',
};

// បញ្ជីរាយនាមបុគ្គលិក ១៧ នាក់ (Page 7 នៃឯកសារ)
export const initialStaffList: StaffMember[] = [
  // I - បុគ្គលិកចាត់តាំង
  { id: 's1', no: 1, name: 'សួន ណាប៉ែន', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ថ្នាក់ទី១២', roleOrClass: 'នាយិកាសាលា', shift: 'ព្រឹក', phone: '089 663 966', category: 'admin' },
  { id: 's2', no: 2, name: 'យ៉េន ណាវី', gender: 'ប', qualification: 'គ្រូបឋម', educationLevel: 'ថ្នាក់ទី១២', roleOrClass: 'នាយករង', shift: 'ព្រឹក', phone: '086 246 698', category: 'admin' },
  { id: 's3', no: 3, name: 'អ៊ុន ប៊ុនធួន', gender: 'ប', qualification: 'គ្រូបឋម', educationLevel: 'ស.បច្ចេកទេស', roleOrClass: 'លេខាធិការ', shift: 'ព្រឹក', phone: '092 272 005', category: 'admin' },
  // II - បុគ្គលិកបង្រៀន
  { id: 's4', no: 4, name: 'ជែម សុភក្តិ', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.ទុតិយភូមិ', roleOrClass: '1A', studentsTotal: 31, studentsFemale: 15, shift: 'ព្រឹក', phone: '088 343 5566', category: 'teaching' },
  { id: 's5', no: 5, name: 'ឡាង ម៉ារ៉ាដ្យែ', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.បឋមភូមិ', roleOrClass: '5A', studentsTotal: 25, studentsFemale: 12, shift: 'ព្រឹក', phone: '097 685 8898', category: 'teaching' },
  { id: 's6', no: 6, name: 'ចោម ស្រីពេជ្រ', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.ទុតិយភូមិ', roleOrClass: '2A', studentsTotal: 22, studentsFemale: 11, shift: 'ព្រឹក', phone: '088 930 4103', category: 'teaching' },
  { id: 's7', no: 7, name: 'លេង ចាន់ណារ', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.ទុតិយភូមិ', roleOrClass: '2B', studentsTotal: 22, studentsFemale: 10, shift: 'ព្រឹក', phone: '088 466 1856', category: 'teaching' },
  { id: 's8', no: 8, name: 'អេង ផល្លាន', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.បឋមភូមិ', roleOrClass: '3B', studentsTotal: 20, studentsFemale: 10, shift: 'ព្រឹក', phone: '092 620 771', category: 'teaching' },
  { id: 's9', no: 9, name: 'ប៊ូ ពិសី', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.ទុតិយភូមិ', roleOrClass: '3A', studentsTotal: 20, studentsFemale: 11, shift: 'ព្រឹក', phone: '097 933 9499', category: 'teaching' },
  { id: 's10', no: 10, name: 'ខេន សាវ៉ា', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.បឋមភូមិ', roleOrClass: '4A', studentsTotal: 25, studentsFemale: 11, shift: 'ព្រឹក', phone: '097 461 1580', category: 'teaching' },
  { id: 's11', no: 11, name: 'អៀន សុខឿប', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.បឋមភូមិ', roleOrClass: '4B', studentsTotal: 24, studentsFemale: 11, shift: 'ព្រឹក', phone: '097 707 5979', category: 'teaching' },
  { id: 's12', no: 12, name: 'យ៉ែម សម្បូរស្បៃ', gender: 'ប', qualification: 'គ្រូបឋម', educationLevel: 'ស.ទុតិយភូមិ', roleOrClass: '5B', studentsTotal: 25, studentsFemale: 12, shift: 'ព្រឹក', phone: '031 423 4466', category: 'teaching' },
  { id: 's13', no: 13, name: 'ឈួន សេរីរ៉ុម', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.បឋមភូមិ', roleOrClass: '6A', studentsTotal: 35, studentsFemale: 17, shift: 'ព្រឹក', phone: '097 670 0999', category: 'teaching' },
  { id: 's14', no: 14, name: 'កែវ ខន', gender: 'ប', qualification: 'គ្រូបឋម', educationLevel: 'ថ្នាក់ទី១២', roleOrClass: 'កសិកម្ម', shift: 'ព្រឹក', phone: '090 887 118', category: 'teaching' },
  { id: 's15', no: 15, name: 'លន់ ចាន់នីក', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.ទុតិយភូមិ', roleOrClass: 'បណ្ណារក្ស', shift: 'ព្រឹក', phone: '097 242 4423', category: 'teaching' },
  // មត្តេយ្យ
  { id: 's16', no: 16, name: 'បាន ណាក់', gender: 'ស', qualification: 'គ្រូមត្តេយ្យ', educationLevel: 'ស.បឋមភូមិ', roleOrClass: 'ម.វត្តខ្ពស់', studentsTotal: 35, studentsFemale: 20, shift: 'ព្រឹក', phone: '0978 680 864', category: 'kindergarten' },
  { id: 's17', no: 17, name: 'ឡុក ម៉ាក់ឌី', gender: 'ស', qualification: 'គ្រូបឋម', educationLevel: 'ស.ទុតិយភូមិ', roleOrClass: 'ម.កាច់រទេះ', studentsTotal: 40, studentsFemale: 25, shift: 'ព្រឹក', phone: '0886 534 343', category: 'kindergarten' },
];

// ទិន្នន័យគំរូសៀវភៅចំណាត់ថ្នាក់តាមថ្នាក់ទាំង ១០ (Pages 12-21)
export const initialClassGradebooks: ClassGradebook[] = [
  {
    gradeId: '3B',
    gradeName: 'ថ្នាក់ទី 3B',
    teacherName: 'អេង ផល្លាន',
    students: [
      { id: '3b-1', no: 1, name: 'ជួយ សិលា', gender: 'ស្រី', dob: '21-Sep-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.49, sem1Rank: 1, sem2Avg: 8.61, sem2Rank: 1, yearAvg: 8.55, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-2', no: 2, name: 'រិន ផល្លា', gender: 'ស្រី', dob: '5-Apr-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.40, sem1Rank: 3, sem2Avg: 8.11, sem2Rank: 4, yearAvg: 8.25, yearRank: 2, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-3', no: 3, name: 'លឿន ចៅហ្វាង', gender: 'ប្រុស', dob: '18-Nov-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.93, sem1Rank: 6, sem2Avg: 8.04, sem2Rank: 5, yearAvg: 7.98, yearRank: 3, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-4', no: 4, name: 'មាន សិទ្ធិរ៉ា', gender: 'ស្រី', dob: '17-Aug-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.20, sem1Rank: 10, sem2Avg: 8.57, sem2Rank: 2, yearAvg: 7.88, yearRank: 4, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-5', no: 5, name: 'ម៉ៅ លីណា', gender: 'ស្រី', dob: '3-Jun-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.48, sem1Rank: 2, sem2Avg: 7.14, sem2Rank: 13, yearAvg: 7.81, yearRank: 5, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-6', no: 6, name: 'រ៉ុង សុខាណាត', gender: 'ស្រី', dob: '3-Mar-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.16, sem1Rank: 11, sem2Avg: 8.47, sem2Rank: 3, yearAvg: 7.81, yearRank: 5, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-7', no: 7, name: 'យ៉ឿន គិមឆាយ', gender: 'ប្រុស', dob: '20-Nov-2016', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.50, sem1Rank: 8, sem2Avg: 7.71, sem2Rank: 8, yearAvg: 7.60, yearRank: 7, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-8', no: 8, name: 'លួង សុផាតណា', gender: 'ស្រី', dob: '23-May-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.04, sem1Rank: 13, sem2Avg: 7.97, sem2Rank: 6, yearAvg: 7.50, yearRank: 8, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-9', no: 9, name: 'រិទ្ធ រចនា', gender: 'ស្រី', dob: '11-Aug-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.26, sem1Rank: 9, sem2Avg: 7.20, sem2Rank: 11, yearAvg: 7.23, yearRank: 9, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-10', no: 10, name: 'សម្បត្តិ នរៈរិទ្ធ', gender: 'ប្រុស', dob: '14-Mar-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.09, sem1Rank: 5, sem2Avg: 6.28, sem2Rank: 15, yearAvg: 7.18, yearRank: 10, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-11', no: 11, name: 'គឹម ស្រ៊', gender: 'ប្រុស', dob: '20-May-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.14, sem1Rank: 12, sem2Avg: 7.18, sem2Rank: 12, yearAvg: 7.16, yearRank: 11, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-12', no: 12, name: 'សណ្តារ ដារ៉ាណាត់', gender: 'ប្រុស', dob: '9-Dec-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.17, sem1Rank: 4, sem2Avg: 5.95, sem2Rank: 17, yearAvg: 7.06, yearRank: 12, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-13', no: 13, name: 'ថៃ មុន្នីណាត', gender: 'ស្រី', dob: '18-Oct-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.90, sem1Rank: 7, sem2Avg: 6.07, sem2Rank: 16, yearAvg: 6.98, yearRank: 13, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-14', no: 14, name: 'សាន កុម្ភៈ', gender: 'ប្រុស', dob: '4-Feb-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 5.98, sem1Rank: 16, sem2Avg: 7.42, sem2Rank: 10, yearAvg: 6.70, yearRank: 14, gradeLetter: 'D', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-15', no: 15, name: 'យុន ហ៊ានណា', gender: 'ប្រុស', dob: '8-May-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 5.41, sem1Rank: 19, sem2Avg: 7.94, sem2Rank: 7, yearAvg: 6.67, yearRank: 15, gradeLetter: 'D', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-16', no: 16, name: 'រឿន គិមឈួង', gender: 'ប្រុស', dob: '7-Nov-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 6.78, sem1Rank: 14, sem2Avg: 6.51, sem2Rank: 14, yearAvg: 6.64, yearRank: 16, gradeLetter: 'D', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-17', no: 17, name: 'គង់ សុភាព', gender: 'ស្រី', dob: '24-Nov-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 5.51, sem1Rank: 18, sem2Avg: 7.43, sem2Rank: 9, yearAvg: 6.47, yearRank: 17, gradeLetter: 'D', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-18', no: 18, name: 'រស់ ប៉ាក់ស្រីម៉េង', gender: 'ប្រុស', dob: '21-Feb-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 6.22, sem1Rank: 15, sem2Avg: 5.59, sem2Rank: 18, yearAvg: 5.90, yearRank: 18, gradeLetter: 'E', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-19', no: 19, name: 'លាយ ប៊ុនថេន', gender: 'ស្រី', dob: '12-Aug-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 5.98, sem1Rank: 16, sem2Avg: 5.52, sem2Rank: 19, yearAvg: 5.75, yearRank: 19, gradeLetter: 'E', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3b-20', no: 20, name: 'ឡោក តុលា', gender: 'ប្រុស', dob: '8-Mar-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 5.28, sem1Rank: 20, sem2Avg: 5.30, sem2Rank: 20, yearAvg: 5.29, yearRank: 20, gradeLetter: 'E', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '1A',
    gradeName: 'ថ្នាក់ទី 1A',
    teacherName: 'ជែម សុភក្តិ',
    students: [
      { id: '1a-1', no: 1, name: 'ល្ងាច រតនារោហ៍', gender: 'ស្រី', dob: '27-Oct-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.44, sem1Rank: 2, sem2Avg: 9.02, sem2Rank: 1, yearAvg: 8.73, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '1a-2', no: 2, name: 'រីក រស្មី', gender: 'ប្រុស', dob: '9-Feb-2020', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.55, sem1Rank: 1, sem2Avg: 8.39, sem2Rank: 2, yearAvg: 8.47, yearRank: 2, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '1a-3', no: 3, name: 'រិន សុវណ្ណារ៉ា', gender: 'ប្រុស', dob: '26-Mar-2020', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.06, sem1Rank: 4, sem2Avg: 8.10, sem2Rank: 4, yearAvg: 8.08, yearRank: 3, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '1a-4', no: 4, name: 'ចែ សុផល', gender: 'ស្រី', dob: '4-Oct-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.18, sem1Rank: 3, sem2Avg: 7.90, sem2Rank: 6, yearAvg: 8.04, yearRank: 4, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '1a-5', no: 5, name: 'នេន វឌ្ឍនៈលៀង', gender: 'ប្រុស', dob: '4-Mar-2020', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.65, sem1Rank: 6, sem2Avg: 8.20, sem2Rank: 3, yearAvg: 7.92, yearRank: 5, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '1a-6', no: 6, name: 'រ៉ុន ពន្លឺសេដ្ឋីរដ្ឋ', gender: 'ប្រុស', dob: '12-Apr-2020', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.79, sem1Rank: 5, sem2Avg: 7.92, sem2Rank: 5, yearAvg: 7.85, yearRank: 6, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '1a-7', no: 7, name: 'ខឹម រ៉ាឌី', gender: 'ប្រុស', dob: '25-May-2020', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.54, sem1Rank: 7, sem2Avg: 7.62, sem2Rank: 7, yearAvg: 7.58, yearRank: 7, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '1a-8', no: 8, name: 'សំរិទ្ធ វិសាល', gender: 'ប្រុស', dob: '27-Dec-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.22, sem1Rank: 10, sem2Avg: 7.43, sem2Rank: 8, yearAvg: 7.32, yearRank: 8, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '2A',
    gradeName: 'ថ្នាក់ទី 2A',
    teacherName: 'ចោម ស្រីពេជ្រ',
    students: [
      { id: '2a-1', no: 1, name: 'វ៉ាន់ រស្មីរ៉ា', gender: 'ស្រី', dob: '27-Feb-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.16, sem1Rank: 1, sem2Avg: 8.56, sem2Rank: 1, yearAvg: 8.36, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '2a-2', no: 2, name: 'រួម វិទាលី', gender: 'ស្រី', dob: '15-Jul-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.87, sem1Rank: 2, sem2Avg: 8.25, sem2Rank: 2, yearAvg: 8.06, yearRank: 2, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '2a-3', no: 3, name: 'ចោម អបមរនថន', gender: 'ស្រី', dob: '8-Mar-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.79, sem1Rank: 3, sem2Avg: 8.05, sem2Rank: 3, yearAvg: 7.92, yearRank: 3, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '2a-4', no: 4, name: 'វ៉ាន់ សុផានី', gender: 'ស្រី', dob: '12-Jun-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.62, sem1Rank: 4, sem2Avg: 8.03, sem2Rank: 5, yearAvg: 7.82, yearRank: 4, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '2B',
    gradeName: 'ថ្នាក់ទី 2B',
    teacherName: 'លេង ចាន់ណារ',
    students: [
      { id: '2b-1', no: 1, name: 'យៀក តារាយុទ្ធ', gender: 'ប្រុស', dob: '25-Dec-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.73, sem1Rank: 1, sem2Avg: 7.56, sem2Rank: 3, yearAvg: 7.64, yearRank: 1, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '2b-2', no: 2, name: 'ផ្លូវស្ដី សុភាវី', gender: 'ស្រី', dob: '12-Jun-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.43, sem1Rank: 4, sem2Avg: 7.59, sem2Rank: 2, yearAvg: 7.51, yearRank: 2, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '2b-3', no: 3, name: 'ស្វាយ តាយកញ្ញា', gender: 'ស្រី', dob: '23-Jan-2019', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.54, sem1Rank: 3, sem2Avg: 7.42, sem2Rank: 4, yearAvg: 7.48, yearRank: 3, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '3A',
    gradeName: 'ថ្នាក់ទី 3A',
    teacherName: 'ប៊ូ ពិសី',
    students: [
      { id: '3a-1', no: 1, name: 'ផុល បុប្ផា', gender: 'ប្រុស', dob: '19-Dec-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.76, sem1Rank: 1, sem2Avg: 8.66, sem2Rank: 1, yearAvg: 8.71, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3a-2', no: 2, name: 'ដឹក រ៉ាវី', gender: 'ស្រី', dob: '18-May-2018', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.60, sem1Rank: 2, sem2Avg: 8.60, sem2Rank: 2, yearAvg: 8.60, yearRank: 2, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '3a-3', no: 3, name: 'ឡៃ វីល័យកញ្ញា', gender: 'ស្រី', dob: '19-Nov-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.18, sem1Rank: 3, sem2Avg: 8.30, sem2Rank: 3, yearAvg: 8.24, yearRank: 3, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '4A',
    gradeName: 'ថ្នាក់ទី 4A',
    teacherName: 'ខេន សាវ៉ា',
    students: [
      { id: '4a-1', no: 1, name: 'យៀក កែវមុន្នីរ័ត្ន', gender: 'ស្រី', dob: '13-Dec-2016', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.87, sem1Rank: 1, sem2Avg: 8.75, sem2Rank: 1, yearAvg: 8.81, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '4a-2', no: 2, name: 'តែ ធូឌី', gender: 'ស្រី', dob: '6-Dec-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.69, sem1Rank: 2, sem2Avg: 8.60, sem2Rank: 2, yearAvg: 8.64, yearRank: 2, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '4a-3', no: 3, name: 'យ៉ុន សំបូរ', gender: 'ស្រី', dob: '18-May-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.20, sem1Rank: 3, sem2Avg: 7.79, sem2Rank: 4, yearAvg: 7.99, yearRank: 3, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '4B',
    gradeName: 'ថ្នាក់ទី 4B',
    teacherName: 'អៀន សុខឿប',
    students: [
      { id: '4b-1', no: 1, name: 'រឿង គន្ធីតា', gender: 'ស្រី', dob: '7-Nov-2016', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.99, sem1Rank: 2, sem2Avg: 8.26, sem2Rank: 1, yearAvg: 8.12, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '4b-2', no: 2, name: 'មុន កាត់រ៉ា', gender: 'ស្រី', dob: '8-Sep-2017', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.03, sem1Rank: 1, sem2Avg: 7.76, sem2Rank: 3, yearAvg: 7.89, yearRank: 2, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '4b-3', no: 3, name: 'យឿ សុផាត់', gender: 'ប្រុស', dob: '9-Dec-2014', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.61, sem1Rank: 4, sem2Avg: 7.86, sem2Rank: 2, yearAvg: 7.73, yearRank: 3, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '5A',
    gradeName: 'ថ្នាក់ទី 5A',
    teacherName: 'ឡាង ម៉ារ៉ាដ្យែ',
    students: [
      { id: '5a-1', no: 1, name: 'ឡៀប ស្រីរោង', gender: 'ប្រុស', dob: '26-08-2016', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.47, sem1Rank: 2, sem2Avg: 7.67, sem2Rank: 1, yearAvg: 7.57, yearRank: 1, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '5a-2', no: 2, name: 'រ៉ា វិចិត្រ', gender: 'ស្រី', dob: '11/24/2015', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.55, sem1Rank: 1, sem2Avg: 7.20, sem2Rank: 3, yearAvg: 7.37, yearRank: 2, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '5a-3', no: 3, name: 'លឿង ស៊ីថា', gender: 'ប្រុស', dob: '2014-11-13', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 6.84, sem1Rank: 3, sem2Avg: 7.12, sem2Rank: 4, yearAvg: 6.98, yearRank: 3, gradeLetter: 'D', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '5B',
    gradeName: 'ថ្នាក់ទី 5B',
    teacherName: 'យ៉ែម សម្បូរស្បៃ',
    students: [
      { id: '5b-1', no: 1, name: 'វ៉ាន់ លីលា', gender: 'ប្រុស', dob: '18/Jun/2015', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.62, sem1Rank: 1, sem2Avg: 8.07, sem2Rank: 1, yearAvg: 7.84, yearRank: 1, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '5b-2', no: 2, name: 'បឹង ចាន់រិទ្ធ', gender: 'ប្រុស', dob: '17/Dec/2015', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.33, sem1Rank: 2, sem2Avg: 7.86, sem2Rank: 2, yearAvg: 7.59, yearRank: 2, gradeLetter: 'C', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
  {
    gradeId: '6A',
    gradeName: 'ថ្នាក់ទី 6A',
    teacherName: 'ឈួន សេរីរ៉ុម',
    students: [
      { id: '6a-1', no: 1, name: 'ប្រូញ រ័ត្នស្រីក្រេប', gender: 'ស្រី', dob: '28-May-2015', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.62, sem1Rank: 1, sem2Avg: 9.18, sem2Rank: 2, yearAvg: 8.90, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '6a-2', no: 2, name: 'នា លីយា', gender: 'ស្រី', dob: '19-Nov-2014', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.55, sem1Rank: 2, sem2Avg: 9.26, sem2Rank: 1, yearAvg: 8.90, yearRank: 1, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '6a-3', no: 3, name: 'ហ៊ុន គឹមធាង', gender: 'ស្រី', dob: '29-Jun-2014', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.44, sem1Rank: 3, sem2Avg: 8.94, sem2Rank: 3, yearAvg: 8.69, yearRank: 3, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '6a-4', no: 4, name: 'ចែម វណ្ណ', gender: 'ស្រី', dob: '30-Apr-2015', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 8.30, sem1Rank: 4, sem2Avg: 8.63, sem2Rank: 6, yearAvg: 8.46, yearRank: 4, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
      { id: '6a-5', no: 5, name: 'វៀង ចេតា', gender: 'ស្រី', dob: '25-May-2014', pob: 'ភូមិរោត ឃុំស្ពានស្រែង', sem1Avg: 7.82, sem1Rank: 5, sem2Avg: 8.64, sem2Rank: 4, yearAvg: 8.23, yearRank: 5, gradeLetter: 'B', absentPermission: 0, absentNoPermission: 0, absentTotal: 0 },
    ],
  },
];
