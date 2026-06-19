import Link from "next/link";
import {
  BarChart3,
  BookOpen,
  Check,
  ClipboardCheck,
  Crown,
  FileDown,
  Layers,
  Repeat,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import {
  PRO_FEATURE_HIGHLIGHTS,
  PRO_UPGRADE_HEADLINE,
  UNIVERSAL_FEATURES,
  type ProFeatureHighlight,
} from "@/lib/subscription-tiers";
import { cn } from "@/lib/utils";

const ICONS: Record<ProFeatureHighlight["icon"], LucideIcon> = {
  analytics: BarChart3,
  srs: Repeat,
  mock: ClipboardCheck,
  deepdive: Layers,
  notes: FileDown,
  explanations: BookOpen,
  priority: Sparkles,
};

/**
 * Basic vs Pro value story — feature-focused (no prices), driven entirely by the
 * canonical lists in subscription-tiers.ts so copy never drifts. Directive-free
 * so it can render inside both server pages and client landing trees.
 */
export function ProBenefitsComparison({
  ctaHref = "/signup?plan=trial&interval=yearly&tier=pro",
  ctaLabel = "Start free trial with Pro",
  heading = PRO_UPGRADE_HEADLINE,
  className,
}: {
  ctaHref?: string;
  ctaLabel?: string;
  heading?: string;
  className?: string;
}) {
  return (
    <section
      aria-labelledby="pro-benefits-heading"
      className={cn("mx-auto w-full max-w-5xl px-5 sm:px-6", className)}
    >
      <div className="mx-auto max-w-2xl text-center">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-[var(--color-accent)]/10 px-3 py-1 text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          <Crown className="h-3.5 w-3.5" aria-hidden />
          Pro
        </p>
        <h2
          id="pro-benefits-heading"
          className="mt-3 text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
        >
          {heading}
        </h2>
        <p className="mt-3 text-lg text-[var(--color-ink-muted)]">
          Basic gets you a complete, exam-ready question bank. Pro adds the score-accelerating
          tools that top scorers rely on.
        </p>
      </div>

      <div className="mt-10 grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
        {/* Basic column */}
        <div className="flex h-full flex-col rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
          <h3 className="text-base font-bold text-[var(--color-ink)]">Basic</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Everything you need to prepare — all 6 exams, one plan.
          </p>
          <ul className="mt-5 space-y-3">
            {UNIVERSAL_FEATURES.map((item) => (
              <li key={item} className="flex items-start gap-2.5 text-sm text-[var(--color-ink)]">
                <Check className="mt-0.5 h-4 w-4 shrink-0 text-[var(--color-ink-muted)]" aria-hidden />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Pro column — highlighted */}
        <div className="relative flex h-full flex-col overflow-hidden rounded-3xl border-2 border-[var(--color-accent)]/30 bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-md)]">
          <span className="absolute right-5 top-5 inline-flex items-center gap-1 rounded-full bg-[var(--color-accent)] px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
            <Crown className="h-3 w-3" aria-hidden />
            Recommended
          </span>
          <h3 className="text-base font-bold text-[var(--color-ink)]">Pro</h3>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            Everything in Basic, plus the tools that turn practice into points.
          </p>

          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {PRO_FEATURE_HIGHLIGHTS.map((feature) => {
              const Icon = ICONS[feature.icon];
              return (
                <li
                  key={feature.title}
                  className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-3.5"
                >
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[var(--color-accent)]/10">
                    <Icon className="h-4 w-4 text-[var(--color-accent)]" strokeWidth={1.75} aria-hidden />
                  </span>
                  <p className="mt-2.5 text-sm font-bold text-[var(--color-ink)]">{feature.title}</p>
                  <p className="mt-1 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                    {feature.blurb}
                  </p>
                </li>
              );
            })}
          </ul>

          <Link
            href={ctaHref}
            className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-[var(--color-accent)] px-6 py-3 text-sm font-bold text-white shadow-[var(--shadow-apple-btn)] transition hover:shadow-[var(--shadow-apple-btn-hover)] hover:brightness-105"
          >
            {ctaLabel}
            <Crown className="h-4 w-4" aria-hidden />
          </Link>
        </div>
      </div>
    </section>
  );
}
