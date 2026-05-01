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
  Megaphone
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
  Cell
} from 'recharts';
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { Link } from "react-router";
import { useState } from "react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DASHBOARD_STATS = [
  { label: "Courses Enrolled", value: "6", change: "+2 this semester", icon: BookOpen, color: "bg-blue-500", shadow: "shadow-blue-200" },
  { label: "Completed Lessons", value: "127", change: "+12 last 30 days", icon: CheckCircle2, color: "bg-emerald-500", shadow: "shadow-emerald-200" },
  { label: "Current GPA", value: "3.85", change: "+0.15 vs last sem", icon: TrendingUp, color: "bg-purple-500", shadow: "shadow-purple-200" },
  { label: "Upcoming Tests", value: "3", change: "Next: Database Design", icon: AlertCircle, color: "bg-orange-500", shadow: "shadow-orange-200" },
];

const PERFORMANCE_DATA = [
  { month: 'Jan', score: 85 },
  { month: 'Feb', score: 88 },
  { month: 'Mar', score: 92 },
  { month: 'Apr', score: 90 },
  { month: 'May', score: 95 },
  { month: 'Jun', score: 98 },
];

const WEEKLY_HOURS = [
  { day: 'Mon', hours: 4.5 },
  { day: 'Tue', hours: 6.2 },
  { day: 'Wed', hours: 5.1 },
  { day: 'Thu', hours: 3.8 },
  { day: 'Fri', hours: 7.4 },
  { day: 'Sat', hours: 2.5 },
  { day: 'Sun', hours: 4.0 },
];

// FR-01: Courses with pin support
const ALL_COURSES = [
  { id: 'cs-301', name: 'React Development', code: 'CS 301', progress: 75, grade: 'A', instructor: 'Dr. Sarah Johnson', color: 'bg-blue-600' },
  { id: 'cs-401', name: 'Database Systems', code: 'CS 401', progress: 60, grade: 'B+', instructor: 'Prof. Michael Chen', color: 'bg-purple-600' },
  { id: 'cs-350', name: 'Algorithm Analysis', code: 'CS 350', progress: 45, grade: 'A-', instructor: 'Emily Wong (TA)', color: 'bg-emerald-600' },
  { id: 'envi-301', name: 'Environmental Science', code: 'ENVI 301', progress: 80, grade: 'A', instructor: 'Dr. Park', color: 'bg-green-600' },
];

// FR-01: Deadlines with links and countdown
const DEADLINES = [
  { title: 'Project: DB Optimization', date: 'Tomorrow, 11:59 PM', course: 'CS 401', color: 'border-l-orange-500', to: '/assignment', daysLeft: 1 },
  { title: 'Quiz: Algorithm Complexity', date: 'May 1, 10:00 AM', course: 'CS 350', color: 'border-l-blue-500', to: '/quiz', daysLeft: 2 },
  { title: 'React Hooks Final Submission', date: 'May 3, 6:00 PM', course: 'CS 301', color: 'border-l-purple-500', to: '/assignment', daysLeft: 4 },
];

const INITIAL_ANNOUNCEMENTS = [
  { id: 1, title: "Spring Break Schedule Update", message: "Campus will be closed from March 15-22. All online courses will continue as scheduled.", isPinned: true, date: "2 days ago" },
  { id: 2, title: "Final Exam Dates Released", message: "Check your course pages for specific exam times and locations. Study resources are now available.", isPinned: true, date: "1 week ago" },
  { id: 3, title: "Career Fair - April 10", message: "Don't miss the annual career fair! Register early to secure your spot with top employers.", isPinned: false, date: "3 days ago" },
];

function CourseCard({ course, isPinned, onTogglePin }: { course: typeof ALL_COURSES[0]; isPinned: boolean; onTogglePin: () => void }) {
  return (
    <div className="p-4 rounded-2xl border border-slate-100 dark:border-slate-700 bg-slate-50/50 dark:bg-slate-900/50 hover:bg-white dark:hover:bg-slate-800 hover:border-blue-100 dark:hover:border-blue-800 hover:shadow-lg transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={cn("p-2 rounded-lg text-white font-bold text-[10px]", course.color)}>
          {course.code}
        </div>
        <button
          onClick={onTogglePin}
          title={isPinned ? "Unpin course" : "Pin course"}
          className="opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Pin className={cn("w-4 h-4 text-slate-400 hover:text-blue-600 transition-colors", isPinned && "fill-current text-blue-600")} />
        </button>
      </div>
      <h4 className="font-bold text-slate-900 dark:text-white mb-1">{course.name}</h4>
      <p className="text-xs text-slate-500 dark:text-slate-400 mb-4">{course.instructor}</p>
      <div className="space-y-2">
        <div className="flex justify-between text-[10px] font-bold text-slate-500 uppercase tracking-widest">
          <span>Progress</span>
          <span>{course.progress}%</span>
        </div>
        <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${course.progress}%` }}
            transition={{ duration: 1, ease: "easeOut" }}
            className={cn("h-full rounded-full", course.color)}
          />
        </div>
      </div>
    </div>
  );
}

export function Dashboard() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  // FR-01: pinned courses
  const [pinnedCourseIds, setPinnedCourseIds] = useState<string[]>(['cs-301', 'cs-401']);

  const togglePin = (id: number) => {
    setAnnouncements(announcements.map(ann =>
      ann.id === id ? { ...ann, isPinned: !ann.isPinned } : ann
    ));
  };

  const removeAnnouncement = (id: number) => {
    setAnnouncements(announcements.filter(ann => ann.id !== id));
  };

  const toggleCoursePin = (courseId: string) => {
    setPinnedCourseIds(prev =>
      prev.includes(courseId) ? prev.filter(id => id !== courseId) : [...prev, courseId]
    );
  };

  const pinnedAnnouncements = announcements.filter(a => a.isPinned);
  const pinnedCourses = ALL_COURSES.filter(c => pinnedCourseIds.includes(c.id));
  const unpinnedCourses = ALL_COURSES.filter(c => !pinnedCourseIds.includes(c.id));

  return (
    <div className="p-8 space-y-8 max-w-[1600px] mx-auto animate-in fade-in duration-500 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">Welcome back, Dr. Smith! 👋</h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">You have 3 assignments due this week. Stay focused!</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 px-4 py-2.5 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all shadow-sm">
            <CalendarIcon className="w-4 h-4" /> Schedule
          </button>
          <button className="flex items-center gap-2 px-6 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50 active:scale-95">
            <Zap className="w-4 h-4" /> Start Learning
          </button>
        </div>
      </div>

      {pinnedAnnouncements.length > 0 && (
        <div className="space-y-3">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400">
            <Pin className="w-4 h-4" />
            <span>Pinned Announcements</span>
          </div>
          {pinnedAnnouncements.map((announcement) => (
            <motion.div
              key={announcement.id}
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-600 to-purple-600 p-6 rounded-2xl shadow-xl text-white relative group"
            >
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 bg-white/20 backdrop-blur-sm rounded-xl flex items-center justify-center flex-shrink-0">
                  <Megaphone className="w-5 h-5" />
                </div>
                <div className="flex-1">
                  <h3 className="font-black text-lg mb-1">{announcement.title}</h3>
                  <p className="text-white/90 text-sm leading-relaxed">{announcement.message}</p>
                  <p className="text-white/60 text-xs mt-2">{announcement.date}</p>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => togglePin(announcement.id)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <Pin className="w-4 h-4 fill-current" />
                  </button>
                  <button
                    onClick={() => removeAnnouncement(announcement.id)}
                    className="p-2 hover:bg-white/20 rounded-lg transition-colors opacity-0 group-hover:opacity-100"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {DASHBOARD_STATS.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-xl transition-all group"
          >
            <div className="flex justify-between items-start mb-4">
              <div className={cn("p-3 rounded-xl transition-transform group-hover:scale-110", stat.color, stat.shadow)}>
                <stat.icon className="w-6 h-6 text-white" />
              </div>
              <MoreVertical className="w-5 h-5 text-slate-300 dark:text-slate-600 cursor-pointer" />
            </div>
            <p className="text-sm font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider">{stat.label}</p>
            <div className="flex items-baseline gap-2 mt-1">
              <h3 className="text-3xl font-black text-slate-900 dark:text-white">{stat.value}</h3>
              <span className="text-xs font-bold text-emerald-500 bg-emerald-50 px-2 py-0.5 rounded-full">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Charts Area */}
        <div className="lg:col-span-2 space-y-8">
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                   <BarChart3 className="w-5 h-5 text-blue-600" /> Academic Performance
                </h3>
                <p className="text-sm text-slate-500 dark:text-slate-400">Score trends across all enrolled courses</p>
              </div>
              <select className="bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 text-xs font-bold rounded-lg px-3 py-2 outline-none dark:text-white">
                <option>Last 6 Months</option>
                <option>Last Year</option>
              </select>
            </div>
            <div className="h-[300px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={PERFORMANCE_DATA}>
                  <defs>
                    <linearGradient id="colorScore" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#2563eb" stopOpacity={0.1}/>
                      <stop offset="95%" stopColor="#2563eb" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="month" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dy={10} />
                  <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8', fontWeight: 600}} dx={-10} />
                  <Tooltip 
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)', fontWeight: 'bold' }}
                    itemStyle={{ color: '#2563eb' }}
                  />
                  <Area type="monotone" dataKey="score" stroke="#2563eb" strokeWidth={4} fillOpacity={1} fill="url(#colorScore)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </div>

          {/* Current Courses */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-2">
                <LayoutDashboard className="w-5 h-5 text-purple-600" /> Enrolled Courses
              </h3>
              <Link to="/courses" className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline">View All</Link>
            </div>

            {/* FR-01: Pinned courses section */}
            {pinnedCourses.length > 0 && (
              <div className="mb-4">
                <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3">
                  <Pin className="w-3 h-3" /> Pinned
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {pinnedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} isPinned onTogglePin={() => toggleCoursePin(course.id)} />
                  ))}
                </div>
              </div>
            )}

            {unpinnedCourses.length > 0 && (
              <div>
                {pinnedCourses.length > 0 && (
                  <div className="flex items-center gap-1.5 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest mb-3 mt-4">Other Courses</div>
                )}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {unpinnedCourses.map((course) => (
                    <CourseCard key={course.id} course={course} isPinned={false} onTogglePin={() => toggleCoursePin(course.id)} />
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Sidebar Widgets */}
        <div className="space-y-8">
          {/* Study Hours */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
             <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
               <Clock className="w-5 h-5 text-orange-600" /> Weekly Activity
             </h3>
             <div className="h-[200px] w-full">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={WEEKLY_HOURS}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                  <XAxis dataKey="day" axisLine={false} tickLine={false} tick={{fontSize: 10, fill: '#94a3b8', fontWeight: 600}} dy={5} />
                  <YAxis hide />
                  <Tooltip cursor={{fill: 'transparent'}} contentStyle={{ borderRadius: '8px', border: 'none', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)', fontSize: '12px' }} />
                  <Bar dataKey="hours" radius={[4, 4, 4, 4]}>
                    {WEEKLY_HOURS.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={index === 4 ? '#2563eb' : '#e2e8f0'} />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
             </div>
             <div className="mt-4 p-4 bg-blue-50 rounded-xl">
               <div className="flex items-center gap-3">
                 <div className="p-2 bg-white rounded-lg shadow-sm">
                    <TrendingUp className="w-4 h-4 text-blue-600" />
                 </div>
                 <div className="text-xs">
                   <p className="font-bold text-blue-900">12% More than last week</p>
                   <p className="text-blue-600/70 font-medium">You're on a 5-day study streak!</p>
                 </div>
               </div>
             </div>
          </div>

          {/* Upcoming tasks */}
          <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm">
            <h3 className="text-lg font-black text-slate-900 dark:text-white tracking-tight mb-6 flex items-center gap-2">
               <GraduationCap className="w-5 h-5 text-emerald-600" /> Next Deadlines
            </h3>
            <div className="space-y-4">
              {/* FR-01: Deadlines link to assignments, show countdown */}
              {DEADLINES.map((task, i) => (
                <Link key={i} to={task.to} className={cn("block p-4 rounded-xl border border-slate-100 dark:border-slate-700 border-l-4 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors cursor-pointer", task.color)}>
                  <p className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">{task.course}</p>
                  <h4 className="font-bold text-slate-900 dark:text-white text-sm mt-1">{task.title}</h4>
                  <div className="flex items-center justify-between mt-2">
                    <p className="text-xs text-slate-500 dark:text-slate-400 font-medium flex items-center gap-1.5">
                      <Clock className="w-3 h-3" /> {task.date}
                    </p>
                    <span className={cn(
                      "text-[10px] font-black px-2 py-0.5 rounded-full",
                      task.daysLeft <= 1 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" :
                      task.daysLeft <= 3 ? "bg-orange-100 text-orange-600 dark:bg-orange-900/30 dark:text-orange-400" :
                      "bg-slate-100 text-slate-500 dark:bg-slate-700 dark:text-slate-400"
                    )}>
                      {task.daysLeft === 1 ? "Due tomorrow" : `${task.daysLeft} days left`}
                    </span>
                  </div>
                </Link>
              ))}
            </div>
            <button className="w-full mt-6 py-3 border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 text-sm font-bold rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 transition-all flex items-center justify-center gap-2">
              View All Tasks <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
