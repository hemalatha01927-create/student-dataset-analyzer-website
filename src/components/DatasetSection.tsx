import { useRef, useState } from 'react';
import { UploadCloud, FileText, AlertCircle, Loader2, Database } from 'lucide-react';
import { Student } from '@/types';
import { parseCsv, CsvParseError } from '@/lib/csvParser';
import DataTable from './DataTable';

interface DatasetSectionProps {
  students: Student[];
  onUpload: (students: Student[]) => void;
  onLoadSample: () => void;
}

export default function DatasetSection({ students, onUpload, onLoadSample }: DatasetSectionProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);

  const handleFile = (file: File) => {
    setError(null);
    setLoading(true);
    setFileName(file.name);

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const text = e.target?.result as string;
        const parsed = parseCsv(text);
        onUpload(parsed);
      } catch (err) {
        if (err instanceof CsvParseError) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred while reading the file.');
        }
      } finally {
        setLoading(false);
      }
    };
    reader.onerror = () => {
      setError('Failed to read the file. Please try again.');
      setLoading(false);
    };
    reader.readAsText(file);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) handleFile(file);
  };

  return (
    <div className="space-y-6">
      {/* Upload area */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3">
        {/* Drop zone */}
        <div className="lg:col-span-2">
          <div
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
            className="flex flex-col items-center justify-center rounded-2xl border-2 border-dashed border-slate-300 bg-white p-8 text-center cursor-pointer transition-all hover:border-blue-400 hover:bg-blue-50/40"
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv,text/csv"
              className="hidden"
              onChange={(e) => {
                const file = e.target.files?.[0];
                if (file) handleFile(file);
                e.target.value = '';
              }}
            />
            {loading ? (
              <>
                <Loader2 className="h-10 w-10 animate-spin text-blue-500" />
                <p className="mt-3 text-sm font-medium text-slate-600">Reading {fileName}...</p>
              </>
            ) : (
              <>
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-blue-600">
                  <UploadCloud className="h-7 w-7" />
                </div>
                <p className="mt-3 text-sm font-semibold text-slate-700">Click to upload or drag &amp; drop a CSV file</p>
                <p className="mt-1 text-xs text-slate-400">Expected columns: Student_ID, Name, Gender, Maths, Science, English, Attendance</p>
              </>
            )}
          </div>
        </div>

        {/* Sample button + info */}
        <div className="flex flex-col gap-4">
          <button
            onClick={onLoadSample}
            className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-white p-5 text-left shadow-sm transition-all hover:border-blue-300 hover:shadow-md"
          >
            <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-indigo-50 text-indigo-600">
              <Database className="h-5 w-5" />
            </div>
            <div>
              <p className="font-semibold text-slate-700">Load Sample Dataset</p>
              <p className="text-xs text-slate-400">10 student records ready to explore</p>
            </div>
          </button>

          <div className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
            <div className="flex items-center gap-2 text-slate-700">
              <FileText className="h-4 w-4 text-blue-500" />
              <p className="text-sm font-semibold">CSV Format</p>
            </div>
            <pre className="mt-2 overflow-x-auto rounded-lg bg-slate-50 p-3 text-xs text-slate-500">Student_ID,Name,Gender,Maths,Science,English,Attendance
S001,Hema,Female,85,90,88,92</pre>
          </div>
        </div>
      </div>

      {/* Error message */}
      {error && (
        <div className="flex items-start gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4">
          <AlertCircle className="h-5 w-5 shrink-0 text-rose-500" />
          <div>
            <p className="text-sm font-semibold text-rose-700">Upload Error</p>
            <p className="text-sm text-rose-600">{error}</p>
          </div>
        </div>
      )}

      {/* Data table */}
      {students.length > 0 ? (
        <DataTable students={students} />
      ) : (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-slate-200 bg-white py-16 text-center">
          <Database className="h-12 w-12 text-slate-300" />
          <p className="mt-3 text-sm font-medium text-slate-500">No data loaded yet</p>
          <p className="text-xs text-slate-400">Upload a CSV file or load the sample dataset to view records.</p>
        </div>
      )}
    </div>
  );
}
