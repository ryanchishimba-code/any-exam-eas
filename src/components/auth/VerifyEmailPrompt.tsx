"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, ChevronDown } from "lucide-react";
import { maskEmail } from "@/lib/client/returning-user";
import { PLATFORM_EXAM_LIST_MIDDOT } from "@/lib/landing/content";
import { formatMonthlyPrice } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { VerifyEmailInboxCard } from "@/components/auth/verify-email/VerifyEmailInboxCard";
import { cn } from "@/lib/utils";

type VerifyEmailPromptProps = {
  email?: string | null;
  required?: boolean;
  compact?: boolean;
  className?: string;
  /** Optional marketing blocks below the card (off by default for a cleaner gate). */
  showMarketingExtras?: boolean;
};

const FEATURE_HIGHLIGHTS = [
  "Six boards in one place — USMLE, NCLEX, NAPLEX, PANCE, FNP & NPTE",
  "Roadmap that show what to study next",
  "Deep Dive review opened from the questions you miss",
  "Timed Full Exam simulations with weak-area focus",
  "Analytics that surface your gaps early",
] as const;

const COMPARE_ROWS = [
  {
    label: "Exam coverage",
    us: PLATFORM_EXAM_LIST_MIDDOT,
    them: "Usually one exam at a time",
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

export function VerifyEmailPrompt({
  email,
  required = false,
  compact = false,
  className,
  showMarketingExtras = false,
}: VerifyEmailPromptProps) {
  const displayEmail = email?.trim() ? maskEmail(email.trim()) : "your email";
  const monthly = formatMonthlyPrice("pro");
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [upgradeOpen, setUpgradeOpen] = useState(false);

  return (
    <section
      className={cn(compact ? "text-left" : "mx-auto w-full max-w-md", className)}
      data-verify-required={required ? "true" : "false"}
    >
      <VerifyEmailInboxCard
        emailLabel={displayEmail}
        showChangeEmailLink={!compact}
        resendHint="nearby-button"
      />

      {!compact && showMarketingExtras ? (
        <>
          <div className="relative mx-auto mt-8 max-w-md text-left">
            <p className="text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-ink-muted)]">
              What&apos;s waiting for you
            </p>
            <ul className="mt-3 space-y-2.5">
              {FEATURE_HIGHLIGHTS.map((item) => (
                <li key={item} className="flex gap-2.5 text-[13.5px] leading-snug text-[var(--color-ink)]">
                  <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-600" strokeWidth={2.25} aria-hidden />
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
          <div className="relative mx-auto mt-5 max-w-md space-y-1 text-left">
            <button
              type="button"
              onClick={() => setDetailsOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-1 py-2 text-left text-[13px] font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
              aria-expanded={detailsOpen}
            >
              <span>Why verify?</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", detailsOpen && "rotate-180")} aria-hidden />
            </button>
            {detailsOpen ? (
              <p className="px-1 pb-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                Verifying your email keeps your progress tied to you and lets us reach you if something
                needs attention.
              </p>
            ) : null}
            <button
              type="button"
              onClick={() => setUpgradeOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 rounded-xl px-1 py-2 text-left text-[13px] font-medium text-[var(--color-ink-muted)] transition hover:text-[var(--color-ink)]"
              aria-expanded={upgradeOpen}
            >
              <span>Upgrade</span>
              <ChevronDown className={cn("h-4 w-4 shrink-0 transition-transform", upgradeOpen && "rotate-180")} aria-hidden />
            </button>
            {upgradeOpen ? (
              <div className="rounded-xl border border-black/[0.06] bg-slate-50/80 px-3 py-3 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
                <p>
                  When you&apos;re ready for unlimited practice, Pro is{" "}
                  <span className="font-medium text-[var(--color-ink)]">{monthly}/mo</span> for all six
                  boards.
                </p>
                <Link href={ROUTES.pricing} prefetch={false} className="mt-2 inline-flex text-[13px] font-semibold text-teal-700 hover:underline dark:text-teal-300">
                  View plans
                </Link>
              </div>
            ) : null}
          </div>
        </>
      ) : null}
    </section>
  );
}
