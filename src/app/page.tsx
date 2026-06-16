import type { Metadata } from "next";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import {
  buildLandingBankCountsDisplay,
  getQuestionBankCounts,
} from "@/lib/marketing/question-bank-counts";
import { buildHomeMetadata } from "@/lib/seo";

/**
 * AnyExamEasy.com — Flagship home route (`/`)
 *
 * Architecture:
 * - Server component shell (metadata, structured data, zero client JS here)
 * - `HomeExperience` switches guest vs subscriber views client-side
 *
 * Guest view → `LandingFlagship` (conversion funnel):
 *   Hero → Compare → Samples → Social proof → Pricing → Final CTA + sticky bar
 *
 * Subscriber view → Study Hub hero + dashboard shortcuts
 *
 * Design system: `src/lib/landing/tokens.ts` + `.aee-flagship-*` in globals.css
 * Palette: navy #0A2540, teal #00D4C8 — dark-mode friendly via prefers-color-scheme
 */
export const metadata: Metadata = buildHomeMetadata();

export default async function HomePage() {
  const snapshot = await getQuestionBankCounts();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);

  return (
    <>
      <HomeJsonLd />
      <HomeExperience bankCounts={bankCounts} />
    </>
  );
}
