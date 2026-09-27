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
import { pricingHeadlineFromContext } from "@/lib/marketing/pricing-headline";
import { formatExactQuestionCount, publishedSiteQuestionCounts } from "@/lib/counts";
import { FinalMarketingCta } from "@/components/marketing/elevation/MarketingSections";
import { PurchaseTrustNotes } from "@/components/marketing/PurchaseTrustNotes";
import { formatMonthlyPrice } from "@/lib/site";
import { ROUTES } from "@/lib/routes";

export const metadata: Metadata = buildPricingMetadata(
  formatExactQuestionCount(publishedSiteQuestionCounts().totalQuestions)
);

const STUDY_PATH = [
  {
    icon: Map,
    title: "Roadmap",
    body: "Blueprint-aligned next steps for the board in front of you.",
  },
  {
    icon: BookOpen,
    title: "Deep Dive",
    body: "Lessons open from the questions you miss — stay in one study flow.",
  },
  {
    icon: Timer,
    title: "Full Exam",
    body: "Timed mocks with weak-area weighting before test day.",
  },
] as const;

const PricingQueryNotices = dynamic(() =>
  import("@/components/pricing/PricingQueryNotices").then((m) => m.PricingQueryNotices)
);

type PricingSearch = {
  field?: string | string[];
  exam?: string | string[];
  paywall?: string | string[];
  upgrade?: string | string[];
};

function firstParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) return value[0] ?? null;
  return value ?? null;
}

export default async function PricingPage({
  searchParams,
}: {
  searchParams: Promise<PricingSearch>;
}) {
  const params = await searchParams;
  const headline = pricingHeadlineFromContext({
    field: firstParam(params.field),
    exam: firstParam(params.exam),
  });
  const published = publishedSiteQuestionCounts();
  const publishedLabel = formatExactQuestionCount(published.totalQuestions);

  return (
    <>
      <JsonLdScript data={buildPricingJsonLd(publishedLabel)} />
      <PageShell
        title={<PricingBoardHeadline initial={headline} />}
        description={`${publishedLabel} questions across six boards. One plan from ${formatMonthlyPrice("pro")}/mo.`}
        align="center"
        maxWidth="max-w-3xl"
      >
        {firstParam(params.paywall) || firstParam(params.upgrade) ? (
          <Suspense fallback={null}>
            <PricingQueryNotices />
          </Suspense>
        ) : null}

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
              <p className="mt-2 text-sm leading-relaxed text-[var(--color-ink-muted)]">
                {step.body}
              </p>
            </li>
          ))}
        </ol>

        <PurchaseTrustNotes className="mt-8" />
        <p className="mx-auto mt-6 text-center text-sm">
          <Link href={ROUTES.howQuestionsAreReviewed} className="font-semibold text-[var(--color-accent)] hover:underline">
            How questions are built and reviewed
          </Link>
        </p>
        <p className="mx-auto mt-4 max-w-xl text-center text-base leading-relaxed text-[var(--color-ink-muted)]">
          This page shows our price only. One Pro plan covers the six boards.
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
      <FinalMarketingCta title="Start with the free trial." />
    </>
  );
}
