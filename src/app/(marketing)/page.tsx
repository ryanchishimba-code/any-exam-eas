import type { Metadata } from "next";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import { LandingSeoGuide } from "@/components/landing/LandingSeoGuide";
import { LANDING_FALLBACK_BANK_COUNTS } from "@/lib/marketing/landing-fallback-counts";
import { LANDING_SUCCESS_STORIES } from "@/lib/landing/content";
import { buildHomeMetadata } from "@/lib/seo";

/** Fully static shell — live bank counts hydrate client-side via `/api/marketing/bank-counts`. */
export const dynamic = "force-static";

/**
 * AnyExamEasy.com — Flagship home route (`/`)
 *
 * Architecture:
 * - Static server shell (metadata + JSON-LD + published floor counts)
 * - `HomeExperience` switches guest vs subscriber views client-side
 * - Live bank counts upgrade in the browser from the cached public API
 * - Server-rendered SEO guide (children) for crawler-friendly long-form copy
 */
export const metadata: Metadata = buildHomeMetadata(LANDING_FALLBACK_BANK_COUNTS.totalLabel);

export default function HomePage() {
  return (
    <>
      <HomeJsonLd />
      <HomeExperience
        bankCounts={LANDING_FALLBACK_BANK_COUNTS}
        testimonials={LANDING_SUCCESS_STORIES}
      >
        <LandingSeoGuide
          questionCountLabel={LANDING_FALLBACK_BANK_COUNTS.totalLabel}
        />
      </HomeExperience>
    </>
  );
}
