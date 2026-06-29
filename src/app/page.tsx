import type { Metadata } from "next";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { buildHomeMetadata } from "@/lib/seo";
import { formatMonthlyPrice, formatTrialLabel, formatTrialQuestionLimit } from "@/lib/site";

/** ISR — bank counts refresh hourly; invalidated after question-bank cron sync. */
export const revalidate = 3600;

/**
 * AnyExamEasy.com — Flagship home route (`/`)
 *
 * Architecture:
 * - Server component shell (metadata, structured data, zero client JS here)
 * - `HomeExperience` switches guest vs subscriber views client-side
 *
 * Guest view → `LandingFlagship` (conversion funnel):
 *   Hero (exam showcase) → Offering → Features → Choose exam → Compare → Social proof → Samples → Pricing → Final CTA + sticky bar
 *
 * Subscriber view → Study Hub hero + dashboard shortcuts
 *
 * Design system: `src/lib/landing/tokens.ts` + `.aee-flagship-*` in globals.css
 * Palette: navy #0A2540, teal #00D4C8 — dark-mode friendly via prefers-color-scheme
 */
export async function generateMetadata(): Promise<Metadata> {
  const base = buildHomeMetadata();
  try {
    const snapshot = await getCachedQuestionBankCounts();
    const display = buildLandingBankCountsDisplay(snapshot);
    if (!snapshot.degraded && display.totalServed > 0) {
      const description = `All-in-one board prep for NCLEX, USMLE Step 1, Step 2 CK & Step 3, NAPLEX, PANCE, AANP FNP, and NPTE-PT — ${display.totalQuestionsLabel}, Roadmaps & Deep Dives. Pro at ${formatMonthlyPrice("pro")}/mo · ${formatTrialLabel()} · ${formatTrialQuestionLimit()} · no payment required.`;
      return {
        ...base,
        description,
        openGraph: base.openGraph ? { ...base.openGraph, description } : undefined,
        twitter: base.twitter ? { ...base.twitter, description } : undefined,
      };
    }
  } catch {
    /* keep static metadata when DB unavailable */
  }
  return base;
}

export default async function HomePage() {
  const [snapshot, testimonials] = await Promise.all([
    getCachedQuestionBankCounts(),
    getCachedPublishedTestimonials(),
  ]);
  const bankCounts = buildLandingBankCountsDisplay(snapshot);

  return (
    <>
      <HomeJsonLd />
      <HomeExperience bankCounts={bankCounts} testimonials={testimonials} />
    </>
  );
}
