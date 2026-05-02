import {
  Users,
  BookOpen,
  GraduationCap,
  Clock,
  TrendingUp,
  CheckCircle2,
  AlertCircle,
  BarChart3,
  Calendar as CalendarIcon,
  ChevronRight,
  User,
  MoreVertical,
  Star,
  Zap,
  LayoutDashboard,
  Pin,
  X,
  Megaphone,
} from "lucide-react";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Cell,
} from "recharts";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DASHBOARD_STATS = [
  {
    label: "Courses Enrolled",
    value: "6",
    change: "+2 this semester",
    icon: BookOpen,
    color: "bg-blue-500",
    shadow: "shadow-blue-200",
  },
  {
    label: "Completed Lessons",
    value: "127",
    change: "+12 last 30 days",
    icon: CheckCircle2,
    color: "bg-emerald-500",
    shadow: "shadow-emerald-200",
  },
  {
    label: "Current GPA",
    value: "3.85",
    change: "+0.15 vs last sem",
    icon: TrendingUp,
    color: "bg-purple-500",
    shadow: "shadow-purple-200",
  },
  {
    label: "Upcoming Tests",
    value: "3",
    change: "Next: Database Design",
    icon: AlertCircle,
    color: "bg-orange-500",
    shadow: "shadow-orange-200",
  },
];

const PERFORMANCE_DATA = [
  { month: "Jan", score: 85 },
  { month: "Feb", score: 88 },
  { month: "Mar", score: 92 },
  { month: "Apr", score: 90 },
  { month: "May", score: 95 },
  { month: "Jun", score: 98 },
];

const WEEKLY_HOURS = [
  { day: "Mon", hours: 4.5 },
  { day: "Tue", hours: 6.2 },
  { day: "Wed", hours: 5.1 },
  { day: "Thu", hours: 3.8 },
  { day: "Fri", hours: 7.4 },
  { day: "Sat", hours: 2.5 },
  { day: "Sun", hours: 4.0 },
];

// FR-01: Courses with pin support
const ALL_COURSES = [
  {
    id: "cs3354",
    name: "Software Engineering",
    code: "CS 3354.012",
    progress: 75,
    grade: "A",
    instructor: "Klyne Smith",
    color: "bg-blue-600",
  },
  {
    id: "cs4337",
    name: "Programming Language Paradigms",
    code: "CS 4337.005",
    progress: 60,
    grade: "B+",
    instructor: "Chris Davis",
    color: "bg-purple-600",
  },
  {
    id: "cs4341",
    name: "Digital Logic and Computer Design",
    code: "CS 4341.003",
    progress: 45,
    grade: "A-",
    instructor: "Omar Hamdy",
    color: "bg-emerald-600",
  },
  {
    id: "cs4347",
    name: "Database Systems",
    code: "CS 4347.002",
    progress: 90,
    grade: "A",
    instructor: "Wei Wu",
    color: "bg-pink-600",
  },
  {
    id: "cs4390",
    name: "Computer Networks",
    code: "CS 4390.0W1",
    progress: 82,
    grade: "A-",
    instructor: "Ravi Prakash",
    color: "bg-orange-600",
  },
  {
    id: "isns2359",
    name: "Earthquakes and Volcanoes",
    code: "ISNS 2359.0W1",
    progress: 65,
    grade: "B+",
    instructor: "Ignacio Pujana",
    color: "bg-indigo-600",
  },
];

// FR-01: Deadlines with links and countdown
const DEADLINES = [
  {
    title: "SQL Query Optimization",
    date: "Tomorrow, 11:59 PM",
    course: "CS 4347.002",
    color: "border-l-orange-500",
    to: "/courses/cs4347/assignments/4",
    daysLeft: 1,
  },
  {
    title: "Network Protocol Analysis",
    date: "May 1, 10:00 AM",
    course: "CS 4390.0W1",
    color: "border-l-blue-500",
    to: "/courses/cs4390/assignments/5",
    daysLeft: 2,
  },
  {
    title: "Volcanic Hazard Assessment",
    date: "May 3, 6:00 PM",
    course: "ISNS 2359.0W1",
    color: "border-l-purple-500",
    to: "/courses/isns2359/assignments/9",
    daysLeft: 4,
  },
];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Spring Break Schedule Update",
    message:
      "Campus will be closed from March 15-22. All online courses will continue as scheduled.",
    isPinned: true,
    date: "2 days ago",
  },
  {
    id: 2,
    title: "Final Exam Dates Released",
    message:
      "Check your course pages for specific exam times and locations. Study resources are now available.",
    isPinned: true,
    date: "1 week ago",
  },
  {
    id: 3,
    title: "Career Fair - May 8th",
    message:
      "Don't miss the annual career fair! Register early to secure your spot with top employers.",
    isPinned: false,
    date: "3 days ago",
  },
];

function CourseCard({
  course,
  isPinned,
  onTogglePin,
}: {
  course: (typeof ALL_COURSES)[0];
  isPinned: boolean;
  onTogglePin: () => void;
}) {
  return (
    <div className="p-3 rounded border border-slate-200 bg-white hover:shadow-md transition-all group flex flex-col">
      <div className="flex justify-between items-start mb-2">
        <div
          className={cn(
            "px-2 py-1 rounded text-white font-semibold text-[9px]",
            course.color,
          )}
        >
          {course.code}
        </div>
        <button
          onClick={onTogglePin}
          title={isPinned ? "Unpin course" : "Pin course"}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pin
            className={cn(
              "w-3 h-3 text-slate-400 hover:text-slate-600 transition-colors",
              isPinned && "fill-current text-slate-700",
            )}
          />
        </button>
      </div>
      <Link to={`/courses/${course.id}`} className="block flex-1">
        <h4 className="font-semibold text-xs text-slate-900 mb-1 hover:text-slate-700 transition-colors line-clamp-2">
          {course.name}
        </h4>
      </Link>
      <p className="text-xs text-slate-500 mb-3">
        {course.instructor}
      </p>
      <div className="space-y-1 mt-auto">
        <div className="flex justify-between text-[9px] font-semibold text-slate-600 uppercase">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="h-1.5 bg-slate-100 rounded overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded", course.color)}
          />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [announcements, setAnnouncements] = useState(
    INITIAL_ANNOUNCEMENTS,
  );
  // FR-01: pinned courses
  const [pinnedCourseIds, setPinnedCourseIds] = useState<
    string[]
  >(["cs3354", "cs4347"]);

  const togglePin = (id: number) => {
    setAnnouncements(
      announcements.map((ann) =>
        ann.id === id
          ? { ...ann, isPinned: !ann.isPinned }
          : ann,
      ),
    );
  };

  const removeAnnouncement = (id: number) => {
    setAnnouncements(
      announcements.filter((ann) => ann.id !== id),
    );
  };

  const toggleCoursePin = (courseId: string) => {
    setPinnedCourseIds((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId],
    );
  };

  const pinnedAnnouncements = announcements.filter(
    (a) => a.isPinned,
  );
  const pinnedCourses = ALL_COURSES.filter((c) =>
    pinnedCourseIds.includes(c.id),
  );
  const unpinnedCourses = ALL_COURSES.filter(
    (c) => !pinnedCourseIds.includes(c.id),
  );

  return (
    <div className="p-6 space-y-6 max-w-full animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Dashboard
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Welcome back! You have 3 assignments due this week.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button className="flex items-center gap-1.5 px-3 py-1.5 bg-white border border-slate-200 rounded text-sm font-medium text-slate-700 hover:bg-slate-50 transition-colors">
            <CalendarIcon className="w-4 h-4" /> Schedule
          </button>
          <button className="flex items-center gap-1.5 px-4 py-1.5 bg-slate-800 text-white rounded text-sm font-medium hover:bg-slate-900 transition-colors">
            <Zap className="w-4 h-4" /> Learn
          </button>
        </div>
      </div>

      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-600">
            <Megaphone className="w-3 h-3" />
            <span>Announcements</span>
          </div>
          {pinnedAnnouncements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-blue-50 border border-blue-200 p-3 rounded flex items-start gap-3"
            >
              <div className="w-4 h-4 bg-blue-600 rounded flex-shrink-0 mt-0.5"></div>
              <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-sm text-slate-900">
                  {announcement.title}
                </h3>
                <p className="text-xs text-slate-700 mt-0.5 leading-relaxed">
                  {announcement.message}
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {announcement.date}
                </p>
              </div>
              <div className="flex items-center gap-1 flex-shrink-0">
                <button
                  onClick={() => togglePin(announcement.id)}
                  className="p-1 hover:bg-white rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <Pin className="w-3 h-3 text-slate-400" />
                </button>
                <button
                  onClick={() =>
                    removeAnnouncement(announcement.id)
                  }
                  className="p-1 hover:bg-white rounded transition-colors opacity-0 group-hover:opacity-100"
                >
                  <X className="w-3 h-3 text-slate-400" />
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {DASHBOARD_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white p-4 rounded border border-slate-200 shadow-sm hover:shadow-md transition-all"
          >
            <div className="flex justify-between items-start mb-3">
              <div
                className={cn(
                  "p-2 rounded",
                  stat.color,
                )}
              >
                <stat.icon className="w-4 h-4 text-white" />
              </div>
            </div>
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {stat.label}
            </p>
            <div className="flex items-baseline gap-2 mt-2">
              <h3 className="text-2xl font-bold text-slate-900">
                {stat.value}
              </h3>
              <span className="text-xs text-slate-600 bg-slate-50 px-1.5 py-0.5 rounded">
                {stat.change}
              </span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                  <BarChart3 className="w-4 h-4" /> Academic Performance
                </h3>
                <p className="text-xs text-slate-600 mt-0.5">
                  Score trends across all courses
                </p>
              </div>
              <select className="bg-slate-50 border border-slate-200 text-xs font-medium rounded px-2 py-1 outline-none text-slate-700">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient
                      id="colorScore"
                      x1="0"
                      y1="0"
                      x2="0"
                      y2="1"
                    >
                      <stop
                        offset="5%"
                        stopColor="#1e293b"
                        stopOpacity={0.05}
                      />
                      <stop
                        offset="95%"
                        stopColor="#2563eb"
                        stopOpacity={0}
                      />
                    </linearGradient>
                  </defs>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f1f5f9"
                  />
                  <XAxis
                    dataKey="month"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#94a3b8",
                      fontWeight: 600,
                    }}
                    dy={10}
                  />
                  <YAxis
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 12,
                      fill: "#94a3b8",
                      fontWeight: 600,
                    }}
                    dx={-10}
                  />
                  <Tooltip
                    contentStyle={{
                      borderRadius: "12px",
                      border: "none",
                      boxShadow:
                        "0 10px 15px -3px rgb(0 0 0 / 0.1)",
                      fontWeight: "bold",
                    }}
                    itemStyle={{ color: "#2563eb" }}
                  />
                  <Area
                    type="monotone"
                    dataKey="score"
                    stroke="#1e293b"
                    strokeWidth={2}
                    fillOpacity={1}
                    fill="url(#colorScore)"
                  />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Courses */}
          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-bold text-slate-900 flex items-center gap-2">
                <LayoutDashboard className="w-4 h-4" /> Enrolled Courses
              </h3>
              <Link
                to="/courses"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                View All
              </Link>
            </div>

            {/* FR-01: Pinned courses section */}
            {pinnedCourses.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase mb-3">
                  <Pin className="w-3 h-3" /> Pinned
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {pinnedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isPinned
                      onTogglePin={() =>
                        toggleCoursePin(course.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}

            {unpinnedCourses.length > 0 && (
              <div>
                {pinnedCourses.length > 0 && (
                  <div className="flex items-center gap-1 text-xs font-semibold text-slate-600 uppercase mb-3 mt-3 pt-3 border-t border-slate-100">
                    Other Courses
                  </div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                  {unpinnedCourses.map((course) => (
                    <CourseCard
                      key={course.id}
                      course={course}
                      isPinned={false}
                      onTogglePin={() =>
                        toggleCoursePin(course.id)
                      }
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-6">
          {/* Study Hours */}
          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <Clock className="w-4 h-4" /> Weekly Activity
            </h3>
            <div className="h-[150px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_HOURS}>
                  <CartesianGrid
                    strokeDasharray="3 3"
                    vertical={false}
                    stroke="#f0f0f0"
                  />
                  <XAxis
                    dataKey="day"
                    axisLine={false}
                    tickLine={false}
                    tick={{
                      fontSize: 10,
                      fill: "#94a3b8",
                      fontWeight: 500,
                    }}
                    dy={5}
                  />
                  <YAxis hide />
                  <Tooltip
                    cursor={{ fill: "transparent" }}
                    contentStyle={{
                      borderRadius: "6px",
                      border: "none",
                      boxShadow:
                        "0 2px 4px rgb(0 0 0 / 0.1)",
                      fontSize: "11px",
                    }}
                  />
                  <Bar dataKey="hours" radius={[2, 2, 0, 0]}>
                    {WEEKLY_HOURS.map((entry, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={
                          index === 4 ? "#1e293b" : "#e2e8f0"
                        }
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
            <div className="mt-3 p-3 bg-slate-50 rounded text-xs text-slate-700">
              <p className="font-medium">12% more than last week. 5-day streak!</p>
            </div>
          </div>

          {/* Upcoming tasks */}
          <div className="bg-white p-4 rounded border border-slate-200 shadow-sm">
            <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
              <GraduationCap className="w-4 h-4" /> Next Deadlines
            </h3>
            <div className="space-y-2">
              {/* FR-01: Deadlines link to assignments, show countdown */}
              {DEADLINES.map((task, i) => (
                <Link
                  key={i}
                  to={task.to}
                  className={cn(
                    "block p-3 rounded border border-slate-200 border-l-2 hover:bg-slate-50 transition-colors text-xs",
                    task.color,
                  )}
                >
                  <p className="text-[9px] font-semibold text-slate-500 uppercase">
                    {task.course}
                  </p>
                  <p className="font-semibold text-slate-900 mt-1 truncate">
                    {task.title}
                  </p>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500 font-medium flex items-center gap-1">
                      <Clock className="w-3 h-3" /> {task.date}
                    </p>
                    <span
                      className={cn(
                        "text-[9px] font-semibold px-1.5 py-0.5 rounded",
                        task.daysLeft <= 1
                          ? "bg-red-100 text-red-700"
                          : task.daysLeft <= 3
                            ? "bg-orange-100 text-orange-700"
                            : "bg-slate-100 text-slate-600",
                      )}
                    >
                      {task.daysLeft === 1
                        ? "Due tomorrow"
                        : `${task.daysLeft}d left`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <Link 
              to="/calendar"
              className="block w-full mt-3 py-2 border border-slate-200 text-slate-700 text-xs font-medium rounded hover:bg-slate-50 transition-all text-center"
            >
              View All Deadlines
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}