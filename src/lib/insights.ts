import { Student, AnalysisResult } from '@/types';
import { studentAverage, attendancePerformanceCorrelation } from './analysis';

export interface Insight {
  title: string;
  body: string;
  tone: 'positive' | 'neutral' | 'warning';
}

// Generate human-readable insights from the dataset using simple statistics.
// This is labelled "Data Insights" (not AI) in the UI.
export function generateInsights(students: Student[], stats: AnalysisResult): Insight[] {
  const insights: Insight[] = [];

  // 1. Best-performing subject
  const subjects = [
    { name: 'Maths', avg: stats.avgMaths },
    { name: 'Science', avg: stats.avgScience },
    { name: 'English', avg: stats.avgEnglish },
  ];
  subjects.sort((a, b) => b.avg - a.avg);
  insights.push({
    title: 'Strongest Subject',
    body: `${subjects[0].name} has the highest average score of ${subjects[0].avg.toFixed(1)}, followed by ${subjects[1].name} (${subjects[1].avg.toFixed(1)}) and ${subjects[2].name} (${subjects[2].avg.toFixed(1)}).`,
    tone: 'positive',
  });

  // 2. Overall average
  insights.push({
    title: 'Overall Performance',
    body: `The overall average score across all subjects is ${stats.overallAverage.toFixed(1)}%, which is ${stats.overallAverage >= 60 ? 'above the typical target of 60%' : 'below the typical target of 60%'}.`,
    tone: stats.overallAverage >= 60 ? 'positive' : 'neutral',
  });

  // 3. Pass / fail breakdown
  insights.push({
    title: 'Pass / Fail Summary',
    body:
      stats.failCount === 0
        ? `All ${stats.totalStudents} students scored above the passing mark of 40. No students are at risk.`
        : `${stats.failCount} student${stats.failCount > 1 ? 's are' : ' is'} below the passing mark of 40. ${stats.passCount} out of ${stats.totalStudents} students passed (${stats.passPercentage.toFixed(1)}%).`,
    tone: stats.failCount === 0 ? 'positive' : 'warning',
  });

  // 4. Top performer
  if (stats.topStudent) {
    insights.push({
      title: 'Top Performer',
      body: `${stats.topStudent.Name} (${stats.topStudent.Student_ID}) is the top performer with an average of ${stats.highestScore.toFixed(1)} across Maths, Science and English.`,
      tone: 'positive',
    });
  }

  // 5. Lowest performer
  if (stats.lowStudent) {
    const avg = stats.lowestScore;
    insights.push({
      title: 'Student Needing Support',
      body: `${stats.lowStudent.Name} (${stats.lowStudent.Student_ID}) has the lowest average of ${avg.toFixed(1)}. ${avg < PASS_MARK_TEXT ? 'This student is below the passing mark and may need additional support.' : 'This student is above the passing mark but has the lowest score in the class.'}`,
      tone: avg < 40 ? 'warning' : 'neutral',
    });
  }

  // 6. Attendance vs performance correlation
  const corr = attendancePerformanceCorrelation(students);
  let corrText: string;
  if (corr >= 0.7) corrText = 'a strong positive';
  else if (corr >= 0.4) corrText = 'a moderate positive';
  else if (corr >= 0.1) corrText = 'a weak positive';
  else if (corr > -0.1) corrText = 'almost no';
  else if (corr > -0.4) corrText = 'a weak negative';
  else if (corr > -0.7) corrText = 'a moderate negative';
  else corrText = 'a strong negative';
  insights.push({
    title: 'Attendance vs Performance',
    body: `There is ${corrText} correlation (r = ${corr.toFixed(2)}) between attendance and average score. Students with higher attendance generally show ${corr >= 0.1 ? 'better' : corr <= -0.1 ? 'lower' : 'similar'} performance.`,
    tone: corr >= 0.4 ? 'positive' : corr <= -0.4 ? 'warning' : 'neutral',
  });

  // 7. Gender comparison
  const genderGroups: Record<string, Student[]> = {};
  for (const s of students) {
    const g = s.Gender || 'Unknown';
    if (!genderGroups[g]) genderGroups[g] = [];
    genderGroups[g].push(s);
  }
  const genderLines = Object.entries(genderGroups).map(([gender, group]) => {
    const avg = group.reduce((a, s) => a + studentAverage(s), 0) / group.length;
    return `${gender}: ${avg.toFixed(1)}`;
  });
  if (genderLines.length > 1) {
    insights.push({
      title: 'Gender-wise Comparison',
      body: `Average scores by gender — ${genderLines.join(' | ')}.`,
      tone: 'neutral',
    });
  }

  // 8. Attendance insight
  insights.push({
    title: 'Attendance Overview',
    body: `The average attendance is ${stats.avgAttendance.toFixed(1)}%. ${stats.avgAttendance >= 85 ? 'Most students attend regularly, which supports consistent performance.' : 'Attendance could be improved; lower attendance may be affecting results.'}`,
    tone: stats.avgAttendance >= 85 ? 'positive' : 'warning',
  });

  return insights;
}

const PASS_MARK_TEXT = 40;
