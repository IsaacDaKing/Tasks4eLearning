import { useState, useRef } from "react";
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
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const MAX_FILE_SIZE_MB = 25;

export function AssignmentPage() {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [fileSizeError, setFileSizeError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Assignment metadata — FR-55, FR-56, FR-57, FR-61, FR-62
  const assignment = {
    courseCode: "ISNS 2359.0W1",
    courseName: "Earthquakes and Volcanoes",
    moduleTitle: "Module 3: Volcanic Activity",
    assignmentTitle: "Volcanic Hazard Assessment Research Paper",
    dueDate: "May 15, 2026 at 11:59 PM",
    class: "ISNS 2359.0W1 (Online)",
    type: "Assignment" as "Assignment" | "Quiz" | "Exam",
    timeLimit: null as number | null, // minutes, null = no limit
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
    <div className="p-8 max-w-[1400px] mx-auto animate-in fade-in duration-500 dark:bg-slate-900">
      {/* FR-55: Course Code + Name prominently at top */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-8 rounded-2xl shadow-xl text-white mb-8">
        <div className="flex items-center gap-2 text-sm font-bold mb-1 opacity-90">
          <FileText className="w-4 h-4" />
          {/* FR-55 */}
          <span>{assignment.courseCode} — {assignment.courseName}</span>
        </div>
        {/* FR-56: Module title as primary heading */}
        <p className="text-white/70 text-sm font-semibold mb-2">{assignment.moduleTitle}</p>
        <h1 className="text-4xl font-black mb-4">{assignment.assignmentTitle}</h1>

        {/* FR-57: Due Date + Class in distinct header section */}
        <div className="flex flex-wrap items-center gap-6 text-sm bg-white/10 rounded-xl p-4 backdrop-blur-sm">
          <div className="flex items-center gap-2">
            <CalendarIcon className="w-4 h-4" />
            <div>
              <span className="text-white/60 text-xs uppercase tracking-wider font-bold block">Due Date</span>
              <span className="font-bold">{assignment.dueDate}</span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <div>
              <span className="text-white/60 text-xs uppercase tracking-wider font-bold block">Class</span>
              <span className="font-bold">{assignment.class}</span>
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
            assignment.type === "Quiz" ? "bg-yellow-400 text-yellow-900" :
            assignment.type === "Exam" ? "bg-red-400 text-red-900" :
            "bg-white/20 text-white"
          )}>
            {assignment.type}
          </span>
          {/* FR-62: Time limit and attempts */}
          {assignment.timeLimit && (
            <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-white/20">
              <Timer className="w-3 h-3" /> {assignment.timeLimit} min limit
            </span>
          )}
          <span className="flex items-center gap-1 px-3 py-1 rounded-full text-xs font-black bg-white/20">
            <RotateCcw className="w-3 h-3" /> {assignment.attempts} attempt{assignment.attempts !== 1 ? "s" : ""} allowed
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
            <h2 className="text-2xl font-black text-slate-900 dark:text-white mb-6">Assignment Instructions</h2>

            <div className="prose prose-slate dark:prose-invert max-w-none space-y-4">
              <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                In this assignment, you will conduct a comprehensive volcanic hazard assessment for a specific volcano of your choice.
                Your research paper should demonstrate a thorough understanding of volcanic processes, risk assessment methodologies,
                and their real-world applications in disaster preparedness.
              </p>

              {/* FR-59: Requirements subsection */}
              <div className="bg-amber-50 dark:bg-amber-900/20 border-l-4 border-amber-500 p-4 rounded-r-lg my-6">
                <div className="flex items-start gap-3">
                  <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400 flex-shrink-0 mt-0.5" />
                  <div>
                    <h3 className="font-black text-amber-900 dark:text-amber-300 text-sm mb-1">Requirements</h3>
                    <ul className="text-sm text-amber-800 dark:text-amber-400 space-y-1 list-disc list-inside">
                      <li>8-10 pages (double-spaced, 12pt Times New Roman)</li>
                      <li>Minimum of 8 peer-reviewed sources</li>
                      <li>APA citation style required</li>
                      <li>Include at least 3 data visualizations (charts/graphs)</li>
                      <li>Submit as PDF format only</li>
                    </ul>
                  </div>
                </div>
              </div>

              <h3 className="font-black text-slate-900 dark:text-white text-lg mt-8">Paper Structure</h3>
              <ul className="space-y-2 text-slate-600 dark:text-slate-300">
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Introduction:</strong> Present your chosen volcano and research question</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Literature Review:</strong> Summarize relevant volcanic research and historical eruptions</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Analysis:</strong> Assess volcanic hazards using data and risk models</span>
                </li>
                <li className="flex items-start gap-3">
                  <CheckCircle className="w-5 h-5 text-green-500 flex-shrink-0 mt-0.5" />
                  <span><strong>Conclusion:</strong> Synthesize findings and propose mitigation strategies</span>
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
                <span className="text-sm font-black text-amber-600 dark:text-amber-400">Not Submitted</span>
              </div>
              {/* FR-62: Attempts shown */}
              <div className="flex items-center justify-between p-3 bg-slate-50 dark:bg-slate-900/50 rounded-lg">
                <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Attempts</span>
                <span className="text-sm font-black text-slate-900 dark:text-white">0 of {assignment.attempts}</span>
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
                { label: "Assignment Rubric", size: "PDF • 156 KB", color: "bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400" },
                { label: "APA Format Guide", size: "PDF • 2.4 MB", color: "bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400" },
                { label: "Sample Paper", size: "PDF • 892 KB", color: "bg-emerald-100 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400" },
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
