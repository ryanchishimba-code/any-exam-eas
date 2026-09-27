import type { Metadata } from "next";
import Link from "next/link";
import { SupportPhoneLink } from "@/components/contact/SupportPhoneLink";
import { ClinicalReviewers } from "@/components/marketing/ClinicalReviewers";
import { FinalMarketingCta } from "@/components/marketing/elevation/MarketingSections";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { LEGAL_ENTITY } from "@/lib/legal";
import { buildClinicalReviewerJsonLd } from "@/lib/marketing/company";
import { ROUTES } from "@/lib/routes";
import {
  OFFICIAL_TEST_PLANS,
  NGN_PUBLISHED_DESCRIPTION,
  QUALITY_PAGE_UPDATED,
  getQualityFacts,
} from "@/lib/marketing/quality-facts";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { ACTIVE_QUESTION_DEFINITION } from "@/lib/inventory/active-questions";
import { AI_ASSISTED_REVIEW_NOTE } from "@/lib/marketing/legal-copy";

export const dynamic = "force-dynamic";

const TITLE = "How our questions are built and reviewed";
const DESCRIPTION =
  "How AnyExamEasy sources questions to official test plans, hides flawed items, cites rationales, and handles student reports.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} — Any Exam Easy` },
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.howQuestionsAreReviewed },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
};

function countLabel(value: number | null): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return value.toLocaleString("en-US");
}

export default async function HowQuestionsAreReviewedPage() {
  const [facts, bank] = await Promise.all([getQualityFacts(), getCachedBankStatsBundle()]);
  const counts = buildLandingBankCountsDisplay(bank.snapshot);
  const suppressed = countLabel(facts.suppressedNursing);
  const nclexUnits = bank.snapshot.boards?.nclex;
  const ngnSentence =
    nclexUnits && (nclexUnits.standaloneNgn > 0 || nclexUnits.caseStudies > 0)
      ? `${nclexUnits.standaloneNgn.toLocaleString("en-US")} standalone NGN items and ${nclexUnits.caseItems.toLocaleString("en-US")} items in ${nclexUnits.caseStudies.toLocaleString("en-US")} case studies are published.`
      : null;
  return (
    <>
    <article className="bg-[var(--color-bg)] px-6 pb-20 pt-[var(--page-top)]">
      <JsonLdScript data={buildClinicalReviewerJsonLd()} />
      <div className="mx-auto max-w-3xl">
        <p className="text-xs font-bold uppercase tracking-[0.16em] text-[var(--color-accent)]">
          Editorial standards
        </p>
        <h1 className="mt-4 text-[clamp(2.25rem,6vw,3.5rem)] font-bold leading-[1.05] tracking-tight text-[var(--color-ink)]">
          How our questions are built and reviewed
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-[var(--color-ink-muted)]">
          AnyExamEasy is a study tool. It is not an official exam, and it does not guarantee a
          score, a license, or a job. This page is the quality bar we actually run.
        </p>
        <p className="mt-3 text-sm text-[var(--color-ink-muted)]">Last updated {QUALITY_PAGE_UPDATED}</p>

        <section className="mt-12" aria-labelledby="plans-heading">
          <h2 id="plans-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Official test plans
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            Practice exams are composed against the published outlines below. Those organizations
            do not write, review, or endorse our items. Read their documents before test day.
          </p>
          <ul className="mt-6 divide-y divide-[var(--color-border)] border-y border-[var(--color-border)]">
            {OFFICIAL_TEST_PLANS.map((plan) => (
              <li key={plan.href} className="py-4">
                <p className="text-sm font-semibold text-[var(--color-ink)]">{plan.board}</p>
                <p className="mt-1 text-sm leading-relaxed text-[var(--color-ink-muted)]">{plan.detail}</p>
                <a
                  href={plan.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 inline-flex min-h-11 items-center text-sm font-semibold text-[var(--color-accent)] hover:underline"
                >
                  Official source
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-12" aria-labelledby="weights-heading">
          <h2 id="weights-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Content weights
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            Timed practice forms pull student-eligible items into the official category weights:
            NCSBN Client Needs for NCLEX-RN, NABP domain weights for NAPLEX, NBME and FSMB
            organ-system ranges for USMLE, AANPCB domain and age-group weights for AANP FNP, the
            NCCPA blueprint for PANCE, and the FSBPT outline for NPTE-PT. A form that cannot fill
            those weights is not padded with a made-up mix.
          </p>
          {!counts.degraded && counts.totalServed > 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {counts.totalQuestionsLabel} are student-eligible right now. {ACTIVE_QUESTION_DEFINITION}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              The live bank count is unavailable on this load, so this page does not print a
              substitute number.
            </p>
          )}
        </section>

        <section className="mt-12" aria-labelledby="gate-heading">
          <h2 id="gate-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            The quality gate
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            A question reaches a student session only when it is active, marked qa-passed, and
            still student-eligible. Items that fail a structural check — a bad key, a broken
            format, or an editorial retire — are flagged and hidden. Hiding does not delete the
            stem, the options, the key, or the rationale. A later repair can restore the same row.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            {AI_ASSISTED_REVIEW_NOTE}
          </p>
          {facts.live && suppressed ? (
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              {suppressed} NCLEX questions are currently suppressed and stay out of student
              practice until that repair. The count is read from the bank on this page load.
            </p>
          ) : null}
          {ngnSentence ? (
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Separately, {ngnSentence} {NGN_PUBLISHED_DESCRIPTION}
            </p>
          ) : (
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              NGN case items live in their own tables. {NGN_PUBLISHED_DESCRIPTION}
            </p>
          )}
        </section>

        <div className="mt-12">
          <ClinicalReviewers headingId="standards-clinical-reviewers" />
        </div>

        <section className="mt-12" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Rationales and sources
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            When an item stores references — a test plan, an open textbook, or a standard society
            source — that citation is shown with the rationale. If an item has no stored source, we
            do not invent one for the screen. Blog posts that discuss a board link the official
            outline they are describing.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="report-heading">
          <h2 id="report-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Report an issue
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            Every rationale has a Report an issue control. The report is saved for review with the
            question, the answer you selected, and a short reason.             You can also write{" "}
            <a
              className="font-semibold text-[var(--color-accent)] hover:underline"
              href={`mailto:${LEGAL_ENTITY.supportEmail}?subject=${encodeURIComponent("Question issue")}`}
            >
              {LEGAL_ENTITY.supportEmail}
            </a>{" "}
            or call <SupportPhoneLink className="font-semibold text-[var(--color-accent)] hover:underline" />
            .
          </p>
        </section>

        <section className="mt-12" aria-labelledby="corrections-heading">
          <h2 id="corrections-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Corrections
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            A confirmed flaw is corrected on the row or suppressed until it is safe to serve again.
            We do not silently delete the original item to make a report disappear. We do not
            promise a reply window we cannot keep. A content fix is not an automatic refund. Billing
            rules are on the{" "}
            <Link href="/legal/refunds" className="font-semibold text-[var(--color-accent)] hover:underline">
              refunds and cancellation
            </Link>{" "}
            page.
          </p>
        </section>

        <p className="mt-14 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          <Link href={ROUTES.pricing} className="font-semibold text-[var(--color-accent)] hover:underline">
            Pricing
          </Link>
          <span aria-hidden> · </span>
          <Link href={ROUTES.about} className="font-semibold text-[var(--color-accent)] hover:underline">
            About
          </Link>
          <span aria-hidden> · </span>
          <Link href="/#try-questions" className="font-semibold text-[var(--color-accent)] hover:underline">
            Free sample
          </Link>
        </p>
      </div>
    </article>
    <FinalMarketingCta title="Try the questions before you pay." />
    </>
  );
}
