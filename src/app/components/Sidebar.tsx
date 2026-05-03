import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import {
  LayoutDashboard,
  BookOpen,
  Calendar as CalendarIcon,
  GraduationCap,
  Settings,
  LogOut,
  Bell,
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

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const PINNED_ITEMS_KEY = "blackboard:pinned-sidebar-tools";
const DEFAULT_PINNED_ITEMS = ["/dashboard", "/courses", "/quiz", "/assignment", "/grades", "/calendar", "/messages", "/ai-assistant"];
const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white focus-visible:ring-offset-2 focus-visible:ring-offset-[#E87500]";

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
      "h-screen transition-all duration-300 flex flex-col relative text-white",
      isDark ? "bg-orange-800 border-r border-orange-900" : "bg-[#E87500] border-r border-orange-700",
      isCollapsed ? "w-20" : "w-60"
    )}>
      <div className="p-4 flex items-center gap-3 border-b border-white/20">
        <div className="w-8 h-8 bg-white/15 rounded flex items-center justify-center flex-shrink-0">
          <BookOpen className="text-white w-5 h-5" />
        </div>
        {!isCollapsed && <span className="font-semibold text-sm text-white truncate">Blackboard</span>}
      </div>

      <button
        type="button"
        onClick={toggleSidebar}
        className={cn("absolute -right-3 top-20 w-6 h-6 rounded-full flex items-center justify-center shadow-md transition-all z-10", isDark ? "bg-orange-900 border border-orange-800 hover:bg-orange-950" : "bg-orange-700 border border-orange-600 hover:bg-orange-800", FOCUS_RING)}
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
  const [showNotifications, setShowNotifications] = useState(false);

  const announcements = [
    {
      scope: "CS 4347.002",
      title: "Database Systems midterm review posted",
      date: "Today",
    },
    {
      scope: "CS 3354.012",
      title: "Software Engineering project milestone reminder",
      date: "Yesterday",
    },
    {
      scope: "University",
      title: "Spring registration and advising windows are open",
      date: "2 days ago",
    },
  ];

  return (
    <header className="h-14 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-slate-900 dark:text-slate-100">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowNotifications((visible) => !visible)}
              className="relative p-1.5 text-slate-500 dark:text-slate-400 hover:text-slate-700 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800 rounded transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
              aria-label="Notifications"
              aria-expanded={showNotifications}
            >
              <Bell className="w-4 h-4" />
              <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
            </button>

            {showNotifications && (
              <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded border border-slate-200 bg-white shadow-lg dark:border-slate-700 dark:bg-slate-900">
                <div className="border-b border-slate-200 px-4 py-3 dark:border-slate-700">
                  <p className="text-sm font-bold text-slate-900 dark:text-slate-100">Announcements</p>
                </div>
                <div className="divide-y divide-slate-100 dark:divide-slate-800">
                  {announcements.map((announcement) => (
                    <div key={`${announcement.scope}-${announcement.title}`} className="px-4 py-3">
                      <div className="mb-1 flex items-center justify-between gap-3">
                        <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                          {announcement.scope}
                        </span>
                        <span className="text-xs font-medium text-slate-500 dark:text-slate-400">
                          {announcement.date}
                        </span>
                      </div>
                      <p className="text-sm font-semibold leading-snug text-slate-900 dark:text-slate-100">
                        {announcement.title}
                      </p>
                    </div>
                  ))}
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
