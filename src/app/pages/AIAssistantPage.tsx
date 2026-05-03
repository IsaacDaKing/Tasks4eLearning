import { useEffect, useMemo, useRef, useState, type FormEvent, type KeyboardEvent, type ReactNode } from "react";
import {
  AlertCircle,
  BarChart3,
  CalendarClock,
  Clock,
  Copy,
  GraduationCap,
  ListChecks,
  RotateCcw,
  Send,
  Sparkles,
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
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

interface CoursePlan {
  id: string;
  code: string;
  name: string;
  currentGrade: number;
  lowRange: number;
  highRange: number;
  weakArea: string;
  deadline: string;
  scoreLabel: string;
  projectedScore: number;
  weight: number;
}

interface ChatMessage {
  id: string;
  sender: "You" | "Assistant";
  body: string;
}

interface AssistantResponse {
  body: string;
  suggestions: string[];
}

const COURSES: CoursePlan[] = [
  {
    id: "networks",
    code: "CS 4390.0W1",
    name: "Computer Networks",
    currentGrade: 88,
    lowRange: 84,
    highRange: 94,
    weakArea: "TCP/IP and subnetting",
    deadline: "Network Protocol Analysis due tonight",
    scoreLabel: "Protocol analysis score",
    projectedScore: 86,
    weight: 0.22,
  },
  {
    id: "software",
    code: "CS 3354.012",
    name: "Software Engineering",
    currentGrade: 91,
    lowRange: 87,
    highRange: 96,
    weakArea: "UML and traceability",
    deadline: "Design Patterns Lab due tomorrow",
    scoreLabel: "Design lab score",
    projectedScore: 90,
    weight: 0.25,
  },
  {
    id: "database",
    code: "CS 4347.002",
    name: "Database Systems",
    currentGrade: 84,
    lowRange: 78,
    highRange: 93,
    weakArea: "Normalization, joins, and ACID",
    deadline: "Database Normalization Midterm in 3 days",
    scoreLabel: "Midterm score",
    projectedScore: 82,
    weight: 0.3,
  },
];

const TIME_BLOCKS = [
  "45 minutes Database Systems: normalization, joins, and ACID review.",
  "30 minutes Software Engineering: project planning and UML sequence diagram cleanup.",
  "25 minutes Computer Networks: subnetting drills and TCP reliability review.",
];

const QUICK_ACTIONS = ["Grade Path", "Retake Options", "Study Plan", "Priorities"];

const DEFAULT_SUGGESTIONS = [
  "Build my study plan",
  "What should I do next?",
  "How can I improve my GPA?",
  "Help with Database Systems",
];

export function AIAssistantPage() {
  const [courses, setCourses] = useState(COURSES);
  const [studyPlan, setStudyPlan] = useState<string[]>([]);
  const [chatInput, setChatInput] = useState("");
  const [isAssistantTyping, setIsAssistantTyping] = useState(false);
  const [suggestions, setSuggestions] = useState(DEFAULT_SUGGESTIONS);
  const [copyNotice, setCopyNotice] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: "assistant-welcome",
      sender: "Assistant",
      body:
        "Hi! I can help you plan study time, understand your grades, prioritize deadlines, or create a study plan. What would you like to work on?",
    },
  ]);
  const typingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const typingIntervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
      if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    };
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

  const attentionCount = projectedCourses.filter(
    (course) => course.projectedGrade < 86 || course.id === "database",
  ).length;

  const alerts = useMemo(() => generateAlerts(projectedCourses), [projectedCourses]);

  const updateProjectedScore = (courseId: string, score: number) => {
    setCourses((current) =>
      current.map((course) =>
        course.id === courseId ? { ...course, projectedScore: score } : course,
      ),
    );
  };

  const generateStudyPlan = () => {
    const sortedCourses = [...projectedCourses].sort((a, b) => a.projectedGrade - b.projectedGrade);
    setStudyPlan(
      sortedCourses.map((course) => {
        if (course.id === "database") return "Review normalization and joins for Database Systems.";
        if (course.id === "software") return "Draft UML sequence diagram for Software Engineering.";
        return "Practice subnetting and TCP/IP review for Computer Networks.";
      }),
    );
  };

  const submitPrompt = (prompt: string) => {
    const trimmedPrompt = prompt.trim();
    if (!trimmedPrompt || isAssistantTyping) return;
    const response = getRuleBasedResponse(trimmedPrompt);

    setMessages((current) => [
      ...current,
      { id: `user-${Date.now()}`, sender: "You", body: trimmedPrompt },
    ]);
    setChatInput("");
    setCopyNotice("");
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
    setIsAssistantTyping(true);
    setSuggestions([]);

    typingTimeoutRef.current = setTimeout(() => {
      const messageId = `assistant-${Date.now()}`;
      let visibleLength = 0;
      setMessages((current) => [...current, { id: messageId, sender: "Assistant", body: "" }]);

      typingIntervalRef.current = setInterval(() => {
        visibleLength = Math.min(response.body.length, visibleLength + 4);
        setMessages((current) =>
          current.map((message) =>
            message.id === messageId ? { ...message, body: response.body.slice(0, visibleLength) } : message,
          ),
        );

        if (visibleLength >= response.body.length) {
          if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
          setIsAssistantTyping(false);
          setSuggestions(response.suggestions);
        }
      }, 18);
    }, 450);
  };

  const resetChat = () => {
    if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current);
    if (typingIntervalRef.current) clearInterval(typingIntervalRef.current);
    setIsAssistantTyping(false);
    setSuggestions(DEFAULT_SUGGESTIONS);
    setCopyNotice("");
    setChatInput("");
    setMessages([
      {
        id: "assistant-welcome-reset",
        sender: "Assistant",
        body:
          "Hi! I can help you plan study time, understand your grades, prioritize deadlines, or create a study plan. What would you like to work on?",
      },
    ]);
  };

  const copyLatestAssistantResponse = async () => {
    const latestAssistantMessage = [...messages].reverse().find((message) => message.sender === "Assistant" && message.body.trim());
    if (!latestAssistantMessage) return;
    await copyText(latestAssistantMessage.body);
    setCopyNotice("Latest assistant response copied.");
  };

  const copyStudyPlan = async () => {
    const planText = (studyPlan.length ? studyPlan : TIME_BLOCKS).map((item, index) => `${index + 1}. ${item}`).join("\n");
    await copyText(planText);
    setCopyNotice("Study plan copied.");
  };

  return (
    <div className="p-4 sm:p-6 space-y-6 max-w-[1600px] mx-auto animate-in fade-in duration-500">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-end lg:justify-between">
        <div>
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-slate-900">
            <Sparkles className="h-6 w-6 text-blue-600" />
            AI Student Success Assistant
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Prototype study planning, grade simulation, GPA projection, and success alerts.
          </p>
        </div>
        <div className="rounded border border-blue-200 bg-blue-50 px-4 py-3 text-sm font-bold text-blue-900">
          Prototype assistant: recommendations are generated from local course data and rule-based logic. No external AI API is used.
        </div>
      </div>

      <section className="grid gap-3 md:grid-cols-4" aria-label="AI assistant overview">
        <MetricCard icon={GraduationCap} label="Current GPA" value={currentGpa.toFixed(2)} detail="Temporary local calculation" />
        <MetricCard icon={TrendingUp} label="Projected GPA" value={projectedGpa} detail="Updates from simulated scores" />
        <MetricCard icon={AlertCircle} label="Courses Needing Attention" value={String(attentionCount)} detail="Supportive priority signals" />
        <MetricCard icon={CalendarClock} label="High-Priority Deadlines" value="3" detail="Next 72 hours" />
      </section>

      <div className="grid gap-6">
        <section className="grid gap-6 xl:grid-cols-[minmax(0,1fr)_320px]">
          <div>
            <AssistantChatPanel
              messages={messages}
              isAssistantTyping={isAssistantTyping}
              suggestions={suggestions}
              chatInput={chatInput}
              copyNotice={copyNotice}
              setChatInput={setChatInput}
              submitPrompt={submitPrompt}
              sendMessage={sendMessage}
              handleChatKeyDown={handleChatKeyDown}
              copyLatestAssistantResponse={copyLatestAssistantResponse}
              resetChat={resetChat}
            />
          </div>

          <Panel icon={Target} title="What To Study Next" description="Priority order from local rules.">
            <div className="space-y-3">
              {projectedCourses
                .slice()
                .sort((a, b) => a.projectedGrade - b.projectedGrade)
                .map((course) => (
                  <div key={course.id} className="rounded border border-slate-200 p-3">
                    <p className="text-sm font-bold text-slate-900">{course.name}</p>
                    <p className="mt-1 text-xs text-slate-600">{course.weakArea}</p>
                    <p className="mt-2 text-xs font-bold text-blue-700">{course.deadline}</p>
                  </div>
                ))}
            </div>
          </Panel>
        </section>

        <main className="space-y-6">
          <Panel icon={BarChart3} title="Course Grade Planner" description="Adjust projected assignment or exam scores to simulate final course grades.">
            <div className="grid gap-4 lg:grid-cols-3">
              {projectedCourses.map((course) => (
                <article key={course.id} className="rounded border border-slate-200 bg-slate-50 p-4">
                  <div className="mb-4">
                    <p className="text-xs font-black uppercase tracking-wide text-slate-500">{course.code}</p>
                    <h3 className="text-lg font-bold text-slate-900">{course.name}</h3>
                    <p className="mt-1 text-xs text-slate-600">Potential range: {course.lowRange}% - {course.highRange}%</p>
                  </div>

                  <div className="mb-4 grid grid-cols-2 gap-3">
                    <div className="rounded bg-white p-3">
                      <p className="text-xs font-bold text-slate-500">Current</p>
                      <p className="text-2xl font-black text-slate-900">{course.currentGrade}%</p>
                    </div>
                    <div className="rounded bg-white p-3">
                      <p className="text-xs font-bold text-slate-500">Projected</p>
                      <p className="text-2xl font-black text-blue-700">{course.projectedGrade}%</p>
                    </div>
                  </div>

                  <label className="text-sm font-bold text-slate-700" htmlFor={`${course.id}-score`}>
                    {course.scoreLabel}: {course.projectedScore}%
                  </label>
                  <input
                    id={`${course.id}-score`}
                    type="range"
                    min="50"
                    max="100"
                    value={course.projectedScore}
                    onChange={(event) => updateProjectedScore(course.id, Number(event.target.value))}
                    className={cn("mt-2 w-full accent-blue-600", FOCUS_RING)}
                  />
                  <input
                    aria-label={`${course.name} projected score`}
                    type="number"
                    min="50"
                    max="100"
                    value={course.projectedScore}
                    onChange={(event) => updateProjectedScore(course.id, clampScore(Number(event.target.value)))}
                    className={cn("mt-3 w-full rounded border border-slate-200 px-3 py-2 text-sm", FOCUS_RING)}
                  />
                </article>
              ))}
            </div>
          </Panel>

          <div className="grid gap-6 lg:grid-cols-2">
            <Panel icon={AlertCircle} title="Rule-Based Success Alerts" description="Supportive alerts from local mock conditions.">
              <div className="space-y-3">
                {alerts.map((alert) => (
                  <div key={alert} className="rounded border border-amber-200 bg-amber-50 p-3 text-sm text-amber-900">
                    <p className="font-bold">{alert}</p>
                  </div>
                ))}
              </div>
            </Panel>

            <Panel icon={ListChecks} title="Study Plan Generator" description="Curates tasks from upcoming deadlines and weaker areas.">
              <button
                type="button"
                onClick={generateStudyPlan}
                className={cn("inline-flex items-center gap-2 rounded bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700", FOCUS_RING)}
              >
                <Sparkles className="h-4 w-4" />
                Generate Study Plan
              </button>
              <button
                type="button"
                onClick={copyStudyPlan}
                className={cn("ml-2 mt-2 inline-flex items-center gap-2 rounded border border-slate-200 px-4 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 sm:mt-0", FOCUS_RING)}
              >
                <Copy className="h-4 w-4" />
                Copy Study Plan
              </button>
              <ol className="mt-4 space-y-2 text-sm text-slate-700" aria-live="polite">
                {(studyPlan.length ? studyPlan : ["Generate a playlist to see recommended tasks."]).map((task, index) => (
                  <li key={task} className="flex gap-2 rounded border border-slate-200 bg-slate-50 p-3">
                    {studyPlan.length > 0 && <span className="font-black text-slate-900">{index + 1}.</span>}
                    <span>{task}</span>
                  </li>
                ))}
              </ol>
            </Panel>
          </div>

          <Panel icon={Clock} title="Time Management Strategies" description="Suggested study blocks for the next focused session.">
            <div className="grid gap-3 md:grid-cols-3">
              {TIME_BLOCKS.map((block) => (
                <div key={block} className="rounded border border-slate-200 bg-slate-50 p-4 text-sm font-medium text-slate-700">
                  {block}
                </div>
              ))}
            </div>
          </Panel>
        </main>

      </div>
    </div>
  );
}

function calculateProjectedGrade(course: CoursePlan) {
  return Math.round(course.currentGrade * (1 - course.weight) + course.projectedScore * course.weight);
}

function clampScore(score: number) {
  if (Number.isNaN(score)) return 50;
  return Math.min(100, Math.max(50, score));
}

function generateAlerts(courses: Array<CoursePlan & { projectedGrade: number }>) {
  const alerts: string[] = [];
  const database = courses.find((course) => course.id === "database");
  if (database && database.projectedGrade < 86) {
    alerts.push("Database Systems may benefit from an extra review block before the midterm.");
  }
  alerts.push("Software Engineering has a project milestone soon; schedule UML and traceability work before final polishing.");
  alerts.push("Computer Networks has an immediate deadline; finish protocol analysis before starting lower-priority review.");
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

function getRuleBasedResponse(prompt: string): AssistantResponse {
  const normalized = prompt.toLowerCase();

  if (/\b(hi|hello|hey|howdy|good morning|good afternoon)\b/.test(normalized)) {
    return {
      body:
        "Hi! I can help you plan your study time, understand your grades, prioritize deadlines, or create a study plan.\n\nNext step:\n- Tell me which course or deadline you want to work on first.",
      suggestions: ["Build my study plan", "What should I do next?", "How can I improve my GPA?", "Prioritize this week"],
    };
  }

  if (/(grade|gpa|projection|projected|score|improve my gpa)/.test(normalized)) {
    return {
      body:
        "Here’s what I recommend for your grade path:\n- Protect the high-weight Database Systems midterm by aiming for 85% or higher.\n- Finish the Computer Networks protocol analysis before lower-priority review.\n- Use the grade sliders to test best-case and realistic outcomes.\n\nNext step:\n- Simulate one course at a time, starting with Database Systems.",
      suggestions: ["Prioritize this week", "Retake Options", "Help with Database Systems", "Build my study plan"],
    };
  }

  if (/(study plan|playlist|schedule|plan my study|study time)/.test(normalized)) {
    return {
      body:
        "Study plan:\n1. Database Systems: review normalization and joins for 45 minutes.\n2. Software Engineering: draft the UML sequence diagram for 30 minutes.\n3. Computer Networks: practice subnetting and TCP/IP review for 25 minutes.\n\nNext step:\n- Generate the playlist so it appears in the study plan panel.",
      suggestions: ["What should I do next?", "Help with Database Systems", "Help with Software Engineering", "Help with Computer Networks"],
    };
  }

  if (/(priority|priorities|what should i do next|next|focus|this week)/.test(normalized)) {
    return {
      body:
        "Priority order:\n1. Finish urgent due work first: Computer Networks protocol analysis.\n2. Review Database Systems normalization and joins before the exam.\n3. Polish Software Engineering UML and traceability notes.\n\nNext step:\n- Start with one 25-minute Networks block, then switch courses.",
      suggestions: ["Build my study plan", "Deadlines this week", "How can I improve my GPA?", "I feel overwhelmed"],
    };
  }

  if (/(deadline|due|late|calendar|upcoming)/.test(normalized)) {
    return {
      body:
        "Upcoming deadline check:\n- Computer Networks analysis is the most urgent.\n- Software Engineering lab is next and needs UML work.\n- Database Systems midterm is soon, so review should start before the night before.\n\nNext step:\n- Reserve one block today for the closest deadline.",
      suggestions: ["Prioritize this week", "Build my study plan", "Help with Computer Networks", "Help with Software Engineering"],
    };
  }

  if (/(database|sql|normalization|normalisation|join|joins|acid|index|keys?)/.test(normalized)) {
    return {
      body:
        "Database Systems focus:\n- Review 2NF and 3NF using one small schema.\n- Practice INNER JOIN vs LEFT JOIN with expected row counts.\n- Recheck keys, indexes, and ACID definitions.\n\nNext step:\n- Do 3 join questions before reading more notes.",
      suggestions: ["Quiz or exam prep", "How can I improve my GPA?", "Build my study plan", "What should I do next?"],
    };
  }

  if (/(software|uml|user stor|testing|requirement|scrum|agile|traceability)/.test(normalized)) {
    return {
      body:
        "Software Engineering focus:\n- Draft the UML sequence diagram first.\n- Map each interaction to a user story and acceptance criteria.\n- Add a short testing note for the riskiest requirement.\n\nNext step:\n- Pick one user story and trace it from requirement to test.",
      suggestions: ["Assignment help", "Prioritize this week", "Build my study plan", "How can I improve my GPA?"],
    };
  }

  if (/(network|tcp|ip|subnet|subnetting|dns|packet|udp|protocol)/.test(normalized)) {
    return {
      body:
        "Computer Networks focus:\n- Review TCP reliability, duplicate ACKs, and retransmissions.\n- Practice subnet-mask examples until the steps feel automatic.\n- Recheck DNS and transport-layer protocol differences.\n\nNext step:\n- Annotate the packet capture before polishing the written answer.",
      suggestions: ["Assignment help", "Quiz or exam prep", "Prioritize this week", "Build my study plan"],
    };
  }

  if (/(stress|overwhelmed|confused|stuck|panic|anxious|too much)/.test(normalized)) {
    return {
      body:
        "Let’s make this smaller:\n1. Pick the nearest deadline only.\n2. Work for 20 minutes, then stop and reassess.\n3. Write down one question to ask your instructor or group.\n\nNext step:\n- Start with the task that removes the most immediate pressure.",
      suggestions: ["What should I do next?", "Prioritize this week", "Build my study plan", "Deadlines this week"],
    };
  }

  if (/(retake|redo|make up|makeup|attempt)/.test(normalized)) {
    return {
      body:
        "Retake options:\n- Check each course policy before counting on a retake.\n- If a retake exists, use it where the assessment weight and score gap are largest.\n- Practice the missed topic before attempting again.\n\nNext step:\n- Compare the course with the lowest projected grade first.",
      suggestions: ["Grade Path", "How can I improve my GPA?", "Quiz or exam prep", "Help with Database Systems"],
    };
  }

  if (/(assignment|homework|project|lab|submit|submission)/.test(normalized)) {
    return {
      body:
        "Assignment help:\n- Confirm the rubric and required format first.\n- Work backward from the due date into one drafting block and one review block.\n- Submit early enough to fix upload or formatting issues.\n\nNext step:\n- Tell me the course or assignment title you want to break down.",
      suggestions: ["Help with Software Engineering", "Help with Computer Networks", "Deadlines this week", "Build my study plan"],
    };
  }

  if (/(quiz|exam|test|midterm|final|prepare|prep)/.test(normalized)) {
    return {
      body:
        "Quiz or exam prep:\n- Spend the first block on retrieval practice, not rereading.\n- Make a short miss list of topics you get wrong.\n- End with 5 minutes of formula or definition review.\n\nNext step:\n- Start with Database Systems if the midterm is your nearest exam.",
      suggestions: ["Help with Database Systems", "How can I improve my GPA?", "Build my study plan", "What should I do next?"],
    };
  }

  return {
    body:
      "Here’s a general way to move forward:\n- Do one urgent deadline block.\n- Do one weak-area review block.\n- Do one short confidence-building practice block.\n\nNext step:\n- Ask me about a course, GPA, deadlines, or a study plan.",
    suggestions: DEFAULT_SUGGESTIONS,
  };
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
      <div className="mb-3 flex h-9 w-9 items-center justify-center rounded bg-slate-800 text-white">
        <Icon className="h-4 w-4" />
      </div>
      <p className="text-xs font-black uppercase tracking-wide text-slate-500">{label}</p>
      <p className="mt-2 text-3xl font-black text-slate-900">{value}</p>
      <p className="mt-1 text-xs text-slate-600">{detail}</p>
    </article>
  );
}

function AssistantChatPanel({
  messages,
  isAssistantTyping,
  suggestions,
  chatInput,
  copyNotice,
  setChatInput,
  submitPrompt,
  sendMessage,
  handleChatKeyDown,
  copyLatestAssistantResponse,
  resetChat,
}: {
  messages: ChatMessage[];
  isAssistantTyping: boolean;
  suggestions: string[];
  chatInput: string;
  copyNotice: string;
  setChatInput: (value: string) => void;
  submitPrompt: (prompt: string) => void;
  sendMessage: (event: FormEvent) => void;
  handleChatKeyDown: (event: KeyboardEvent<HTMLTextAreaElement>) => void;
  copyLatestAssistantResponse: () => void;
  resetChat: () => void;
}) {
  return (
    <Panel icon={Sparkles} title="Mock Assistant Chat" description="Rule-based responses, no external model.">
      <div className="mb-4 flex flex-wrap gap-2" aria-label="Assistant quick actions">
        {QUICK_ACTIONS.map((action) => (
          <button
            key={action}
            type="button"
            onClick={() => submitPrompt(action)}
            disabled={isAssistantTyping}
            className={cn("rounded border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50", FOCUS_RING)}
          >
            {action}
          </button>
        ))}
      </div>

      <div className="h-[460px] overflow-y-auto rounded border border-slate-200 bg-slate-50 p-3" aria-live="polite" aria-label="Assistant chat history">
        <div className="space-y-3">
          {messages.map((message) => (
            <article
              key={message.id}
              className={cn(
                "rounded border p-3 text-sm",
                message.sender === "You"
                  ? "ml-8 border-blue-200 bg-blue-600 text-white"
                  : "mr-8 border-slate-200 bg-white text-slate-700",
              )}
            >
              <p className="mb-1 text-xs font-black">{message.sender}</p>
              <p className="whitespace-pre-line leading-relaxed">{message.body}</p>
            </article>
          ))}
          {isAssistantTyping && messages[messages.length - 1]?.sender !== "Assistant" && (
            <div className="mr-8 rounded border border-slate-200 bg-white p-3 text-sm text-slate-700" role="status" aria-live="polite">
              <p className="mb-1 text-xs font-black">Assistant</p>
              <p>Assistant is typing...</p>
            </div>
          )}
        </div>
      </div>

      {suggestions.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-2" aria-label="Follow-up suggestions">
          {suggestions.map((suggestion) => (
            <button
              key={suggestion}
              type="button"
              onClick={() => submitPrompt(suggestion)}
              disabled={isAssistantTyping}
              className={cn("rounded-full border border-blue-200 bg-blue-50 px-3 py-1.5 text-xs font-bold text-blue-800 hover:bg-blue-100", FOCUS_RING)}
            >
              {suggestion}
            </button>
          ))}
        </div>
      )}

      <div className="mt-3 flex flex-wrap gap-2">
        <button type="button" onClick={copyLatestAssistantResponse} className={cn("inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50", FOCUS_RING)}>
          <Copy className="h-3.5 w-3.5" />
          Copy latest response
        </button>
        <button type="button" onClick={resetChat} className={cn("inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-1.5 text-xs font-bold text-slate-700 hover:bg-slate-50", FOCUS_RING)}>
          <RotateCcw className="h-3.5 w-3.5" />
          Reset chat
        </button>
      </div>
      {copyNotice && (
        <p className="mt-2 text-xs font-bold text-emerald-700" role="status" aria-live="polite">
          {copyNotice}
        </p>
      )}

      <form onSubmit={sendMessage} className="mt-4">
        <label className="sr-only" htmlFor="ai-chat-input">Ask the student success assistant</label>
        <div className="flex gap-2">
          <textarea
            id="ai-chat-input"
            value={chatInput}
            onChange={(event) => setChatInput(event.target.value)}
            onKeyDown={handleChatKeyDown}
            placeholder="Ask about grades, deadlines, study plans, or a course..."
            rows={2}
            className={cn("min-w-0 flex-1 resize-none rounded border border-slate-200 px-3 py-2 text-sm", FOCUS_RING)}
          />
          <button
            type="submit"
            disabled={!chatInput.trim() || isAssistantTyping}
            className={cn(
              "inline-flex items-center gap-2 rounded px-3 py-2 text-sm font-black",
              FOCUS_RING,
              chatInput.trim() && !isAssistantTyping
                ? "bg-slate-800 text-white hover:bg-slate-900"
                : "cursor-not-allowed bg-slate-200 text-slate-400",
            )}
          >
            <Send className="h-4 w-4" />
            Send
          </button>
        </div>
      </form>
    </Panel>
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
