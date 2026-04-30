import { useState } from "react";
import {
  Settings,
  Accessibility,
  Type,
  Eye,
  Palette,
  Volume2,
  Bell,
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

            <div className="space-y-4">
              {[
                { label: "Assignment Reminders", description: "Get notified 24 hours before deadlines", enabled: true },
                { label: "Grade Updates", description: "Receive alerts when grades are posted", enabled: true },
                { label: "Course Announcements", description: "Stay updated with important course news", enabled: true },
                { label: "Discussion Replies", description: "Notifications for replies to your posts", enabled: false },
              ].map((pref, i) => (
                <div key={i} className="p-4 rounded-xl border border-slate-100 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-bold text-slate-900 dark:text-white">{pref.label}</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400">{pref.description}</p>
                    </div>
                    <button
                      className={cn(
                        "relative w-12 h-6 rounded-full transition-colors",
                        pref.enabled ? "bg-blue-600" : "bg-slate-200 dark:bg-slate-700"
                      )}
                    >
                      <div
                        className={cn(
                          "absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full transition-transform",
                          pref.enabled && "translate-x-6"
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
              {[
                { icon: User, label: "Profile Settings", color: "text-blue-600 dark:text-blue-400 bg-blue-100 dark:bg-blue-900/30" },
                { icon: Mail, label: "Email & Notifications", color: "text-purple-600 dark:text-purple-400 bg-purple-100 dark:bg-purple-900/30" },
                { icon: Lock, label: "Security & Privacy", color: "text-emerald-600 dark:text-emerald-400 bg-emerald-100 dark:bg-emerald-900/30" },
                { icon: Shield, label: "Data & Privacy", color: "text-orange-600 dark:text-orange-400 bg-orange-100 dark:bg-orange-900/30" },
              ].map((item, i) => (
                <button
                  key={i}
                  className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-slate-50 dark:hover:bg-slate-900/50 transition-colors group"
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

          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-2xl p-6">
            <h3 className="font-black text-blue-900 dark:text-blue-300 mb-2">Need Help?</h3>
            <p className="text-sm text-blue-800 dark:text-blue-400 leading-relaxed mb-4">
              If you have questions about accessibility features or need assistance, our support team is here to help.
            </p>
            <button className="w-full py-2.5 bg-blue-600 text-white rounded-xl font-bold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50">
              Contact Support
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
