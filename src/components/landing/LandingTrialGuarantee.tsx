"use client";

/**
 * LandingTrialGuarantee — risk-reversal & trial-clarity section.
 *
 * Placed between the pricing section and the FAQ so visitors see exactly
 * what "free trial" means before they encounter final objections. Three
 * columns cover:
 *   1. What unlocks on day one
 *   2. No charge during trial — no card required
 *   3. Quality commitment / support guarantee
 */

import Link from "next/link";
import { BadgeCheck, Calendar, Zap } from "lucide-react";
import { LEGAL_ENTITY } from "@/lib/legal";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { formatTrialLabel, formatTrialQuestionLimit } from "@/lib/site";

const PILLARS = [
  {
    icon: Zap,
    title: "Start practicing immediately",
    body: `Explore all 6 exam banks, Roadmaps, Memory Cards, Full Exams, and calculators — ${TRIAL_LIFETIME_QUESTIONS} practice questions included during your ${TRIAL_DAYS}-day trial.`,
  },
  {
    icon: Calendar,
    title: `${TRIAL_DAYS} days to explore — no card required`,
    body: "Create your account with email or social login. No payment method needed. Upgrade anytime for unlimited questions and Pro features.",
  },
  {
    icon: BadgeCheck,
    title: "Not the right fit? We'll make it right.",
    body: "After your trial, you can still log in and open your dashboard. Study tools stay locked until you subscribe. Run into a quality issue? Reach out to support within 30 days and we'll do our best to resolve it.",
  },
] as const;

export function LandingTrialGuarantee() {
  const trialLabel = formatTrialLabel();

  return (
    <section
      aria-labelledby="trial-guarantee-heading"
      className="border-y border-[var(--color-border)] bg-[color-mix(in_srgb,var(--color-accent)_5%,var(--color-surface))] py-16 sm:py-20"
    >
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        {/* Header */}
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface-elevated))] px-4 py-1.5">
            <BadgeCheck
              className="h-4 w-4 text-[var(--color-accent)]"
              aria-hidden
            />
            <span className="text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
              {trialLabel} — no commitment
            </span>
          </div>
          <h2
            id="trial-guarantee-heading"
            className="mt-4 text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl"
          >
            Try the whole platform free. Cancel any time.
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
            {formatTrialQuestionLimit()} — no payment required to start.{" "}
            <strong className="font-semibold text-[var(--color-ink)]">
              Upgrade anytime for unlimited access.
            </strong>
          </p>
        </div>

        {/* Three pillars */}
        <div className="mt-10 grid gap-5 sm:grid-cols-3">
          {PILLARS.map(({ icon: Icon, title, body }) => (
            <div
              key={title}
              className="flex flex-col gap-3 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]"
            >
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-[var(--color-accent)]/10">
                <Icon
                  className="h-5 w-5 text-[var(--color-accent)]"
                  strokeWidth={1.75}
                  aria-hidden
                />
              </span>
              <h3 className="text-sm font-bold text-[var(--color-ink)]">
                {title}
              </h3>
              <p className="text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {body}
              </p>
            </div>
          ))}
        </div>

        {/* Satisfaction commitment banner */}
        <div className="mt-8 flex flex-col items-center gap-2 rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_25%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_7%,var(--color-surface-elevated))] px-6 py-5 text-center sm:flex-row sm:justify-between sm:text-left">
          <div>
            <p className="text-sm font-bold text-[var(--color-ink)]">
              30-Day Satisfaction Commitment
            </p>
            <p className="mt-0.5 text-xs leading-relaxed text-[var(--color-ink-muted)]">
              If the quality of any question or explanation falls short of your
              expectations, email us at{" "}
              <a
                href={`mailto:${LEGAL_ENTITY.supportEmail}`}
                className="font-semibold text-[var(--color-ink)] underline underline-offset-2 transition hover:text-[var(--color-accent)]"
              >
                {LEGAL_ENTITY.supportEmail}
              </a>{" "}
              within 30 days and we&apos;ll make it right. We stand behind every
              item on the platform.
            </p>
          </div>
          <Link
            href="/feedback"
            className="mt-3 shrink-0 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_40%,transparent)] bg-[var(--color-surface-elevated)] px-4 py-2 text-xs font-bold text-[var(--color-accent)] transition hover:bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface-elevated))] sm:mt-0"
          >
            Contact support →
          </Link>
        </div>

        <p className="mt-5 text-center text-[11px] leading-relaxed text-[var(--color-ink-muted)]">
          Payments are non-refundable; canceling ends future billing. If you
          cancel before your trial ends you will not be charged at all.
          See full{" "}
          <Link href="/legal/terms" prefetch={false} className="underline underline-offset-2">
            Terms of Service
          </Link>{" "}
          for details.
        </p>
      </div>
    </section>
  );
}
