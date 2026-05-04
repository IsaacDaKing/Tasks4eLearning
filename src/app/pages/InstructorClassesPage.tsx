import { useState } from "react";
import { useNavigate } from "react-router";
import { BookOpen, Users, Calendar, BarChart3 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

const instructorClasses = [
  { 
    id: "cs3354-001", 
    name: "CS 3354.001 - Software Engineering", 
    semester: "Spring 2026", 
    students: 28, 
    modules: 8,
    avgGrade: "82%"
  },
  { 
    id: "cs3354-002", 
    name: "CS 3354.002 - Software Engineering", 
    semester: "Spring 2026", 
    students: 31, 
    modules: 8,
    avgGrade: "79%"
  },
  { 
    id: "cs2340-001", 
    name: "CS 2340 - Advanced Software Design", 
    semester: "Spring 2026", 
    students: 24, 
    modules: 10,
    avgGrade: "85%"
  },
];

export function InstructorClassesPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-full bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl">
        <section className="mb-8">
          <div>
            <p className="text-xs font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">
              Teaching Hub
            </p>
            <h1 className="mt-2 text-3xl font-black tracking-tight text-slate-950 dark:text-white">
              My Classes
            </h1>
            <p className="mt-2 text-slate-600 dark:text-slate-400">
              Select a class to manage grades, modules, and launch instructor features.
            </p>
          </div>
        </section>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {instructorClasses.map((course) => (
            <button
              key={course.id}
              onClick={() => navigate(`/instructor-course/${course.id}`)}
              className={cn(
                "group relative overflow-hidden rounded-lg border border-slate-200 bg-white p-6 text-left shadow-sm transition-all hover:shadow-md dark:border-slate-800 dark:bg-slate-900",
                "hover:border-orange-300 dark:hover:border-orange-700",
                FOCUS_RING
              )}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-orange-50 to-transparent opacity-0 transition-opacity group-hover:opacity-100 dark:from-orange-950/20" />
              
              <div className="relative">
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300">
                  <BookOpen className="h-5 w-5" />
                </div>

                <h3 className="text-lg font-black text-slate-950 dark:text-white">
                  {course.name}
                </h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                  {course.semester}
                </p>

                <div className="mt-5 grid grid-cols-3 gap-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Students</p>
                    <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{course.students}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Modules</p>
                    <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{course.modules}</p>
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">Avg Grade</p>
                    <p className="mt-1 text-lg font-black text-slate-900 dark:text-white">{course.avgGrade}</p>
                  </div>
                </div>
              </div>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
