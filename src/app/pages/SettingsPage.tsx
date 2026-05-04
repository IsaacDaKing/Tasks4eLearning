import { useState, type FormEvent } from "react";
import {
  Settings,
  Accessibility,
  Type,
  Eye,
  Palette,
  Volume2,
  Bell,
  Clock,
  Shield,
  User,
  Mail,
  Lock,
  ChevronRight,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion } from "motion/react";
import { useTheme } from "../contexts/ThemeContext";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function SettingsPage() {
  const {
    isDark,
    toggleTheme,
    fontSize,
    setFontSize,
    highContrast,
    toggleHighContrast,
    dyslexiaFont,
    toggleDyslexiaFont,
  } = useTheme();
  const [quietHoursEnabled, setQuietHoursEnabled] = useState(() => localStorage.getItem("lms-quiet-hours-enabled") === "true");
  const [quietHoursStart, setQuietHoursStart] = useState(() => localStorage.getItem("lms-quiet-hours-start") || "22:00");
  const [quietHoursEnd, setQuietHoursEnd] = useState(() => localStorage.getItem("lms-quiet-hours-end") || "07:00");
  const [notificationPrefs, setNotificationPrefs] = useState(() => {
    try {
      const saved = localStorage.getItem("lms-notification-preferences");
      return saved
        ? { ...DEFAULT_NOTIFICATION_PREFS, ...JSON.parse(saved) }
        : DEFAULT_NOTIFICATION_PREFS;
    } catch {
      return DEFAULT_NOTIFICATION_PREFS;
    }
  });
  const [supportOpen, setSupportOpen] = useState(false);
  const [supportSubmitted, setSupportSubmitted] = useState(false);
  const [activeAccountPanel, setActiveAccountPanel] = useState<AccountPanel>("profile");
  const [accountNotice, setAccountNotice] = useState("");

  const updateQuietHours = (next: { enabled?: boolean; start?: string; end?: string }) => {
    const enabled = next.enabled ?? quietHoursEnabled;
    const start = next.start ?? quietHoursStart;
    const end = next.end ?? quietHoursEnd;
    setQuietHoursEnabled(enabled);
    setQuietHoursStart(start);
    setQuietHoursEnd(end);
    localStorage.setItem("lms-quiet-hours-enabled", String(enabled));
    localStorage.setItem("lms-quiet-hours-start", start);
    localStorage.setItem("lms-quiet-hours-end", end);
    window.dispatchEvent(new Event("lms-notification-settings-updated"));
  };

  const toggleNotificationPref = (key: keyof typeof DEFAULT_NOTIFICATION_PREFS) => {
    const nextPrefs = { ...notificationPrefs, [key]: !notificationPrefs[key] };
    setNotificationPrefs(nextPrefs);
    localStorage.setItem("lms-notification-preferences", JSON.stringify(nextPrefs));
    window.dispatchEvent(new Event("lms-notification-settings-updated"));
  };

  const submitSupportRequest = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSupportSubmitted(true);
  };

  const saveAccountPanel = (label: string) => {
    setAccountNotice(`${label} saved for this session.`);
  };

  return (
    <div className="p-8 space-y-8 max-w-[1400px] mx-auto animate-in fade-in duration-500 dark:bg-slate-900">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight flex items-center gap-3">
            <Settings className="w-8 h-8 text-blue-600" />
            Settings & Preferences
          </h2>
          <p className="text-slate-500 dark:text-slate-400 mt-1 font-medium">
            Customize your learning experience and accessibility options
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-blue-100 dark:bg-blue-900/30 rounded-xl flex items-center justify-center">
                <Accessibility className="w-5 h-5 text-blue-600 dark:text-blue-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Accessibility Features</h3>
            </div>

            <div className="space-y-6">
              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-slate-400" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Font Size</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Adjust text size across the platform</p>
                    </div>
                  </div>
                  <span className="text-sm font-black text-blue-600 dark:text-blue-400">{fontSize}%</span>
                </div>
                <input
                  type="range"
                  min="75"
                  max="150"
                  step="25"
                  value={fontSize}
                  onChange={(e) => setFontSize(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-slate-400 dark:text-slate-500 mt-2">
                  <span>75%</span>
                  <span>100%</span>
                  <span>125%</span>
                  <span>150%</span>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Eye className="w-5 h-5 text-slate-400" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">High Contrast Mode</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Increase visibility with high contrast colors</p>
                    </div>
                  </div>
                <button
                  type="button"
                  onClick={toggleHighContrast}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      highContrast ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                        highContrast && "translate-x-6"
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Type className="w-5 h-5 text-slate-400" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Dyslexia-Friendly Font</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Use OpenDyslexic font for easier reading</p>
                    </div>
                  </div>
                <button
                  type="button"
                  onClick={toggleDyslexiaFont}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      dyslexiaFont ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                        dyslexiaFont && "translate-x-6"
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Palette className="w-5 h-5 text-slate-400" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Dark Mode</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Reduce eye strain with dark theme</p>
                    </div>
                  </div>
                <button
                  type="button"
                  onClick={toggleTheme}
                    className={cn(
                      "relative w-12 h-6 rounded-full transition-colors",
                      isDark ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                    )}
                  >
                    <div
                      className={cn(
                        "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                        isDark && "translate-x-6"
                      )}
                    />
                  </button>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Volume2 className="w-5 h-5 text-slate-400" />
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">Screen Reader Support</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">Compatible with JAWS, NVDA, and VoiceOver</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-green-600 dark:text-green-400 bg-green-50 dark:bg-green-900/20 px-3 py-1 rounded-full">
                    Active
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-8">
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-900/30 rounded-xl flex items-center justify-center">
                <Bell className="w-5 h-5 text-purple-600 dark:text-purple-400" />
              </div>
              <h3 className="text-2xl font-black text-slate-900 dark:text-white">Notification Preferences</h3>
            </div>

            <div className="mb-6 rounded-xl border border-blue-100 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
              <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
                <div className="flex items-start gap-3">
                  <Clock className="mt-1 h-5 w-5 text-blue-600 dark:text-blue-400" />
                  <div>
                    <h4 className="font-bold text-slate-900 dark:text-white">Quiet Hours</h4>
                    <p className="mt-1 text-xs leading-5 text-slate-600 dark:text-slate-300">
                      Mute non-critical assignment, grade, message, and study reminders during the selected time block. Important alerts still appear.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => updateQuietHours({ enabled: !quietHoursEnabled })}
                  className={cn(
                    "relative h-6 w-12 rounded-full transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2",
                    quietHoursEnabled ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700",
                  )}
                  aria-label={quietHoursEnabled ? "Disable Quiet Hours" : "Enable Quiet Hours"}
                  aria-pressed={quietHoursEnabled}
                >
                  <span
                    className={cn(
                      "absolute left-0.5 top-0.5 h-5 w-5 rounded-full bg-white transition-transform",
                      quietHoursEnabled && "translate-x-6",
                    )}
                  />
                </button>
              </div>
              <div className="mt-4 grid gap-4 sm:grid-cols-2">
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  Start time
                  <input
                    type="time"
                    value={quietHoursStart}
                    onChange={(event) => updateQuietHours({ start: event.target.value })}
                    className="mt-2 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
                <label className="text-sm font-bold text-slate-700 dark:text-slate-200">
                  End time
                  <input
                    type="time"
                    value={quietHoursEnd}
                    onChange={(event) => updateQuietHours({ end: event.target.value })}
                    className="mt-2 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:border-slate-700 dark:bg-slate-800 dark:text-white"
                  />
                </label>
              </div>
              <p className="mt-3 text-xs font-semibold text-blue-800 dark:text-blue-300" role="status">
                Quiet Hours are {quietHoursEnabled ? `on from ${quietHoursStart} to ${quietHoursEnd}` : "off"}.
              </p>
            </div>

            <div className="space-y-4">
              {NOTIFICATION_PREF_OPTIONS.map((pref) => (
                <div key={pref.key} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{pref.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{pref.description}</p>
                    </div>
                    <button
                      type="button"
                      onClick={() => toggleNotificationPref(pref.key)}
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors",
                        notificationPrefs[pref.key] ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                      aria-label={`${notificationPrefs[pref.key] ? "Disable" : "Enable"} ${pref.label}`}
                      aria-pressed={notificationPrefs[pref.key]}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                          notificationPrefs[pref.key] && "translate-x-6"
                        )}
                      />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-4">Account</h3>
            <div className="space-y-2">
              {ACCOUNT_ACTIONS.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveAccountPanel(item.id);
                    setAccountNotice("");
                  }}
                  className={cn(
                    "w-full flex items-center gap-3 p-3 rounded-lg transition-colors group focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2",
                    activeAccountPanel === item.id ? "bg-slate-100 dark:bg-slate-900/70" : "hover:bg-slate-50 dark:hover:bg-slate-900/50",
                  )}
                  aria-pressed={activeAccountPanel === item.id}
                >
                  <div className={cn("w-8 h-8 rounded-lg flex items-center justify-center", item.color)}>
                    <item.icon className="w-4 h-4" />
                  </div>
                  <span className="flex-1 text-left text-sm font-bold text-slate-900 dark:text-white">{item.label}</span>
                  <ChevronRight className="w-4 h-4 text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300" />
                </button>
              ))}
            </div>
          </div>

          <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm p-6">
            <h3 className="font-black text-slate-900 dark:text-white mb-2">{accountPanelTitle(activeAccountPanel)}</h3>
            <p className="mb-4 text-sm text-slate-500 dark:text-slate-400">Frontend-only account controls for the LMS prototype.</p>
            <AccountMockPanel activePanel={activeAccountPanel} onSave={saveAccountPanel} />
            {accountNotice && (
              <p className="mt-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300" role="status">
                {accountNotice}
              </p>
            )}
          </div>

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <h3 className="font-black text-blue-900 dark:text-blue-300 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed mb-4">
              If you have questions about accessibility features or need assistance, our support team is here to help.
            </p>
            <button
              type="button"
              onClick={() => {
                setSupportOpen(true);
                setSupportSubmitted(false);
              }}
              className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2"
            >
              Contact Support
            </button>
          </div>
        </div>
      </div>

      {supportOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/50 p-4">
          <div className="w-full max-w-xl rounded-2xl border border-slate-200 bg-white p-6 shadow-xl animate-in fade-in zoom-in-95 duration-150 dark:border-slate-700 dark:bg-slate-900">
            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <h3 className="text-xl font-black text-slate-900 dark:text-white">Contact Support</h3>
                <p className="mt-1 text-sm text-slate-500 dark:text-slate-400">Send a frontend-only support request for review.</p>
              </div>
              <button
                type="button"
                onClick={() => setSupportOpen(false)}
                className="rounded px-2 py-1 text-sm font-bold text-slate-500 hover:bg-slate-100 hover:text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:hover:bg-slate-800 dark:hover:text-white"
                aria-label="Close support form"
              >
                Close
              </button>
            </div>

            {supportSubmitted ? (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold text-emerald-800 dark:border-emerald-800 dark:bg-emerald-900/20 dark:text-emerald-300" role="status">
                Support request submitted for review.
              </div>
            ) : (
              <form onSubmit={submitSupportRequest} className="space-y-4">
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Issue category
                  <select required className="mt-2 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                    <option>Accessibility</option>
                    <option>Assignment submission</option>
                    <option>Login or account</option>
                    <option>Grades</option>
                    <option>Other</option>
                  </select>
                </label>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Subject
                  <input required className="mt-2 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </label>
                <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                  Description
                  <textarea required rows={4} className="mt-2 w-full resize-none rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white" />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Priority
                    <select className="mt-2 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-800 dark:text-white">
                      <option>Normal</option>
                      <option>High</option>
                      <option>Low</option>
                    </select>
                  </label>
                  <div className="block text-sm font-bold text-slate-700 dark:text-slate-200">
                    Screenshot
                    <div className="mt-2 rounded border border-dashed border-slate-300 bg-slate-50 px-3 py-2 text-sm font-semibold text-slate-500 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-400">
                      Optional attachment placeholder
                    </div>
                  </div>
                </div>
                <button type="submit" className="w-full rounded bg-blue-600 px-4 py-2.5 text-sm font-black text-white hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2">
                  Submit request
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

const DEFAULT_NOTIFICATION_PREFS = {
  assignments: true,
  grades: true,
  messages: true,
  studyReminders: true,
};

const NOTIFICATION_PREF_OPTIONS: Array<{
  key: keyof typeof DEFAULT_NOTIFICATION_PREFS;
  label: string;
  description: string;
}> = [
  { key: "assignments", label: "Assignment Notifications", description: "New postings, due-date reminders, and submission updates." },
  { key: "grades", label: "Grade Feedback", description: "Alerts when grades or instructor feedback are available." },
  { key: "messages", label: "Messages", description: "Instructor, classmate, study group, and support message alerts." },
  { key: "studyReminders", label: "Study Reminders", description: "Comet AI planning nudges and quiz preparation reminders." },
];

type AccountPanel = "profile" | "email" | "password" | "devices" | "privacy";

const ACCOUNT_ACTIONS: Array<{
  id: AccountPanel;
  icon: typeof User;
  label: string;
  color: string;
}> = [
  { id: "profile", icon: User, label: "Edit Profile", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" },
  { id: "email", icon: Mail, label: "Change Email", color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30" },
  { id: "password", icon: Lock, label: "Change Password", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30" },
  { id: "devices", icon: Shield, label: "Connected Devices", color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30" },
  { id: "privacy", icon: Shield, label: "Data & Privacy", color: "text-slate-600 dark:text-slate-300 bg-slate-100 dark:bg-slate-700" },
];

function accountPanelTitle(panel: AccountPanel) {
  const action = ACCOUNT_ACTIONS.find((item) => item.id === panel);
  return action?.label ?? "Account";
}

function AccountMockPanel({ activePanel, onSave }: { activePanel: AccountPanel; onSave: (label: string) => void }) {
  if (activePanel === "profile") {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          Display name
          <input defaultValue="Zabisaq Tasharmapandyasan" className={accountInputClass()} />
        </label>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          Preferred name
          <input defaultValue="Zabisaq" className={accountInputClass()} />
        </label>
        <MockSaveButton onClick={() => onSave("Profile")} />
      </div>
    );
  }

  if (activePanel === "email") {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          Current email
          <input defaultValue="student@university.edu" readOnly className={accountInputClass()} />
        </label>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          New email
          <input type="email" placeholder="new.email@university.edu" className={accountInputClass()} />
        </label>
        <MockSaveButton onClick={() => onSave("Email change")} />
      </div>
    );
  }

  if (activePanel === "password") {
    return (
      <div className="space-y-3">
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          Current password
          <input type="password" placeholder="Not stored in this prototype" className={accountInputClass()} />
        </label>
        <label className="block text-sm font-bold text-slate-700 dark:text-slate-200">
          New password
          <input type="password" placeholder="Enter a new password" className={accountInputClass()} />
        </label>
        <MockSaveButton onClick={() => onSave("Password change")} />
      </div>
    );
  }

  if (activePanel === "devices") {
    return (
      <div className="space-y-3">
        {["Chrome on Windows - current session", "Safari on iPhone - last active yesterday"].map((device) => (
          <div key={device} className="rounded border border-slate-200 bg-slate-50 p-3 text-sm font-semibold text-slate-700 dark:border-slate-700 dark:bg-slate-900 dark:text-slate-200">
            {device}
          </div>
        ))}
        <MockSaveButton label="Refresh sessions" onClick={() => onSave("Connected devices")} />
      </div>
    );
  }

  return (
    <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
      <p className="rounded border border-slate-200 bg-slate-50 p-3 dark:border-slate-700 dark:bg-slate-900">
        Data export and privacy requests are simulated here. No account data leaves the browser.
      </p>
      <MockSaveButton label="Acknowledge" onClick={() => onSave("Privacy preference")} />
    </div>
  );
}

function accountInputClass() {
  return "mt-2 w-full rounded border border-slate-200 bg-white px-3 py-2 text-sm text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 dark:border-slate-700 dark:bg-slate-900 dark:text-white";
}

function MockSaveButton({ label = "Save changes", onClick }: { label?: string; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="w-full rounded bg-slate-900 px-4 py-2.5 text-sm font-black text-white hover:bg-slate-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2 dark:bg-blue-600 dark:hover:bg-blue-700"
    >
      {label}
    </button>
  );
}
