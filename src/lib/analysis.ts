import { Student, AnalysisResult } from '@/types';

// Pass mark: a student passes if their overall average is >= 40
export const PASS_MARK = 40;

// Compute the overall average of a single student across the three subjects.
export function studentAverage(s: Student): number {
  return (s.Maths + s.Science + s.English) / 3;
}

// Run all analysis calculations on the full dataset.
export function analyze(students: Student[]): AnalysisResult {
  const n = students.length;
  if (n === 0) {
    return {
      totalStudents: 0,
      avgMaths: 0,
      avgScience: 0,
      avgEnglish: 0,
      overallAverage: 0,
      highestScore: 0,
      lowestScore: 0,
      passCount: 0,
      failCount: 0,
      passPercentage: 0,
      avgAttendance: 0,
      topStudent: null,
      lowStudent: null,
    };
  }

  const sumMaths = students.reduce((a, s) => a + s.Maths, 0);
  const sumScience = students.reduce((a, s) => a + s.Science, 0);
  const sumEnglish = students.reduce((a, s) => a + s.English, 0);
  const sumAttendance = students.reduce((a, s) => a + s.Attendance, 0);

  const avgMaths = sumMaths / n;
  const avgScience = sumScience / n;
  const avgEnglish = sumEnglish / n;
  const overallAverage = (avgMaths + avgScience + avgEnglish) / 3;
  const avgAttendance = sumAttendance / n;

  // Per-student averages for highest / lowest
  let highestScore = -Infinity;
  let lowestScore = Infinity;
  let topStudent: Student | null = null;
  let lowStudent: Student | null = null;

  let passCount = 0;
  for (const s of students) {
    const avg = studentAverage(s);
    if (avg > highestScore) {
      highestScore = avg;
      topStudent = s;
    }
    if (avg < lowestScore) {
      lowestScore = avg;
      lowStudent = s;
    }
    if (avg >= PASS_MARK) passCount++;
  }

  const failCount = n - passCount;
  const passPercentage = (passCount / n) * 100;

  return {
    totalStudents: n,
    avgMaths,
    avgScience,
    avgEnglish,
    overallAverage,
    highestScore,
    lowestScore,
    passCount,
    failCount,
    passPercentage,
    avgAttendance,
    topStudent,
    lowStudent,
  };
}

// Pearson correlation between attendance and overall average score.
// Returns a value in [-1, 1]; used for the attendance-vs-performance insight.
export function attendancePerformanceCorrelation(students: Student[]): number {
  const n = students.length;
  if (n < 2) return 0;

  const pairs = students.map((s) => ({ x: s.Attendance, y: studentAverage(s) }));
  const meanX = pairs.reduce((a, p) => a + p.x, 0) / n;
  const meanY = pairs.reduce((a, p) => a + p.y, 0) / n;

  let num = 0;
  let denX = 0;
  let denY = 0;
  for (const p of pairs) {
    const dx = p.x - meanX;
    const dy = p.y - meanY;
    num += dx * dy;
    denX += dx * dx;
    denY += dy * dy;
  }

  const den = Math.sqrt(denX * denY);
  if (den === 0) return 0;
  return num / den;
}
