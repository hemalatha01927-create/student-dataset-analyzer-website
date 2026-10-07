import { Student } from '@/types';

// Expected CSV column headers (case-insensitive match)
const REQUIRED_HEADERS = ['student_id', 'name', 'gender', 'maths', 'science', 'english', 'attendance'];

export class CsvParseError extends Error {}

// Parse a CSV string into Student records.
// Handles quoted fields and commas inside quotes.
export function parseCsv(text: string): Student[] {
  const trimmed = text.trim();
  if (!trimmed) {
    throw new CsvParseError('The file is empty. Please upload a valid CSV file.');
  }

  const lines = splitCsvLines(trimmed);
  if (lines.length < 2) {
    throw new CsvParseError('The CSV file must contain a header row and at least one data row.');
  }

  const headers = lines[0].map((h) => h.toLowerCase().trim());
  for (const required of REQUIRED_HEADERS) {
    if (!headers.includes(required)) {
      throw new CsvParseError(
        `Missing required column "${required}". Expected columns: Student_ID, Name, Gender, Maths, Science, English, Attendance.`
      );
    }
  }

  const idx = {
    Student_ID: headers.indexOf('student_id'),
    Name: headers.indexOf('name'),
    Gender: headers.indexOf('gender'),
    Maths: headers.indexOf('maths'),
    Science: headers.indexOf('science'),
    English: headers.indexOf('english'),
    Attendance: headers.indexOf('attendance'),
  };

  const students: Student[] = [];
  for (let i = 1; i < lines.length; i++) {
    const cells = lines[i];
    if (cells.length === 1 && cells[0].trim() === '') continue; // skip blank lines

    const student: Student = {
      Student_ID: cells[idx.Student_ID]?.trim() ?? '',
      Name: cells[idx.Name]?.trim() ?? '',
      Gender: cells[idx.Gender]?.trim() ?? '',
      Maths: toNumber(cells[idx.Maths], 'Maths', i + 1),
      Science: toNumber(cells[idx.Science], 'Science', i + 1),
      English: toNumber(cells[idx.English], 'English', i + 1),
      Attendance: toNumber(cells[idx.Attendance], 'Attendance', i + 1),
    };
    students.push(student);
  }

  if (students.length === 0) {
    throw new CsvParseError('No valid data rows found in the CSV file.');
  }

  return students;
}

// Split raw CSV text into rows of cells, respecting quoted fields.
function splitCsvLines(text: string): string[][] {
  const rows: string[][] = [];
  let current: string[] = [];
  let field = '';
  let inQuotes = false;

  for (let i = 0; i < text.length; i++) {
    const char = text[i];

    if (inQuotes) {
      if (char === '"') {
        if (text[i + 1] === '"') {
          // Escaped quote inside a quoted field
          field += '"';
          i++;
        } else {
          inQuotes = false;
        }
      } else {
        field += char;
      }
    } else {
      if (char === '"') {
        inQuotes = true;
      } else if (char === ',') {
        current.push(field);
        field = '';
      } else if (char === '\n' || char === '\r') {
        // Handle \r\n line endings
        if (char === '\r' && text[i + 1] === '\n') i++;
        current.push(field);
        rows.push(current);
        current = [];
        field = '';
      } else {
        field += char;
      }
    }
  }

  // Push the last field/row if there is leftover content
  if (field !== '' || current.length > 0) {
    current.push(field);
    rows.push(current);
  }

  return rows;
}

// Convert a string cell to a number, throwing a helpful error if invalid.
function toNumber(value: string | undefined, field: string, row: number): number {
  const n = Number(value?.trim());
  if (Number.isNaN(n)) {
    throw new CsvParseError(`Invalid number "${value}" in column "${field}" on row ${row}.`);
  }
  return n;
}
