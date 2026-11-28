import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { SCHEMA_BRAND_NAME } from "@/lib/seo/course-jsonld";

/** BreadcrumbList for a public page. Home is always the first crumb. No counts. */
export function publicBreadcrumbJsonLd(
  crumbs: { name: string; path: string }[]
): Record<string, unknown> {
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      { "@type": "ListItem", position: 1, name: "Home", item: site },
      ...crumbs.map((crumb, index) => ({
        "@type": "ListItem",
        position: index + 2,
        name: crumb.name,
        item: absoluteUrl(crumb.path),
      })),
    ],
  };
}

/**
 * LearningResource for a public study page. No ratings and no item counts.
 * Kept separate from the sitemap PR's helper so the two can rebase.
 */
export function publicLearningResourceNode(input: {
  name: string;
  description: string;
  path: string;
  learningResourceType: string;
}): Record<string, unknown> {
  const path = input.path.startsWith("/") ? input.path : `/${input.path}`;
  const site = getSiteUrl();
  return {
    "@type": "LearningResource",
    name: input.name,
    description: input.description,
    url: absoluteUrl(path),
    learningResourceType: input.learningResourceType,
    isAccessibleForFree: true,
    inLanguage: "en-US",
    provider: {
      "@type": "Organization",
      name: SCHEMA_BRAND_NAME,
      url: site,
    },
  };
}

export function publicLearningResourceJsonLd(input: {
  name: string;
  description: string;
  path: string;
  learningResourceType: string;
}): Record<string, unknown> {
  return { "@context": "https://schema.org", ...publicLearningResourceNode(input) };
}
