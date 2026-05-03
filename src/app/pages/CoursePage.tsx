import { Link, useParams } from "react-router";
import { BookOpen, Clock, Users, ChevronRight, LayoutDashboard } from "lucide-react";
import { getCourseById } from "../data/courses";

export function CoursePage() {
  const params = useParams();
  const courseId = params.courseId ?? "";
  const course = getCourseById(courseId);

  if (!course) {
    return (
      <div className="p-6 h-full flex flex-col items-center justify-center text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">
          Course not found
        </h1>
        <p className="text-slate-600 mb-6 max-w-md text-sm">
          The course you are looking for does not exist or the link is incorrect. Return to the course catalogue to continue.
        </p>
        <Link
          to="/courses"
          className="px-4 py-2 bg-slate-800 text-white rounded font-medium hover:bg-slate-900 transition-colors text-sm"
        >
          Back to Courses
        </Link>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-[1500px] mx-auto animate-in fade-in duration-500">
      <div className="bg-white rounded-lg border border-slate-200 shadow-sm p-6 mb-6">
        <div className="flex flex-col xl:flex-row xl:items-center xl:justify-between gap-5">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <span className={`inline-flex items-center justify-center w-8 h-8 rounded text-white text-xs font-bold ${course.color}`}>
                {course.code.split(" ")[0].charAt(0)}
              </span>
              <div>
                <p className="text-xs font-semibold uppercase text-slate-500">
                  Course Overview
                </p>
                <h1 className="text-3xl font-bold text-slate-900">
                  {course.title}
                </h1>
              </div>
            </div>

            <p className="text-sm text-slate-600">
              {course.code} · {course.instructor}
            </p>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-50 rounded p-3 text-center">
              <p className="text-xs font-semibold text-slate-600 uppercase">Progress</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{course.progress}%</p>
            </div>
            <div className="bg-slate-50 rounded p-3 text-center">
              <p className="text-xs font-semibold text-slate-600 uppercase">Lessons</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{course.lessons}</p>
            </div>
            <div className="bg-slate-50 rounded p-3 text-center">
              <p className="text-xs font-semibold text-slate-600 uppercase">Students</p>
              <p className="text-xl font-bold text-slate-900 mt-1">{course.students}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded p-4">
            <h2 className="text-xs font-semibold text-slate-600 uppercase mb-2">
              Instructor
            </h2>
            <p className="text-slate-900 font-medium text-sm">{course.instructor}</p>
          </div>
          <div className="bg-slate-50 rounded p-4">
            <h2 className="text-xs font-semibold text-slate-600 uppercase mb-2">
              Section
            </h2>
            <p className="text-slate-900 font-medium text-sm">{course.code}</p>
          </div>
          <div className="bg-slate-50 rounded p-4">
            <h2 className="text-xs font-semibold text-slate-600 uppercase mb-2">
              Current Grade
            </h2>
            <p className="text-slate-900 font-medium text-sm">{course.grade}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded border border-slate-200 shadow-sm p-6">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-bold text-slate-900">
                  Assignments
                </h2>
                <p className="text-xs text-slate-600 mt-1">
                  Open any item below to view details and submit your work.
                </p>
              </div>
              <Link
                to="/courses"
                className="text-xs font-semibold text-slate-600 hover:text-slate-900"
              >
                Back to courses
              </Link>
            </div>

            <div className="space-y-2">
              {course.assignments.map((assignment) => (
                <Link
                  key={assignment.id}
                  to={`/courses/${course.id}/assignments/${assignment.id}`}
                  className="block rounded-lg border border-slate-200 p-4 hover:bg-slate-50 transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                >
                  <div className="flex items-center justify-between gap-4">
                    <div className="flex-1">
                      <p className="text-xs font-semibold text-slate-600 uppercase">
                        {assignment.type}
                      </p>
                      <h3 className="text-sm font-bold text-slate-900 mt-0.5">
                        {assignment.title}
                      </h3>
                      <p className="mt-1 text-xs text-slate-500">
                        {assignment.moduleTitle}
                      </p>
                    </div>
                    <div className="text-right flex-shrink-0">
                      <p className="text-xs font-medium text-slate-900">
                        Due {assignment.dueDate}
                      </p>
                      <div className="inline-flex items-center gap-1 mt-2 px-2 py-1 rounded bg-slate-100 text-slate-600 text-xs font-medium">
                        Open <ChevronRight className="w-3 h-3" />
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded border border-slate-200 shadow-sm p-4">
            <div className="flex items-center gap-2 mb-3">
              <LayoutDashboard className="w-4 h-4 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Summary
              </h3>
            </div>
            <div className="space-y-2 text-sm">
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Course code</span>
                <span className="font-medium text-slate-900">{course.code}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Instructor</span>
                <span className="font-medium text-slate-900">{course.instructor}</span>
              </div>
              <div className="flex items-center justify-between py-2 border-b border-slate-100">
                <span className="text-slate-600">Lessons</span>
                <span className="font-medium text-slate-900">{course.lessons}</span>
              </div>
              <div className="flex items-center justify-between py-2">
                <span className="text-slate-600">Students</span>
                <span className="font-medium text-slate-900">{course.students}</span>
              </div>
            </div>
          </div>

          <div className="bg-slate-50 rounded border border-slate-200 p-4">
            <div className="flex items-center gap-2 mb-3">
              <BookOpen className="w-4 h-4 text-slate-600" />
              <h3 className="text-lg font-bold text-slate-900">
                Next Steps
              </h3>
            </div>
            <ul className="space-y-2 text-xs text-slate-700">
              <li className="flex items-start gap-2">
                <span className="text-slate-400 mt-1">•</span>
                <span>Open the next assignment and submit before the due date.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 mt-1">•</span>
                <span>Review instructor feedback once your submissions are graded.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-slate-400 mt-1">•</span>
                <span>Track your progress in the dashboard.</span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}
