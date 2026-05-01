import {
  Search,
  Grid2X2,
  List,
  ChevronRight,
  Star,
  MoreVertical,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { Link } from "react-router";
import { COURSES } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function CoursesPage() {
  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-500 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white tracking-tight">
            Your Courses
          </h2>
          <p className="text-slate-500 dark:text-slate-400 font-medium">
            Continue where you left off or start a new course.
          </p>
        </div>
        <div className="flex items-center gap-3 bg-white dark:bg-slate-800 p-1 rounded-xl border border-slate-200 dark:border-slate-700">
          <button className="p-2 bg-slate-50 dark:bg-slate-700 rounded-lg text-blue-600 dark:text-blue-400 shadow-sm border border-slate-100 dark:border-slate-600">
            <Grid2X2 className="w-5 h-5" />
          </button>
          <button className="p-2 text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:hover:text-slate-300 transition-colors">
            <List className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-4">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for courses, instructors..."
            className="w-full pl-11 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm outline-none focus:ring-4 focus:ring-blue-100 dark:focus:ring-blue-900/50 transition-all dark:text-white"
          />
        </div>
        <select className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none w-full sm:w-auto">
          <option>All Semesters</option>
          <option>Spring 2026</option>
          <option>Fall 2025</option>
        </select>
        <select className="px-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-300 outline-none w-full sm:w-auto">
          <option>Sort by: Recent</option>
          <option>Sort by: Name</option>
          <option>Sort by: Progress</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-8">
        {COURSES.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-2xl hover:scale-[1.01] transition-all group overflow-hidden"
          >
            <Link
              to={`/courses/${course.id}`}
              className="block h-full"
            >
              <div className="h-48 relative overflow-hidden">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
              </div>

              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-black text-slate-900 dark:text-white leading-snug group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
                    {course.title}
                  </h3>
                  <button className="p-1 hover:bg-slate-50 dark:hover:bg-slate-700 rounded-lg text-slate-300 dark:text-slate-600 hover:text-slate-600 dark:hover:text-slate-400 transition-colors">
                    <MoreVertical className="w-5 h-5" />
                  </button>
                </div>
                <div className="text-sm font-medium text-slate-500 dark:text-slate-400 mb-6 flex items-center gap-2">
                  <div className="w-6 h-6 rounded-full bg-slate-100 dark:bg-slate-700 border border-slate-200 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold">
                    {course.instructor.charAt(0)}
                  </div>
                  {course.instructor}
                </div>

                <div className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span>Course Progress</span>
                      <span>{course.progress}%</span>
                    </div>
                    <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
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

                  <div className="flex items-center justify-between pt-4 border-t border-slate-50 dark:border-slate-700">
                    <div className="flex items-center gap-4 text-xs font-bold text-slate-400 dark:text-slate-500 uppercase tracking-widest">
                      <span className="flex items-center gap-1.5">
                        <BookOpen className="w-3.5 h-3.5" /> {course.lessons} Lessons
                      </span>
                      <span className="flex items-center gap-1.5">
                        <Users className="w-3.5 h-3.5" /> {course.students} Students
                      </span>
                    </div>
                    <span className="flex items-center gap-1 px-4 py-2 bg-slate-900 dark:bg-blue-600 text-white rounded-xl text-xs font-bold">
                      View Course <ChevronRight className="w-3 h-3" />
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          </motion.div>
        ))}
      </div>
    </div>
  );
}