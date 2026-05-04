import { createContext, useContext, useEffect, useMemo, useState, type KeyboardEvent, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Calendar as CalendarIcon,
  GraduationCap,
  Settings,
  LogOut,
  Bell,
  Search,
  User,
  Moon,
  Sun,
  ChevronLeft,
  ChevronRight,
  Pin,
  Calculator,
  ClipboardList,
  MessageSquare,
  Sparkles,
  type LucideIcon
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../contexts/ThemeContext";
import { COURSES } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PINNED_ITEMS_KEY = "blackboard:pinned-sidebar-tools";
const DEFAULT_PINNED_ITEMS = ["/dashboard", "/courses", "/quiz", "/assignment", "/grades", "/calendar", "/messages", "/ai-assistant"];
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#E87500]";
const HEADER_FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  pinnedItems: string[];
  togglePin: (path: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>(() => {
    if (typeof window === "undefined") return DEFAULT_PINNED_ITEMS;
    try {
      const savedItems = window.localStorage.getItem(PINNED_ITEMS_KEY);
      const parsedItems = savedItems ? JSON.parse(savedItems) : null;
      return Array.isArray(parsedItems)
        ? parsedItems.map((item) => (item === "/" ? "/dashboard" : item))
        : DEFAULT_PINNED_ITEMS;
    } catch {
      return DEFAULT_PINNED_ITEMS;
    }
  });

  useEffect(() => {
    if (typeof window === "undefined") return;
    window.localStorage.setItem(PINNED_ITEMS_KEY, JSON.stringify(pinnedItems));
  }, [pinnedItems]);

  const toggleSidebar = () => setIsCollapsed(!isCollapsed);

  const togglePin = (path: string) => {
    setPinnedItems(prev =>
      prev.includes(path)
        ? prev.filter(p => p !== path)
        : [...prev, path]
    );
  };

  return (
    <SidebarContext.Provider value={{ isCollapsed, toggleSidebar, pinnedItems, togglePin }}>
      {children}
    </SidebarContext.Provider>
  );
}

export function useSidebar() {
  const context = useContext(SidebarContext);
  if (!context) throw new Error("useSidebar must be used within SidebarProvider");
  return context;
}

export function Sidebar() {
  const { isCollapsed, toggleSidebar, pinnedItems, togglePin } = useSidebar();
  const { isDark, toggleTheme } = useTheme();
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogout = () => {
    window.localStorage.removeItem("lms-prototype-session");
    navigate("/");
  };

  const allNavItems: Array<{
    name: string;
    icon: LucideIcon;
    path: string;
    disabled?: boolean;
    previewLabel?: string;
  }> = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
    { name: "Courses", icon: BookOpen, path: "/courses" },
    { name: "Quiz", icon: Bell, path: "/quiz" },
    { name: "Assignment", icon: ClipboardList, path: "/assignment" },
    { name: "Grades", icon: GraduationCap, path: "/grades" },
    { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
    { name: "Grade Calculator", icon: Calculator, path: "/grade-calculator" },
    { name: "Messages", icon: MessageSquare, path: "/messages" },
    { name: "Comet AI", icon: Sparkles, path: "/ai-assistant" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const displayedItems = isCollapsed
    ? allNavItems.filter(item => pinnedItems.includes(item.path))
    : allNavItems;

  return (
    <div className={cn(
      "h-screen bg-[#E87500] border-r border-orange-700 transition-all duration-300 flex flex-col relative text-white",
      isCollapsed ? "w-20" : "w-60"
    )}>
      <div className="p-4 flex items-center gap-3 border-b border-white/20">
        <div className="w-9 h-9 bg-white rounded flex items-center justify-center flex-shrink-0 overflow-hidden">
          <img src="/Tasks4eLearning.png" alt="Tasks4eLearning logo" className="h-8 w-8 object-contain" />
        </div>
        {!isCollapsed && <span className="font-semibold text-sm text-white truncate">Tasks4eLearning</span>}
      </div>

      <button
        type="button"
        onClick={toggleSidebar}
        className={cn("absolute -right-3 top-20 w-6 h-6 bg-orange-700 border border-orange-600 rounded-full flex items-center justify-center shadow-md hover:bg-orange-800 transition-all z-10", FOCUS_RING)}
        aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3 text-white" /> : <ChevronLeft className="w-3 h-3 text-white" />}
      </button>

      <nav className="flex-1 px-2 space-y-1 mt-2 overflow-y-auto">
        {displayedItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isPinned = pinnedItems.includes(item.path);
          const content = (
            <>
              <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-white" : "text-white/80")} />
              {!isCollapsed && <span className="font-normal flex-1 text-sm">{item.name}</span>}
              {!isCollapsed && item.previewLabel && (
                  <span className="rounded bg-white/15 px-1.5 py-0.5 text-[9px] font-semibold uppercase tracking-wide text-white">
                  {item.previewLabel}
                </span>
              )}
              {!isCollapsed && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    togglePin(item.path);
                  }}
                  className={cn(
                    "rounded p-1 transition-colors hover:bg-white/15",
                    FOCUS_RING,
                  )}
                  aria-label={isPinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
                  title={isPinned ? `Unpin ${item.name}` : `Pin ${item.name}`}
                >
                  <Pin className={cn("w-3 h-3 text-white/55", isPinned && "fill-white text-white")} />
                </button>
              )}
            </>
          );

          return (
            <div key={item.path} className="relative group/nav">
              {item.disabled ? (
                <div
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded transition-colors text-sm text-white/70",
                    isPinned && "bg-white/10",
                  )}
                  title={`${item.name} is available as a dashboard preview`}
                  aria-disabled="true"
                >
                  {content}
                </div>
              ) : (
                <Link
                  to={item.path}
                  className={cn(
                    "flex items-center gap-3 px-3 py-2 rounded transition-colors text-sm",
                    FOCUS_RING,
                    isActive
                      ? "bg-white/20 text-white border-l-2 border-white"
                      : "text-white/90 hover:bg-white/15 hover:text-white"
                  )}
                >
                  {content}
                </Link>
              )}
            </div>
          );
        })}
      </nav>

      <div className="p-2 border-t border-white/20 space-y-1">
        <button
          type="button"
          onClick={toggleTheme}
          className={cn("flex items-center gap-3 px-3 py-2 rounded text-white/90 hover:bg-white/15 hover:text-white transition-colors w-full text-sm", FOCUS_RING)}
        >
          {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
          {!isCollapsed && <span className="font-normal text-sm">{isDark ? "Light" : "Dark"}</span>}
        </button>
        <button
          type="button"
          onClick={handleLogout}
          className={cn("flex items-center gap-3 px-3 py-2 rounded text-white/90 hover:bg-white/15 hover:text-white transition-colors w-full text-sm", FOCUS_RING)}
        >
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="font-normal text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function Header({ title }: { title: string }) {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const [highlightedResult, setHighlightedResult] = useState(0);
  const [showNotifications, setShowNotifications] = useState(false);
  const [notificationSettings, setNotificationSettings] = useState(readNotificationSettings);

  useEffect(() => {
    const syncSettings = () => setNotificationSettings(readNotificationSettings());
    window.addEventListener("storage", syncSettings);
    window.addEventListener("lms-notification-settings-updated", syncSettings);
    return () => {
      window.removeEventListener("storage", syncSettings);
      window.removeEventListener("lms-notification-settings-updated", syncSettings);
    };
  }, []);

  const searchResults = useMemo(() => buildGlobalSearchResults(searchQuery), [searchQuery]);
  const visibleNotifications = MOCK_NOTIFICATIONS.filter((item) => notificationSettings.preferences[item.category]);
  const mutedNotificationCount = visibleNotifications.filter((item) => isNotificationMuted(item, notificationSettings)).length;

  const closeSearch = () => {
    setShowSearchResults(false);
    setHighlightedResult(0);
  };

  const openSearchResult = (result: SearchResult) => {
    setSearchQuery("");
    closeSearch();
    navigate(result.to);
  };

  const handleSearchKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "Escape") {
      closeSearch();
      return;
    }
    if (!showSearchResults || searchResults.length === 0) return;
    if (event.key === "ArrowDown") {
      event.preventDefault();
      setHighlightedResult((index) => Math.min(index + 1, searchResults.length - 1));
      return;
    }
    if (event.key === "ArrowUp") {
      event.preventDefault();
      setHighlightedResult((index) => Math.max(index - 1, 0));
      return;
    }
    if (event.key === "Enter") {
      event.preventDefault();
      openSearchResult(searchResults[highlightedResult] ?? searchResults[0]);
    }
  };

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            aria-label="Global search"
            aria-expanded={showSearchResults && Boolean(searchQuery)}
            aria-controls="global-search-results"
            placeholder="Search courses, assignments, quizzes..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setHighlightedResult(0);
            }}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            onKeyDown={handleSearchKeyDown}
            className="pl-9 pr-3 py-1.5 bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 w-80 text-slate-900 dark:text-slate-100 placeholder-slate-500"
          />
          {showSearchResults && searchQuery && (
            <div id="global-search-results" className="absolute top-full mt-1 w-[28rem] right-0 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded shadow-lg p-2 z-50">
              <div className="text-xs text-slate-400 px-2 py-1">Search results for "{searchQuery}"</div>
              {searchResults.length > 0 ? (
                <div className="max-h-96 overflow-y-auto" role="listbox" aria-label="Global search results">
                  {searchResults.map((result, index) => (
                    <button
                      key={`${result.type}-${result.title}-${result.to}`}
                      type="button"
                      onMouseDown={(event) => event.preventDefault()}
                      onClick={() => openSearchResult(result)}
                      className={cn(
                        "w-full rounded p-2 text-left transition-colors",
                        HEADER_FOCUS_RING,
                        index === highlightedResult ? "bg-slate-100 dark:bg-slate-800" : "hover:bg-slate-50 dark:hover:bg-slate-800",
                      )}
                      role="option"
                      aria-selected={index === highlightedResult}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-bold text-slate-900 dark:text-slate-100">{result.title}</p>
                          <p className="mt-0.5 line-clamp-2 text-xs text-slate-500 dark:text-slate-400">{result.description}</p>
                        </div>
                        <span className="flex-shrink-0 rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-200">
                          {result.type}
                        </span>
                      </div>
                    </button>
                  ))}
                </div>
              ) : (
                <div className="rounded bg-slate-50 px-3 py-4 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                  No matching courses, assignments, quizzes, messages, grades, or tools found.
                </div>
              )}
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((value) => !value)}
              className={cn("relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors", HEADER_FOCUS_RING)}
              aria-label="Open notification center"
              aria-expanded={showNotifications}
            >
              <Bell className="w-4 h-4" />
              {visibleNotifications.length > 0 && <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full" />}
            </button>
            {showNotifications && (
              <div className="absolute right-0 top-full z-50 mt-2 w-96 rounded border border-slate-200 bg-white p-3 shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="mb-3 flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-black text-slate-900 dark:text-white">Notification Center</h2>
                    <p className="mt-0.5 text-xs text-slate-500 dark:text-slate-400">
                      {notificationSettings.quietHoursEnabled
                        ? `Quiet Hours ${notificationSettings.quietHoursStart}-${notificationSettings.quietHoursEnd}; ${mutedNotificationCount} non-critical muted.`
                        : "Quiet Hours are off."}
                    </p>
                  </div>
                  <Link to="/settings" className={cn("rounded text-xs font-bold text-blue-700 hover:underline dark:text-blue-300", HEADER_FOCUS_RING)}>
                    Settings
                  </Link>
                </div>
                <div className="max-h-96 space-y-2 overflow-y-auto" aria-live="polite">
                  {visibleNotifications.map((notification) => {
                    const muted = isNotificationMuted(notification, notificationSettings);
                    return (
                      <Link
                        key={notification.id}
                        to={notification.to}
                        onClick={() => setShowNotifications(false)}
                        className={cn(
                          "block rounded border p-3 transition-colors",
                          HEADER_FOCUS_RING,
                          notification.critical
                            ? "border-red-200 bg-red-50 text-red-900 dark:border-red-800 dark:bg-red-900/20 dark:text-red-200"
                            : muted
                              ? "border-slate-200 bg-slate-50 text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400"
                              : "border-slate-200 bg-white text-slate-800 hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
                        )}
                      >
                        <div className="mb-1 flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold">{notification.title}</span>
                          <span className="rounded bg-white/70 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide dark:bg-slate-950/40">
                            {notification.critical ? "Important" : muted ? "Muted" : notification.type}
                          </span>
                        </div>
                        <p className="text-xs leading-5">{muted ? `Scheduled after Quiet Hours: ${notification.detail}` : notification.detail}</p>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200 dark:border-slate-700">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 leading-tight">Zabisaq Tasharmapandyasan</p>
              <p className="text-xs text-slate-500">Student ID: ZXT220067</p>
            </div>
            <div className="w-8 h-8 rounded bg-slate-200 border border-slate-300 flex items-center justify-center overflow-hidden flex-shrink-0">
               <User className="w-4 h-4 text-slate-500" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}

type NotificationCategory = "assignments" | "grades" | "messages" | "studyReminders";

interface MockNotification {
  id: string;
  title: string;
  detail: string;
  type: string;
  category: NotificationCategory;
  critical?: boolean;
  to: string;
}

interface NotificationSettings {
  quietHoursEnabled: boolean;
  quietHoursStart: string;
  quietHoursEnd: string;
  preferences: Record<NotificationCategory, boolean>;
}

interface SearchResult {
  title: string;
  type: "Course" | "Assignment" | "Quiz" | "Message" | "Grade" | "Tool";
  description: string;
  to: string;
  keywords: string;
}

const MOCK_NOTIFICATIONS: MockNotification[] = [
  {
    id: "assignment-posted",
    title: "New assignment posted",
    detail: "Software Design Patterns Lab is available in Software Engineering.",
    type: "Assignment",
    category: "assignments",
    to: "/courses/cs3354/assignments/1",
  },
  {
    id: "grade-feedback",
    title: "Grade feedback available",
    detail: "SQL Query Optimization feedback has been released.",
    type: "Grade",
    category: "grades",
    to: "/grades",
  },
  {
    id: "smith-message",
    title: "Message from Professor Klyne Smith",
    detail: "Project milestone rubric clarification is waiting in Messages.",
    type: "Message",
    category: "messages",
    to: "/messages",
  },
  {
    id: "quiz-reminder",
    title: "Upcoming quiz reminder",
    detail: "Network Protocols Quiz is due soon. Time limit: 30 minutes.",
    type: "Quiz",
    category: "studyReminders",
    critical: true,
    to: "/quiz",
  },
  {
    id: "comet-plan",
    title: "Comet AI study plan reminder",
    detail: "Review tonight's generated study plan before starting quiz prep.",
    type: "Study",
    category: "studyReminders",
    to: "/ai-assistant",
  },
];

const STATIC_SEARCH_ITEMS: SearchResult[] = [
  {
    title: "Network Protocols Quiz",
    type: "Quiz",
    description: "Computer Networks quiz with TCP/IP, DNS, subnetting, and mixed question types.",
    to: "/quiz",
    keywords: "network protocols quiz computer networks tcp udp dns subnet osi",
  },
  {
    title: "Database Systems Midterm Exam",
    type: "Quiz",
    description: "Exam covering normalization, SQL joins, keys, transactions, ACID, and indexing.",
    to: "/quiz",
    keywords: "database systems midterm exam normalization sql joins acid indexing",
  },
  {
    title: "Software Engineering Foundations Quiz",
    type: "Quiz",
    description: "Quiz covering requirements, UML, agile, scrum, testing, and traceability.",
    to: "/quiz",
    keywords: "software engineering quiz requirements uml agile scrum testing traceability",
  },
  {
    title: "Prof. Klyne Smith message",
    type: "Message",
    description: "Sprint milestone rubric clarification and project feedback thread.",
    to: "/messages",
    keywords: "message professor klyne smith sprint milestone rubric feedback software engineering",
  },
  {
    title: "Database grade feedback",
    type: "Grade",
    description: "SQL Query Optimization grade feedback and grade audit details.",
    to: "/grades",
    keywords: "grades feedback sql query optimization audit database systems",
  },
  {
    title: "Grade Calculator",
    type: "Tool",
    description: "Simulation mode for projected scores, final grades, and temporary GPA.",
    to: "/grade-calculator",
    keywords: "grade calculator gpa projected scores simulation final grade",
  },
  {
    title: "Comet AI Study Plan",
    type: "Tool",
    description: "AI-style local study planner for deadlines, grades, and time management.",
    to: "/ai-assistant",
    keywords: "comet ai study plan time management deadlines grade help",
  },
  {
    title: "Academic Calendar",
    type: "Tool",
    description: "Calendar view for courses, quizzes, tests, and upcoming work.",
    to: "/calendar",
    keywords: "calendar schedule deadlines quizzes tests courses",
  },
];

function readNotificationSettings(): NotificationSettings {
  let preferences: Record<NotificationCategory, boolean> = {
    assignments: true,
    grades: true,
    messages: true,
    studyReminders: true,
  };
  try {
    const savedPrefs = localStorage.getItem("lms-notification-preferences");
    if (savedPrefs) preferences = { ...preferences, ...JSON.parse(savedPrefs) };
  } catch {
    // Fall back to defaults for malformed localStorage.
  }
  return {
    quietHoursEnabled: localStorage.getItem("lms-quiet-hours-enabled") === "true",
    quietHoursStart: localStorage.getItem("lms-quiet-hours-start") || "22:00",
    quietHoursEnd: localStorage.getItem("lms-quiet-hours-end") || "07:00",
    preferences,
  };
}

function isNotificationMuted(notification: MockNotification, settings: NotificationSettings) {
  return settings.quietHoursEnabled && !notification.critical && isNowWithinQuietHours(settings.quietHoursStart, settings.quietHoursEnd);
}

function isNowWithinQuietHours(start: string, end: string) {
  const now = new Date();
  const nowMinutes = now.getHours() * 60 + now.getMinutes();
  const startMinutes = parseTime(start);
  const endMinutes = parseTime(end);
  if (startMinutes === endMinutes) return true;
  if (startMinutes < endMinutes) return nowMinutes >= startMinutes && nowMinutes < endMinutes;
  return nowMinutes >= startMinutes || nowMinutes < endMinutes;
}

function parseTime(value: string) {
  const [hours = "0", minutes = "0"] = value.split(":");
  return Number(hours) * 60 + Number(minutes);
}

function buildGlobalSearchResults(query: string): SearchResult[] {
  const normalizedQuery = query.trim().toLowerCase();
  if (!normalizedQuery) return [];

  const courseResults: SearchResult[] = COURSES.flatMap((course) => [
    {
      title: course.title,
      type: "Course" as const,
      description: `${course.code} with ${course.instructor}. Current progress ${course.progress}%.`,
      to: `/courses/${course.id}`,
      keywords: `${course.title} ${course.code} ${course.instructor}`,
    },
    ...course.assignments.map((assignment) => ({
      title: assignment.title,
      type: "Assignment" as const,
      description: `${assignment.type} for ${course.code}. Due ${assignment.dueDate}.`,
      to: `/courses/${course.id}/assignments/${assignment.id}`,
      keywords: `${assignment.title} ${assignment.moduleTitle} ${assignment.type} ${assignment.description} ${assignment.notes} ${course.title} ${course.code}`,
    })),
  ]);

  return [...courseResults, ...STATIC_SEARCH_ITEMS]
    .filter((item) => `${item.title} ${item.description} ${item.keywords}`.toLowerCase().includes(normalizedQuery))
    .slice(0, 8);
}
