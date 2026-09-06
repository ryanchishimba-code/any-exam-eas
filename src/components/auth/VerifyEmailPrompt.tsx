"use client";

import { useState } from "react";
import { Check, ChevronDown, Mail } from "lucide-react";
import { maskEmail } from "@/lib/client/returning-user";
import { PLATFORM_EXAM_LIST_MIDDOT } from "@/lib/landing/content";
import { cn } from "@/lib/utils";

type VerifyEmailPromptProps = {
  email?: string | null;
  /** When true, study is locked until they verify. */
  required?: boolean;
  className?: string;
};

/** Product highlights only — no pricing or payment language. */
const FEATURE_HIGHLIGHTS = [
  "Six boards in one place — USMLE, NCLEX, NAPLEX, PANCE, FNP & NPTE",
  "Blueprint Roadmaps that show what to study next",
  "Deep Dive review opened from the questions you miss",
  "Timed Full Exam simulations with weak-area focus",
  "Analytics that surface your gaps early",
] as const;

/** Compact compare-style rows — features only, no money. */
const COMPARE_ROWS = [
  {
    label: "Exam coverage",
    us: PLATFORM_EXAM_LIST_MIDDOT,
    them: "Usually one exam per subscription",
  },
  {
    label: "Study plan",
    us: "Blueprint-aligned Roadmap per exam",
    them: "You build your own schedule",
  },
  {
    label: "After a miss",
    us: "Deep Dive modules linked from practice",
    them: "Separate review products or self-directed notes",
  },
  {
    label: "Exam day",
    us: "Timed Full Exams with weak-area weighting",
    them: "Self-assembled mocks or add-on products",
  },
] as const;

/**
 * Calm post-signup direction: start prep → check email → verify.
 * Builds trust with features; keeps any account detail optional and collapsed.
 */
export function VerifyEmailPrompt({
  email,
  required: _required = false,
  className,
}: VerifyEmailPromptProps) {
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const displayEmail = email?.trim() ? maskEmail(email.trim()) : "your email";

  async function resend() {
    setLoading(true);
    setMessage(null);
    try {
      const res = await fetch("/api/auth/resend-verification", { method: "POST" });
      const data = (await res.json().catch(() => ({}))) as { message?: string; error?: string };
      setMessage(
        data.message ?? (res.ok ? "Verification email sent." : data.error ?? "Could not send email.")
      );
    } catch {
      setMessage("Could not send email. Try again in a moment.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <section
      className={cn(
        "relative overflow-hidden rounded-[22px] border border-black/[0.06] bg-white px-6 py-8 text-center shadow-[0_1px_2px_rgba(0,0,0,0.04),0_12px_40px_rgba(15,23,42,0.06)]",
        className
      )}
      aria-labelledby="verify-email-heading"
    >
      <div
        className="pointer-events-none absolute inset-x-0 top-0 h-24 bg-[radial-gradient(ellipse_at_top,rgba(13,148,136,0.1),transparent_70%)]"
        aria-hidden
      />
      <div className="relative mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[color-mix(in_srgb,var(--color-accent)_10%,white)] text-[var(--color-accent)]">
        <Mail className="h-5 w-5" strokeWidth={1.75} aria-hidden />
      </div>
      <h2
        id="verify-email-heading"
        className="relative mt-5 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)]"
      >
        Ready to start your exam prep
      </h2>

      <div
        className="relative mx-auto mt-5 max-w-md rounded-2xl border border-teal-500/25 bg-teal-50 px-4 py-4 text-left dark:border-teal-400/30 dark:bg-teal-950/40"
        role="status"
      >
        <p className="text-[11px] font-bold uppercase tracking-[0.14em] text-teal-700 dark:text-teal-300">
          Check your email
        </p>
        <p className="mt-1.5 text-[15px] font-medium leading-snug text-[var(--color-ink)]">
          Please look for the verification link we sent to{" "}
          <span className="font-semibold text-teal-800 dark:text-teal-200">{displayEmail}</span>.
        </p>
        <p className="mt-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          Open that email, verify, then come back here.
        </p>
        <div className="mt-4 flex flex-col items-stretch gap-2 sm:flex-row sm:items-center">
          <button
            type="button"
            disabled={loading}
            onClick={() => void resend()}
            className="inline-flex min-h-10 items-center justify-center rounded-full bg-teal-700 px-5 text-[13px] font-semibold text-white transition hover:bg-teal-800 disabled:opacity-50 dark:bg-teal-600 dark:hover:bg-teal-500"
          >
            {loading ? "Sending…" : "Resend email"}
          </button>
          {message ? (
            <p className="text-[13px] text-teal-800 dark:text-teal-200" role="status">
              {message}
            </p>
          ) : null}
        </div>
      </div>

      <div className="relative mx-auto mt-8 max-w-md text-left">
        <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
          What’s waiting for you
        </p>
        <ul className="mt-3 space-y-2.5">
          {FEATURE_HIGHLIGHTS.map((item) => (
            <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-[var(--color-ink)]">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-teal-600"
                strokeWidth={2.25}
                aria-hidden
              />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      <div className="relative mx-auto mt-6 max-w-md overflow-hidden rounded-2xl border border-black/[0.06] text-left">
        <div className="grid grid-cols-[1fr_1fr_1fr] gap-0 border-b border-black/[0.06] bg-slate-50/80 px-3 py-2 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
          <span>Feature</span>
          <span className="text-teal-700">AnyExamEasy</span>
          <span>Typical QBank</span>
        </div>
        {COMPARE_ROWS.map((row) => (
          <div
            key={row.label}
            className="grid grid-cols-[1fr_1fr_1fr] gap-2 border-b border-black/[0.04] px-3 py-2.5 text-[11.5px] leading-snug last:border-0"
          >
            <span className="font-medium text-[var(--color-ink)]">{row.label}</span>
            <span className="text-[var(--color-ink)]">{row.us}</span>
            <span className="text-[var(--color-ink-muted)]">{row.them}</span>
          </div>
        ))}
      </div>

      <div className="relative mx-auto mt-5 max-w-md text-left">
        <button
          type="button"
          onClick={() => setDetailsOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 rounded-xl px-1 py-2 text-left text-[13px] font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
          aria-expanded={detailsOpen}
        >
          <span>Why verify?</span>
          <ChevronDown
            className={cn("h-4 w-4 shrink-0 transition-transform", detailsOpen && "rotate-180")}
            aria-hidden
          />
        </button>
        {detailsOpen ? (
          <p className="px-1 pb-1 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
            Verifying your email keeps your progress tied to you and lets us reach you if something
            needs attention. It takes a moment — then you can explore the product at your own pace.
          </p>
        ) : null}
      </div>
    </section>
  );
}
