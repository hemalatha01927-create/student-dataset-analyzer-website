// Core data type for a single student record
export interface Student {
  Student_ID: string;
  Name: string;
  Gender: string;
  Maths: number;
  Science: number;
  English: number;
  Attendance: number;
}

// Summary statistics computed from the dataset
export interface AnalysisResult {
  totalStudents: number;
  avgMaths: number;
  avgScience: number;
  avgEnglish: number;
  overallAverage: number;
  highestScore: number;
  lowestScore: number;
  passCount: number;
  failCount: number;
  passPercentage: number;
  avgAttendance: number;
  topStudent: Student | null;
  lowStudent: Student | null;
}

// Navigation sections
export type Section = 'dashboard' | 'dataset' | 'analysis' | 'visualization' | 'insights';
