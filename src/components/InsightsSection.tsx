import { TrendingUp, AlertTriangle, CheckCircle2, Info, Lightbulb, Brain } from 'lucide-react';
import { Student, AnalysisResult } from '@/types';
import { generateInsights, Insight } from '@/lib/insights';

interface InsightsSectionProps {
  students: Student[];
  stats: AnalysisResult;
}

const TONE_STYLES: Record<Insight['tone'], { border: string; bg: string; icon: typeof Info; iconColor: string }> = {
  positive: { border: 'border-emerald-200', bg: 'bg-emerald-50/50', icon: CheckCircle2, iconColor: 'text-emerald-600' },
  warning: { border: 'border-rose-200', bg: 'bg-rose-50/50', icon: AlertTriangle, iconColor: 'text-rose-600' },
  neutral: { border: 'border-slate-200', bg: 'bg-slate-50/50', icon: Info, iconColor: 'text-slate-500' },
};

export default function InsightsSection({ students, stats }: InsightsSectionProps) {
  const insights = generateInsights(students, stats);

  return (
    <div className="space-y-6">
      {/* Header note */}
      <div className="flex items-start gap-3 rounded-2xl border border-blue-100 bg-gradient-to-r from-blue-50 to-indigo-50 p-5">
        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md">
          <Brain className="h-5 w-5" />
        </div>
        <div>
          <h3 className="font-bold text-slate-800">Data Insights</h3>
          <p className="text-sm text-slate-500">
            These insights are generated automatically using statistical analysis of the uploaded dataset — not a trained AI model.
          </p>
        </div>
      </div>

      {/* Insight cards */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
        {insights.map((insight, i) => {
          const style = TONE_STYLES[insight.tone];
          const Icon = style.icon;
          return (
            <div
              key={i}
              className={`rounded-2xl border ${style.border} ${style.bg} p-5 shadow-sm transition-all hover:shadow-md`}
            >
              <div className="flex items-start gap-3">
                <Icon className={`h-5 w-5 shrink-0 ${style.iconColor} mt-0.5`} />
                <div>
                  <h4 className="font-semibold text-slate-800">{insight.title}</h4>
                  <p className="mt-1 text-sm leading-relaxed text-slate-600">{insight.body}</p>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Summary callout */}
      <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
        <div className="flex items-center gap-2 text-slate-700">
          <Lightbulb className="h-5 w-5 text-amber-500" />
          <h4 className="font-semibold">Quick Summary</h4>
        </div>
        <p className="mt-2 text-sm leading-relaxed text-slate-600">
          Based on {stats.totalStudents} student records, the class has an overall average of{' '}
          <strong>{stats.overallAverage.toFixed(1)}%</strong> with a{' '}
          <strong>{stats.passPercentage.toFixed(1)}%</strong> pass rate. The average attendance is{' '}
          <strong>{stats.avgAttendance.toFixed(1)}%</strong>.{' '}
          {stats.topStudent && <>The top performer is <strong>{stats.topStudent.Name}</strong>.</>}{' '}
          {stats.failCount > 0 && <>{stats.failCount} student{stats.failCount > 1 ? 's' : ''} may need additional support.</>}
        </p>
      </div>
    </div>
  );
}
