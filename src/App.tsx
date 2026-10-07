import { useState, useMemo, useCallback } from 'react';
import { Database, UploadCloud } from 'lucide-react';
import { Student, Section, AnalysisResult } from '@/types';
import { sampleData } from '@/lib/sampleData';
import { analyze } from '@/lib/analysis';
import Sidebar from '@/components/Sidebar';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import Dashboard from '@/components/Dashboard';
import DatasetSection from '@/components/DatasetSection';
import AnalysisSection from '@/components/AnalysisSection';
import VisualizationSection from '@/components/VisualizationSection';
import InsightsSection from '@/components/InsightsSection';

function App() {
  const [students, setStudents] = useState<Student[]>(sampleData);
  const [section, setSection] = useState<Section>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Recompute statistics whenever the dataset changes
  const stats: AnalysisResult = useMemo(() => analyze(students), [students]);

  const handleUpload = useCallback((data: Student[]) => {
    setStudents(data);
  }, []);

  const handleLoadSample = useCallback(() => {
    setStudents(sampleData);
  }, []);

  return (
    <div className="flex min-h-screen bg-slate-50">
      <Sidebar
        active={section}
        onNavigate={setSection}
        open={sidebarOpen}
        onClose={() => setSidebarOpen(false)}
      />

      <div className="flex min-w-0 flex-1 flex-col">
        <Header
          section={section}
          onToggleSidebar={() => setSidebarOpen((o) => !o)}
          onLoadSample={handleLoadSample}
          hasData={students.length > 0}
        />

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8">
          <div className="mx-auto max-w-7xl">
            {students.length === 0 ? (
              <EmptyState onLoadSample={handleLoadSample} />
            ) : (
              <>
                {section === 'dashboard' && <Dashboard students={students} stats={stats} onNavigate={setSection} />}
                {section === 'dataset' && (
                  <DatasetSection students={students} onUpload={handleUpload} onLoadSample={handleLoadSample} />
                )}
                {section === 'analysis' && <AnalysisSection students={students} stats={stats} />}
                {section === 'visualization' && <VisualizationSection students={students} stats={stats} />}
                {section === 'insights' && <InsightsSection students={students} stats={stats} />}
              </>
            )}
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

// Shown when there is no data loaded at all
function EmptyState({ onLoadSample }: { onLoadSample: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-20 text-center">
      <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-50 text-blue-500">
        <Database className="h-8 w-8" />
      </div>
      <h2 className="mt-4 text-lg font-bold text-slate-800">No Data Loaded</h2>
      <p className="mt-1 max-w-sm text-sm text-slate-400">
        Upload a CSV file or load the sample dataset to start analyzing student performance.
      </p>
      <button
        onClick={onLoadSample}
        className="mt-4 flex items-center gap-2 rounded-lg bg-blue-600 px-4 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 active:scale-95"
      >
        <UploadCloud className="h-4 w-4" />
        Load Sample Dataset
      </button>
    </div>
  );
}

export default App;
