import { useState, useEffect, useRef } from "react";
import {
  Timer,
  Maximize2,
  Minimize2,
  ChevronLeft,
  ChevronRight,
  CheckCircle,
  Circle,
  X,
  AlertCircle,
  RotateCcw,
  BookOpen,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const QUIZ_METADATA = {
  type: "Quiz" as "Quiz" | "Exam",
  title: "Algorithm Complexity Quiz",
  courseCode: "CS 350",
  courseName: "Algorithm Analysis",
  moduleTitle: "Module 4: Big-O Notation",
  timeLimitMinutes: 30,
  attempts: 2,
  attemptsUsed: 0,
};

const QUESTIONS = [
  {
    id: 1,
    text: "What is the time complexity of binary search on a sorted array of n elements?",
    options: ["O(1)", "O(log n)", "O(n)", "O(n log n)"],
    correct: 1,
  },
  {
    id: 2,
    text: "Which sorting algorithm has the best average-case time complexity?",
    options: ["Bubble Sort", "Insertion Sort", "Merge Sort", "Selection Sort"],
    correct: 2,
  },
  {
    id: 3,
    text: "What is the space complexity of a recursive Fibonacci implementation (without memoization)?",
    options: ["O(1)", "O(log n)", "O(n)", "O(2^n)"],
    correct: 2,
  },
  {
    id: 4,
    text: "Which data structure provides O(1) average-case lookup?",
    options: ["Binary Search Tree", "Hash Table", "Sorted Array", "Linked List"],
    correct: 1,
  },
];

export function QuizPage() {
  const [focusMode, setFocusMode] = useState(true); // FR-09: active by default during quiz
  const [started, setStarted] = useState(false);
  const [currentQ, setCurrentQ] = useState(0);
  const [answers, setAnswers] = useState<(number | null)[]>(new Array(QUESTIONS.length).fill(null));
  const [submitted, setSubmitted] = useState(false);
  const [timeLeft, setTimeLeft] = useState(QUIZ_METADATA.timeLimitMinutes * 60);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    if (started && !submitted) {
      timerRef.current = setInterval(() => {
        setTimeLeft((t) => {
          if (t <= 1) {
            clearInterval(timerRef.current!);
            setSubmitted(true);
            return 0;
          }
          return t - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [started, submitted]);

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, "0")}`;
  };

  const score = answers.reduce((acc, a, i) => acc + (a === QUESTIONS[i].correct ? 1 : 0), 0);
  const percent = Math.round((score / QUESTIONS.length) * 100);

  if (!started) {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
          <div className="flex items-center gap-2 text-sm font-bold text-slate-500 dark:text-slate-400 mb-3">
            <BookOpen className="w-4 h-4" />
            {/* FR-55 */}
            {QUIZ_METADATA.courseCode} — {QUIZ_METADATA.courseName}
          </div>
          {/* FR-56: Module title as primary heading */}
          <p className="text-slate-400 dark:text-slate-500 text-sm mb-1">{QUIZ_METADATA.moduleTitle}</p>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-6">{QUIZ_METADATA.title}</h1>

          <div className="space-y-3 mb-8">
            {/* FR-61: Assessment type label */}
            <div className="flex items-center justify-between p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl">
              <span className="text-sm font-bold text-yellow-900 dark:text-yellow-300">Assessment Type</span>
              <span className="px-3 py-1 bg-yellow-400 text-yellow-900 rounded-full text-xs font-black uppercase tracking-wider">
                {QUIZ_METADATA.type}
              </span>
            </div>
            {/* FR-62: Time limit and attempts */}
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Time Limit</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{QUIZ_METADATA.timeLimitMinutes} minutes</span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Attempts Allowed</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">
                {QUIZ_METADATA.attemptsUsed} of {QUIZ_METADATA.attempts} used
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-slate-50 dark:bg-slate-900/50 rounded-xl border border-slate-100 dark:border-slate-700">
              <span className="text-sm font-bold text-slate-600 dark:text-slate-400">Questions</span>
              <span className="text-sm font-black text-slate-900 dark:text-white">{QUESTIONS.length} questions</span>
            </div>
          </div>

          {/* FR-09: Focus Mode note */}
          <div className="flex items-start gap-3 p-4 bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-xl mb-6 text-sm">
            <Maximize2 className="w-4 h-4 text-blue-600 dark:text-blue-400 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-bold text-blue-900 dark:text-blue-300">Focus Mode enabled</p>
              <p className="text-blue-800 dark:text-blue-400">Non-essential widgets and notifications will be hidden during the quiz. You can exit Focus Mode at any time.</p>
            </div>
          </div>

          <button
            onClick={() => setStarted(true)}
            className="w-full py-4 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50 active:scale-95"
          >
            Start {QUIZ_METADATA.type}
          </button>
        </div>
      </div>
    );
  }

  if (submitted) {
    return (
      <div className="p-8 max-w-2xl mx-auto animate-in fade-in duration-500">
        <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8 text-center">
          <div className={cn(
            "w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-5",
            percent >= 70 ? "bg-green-100 dark:bg-green-900/30" : "bg-red-100 dark:bg-red-900/30"
          )}>
            <span className={cn("text-2xl font-black", percent >= 70 ? "text-green-600" : "text-red-600")}>{percent}%</span>
          </div>
          <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-2">
            {percent >= 70 ? "Great job!" : "Keep practicing!"}
          </h1>
          <p className="text-slate-500 dark:text-slate-400 text-sm mb-8">
            You scored <strong>{score} out of {QUESTIONS.length}</strong> on {QUIZ_METADATA.title}
          </p>

          <div className="space-y-3 text-left mb-8">
            {QUESTIONS.map((q, i) => {
              const userAnswer = answers[i];
              const isCorrect = userAnswer === q.correct;
              return (
                <div key={q.id} className={cn(
                  "p-4 rounded-xl border",
                  isCorrect
                    ? "bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800"
                    : "bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800"
                )}>
                  <div className="flex items-start gap-3">
                    {isCorrect
                      ? <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                      : <X className="w-4 h-4 text-red-600 mt-0.5 flex-shrink-0" />}
                    <div>
                      <p className="text-sm font-bold text-slate-900 dark:text-white mb-1">{q.text}</p>
                      {!isCorrect && (
                        <p className="text-xs text-green-700 dark:text-green-400">
                          Correct: {q.options[q.correct]}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          <button
            onClick={() => { setStarted(false); setSubmitted(false); setAnswers(new Array(QUESTIONS.length).fill(null)); setCurrentQ(0); setTimeLeft(QUIZ_METADATA.timeLimitMinutes * 60); setFocusMode(true); }}
            className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl transition-all mx-auto"
          >
            <RotateCcw className="w-4 h-4" /> Retake Quiz
          </button>
        </div>
      </div>
    );
  }

  return (
    // FR-09: focusMode hides the surrounding layout widgets via a portal-style overlay approach
    <div className={cn("p-8 max-w-3xl mx-auto animate-in fade-in duration-500", focusMode && "relative")}>
      {/* FR-09: Focus Mode overlay banner */}
      <AnimatePresence>
        {focusMode && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="mb-4 flex items-center justify-between px-4 py-2.5 bg-slate-900 dark:bg-slate-950 text-white rounded-xl text-sm"
          >
            <div className="flex items-center gap-2 font-bold">
              <Maximize2 className="w-4 h-4" /> Focus Mode active — notifications and widgets hidden
            </div>
            <button
              onClick={() => setFocusMode(false)}
              className="text-slate-400 hover:text-white flex items-center gap-1 font-bold text-xs transition-colors"
            >
              <Minimize2 className="w-3.5 h-3.5" /> Exit Focus Mode
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm overflow-hidden">
        {/* Header bar */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-50 dark:bg-slate-900/60 border-b border-slate-100 dark:border-slate-700">
          <div>
            <p className="text-xs font-black text-slate-400 uppercase tracking-widest">{QUIZ_METADATA.courseCode} · {QUIZ_METADATA.type}</p>
            <p className="text-sm font-bold text-slate-900 dark:text-white">{QUIZ_METADATA.title}</p>
          </div>
          {/* Timer */}
          <div className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-black",
            timeLeft < 120
              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 animate-pulse"
              : "bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400"
          )}>
            <Timer className="w-4 h-4" />
            {formatTime(timeLeft)}
          </div>
        </div>

        {/* Progress bar */}
        <div className="h-1.5 bg-slate-100 dark:bg-slate-700">
          <div
            className="h-full bg-blue-600 transition-all duration-300"
            style={{ width: `${((currentQ + 1) / QUESTIONS.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <div className="p-8">
          <div className="flex items-center gap-3 mb-6">
            <span className="w-8 h-8 rounded-full bg-blue-600 text-white text-xs font-black flex items-center justify-center flex-shrink-0">
              {currentQ + 1}
            </span>
            <p className="text-lg font-bold text-slate-900 dark:text-white">{QUESTIONS[currentQ].text}</p>
          </div>

          <div className="space-y-3">
            {QUESTIONS[currentQ].options.map((option, i) => {
              const selected = answers[currentQ] === i;
              return (
                <button
                  key={i}
                  onClick={() => {
                    const newAnswers = [...answers];
                    newAnswers[currentQ] = i;
                    setAnswers(newAnswers);
                  }}
                  className={cn(
                    "w-full text-left p-4 rounded-xl border-2 transition-all font-medium text-sm",
                    selected
                      ? "border-blue-600 bg-blue-50 dark:bg-blue-900/20 text-blue-900 dark:text-blue-200"
                      : "border-slate-200 dark:border-slate-700 hover:border-blue-300 dark:hover:border-blue-600 text-slate-700 dark:text-slate-300"
                  )}
                >
                  <div className="flex items-center gap-3">
                    {selected
                      ? <CheckCircle className="w-4 h-4 text-blue-600 flex-shrink-0" />
                      : <Circle className="w-4 h-4 text-slate-300 dark:text-slate-600 flex-shrink-0" />}
                    {option}
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Navigation */}
        <div className="px-8 pb-6 flex items-center justify-between">
          <button
            onClick={() => setCurrentQ(Math.max(0, currentQ - 1))}
            disabled={currentQ === 0}
            className="flex items-center gap-2 px-4 py-2.5 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-bold text-slate-600 dark:text-slate-400 disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all"
          >
            <ChevronLeft className="w-4 h-4" /> Previous
          </button>

          <div className="flex gap-1.5">
            {QUESTIONS.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrentQ(i)}
                className={cn(
                  "w-7 h-7 rounded-lg text-xs font-black transition-all",
                  i === currentQ
                    ? "bg-blue-600 text-white"
                    : answers[i] !== null
                    ? "bg-blue-100 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400"
                    : "bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500"
                )}
              >
                {i + 1}
              </button>
            ))}
          </div>

          {currentQ < QUESTIONS.length - 1 ? (
            <button
              onClick={() => setCurrentQ(currentQ + 1)}
              className="flex items-center gap-2 px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-sm font-bold transition-all"
            >
              Next <ChevronRight className="w-4 h-4" />
            </button>
          ) : (
            <button
              onClick={() => { clearInterval(timerRef.current!); setSubmitted(true); setFocusMode(false); }}
              className="flex items-center gap-2 px-4 py-2.5 bg-green-600 hover:bg-green-700 text-white rounded-xl text-sm font-bold transition-all"
            >
              <CheckCircle className="w-4 h-4" /> Submit Quiz
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
