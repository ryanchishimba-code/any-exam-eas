import type { Metadata } from "next";
import { ExamMarketingLanding } from "@/components/marketing/ExamMarketingLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { getCachedPublishedTestimonials } from "@/lib/testimonials/published";
import { getPublicSampleQuestions } from "@/lib/marketing/public-sample";
import { presentBoardInventory } from "@/lib/inventory/active-questions";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { buildExamJsonLd, buildExamMetadata } from "@/lib/seo/marketing-metadata";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 * Counts use that shared stamp cache, so a purge refreshes this hub with the
 * rest of the site. A missed purge cannot keep an hour-old total.
 */
export const revalidate = 300;

export async function generateMetadata(): Promise<Metadata> {
  const { inventory } = await getCachedBankStatsBundle({ dynamic: false });
  return buildExamMetadata("nclex", inventory.boards.nclex?.formats ?? null);
}

export default async function NclexHubPage() {
  const { snapshot, inventory } = await getCachedBankStatsBundle({ dynamic: false });
  const bankCounts = buildLandingBankCountsDisplay(snapshot);
  const examCount = bankCounts.exams.find((row) => row.slug === "nclex");
  const questionCountLabel = examCount?.sentence.includes("including")
    ? examCount.sentence
    : examCount?.countLabel;
  const [testimonials, samples] = await Promise.all([
    getCachedPublishedTestimonials(6),
    getPublicSampleQuestions(),
  ]);
  const boardInventory = presentBoardInventory({
    slug: "nclex",
    usingLiveCount: !bankCounts.degraded && (examCount?.served ?? 0) > 0,
    board: inventory.boards.nclex,
    clinical: snapshot.boards?.nclex ?? null,
  });

  return (
    <>
      <JsonLdScript data={buildExamJsonLd("nclex", inventory.boards.nclex?.formats ?? null)} />
      <ExamMarketingLanding
        examKey="nclex"
        questionCountLabel={questionCountLabel}
        inventory={boardInventory}
        testimonials={testimonials}
        samples={samples}
      />
    </>
  );
}
