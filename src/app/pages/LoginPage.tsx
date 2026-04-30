import { useState } from "react";
import { BookOpen, Eye, EyeOff, ArrowLeft, Mail, Lock, CheckCircle } from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { motion, AnimatePresence } from "motion/react";
import { useNavigate } from "react-router";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = "login" | "forgot" | "reset-sent";

export function LoginPage() {
  const navigate = useNavigate();
  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);
  // FR-64: remember credentials
  const [rememberMe, setRememberMe] = useState(
    () => localStorage.getItem("lms-remember") === "true"
  );
  const [email, setEmail] = useState(
    () => (localStorage.getItem("lms-remember") === "true" ? localStorage.getItem("lms-saved-email") ?? "" : "")
  );
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [error, setError] = useState<string | null>(null);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    // FR-64: persist or clear remembered credentials
    if (rememberMe) {
      localStorage.setItem("lms-remember", "true");
      localStorage.setItem("lms-saved-email", email);
    } else {
      localStorage.removeItem("lms-remember");
      localStorage.removeItem("lms-saved-email");
    }

    // Demo: accept any non-empty creds, reject blank password
    if (!email || !password) {
      setError("Please enter your email and password.");
      return;
    }
    if (password === "wrongpassword") {
      setError("Incorrect email or password. Please try again.");
      return;
    }

    navigate("/");
  };

  const handleForgot = (e: React.FormEvent) => {
    e.preventDefault();
    if (!forgotEmail) return;
    setView("reset-sent");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-6">
      <div className="w-full max-w-md">
        {/* Logo */}
        <div className="flex justify-center mb-8">
          <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center shadow-xl shadow-blue-200 dark:shadow-blue-900/50">
            <BookOpen className="w-7 h-7 text-white" />
          </div>
        </div>

        <AnimatePresence mode="wait">
          {/* ── LOGIN VIEW ── */}
          {view === "login" && (
            <motion.div
              key="login"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8"
            >
              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Welcome back</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">Sign in to your eLearning account</p>

              {error && (
                <div className="mb-5 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-400 text-sm font-semibold">
                  {error}
                </div>
              )}

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Password</label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type={showPassword ? "text" : "password"}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full pl-10 pr-12 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-300 transition-colors"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                {/* FR-64: Remember credentials */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2.5 cursor-pointer group">
                    <button
                      type="button"
                      onClick={() => setRememberMe(!rememberMe)}
                      className={cn(
                        "w-5 h-5 rounded border-2 flex items-center justify-center transition-all",
                        rememberMe
                          ? "bg-blue-600 border-blue-600"
                          : "border-slate-300 dark:border-slate-600 group-hover:border-blue-400"
                      )}
                    >
                      {rememberMe && <CheckCircle className="w-3.5 h-3.5 text-white" />}
                    </button>
                    <span className="text-sm font-medium text-slate-700 dark:text-slate-300">Remember me</span>
                  </label>

                  {/* FR-63: Forgot password link */}
                  <button
                    type="button"
                    onClick={() => { setForgotEmail(email); setView("forgot"); setError(null); }}
                    className="text-sm font-bold text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    Forgot password?
                  </button>
                </div>

                <button
                  onClick={handleLogin}
                  className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50 active:scale-95"
                >
                  Sign In
                </button>

                <div className="relative my-2">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-slate-200 dark:border-slate-700" />
                  </div>
                  <div className="relative flex justify-center text-xs text-slate-400 font-bold">
                    <span className="bg-white dark:bg-slate-800 px-3">OR</span>
                  </div>
                </div>

                <button
                  type="button"
                  className="w-full py-3.5 border-2 border-slate-200 dark:border-slate-700 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold rounded-xl transition-all text-sm flex items-center justify-center gap-2"
                >
                  <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z" fill="currentColor"/>
                  </svg>
                  Sign in with Institutional SSO
                </button>
              </div>
            </motion.div>
          )}

          {/* ── FORGOT PASSWORD VIEW ── */}
          {view === "forgot" && (
            <motion.div
              key="forgot"
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -16 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8"
            >
              <button
                onClick={() => setView("login")}
                className="flex items-center gap-2 text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white text-sm font-bold mb-6 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" /> Back to sign in
              </button>

              <h1 className="text-3xl font-black text-slate-900 dark:text-white mb-1">Reset password</h1>
              <p className="text-slate-500 dark:text-slate-400 mb-8 text-sm font-medium">
                Enter your institutional email and we'll send you a reset link.
              </p>

              <div className="space-y-5">
                <div>
                  <label className="block text-xs font-black text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-1.5">Email address</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="email"
                      value={forgotEmail}
                      onChange={(e) => setForgotEmail(e.target.value)}
                      placeholder="you@university.edu"
                      className="w-full pl-10 pr-4 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-medium dark:text-white outline-none focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 transition-all"
                    />
                  </div>
                </div>

                <button
                  onClick={handleForgot}
                  disabled={!forgotEmail}
                  className={cn(
                    "w-full py-3.5 font-black rounded-xl transition-all text-sm",
                    forgotEmail
                      ? "bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-200 dark:shadow-blue-900/50 active:scale-95"
                      : "bg-slate-200 dark:bg-slate-700 text-slate-400 cursor-not-allowed"
                  )}
                >
                  Send Reset Link
                </button>
              </div>
            </motion.div>
          )}

          {/* ── RESET SENT CONFIRMATION ── */}
          {view === "reset-sent" && (
            <motion.div
              key="reset-sent"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-2xl p-8 text-center"
            >
              <div className="w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mx-auto mb-5">
                <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
              </div>
              <h1 className="text-2xl font-black text-slate-900 dark:text-white mb-2">Check your inbox</h1>
              <p className="text-slate-500 dark:text-slate-400 text-sm font-medium mb-8">
                We sent a password reset link to <strong className="text-slate-700 dark:text-slate-300">{forgotEmail}</strong>.
                The link expires in 30 minutes.
              </p>
              <button
                onClick={() => setView("login")}
                className="w-full py-3.5 bg-blue-600 hover:bg-blue-700 text-white font-black rounded-xl transition-all shadow-lg shadow-blue-200 dark:shadow-blue-900/50 active:scale-95"
              >
                Back to Sign In
              </button>
            </motion.div>
          )}
        </AnimatePresence>

        <p className="text-center text-xs text-slate-400 mt-6 font-medium">
          © {new Date().getFullYear()} eLearning Platform. All rights reserved.
        </p>
      </div>
    </div>
  );
}
