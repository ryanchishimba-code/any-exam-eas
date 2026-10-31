import type { Metadata } from "next";
import { NclexBoardLanding } from "@/components/marketing/board-landing/NclexBoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { loadNursingBankTypeCounts } from "@/lib/marketing/board-landing/bank-types";
import { loadNursingPublishedStandaloneNgnTypes } from "@/lib/marketing/clinical-extra-http";
import {
  buildNclexNgnTypeChartAltText,
  buildNclexNgnTypeChartRows,
} from "@/lib/marketing/board-landing/nclex-ngn-type-chart";
import { buildNclexLandingMetadata, buildNclexLandingModel } from "@/lib/marketing/board-landing/model";
import { nclexBoardLandingRenderModel } from "@/lib/marketing/board-landing/render-payload";
import { loadBoardPageQuestionUnits } from "@/lib/marketing/live-board-counts";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { servedQuestionCount } from "@/lib/counts";
import { getCachedNclexTrustAudienceCount } from "@/lib/marketing/student-trust-count";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildNclexLandingMetadata();
}

export default async function NclexHubPage() {
  const [{ bundle, display }, bankTypes, publishedStandaloneNgnTypes, testimonials, nclexTrustAudienceCount] =
    await Promise.all([
      loadPublicQuestionCounts({ dynamic: false }),
      loadNursingBankTypeCounts(),
      loadNursingPublishedStandaloneNgnTypes(),
      getCachedPublishedTestimonials(6),
      getCachedNclexTrustAudienceCount(),
    ]);
  const snapshotUnits = !display.degraded ? (bundle.snapshot.boards?.nclex ?? null) : null;
  const units = await loadBoardPageQuestionUnits("nclex", snapshotUnits);
  const live = units != null && servedQuestionCount(units) > 0;
  const full = buildNclexLandingModel({
    degraded: !live,
    units,
    bankTypes: live ? bankTypes : {},
    sample: null,
    sampleSecondary: null,
    testimonials,
    nclexTrustAudienceCount,
  });
  const ngnTypeRows =
    live && units
      ? buildNclexNgnTypeChartRows({
          caseItems: units.caseItems,
          standaloneNgn: units.standaloneNgn,
          publishedStandaloneTypes: publishedStandaloneNgnTypes,
        })
      : [];
  const ngnTypeChartAlt =
    units && ngnTypeRows.length > 0
      ? buildNclexNgnTypeChartAltText(ngnTypeRows, units)
      : buildNclexNgnTypeChartAltText([], { standaloneNgn: 0, caseItems: 0 });

  const render = nclexBoardLandingRenderModel(full, {
    nclexDonut: {
      liveQuestionCount: units ? servedQuestionCount(units) : 0,
      includeQuickBite: Boolean(full.quickBite),
      includeNgn: ngnTypeRows.length > 0,
    },
    ngnTypeRows,
    ngnTypeChartAlt,
  });

  return (
    <>
      <JsonLdScript data={full.jsonLd} />
      <NclexBoardLanding model={render} />
    </>
  );
}
