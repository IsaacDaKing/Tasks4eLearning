import { useState, type ReactNode } from "react";
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
  type LucideIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-950";

const pollResults = [
  { label: "Repository pattern", value: 42, color: "bg-blue-600" },
  { label: "Observer pattern", value: 31, color: "bg-emerald-600" },
  { label: "Adapter pattern", value: 27, color: "bg-amber-500" },
];

const anonymousPosts = [
  "I understand user stories, but acceptance criteria still feel fuzzy.",
  "The UML sequence diagram examples helped the sprint finally click.",
  "Could we review one more traceability matrix before the project check-in?",
];

const materialAnalytics = [
  { student: "Maya Chen", material: "Sprint Planning Guide", viewed: true, lastViewed: "Today, 9:24 AM" },
  { student: "Jordan Patel", material: "UML Sequence Examples", viewed: true, lastViewed: "Yesterday, 6:12 PM" },
  { student: "Noah Williams", material: "Requirements Rubric", viewed: false, lastViewed: "Not viewed" },
  { student: "Avery Johnson", material: "Peer Review Checklist", viewed: true, lastViewed: "May 1, 3:45 PM" },
];

const roster = [
  { name: "Maya Chen", email: "maya.chen@utd.edu", section: "CS 3354.012" },
  { name: "Jordan Patel", email: "jordan.patel@utd.edu", section: "CS 3354.012" },
  { name: "Noah Williams", email: "noah.williams@utd.edu", section: "Team Delta" },
  { name: "Avery Johnson", email: "avery.johnson@utd.edu", section: "Team Atlas" },
  { name: "Sofia Garcia", email: "sofia.garcia@utd.edu", section: "Team Delta" },
  { name: "Ethan Brooks", email: "ethan.brooks@utd.edu", section: "Team Atlas" },
];

const sampleBadges = [
  { name: "Sprint Starter", detail: "Submit first sprint plan", color: "bg-blue-600" },
  { name: "Peer Reviewer", detail: "Complete 3 thoughtful reviews", color: "bg-emerald-600" },
  { name: "Design Thinker", detail: "Revise UML after feedback", color: "bg-violet-600" },
];

const branchingChoices = [
  { choice: "Interview the stakeholder again", outcome: "Unlocks clearer acceptance criteria" },
  { choice: "Start coding immediately", outcome: "Triggers a scope-risk reflection" },
  { choice: "Map assumptions as a team", outcome: "Opens the decision log checkpoint" },
];

const uploadedFiles = [
  { name: "Module-1-Slides.pdf", size: "4.2 MB", uploadedAt: "Today, 2:15 PM" },
  { name: "Requirements-Template.docx", size: "1.8 MB", uploadedAt: "Yesterday, 11:30 AM" },
  { name: "Assessment-Rubric.xlsx", size: "256 KB", uploadedAt: "May 1, 3:45 PM" },
];

const peerReviewAssignments = [
  { assignment: "Sprint Retrospective", reviewer: "Jordan Patel", reviewee: "Maya Chen", status: "Pending" },
  { assignment: "Design Document", reviewer: "Noah Williams", reviewee: "Avery Johnson", status: "Submitted" },
  { assignment: "Test Plan Review", reviewer: "Sofia Garcia", reviewee: "Ethan Brooks", status: "Pending" },
  { assignment: "Code Architecture", reviewer: "Maya Chen", reviewee: "Jordan Patel", status: "Submitted" },
];

const conditionalItems = [
  { id: "item-1", name: "Requirements Kickoff", unlocks: [], type: "Module" },
  { id: "item-2", name: "User Stories Exercise", unlocks: ["item-3"], type: "Assignment", unlockedBy: "item-1" },
  { id: "item-3", name: "Acceptance Criteria Workshop", unlocks: ["item-4"], type: "Module", unlockedBy: "item-2" },
  { id: "item-4", name: "Final Requirements Document", unlocks: [], type: "Assignment", unlockedBy: "item-3" },
];

const previousCourses = [
  { name: "CS 3354.001 - Fall 2025", modules: 8, lastOffered: "Fall 2025" },
  { name: "CS 3354.002 - Spring 2025", modules: 8, lastOffered: "Spring 2025" },
  { name: "CS 2340 - Software Engineering - Fall 2024", modules: 12, lastOffered: "Fall 2024" },
];

export function InstructorDashboardPage() {
  const [isAnonymous, setIsAnonymous] = useState(true);
  const [badgeColor, setBadgeColor] = useState("bg-blue-600");
  const [uploadedFileList, setUploadedFileList] = useState(uploadedFiles);
  const [dragActive, setDragActive] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<typeof previousCourses[0] | null>(null);

  const formatEditor = (command: "bold" | "italic" | "insertUnorderedList") => {
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

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => {
        const newFile = {
          name: file.name,
          size: `${(file.size / 1024 / 1024).toFixed(1)} MB`,
          uploadedAt: "Just now",
        };
        setUploadedFileList((prev) => [newFile, ...prev]);
      });
    }
  };

  const cloneCourse = () => {
    if (selectedCourse) {
      alert(`Cloning "${selectedCourse.name}" with ${selectedCourse.modules} modules. This will copy all materials to the new semester.`);
      setSelectedCourse(null);
    }
  };

  return (
    <div className="min-h-full bg-slate-100 p-4 text-slate-900 dark:bg-slate-950 dark:text-slate-100 sm:p-6 lg:p-8">
      <div className="mx-auto max-w-7xl space-y-6">
        <section className="rounded border border-slate-200 bg-white p-5 shadow-sm dark:border-slate-800 dark:bg-slate-900 sm:p-6">
          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <p className="text-xs font-black uppercase tracking-wide text-orange-700 dark:text-orange-300">
                Instructor workspace
              </p>
              <h1 className="mt-2 text-2xl font-black tracking-tight text-slate-950 dark:text-white sm:text-3xl">
                Teaching Control Center
              </h1>
              <p className="mt-2 max-w-3xl text-sm leading-6 text-slate-600 dark:text-slate-400">
                Launch class activities, review engagement signals, and assemble module materials from one responsive instructor view.
              </p>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <Metric value="42" label="Active learners" />
              <Metric value="87%" label="Material views" />
              <Metric value="6" label="Draft modules" />
            </div>
          </div>
        </section>

        <div className="grid gap-6 xl:grid-cols-2">
          <FeatureCard icon={Vote} title="FR-05 Quick Poll" eyebrow="Live check-in">
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
              <button type="button" className={primaryButton}>
                <Send className="h-4 w-4" aria-hidden="true" />
                Launch Poll
              </button>
              <div className="space-y-3">
                {pollResults.map((result) => (
                  <ProgressRow key={result.label} {...result} />
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard icon={MessageSquare} title="FR-29 Anonymous Discussion Boards" eyebrow="Reflection space">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Board title
                <input className={inputClass} defaultValue="Sprint 2 Questions" />
              </label>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Prompt
                <textarea
                  className={cn(inputClass, "min-h-24 resize-y")}
                  defaultValue="What part of the requirements process should we clarify before implementation?"
                />
              </label>
              <label className="flex items-center gap-3 text-sm font-semibold text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(event) => setIsAnonymous(event.target.checked)}
                  className="h-4 w-4 rounded border-slate-300 text-blue-600"
                />
                Anonymous posting enabled
              </label>
              <div className="space-y-2">
                {anonymousPosts.map((post, index) => (
                  <div key={post} className="rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">
                      {isAnonymous ? `Anonymous post ${index + 1}` : `Student post ${index + 1}`}
                    </p>
                    <p className="mt-1 text-sm leading-5 text-slate-700 dark:text-slate-200">{post}</p>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard icon={BarChart3} title="FR-21 Course Material Analytics" eyebrow="Engagement audit">
            <div className="overflow-hidden rounded border border-slate-200 dark:border-slate-700">
              <table className="w-full min-w-[34rem] text-left text-sm">
                <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-slate-800">
                  <tr>
                    <th className="px-3 py-2">Student</th>
                    <th className="px-3 py-2">Material</th>
                    <th className="px-3 py-2">Status</th>
                    <th className="px-3 py-2">Last viewed</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                  {materialAnalytics.map((row) => (
                    <tr key={`${row.student}-${row.material}`}>
                      <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">{row.student}</td>
                      <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{row.material}</td>
                      <td className="px-3 py-3">
                        <StatusPill viewed={row.viewed} />
                      </td>
                      <td className="px-3 py-3 text-slate-500 dark:text-slate-400">{row.lastViewed}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </FeatureCard>

          <FeatureCard icon={Award} title="FR-25 Badges/Awards" eyebrow="Recognition builder">
            <div className="space-y-4">
              <div className="grid gap-3 sm:grid-cols-2">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Badge name
                  <input className={inputClass} defaultValue="Requirement Wrangler" />
                </label>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Milestone requirement
                  <input className={inputClass} defaultValue="Complete 4 traceability updates" />
                </label>
              </div>
              <div>
                <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Icon color</p>
                <div className="flex flex-wrap gap-2">
                  {["bg-blue-600", "bg-emerald-600", "bg-violet-600", "bg-rose-600"].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setBadgeColor(color)}
                      className={cn("flex h-9 w-9 items-center justify-center rounded text-white", color, FOCUS_RING)}
                      aria-label={`Select ${color.replace("bg-", "").replace("-600", "")} badge color`}
                    >
                      {badgeColor === color ? <CheckCircle2 className="h-4 w-4" /> : <Palette className="h-4 w-4" />}
                    </button>
                  ))}
                </div>
              </div>
              <div className="grid gap-3 sm:grid-cols-3">
                {sampleBadges.map((badge) => (
                  <div key={badge.name} className="rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <div className={cn("mb-3 flex h-9 w-9 items-center justify-center rounded text-white", badge.name === "Design Thinker" ? badgeColor : badge.color)}>
                      <Award className="h-5 w-5" />
                    </div>
                    <p className="text-sm font-black text-slate-900 dark:text-white">{badge.name}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{badge.detail}</p>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard icon={Upload} title="FR-31 Drag-and-Drop File Uploader" eyebrow="Module materials">
            <div className="space-y-4">
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
                <p className="text-sm font-bold text-slate-700 dark:text-slate-200">Drag and drop files here</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">or click to browse</p>
              </div>
              <div className="space-y-2">
                <p className="text-xs font-black uppercase tracking-wide text-slate-500">Recent uploads</p>
                {uploadedFileList.map((file) => (
                  <div key={file.name} className="flex items-center justify-between rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{file.size} • {file.uploadedAt}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>
        </div>

        <FeatureCard icon={Users} title="FR-27 Printable Rosters" eyebrow="Class list">
          <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-slate-600 dark:text-slate-400">Section roster with initials avatars, contact details, and project groups.</p>
            <button type="button" onClick={() => window.print()} className={secondaryButton}>
              <Printer className="h-4 w-4" aria-hidden="true" />
              Print Roster
            </button>
          </div>
          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {roster.map((student) => (
              <div key={student.email} className="flex items-center gap-3 rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                <div className="flex h-10 w-10 flex-shrink-0 items-center justify-center rounded bg-orange-100 text-sm font-black text-orange-800 dark:bg-orange-900/40 dark:text-orange-200">
                  {student.name.split(" ").map((part) => part[0]).join("")}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-black text-slate-900 dark:text-white">{student.name}</p>
                  <p className="truncate text-xs text-slate-500 dark:text-slate-400">{student.email}</p>
                  <p className="mt-1 text-xs font-bold text-slate-600 dark:text-slate-300">{student.section}</p>
                </div>
              </div>
            ))}
          </div>
        </FeatureCard>

        <div className="grid gap-6 xl:grid-cols-2">
          <FeatureCard icon={LinkIcon} title="FR-20 Conditional Availability" eyebrow="Item unlocking">
            <div className="space-y-4">
              <p className="text-sm text-slate-600 dark:text-slate-400">Set prerequisites: students must complete Item A to unlock Item B.</p>
              <div className="space-y-3">
                {conditionalItems.map((item) => (
                  <div key={item.id} className="rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <div className="flex items-start gap-3">
                      <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-slate-200 dark:bg-slate-700">
                        {item.unlockedBy ? <Lock className="h-4 w-4 text-slate-600 dark:text-slate-400" /> : <CheckCircle2 className="h-4 w-4 text-emerald-600" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{item.name}</p>
                        <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">{item.type}</p>
                        {item.unlockedBy && (
                          <p className="text-xs text-blue-600 dark:text-blue-400 mt-1 flex items-center gap-1">
                            <Lock className="h-3 w-3" /> Unlocked by: {conditionalItems.find(i => i.id === item.unlockedBy)?.name}
                          </p>
                        )}
                        {item.unlocks.length > 0 && (
                          <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1">
                            <LinkIcon className="h-3 w-3" /> Unlocks: {item.unlocks.map(id => conditionalItems.find(i => i.id === id)?.name).join(", ")}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard icon={Users} title="FR-22 Peer Review Assignments" eyebrow="Random allocation">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Assignment
                <select className={inputClass}>
                  <option>Sprint Retrospective</option>
                  <option>Design Document</option>
                  <option>Test Plan Review</option>
                </select>
              </label>
              <button type="button" className={primaryButton}>
                <Users className="h-4 w-4" aria-hidden="true" />
                Auto-allocate Reviewers
              </button>
              <div className="overflow-hidden rounded border border-slate-200 dark:border-slate-700">
                <table className="w-full min-w-[28rem] text-left text-sm">
                  <thead className="bg-slate-50 text-xs font-black uppercase tracking-wide text-slate-500 dark:bg-slate-800">
                    <tr>
                      <th className="px-3 py-2">Reviewer</th>
                      <th className="px-3 py-2">Reviewee</th>
                      <th className="px-3 py-2">Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-200 dark:divide-slate-700">
                    {peerReviewAssignments.map((row) => (
                      <tr key={`${row.reviewer}-${row.reviewee}`}>
                        <td className="px-3 py-3 font-semibold text-slate-900 dark:text-white">{row.reviewer}</td>
                        <td className="px-3 py-3 text-slate-600 dark:text-slate-300">{row.reviewee}</td>
                        <td className="px-3 py-3">
                          <span className={cn(
                            "inline-flex items-center rounded px-2 py-1 text-xs font-black",
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
            </div>
          </FeatureCard>

          <FeatureCard icon={Copy} title="FR-26 Course Cloning Tool" eyebrow="Reuse content">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Select previous course
                <select 
                  className={inputClass}
                  value={selectedCourse ? previousCourses.indexOf(selectedCourse) : ""}
                  onChange={(e) => setSelectedCourse(e.target.value ? previousCourses[parseInt(e.target.value)] : null)}
                >
                  <option value="">Choose a course to clone...</option>
                  {previousCourses.map((course, idx) => (
                    <option key={course.name} value={idx}>
                      {course.name}
                    </option>
                  ))}
                </select>
              </label>
              {selectedCourse && (
                <div className="rounded border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                  <p className="text-sm text-blue-900 dark:text-blue-200">
                    <span className="font-bold">{selectedCourse.modules}</span> modules will be cloned from <span className="font-bold">{selectedCourse.lastOffered}</span>
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
                Clone Course Content
              </button>
            </div>
          </FeatureCard>
        </div>

        <div className="grid gap-6 xl:grid-cols-2">
          <FeatureCard icon={GitBranch} title="FR-28 Branching Modules" eyebrow="Scenario builder">
            <div className="space-y-4">
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Scenario title
                <input className={inputClass} defaultValue="Ambiguous Client Request" />
              </label>
              <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                Starting prompt
                <textarea
                  className={cn(inputClass, "min-h-24 resize-y")}
                  defaultValue="A stakeholder asks your team to add authentication, analytics, and messaging before the sprint demo."
                />
              </label>
              <div className="space-y-2">
                {branchingChoices.map((item) => (
                  <div key={item.choice} className="rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-800">
                    <p className="text-sm font-black text-slate-900 dark:text-white">{item.choice}</p>
                    <p className="mt-1 text-xs leading-5 text-slate-500 dark:text-slate-400">{item.outcome}</p>
                  </div>
                ))}
              </div>
            </div>
          </FeatureCard>

          <FeatureCard icon={FileText} title="FR-58 Rich Text Editor" eyebrow="Module instructions">
            <div className="space-y-4">
              <div className="flex flex-wrap gap-2" aria-label="Rich text toolbar">
                <ToolbarButton label="Bold" icon={Bold} onClick={() => formatEditor("bold")} />
                <ToolbarButton label="Italic" icon={Italic} onClick={() => formatEditor("italic")} />
                <ToolbarButton label="Bulleted list" icon={List} onClick={() => formatEditor("insertUnorderedList")} />
              </div>
              <div
                contentEditable
                suppressContentEditableWarning
                className={cn(inputClass, "min-h-40 leading-6")}
                aria-label="Module instructions editor"
              >
                <p><strong>Module brief:</strong> Create a sprint planning artifact that connects stakeholder needs to testable acceptance criteria.</p>
                <ul><li>Explain the risk behind each major requirement.</li><li>Link design decisions to course readings.</li></ul>
              </div>

              <section className="rounded border border-blue-200 bg-blue-50 p-4 dark:border-blue-900/60 dark:bg-blue-950/30">
                <div className="mb-3 flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-blue-700 dark:text-blue-300" aria-hidden="true" />
                  <h3 className="text-sm font-black text-slate-900 dark:text-white">FR-59 Requirements</h3>
                </div>
                <div className="grid gap-3 sm:grid-cols-2">
                  <RequirementField label="Page count" value="4-6 pages" />
                  <RequirementField label="Citation style" value="APA 7" />
                  <RequirementField label="File format" value="PDF or DOCX" />
                  <RequirementField label="Due constraints" value="Submit before demo day; one late token allowed" />
                </div>
              </section>
            </div>
          </FeatureCard>
        </div>
      </div>
    </div>
  );
}

const inputClass =
  "mt-1 w-full rounded border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 dark:border-slate-700 dark:bg-slate-950 dark:text-slate-100 dark:placeholder:text-slate-500";

const primaryButton = cn(
  "inline-flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700",
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

function Metric({ value, label }: { value: string; label: string }) {
  return (
    <div className="rounded border border-slate-200 bg-slate-50 px-4 py-3 dark:border-slate-700 dark:bg-slate-800">
      <p className="text-xl font-black text-slate-950 dark:text-white">{value}</p>
      <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">{label}</p>
    </div>
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

function ToolbarButton({
  label,
  icon: Icon,
  onClick,
}: {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
}) {
  return (
    <button type="button" onClick={onClick} className={secondaryButton} title={label} aria-label={label}>
      <Icon className="h-4 w-4" aria-hidden="true" />
      {label}
    </button>
  );
}

function RequirementField({ label, value }: { label: string; value: string }) {
  return (
    <label className="block text-xs font-black uppercase tracking-wide text-blue-900 dark:text-blue-200">
      {label}
      <input className={inputClass} defaultValue={value} />
    </label>
  );
}
