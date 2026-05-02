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
      "h-screen bg-slate-800 border-r border-slate-700 transition-all duration-300 flex flex-col relative",
      isCollapsed ? "w-20" : "w-60"
    )}>
      <div className="p-4 flex items-center gap-3 border-b border-slate-700">
        <div className="w-8 h-8 bg-slate-700 rounded flex items-center justify-center flex-shrink-0">
          <BookOpen className="text-slate-100 w-5 h-5" />
        </div>
        {!isCollapsed && <span className="font-semibold text-sm text-slate-100 truncate">Blackboard</span>}
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-3 top-20 w-6 h-6 bg-slate-700 border border-slate-600 rounded-full flex items-center justify-center shadow-md hover:bg-slate-600 transition-all z-10"
      >
        {isCollapsed ? <ChevronRight className="w-3 h-3 text-slate-200" /> : <ChevronLeft className="w-3 h-3 text-slate-200" />}
      </button>

      <nav className="flex-1 px-2 space-y-1 mt-2 overflow-y-auto">
        {displayedItems.map((item) => {
          const isActive = location.pathname === item.path;
          const isPinned = pinnedItems.includes(item.path);
          return (
            <div key={item.path} className="relative group/nav">
              <Link
                to={item.path}
                className={cn(
                  "flex items-center gap-3 px-3 py-2 rounded transition-colors text-sm",
                  isActive
                    ? "bg-slate-700 text-slate-100 border-l-2 border-slate-300"
                    : "text-slate-300 hover:bg-slate-700 hover:text-slate-100"
                )}
              >
                <item.icon className={cn("w-4 h-4 flex-shrink-0", isActive ? "text-slate-200" : "text-slate-400")} />
                {!isCollapsed && <span className="font-normal flex-1 text-sm">{item.name}</span>}
                {!isCollapsed && (
                  <button
                    onClick={(e) => {
                      e.preventDefault();
                      togglePin(item.path);
                    }}
                    className="opacity-0 group-hover/nav:opacity-100 transition-opacity"
                  >
                    <Pin className={cn("w-3 h-3 text-slate-500", isPinned && "fill-slate-400 text-slate-300")} />
                  </button>
                )}
              </Link>
            </div>
          );
        })}
      </nav>

      <div className="p-2 border-t border-slate-700 space-y-1">
        <button
          onClick={toggleTheme}
          className="flex items-center gap-3 px-3 py-2 rounded text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors w-full text-sm"
        >
          {isDark ? <Sun className="w-4 h-4 flex-shrink-0" /> : <Moon className="w-4 h-4 flex-shrink-0" />}
          {!isCollapsed && <span className="font-normal text-sm">{isDark ? "Light" : "Dark"}</span>}
        </button>
        <button className="flex items-center gap-3 px-3 py-2 rounded text-slate-300 hover:bg-slate-700 hover:text-slate-100 transition-colors w-full text-sm">
          <LogOut className="w-4 h-4 flex-shrink-0" />
          {!isCollapsed && <span className="font-normal text-sm">Logout</span>}
        </button>
      </div>
    </div>
  );
}

export function Header({ title }: { title: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);

  return (
    <header className="h-14 bg-white border-b border-slate-200 flex items-center justify-between px-6">
      <h1 className="text-lg font-semibold text-slate-900">{title}</h1>

      <div className="flex items-center gap-4">
        <div className="relative hidden md:block">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setShowSearchResults(true)}
            onBlur={() => setTimeout(() => setShowSearchResults(false), 200)}
            className="pl-9 pr-3 py-1.5 bg-slate-100 border border-slate-200 rounded text-sm focus:outline-none focus:ring-1 focus:ring-slate-400 w-64 text-slate-900 placeholder-slate-500"
          />
          {showSearchResults && searchQuery && (
            <div className="absolute top-full mt-1 w-full bg-white border border-slate-200 rounded shadow-sm p-2 z-50">
              <div className="text-xs text-slate-400 px-2 py-1">Search results for "{searchQuery}"</div>
              <div className="text-sm text-slate-500 px-2 py-1">No results found</div>
            </div>
          )}
        </div>

        <div className="flex items-center gap-3">
          <button className="relative p-1.5 text-slate-500 hover:text-slate-700 hover:bg-slate-100 rounded transition-colors">
            <Bell className="w-4 h-4" />
            <span className="absolute top-0.5 right-0.5 w-1.5 h-1.5 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center gap-2 pl-3 border-l border-slate-200">
            <div className="text-right hidden sm:block">
              <p className="text-xs font-semibold text-slate-900 leading-tight">Zabisaq Tasharmapandyasan</p>
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
