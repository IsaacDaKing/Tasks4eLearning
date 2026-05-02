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
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
            Your Courses
          </h2>
          <p className="text-sm text-slate-600 mt-1">
            Continue where you left off or start a new course.
          </p>
        </div>
        <div className="flex items-center gap-2 bg-white p-1 rounded border border-slate-200">
          <button className="p-1.5 bg-slate-100 rounded text-slate-700 border border-slate-200">
            <Grid2X2 className="w-4 h-4" />
          </button>
          <button className="p-1.5 text-slate-400 hover:text-slate-600 transition-colors">
            <List className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row items-center gap-3">
        <div className="flex-1 relative w-full">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search for courses, instructors..."
            className="w-full pl-9 pr-3 py-2 bg-white border border-slate-200 rounded text-sm outline-none focus:ring-1 focus:ring-slate-400 text-slate-900 placeholder-slate-500"
          />
        </div>
        <select className="px-3 py-2 bg-white border border-slate-200 rounded text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-slate-400 w-full sm:w-auto">
          <option>All Semesters</option>
          <option>Spring 2026</option>
          <option>Fall 2025</option>
        </select>
        <select className="px-3 py-2 bg-white border border-slate-200 rounded text-sm font-medium text-slate-700 outline-none focus:ring-1 focus:ring-slate-400 w-full sm:w-auto">
          <option>Sort by: Recent</option>
          <option>Sort by: Name</option>
          <option>Sort by: Progress</option>
        </select>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
        {COURSES.map((course, i) => (
          <motion.div
            key={course.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.05 }}
            className="bg-white rounded border border-slate-200 shadow-sm hover:shadow-md transition-all group overflow-hidden flex flex-col"
          >
            <Link
              to={`/courses/${course.id}`}
              className="block"
            >
              <div className="h-32 relative overflow-hidden bg-slate-100">
                <img
                  src={course.image}
                  alt={course.title}
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>

              <div className="p-4 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-semibold text-sm text-slate-900 group-hover:text-slate-700 transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <button className="p-0.5 hover:bg-slate-50 rounded text-slate-300 hover:text-slate-500 transition-colors">
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
                <div className="text-xs text-slate-500 mb-3 flex items-center gap-1.5">
                  <div className="w-5 h-5 rounded-full bg-slate-200 border border-slate-300 flex items-center justify-center text-[9px] font-bold flex-shrink-0">
                    {course.instructor.charAt(0)}
                  </div>
                  {course.instructor}
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