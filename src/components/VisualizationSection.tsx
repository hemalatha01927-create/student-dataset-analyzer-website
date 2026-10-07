import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, ScatterChart, Scatter, Legend, LineChart, Line } from 'recharts';
import { Student, AnalysisResult } from '@/types';
import { studentAverage } from '@/lib/analysis';

interface VisualizationSectionProps {
  students: Student[];
  stats: AnalysisResult;
}

const COLORS = ['#3b82f6', '#6366f1', '#8b5cf6'];

export default function VisualizationSection({ students, stats }: VisualizationSectionProps) {
  // Data for subject average bar chart
  const subjectData = [
    { subject: 'Maths', average: Number(stats.avgMaths.toFixed(1)) },
    { subject: 'Science', average: Number(stats.avgScience.toFixed(1)) },
    { subject: 'English', average: Number(stats.avgEnglish.toFixed(1)) },
  ];

  // Data for pass/fail doughnut chart
  const passFailData = [
    { name: 'Pass', value: stats.passCount },
    { name: 'Fail', value: stats.failCount },
  ];
  const passFailColors = ['#10b981', '#f43f5e'];

  // Data for attendance vs performance scatter chart
  const scatterData = students.map((s) => ({
    attendance: s.Attendance,
    score: Number(studentAverage(s).toFixed(1)),
    name: s.Name,
  }));

  // Data for attendance vs average score line chart (sorted by attendance)
  const lineData = [...students]
    .sort((a, b) => a.Attendance - b.Attendance)
    .map((s) => ({
      attendance: s.Attendance,
      average: Number(studentAverage(s).toFixed(1)),
      name: s.Name,
    }));

  return (
    <div className="space-y-6">
      {/* A. Subject Average Bar Chart */}
      <ChartCard title="Subject Average Scores" subtitle="Average marks across Maths, Science and English">
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={subjectData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="subject" tick={{ fill: '#64748b', fontSize: 13 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 13 }} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
              cursor={{ fill: '#f1f5f9' }}
            />
            <Bar dataKey="average" radius={[8, 8, 0, 0]} name="Average Score">
              {subjectData.map((_, i) => (
                <Cell key={i} fill={COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </ChartCard>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* B. Pass vs Fail Doughnut Chart */}
        <ChartCard title="Pass vs Fail Distribution" subtitle={`Pass mark: 40 · ${stats.passPercentage.toFixed(1)}% passed`}>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={passFailData}
                cx="50%"
                cy="50%"
                innerRadius={60}
                outerRadius={100}
                paddingAngle={3}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}`}
                labelLine={false}
              >
                {passFailData.map((_, i) => (
                  <Cell key={i} fill={passFailColors[i]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }} />
              <Legend wrapperStyle={{ fontSize: '13px' }} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>

        {/* C-1. Attendance vs Performance Scatter Chart */}
        <ChartCard title="Attendance vs Performance" subtitle="Each point is a student's attendance vs their average score">
          <ResponsiveContainer width="100%" height={300}>
            <ScatterChart margin={{ top: 10, right: 10, bottom: 10, left: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
              <XAxis
                type="number"
                dataKey="attendance"
                name="Attendance"
                unit="%"
                domain={[40, 100]}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <YAxis
                type="number"
                dataKey="score"
                name="Avg Score"
                domain={[0, 100]}
                tick={{ fill: '#64748b', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
                formatter={(value) => [String(value), '']}
                labelFormatter={() => ''}
              />
              <Scatter data={scatterData} fill="#6366f1" name="Students" />
            </ScatterChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>

      {/* C-2. Attendance vs Performance Line Chart */}
      <ChartCard title="Attendance vs Average Score Trend" subtitle="Students sorted by attendance to show the performance trend">
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={lineData} margin={{ top: 10, right: 10, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" />
            <XAxis dataKey="attendance" name="Attendance" unit="%" tick={{ fill: '#64748b', fontSize: 12 }} />
            <YAxis domain={[0, 100]} tick={{ fill: '#64748b', fontSize: 12 }} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '13px' }}
              formatter={(value) => [String(value), 'Avg Score']}
              labelFormatter={(label) => `Attendance: ${label}%`}
            />
            <Line
              type="monotone"
              dataKey="average"
              stroke="#3b82f6"
              strokeWidth={2}
              dot={{ fill: '#3b82f6', r: 4 }}
              activeDot={{ r: 6 }}
              name="Avg Score"
            />
          </LineChart>
        </ResponsiveContainer>
      </ChartCard>
    </div>
  );
}

function ChartCard({ title, subtitle, children }: { title: string; subtitle: string; children: React.ReactNode }) {
  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
      <div className="mb-4">
        <h3 className="font-bold text-slate-800">{title}</h3>
        <p className="text-xs text-slate-400">{subtitle}</p>
      </div>
      {children}
    </div>
  );
}
