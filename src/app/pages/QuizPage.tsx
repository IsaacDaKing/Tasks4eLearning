import { useEffect, useMemo, useRef, useState } from "react";
import {
  AlertCircle,
  BookOpen,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Circle,
  Eye,
  Maximize2,
  Minimize2,
  RotateCcw,
  Settings,
  ShieldCheck,
  Timer,
  X,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type AssessmentType = "Quiz" | "Exam";
type QuestionType = "multiple-choice" | "true-false" | "fill-blank" | "short-answer" | "matching" | "ordering";
type AnswerValue = number | string | string[] | null;

interface Question {
  id: number;
  text: string;
  questionType?: QuestionType;
  options?: string[];
  choices?: string[];
  correct?: number | string | string[];
  reviewNote?: string;
}

interface Assessment {
  id: string;
  type: AssessmentType;
  title: string;
  courseCode: string;
  courseName: string;
  classSection: string;
  moduleTitle: string;
  dueDate: string;
  timeLimitMinutes: number;
  attemptsAllowed: number;
  attemptsUsed: number;
  coveredTopics: string[];
  technicalRequirements: string[];
  permittedResources: string[];
  academicIntegrityRules: string[];
  questions: Question[];
}

const ASSESSMENTS: Assessment[] = [
  {
    id: "cs4390-network-protocols",
    type: "Quiz",
    title: "Network Protocols Quiz",
    courseCode: "CS 4390.0W1",
    courseName: "Computer Networks",
    classSection: "CS 4390.0W1: Computer Networks",
    moduleTitle: "Module 2: TCP/IP Protocol Suite",
    dueDate: "May 9, 2026 at 11:59 PM",
    timeLimitMinutes: 30,
    attemptsAllowed: 2,
    attemptsUsed: 0,
    coveredTopics: ["OSI model", "TCP and UDP", "DNS", "IP addressing", "subnet masks"],
    technicalRequirements: [
      "Use a current browser with JavaScript enabled.",
      "Keep a stable internet connection for the full timed session.",
      "Screen reader labels are included for quiz controls and answer choices.",
    ],
    permittedResources: ["Course slides", "Personal notes", "Subnet reference chart"],
    academicIntegrityRules: [
      "Submit only your own answers.",
      "Do not share questions or answers with classmates during the assessment window.",
      "Do not use automated answer tools or outside messaging apps.",
    ],
    questions: [
      {
        id: 1,
        questionType: "multiple-choice",
        text: "Which layer of the OSI model is responsible for end-to-end communication and error recovery?",
        options: ["Network Layer", "Transport Layer", "Session Layer", "Application Layer"],
        correct: 1,
      },
      {
        id: 2,
        questionType: "multiple-choice",
        text: "What is the primary difference between TCP and UDP?",
        options: ["TCP is faster", "UDP is connection-oriented", "TCP provides reliable delivery", "UDP uses checksums"],
        correct: 2,
      },
      {
        id: 3,
        text: "Which protocol is used to translate domain names to IP addresses?",
        options: ["DHCP", "DNS", "HTTP", "FTP"],
        correct: 1,
      },
      {
        id: 4,
        questionType: "multiple-choice",
        text: "What is the default subnet mask for a Class C network?",
        options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
        correct: 2,
      },
      {
        id: 5,
        questionType: "true-false",
        text: "True or false: UDP guarantees delivery order for application messages.",
        options: ["True", "False"],
        correct: 1,
      },
      {
        id: 6,
        questionType: "fill-blank",
        text: "Fill in the blank: The protocol commonly used to automatically assign IP addresses is ____.",
        correct: "DHCP",
      },
      {
        id: 7,
        questionType: "matching",
        text: "Match each network term to its role.",
        options: ["DNS", "Router", "TCP"],
        choices: ["Reliable transport", "Forwards packets between networks", "Maps hostnames to IP addresses"],
        correct: ["Maps hostnames to IP addresses", "Forwards packets between networks", "Reliable transport"],
      },
    ],
  },
  {
    id: "cs3354-software-engineering",
    type: "Quiz",
    title: "Software Engineering Foundations Quiz",
    courseCode: "CS 3354.012",
    courseName: "Software Engineering",
    classSection: "CS 3354.012: Software Engineering",
    moduleTitle: "Module 4: Requirements, Design, and Delivery",
    dueDate: "May 13, 2026 at 2:00 PM",
    timeLimitMinutes: 35,
    attemptsAllowed: 2,
    attemptsUsed: 0,
    coveredTopics: ["Requirements", "user stories", "UML", "architecture", "testing", "traceability", "agile and scrum"],
    technicalRequirements: [
      "Use a laptop or desktop browser for diagram-heavy questions.",
      "Enable captions or transcripts for any referenced lecture media.",
      "Keyboard-only navigation and screen reader labels are available throughout the quiz.",
    ],
    permittedResources: ["Course textbook", "Instructor-provided UML notation guide", "Personal sprint notes"],
    academicIntegrityRules: [
      "Do not collaborate during the timed quiz.",
      "Use only permitted course materials.",
      "Do not copy user stories, acceptance criteria, or test cases from external sources.",
    ],
    questions: [
      {
        id: 1,
        questionType: "multiple-choice",
        text: "Which statement best describes a strong user story?",
        options: [
          "It describes a database table and every column type.",
          "It states a user role, goal, and reason for the value delivered.",
          "It lists only implementation tasks for developers.",
          "It replaces all acceptance criteria in the backlog.",
        ],
        correct: 1,
      },
      {
        id: 2,
        questionType: "multiple-choice",
        text: "What is the main purpose of requirements traceability?",
        options: [
          "To connect requirements to design, code, tests, and delivered features.",
          "To make sprint ceremonies shorter.",
          "To remove the need for stakeholder review.",
          "To guarantee every feature uses the same architecture pattern.",
        ],
        correct: 0,
      },
      {
        id: 3,
        questionType: "multiple-choice",
        text: "Which UML diagram is most appropriate for showing object interactions over time?",
        options: ["Class diagram", "Sequence diagram", "Deployment diagram", "Package diagram"],
        correct: 1,
      },
      {
        id: 4,
        questionType: "multiple-choice",
        text: "In Scrum, who is primarily responsible for ordering the product backlog?",
        options: ["Scrum Master", "Product Owner", "Development Team", "Project Sponsor"],
        correct: 1,
      },
      {
        id: 5,
        questionType: "multiple-choice",
        text: "Which testing level verifies that multiple components work together correctly?",
        options: ["Unit testing", "Integration testing", "Smoke testing", "Acceptance testing"],
        correct: 1,
      },
      {
        id: 6,
        questionType: "ordering",
        text: "Put these agile workflow steps in a practical order.",
        options: ["Implement and test", "Refine backlog item", "Review acceptance criteria", "Demo completed increment"],
        correct: ["Refine backlog item", "Review acceptance criteria", "Implement and test", "Demo completed increment"],
      },
      {
        id: 7,
        questionType: "short-answer",
        text: "In two or three sentences, explain why requirements traceability matters during testing.",
        reviewNote: "Manual review: look for a connection between requirements, tests, implementation, and stakeholder validation.",
      },
    ],
  },
  {
    id: "cs4347-database-systems",
    type: "Exam",
    title: "Database Systems Midterm Exam",
    courseCode: "CS 4347.002",
    courseName: "Database Systems",
    classSection: "CS 4347.002: Database Systems",
    moduleTitle: "Unit 5: Relational Modeling and Transactions",
    dueDate: "May 11, 2026 at 9:00 AM",
    timeLimitMinutes: 60,
    attemptsAllowed: 1,
    attemptsUsed: 0,
    coveredTopics: ["ER modeling", "SQL", "normalization", "joins", "keys", "transactions", "indexing", "ACID properties"],
    technicalRequirements: [
      "Use a current browser with pop-up blockers disabled for proctoring prompts.",
      "Keep one active browser instance for this exam account.",
      "Screen reader support, visible focus states, and high-contrast mode are available.",
    ],
    permittedResources: ["One page SQL syntax sheet", "Instructor-provided relational algebra reference"],
    academicIntegrityRules: [
      "This exam is individual and proctored.",
      "Do not log into the exam account from multiple browser instances.",
      "Do not use database consoles, AI tools, messaging apps, or external websites.",
    ],
    questions: [
      {
        id: 1,
        questionType: "multiple-choice",
        text: "Which normal form removes partial dependency on part of a composite key?",
        options: ["First normal form", "Second normal form", "Third normal form", "Boyce-Codd normal form"],
        correct: 1,
      },
      {
        id: 2,
        questionType: "multiple-choice",
        text: "Which SQL join returns matching rows plus unmatched rows from the left table?",
        options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"],
        correct: 1,
      },
      {
        id: 3,
        questionType: "multiple-choice",
        text: "In ER modeling, what does a foreign key usually represent in the relational schema?",
        options: [
          "A relationship between tables",
          "A column that must be unique in every row",
          "A derived attribute",
          "A physical index page",
        ],
        correct: 0,
      },
      {
        id: 4,
        questionType: "multiple-choice",
        text: "Which ACID property ensures committed data survives a system crash?",
        options: ["Atomicity", "Consistency", "Isolation", "Durability"],
        correct: 3,
      },
      {
        id: 5,
        questionType: "multiple-choice",
        text: "What is a common benefit of adding an index to a frequently searched column?",
        options: [
          "It can reduce lookup time for matching rows.",
          "It always reduces write cost.",
          "It eliminates the need for primary keys.",
          "It prevents all transaction conflicts.",
        ],
        correct: 0,
      },
      {
        id: 6,
        questionType: "fill-blank",
        text: "Fill in the blank: The ACID property that prevents partial transaction completion is ____.",
        correct: "Atomicity",
      },
      {
        id: 7,
        questionType: "matching",
        text: "Match each database concept to its description.",
        options: ["Primary key", "Foreign key", "Index"],
        choices: ["Speeds lookup on selected columns", "Uniquely identifies a row", "References a row in another table"],
        correct: ["Uniquely identifies a row", "References a row in another table", "Speeds lookup on selected columns"],
      },
    ],
  },
];

const FOCUS_RING = "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 dark:focus-visible:ring-offset-slate-900";

export function QuizPage() {
  const [selectedAssessmentId, setSelectedAssessmentId] = useState(ASSESSMENTS[0].id);
  const assessment = useMemo(
    () => ASSESSMENTS.find((item) => item.id === selectedAssessmentId) ?? ASSESSMENTS[0],
    [selectedAssessmentId],
  );
  const [showAccessibility, setShowAccessibility] = useState(false);
  const [fontScale, setFontScale] = useState(100);
  const [highContrast, setHighContrast] = useState(false);
  const [dyslexiaFont, setDyslexiaFont] = useState(false);
  const [focusMode, setFocusMode] = useState(true);
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<AnswerValue[]>(new Array(assessment.questions.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(assessment.timeLimitMinutes * 60);
  const [lockMessage, setLockMessage] = useState("");
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const sessionIdRef = useRef(`quiz-session-${Date.now()}-${Math.random().toString(16).slice(2)}`);

  useEffect(() => {
    setStarted(false);
    setSubmitted(false);
    setCurrentQ(0);
    setAnswers(new Array(assessment.questions.length).fill(null));
    setTimeLeft(assessment.timeLimitMinutes * 60);
    setFocusMode(true);
    setLockMessage("");
  }, [assessment]);

  useEffect(() => {
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((time) => {
          if (time <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setSubmitted(true);
            releaseExamLock();
            return 0;
          }
          return time - 1;
        });
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [started, submitted]);

  useEffect(() => {
    const handleUnload = () => releaseExamLock();
    window.addEventListener("beforeunload", handleUnload);
    return () => {
      window.removeEventListener("beforeunload", handleUnload);
      releaseExamLock();
    };
  }, [selectedAssessmentId]);

  const releaseExamLock = () => {
    if (assessment.type !== "Exam") return;
    const lockKey = getExamLockKey(assessment.id);
    if (localStorage.getItem(lockKey) === sessionIdRef.current) {
      localStorage.removeItem(lockKey);
    }
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
  };

  const autoScoredQuestions = assessment.questions.filter((question) => getQuestionType(question) !== "short-answer");
  const score = answers.reduce(
    (acc, answer, index) => acc + (isAnswerCorrect(assessment.questions[index], answer) ? 1 : 0),
    0,
  );
  const percent = Math.round((score / Math.max(1, autoScoredQuestions.length)) * 100);

  const startAssessment = () => {
    if (assessment.type === "Exam") {
      const lockKey = getExamLockKey(assessment.id);
      const existingSession = localStorage.getItem(lockKey);
      if (existingSession && existingSession !== sessionIdRef.current) {
        setLockMessage("This exam account is already active in another browser instance. Close the other instance before starting.");
        return;
      }
      localStorage.setItem(lockKey, sessionIdRef.current);
    }

    setStarted(true);
    setFocusMode(true);
    setLockMessage("");
  };

  const resetAssessment = () => {
    releaseExamLock();
    setStarted(false);
    setSubmitted(false);
    setAnswers(new Array(assessment.questions.length).fill(null));
    setCurrentQ(0);
    setTimeLeft(assessment.timeLimitMinutes * 60);
    setFocusMode(true);
  };

  const submitAssessment = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setSubmitted(true);
    setFocusMode(false);
    releaseExamLock();
  };

  const pageStyle = {
    fontSize: `${fontScale}%`,
    fontFamily: dyslexiaFont ? '"Trebuchet MS", Verdana, Arial, sans-serif' : undefined,
  };

  const shellClasses = cn(
    "min-h-full p-4 sm:p-8 animate-in fade-in duration-500",
    highContrast ? "bg-black text-white" : "bg-slate-100 dark:bg-slate-900",
    started && focusMode && "fixed inset-0 z-50 overflow-y-auto",
  );

  if (submitted) {
    return (
      <div className={shellClasses} style={pageStyle}>
        <div className={cn("mx-auto max-w-3xl rounded border p-6 text-center shadow-sm", highContrast ? "border-white bg-black" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800")}>
          <div
            className={cn(
              "mx-auto mb-5 flex h-20 w-20 items-center justify-center rounded-full",
              percent >= 70 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30",
            )}
          >
            <span className={cn("text-2xl font-black", percent >= 70 ? "text-green-600" : "text-red-600")}>{percent}%</span>
          </div>
          <h1 className={cn("mb-2 text-3xl font-black", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>
            {percent >= 70 ? "Great job!" : "Keep practicing!"}
          </h1>
          <p className={cn("mb-8 text-sm", highContrast ? "text-white" : "text-slate-500 dark:text-slate-400")} aria-live="polite">
            You scored <strong>{score} out of {autoScoredQuestions.length}</strong> auto-scored points on {assessment.title}.
          </p>

          <div className="mb-8 space-y-3 text-left">
            {assessment.questions.map((question, index) => {
              const userAnswer = answers[index];
              const isManualReview = getQuestionType(question) === "short-answer";
              const isCorrect = isAnswerCorrect(question, userAnswer);
              return (
                <div
                  key={question.id}
                  className={cn(
                    "rounded border p-4",
                    highContrast
                      ? "border-white bg-black"
                      : isCorrect
                        ? "border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20"
                        : "border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-900/20",
                  )}
                >
                  <div className="flex items-start gap-3">
                    {isManualReview ? (
                      <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-amber-600" />
                    ) : isCorrect ? (
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    )}
                    <div>
                      <p className={cn("mb-1 text-sm font-bold", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{question.text}</p>
                      {isManualReview ? (
                        <p className={cn("text-xs", highContrast ? "text-white" : "text-amber-700 dark:text-amber-400")}>
                          {question.reviewNote ?? "This response is marked for manual review."}
                        </p>
                      ) : !isCorrect && (
                        <p className={cn("text-xs", highContrast ? "text-white" : "text-green-700 dark:text-green-400")}>
                          Correct: {formatCorrectAnswer(question)}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button onClick={resetAssessment} className={cn("mx-auto flex items-center gap-2 rounded px-6 py-3 font-bold text-white transition-all", FOCUS_RING, "bg-blue-600 hover:bg-blue-700")}>
            <RotateCcw className="h-4 w-4" /> Retake {assessment.type}
          </button>
        </div>
      </div>
    );
  }

  if (!started) {
    return (
      <div className={shellClasses} style={pageStyle}>
        <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[280px_minmax(0,1fr)]">
          <aside className={cn("rounded border p-4 shadow-sm", highContrast ? "border-white bg-black" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800")}>
            <h2 className={cn("mb-3 text-sm font-black uppercase tracking-wide", highContrast ? "text-white" : "text-slate-500 dark:text-slate-400")}>
              Assessments
            </h2>
            <div className="space-y-2" role="list" aria-label="Selectable course assessments">
              {ASSESSMENTS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => setSelectedAssessmentId(item.id)}
                  className={cn(
                    "w-full rounded border p-3 text-left transition-all",
                    FOCUS_RING,
                    selectedAssessmentId === item.id
                      ? highContrast
                        ? "border-white bg-white text-black"
                        : "border-blue-600 bg-blue-50 text-blue-950 dark:bg-blue-900/30 dark:text-blue-100"
                      : highContrast
                        ? "border-white bg-black text-white hover:bg-white hover:text-black"
                        : "border-slate-200 text-slate-700 hover:border-blue-300 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700",
                  )}
                >
                  <span className="block text-xs font-black uppercase tracking-wide">{item.type}</span>
                  <span className="block text-sm font-bold">{item.courseCode}</span>
                  <span className="block text-xs">{item.courseName}</span>
                </button>
              ))}
            </div>
          </aside>

          <main className={cn("rounded border p-6 shadow-sm", highContrast ? "border-white bg-black" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800")}>
            <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
              <div>
                <div className={cn("mb-3 flex items-center gap-2 text-sm font-bold", highContrast ? "text-white" : "text-slate-500 dark:text-slate-400")}>
                  <BookOpen className="h-4 w-4" />
                  {assessment.courseCode} - {assessment.courseName}
                </div>
                <p className={cn("mb-1 text-sm", highContrast ? "text-white" : "text-slate-400 dark:text-slate-500")}>{assessment.moduleTitle}</p>
                <h1 className={cn("text-3xl font-black", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{assessment.title}</h1>
              </div>
              <button
                type="button"
                onClick={() => setShowAccessibility((value) => !value)}
                className={cn("inline-flex items-center justify-center gap-2 rounded border px-4 py-2 text-sm font-bold transition-colors", FOCUS_RING, highContrast ? "border-white text-white hover:bg-white hover:text-black" : "border-slate-200 text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-700")}
                aria-expanded={showAccessibility}
              >
                <Settings className="h-4 w-4" /> Accessibility Settings
              </button>
            </div>

            <AccessibilityPanel
              show={showAccessibility}
              fontScale={fontScale}
              setFontScale={setFontScale}
              highContrast={highContrast}
              setHighContrast={setHighContrast}
              dyslexiaFont={dyslexiaFont}
              setDyslexiaFont={setDyslexiaFont}
            />

            <section className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4" aria-label="Assessment summary">
              <InfoTile label="Class" value={assessment.classSection} highContrast={highContrast} />
              <InfoTile label="Assessment Type" value={assessment.type} highContrast={highContrast} badge />
              <InfoTile label="Due Date" value={assessment.dueDate} highContrast={highContrast} />
              <InfoTile label="Time Limit" value={`${assessment.timeLimitMinutes} minutes`} highContrast={highContrast} />
              <InfoTile label="Allowed Attempts" value={`${assessment.attemptsUsed} of ${assessment.attemptsAllowed} used`} highContrast={highContrast} />
              <InfoTile label="Questions" value={`${assessment.questions.length} sample questions`} highContrast={highContrast} />
            </section>

            <div className="grid gap-4 lg:grid-cols-2">
              <InstructionList title="Covered Topics" items={assessment.coveredTopics} highContrast={highContrast} />
              <InstructionList title="Technical Requirements" items={assessment.technicalRequirements} highContrast={highContrast} />
              <InstructionList title="Permitted Resources" items={assessment.permittedResources} highContrast={highContrast} />
              <InstructionList title="Academic Integrity Rules" items={assessment.academicIntegrityRules} highContrast={highContrast} />
            </div>

            <div className={cn("mt-6 rounded border p-4 text-sm", highContrast ? "border-white bg-black text-white" : "border-blue-200 bg-blue-50 text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200")}>
              <div className="flex items-start gap-3">
                <Maximize2 className="mt-0.5 h-4 w-4 flex-shrink-0" />
                <div>
                  <p className="font-bold">Focus Mode starts automatically</p>
                  <p>Non-essential widgets and navigation are hidden during assessment taking. You can exit Focus Mode from the assessment banner.</p>
                </div>
              </div>
            </div>

            {assessment.type === "Exam" && (
              <div className={cn("mt-4 rounded border p-4 text-sm", highContrast ? "border-white bg-black text-white" : "border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200")}>
                <div className="flex items-start gap-3">
                  <ShieldCheck className="mt-0.5 h-4 w-4 flex-shrink-0" />
                  <p>This exam checks for another active instance of the same exam-taking account before starting.</p>
                </div>
              </div>
            )}

            {lockMessage && (
              <div className="mt-4 flex items-start gap-2 rounded border border-red-200 bg-red-50 p-4 text-sm font-bold text-red-700" role="alert">
                <AlertCircle className="mt-0.5 h-4 w-4 flex-shrink-0" /> {lockMessage}
              </div>
            )}

            <button
              type="button"
              onClick={startAssessment}
              className={cn("mt-6 w-full rounded bg-blue-600 py-4 font-black text-white shadow-lg shadow-blue-200 transition-all hover:bg-blue-700 active:scale-[0.99] dark:shadow-blue-900/40", FOCUS_RING)}
            >
              Start Assessment
            </button>
          </main>
        </div>
      </div>
    );
  }

  const currentQuestion = assessment.questions[currentQ];

  return (
    <div className={shellClasses} style={pageStyle}>
      <div className="mx-auto max-w-3xl">
        <AnimatePresence>
          {focusMode && (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mb-4 flex flex-col gap-3 rounded bg-slate-900 px-4 py-3 text-sm text-white sm:flex-row sm:items-center sm:justify-between"
            >
              <div className="flex items-center gap-2 font-bold">
                <Maximize2 className="h-4 w-4" /> Focus Mode active
              </div>
              <button onClick={() => setFocusMode(false)} className={cn("flex items-center gap-1 text-xs font-bold text-slate-300 transition-colors hover:text-white", FOCUS_RING)}>
                <Minimize2 className="h-3.5 w-3.5" /> Exit Focus Mode
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className={cn("overflow-hidden rounded border shadow-sm", highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-white dark:border-slate-700 dark:bg-slate-800")}>
          <div className={cn("flex items-center justify-between border-b px-6 py-4", highContrast ? "border-white bg-black" : "border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/60")}>
            <div>
              <p className={cn("text-xs font-black uppercase tracking-widest", highContrast ? "text-white" : "text-slate-400")}>
                {assessment.courseCode} - {assessment.type}
              </p>
              <p className={cn("text-sm font-bold", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{assessment.title}</p>
            </div>
            <div
              className={cn(
                "flex items-center gap-2 rounded px-4 py-2 text-sm font-black",
                timeLeft < 120 ? "bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400" : "bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400",
              )}
              aria-live="polite"
            >
              <Timer className="h-4 w-4" />
              {formatTime(timeLeft)}
            </div>
          </div>

          <div className={cn("h-1.5", highContrast ? "bg-white" : "bg-slate-100 dark:bg-slate-700")}>
            <div className={cn("h-full transition-all duration-300", highContrast ? "bg-yellow-300" : "bg-blue-600")} style={{ width: `${((currentQ + 1) / assessment.questions.length) * 100}%` }} />
          </div>

          <div className="p-6 sm:p-8">
            <div className="mb-6 flex items-start gap-3">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">{currentQ + 1}</span>
              <p className={cn("text-lg font-bold", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{currentQuestion.text}</p>
            </div>

            <QuestionAnswerControl
              question={currentQuestion}
              questionNumber={currentQ + 1}
              answer={answers[currentQ]}
              setAnswer={(value) => {
                const newAnswers = [...answers];
                newAnswers[currentQ] = value;
                setAnswers(newAnswers);
              }}
              highContrast={highContrast}
            />
          </div>

          <div className="flex flex-col gap-4 px-6 pb-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
            <button
              type="button"
              onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
              disabled={currentQ === 0}
              className={cn("flex items-center justify-center gap-2 rounded border px-4 py-2.5 text-sm font-bold transition-all disabled:opacity-40", FOCUS_RING, highContrast ? "border-white text-white hover:bg-white hover:text-black" : "border-slate-200 text-slate-600 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-400 dark:hover:bg-slate-700")}
            >
              <ChevronLeft className="h-4 w-4" /> Previous
            </button>

            <div className="flex justify-center gap-1.5" aria-label="Question navigation">
              {assessment.questions.map((question, index) => (
                <button
                  key={question.id}
                  type="button"
                  onClick={() => setCurrentQ(index)}
                  className={cn(
                    "h-8 w-8 rounded text-xs font-black transition-all",
                    FOCUS_RING,
                    index === currentQ
                      ? "bg-blue-600 text-white"
                      : answers[index] !== null
                        ? "bg-blue-100 text-blue-600 dark:bg-blue-900/40 dark:text-blue-400"
                        : highContrast
                          ? "border border-white bg-black text-white"
                          : "bg-slate-100 text-slate-400 dark:bg-slate-700 dark:text-slate-500",
                  )}
                  aria-label={`Go to question ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            {currentQ < assessment.questions.length - 1 ? (
              <button type="button" onClick={() => setCurrentQ(currentQ + 1)} className={cn("flex items-center justify-center gap-2 rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-blue-700", FOCUS_RING)}>
                Next <ChevronRight className="h-4 w-4" />
              </button>
            ) : (
              <button type="button" onClick={submitAssessment} className={cn("flex items-center justify-center gap-2 rounded bg-green-600 px-4 py-2.5 text-sm font-bold text-white transition-all hover:bg-green-700", FOCUS_RING)}>
                <CheckCircle className="h-4 w-4" /> Submit {assessment.type}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function getExamLockKey(assessmentId: string) {
  return `assessment-lock:${assessmentId}:CXS224467`;
}

function getQuestionType(question: Question): QuestionType {
  return question.questionType ?? "multiple-choice";
}

function normalizeAnswer(value: string) {
  return value.trim().toLowerCase();
}

function isAnswerCorrect(question: Question, answer: AnswerValue) {
  const type = getQuestionType(question);
  if (type === "short-answer" || answer === null || answer === undefined) return false;

  if (type === "multiple-choice" || type === "true-false") {
    return typeof answer === "number" && answer === question.correct;
  }

  if (type === "fill-blank") {
    return typeof answer === "string" && typeof question.correct === "string" && normalizeAnswer(answer) === normalizeAnswer(question.correct);
  }

  if ((type === "matching" || type === "ordering") && Array.isArray(answer) && Array.isArray(question.correct)) {
    return question.correct.length === answer.length && question.correct.every((item, index) => item === answer[index]);
  }

  return false;
}

function formatCorrectAnswer(question: Question) {
  const type = getQuestionType(question);
  if ((type === "multiple-choice" || type === "true-false") && typeof question.correct === "number") {
    return question.options?.[question.correct] ?? "Review the course materials";
  }
  if (typeof question.correct === "string") return question.correct;
  if (Array.isArray(question.correct)) return question.correct.join(" -> ");
  return "Manual review";
}

function QuestionAnswerControl({
  question,
  questionNumber,
  answer,
  setAnswer,
  highContrast,
}: {
  question: Question;
  questionNumber: number;
  answer: AnswerValue;
  setAnswer: (value: AnswerValue) => void;
  highContrast: boolean;
}) {
  const type = getQuestionType(question);
  const options = question.options ?? [];

  if (type === "fill-blank") {
    return (
      <input
        type="text"
        value={typeof answer === "string" ? answer : ""}
        onChange={(event) => setAnswer(event.target.value)}
        className={cn("w-full rounded border-2 p-4 text-sm font-medium", FOCUS_RING, highContrast ? "border-white bg-black text-white" : "border-slate-200 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white")}
        aria-label={`Question ${questionNumber} fill in the blank answer`}
      />
    );
  }

  if (type === "short-answer") {
    return (
      <textarea
        value={typeof answer === "string" ? answer : ""}
        onChange={(event) => setAnswer(event.target.value)}
        rows={5}
        className={cn("w-full resize-y rounded border-2 p-4 text-sm font-medium", FOCUS_RING, highContrast ? "border-white bg-black text-white" : "border-slate-200 text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white")}
        aria-label={`Question ${questionNumber} short answer response`}
      />
    );
  }

  if (type === "matching" || type === "ordering") {
    const current = Array.isArray(answer) ? answer : new Array(options.length).fill("");
    const choices = type === "matching" ? (question.choices ?? []) : options;
    return (
      <div className="space-y-3" aria-label={`Question ${questionNumber} ${type} responses`}>
        {options.map((option, index) => (
          <label key={`${option}-${index}`} className={cn("block rounded border p-3 text-sm font-bold", highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-slate-50 text-slate-800 dark:border-slate-700 dark:bg-slate-900 dark:text-white")}>
            <span className="mb-2 block">{type === "ordering" ? `Position ${index + 1}` : option}</span>
            <select
              value={current[index] ?? ""}
              onChange={(event) => {
                const next = [...current];
                next[index] = event.target.value;
                setAnswer(next);
              }}
              className={cn("w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900", FOCUS_RING)}
            >
              <option value="">Select...</option>
              {choices.map((choice) => (
                <option key={choice} value={choice}>{choice}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-3" role="radiogroup" aria-label={`Question ${questionNumber} answer choices`}>
      {options.map((option, index) => {
        const selected = answer === index;
        return (
          <button
            key={option}
            type="button"
            role="radio"
            aria-checked={selected}
            onClick={() => setAnswer(index)}
            className={cn(
              "w-full rounded border-2 p-4 text-left text-sm font-medium transition-all",
              FOCUS_RING,
              selected
                ? highContrast
                  ? "border-yellow-300 bg-white text-black"
                  : "border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200"
                : highContrast
                  ? "border-white bg-black text-white hover:bg-white hover:text-black"
                  : "border-slate-200 text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-600",
            )}
          >
            <span className="flex items-center gap-3">
              {selected ? <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600" /> : <Circle className="h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600" />}
              {option}
            </span>
          </button>
        );
      })}
    </div>
  );
}

function AccessibilityPanel({
  show,
  fontScale,
  setFontScale,
  highContrast,
  setHighContrast,
  dyslexiaFont,
  setDyslexiaFont,
}: {
  show: boolean;
  fontScale: number;
  setFontScale: (value: number) => void;
  highContrast: boolean;
  setHighContrast: (value: boolean) => void;
  dyslexiaFont: boolean;
  setDyslexiaFont: (value: boolean) => void;
}) {
  if (!show) return null;

  return (
    <section className={cn("mb-6 rounded border p-4", highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50")} aria-label="Accessibility settings">
      <div className={cn("mb-4 flex items-center gap-2 text-sm font-black", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>
        <Eye className="h-4 w-4" /> Accessibility Settings
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        <label className={cn("text-sm font-bold", highContrast ? "text-white" : "text-slate-700 dark:text-slate-200")}>
          Font size
          <input
            type="range"
            min="90"
            max="130"
            step="10"
            value={fontScale}
            onChange={(event) => setFontScale(Number(event.target.value))}
            className={cn("mt-2 w-full accent-blue-600", FOCUS_RING)}
          />
          <span className={cn("mt-1 block text-xs", highContrast ? "text-white" : "text-slate-500")}>{fontScale}%</span>
        </label>
        <ToggleControl label="High contrast" checked={highContrast} onChange={setHighContrast} highContrast={highContrast} />
        <ToggleControl label="Dyslexia-friendly font" checked={dyslexiaFont} onChange={setDyslexiaFont} highContrast={highContrast} />
      </div>
    </section>
  );
}

function ToggleControl({ label, checked, onChange, highContrast }: { label: string; checked: boolean; onChange: (value: boolean) => void; highContrast: boolean }) {
  return (
    <label className={cn("flex items-center justify-between gap-3 rounded border px-3 py-2 text-sm font-bold", highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-white text-slate-700 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200")}>
      {label}
      <input type="checkbox" checked={checked} onChange={(event) => onChange(event.target.checked)} className={cn("h-5 w-5 accent-blue-600", FOCUS_RING)} />
    </label>
  );
}

function InfoTile({ label, value, highContrast, badge = false }: { label: string; value: string; highContrast: boolean; badge?: boolean }) {
  return (
    <div className={cn("rounded border p-4", highContrast ? "border-white bg-black text-white" : "border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50")}>
      <p className={cn("mb-2 text-xs font-black uppercase tracking-wide", highContrast ? "text-white" : "text-slate-500 dark:text-slate-400")}>{label}</p>
      {badge ? (
        <span className="inline-flex rounded-full bg-yellow-400 px-3 py-1 text-xs font-black uppercase tracking-wide text-yellow-900">{value}</span>
      ) : (
        <p className={cn("text-sm font-black", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{value}</p>
      )}
    </div>
  );
}

function InstructionList({ title, items, highContrast }: { title: string; items: string[]; highContrast: boolean }) {
  return (
    <section className={cn("rounded border p-4", highContrast ? "border-white bg-black text-white" : "border-slate-100 bg-slate-50 dark:border-slate-700 dark:bg-slate-900/50")}>
      <h2 className={cn("mb-3 text-sm font-black", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{title}</h2>
      <ul className={cn("space-y-2 text-sm", highContrast ? "text-white" : "text-slate-600 dark:text-slate-300")}>
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span aria-hidden="true">-</span>
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
