import { Users, TrendingUp, ArrowUp, ArrowDown, CheckCircle2, GraduationCap } from 'lucide-react';
import { Student, AnalysisResult, Section } from '@/types';

interface DashboardProps {
  students: Student[];
  stats: AnalysisResult;
  onNavigate: (s: Section) => void;
}

export default function Dashboard({ students, stats, onNavigate }: DashboardProps) {
  const cards = [
    {
      label: 'Total Students',
      value: stats.totalStudents.toString(),
      icon: Users,
      color: 'blue',
      gradient: 'from-blue-500 to-blue-600',
    },
    {
      label: 'Average Score',
      value: `${stats.overallAverage.toFixed(1)}%`,
      icon: TrendingUp,
      color: 'indigo',
      gradient: 'from-indigo-500 to-indigo-600',
    },
    {
      label: 'Highest Score',
      value: `${stats.highestScore.toFixed(1)}%`,
      icon: ArrowUp,
      color: 'emerald',
      gradient: 'from-emerald-500 to-emerald-600',
      sub: stats.topStudent ? stats.topStudent.Name : '',
    },
    {
      label: 'Lowest Score',
      value: `${stats.lowestScore.toFixed(1)}%`,
      icon: ArrowDown,
      color: 'rose',
      gradient: 'from-rose-500 to-rose-600',
      sub: stats.lowStudent ? stats.lowStudent.Name : '',
    },
    {
      label: 'Pass Percentage',
      value: `${stats.passPercentage.toFixed(1)}%`,
      icon: CheckCircle2,
      color: 'amber',
      gradient: 'from-amber-500 to-amber-600',
      sub: `${stats.passCount} passed · ${stats.failCount} failed`,
    },
  ];

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="overflow-hidden rounded-2xl bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 p-6 text-white shadow-lg sm:p-8">
        <div className="flex items-center gap-3">
          <GraduationCap className="h-8 w-8 shrink-0" />
          <div>
            <h2 className="text-xl font-bold sm:text-2xl">Welcome to the Analyzer</h2>
            <p className="text-sm text-blue-100 sm:text-base">
              Upload a CSV file or load the sample dataset to begin exploring student performance.
            </p>
          </div>
        </div>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {cards.map((card) => {
          const Icon = card.icon;
          return (
            <div
              key={card.label}
              className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all hover:shadow-lg hover:-translate-y-1"
            >
              <div className="flex items-center justify-between">
                <div className={`flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${card.gradient} text-white shadow-md`}>
                  <Icon className="h-5 w-5" />
                </div>
              </div>
              <p className="mt-4 text-2xl font-bold text-slate-800">{card.value}</p>
              <p className="text-sm font-medium text-slate-500">{card.label}</p>
              {card.sub && <p className="mt-1 text-xs text-slate-400 truncate">{card.sub}</p>}
            </div>
          );
        })}
      </div>

      {/* Quick stats row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <QuickStat label="Average Attendance" value={`${stats.avgAttendance.toFixed(1)}%`} />
        <QuickStat label="Average Maths" value={stats.avgMaths.toFixed(1)} />
        <QuickStat label="Average Science" value={stats.avgScience.toFixed(1)} />
      </div>

      {/* Quick actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <ActionButton label="View Dataset" desc="Browse all records" onClick={() => onNavigate('dataset')} />
        <ActionButton label="Detailed Analysis" desc="See full statistics" onClick={() => onNavigate('analysis')} />
        <ActionButton label="Charts" desc="Interactive visualizations" onClick={() => onNavigate('visualization')} />
        <ActionButton label="Insights" desc="Auto-generated findings" onClick={() => onNavigate('insights')} />
      </div>
    </div>
  );
}

function QuickStat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 text-center shadow-sm">
      <p className="text-xl font-bold text-slate-800">{value}</p>
      <p className="text-sm text-slate-500">{label}</p>
    </div>
  );
}

function ActionButton({ label, desc, onClick }: { label: string; desc: string; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="group flex items-center justify-between rounded-xl border border-slate-200 bg-white p-4 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
    >
      <div>
        <p className="font-semibold text-slate-700 group-hover:text-blue-600">{label}</p>
        <p className="text-xs text-slate-400">{desc}</p>
      </div>
      <span className="text-slate-300 group-hover:text-blue-500 group-hover:translate-x-1 transition-all">→</span>
    </button>
  );
}
