import Link from "next/link";
import {
  ArrowRight,
  BadgeCheck,
  HeartPulse,
  MapPin,
  ShieldCheck,
  Star,
} from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { AboutValueCards } from "@/components/about/AboutValueCards";
import { AboutShowdown } from "@/components/about/AboutShowdown";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatTrialCtaLabel, formatTrialLabel } from "@/lib/site";
import { buildAboutMetadata } from "@/lib/seo/marketing-metadata";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";
import { TOP_500_DRUGS_COUNT } from "@/lib/marketing/bank-stats";

export const revalidate = 3600;

export async function generateMetadata() {
  try {
    const snapshot = await getCachedQuestionBankCounts();
    const display = buildLandingBankCountsDisplay(snapshot);
    if (!snapshot.degraded && display.totalServed > 0) {
      return buildAboutMetadata(display.totalQuestionsLabel);
    }
  } catch {
    /* static fallback */
  }
  return buildAboutMetadata();
}

// Clinician trust pillars.
const TRUST_POINTS = [
  {
    icon: ShieldCheck,
    title: "Written by licensed providers",
    blurb:
      "Real healthcare professionals build and review the content — not anonymous content mills.",
  },
  {
    icon: HeartPulse,
    title: "Frontline-tested rationales",
    blurb:
      "12+ years of combined bedside experience means explanations that actually teach, not just label.",
  },
  {
    icon: BadgeCheck,
    title: "QA-gated, not crowd-sourced",
    blurb:
      "Every item clears a quality gate before it reaches you, so you can trust what you're studying.",
  },
];

export default async function AboutPage() {
  const snapshot = await getCachedQuestionBankCounts();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);

  const heroStats = [
    {
      value: bankCounts.totalLabel,
      label: "Serve-ready questions",
    },
    { value: "6", label: "Boards, one plan" },
    { value: String(TOP_500_DRUGS_COUNT), label: "Top drugs + pearls" },
    { value: "12+ yrs", label: "Clinician experience" },
  ];

  return (
    <div className="bg-[var(--color-bg)]">
      {/* ── 1. Hero ──────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden px-6 pt-[var(--page-top)]">
        <div className="mx-auto max-w-4xl pb-16 text-center sm:pb-20">
          {/* Texas badge */}
          <span className="inline-flex items-center gap-2 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_30%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface-elevated))] px-4 py-1.5 text-sm font-bold text-[var(--color-accent)] shadow-[var(--shadow-apple-sm)]">
            <MapPin className="h-4 w-4" aria-hidden />
            Built in the heart of Texas
          </span>

          <h1 className="mt-6 text-balance text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]">
            Premium board prep,{" "}
            <span className="aee-flagship-gradient-text">finally set free.</span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-balance text-lg leading-relaxed text-[var(--color-ink-muted)]">
            We&apos;re on a mission to liberate premium prep for ambitious students building
            high-paying healthcare careers — serious, clinician-grade preparation that doesn&apos;t
            cost a paycheck. One plan. Six boards. A reference you&apos;ll keep for years.
          </p>

          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LandingCta href={LANDING_TRIAL_HREF} icon={<ArrowRight className="h-4 w-4" />}>
              {formatTrialCtaLabel()}
            </LandingCta>
            <Link
              href={ROUTES.pricing}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-2.5 text-sm font-bold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)]"
            >
              See the pricing →
            </Link>
          </div>

          {/* Stat band */}
          <dl className="mx-auto mt-12 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {heroStats.map((stat) => (
              <div
                key={stat.label}
                className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-3 py-4 shadow-[var(--shadow-apple-sm)]"
              >
                <dt className="sr-only">{stat.label}</dt>
                <dd className="text-2xl font-extrabold tracking-tight text-[var(--color-ink)]">
                  {stat.value}
                </dd>
                <p className="mt-1 text-xs font-medium text-[var(--color-ink-muted)]">
                  {stat.label}
                </p>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ── 2. Mission / Philosophy ─────────────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
        <div className="mx-auto max-w-3xl">
          <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
            Why we built this
          </p>
          <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
            Good prep shouldn&apos;t cost more than your first paycheck.
          </h2>
          <div className="mt-6 space-y-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">
            <p>
              Here&apos;s the deal: the people grinding hardest for these licenses are usually the
              ones with the least to spend. Then they get hit with{" "}
              <strong className="font-semibold text-[var(--color-ink)]">
                $200–400 per exam
              </strong>{" "}
              question banks — buy three or four and you&apos;ve spent more than a month&apos;s rent.
            </p>
            <p>
              We thought that was backwards. So we built one platform that covers{" "}
              <strong className="font-semibold text-[var(--color-ink)]">six major boards</strong> —
              USMLE, NCLEX, NAPLEX, PANCE, AANP FNP &amp; NPTE-PT — with the depth of a premium bank
              and a price that respects where you are in your career.
            </p>
            <p>
              And we didn&apos;t stop at exam day. The{" "}
              <strong className="font-semibold text-[var(--color-ink)]">Top 503 Drugs</strong> and
              clinical pearls are built to stay useful long after you pass — the kind of resource
              you&apos;ll still open on a busy shift years from now.
            </p>
          </div>

          {/* Pull quote */}
          <blockquote className="mt-10 rounded-3xl border-l-4 border-[var(--color-accent)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]">
            <p className="text-xl font-semibold leading-snug tracking-tight text-[var(--color-ink)]">
              &ldquo;Premium board prep. Non-premium price. That&apos;s the whole idea.&rdquo;
            </p>
          </blockquote>
        </div>
      </section>

      {/* ── 3. What makes us different ──────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="max-w-2xl">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              What makes us different
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Built different on purpose.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Four things we refused to compromise on.
            </p>
          </div>
          <div className="mt-10">
            <AboutValueCards />
          </div>
        </div>
      </section>

      {/* ── 4. The Showdown (charts) ────────────────────────────────── */}
      <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              The showdown
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Let&apos;s talk numbers.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[var(--color-ink-muted)]">
              We&apos;re not afraid of a side-by-side. Here&apos;s the honest math.
            </p>
          </div>
          <div className="mt-10">
            <AboutShowdown />
          </div>
        </div>
      </section>

      {/* ── 5. Verdict band ─────────────────────────────────────────── */}
      <section className="px-6 py-20">
        <div className="mx-auto max-w-4xl overflow-hidden rounded-[2rem] bg-[var(--color-accent)] px-8 py-14 text-center shadow-[var(--shadow-apple-lg)]">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/15 px-3.5 py-1.5 text-sm font-bold text-white">
            <Star className="h-4 w-4 fill-current" aria-hidden />
            The verdict
          </span>
          <p className="mx-auto mt-6 max-w-2xl text-balance text-[clamp(1.75rem,4.5vw,2.75rem)] font-extrabold leading-tight tracking-tight text-white">
            AnyExamEasy is the obvious clear winner.
          </p>
          <p className="mx-auto mt-4 max-w-xl text-base font-medium leading-relaxed text-white/90">
            Most coverage, deepest reference, expert curation, smartest price. Not close.
          </p>
          <div className="mt-8 flex justify-center">
            <LandingCta
              href={LANDING_TRIAL_HREF}
              variant="ghost-on-dark"
              icon={<ArrowRight className="h-4 w-4" />}
            >
              {formatTrialCtaLabel()}
            </LandingCta>
          </div>
        </div>
      </section>

      {/* ── 6. Clinician trust ──────────────────────────────────────── */}
      <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-20">
        <div className="mx-auto max-w-5xl">
          <div className="mx-auto max-w-2xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              Who&apos;s behind it
            </p>
            <h2 className="mt-3 text-[clamp(1.75rem,4vw,2.5rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Curated by people who&apos;ve done the job.
            </h2>
            <p className="mt-3 text-lg leading-relaxed text-[var(--color-ink-muted)]">
              <strong className="font-semibold text-[var(--color-ink)]">
                12+ years of combined frontline experience
              </strong>{" "}
              from licensed healthcare providers — baked into every question and rationale.
            </p>
          </div>

          <div className="mt-10 grid gap-5 sm:grid-cols-3">
            {TRUST_POINTS.map((point) => {
              const Icon = point.icon;
              return (
                <div
                  key={point.title}
                  className="rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6 shadow-[var(--shadow-apple-sm)]"
                >
                  <span className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-[var(--color-accent)]/10 text-[var(--color-accent)]">
                    <Icon className="h-5 w-5" aria-hidden />
                  </span>
                  <h3 className="mt-4 text-base font-bold tracking-tight text-[var(--color-ink)]">
                    {point.title}
                  </h3>
                  <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {point.blurb}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── 7. Final CTA ────────────────────────────────────────────── */}
      <section className="px-6 py-24">
        <div className="mx-auto max-w-3xl text-center">
          <h2 className="text-[clamp(2rem,5vw,3rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
            Ready to prep like it&apos;s premium?
          </h2>
          <p className="mx-auto mt-4 max-w-xl text-lg leading-relaxed text-[var(--color-ink-muted)]">
            Start free, no commitment. See why ambitious students are switching to the smarter,
            kinder-on-the-wallet way to prep.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <LandingCta href={LANDING_TRIAL_HREF} icon={<ArrowRight className="h-4 w-4" />}>
              {formatTrialCtaLabel()}
            </LandingCta>
            <Link
              href={ROUTES.pricing}
              className="inline-flex items-center gap-2 rounded-full border border-[var(--color-border)] bg-[var(--color-surface-elevated)] px-5 py-2.5 text-sm font-bold text-[var(--color-ink)] shadow-[var(--shadow-apple-sm)] transition hover:shadow-[var(--shadow-apple-md)]"
            >
              Compare plans →
            </Link>
          </div>
          <p className="mt-4 text-sm font-medium text-[var(--color-ink-muted)]">
            {formatTrialLabel()} · all 6 boards included
          </p>
        </div>
      </section>
    </div>
  );
}
