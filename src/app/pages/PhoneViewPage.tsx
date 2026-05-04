import { useMemo, useState, type FormEvent, type LucideIcon } from "react";
import { Link } from "react-router";
import {
  Bell,
  BookOpen,
  Bot,
  CalendarClock,
  ChevronLeft,
  ClipboardList,
  GraduationCap,
  Home,
  Mail,
  MessageCircle,
  Send,
  Sparkles,
  TrendingUp,
  Zap,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COURSES, type Course, type CourseAssignment } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

type PhoneTab = "home" | "courses" | "quizzes" | "messages" | "comet";

type LocalMessage = {
  id: string;
  sender: string;
  body: string;
  time: string;
  isMe?: boolean;
};

type PhoneConversation = {
  id: string;
  title: string;
  subtitle: string;
  course?: string;
  unread: number;
  messages: LocalMessage[];
};

type CometMessage = {
  id: string;
  sender: "You" | "Comet AI";
  body: string;
};

const tabs: Array<{ id: PhoneTab; label: string; icon: LucideIcon }> = [
  { id: "home", label: "Home", icon: Home },
  { id: "courses", label: "Courses", icon: BookOpen },
  { id: "quizzes", label: "Quizzes", icon: ClipboardList },
  { id: "messages", label: "Messages", icon: MessageCircle },
  { id: "comet", label: "Comet AI", icon: Bot },
];

const courseOrder = ["cs4390", "cs3354", "cs4347", "cs4337", "cs4341", "isns2359"];

const assessmentDetails: Record<string, { timeLimit: string; attempts: string; status: "Ready" | "Review" | "Locked" }> = {
  "3": { timeLimit: "75 min", attempts: "1 attempt", status: "Ready" },
  "6": { timeLimit: "90 min", attempts: "1 attempt", status: "Locked" },
  "7": { timeLimit: "20 min", attempts: "2 attempts", status: "Ready" },
  "8": { timeLimit: "20 min", attempts: "1 attempt", status: "Ready" },
};

const initialConversations: PhoneConversation[] = [
  {
    id: "prof-smith",
    title: "Professor Klyne Smith",
    subtitle: "Software Engineering",
    course: "CS 3354.012",
    unread: 2,
    messages: [
      {
        id: "smith-1",
        sender: "Professor Klyne Smith",
        body: "For the project feedback pass, connect each sprint story to a test or demo scenario.",
        time: "9:18 AM",
      },
      {
        id: "smith-2",
        sender: "You",
        body: "I will bring one requirements question and one UML question to office hours.",
        time: "9:24 AM",
        isMe: true,
      },
      {
        id: "smith-3",
        sender: "Professor Klyne Smith",
        body: "Good plan. Keep the diagram focused on behavior and real system boundaries.",
        time: "9:31 AM",
      },
    ],
  },
  {
    id: "db-group",
    title: "Database study group",
    subtitle: "Midterm review",
    course: "CS 4347.002",
    unread: 1,
    messages: [
      {
        id: "db-1",
        sender: "Nora",
        body: "Can we start with 2NF vs 3NF, then do joins with expected row counts?",
        time: "Yesterday",
      },
      {
        id: "db-2",
        sender: "Ethan",
        body: "Yes. I added a short LEFT JOIN practice set too.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "networks-classmate",
    title: "Computer Networks classmate",
    subtitle: "Jordan Lee",
    course: "CS 4390.0W1",
    unread: 0,
    messages: [
      {
        id: "net-1",
        sender: "Jordan",
        body: "Did you mark the duplicate ACKs in the packet capture?",
        time: "Fri",
      },
      {
        id: "net-2",
        sender: "You",
        body: "Yes, I compared them against the congestion-control slide.",
        time: "Fri",
        isMe: true,
      },
    ],
  },
  {
    id: "support",
    title: "Help desk/support",
    subtitle: "LMS Support",
    unread: 0,
    messages: [
      {
        id: "support-1",
        sender: "LMS Support",
        body: "Notifications are enabled for assignment postings, grade feedback, and course announcements.",
        time: "Mon",
      },
      {
        id: "support-2",
        sender: "You",
        body: "Thanks, notifications are working on my laptop now.",
        time: "Mon",
        isMe: true,
      },
    ],
  },
];

const quickLinks: Array<{ label: string; tab: PhoneTab; icon: LucideIcon }> = [
  { label: "Check quizzes", tab: "quizzes", icon: ClipboardList },
  { label: "Message professor", tab: "messages", icon: Mail },
  { label: "Ask Comet AI", tab: "comet", icon: Sparkles },
];

const cometPrompts = [
  "What should I study tonight?",
  "Help me prepare for Database Systems.",
  "Draft a professor message.",
  "Give me a Whoosh study plan.",
];

export function PhoneViewPage() {
  const [activeTab, setActiveTab] = useState<PhoneTab>("home");
  const [conversations, setConversations] = useState(initialConversations);
  const [selectedConversationId, setSelectedConversationId] = useState("prof-smith");
  const [messageDraft, setMessageDraft] = useState("");
  const [cometDraft, setCometDraft] = useState("");
  const [cometMessages, setCometMessages] = useState<CometMessage[]>([
    {
      id: "comet-welcome",
      sender: "Comet AI",
      body:
        "Whoosh, Carson. Your nearest launch point is Computer Networks, then Database Systems review, then Software Engineering polish.",
    },
  ]);

  const orderedCourses = useMemo(
    () =>
      COURSES.slice().sort(
        (a, b) =>
          courseOrder.indexOf(a.id) - courseOrder.indexOf(b.id) ||
          a.title.localeCompare(b.title),
      ),
    [],
  );

  const upcomingAssignments = useMemo(
    () =>
      orderedCourses
        .flatMap((course) => course.assignments.map((assignment) => ({ course, assignment })))
        .filter(({ assignment }) => !assignment.dueDate.toLowerCase().startsWith("submitted"))
        .sort((a, b) => dueDateValue(a.assignment.dueDate) - dueDateValue(b.assignment.dueDate)),
    [orderedCourses],
  );

  const assessments = useMemo(
    () =>
      upcomingAssignments
        .filter(({ assignment }) => assignment.type === "Quiz" || assignment.type === "Exam")
        .map(({ course, assignment }) => ({
          course,
          assignment,
          detail: assessmentDetails[assignment.id] ?? {
            timeLimit: assignment.type === "Exam" ? "75 min" : "20 min",
            attempts: assignment.type === "Exam" ? "1 attempt" : "2 attempts",
            status: "Ready" as const,
          },
        })),
    [upcomingAssignments],
  );

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedConversationId) ?? conversations[0];

  const upcomingDeadline = upcomingAssignments[0];
  const nextAssessment = assessments[0];

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const trimmedDraft = messageDraft.trim();
    if (!trimmedDraft) return;

    const newMessage: LocalMessage = {
      id: `message-${Date.now()}`,
      sender: "You",
      body: trimmedDraft,
      time: "Just now",
      isMe: true,
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? { ...conversation, unread: 0, messages: [...conversation.messages, newMessage] }
          : conversation,
      ),
    );
    setMessageDraft("");
  };

  const selectConversation = (conversationId: string) => {
    setSelectedConversationId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation,
      ),
    );
  };

  const submitCometPrompt = (event: FormEvent) => {
    event.preventDefault();
    sendCometPrompt(cometDraft);
  };

  const sendCometPrompt = (prompt: string) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt) return;

    setCometMessages((current) => [
      ...current,
      { id: `comet-user-${Date.now()}`, sender: "You", body: trimmedPrompt },
      {
        id: `comet-reply-${Date.now()}`,
        sender: "Comet AI",
        body: getCometResponse(trimmedPrompt),
      },
    ]);
    setCometDraft("");
  };

  return (
    <div className="min-h-screen bg-slate-200 text-slate-950 dark:bg-slate-950 dark:text-slate-100 sm:px-6 sm:py-8">
      <div className="mx-auto flex min-h-screen w-full max-w-[430px] flex-col overflow-hidden border-0 border-slate-300 bg-slate-50 shadow-none dark:border-slate-700 dark:bg-slate-900 sm:min-h-[840px] sm:max-h-[900px] sm:rounded-[30px] sm:border sm:shadow-2xl sm:shadow-slate-900/20 sm:dark:shadow-black/40">
        <header className="flex-shrink-0 border-b border-slate-200 bg-white px-4 pb-3 pt-4 dark:border-slate-800 dark:bg-slate-950">
          <div className="mx-auto mb-3 hidden h-1.5 w-20 rounded-full bg-slate-300 dark:bg-slate-700 sm:block" />
          <div className="flex items-start justify-between gap-3">
            <div className="flex min-w-0 items-center gap-3">
              <img
                src="/Tasks4eLearning.png"
                alt="Tasks4eLearning"
                className="h-10 w-10 rounded object-cover ring-1 ring-slate-200 dark:ring-slate-700"
              />
              <div className="min-w-0">
                <p className="text-sm font-black text-slate-950 dark:text-white">Tasks4eLearning</p>
                <p className="truncate text-xs font-semibold text-slate-600 dark:text-slate-300">
                  Carson Smith
                </p>
                <p className="text-[11px] font-medium text-slate-500 dark:text-slate-400">CXS224467</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Link
                to="/dashboard"
                className={cn(
                  "hidden rounded border border-slate-200 px-2.5 py-1.5 text-[11px] font-black text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800 sm:inline-flex",
                  FOCUS_RING,
                )}
              >
                Open full LMS
              </Link>
              <button
                type="button"
                className={cn(
                  "relative inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 bg-white text-slate-700 transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                  FOCUS_RING,
                )}
                aria-label="Notifications"
              >
                <Bell className="h-4 w-4" />
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-blue-600 px-1 text-[10px] font-black text-white">
                  3
                </span>
              </button>
            </div>
          </div>
          <Link
            to="/dashboard"
            className={cn(
              "mt-3 inline-flex w-full items-center justify-center gap-2 rounded bg-slate-900 px-3 py-2 text-xs font-black text-white transition-colors hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400 sm:hidden",
              FOCUS_RING,
            )}
          >
            <ChevronLeft className="h-4 w-4" />
            Open full LMS
          </Link>
        </header>

        <main className="min-h-0 flex-1 overflow-y-auto bg-slate-50 px-4 py-4 dark:bg-slate-900">
          {activeTab === "home" && (
            <HomeTab
              upcomingDeadline={upcomingDeadline}
              nextAssessment={nextAssessment}
              onSwitchTab={setActiveTab}
            />
          )}
          {activeTab === "courses" && <CoursesTab courses={orderedCourses} />}
          {activeTab === "quizzes" && <QuizzesTab assessments={assessments} />}
          {activeTab === "messages" && (
            <MessagesTab
              conversations={conversations}
              selectedConversation={selectedConversation}
              draft={messageDraft}
              onSelectConversation={selectConversation}
              onDraftChange={setMessageDraft}
              onSend={sendMessage}
            />
          )}
          {activeTab === "comet" && (
            <CometTab
              messages={cometMessages}
              draft={cometDraft}
              onDraftChange={setCometDraft}
              onPrompt={sendCometPrompt}
              onSubmit={submitCometPrompt}
            />
          )}
        </main>

        <nav className="flex-shrink-0 border-t border-slate-200 bg-white px-2 py-2 dark:border-slate-800 dark:bg-slate-950" aria-label="Phone navigation">
          <div className="grid grid-cols-5 gap-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  type="button"
                  onClick={() => setActiveTab(tab.id)}
                  className={cn(
                    "flex min-h-[56px] flex-col items-center justify-center gap-1 rounded px-1 py-2 text-[10px] font-black transition-colors",
                    FOCUS_RING,
                    isActive
                      ? "bg-blue-50 text-blue-700 ring-1 ring-blue-200 dark:bg-blue-950/60 dark:text-blue-200 dark:ring-blue-800"
                      : "text-slate-500 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-800 dark:hover:text-white",
                  )}
                  aria-current={isActive ? "page" : undefined}
                >
                  <Icon className="h-4 w-4" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>
      </div>
    </div>
  );
}

function HomeTab({
  upcomingDeadline,
  nextAssessment,
  onSwitchTab,
}: {
  upcomingDeadline?: { course: Course; assignment: CourseAssignment };
  nextAssessment?: {
    course: Course;
    assignment: CourseAssignment;
    detail: { timeLimit: string; attempts: string; status: "Ready" | "Review" | "Locked" };
  };
  onSwitchTab: (tab: PhoneTab) => void;
}) {
  return (
    <div className="space-y-4">
      <section className="rounded-lg border border-blue-200 bg-blue-600 p-4 text-white shadow-sm dark:border-blue-800">
        <div className="flex items-start justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-blue-100">Upcoming deadline</p>
            <h1 className="mt-2 text-xl font-black leading-tight">
              {upcomingDeadline?.assignment.title ?? "No upcoming deadline"}
            </h1>
            {upcomingDeadline && (
              <p className="mt-2 text-sm font-semibold text-blue-50">
                {upcomingDeadline.course.code} - {upcomingDeadline.assignment.dueDate}
              </p>
            )}
          </div>
          <CalendarClock className="h-6 w-6 flex-shrink-0 text-blue-100" />
        </div>
      </section>

      <section className="grid grid-cols-2 gap-3" aria-label="GPA summary">
        <MetricTile icon={TrendingUp} label="Current GPA" value="3.85" detail="steady" />
        <MetricTile icon={GraduationCap} label="Projected GPA" value="3.91" detail="if due work lands" />
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="mb-3 flex items-center justify-between gap-3">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Next quiz or exam</p>
            <h2 className="mt-1 text-base font-black text-slate-950 dark:text-white">
              {nextAssessment?.assignment.title ?? "Nothing scheduled"}
            </h2>
          </div>
          <ClipboardList className="h-5 w-5 text-slate-500 dark:text-slate-300" />
        </div>
        {nextAssessment && (
          <div className="flex flex-wrap gap-2 text-xs font-bold">
            <span className="rounded bg-slate-100 px-2 py-1 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {nextAssessment.course.code}
            </span>
            <span className="rounded bg-blue-50 px-2 py-1 text-blue-700 dark:bg-blue-950 dark:text-blue-200">
              {nextAssessment.detail.timeLimit}
            </span>
            <span className="rounded bg-emerald-50 px-2 py-1 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200">
              {nextAssessment.detail.status}
            </span>
          </div>
        )}
      </section>

      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex gap-3">
          <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded bg-slate-900 text-cyan-300 dark:bg-blue-500 dark:text-white">
            <Sparkles className="h-4 w-4" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950 dark:text-white">Comet AI suggestion</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Finish the Computer Networks packet notes first, then do a 25-minute Database normalization review. Tiny thrusts, big trajectory.
            </p>
          </div>
        </div>
      </section>

      <section aria-label="Quick links">
        <div className="grid grid-cols-3 gap-2">
          {quickLinks.map((link) => {
            const Icon = link.icon;
            return (
              <button
                key={link.label}
                type="button"
                onClick={() => onSwitchTab(link.tab)}
                className={cn(
                  "flex min-h-[74px] flex-col items-center justify-center gap-2 rounded-lg border border-slate-200 bg-white p-2 text-center text-xs font-black text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-200 dark:hover:bg-slate-800",
                  FOCUS_RING,
                )}
              >
                <Icon className="h-4 w-4 text-blue-600 dark:text-blue-300" />
                {link.label}
              </button>
            );
          })}
        </div>
      </section>
    </div>
  );
}

function CoursesTab({ courses }: { courses: Course[] }) {
  return (
    <div className="space-y-3">
      <SectionTitle icon={BookOpen} title="Courses" detail="Compact progress and next due items" />
      {courses.map((course) => (
        <article
          key={course.id}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <p className="text-[11px] font-black uppercase tracking-wide text-blue-700 dark:text-blue-300">
                {course.code}
              </p>
              <h2 className="mt-1 truncate text-base font-black text-slate-950 dark:text-white">{course.title}</h2>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">Instructor: {course.instructor}</p>
            </div>
            <span className="rounded bg-slate-100 px-2 py-1 text-xs font-black text-slate-700 dark:bg-slate-800 dark:text-slate-200">
              {course.grade}
            </span>
          </div>
          <div className="mb-2 flex justify-between text-xs font-bold text-slate-600 dark:text-slate-300">
            <span>Progress</span>
            <span>{course.progress}%</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
            <div className={cn("h-full rounded-full", course.color)} style={{ width: `${course.progress}%` }} />
          </div>
          <p className="mt-3 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
            <span className="font-black text-slate-900 dark:text-white">Next due:</span> {getNextDueLabel(course)}
          </p>
        </article>
      ))}
    </div>
  );
}

function QuizzesTab({
  assessments,
}: {
  assessments: Array<{
    course: Course;
    assignment: CourseAssignment;
    detail: { timeLimit: string; attempts: string; status: "Ready" | "Review" | "Locked" };
  }>;
}) {
  return (
    <div className="space-y-3">
      <SectionTitle icon={ClipboardList} title="Quizzes" detail="Assessments, timers, and attempts" />
      {assessments.map(({ course, assignment, detail }) => (
        <article
          key={`${course.id}-${assignment.id}`}
          className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950"
        >
          <div className="mb-3 flex items-start justify-between gap-3">
            <div className="min-w-0">
              <div className="mb-2 flex flex-wrap gap-2">
                <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                  {assignment.type}
                </span>
                <span className={cn("rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", statusClass(detail.status))}>
                  {detail.status}
                </span>
              </div>
              <h2 className="text-base font-black leading-tight text-slate-950 dark:text-white">{assignment.title}</h2>
              <p className="mt-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
                {course.code} - {course.title}
              </p>
            </div>
            <button
              type="button"
              disabled={detail.status === "Locked"}
              className={cn(
                "rounded px-3 py-2 text-xs font-black transition-colors",
                FOCUS_RING,
                detail.status === "Locked"
                  ? "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500"
                  : "bg-blue-600 text-white hover:bg-blue-700",
              )}
            >
              {detail.status === "Review" ? "Review" : "Start"}
            </button>
          </div>
          <div className="grid grid-cols-3 gap-2 text-xs">
            <InfoPill label="Due" value={compactDueDate(assignment.dueDate)} />
            <InfoPill label="Limit" value={detail.timeLimit} />
            <InfoPill label="Attempts" value={detail.attempts} />
          </div>
        </article>
      ))}
    </div>
  );
}

function MessagesTab({
  conversations,
  selectedConversation,
  draft,
  onSelectConversation,
  onDraftChange,
  onSend,
}: {
  conversations: PhoneConversation[];
  selectedConversation: PhoneConversation;
  draft: string;
  onSelectConversation: (conversationId: string) => void;
  onDraftChange: (draft: string) => void;
  onSend: (event: FormEvent) => void;
}) {
  return (
    <div className="flex min-h-[610px] flex-col gap-3">
      <SectionTitle icon={MessageCircle} title="Messages" detail="Course conversations" />
      <div className="flex gap-2 overflow-x-auto pb-1" aria-label="Conversation list">
        {conversations.map((conversation) => {
          const isSelected = conversation.id === selectedConversation.id;
          return (
            <button
              key={conversation.id}
              type="button"
              onClick={() => onSelectConversation(conversation.id)}
              className={cn(
                "min-w-[178px] rounded-lg border p-3 text-left transition-colors",
                FOCUS_RING,
                isSelected
                  ? "border-blue-300 bg-blue-50 text-blue-950 dark:border-blue-700 dark:bg-blue-950/60 dark:text-blue-100"
                  : "border-slate-200 bg-white text-slate-900 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-950 dark:text-white dark:hover:bg-slate-800",
              )}
              aria-current={isSelected ? "true" : undefined}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <p className="truncate text-sm font-black">{conversation.title}</p>
                  <p className="mt-1 truncate text-xs opacity-75">{conversation.subtitle}</p>
                </div>
                {conversation.unread > 0 && (
                  <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">
                    {conversation.unread}
                  </span>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <header className="border-b border-slate-200 p-3 dark:border-slate-700">
          <p className="text-sm font-black text-slate-950 dark:text-white">{selectedConversation.title}</p>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            {selectedConversation.course ? `${selectedConversation.course} - ` : ""}
            {selectedConversation.subtitle}
          </p>
        </header>
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3" aria-live="polite" aria-label="Message thread">
          {selectedConversation.messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "max-w-[86%] rounded-lg border px-3 py-2",
                message.isMe
                  ? "ml-auto border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
              )}
            >
              <div className={cn("mb-1 flex items-center gap-2 text-[11px] font-black", message.isMe ? "text-blue-100" : "text-slate-500 dark:text-slate-400")}>
                <span>{message.sender}</span>
                <span>{message.time}</span>
              </div>
              <p className="text-sm leading-relaxed">{message.body}</p>
            </article>
          ))}
        </div>
        <form onSubmit={onSend} className="border-t border-slate-200 p-3 dark:border-slate-700">
          <label className="sr-only" htmlFor="phone-message-input">
            Type a message
          </label>
          <div className="flex gap-2">
            <input
              id="phone-message-input"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder={`Message ${selectedConversation.title}`}
              className={cn(
                "min-w-0 flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                FOCUS_RING,
              )}
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className={cn(
                "inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded transition-colors",
                FOCUS_RING,
                draft.trim()
                  ? "bg-blue-600 text-white hover:bg-blue-700"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
              )}
              aria-label="Send message"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function CometTab({
  messages,
  draft,
  onDraftChange,
  onPrompt,
  onSubmit,
}: {
  messages: CometMessage[];
  draft: string;
  onDraftChange: (draft: string) => void;
  onPrompt: (prompt: string) => void;
  onSubmit: (event: FormEvent) => void;
}) {
  return (
    <div className="flex min-h-[610px] flex-col gap-3">
      <SectionTitle icon={Bot} title="Comet AI" detail="Local study coach" />
      <section className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="flex gap-3">
          <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-slate-900 text-cyan-300 dark:bg-blue-500 dark:text-white">
            <Zap className="h-5 w-5" />
          </div>
          <div>
            <p className="text-sm font-black text-slate-950 dark:text-white">Whoosh mode</p>
            <p className="mt-1 text-sm leading-relaxed text-slate-600 dark:text-slate-300">
              Deterministic local replies for deadlines, quizzes, professor messages, and study plans.
            </p>
          </div>
        </div>
      </section>

      <div className="flex flex-wrap gap-2" aria-label="Comet prompt suggestions">
        {cometPrompts.map((prompt) => (
          <button
            key={prompt}
            type="button"
            onClick={() => onPrompt(prompt)}
            className={cn(
              "rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-black text-blue-700 transition-colors hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/50 dark:text-blue-200 dark:hover:bg-blue-900",
              FOCUS_RING,
            )}
          >
            {prompt}
          </button>
        ))}
      </div>

      <section className="flex min-h-0 flex-1 flex-col overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-950">
        <div className="min-h-0 flex-1 space-y-3 overflow-y-auto p-3" aria-live="polite" aria-label="Comet AI chat">
          {messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "max-w-[88%] rounded-lg border px-3 py-2",
                message.sender === "You"
                  ? "ml-auto border-blue-600 bg-blue-600 text-white"
                  : "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200",
              )}
            >
              <p className={cn("mb-1 text-[11px] font-black", message.sender === "You" ? "text-blue-100" : "text-slate-500 dark:text-slate-400")}>
                {message.sender}
              </p>
              <p className="whitespace-pre-line text-sm leading-relaxed">{message.body}</p>
            </article>
          ))}
        </div>
        <form onSubmit={onSubmit} className="border-t border-slate-200 p-3 dark:border-slate-700">
          <label className="sr-only" htmlFor="phone-comet-input">
            Ask Comet AI
          </label>
          <div className="flex gap-2">
            <input
              id="phone-comet-input"
              value={draft}
              onChange={(event) => onDraftChange(event.target.value)}
              placeholder="Ask about your next move..."
              className={cn(
                "min-w-0 flex-1 rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white",
                FOCUS_RING,
              )}
            />
            <button
              type="submit"
              disabled={!draft.trim()}
              className={cn(
                "inline-flex h-10 w-10 flex-shrink-0 items-center justify-center rounded transition-colors",
                FOCUS_RING,
                draft.trim()
                  ? "bg-slate-900 text-white hover:bg-slate-800 dark:bg-blue-500 dark:hover:bg-blue-400"
                  : "cursor-not-allowed bg-slate-100 text-slate-400 dark:bg-slate-800 dark:text-slate-500",
              )}
              aria-label="Send Comet AI prompt"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

function MetricTile({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded-lg border border-slate-200 bg-white p-4 shadow-sm dark:border-slate-700 dark:bg-slate-950">
      <div className="mb-3 flex h-8 w-8 items-center justify-center rounded bg-slate-900 text-white dark:bg-slate-800">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 text-2xl font-black text-slate-950 dark:text-white">{value}</p>
      <p className="text-xs text-slate-500 dark:text-slate-400">{detail}</p>
    </article>
  );
}

function SectionTitle({ icon: Icon, title, detail }: { icon: LucideIcon; title: string; detail: string }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div>
        <h1 className="flex items-center gap-2 text-lg font-black text-slate-950 dark:text-white">
          <Icon className="h-5 w-5 text-blue-600 dark:text-blue-300" />
          {title}
        </h1>
        <p className="mt-0.5 text-xs font-medium text-slate-500 dark:text-slate-400">{detail}</p>
      </div>
    </div>
  );
}

function InfoPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded bg-slate-50 p-2 dark:bg-slate-900">
      <p className="text-[10px] font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{label}</p>
      <p className="mt-1 font-bold text-slate-800 dark:text-slate-100">{value}</p>
    </div>
  );
}

function dueDateValue(dueDate: string) {
  const normalized = dueDate.replace(" at ", " ");
  const value = new Date(normalized).getTime();
  return Number.isNaN(value) ? Number.MAX_SAFE_INTEGER : value;
}

function compactDueDate(dueDate: string) {
  return dueDate.replace(" at ", ", ");
}

function getNextDueLabel(course: Course) {
  const nextAssignment = course.assignments
    .filter((assignment) => !assignment.dueDate.toLowerCase().startsWith("submitted"))
    .sort((a, b) => dueDateValue(a.dueDate) - dueDateValue(b.dueDate))[0];

  if (!nextAssignment) return "No open due items";
  return `${nextAssignment.title} - ${compactDueDate(nextAssignment.dueDate)}`;
}

function statusClass(status: "Ready" | "Review" | "Locked") {
  if (status === "Locked") return "bg-slate-100 text-slate-500 dark:bg-slate-800 dark:text-slate-400";
  if (status === "Review") return "bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-200";
  return "bg-blue-50 text-blue-700 dark:bg-blue-950 dark:text-blue-200";
}

function getCometResponse(prompt: string) {
  const lowerPrompt = prompt.toLowerCase();

  if (lowerPrompt.includes("database") || lowerPrompt.includes("normalization") || lowerPrompt.includes("sql")) {
    return "Database Systems plan:\n1. Review keys and functional dependencies.\n2. Do 20 minutes of 2NF/3NF examples.\n3. Finish with 5 join questions and predict row counts before writing SQL.";
  }

  if (lowerPrompt.includes("professor") || lowerPrompt.includes("message") || lowerPrompt.includes("klyne")) {
    return "Draft:\nHello Professor Klyne Smith, could I send our current Software Engineering project draft for focused feedback on requirements traceability, UML boundaries, and testing coverage before the milestone?";
  }

  if (lowerPrompt.includes("quiz") || lowerPrompt.includes("exam")) {
    return "Assessment prep:\nStart with the next quiz or exam, skim the rubric, then do one short recall pass before practice questions. Keep the timer visible and use Focus Mode.";
  }

  if (lowerPrompt.includes("whoosh") || lowerPrompt.includes("study plan") || lowerPrompt.includes("tonight")) {
    return "Whoosh study plan:\n1. Computer Networks packet annotations for 25 minutes.\n2. Database normalization review for 25 minutes.\n3. Software Engineering UML cleanup for 20 minutes.\nTiny thrusts, big trajectory.";
  }

  return "Quick read: protect the closest deadline first, then rotate through the course with the biggest grade opportunity. For Carson today, that means Networks first, Database second, Software Engineering third.";
}
