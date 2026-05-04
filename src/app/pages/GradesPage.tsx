import {
  Calendar as CalendarIcon,
  Download,
  Eye,
  History,
  Search,
  TrendingUp,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { COURSES } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

const COURSE_GRADE_DETAILS: Record<string, {
  grade: string;
  percent: number;
  trend: string;
  feedback: string;
  assignments: Array<{ title: string; score: string; status: string; feedback: string }>;
}> = {
  cs4390: {
    grade: "A-",
    percent: 88,
    trend: "+3%",
    feedback: "Packet capture feedback posted",
    assignments: [
      { title: "Network Protocol Analysis", score: "85/100", status: "Graded", feedback: "Good TCP retransmission notes" },
      { title: "Subnetting Practice", score: "92/100", status: "Graded", feedback: "Strong calculation accuracy" },
      { title: "Protocol Quiz", score: "Upcoming", status: "In Progress", feedback: "Due May 9" },
    ],
  },
  cs3354: {
    grade: "A",
    percent: 92,
    trend: "+1%",
    feedback: "Project milestone on track",
    assignments: [
      { title: "Software Design Patterns Lab", score: "Submitted", status: "Submitted", feedback: "Awaiting rubric notes after May 8 due date" },
      { title: "Requirements Traceability", score: "95/100", status: "Graded", feedback: "Clear acceptance criteria" },
      { title: "UML Sequence Draft", score: "88/100", status: "Graded", feedback: "Add actor/service boundary detail" },
    ],
  },
  cs4347: {
    grade: "B+",
    percent: 84,
    trend: "-2%",
    feedback: "Midterm review recommended",
    assignments: [
      { title: "SQL Query Optimization", score: "78/100", status: "Graded", feedback: "Submitted April 28; index choice needs more explanation" },
      { title: "ER Modeling Checkpoint", score: "89/100", status: "Graded", feedback: "Good relationship constraints" },
      { title: "Midterm: Database Normalization", score: "Upcoming", status: "In Progress", feedback: "Due May 11; review 2NF/3NF and joins" },
    ],
  },
};

const COURSE_GRADES = COURSES.map((course) => ({
  code: course.code,
  name: course.title,
  ...(COURSE_GRADE_DETAILS[course.id] ?? {
    grade: course.grade,
    percent: course.progress,
    trend: "+0%",
    feedback: "Course activity is available in the LMS.",
    assignments: course.assignments.map((assignment) => ({
      title: assignment.title,
      score: assignment.dueDate.startsWith("April") ? "Submitted" : "Upcoming",
      status: assignment.dueDate.startsWith("April") ? "Submitted" : "In Progress",
      feedback: assignment.dueDate.startsWith("April") ? `Submitted ${assignment.dueDate}` : `Due ${assignment.dueDate}`,
    })),
  }),
}));

const GRADE_LOGS = [
  {
    timestamp: "2026-04-30 14:32:15",
    id: "AL-20260430-001",
    modifiedBy: "Klyne Smith",
    assignment: "Software Architecture Assignment",
    course: "CS 3354.012: Software Engineering",
    previous: 85,
    new: 92,
    ip: "192.168.1.45",
  },
  {
    timestamp: "2026-04-29 11:15:03",
    id: "AL-20260429-002",
    modifiedBy: "Wei Wu",
    assignment: "SQL Project Phase 2",
    course: "CS 4347.002: Database Systems",
    previous: 78,
    new: 78,
    ip: "192.168.1.23",
  },
  {
    timestamp: "2026-04-27 09:12:31",
    id: "AL-20260427-005",
    modifiedBy: "Ravi Prakash",
    assignment: "Network Protocol Analysis",
    course: "CS 4390.0W1: Computer Networks",
    previous: 72,
    new: 85,
    ip: "192.168.1.67",
  },
];

const CLASS_COMPARISONS = [
  {
    code: "CS 4390.0W1",
    name: "Computer Networks",
    studentGrade: 88,
    classAverage: 82,
    classMedian: 84,
    percentile: 76,
    buckets: [
      { label: "A range", range: "90-100", count: 9 },
      { label: "B range", range: "80-89", count: 17 },
      { label: "C range", range: "70-79", count: 8 },
      { label: "D/F range", range: "Below 70", count: 4 },
    ],
  },
  {
    code: "CS 3354.012",
    name: "Software Engineering",
    studentGrade: 92,
    classAverage: 86,
    classMedian: 87,
    percentile: 82,
    buckets: [
      { label: "A range", range: "90-100", count: 16 },
      { label: "B range", range: "80-89", count: 21 },
      { label: "C range", range: "70-79", count: 8 },
      { label: "D/F range", range: "Below 70", count: 3 },
    ],
  },
  {
    code: "CS 4347.002",
    name: "Database Systems",
    studentGrade: 84,
    classAverage: 79,
    classMedian: 80,
    percentile: 68,
    buckets: [
      { label: "A range", range: "90-100", count: 7 },
      { label: "B range", range: "80-89", count: 18 },
      { label: "C range", range: "70-79", count: 12 },
      { label: "D/F range", range: "Below 70", count: 5 },
    ],
  },
  {
    code: "CS 4337.005",
    name: "Programming Language Paradigms",
    studentGrade: 87,
    classAverage: 81,
    classMedian: 82,
    percentile: 73,
    buckets: [
      { label: "A range", range: "90-100", count: 8 },
      { label: "B range", range: "80-89", count: 15 },
      { label: "C range", range: "70-79", count: 9 },
      { label: "D/F range", range: "Below 70", count: 4 },
    ],
  },
];

const STATUS_CLASS: Record<string, string> = {
  Graded: "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950/40 dark:text-emerald-300 dark:border-emerald-800",
  Submitted: "bg-blue-50 text-blue-700 border-blue-200 dark:bg-blue-950/40 dark:text-blue-300 dark:border-blue-800",
  "In Progress": "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950/40 dark:text-amber-300 dark:border-amber-800",
};

const BUCKET_COLORS = [
  "bg-emerald-500 dark:bg-emerald-400",
  "bg-blue-500 dark:bg-blue-400",
  "bg-amber-500 dark:bg-amber-400",
  "bg-rose-500 dark:bg-rose-400",
];

export function GradesPage() {
  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1500px] mx-auto animate-in fade-in duration-500 text-slate-900 dark:text-slate-100">
      <div className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight dark:text-white">Grades</h2>
          <p className="text-sm text-slate-600 mt-1 dark:text-slate-400">Course grades first, with audit history kept below for transparency.</p>
        </div>
        <div className="flex flex-wrap gap-2">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search grades..."
              className={cn("w-64 pl-9 pr-3 py-2 bg-white border border-slate-200 rounded text-sm text-slate-900 placeholder-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white dark:placeholder-slate-500", FOCUS_RING)}
            />
          </div>
          <button type="button" className={cn("inline-flex items-center gap-2 px-3 py-2 bg-white border border-slate-200 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800", FOCUS_RING)}>
            <CalendarIcon className="w-4 h-4" /> Term
          </button>
          <button type="button" className={cn("inline-flex items-center gap-2 px-4 py-2 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-900 dark:bg-cyan-500 dark:text-slate-950 dark:hover:bg-cyan-400", FOCUS_RING)}>
            <Download className="w-4 h-4" /> Export
          </button>
        </div>
      </div>

      <div className="grid gap-4 lg:grid-cols-3">
        {COURSE_GRADES.map((course, index) => (
          <motion.article
            key={course.code}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900"
          >
            <div className="flex items-start justify-between gap-3">
              <div>
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">{course.code}</p>
                <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.name}</h3>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{course.feedback}</p>
              </div>
              <div className="text-right">
                <p className="text-3xl font-black text-slate-900 dark:text-white">{course.grade}</p>
                <p className="text-sm font-bold text-slate-500 dark:text-slate-400">{course.percent}%</p>
              </div>
            </div>

            <div className="mt-4">
              <div className="mb-2 flex items-center justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
                <span>Course progress</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 dark:text-emerald-300"><TrendingUp className="w-3 h-3" /> {course.trend}</span>
              </div>
              <div className="h-2 rounded-full bg-slate-100 overflow-hidden dark:bg-slate-800">
                <div className="h-full rounded-full bg-slate-800 dark:bg-cyan-400" style={{ width: `${course.percent}%` }} />
              </div>
            </div>

            <div className="mt-4 space-y-2">
              {course.assignments.map((assignment) => (
                <div key={assignment.title} className="rounded border border-slate-100 bg-slate-50 p-3 dark:border-slate-800 dark:bg-slate-950">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{assignment.title}</p>
                      <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{assignment.feedback}</p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-sm font-black text-slate-900 dark:text-white">{assignment.score}</p>
                      <span className={cn("mt-1 inline-flex rounded border px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", STATUS_CLASS[assignment.status])}>
                        {assignment.status}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </motion.article>
        ))}
      </div>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-800 dark:bg-slate-900">
        <div className="mb-4 flex flex-col gap-2 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Anonymous Class Grade Distribution</h3>
            <p className="text-sm text-slate-600 dark:text-slate-400">Compare your grade with aggregate class averages. No other student names or individual scores are shown.</p>
          </div>
          <span className="w-fit rounded border border-slate-200 bg-slate-50 px-2 py-1 text-xs font-bold text-slate-600 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-300">Mock aggregate data</span>
        </div>
        <div className="grid gap-4 xl:grid-cols-2">
          {CLASS_COMPARISONS.map((course) => {
            const total = course.buckets.reduce((sum, bucket) => sum + bucket.count, 0);
            const difference = course.studentGrade - course.classAverage;
            return (
              <article key={course.code} className="rounded border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-950">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">{course.code}</p>
                    <h4 className="text-base font-black text-slate-900 dark:text-white">{course.name}</h4>
                    <p className="mt-1 text-sm font-semibold text-slate-700 dark:text-slate-300">
                      You are {Math.abs(difference)} points {difference >= 0 ? "above" : "below"} the class average.
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-2 text-sm sm:min-w-64">
                    <StatTile label="Your grade" value={`${course.studentGrade}%`} />
                    <StatTile label="Class average" value={`${course.classAverage}%`} />
                    <StatTile label="Class median" value={`${course.classMedian}%`} />
                    <StatTile label="Percentile" value={`${course.percentile}th`} />
                  </div>
                </div>
                <div className="mt-4" aria-label={`${course.name} anonymous grade distribution`}>
                  <div className="mb-2 flex items-center justify-between gap-3 text-xs font-bold text-slate-600 dark:text-slate-300">
                    <span>Grade buckets</span>
                    <span>{total} students represented anonymously</span>
                  </div>
                  <div className="overflow-hidden rounded border border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-900" role="img" aria-label={`${course.name} distribution: ${course.buckets.map((bucket) => `${bucket.label} ${bucket.count}`).join(", ")}`}>
                    <div className="flex h-9 w-full">
                      {course.buckets.map((bucket, bucketIndex) => {
                        const percent = (bucket.count / total) * 100;
                        return (
                          <div
                            key={bucket.label}
                            className={cn("flex items-center justify-center border-r border-white text-[11px] font-black text-white last:border-r-0 dark:border-slate-900", BUCKET_COLORS[bucketIndex])}
                            style={{ width: `${percent}%` }}
                            title={`${bucket.label}: ${bucket.count} students (${Math.round(percent)}%)`}
                          >
                            {percent >= 14 ? `${Math.round(percent)}%` : ""}
                          </div>
                        );
                      })}
                    </div>
                    <div className="space-y-2 p-3">
                    {course.buckets.map((bucket, bucketIndex) => {
                      const percent = (bucket.count / total) * 100;
                      return (
                      <div
                        key={bucket.label}
                        className="grid grid-cols-[84px_minmax(0,1fr)_72px] items-center gap-2 text-xs sm:grid-cols-[92px_minmax(0,1fr)_88px]"
                      >
                        <div>
                          <p className="font-black text-slate-900 dark:text-white">{bucket.label}</p>
                          <p className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">{bucket.range}</p>
                        </div>
                        <div className="h-3 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                          <div className={cn("h-full rounded-full", BUCKET_COLORS[bucketIndex])} style={{ width: `${percent}%` }} />
                        </div>
                        <p className="text-right font-black text-slate-700 dark:text-slate-200">{bucket.count} ({Math.round(percent)}%)</p>
                      </div>
                    );
                    })}
                    </div>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </section>

      <section className="rounded-lg border border-slate-200 bg-white shadow-sm overflow-hidden dark:border-slate-800 dark:bg-slate-900">
        <div className="flex items-center justify-between gap-3 border-b border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-800 dark:bg-slate-950">
          <div>
            <h3 className="flex items-center gap-2 text-base font-bold text-slate-900 dark:text-white">
              <History className="w-4 h-4" /> Compact Grade Audit Log
            </h3>
            <p className="text-xs text-slate-600 mt-0.5 dark:text-slate-400">Timestamp, previous value, new value, modifier, and IP address are preserved here.</p>
          </div>
          <span className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-600 dark:bg-slate-900 dark:text-slate-300">3 recent entries</span>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-white border-b border-slate-100 dark:border-slate-800 dark:bg-slate-900">
              <tr>
                {["Timestamp", "Course / Assignment", "Previous", "New", "Modifier", "IP Address", "View"].map((heading) => (
                  <th key={heading} className="px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500">{heading}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {GRADE_LOGS.map((log) => (
                <tr key={log.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/60">
                  <td className="px-4 py-3 text-xs font-medium text-slate-700 dark:text-slate-300">{log.timestamp}<br /><span className="text-slate-400 dark:text-slate-500">{log.id}</span></td>
                  <td className="px-4 py-3"><p className="font-bold text-slate-900 dark:text-white">{log.assignment}</p><p className="text-xs text-slate-500 dark:text-slate-400">{log.course}</p></td>
                  <td className="px-4 py-3 font-bold text-slate-700 dark:text-slate-300">{log.previous}</td>
                  <td className="px-4 py-3 font-bold text-slate-900 dark:text-white">{log.new}</td>
                  <td className="px-4 py-3 text-slate-700 dark:text-slate-300">{log.modifiedBy}</td>
                  <td className="px-4 py-3 font-mono text-xs text-slate-500 dark:text-slate-400">{log.ip}</td>
                  <td className="px-4 py-3">
                    <button type="button" className={cn("rounded p-1.5 text-slate-400 hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-slate-800 dark:hover:text-slate-200", FOCUS_RING)} aria-label={`View audit log ${log.id}`}>
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  );
}

function StatTile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded border border-slate-200 bg-white p-2 dark:border-slate-700 dark:bg-slate-900">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="text-lg font-black text-slate-900 dark:text-white">{value}</p>
    </div>
  );
}
