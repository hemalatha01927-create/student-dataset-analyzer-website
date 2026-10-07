import { LayoutDashboard, Table, BarChart3, PieChart, Lightbulb, GraduationCap } from 'lucide-react';
import { Section } from '@/types';

interface SidebarProps {
  active: Section;
  onNavigate: (section: Section) => void;
  open: boolean;
  onClose: () => void;
}

const NAV_ITEMS: { id: Section; label: string; icon: typeof LayoutDashboard }[] = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'dataset', label: 'Dataset', icon: Table },
  { id: 'analysis', label: 'Analysis', icon: BarChart3 },
  { id: 'visualization', label: 'Visualization', icon: PieChart },
  { id: 'insights', label: 'Insights', icon: Lightbulb },
];

export default function Sidebar({ active, onNavigate, open, onClose }: SidebarProps) {
  return (
    <>
      {/* Mobile overlay */}
      {open && (
        <div
          className="fixed inset-0 z-30 bg-slate-900/50 backdrop-blur-sm lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={`fixed top-0 left-0 z-40 h-full w-64 transform bg-white border-r border-slate-200 transition-transform duration-300 lg:translate-x-0 lg:static lg:z-auto ${
          open ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="flex h-16 items-center gap-3 px-6 border-b border-slate-200">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-600/30">
            <GraduationCap className="h-5 w-5" />
          </div>
          <div className="leading-tight">
            <p className="text-sm font-bold text-slate-800">Performance</p>
            <p className="text-xs text-slate-400">Dataset Analyzer</p>
          </div>
        </div>

        <nav className="flex flex-col gap-1 p-4">
          {NAV_ITEMS.map((item) => {
            const Icon = item.icon;
            const isActive = active === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onNavigate(item.id);
                  onClose();
                }}
                className={`group flex items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-blue-600 text-white shadow-md shadow-blue-600/30'
                    : 'text-slate-600 hover:bg-blue-50 hover:text-blue-700'
                }`}
              >
                <Icon
                  className={`h-5 w-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'text-white' : 'text-slate-400 group-hover:text-blue-600'
                  }`}
                />
                {item.label}
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <div className="rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 p-4 text-center">
            <p className="text-xs font-semibold text-slate-600">AI &amp; ML</p>
            <p className="text-xs text-slate-400">Dataset Analysis Project</p>
          </div>
        </div>
      </aside>
    </>
  );
}
