import type { Metadata } from "next";
import Link from "next/link";
import { Suspense } from "react";
import { Map, BookOpen, Timer } from "lucide-react";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { PricingQueryNotices } from "@/components/pricing/PricingQueryNotices";
import { PageShell } from "@/components/PageShell";
import { buildPricingMetadata, buildPricingJsonLd } from "@/lib/seo/marketing-metadata";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { formatHeroTotalCountLine } from "@/lib/landing/content";
import { formatMonthlyPrice, formatPricingCheckoutTrialOffer } from "@/lib/site";

export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { snapshot } = await getCachedBankStatsBundle();
  return buildPricingMetadata(buildLandingBankCountsDisplay(snapshot).totalLabel);
}

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

export default async function PricingPage() {
  const { snapshot } = await getCachedBankStatsBundle();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);
  const totalLine =
    formatHeroTotalCountLine(bankCounts.totalLabel) ??
    `${bankCounts.totalLabel} active questions across six boards`;
  return (
    <>
      <JsonLdScript data={buildPricingJsonLd()} />
      <PageShell
        title="Pro"
        description={`${totalLine}. Roadmap → Deep Dive → Full Exam. One plan from ${formatMonthlyPrice("pro")}/mo.`}
        align="center"
        maxWidth="max-w-2xl"
        compact
      >
        <p className="mx-auto mt-3 max-w-md text-center text-sm font-medium text-[var(--color-ink)]">
          {formatPricingCheckoutTrialOffer()}
        </p>

        <ol className="mx-auto mt-8 grid max-w-2xl gap-3 sm:grid-cols-3" role="list">
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

        <Suspense fallback={null}>
          <PricingQueryNotices />
        </Suspense>

        <div className="mt-8">
          <Suspense fallback={null}>
            <PricingTiers />
          </Suspense>
        </div>

        <p className="mx-auto mt-10 text-center text-[0.6875rem] leading-relaxed text-[var(--color-ink-muted)]">
          Study tool only — not a guarantee of exam results.{" "}
          <Link href="/legal/terms" className="text-[var(--color-accent)] underline">
            Terms
          </Link>
        </p>
      </PageShell>
    </>
  );
}
