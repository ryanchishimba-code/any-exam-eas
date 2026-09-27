import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import { LandingTestimonialsV2 } from "@/components/landing/LandingTestimonialsV2";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import { PublicSampleSet } from "@/components/marketing/PublicSampleSet";
import { getHeroNgnFrame } from "@/lib/marketing/hero-ngn-frame";
import { getPublicSampleQuestions } from "@/lib/marketing/public-sample";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
  type LandingBankCountsDisplay,
} from "@/lib/marketing/question-bank-counts";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { buildHomeMetadata } from "@/lib/seo";

/** The hero paints without waiting on the bank snapshot. Counts stream in below. */
export const dynamic = "force-dynamic";

const EMPTY_COUNTS: LandingBankCountsDisplay = {
  totalLabel: "",
  totalQuestionsLabel: "",
  totalServed: 0,
  exams: [],
  degraded: true,
};

export async function generateMetadata(): Promise<Metadata> {
  const { snapshot, inventory } = await getCachedBankStatsBundle();
  return buildHomeMetadata(
    buildLandingBankCountsDisplay(snapshot).totalLabel,
    inventory.boards.nclex?.formats ?? null
  );
}

async function HomeJsonLdLive() {
  const { snapshot } = await getCachedBankStatsBundle();
  return <HomeJsonLd totalLabel={buildLandingBankCountsDisplay(snapshot).totalLabel} />;
}

async function HomeDeferredProof() {
  const [{ snapshot }, testimonials, samples] = await Promise.all([
    getCachedBankStatsBundle(),
    getCachedPublishedTestimonials(6),
    getPublicSampleQuestions(),
  ]);
  const bankCounts = buildLandingBankCountsDisplay(snapshot);
  return (
    <>
      {bankCounts.totalLabel ? (
        <p className="mx-auto max-w-5xl px-5 pb-2 pt-8 text-sm text-[var(--color-ink-muted)] sm:px-6">
          {bankCounts.totalQuestionsLabel}
        </p>
      ) : null}
      <PublicSampleSet items={samples} />
      <div className="mx-auto max-w-5xl px-5 sm:px-6">
        <LandingTestimonialsV2 stories={testimonials} />
      </div>
    </>
  );
}

export default async function HomePage() {
  const heroFrame = await getHeroNgnFrame();
  return (
    <>
      <Suspense fallback={null}>
        <HomeJsonLdLive />
      </Suspense>
      <HomeExperience bankCounts={EMPTY_COUNTS}>
        <PublicHome bankCounts={EMPTY_COUNTS} heroFrame={heroFrame}>
          <Suspense fallback={null}>
            <HomeDeferredProof />
          </Suspense>
        </PublicHome>
      </HomeExperience>
    </>
  );
}
