import Link from "next/link";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { ToolkitBackpackIllustration } from "@/components/toolkit/ToolkitBackpackIllustration";
import { ToolkitExamAccordion } from "@/components/toolkit/ToolkitExamAccordion";
import { ToolkitCrossExamComparison } from "@/components/toolkit/ToolkitCrossExamComparison";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ROUTES } from "@/lib/routes";
import { TOOLKIT_EXAMS } from "@/lib/toolkit/exam-breakdowns";
import { ToolkitStudyGuides } from "@/components/toolkit/ToolkitStudyGuides";
import { buildToolkitHubJsonLd, buildToolkitHubMetadata } from "@/lib/seo/marketing-metadata";

export const revalidate = 86400;

export const metadata = buildToolkitHubMetadata();

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
                Exam prep, organized
              </p>
              <h1 className="apple-display mt-4 text-[clamp(2.5rem,6vw,3.5rem)] leading-[1.05]">
                Toolkit
              </h1>
              <p className="apple-subhead mt-4 text-[clamp(1.125rem,2.5vw,1.375rem)] font-medium text-[var(--color-ink)]">
                Everything you need to pass — packed in one place.
              </p>
              <p className="mt-5 max-w-xl text-base leading-relaxed text-[var(--color-ink-muted)] lg:max-w-none">
                Your complete exam prep toolkit. School notes give you the foundation. AnyExamEasy
                turns that knowledge into confidence with targeted practice and roadmaps. Testing
                tools make sure you&apos;re truly ready on exam day.
              </p>
              <div className="mt-8 flex flex-wrap items-center justify-center gap-3 lg:justify-start">
                <LandingCta href={LANDING_TRIAL_HREF}>Get Started Free</LandingCta>
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

        {/* Three-layer explainer */}
        <section className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14 sm:py-16">
          <div className="mx-auto grid max-w-5xl gap-6 sm:grid-cols-3">
            {[
              {
                title: "Your School Notes",
                body: "Lectures, textbooks, and clinical rotations — the raw knowledge you already have.",
                muted: true,
              },
              {
                title: "AnyExamEasy",
                body: "QA-gated question banks, blueprint roadmaps, and full-length simulations for all six boards.",
                highlight: true,
              },
              {
                title: "Testing & Readiness",
                body: "Timed mocks, analytics, and readiness checks so exam day feels familiar — not frightening.",
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
                <h2
                  className={
                    layer.highlight
                      ? "text-lg font-bold text-[var(--color-accent)]"
                      : "text-lg font-bold text-[var(--color-ink)]"
                  }
                >
                  {layer.title}
                </h2>
                <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">{layer.body}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Exam breakdown */}
        <section className="px-6 py-16 sm:py-24" aria-labelledby="toolkit-exams-heading">
          <div className="mx-auto max-w-3xl text-center">
            <h2
              id="toolkit-exams-heading"
              className="text-3xl font-bold tracking-tight text-[var(--color-ink)] sm:text-4xl"
            >
              Find Out About Each Exam
            </h2>
            <p className="mx-auto mt-4 max-w-2xl text-base leading-relaxed text-[var(--color-ink-muted)]">
              Tap any exam below to expand a quick breakdown — format, scope, and what you need to
              succeed.
            </p>
          </div>
          <div className="mx-auto mt-12 max-w-xl">
            <ToolkitExamAccordion exams={TOOLKIT_EXAMS} />
          </div>
        </section>

        <ToolkitCrossExamComparison />

        <ToolkitStudyGuides />

        {/* Final CTA */}
        <section className="border-t border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-16 sm:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold tracking-tight text-[var(--color-ink)] sm:text-3xl">
              Pack the tool that makes the difference
            </h2>
            <p className="mt-4 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Join students who trust AnyExamEasy for structured, board-caliber prep across six
              licensing exams — one calm, confident toolkit.
            </p>
            <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
              <LandingCta href={LANDING_TRIAL_HREF}>Get Started Free</LandingCta>
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
