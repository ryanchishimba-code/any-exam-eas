import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import { LandingTestimonialsV2 } from "@/components/landing/LandingTestimonialsV2";
import { HomeProofStrip } from "@/components/marketing/elevation/HomeProofStrip";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import { PublicSampleSet } from "@/components/marketing/PublicSampleSet";
import { getHeroNgnFrame } from "@/lib/marketing/hero-ngn-frame";
import { getPublicSampleQuestions } from "@/lib/marketing/public-sample";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
  type LandingBankCountsDisplay,
} from "@/lib/marketing/question-bank-counts";
import { formatExactQuestionCount, publishedSiteQuestionCounts } from "@/lib/counts";
import { buildHomeProofFacts, siteCountsFromSnapshot } from "@/lib/marketing/home-proof";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { buildHomeMetadata } from "@/lib/seo";

/** The hero paints without waiting on the bank snapshot. Counts stream in below. */
export const dynamic = "force-dynamic";

const EMPTY_COUNTS: LandingBankCountsDisplay = {
  totalLabel: "",
  totalQuestionsLabel: "",
  sentence: "",
  roundedDown: "",
  totalServed: 0,
  exams: [],
  degraded: true,
};

/** Static head tags. An async generateMetadata waits on the bank and streams the description after </head>. */
export const metadata: Metadata = buildHomeMetadata(
  formatExactQuestionCount(publishedSiteQuestionCounts().totalQuestions)
);

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
  const facts = buildHomeProofFacts(siteCountsFromSnapshot(snapshot));
  return (
    <>
      <HomeProofStrip facts={facts} />
      <PublicSampleSet items={samples} limit={2} compact />
      <div className="mx-auto max-w-5xl px-5 py-4 sm:px-6">
        <LandingTestimonialsV2 stories={testimonials} compact />
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
        <PublicHome heroFrame={heroFrame}>
          <Suspense fallback={null}>
            <HomeDeferredProof />
          </Suspense>
        </PublicHome>
      </HomeExperience>
    </>
  );
}
