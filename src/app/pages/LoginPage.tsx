import { useState, type FormEvent } from "react";
import {
  ArrowLeft,
  CheckCircle,
  Eye,
  EyeOff,
  GraduationCap,
  HelpCircle,
  Lock,
  Mail,
  Sparkles,
} from "lucide-react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { AnimatePresence, motion } from "motion/react";
import { useNavigate } from "react-router";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

type View = "login" | "forgot" | "reset-sent";

type LoginErrors = {
  email?: string;
  password?: string;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const demoEmail = "student@university.edu";
const demoPassword = "LearnReady2026!";

export function LoginPage() {
  const navigate = useNavigate();
  const remembered = localStorage.getItem("lms-remember") === "true";
  const [view, setView] = useState<View>("login");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(() => remembered);
  const [email, setEmail] = useState(() =>
    remembered ? localStorage.getItem("lms-saved-email") ?? "" : "",
  );
  const [password, setPassword] = useState("");
  const [forgotEmail, setForgotEmail] = useState("");
  const [loginErrors, setLoginErrors] = useState<LoginErrors>({});
  const [loginNotice, setLoginNotice] = useState<string | null>(null);
  const [forgotError, setForgotError] = useState<string | null>(null);
  const [showAccessNote, setShowAccessNote] = useState(false);

  const focusClass =
    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2";
  const inputClass =
    "w-full rounded border border-slate-200 bg-white px-3 py-2.5 text-sm font-medium text-slate-900 outline-none transition-all placeholder:text-slate-400 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20";

  const persistRememberedEmail = (nextEmail: string) => {
    if (rememberMe) {
      localStorage.setItem("lms-remember", "true");
      localStorage.setItem("lms-saved-email", nextEmail);
      return;
    }

    localStorage.removeItem("lms-remember");
    localStorage.removeItem("lms-saved-email");
  };

  const finishPrototypeLogin = (nextEmail: string) => {
    persistRememberedEmail(nextEmail);
    localStorage.setItem("lms-prototype-session", "true");
    navigate("/dashboard");
  };

  const validateLogin = () => {
    const nextErrors: LoginErrors = {};
    const trimmedEmail = email.trim();

    if (!trimmedEmail) {
      nextErrors.email = "Enter your university email address.";
    } else if (!emailPattern.test(trimmedEmail)) {
      nextErrors.email = "Enter a valid email address, such as student@university.edu.";
    }

    if (!password) {
      nextErrors.password = "Enter your password.";
    }

    setLoginErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const handleLogin = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoginNotice(null);

    if (!validateLogin()) return;

    finishPrototypeLogin(email.trim());
  };

  const handleSsoLogin = () => {
    setLoginErrors({});
    setLoginNotice("University SSO accepted for this session.");
    finishPrototypeLogin(email.trim() || demoEmail);
  };

  const handleDemoAccount = () => {
    setEmail(demoEmail);
    setPassword(demoPassword);
    setLoginErrors({});
    setLoginNotice("Sample account filled. Submit the form to continue.");
  };

  const handleForgot = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const trimmedEmail = forgotEmail.trim();

    if (!trimmedEmail) {
      setForgotError("Enter the email address connected to your LMS account.");
      return;
    }

    if (!emailPattern.test(trimmedEmail)) {
      setForgotError("Enter a valid email address before requesting a reset.");
      return;
    }

    setForgotEmail(trimmedEmail);
    setForgotError(null);
    setView("reset-sent");
  };

  const returnToLogin = () => {
    setView("login");
    setForgotError(null);
  };

  return (
    <main className="min-h-screen bg-slate-100 px-4 py-8 text-slate-900 sm:px-6 lg:px-8">
      <div className="mx-auto flex min-h-[calc(100vh-4rem)] w-full max-w-md flex-col justify-center gap-6">
        <header className="flex items-center justify-center gap-3">
          <img
            src="/Tasks4eLearning.png"
            alt="Tasks4eLearning logo"
            className="h-12 w-12 object-contain"
          />
          <div>
            <p className="text-lg font-bold leading-tight text-slate-900">Tasks4eLearning</p>
            <p className="text-sm text-slate-600">University learning portal</p>
          </div>
        </header>

        <div>
          <section className="rounded-xl border border-slate-200 bg-white p-6 shadow-sm sm:p-7">
            <AnimatePresence mode="wait">
              {view === "login" && (
                <motion.div
                  key="login"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Sign in</h1>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Use your university email or institutional SSO.
                    </p>
                  </div>

                  {loginNotice && (
                    <p
                      className="mb-4 rounded border border-emerald-200 bg-emerald-50 px-3 py-2 text-sm font-semibold text-emerald-800"
                      role="status"
                    >
                      {loginNotice}
                    </p>
                  )}

                  <form className="space-y-4" onSubmit={handleLogin} noValidate>
                    <div>
                      <label htmlFor="email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                          id="email"
                          name="email"
                          type="email"
                          autoComplete="email"
                          value={email}
                          onChange={(e) => setEmail(e.target.value)}
                          placeholder="student@university.edu"
                          aria-invalid={Boolean(loginErrors.email)}
                          aria-describedby={loginErrors.email ? "email-error" : undefined}
                          className={cn(inputClass, "pl-9", loginErrors.email && "border-red-400 focus:border-red-500 focus:ring-red-500/20")}
                        />
                      </div>
                      {loginErrors.email && (
                        <p id="email-error" className="mt-2 text-sm font-semibold text-red-600" role="alert">
                          {loginErrors.email}
                        </p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="password" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                        Password
                      </label>
                      <div className="relative">
                        <Lock className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                          id="password"
                          name="password"
                          type={showPassword ? "text" : "password"}
                          autoComplete="current-password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          placeholder="Enter your password"
                          aria-invalid={Boolean(loginErrors.password)}
                          aria-describedby={loginErrors.password ? "password-error" : undefined}
                          className={cn(inputClass, "pl-9 pr-11", loginErrors.password && "border-red-400 focus:border-red-500 focus:ring-red-500/20")}
                        />
                        <button
                          type="button"
                          onClick={() => setShowPassword((current) => !current)}
                          className={cn("absolute right-1.5 top-1/2 flex h-8 w-8 -translate-y-1/2 items-center justify-center rounded text-slate-500 transition-colors hover:bg-slate-100 hover:text-slate-900", focusClass)}
                          aria-label={showPassword ? "Hide password" : "Show password"}
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
                        </button>
                      </div>
                      {loginErrors.password && (
                        <p id="password-error" className="mt-2 text-sm font-semibold text-red-600" role="alert">
                          {loginErrors.password}
                        </p>
                      )}
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-3">
                      <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-slate-700">
                        <input
                          type="checkbox"
                          checked={rememberMe}
                          onChange={(e) => setRememberMe(e.target.checked)}
                          className="h-4 w-4 rounded border-slate-300 text-blue-600 focus-visible:ring-2 focus-visible:ring-slate-500 focus-visible:ring-offset-2"
                        />
                        Remember me
                      </label>

                      <button
                        type="button"
                        onClick={() => {
                          setForgotEmail(email);
                          setView("forgot");
                          setLoginErrors({});
                          setLoginNotice(null);
                        }}
                        className={cn("rounded text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline", focusClass)}
                      >
                        Forgot password?
                      </button>
                    </div>

                    <button
                      type="submit"
                      className={cn("w-full rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700", focusClass)}
                    >
                      Sign in
                    </button>
                  </form>

                  <div className="my-5 flex items-center gap-3" aria-hidden="true">
                    <div className="h-px flex-1 bg-slate-200" />
                    <span className="text-xs font-bold uppercase tracking-wide text-slate-500">or</span>
                    <div className="h-px flex-1 bg-slate-200" />
                  </div>

                  <div className="space-y-3">
                    <button
                      type="button"
                      onClick={handleSsoLogin}
                      className={cn("flex w-full items-center justify-center gap-2 rounded border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition-colors hover:bg-slate-50", focusClass)}
                    >
                      <GraduationCap className="h-4 w-4" aria-hidden="true" />
                      Continue with University SSO
                    </button>
                    <button
                      type="button"
                      onClick={handleDemoAccount}
                      className={cn("flex w-full items-center justify-center gap-2 rounded border border-slate-200 bg-slate-50 px-4 py-2.5 text-sm font-bold text-slate-700 transition-colors hover:bg-slate-100", focusClass)}
                    >
                      <Sparkles className="h-4 w-4" aria-hidden="true" />
                      Fill sample account
                    </button>
                  </div>

                  <div className="mt-5 rounded border border-slate-200 bg-slate-50 p-4">
                    <div className="flex items-start gap-3">
                      <HelpCircle className="mt-0.5 h-4 w-4 text-slate-600" aria-hidden="true" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">New to Tasks4eLearning?</p>
                        <p className="mt-1 text-sm leading-5 text-slate-600">
                          Account creation is managed by the institution.
                        </p>
                        <button
                          type="button"
                          onClick={() => setShowAccessNote((current) => !current)}
                          className={cn("mt-2 rounded text-sm font-bold text-blue-700 hover:text-blue-800 hover:underline", focusClass)}
                        >
                          Request access
                        </button>
                        {showAccessNote && (
                          <p className="mt-2 text-sm font-semibold text-slate-700" role="status">
                            Contact your instructor or campus LMS administrator to activate your account.
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <p className="mt-5 text-center text-xs font-medium text-slate-500">
                    Remember me stores only your email preference on this device.
                  </p>
                </motion.div>
              )}

              {view === "forgot" && (
                <motion.div
                  key="forgot"
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                >
                  <button
                    type="button"
                    onClick={returnToLogin}
                    className={cn("mb-6 flex items-center gap-2 rounded text-sm font-bold text-slate-600 transition-colors hover:text-slate-900", focusClass)}
                  >
                    <ArrowLeft className="h-4 w-4" aria-hidden="true" />
                    Back to Login
                  </button>

                  <div className="mb-6">
                    <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset password</h1>
                    <p className="mt-1 text-sm leading-6 text-slate-600">
                      Enter your institutional email to continue.
                    </p>
                  </div>

                  <form className="space-y-4" onSubmit={handleForgot} noValidate>
                    <div>
                      <label htmlFor="forgot-email" className="mb-1.5 block text-xs font-bold uppercase tracking-wide text-slate-600">
                        Email address
                      </label>
                      <div className="relative">
                        <Mail className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
                        <input
                          id="forgot-email"
                          name="forgot-email"
                          type="email"
                          autoComplete="email"
                          value={forgotEmail}
                          onChange={(e) => setForgotEmail(e.target.value)}
                          placeholder="student@university.edu"
                          aria-invalid={Boolean(forgotError)}
                          aria-describedby={forgotError ? "forgot-email-error" : undefined}
                          className={cn(inputClass, "pl-9", forgotError && "border-red-400 focus:border-red-500 focus:ring-red-500/20")}
                        />
                      </div>
                      {forgotError && (
                        <p id="forgot-email-error" className="mt-2 text-sm font-semibold text-red-600" role="alert">
                          {forgotError}
                        </p>
                      )}
                    </div>

                    <button
                      type="submit"
                      className={cn("w-full rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700", focusClass)}
                    >
                      Send reset link
                    </button>
                  </form>
                </motion.div>
              )}

              {view === "reset-sent" && (
                <motion.div
                  key="reset-sent"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="text-center"
                >
                  <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded bg-emerald-50 text-emerald-700">
                    <CheckCircle className="h-7 w-7" aria-hidden="true" />
                  </div>
                  <h1 className="text-2xl font-bold tracking-tight text-slate-900">Reset link ready</h1>
                  <p className="mx-auto mt-3 max-w-sm text-sm leading-6 text-slate-600" role="status">
                    A password reset confirmation was generated for{" "}
                    <strong className="font-bold text-slate-900">{forgotEmail}</strong>.
                  </p>
                  <button
                    type="button"
                    onClick={returnToLogin}
                    className={cn("mt-7 w-full rounded bg-blue-600 px-4 py-2.5 text-sm font-bold text-white shadow-sm transition-colors hover:bg-blue-700", focusClass)}
                  >
                    Back to Login
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </section>

        </div>
      </div>
    </main>
  );
}
