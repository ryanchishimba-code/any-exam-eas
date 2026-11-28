import { absoluteUrl } from "@/lib/seo";
import { organizationRef } from "@/lib/seo/brand-entity";

export type BreadcrumbCrumb = { name: string; path: string };

/**
 * Every crumb has a non-empty name and an absolute item URL.
 * Google's breadcrumb report shows "Unnamed item" when a ListItem has a URL and no name.
 */
export function breadcrumbListNode(crumbs: readonly BreadcrumbCrumb[]): Record<string, unknown> {
  const items = crumbs
    .map((crumb) => ({
      name: crumb.name.trim(),
      path: crumb.path.startsWith("/") ? crumb.path : `/${crumb.path}`,
    }))
    .filter((crumb) => crumb.name.length > 0);
  if (items.length === 0) {
    throw new Error("BreadcrumbList needs at least one named item");
  }
  return {
    "@type": "BreadcrumbList",
    itemListElement: items.map((crumb, index) => {
      const url = absoluteUrl(crumb.path);
      return {
        "@type": "ListItem",
        position: index + 1,
        name: crumb.name,
        item: url,
      };
    }),
  };
}

/** BreadcrumbList for a public page. Home is always the first crumb. No counts. */
export function publicBreadcrumbJsonLd(crumbs: readonly BreadcrumbCrumb[]): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    ...breadcrumbListNode([{ name: "Home", path: "/" }, ...crumbs]),
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
  return {
    "@type": "LearningResource",
    name: input.name,
    description: input.description,
    url: absoluteUrl(path),
    learningResourceType: input.learningResourceType,
    isAccessibleForFree: true,
    inLanguage: "en-US",
    provider: organizationRef(),
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
