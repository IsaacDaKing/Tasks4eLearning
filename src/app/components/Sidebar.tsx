import { createContext, useContext, useState, ReactNode } from "react";
import { Link, useLocation } from "react-router";
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
  Calculator
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { useTheme } from "../contexts/ThemeContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SidebarContextType {
  isCollapsed: boolean;
  toggleSidebar: () => void;
  pinnedItems: string[];
  togglePin: (path: string) => void;
}

const SidebarContext = createContext<SidebarContextType | undefined>(undefined);

export function SidebarProvider({ children }: { children: ReactNode }) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [pinnedItems, setPinnedItems] = useState<string[]>(["/", "/courses", "/calendar", "/grades"]);

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

  const allNavItems = [
    { name: "Dashboard", icon: LayoutDashboard, path: "/" },
    { name: "Courses", icon: BookOpen, path: "/courses" },
    { name: "Calendar", icon: CalendarIcon, path: "/calendar" },
    { name: "Grades", icon: GraduationCap, path: "/grades" },
    { name: "Grade Calculator", icon: Calculator, path: "/grade-calculator" },
    { name: "Assignment", icon: Pin, path: "/assignment" },
    { name: "Quiz", icon: Bell, path: "/quiz" },
    { name: "Settings", icon: Settings, path: "/settings" },
  ];

  const displayedItems = isCollapsed
    ? allNavItems.filter(item => pinnedItems.includes(item.path))
    : allNavItems;

  return (
    <div className={cn(
      "h-screen bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-700 transition-all duration-300 flex flex-col relative",
      isCollapsed ? "w-20" : "w-64"
    )}>
      <div className="p-6 flex items-center gap-3">
        <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
          <BookOpen className="text-white w-5 h-5" />
        </div>
        {!isCollapsed && <span className="font-bold text-xl text-slate-900 dark:text-white truncate">eLearning</span>}
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full flex items-center justify-center shadow-md hover:shadow-lg transition-all z-10"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
      </button>

      <nav className="flex-1 px-4 space-y-2 mt-4 overflow-y-auto">
        {displayedItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isPinned = pinnedItems.includes(item.path);
          return (
            <div key={item.path} className="relative group/nav">
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-xl transition-colors",
                  isActive
                    ? "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
                    : "text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white"
                )}
              >
                <item.icon className={cn("w-5 h-5 flex-shrink-0", isActive ? "text-blue-600 dark:text-blue-400" : "text-slate-400 dark:text-slate-500 group-hover/nav:text-slate-900 dark:group-hover/nav:text-white")} />
                {!isCollapsed && <span className="font-medium flex-1">{item.name}</span>}
                {!isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      togglePin(item.path);
                    }}
                    className="opacity-0 group-hover/nav:opacity-100 transition-opacity"
                  >
                    <Pin className={cn("w-3 h-3", isPinned && "fill-current")} />
                  </button>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-4 border-t border-slate-100 dark:border-slate-800 space-y-2">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors w-full"
        >
          {isDark ? <Sun className="w-5 h-5 flex-shrink-0" /> : <Moon className="w-5 h-5 flex-shrink-0" />}
          {!isCollapsed && <span className="font-medium">{isDark ? "Light Mode" : "Dark Mode"}</span>}
        </button>
        <button className="flex items-center gap-3 px-3 py-2.5 rounded-xl text-slate-500 dark:text-slate-400 hover:bg-red-50 dark:hover:bg-red-900/20 hover:text-red-600 dark:hover:text-red-400 transition-colors w-full">
          <LogOut className="w-5 h-5 flex-shrink-0" />
          {!isCollapsed && <span className="font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function Header({ title }: { title: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  return (
    <header className="h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-8">
      <h1 className="text-xl font-bold text-slate-900 dark:text-white">{title}</h1>

      <div className="flex items-center gap-6">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search courses, files, assignments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="pl-10 pr-4 py-2 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/20 w-80 dark:text-white"
          />
          {showSearchResults && searchQuery && (
            <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl shadow-lg p-2 z-50">
              <div className="text-xs text-slate-400 px-3 py-2">Search results for "{searchQuery}"</div>
              <div className="text-sm text-slate-500 dark:text-slate-400 px-3 py-2">No results found</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-4">
          <button className="relative p-2 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 rounded-full transition-colors">
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-500 rounded-full border-2 border-white dark:border-slate-900"></span>
          </button>

          <div className="flex items-center gap-3 pl-4 border-l border-slate-200 dark:border-slate-700">
            <div className="text-right hidden sm:block">
              <p className="text-sm font-semibold text-slate-900 dark:text-white leading-tight">Alex Martinez</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Student ID: STU-4521</p>
            </div>
            <div className="w-10 h-10 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center overflow-hidden">
               <User className="w-6 h-6 text-slate-400" />
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
