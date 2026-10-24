import type { Metadata } from "next";
import { NaplexBoardLanding } from "@/components/marketing/board-landing/NaplexBoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { loadPharmacyBankTypeCounts } from "@/lib/marketing/board-landing/bank-types";
import {
  buildNaplexLandingMetadata,
  buildNaplexLandingModel,
  naplexFormatCards,
} from "@/lib/marketing/board-landing/naplex";
import { naplexBoardLandingRenderModel } from "@/lib/marketing/board-landing/render-payload";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { scoredQuestionCount } from "@/lib/counts";
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
  const [{ bundle, display }, testimonials, bankTypes] = await Promise.all([
    loadPublicQuestionCounts({ dynamic: false }),
    getCachedPublishedTestimonials(6),
    loadPharmacyBankTypeCounts(),
  ]);
  const exam = display.exams.find((row) => row.slug === "naplex");
  const live = !display.degraded && (exam?.served ?? 0) > 0;
  const units = live ? (bundle.snapshot.boards?.naplex ?? null) : null;
  const full = buildNaplexLandingModel({
    degraded: !live,
    units,
    bankTypes,
    sample: null,
    testimonials,
  });
  const formats = live ? naplexFormatCards(bankTypes) : [];
  const render = naplexBoardLandingRenderModel(full, {
    liveQuestionCount: units ? scoredQuestionCount(units) : 0,
    includeQuickBite: Boolean(full.quickBite),
    includeItemTypes: formats.length > 0,
  });

  return (
    <>
      <JsonLdScript data={full.jsonLd} />
      <NaplexBoardLanding model={render} />
    </>
  );
}
