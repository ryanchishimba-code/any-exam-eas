import type { Metadata } from "next";
import dynamic from "next/dynamic";
import Link from "next/link";
import { Suspense } from "react";
import { Map, BookOpen, Timer } from "lucide-react";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { PricingBoardHeadline } from "@/components/pricing/PricingBoardHeadline";
import { PageShell } from "@/components/PageShell";
import { buildPricingMetadata, buildPricingJsonLd } from "@/lib/seo/marketing-metadata";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { formatExactQuestionCount, publishedSiteQuestionCounts } from "@/lib/counts";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { formatMonthlyPrice } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

/**
 * Five-minute ISR. Query-string headlines and paywall notices render in
 * Suspense so this document can stay cached. Counts are the published totals.
 */
export const revalidate = 300;

export const metadata: Metadata = buildPricingMetadata(
  formatExactQuestionCount(publishedSiteQuestionCounts().totalQuestions)
);

const STUDY_PATH = [
  { icon: Map, title: "Roadmap" },
  { icon: BookOpen, title: "Deep Dive" },
  { icon: Timer, title: "Full Exam" },
] as const;

const PricingQueryNotices = dynamic(() =>
  import("@/components/pricing/PricingQueryNotices").then((m) => m.PricingQueryNotices)
);

export default function PricingPage() {
  const published = publishedSiteQuestionCounts();
  const publishedLabel = formatExactQuestionCount(published.totalQuestions);

  return (
    <>
      <JsonLdScript data={buildPricingJsonLd(publishedLabel)} />
      <PageShell
        title={
          <Suspense fallback={<>Six boards. One monthly price.</>}>
            <PricingBoardHeadline />
          </Suspense>
        }
        description={`${publishedLabel} questions across six boards. One plan from ${formatMonthlyPrice("pro")}/mo.`}
        align="center"
        maxWidth="max-w-3xl"
      >
        <Suspense fallback={null}>
          <PricingQueryNotices />
        </Suspense>

        <div className="mt-6" data-pricing-fold>
          <Suspense fallback={null}>
            <PricingTiers />
          </Suspense>
        </div>

        <ol className="mx-auto mt-10 grid max-w-2xl gap-3 sm:grid-cols-3" role="list">
          {STUDY_PATH.map((step, index) => (
            <li
              key={step.title}
              className="rounded-2xl border border-[var(--color-border)] bg-[var(--color-surface)] px-4 py-4 text-left"
            >
              <p className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                <step.icon className="h-3.5 w-3.5" aria-hidden />
                {String(index + 1).padStart(2, "0")} {step.title}
              </p>
            </li>
          ))}
        </ol>

        <PurchaseTrustNotes className="mt-8" showTrialOffer={false} />
        <p className="mx-auto mt-6 text-center text-sm">
          <Link href={ROUTES.howQuestionsAreReviewed} className="font-semibold text-[var(--color-accent)] hover:underline">
            How questions are built and reviewed
          </Link>
        </p>
        <p className="mx-auto mt-4 text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
          Study tool only — not a guarantee of exam results.{" "}
          <Link href="/legal/terms" className="text-[var(--color-accent)] underline">
            Terms
          </Link>
          {" · "}
          <Link href="/legal/refunds" className="text-[var(--color-accent)] underline">
            Refunds
          </Link>
        </p>
      </PageShell>
    </>
  );
}
