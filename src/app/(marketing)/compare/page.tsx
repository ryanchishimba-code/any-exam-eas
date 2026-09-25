import { ComparePageContent } from "@/components/compare/ComparePageContent";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import {
  buildLandingBankCountsDisplay,
  getCachedBankStatsBundle,
} from "@/lib/marketing/question-bank-counts";
import { buildCompareJsonLd, buildCompareMetadata } from "@/lib/seo/marketing-metadata";

export const dynamic = "force-dynamic";
export const metadata = buildCompareMetadata();

export default async function ComparePage() {
  const { snapshot } = await getCachedBankStatsBundle();
  const bankCounts = buildLandingBankCountsDisplay(snapshot);
  return (
    <>
      <JsonLdScript data={buildCompareJsonLd()} />
      <ComparePageContent questionCountLabel={bankCounts.totalLabel} />
    </>
  );
}
