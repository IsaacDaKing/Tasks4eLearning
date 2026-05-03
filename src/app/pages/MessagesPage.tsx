import { useMemo, useState, type FormEvent } from "react";
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
    members: ["Zabisaq", "Maya Chen", "Carlos Rivera", "Priya Shah"],
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
    ],
  },
  {
    id: "prof-smith",
    type: "Instructors",
    title: "Prof. Klyne Smith",
    subtitle: "Software Engineering",
    course: "CS 3354.012",
    timestamp: "Tue",
    unread: 0,
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
    members: ["Zabisaq", "Nora Patel", "Ethan Brooks"],
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
    ],
  },
];

export function MessagesPage() {
  const [conversations, setConversations] = useState(INITIAL_CONVERSATIONS);
  const [selectedId, setSelectedId] = useState(INITIAL_CONVERSATIONS[0].id);
  const [searchQuery, setSearchQuery] = useState("");
  const [filter, setFilter] = useState<ConversationType>("All");
  const [draft, setDraft] = useState("");

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
    });
  }, [conversations, filter, searchQuery]);

  const selectedConversation =
    conversations.find((conversation) => conversation.id === selectedId) ?? filteredConversations[0] ?? conversations[0];

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
    <div className="p-4 sm:p-6 h-full animate-in fade-in duration-500">
      <div className="mx-auto flex h-full max-w-[1500px] flex-col gap-4">
        <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-slate-900">Messages</h2>
            <p className="mt-1 text-sm text-slate-600">
              Messaging System for instructors, study groups, classmates, and support.
            </p>
          </div>
          <div className="inline-flex items-center gap-2 rounded border border-blue-200 bg-blue-50 px-3 py-2 text-sm font-bold text-blue-800">
            <Bell className="h-4 w-4" />
            Push notifications enabled
          </div>
        </div>

        <div className="grid min-h-0 flex-1 gap-4 lg:grid-cols-[360px_minmax(0,1fr)]">
          <aside className="flex min-h-[360px] flex-col rounded border border-slate-200 bg-white shadow-sm">
            <div className="border-b border-slate-200 p-4">
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
                    "w-full rounded border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-900 placeholder-slate-500",
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
                        ? "bg-slate-800 text-white"
                        : "bg-slate-100 text-slate-600 hover:bg-slate-200",
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
                      "mb-2 w-full rounded border p-3 text-left transition-colors",
                      FOCUS_RING,
                      isSelected
                        ? "border-slate-800 bg-slate-100"
                        : "border-slate-200 bg-white hover:bg-slate-50",
                    )}
                    aria-current={isSelected ? "true" : undefined}
                  >
                    <div className="flex items-start gap-3">
                      <div className="rounded bg-slate-100 p-2 text-slate-700">
                        <conversation.icon className="h-4 w-4" />
                      </div>
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <h3 className="truncate text-sm font-bold text-slate-900">{conversation.title}</h3>
                            <p className="truncate text-xs text-slate-500">{conversation.subtitle}</p>
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
                <div className="p-6 text-center text-sm text-slate-500">No conversations match your search.</div>
              )}
            </div>
          </aside>

          <section className="flex min-h-[520px] flex-col rounded border border-slate-200 bg-white shadow-sm">
            <header className="border-b border-slate-200 p-4">
              <div className="flex flex-col gap-3 md:flex-row md:items-start md:justify-between">
                <div>
                  <div className="flex flex-wrap items-center gap-2">
                    <h3 className="text-xl font-bold text-slate-900">{selectedConversation.title}</h3>
                    <span className="rounded bg-slate-100 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-slate-600">
                      {selectedConversation.type}
                    </span>
                    {selectedConversation.course && (
                      <span className="rounded bg-blue-50 px-2 py-0.5 text-[10px] font-black uppercase tracking-wide text-blue-700">
                        {selectedConversation.course}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-slate-600">{selectedConversation.subtitle}</p>
                </div>
                <button
                  type="button"
                  className={cn(
                    "inline-flex items-center gap-2 rounded border border-slate-200 px-3 py-2 text-sm font-bold text-slate-700 hover:bg-slate-50",
                    FOCUS_RING,
                  )}
                >
                  <Paperclip className="h-4 w-4" />
                  Attach file
                </button>
              </div>

              {selectedConversation.members && (
                <div className="mt-4 rounded bg-slate-50 p-3">
                  <p className="mb-2 text-xs font-black uppercase tracking-wide text-slate-500">Study group members</p>
                  <div className="flex flex-wrap gap-2">
                    {selectedConversation.members.map((member) => (
                      <span key={member} className="rounded bg-white px-2 py-1 text-xs font-bold text-slate-700">
                        {member}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </header>

            <div className="grid min-h-0 flex-1 gap-0 xl:grid-cols-[minmax(0,1fr)_280px]">
              <div className="flex min-h-0 flex-col">
                <div className="min-h-0 flex-1 space-y-4 overflow-y-auto p-4" aria-live="polite" aria-label="Message history">
                  {selectedConversation.messages.map((message) => (
                    <article
                      key={message.id}
                      className={cn(
                        "max-w-[82%] rounded border p-3",
                        message.isMe
                          ? "ml-auto border-blue-200 bg-blue-600 text-white"
                          : message.tone === "notification"
                            ? "border-amber-200 bg-amber-50 text-amber-900"
                            : "border-slate-200 bg-slate-50 text-slate-800",
                      )}
                    >
                      <div className="mb-1 flex items-center gap-2 text-xs font-black">
                        {message.tone === "notification" && <Bell className="h-3.5 w-3.5" />}
                        <span>{message.sender}</span>
                        <span className={cn("font-medium", message.isMe ? "text-blue-100" : "text-slate-500")}>
                          {message.time}
                        </span>
                      </div>
                      <p className="text-sm leading-relaxed">{message.body}</p>
                    </article>
                  ))}
                </div>

                <form onSubmit={sendMessage} className="border-t border-slate-200 p-4">
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
                        "min-h-[48px] flex-1 resize-none rounded border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 placeholder-slate-500",
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

              <aside className="border-t border-slate-200 p-4 xl:border-l xl:border-t-0">
                <h4 className="mb-3 flex items-center gap-2 text-sm font-black text-slate-900">
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
                          "w-full rounded border border-slate-200 p-3 text-left transition-colors hover:bg-slate-50",
                          FOCUS_RING,
                        )}
                      >
                        <p className="text-sm font-bold text-slate-900">{file.name}</p>
                        <p className="mt-1 text-xs text-slate-500">{file.detail}</p>
                      </button>
                    ))}
                  </div>
                ) : (
                  <p className="rounded bg-slate-50 p-3 text-sm text-slate-500">
                    No private files are shared in this conversation yet.
                  </p>
                )}

                <div className="mt-4 rounded border border-blue-200 bg-blue-50 p-3 text-sm text-blue-900">
                  <p className="font-black">Notification center</p>
                  <p className="mt-1 text-xs leading-relaxed">
                    Assignment postings and grading feedback appear here and in relevant course conversations.
                  </p>
                </div>
              </aside>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
