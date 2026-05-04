import { useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  Bell,
  FileText,
  GraduationCap,
  HelpCircle,
  Mail,
  MessageSquare,
  Paperclip,
  Search,
  Send,
  Users,
  type LucideIcon,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const FOCUS_RING =
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";

type ConversationType = "All" | "Instructors" | "Study Groups" | "Classmates" | "Support";
type MessageTone = "normal" | "notification";

interface ChatMessage {
  id: string;
  sender: string;
  body: string;
  time: string;
  isMe?: boolean;
  tone?: MessageTone;
}

interface SharedFile {
  id: string;
  name: string;
  detail: string;
}

interface Conversation {
  id: string;
  type: Exclude<ConversationType, "All">;
  title: string;
  subtitle: string;
  course?: string;
  timestamp: string;
  unread: number;
  icon: LucideIcon;
  members?: string[];
  sharedFiles?: SharedFile[];
  messages: ChatMessage[];
}

const FILTERS: ConversationType[] = ["All", "Instructors", "Study Groups", "Classmates", "Support"];

const INITIAL_CONVERSATIONS: Conversation[] = [
  {
    id: "prof-wu",
    type: "Instructors",
    title: "Prof. Wei Wu",
    subtitle: "Database Systems",
    course: "CS 4347.002",
    timestamp: "18m ago",
    unread: 2,
    icon: GraduationCap,
    messages: [
      {
        id: "wu-1",
        sender: "Prof. Wei Wu",
        body: "I posted additional normalization review examples for the midterm. Focus on partial dependencies and join interpretation.",
        time: "9:12 AM",
      },
      {
        id: "wu-2",
        sender: "System Notification",
        body: "New grade feedback is available for SQL Query Optimization.",
        time: "9:18 AM",
        tone: "notification",
      },
      {
        id: "wu-3",
        sender: "You",
        body: "Thank you. Should I focus more on normalization proofs or SQL joins before the midterm?",
        time: "9:21 AM",
        isMe: true,
      },
      {
        id: "wu-4",
        sender: "Prof. Wei Wu",
        body: "Start with joins and keys, then use the normalization packet to check whether you can explain each dependency out loud.",
        time: "9:26 AM",
      },
      {
        id: "wu-5",
        sender: "You",
        body: "I tried the LEFT JOIN examples and got confused when unmatched rows still showed null values.",
        time: "9:42 AM",
        isMe: true,
      },
      {
        id: "wu-6",
        sender: "Prof. Wei Wu",
        body: "That is the right observation. In a LEFT JOIN, the left table keeps its unmatched rows, and the right-table columns become null.",
        time: "9:48 AM",
      },
      {
        id: "wu-7",
        sender: "Prof. Wei Wu",
        body: "For the May 11 midterm, practice predicting row counts before writing the query. That habit prevents most join mistakes.",
        time: "9:55 AM",
      },
      {
        id: "wu-8",
        sender: "You",
        body: "Got it. I will do row counts first and then check 2NF/3NF examples from the packet.",
        time: "10:03 AM",
        isMe: true,
      },
    ],
  },
  {
    id: "se-study-group",
    type: "Study Groups",
    title: "Software Engineering Sprint Group",
    subtitle: "Private study group",
    course: "CS 3354.012",
    timestamp: "42m ago",
    unread: 1,
    icon: Users,
    members: ["Carson Smith", "Maya Chen", "Carlos Rivera", "Priya Shah"],
    sharedFiles: [
      { id: "file-1", name: "Sprint-2-UML-Draft.pdf", detail: "Shared today by Maya" },
      { id: "file-2", name: "Traceability-Matrix.docx", detail: "Updated yesterday" },
    ],
    messages: [
      {
        id: "se-1",
        sender: "Maya Chen",
        body: "I uploaded the latest UML sequence diagram. Can someone check whether the service boundary matches the user story?",
        time: "8:40 AM",
      },
      {
        id: "se-2",
        sender: "Carlos Rivera",
        body: "I can review it after class. I also added a draft traceability matrix to the shared files.",
        time: "8:55 AM",
      },
      {
        id: "se-3",
        sender: "Priya Shah",
        body: "I marked two user stories that still need acceptance criteria. They are in the comments on the traceability file.",
        time: "9:04 AM",
      },
    ],
  },
  {
    id: "classmate-networks",
    type: "Classmates",
    title: "Jordan Lee",
    subtitle: "Computer Networks classmate",
    course: "CS 4390.0W1",
    timestamp: "Yesterday",
    unread: 0,
    icon: MessageSquare,
    messages: [
      {
        id: "net-1",
        sender: "Jordan Lee",
        body: "Did you see the packet capture note about TCP retransmissions? I think that is the tricky part of the analysis.",
        time: "Yesterday",
      },
      {
        id: "net-2",
        sender: "You",
        body: "Yes, I marked the duplicate ACKs and compared them against the congestion-control slide.",
        time: "Yesterday",
        isMe: true,
      },
      {
        id: "net-3",
        sender: "Jordan Lee",
        body: "Can we also compare subnetting steps? I keep mixing up the host range and broadcast address.",
        time: "Yesterday",
      },
    ],
  },
  {
    id: "help-desk",
    type: "Support",
    title: "LMS Support Desk",
    subtitle: "Technical support",
    timestamp: "Mon",
    unread: 1,
    icon: HelpCircle,
    messages: [
      {
        id: "help-1",
        sender: "LMS Support",
        body: "Your push notifications are enabled for assignment postings, grade feedback, and course announcements.",
        time: "Monday",
        tone: "notification",
      },
      {
        id: "help-2",
        sender: "LMS Support",
        body: "If you stop receiving browser notifications, check notification permissions in your browser settings.",
        time: "Monday",
      },
      {
        id: "help-3",
        sender: "You",
        body: "Thanks, notifications are working on my laptop now.",
        time: "Monday",
        isMe: true,
      },
      {
        id: "help-4",
        sender: "LMS Support",
        body: "For quiz access, use the Start Assessment button once, keep the timer tab open, and turn on Focus Mode or high contrast before answering if needed.",
        time: "Monday",
      },
    ],
  },
  {
    id: "prof-smith",
    type: "Instructors",
    title: "Prof. Klyne Smith",
    subtitle: "Software Engineering",
    course: "CS 3354.012",
    timestamp: "12m ago",
    unread: 3,
    icon: GraduationCap,
    messages: [
      {
        id: "smith-1",
        sender: "Prof. Klyne Smith",
        body: "Assignment posted: Software Design Patterns Lab. Please include a short note explaining why your selected pattern fits the architecture.",
        time: "Tuesday",
        tone: "notification",
      },
      {
        id: "smith-2",
        sender: "You",
        body: "Thanks, I will include the pattern rationale and update the UML diagram.",
        time: "Tuesday",
        isMe: true,
      },
      {
        id: "smith-3",
        sender: "You",
        body: "Could I send our current project draft for feedback on the requirements, sequence diagram, and testing plan before the milestone?",
        time: "Wednesday",
        isMe: true,
      },
      {
        id: "smith-4",
        sender: "Prof. Klyne Smith",
        body: "Yes. Send the draft with one or two specific questions, especially where you want feedback on whether the design supports the requirements.",
        time: "Wednesday",
      },
      {
        id: "smith-5",
        sender: "Prof. Klyne Smith",
        body: "For the project feedback pass, focus first on requirements traceability. Every design choice should point back to a user need, constraint, or acceptance criterion.",
        time: "Today 9:18 AM",
      },
      {
        id: "smith-6",
        sender: "You",
        body: "That helps. We also mentioned SOD in our notes. I am treating that as software design and checking whether the sequence diagram supports the requirements.",
        time: "Today 9:26 AM",
        isMe: true,
      },
      {
        id: "smith-7",
        sender: "Prof. Klyne Smith",
        body: "That is a conservative and useful interpretation. For software design, use UML and architecture to show how the system behaves, not just what components exist.",
        time: "Today 9:31 AM",
      },
      {
        id: "smith-8",
        sender: "Prof. Klyne Smith",
        body: "My work around large real-world systems, including IBM, the Olympics, and Macy's, shapes how I review projects: clarity, traceability, operational constraints, and maintainable architecture matter as much as a clever diagram.",
        time: "Today 9:34 AM",
      },
      {
        id: "smith-9",
        sender: "Prof. Klyne Smith",
        body: "Bring one question about requirements, one about UML or architecture, and one about testing. That will make the feedback session much more productive.",
        time: "Today 9:36 AM",
      },
    ],
  },
  {
    id: "prof-prakash",
    type: "Instructors",
    title: "Prof. Ravi Prakash",
    subtitle: "Computer Networks",
    course: "CS 4390.0W1",
    timestamp: "Fri",
    unread: 0,
    icon: GraduationCap,
    messages: [
      {
        id: "rp-1",
        sender: "Prof. Ravi Prakash",
        body: "For the protocol analysis, label retransmissions and explain why the sender reduced its congestion window.",
        time: "Friday",
      },
      {
        id: "rp-2",
        sender: "System Notification",
        body: "Assignment posted: Network Protocol Analysis.",
        time: "Friday",
        tone: "notification",
      },
    ],
  },
  {
    id: "db-study-group",
    type: "Study Groups",
    title: "Database Midterm Review Group",
    subtitle: "Private study group",
    course: "CS 4347.002",
    timestamp: "Thu",
    unread: 0,
    icon: Users,
    members: ["Carson Smith", "Nora Patel", "Ethan Brooks"],
    sharedFiles: [
      { id: "db-file-1", name: "Join-Practice-Set.docx", detail: "Shared Thursday by Ethan" },
      { id: "db-file-2", name: "Normal-Forms-Cheat-Sheet.pdf", detail: "Shared Wednesday by Nora" },
    ],
    messages: [
      {
        id: "db-group-1",
        sender: "Nora Patel",
        body: "I made a one-page normal forms sheet. Can we meet after the review session?",
        time: "Thursday",
      },
      {
        id: "db-group-2",
        sender: "Ethan Brooks",
        body: "Yes, I added join practice too. The LEFT JOIN examples are the ones I kept missing.",
        time: "Thursday",
      },
      {
        id: "db-group-3",
        sender: "You",
        body: "Can we start with 2NF vs 3NF, then do joins with expected row counts?",
        time: "Thursday",
        isMe: true,
      },
    ],
  },
];

export function MessagesPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState("prof-smith");
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ConversationType>("All");
  const [draft, setDraft] = useState("");
  const messageHistoryRef = useRef<HTMLDivElement | null>(null);

  const filteredConversations = useMemo(() => {
    const query = searchQuery.trim().toLowerCase();
    return conversations.filter((conversation) => {
      const matchesFilter = filter === "All" || conversation.type === filter;
      const matchesSearch =
        !query ||
        [conversation.title, conversation.subtitle, conversation.course, conversation.type]
          .filter(Boolean)
          .some((value) => value!.toLowerCase().includes(query));
      return matchesFilter && matchesSearch;
    }).sort((a, b) => Number(b.id === "prof-smith") - Number(a.id === "prof-smith") || b.unread - a.unread);
  }, [conversations, filter, searchQuery]);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ?? filteredConversations[0] ?? conversations[0];

  useEffect(() => {
    const history = messageHistoryRef.current;
    if (!history) return;
    history.scrollTo({ top: history.scrollHeight, behavior: "smooth" });
  }, [selectedConversation.id, selectedConversation.messages.length]);

  const selectConversation = (conversationId: string) => {
    setSelectedId(conversationId);
    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === conversationId ? { ...conversation, unread: 0 } : conversation,
      ),
    );
  };

  const sendMessage = (event: FormEvent) => {
    event.preventDefault();
    const trimmedDraft = draft.trim();
    if (!trimmedDraft) return;

    const newMessage: ChatMessage = {
      id: `sent-${Date.now()}`,
      sender: "You",
      body: trimmedDraft,
      time: "Just now",
      isMe: true,
    };

    setConversations((current) =>
      current.map((conversation) =>
        conversation.id === selectedConversation.id
          ? { ...conversation, timestamp: "Just now", messages: [...conversation.messages, newMessage] }
          : conversation,
      ),
    );
    setDraft("");
  };

  return (
    <div className="h-full p-4 animate-in fade-in duration-500 sm:p-6">
      <div className="mx-auto flex h-full max-w-[1500px] flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900 dark:text-white">Messages</h2>
            <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">
              Instructor threads, study groups, classmates, and support in one chat workspace.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300">
            <Bell className="h-4 w-4" />
            4 active conversations
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 xl:grid-cols-[340px_minmax(0,1fr)] 2xl:grid-cols-[340px_minmax(0,1fr)_290px]">
          <aside className="flex min-h-[360px] flex-col overflow-hidden rounded border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900">
            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
              <label className="sr-only" htmlFor="conversation-search">
                Search conversations
              </label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <input
                  id="conversation-search"
                  value={searchQuery}
                  onChange={(event) => setSearchQuery(event.target.value)}
                  placeholder="Search messages..."
                  className={cn(
                    "w-full rounded border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
                    FOCUS_RING,
                  )}
                />
              </div>
              <div className="mt-3 flex flex-wrap gap-2" aria-label="Conversation filters">
                {FILTERS.map((filterName) => (
                  <button
                    key={filterName}
                    type="button"
                    onClick={() => setFilter(filterName)}
                    className={cn(
                      "rounded px-2.5 py-1 text-xs font-bold transition-colors",
                      FOCUS_RING,
                      filter === filterName
                        ? "bg-slate-900 text-white dark:bg-blue-600"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200 dark:bg-slate-800 dark:text-slate-300 dark:hover:bg-slate-700",
                    )}
                  >
                    {filterName}
                  </button>
                ))}
              </div>
            </div>

            <div className="min-h-0 flex-1 overflow-y-auto p-2" role="list" aria-label="Conversation list">
              {filteredConversations.map((conversation) => {
                const isSelected = conversation.id === selectedConversation.id;
                return (
                  <button
                    key={conversation.id}
                    type="button"
                    onClick={() => selectConversation(conversation.id)}
                    className={cn(
                      "mb-2 w-full rounded border p-3 text-left transition-all hover:-translate-y-0.5",
                      FOCUS_RING,
                      isSelected
                        ? "border-blue-300 bg-blue-50 shadow-sm dark:border-blue-700 dark:bg-blue-900/20"
                        : "border-transparent bg-white hover:bg-slate-50 dark:bg-slate-900 dark:hover:bg-slate-800",
                    )}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <div className="relative flex h-10 w-10 flex-shrink-0 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white dark:bg-slate-700">
                        {getInitials(conversation.title)}
                        <span className={cn("absolute bottom-0 right-0 h-3 w-3 rounded-full border-2 border-white dark:border-slate-900", conversation.type === "Support" ? "bg-blue-500" : "bg-emerald-500")} />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900 dark:text-white">{conversation.title}</h3>
                            <p className="truncate text-xs text-slate-500 dark:text-slate-400">{conversation.subtitle}</p>
                          </div>
                          <span className="flex-shrink-0 text-[10px] font-bold uppercase tracking-wide text-slate-400">
                            {conversation.timestamp}
                          </span>
                        </div>
                        <div className="mt-2 flex items-center justify-between gap-2">
                          <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600">
                            {conversation.type}
                          </span>
                          {conversation.unread > 0 && (
                            <span className="rounded-full bg-blue-600 px-2 py-0.5 text-[10px] font-black text-white">
                              {conversation.unread} unread
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })}
              {filteredConversations.length === 0 && (
                <div className="p-6 text-center text-sm text-slate-500 dark:text-slate-400">No conversations match your search.</div>
              )}
            </div>
          </aside>

          <section className="flex h-[min(760px,calc(100vh-160px))] min-h-[520px] flex-col rounded border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-slate-900 text-xs font-black text-white dark:bg-slate-700">
                      {getInitials(selectedConversation.title)}
                    </div>
                    <h3 className="text-xl font-bold text-slate-900 dark:text-white">{selectedConversation.title}</h3>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600 dark:bg-slate-800 dark:text-slate-300">
                      {selectedConversation.type}
                    </span>
                    {selectedConversation.course && (
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                        {selectedConversation.course}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-400">{selectedConversation.subtitle}</p>
                </div>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50 dark:border-slate-700 dark:text-slate-200 dark:hover:bg-slate-800",
                    FOCUS_RING,
                  )}
                >
                  <Paperclip className="h-4 w-4" />
                  Attach file
                </button>
              </div>

              {selectedConversation.members && (
                <div className="mt-4 rounded bg-slate-50 p-3 dark:bg-slate-800">
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500 dark:text-slate-400">Study group members</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConversation.members.map((member) => (
                      <span key={member} className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-700 dark:bg-slate-900 dark:text-slate-200">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </header>

            <div className="min-h-0 flex-1">
              <div className="flex min-h-0 flex-col">
                <div ref={messageHistoryRef} className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-label="Message history">
                  {selectedConversation.messages.map((message) => (
                    <article
                      key={message.id}
                      className={cn(
                        "max-w-[82%] animate-in fade-in slide-in-from-bottom-2 rounded-2xl border px-4 py-3 duration-200",
                        message.isMe
                          ? "ml-auto rounded-br-md border-blue-500 bg-blue-600 text-white"
                          : message.tone === "notification"
                            ? "rounded-bl-md border-amber-200 bg-amber-50 text-amber-900 dark:border-amber-800 dark:bg-amber-900/20 dark:text-amber-200"
                            : "rounded-bl-md border-slate-200 bg-white text-slate-800 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-200",
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2 text-xs font-black">
                        {message.tone === "notification" && <Bell className="h-3.5 w-3.5" />}
                        <span>{message.sender}</span>
                        <span className={cn("font-medium", message.isMe ? "text-blue-100" : "text-slate-500 dark:text-slate-400")}>
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.body}</p>
                    </article>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="border-t border-slate-200 bg-white p-4 dark:border-slate-700 dark:bg-slate-900">
                  <label className="sr-only" htmlFor="message-composer">
                    Type a message
                  </label>
                  <div className="flex flex-col gap-2 sm:flex-row">
                    <textarea
                      id="message-composer"
                      value={draft}
                      onChange={(event) => setDraft(event.target.value)}
                      placeholder={`Message ${selectedConversation.title}...`}
                      rows={2}
                      className={cn(
                        "min-h-[48px] flex-1 resize-none rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white",
                        FOCUS_RING,
                      )}
                    />
                    <button
                      type="submit"
                      disabled={!draft.trim()}
                      className={cn(
                        "inline-flex items-center justify-center gap-2 rounded px-4 py-2 text-sm font-black transition-colors",
                        FOCUS_RING,
                        draft.trim()
                          ? "bg-blue-600 text-white hover:bg-blue-700"
                          : "cursor-not-allowed bg-slate-200 text-slate-400",
                      )}
                    >
                      <Send className="h-4 w-4" />
                      Send
                    </button>
                  </div>
                </form>
              </div>
            </div>

          </section>

          <aside className="hidden overflow-hidden rounded border border-slate-200 bg-white shadow-sm dark:border-slate-700 dark:bg-slate-900 2xl:block">
            <div className="border-b border-slate-200 p-4 dark:border-slate-700">
              <h4 className="text-sm font-black text-slate-900 dark:text-white">Conversation Details</h4>
              <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{selectedConversation.subtitle}</p>
            </div>
            <div className="space-y-4 p-4">
              <div>
                <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900 dark:text-white">
                  <FileText className="h-4 w-4" />
                  Shared Files
                </h4>
                {selectedConversation.sharedFiles?.length ? (
                  <div className="space-y-2">
                    {selectedConversation.sharedFiles.map((file) => (
                      <button
                        key={file.id}
                        type="button"
                        className={cn(
                          "w-full rounded border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50 dark:border-slate-700 dark:hover:bg-slate-800",
                          FOCUS_RING,
                        )}
                      >
                        <p className="text-sm font-bold text-slate-900 dark:text-white">{file.name}</p>
                        <p className="mt-1 text-xs text-slate-500 dark:text-slate-400">{file.detail}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded bg-slate-50 p-3 text-sm text-slate-500 dark:bg-slate-800 dark:text-slate-400">
                    No private files are shared in this conversation yet.
                  </p>
                )}
              </div>

                <div className="rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900 dark:border-blue-800 dark:bg-blue-900/20 dark:text-blue-200">
                  <p className="font-black">Notification center</p>
                  <p className="mt-1 text-xs leading-relaxed">
                    Assignment postings and grading feedback appear here and in relevant course conversations.
                  </p>
                </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}

function getInitials(name: string) {
  return name
    .replace(/^Prof\.\s*/i, "")
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0])
    .join("")
    .toUpperCase();
}
