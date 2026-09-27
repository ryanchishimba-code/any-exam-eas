import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { LandingCta } from "@/components/landing/LandingCta";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { LANDING_TRIAL_HREF } from "@/lib/landing/content";
import { ACTIVE_QUESTION_DEFINITION } from "@/lib/inventory/active-questions";
import { COMPANY_PUBLIC, getClinicalReviewLead } from "@/lib/marketing/company";
import {
  formatExactServeReadyQuestions,
  getPublishedQuestionStats,
} from "@/lib/marketing/bank-stats";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { QUALITY_PAGE_UPDATED } from "@/lib/marketing/quality-facts";
import { ROUTES } from "@/lib/routes";
import { examMarketingPath } from "@/lib/seo/exam-config";
import { buildAboutMetadata, buildAboutJsonLd } from "@/lib/seo/marketing-metadata";
import { formatTrialCtaLabel, SITE_NAME } from "@/lib/site";

export const dynamic = "force-dynamic";

async function publishedOrLiveTotalLabel(): Promise<{ label: string; live: boolean }> {
  const { snapshot } = await getCachedBankStatsBundle();
  const display = buildLandingBankCountsDisplay(snapshot);
  if (!display.degraded && display.totalServed > 0) {
    return { label: display.totalQuestionsLabel, live: true };
  }
  return {
    label: formatExactServeReadyQuestions(getPublishedQuestionStats().totalPublished),
    live: false,
  };
}

export async function generateMetadata() {
  const { label } = await publishedOrLiveTotalLabel();
  return buildAboutMetadata(label);
}

const EXAM_HUB_LINKS = [
  { href: examMarketingPath("nclex"), label: "NCLEX" },
  { href: examMarketingPath("usmle"), label: "USMLE" },
  { href: examMarketingPath("naplex"), label: "NAPLEX" },
  { href: examMarketingPath("pance"), label: "PANCE" },
  { href: examMarketingPath("aanp-fnp"), label: "AANP FNP" },
  { href: examMarketingPath("npte-pt"), label: "NPTE-PT" },
] as const;

export default async function AboutPage() {
  const { label: totalQuestionsLabel, live } = await publishedOrLiveTotalLabel();
  const reviewer = getClinicalReviewLead();

  return (
    <>
      <JsonLdScript data={buildAboutJsonLd()} />
      <div className="bg-[var(--color-bg)]">
        <section className="px-6 pb-16 pt-[var(--page-top)] sm:pb-24">
          <div className="mx-auto max-w-3xl text-center">
            <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
              {SITE_NAME}
            </p>
            <h1 className="mt-5 text-balance text-[clamp(2.75rem,7vw,4.5rem)] font-bold leading-[1.02] tracking-tight text-[var(--color-ink)]">
              Practice that tells you why.
            </h1>
            <p className="mx-auto mt-6 max-w-xl text-balance text-lg leading-relaxed text-[var(--color-ink)]">
              {COMPANY_PUBLIC.productName} is one question bank for six boards. You practice,
              read the rationale, and come back to the topics you miss. The mission is a student
              who starts doubtful and walks into the exam knowing what they know.
            </p>
            <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-[var(--color-ink-muted)]">
              Operated by {COMPANY_PUBLIC.legalName}.{" "}
              <a
                href={`mailto:${COMPANY_PUBLIC.supportEmail}`}
                className="font-semibold text-[var(--color-accent)] hover:underline"
              >
                {COMPANY_PUBLIC.supportEmail}
              </a>
            </p>
            <div className="mt-10 flex flex-wrap items-center justify-center gap-4">
              <LandingCta href={LANDING_TRIAL_HREF} icon={<ArrowRight className="h-4 w-4" />}>
                {formatTrialCtaLabel()}
              </LandingCta>
              <Link
                href={ROUTES.howQuestionsAreReviewed}
                className="text-base font-semibold text-[var(--color-accent)] hover:underline"
              >
                How questions are reviewed
              </Link>
            </div>
            <div className="mt-8">
              <PurchaseTrustNotes />
            </div>
            <p className="mt-6 text-sm font-medium text-[var(--color-ink-muted)]">{totalQuestionsLabel}</p>
            <p className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-[var(--color-ink-muted)]">
              {live
                ? ACTIVE_QUESTION_DEFINITION
                : "Live bank count is unavailable, so this figure is the published floor — not the current Qbank total."}
            </p>
          </div>
        </section>

        {reviewer ? (
          <section
            className="border-y border-[var(--color-border)] bg-[var(--color-surface)] px-6 py-14"
            aria-labelledby="clinical-review-lead"
          >
            <div className="mx-auto max-w-3xl">
              <h2
                id="clinical-review-lead"
                className="text-2xl font-bold tracking-tight text-[var(--color-ink)]"
              >
                Clinical review lead
              </h2>
              <p className="mt-3 text-lg font-semibold text-[var(--color-ink)]">{reviewer.name}</p>
              <p className="mt-1 text-base text-[var(--color-ink-muted)]">{reviewer.credential}</p>
            </div>
          </section>
        ) : null}

        <section className="px-6 py-16" aria-labelledby="about-boards-heading">
          <div className="mx-auto max-w-3xl">
            <h2
              id="about-boards-heading"
              className="text-[clamp(2rem,4.5vw,3rem)] font-bold tracking-tight text-[var(--color-ink)]"
            >
              What the product does
            </h2>
            <p className="mt-4 text-lg leading-relaxed text-[var(--color-ink-muted)]">
              One Pro plan covers NCLEX, USMLE Step 1, Step 2 CK, and Step 3, NAPLEX, PANCE, AANP
              FNP, and NPTE-PT. You get a blueprint roadmap, rationales on missed questions, and
              timed practice exams weighted to the official outline. We are not affiliated with
              the boards that write those exams.
            </p>
            <ul className="mt-8 grid gap-3 sm:grid-cols-2" role="list">
              {EXAM_HUB_LINKS.map((exam) => (
                <li key={exam.href}>
                  <Link
                    href={exam.href}
                    className="flex min-h-11 items-center justify-between border-b border-[var(--color-border)] py-3 text-base font-semibold text-[var(--color-ink)] hover:text-[var(--color-accent)]"
                  >
                    {exam.label}
                    <span aria-hidden>→</span>
                  </Link>
                </li>
              ))}
            </ul>
            <p className="mt-8 text-sm text-[var(--color-ink-muted)]">Last updated {QUALITY_PAGE_UPDATED}</p>
          </div>
        </section>
      </div>
    </>
  );
}
