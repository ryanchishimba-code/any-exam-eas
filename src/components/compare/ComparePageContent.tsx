import Link from "next/link";
import { ArrowRight, Check, Minus } from "lucide-react";
import {
  AEE_MONTHLY,
  AEE_YEARLY,
  COMPETITOR_PROFILES,
  EXAM_ONE_PAGER_LINKS,
  MASTER_FEATURE_ROWS,
  UWORLD_THREE_EXAM_MIN,
  formatUsd,
  threeExamSavingsPercent,
} from "@/lib/seo/competitor-comparison";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { formatMonthlyPrice, formatTrialCtaLabel, formatTrialLabel } from "@/lib/site";

function ComparisonTable({
  rows,
  competitorHeader,
}: {
  rows: { feature: string; anyExamEasy: string; competitor: string }[];
  competitorHeader: string;
}) {
  return (
    <div className="overflow-x-auto rounded-2xl border border-[var(--color-border)]">
      <table className="w-full min-w-[520px] text-left text-sm">
        <thead>
          <tr className="border-b border-[var(--color-border)] bg-[var(--color-surface)]">
            <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink)]">
              Feature
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-teal-700 dark:text-teal-300">
              AnyExamEasy
            </th>
            <th scope="col" className="px-4 py-3 font-semibold text-[var(--color-ink-muted)]">
              {competitorHeader}
            </th>
          </tr>
        </thead>
        <tbody>
          {rows.map((row) => (
            <tr key={row.feature} className="border-b border-[var(--color-border)] last:border-0">
              <th scope="row" className="px-4 py-3 font-medium text-[var(--color-ink)]">
                {row.feature}
              </th>
              <td className="px-4 py-3 text-[var(--color-ink)]">{row.anyExamEasy}</td>
              <td className="px-4 py-3 text-[var(--color-ink-muted)]">{row.competitor}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function ComparePageContent() {
  const savings = threeExamSavingsPercent();

  return (
    <div className="mx-auto max-w-4xl px-5 pb-20 pt-[var(--page-top)] sm:px-6">
      <nav className="text-sm text-[var(--color-ink-muted)]">
        <Link href="/" className="hover:text-[var(--color-accent)]">
          Home
        </Link>
        <span className="mx-2 opacity-40">/</span>
        <span>Compare</span>
      </nav>

      <header className="mt-6 max-w-3xl">
        <p className="text-xs font-semibold uppercase tracking-wide text-[var(--color-accent)]">
          Competitor comparison · 2026
        </p>
        <h1 className="mt-2 text-3xl font-extrabold tracking-tight text-[var(--color-ink)] sm:text-4xl">
          AnyExamEasy vs UWorld, Archer, Kaplan &amp; RxPrep
        </h1>
        <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
          One Pro plan covers NCLEX, USMLE, NAPLEX, PANCE, FNP, and NPTE — with Blueprint Roadmaps,
          Deep Dive modules, and Full Exam simulations. See how we compare on price, features, and
          multi-exam value.
        </p>
      </header>

      <section className="mt-10 grid gap-4 sm:grid-cols-3" aria-label="Pricing highlights">
        <div className="rounded-2xl border-2 border-teal-500/40 bg-teal-50/30 p-5 dark:border-teal-400/30 dark:bg-teal-950/20">
          <p className="text-xs font-bold uppercase tracking-wide text-teal-700 dark:text-teal-300">
            AnyExamEasy Pro
          </p>
          <p className="mt-2 text-3xl font-black text-[var(--color-ink)]">
            {formatMonthlyPrice("pro")}
            <span className="text-base font-semibold text-[var(--color-ink-muted)]">/mo</span>
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            {formatUsd(AEE_YEARLY)}/yr · all 6 exams
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            UWorld 3-exam minimum
          </p>
          <p className="mt-2 text-3xl font-black text-[var(--color-ink-muted)]">
            {formatUsd(UWORLD_THREE_EXAM_MIN)}
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            NCLEX + Step 2 CK + NAPLEX QBank (shortest tiers)
          </p>
        </div>
        <div className="rounded-2xl border border-[var(--color-border)] p-5">
          <p className="text-xs font-bold uppercase tracking-wide text-[var(--color-ink-muted)]">
            Multi-exam savings
          </p>
          <p className="mt-2 text-3xl font-black text-emerald-600 dark:text-emerald-400">
            ~{savings}%
          </p>
          <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
            vs UWorld stack over 3 months ({formatUsd(AEE_MONTHLY * 3)} vs{" "}
            {formatUsd(UWORLD_THREE_EXAM_MIN)})
          </p>
        </div>
      </section>

      <section className="mt-12" aria-labelledby="feature-matrix-heading">
        <h2 id="feature-matrix-heading" className="text-xl font-bold text-[var(--color-ink)]">
          Feature comparison
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          AnyExamEasy vs typical per-exam competitors · Public pricing Jul 2026
        </p>
        <div className="mt-5">
          <ComparisonTable rows={MASTER_FEATURE_ROWS} competitorHeader="Typical competitor" />
        </div>
      </section>

      <section className="mt-12" aria-labelledby="competitors-heading">
        <h2 id="competitors-heading" className="text-xl font-bold text-[var(--color-ink)]">
          Competitor profiles
        </h2>
        <div className="mt-5 grid gap-4 sm:grid-cols-2">
          {COMPETITOR_PROFILES.map((profile) => (
            <article
              key={profile.id}
              className="rounded-2xl border border-[var(--color-border)] p-5"
            >
              <h3 className="text-lg font-bold text-[var(--color-ink)]">{profile.name}</h3>
              <p className="mt-1 text-sm font-medium text-[var(--color-accent)]">
                {profile.tagline}
              </p>
              <p className="mt-2 text-xs text-[var(--color-ink-muted)]">{profile.pricingNote}</p>
              <ul className="mt-4 space-y-2" role="list">
                {profile.strengths.map((item) => (
                  <li key={item} className="flex gap-2 text-sm text-[var(--color-ink-muted)]">
                    <Check
                      className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600 dark:text-emerald-400"
                      aria-hidden
                    />
                    {item}
                  </li>
                ))}
              </ul>
              <p className="mt-4 text-xs leading-relaxed text-[var(--color-ink-muted)]">
                <span className="font-semibold text-[var(--color-ink)]">Best for: </span>
                {profile.bestFor}
              </p>
            </article>
          ))}
        </div>
      </section>

      <section className="mt-12" aria-labelledby="one-pagers-heading">
        <h2 id="one-pagers-heading" className="text-xl font-bold text-[var(--color-ink)]">
          Exam-specific comparisons
        </h2>
        <p className="mt-2 text-sm text-[var(--color-ink-muted)]">
          Deep dives for NCLEX, NAPLEX, and multi-exam value
        </p>
        <ul className="mt-5 grid gap-3 sm:grid-cols-2" role="list">
          {EXAM_ONE_PAGER_LINKS.map((link) => (
            <li key={link.slug}>
              <Link
                href={`/resources/${link.slug}`}
                className="group flex items-center justify-between rounded-xl border border-[var(--color-border)] px-4 py-3 text-sm font-medium text-[var(--color-ink)] transition hover:border-[var(--color-accent)] hover:text-[var(--color-accent)]"
              >
                <span>
                  <span className="block text-[0.65rem] font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
                    {link.exam}
                  </span>
                  {link.title}
                </span>
                <ArrowRight
                  className="h-4 w-4 shrink-0 transition-transform group-hover:translate-x-0.5"
                  aria-hidden
                />
              </Link>
            </li>
          ))}
        </ul>
      </section>

      <section
        className="mt-12 rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] p-6 sm:p-8"
        aria-labelledby="when-aee-heading"
      >
        <h2 id="when-aee-heading" className="text-xl font-bold text-[var(--color-ink)]">
          When AnyExamEasy is the better fit
        </h2>
        <ul className="mt-4 space-y-3" role="list">
          {[
            "You need more than one board exam on the same timeline (RN + NP, PharmD + side cert, Step 1 + Step 2).",
            "You want Blueprint Roadmaps, Deep Dives, and Full Exams — not QBank-only prep.",
            `${formatTrialLabel()} with ${SEO_LIVE_STATS.moneyBackDays}-day money-back reduces risk vs paid-upfront bundles.`,
            `${SEO_LIVE_STATS.questionCount}+ questions across six exams beats stacking separate subscriptions.`,
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              <Check
                className="mt-0.5 h-4 w-4 shrink-0 text-teal-600 dark:text-teal-400"
                aria-hidden
              />
              {item}
            </li>
          ))}
        </ul>
        <ul className="mt-6 space-y-3 border-t border-[var(--color-border)] pt-6" role="list">
          <li className="text-xs font-semibold uppercase tracking-wide text-[var(--color-ink-muted)]">
            When a competitor may win
          </li>
          {[
            "NCLEX-only with unlimited budget for UWorld depth and NGN CAT fidelity.",
            "Pharmacy students who want RxPrep video course + established NAPLEX brand at any price.",
            "Students who need live Kaplan classes and a pass guarantee on a full course.",
          ].map((item) => (
            <li key={item} className="flex gap-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              <Minus className="mt-0.5 h-4 w-4 shrink-0" aria-hidden />
              {item}
            </li>
          ))}
        </ul>
      </section>

      <div className="mt-10 flex flex-col items-center gap-3 text-center">
        <Link
          href={LANDING_TRIAL_HREF}
          className="aee-flagship-cta aee-flagship-cta--primary group inline-flex items-center justify-center"
        >
          {formatTrialCtaLabel()}
          <ArrowRight
            className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5"
            aria-hidden
          />
        </Link>
        <p className="max-w-md text-xs text-[var(--color-ink-muted)]">
          Competitor pricing from public listings ({new Date().getFullYear()}); may vary. Not
          affiliated with UWorld, Archer Review, Kaplan, AMBOSS, or RxPrep.
        </p>
      </div>
    </div>
  );
}
