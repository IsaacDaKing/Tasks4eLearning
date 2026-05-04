import { useMemo, useState } from "react";
import {
  Plus,
  TrendingUp,
  Calculator,
  Trash2,
  RotateCcw,
  HelpCircle,
} from "lucide-react";
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
    id: "cs-4390",
    name: "Computer Networks",
    code: "CS 4390.0W1",
    credits: 3,
    assignments: [
      { id: "n1", name: "Network Protocol Analysis", weight: 35, currentScore: 85, projectedScore: null },
      { id: "n2", name: "Protocol Quiz", weight: 25, currentScore: null, projectedScore: 88 },
      { id: "n3", name: "Final Exam", weight: 40, currentScore: null, projectedScore: 90 },
    ],
  },
  {
    id: "cs-3354",
    name: "Software Engineering",
    code: "CS 3354.012",
    credits: 3,
    assignments: [
      {
        id: "a1",
        name: "Midterm Exam",
        weight: 30,
        currentScore: 88,
        projectedScore: null,
      },
      {
        id: "a2",
        name: "Final Project",
        weight: 40,
        currentScore: null,
        projectedScore: 90,
      },
      {
        id: "a3",
        name: "Assignments",
        weight: 30,
        currentScore: 92,
        projectedScore: null,
      },
    ],
  },
  {
    id: "cs-4347",
    name: "Database Systems",
    code: "CS 4347.002",
    credits: 3,
    assignments: [
      {
        id: "a4",
        name: "Quizzes",
        weight: 20,
        currentScore: 85,
        projectedScore: null,
      },
      {
        id: "a5",
        name: "Final Exam",
        weight: 50,
        currentScore: null,
        projectedScore: 88,
      },
      {
        id: "a6",
        name: "Lab Work",
        weight: 30,
        currentScore: 90,
        projectedScore: null,
      },
    ],
  },
  {
    id: "cs-4337",
    name: "Programming Language Paradigms",
    code: "CS 4337.005",
    credits: 3,
    assignments: [
      { id: "p1", name: "Functional Programming Quiz", weight: 30, currentScore: 84, projectedScore: null },
      { id: "p2", name: "Interpreter Project", weight: 40, currentScore: null, projectedScore: 87 },
      { id: "p3", name: "Final Exam", weight: 30, currentScore: null, projectedScore: 86 },
    ],
  },
  {
    id: "cs-4341",
    name: "Digital Logic and Computer Design",
    code: "CS 4341.003",
    credits: 3,
    assignments: [
      { id: "d1", name: "Logic Circuit Design Test", weight: 35, currentScore: 88, projectedScore: null },
      { id: "d2", name: "Sequential Circuits Lab", weight: 30, currentScore: null, projectedScore: 90 },
      { id: "d3", name: "Final Exam", weight: 35, currentScore: null, projectedScore: 87 },
    ],
  },
];

export function GradeCalculator() {
  const [courses, setCourses] =
    useState<Course[]>(INITIAL_COURSES);
  const [simulationMode, setSimulationMode] = useState(true);
  const [targetCourseId, setTargetCourseId] = useState(INITIAL_COURSES[0].id);
  const [targetGrade, setTargetGrade] = useState(90);

  const calculateCourseGrade = (course: Course, useProjection = simulationMode): number => {
    let totalWeight = 0;
    let weightedScore = 0;

    course.assignments.forEach((assignment) => {
      const score =
        useProjection && assignment.projectedScore !== null
          ? assignment.projectedScore
          : assignment.currentScore;

      if (score !== null) {
        weightedScore += (score * assignment.weight) / 100;
        totalWeight += assignment.weight;
      }
    });

    return totalWeight > 0
      ? (weightedScore / totalWeight) * 100
      : 0;
  };

  const calculateGPA = (useProjection = simulationMode): number => {
    let totalCredits = 0;
    let totalPoints = 0;

    courses.forEach((course) => {
      const grade = calculateCourseGrade(course, useProjection);
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

  const currentGpa = useMemo(() => calculateGPA(false), [courses]);
  const projectedGpa = useMemo(() => calculateGPA(true), [courses]);
  const projectedAverage = useMemo(
    () => courses.reduce((sum, course) => sum + calculateCourseGrade(course, true), 0) / courses.length,
    [courses],
  );

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

  const updateAssignment = (
    courseId: string,
    assignmentId: string,
    field: keyof Assignment,
    value: any,
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assignments: course.assignments.map(
                (assignment) =>
                  assignment.id === assignmentId
                    ? { ...assignment, [field]: value }
                    : assignment,
              ),
            }
          : course,
      ),
    );
  };

  const addAssignment = (courseId: string) => {
    setCourses(
      courses.map((course) =>
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
          : course,
      ),
    );
  };

  const removeAssignment = (
    courseId: string,
    assignmentId: string,
  ) => {
    setCourses(
      courses.map((course) =>
        course.id === courseId
          ? {
              ...course,
              assignments: course.assignments.filter(
                (a) => a.id !== assignmentId,
              ),
            }
          : course,
      ),
    );
  };

  const resetProjections = () => {
    setCourses(INITIAL_COURSES);
  };

  const selectedTargetCourse = courses.find((course) => course.id === targetCourseId) ?? courses[0];
  const targetHelper = selectedTargetCourse ? calculateNeededScore(selectedTargetCourse, targetGrade) : null;

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1500px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Calculator className="w-6 h-6 text-blue-600" />
            Grade Calculator
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Simulation mode lets you test future assignment scores without changing saved grades.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => setSimulationMode(!simulationMode)}
            className={cn(
              "px-4 py-2 rounded text-sm font-bold transition-all shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2",
              simulationMode
                ? "bg-blue-600 text-white shadow-blue-200"
                : "bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300",
            )}
          >
            {simulationMode
              ? "Simulation Mode: ON"
              : "Simulation Mode: OFF"}
          </button>
          <button
            type="button"
            onClick={resetProjections}
            className={cn("inline-flex items-center gap-2 rounded border border-slate-200 bg-white px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700")}
          >
            <RotateCcw className="h-4 w-4" />
            Reset projections
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-slate-800 p-5 rounded-lg shadow-sm text-white"
        >
          <div className="flex items-center gap-3 mb-2">
            <TrendingUp className="w-5 h-5" />
            <p className="text-sm font-bold opacity-90">
              Current GPA
            </p>
          </div>
          <h3 className="text-4xl font-black">
            {currentGpa.toFixed(2)}
          </h3>
          <p className="text-xs opacity-75 mt-2">
            Uses only saved/current scores
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-blue-600 p-5 rounded-lg border border-blue-500 shadow-sm text-white"
        >
          <p className="text-sm font-bold text-blue-100 mb-2">
            Projected GPA
          </p>
          <h3 className="text-4xl font-black">
            {projectedGpa.toFixed(2)}
          </h3>
          <p className="text-xs text-blue-100 mt-2">
            Uses projected scores where entered
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
            Projected Average
          </p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">
            {projectedAverage.toFixed(1)}
            %
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Across {courses.length} courses
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-white dark:bg-slate-800 p-5 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm"
        >
          <p className="text-sm font-bold text-slate-500 dark:text-slate-400 mb-2">
            Credits
          </p>
          <h3 className="text-4xl font-black text-slate-900 dark:text-white">
            {courses.reduce((sum, course) => sum + course.credits, 0)}
          </h3>
          <p className="text-xs text-slate-400 mt-2">
            Included in GPA calculation
          </p>
        </motion.div>
      </div>

      <section className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
        <div className="flex items-start gap-3">
          <HelpCircle className="mt-0.5 h-5 w-5 flex-shrink-0 text-blue-700 dark:text-blue-300" />
          <div className="flex-1">
            <h3 className="font-black text-blue-950 dark:text-blue-200">What score do I need?</h3>
            <p className="mt-1 text-sm text-blue-900 dark:text-blue-300">
              Choose a course and target grade. The helper estimates the average needed across ungraded/projected work.
            </p>
            <div className="mt-4 grid gap-3 md:grid-cols-[minmax(0,1fr)_160px_minmax(0,1fr)]">
              <label className="text-sm font-bold text-blue-950 dark:text-blue-200">
                Course
                <select value={targetCourseId} onChange={(event) => setTargetCourseId(event.target.value)} className="mt-2 w-full rounded border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-blue-800 dark:bg-slate-900 dark:text-white">
                  {courses.map((course) => (
                    <option key={course.id} value={course.id}>{course.name}</option>
                  ))}
                </select>
              </label>
              <label className="text-sm font-bold text-blue-950 dark:text-blue-200">
                Target %
                <input type="number" min="0" max="100" value={targetGrade} onChange={(event) => setTargetGrade(Number(event.target.value))} className="mt-2 w-full rounded border border-blue-200 bg-white px-3 py-2 text-sm text-slate-900 dark:border-blue-800 dark:bg-slate-900 dark:text-white" />
              </label>
              <div className="rounded border border-blue-200 bg-white p-3 text-sm dark:border-blue-800 dark:bg-slate-900">
                <p className="font-black text-slate-900 dark:text-white">
                  {targetHelper === null
                    ? "No remaining projected work"
                    : targetHelper > 100
                      ? `Need ${targetHelper.toFixed(1)}% average, which is above 100%.`
                      : `Need about ${targetHelper.toFixed(1)}% on remaining work.`}
                </p>
                <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">This is a planning estimate, not a saved grade change.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-6">
        {courses.map((course, i) => {
          const currentCourseGrade = calculateCourseGrade(course, false);
          const projectedCourseGrade = calculateCourseGrade(course, true);
          const courseGrade = simulationMode ? projectedCourseGrade : currentCourseGrade;
          const letterGrade = getLetterGrade(courseGrade);
          const weightTotal = course.assignments.reduce((sum, assignment) => sum + assignment.weight, 0);

          return (
            <motion.div
              key={course.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              className="bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden transition-all hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="p-6 border-b border-slate-100 dark:border-slate-700 bg-slate-50 dark:bg-slate-900/50">
                <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                  <div>
                    <h3 className="text-xl font-black text-slate-900 dark:text-white">
                      {course.name}
                    </h3>
                    <p className="text-sm text-slate-500 dark:text-slate-400 font-medium">
                      {course.code} • {course.credits} Credits
                    </p>
                    {weightTotal !== 100 && (
                      <p className="mt-2 rounded border border-amber-200 bg-amber-50 px-3 py-1.5 text-xs font-bold text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200">
                        Weights total {weightTotal}%, not 100%. Calculations normalize entered weights.
                      </p>
                    )}
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center sm:min-w-[360px]">
                    <div className="rounded bg-white p-3 dark:bg-slate-800">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">Current</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{currentCourseGrade.toFixed(1)}%</p>
                    </div>
                    <div className="rounded bg-white p-3 dark:bg-slate-800">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">Projected</p>
                      <p className="text-xl font-black text-blue-600 dark:text-blue-300">{projectedCourseGrade.toFixed(1)}%</p>
                    </div>
                    <div className="rounded bg-white p-3 dark:bg-slate-800">
                      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{simulationMode ? "Sim" : "Saved"}</p>
                      <p className="text-xl font-black text-slate-900 dark:text-white">{letterGrade}</p>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6">
                <div className="space-y-4">
                  <div className="grid grid-cols-12 gap-4 text-xs font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider px-2">
                    <div className="col-span-4">
                      Assignment Name
                    </div>
                    <div className="col-span-2">Weight</div>
                    <div className="col-span-2">Current</div>
                    <div className="col-span-2">Projected</div>
                    <div className="col-span-2">Actions</div>
                  </div>

                  {course.assignments.map((assignment) => (
                    <div
                      key={assignment.id}
                      className="grid grid-cols-12 gap-4 items-center p-3 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors"
                    >
                      <div className="col-span-4">
                        <input
                          type="text"
                          value={assignment.name}
                          onChange={(e) =>
                            updateAssignment(
                              course.id,
                              assignment.id,
                              "name",
                              e.target.value,
                            )
                          }
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-medium dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={assignment.weight}
                          onChange={(e) =>
                            updateAssignment(
                              course.id,
                              assignment.id,
                              "weight",
                              Number(e.target.value),
                            )
                          }
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={assignment.currentScore ?? ""}
                          onChange={(e) =>
                            updateAssignment(
                              course.id,
                              assignment.id,
                              "currentScore",
                              e.target.value
                                ? Number(e.target.value)
                                : null,
                            )
                          }
                          placeholder="-"
                          className="w-full px-3 py-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg text-sm font-bold text-center dark:text-white"
                        />
                      </div>
                      <div className="col-span-2">
                        <input
                          type="number"
                          value={
                            assignment.projectedScore ?? ""
                          }
                          onChange={(e) =>
                            updateAssignment(
                              course.id,
                              assignment.id,
                              "projectedScore",
                              e.target.value
                                ? Number(e.target.value)
                                : null,
                            )
                          }
                          placeholder="-"
                          className="w-full px-3 py-2 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg text-sm font-bold text-center text-blue-600 dark:text-blue-400"
                        />
                      </div>
                      <div className="col-span-2 flex gap-2">
                        <button
                          type="button"
                          onClick={() =>
                            removeAssignment(
                              course.id,
                              assignment.id,
                            )
                          }
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-lg transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}

                  <button
                    type="button"
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

function calculateNeededScore(course: Course, targetGrade: number) {
  let completedWeighted = 0;
  let remainingWeight = 0;

  course.assignments.forEach((assignment) => {
    if (assignment.currentScore !== null && assignment.projectedScore === null) {
      completedWeighted += (assignment.currentScore * assignment.weight) / 100;
      return;
    }
    remainingWeight += assignment.weight;
  });

  if (remainingWeight <= 0) return null;
  return ((targetGrade - completedWeighted) * 100) / remainingWeight;
}
