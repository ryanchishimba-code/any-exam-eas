"use client";

import Link from "next/link";
import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { landingTrialHrefForExam } from "@/lib/landing/content";
import { formatTrialCtaLabel, formatTrialLabel, formatMonthlyPrice } from "@/lib/site";
import { cn } from "@/lib/utils";

type Props = {
  examSlug?: string;
  className?: string;
  compact?: boolean;
};

export function GuestTrialBanner({ examSlug, className, compact = false }: Props) {
  const href = landingTrialHrefForExam(examSlug);

  return (
    <aside
      className={cn(
        "rounded-2xl border border-[color-mix(in_srgb,var(--color-accent)_35%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_8%,var(--color-surface))]",
        compact ? "px-4 py-3" : "px-5 py-4",
        className
      )}
    >
      <p className="text-sm font-semibold text-[var(--color-ink)]">
        Want bookmarks + {TRIAL_LIFETIME_QUESTIONS}-question free trial?
      </p>
      {!compact ? (
        <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          {formatTrialLabel()} · no card · {formatMonthlyPrice("pro")}/mo after. Save highlights,
          notes, and progress when you start.
        </p>
      ) : null}
      <Link
        href={href}
        className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--color-accent)] hover:underline"
      >
        {formatTrialCtaLabel()} →
      </Link>
    </aside>
  );
}
