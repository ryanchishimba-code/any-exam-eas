import type { Metadata } from "next";
import Link from "next/link";
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
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { ACTIVE_QUESTION_DEFINITION } from "@/lib/inventory/active-questions";
import { AI_ASSISTED_REVIEW_NOTE } from "@/lib/marketing/legal-copy";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 */
export const revalidate = 300;

const TITLE = "How our questions are built and reviewed";
const DESCRIPTION =
  "How AnyExamEasy aligns questions with official test plans, hides flawed questions, shows sources, and handles student reports.";

export const metadata: Metadata = {
  title: { absolute: `${TITLE} — AnyExamEasy` },
  description: DESCRIPTION,
  alternates: { canonical: ROUTES.howQuestionsAreReviewed },
  openGraph: { title: TITLE, description: DESCRIPTION, type: "article" },
};

function countLabel(value: number | null): string | null {
  if (value == null || Number.isNaN(value)) return null;
  return value.toLocaleString("en-US");
}

export default async function HowQuestionsAreReviewedPage() {
  const [facts, bank] = await Promise.all([
    getQualityFacts(),
    loadPublicQuestionCounts({ dynamic: false }),
  ]);
  const counts = bank.display;
  const suppressed = countLabel(facts.suppressedNursing);
  const nclexUnits = bank.bundle.snapshot.boards?.nclex;
  const ngnSentence =
    nclexUnits && (nclexUnits.standaloneNgn > 0 || nclexUnits.caseStudies > 0)
      ? `${nclexUnits.standaloneNgn.toLocaleString("en-US")} standalone Next Generation NCLEX questions and ${nclexUnits.caseItems.toLocaleString("en-US")} questions in ${nclexUnits.caseStudies.toLocaleString("en-US")} case studies are published.`
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
                  {plan.linkLabel}
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
            Timed practice exams use only questions students can study, and they follow the official
            category weights: NCSBN Client Needs for NCLEX-RN, NABP domain weights for NAPLEX, NBME
            and FSMB organ-system ranges for USMLE, NPCB domain and age-group weights for AANP FNP,
            the NCCPA blueprint for PANCE, and the FSBPT outline for NPTE-PT. A practice exam that
            cannot meet those weights is not padded with a made-up mix.
          </p>
          {!counts.degraded && counts.totalServed > 0 ? (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              {counts.totalQuestionsLabel} are available to study right now. {ACTIVE_QUESTION_DEFINITION}
            </p>
          ) : (
            <p className="mt-3 text-sm leading-relaxed text-[var(--color-ink-muted)]">
              The current question count is unavailable, so this page does not show a
              substitute number.
            </p>
          )}
        </section>

        <section className="mt-12" aria-labelledby="gate-heading">
          <h2 id="gate-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Before a question is shown
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            A question appears in a study session only when it is live, it has passed review, and
            it is still cleared for students. Questions that fail a basic check — a wrong answer
            key, a broken format, or a decision to pull them from practice — are flagged and hidden.
            Hiding does not erase the question, the choices, the correct answer, or the explanation.
            A later fix can bring that same question back.
          </p>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            {AI_ASSISTED_REVIEW_NOTE}
          </p>
          {facts.live && suppressed ? (
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              {suppressed} NCLEX questions are currently held back and stay out of student
              practice until they are repaired. This page reads that number when it loads.
            </p>
          ) : null}
          {ngnSentence ? (
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Separately, {ngnSentence} {NGN_PUBLISHED_DESCRIPTION}
            </p>
          ) : (
            <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
              Next Generation NCLEX case questions are counted separately. {NGN_PUBLISHED_DESCRIPTION}
            </p>
          )}
        </section>

        <div className="mt-12">
          <ClinicalReviewers headingId="standards-clinical-reviewers" />
        </div>

        <section className="mt-12" aria-labelledby="sources-heading">
          <h2 id="sources-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Explanations and sources
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            When a question includes references — a test plan, an open textbook, or a recognized
            professional source — that citation is shown with the explanation. If a question has no
            source on file, we do not invent one for the screen. Blog posts that discuss a board link
            the official outline they are describing.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="report-heading">
          <h2 id="report-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Report an issue
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            Every explanation includes a way to report an issue. The report is saved for review with
            the question, the answer you selected, and a short reason. You can also write{" "}
            <a
              className="font-semibold text-[var(--color-accent)] hover:underline"
              href={`mailto:${LEGAL_ENTITY.supportEmail}?subject=${encodeURIComponent("Question issue")}`}
            >
              {LEGAL_ENTITY.supportEmail}
            </a>.
          </p>
        </section>

        <section className="mt-12" aria-labelledby="corrections-heading">
          <h2 id="corrections-heading" className="text-2xl font-bold tracking-tight text-[var(--color-ink)]">
            Corrections
          </h2>
          <p className="mt-3 text-base leading-relaxed text-[var(--color-ink-muted)]">
            A confirmed flaw is corrected on that question, or the question is held back until it is
            safe to show again. We do not quietly delete the original question to make a report
            disappear. We do not promise a reply window we cannot keep. A content fix is not an automatic refund. Billing
            rules are on the{" "}
            <Link href="/legal/refunds" className="font-semibold text-[var(--color-accent)] hover:underline">
              refunds and cancellation
            </Link>{" "}
            page.
          </p>
        </section>

        <p className="mt-14 text-sm leading-relaxed text-[var(--color-ink-muted)]">
          <Link href={ROUTES.pricing} prefetch={false} className="font-semibold text-[var(--color-accent)] hover:underline">
            Pricing
          </Link>
          <span aria-hidden> · </span>
          <Link href={ROUTES.about} className="font-semibold text-[var(--color-accent)] hover:underline">
            About
          </Link>
          <span aria-hidden> · </span>
          <Link href="/nclex#try-questions" className="font-semibold text-[var(--color-accent)] hover:underline">
            Free sample
          </Link>
        </p>
      </div>
    </article>
    <FinalMarketingCta title="Try the questions before you pay." />
    </>
  );
}
