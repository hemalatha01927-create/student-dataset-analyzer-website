import { Menu, Upload } from 'lucide-react';
import { Section } from '@/types';

interface HeaderProps {
  section: Section;
  onToggleSidebar: () => void;
  onLoadSample: () => void;
  hasData: boolean;
}

const TITLES: Record<Section, { title: string; subtitle: string }> = {
  dashboard: { title: 'Student Performance Dataset Analyzer', subtitle: 'Analyze student data and discover meaningful insights.' },
  dataset: { title: 'Dataset Management', subtitle: 'Upload, view and explore student records.' },
  analysis: { title: 'Data Analysis', subtitle: 'Detailed statistics computed from the dataset.' },
  visualization: { title: 'Visualization', subtitle: 'Interactive charts that update with your data.' },
  insights: { title: 'Data Insights', subtitle: 'Automatically generated observations from the data.' },
};

export default function Header({ section, onToggleSidebar, onLoadSample, hasData }: HeaderProps) {
  const { title, subtitle } = TITLES[section];

  return (
    <header className="sticky top-0 z-20 border-b border-slate-200 bg-white/80 backdrop-blur-md">
      <div className="flex items-center justify-between gap-4 px-4 py-4 sm:px-6 lg:px-8">
        <div className="flex items-center gap-3 min-w-0">
          <button
            onClick={onToggleSidebar}
            className="lg:hidden flex h-10 w-10 shrink-0 items-center justify-center rounded-lg border border-slate-200 text-slate-600 hover:bg-slate-50"
            aria-label="Toggle navigation"
          >
            <Menu className="h-5 w-5" />
          </button>
          <div className="min-w-0">
            <h1 className="truncate text-lg font-bold text-slate-800 sm:text-xl lg:text-2xl">{title}</h1>
            <p className="truncate text-xs text-slate-400 sm:text-sm">{subtitle}</p>
          </div>
        </div>

        <button
          onClick={onLoadSample}
          className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3 py-2 text-sm font-medium text-white shadow-md shadow-blue-600/20 transition-all hover:bg-blue-700 hover:shadow-lg active:scale-95 sm:px-4"
        >
          <Upload className="h-4 w-4" />
          <span className="hidden sm:inline">Load Sample Dataset</span>
          <span className="sm:hidden">Sample</span>
          {hasData && <span className="hidden sm:inline text-blue-200">·</span>}
        </button>
      </div>
    </header>
  );
}
