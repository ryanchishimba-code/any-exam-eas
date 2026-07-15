import Link from "next/link";
import { Suspense } from "react";
import { Sparkles } from "lucide-react";
import { LEGAL_DISCLAIMERS, LEGAL_ENTITY } from "@/lib/legal";
import { formatMonthlyPrice, formatPricingHeadline, formatTrialLabel } from "@/lib/site";
import { HighlightedPrice } from "@/components/landing/HighlightedPrice";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { PricingQueryNotices } from "@/components/pricing/PricingQueryNotices";
import { HowWeCompare } from "@/components/home/HowWeCompare";
import { PageShell } from "@/components/PageShell";
import { LANDING_HERO_TRUST_SIGNALS } from "@/lib/landing/content";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";

import { buildPricingMetadata, buildPricingJsonLd } from "@/lib/seo/marketing-metadata";
import { JsonLdScript } from "@/components/seo/JsonLdScript";

export const metadata = buildPricingMetadata();
export const revalidate = 3600;

export default async function PricingPage() {
  const bankSnapshot = await getCachedQuestionBankCounts();
  const bankCounts = buildLandingBankCountsDisplay(bankSnapshot);

  return (
    <>
      <JsonLdScript data={buildPricingJsonLd()} />
    <PageShell
      eyebrow="6 Major Board Exams · One Subscription"
      title="One Pro plan — every board included."
      description={formatPricingHeadline()}
      align="center"
      maxWidth="max-w-5xl"
    >
      <Suspense fallback={null}>
        <PricingQueryNotices />
      </Suspense>

      <div className="mx-auto mt-5 flex flex-wrap items-center justify-center gap-x-3 gap-y-2">
        <span className="inline-flex items-baseline gap-1.5 text-base font-bold text-[var(--color-ink)]">
          From
          <HighlightedPrice size="hero" period="/mo" />
        </span>
        <span className="inline-flex items-center gap-1.5 rounded-full border border-[color-mix(in_srgb,var(--color-accent)_38%,transparent)] bg-[color-mix(in_srgb,var(--color-accent)_14%,var(--color-surface-elevated))] px-3.5 py-1.5 text-sm font-extrabold tracking-tight text-[var(--color-accent)] shadow-[var(--shadow-apple-sm)]">
          <Sparkles className="h-4 w-4" aria-hidden />
          {formatTrialLabel()}
        </span>
      </div>
      <p className="mx-auto mt-3 max-w-2xl text-center text-sm font-medium text-[var(--color-ink-muted)]">
        {bankCounts.degraded ? (
          <>6 exams + powerful tools for less than one UWorld subscription · Pro at{" "}
            {formatMonthlyPrice("pro")}/mo</>
        ) : (
          <>
            <span className="font-semibold tabular-nums text-[var(--color-ink)]">
              {bankCounts.totalLabel}
            </span>{" "}
            serve-ready questions · 6 exams · Pro at {formatMonthlyPrice("pro")}/mo
          </>
        )}
      </p>

      <div className="mt-14">
        <Suspense fallback={null}>
          <PricingTiers />
        </Suspense>
      </div>

      <ul className="mx-auto mt-8 flex flex-wrap items-center justify-center gap-x-3 gap-y-1 text-xs font-semibold text-[var(--color-ink-muted)]" aria-label="Trust signals">
        {LANDING_HERO_TRUST_SIGNALS.map((signal) => (
          <li key={signal}>{signal}</li>
        ))}
      </ul>

      <div className="mt-16">
        <HowWeCompare />
      </div>

      <p className="mx-auto mt-12 max-w-3xl border-t border-[var(--color-border)] pt-8 text-center text-xs leading-relaxed text-[var(--color-ink-muted)]">
        {LEGAL_DISCLAIMERS.subscription} {LEGAL_DISCLAIMERS.refundsAndAccess}{" "}
        {LEGAL_DISCLAIMERS.planChanges} {LEGAL_DISCLAIMERS.noGuarantee}{" "}
        <Link href="/legal/terms" className="text-[var(--color-accent)] underline">
          Full Terms of Service
        </Link>
        . {LEGAL_ENTITY.productName} is a product of {LEGAL_ENTITY.companyName}.
      </p>
    </PageShell>
    </>
  );
}
