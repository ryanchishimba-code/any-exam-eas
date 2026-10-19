import type { Metadata } from "next";
import { BoardLanding } from "@/components/marketing/board-landing/BoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { loadPharmacyBankTypeCounts } from "@/lib/marketing/board-landing/bank-types";
import { buildNaplexLandingMetadata, buildNaplexLandingModel } from "@/lib/marketing/board-landing/naplex";
import { loadNaplexPractice } from "@/lib/marketing/board-landing/pharmacy-case";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildNaplexLandingMetadata();
}

export default async function NaplexHubPage() {
  const [{ bundle, display }, testimonials, practice, bankTypes] = await Promise.all([
    loadPublicQuestionCounts({ dynamic: false }),
    getCachedPublishedTestimonials(6),
    loadNaplexPractice(),
    loadPharmacyBankTypeCounts(),
  ]);
  const exam = display.exams.find((row) => row.slug === "naplex");
  const live = !display.degraded && (exam?.served ?? 0) > 0;
  const model = buildNaplexLandingModel({
    degraded: !live,
    units: live ? (bundle.snapshot.boards?.naplex ?? null) : null,
    bankTypes,
    sample: practice?.sample ?? null,
    testimonials,
  });

  return (
    <>
      <JsonLdScript data={model.jsonLd} />
      <BoardLanding model={model} pharmacy={practice?.hero ?? null} />
    </>
  );
}
