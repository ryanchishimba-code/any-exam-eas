import type { Metadata } from "next";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { buildHomeMetadata } from "@/lib/seo";

/** One active-question total for the hero, stats, and metadata. */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  const { snapshot, inventory } = await getCachedBankStatsBundle();
  return buildHomeMetadata(
    buildLandingBankCountsDisplay(snapshot).totalLabel,
    inventory.boards.nclex?.formats ?? null
  );
}

export default async function HomePage() {
  const { snapshot, inventory } = await getCachedBankStatsBundle();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);
  const boardFormats = Object.fromEntries(
    Object.entries(inventory.boards).map(([slug, board]) => [slug, board.formats])
  );
  return (
    <>
      <HomeJsonLd />
      <HomeExperience
        bankCounts={bankCounts}
        testimonials={[]}
        boardFormats={inventory.degraded ? null : boardFormats}
      />
    </>
  );
}
