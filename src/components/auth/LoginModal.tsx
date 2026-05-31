"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { Activity, Lock, Mail, ShieldCheck, X } from "lucide-react";
import {
  messageForSignInError,
  messageFromUnknownAuthError,
} from "@/lib/auth-client";
import { completeLoginFlow } from "@/lib/client/post-login";
import {
  firstName,
  loadReturningUserHint,
  maskEmail,
  rememberEmail,
  saveReturningUserHint,
  type LoginMethod,
} from "@/lib/client/returning-user";

type LoginModalProps = {
  open: boolean;
  onClose: () => void;
  callbackUrl?: string;
};

export function LoginModal({ open, onClose, callbackUrl = "/study" }: LoginModalProps) {
  const router = useRouter();
  const [hint, setHint] = useState(loadReturningUserHint());
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [magicEmail, setMagicEmail] = useState("");
  const [error, setError] = useState("");
  const [magicMessage, setMagicMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [magicLoading, setMagicLoading] = useState(false);
  const [showPasswordForm, setShowPasswordForm] = useState(false);

  useEffect(() => {
    if (!open) return;
    const stored = loadReturningUserHint();
    setHint(stored);
    setEmail(stored?.email ?? "");
    setMagicEmail(stored?.email ?? "");
    setShowPasswordForm(!stored || stored.lastMethod === "email");
    setError("");
    setMagicMessage("");
    setPassword("");
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      window.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  const displayName = hint?.name
    ? firstName(hint.name)
    : hint?.email
      ? firstName(null, hint.email)
      : null;

  const preferredMethod = hint?.lastMethod;

  function rememberMethod(method: LoginMethod, addr?: string) {
    const e = addr ?? email.trim() ?? hint?.email;
    if (!e) return;
    saveReturningUserHint({ email: e, name: hint?.name, lastMethod: method });
  }

  function persistEmail(value: string) {
    rememberEmail(value, { name: hint?.name, lastMethod: hint?.lastMethod });
  }

  const oauthOrder = ((): ("google" | "apple")[] => {
    const providers: ("google" | "apple")[] = [];
    if (preferredMethod === "apple") {
      providers.push("apple", "google");
    } else {
      providers.push("google", "apple");
    }
    return providers;
  })();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const trimmedEmail = email.trim();
    if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
      setError("Enter a valid email address.");
      setLoading(false);
      return;
    }

    try {
      const res = await signIn("credentials", {
        email: trimmedEmail,
        password,
        redirect: false,
      });

      if (!res) {
        setError("Sign-in service did not respond. Try again in a moment.");
        return;
      }
      if (res.error) {
        setError(messageForSignInError(res.error));
        return;
      }

      onClose();
      await completeLoginFlow({
        router,
        callbackUrl,
        email: trimmedEmail,
        method: "email",
      });
    } catch (err) {
      setError(messageFromUnknownAuthError(err));
    } finally {
      setLoading(false);
    }
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setMagicLoading(true);
    setError("");
    setMagicMessage("");

    const trimmed = magicEmail.trim() || hint?.email?.trim() || "";
    if (!trimmed) {
      setError("Enter your email for the magic link.");
      setMagicLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/magic-link", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: trimmed }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? "Could not send link");
      setMagicMessage(data.message ?? "Check your inbox for a secure sign-in link.");
      rememberMethod("magic", trimmed);
      persistEmail(trimmed);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not send link.");
    } finally {
      setMagicLoading(false);
    }
  }

  return (
    <AnimatePresence>
      {open && (
        <div className="fixed inset-0 z-[200] flex items-end justify-center p-0 sm:items-center sm:p-4">
          <motion.button
            type="button"
            aria-label="Close login dialog"
            className="absolute inset-0 bg-[#0c4a6e]/40 backdrop-blur-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          <motion.div
            role="dialog"
            aria-modal="true"
            aria-labelledby="login-modal-title"
            initial={{ opacity: 0, y: 16, scale: 0.99 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 12, scale: 0.99 }}
            transition={{ duration: 0.18, ease: [0.25, 0.1, 0.25, 1] }}
            className="relative z-10 flex max-h-[92vh] w-full max-w-md flex-col overflow-hidden rounded-t-[1.75rem] bg-white shadow-[0_24px_80px_rgba(8,145,178,0.25)] sm:rounded-[1.75rem] dark:bg-[#0f172a]"
          >
            {/* Medical teal header */}
            <div className="relative overflow-hidden bg-gradient-to-br from-[#0e7490] via-[#0891b2] to-[#0284c7] px-6 pb-8 pt-6 text-white">
              <div
                className="pointer-events-none absolute -right-8 -top-8 h-32 w-32 rounded-full bg-white/10 blur-2xl"
                aria-hidden
              />
              <div
                className="pointer-events-none absolute -bottom-6 left-1/4 h-24 w-24 rounded-full bg-teal-300/20 blur-xl"
                aria-hidden
              />

              <button
                type="button"
                onClick={onClose}
                className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white transition hover:bg-white/25"
                aria-label="Close"
              >
                <X className="h-4 w-4" />
              </button>

              <div className="flex items-center gap-3">
                <span className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white/20 backdrop-blur-sm">
                  <Activity className="h-5 w-5" strokeWidth={2.25} aria-hidden />
                </span>
                <div>
                  <p className="text-xs font-medium uppercase tracking-wider text-teal-100/90">
                    Secure sign-in
                  </p>
                  <h2 id="login-modal-title" className="text-xl font-semibold tracking-tight">
                    {displayName ? `Welcome back, ${displayName}` : "Welcome back"}
                  </h2>
                </div>
              </div>

              <p className="mt-3 text-sm leading-relaxed text-teal-50/90">
                {hint?.email ? (
                  <>
                    Continue as{" "}
                    <span className="font-medium text-white">{maskEmail(hint.email)}</span>
                    {hint.readinessScore != null && (
                      <> · last readiness {hint.readinessScore}%</>
                    )}
                  </>
                ) : (
                  <>Pick up your exams, streaks, and board prep right where you left off.</>
                )}
              </p>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-6">
              {preferredMethod && (preferredMethod === "google" || preferredMethod === "apple") && (
                <div className="mb-4">
                  <OAuthButton
                    provider={preferredMethod}
                    highlighted
                    large
                    callbackUrl={callbackUrl}
                    onUse={() => rememberMethod(preferredMethod)}
                  />
                </div>
              )}

              {preferredMethod && preferredMethod !== "google" && preferredMethod !== "apple" && (
                <p className="mb-4 rounded-xl border border-teal-100 bg-teal-50/80 px-3 py-2 text-xs text-teal-900 dark:border-teal-500/20 dark:bg-teal-950/40 dark:text-teal-100">
                  Last signed in with{" "}
                  <span className="font-semibold capitalize">
                    {preferredMethod === "magic" ? "magic link" : preferredMethod}
                  </span>
                </p>
              )}

              <div className="space-y-3">
                {oauthOrder.map((provider) =>
                  provider === preferredMethod ? null : (
                    <OAuthButton
                      key={provider}
                      provider={provider}
                      callbackUrl={callbackUrl}
                      onUse={() => rememberMethod(provider)}
                    />
                  )
                )}
              </div>

              <div className="relative my-5">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-teal-100 dark:border-teal-900/50" />
                </div>
                <p className="relative mx-auto w-fit bg-white px-3 text-xs font-medium uppercase tracking-wide text-teal-600/70 dark:bg-[#0f172a] dark:text-teal-400/70">
                  Magic link
                </p>
              </div>

              <form onSubmit={handleMagicLink} className="space-y-3">
                {hint?.email && preferredMethod === "magic" ? (
                  <button
                    type="submit"
                    disabled={magicLoading}
                    className="login-modal-btn-primary w-full"
                  >
                    <Mail className="h-4 w-4" aria-hidden />
                    {magicLoading ? "Sending…" : `Send link to ${maskEmail(hint.email)}`}
                  </button>
                ) : (
                  <>
                    <label className="flex items-center gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                      <Mail className="h-4 w-4 text-teal-600" aria-hidden />
                      Email me a one-time link
                    </label>
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="you@school.edu"
                      value={magicEmail}
                      onChange={(e) => setMagicEmail(e.target.value)}
                      onBlur={(e) => persistEmail(e.target.value)}
                      className="login-modal-input"
                    />
                    <button
                      type="submit"
                      disabled={magicLoading}
                      className="login-modal-btn-secondary w-full"
                    >
                      {magicLoading ? "Sending…" : "Send magic link"}
                    </button>
                  </>
                )}
                {magicMessage && (
                  <p className="rounded-xl border border-teal-200 bg-teal-50 px-3 py-2 text-xs text-teal-900 dark:border-teal-500/30 dark:bg-teal-950/50 dark:text-teal-100">
                    {magicMessage}
                  </p>
                )}
              </form>

              {showPasswordForm ? (
                <>
                  <div className="relative my-5">
                    <div className="absolute inset-0 flex items-center">
                      <div className="w-full border-t border-teal-100 dark:border-teal-900/50" />
                    </div>
                    <p className="relative mx-auto w-fit bg-white px-3 text-xs font-medium uppercase tracking-wide text-teal-600/70 dark:bg-[#0f172a] dark:text-teal-400/70">
                      Email & password
                    </p>
                  </div>

                  <form onSubmit={handlePasswordLogin} className="space-y-3">
                    <input
                      type="email"
                      required
                      autoComplete="email"
                      placeholder="Email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      onBlur={(e) => persistEmail(e.target.value)}
                      className="login-modal-input"
                    />
                    <input
                      type="password"
                      required
                      autoComplete="current-password"
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="login-modal-input"
                    />
                    <div className="flex justify-end">
                      <Link
                        href="/forgot-password"
                        onClick={onClose}
                        className="text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                      >
                        Forgot password?
                      </Link>
                    </div>
                    {error && (
                      <p className="rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200">
                        {error}
                      </p>
                    )}
                    <button type="submit" disabled={loading} className="login-modal-btn-primary w-full">
                      <Lock className="h-4 w-4" aria-hidden />
                      {loading ? "Signing in…" : "Log in"}
                    </button>
                  </form>
                </>
              ) : (
                <button
                  type="button"
                  onClick={() => setShowPasswordForm(true)}
                  className="mt-5 w-full text-center text-xs font-medium text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  Use email & password instead
                </button>
              )}

              {!showPasswordForm && error && (
                <p className="mt-3 rounded-xl border border-red-200 bg-red-50 px-3 py-2 text-xs text-red-800 dark:border-red-500/30 dark:bg-red-950/40 dark:text-red-200">
                  {error}
                </p>
              )}

              <p className="mt-5 flex items-center justify-center gap-1.5 text-center text-[0.6875rem] text-slate-500 dark:text-slate-400">
                <ShieldCheck className="h-3.5 w-3.5 text-teal-600" aria-hidden />
                HIPAA-aware encryption · Trusted by healthcare students
              </p>

              <p className="mt-4 text-center text-xs text-slate-500 dark:text-slate-400">
                New here?{" "}
                <Link
                  href="/signup?plan=trial"
                  onClick={onClose}
                  className="font-semibold text-teal-600 hover:text-teal-700 dark:text-teal-400"
                >
                  Start your trial
                </Link>
              </p>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

function OAuthButton({
  provider,
  highlighted,
  large,
  callbackUrl,
  onUse,
}: {
  provider: "google" | "apple";
  highlighted?: boolean;
  large?: boolean;
  callbackUrl: string;
  onUse: () => void;
}) {
  const enabled =
    provider === "google"
      ? process.env.NEXT_PUBLIC_GOOGLE_AUTH_ENABLED === "true"
      : process.env.NEXT_PUBLIC_APPLE_AUTH_ENABLED === "true";

  if (!enabled) return null;

  const isApple = provider === "apple";

  return (
    <button
      type="button"
      onClick={() => {
        onUse();
        void signIn(provider, { callbackUrl });
      }}
      className={`flex w-full items-center justify-center gap-2.5 rounded-xl border px-4 text-sm font-semibold transition-all ${
        large ? "py-3.5 text-base shadow-[0_6px_24px_rgba(8,145,178,0.2)]" : "py-3"
      } ${
        isApple
          ? "border-slate-900 bg-slate-900 text-white hover:bg-slate-800"
          : "border-slate-200 bg-white text-slate-800 hover:border-teal-200 hover:bg-teal-50/50 dark:border-slate-600 dark:bg-slate-800 dark:text-white dark:hover:border-teal-500/40"
      } ${highlighted ? "ring-2 ring-teal-400/50 ring-offset-2 dark:ring-offset-[#0f172a]" : ""}`}
    >
      {isApple ? <AppleIcon /> : <GoogleIcon />}
      Continue with {isApple ? "Apple" : "Google"}
    </button>
  );
}

function GoogleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" aria-hidden>
      <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.56c2.08-1.92 3.28-4.74 3.28-8.1z" />
      <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.56-2.77c-.98.66-2.23 1.06-3.72 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
      <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
      <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
    </svg>
  );
}

function AppleIcon() {
  return (
    <svg className="h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="currentColor" aria-hidden>
      <path d="M16.365 1.43c0 1.14-.417 2.063-1.248 2.769-.786.68-1.705 1.018-2.754.942-.03-1.095.398-2.04 1.282-2.833.83-.755 1.816-1.14 2.72-1.078.026 1.066-.332 2.02-1 2.2zm1.103 3.711c-1.517-.088-2.81.864-3.535.864-.748 0-1.906-.816-3.146-.792-1.618.026-3.106.942-3.938 2.396-1.68 2.912-.432 7.224 1.206 9.588.8 1.158 1.752 2.457 3.006 2.411 1.206-.048 1.662-.78 3.12-.78 1.458 0 1.872.78 3.146.756 1.3-.022 2.124-1.182 2.916-2.346.918-1.342 1.296-2.646 1.318-2.712-.03-.014-2.534-.972-2.56-3.858-.022-2.416 1.98-3.572 2.07-3.636-1.128-1.654-2.884-1.88-3.504-1.914z" />
    </svg>
  );
}
