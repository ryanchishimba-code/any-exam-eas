import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeQuote } from "@/components/marketing/elevation/HomeQuote";
import { HomeProofStrip } from "@/components/marketing/elevation/HomeProofStrip";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
  type LandingBankCountsDisplay,
} from "@/lib/marketing/question-bank-counts";
import { formatExactQuestionCount, publishedSiteQuestionCounts } from "@/lib/counts";
import { buildHomeProofFacts, siteCountsFromSnapshot } from "@/lib/marketing/home-proof";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { buildHomeMetadata } from "@/lib/seo";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 * The hero still streams counts below the fold. Login stays in the shared nav.
 */
export const revalidate = 300;

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
  const { snapshot } = await getCachedBankStatsBundle({ dynamic: false });
  return <HomeJsonLd totalLabel={buildLandingBankCountsDisplay(snapshot).totalLabel} />;
}

async function HomeProofLive() {
  const { snapshot } = await getCachedBankStatsBundle({ dynamic: false });
  return <HomeProofStrip facts={buildHomeProofFacts(siteCountsFromSnapshot(snapshot))} />;
}

async function HomeQuoteLive() {
  const testimonials = await getCachedPublishedTestimonials(2);
  return <HomeQuote stories={testimonials} />;
}

export default async function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <HomeJsonLdLive />
      </Suspense>
      <HomeExperience bankCounts={EMPTY_COUNTS}>
        <PublicHome
          proof={
            <Suspense fallback={null}>
              <HomeProofLive />
            </Suspense>
          }
          quote={
            <Suspense fallback={null}>
              <HomeQuoteLive />
            </Suspense>
          }
        />
      </HomeExperience>
    </>
  );
}
