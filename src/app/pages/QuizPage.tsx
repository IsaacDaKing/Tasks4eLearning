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
type QuestionType = "multipleChoice" | "trueFalse" | "fillBlank" | "shortAnswer" | "matching" | "ordering";
type AnswerValue = number | boolean | string | Record<string, string> | string[] | null;

interface BaseQuestion {
  id: number;
  questionType: QuestionType;
  text: string;
}

interface MultipleChoiceQuestion extends BaseQuestion {
  questionType: "multipleChoice";
  options: string[];
  correct: number;
}

interface TrueFalseQuestion extends BaseQuestion {
  questionType: "trueFalse";
  correct: boolean;
}

interface FillBlankQuestion extends BaseQuestion {
  questionType: "fillBlank";
  acceptedAnswers: string[];
}

interface ShortAnswerQuestion extends BaseQuestion {
  questionType: "shortAnswer";
  keywords: string[];
  manualReview?: boolean;
}

interface MatchingQuestion extends BaseQuestion {
  questionType: "matching";
  pairs: Array<{ prompt: string; answer: string }>;
  choices: string[];
}

interface OrderingQuestion extends BaseQuestion {
  questionType: "ordering";
  items: string[];
  correctOrder: string[];
}

type Question =
  | MultipleChoiceQuestion
  | TrueFalseQuestion
  | FillBlankQuestion
  | ShortAnswerQuestion
  | MatchingQuestion
  | OrderingQuestion;

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
    dueDate: "February 17, 2026 at 11:59 PM",
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
        questionType: "multipleChoice",
        text: "Which layer of the OSI model is responsible for end-to-end communication and error recovery?",
        options: ["Network Layer", "Transport Layer", "Session Layer", "Application Layer"],
        correct: 1,
      },
      {
        id: 2,
        questionType: "trueFalse",
        text: "TCP establishes a connection before sending application data.",
        correct: true,
      },
      {
        id: 3,
        questionType: "fillBlank",
        text: "Which protocol is used to translate domain names to IP addresses?",
        acceptedAnswers: ["DNS", "Domain Name System"],
      },
      {
        id: 4,
        questionType: "matching",
        text: "Match each networking term with its best description.",
        pairs: [
          { prompt: "DNS", answer: "Resolves names to IP addresses" },
          { prompt: "UDP", answer: "Connectionless transport protocol" },
          { prompt: "Subnet mask", answer: "Splits network and host portions" },
        ],
        choices: ["Connectionless transport protocol", "Splits network and host portions", "Resolves names to IP addresses"],
      },
      {
        id: 5,
        questionType: "ordering",
        text: "Place these TCP connection setup steps in order.",
        items: ["ACK", "SYN-ACK", "SYN"],
        correctOrder: ["SYN", "SYN-ACK", "ACK"],
      },
      {
        id: 6,
        questionType: "multipleChoice",
        text: "What is the default subnet mask for a Class C network?",
        options: ["255.0.0.0", "255.255.0.0", "255.255.255.0", "255.255.255.255"],
        correct: 2,
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
    dueDate: "February 19, 2026 at 2:00 PM",
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
        questionType: "multipleChoice",
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
        questionType: "trueFalse",
        text: "Requirements traceability connects requirements to design, implementation, tests, and delivered features.",
        correct: true,
      },
      {
        id: 3,
        questionType: "multipleChoice",
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
        id: 4,
        questionType: "fillBlank",
        text: "Which UML diagram is most appropriate for showing object interactions over time?",
        acceptedAnswers: ["sequence diagram", "UML sequence diagram"],
      },
      {
        id: 5,
        questionType: "shortAnswer",
        text: "In one or two sentences, describe what acceptance criteria should clarify for a user story.",
        keywords: ["conditions", "done", "expected", "behavior"],
        manualReview: true,
      },
      {
        id: 6,
        questionType: "matching",
        text: "Match each Software Engineering artifact to its purpose.",
        pairs: [
          { prompt: "User story", answer: "Captures role, goal, and value" },
          { prompt: "Sequence diagram", answer: "Shows interactions over time" },
          { prompt: "Test case", answer: "Verifies expected behavior" },
        ],
        choices: ["Shows interactions over time", "Verifies expected behavior", "Captures role, goal, and value"],
      },
      {
        id: 7,
        questionType: "ordering",
        text: "Order these lightweight delivery steps for a small feature.",
        items: ["Write or update tests", "Clarify requirement", "Implement feature", "Review acceptance criteria"],
        correctOrder: ["Clarify requirement", "Review acceptance criteria", "Implement feature", "Write or update tests"],
      },
      {
        id: 8,
        questionType: "multipleChoice",
        text: "In Scrum, who is primarily responsible for ordering the product backlog?",
        options: ["Scrum Master", "Product Owner", "Development Team", "Project Sponsor"],
        correct: 1,
      },
      {
        id: 9,
        questionType: "multipleChoice",
        text: "Which testing level verifies that multiple components work together correctly?",
        options: ["Unit testing", "Integration testing", "Smoke testing", "Acceptance testing"],
        correct: 1,
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
    dueDate: "February 21, 2026 at 9:00 AM",
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
        questionType: "multipleChoice",
        text: "Which normal form removes partial dependency on part of a composite key?",
        options: ["First normal form", "Second normal form", "Third normal form", "Boyce-Codd normal form"],
        correct: 1,
      },
      {
        id: 2,
        questionType: "multipleChoice",
        text: "Which SQL join returns matching rows plus unmatched rows from the left table?",
        options: ["INNER JOIN", "LEFT JOIN", "CROSS JOIN", "SELF JOIN"],
        correct: 1,
      },
      {
        id: 3,
        questionType: "trueFalse",
        text: "A foreign key commonly represents a relationship between tables in a relational schema.",
        correct: true,
      },
      {
        id: 4,
        questionType: "fillBlank",
        text: "Which ACID property ensures committed data survives a system crash?",
        acceptedAnswers: ["durability"],
      },
      {
        id: 5,
        questionType: "shortAnswer",
        text: "Briefly explain why normalization can reduce update anomalies.",
        keywords: ["redundancy", "duplicate", "dependency", "consistent"],
        manualReview: true,
      },
      {
        id: 6,
        questionType: "matching",
        text: "Match each database concept to its purpose.",
        pairs: [
          { prompt: "Primary key", answer: "Uniquely identifies a row" },
          { prompt: "Index", answer: "Speeds up lookup on selected columns" },
          { prompt: "Transaction", answer: "Groups operations into one logical unit" },
        ],
        choices: ["Groups operations into one logical unit", "Uniquely identifies a row", "Speeds up lookup on selected columns"],
      },
      {
        id: 7,
        questionType: "ordering",
        text: "Order these SQL clauses as they typically appear in a simple query.",
        items: ["WHERE", "SELECT", "FROM", "ORDER BY"],
        correctOrder: ["SELECT", "FROM", "WHERE", "ORDER BY"],
      },
      {
        id: 8,
        questionType: "multipleChoice",
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
        id: 9,
        questionType: "multipleChoice",
        text: "What is a common benefit of adding an index to a frequently searched column?",
        options: [
          "It can reduce lookup time for matching rows.",
          "It always reduces write cost.",
          "It eliminates the need for primary keys.",
          "It prevents all transaction conflicts.",
        ],
        correct: 0,
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

  const gradedQuestions = assessment.questions.filter((question) => !isManualReview(question));
  const score = answers.reduce(
    (acc, answer, index) => acc + (isAnswerCorrect(assessment.questions[index], answer) ? 1 : 0),
    0,
  );
  const manualReviewCount = assessment.questions.length - gradedQuestions.length;
  const percent = Math.round((score / Math.max(gradedQuestions.length, 1)) * 100);

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
            You scored <strong>{score} out of {gradedQuestions.length}</strong> auto-graded points on {assessment.title}.
            {manualReviewCount > 0 && <span> {manualReviewCount} short answer {manualReviewCount === 1 ? "response is" : "responses are"} marked for Manual review.</span>}
          </p>

          <div className="mb-8 space-y-3 text-left">
            {assessment.questions.map((question, index) => {
              const userAnswer = answers[index];
              const manualReview = isManualReview(question);
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
                    {manualReview ? (
                      <BookOpen className="mt-0.5 h-4 w-4 flex-shrink-0 text-blue-600" />
                    ) : isCorrect ? (
                      <CheckCircle className="mt-0.5 h-4 w-4 flex-shrink-0 text-green-600" />
                    ) : (
                      <X className="mt-0.5 h-4 w-4 flex-shrink-0 text-red-600" />
                    )}
                    <div>
                      <div className="mb-1 flex flex-wrap items-center gap-2">
                        <p className={cn("text-sm font-bold", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{question.text}</p>
                        <QuestionTypeBadge questionType={question.questionType} highContrast={highContrast} />
                      </div>
                      {manualReview ? (
                        <p className={cn("text-xs font-bold", highContrast ? "text-white" : "text-blue-700 dark:text-blue-300")}>
                          Manual review: this response is not included in the auto-graded score.
                        </p>
                      ) : !isCorrect && (
                        <p className={cn("text-xs", highContrast ? "text-white" : "text-green-700 dark:text-green-400")}>
                          Correct: {getCorrectAnswerLabel(question)}
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
              <InfoTile label="Questions" value={`${assessment.questions.length} mixed questions`} highContrast={highContrast} />
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

          <div className="p-5 sm:p-6">
            <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
              <div className="flex items-start gap-3">
                <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-blue-600 text-xs font-black text-white">{currentQ + 1}</span>
                <div>
                  <div className="mb-2 flex flex-wrap items-center gap-2">
                    <span className={cn("text-xs font-black uppercase tracking-wide", highContrast ? "text-white" : "text-slate-500 dark:text-slate-400")}>
                      Question {currentQ + 1} of {assessment.questions.length}
                    </span>
                    <QuestionTypeBadge questionType={currentQuestion.questionType} highContrast={highContrast} />
                  </div>
                  <p className={cn("text-lg font-bold leading-relaxed", highContrast ? "text-white" : "text-slate-900 dark:text-white")}>{currentQuestion.text}</p>
                </div>
              </div>
              {isManualReview(currentQuestion) && (
                <span className={cn("rounded border px-2.5 py-1 text-xs font-black", highContrast ? "border-white text-white" : "border-blue-200 bg-blue-50 text-blue-700 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-300")}>
                  Manual review
                </span>
              )}
            </div>

            <QuestionResponse
              question={currentQuestion}
              answer={answers[currentQ]}
              setAnswer={(answer) => {
                const newAnswers = [...answers];
                newAnswers[currentQ] = answer;
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
                    : hasAnswer(answers[index])
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
  return `assessment-lock:${assessmentId}:ZXT220067`;
}

function questionTypeLabel(questionType: QuestionType) {
  const labels: Record<QuestionType, string> = {
    multipleChoice: "Multiple choice",
    trueFalse: "True/False",
    fillBlank: "Fill blank",
    shortAnswer: "Short answer",
    matching: "Matching",
    ordering: "Ordering",
  };
  return labels[questionType];
}

function isManualReview(question: Question) {
  return question.questionType === "shortAnswer" && question.manualReview;
}

function normalizeText(value: string) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function isAnswerCorrect(question: Question, answer: AnswerValue) {
  if (isManualReview(question)) return false;

  switch (question.questionType) {
    case "multipleChoice":
      return typeof answer === "number" && answer === question.correct;
    case "trueFalse":
      return typeof answer === "boolean" && answer === question.correct;
    case "fillBlank":
      return typeof answer === "string" && question.acceptedAnswers.some((item) => normalizeText(item) === normalizeText(answer));
    case "shortAnswer":
      return typeof answer === "string" && question.keywords.every((keyword) => normalizeText(answer).includes(normalizeText(keyword)));
    case "matching":
      return isAnswerMap(answer) && question.pairs.every((pair) => answer[pair.prompt] === pair.answer);
    case "ordering":
      return Array.isArray(answer) && question.correctOrder.every((item, index) => answer[index] === item);
    default:
      return false;
  }
}

function getCorrectAnswerLabel(question: Question) {
  switch (question.questionType) {
    case "multipleChoice":
      return question.options[question.correct];
    case "trueFalse":
      return question.correct ? "True" : "False";
    case "fillBlank":
      return question.acceptedAnswers[0];
    case "shortAnswer":
      return `Include: ${question.keywords.join(", ")}`;
    case "matching":
      return question.pairs.map((pair) => `${pair.prompt} -> ${pair.answer}`).join("; ");
    case "ordering":
      return question.correctOrder.join(" -> ");
    default:
      return "";
  }
}

function hasAnswer(answer: AnswerValue) {
  if (answer === null) return false;
  if (typeof answer === "string") return answer.trim().length > 0;
  if (Array.isArray(answer)) return answer.some(Boolean);
  if (typeof answer === "object") return Object.values(answer).some(Boolean);
  return true;
}

function isAnswerMap(answer: AnswerValue): answer is Record<string, string> {
  return Boolean(answer) && typeof answer === "object" && !Array.isArray(answer);
}

function QuestionTypeBadge({ questionType, highContrast }: { questionType: QuestionType; highContrast: boolean }) {
  return (
    <span className={cn("rounded px-2 py-0.5 text-[10px] font-black uppercase tracking-wide", highContrast ? "bg-white text-black" : "bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-200")}>
      {questionTypeLabel(questionType)}
    </span>
  );
}

function QuestionResponse({
  question,
  answer,
  setAnswer,
  highContrast,
}: {
  question: Question;
  answer: AnswerValue;
  setAnswer: (answer: AnswerValue) => void;
  highContrast: boolean;
}) {
  const optionButtonClass = (selected: boolean) =>
    cn(
      "w-full rounded border-2 p-3 text-left text-sm font-medium transition-all",
      FOCUS_RING,
      selected
        ? highContrast
          ? "border-yellow-300 bg-white text-black"
          : "border-blue-600 bg-blue-50 text-blue-900 dark:bg-blue-900/20 dark:text-blue-200"
        : highContrast
          ? "border-white bg-black text-white hover:bg-white hover:text-black"
          : "border-slate-200 text-slate-700 hover:border-blue-300 dark:border-slate-700 dark:text-slate-300 dark:hover:border-blue-600",
    );

  if (question.questionType === "multipleChoice") {
    return (
      <div className="space-y-2" role="radiogroup" aria-label="Multiple choice answer choices">
        {question.options.map((option, index) => {
          const selected = answer === index;
          return (
            <button key={option} type="button" role="radio" aria-checked={selected} onClick={() => setAnswer(index)} className={optionButtonClass(selected)}>
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

  if (question.questionType === "trueFalse") {
    return (
      <div className="grid gap-2 sm:grid-cols-2" role="radiogroup" aria-label="True or false choices">
        {[true, false].map((value) => {
          const selected = answer === value;
          return (
            <button key={String(value)} type="button" role="radio" aria-checked={selected} onClick={() => setAnswer(value)} className={optionButtonClass(selected)}>
              <span className="flex items-center gap-3">
                {selected ? <CheckCircle className="h-4 w-4 flex-shrink-0 text-blue-600" /> : <Circle className="h-4 w-4 flex-shrink-0 text-slate-300 dark:text-slate-600" />}
                {value ? "True" : "False"}
              </span>
            </button>
          );
        })}
      </div>
    );
  }

  if (question.questionType === "fillBlank" || question.questionType === "shortAnswer") {
    return (
      <label className={cn("block text-sm font-bold", highContrast ? "text-white" : "text-slate-700 dark:text-slate-200")}>
        Your answer
        {question.questionType === "shortAnswer" ? (
          <textarea
            value={typeof answer === "string" ? answer : ""}
            onChange={(event) => setAnswer(event.target.value)}
            rows={4}
            className={cn("mt-2 w-full resize-none rounded border px-3 py-2 text-sm", FOCUS_RING, highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white")}
          />
        ) : (
          <input
            type="text"
            value={typeof answer === "string" ? answer : ""}
            onChange={(event) => setAnswer(event.target.value)}
            className={cn("mt-2 w-full rounded border px-3 py-2 text-sm", FOCUS_RING, highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white")}
          />
        )}
      </label>
    );
  }

  if (question.questionType === "matching") {
    const answerMap = isAnswerMap(answer) ? answer : {};
    return (
      <div className="space-y-3">
        {question.pairs.map((pair) => (
          <label key={pair.prompt} className={cn("grid gap-2 rounded border p-3 text-sm font-bold sm:grid-cols-[160px_minmax(0,1fr)] sm:items-center", highContrast ? "border-white text-white" : "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200")}>
            <span>{pair.prompt}</span>
            <select
              value={answerMap[pair.prompt] ?? ""}
              onChange={(event) => setAnswer({ ...answerMap, [pair.prompt]: event.target.value })}
              className={cn("rounded border px-3 py-2 text-sm", FOCUS_RING, highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white")}
            >
              <option value="">Select a match</option>
              {question.choices.map((choice) => (
                <option key={choice} value={choice}>{choice}</option>
              ))}
            </select>
          </label>
        ))}
      </div>
    );
  }

  const orderedAnswer = Array.isArray(answer) ? answer : new Array(question.items.length).fill("");
  return (
    <div className="space-y-3">
      {question.correctOrder.map((_, index) => (
        <label key={index} className={cn("grid gap-2 rounded border p-3 text-sm font-bold sm:grid-cols-[80px_minmax(0,1fr)] sm:items-center", highContrast ? "border-white text-white" : "border-slate-200 text-slate-700 dark:border-slate-700 dark:text-slate-200")}>
          <span>Step {index + 1}</span>
          <select
            value={orderedAnswer[index] ?? ""}
            onChange={(event) => {
              const nextAnswer = [...orderedAnswer];
              nextAnswer[index] = event.target.value;
              setAnswer(nextAnswer);
            }}
            className={cn("rounded border px-3 py-2 text-sm", FOCUS_RING, highContrast ? "border-white bg-black text-white" : "border-slate-200 bg-white text-slate-900 dark:border-slate-700 dark:bg-slate-900 dark:text-white")}
          >
            <option value="">Select item</option>
            {question.items.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </label>
      ))}
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
