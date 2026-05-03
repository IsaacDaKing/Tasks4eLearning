import { useState, useRef } from "react";
import { Link, useParams } from "react-router";
import {
  Upload,
  File,
  X,
  CheckCircle,
  Clock,
  AlertCircle,
  Calendar as CalendarIcon,
  Users,
  FileText,
  Download,
  BookOpen,
  Timer,
  RotateCcw,
  ChevronRight,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { COURSES, getCourseById, getAssignmentById, type AssessmentType } from "../data/courses";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_FILE_SIZE_MB = 25;

function parseDueDate(dueDate: string) {
  return new Date(dueDate.replace(" at ", " "));
}

function displayType(type: AssessmentType) {
  return type === "Exam" ? "Test" : type;
}

function getAssignmentStatus(assignmentId: string) {
  return assignmentId === "4" ? "Submitted" : "Not Submitted";
}

const ALL_ASSIGNMENTS = COURSES.flatMap((course) =>
  course.assignments.map((assignment) => ({
    ...assignment,
    courseId: course.id,
    courseTitle: course.title,
    courseCode: course.code,
    dueDateValue: parseDueDate(assignment.dueDate).getTime(),
    status: getAssignmentStatus(assignment.id),
  })),
).sort((a, b) => a.dueDateValue - b.dueDateValue);

export function AssignmentPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const params = useParams();
  const courseId = params.courseId ?? null;
  const assignmentId = params.assignmentId ?? null;
  const course = courseId ? getCourseById(courseId) : null;
  const assignment = assignmentId && course ? getAssignmentById(course.id, assignmentId) : null;

  if (!courseId && !assignmentId) {
    return (
      <div className="p-4 sm:p-8 max-w-[1200px] mx-auto animate-in fade-in duration-500 bg-slate-100 dark:bg-slate-950 min-h-full">
        <div className="mb-6">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white">Assignments</h1>
          <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
            All assignments, quizzes, and tests across your courses, sorted by due date.
          </p>
        </div>

        <div className="overflow-hidden rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 shadow-sm">
          <div className="grid grid-cols-[minmax(0,1.4fr)_minmax(180px,0.9fr)_minmax(190px,0.9fr)_130px_40px] gap-4 border-b border-slate-200 dark:border-slate-700 px-4 py-3 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400 max-lg:hidden">
            <span>Title</span>
            <span>Course</span>
            <span>Due Date</span>
            <span>Status</span>
            <span />
          </div>

          <div className="divide-y divide-slate-200 dark:divide-slate-700">
            {ALL_ASSIGNMENTS.map((item) => (
              <Link
                key={`${item.courseId}-${item.id}`}
                to={`/courses/${item.courseId}/assignments/${item.id}`}
                className="grid gap-3 px-4 py-4 transition-colors hover:bg-slate-50 dark:hover:bg-slate-900/60 lg:grid-cols-[minmax(0,1.4fr)_minmax(180px,0.9fr)_minmax(190px,0.9fr)_130px_40px] lg:items-center"
              >
                <div className="min-w-0">
                  <div className="mb-1 flex flex-wrap items-center gap-2">
                    <span className="rounded bg-slate-100 dark:bg-slate-700 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600 dark:text-slate-300">
                      {displayType(item.type)}
                    </span>
                  </div>
                  <h2 className="truncate text-base font-bold text-slate-900 dark:text-white">{item.title}</h2>
                </div>
                <div>
                  <p className="text-sm font-bold text-slate-900 dark:text-white">{item.courseCode}</p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{item.courseTitle}</p>
                </div>
                <p className="text-sm font-semibold text-slate-700 dark:text-slate-300">{item.dueDate}</p>
                <span
                  className={cn(
                    "w-fit rounded px-2.5 py-1 text-xs font-black uppercase tracking-wide",
                    item.status === "Submitted"
                      ? "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300"
                      : "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300",
                  )}
                >
                  {item.status}
                </span>
                <ChevronRight className="hidden h-4 w-4 text-slate-400 lg:block" />
              </Link>
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (!course || !assignment) {
    return (
      <div className="p-8 max-w-[900px] mx-auto h-full flex flex-col items-center justify-center text-center animate-in fade-in duration-500 bg-slate-100 dark:bg-slate-950">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-10">
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-4">
            Assignment not found
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mb-6">
            Select an assignment from the assignments list, course page, or calendar to open the correct submission workflow.
          </p>
          <Link
            to="/assignment"
            className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all"
          >
            Browse Assignments
          </Link>
        </div>
      </div>
    );
  }

  const assignmentExperience = {
    courseCode: assignment.classSection,
    courseName: course.title,
    moduleTitle: assignment.moduleTitle,
    assignmentTitle: assignment.title,
    dueDate: assignment.dueDate,
    className: assignment.classSection,
    type: displayType(assignment.type),
    timeLimit: null as number | null,
    attempts: 3,
  };

  const validateFile = (file: File): boolean => {
    const sizeMB = file.size / 1024 / 1024;
    if (sizeMB > MAX_FILE_SIZE_MB) {
      setFileSizeError(`File size exceeds limit of ${MAX_FILE_SIZE_MB}MB. Your file is ${sizeMB.toFixed(1)}MB.`);
      return false;
    }
    setFileSizeError(null);
    return true;
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files.length > 0 && validateFile(files[0])) {
      setUploadedFile(files[0]);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0 && validateFile(files[0])) {
      setUploadedFile(files[0]);
    }
    // Reset input so same file can be re-selected after removal
    e.target.value = "";
  };

  const handleSubmit = () => {
    if (uploadedFile) {
      alert("Assignment submitted successfully!");
    }
  };

  return (
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500 bg-slate-100 dark:bg-slate-950 min-h-full">
      {/* FR-55: Course Code + Name prominently at top */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-xl text-white mb-8">
        <div className="flex items-center gap-2 text-sm font-bold mb-1 opacity-90">
          <FileText className="w-4 h-4" />
          {/* FR-55 */}
          <span>{assignmentExperience.courseCode} - {assignmentExperience.courseName}</span>
        </div>
        {/* FR-56: Module title as primary heading */}
        <p className="text-white/70 text-sm font-semibold mb-2">{assignmentExperience.moduleTitle}</p>
        <h1 className="text-4xl font-black mb-4">{assignmentExperience.assignmentTitle}</h1>

        {/* FR-57: Due Date + Class in distinct header section */}
        <div className="flex flex-wrap items-center gap-6 text-sm bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <div>
              <span className="text-white/60 text-xs uppercase tracking-wider font-bold block">Due Date</span>
              <span className="font-bold">{assignmentExperience.dueDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <div>
              <span className="text-white/60 text-xs uppercase tracking-wider font-bold block">Class</span>
              <span className="font-bold">{assignmentExperience.className}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Users className="w-4 h-4" />
            <span className="font-bold">Individual Assignment</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4" />
            <span className="font-bold">3 days remaining</span>
          </div>
        </div>

        {/* FR-61: Assessment type label */}
        <div className="mt-4 flex flex-wrap gap-3">
          <span className={cn(
            "px-3 py-1 rounded-full text-xs font-black uppercase tracking-widest",
            assignmentExperience.type === "Quiz" ? "bg-yellow-400 text-yellow-900" :
            assignmentExperience.type === "Test" ? "bg-red-400 text-red-900" :
            "bg-white/20 text-white"
          )}>
            {assignmentExperience.type}
          </span>
          {/* FR-62: Time limit and attempts */}
          {assignmentExperience.timeLimit && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-white/20">
              <Timer className="w-3 h-3" /> {assignmentExperience.timeLimit} min limit
            </span>
          )}
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-white/20">
            <RotateCcw className="w-3 h-3" /> {assignmentExperience.attempts} attempt{assignmentExperience.attempts !== 1 ? "s" : ""} allowed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Assignment Instructions</h2>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {assignment.description}
              </p>
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                {assignment.notes}
              </p>

              {/* FR-59: Requirements subsection */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg my-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-black text-amber-900 dark:text-amber-300 text-sm mb-1">Requirements</h3>
                    <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-1 list-disc list-inside">
                      <li>Read the module materials before starting.</li>
                      <li>Include clear evidence for each answer or design choice.</li>
                      <li>Submit only your own work.</li>
                      <li>Accepted upload formats: PDF, DOC, or DOCX.</li>
                      <li>Maximum upload size: {MAX_FILE_SIZE_MB}MB.</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="font-black text-slate-900 dark:text-white text-lg mt-8">Submission Checklist</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Review:</strong> Confirm your response matches the instructions above.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Format:</strong> Use an accepted file type and keep the file under {MAX_FILE_SIZE_MB}MB.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Details:</strong> Include your name, course, and assignment title in the document.</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Submit:</strong> Upload your file and confirm the status changes after submission.</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Submit Your Work</h2>

            {/* NFR-28: File size validation error */}
            {fileSizeError && (
              <div className="mb-4 flex items-center gap-3 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-bold">
                <AlertCircle className="w-5 h-5 flex-shrink-0" />
                {fileSizeError}
              </div>
            )}

            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={cn(
                "border-2 border-dashed rounded-xl p-12 text-center transition-all",
                isDragging
                  ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20"
                  : uploadedFile
                  ? "border-green-300 bg-green-50 dark:bg-green-900/20"
                  : "border-slate-300 dark:border-slate-600 bg-slate-50 dark:bg-slate-900/50 hover:border-blue-400 hover:bg-blue-50/50 dark:hover:bg-blue-900/10"
              )}
            >
              {uploadedFile ? (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto">
                    <File className="w-8 h-8 text-green-600 dark:text-green-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white">{uploadedFile.name}</p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">
                      {(uploadedFile.size / 1024 / 1024).toFixed(2)} MB
                    </p>
                  </div>
                  <button
                    onClick={() => setUploadedFile(null)}
                    className="text-red-500 hover:text-red-600 text-sm font-bold flex items-center gap-2 mx-auto"
                  >
                    <X className="w-4 h-4" /> Remove file
                  </button>
                </div>
              ) : (
                <div className="space-y-4">
                  <div className="w-16 h-16 bg-blue-100 dark:bg-blue-900/30 rounded-full flex items-center justify-center mx-auto">
                    <Upload className="w-8 h-8 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 dark:text-white mb-1">
                      Drag and drop your file here
                    </p>
                    <p className="text-sm text-slate-500 dark:text-slate-400">or</p>
                  </div>
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50"
                  >
                    Browse Files
                  </button>
                  <p className="text-xs text-slate-400 dark:text-slate-500">Accepted formats: PDF, DOC, DOCX (Max {MAX_FILE_SIZE_MB}MB)</p>
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                onChange={handleFileSelect}
                accept=".pdf,.doc,.docx"
                className="hidden"
              />
            </div>

            {/* FR-60: Submit button disabled until file attached */}
            <div className="mt-6 flex items-center gap-4">
              <button
                onClick={handleSubmit}
                disabled={!uploadedFile}
                className={cn(
                  "flex-1 py-4 rounded-xl font-black text-lg transition-all shadow-lg",
                  uploadedFile
                    ? "bg-green-600 text-white hover:bg-green-700 shadow-green-200 dark:shadow-green-900/50 active:scale-95"
                    : "bg-slate-200 dark:bg-slate-700 text-slate-400 dark:text-slate-500 cursor-not-allowed"
                )}
              >
                Submit Assignment
              </button>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-4">Submission Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-amber-50 dark:bg-amber-900/20 rounded-lg">
                <span className="text-sm font-bold text-amber-900 dark:text-amber-300">Status</span>
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">{getAssignmentStatus(assignment.id)}</span>
              </div>
              {/* FR-62: Attempts shown */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Attempts</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">0 of {assignmentExperience.attempts}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Grade</span>
                <span className="text-sm font-black text-slate-400">-</span>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-4">Resources</h3>
            <div className="space-y-2">
              {[
                { label: "Assignment Rubric", size: "PDF - 156 KB", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
                { label: "Submission Guide", size: "PDF - 2.4 MB", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
                { label: "Sample Response", size: "PDF - 892 KB", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
              ].map((res) => (
                <a
                  key={res.label}
                  href="#"
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", res.color)}>
                    <FileText className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-bold text-slate-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400">{res.label}</p>
                    <p className="text-xs text-slate-500 dark:text-slate-400">{res.size}</p>
                  </div>
                  <Download className="w-4 h-4 text-slate-400" />
                </a>
              ))}
            </div>
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <div className="flex items-start gap-3 mb-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0">
                <AlertCircle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="font-black text-blue-900 dark:text-blue-300 mb-2">Need Help?</h3>
                <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed">
                  Office hours are every Tuesday and Thursday, 2-4 PM. You can also email Prof. Johnson for questions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
