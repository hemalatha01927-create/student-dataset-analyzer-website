import { useState, useMemo } from 'react';
import { Search, ArrowUp, ArrowDown, ArrowUpDown } from 'lucide-react';
import { Student } from '@/types';
import { studentAverage } from '@/lib/analysis';

type SortKey = keyof Student | 'Average';
type SortDir = 'asc' | 'desc';

const COLUMNS: { key: SortKey; label: string }[] = [
  { key: 'Student_ID', label: 'Student ID' },
  { key: 'Name', label: 'Name' },
  { key: 'Gender', label: 'Gender' },
  { key: 'Maths', label: 'Maths' },
  { key: 'Science', label: 'Science' },
  { key: 'English', label: 'English' },
  { key: 'Attendance', label: 'Attendance' },
  { key: 'Average', label: 'Average' },
];

export default function DataTable({ students }: { students: Student[] }) {
  const [query, setQuery] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('Student_ID');
  const [sortDir, setSortDir] = useState<SortDir>('asc');

  // Filter records by the search query (matches name, ID, or gender)
  const filtered = useMemo(() => {
    const q = query.toLowerCase().trim();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.Name.toLowerCase().includes(q) ||
        s.Student_ID.toLowerCase().includes(q) ||
        s.Gender.toLowerCase().includes(q)
    );
  }, [students, query]);

  // Sort the filtered records
  const sorted = useMemo(() => {
    const arr = [...filtered];
    arr.sort((a, b) => {
      let av: string | number;
      let bv: string | number;
      if (sortKey === 'Average') {
        av = studentAverage(a);
        bv = studentAverage(b);
      } else {
        av = a[sortKey];
        bv = b[sortKey];
      }
      if (typeof av === 'string' && typeof bv === 'string') {
        return sortDir === 'asc' ? av.localeCompare(bv) : bv.localeCompare(av);
      }
      return sortDir === 'asc' ? (av as number) - (bv as number) : (bv as number) - (av as number);
    });
    return arr;
  }, [filtered, sortKey, sortDir]);

  const toggleSort = (key: SortKey) => {
    if (sortKey === key) {
      setSortDir((d) => (d === 'asc' ? 'desc' : 'asc'));
    } else {
      setSortKey(key);
      setSortDir('asc');
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Toolbar */}
      <div className="flex flex-col gap-3 border-b border-slate-200 p-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="font-semibold text-slate-800">Student Records</h3>
          <p className="text-xs text-slate-400">{sorted.length} of {students.length} records</p>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search name, ID, gender..."
            className="w-full rounded-lg border border-slate-200 py-2 pl-9 pr-3 text-sm text-slate-700 outline-none transition-all focus:border-blue-400 focus:ring-2 focus:ring-blue-100 sm:w-64"
          />
        </div>
      </div>

      {/* Table — horizontally scrollable on small screens */}
      <div className="overflow-x-auto">
        <table className="w-full min-w-[800px] text-sm">
          <thead>
            <tr className="border-b border-slate-200 bg-slate-50">
              {COLUMNS.map((col) => {
                const isActive = sortKey === col.key;
                return (
                  <th key={col.key} className="px-4 py-3 text-left font-semibold text-slate-600">
                    <button
                      onClick={() => toggleSort(col.key)}
                      className="flex items-center gap-1 hover:text-blue-600 transition-colors"
                    >
                      {col.label}
                      {isActive ? (
                        sortDir === 'asc' ? (
                          <ArrowUp className="h-3.5 w-3.5 text-blue-500" />
                        ) : (
                          <ArrowDown className="h-3.5 w-3.5 text-blue-500" />
                        )
                      ) : (
                        <ArrowUpDown className="h-3.5 w-3.5 text-slate-300" />
                      )}
                    </button>
                  </th>
                );
              })}
            </tr>
          </thead>
          <tbody>
            {sorted.map((s, i) => {
              const avg = studentAverage(s);
              return (
                <tr
                  key={s.Student_ID}
                  className={`border-b border-slate-100 transition-colors hover:bg-blue-50/40 ${i % 2 === 1 ? 'bg-slate-50/30' : ''}`}
                >
                  <td className="px-4 py-3 font-medium text-slate-700">{s.Student_ID}</td>
                  <td className="px-4 py-3 text-slate-700">{s.Name}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`inline-flex rounded-full px-2 py-0.5 text-xs font-medium ${
                        s.Gender === 'Female'
                          ? 'bg-pink-100 text-pink-700'
                          : 'bg-blue-100 text-blue-700'
                      }`}
                    >
                      {s.Gender}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-slate-600">{s.Maths}</td>
                  <td className="px-4 py-3 text-slate-600">{s.Science}</td>
                  <td className="px-4 py-3 text-slate-600">{s.English}</td>
                  <td className="px-4 py-3 text-slate-600">{s.Attendance}%</td>
                  <td className="px-4 py-3">
                    <span
                      className={`font-semibold ${
                        avg >= 75 ? 'text-emerald-600' : avg >= 40 ? 'text-amber-600' : 'text-rose-600'
                      }`}
                    >
                      {avg.toFixed(1)}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {sorted.length === 0 && (
        <div className="py-10 text-center text-sm text-slate-400">
          No records match your search "{query}".
        </div>
      )}
    </div>
  );
}
