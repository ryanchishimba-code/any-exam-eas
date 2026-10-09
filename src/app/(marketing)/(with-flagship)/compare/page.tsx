import { ComparePageContent } from "@/components/compare/ComparePageContent";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { loadPublicQuestionCounts } from "@/lib/marketing/public-question-count";
import { buildCompareJsonLd, buildCompareMetadata } from "@/lib/seo/marketing-metadata";

/**
 * Five-minute ISR. This must stay a numeric literal (Next cannot analyze an
 * imported config value) and must match ACTIVE_INVENTORY_STAMP_TTL_SECONDS.
 */
export const revalidate = 300;
export const metadata = buildCompareMetadata();

export default async function ComparePage() {
  const { bundle, display: bankCounts } = await loadPublicQuestionCounts({ dynamic: false });
  const { inventory } = bundle;
  return (
    <>
      <JsonLdScript data={buildCompareJsonLd()} />
      <ComparePageContent
        questionCountLabel={bankCounts.totalLabel}
        nclexFormats={inventory.degraded ? null : inventory.boards.nclex?.formats ?? null}
      />
    </>
  );
}
