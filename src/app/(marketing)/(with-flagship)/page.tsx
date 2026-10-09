import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeQuote } from "@/components/marketing/elevation/HomeQuote";
import { HomeProofStrip } from "@/components/marketing/elevation/HomeProofStrip";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import { buildHomeProofFacts, siteCountsFromSnapshot } from "@/lib/marketing/home-proof";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { buildHomeMetadata } from "@/lib/seo";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 * Counts come from the ISR data cache of the same snapshot the bank-counts
 * API uses. The head shows only a floor of that total.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { staticLabel } = await loadPublicQuestionCounts({ dynamic: false });
  return buildHomeMetadata(staticLabel || undefined);
}

async function HomeJsonLdLive() {
  const { exactLabel } = await loadPublicQuestionCounts({ dynamic: false });
  return <HomeJsonLd totalLabel={exactLabel || undefined} />;
}

async function HomeProofLive() {
  const { bundle } = await loadPublicQuestionCounts({ dynamic: false });
  return <HomeProofStrip facts={buildHomeProofFacts(siteCountsFromSnapshot(bundle.snapshot))} />;
}

async function HomeQuoteLive() {
  const testimonials = await getCachedPublishedTestimonials(2);
  return <HomeQuote stories={testimonials} />;
}

export default async function HomePage() {
  const { display } = await loadPublicQuestionCounts({ dynamic: false });
  return (
    <>
      <Suspense fallback={null}>
        <HomeJsonLdLive />
      </Suspense>
      <HomeExperience bankCounts={display}>
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
