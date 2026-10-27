import type { Metadata } from "next";
import dynamic from "next/dynamic";
import { Suspense } from "react";
import { PricingTiers } from "@/components/pricing/PricingTiers";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildPricingJsonLd, buildPricingMetadata } from "@/lib/seo/marketing-metadata";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { formatMonthlyPrice } from "@/lib/site";
import "@/styles/pricing-page.css";

/**
 * Five-minute ISR. Query-string paywall notices render in their own Suspense
 * boundary so the H1, price, and trial link stay in the cached document.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { staticLabel } = await loadPublicQuestionCounts({ dynamic: false });
  return buildPricingMetadata(staticLabel || undefined);
}

const PricingQueryNotices = dynamic(() =>
  import("@/components/pricing/PricingQueryNotices").then((m) => m.PricingQueryNotices)
);

export default async function PricingPage() {
  const { exactLabel } = await loadPublicQuestionCounts({ dynamic: false });
  const lede = exactLabel
    ? `${exactLabel} questions across six boards. One plan from ${formatMonthlyPrice("pro")}/mo.`
    : `Six boards. One plan from ${formatMonthlyPrice("pro")}/mo.`;

  return (
    <>
      <JsonLdScript data={buildPricingJsonLd(exactLabel || undefined)} />
      <div className="aee-pricing">
        <header className="aee-pricing-hero">
          <p className="aee-pricing-kicker">Pro plan</p>
          <h1>Six boards. One monthly price.</h1>
          <p className="aee-pricing-lede">{lede}</p>
        </header>
        <Suspense fallback={null}>
          <PricingQueryNotices />
        </Suspense>
        <PricingTiers />
      </div>
    </>
  );
}
