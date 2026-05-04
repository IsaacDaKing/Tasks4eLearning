import {
  Search,
  Grid2X2,
  List,
  MoreVertical,
  BookOpen,
  Users,
  ClipboardList,
} from "lucide-react";
import { useMemo, useState } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { Link } from "react-router";
import { COURSES } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

export function CoursesPage() {
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchQuery, setSearchQuery] = useState("");
  const [sortMode, setSortMode] = useState("recent");
  const filteredCourses = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    const nextCourses = COURSES.filter((course) =>
      !query ||
      [course.title, course.code, course.instructor, course.assignments[0]?.title]
        .filter(Boolean)
        .some((value) => value!.toLowerCase().includes(query)),
    );
    if (sortMode === "name") return nextCourses.slice().sort((a, b) => a.title.localeCompare(b.title));
    if (sortMode === "progress") return nextCourses.slice().sort((a, b) => b.progress - a.progress);
    return nextCourses;
  }, [searchQuery, sortMode]);

  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
            Your Courses
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
            Continue where you left off or start a new course.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white dark:bg-slate-900 p-1 rounded border border-slate-200 dark:border-slate-700">
          <button
            type="button"
            onClick={() => setViewMode("grid")}
            className={cn("p-1.5 rounded transition-all active:scale-95", FOCUS_RING, viewMode === "grid" ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}
            aria-label="Grid view"
            aria-pressed={viewMode === "grid"}
          >
            <Grid2X2 className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => setViewMode("list")}
            className={cn("p-1.5 rounded transition-all active:scale-95", FOCUS_RING, viewMode === "list" ? "bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-white border border-slate-200 dark:border-slate-700" : "text-slate-400 hover:text-slate-600 dark:hover:text-slate-200")}
            aria-label="List view"
            aria-pressed={viewMode === "list"}
          >
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            aria-label="Search courses"
            value={searchQuery}
            onChange={(event) => setSearchQuery(event.target.value)}
            placeholder="Search for courses, instructors..."
            className="w-full pl-9 pr-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 dark:text-white placeholder-slate-500"
          />
        </div>
        <select className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-slate-400 w-full sm:w-auto" aria-label="Filter by semester">
          <option>All Semesters</option>
          <option>Spring 2026</option>
          <option>Fall 2025</option>
        </select>
        <select value={sortMode} onChange={(event) => setSortMode(event.target.value)} className="px-3 py-2 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded text-sm font-medium text-slate-700 dark:text-slate-200 outline-none focus:ring-1 focus:ring-slate-400 w-full sm:w-auto" aria-label="Sort courses">
          <option value="recent">Sort by: Recent</option>
          <option value="name">Sort by: Name</option>
          <option value="progress">Sort by: Progress</option>
        </select>
      </div>

      {viewMode === "grid" ? (
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {filteredCourses.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-900 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:-translate-y-0.5 hover:shadow-md transition-all group overflow-hidden flex flex-col"
          >
            <Link
              to={`/courses/${course.id}`}
              className={cn("block h-full", FOCUS_RING)}
            >
              <div className="h-36 relative overflow-hidden bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950/55 to-transparent" />
                <div className="absolute left-4 bottom-3 right-4">
                  <p className="text-[10px] font-black uppercase tracking-wide text-white/80">{course.code}</p>
                  <h3 className="text-base font-bold text-white leading-tight">
                    {course.title}
                  </h3>
                </div>
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <div className="text-xs text-slate-500 flex items-center gap-1.5">
                    <div className="w-7 h-7 rounded-full bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-[10px] font-bold flex-shrink-0">
                      {course.instructor.charAt(0)}
                    </div>
                    <div>
                      <p className="font-bold text-slate-700 dark:text-slate-200">{course.instructor}</p>
                      <p className="text-[10px] text-slate-400">Instructor</p>
                    </div>
                  </div>
                  <button type="button" className={cn("p-1 hover:bg-slate-50 rounded text-slate-300 hover:text-slate-500 transition-colors", FOCUS_RING)} aria-label={`More options for ${course.title}`}>
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-2 flex-1">
                  <div className="space-y-1">
                    <div className="flex justify-between text-[10px] font-semibold text-slate-500 uppercase">
                      <span>Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <motion.div
                        initial={{ width: 0 }}
                        whileInView={{
                          width: `${course.progress}%`,
                        }}
                        transition={{ duration: 1, delay: 0.2 }}
                        viewport={{ once: true }}
                        className={cn(
                          "h-full rounded-full",
                          course.color,
                        )}
                      />
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-2 border-t border-slate-100">
                    <div className="flex items-center gap-2 text-xs text-slate-500 font-medium">
                      <span className="flex items-center gap-0.5">
                        <BookOpen className="w-3 h-3" /> {course.lessons}
                      </span>
                      <span className="flex items-center gap-0.5">
                        <Users className="w-3 h-3" /> {course.students}
                      </span>
                    </div>
                    <div className="flex min-w-0 max-w-[55%] items-center gap-1 text-xs font-bold text-slate-700 dark:text-slate-200">
                      <ClipboardList className="w-3 h-3" />
                      <span className="truncate">{course.assignments[0]?.title ?? "No upcoming work"}</span>
                    </div>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
      ) : (
        <div className="space-y-3">
          {filteredCourses.map((course, index) => (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.03 }}
            >
              <Link
                to={`/courses/${course.id}`}
                className={cn("flex flex-col gap-4 rounded-lg border border-slate-200 bg-white p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:shadow-md dark:border-slate-700 dark:bg-slate-900 md:flex-row md:items-center", FOCUS_RING)}
              >
                <img src={course.image} alt={course.title} className="h-24 w-full rounded object-cover md:w-36" />
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{course.code}</p>
                  <h3 className="text-lg font-bold text-slate-900 dark:text-white">{course.title}</h3>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{course.instructor}</p>
                  <p className="mt-2 truncate text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Next: {course.assignments[0]?.title ?? "No upcoming work"}
                  </p>
                </div>
                <div className="min-w-[160px]">
                  <div className="mb-2 flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400">
                    <span>Progress</span>
                    <span>{course.progress}%</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-800">
                    <div className={cn("h-full rounded-full", course.color)} style={{ width: `${course.progress}%` }} />
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      )}
      {filteredCourses.length === 0 && (
        <div className="rounded border border-slate-200 bg-white p-8 text-center text-sm text-slate-500 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-400">
          No courses match your search.
        </div>
      )}
    </div>
  );
}
