import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { LandingCta } from "@/components/landing/LandingCta";
import { ToolkitBackpackIllustration } from "@/components/toolkit/ToolkitBackpackIllustration";
import { ToolkitExamAccordion } from "@/components/toolkit/ToolkitExamAccordion";
import { ToolkitCrossExamComparison } from "@/components/toolkit/ToolkitCrossExamComparison";
import { LANDING_TRIAL_HREF, PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { formatMonthlyPrice, formatTrialCtaLabel, SITE_NAME } from "@/lib/site";
import { ROUTES } from "@/lib/routes";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { SEO_LIVE_STATS } from "@/lib/seo/seo-copy";
import { TOOLKIT_EXAMS } from "@/lib/toolkit/exam-breakdowns";
import { ToolkitStudyGuides } from "@/components/toolkit/ToolkitStudyGuides";
import { ToolkitNclexMasterySection } from "@/components/toolkit/ToolkitNclexMasterySection";
import { ToolkitNaplexMasterySection } from "@/components/toolkit/ToolkitNaplexMasterySection";
import { buildToolkitHubJsonLd, buildToolkitHubMetadata } from "@/lib/seo/marketing-metadata";

export const revalidate = 86400;

export const metadata = buildToolkitHubMetadata();

const RESOURCE_LINKS = [
  {
    href: examMarketingPath("nclex"),
    title: "NCLEX question bank",
    body: "NGN-ready practice with Blueprint Roadmaps, Deep Dives from misses, and Full Exam pacing.",
  },
  {
    href: examMarketingPath("usmle"),
    title: "USMLE question bank",
    body: "Step 1, Step 2 CK, and Step 3 vignettes — Roadmaps and Full Exam sims on one track.",
  },
  {
    href: ROUTES.compare,
    title: "Compare vs stacking QBanks",
    body: "See how Roadmaps + Deep Dives + Full Exams stack up against per-exam banks.",
  },
  {
    href: ROUTES.pricing,
    title: "One plan pricing",
    body: `One Pro subscription from ${formatMonthlyPrice("pro")}/mo unlocks all six banks and the full study system.`,
  },
] as const;

export default function ToolkitPage() {
  return (
    <>
      <JsonLdScript data={buildToolkitHubJsonLd()} />
      <div className="min-h-screen bg-[var(--color-bg)]">
        {/* Hero */}
        <section className="relative overflow-hidden px-6 pt-[var(--page-top)]">
          <div
            className="pointer-events-none absolute inset-x-0 top-0 h-[520px] bg-[radial-gradient(ellipse_80%_60%_at_50%_-10%,color-mix(in_srgb,var(--color-accent)_14%,transparent),transparent)]"
            aria-hidden
          />
          <div className="relative mx-auto grid max-w-6xl items-center gap-12 pb-20 lg:grid-cols-2 lg:gap-16 lg:pb-28">
            <div className="text-center lg:text-left">
              <p className="text-xs font-bold uppercase tracking-[0.2em] text-[var(--color-accent)]">
                {SITE_NAME} Toolkit
              </p>
              <h1 className="apple-display mt-4 text-[clamp(2.25rem,5.5vw,3.5rem)] leading-[1.05]">
                NCLEX &amp; USMLE study system: Roadmaps, Deep Dives &amp; Full Exams
              </h1>
              <p className="apple-subhead mt-4 text-[clamp(1.125rem,2.5vw,1.375rem)] font-medium text-[var(--color-ink)]">
                Free exam breakdowns and readiness guides — built around one affordable six-board
                plan.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)] lg:max-w-none">
                School notes give you the foundation. {SITE_NAME} turns that into exam-day confidence
                with a clinician-built{" "}
                <strong className="font-semibold text-[var(--color-ink)]">NCLEX question bank</strong>,
                a full{" "}
                <strong className="font-semibold text-[var(--color-ink)]">USMLE question bank</strong>,
                and matching depth for NAPLEX, PANCE, AANP FNP, and NPTE-PT —{" "}
                {SEO_LIVE_STATS.questionCount} QA-gated items with Blueprint Roadmaps, Deep Dives,
                and Full Exam simulations on one subscription.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <LandingCta href={LANDING_TRIAL_HREF}>{formatTrialCtaLabel()}</LandingCta>
                <LandingCta href={ROUTES.auth.login} variant="secondary">
                  Log in
                </LandingCta>
              </div>
            </div>
            <div className="relative">
              <ToolkitBackpackIllustration />
            </div>
          </div>
        </section>

        {/* How the Toolkit fits */}
        <section
          className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 sm:py-16"
          aria-labelledby="toolkit-layers-heading"
        >
          <div className="mx-auto max-w-5xl">
            <h2
              id="toolkit-layers-heading"
              className="text-center text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl"
            >
              The study loop: Roadmap → Deep Dive → Full Exam
            </h2>
            <p className="mx-auto mt-3 max-w-2xl text-center text-base leading-relaxed text-[var(--color-ink-muted)]">
              Strategy first, then deliberate practice across {PLATFORM_EXAM_LIST} — without buying a
              separate bank for each board.
            </p>
            <div className="mt-10 grid gap-6 sm:grid-cols-3">
              {[
                {
                  title: "Blueprint Roadmaps",
                  body: "See which blueprint domains lag — then practice the gaps that actually move your score.",
                  muted: true,
                },
                {
                  title: "Deep Dive review",
                  body: "Miss a vignette? Open a structured Deep Dive module — teaching that sticks, not a one-line rationale.",
                  highlight: true,
                },
                {
                  title: "Full Exam simulations",
                  body: "Timed Full Exam blocks with weak-area focus so board day pacing feels familiar — not frightening.",
                  muted: true,
                },
              ].map((layer) => (
                <div
                  key={layer.title}
                  className={
                    layer.highlight
                      ? "rounded-3xl border-2 border-[var(--color-accent)] bg-[color-mix(in_srgb,var(--color-accent)_10%,var(--color-surface-elevated))] p-6 shadow-[0_0_32px_color-mix(in_srgb,var(--color-accent)_18%,transparent)]"
                      : "rounded-3xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-6"
                  }
                >
                  <h3
                    className={
                      layer.highlight
                        ? "text-lg font-bold text-[var(--color-accent)]"
                        : "text-lg font-bold text-[var(--color-ink)]"
                    }
                  >
                    {layer.title}
                  </h3>
                  <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                    {layer.body}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Exam breakdown */}
        <section className="px-6 py-16 sm:py-24" aria-labelledby="toolkit-exams-heading">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="toolkit-exams-heading"
              className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
            >
              Find out about each exam
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              Tap any exam below to expand a quick breakdown — format, scope, and what you need to
              succeed. Then open the matching prep page for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, or
              NPTE-PT practice.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-xl">
            <ToolkitExamAccordion exams={TOOLKIT_EXAMS} />
          </div>
        </section>

        <ToolkitCrossExamComparison />

        {/* Internal resource hub */}
        <section
          className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 sm:py-20"
          aria-labelledby="toolkit-resources-heading"
        >
          <div className="mx-auto max-w-3xl">
            <h2
              id="toolkit-resources-heading"
              className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
            >
              More ways to prep smarter
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Pair these free Toolkit guides with live practice. Explore exam hubs, the{" "}
              <Link href={ROUTES.blog} className="font-semibold text-[var(--color-accent)] hover:underline">
                blog
              </Link>
              , and{" "}
              <Link href={ROUTES.about} className="font-semibold text-[var(--color-accent)] hover:underline">
                why we built one multi-exam plan
              </Link>
              .
            </p>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2">
              {RESOURCE_LINKS.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="block h-full rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface-elevated)] p-5 shadow-[var(--shadow-apple-sm)] transition hover:border-[var(--color-accent)]/40"
                  >
                    <span className="text-base font-bold text-[var(--color-ink)]">{item.title}</span>
                    <span className="mt-2 block text-sm leading-relaxed text-[var(--color-ink-muted)]">
                      {item.body}
                    </span>
                    <span className="mt-3 inline-block text-sm font-semibold text-[var(--color-accent)]">
                      Open →
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </section>

        <ToolkitNclexMasterySection />
        <ToolkitNaplexMasterySection />

        <ToolkitStudyGuides />

        {/* Final CTA */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Put the Roadmap → Deep Dive → Full Exam loop to work
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Join students who trust {SITE_NAME} for structured, board-caliber prep across six
              licensing exams — one study system and one affordable Pro subscription.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LandingCta href={LANDING_TRIAL_HREF}>{formatTrialCtaLabel()}</LandingCta>
              <Link
                href={ROUTES.pricing}
                className="text-sm font-semibold text-[var(--color-accent)] hover:underline"
              >
                View pricing →
              </Link>
            </div>
          </div>
        </section>
      </div>
    </>
  );
}
