"use client";

import Link from "next/link";
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
      <p className="text-sm font-semibold tracking-[-0.015em] text-[var(--color-ink)]">
        {formatTrialLabel()} — no payment method
      </p>
      <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">
        Then Pro at {formatMonthlyPrice("pro")}/mo.
      </p>
      <Link
        href={href}
        className="mt-3 inline-flex items-center text-sm font-semibold text-[var(--color-accent)] hover:underline"
      >
        {formatTrialCtaLabel()} →
      </Link>
    </aside>
  );
}
