import {
  Search,
  Filter,
  Calendar as CalendarIcon,
  Download,
  Eye,
  ChevronLeft,
  ChevronRight,
  TrendingUp,
  TrendingDown,
  Users,
  LayoutDashboard,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const GRADE_STATS = [
  {
    label: "Total Changes",
    value: "127",
    sub: "Last 30 days",
    icon: LayoutDashboard,
    color: "text-slate-900",
  },
  {
    label: "Grade Increases",
    value: "89",
    sub: "70% of changes",
    icon: TrendingUp,
    color: "text-emerald-500",
  },
  {
    label: "Grade Decreases",
    value: "12",
    sub: "9% of changes",
    icon: TrendingDown,
    color: "text-red-500",
  },
  {
    label: "Unique Instructors",
    value: "18",
    sub: "Made modifications",
    icon: Users,
    color: "text-slate-900",
  },
];

const GRADE_LOGS = [
  {
    timestamp: "2026-02-18 14:32:15",
    id: "AL-20260218-001",
    modifiedBy: "Klyne Smith",
    instructorId: "INS-301",
    student: "Zabisaq Tasharmapandyasan",
    studentId: "ZXT220067",
    assignment: "Software Architecture Assignment",
    course: "CS 3354.012: Software Engineering",
    previous: 85,
    new: 92,
    change: +7,
    ip: "192.168.1.45",
  },
  {
    timestamp: "2026-02-18 11:15:03",
    id: "AL-20260218-002",
    modifiedBy: "Wei Wu",
    instructorId: "INS-205",
    student: "Jamie Rodriguez",
    studentId: "STU-3892",
    assignment: "SQL Project Phase 2",
    course: "CS 4347.002: Database Systems",
    previous: 78,
    new: 78,
    change: 0,
    ip: "192.168.1.23",
  },
  {
    timestamp: "2026-02-17 16:48:22",
    id: "AL-20260217-003",
    modifiedBy: "Omar Hamdy",
    instructorId: "TA-122",
    student: "Taylor Kim",
    studentId: "STU-5123",
    assignment: "Logic Design Project",
    course: "CS 4341.003: Digital Logic and Computer Design",
    previous: 0,
    new: 88,
    change: +88,
    ip: "10.0.2.18",
  },
  {
    timestamp: "2026-02-17 13:20:45",
    id: "AL-20260217-004",
    modifiedBy: "Klyne Smith",
    instructorId: "INS-301",
    student: "Zabisaq Tasharmapandyasan",
    studentId: "ZXT220067",
    assignment: "Design Patterns Project",
    course: "CS 3354.012: Software Engineering",
    previous: 95,
    new: 90,
    change: -5,
    ip: "192.168.1.45",
  },
  {
    timestamp: "2026-02-16 09:12:31",
    id: "AL-20260216-005",
    modifiedBy: "Ravi Prakash",
    instructorId: "INS-412",
    student: "Morgan Davis",
    studentId: "STU-6234",
    assignment: "Network Protocol Analysis",
    course: "CS 4390.0W1: Computer Networks",
    previous: 72,
    new: 85,
    change: +13,
    ip: "192.168.1.67",
  },
];

export function GradesPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500">
      <div>
        <h2 className="text-2xl font-black text-slate-900 tracking-tight">
          Grade Change Audit Logs
        </h2>
        <p className="text-slate-500 font-medium">
          Comprehensive tracking of all grade modifications for
          academic integrity monitoring.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="flex flex-wrap items-center gap-4">
        <div className="flex-1 min-w-[300px] relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
          <input
            type="text"
            placeholder="Search by student, instructor, course, or assignment..."
            className="w-full pl-11 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-100 focus:border-blue-500 transition-all shadow-sm"
          />
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <Filter className="w-4 h-4" /> Filters
        </button>
        <button className="flex items-center gap-2 px-5 py-3 bg-white border border-slate-200 rounded-xl text-sm font-bold text-slate-600 hover:bg-slate-50 transition-all shadow-sm">
          <CalendarIcon className="w-4 h-4" /> Date Range
        </button>
        <button className="flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 active:scale-95">
          <Download className="w-4 h-4" /> Export CSV
        </button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {GRADE_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm"
          >
            <p className="text-sm font-bold text-slate-400 uppercase tracking-wider">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3
                className={cn(
                  "text-3xl font-black",
                  stat.color,
                )}
              >
                {stat.value}
              </h3>
              {stat.label === "Grade Increases" && (
                <span className="text-xs font-bold text-slate-400">
                  70% of changes
                </span>
              )}
              {stat.label === "Grade Decreases" && (
                <span className="text-xs font-bold text-slate-400">
                  9% of changes
                </span>
              )}
            </div>
            <p className="text-xs font-bold text-slate-400 mt-1 uppercase tracking-widest">
              {stat.sub}
            </p>
          </motion.div>
        ))}
      </div>

      {/* Logs Table */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-slate-50/50 border-b border-slate-100">
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Timestamp
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Modified By
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Student
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Assignment
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  Previous
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-center">
                  New
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  IP Address
                </th>
                <th className="px-6 py-4 text-[10px] font-black text-slate-400 uppercase tracking-widest text-right">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {GRADE_LOGS.map((log) => (
                <tr
                  key={log.id}
                  className="hover:bg-slate-50/50 transition-colors group"
                >
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-900">
                      {log.timestamp}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {log.id}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-900">
                      {log.modifiedBy}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {log.instructorId}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-900">
                      {log.student}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {log.studentId}
                    </p>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-bold text-slate-900">
                      {log.assignment}
                    </p>
                    <p className="text-[10px] font-medium text-slate-400 mt-0.5">
                      {log.course}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <span className="text-xs font-bold text-slate-900">
                      {log.previous}
                    </span>
                  </td>
                  <td className="px-6 py-5 text-center">
                    <div className="flex items-center justify-center gap-1.5">
                      <span className="text-xs font-bold text-slate-900">
                        {log.new}
                      </span>
                      {log.change !== 0 && (
                        <span
                          className={cn(
                            "text-[10px] font-black px-1.5 py-0.5 rounded-full",
                            log.change > 0
                              ? "text-emerald-600 bg-emerald-50"
                              : "text-red-600 bg-red-50",
                          )}
                        >
                          (
                          {log.change > 0
                            ? `+${log.change}`
                            : log.change}
                          )
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-5">
                    <p className="text-xs font-medium text-slate-500 font-mono">
                      {log.ip}
                    </p>
                  </td>
                  <td className="px-6 py-5 text-right">
                    <button className="p-2 text-slate-300 hover:text-slate-600 hover:bg-white rounded-lg border border-transparent hover:border-slate-100 shadow-none hover:shadow-sm transition-all">
                      <Eye className="w-4 h-4" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="px-6 py-4 bg-slate-50/50 border-t border-slate-100 flex items-center justify-between">
          <p className="text-xs font-bold text-slate-400">
            Showing 1 to 5 of 127 entries
          </p>
          <div className="flex items-center gap-1">
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button className="w-8 h-8 rounded-lg bg-blue-600 text-white text-xs font-bold">
              1
            </button>
            <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-white text-xs font-bold">
              2
            </button>
            <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-white text-xs font-bold">
              3
            </button>
            <span className="px-2 text-slate-300">...</span>
            <button className="w-8 h-8 rounded-lg text-slate-500 hover:bg-white text-xs font-bold">
              12
            </button>
            <button className="p-2 text-slate-400 hover:text-slate-900 transition-colors">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}