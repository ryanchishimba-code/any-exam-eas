import type { Metadata } from "next";
import { ExamMarketingLanding } from "@/components/marketing/ExamMarketingLanding";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { presentBoardInventory } from "@/lib/inventory/active-questions";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { buildExamJsonLd, buildExamMetadata } from "@/lib/seo/marketing-metadata";

/** Count is the published stamp. Do not ISR this hub for an hour after a retire. */
export const dynamic = "force-dynamic";

export async function generateMetadata(): Promise<Metadata> {
  return buildExamMetadata("nclex");
}

export default async function NclexHubPage() {
  const { snapshot, inventory } = await getCachedBankStatsBundle();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);
  const examCount = bankCounts.exams.find((row) => row.slug === "nclex");
  const questionCountLabel = examCount?.countLabel;
  const boardInventory = presentBoardInventory({
    slug: "nclex",
    usingLiveCount: !bankCounts.degraded && (examCount?.served ?? 0) > 0,
    board: inventory.boards.nclex,
  });

  return (
    <>
      <JsonLdScript data={buildExamJsonLd("nclex")} />
      <ExamMarketingLanding
        examKey="nclex"
        questionCountLabel={questionCountLabel}
        inventory={boardInventory}
      />
    </>
  );
}
