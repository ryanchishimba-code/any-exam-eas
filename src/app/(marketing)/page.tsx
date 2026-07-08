import type { Metadata } from "next";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import {
  buildLandingBankCountsDisplay,
  getCachedQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { buildHomeMetadata } from "@/lib/seo";

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
  try {
    const snapshot = await getCachedQuestionBankCounts();
    const display = buildLandingBankCountsDisplay(snapshot);
    if (!snapshot.degraded && display.totalServed > 0) {
      return buildHomeMetadata(display.totalLabel);
    }
  } catch {
    /* keep static metadata when DB unavailable */
  }
  return buildHomeMetadata();
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
