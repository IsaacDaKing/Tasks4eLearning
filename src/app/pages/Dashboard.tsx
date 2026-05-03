import { useMemo, useState, type ReactNode } from "react";
import { Link } from "react-router";
import {
  AlertCircle,
  BarChart3,
  Bell,
  BookOpen,
  Calendar as CalendarIcon,
  Clock,
  GraduationCap,
  Lightbulb,
  Mail,
  Megaphone,
  MessageSquare,
  Pin,
  Sparkles,
  TrendingUp,
  X,
  Zap,
  type LucideIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { COURSES } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

const DASHBOARD_STATS = [
  {
    label: "Courses Enrolled",
    value: "6",
    change: "3 pinned",
    icon: BookOpen,
    color: "bg-blue-600",
  },
  {
    label: "Current GPA",
    value: "3.85",
    change: "projected 3.91",
    icon: TrendingUp,
    color: "bg-emerald-600",
  },
  {
    label: "Due This Week",
    value: "5",
    change: "2 exams or quizzes",
    icon: Clock,
    color: "bg-amber-500",
  },
  {
    label: "New Feedback",
    value: "2",
    change: "push alerts on",
    icon: Bell,
    color: "bg-slate-700",
  },
];

const INITIAL_ANNOUNCEMENTS = [
  {
    id: 1,
    title: "Database Systems midterm review posted",
    message:
      "The normalization and transaction review packet is available in Database Systems. Review questions focus on joins, keys, and ACID properties.",
    isPinned: true,
    date: "Today",
    course: "CS 4347.002",
  },
  {
    id: 2,
    title: "Software Engineering project milestone reminder",
    message:
      "Sprint 2 deliverables include updated user stories, a UML sequence diagram, and traceability notes for accepted requirements.",
    isPinned: true,
    date: "Yesterday",
    course: "CS 3354.012",
  },
  {
    id: 3,
    title: "Computer Networks lab feedback released",
    message:
      "Packet-analysis feedback is now available. Check comments before starting the TCP/IP protocol quiz review.",
    isPinned: false,
    date: "2 days ago",
    course: "CS 4390.0W1",
  },
];

const DEADLINES = [
  {
    id: "db-exam",
    title: "Midterm: Database Normalization",
    courseCode: "CS 4347.002",
    courseName: "Database Systems",
    dueDate: "February 21, 2026 at 9:00 AM",
    timeRemaining: "3 days left",
    status: "In Progress",
    type: "Exam",
    to: "/courses/cs4347/assignments/3",
  },
  {
    id: "se-lab",
    title: "Software Design Patterns Lab",
    courseCode: "CS 3354.012",
    courseName: "Software Engineering",
    dueDate: "February 19, 2026 at 11:59 PM",
    timeRemaining: "28 hours left",
    status: "In Progress",
    type: "Assignment",
    to: "/courses/cs3354/assignments/1",
  },
  {
    id: "net-analysis",
    title: "Network Protocol Analysis",
    courseCode: "CS 4390.0W1",
    courseName: "Computer Networks",
    dueDate: "February 17, 2026 at 11:59 PM",
    timeRemaining: "Due tonight",
    status: "Not Started",
    type: "Assignment",
    to: "/courses/cs4390/assignments/5",
  },
  {
    id: "db-sql",
    title: "SQL Query Optimization",
    courseCode: "CS 4347.002",
    courseName: "Database Systems",
    dueDate: "February 16, 2026 at 11:59 PM",
    timeRemaining: "Submitted",
    status: "Submitted",
    type: "Project",
    to: "/courses/cs4347/assignments/4",
  },
  {
    id: "se-pitch",
    title: "Final Project Pitch",
    courseCode: "CS 3354.012",
    courseName: "Software Engineering",
    dueDate: "February 26, 2026 at 11:00 AM",
    timeRemaining: "8 days left",
    status: "Not Started",
    type: "Quiz",
    to: "/quiz",
  },
];

const STUDY_RECOMMENDATIONS = [
  {
    id: "db-review",
    title: "Review normalization before the Database Systems exam",
    detail:
      "Spend 35 minutes on 2NF/3NF examples, then compare INNER JOIN and LEFT JOIN practice questions.",
    courseCode: "CS 4347.002",
    estimate: "35 min",
  },
  {
    id: "se-uml",
    title: "Prepare a UML sequence diagram for Software Engineering",
    detail:
      "Draft the actor, service, and data-store interactions before revising sprint user stories.",
    courseCode: "CS 3354.012",
    estimate: "45 min",
  },
  {
    id: "net-tcp",
    title: "Refresh TCP/IP and subnetting for Computer Networks",
    detail:
      "Review transport-layer reliability and solve three subnet-mask examples before the protocol analysis deadline.",
    courseCode: "CS 4390.0W1",
    estimate: "25 min",
  },
];

const STUDY_PLAN = [
  "Finish Network Protocol Analysis packet annotations.",
  "Review Database Systems normal forms and ACID notes.",
  "Sketch Software Engineering UML sequence diagram.",
  "Check grading feedback and update next-week study blocks.",
];

const ALERTS = [
  {
    id: "db-load",
    title: "Database Systems has two upcoming deadlines this week.",
    detail: "Block one short review session today and one practice session tomorrow.",
    tone: "amber",
  },
  {
    id: "se-project",
    title: "Software Engineering project milestone may need attention.",
    detail: "UML and traceability tasks are still open before the sprint checkpoint.",
    tone: "blue",
  },
  {
    id: "success",
    title: "Computer Networks progress is on track.",
    detail: "Submitting tonight's analysis keeps the course pacing steady.",
    tone: "green",
  },
];

const CALENDAR_PREVIEW = [
  { id: "cal-1", title: "Database review session", time: "Today, 4:00 PM" },
  { id: "cal-2", title: "Software Engineering lab due", time: "Tomorrow, 11:59 PM" },
  { id: "cal-3", title: "Networks office hours", time: "Friday, 1:30 PM" },
];

const MESSAGES = [
  {
    id: "msg-1",
    from: "Wei Wu",
    subject: "Normalization review examples uploaded",
    time: "18m ago",
  },
  {
    id: "msg-2",
    from: "Klyne Smith",
    subject: "Sprint milestone rubric clarification",
    time: "2h ago",
  },
  {
    id: "msg-3",
    from: "Ravi Prakash",
    subject: "Packet capture feedback is available",
    time: "Yesterday",
  },
];

const PINNED_COURSE_IDS = ["cs4390", "cs3354", "cs4347"];

const NEXT_DUE_BY_COURSE: Record<string, string> = {
  cs4390: "Network Protocol Analysis tonight",
  cs3354: "Software Design Patterns Lab tomorrow",
  cs4347: "Database Normalization Midterm in 3 days",
};

const STATUS_STYLES: Record<string, string> = {
  "Not Started": "bg-slate-100 text-slate-700",
  "In Progress": "bg-blue-100 text-blue-700",
  Submitted: "bg-emerald-100 text-emerald-700",
  Graded: "bg-purple-100 text-purple-700",
};

export function Dashboard() {
  const [announcements, setAnnouncements] = useState(INITIAL_ANNOUNCEMENTS);
  const [pinnedCourseIds, setPinnedCourseIds] = useState(PINNED_COURSE_IDS);
  const [studyPlanVisible, setStudyPlanVisible] = useState(false);

  const pinnedAnnouncements = announcements.filter((announcement) => announcement.isPinned);
  const pinnedCourses = useMemo(
    () => COURSES.filter((course) => pinnedCourseIds.includes(course.id)),
    [pinnedCourseIds],
  );

  const toggleAnnouncementPin = (id: number) => {
    setAnnouncements((current) =>
      current.map((announcement) =>
        announcement.id === id
          ? { ...announcement, isPinned: !announcement.isPinned }
          : announcement,
      ),
    );
  };

  const removeAnnouncement = (id: number) => {
    setAnnouncements((current) => current.filter((announcement) => announcement.id !== id));
  };

  const toggleCoursePin = (courseId: string) => {
    setPinnedCourseIds((current) =>
      current.includes(courseId)
        ? current.filter((id) => id !== courseId)
        : [...current, courseId],
    );
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-slate-900">Dashboard</h2>
          <p className="mt-1 text-sm text-slate-600">
            Welcome back. Your pinned courses and next deadlines are ready for review.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/calendar"
            className={cn(
              "inline-flex items-center gap-1.5 rounded border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-700 transition-colors hover:bg-slate-50",
              FOCUS_RING,
            )}
          >
            <CalendarIcon className="h-4 w-4" /> Schedule
          </Link>
          <Link
            to="/ai-assistant"
            className={cn(
              "inline-flex items-center gap-1.5 rounded bg-slate-800 px-4 py-1.5 text-sm font-medium text-white transition-colors hover:bg-slate-900",
              FOCUS_RING,
            )}
          >
            <Zap className="h-4 w-4" /> Generate Study Plan
          </Link>
        </div>
      </div>

      <section aria-labelledby="important-announcements" className="space-y-3">
        <div className="flex items-center gap-2 text-sm font-bold text-slate-700">
          <Megaphone className="h-4 w-4" />
          <h3 id="important-announcements">Important Announcements</h3>
        </div>
        <div className="grid gap-3 lg:grid-cols-2">
          {(pinnedAnnouncements.length > 0 ? pinnedAnnouncements : announcements).map((announcement) => (
            <motion.article
              key={announcement.id}
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              className="rounded border border-blue-200 bg-blue-50 p-4 shadow-sm"
            >
              <div className="flex items-start gap-3">
                <div className="mt-0.5 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-blue-600 text-white">
                  <Megaphone className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <h4 className="font-bold text-slate-900">{announcement.title}</h4>
                    <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-blue-700">
                      {announcement.course}
                    </span>
                  </div>
                  <p className="mt-1 text-sm leading-relaxed text-slate-700">{announcement.message}</p>
                  <p className="mt-2 text-xs font-medium text-slate-500">{announcement.date}</p>
                </div>
                <div className="flex flex-shrink-0 items-center gap-1">
                  <button
                    type="button"
                    onClick={() => toggleAnnouncementPin(announcement.id)}
                    className={cn(
                      "rounded p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-900",
                      FOCUS_RING,
                    )}
                    aria-label={announcement.isPinned ? "Unpin announcement" : "Pin announcement"}
                    title={announcement.isPinned ? "Unpin announcement" : "Pin announcement"}
                  >
                    <Pin className={cn("h-4 w-4", announcement.isPinned && "fill-blue-600 text-blue-600")} />
                  </button>
                  <button
                    type="button"
                    onClick={() => removeAnnouncement(announcement.id)}
                    className={cn(
                      "rounded p-1.5 text-slate-500 transition-colors hover:bg-white hover:text-slate-900",
                      FOCUS_RING,
                    )}
                    aria-label="Dismiss announcement"
                    title="Dismiss announcement"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-4" aria-label="Dashboard summary">
        {DASHBOARD_STATS.map((stat, index) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.06 }}
            className="rounded border border-slate-200 bg-white p-4 shadow-sm"
          >
            <div className="mb-3 flex items-start justify-between">
              <div className={cn("rounded p-2", stat.color)}>
                <stat.icon className="h-4 w-4 text-white" />
              </div>
            </div>
            <p className="text-xs font-bold uppercase tracking-wide text-slate-600">{stat.label}</p>
            <div className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold text-slate-900">{stat.value}</span>
              <span className="rounded bg-slate-50 px-1.5 py-0.5 text-xs text-slate-600">{stat.change}</span>
            </div>
          </motion.div>
        ))}
      </section>

      <div className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <main className="space-y-6">
          <Panel
            icon={GraduationCap}
            title="Upcoming Deadlines"
            description="Assignments, quizzes, exams, and projects that need attention next."
            action={
              <Link to="/calendar" className={cn("text-xs font-bold text-slate-600 hover:text-slate-900", FOCUS_RING)}>
                View calendar
              </Link>
            }
          >
            <div className="space-y-3">
              {DEADLINES.map((deadline) => (
                <Link
                  key={deadline.id}
                  to={deadline.to}
                  className={cn(
                    "block rounded border border-slate-200 p-4 transition-colors hover:bg-slate-50",
                    FOCUS_RING,
                  )}
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                    <div className="min-w-0">
                      <div className="mb-2 flex flex-wrap items-center gap-2">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600">
                          {deadline.type}
                        </span>
                        <span className={cn("rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", STATUS_STYLES[deadline.status])}>
                          {deadline.status}
                        </span>
                      </div>
                      <h4 className="font-bold text-slate-900">{deadline.title}</h4>
                      <p className="mt-1 text-sm text-slate-600">
                        {deadline.courseCode} - {deadline.courseName}
                      </p>
                    </div>
                    <div className="text-left md:text-right">
                      <p className="text-sm font-bold text-slate-900">{deadline.dueDate}</p>
                      <p className="mt-1 text-xs font-semibold text-amber-700">{deadline.timeRemaining}</p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-[minmax(0,1.1fr)_minmax(280px,0.9fr)]">
            <Panel
              icon={Sparkles}
              title="AI Study Recommendations"
              description="Suggestions based on incomplete work and nearby deadlines."
              action={
                <Link to="/ai-assistant" className={cn("text-xs font-bold text-slate-600 hover:text-slate-900", FOCUS_RING)}>
                  Open AI tool
                </Link>
              }
            >
              <div className="space-y-3">
                {STUDY_RECOMMENDATIONS.map((recommendation) => (
                  <div key={recommendation.id} className="rounded border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <div className="mt-0.5 rounded bg-white p-2 text-slate-700">
                        <Lightbulb className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <h4 className="font-bold text-slate-900">{recommendation.title}</h4>
                          <span className="rounded bg-white px-2 py-0.5 text-[10px] font-bold text-slate-600">
                            {recommendation.courseCode}
                          </span>
                        </div>
                        <p className="mt-1 text-sm leading-relaxed text-slate-600">{recommendation.detail}</p>
                        <p className="mt-2 text-xs font-semibold text-slate-500">{recommendation.estimate}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                onClick={() => setStudyPlanVisible((visible) => !visible)}
                className={cn(
                  "mt-4 inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white transition-colors hover:bg-blue-700",
                  FOCUS_RING,
                )}
                aria-expanded={studyPlanVisible}
              >
                <Sparkles className="h-4 w-4" />
                {studyPlanVisible ? "Hide Study Plan" : "Generate Study Plan"}
              </button>
              {studyPlanVisible && (
                <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-4" aria-live="polite">
                  <h4 className="mb-3 text-sm font-black text-blue-950">Generated Study Plan Playlist</h4>
                  <ol className="space-y-2 text-sm text-blue-900">
                    {STUDY_PLAN.map((item, index) => (
                      <li key={item} className="flex gap-2">
                        <span className="font-black">{index + 1}.</span>
                        <span>{item}</span>
                      </li>
                    ))}
                  </ol>
                </div>
              )}
            </Panel>

            <div className="space-y-6">
              <Panel icon={BarChart3} title="GPA Projection" description="Grade simulation summary">
                <div className="grid grid-cols-2 gap-3">
                  <div className="rounded border border-slate-200 bg-slate-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Current GPA</p>
                    <p className="mt-2 text-3xl font-black text-slate-900">3.85</p>
                  </div>
                  <div className="rounded border border-emerald-200 bg-emerald-50 p-4">
                    <p className="text-xs font-bold uppercase tracking-wide text-emerald-700">Projected GPA</p>
                    <p className="mt-2 text-3xl font-black text-emerald-700">3.91</p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-slate-600">
                  Submitting the Network Protocol Analysis tonight and scoring 85% or higher on the Database Systems midterm could lift the projection.
                </p>
              </Panel>

              <Panel icon={AlertCircle} title="Predictive Alerts" description="Supportive planning signals">
                <div className="space-y-3">
                  {ALERTS.map((alert) => (
                    <div key={alert.id} className={cn("rounded border p-3", alertClass(alert.tone))}>
                      <h4 className="text-sm font-bold">{alert.title}</h4>
                      <p className="mt-1 text-xs leading-relaxed">{alert.detail}</p>
                    </div>
                  ))}
                </div>
              </Panel>
            </div>
          </div>
        </main>

        <aside className="space-y-6">
          <Panel
            icon={Pin}
            title="Pinned Courses"
            description="Favorite course shortcuts"
            action={
              <Link to="/courses" className={cn("text-xs font-bold text-slate-600 hover:text-slate-900", FOCUS_RING)}>
                Manage
              </Link>
            }
          >
            <div className="space-y-3">
              {pinnedCourses.map((course) => (
                <article key={course.id} className="rounded border border-slate-200 p-3">
                  <div className="mb-3 flex items-start justify-between gap-3">
                    <Link to={`/courses/${course.id}`} className={cn("min-w-0", FOCUS_RING)}>
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{course.code}</p>
                      <h4 className="font-bold text-slate-900">{course.title}</h4>
                      <p className="text-xs text-slate-500">{course.instructor}</p>
                    </Link>
                    <button
                      type="button"
                      onClick={() => toggleCoursePin(course.id)}
                      className={cn("rounded p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-900", FOCUS_RING)}
                      aria-label={`Unpin ${course.title}`}
                      title={`Unpin ${course.title}`}
                    >
                      <Pin className="h-4 w-4 fill-slate-700 text-slate-700" />
                    </button>
                  </div>
                  <div className="mb-2 flex justify-between text-xs font-bold text-slate-600">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded bg-slate-100">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{ width: `${course.progress}%` }}
                      transition={{ duration: 0.8, ease: "easeOut" }}
                      className={cn("h-full rounded", course.color)}
                    />
                  </div>
                  <p className="mt-3 text-xs text-slate-600">
                    <span className="font-bold">Next due:</span> {NEXT_DUE_BY_COURSE[course.id]}
                  </p>
                </article>
              ))}
            </div>
          </Panel>

          <Panel icon={CalendarIcon} title="Calendar" description="Next events">
            <div className="space-y-3">
              {CALENDAR_PREVIEW.map((event) => (
                <div key={event.id} className="flex items-start gap-3 rounded border border-slate-200 p-3">
                  <div className="mt-0.5 rounded bg-slate-100 p-2 text-slate-700">
                    <CalendarIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900">{event.title}</h4>
                    <p className="text-xs text-slate-500">{event.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel
            icon={MessageSquare}
            title="Messages"
            description="Recent course messages"
            action={
              <Link to="/messages" className={cn("text-xs font-bold text-slate-600 hover:text-slate-900", FOCUS_RING)}>
                View all messages
              </Link>
            }
          >
            <div className="space-y-3">
              {MESSAGES.map((message) => (
                <div key={message.id} className="rounded border border-slate-200 p-3">
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5 rounded bg-slate-100 p-2 text-slate-700">
                      <Mail className="h-4 w-4" />
                    </div>
                    <div className="min-w-0">
                      <h4 className="truncate text-sm font-bold text-slate-900">{message.from}</h4>
                      <p className="text-xs leading-relaxed text-slate-600">{message.subject}</p>
                      <p className="mt-1 text-[10px] font-bold uppercase tracking-wide text-slate-400">{message.time}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </Panel>

        </aside>
      </div>
    </div>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  action,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  action?: ReactNode;
  children: ReactNode;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 flex items-start justify-between gap-3">
        <div>
          <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
            <Icon className="h-4 w-4" />
            {title}
          </h3>
          {description && <p className="mt-0.5 text-xs text-slate-600">{description}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

function alertClass(tone: string) {
  if (tone === "green") return "border-emerald-200 bg-emerald-50 text-emerald-800";
  if (tone === "blue") return "border-blue-200 bg-blue-50 text-blue-800";
  return "border-amber-200 bg-amber-50 text-amber-800";
}
