import { ComparePageContent } from "@/components/compare/ComparePageContent";
import { JsonLdScript } from "@/components/seo/JsonLdScript";
import { buildCompareJsonLd, buildCompareMetadata } from "@/lib/seo/marketing-metadata";

export const metadata = buildCompareMetadata();

export default function ComparePage() {
  return (
    <>
      <JsonLdScript data={buildCompareJsonLd()} />
      <ComparePageContent />
    </>
  );
}
