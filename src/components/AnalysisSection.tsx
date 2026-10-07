import { Users, TrendingUp, ArrowUp, ArrowDown, CheckCircle2, XCircle, Calendar, Award, AlertTriangle } from 'lucide-react';
import { Student, AnalysisResult } from '@/types';
import { PASS_MARK, studentAverage } from '@/lib/analysis';

interface AnalysisSectionProps {
  students: Student[];
  stats: AnalysisResult;
}

export default function AnalysisSection({ students, stats }: AnalysisSectionProps) {
  const subjectStats = [
    { name: 'Maths', avg: stats.avgMaths, color: 'blue', bg: 'bg-blue-50', text: 'text-blue-700', bar: 'bg-blue-500' },
    { name: 'Science', avg: stats.avgScience, color: 'indigo', bg: 'bg-indigo-50', text: 'text-indigo-700', bar: 'bg-indigo-500' },
    { name: 'English', avg: stats.avgEnglish, color: 'violet', bg: 'bg-violet-50', text: 'text-violet-700', bar: 'bg-violet-500' },
  ];

  const generalStats = [
    { label: 'Total Students', value: stats.totalStudents, icon: Users, color: 'text-blue-600', bg: 'bg-blue-50' },
    { label: 'Overall Average', value: `${stats.overallAverage.toFixed(1)}%`, icon: TrendingUp, color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Highest Score', value: `${stats.highestScore.toFixed(1)}%`, icon: ArrowUp, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Lowest Score', value: `${stats.lowestScore.toFixed(1)}%`, icon: ArrowDown, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Pass Count', value: stats.passCount, icon: CheckCircle2, color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Fail Count', value: stats.failCount, icon: XCircle, color: 'text-rose-600', bg: 'bg-rose-50' },
    { label: 'Pass Percentage', value: `${stats.passPercentage.toFixed(1)}%`, icon: Award, color: 'text-amber-600', bg: 'bg-amber-50' },
    { label: 'Average Attendance', value: `${stats.avgAttendance.toFixed(1)}%`, icon: Calendar, color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  return (
    <div className="space-y-6">
      {/* Pass mark info */}
      <div className="flex items-center gap-3 rounded-xl border border-blue-100 bg-blue-50 p-4">
        <AlertTriangle className="h-5 w-5 shrink-0 text-blue-500" />
        <p className="text-sm text-blue-700">
          A student is considered to have <strong>passed</strong> if their overall average score is <strong>{PASS_MARK}</strong> or above.
        </p>
      </div>

      {/* General statistics grid */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-slate-800">General Statistics</h3>
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
          {generalStats.map((s) => {
            const Icon = s.icon;
            return (
              <div key={s.label} className="rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-all hover:shadow-md">
                <div className={`mb-3 flex h-9 w-9 items-center justify-center rounded-lg ${s.bg}`}>
                  <Icon className={`h-4 w-4 ${s.color}`} />
                </div>
                <p className="text-xl font-bold text-slate-800">{s.value}</p>
                <p className="text-xs text-slate-500">{s.label}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Subject-wise averages with progress bars */}
      <div>
        <h3 className="mb-3 text-lg font-bold text-slate-800">Subject-wise Averages</h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
          {subjectStats.map((s) => (
            <div key={s.name} className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
              <div className="flex items-center justify-between">
                <span className={`text-sm font-semibold ${s.text}`}>{s.name}</span>
                <span className="text-2xl font-bold text-slate-800">{s.avg.toFixed(1)}</span>
              </div>
              <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-slate-100">
                <div
                  className={`h-full rounded-full ${s.bar} transition-all duration-700`}
                  style={{ width: `${Math.min(s.avg, 100)}%` }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Top & bottom performers */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {stats.topStudent && (
          <div className="rounded-xl border border-emerald-200 bg-gradient-to-br from-emerald-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-emerald-700">
              <Award className="h-5 w-5" />
              <h4 className="font-semibold">Top Performer</h4>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-800">{stats.topStudent.Name}</p>
                <p className="text-xs text-slate-400">{stats.topStudent.Student_ID} · {stats.topStudent.Gender}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-emerald-600">{stats.highestScore.toFixed(1)}</p>
                <p className="text-xs text-slate-400">avg score</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <MiniScore label="Maths" value={stats.topStudent.Maths} />
              <MiniScore label="Science" value={stats.topStudent.Science} />
              <MiniScore label="English" value={stats.topStudent.English} />
            </div>
          </div>
        )}

        {stats.lowStudent && (
          <div className="rounded-xl border border-rose-200 bg-gradient-to-br from-rose-50 to-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-rose-700">
              <AlertTriangle className="h-5 w-5" />
              <h4 className="font-semibold">Needs Support</h4>
            </div>
            <div className="mt-3 flex items-center justify-between">
              <div>
                <p className="text-lg font-bold text-slate-800">{stats.lowStudent.Name}</p>
                <p className="text-xs text-slate-400">{stats.lowStudent.Student_ID} · {stats.lowStudent.Gender}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-bold text-rose-600">{stats.lowestScore.toFixed(1)}</p>
                <p className="text-xs text-slate-400">avg score</p>
              </div>
            </div>
            <div className="mt-3 grid grid-cols-3 gap-2 text-center">
              <MiniScore label="Maths" value={stats.lowStudent.Maths} />
              <MiniScore label="Science" value={stats.lowStudent.Science} />
              <MiniScore label="English" value={stats.lowStudent.English} />
            </div>
          </div>
        )}
      </div>

      {/* Pass / fail breakdown bar */}
      <div className="rounded-xl border border-slate-200 bg-white p-5 shadow-sm">
        <h4 className="mb-3 font-semibold text-slate-800">Pass / Fail Breakdown</h4>
        <div className="flex h-8 w-full overflow-hidden rounded-lg">
          <div
            className="flex items-center justify-center bg-emerald-500 text-xs font-semibold text-white transition-all"
            style={{ width: `${stats.passPercentage}%` }}
          >
            {stats.passPercentage > 10 ? `Pass ${stats.passCount}` : ''}
          </div>
          <div
            className="flex items-center justify-center bg-rose-400 text-xs font-semibold text-white transition-all"
            style={{ width: `${100 - stats.passPercentage}%` }}
          >
            {(100 - stats.passPercentage) > 10 ? `Fail ${stats.failCount}` : ''}
          </div>
        </div>
        <div className="mt-2 flex justify-between text-xs text-slate-500">
          <span>{stats.passPercentage.toFixed(1)}% passed</span>
          <span>{(100 - stats.passPercentage).toFixed(1)}% failed</span>
        </div>
      </div>
    </div>
  );
}

function MiniScore({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg bg-white/70 py-2">
      <p className="text-sm font-bold text-slate-700">{value}</p>
      <p className="text-[10px] text-slate-400">{label}</p>
    </div>
  );
}
