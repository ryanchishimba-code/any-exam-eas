"use client";

import { useCallback, useEffect, useId, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowLeft, CheckCircle2, Loader2, Mail, RotateCcw } from "lucide-react";
import { cn } from "@/lib/utils";
import { InlineError } from "@/components/ui/StatusMessage";
import {
  FORGOT_PASSWORD_RESEND_COOLDOWN_SEC,
  requestForgotPassword,
} from "@/lib/client/forgot-password";
import { maskEmail } from "@/lib/client/returning-user";
import { FORGOT_PASSWORD_SUCCESS_MESSAGE } from "@/lib/validators/password-reset";

export type ForgotPasswordStep = "form" | "success";

type ForgotPasswordPanelProps = {
  /** Page shell vs login modal — adjusts inputs and link colors. */
  variant?: "page" | "modal";
  defaultEmail?: string;
  onBackToLogin?: () => void;
  onStepChange?: (step: ForgotPasswordStep) => void;
};

const stepMotion = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -8 },
  transition: { duration: 0.22, ease: [0.25, 0.1, 0.25, 1] as const },
};

export function ForgotPasswordPanel({
  variant = "page",
  defaultEmail = "",
  onBackToLogin,
  onStepChange,
}: ForgotPasswordPanelProps) {
  const isModal = variant === "modal";
  const emailId = useId();
  const errorId = useId();

  const [step, setStep] = useState<ForgotPasswordStep>("form");
  const [email, setEmail] = useState(defaultEmail);
  const [submittedEmail, setSubmittedEmail] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const [resendNotice, setResendNotice] = useState("");
  const [devResetUrl, setDevResetUrl] = useState<string | null>(null);

  useEffect(() => {
    setEmail((current) => current || defaultEmail);
  }, [defaultEmail]);

  useEffect(() => {
    onStepChange?.(step);
  }, [step, onStepChange]);

  useEffect(() => {
    if (resendCooldown <= 0) return;
    const timer = window.setInterval(() => {
      setResendCooldown((seconds) => Math.max(0, seconds - 1));
    }, 1000);
    return () => window.clearInterval(timer);
  }, [resendCooldown]);

  const startCooldown = useCallback((seconds = FORGOT_PASSWORD_RESEND_COOLDOWN_SEC) => {
    setResendCooldown(seconds);
  }, []);

  async function sendResetLink(targetEmail: string, mode: "submit" | "resend") {
    const isResend = mode === "resend";
    if (isResend) {
      if (resendCooldown > 0 || resendLoading) return;
      setResendLoading(true);
      setResendNotice("");
    } else {
      setError("");
      setLoading(true);
    }

    const result = await requestForgotPassword(targetEmail);

    if (result.ok) {
      setSubmittedEmail(targetEmail.trim());
      setDevResetUrl(result.devResetUrl ?? null);
      setStep("success");
      if (isResend) {
        setResendNotice(FORGOT_PASSWORD_SUCCESS_MESSAGE);
      }
      startCooldown();
    } else if (isResend) {
      setResendNotice(result.error);
      if (result.retryAfterSec) startCooldown(result.retryAfterSec);
    } else {
      setError(result.error);
      if (result.retryAfterSec) startCooldown(result.retryAfterSec);
    }

    if (isResend) setResendLoading(false);
    else setLoading(false);
  }

  function handleUseDifferentEmail() {
    setStep("form");
    setResendNotice("");
    setResendCooldown(0);
    setDevResetUrl(null);
    setError("");
  }

  function handleBackToLogin() {
    setStep("form");
    setResendNotice("");
    setResendCooldown(0);
    setDevResetUrl(null);
    setError("");
    onBackToLogin?.();
  }

  const inputClass = isModal ? "login-modal-input" : "apple-input";
  const linkClass = isModal
    ? "inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm font-semibold text-teal-600 transition hover:text-teal-700"
    : "inline-flex min-h-[44px] items-center justify-center gap-1.5 text-sm font-medium text-[var(--color-accent)] hover:underline";

  const BackToLoginControl = onBackToLogin ? (
    <button type="button" onClick={handleBackToLogin} className={linkClass}>
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back to Login
    </button>
  ) : (
    <Link href="/login" className={linkClass}>
      <ArrowLeft className="h-4 w-4" aria-hidden />
      Back to Login
    </Link>
  );

  return (
    <AnimatePresence mode="wait" initial={false}>
      {step === "success" ? (
        <motion.div
          key="forgot-success"
          {...stepMotion}
          className="space-y-5 text-center"
          aria-live="polite"
        >
          <div
            className={cn(
              "mx-auto flex h-14 w-14 items-center justify-center rounded-full",
              isModal ? "bg-teal-50 text-teal-600" : "bg-teal-50 text-teal-600"
            )}
          >
            <Mail className="h-6 w-6" aria-hidden />
          </div>

          <div
            className={cn(
              "flex items-start gap-2.5 rounded-2xl border px-4 py-3.5 text-left text-sm leading-relaxed",
              isModal
                ? "border-teal-100 bg-teal-50/80 text-teal-950"
                : "a11y-banner a11y-banner--success border-transparent"
            )}
            role="status"
          >
            <CheckCircle2
              className={cn("mt-0.5 h-4 w-4 shrink-0", isModal ? "text-teal-600" : undefined)}
              aria-hidden
            />
            <span>{FORGOT_PASSWORD_SUCCESS_MESSAGE}</span>
          </div>

          <p className={cn("text-sm", isModal ? "text-slate-600" : "text-[var(--color-ink-muted)]")}>
            {submittedEmail ? (
              <>
                Sent to{" "}
                <span className={cn("font-medium", isModal ? "text-slate-900" : "text-[var(--color-ink)]")}>
                  {maskEmail(submittedEmail)}
                </span>
                . Check your inbox and spam folder — the link expires in 1 hour.
              </>
            ) : (
              <>Check your inbox and spam folder. The link expires in 1 hour.</>
            )}
          </p>

          {process.env.NODE_ENV === "development" && devResetUrl && (
            <div className="rounded-xl border border-amber-200 bg-amber-50 px-4 py-3 text-left text-xs text-amber-950">
              <p className="font-semibold">Dev — email not configured</p>
              <p className="mt-1">
                No reset email was sent. Use this link on your local app (expires in 1 hour):
              </p>
              <a
                href={devResetUrl}
                className="mt-2 block break-all font-medium text-teal-700 underline"
              >
                {devResetUrl}
              </a>
            </div>
          )}

          <div
            className={cn(
              "rounded-2xl border px-4 py-3.5 text-left text-sm",
              isModal ? "border-slate-200 bg-slate-50 text-slate-700" : "border-black/[0.06] bg-[var(--color-surface)] text-[var(--color-ink-muted)]"
            )}
          >
            <p className="font-medium text-[var(--color-ink)]">Didn&apos;t receive it?</p>
            <ul className="mt-2 list-inside list-disc space-y-1.5 text-[0.8125rem] leading-relaxed">
              <li>Check spam, junk, and promotions folders.</li>
              <li>Use the same email you signed up with (including typos).</li>
              <li>If you signed up with Google, use <strong>Continue with Google</strong> on the login screen.</li>
              <li>Wait a minute, then tap <strong>Resend email</strong> below.</li>
            </ul>
            <p className="mt-3 text-[0.8125rem]">
              Still stuck?{" "}
              <Link
                href="/feedback"
                className={cn(
                  "font-medium underline-offset-2 hover:underline",
                  isModal ? "text-teal-600" : "text-[var(--color-accent)]"
                )}
              >
                Contact support
              </Link>
            </p>
          </div>

          {process.env.NODE_ENV === "development" && !devResetUrl && (
            <p className="rounded-xl bg-amber-50 px-4 py-3 text-left text-xs text-amber-900">
              Dev mode: if email is not configured, check the terminal running{" "}
              <code className="rounded bg-amber-100 px-1">npm run dev</code> for the reset link.
            </p>
          )}

          <div className="flex flex-col gap-3 pt-1">
            {onBackToLogin ? (
              <button
                type="button"
                onClick={handleBackToLogin}
                className="login-modal-btn-primary w-full"
              >
                Back to Login
              </button>
            ) : (
              <Link href="/login" className="login-modal-btn-primary w-full text-center">
                Back to Login
              </Link>
            )}

            <button
              type="button"
              disabled={resendCooldown > 0 || resendLoading}
              onClick={() => void sendResetLink(submittedEmail, "resend")}
              className="login-modal-btn-secondary w-full gap-2 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {resendLoading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                  Sending…
                </>
              ) : resendCooldown > 0 ? (
                <>Resend email in {resendCooldown}s</>
              ) : (
                <>
                  <RotateCcw className="h-4 w-4" aria-hidden />
                  Resend email
                </>
              )}
            </button>

            <button
              type="button"
              onClick={handleUseDifferentEmail}
              className={cn(
                "text-sm font-medium transition",
                isModal ? "text-teal-600 hover:text-teal-700" : "text-[var(--color-accent)] hover:underline"
              )}
            >
              Use a different email
            </button>
          </div>

          {resendNotice && (
            <p
              className={cn(
                "text-left text-xs sm:text-center",
                isModal ? "text-slate-500" : "text-[var(--color-ink-muted)]"
              )}
              role="status"
            >
              {resendNotice}
            </p>
          )}
        </motion.div>
      ) : (
        <motion.form
          key="forgot-form"
          {...stepMotion}
          onSubmit={(e) => {
            e.preventDefault();
            void sendResetLink(email, "submit");
          }}
          noValidate
          className="space-y-5"
          aria-busy={loading}
        >
          <p
            className={cn(
              "text-sm leading-relaxed",
              isModal ? "text-slate-600" : "text-[var(--color-ink-muted)]"
            )}
          >
            Enter the email on your account and we&apos;ll send you a secure link to choose a new
            password.
          </p>

          <div className="space-y-2 text-left">
            <label
              htmlFor={emailId}
              className={isModal ? "text-xs font-semibold uppercase tracking-wide text-slate-500" : "apple-label"}
            >
              Email address
            </label>
            <input
              id={emailId}
              required
              type="email"
              inputMode="email"
              autoComplete="email"
              autoFocus
              placeholder="you@example.com"
              value={email}
              disabled={loading}
              onChange={(e) => {
                setEmail(e.target.value);
                if (error) setError("");
              }}
              aria-invalid={error ? true : undefined}
              aria-describedby={error ? errorId : undefined}
              className={inputClass}
            />
          </div>

          {error && (
            <div id={errorId}>
              <InlineError>{error}</InlineError>
            </div>
          )}

          {resendCooldown > 0 && !error && (
            <p className={cn("text-xs", isModal ? "text-slate-500" : "text-[var(--color-ink-muted)]")} role="status">
              Please wait {resendCooldown}s before requesting another reset email.
            </p>
          )}

          <button
            type="submit"
            disabled={loading || resendCooldown > 0}
            className="login-modal-btn-primary w-full"
          >
            {loading ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" aria-hidden />
                Sending…
              </>
            ) : (
              "Send reset link"
            )}
          </button>

          <p className="text-center">{BackToLoginControl}</p>
        </motion.form>
      )}
    </AnimatePresence>
  );
}
