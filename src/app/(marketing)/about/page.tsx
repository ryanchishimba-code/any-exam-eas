import Link from "next/link";
import { ArrowRight, MapPin } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { formatMonthlyPrice, formatTrialCtaLabel, formatTrialLabel, SITE_NAME } from "@/lib/site";
import { buildAboutMetadata, buildAboutJsonLd } from "@/lib/seo/marketing-metadata";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";

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

const EXAM_HUB_LINKS = [
  { href: examMarketingPath("usmle"), label: "USMLE" },
  { href: examMarketingPath("nclex"), label: "NCLEX" },
  { href: examMarketingPath("naplex"), label: "NAPLEX" },
  { href: examMarketingPath("pance"), label: "PANCE" },
  { href: examMarketingPath("aanp-fnp"), label: "AANP FNP" },
  { href: examMarketingPath("npte-pt"), label: "NPTE-PT" },
] as const;

const HOW_A_QUESTION_SHIPS = [
  {
    step: "1",
    title: "Written to the blueprint",
    body: "Items map to official outlines and high-yield domains — not random filler.",
  },
  {
    step: "2",
    title: "QA gate",
    body: "Serve-ready only after editorial review. Soft stems stay off the bank.",
  },
  {
    step: "3",
    title: "Deep Dive on the miss",
    body: "Wrong answers open structured teaching — then you return to practice.",
  },
] as const;

const OFFICIAL_PREP_DOCS = [
  {
    label: "NCLEX 2026 RN Test Plan (PDF)",
    href: "https://www.ncsbn.org/public-files/2026_RN_Test-Plan_English-F.pdf",
  },
  {
    label: "NCSBN exam test plans hub",
    href: "https://www.ncsbn.org/exams/testplans.page",
  },
  {
    label: "NAPLEX 2025 Content Outline (PDF)",
    href: "https://nabp.pharmacy/wp-content/uploads/NAPLEX-Content-Outline.pdf",
  },
] as const;

export default async function AboutPage() {
  const snapshot = await getCachedQuestionBankCounts();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);

  return (
    <>
      <JsonLdScript data={buildAboutJsonLd()} />
      <div className="bg-[var(--color-bg)]">
        {/* 1. Hero */}
        <section className="relative overflow-hidden px-6 pt-[var(--page-top)] pb-16 sm:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {SITE_NAME}
            </p>

            <h1 className="mt-5 text-balance text-[clamp(2.75rem,7vw,5rem)] font-bold leading-[1.02] tracking-tight text-[var(--color-ink)]">
              Six boards. One standard of question.
            </h1>

            <p className="mx-auto mt-6 max-w-xl text-balance text-[clamp(1.125rem,2.2vw,1.375rem)] leading-relaxed text-[var(--color-ink)]">
              Clinician-built banks. Same QA gate. One Pro plan — not six logins.
            </p>
            <p className="mx-auto mt-4 inline-flex items-center gap-2 text-sm font-medium text-[var(--color-ink-muted)]">
              <MapPin className="h-4 w-4 text-[var(--color-accent)]" aria-hidden />
              Built in Texas · {SEO_LIVE_STATS.clinicianYears} years combined clinical experience
            </p>

            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <LandingCta href={LANDING_TRIAL_HREF} icon={<ArrowRight className="h-4 w-4" />}>
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link
                href={ROUTES.pricing}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                See pricing →
              </Link>
            </div>

            <p className="mt-8 text-sm font-medium text-[var(--color-ink-muted)]">
              {bankCounts.totalQuestionsLabel} · from {formatMonthlyPrice("pro")}/mo after trial
            </p>
          </div>
        </section>

        {/* 2. How a question ships */}
        <section
          className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-[var(--landing-section-py,4rem)]"
          aria-labelledby="about-ships-heading"
        >
          <div className="mx-auto max-w-5xl">
            <h2
              id="about-ships-heading"
              className="max-w-2xl text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]"
            >
              Blueprint → QA gate → Deep Dive.
            </h2>
            <ol className="mt-12 grid gap-8 sm:grid-cols-3">
              {HOW_A_QUESTION_SHIPS.map((item) => (
                <li key={item.step}>
                  <p className="text-sm font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                    {item.step}
                  </p>
                  <h3 className="mt-3 text-xl font-bold tracking-tight text-[var(--color-ink)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-base leading-relaxed text-[var(--color-ink-muted)]">
                    {item.body}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </section>

        {/* 3. Official docs + trust */}
        <section
          className="px-6 py-[var(--landing-section-py,4rem)]"
          aria-labelledby="about-docs-heading"
        >
          <div className="mx-auto max-w-3xl">
            <h2
              id="about-docs-heading"
              className="text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]"
            >
              Read the board&apos;s document. We do not replace it.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Licensed clinicians write and review every item. Official outlines govern the sitting —
              we prepare you for them.
            </p>
            <ul className="mt-10 space-y-4" role="list">
              {OFFICIAL_PREP_DOCS.map((doc) => (
                <li key={doc.href}>
                  <a
                    href={doc.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center justify-between border-b border-[var(--color-border)] py-3 text-base font-semibold text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                  >
                    {doc.label}
                    <span aria-hidden>↗</span>
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              More official links live in the{" "}
              <Link href={ROUTES.toolkit} className="font-semibold text-[var(--color-accent)] hover:underline">
                Toolkit
              </Link>
              .
            </p>
          </div>
        </section>

        {/* 4. Six boards + value */}
        <section
          className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-[var(--landing-section-py,4rem)]"
          aria-labelledby="about-boards-heading"
        >
          <div className="mx-auto max-w-3xl">
            <h2
              id="about-boards-heading"
              className="text-[clamp(2rem,4.5vw,3rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]"
            >
              Six boards. One study system.
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink)]">
              From {formatMonthlyPrice("pro")}/mo after a free trial — Roadmaps, Deep Dives, and Full
              Exams included. Stacking per-exam banks costs more; see{" "}
              <Link href={ROUTES.compare} className="font-semibold text-[var(--color-accent)] hover:underline">
                compare
              </Link>{" "}
              and{" "}
              <Link href={ROUTES.pricing} className="font-semibold text-[var(--color-accent)] hover:underline">
                pricing
              </Link>
              .
            </p>
            <ul className="mt-10 grid gap-3 sm:grid-cols-2" role="list">
              {EXAM_HUB_LINKS.map((exam) => (
                <li key={exam.href}>
                  <Link
                    href={exam.href}
                    className="flex items-center justify-between border-b border-[var(--color-border)] py-3 text-base font-semibold text-[var(--color-ink)] transition hover:text-[var(--color-accent)]"
                  >
                    {exam.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        {/* 5. Final CTA */}
        <section className="px-6 py-20 sm:py-28">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-[clamp(2rem,5vw,3.25rem)] font-bold leading-tight tracking-tight text-[var(--color-ink)]">
              Start free. Upgrade once.
            </h2>
            <p className="mx-auto mt-4 max-w-md text-lg leading-relaxed text-[var(--color-ink-muted)]">
              Try a set on any board, then unlock all six when you are ready.
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <LandingCta href={LANDING_TRIAL_HREF} icon={<ArrowRight className="h-4 w-4" />}>
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link
                href={ROUTES.pricing}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                Compare plans →
              </Link>
            </div>
            <p className="mt-4 text-sm font-medium text-[var(--color-ink-muted)]">
              {formatTrialLabel()} · all 6 boards included
            </p>
          </div>
        </section>

        <section className="border-t border-[var(--color-border)] px-6 py-10">
          <p className="mx-auto max-w-2xl text-center text-sm leading-relaxed text-[var(--color-ink-muted)]">
            Any Exam Easy is independent and not affiliated with NCSBN, NABP, NBME, NCCPA, AANP,
            FSBPT, UWorld, or RxPrep. Exam names are trademarks of their owners. We do not guarantee
            exam results, licensure, or employment.
          </p>
        </section>
      </div>
    </>
  );
}
