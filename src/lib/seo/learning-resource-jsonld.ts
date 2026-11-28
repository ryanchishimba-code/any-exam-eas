import { organizationRef } from "@/lib/seo/brand-entity";
import { CANONICAL_ORIGIN } from "@/lib/seo/crawl-policy";

/** LearningResource for a public study tool. No ratings and no invented counts. */
export function buildLearningResourceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  learningResourceType: string;
}): Record<string, unknown> {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  return {
    "@context": "https://schema.org",
    "@type": "LearningResource",
    name: input.name,
    description: input.description,
    url: `${CANONICAL_ORIGIN}${path}`,
    learningResourceType: input.learningResourceType,
    isAccessibleForFree: true,
    inLanguage: "en-US",
    provider: organizationRef(),
  };
}
