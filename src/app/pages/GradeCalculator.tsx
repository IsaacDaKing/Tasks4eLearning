import { useState } from "react";
import { Plus, X, TrendingUp, Calculator, Save, Trash2, Edit2 } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface Assignment {
  id: string;
  name: string;
  weight: number;
  currentScore: number | null;
  projectedScore: number | null;
}

interface Course {
  id: string;
  name: string;
  code: string;
  credits: number;
  assignments: Assignment[];
}

const INITIAL_COURSES: Course[] = [
  {
    id: "cs-301",
    name: "React Development",
    code: "CS 301",
    credits: 4,
    assignments: [
      { id: "a1", name: "Midterm Exam", weight: 30, currentScore: 88, projectedScore: null },
      { id: "a2", name: "Final Project", weight: 40, currentScore: null, projectedScore: 90 },
      { id: "a3", name: "Assignments", weight: 30, currentScore: 92, projectedScore: null },
    ],
  },
  {
    id: "cs-401",
    name: "Database Systems",
    code: "CS 401",
    credits: 3,
    assignments: [
      { id: "a4", name: "Quizzes", weight: 20, currentScore: 85, projectedScore: null },
      { id: "a5", name: "Final Exam", weight: 50, currentScore: null, projectedScore: 88 },
      { id: "a6", name: "Lab Work", weight: 30, currentScore: 90, projectedScore: null },
    ],
  },
];

export function GradeCalculator() {
  const [courses, setCourses] = useState<Course[]>(INITIAL_COURSES);
  const [simulationMode, setSimulationMode] = useState(true);

  const calculateCourseGrade = (course: Course): number => {
    let totalWeight = 0;
    let weightedScore = 0;

    course.assignments.forEach((assignment) => {
      const score = simulationMode && assignment.projectedScore !== null
        ? assignment.projectedScore
        : assignment.currentScore;

      if (score !== null) {
        weightedScore += (score * assignment.weight) / 100;
        totalWeight += assignment.weight;
      }
    });

    return totalWeight > 0 ? (weightedScore / totalWeight) * 100 : 0;
  };

  const calculateGPA = (): number => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const grade = calculateCourseGrade(course);
      let gradePoint = 0;

      if (grade >= 93) gradePoint = 4.0;
      else if (grade >= 90) gradePoint = 3.7;
      else if (grade >= 87) gradePoint = 3.3;
      else if (grade >= 83) gradePoint = 3.0;
      else if (grade >= 80) gradePoint = 2.7;
      else if (grade >= 77) gradePoint = 2.3;
      else if (grade >= 73) gradePoint = 2.0;
      else if (grade >= 70) gradePoint = 1.7;
      else if (grade >= 67) gradePoint = 1.3;
      else if (grade >= 65) gradePoint = 1.0;
      else gradePoint = 0.0;

      totalPoints += gradePoint * course.credits;
      totalCredits += course.credits;
    });

    return totalCredits > 0 ? totalPoints / totalCredits : 0;
  };

  const getLetterGrade = (score: number): string => {
    if (score >= 93) return "A";
    if (score >= 90) return "A-";
    if (score >= 87) return "B+";
    if (score >= 83) return "B";
    if (score >= 80) return "B-";
    if (score >= 77) return "C+";
    if (score >= 73) return "C";
    if (score >= 70) return "C-";
    if (score >= 67) return "D+";
    if (score >= 65) return "D";
    return "F";
  };

  const updateAssignment = (courseId: string, assignmentId: string, field: keyof Assignment, value: any) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            assignments: course.assignments.map(assignment =>
              assignment.id === assignmentId
                ? { ...assignment, [field]: value }
                : assignment
            ),
          }
        : course
    ));
  };

  const addAssignment = (courseId: string) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            assignments: [
              ...course.assignments,
              {
                id: `a-${Date.now()}`,
                name: "New Assignment",
                weight: 0,
                currentScore: null,
                projectedScore: null,
              },
            ],
          }
        : course
    ));
  };

  const removeAssignment = (courseId: string, assignmentId: string) => {
    setCourses(courses.map(course =>
      course.id === courseId
        ? {
            ...course,
            assignments: course.assignments.filter(a => a.id !== assignmentId),
          }
        : course
    ));
  };

  return (
    <div className="p-8 space-y-8 max-w-[1800px] mx-auto animate-in fade-in duration-500 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Calculator className="w-8 h-8 text-blue-600" />
            Grade Calculator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Calculate your current and projected course grades and GPA
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setSimulationMode(!simulationMode)}
            className={cn(
              "px-6 py-2.5 rounded-xl text-sm font-bold transition-all shadow-sm",
              simulationMode
                ? "bg-blue-600 text-white shadow-blue-200"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300"
            )}
          >
            {simulationMode ? "Simulation Mode: ON" : "Simulation Mode: OFF"}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-gradient-to-br from-blue-600 to-blue-700 p-6 rounded-2xl shadow-xl text-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm font-bold opacity-90">Projected GPA</p>
          </div>
          <h3 className="text-5xl font-black">{calculateGPA().toFixed(2)}</h3>
          <p className="text-xs opacity-75 mt-2">Based on {simulationMode ? "projected" : "current"} scores</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Total Credits</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">
            {courses.reduce((sum, course) => sum + course.credits, 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">Across {courses.length} courses</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 p-6 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">Average Grade</p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">
            {(courses.reduce((sum, course) => sum + calculateCourseGrade(course), 0) / courses.length).toFixed(1)}%
          </h3>
          <p className="text-xs text-slate-400 mt-2">Overall performance</p>
        </motion.div>
      </div>

      <div className="space-y-6">
        {courses.map((course, i) => {
          const courseGrade = calculateCourseGrade(course);
          const letterGrade = getLetterGrade(courseGrade);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">{course.name}</h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">{course.code} • {course.credits} Credits</p>
                  </div>
                  <div className="text-right">
                    <div className="text-4xl font-black text-blue-600">{letterGrade}</div>
                    <div className="text-sm text-slate-500 dark:text-slate-400 font-bold">{courseGrade.toFixed(1)}%</div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                    <div className="col-span-4">Assignment Name</div>
                    <div className="col-span-2">Weight</div>
                    <div className="col-span-2">Current</div>
                    <div className="col-span-2">Projected</div>
                    <div className="col-span-2">Actions</div>
                  </div>

                  {course.assignments.map((assignment) => (
                    <div key={assignment.id} className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={assignment.name}
                          onChange={(e) => updateAssignment(course.id, assignment.id, 'name', e.target.value)}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={assignment.weight}
                          onChange={(e) => updateAssignment(course.id, assignment.id, 'weight', Number(e.target.value))}
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={assignment.currentScore ?? ''}
                          onChange={(e) => updateAssignment(course.id, assignment.id, 'currentScore', e.target.value ? Number(e.target.value) : null)}
                          placeholder="-"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={assignment.projectedScore ?? ''}
                          onChange={(e) => updateAssignment(course.id, assignment.id, 'projectedScore', e.target.value ? Number(e.target.value) : null)}
                          placeholder="-"
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-bold text-center text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <button
                          onClick={() => removeAssignment(course.id, assignment.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    onClick={() => addAssignment(course.id)}
                    className="w-full py-3 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-400 dark:text-slate-500 hover:border-blue-300 dark:hover:border-blue-600 hover:text-blue-600 dark:hover:text-blue-400 hover:bg-blue-50 dark:hover:bg-blue-900/20 transition-all flex items-center justify-center gap-2"
                  >
                    <Plus className="w-4 h-4" /> Add Assignment
                  </button>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </div>
  );
}
