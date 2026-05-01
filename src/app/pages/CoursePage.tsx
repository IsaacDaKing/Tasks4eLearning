import { Link, useParams } from "react-router";
import { BookOpen, Clock, Users, ChevronRight, LayoutDashboard } from "lucide-react";
import { getCourseById } from "../data/courses";

export function CoursePage() {
  const params = useParams();
  const courseId = params.courseId ?? "";
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="p-8 h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
          Course not found
        </h1>
        <p className="text-slate-500 dark:text-slate-400 mb-6 max-w-xl">
          The course you are looking for does not exist or the link is incorrect. Return to the course catalogue to continue.
        </p>
        <Link
          to="/courses"
          className="px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-8 animate-in fade-in duration-500 dark:bg-slate-900">
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 mb-8">
        <div className="flex flex-col xl:flex-row xl:items-end xl:justify-between gap-6">
          <div>
            <div className="flex items-center gap-3 mb-4">
              <span className={`inline-flex items-center justify-center w-12 h-12 rounded-2xl text-white ${course.color}`}>
                {course.code.split(" ")[0]}
              </span>
              <div>
                <p className="text-sm font-bold uppercase tracking-[0.3em] text-slate-400">
                  Course Overview
                </p>
                <h1 className="text-4xl font-black text-slate-900 dark:text-white">
                  {course.title}
                </h1>
              </div>
            </div>

            <p className="text-slate-600 dark:text-slate-300 max-w-2xl">
              {course.code} · {course.instructor}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-4 w-full xl:w-auto">
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Progress</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{course.progress}%</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Lessons</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{course.lessons}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-4 text-center">
              <p className="text-xs uppercase tracking-[0.3em] text-slate-400">Students</p>
              <p className="text-2xl font-black text-slate-900 dark:text-white">{course.students}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mt-8">
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              Instructor
            </h2>
            <p className="text-slate-900 dark:text-white font-semibold">{course.instructor}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              Section
            </h2>
            <p className="text-slate-900 dark:text-white font-semibold">{course.code}</p>
          </div>
          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6">
            <h2 className="text-sm font-black uppercase tracking-[0.3em] text-slate-400 mb-3">
              Current Grade
            </h2>
            <p className="text-slate-900 dark:text-white font-semibold">{course.grade}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
            <div className="flex items-center justify-between mb-6">
              <div>
                <h2 className="text-2xl font-black text-slate-900 dark:text-white">
                  Assignments & assessments
                </h2>
                <p className="text-sm text-slate-500 dark:text-slate-400">
                  Open any item below to view the full details and submit your work.
                </p>
              </div>
              <Link
                to="/courses"
                className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
              >
                Back to catalog
              </Link>
            </div>

            <div className="space-y-4">
              {course.assignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/courses/${course.id}/assignments/${assignment.id}`}
                  className="block rounded-3xl border border-slate-200 dark:border-slate-700 p-6 hover:bg-slate-50 dark:hover:bg-slate-900 transition-all"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.3em] text-slate-400">
                        {assignment.type}
                      </p>
                      <h3 className="text-xl font-black text-slate-900 dark:text-white">
                        {assignment.title}
                      </h3>
                      <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">
                        {assignment.moduleTitle}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-bold text-slate-900 dark:text-white">
                        Due {assignment.dueDate}
                      </p>
                      <div className="inline-flex items-center gap-2 mt-3 px-3 py-2 rounded-2xl bg-slate-50 dark:bg-slate-900 text-slate-600 dark:text-slate-300 text-xs font-bold">
                        View details <ChevronRight className="w-3.5 h-3.5" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <div className="flex items-center gap-3 mb-4">
              <LayoutDashboard className="w-5 h-5 text-blue-600" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                Course summary
              </h3>
            </div>
            <div className="space-y-3 text-sm text-slate-600 dark:text-slate-400">
              <div className="flex items-center justify-between">
                <span>Course code</span>
                <span className="font-semibold text-slate-900 dark:text-white">{course.code}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Instructor</span>
                <span className="font-semibold text-slate-900 dark:text-white">{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Lessons</span>
                <span className="font-semibold text-slate-900 dark:text-white">{course.lessons}</span>
              </div>
              <div className="flex items-center justify-between">
                <span>Students</span>
                <span className="font-semibold text-slate-900 dark:text-white">{course.students}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 dark:bg-slate-900 rounded-3xl p-6 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center gap-3 mb-4">
              <BookOpen className="w-5 h-5 text-emerald-600" />
              <h3 className="text-lg font-black text-slate-900 dark:text-white">
                What to do next
              </h3>
            </div>
            <ul className="space-y-3 text-slate-600 dark:text-slate-400">
              <li className="flex items-start gap-3">
                <span className="mt-1 text-emerald-600">•</span>
                <span>Open the next assignment and submit before the due date.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-emerald-600">•</span>
                <span>Review instructor feedback once your submissions are graded.</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="mt-1 text-emerald-600">•</span>
                <span>Track your progress in the weekly dashboard overview.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
