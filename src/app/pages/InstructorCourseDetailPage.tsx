import { useRef, useState, type ReactNode } from "react";
import { useParams, useNavigate } from "react-router";
import {
  Award,
  BarChart3,
  Bold,
  BookOpen,
  CheckCircle2,
  Copy,
  FileText,
  GitBranch,
  Italic,
  List,
  MessageSquare,
  Palette,
  Printer,
  Send,
  ShieldCheck,
  Upload,
  Users,
  Vote,
  Lock,
  Link as LinkIcon,
  ChevronLeft,
  Play,
  Eye,
  Edit,
  X,
  type LucideIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

// Mock course data
const courseData = {
  "cs3354-001": {
    name: "CS 3354.001 - Software Engineering",
    semester: "Spring 2026",
    section: "MW 2:00 PM - 3:30 PM",
    students: 28,
    description: "Comprehensive coverage of software engineering principles including requirements analysis, design patterns, and project management."
  },
  "cs3354-002": {
    name: "CS 3354.002 - Software Engineering",
    semester: "Spring 2026",
    section: "TR 3:30 PM - 5:00 PM",
    students: 31,
    description: "Comprehensive coverage of software engineering principles including requirements analysis, design patterns, and project management."
  },
  "cs2340-001": {
    name: "CS 2340 - Advanced Software Design",
    semester: "Spring 2026",
    section: "MWF 10:00 AM - 11:00 AM",
    students: 24,
    description: "Advanced topics in software design, architecture patterns, and enterprise application development."
  }
};

const gradebookData = [
  { name: "Maya Chen", participation: 85, assignments: 92, midterm: 88, final: 90, overall: 90 },
  { name: "Jordan Patel", participation: 78, assignments: 85, midterm: 82, final: 86, overall: 83 },
  { name: "Noah Williams", participation: 72, assignments: 78, midterm: 75, final: 79, overall: 76 },
  { name: "Avery Johnson", participation: 88, assignments: 94, midterm: 91, final: 93, overall: 92 },
  { name: "Sofia Garcia", participation: 81, assignments: 89, midterm: 87, final: 88, overall: 88 },
];

const moduleData = [
  {
    id: "module-1",
    name: "Module 1: Requirements Analysis",
    lectures: [
      { title: "Gathering Requirements", duration: "45 min", type: "video" },
      { title: "User Stories Basics", duration: "38 min", type: "video" },
      { title: "Requirements Document Template", type: "resource" },
    ],
    assignments: [
      { title: "Write User Stories for Sample Project", dueDate: "Jan 20", status: "active" },
    ]
  },
  {
    id: "module-2",
    name: "Module 2: Design Patterns",
    lectures: [
      { title: "SOLID Principles", duration: "52 min", type: "video" },
      { title: "Creational Patterns", duration: "41 min", type: "video" },
      { title: "Design Patterns Reference", type: "resource" },
    ],
    assignments: [
      { title: "Implement Pattern Examples", dueDate: "Jan 27", status: "active" },
    ]
  },
];

const pollResults = [
  { label: "Repository pattern", value: 42, color: "bg-blue-600" },
  { label: "Observer pattern", value: 31, color: "bg-emerald-600" },
  { label: "Adapter pattern", value: 27, color: "bg-amber-500" },
];

const materialAnalytics = [
  { student: "Maya Chen", material: "Sprint Planning Guide", viewed: true, lastViewed: "Today, 9:24 AM" },
  { student: "Jordan Patel", material: "UML Sequence Examples", viewed: true, lastViewed: "Yesterday, 6:12 PM" },
  { student: "Noah Williams", material: "Requirements Rubric", viewed: false, lastViewed: "Not viewed" },
  { student: "Avery Johnson", material: "Peer Review Checklist", viewed: true, lastViewed: "May 1, 3:45 PM" },
];

const roster = [
  { name: "Maya Chen", email: "maya.chen@utd.edu", section: "Team Alpha", studentId: "202214501" },
  { name: "Jordan Patel", email: "jordan.patel@utd.edu", section: "Team Alpha", studentId: "202214502" },
  { name: "Noah Williams", email: "noah.williams@utd.edu", section: "Team Delta", studentId: "202214503" },
  { name: "Avery Johnson", email: "avery.johnson@utd.edu", section: "Team Atlas", studentId: "202214504" },
];

const sampleBadges = [
  { name: "Sprint Starter", detail: "Submit first sprint plan", color: "bg-blue-600" },
  { name: "Peer Reviewer", detail: "Complete 3 thoughtful reviews", color: "bg-emerald-600" },
  { name: "Design Thinker", detail: "Revise UML after feedback", color: "bg-violet-600" },
];

const uploadedFiles = [
  { name: "Module-1-Slides.pdf", size: "4.2 MB", uploadedAt: "Today, 2:15 PM" },
  { name: "Requirements-Template.docx", size: "1.8 MB", uploadedAt: "Yesterday, 11:30 AM" },
];

const peerReviewAssignments = [
  { assignment: "Design Document", reviewer: "Jordan Patel", reviewee: "Maya Chen", status: "Pending" },
  { assignment: "Test Plan Review", reviewer: "Noah Williams", reviewee: "Avery Johnson", status: "Submitted" },
];

const MOCK_STUDENT_POOL = ["Maya Chen", "Jordan Patel", "Noah Williams", "Avery Johnson", "Sofia Garcia"];

const previousCourses = [
  { name: "CS 3354.001 - Fall 2025", modules: 8, lastOffered: "Fall 2025" },
  { name: "CS 3354.002 - Spring 2025", modules: 8, lastOffered: "Spring 2025" },
];

export function InstructorCourseDetailPage() {
  const { courseId } = useParams<{ courseId: string }>();
  const navigate = useNavigate();
  
  const course = courseData[courseId as keyof typeof courseData];

  // State for instructor features
  const [pollLaunched, setPollLaunched] = useState(false);
  const [discussionLaunched, setDiscussionLaunched] = useState(false);
  const [badgeColor, setBadgeColor] = useState("bg-blue-600");
  const [uploadedFileList, setUploadedFileList] = useState(() =>
    uploadedFiles.map((f) => ({ ...f, kind: "pdf" as string })),
  );
  const [dragActive, setDragActive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof previousCourses[0] | null>(null);
  const [peerAllocations, setPeerAllocations] = useState(peerReviewAssignments);
  const [peerTitle, setPeerTitle] = useState("Peer architecture review");
  const [peerDue, setPeerDue] = useState("2026-05-22");
  const [reviewsPerStudent, setReviewsPerStudent] = useState(2);
  const [anonPeer, setAnonPeer] = useState(true);
  const [cloneDest, setCloneDest] = useState("CS 3354.003 — Spring 2026");
  const [cloneFlags, setCloneFlags] = useState({
    modules: true,
    assignments: true,
    quizzes: true,
    rubrics: true,
    announcements: false,
  });
  const [cloneSummary, setCloneSummary] = useState<string | null>(null);
  const [hiddenPostIds, setHiddenPostIds] = useState<string[]>([]);
  const [analyticsFilter, setAnalyticsFilter] = useState("all");
  const [prereqId, setPrereqId] = useState("req-quiz");
  const [lockedId, setLockedId] = useState("arch-assign");
  const [badgeName, setBadgeName] = useState("Traceability Champion");
  const [badgeRule, setBadgeRule] = useState("Map every story to a test");
  const [badgeHue, setBadgeHue] = useState<"blue" | "emerald" | "violet">("blue");
  const [branchTitle, setBranchTitle] = useState("Production outage scenario");
  const [branchPrompt, setBranchPrompt] = useState("Latency spikes after deploy. What do you inspect first?");
  const [branchOutcomes, setBranchOutcomes] = useState({
    a: "Roll back and warm caches",
    b: "Change font sizes in CSS",
    c: "Open an incident bridge and pull traces",
  });
  const moduleUploadRef = useRef<HTMLInputElement>(null);
  const rosterPrintRef = useRef<HTMLDivElement>(null);
  const rteRef = useRef<HTMLDivElement>(null);

  if (!course) {
    return (
      <div className="flex h-full items-center justify-center">
        <p>Course not found</p>
      </div>
    );
  }

  const formatEditor = (command: "bold" | "italic" | "insertUnorderedList") => {
    rteRef.current?.focus();
    document.execCommand(command);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const addModuleFiles = (files: FileList | null) => {
    if (!files?.length) return;
    Array.from(files).forEach((file) => {
      const newFile = {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
        kind: file.type || "file",
        uploadedAt: "Just now",
      };
      setUploadedFileList((prev) => [newFile, ...prev]);
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    addModuleFiles(e.dataTransfer.files);
  };

  const cloneCourse = () => {
    if (!selectedCourse) return;
    const selectedParts = [
      cloneFlags.modules && "modules",
      cloneFlags.assignments && "assignments",
      cloneFlags.quizzes && "quizzes",
      cloneFlags.rubrics && "rubrics",
      cloneFlags.announcements && "announcements",
    ].filter(Boolean) as string[];
    setCloneSummary(
      `Prepared clone from ${selectedCourse.name} → ${cloneDest}: ${selectedParts.join(", ") || "no items selected"}.`,
    );
  };

  const generatePeerReviewers = () => {
    const pool = [...MOCK_STUDENT_POOL];
    const next: Array<{ assignment: string; reviewer: string; reviewee: string; status: string }> = [];
    for (const reviewee of pool) {
      const others = pool.filter((s) => s !== reviewee);
      const shuffled = [...others].sort(() => Math.random() - 0.5);
      let picked = 0;
      for (let i = 0; i < shuffled.length && picked < reviewsPerStudent; i++) {
        const reviewer = shuffled[i];
        if (reviewer !== reviewee) {
          next.push({
            assignment: peerTitle,
            reviewer,
            reviewee,
            status: "Assigned",
          });
          picked += 1;
        }
      }
    }
    setPeerAllocations(next);
  };

  return (
    <div className="min-h-full bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-6xl space-y-6">
        {/* Header with back button */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/instructor-dashboard")}
            className={cn("inline-flex items-center gap-2 rounded px-3 py-2 text-slate-600 hover:bg-slate-200 dark:text-slate-400 dark:hover:bg-slate-800", FOCUS_RING)}
          >
            <ChevronLeft className="h-4 w-4" />
            Back to Classes
          </button>
        </div>

        {/* Course Header */}
        <section className="rounded border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h1 className="text-3xl font-black text-slate-950 dark:text-white">{course.name}</h1>
          <p className="mt-2 text-slate-600 dark:text-slate-400">{course.section}</p>
          <p className="mt-3 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">{course.description}</p>
          
          <div className="mt-6 grid grid-cols-3 gap-4">
            <div className="rounded bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Students</p>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{course.students}</p>
            </div>
            <div className="rounded bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Class Average</p>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">82%</p>
            </div>
            <div className="rounded bg-slate-50 p-4 dark:bg-slate-800">
              <p className="text-xs font-black uppercase tracking-wide text-slate-500">Modules</p>
              <p className="mt-2 text-2xl font-black text-slate-900 dark:text-white">{moduleData.length}</p>
            </div>
          </div>
        </section>

        {/* Gradebook */}
        <section className="rounded border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-4">Gradebook</h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 dark:bg-slate-800">
                <tr>
                  <th className="px-4 py-3 text-left font-bold text-slate-900 dark:text-white">Student</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Participation</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Assignments</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Midterm</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Final</th>
                  <th className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">Overall</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                {gradebookData.map((row) => (
                  <tr key={row.name} className="hover:bg-slate-50 dark:hover:bg-slate-800">
                    <td className="px-4 py-3 font-semibold text-slate-900 dark:text-white">{row.name}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{row.participation}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{row.assignments}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{row.midterm}</td>
                    <td className="px-4 py-3 text-center text-slate-600 dark:text-slate-300">{row.final}</td>
                    <td className="px-4 py-3 text-center font-bold text-slate-900 dark:text-white">{row.overall}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        {/* Course Modules */}
        <section className="rounded border border-slate-200 bg-white p-6 shadow-sm dark:border-slate-800 dark:bg-slate-900">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-6">Course Modules</h2>
          <div className="space-y-4">
            {moduleData.map((module) => (
              <div key={module.id} className="rounded border border-slate-200 dark:border-slate-700 p-4">
                <h3 className="font-bold text-slate-900 dark:text-white">{module.name}</h3>
                
                <div className="mt-4 ml-4 space-y-3">
                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500 mb-2">Lecture Notes</p>
                    <div className="space-y-2">
                      {module.lectures.map((lecture, idx) => (
                        <div key={idx} className="flex items-center gap-3 rounded bg-slate-50 p-2 dark:bg-slate-800">
                          <FileText className="h-4 w-4 text-slate-500 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{lecture.title}</p>
                            {lecture.duration && <p className="text-xs text-slate-500 dark:text-slate-400">{lecture.duration}</p>}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500 mb-2">Assignments</p>
                    <div className="space-y-2">
                      {module.assignments.map((assignment, idx) => (
                        <div key={idx} className="flex items-center gap-3 rounded bg-blue-50 p-2 dark:bg-blue-900/20">
                          <CheckCircle2 className="h-4 w-4 text-blue-600 dark:text-blue-400 flex-shrink-0" />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-slate-900 dark:text-white">{assignment.title}</p>
                            <p className="text-xs text-slate-500 dark:text-slate-400">Due: {assignment.dueDate}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <div className="border-t border-slate-200 pt-6 dark:border-slate-800">
          <h2 className="text-2xl font-black text-slate-950 dark:text-white mb-6">Instructor Features</h2>
        </div>

        {/* Instructor Features */}
        <div className="grid gap-6 xl:grid-cols-2">
          {/* Quick Poll */}
          <FeatureCard icon={Vote} title="Quick Poll" eyebrow="Live check-in">
            {!pollLaunched ? (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Poll question
                  <input
                    className={inputClass}
                    defaultValue="Which design pattern best fits the notification service?"
                  />
                </label>
                <div className="grid gap-3 sm:grid-cols-3">
                  {pollResults.map((result) => (
                    <label key={result.label} className="block text-xs font-bold uppercase tracking-wide text-slate-500">
                      Option
                      <input className={inputClass} defaultValue={result.label} />
                    </label>
                  ))}
                </div>
                <button type="button" className={primaryButton} onClick={() => setPollLaunched(true)}>
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Launch Poll
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Poll Active</span>
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() => setPollLaunched(false)}
                  >
                    <Edit className="h-4 w-4" />
                    Close Poll
                  </button>
                </div>
                <div className="space-y-3">
                  {pollResults.map((result) => (
                    <ProgressRow key={result.label} {...result} />
                  ))}
                </div>
              </div>
            )}
          </FeatureCard>

          {/* Discussion Board */}
          <FeatureCard icon={MessageSquare} title="Anonymous Discussion Boards" eyebrow="Reflection space">
            {!discussionLaunched ? (
              <div className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Board title
                  <input className={inputClass} defaultValue="Module 1 Questions" />
                </label>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Prompt
                  <textarea
                    className={cn(inputClass, "min-h-24 resize-y")}
                    defaultValue="What part of this module should we clarify before moving forward?"
                  />
                </label>
                <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    defaultChecked
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  Anonymous posting enabled
                </label>
                <button type="button" className={primaryButton} onClick={() => setDiscussionLaunched(true)}>
                  <Play className="h-4 w-4" aria-hidden="true" />
                  Launch Board
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-200">Board Active</span>
                  <button
                    type="button"
                    className={secondaryButton}
                    onClick={() => setDiscussionLaunched(false)}
                  >
                    <Edit className="h-4 w-4" />
                    Edit
                  </button>
                </div>
                <div className="space-y-2">
                  {[
                    {
                      id: "anon-1",
                      body: "I understand the requirements, but some of the technical constraints are unclear.",
                    },
                    {
                      id: "anon-2",
                      body: "The examples really helped me understand the concept better.",
                    },
                  ]
                    .filter((post) => !hiddenPostIds.includes(post.id))
                    .map((post) => (
                      <div key={post.id} className="rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-xs font-black uppercase tracking-wide text-slate-500">Anonymous post</p>
                          <button
                            type="button"
                            className={cn("text-xs font-bold text-red-600 hover:underline dark:text-red-400", FOCUS_RING)}
                            onClick={() => setHiddenPostIds((prev) => [...prev, post.id])}
                          >
                            Hide post
                          </button>
                        </div>
                        <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-200">{post.body}</p>
                      </div>
                    ))}
                  {hiddenPostIds.length >= 2 && (
                    <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">All sample posts hidden for this session.</p>
                  )}
                </div>
              </div>
            )}
          </FeatureCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* File Uploader */}
          <FeatureCard icon={Upload} title="Module & lecture uploads" eyebrow="Instructor content">
            <div className="space-y-4">
              <input
                ref={moduleUploadRef}
                type="file"
                multiple
                className="sr-only"
                aria-label="Choose module files"
                onChange={(e) => {
                  addModuleFiles(e.target.files);
                  e.target.value = "";
                }}
              />
              <div
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
                className={cn(
                  "rounded border-2 border-dashed p-8 text-center transition-colors",
                  dragActive
                    ? "border-blue-500 bg-blue-50 dark:bg-blue-950/30"
                    : "border-slate-300 bg-slate-50 dark:border-slate-700 dark:bg-slate-800"
                )}
              >
                <Upload className={cn("mx-auto h-8 w-8 mb-2", dragActive ? "text-blue-600" : "text-slate-400")} aria-hidden="true" />
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Drag and drop instructor modules here</p>
                <button type="button" className={cn("mt-3 text-sm font-bold text-blue-700 underline dark:text-blue-300", FOCUS_RING)} onClick={() => moduleUploadRef.current?.click()}>
                  Or browse files
                </button>
              </div>
              <div className="space-y-2">
                {uploadedFileList.map((file, index) => (
                  <div key={`${file.name}-${index}`} className="flex items-center justify-between gap-3 rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">
                        {file.size} · {(file as { kind?: string }).kind ?? "file"}
                      </p>
                    </div>
                    <button
                      type="button"
                      className={cn("rounded p-1 text-slate-500 hover:bg-slate-200 hover:text-slate-900 dark:hover:bg-slate-700 dark:hover:text-white", FOCUS_RING)}
                      aria-label={`Remove ${file.name}`}
                      onClick={() => setUploadedFileList((prev) => prev.filter((_, i) => i !== index))}
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          {/* Course Cloning */}
          <FeatureCard icon={Copy} title="Course Cloning Tool" eyebrow="Reuse content">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Source course / semester
                <select 
                  className={inputClass}
                  value={selectedCourse ? previousCourses.indexOf(selectedCourse) : ""}
                  onChange={(e) => setSelectedCourse(e.target.value ? previousCourses[parseInt(e.target.value)] : null)}
                >
                  <option value="">Choose a course to clone...</option>
                  {previousCourses.map((c, idx) => (
                    <option key={c.name} value={idx}>{c.name}</option>
                  ))}
                </select>
              </label>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Destination course / semester
                <input className={inputClass} value={cloneDest} onChange={(e) => setCloneDest(e.target.value)} />
              </label>
              <fieldset className="space-y-2 rounded border border-slate-200 p-3 dark:border-slate-700">
                <legend className="text-xs font-black uppercase tracking-wide text-slate-500">Include</legend>
                {(
                  [
                    ["modules", "Modules"],
                    ["assignments", "Assignments"],
                    ["quizzes", "Quizzes"],
                    ["rubrics", "Rubrics"],
                    ["announcements", "Announcements"],
                  ] as const
                ).map(([key, label]) => (
                  <label key={key} className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200">
                    <input
                      type="checkbox"
                      checked={cloneFlags[key]}
                      onChange={(e) => setCloneFlags((prev) => ({ ...prev, [key]: e.target.checked }))}
                      className="h-4 w-4 rounded border-slate-300 text-blue-600"
                    />
                    {label}
                  </label>
                ))}
              </fieldset>
              {selectedCourse && (
                <div className="rounded border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    Source contains <span className="font-bold">{selectedCourse.modules}</span> modules.
                  </p>
                </div>
              )}
              <button 
                type="button" 
                className={primaryButton}
                onClick={cloneCourse}
                disabled={!selectedCourse}
              >
                <Copy className="h-4 w-4" aria-hidden="true" />
                Clone Content
              </button>
              {cloneSummary && (
                <p className="rounded border border-emerald-200 bg-emerald-50 p-3 text-sm font-semibold text-emerald-900 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-200" role="status">
                  {cloneSummary}
                </p>
              )}
            </div>
          </FeatureCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          {/* Material Analytics */}
          <FeatureCard icon={BarChart3} title="Course Material Analytics" eyebrow="Engagement audit">
            <div className="mb-3 flex flex-wrap items-center gap-2">
              <label className="text-xs font-bold uppercase tracking-wide text-slate-500 dark:text-slate-400">Material</label>
              <select
                className={cn(inputClass, "mt-0 max-w-xs")}
                value={analyticsFilter}
                onChange={(e) => setAnalyticsFilter(e.target.value)}
              >
                <option value="all">All materials</option>
                <option value="Sprint">Sprint Planning Guide</option>
                <option value="UML">UML Sequence Examples</option>
                <option value="Rubric">Requirements Rubric</option>
                <option value="Peer">Peer Review Checklist</option>
              </select>
            </div>
            <div className="overflow-hidden rounded border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Student</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Material</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Viewed</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Last viewed</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Completion</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {materialAnalytics
                    .filter((row) => analyticsFilter === "all" || row.material.includes(analyticsFilter))
                    .map((row) => {
                      const completion = row.viewed ? 100 : 14;
                      return (
                        <tr key={`${row.student}-${row.material}`}>
                          <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">{row.student}</td>
                          <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{row.material}</td>
                          <td className="px-3 py-3">
                            <StatusPill viewed={row.viewed} />
                          </td>
                          <td className="px-3 py-3 text-slate-600 dark:text-slate-400">{row.lastViewed}</td>
                          <td className="px-3 py-3">
                            <div className="flex items-center gap-2">
                              <div className="h-2 w-24 overflow-hidden rounded bg-slate-200 dark:bg-slate-700">
                                <div className="h-2 rounded bg-blue-600" style={{ width: `${completion}%` }} />
                              </div>
                              <span className="text-xs font-black text-slate-700 dark:text-slate-200">{completion}%</span>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </div>
          </FeatureCard>

          {/* Peer Review */}
          <FeatureCard icon={Users} title="Peer Review Assignments" eyebrow="Random allocation">
            <div className="mb-4 space-y-3">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Assignment title
                <input className={inputClass} value={peerTitle} onChange={(e) => setPeerTitle(e.target.value)} />
              </label>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Due date
                <input className={inputClass} type="date" value={peerDue} onChange={(e) => setPeerDue(e.target.value)} />
              </label>
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Reviews per student
                  <input
                    className={inputClass}
                    type="number"
                    min={1}
                    max={4}
                    value={reviewsPerStudent}
                    onChange={(e) => setReviewsPerStudent(Number(e.target.value))}
                  />
                </label>
                <label className="flex items-center gap-2 pt-7 text-sm font-semibold text-slate-700 dark:text-slate-200">
                  <input
                    type="checkbox"
                    checked={anonPeer}
                    onChange={(e) => setAnonPeer(e.target.checked)}
                    className="h-4 w-4 rounded border-slate-300 text-blue-600"
                  />
                  Anonymous reviews to students
                </label>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">Reviewers: {MOCK_STUDENT_POOL.join(", ")}.</p>
              <button type="button" className={primaryButton} onClick={generatePeerReviewers}>
                <Users className="h-4 w-4" aria-hidden />
                Generate Reviewers
              </button>
            </div>
            <div className="overflow-hidden rounded border border-slate-200 dark:border-slate-700">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Assignment</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Reviewer</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Reviewee</th>
                    <th className="px-3 py-2 text-left font-bold text-slate-900 dark:text-white">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {peerAllocations.map((row, idx) => (
                    <tr key={`${row.reviewer}-${row.reviewee}-${idx}`}>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{row.assignment}</td>
                      <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">{row.reviewer}</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{row.reviewee}</td>
                      <td className="px-3 py-3">
                        <span className={cn(
                          "inline-flex items-center rounded px-2 py-1 text-xs font-bold",
                          row.status === "Submitted"
                            ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
                            : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
                        )}>
                          {row.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FeatureCard>
        </div>

        <div className="border-t border-slate-200 pt-8 dark:border-slate-800">
          <div className="mb-4 flex flex-wrap gap-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">
            <span className="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">Engagement</span>
            <span className="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">Course content</span>
            <span className="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">Assessment tools</span>
            <span className="rounded-full bg-slate-200 px-2 py-1 dark:bg-slate-800">Administration</span>
          </div>

          <div className="grid gap-6 xl:grid-cols-2">
            <FeatureCard icon={Lock} title="Conditional availability" eyebrow="Prerequisites">
              <p className="mb-3 text-sm text-slate-600 dark:text-slate-400">
                Example: complete <strong className="text-slate-900 dark:text-white">Requirements Quiz</strong> to unlock{" "}
                <strong className="text-slate-900 dark:text-white">Architecture Assignment</strong>.
              </p>
              <div className="space-y-3">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Prerequisite item
                  <select className={inputClass} value={prereqId} onChange={(e) => setPrereqId(e.target.value)}>
                    <option value="req-quiz">Requirements Quiz</option>
                    <option value="kickoff">Requirements Kickoff module</option>
                  </select>
                </label>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Locked until complete
                  <select className={inputClass} value={lockedId} onChange={(e) => setLockedId(e.target.value)}>
                    <option value="arch-assign">Architecture Assignment</option>
                    <option value="uml-lab">UML Lab</option>
                  </select>
                </label>
                <p className="rounded border border-slate-200 bg-slate-50 p-3 text-sm dark:border-slate-700 dark:bg-slate-800">
                  Status:{" "}
                  <span className="font-black text-emerald-700 dark:text-emerald-300">
                    {lockedId === "arch-assign" && prereqId === "req-quiz" ? "Locked until quiz submitted" : "Rule saved locally"}
                  </span>
                </p>
              </div>
            </FeatureCard>

            <FeatureCard icon={GitBranch} title="Branching module builder" eyebrow="Scenario learning">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Scenario title
                <input className={inputClass} value={branchTitle} onChange={(e) => setBranchTitle(e.target.value)} />
              </label>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Starting prompt
                <textarea className={cn(inputClass, "min-h-20")} value={branchPrompt} onChange={(e) => setBranchPrompt(e.target.value)} />
              </label>
              <div className="grid gap-2 sm:grid-cols-3">
                <label className="text-xs font-bold text-slate-500">
                  Choice A
                  <input className={inputClass} value={branchOutcomes.a} onChange={(e) => setBranchOutcomes((p) => ({ ...p, a: e.target.value }))} />
                </label>
                <label className="text-xs font-bold text-slate-500">
                  Choice B
                  <input className={inputClass} value={branchOutcomes.b} onChange={(e) => setBranchOutcomes((p) => ({ ...p, b: e.target.value }))} />
                </label>
                <label className="text-xs font-bold text-slate-500">
                  Choice C
                  <input className={inputClass} value={branchOutcomes.c} onChange={(e) => setBranchOutcomes((p) => ({ ...p, c: e.target.value }))} />
                </label>
              </div>
              <div className="mt-3 rounded border border-dashed border-slate-300 p-3 text-sm dark:border-slate-600">
                <p className="font-black text-slate-800 dark:text-slate-100">Preview flow</p>
                <p className="mt-1 text-slate-600 dark:text-slate-400">{branchPrompt}</p>
                <ul className="mt-2 list-disc space-y-1 pl-5 text-slate-700 dark:text-slate-300">
                  <li>A → {branchOutcomes.a}</li>
                  <li>B → {branchOutcomes.b}</li>
                  <li>C → {branchOutcomes.c}</li>
                </ul>
              </div>
            </FeatureCard>
          </div>

          <div className="mt-6 grid gap-6 xl:grid-cols-2">
            <FeatureCard icon={Award} title="Badge builder" eyebrow="Milestones">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Badge name
                <input className={inputClass} value={badgeName} onChange={(e) => setBadgeName(e.target.value)} />
              </label>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Milestone requirement
                <input className={inputClass} value={badgeRule} onChange={(e) => setBadgeRule(e.target.value)} />
              </label>
              <p className="text-xs font-bold uppercase tracking-wide text-slate-500">Icon color</p>
              <div className="flex flex-wrap gap-2">
                {(["blue", "emerald", "violet"] as const).map((hue) => (
                  <button
                    key={hue}
                    type="button"
                    onClick={() => setBadgeHue(hue)}
                    className={cn(
                      "h-10 w-10 rounded-full border-2",
                      hue === "blue" && "bg-blue-600",
                      hue === "emerald" && "bg-emerald-600",
                      hue === "violet" && "bg-violet-600",
                      badgeHue === hue ? "border-slate-900 dark:border-white" : "border-transparent",
                    )}
                    aria-label={`Color ${hue}`}
                  />
                ))}
              </div>
              <div className="mt-4 flex flex-wrap gap-3">
                <div className={cn("flex items-center gap-2 rounded-full px-4 py-2 text-sm font-black text-white", badgeHue === "blue" && "bg-blue-600", badgeHue === "emerald" && "bg-emerald-600", badgeHue === "violet" && "bg-violet-600")}>
                  {badgeName}
                </div>
                <span className="self-center text-xs text-slate-500 dark:text-slate-400">Sample: Maya — earned</span>
                <span className="self-center text-xs text-slate-400 line-through dark:text-slate-500">Jordan — not earned</span>
              </div>
            </FeatureCard>

            <FeatureCard icon={Printer} title="Printable roster" eyebrow="Photos optional">
              <div ref={rosterPrintRef} className="space-y-3">
                {roster.map((student) => (
                  <div key={student.studentId} className="flex items-center gap-3 rounded border border-slate-200 p-3 dark:border-slate-700">
                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-slate-300 text-sm font-black text-slate-800 dark:bg-slate-600 dark:text-white">
                      {student.name
                        .split(" ")
                        .map((n) => n[0])
                        .join("")}
                    </div>
                    <div>
                      <p className="font-bold text-slate-900 dark:text-white">{student.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">ID {student.studentId} · {student.section}</p>
                    </div>
                  </div>
                ))}
              </div>
              <button
                type="button"
                className={cn("mt-4", primaryButton)}
                onClick={() => window.print()}
              >
                <Printer className="h-4 w-4" aria-hidden />
                Print Roster
              </button>
            </FeatureCard>
          </div>

          <div className="mt-6">
            <FeatureCard icon={FileText} title="Rich text module instructions" eyebrow="Local editor">
              <div className="mb-3 flex flex-wrap gap-2">
                <button type="button" className={secondaryButton} onClick={() => formatEditor("bold")}>
                  <Bold className="h-4 w-4" /> Bold
                </button>
                <button type="button" className={secondaryButton} onClick={() => formatEditor("italic")}>
                  <Italic className="h-4 w-4" /> Italic
                </button>
                <button type="button" className={secondaryButton} onClick={() => formatEditor("insertUnorderedList")}>
                  <List className="h-4 w-4" /> Bulleted list
                </button>
              </div>
              <div
                ref={rteRef}
                className="min-h-[120px] rounded border border-slate-200 bg-white p-3 text-sm text-slate-900 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100"
                contentEditable
                suppressContentEditableWarning
              >
                <p>
                  Students implement <b>service boundaries</b> with explicit interfaces and document assumptions about deployment.
                </p>
                <ul>
                  <li>Trace requirements to tests.</li>
                  <li>Keep sequence diagrams aligned with API contracts.</li>
                </ul>
              </div>
              <div className="mt-4 rounded border border-slate-200 bg-slate-50 p-4 dark:border-slate-700 dark:bg-slate-800">
                <h4 className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Requirements subsection</h4>
                <div className="mt-3 grid gap-3 sm:grid-cols-2">
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Page count
                    <input className={inputClass} defaultValue="8–12 pages (excluding references)" />
                  </label>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Citation style
                    <input className={inputClass} defaultValue="IEEE or ACM" />
                  </label>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    File format
                    <input className={inputClass} defaultValue="PDF export + repo link" />
                  </label>
                  <label className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    Due constraints
                    <input className={inputClass} defaultValue="No late submissions after grace window" />
                  </label>
                </div>
                <label className="mt-3 block text-xs font-bold text-slate-600 dark:text-slate-300">
                  Rubric note
                  <textarea className={cn(inputClass, "min-h-16")} defaultValue="Architecture clarity and traceability weigh 40%." />
                </label>
              </div>
              <p className="mt-3 text-xs text-slate-500 dark:text-slate-400">Preview reflects browser contenteditable output only.</p>
            </FeatureCard>
          </div>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

const primaryButton = cn(
  "inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed",
  FOCUS_RING,
);

const secondaryButton = cn(
  "inline-flex items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200 dark:hover:bg-slate-800",
  FOCUS_RING,
);

function FeatureCard({
  icon: Icon,
  title,
  eyebrow,
  children,
}: {
  icon: LucideIcon;
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900">
      <div className="mb-4 flex items-start gap-3">
        <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-200">
          <Icon className="h-5 w-5" aria-hidden="true" />
        </div>
        <div>
          <p className="text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">{eyebrow}</p>
          <h2 className="mt-1 text-lg font-black text-slate-950 dark:text-white">{title}</h2>
        </div>
      </div>
      {children}
    </section>
  );
}

function ProgressRow({ label, value, color }: { label: string; value: number; color: string }) {
  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
        <span className="font-black text-slate-900 dark:text-white">{value}%</span>
      </div>
      <div className="h-2 rounded bg-slate-100 dark:bg-slate-800">
        <div className={cn("h-2 rounded", color)} style={{ width: `${value}%` }} />
      </div>
    </div>
  );
}

function StatusPill({ viewed }: { viewed: boolean }) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded px-2 py-1 text-xs font-black",
        viewed
          ? "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300"
          : "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-300",
      )}
    >
      {viewed ? "Viewed" : "Needs nudge"}
    </span>
  );
}
