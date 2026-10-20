import type { Metadata } from "next";
import { BoardLanding } from "@/components/marketing/board-landing/BoardLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { loadNclexHeroCase } from "@/lib/marketing/board-landing/hero-case";
import { loadNursingBankTypeCounts } from "@/lib/marketing/board-landing/bank-types";
import { buildNclexLandingMetadata, buildNclexLandingModel } from "@/lib/marketing/board-landing/model";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { getPublicSampleQuestions } from "@/lib/marketing/public-sample";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  return buildNclexLandingMetadata();
}

export default async function NclexHubPage() {
  const [{ bundle, display }, samples, scene, bankTypes] = await Promise.all([
    loadPublicQuestionCounts({ dynamic: false }),
    getPublicSampleQuestions(),
    loadNclexHeroCase(),
    loadNursingBankTypeCounts(),
  ]);
  const exam = display.exams.find((row) => row.slug === "nclex");
  const live = !display.degraded && (exam?.served ?? 0) > 0;
  const model = buildNclexLandingModel({
    degraded: !live,
    units: live ? (bundle.snapshot.boards?.nclex ?? null) : null,
    bankTypes: live ? bankTypes : {},
    sample: samples.find((item) => item.fieldId === "nursing") ?? null,
  });

  return (
    <>
      <JsonLdScript data={model.jsonLd} />
      <BoardLanding model={model} scene={scene} />
    </>
  );
}
