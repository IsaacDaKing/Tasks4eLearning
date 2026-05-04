import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode, type RefObject } from "react";
import {
  AlertCircle,
  Bot,
  CalendarClock,
  Clock,
  Copy,
  Download,
  GraduationCap,
  ListChecks,
  RotateCcw,
  Send,
  Sparkles,
  Star,
  Target,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-cyan-500 focus-visible:ring-offset-2";

interface CoursePlan {
  id: CourseId;
  code: string;
  name: string;
  currentGrade: number;
  lowRange: number;
  highRange: number;
  weakArea: string;
  deadline: string;
  dueSignal: string;
  scoreLabel: string;
  projectedScore: number;
  weight: number;
  nextAssessment: string;
}

type CourseId = "networks" | "software" | "database";

interface ChatMessage {
  id: string;
  sender: "You" | "Comet AI";
  body: string;
  time: string;
}

interface AssistantResponse {
  body: string;
  suggestions: string[];
  generatedPlan?: string;
  topic?: string;
  courseId?: CourseId;
}

interface SessionMemory {
  lastSelectedTopic?: string;
  lastCourseId?: CourseId;
  lastQuickAction?: string;
  generatedPlan?: string;
}

const COURSES: CoursePlan[] = [
  {
    id: "networks",
    code: "CS 4390.0W1",
    name: "Computer Networks",
    currentGrade: 88,
    lowRange: 84,
    highRange: 94,
    weakArea: "TCP/IP, subnetting, DNS, and routing",
    deadline: "Network Protocol Analysis",
    dueSignal: "Due May 6",
    scoreLabel: "Protocol analysis score",
    projectedScore: 86,
    weight: 0.22,
    nextAssessment: "TCP/IP protocol quiz",
  },
  {
    id: "software",
    code: "CS 3354.012",
    name: "Software Engineering",
    currentGrade: 91,
    lowRange: 87,
    highRange: 96,
    weakArea: "UML, traceability, testing, and sprint planning",
    deadline: "Design Patterns Lab",
    dueSignal: "Due May 8",
    scoreLabel: "Design lab score",
    projectedScore: 90,
    weight: 0.25,
    nextAssessment: "Sprint 2 milestone review",
  },
  {
    id: "database",
    code: "CS 4347.002",
    name: "Database Systems",
    currentGrade: 84,
    lowRange: 78,
    highRange: 93,
    weakArea: "Normalization, joins, keys, ACID, and indexing",
    deadline: "Database Normalization Midterm",
    dueSignal: "Due May 11",
    scoreLabel: "Midterm score",
    projectedScore: 82,
    weight: 0.3,
    nextAssessment: "Normalization and SQL midterm",
  },
];

const QUICK_ACTIONS = [
  "Build Study Plan",
  "Improve My Grade",
  "Prioritize This Week",
  "Prep for Quiz",
  "Prep for Exam",
  "Message My Professor",
  "Explain Weak Topics",
  "Time Block My Day",
  "Review Deadlines",
  "Accessibility Help",
  "Explain the Whoosh",
];

const PROMPT_STARTERS = [
  "What should I study tonight?",
  "How can I raise my GPA?",
  "Make me a study plan for this week.",
  "Help me prepare for Database Systems.",
  "Explain what to review for Software Engineering.",
  "What should I ask my professor?",
  "What is the Whoosh?",
  "I feel overwhelmed. Help me prioritize.",
];

const DEFAULT_SUGGESTIONS = [
  "What should I do next?",
  "Build Study Plan",
  "Improve My Grade",
  "Help with Database Systems",
];

const HELP_TOPICS = ["grades", "study plans", "deadlines", "quizzes and exams", "course questions", "time management"];

export function AIAssistantPage() {
  const [courses] = useState(COURSES);
  const [chatInput, setChatInput] = useState("");
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [copyNotice, setCopyNotice] = useState("");
  const [studyPlan, setStudyPlan] = useState(() => buildStudyPlan(COURSES));
  const [memory, setMemory] = useState<SessionMemory>({ generatedPlan: buildStudyPlan(COURSES) });
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "comet-welcome",
      sender: "Comet AI",
      time: getCurrentTime(),
      body:
        "Whoosh, Comet. Let's plan your next move.\n\nQuick read\nYour most urgent item is Computer Networks, your biggest grade opportunity is Database Systems, and Software Engineering needs a clean milestone push.\n\nRecommended next steps\n1. Ask what to study tonight.\n2. Build a weekly study plan.\n3. Check what score you need to raise your projected GPA.",
    },
  ]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const chatEndRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [messages, isAssistantTyping]);

  useEffect(() => {
    return () => clearTypingTimers();
  }, []);

  const projectedCourses = useMemo(
    () =>
      courses.map((course) => ({
        ...course,
        projectedGrade: calculateProjectedGrade(course),
      })),
    [courses],
  );

  const currentGpa = 3.85;
  const projectedGpa = useMemo(() => {
    const averageProjected =
      projectedCourses.reduce((sum, course) => sum + course.projectedGrade, 0) / projectedCourses.length;
    return Math.min(4, Math.max(0, averageProjected / 25)).toFixed(2);
  }, [projectedCourses]);

  const courseNeedingAttention = projectedCourses.slice().sort((a, b) => a.projectedGrade - b.projectedGrade)[0];
  const alerts = useMemo(() => generateAlerts(projectedCourses), [projectedCourses]);

  const submitPrompt = (prompt: string, quickAction?: string) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isAssistantTyping) return;
    const response = getRuleBasedResponse(trimmedPrompt, {
      memory: quickAction ? { ...memory, lastQuickAction: quickAction } : memory,
      courses: projectedCourses,
      projectedGpa,
    });

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, sender: "You", body: trimmedPrompt, time: getCurrentTime() },
    ]);
    setChatInput("");
    setCopyNotice("");
    setMemory((current) => ({
      ...current,
      lastQuickAction: quickAction ?? current.lastQuickAction,
      lastSelectedTopic: response.topic ?? current.lastSelectedTopic,
      lastCourseId: response.courseId ?? current.lastCourseId,
      generatedPlan: response.generatedPlan ?? current.generatedPlan,
    }));
    if (response.generatedPlan) setStudyPlan(response.generatedPlan);
    typeAssistantResponse(response);
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    submitPrompt(chatInput);
  };

  const handleChatKeyDown = (event: KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      submitPrompt(chatInput);
    }
  };

  const typeAssistantResponse = (response: AssistantResponse) => {
    clearTypingTimers();
    setIsAssistantTyping(true);
    setSuggestions([]);

    typingTimeoutRef.current = setTimeout(() => {
      const messageId = `comet-${Date.now()}`;
      let visibleLength = 0;
      setMessages((current) => [
        ...current,
        { id: messageId, sender: "Comet AI", body: "", time: getCurrentTime() },
      ]);

      typingIntervalRef.current = setInterval(() => {
        visibleLength = Math.min(response.body.length, visibleLength + 5);
        setMessages((current) =>
          current.map((message) =>
            message.id === messageId ? { ...message, body: response.body.slice(0, visibleLength) } : message,
          ),
        );

        if (visibleLength >= response.body.length) {
          clearTypingTimers();
          setIsAssistantTyping(false);
          setSuggestions(response.suggestions);
        }
      }, 14);
    }, 360);
  };

  const resetChat = () => {
    clearTypingTimers();
    const freshPlan = buildStudyPlan(courses);
    setIsAssistantTyping(false);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setCopyNotice("");
    setChatInput("");
    setStudyPlan(freshPlan);
    setMemory({ generatedPlan: freshPlan });
    setMessages([
      {
        id: "comet-welcome-reset",
        sender: "Comet AI",
        time: getCurrentTime(),
        body:
          "Hi, I am Comet AI. What should we work on first: grades, deadlines, a course topic, or a study plan?",
      },
    ]);
  };

  const clearTypingTimers = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    typingTimeoutRef.current = null;
    typingIntervalRef.current = null;
  };

  const copyLatestResponse = async () => {
    const latest = [...messages].reverse().find((message) => message.sender === "Comet AI" && message.body.trim());
    if (!latest) return;
    await copyText(latest.body);
    setCopyNotice("Latest Comet AI response copied.");
  };

  const copyStudyPlan = async () => {
    await copyText(studyPlan);
    setCopyNotice("Study plan copied.");
  };

  const downloadStudyPlan = () => {
    const blob = new Blob([studyPlan], { type: "text/plain;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "comet-ai-study-plan.txt";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
    setCopyNotice("Study plan downloaded.");
  };

  return (
    <div className="mx-auto max-w-[1600px] space-y-6 p-4 animate-in fade-in duration-500 sm:p-6">
      <section className="overflow-hidden rounded border border-slate-200 bg-slate-950 text-white shadow-sm">
        <div className="grid gap-5 p-5 sm:p-6 lg:grid-cols-[minmax(0,1fr)_360px] lg:items-center">
          <div>
            <div className="mb-4 inline-flex items-center gap-2 rounded-full border border-cyan-300/30 bg-white/10 px-3 py-1 text-xs font-bold text-cyan-100">
              <Sparkles className="h-3.5 w-3.5" />
              Comet AI uses local course context in this prototype.
            </div>
            <h2 className="flex items-center gap-3 text-3xl font-black tracking-tight sm:text-4xl">
              <span className="flex h-11 w-11 items-center justify-center rounded bg-cyan-400 text-slate-950">
                <Star className="h-6 w-6 fill-slate-950" />
              </span>
              Comet AI
            </h2>
            <p className="mt-3 max-w-2xl text-base leading-relaxed text-slate-200">
              Whoosh, Comet. Your course planning and study strategy assistant.
            </p>
            <CometSky />
            <div className="mt-5 flex flex-wrap gap-2" aria-label="Comet AI capabilities">
              {HELP_TOPICS.map((topic) => (
                <span key={topic} className="rounded-full border border-white/15 bg-white/10 px-3 py-1.5 text-xs font-bold text-slate-100">
                  {topic}
                </span>
              ))}
            </div>
          </div>
          <CometContextCard
            projectedGpa={projectedGpa}
            courseNeedingAttention={courseNeedingAttention.name}
            highestPriorityDeadline={`${COURSES[0].deadline} - ${COURSES[0].dueSignal}`}
            nextAssessment={COURSES[2].nextAssessment}
          />
        </div>
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_360px]">
        <CometChatPanel
          messages={messages}
          isAssistantTyping={isAssistantTyping}
          suggestions={suggestions}
          chatInput={chatInput}
          copyNotice={copyNotice}
          setChatInput={setChatInput}
          submitPrompt={submitPrompt}
          sendMessage={sendMessage}
          handleChatKeyDown={handleChatKeyDown}
          copyLatestResponse={copyLatestResponse}
          copyStudyPlan={copyStudyPlan}
          downloadStudyPlan={downloadStudyPlan}
          resetChat={resetChat}
          chatEndRef={chatEndRef}
        />

        <aside className="space-y-6">
          <Panel icon={Sparkles} title="Prompt Starters" description="Click one to send it to Comet AI.">
            <div className="space-y-2">
              {PROMPT_STARTERS.map((starter) => (
                <button
                  key={starter}
                  type="button"
                  onClick={() => submitPrompt(starter)}
                  disabled={isAssistantTyping}
                  className={cn(
                    "w-full rounded border border-slate-200 bg-white px-3 py-2 text-left text-sm font-semibold text-slate-700 transition-colors hover:bg-cyan-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
                    FOCUS_RING,
                  )}
                >
                  {starter}
                </button>
              ))}
            </div>
          </Panel>

          <Panel icon={Target} title="Current Context" description="Local course signals Comet AI can reference.">
            <div className="space-y-3">
              <ContextRow label="Highest priority" value={`${COURSES[0].deadline} (${COURSES[0].dueSignal})`} />
              <ContextRow label="Needs attention" value={`${courseNeedingAttention.name}: ${courseNeedingAttention.projectedGrade}% projected`} />
              <ContextRow label="Projected GPA" value={projectedGpa} />
              <ContextRow label="Next quiz or exam" value={COURSES[2].nextAssessment} />
              <ContextRow label="Unread signal" value="2 new feedback/message items" />
            </div>
          </Panel>
        </aside>
      </section>

      <section className="grid gap-3 md:grid-cols-4" aria-label="Comet AI overview">
        <MetricCard icon={GraduationCap} label="Current GPA" value={currentGpa.toFixed(2)} detail="Mock academic snapshot" />
        <MetricCard icon={TrendingUp} label="Projected GPA" value={projectedGpa} detail="Updates from local sliders" />
        <MetricCard icon={AlertCircle} label="Courses To Watch" value="2" detail="Database and Networks" />
        <MetricCard icon={CalendarClock} label="High Priority" value="3" detail="Next 72 hours" />
      </section>

      <main className="space-y-6">
        <Panel icon={ListChecks} title="Generated Study Plan" description="Structured plan from Comet AI's local rules.">
          <div className="flex flex-wrap gap-2">
            <button
              type="button"
              onClick={() => submitPrompt("Build Study Plan", "Build Study Plan")}
              className={cn("inline-flex items-center gap-2 rounded bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800", FOCUS_RING)}
            >
              <Sparkles className="h-4 w-4" />
              Build Study Plan
            </button>
            <button
              type="button"
              onClick={copyStudyPlan}
              className={cn("inline-flex items-center gap-2 rounded border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50", FOCUS_RING)}
            >
              <Copy className="h-4 w-4" />
              Copy Study Plan
            </button>
            <button
              type="button"
              onClick={downloadStudyPlan}
              className={cn("inline-flex items-center gap-2 rounded border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50", FOCUS_RING)}
            >
              <Download className="h-4 w-4" />
              Download .txt
            </button>
          </div>
          <pre className="mt-4 max-h-[420px] overflow-auto whitespace-pre-wrap rounded border border-slate-200 bg-slate-50 p-4 text-sm leading-relaxed text-slate-700">
            {studyPlan}
          </pre>
        </Panel>

        <div className="grid gap-6 lg:grid-cols-2">
          <Panel icon={AlertCircle} title="Planning Alerts" description="Supportive signals from local mock conditions.">
            <div className="space-y-3">
              {alerts.map((alert) => (
                <div key={alert} className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-950">
                  <p className="font-bold">{alert}</p>
                </div>
              ))}
            </div>
          </Panel>

          <Panel icon={Clock} title="Time Blocks" description="Short focused sessions for the next study window.">
            <div className="space-y-3">
              {[
                "45 minutes: Database Systems normalization, joins, and ACID practice.",
                "30 minutes: Software Engineering UML sequence diagram and traceability cleanup.",
                "25 minutes: Computer Networks subnetting drills and TCP reliability review.",
              ].map((block) => (
                <div key={block} className="rounded border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                  {block}
                </div>
              ))}
            </div>
          </Panel>
        </div>
      </main>
    </div>
  );
}

function CometChatPanel({
  messages,
  isAssistantTyping,
  suggestions,
  chatInput,
  copyNotice,
  setChatInput,
  submitPrompt,
  sendMessage,
  handleChatKeyDown,
  copyLatestResponse,
  copyStudyPlan,
  downloadStudyPlan,
  resetChat,
  chatEndRef,
}: {
  messages: ChatMessage[];
  isAssistantTyping: boolean;
  suggestions: string[];
  chatInput: string;
  copyNotice: string;
  setChatInput: (value: string) => void;
  submitPrompt: (prompt: string, quickAction?: string) => void;
  sendMessage: (event: FormEvent) => void;
  handleChatKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  copyLatestResponse: () => void;
  copyStudyPlan: () => void;
  downloadStudyPlan: () => void;
  resetChat: () => void;
  chatEndRef: RefObject<HTMLDivElement>;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white shadow-sm" aria-labelledby="comet-chat-title">
      <div className="border-b border-slate-200 p-4 sm:p-5">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded bg-slate-950 text-cyan-300">
              <Bot className="h-6 w-6" />
            </div>
            <div>
              <h3 id="comet-chat-title" className="text-xl font-black text-slate-950">Chat With Comet AI</h3>
              <p className="text-xs font-semibold text-slate-500">
                {isAssistantTyping ? "Comet AI is thinking..." : "Ready with local course context"}
              </p>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <button type="button" onClick={copyLatestResponse} className={iconButtonClass()} title="Copy latest response" aria-label="Copy latest response">
              <Copy className="h-4 w-4" />
            </button>
            <button type="button" onClick={resetChat} className={iconButtonClass()} title="Reset chat" aria-label="Reset chat">
              <RotateCcw className="h-4 w-4" />
            </button>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2" aria-label="Comet AI quick actions">
          {QUICK_ACTIONS.map((action) => (
            <button
              key={action}
              type="button"
              onClick={() => submitPrompt(action, action)}
              disabled={isAssistantTyping}
              className={cn(
                "rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:border-cyan-200 hover:bg-cyan-50 hover:text-slate-950 disabled:cursor-not-allowed disabled:opacity-60",
                FOCUS_RING,
              )}
            >
              {action}
            </button>
          ))}
        </div>
      </div>

      <div
        className="h-[560px] overflow-y-auto bg-gradient-to-b from-slate-50 to-white p-4 sm:p-5"
        aria-live="polite"
        aria-label="Comet AI chat history"
      >
        <div className="space-y-4">
          {messages.map((message) => {
            const isUser = message.sender === "You";
            return (
              <article key={message.id} className={cn("flex gap-3", isUser ? "justify-end" : "justify-start")}>
                {!isUser && (
                  <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-slate-950 text-cyan-300">
                    <Sparkles className="h-4 w-4" />
                  </div>
                )}
                <div className={cn("max-w-[86%] sm:max-w-[74%]", isUser && "text-right")}>
                  <div
                    className={cn(
                      "rounded px-4 py-3 text-left text-sm leading-relaxed shadow-sm",
                      isUser
                        ? "bg-cyan-600 text-white"
                        : "border border-slate-200 bg-white text-slate-700",
                    )}
                  >
                    <p className="mb-1 text-xs font-black opacity-80">{message.sender}</p>
                    <p className="whitespace-pre-line">{message.body}</p>
                  </div>
                  <p className="mt-1 text-xs font-medium text-slate-500">{message.time}</p>
                </div>
              </article>
            );
          })}
          {isAssistantTyping && messages[messages.length - 1]?.sender !== "Comet AI" && (
            <div className="flex gap-3" role="status" aria-live="polite">
              <div className="mt-1 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded bg-slate-950 text-cyan-300">
                <Sparkles className="h-4 w-4" />
              </div>
              <div className="rounded border border-slate-200 bg-white px-4 py-3 text-sm text-slate-700 shadow-sm">
                <p className="mb-2 text-xs font-black">Comet AI</p>
                <span className="inline-flex items-center gap-1" aria-label="Comet AI is typing">
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-600" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-600 [animation-delay:120ms]" />
                  <span className="h-2 w-2 animate-pulse rounded-full bg-cyan-600 [animation-delay:240ms]" />
                </span>
              </div>
            </div>
          )}
          <div ref={chatEndRef} />
        </div>
      </div>

      <div className="border-t border-slate-200 p-4 sm:p-5">
        {suggestions.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2" aria-label="Suggested follow-up prompts">
            {suggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => submitPrompt(suggestion)}
                disabled={isAssistantTyping}
                className={cn("rounded-full border border-cyan-200 bg-cyan-50 px-3 py-1.5 text-xs font-bold text-cyan-900 hover:bg-cyan-100 disabled:cursor-not-allowed disabled:opacity-60", FOCUS_RING)}
              >
                {suggestion}
              </button>
            ))}
          </div>
        )}

        <form onSubmit={sendMessage}>
          <label className="sr-only" htmlFor="comet-chat-input">Ask Comet AI</label>
          <div className="flex flex-col gap-2 sm:flex-row">
            <textarea
              id="comet-chat-input"
              value={chatInput}
              onChange={(event) => setChatInput(event.target.value)}
              onKeyDown={handleChatKeyDown}
              placeholder="Ask about grades, deadlines, quizzes, course topics, or what to do next..."
              rows={3}
              className={cn("min-w-0 flex-1 resize-none rounded border border-slate-200 px-3 py-2 text-sm text-slate-900 placeholder:text-slate-400", FOCUS_RING)}
            />
            <button
              type="submit"
              disabled={!chatInput.trim() || isAssistantTyping}
              className={cn(
                "inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-black sm:w-32",
                FOCUS_RING,
                chatInput.trim() && !isAssistantTyping
                  ? "bg-slate-950 text-white hover:bg-slate-800"
                  : "cursor-not-allowed bg-slate-200 text-slate-400",
              )}
            >
              <Send className="h-4 w-4" />
              Send
            </button>
          </div>
        </form>

        <div className="mt-3 flex flex-wrap gap-2">
          <button type="button" onClick={copyStudyPlan} className={smallButtonClass()}>
            <Copy className="h-3.5 w-3.5" />
            Copy Study Plan
          </button>
          <button type="button" onClick={downloadStudyPlan} className={smallButtonClass()}>
            <Download className="h-3.5 w-3.5" />
            Download Study Plan
          </button>
        </div>
        {copyNotice && (
          <p className="mt-2 text-xs font-bold text-emerald-700" role="status" aria-live="polite">
            {copyNotice}
          </p>
        )}
      </div>
    </section>
  );
}

function getRuleBasedResponse(
  prompt: string,
  context: { memory: SessionMemory; courses: Array<CoursePlan & { projectedGrade: number }>; projectedGpa: string },
): AssistantResponse {
  const normalized = prompt.toLowerCase();
  const courseId = detectCourse(normalized) ?? context.memory.lastCourseId;
  const course = courseId ? context.courses.find((item) => item.id === courseId) : undefined;
  const isShorterFollowUp = /\b(shorter|simpler|condense|brief|quick version|make it shorter)\b/.test(normalized);

  if (isShorterFollowUp && context.memory.lastSelectedTopic) {
    return {
      body: `Quick read\nHere is the shorter version for ${course?.name ?? context.memory.lastSelectedTopic}: do the nearest deadline first, then one targeted practice block, then send one question if you are still stuck.\n\nRecommended next steps\n1. Work 25 minutes on the highest-risk topic.\n2. Mark one thing you still cannot explain.\n3. Ask Comet AI for a drill or message draft.\n\nSuggested follow-up\nWant a 25-minute checklist or a professor message draft?`,
      suggestions: ["Make a 25-minute checklist", "Message My Professor", "Explain Weak Topics", "Build Study Plan"],
      topic: context.memory.lastSelectedTopic,
      courseId,
    };
  }

  if (/\b(hi|hello|hey|howdy|good morning|good afternoon|good evening)\b/.test(normalized)) {
    return {
      body:
        "Quick read\nHi, I am Comet AI. I can help you decide what to study, plan your week, understand grades, prepare for quizzes and exams, or draft a message to an instructor.\n\nRecommended next steps\n1. Start with the closest deadline if you are short on time.\n2. Start with Database Systems if your goal is grade improvement.\n3. Start with a weekly plan if everything feels scattered.\n\nSuggested follow-up\nAsk: What should I study tonight?",
      suggestions: ["What should I study tonight?", "Build Study Plan", "Improve My Grade", "What can you do?"],
      topic: "greeting",
    };
  }

  if (/(what can you do|how do you work|what do you help)/.test(normalized) || /^(help|i need help)[.!?\s]*$/.test(normalized)) {
    return {
      body:
        "Quick read\nI help with local LMS-style course planning: grades, deadlines, quizzes, exams, course topics, communication, accessibility settings, and time management.\n\nRecommended next steps\n1. Tell me your goal: raise a grade, prepare for an exam, finish due work, or get unstuck.\n2. Mention a course if you have one in mind.\n3. I will turn that into a short, practical plan.\n\nWhy this matters\nA useful assistant should reduce choices, not add another dashboard to manage.\n\nSuggested follow-up\nTry: Prioritize This Week.",
      suggestions: ["Prioritize This Week", "Review Deadlines", "Prep for Exam", "Accessibility Help"],
      topic: "help",
    };
  }

  if (/(whoosh|temoc|utd|ut dallas|comet sign|signature sign)/.test(normalized)) {
    return {
      body:
        "Quick read\nThe Whoosh is the UT Dallas signature sign. It is an understood language between Comets, named for the sound a comet would make if there was sound in space.\n\nUTD context\nThe gesture honors Temoc, whose name is comet spelled backward. It was invented in the early 1990s, UT Dallas began teaching it at new student orientation in 2005, and it is now embraced as a symbolic gesture for students and alumni.\n\nSuggested follow-up\nI can also turn that into a short orientation-style explanation.",
      suggestions: ["Build Study Plan", "What should I study tonight?", "Explain Weak Topics", "Make it shorter"],
      topic: "Whoosh",
    };
  }

  if (/(overwhelmed|confused|stuck|panic|anxious|too much|motivation|unmotivated|burned out)/.test(normalized)) {
    return {
      body:
        "Quick read\nYou do not need to solve the whole week right now. The next useful move is one small task that removes pressure.\n\nRecommended next steps\n1. Set a 25-minute timer.\n2. Work only on Network Protocol Analysis if the deadline is still open.\n3. If that is blocked, switch to Database Systems and do five normalization questions.\n4. Write one question for office hours or a classmate.\n\nWhy this matters\nOverwhelm usually gets worse when every task has equal weight. We are shrinking the field to one visible action.\n\nSuggested follow-up\nAsk me to time block your day or draft a professor message.",
      suggestions: ["Time Block My Day", "Message My Professor", "What should I do next?", "Make it shorter"],
      topic: "overwhelm",
    };
  }

  if (/(study plan|make a plan|build study plan|plan for this week|schedule|time block|study tonight|prioritize|what should i do next|summarize my week|this week)/.test(normalized)) {
    const plan = buildStudyPlan(context.courses);
    return {
      body: `${plan}\n\nWhy this matters\nThis order protects the nearest deadline, then moves to the highest grade-risk course, then keeps Software Engineering from becoming a last-minute scramble.\n\nSuggested follow-up\nI can make this shorter, turn it into a 25-minute checklist, or draft a message to your professor.`,
      suggestions: ["Make it shorter", "Improve My Grade", "Message My Professor", "Prep for Exam"],
      generatedPlan: plan,
      topic: "study plan",
    };
  }

  if (/(grade|gpa|projected gpa|final grade|what do i need|need to get an a|score do i need|improve my grade|lowest grade|grade risk|raise my gpa)/.test(normalized)) {
    const database = context.courses.find((item) => item.id === "database");
    return {
      body: `Quick read\nYour projected GPA is ${context.projectedGpa}. The best grade-improvement target is Database Systems because it has the lowest projected course grade and a high-weight midterm.\n\nRecommended next steps\n1. Aim for 88% or higher on the Database Systems midterm to move the course toward the A range.\n2. Protect Computer Networks by submitting the protocol analysis before extra review work.\n3. Keep Software Engineering above 90% by finishing the UML and traceability pieces early.\n\nWhy this matters\nThe fastest GPA lift usually comes from the course with the biggest score gap and the highest remaining assessment weight.\n\nSuggested follow-up\nAsk what score you need in ${database?.name ?? "Database Systems"} or use the sliders below to test outcomes.`,
      suggestions: ["What score do I need for an A?", "Help with Database Systems", "Build Study Plan", "Lowest grade risk"],
      topic: "grades",
      courseId: "database",
    };
  }

  if (/(deadline|due|overdue|today|tomorrow|upcoming assignments|calendar|review deadlines)/.test(normalized)) {
    return {
      body:
        "Quick read\nThe highest priority deadline is Network Protocol Analysis due May 6. Software Engineering is due May 8, and Database Systems needs steady exam prep before May 11.\n\nRecommended next steps\n1. Finish Computer Networks submission work first.\n2. Put a 30-minute Software Engineering block on your calendar.\n3. Reserve two Database Systems practice sessions before the midterm.\n\nWhy this matters\nDeadline planning works best when due work and exam prep are both visible.\n\nSuggested follow-up\nAsk me to time block your day.",
      suggestions: ["Time Block My Day", "Build Study Plan", "Prep for Exam", "Message My Professor"],
      topic: "deadlines",
    };
  }

  if (/(quiz|exam|midterm|final|time limit|attempts|focus mode|study for quiz|prepare for exam|prep for quiz|prep for exam)/.test(normalized)) {
    return {
      body:
        "Quick read\nPrep should start with retrieval practice, not rereading. Database Systems is the nearest exam target, while Computer Networks is the likely quiz target.\n\nRecommended next steps\n1. Database Systems: practice normalization, joins, keys, transactions, ACID, and indexing.\n2. Computer Networks: drill TCP vs UDP, IP addressing, DNS, subnetting, OSI layers, routing, packets, and protocols.\n3. Use focus mode habits: one tab, timer visible, scratch notes ready.\n\nWhy this matters\nTimed assessments reward fast recall and error correction more than passive review.\n\nSuggested follow-up\nAsk for a Database Systems practice order or a Computer Networks quiz drill.",
      suggestions: ["Help with Database Systems", "Help with Computer Networks", "Time Block My Day", "Improve My Grade"],
      topic: "quiz and exam prep",
      courseId: courseId ?? "database",
    };
  }

  if (courseId) {
    return buildCourseResponse(courseId);
  }

  if (/(message professor|ask professor|ask instructor|study group|classmates|help desk|office hours|email professor)/.test(normalized)) {
    return {
      body:
        "Quick read\nA good academic message is specific, short, and easy to answer.\n\nRecommended next steps\n1. Name the course and assignment or topic.\n2. Say what you already tried.\n3. Ask one concrete question.\n4. Include your availability for office hours or study group work.\n\nSuggested message\nHello Professor, I am working on the current assignment and got stuck on one part after reviewing the notes. Could you clarify the expected approach for [topic]? I can attend office hours or send my current draft if helpful.\n\nSuggested follow-up\nTell me the course and I will tailor the message.",
      suggestions: ["Tailor for Database Systems", "Tailor for Software Engineering", "Tailor for Computer Networks", "Review Deadlines"],
      topic: "communication",
    };
  }

  if (/(high contrast|dyslexia font|font size|focus|keyboard|captions|accessibility|settings)/.test(normalized)) {
    return {
      body:
        "Quick read\nAccessibility support is about reducing friction before the study session starts.\n\nRecommended next steps\n1. Use high contrast if text or status colors feel hard to scan.\n2. Increase font size for long readings and quiz review.\n3. Use keyboard navigation for repeated LMS actions.\n4. Turn on captions or transcripts for recorded lectures when available.\n5. Use focus mode habits: one task, timer, and notifications minimized.\n\nWhy this matters\nSmall settings changes can lower fatigue and improve accuracy during quizzes, reading, and submissions.\n\nSuggested follow-up\nAsk me for a focus-mode setup for tonight.",
      suggestions: ["Focus-mode setup", "Time Block My Day", "Prep for Quiz", "What should I do next?"],
      topic: "accessibility",
    };
  }

  if (/(weak topic|weak area|explain weak|what am i weak)/.test(normalized)) {
    return {
      body:
        "Quick read\nYour weak-topic map points to three different study modes: practice problems for Database Systems, diagram cleanup for Software Engineering, and drills for Computer Networks.\n\nRecommended next steps\n1. Database Systems: normalization, joins, keys, ACID, and indexing.\n2. Software Engineering: requirements, user stories, UML, testing, traceability, and sprint artifacts.\n3. Computer Networks: TCP, UDP, IP, DNS, subnetting, OSI, routing, packets, and protocols.\n\nWhy this matters\nWeak topics improve faster when you choose the right practice format instead of rereading everything.\n\nSuggested follow-up\nPick one course and I will make a short drill.",
      suggestions: ["Help with Database Systems", "Help with Software Engineering", "Help with Computer Networks", "Build Study Plan"],
      topic: "weak topics",
    };
  }

  return {
    body:
      "Quick read\nI can help with grades, deadlines, quizzes, course topics, communication, accessibility, or study planning.\n\nRecommended next steps\n1. Pick one area: grades, deadlines, quizzes, or a course.\n2. If you are unsure, start with: What should I do next?\n3. If you have a course in mind, mention Computer Networks, Software Engineering, or Database Systems.\n\nSuggested follow-up\nWhich one should we work on first?",
    suggestions: ["What should I do next?", "Help with Database Systems", "Improve My Grade", "Review Deadlines"],
    topic: "fallback",
  };
}

function buildCourseResponse(courseId: CourseId): AssistantResponse {
  if (courseId === "database") {
    return {
      body:
        "Quick read\nDatabase Systems should be your main grade-improvement course right now.\n\nRecommended next steps\n1. Review normalization in order: 1NF, 2NF, then 3NF.\n2. Practice joins with expected row counts before writing SQL from memory.\n3. Recheck keys, ER diagrams, transactions, ACID, and indexing.\n4. End with a short mixed quiz so you can find weak spots.\n\nWhy this matters\nDatabase questions often combine definitions with applied schema reasoning, so practice order matters.\n\nSuggested follow-up\nAsk for a 30-minute Database Systems drill.",
      suggestions: ["30-minute Database drill", "Prep for Exam", "Improve My Grade", "Make it shorter"],
      topic: "Database Systems",
      courseId: "database",
    };
  }

  if (courseId === "software") {
    return {
      body:
        "Quick read\nSoftware Engineering needs a clean milestone workflow more than raw memorization.\n\nRecommended next steps\n1. Confirm requirements and user stories.\n2. Sketch the UML or sequence diagram before polishing text.\n3. Link each story to acceptance criteria and testing notes.\n4. Check traceability before submission.\n\nWhy this matters\nAgile, scrum, architecture, testing, and traceability questions usually reward clear relationships between artifacts.\n\nSuggested follow-up\nAsk me to turn one user story into a traceability checklist.",
      suggestions: ["Traceability checklist", "Message My Professor", "Build Study Plan", "Review Deadlines"],
      topic: "Software Engineering",
      courseId: "software",
    };
  }

  return {
    body:
      "Quick read\nComputer Networks is your urgent deadline course right now.\n\nRecommended next steps\n1. Finish the packet/protocol analysis before optional review.\n2. Drill TCP vs UDP, IP, DNS, subnetting, OSI, routing, packets, and protocols.\n3. For subnetting, write each step instead of doing it mentally.\n4. For TCP, focus on reliability, retransmission, and ordering.\n\nWhy this matters\nNetwork topics become easier when you connect packet behavior to protocol purpose.\n\nSuggested follow-up\nAsk for a subnetting drill or TCP vs UDP comparison.",
    suggestions: ["Subnetting drill", "TCP vs UDP comparison", "Review Deadlines", "Prep for Quiz"],
    topic: "Computer Networks",
    courseId: "networks",
  };
}

function detectCourse(normalized: string): CourseId | undefined {
  if (/(database|sql|normalization|1nf|2nf|3nf|joins?|keys?|er diagram|transaction|acid|indexing)/.test(normalized)) return "database";
  if (/(software engineering|requirements?|user stor|agile|scrum|uml|sequence diagram|architecture|testing|traceability|sprint)/.test(normalized)) return "software";
  if (/(computer networks|networks|tcp|udp|ip\b|dns|subnet|osi|routing|packet|protocol)/.test(normalized)) return "networks";
  return undefined;
}

function buildStudyPlan(courses: Array<CoursePlan & Partial<{ projectedGrade: number }>>) {
  const database = courses.find((course) => course.id === "database") ?? COURSES[2];
  const software = courses.find((course) => course.id === "software") ?? COURSES[1];
  const networks = courses.find((course) => course.id === "networks") ?? COURSES[0];

  return `Quick read
This plan protects urgent work first, then shifts into high-value exam and grade improvement.

Today
- Course focus: ${networks.name}
- Estimated time: 25-45 minutes
- Deliverable: finish ${networks.deadline}; review TCP/IP, DNS, packets, protocols, and subnetting notes.

Tomorrow
- Course focus: ${software.name}
- Estimated time: 30-45 minutes
- Deliverable: complete UML or sequence diagram cleanup and connect requirements to testing or traceability.

This week
- Course focus: ${database.name}
- Estimated time: 2 focused blocks of 45 minutes
- Deliverable: practice normalization from 1NF to 3NF, SQL joins, keys, ER diagrams, transactions, ACID, and indexing.

Course focus order
1. ${networks.name}: nearest deadline.
2. ${database.name}: strongest grade-improvement opportunity.
3. ${software.name}: project quality and milestone polish.

Suggested follow-up
Ask Comet AI to make this shorter, time block your day, or prep you for the Database Systems exam.`;
}

function calculateProjectedGrade(course: CoursePlan) {
  return Math.round(course.currentGrade * (1 - course.weight) + course.projectedScore * course.weight);
}

function CometSky() {
  return (
    <div className="pointer-events-none mt-5 h-16 overflow-hidden rounded border border-white/10 bg-slate-900/40" aria-hidden="true">
      <div className="relative h-full">
        <span className="absolute left-[10%] top-4 h-1.5 w-1.5 animate-pulse rounded-full bg-cyan-200 shadow-[0_0_12px_rgba(125,211,252,0.9)]" />
        <span className="absolute left-[30%] top-9 h-1 w-1 rounded-full bg-orange-200 shadow-[0_0_10px_rgba(253,186,116,0.8)]" />
        <span className="absolute left-[64%] top-3 h-1.5 w-1.5 animate-pulse rounded-full bg-white shadow-[0_0_12px_rgba(255,255,255,0.85)] [animation-delay:400ms]" />
        <span className="absolute left-[84%] top-10 h-1 w-1 rounded-full bg-cyan-100 shadow-[0_0_10px_rgba(207,250,254,0.8)]" />
        <span className="absolute left-[-22%] top-7 h-0.5 w-28 -rotate-12 animate-[comet-drift_5.5s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-cyan-200 to-white shadow-[0_0_14px_rgba(125,211,252,0.7)]" />
        <span className="absolute left-[22%] top-2 h-0.5 w-20 -rotate-12 animate-[comet-drift_7s_ease-in-out_infinite] rounded-full bg-gradient-to-r from-transparent via-orange-200 to-white shadow-[0_0_12px_rgba(251,146,60,0.65)] [animation-delay:1.4s]" />
        <style>{`
          @keyframes comet-drift {
            0% { transform: translateX(0) translateY(0) rotate(-12deg); opacity: 0; }
            15% { opacity: 0.9; }
            65% { opacity: 0.75; }
            100% { transform: translateX(1350%) translateY(22px) rotate(-12deg); opacity: 0; }
          }
        `}</style>
      </div>
    </div>
  );
}

function generateAlerts(courses: Array<CoursePlan & { projectedGrade: number }>) {
  const alerts: string[] = [];
  const database = courses.find((course) => course.id === "database");
  if (database && database.projectedGrade < 86) {
    alerts.push("Database Systems is the strongest grade-risk signal; schedule an extra review block before the midterm.");
  }
  alerts.push("Computer Networks has the nearest deadline; finish protocol analysis before lower-priority review.");
  alerts.push("Software Engineering has a milestone soon; handle UML and traceability before final polishing.");
  return alerts;
}

async function copyText(text: string) {
  if (navigator.clipboard?.writeText) {
    await navigator.clipboard.writeText(text);
    return;
  }

  const textArea = document.createElement("textarea");
  textArea.value = text;
  textArea.setAttribute("readonly", "true");
  textArea.style.position = "fixed";
  textArea.style.opacity = "0";
  document.body.appendChild(textArea);
  textArea.select();
  document.execCommand("copy");
  document.body.removeChild(textArea);
}

function getCurrentTime() {
  return new Intl.DateTimeFormat(undefined, { hour: "numeric", minute: "2-digit" }).format(new Date());
}

function iconButtonClass() {
  return cn("inline-flex h-9 w-9 items-center justify-center rounded border border-slate-200 text-slate-600 transition-colors hover:bg-slate-50 hover:text-slate-950", FOCUS_RING);
}

function smallButtonClass() {
  return cn("inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 transition-colors hover:bg-slate-50", FOCUS_RING);
}

function CometContextCard({
  projectedGpa,
  courseNeedingAttention,
  highestPriorityDeadline,
  nextAssessment,
}: {
  projectedGpa: string;
  courseNeedingAttention: string;
  highestPriorityDeadline: string;
  nextAssessment: string;
}) {
  return (
    <div className="rounded border border-white/15 bg-white/10 p-4">
      <h3 className="mb-3 flex items-center gap-2 text-sm font-black uppercase tracking-wide text-cyan-100">
        <Target className="h-4 w-4" />
        Comet Context
      </h3>
      <div className="space-y-3">
        <ContextRow inverted label="Highest priority" value={highestPriorityDeadline} />
        <ContextRow inverted label="Course needing attention" value={courseNeedingAttention} />
        <ContextRow inverted label="Current projected GPA" value={projectedGpa} />
        <ContextRow inverted label="Next quiz or exam" value={nextAssessment} />
      </div>
    </div>
  );
}

function ContextRow({ label, value, inverted = false }: { label: string; value: string; inverted?: boolean }) {
  return (
    <div className={cn("rounded border p-3", inverted ? "border-white/10 bg-slate-950/30" : "border-slate-200 bg-slate-50")}>
      <p className={cn("text-xs font-black uppercase tracking-wide", inverted ? "text-cyan-100" : "text-slate-500")}>{label}</p>
      <p className={cn("mt-1 text-sm font-semibold", inverted ? "text-white" : "text-slate-800")}>{value}</p>
    </div>
  );
}

function MetricCard({
  icon: Icon,
  label,
  value,
  detail,
}: {
  icon: LucideIcon;
  label: string;
  value: string;
  detail: string;
}) {
  return (
    <article className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-slate-900 text-cyan-300">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{detail}</p>
    </article>
  );
}

function Panel({
  icon: Icon,
  title,
  description,
  children,
}: {
  icon: LucideIcon;
  title: string;
  description?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4">
        <h3 className="flex items-center gap-2 text-lg font-bold text-slate-900">
          <Icon className="h-4 w-4" />
          {title}
        </h3>
        {description && <p className="mt-0.5 text-xs text-slate-600">{description}</p>}
      </div>
      {children}
    </section>
  );
}
