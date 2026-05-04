import { useCallback, useMemo, useState, type ChangeEvent, type DragEvent } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Download,
  FileSpreadsheet,
  Search,
  Shield,
  Upload,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

export interface AdminAuditEntry {
  timestamp: string;
  userId: string;
  studentName: string;
  course: string;
  assignment: string;
  previousValue: string;
  newValue: string;
  changedBy: string;
  ipAddress: string;
  reasonStatus: string;
}

const MOCK_AUDIT_LOG: AdminAuditEntry[] = [
  {
    timestamp: "2026-05-02 08:14:22",
    userId: "UTD-900011",
    studentName: "Carson Smith",
    course: "CS 3354.012 — Software Engineering",
    assignment: "Architecture Assignment",
    previousValue: "85%",
    newValue: "92%",
    changedBy: "Klyne Smith",
    ipAddress: "10.0.12.44",
    reasonStatus: "Rubric adjustment — traceability feedback applied",
  },
  {
    timestamp: "2026-05-01 16:03:01",
    userId: "UTD-900042",
    studentName: "Maya Chen",
    course: "CS 4347.002 — Database Systems",
    assignment: "SQL Query Optimization",
    previousValue: "78%",
    newValue: "78%",
    changedBy: "Wei Wu",
    ipAddress: "10.0.12.88",
    reasonStatus: "No change — audit confirm click",
  },
  {
    timestamp: "2026-04-30 11:45:09",
    userId: "UTD-900077",
    studentName: "Jordan Lee",
    course: "CS 4390.0W1 — Computer Networks",
    assignment: "Network Protocol Analysis",
    previousValue: "72%",
    newValue: "85%",
    changedBy: "Ravi Prakash",
    ipAddress: "192.168.40.12",
    reasonStatus: "Late submission penalty removed — documented outage",
  },
  {
    timestamp: "2026-04-29 09:22:18",
    userId: "UTD-900011",
    studentName: "Carson Smith",
    course: "CS 3354.012 — Software Engineering",
    assignment: "Requirements Quiz",
    previousValue: "—",
    newValue: "88%",
    changedBy: "Klyne Smith",
    ipAddress: "10.0.12.44",
    reasonStatus: "Manual entry — imported from paper attempt",
  },
];

type CsvPreviewRow = { name: string; email: string; role: string; course: string; section: string };

const SAMPLE_CSV_TEXT = `name,email,role,course,section
Alex Rivera,arivera@utd.edu,student,CS 3354,001
Jamie Fox,jfox@utd.edu,instructor,CS 4347,002
Alex Rivera,arivera@utd.edu,student,CS 4390,W1`;

export function AdminDashboardPage() {
  const [dragOver, setDragOver] = useState(false);
  const [fileMeta, setFileMeta] = useState<{ name: string; size: number } | null>(null);
  const [previewRows, setPreviewRows] = useState<CsvPreviewRow[]>([]);
  const [validation, setValidation] = useState<{
    validRows: number;
    duplicateEmails: number;
    missingFields: number;
    readyToImport: number;
  } | null>(null);
  const [importDone, setImportDone] = useState<string | null>(null);

  const [auditSearch, setAuditSearch] = useState("");
  const [filterCourse, setFilterCourse] = useState("all");
  const [filterStudent, setFilterStudent] = useState("all");
  const [filterChangedBy, setFilterChangedBy] = useState("all");
  const [filterDateStatus, setFilterDateStatus] = useState("all");

  const parseCsv = useCallback((text: string) => {
    const lines = text.trim().split(/\r?\n/).filter(Boolean);
    if (lines.length < 2) return [];
    const header = lines[0].split(",").map((h) => h.trim().toLowerCase());
    const rows: CsvPreviewRow[] = [];
    for (let i = 1; i < lines.length; i++) {
      const parts = lines[i].split(",").map((p) => p.trim());
      const row: Record<string, string> = {};
      header.forEach((key, j) => {
        row[key] = parts[j] ?? "";
      });
      rows.push({
        name: row.name ?? "",
        email: row.email ?? "",
        role: row.role ?? "",
        course: row.course ?? "",
        section: row.section ?? "",
      });
    }
    return rows;
  }, []);

  const runValidation = useCallback((rows: CsvPreviewRow[]) => {
    const seen = new Set<string>();
    let duplicateRows = 0;
    for (const r of rows) {
      const e = r.email.trim().toLowerCase();
      if (!e) continue;
      if (seen.has(e)) duplicateRows += 1;
      else seen.add(e);
    }
    const missing = rows.filter((r) => !r.name || !r.email || !r.role || !r.course || !r.section).length;
    const valid = rows.length - missing;
    const ready = Math.max(0, valid - duplicateRows);
    setValidation({
      validRows: valid,
      duplicateEmails: duplicateRows,
      missingFields: missing,
      readyToImport: ready,
    });
  }, []);

  const handleFile = useCallback(
    (file: File) => {
      if (!file.name.toLowerCase().endsWith(".csv")) return;
      setFileMeta({ name: file.name, size: file.size });
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result ?? "");
        const rows = parseCsv(text.length ? text : SAMPLE_CSV_TEXT);
        setPreviewRows(rows.length ? rows : parseCsv(SAMPLE_CSV_TEXT));
        setValidation(null);
        setImportDone(null);
      };
      reader.readAsText(file);
    },
    [parseCsv],
  );

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragOver(false);
    const f = e.dataTransfer.files[0];
    if (f) handleFile(f);
  };

  const onPick = (e: ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0];
    if (f) handleFile(f);
  };

  const validateCsv = () => {
    const rows = previewRows.length ? previewRows : parseCsv(SAMPLE_CSV_TEXT);
    if (!previewRows.length) setPreviewRows(rows);
    runValidation(rows);
  };

  const importUsers = () => {
    const rows = previewRows.length ? previewRows : parseCsv(SAMPLE_CSV_TEXT);
    runValidation(rows);
    setImportDone(`Mock import queued for ${validation?.readyToImport ?? rows.length} users (frontend-only).`);
  };

  const auditFiltered = useMemo(() => {
    const q = auditSearch.trim().toLowerCase();
    return MOCK_AUDIT_LOG.filter((row) => {
      const matchQ =
        !q ||
        `${row.studentName} ${row.course} ${row.assignment} ${row.changedBy} ${row.reasonStatus}`.toLowerCase().includes(q);
      const matchCourse = filterCourse === "all" || row.course.includes(filterCourse);
      const matchStudent = filterStudent === "all" || row.studentName === filterStudent;
      const matchBy = filterChangedBy === "all" || row.changedBy === filterChangedBy;
      const matchStatus =
        filterDateStatus === "all" ||
        (filterDateStatus === "adjustment" && row.previousValue !== row.newValue) ||
        (filterDateStatus === "audit" && row.reasonStatus.toLowerCase().includes("audit"));
      return matchQ && matchCourse && matchStudent && matchBy && matchStatus;
    });
  }, [auditSearch, filterCourse, filterStudent, filterChangedBy, filterDateStatus]);

  const exportAuditCsv = () => {
    const header = [
      "timestamp",
      "user_id",
      "student_name",
      "course",
      "assignment",
      "previous_value",
      "new_value",
      "changed_by",
      "ip_address",
      "reason_status",
    ];
    const lines = [
      header.join(","),
      ...auditFiltered.map((r) =>
        [
          r.timestamp,
          r.userId,
          r.studentName,
          `"${r.course.replace(/"/g, '""')}"`,
          `"${r.assignment.replace(/"/g, '""')}"`,
          r.previousValue,
          r.newValue,
          r.changedBy,
          r.ipAddress,
          `"${r.reasonStatus.replace(/"/g, '""')}"`,
        ].join(","),
      ),
    ];
    const blob = new Blob([lines.join("\n")], { type: "text/csv;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `grade-audit-export-${new Date().toISOString().slice(0, 10)}.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const courses = ["CS 3354.012 — Software Engineering", "CS 4347.002 — Database Systems", "CS 4390.0W1 — Computer Networks"];
  const students = Array.from(new Set(MOCK_AUDIT_LOG.map((r) => r.studentName)));
  const staff = Array.from(new Set(MOCK_AUDIT_LOG.map((r) => r.changedBy)));

  return (
    <div className="min-h-full bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-8">
        <header className="flex flex-col gap-2 border-b border-slate-200 pb-6 dark:border-slate-800">
          <p className="text-xs font-black uppercase tracking-wide text-violet-700 dark:text-violet-300">Administrator</p>
          <h1 className="text-3xl font-black tracking-tight text-slate-950 dark:text-white">Admin Dashboard</h1>
          <p className="max-w-3xl text-sm text-slate-600 dark:text-slate-400">
            Frontend-only tools for bulk enrollment preview and grade change auditing. No data leaves this browser.
          </p>
        </header>

        {/* FR-38 CSV */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex items-start gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-violet-100 text-violet-800 dark:bg-violet-950/50 dark:text-violet-200">
              <Upload className="h-5 w-5" aria-hidden />
            </div>
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Bulk enrollment (CSV)</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Drag a roster CSV or choose a file. Validation is simulated locally.</p>
            </div>
          </div>

          <div
            onDragEnter={(e) => {
              e.preventDefault();
              setDragOver(true);
            }}
            onDragLeave={() => setDragOver(false)}
            onDragOver={(e) => e.preventDefault()}
            onDrop={onDrop}
            className={cn(
              "rounded-xl border-2 border-dashed p-10 text-center transition-colors",
              dragOver
                ? "border-violet-500 bg-violet-50 dark:border-violet-400 dark:bg-violet-950/30"
                : "border-slate-300 bg-slate-50 dark:border-slate-600 dark:bg-slate-800/50",
            )}
          >
            <FileSpreadsheet className="mx-auto mb-3 h-10 w-10 text-slate-400" aria-hidden />
            <p className="font-bold text-slate-800 dark:text-slate-200">Drop a .csv file here</p>
            <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Expected columns: name, email, role, course, section</p>
            <label className={cn("mt-4 inline-flex cursor-pointer items-center gap-2 rounded-lg bg-violet-600 px-4 py-2 text-sm font-bold text-white hover:bg-violet-700", FOCUS_RING)}>
              <input type="file" accept=".csv,text/csv" className="sr-only" onChange={onPick} />
              Choose file
            </label>
          </div>

          {fileMeta && (
            <p className="mt-4 text-sm font-semibold text-slate-700 dark:text-slate-300">
              Selected: <span className="font-black">{fileMeta.name}</span> ({(fileMeta.size / 1024).toFixed(1)} KB)
            </p>
          )}

          {previewRows.length > 0 && (
            <div className="mt-6 overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
              <table className="w-full min-w-[640px] text-left text-sm">
                <thead className="bg-slate-100 dark:bg-slate-800">
                  <tr>
                    {["Name", "Email", "Role", "Course", "Section"].map((h) => (
                      <th key={h} className="px-3 py-2 font-black text-slate-700 dark:text-slate-200">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {previewRows.map((row, i) => (
                    <tr key={i} className="bg-white dark:bg-slate-900">
                      <td className="px-3 py-2 text-slate-900 dark:text-slate-100">{row.name || "—"}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.email || "—"}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.role || "—"}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.course || "—"}</td>
                      <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.section || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-4 flex flex-wrap gap-3">
            <button type="button" onClick={validateCsv} className={cn("rounded-lg bg-slate-900 px-4 py-2 text-sm font-bold text-white dark:bg-slate-100 dark:text-slate-900", FOCUS_RING)}>
              Validate CSV
            </button>
            <button type="button" onClick={importUsers} className={cn("rounded-lg bg-emerald-600 px-4 py-2 text-sm font-bold text-white hover:bg-emerald-700", FOCUS_RING)}>
              Import Users
            </button>
          </div>

          {validation && (
            <ul className="mt-4 grid gap-2 sm:grid-cols-2 lg:grid-cols-4" role="status">
              <li className="flex items-center gap-2 rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm dark:border-emerald-800 dark:bg-emerald-950/40">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" /> Valid rows: {validation.validRows}
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-sm dark:border-amber-800 dark:bg-amber-950/40">
                <AlertTriangle className="h-4 w-4 text-amber-600" /> Duplicate emails: {validation.duplicateEmails}
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm dark:border-red-900 dark:bg-red-950/30">
                <AlertTriangle className="h-4 w-4 text-red-600" /> Missing fields: {validation.missingFields}
              </li>
              <li className="flex items-center gap-2 rounded-lg border border-violet-200 bg-violet-50 px-3 py-2 text-sm dark:border-violet-800 dark:bg-violet-950/40">
                <Shield className="h-4 w-4 text-violet-600" /> Ready to import: {validation.readyToImport}
              </li>
            </ul>
          )}
          {importDone && (
            <p className="mt-3 text-sm font-semibold text-emerald-800 dark:text-emerald-300" role="status">
              {importDone}
            </p>
          )}
        </section>

        {/* FR-54 Audit */}
        <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <div className="mb-4 flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <h2 className="text-lg font-black text-slate-950 dark:text-white">Grade change audit log</h2>
              <p className="text-sm text-slate-600 dark:text-slate-400">Comprehensive history with IP metadata (mock).</p>
            </div>
            <button
              type="button"
              onClick={exportAuditCsv}
              className={cn("inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-800 hover:bg-slate-50 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700", FOCUS_RING)}
            >
              <Download className="h-4 w-4" /> Export CSV
            </button>
          </div>

          <div className="mb-4 flex flex-wrap gap-3">
            <div className="relative min-w-[200px] flex-1">
              <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
              <input
                type="search"
                value={auditSearch}
                onChange={(e) => setAuditSearch(e.target.value)}
                placeholder="Search entries..."
                className="w-full rounded-lg border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder:text-slate-500 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
              />
            </div>
            <select
              value={filterCourse}
              onChange={(e) => setFilterCourse(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All courses</option>
              {courses.map((c) => (
                <option key={c} value={c}>
                  {c}
                </option>
              ))}
            </select>
            <select
              value={filterStudent}
              onChange={(e) => setFilterStudent(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">All students</option>
              {students.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterChangedBy}
              onChange={(e) => setFilterChangedBy(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">Changed by (any)</option>
              {staff.map((s) => (
                <option key={s} value={s}>
                  {s}
                </option>
              ))}
            </select>
            <select
              value={filterDateStatus}
              onChange={(e) => setFilterDateStatus(e.target.value)}
              className="rounded-lg border border-slate-200 bg-white px-3 py-2 text-sm dark:border-slate-600 dark:bg-slate-800 dark:text-slate-100"
            >
              <option value="all">Status (any)</option>
              <option value="adjustment">Grade changed</option>
              <option value="audit">Audit / confirm</option>
            </select>
          </div>

          <div className="overflow-x-auto rounded-lg border border-slate-200 dark:border-slate-700">
            <table className="w-full min-w-[960px] text-left text-sm">
              <thead className="bg-slate-100 dark:bg-slate-800">
                <tr>
                  {["Timestamp", "User ID", "Student", "Course", "Assignment", "Previous", "New", "Changed by", "IP", "Reason / status"].map((h) => (
                    <th key={h} className="px-3 py-2 font-black text-slate-700 dark:text-slate-200">
                      {h}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {auditFiltered.map((row) => (
                  <tr key={`${row.timestamp}-${row.userId}-${row.assignment}`} className="bg-white dark:bg-slate-900">
                    <td className="whitespace-nowrap px-3 py-2 text-slate-600 dark:text-slate-400">{row.timestamp}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-800 dark:text-slate-200">{row.userId}</td>
                    <td className="px-3 py-2 font-semibold text-slate-900 dark:text-slate-100">{row.studentName}</td>
                    <td className="max-w-[200px] px-3 py-2 text-slate-700 dark:text-slate-300">{row.course}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.assignment}</td>
                    <td className="px-3 py-2 text-slate-600 dark:text-slate-400">{row.previousValue}</td>
                    <td className="px-3 py-2 font-bold text-slate-900 dark:text-white">{row.newValue}</td>
                    <td className="px-3 py-2 text-slate-700 dark:text-slate-300">{row.changedBy}</td>
                    <td className="px-3 py-2 font-mono text-xs text-slate-600 dark:text-slate-400">{row.ipAddress}</td>
                    <td className="max-w-[220px] px-3 py-2 text-slate-600 dark:text-slate-400">{row.reasonStatus}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {auditFiltered.length === 0 && (
            <p className="mt-4 text-center text-sm text-slate-500 dark:text-slate-400">No audit entries match your filters.</p>
          )}
        </section>
      </div>
    </div>
  );
}
