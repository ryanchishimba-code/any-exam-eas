import type { Metadata } from "next";
import { Suspense } from "react";
import { HomeJsonLd } from "@/components/seo/HomeJsonLd";
import { HomeExperience } from "@/components/home/HomeExperience";
import { HomeProofStrip } from "@/components/marketing/elevation/HomeProofStrip";
import { PublicHome } from "@/components/marketing/elevation/PublicHome";
import { homeFeatureCards } from "@/lib/marketing/board-landing/board-features";
import { buildHomeHeroBand } from "@/lib/marketing/board-landing/home-hero";
import { openBoardQuickBite } from "@/lib/marketing/board-landing/model";
import { buildHomeProofFacts, siteCountsFromSnapshot } from "@/lib/marketing/home-proof";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import "@/styles/board-landing.css";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { landingTestimonialStories } from "@/lib/testimonials/landing-stories";
import { buildHomeMetadata } from "@/lib/seo";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value). The proof line, hero, and metadata read
 * `loadServedQuestionCounts` through `loadPublicQuestionCounts`: the
 * student-serving gate, cached at most one hour. The hero floors that bank
 * total. Catalog NGN is not included, and the cron snapshot is not read.
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

export default async function HomePage() {
  const [{ display, bundle, exactLabel, staticLabel }, testimonials] = await Promise.all([
    loadPublicQuestionCounts({ dynamic: false }),
    getCachedPublishedTestimonials(6),
  ]);
  const site = siteCountsFromSnapshot(bundle.snapshot);
  const heroCountLabel = exactLabel.trim() || staticLabel.trim() || "";
  const homeHeroBand = buildHomeHeroBand(heroCountLabel || null);
  const homeFeatures = homeFeatureCards({
    ngnCaseStudies: Boolean(site && site.boards.nclex.caseStudies > 0),
    nursingQuickBite: openBoardQuickBite("nursing"),
    pharmacyQuickBite: openBoardQuickBite("pharmacy"),
  });
  const testimonialStories = landingTestimonialStories(testimonials);
  return (
    <>
      <Suspense fallback={null}>
        <HomeJsonLdLive />
      </Suspense>
      <HomeExperience bankCounts={display}>
        <PublicHome
          ngnCaseStudies={Boolean(site && site.boards.nclex.caseStudies > 0)}
          heroBand={homeHeroBand}
          heroQuestionCountLabel={staticLabel.trim() || exactLabel.trim() || null}
          featureCards={homeFeatures}
          testimonialStories={testimonialStories}
          proof={
            <HomeProofStrip facts={buildHomeProofFacts(siteCountsFromSnapshot(bundle.snapshot))} />
          }
        />
      </HomeExperience>
    </>
  );
}
