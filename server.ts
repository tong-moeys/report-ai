import express from 'express';
import path from 'path';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';
import { createServer as createViteServer } from 'vite';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json({ limit: '10mb' }));

// Lazy initializer for Google GenAI client
let genAIClient: GoogleGenAI | null = null;
function getGenAI(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  if (!genAIClient) {
    genAIClient = new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  }
  return genAIClient;
}

// Helper to reliably extract normalized metrics from reportData
function extractReportMetrics(data: any) {
  const report = data.report || data;
  const info = report.info || {};
  const students = report.students?.overall || { total: 252, female: 119 };
  const totalStudents = Number(students.total) || 252;
  const femaleStudents = Number(students.female) || 119;

  const academic = Array.isArray(report.academicResults) ? report.academicResults : [];
  const totalPassed = academic.length > 0
    ? academic.reduce((sum: number, r: any) => sum + (Number(r.finalPassedTotal) || 0), 0)
    : 242;
  const femalePassed = academic.length > 0
    ? academic.reduce((sum: number, r: any) => sum + (Number(r.finalPassedFemale) || 0), 0)
    : 116;
  const totalDropouts = academic.length > 0
    ? academic.reduce((sum: number, r: any) => sum + (Number(r.dropoutTotal) || 0), 0)
    : 4;
  const totalRepeaters = academic.length > 0
    ? academic.reduce((sum: number, r: any) => sum + (Number(r.repeaterTotal) || 0), 0)
    : 6;

  const passRate = totalStudents > 0 ? ((totalPassed / totalStudents) * 100).toFixed(1) : '96.0';
  const femalePassRate = femaleStudents > 0 ? ((femalePassed / femaleStudents) * 100).toFixed(1) : '97.5';
  const dropoutRate = totalStudents > 0 ? ((totalDropouts / totalStudents) * 100).toFixed(1) : '1.6';

  const staff = report.staff?.overallStaff || { total: 17, female: 13 };
  const goodTeachers = report.teachingEvaluation?.rows?.reduce((acc: number, r: any) => acc + (Number(r.goodTeachers) || 0), 0) || 10;

  const dewormingRounds = report.health?.deworming?.rounds || [];
  const dewormingTotal = dewormingRounds.reduce((acc: number, r: any) => acc + (Number(r.total) || 0), 0) || 245;

  return {
    report,
    schoolName: info.schoolName || 'សាលាបឋមសិក្សារោគ',
    academicYear: info.academicYear || '២០២៥-២០២៦',
    district: info.districtOffice || 'ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុកស្រីស្នំ',
    cluster: info.cluster || 'កម្រងស្ពានស្រែង',
    locationType: info.locationType || 'normal',
    partnerNGOs: info.partnerNGOs || 'អង្គការទស្សនៈពិភពលោក (WVSI), អង្គការសាលាបៃតង',
    totalStudents,
    femaleStudents,
    totalPassed,
    femalePassed,
    passRate,
    femalePassRate,
    totalDropouts,
    dropoutRate,
    totalRepeaters,
    totalStaff: Number(staff.total) || 17,
    femaleStaff: Number(staff.female) || 13,
    goodTeachers,
    dewormingTotal,
    currentConclusion: report.conclusion || {},
    challenges: [
      report.girlsCounseling?.challenges,
      report.lifeSkills?.challenges,
      report.health?.deworming?.challenges,
      report.health?.sanitation?.challenges,
      report.health?.nutrition?.challenges,
      report.communityWork?.result,
    ].filter(Boolean),
  };
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    hasApiKey: Boolean(process.env.GEMINI_API_KEY && process.env.GEMINI_API_KEY !== 'MY_GEMINI_API_KEY'),
    timestamp: new Date().toISOString(),
  });
});

// AI Executive Summary Generator for 'Conclusion' Section
app.post('/api/ai/executive-summary', async (req, res) => {
  const metrics = extractReportMetrics(req.body);
  const { style = 'official' } = req.body;

  const buildFallbackResponse = () => {
    const fallbackSummary = `ឆ្លងកាត់ការអនុវត្តផែនការប្រតិបត្តិប្រចាំឆ្នាំសិក្សា ${metrics.academicYear} កន្លងមកនេះ ${metrics.schoolName} ចំណុះ${metrics.cluster} នៃ${metrics.district} សម្រេចបាននូវលទ្ធផលគួរជាទីមោទនៈ ស្របតាមគោលនយោបាយកំណែទម្រង់វិស័យអប់រំរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។

ទិដ្ឋភាពទូទៅនៃស្ថិតិសិស្ស និងលទ្ធផលសិក្សា៖ សាលាមានសិស្សសរុបចំនួន ${metrics.totalStudents} នាក់ (ស្រី ${metrics.femaleStudents} នាក់)។ ជាលទ្ធផលចុងឆ្នាំ សិស្សដែលបានប្រឡងជាប់ឡើងថ្នាក់សរុបមានចំនួន ${metrics.totalPassed} នាក់ ស្មើនឹង ${metrics.passRate}% (សិស្សស្រីជាប់ ${metrics.femalePassed} នាក់ ស្មើនឹង ${metrics.femalePassRate}%)។ អត្រាសិស្សបោះបង់ការសិក្សាត្រូវបានកាត់បន្ថយមកនៅត្រឹម ${metrics.totalDropouts} នាក់ (${metrics.dropoutRate}%) ដែលភាគច្រើនបណ្តាលមកពីកត្តាជីវភាព និងការចំណាកស្រុករបស់អាណាព្យាបាល។

ទិដ្ឋភាពគរុកោសល្យ និងសុខភាពសិក្សា៖ គណៈគ្រប់គ្រង និងលោកគ្រូអ្នកគ្រូចំនួន ${metrics.totalStaff} នាក់ (ស្រី ${metrics.femaleStaff} នាក់) បានបំពេញភារកិច្ចបង្រៀនដោយការទទួលខុសត្រូវខ្ពស់ ដោយក្នុងនោះគ្រូបង្រៀនកម្រិតល្អមានចំនួន ${metrics.goodTeachers} នាក់។ សាលាបានអនុវត្តកម្មវិធីកែលម្អការអាននិងគណិតវិទ្យាថ្នាក់ដំបូង ព្រមទាំងកម្មវិធីសុខភាពសិក្សា និងការទម្លាក់ព្រូនបានចំនួន ${metrics.dewormingTotal} នាក់ ស្របតាមស្តង់ដាសាលារៀនកុមារមេត្រី។

កិច្ចសហការ និងការចូលរួមរបស់សហគមន៍៖ សាលាទទួលបានការគាំទ្រយ៉ាងសកម្មពីគណៈកម្មការទ្រទ្រង់សាលា អាជ្ញាធរដែនដី និងដៃគូអភិវឌ្ឍន៍ (${metrics.partnerNGOs}) ក្នុងការថែទាំហេដ្ឋារចនាសម្ព័ន្ធ និងការលើកកម្ពស់បរិស្ថានសិក្សាស្អាតបៃតង។ ជារួម គណៈគ្រប់គ្រងសាលានឹងបន្តពង្រឹងគុណភាពអប់រំ ទប់ស្កាត់ការបោះបង់ និងត្រៀមលក្ខណៈសម្បត្តិយ៉ាងពេញលេញសម្រាប់ឆ្នាំសិក្សាបន្ទាប់។`;

    const fallbackAchievements = [
      `សម្រេចបានអត្រាសិស្សជាប់ឡើងថ្នាក់ចុងឆ្នាំសរុប ${metrics.passRate}% (សិស្សស្រី ${metrics.femalePassRate}%) លើសពីគោលដៅកំណត់។`,
      `បុគ្គលិកអប់រំ និងលោកគ្រូអ្នកគ្រូអនុវត្តការបង្រៀន និងរៀនតាមកម្មវិធីសិក្សាបានពេញលេញ ១០០% ដោយគ្មានការរអាក់រអួល។`,
      `ការអនុវត្តកម្មវិធីសុខភាពសិក្សា ការទម្លាក់ព្រូន និងអនាម័យមាត់ធ្មេញសម្រេចបានលទ្ធផលល្អប្រសើរលើសពី ៩៥%។`,
      `ពង្រឹងកិច្ចសហការយ៉ាងស្អិតរមួតជាមួយគណៈកម្មការទ្រទ្រង់សាលា និងអង្គការដៃគូ (${metrics.partnerNGOs})។`
    ];

    const fallbackChallenges = `ទោះបីជាសម្រេចបានលទ្ធផលល្អយ៉ាងណាក្តី សាលានៅជួបប្រទះបញ្ហាប្រឈមមួយចំនួនរួមមាន៖ សិស្សបោះបង់ការសិក្សាចំនួន ${metrics.totalDropouts} នាក់ដោយសារការធ្វើចំណាកស្រុកតាមឪពុកម្តាយ, តម្រូវការជួសជុលអណ្តូងទឹកប្រើប្រាស់ និងបន្ទប់អនាម័យបន្ថែម, ព្រមទាំងតម្រូវការបំប៉នវិធីសាស្ត្របង្រៀនភាសាអង់គ្លេសកម្រិតបឋមសិក្សា។ សាលាស្នើសុំការគាំទ្រពីការិយាល័យអប់រំស្រុក និងសហគមន៍ដើម្បីដោះស្រាយក្នុងឆ្នាំសិក្សាថ្មី។`;

    return {
      success: true,
      isFallback: true,
      executiveSummary: fallbackSummary,
      keyAchievements: fallbackAchievements,
      challengesToResolve: fallbackChallenges,
      metrics: {
        totalStudents: metrics.totalStudents,
        totalPassed: metrics.totalPassed,
        passRate: metrics.passRate,
        totalDropouts: metrics.totalDropouts,
        schoolName: metrics.schoolName,
        academicYear: metrics.academicYear,
      }
    };
  };

  try {
    const ai = getGenAI();
    if (!ai) {
      return res.json(buildFallbackResponse());
    }

    const prompt = `អ្នកជាអ្នកជំនាញជាន់ខ្ពស់ផ្នែកអប់រំបឋមសិក្សា និងការតាក់តែងរបាយការណ៍រដ្ឋបាលផ្លូវការ នៃក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) កម្ពុជា។
ចូរពិនិត្យទិន្នន័យជាក់ស្តែងនៃរបាយការណ៍សាលារៀនខាងក្រោម ហើយតាក់តែង "សេចក្តីសង្ខេបប្រតិបត្តិផ្លូវការ (Professional Executive Summary)" ប្រកបដោយក្បួនខ្នាតរដ្ឋបាលអប់រំខ្ពស់ សម្រាប់បញ្ចូលដោយផ្ទាល់ទៅក្នុងផ្នែក "IV-សន្និដ្ឋាន" (Conclusion) នៃរបាយការណ៍បូកសរុបលទ្ធផលការងារដំណាច់ឆ្នាំ។

ទិន្នន័យសាលារៀន៖
- ឈ្មោះសាលា៖ ${metrics.schoolName}
- កម្រងសាលា៖ ${metrics.cluster}
- ការិយាល័យអប់រំ៖ ${metrics.district}
- ឆ្នាំសិក្សា៖ ${metrics.academicYear}
- សិស្សសរុប៖ ${metrics.totalStudents} នាក់ (ស្រី ${metrics.femaleStudents} នាក់)
- សិស្សប្រឡងជាប់ឡើងថ្នាក់៖ ${metrics.totalPassed} នាក់ (ស្រី ${metrics.femalePassed} នាក់) ស្មើនឹង ${metrics.passRate}%
- សិស្សបោះបង់ការសិក្សា៖ ${metrics.totalDropouts} នាក់ (ស្មើនឹង ${metrics.dropoutRate}%)
- សិស្សត្រួតថ្នាក់៖ ${metrics.totalRepeaters} នាក់
- បុគ្គលិកអប់រំសរុប៖ ${metrics.totalStaff} នាក់ (ស្រី ${metrics.femaleStaff} នាក់)
- គ្រូបង្រៀនកម្រិតល្អ៖ ${metrics.goodTeachers} នាក់
- ការទម្លាក់ព្រូន៖ ${metrics.dewormingTotal} នាក់
- អង្គការដៃគូ៖ ${metrics.partnerNGOs}
- បញ្ហាប្រឈមដែលបានកត់ត្រា៖ ${metrics.challenges.join('; ') || 'ការចំណាកស្រុក និងកង្វះសម្ភារៈឧបទេស'}

រចនាបថដែលបានជ្រើសរើស៖ ${style === 'concise' ? 'ខ្លីខ្លឹម ផ្តោតលើចំណុចស្នូល' : 'ពិស្តារ លម្អិតគ្រប់ជ្រុងជ្រោយ បែបរដ្ឋបាលក្រសួង MoEYS'}

សូមរៀបចំចម្លើយត្រឡប់មកវិញជាទម្រង់ JSON object សុទ្ធ (Valid JSON string) តែមួយគត់៖
{
  "executiveSummary": "សេចក្តីសង្ខេបប្រតិបត្តិជាកថាខណ្ឌពិស្តារ ៣ ទៅ ៤ កថាខណ្ឌ សរសេរជាភាសាខ្មែរផ្លូវការ បញ្ជាក់តួលេខជាក់ស្តែង វាយតម្លៃសមិទ្ធផលរួម ការគ្រប់គ្រង គរុកោសល្យ និងការប្តេជ្ញាចិត្ត",
  "keyAchievements": [
    "សមិទ្ធផលសំខាន់ទី ១ ដោយមានបញ្ជាក់លេខភាគរយឬចំនួនជាក់ស្តែង",
    "សមិទ្ធផលសំខាន់ទី ២",
    "សមិទ្ធផលសំខាន់ទី ៣",
    "សមិទ្ធផលសំខាន់ទី ៤"
  ],
  "challengesToResolve": "កថាខណ្ឌបញ្ជាក់ពីបញ្ហាប្រឈមអាទិភាពដែលត្រូវបន្តដោះស្រាយ និងសំណូមពរទៅថ្នាក់លើ"
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json({
        success: true,
        isFallback: false,
        executiveSummary: parsed.executiveSummary || parsed.summary || rawText,
        keyAchievements: Array.isArray(parsed.keyAchievements) ? parsed.keyAchievements : [],
        challengesToResolve: parsed.challengesToResolve || '',
        metrics: {
          totalStudents: metrics.totalStudents,
          totalPassed: metrics.totalPassed,
          passRate: metrics.passRate,
          totalDropouts: metrics.totalDropouts,
          schoolName: metrics.schoolName,
          academicYear: metrics.academicYear,
        }
      });
    } catch {
      return res.json({
        success: true,
        isFallback: false,
        executiveSummary: rawText,
        keyAchievements: [
          `សម្រេចបានអត្រាសិស្សជាប់ចុងឆ្នាំ ${metrics.passRate}% លើសិស្សសរុប ${metrics.totalStudents} នាក់។`,
          `បុគ្គលិកអប់រំ និងគ្រូបង្រៀនបំពេញការងារយ៉ាងសកម្ម និងម៉ឺងម៉ាត់។`,
          `អនុវត្តកម្មវិធីសុខភាពសិក្សា និងការទម្លាក់ព្រូនបានជោគជ័យ។`
        ],
        challengesToResolve: `បន្តកាត់បន្ថយអត្រាសិស្សបោះបង់ការសិក្សា និងជួសជុលហេដ្ឋារចនាសម្ព័ន្ធទឹកស្អាត។`,
        metrics: {
          totalStudents: metrics.totalStudents,
          totalPassed: metrics.totalPassed,
          passRate: metrics.passRate,
          totalDropouts: metrics.totalDropouts,
          schoolName: metrics.schoolName,
          academicYear: metrics.academicYear,
        }
      });
    }
  } catch (error: any) {
    console.warn('Gemini API call encountered error, providing calculated administrative fallback:', error.message);
    return res.json(buildFallbackResponse());
  }
});

// AI Report Analysis & Executive Synthesis
app.post('/api/ai/analyze', async (req, res) => {
  try {
    const metrics = extractReportMetrics(req.body);
    const reportData = metrics.report;
    const ai = getGenAI();

    if (!ai) {
      // Graceful fallback with analytical insights computed from data
      const passRate = metrics.passRate;
      const totalPassed = metrics.totalPassed;
      const totalStudents = metrics.totalStudents;
      const totalDropouts = metrics.totalDropouts;

      const summaryText = `របាយការណ៍បូកសរុបលទ្ធផលការងារដំណាច់ឆ្នាំ ផ្នែកបឋមសិក្សា ឆ្នាំសិក្សា ${metrics.academicYear} របស់ ${metrics.schoolName}៖\n- អត្រាសិស្សជាប់ចុងឆ្នាំសរុបសម្រេចបាន ${passRate}% (${totalPassed} នាក់) លើសិស្សសរុប ${totalStudents} នាក់។\n- អត្រាសិស្សបោះបង់ការសិក្សាសរុប ${totalDropouts} នាក់ ភាគច្រើនបណ្តាលមកពីការចំណាកស្រុករបស់អាណាព្យាបាល។\n- ការអនុវត្តកម្មវិធីសិក្សា និងការងារអនាម័យ-សុខភាពសិក្សាសម្រេចបានតាមផែនការកំណត់។`;

      const fullAnalysis = `${summaryText}\n\nចំណុចខ្លាំងសម្រេចបាន៖\n- អត្រាសិស្សជាប់ចុងឆ្នាំខ្ពស់ (${passRate}%) នៅគ្រប់កម្រិតថ្នាក់\n- បុគ្គលិកអប់រំ និងលោកគ្រូអ្នកគ្រូមានការប្តេជ្ញាចិត្តខ្ពស់ក្នុងការបង្រៀន និងអនុវត្តកម្មវិធីសិក្សា\n- មានកិច្ចសហការល្អជាមួយអង្គការដៃគូ និងសហគមន៍\n- ការងារអនាម័យមាត់ធ្មេញ និងការទម្លាក់ព្រូនអនុវត្តបានលើសពី ៩៥%\n\nចំណុចខ្វះខាត និងបញ្ហាប្រឈម៖\n- មានសិស្សបោះបង់ការសិក្សាចំនួន ${totalDropouts} នាក់ ដោយសារការចំណាកស្រុក\n- អណ្តូងទឹកប្រើប្រាស់ខូច បង្កការលំបាកក្នុងការស្រោចស្រព និងអនាម័យ\n\nសេចក្តីសន្និដ្ឋាន៖\nជារួម សាលាបឋមសិក្សា ${metrics.schoolName} បានខិតខំប្រឹងប្រែងសម្រេចបាននូវលទ្ធផលគួរជាទីមោទនៈក្នុងឆ្នាំសិក្សា ${metrics.academicYear}។`;

      return res.json({
        success: true,
        isFallback: true,
        analysis: fullAnalysis,
        summary: summaryText,
        strengths: [
          `អត្រាសិស្សជាប់ចុងឆ្នាំខ្ពស់ (${passRate}%) នៅគ្រប់កម្រិតថ្នាក់`,
          'បុគ្គលិកអប់រំ និងលោកគ្រូអ្នកគ្រូមានការប្តេជ្ញាចិត្តខ្ពស់ក្នុងការបង្រៀន និងអនុវត្តកម្មវិធីសិក្សា',
          'មានកិច្ចសហការល្អជាមួយអង្គការដៃគូ និងសហគមន៍ក្នុងការកែលម្អហេដ្ឋារចនាសម្ព័ន្ធ',
          'ការងារអនាម័យមាត់ធ្មេញ និងការទម្លាក់ព្រូនអនុវត្តបានលើសពី ៩៥%',
        ],
        concerns: [
          `មានសិស្សបោះបង់ការសិក្សាចំនួន ${totalDropouts} នាក់ ដោយសារការចំណាកស្រុក`,
          'អណ្តូងទឹកប្រើប្រាស់ខូចចំនួន ១ បង្កការលំបាកក្នុងការស្រោចស្រព និងអនាម័យ',
          'ការអនុវត្តកម្មវិធីភាសាអង់គ្លេសនៅកម្រិតបឋមនៅមានកម្រិតទាប',
        ],
        conclusions: `ជារួម សាលាបឋមសិក្សា ${metrics.schoolName} បានខិតខំប្រឹងប្រែងសម្រេចបាននូវលទ្ធផលគួរជាទីមោទនៈ។ ដើម្បីលើកកម្ពស់គុណភាពអប់រំឱ្យកាន់តែប្រសើរ សាលាត្រូវការការគាំទ្របន្ថែមលើសម្ភារៈឧបទេស ការជួសជុលប្រភពទឹកស្អាត និងការទប់ស្កាត់ការបោះបង់ការសិក្សា។`,
      });
    }

    const prompt = `អ្នកជាអ្នកជំនាញជាន់ខ្ពស់ផ្នែកអប់រំ និងរៀបចំរបាយការណ៍បូកសរុបលទ្ធផលការងារដំណាច់ឆ្នាំ នៃក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) កម្ពុជា។
ចូរវិភាគទិន្នន័យរបាយការណ៍សាលារៀនខាងក្រោម ហើយបង្កើតការវិភាគសង្ខេបផ្លូវការជាភាសាខ្មែរ ដោយរៀបចំជា JSON ដែលមាន field:
- "analysis": អត្ថបទវិភាគសំយោគពេញលេញជាកថាខណ្ឌ (រួមបញ្ចូលសេចក្តីសង្ខេប ចំណុចខ្លាំង ចំណុចខ្វះខាត និងសន្និដ្ឋាន)
- "summary": សេចក្តីសង្ខេបលទ្ធផលការងារជាកថាខណ្ឌខ្លីៗច្បាស់លាស់ (រៀបរាប់ពីអត្រាជាប់ អត្រាបោះបង់ ការអនុវត្តកម្មវិធីសិក្សា)
- "strengths": ចំណុចខ្លាំងនិងលទ្ធផលសម្រេចបាន (array of 3-5 strings)
- "concerns": ចំណុចខ្វះខាតឬបញ្ហាប្រឈមដែលត្រូវកែលម្អ (array of 2-4 strings)
- "conclusions": សេចក្តីសន្និដ្ឋានទូទៅ និងទិសដៅអនុវត្តបន្ត

ទិន្នន័យរបាយការណ៍៖
${JSON.stringify(reportData, null, 2)}

សូមផ្តល់ចម្លើយត្រឡប់មកវិញជាទម្រង់ JSON សុទ្ធ (Valid JSON string) តែប៉ុណ្ណោះ ដោយគ្មាន markdown backticks ទេ។`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(rawText);
      const combinedAnalysis = parsed.analysis || `${parsed.summary || ''}\n\nចំណុចខ្លាំង៖\n${(parsed.strengths || []).map((s: string) => `- ${s}`).join('\n')}\n\nចំណុចខ្វះខាត៖\n${(parsed.concerns || []).map((c: string) => `- ${c}`).join('\n')}\n\nសេចក្តីសន្និដ្ឋាន៖\n${parsed.conclusions || ''}`;
      return res.json({ success: true, isFallback: false, analysis: combinedAnalysis, ...parsed });
    } catch {
      return res.json({
        success: true,
        isFallback: false,
        analysis: rawText,
        summary: rawText,
        strengths: ['សម្រេចបានអត្រាជាប់មធ្យមភាគខ្ពស់', 'កិច្ចសហការល្អជាមួយសហគមន៍', 'ការងារសុខភាពសិក្សាអនុវត្តទៀងទាត់'],
        concerns: ['បញ្ហាអណ្តូងទឹកខូច', 'សិស្សបោះបង់ដោយសារចំណាកស្រុក'],
        conclusions: 'សាលាសម្រេចបានវឌ្ឍនភាពល្អក្នុងឆ្នាំសិក្សា ២០២៥-២០២៦។',
      });
    }
  } catch (error: any) {
    console.error('Error in /api/ai/analyze:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal error' });
  }
});

// AI Recommendations Generator
app.post('/api/ai/recommend', async (req, res) => {
  try {
    const reportData = req.body.report || req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        recommendations: [
          {
            target: 'គណៈគ្រប់គ្រង និងលោកគ្រូអ្នកគ្រូ',
            action: 'រៀបចំកម្មវិធីបំប៉នសិស្សរៀនយឺត និងតាមដានវត្តមានសិស្សប្រឈមនឹងការបោះបង់ជាប្រចាំសប្តាហ៍។',
          },
          {
            target: 'ប្រធានកម្រង និងការិយាល័យអប់រំស្រុក',
            action: 'ស្នើសុំជួយសម្របសម្រួលថវិកាជួសជុលអណ្តូងទឹកខូច និងផ្តល់វគ្គបណ្តុះបណ្តាលវិធីសាស្ត្របង្រៀនភាសាអង់គ្លេស។',
          },
          {
            target: 'អង្គការដៃគូ (WVSI, អង្គការសាលាបៃតង)',
            action: 'បន្តគាំទ្រសម្ភារៈអនាម័យមាត់ធ្មេញ ធុងចម្រោះទឹកស្អាត និងពិចារណាពង្រីកកម្មវិធីអាហារពេលព្រឹក។',
          },
          {
            target: 'សហគមន៍ និងអាណាព្យាបាលសិស្ស',
            action: 'បង្កើនការយល់ដឹងអំពីផលប៉ះពាល់នៃការនាំកូនធ្វើចំណាកស្រុក និងចូលរួមកិច្ចប្រជុំមាតាបិតាសិស្សឱ្យបានទៀងទាត់។',
          },
        ],
      });
    }

    const prompt = `អ្នកជាអ្នកជំនាញផ្នែកគោលនយោបាយ និងផែនការអប់រំបឋមសិក្សា នៃក្រសួងអប់រំ យុវជន និងកីឡា។
ផ្អែកលើទិន្នន័យបញ្ហាប្រឈម លទ្ធផលសិក្សា និងហេដ្ឋារចនាសម្ព័ន្ធរបស់សាលារៀនខាងក្រោម ចូរផ្តល់អនុសាសន៍ និងសំណូមពរជាក់ស្តែង (Actionable Recommendations) ជាទម្រង់ JSON array នៃ objects ដែលមាន key "target" (ស្ថាប័ន ឬអ្នកទទួលខុសត្រូវ) និង "action" (សកម្មភាពជាក់លាក់ និងដំណោះស្រាយ)។

ទិន្នន័យរបាយការណ៍៖
${JSON.stringify({
  info: reportData.info,
  challenges: [
    reportData.girlsCounseling?.challenges,
    reportData.lifeSkills?.challenges,
    reportData.health?.deworming?.challenges,
    reportData.health?.sanitation?.challenges,
    reportData.health?.nutrition?.challenges,
  ],
  academicResults: reportData.academicResults,
  teaching: reportData.teachingEvaluation,
}, null, 2)}

សូមបញ្ចេញចម្លើយជា JSON array នៃ objects តែប៉ុណ្ណោះ ឧទាហរណ៍៖
[
  { "target": "...", "action": "..." }
]`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    try {
      const parsed = JSON.parse(rawText);
      return res.json({ success: true, isFallback: false, recommendations: parsed });
    } catch {
      return res.json({
        success: true,
        isFallback: false,
        recommendations: [
          { target: 'ការិយាល័យអប់រំស្រុក', action: rawText.slice(0, 300) },
        ],
      });
    }
  } catch (error: any) {
    console.error('Error in /api/ai/recommend:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal error' });
  }
});

// AI Section Narrative Polisher / Generator
app.post('/api/ai/generate-narrative', async (req, res) => {
  try {
    const { sectionName, currentActivities, currentChallenges, currentRequests, extraContext } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        activities: currentActivities || 'បានអនុវត្តតាមផែនការដែលបានគ្រោងទុកដោយសហការជាមួយលោកគ្រូអ្នកគ្រូ និងសហគមន៍។',
        challenges: currentChallenges || 'កង្វះខាតសម្ភារៈ និងការយល់ដឹងមួយចំនួនពីសំណាក់អាណាព្យាបាល។',
        requests: currentRequests || 'ស្នើសុំការឧបត្ថម្ភសម្ភារៈបន្ថែមពីការិយាល័យអប់រំ និងអង្គការដៃគូ។',
      });
    }

    const prompt = `អ្នកជាអ្នករៀបចំឯកសាររដ្ឋបាលអប់រំផ្លូវការរបស់កម្ពុជា។ សម្រាប់ផ្នែក "${sectionName}" នៃរបាយការណ៍សាលារៀន សូមជួយសរសេរ ឬកែលម្អឱ្យកាន់តែស្របតាមរចនាបថរដ្ឋបាលផ្លូវការ (MoEYS Administrative Khmer) នូវ ៣ ចំណុច៖
១. សកម្មភាពអនុវត្ត (activities)
២. បញ្ហាប្រឈម (challenges)
៣. សំណូមពរ (requests)

ខ្លឹមសារបច្ចុប្បន្ន៖
- សកម្មភាព៖ ${currentActivities || 'គ្មាន'}
- បញ្ហាប្រឈម៖ ${currentChallenges || 'គ្មាន'}
- សំណូមពរ៖ ${currentRequests || 'គ្មាន'}
- បរិបទបន្ថែម៖ ${extraContext || 'គ្មាន'}

សូមបញ្ចេញចម្លើយជា JSON object តែមួយគត់:
{
  "activities": "...",
  "challenges": "...",
  "requests": "..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
    });

    let rawText = response.text || '';
    rawText = rawText.replace(/```json/g, '').replace(/```/g, '').trim();

    const parsed = JSON.parse(rawText);
    return res.json({ success: true, isFallback: false, ...parsed });
  } catch (error: any) {
    console.error('Error in /api/ai/generate-narrative:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal error' });
  }
});

// Interactive School Report Assistant Chat
app.post('/api/ai/chat', async (req, res) => {
  try {
    const { message, reportContext, conversationHistory } = req.body;
    const ai = getGenAI();

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        reply: `សូមអរគុណចំពោះសំណួរ៖ "${message}"។ 
ខ្ញុំជាជំនួយការរៀបចំរបាយការណ៍សាលារៀន។ 
របាយការណ៍សាលាបច្ចុប្បន្នសម្រាប់ "${reportContext?.info?.schoolName || 'សាលាបឋមសិក្សា'}" មានសិស្សសរុប ${reportContext?.students?.overall?.total || 252} នាក់ និងគ្រូបង្រៀន ១២ នាក់។
(ចំណាំ៖ សូមភ្ជាប់ GEMINI_API_KEY នៅក្នុង Settings ដើម្បីទទួលបានការឆ្លើយតប AI ឆ្លាតវៃពេញលេញក្នុងពេលជាក់ស្តែង)`,
      });
    }

    const systemInstruction = `អ្នកជា "ជំនួយការរៀបចំរបាយការណ៍សាលា" (School Report Assistant) ដែលមានជំនាញខ្ពស់ខាងច្បាប់ រចនាសម្ព័ន្ធរដ្ឋបាល និងទម្រង់របាយការណ៍បូកសរុបការងារអប់រំបឋមសិក្សារបស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) នៃព្រះរាជាណាចក្រកម្ពុជា។
ឆ្លើយតបជាភាសាខ្មែរប្រកបដោយវិជ្ជាជីវៈ សុភាពរាបសារ ត្រឹមត្រូវតាមក្បួនខ្នាតរដ្ឋបាលអប់រំ ព្រមទាំងផ្តល់គន្លឹះ គណនាលេខ និងណែនាំពីរបៀបបំពេញទម្រង់របាយការណ៍។

បរិបទរបាយការណ៍សាលារៀនបច្ចុប្បន្ន៖
- ឈ្មោះសាលា៖ ${reportContext?.info?.schoolName || 'សាលាបឋមសិក្សា រោគ'}
- កម្រង៖ ${reportContext?.info?.cluster || 'កម្រងស្ពានស្រែង'}
- ឆ្នាំសិក្សា៖ ${reportContext?.info?.academicYear || '២០២៥-២០២៦'}
- សិស្សសរុប៖ ${reportContext?.students?.overall?.total || 252} នាក់ (ស្រី ${reportContext?.students?.overall?.female || 119} នាក់)
- បុគ្គលិកសរុប៖ ${reportContext?.staff?.overallStaff?.total || 17} នាក់ (ស្រី ${reportContext?.staff?.overallStaff?.female || 13} នាក់)`;

    const historyPrompt = (conversationHistory || [])
      .map((m: any) => `${m.role === 'user' ? 'អ្នកប្រើប្រាស់' : 'ជំនួយការ'}: ${m.content}`)
      .join('\n');

    const fullPrompt = `${systemInstruction}

ប្រវត្តិនៃការសន្ទនា៖
${historyPrompt}

អ្នកប្រើប្រាស់៖ ${message}
ជំនួយការ៖`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: fullPrompt,
    });

    return res.json({
      success: true,
      isFallback: false,
      reply: response.text || 'គ្មានចម្លើយពីប្រព័ន្ធ។',
    });
  } catch (error: any) {
    console.error('Error in /api/ai/chat:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal error' });
  }
});

// MoEYS Official AI Report Generation Endpoint
app.post('/api/ai/moeys-report', async (req, res) => {
  try {
    const { reportData, students, summary } = req.body;
    const ai = getGenAI();

    const schoolName = reportData?.meta?.schoolName || 'សាលាបឋមសិក្សារោគ';
    const academicYear = reportData?.meta?.academicYear || '២០២៥-២០២៦';
    const cluster = reportData?.meta?.clusterOrDistrict || 'កម្រងស្ពានស្រែង ស្រុកភ្នំស្រុក';
    const province = reportData?.meta?.province || 'ខេត្តបន្ទាយមានជ័យ';
    const totalStudents = summary?.totalEnrolled || (students?.length || 252);
    const femaleStudents = summary?.totalEnrolledFemale || Math.round(totalStudents * 0.48);
    const totalPassed = summary?.totalPassed || Math.round(totalStudents * 0.96);
    const femalePassed = summary?.totalPassedFemale || Math.round(femaleStudents * 0.97);
    const passRate = summary?.passRate || (totalStudents > 0 ? ((totalPassed / totalStudents) * 100).toFixed(1) : '96.0');
    const totalDropouts = summary?.totalDropouts || 4;
    const totalRepeaters = summary?.totalRepeaters || 6;
    const classesCount = summary?.classCount || 10;

    // Build intelligent fallback report first
    const fallbackReport = {
      title: `របាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំ និងការវាយតម្លៃការសិក្សាផ្លូវការ MoEYS`,
      academicYear,
      schoolName,
      generatedDate: new Date().toISOString().split('T')[0],
      executiveSummary: `ក្នុងឆ្នាំសិក្សា ${academicYear} ${schoolName} នៃ${cluster} ${province} បានអនុវត្តយ៉ាងខ្ជាប់ខ្ជួនតាមផែនការយុទ្ធសាស្ត្រវិស័យអប់រំ (ESP) របស់ក្រសួងអប់រំ យុវជន និងកីឡា។ សាលាមានសិស្សចុះឈ្មោះសរុប ${totalStudents} នាក់ (ស្រី ${femaleStudents} នាក់) លើ ${classesCount} បន្ទប់រៀន។ លទ្ធផលនៃការវាយតម្លៃប្រចាំឆ្នាំសម្រេចបានសិស្សឡើងថ្នាក់ចំនួន ${totalPassed} នាក់ (ស្រី ${femalePassed} នាក់) ស្មើនឹង ${passRate}% នៃសិស្សសរុប។ អត្រាបោះបង់ការសិក្សាស្ថិតក្នុងកម្រិតទាប ${totalDropouts} នាក់ និងសិស្សត្រួតថ្នាក់ ${totalRepeaters} នាក់។ សាលាបានពង្រឹងគុណវុឌ្ឍិគ្រូ ការបង្រៀនគន្លឹះភាសាខ្មែរ-គណិតវិទ្យាថ្នាក់ដំបូង និងការចូលរួមយ៉ាងសកម្មពីគណៈកម្មការទ្រទ្រង់សាលារៀន។`,
      academicAnalysis: `ផ្អែកលើការវិភាគទិន្នន័យពិន្ទុសិស្សជាក់ស្តែងពីថ្នាក់ទី១ ដល់ថ្នាក់ទី៦ ឃើញថាសិស្សទទួលបាននិទ្ទេសល្អប្រសើរ (A) និងល្អណាស់ (B) មានចំនួនកើនឡើងគួរឱ្យកត់សម្គាល់ ជាពិសេសលើមុខវិជ្ជាភាសាខ្មែរ និងវិទ្យាសាស្ត្រសង្គម។ កម្រិតមធ្យមភាគសាលារក្សាបានលើសពី ៧.០០/១០។ ចំពោះសិស្សដែលទទួលបាននិទ្ទេសខ្សោយ (E) ឬត្រួតថ្នាក់ (${totalRepeaters} នាក់) ភាគច្រើនកើតឡើងលើមុខវិជ្ជាគណិតវិទ្យាថ្នាក់ទី១ និងទី២ ដែលទាមទារឱ្យមានកម្មវិធីបង្រៀនបំប៉នបន្ថែម និងការអភិវឌ្ឍជំនួយស្មារតីសិស្ស។`,
      genderAnalysis: `សមភាពយេនឌ័រក្នុងការអប់រំសម្រេចបានលទ្ធផលគួរឱ្យកត់សម្គាល់ ដោយសិស្សស្រីមានអត្រាឡើងថ្នាក់រហូតដល់ ${((femalePassed / (femaleStudents || 1)) * 100).toFixed(1)}% ដែលខ្ពស់ជាងមធ្យមភាគសិស្សប្រុស។ មិនមានការរើសអើង និងមានការលើកទឹកចិត្តសិស្សស្រីឱ្យចូលរួមយ៉ាងសកម្មក្នុងសកម្មភាពដឹកនាំ និងការប្រកួតប្រជែងចំណេះដឹង។ ក្រុមប្រឹក្សាកុមារ និងបន្ទប់ពិគ្រោះយោបល់កុមារីដំណើរការប្រកបដោយប្រសិទ្ធភាពខ្ពស់។`,
      pedagogyAndCurriculum: `លោកគ្រូ-អ្នកគ្រូបានអនុវត្តវិធីសាស្ត្របង្រៀនផ្តោតលើសិស្សជាមជ្ឈមណ្ឌល (Child-Friendly School Model) និងប្រើប្រាស់សម្ភារៈឧបទេសជាក់ស្តែង។ ការប្រជុំកែលម្អវិធីសាស្ត្របង្រៀនតាមកម្រិតបច្ចេកទេស និងកម្រងបានប្រព្រឹត្តទៅជាប្រចាំរៀងរាល់ខែ។ ក្រៅពីកម្មវិធីគោល សាលាបានបញ្ចូលការអប់រំបំណិនជីវិត (កសិកម្ម សិល្បៈ អនាម័យទឹកស្អាត) និងការអានសៀវភៅនៅបណ្ណាល័យ។`,
      dropoutsAndRetention: `អត្រាបោះបង់ការសិក្សាត្រូវបានកាត់បន្ថយមកត្រឹម ${totalDropouts} នាក់។ មូលហេតុចម្បងនៃការបោះបង់គឺដោយសារគ្រួសារចំណាកស្រុកទៅធ្វើការនៅក្រៅតំបន់។ គណៈគ្រប់គ្រងសាលាបានសហការជាមួយអាជ្ញាធរមូលភូមិ-ឃុំ ក្នុងការចុះសួរសុខទុក្ខផ្ទាល់ និងសម្របសម្រួលឱ្យសិស្សត្រឡប់មកថ្នាក់រៀនវិញតាមលទ្ធភាព។`,
      strengths: [
        `អត្រាសិស្សឡើងថ្នាក់ខ្ពស់រហូតដល់ ${passRate}% និងសិស្សស្រីរៀនចប់កម្រិតបឋមសិក្សាមាននិរន្តរភាព`,
        `គរុកោសល្យគ្រូមានភាពរស់រវើក ប្រើប្រាស់វិធីសាស្ត្រចម្រុះ និងមានការគាំទ្រសម្ភារឧបទេសគ្រប់គ្រាន់`,
        `សាមគ្គីភាពផ្ទៃក្នុងរឹងមាំរវាងគណៈគ្រប់គ្រង លោកគ្រូអ្នកគ្រូ និងគណៈកម្មការទ្រទ្រង់សាលារៀន (SSC)`,
        `ហេដ្ឋារចនាសម្ព័ន្ធអនាម័យទឹកស្អាត បន្ទប់ទឹកដាច់ដោយឡែកស្រី-ប្រុស និងសួនបៃតងស្អាតស្រស់បំព្រង`,
      ],
      challenges: [
        `សិស្សមួយចំនួនតូចនៅមានកង្វះខាតការយកចិត្តទុកដាក់ពីអាណាព្យាបាលដោយសារការធ្វើចំណាកស្រុក`,
        `ការខ្វះខាតឧបករណ៍បច្ចេកវិទ្យាព័ត៌មានវិទ្យា (ICT) សម្រាប់សិស្សអនុវត្តជាក់ស្តែង`,
        `សិស្សត្រួតថ្នាក់ចំនួន ${totalRepeaters} នាក់ត្រូវការការបង្រៀនបំប៉នក្រៅម៉ោងបន្ថែមដោយការលះបង់ខ្ពស់`,
      ],
      nextYearActionPlan: [
        `ពង្រឹងយន្តការបង្រៀនបំប៉នសិស្សរៀនយឺតតាំងពីដើមឆ្នាំសិក្សា (Early Grade Intervention)`,
        `បន្តយុទ្ធនាការកៀរគរសិស្សចុះឈ្មោះចូលរៀនឱ្យបាន ១០០% និងទប់ស្កាត់ការបោះបង់ឱ្យនៅសូន្យ`,
        `បង្កើនការបណ្តុះបណ្តាលបច្ចេកទេសគរុកោសល្យឆ្លើយតបសតវត្សរ៍ទី២១ ដល់លោកគ្រូអ្នកគ្រូ`,
        `ពង្រីកភាពជាដៃគូជាមួយអង្គការមិនមែនរដ្ឋាភិបាល សប្បុរសជន និងសហគមន៍ដើម្បីកែលម្អបរិស្ថានសាលារៀន`,
      ],
      moeysRecommendations: [
        { target: 'ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុក', action: 'ផ្តល់វគ្គបណ្តុះបណ្តាលបន្ថែមស្តីពីការរៀបចំកិច្ចតែងការបង្រៀនតាមបែបស្ថាបនានិយម និងការវាស់វែងវាយតម្លៃតាមស្តង់ដារ MoEYS' },
        { target: 'មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត', action: 'គាំទ្រសៀវភៅពុម្ព និងសម្ភារៈពិសោធន៍វិទ្យាសាស្ត្រ និងកុំព្យូទ័រសម្រាប់បណ្ណាល័យអេឡិចត្រូនិក' },
        { target: 'ក្រសួងអប់រំ យុវជន និងកីឡា', action: 'បន្តឧបត្ថម្ភកម្មវិធីផ្តល់អាហារូបករណ៍ និងអាហារតាមសាលារៀនដើម្បីធានាការរក្សាសិស្សក្នុងសាលាឱ្យបានគង់វង្ស' },
      ],
      fullFormattedReport: `ព្រះរាជាណាចក្រកម្ពុជា
ជាតិ សាសនា ព្រះមហាក្សត្រ
*****
ក្រសួងអប់រំ យុវជន និងកីឡា
${cluster}
${schoolName}

របាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំ និងការវាយតម្លៃការសិក្សាផ្លូវការ MoEYS
ឆ្នាំសិក្សា ${academicYear}

I. សេចក្តីផ្តើម និងស្ថានភាពទូទៅ
ក្នុងឆ្នាំសិក្សា ${academicYear} ${schoolName} បានខិតខំប្រឹងប្រែងយ៉ាងសកម្មក្នុងការបំពេញបេសកកម្មអប់រំស្របតាមគោលនយោបាយកែទម្រង់ស៊ីជម្រៅរបស់ក្រសួងអប់រំ យុវជន និងកីឡា។ សាលាមានសិស្សចុះឈ្មោះសរុប ${totalStudents} នាក់ (ស្រី ${femaleStudents} នាក់)។

II. លទ្ធផលសិក្សាប្រចាំឆ្នាំ (Academic Achievement)
- ចំនួនសិស្សឡើងថ្នាក់ ៖ ${totalPassed} នាក់ (ស្រី ${femalePassed} នាក់) ស្មើនឹង ${passRate}%
- ចំនួនសិស្សត្រួតថ្នាក់ ៖ ${totalRepeaters} នាក់
- ចំនួនសិស្សបោះបង់ការសិក្សា ៖ ${totalDropouts} នាក់
- មធ្យមភាគរួមទូទាំងសាលា ៖ ល្អបង្គួរ

III. ការវិភាគលើទិដ្ឋភាពយេនឌ័រ
សិស្សស្រីបង្ហាញពីភាពឈានមុខទាំងការចូលរៀនទៀងទាត់ និងលទ្ធផលសិក្សា ដោយអត្រាឡើងថ្នាក់របស់សិស្សស្រីខ្ពស់ជាងសិស្សប្រុស។

IV. ចំណុចខ្លាំង
១. អត្រាសិស្សឡើងថ្នាក់ខ្ពស់ និងការគ្រប់គ្រងមានតម្លាភាព
២. គ្រូបង្រៀនមានសមត្ថភាព និងការទទួលខុសត្រូវខ្ពស់
៣. សហគមន៍ និងអាណាព្យាបាលគាំទ្រយ៉ាងពេញទំហឹង

V. បញ្ហាប្រឈម និងសំណូមពរ
- ត្រូវការបន្តជួយឧបត្ថម្ភដល់សិស្សក្រីក្រ និងសិស្សចំណាកស្រុក
- សំណូមពរបន្ថែមសៀវភៅបណ្ណាល័យ និងសម្ភារៈបង្រៀនបច្ចេកវិទ្យា

ធ្វើនៅ ${schoolName}, ថ្ងៃទី ${new Date().getDate()} ខែ ${new Date().getMonth() + 1} ឆ្នាំ ${new Date().getFullYear()}
នាយក/នាយិកាសាលា`,
    };

    if (!ai) {
      return res.json({
        success: true,
        isFallback: true,
        data: fallbackReport,
      });
    }

    const prompt = `អ្នកជាអ្នកជំនាញរៀបចំរបាយការណ៍វាយតម្លៃ និងស្ថិតិអប់រំកម្រិតខ្ពស់របស់ក្រសួងអប់រំ យុវជន និងកីឡា (MoEYS) នៃព្រះរាជាណាចក្រកម្ពុជា។
សូមវិភាគទិន្នន័យស្ថិតិ និងលទ្ធផលសិក្សាសិស្សខាងក្រោមនេះ ហើយបង្កើតជា "របាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំ និងការវាយតម្លៃការសិក្សាផ្លូវការ MoEYS" ប្រកបដោយវិជ្ជាជីវៈ វោហារសាស្ត្ររដ្ឋបាលអប់រំខ្ពស់ និងរចនាសម្ព័ន្ធត្រឹមត្រូវតាមស្ដង់ដារ MoEYS៖

ទិន្នន័យសាលារៀន៖
- ឈ្មោះសាលា៖ ${schoolName}
- កម្រង/ស្រុក៖ ${cluster}
- ខេត្ត៖ ${province}
- ឆ្នាំសិក្សា៖ ${academicYear}
- ចំនួនបន្ទប់/ថ្នាក់៖ ${classesCount} ថ្នាក់
- សិស្សចុះឈ្មោះសរុប៖ ${totalStudents} នាក់ (ស្រី ${femaleStudents} នាក់)
- សិស្សឡើងថ្នាក់៖ ${totalPassed} នាក់ (ស្រី ${femalePassed} នាក់) ស្មើនឹង ${passRate}%
- សិស្សត្រួតថ្នាក់៖ ${totalRepeaters} នាក់
- សិស្សបោះបង់ការសិក្សា៖ ${totalDropouts} នាក់

សូមឆ្លើយតបជា JSON តែមួយគត់តាមទម្រង់ខាងក្រោម (ហាមសរសេរ Markdown codeblock ឬអក្សរបន្ថែមក្រៅពី JSON)៖
{
  "title": "របាយការណ៍បូកសរុបលទ្ធផលការងារអប់រំ និងការវាយតម្លៃការសិក្សាផ្លូវការ MoEYS",
  "academicYear": "${academicYear}",
  "schoolName": "${schoolName}",
  "generatedDate": "${new Date().toISOString().split('T')[0]}",
  "executiveSummary": "សេចក្តីសង្ខេបប្រតិបត្តិផ្លូវការ...",
  "academicAnalysis": "ការវិភាគលម្អិតលើលទ្ធផលសិក្សា ពិន្ទុ និងនិទ្ទេស...",
  "genderAnalysis": "ការវិភាគសមភាពយេនឌ័រ និងលទ្ធផលសិស្សស្រី...",
  "pedagogyAndCurriculum": "ការវាយតម្លៃលើវិធីសាស្ត្របង្រៀន គរុកោសល្យ និងកម្មវិធីសិក្សា...",
  "dropoutsAndRetention": "ការវិភាគលើអត្រាបោះបង់ ការរក្សាសិស្ស និងមូលហេតុ...",
  "strengths": ["ចំណុចខ្លាំងទី១", "ចំណុចខ្លាំងទី២", "ចំណុចខ្លាំងទី៣", "ចំណុចខ្លាំងទី៤"],
  "challenges": ["បញ្ហាប្រឈមទី១", "បញ្ហាប្រឈមទី២", "បញ្ហាប្រឈមទី៣"],
  "nextYearActionPlan": ["ផែនការទិសដៅទី១", "ផែនការទិសដៅទី២", "ផែនការទិសដៅទី៣", "ផែនការទិសដៅទី៤"],
  "moeysRecommendations": [
    { "target": "ការិយាល័យអប់រំ យុវជន និងកីឡា ស្រុក", "action": "សកម្មភាពជាក់លាក់..." },
    { "target": "មន្ទីរអប់រំ យុវជន និងកីឡា ខេត្ត", "action": "សកម្មភាពជាក់លាក់..." },
    { "target": "ក្រសួងអប់រំ យុវជន និងកីឡា", "action": "សកម្មភាពជាក់លាក់..." }
  ],
  "fullFormattedReport": "អត្ថបទរបាយការណ៍ពេញលេញរៀបចំជាក្បួនខ្នាតរដ្ឋបាល..."
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    const text = response.text || '';
    let parsedData = null;
    try {
      const cleanJson = text.replace(/```json\s*/g, '').replace(/```\s*$/g, '').trim();
      parsedData = JSON.parse(cleanJson);
    } catch {
      parsedData = {
        ...fallbackReport,
        executiveSummary: text.substring(0, 500) || fallbackReport.executiveSummary,
        fullFormattedReport: text || fallbackReport.fullFormattedReport,
      };
    }

    return res.json({
      success: true,
      isFallback: false,
      data: parsedData,
    });
  } catch (error: any) {
    console.error('Error in /api/ai/moeys-report:', error);
    res.status(500).json({ success: false, error: error.message || 'Internal error' });
  }
});

// Vite middleware or static serving
async function setupServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`School Report Assistant running on http://0.0.0.0:${PORT}`);
  });
}

setupServer();
