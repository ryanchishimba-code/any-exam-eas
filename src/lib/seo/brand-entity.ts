import { CANONICAL_ORIGIN } from "@/lib/seo/crawl-policy";
import { BRAND_ICON } from "@/lib/marketing/brand";
import { organizationContactPoint, LEGAL_ENTITY } from "@/lib/legal";

/**
 * One brand sentence for Organization JSON-LD, the web manifest, the footer,
 * and the about meta description. No ratings and no address: the product is online only.
 */
export const BRAND_DESCRIPTION =
  "Practice questions for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT, with a rationale for every option. One Pro plan after a 5-day free trial.";

/** Stable id. Preview hosts still point at this production entity. */
export const ORGANIZATION_ID = `${CANONICAL_ORIGIN}/#organization`;

export const BRAND_LOGO_URL = `${CANONICAL_ORIGIN}${BRAND_ICON.src}`;

/**
 * Official social profile URLs that already appear as profiles in the repo.
 * Share-intent links (twitter.com/intent, facebook.com/sharer, linkedin.com/sharing)
 * are not profiles, so they are not listed. No handles were guessed.
 */
export const BRAND_SAME_AS: readonly string[] = [];

/** Reference used by Course, Article, and LearningResource instead of a second Organization. */
export function organizationRef(): { "@id": string } {
  return { "@id": ORGANIZATION_ID };
}

/** The only full Organization node. Rendered on the homepage. */
export function organizationJsonLdNode(): Record<string, unknown> {
  const node: Record<string, unknown> = {
    "@type": "EducationalOrganization",
    "@id": ORGANIZATION_ID,
    name: "AnyExamEasy",
    legalName: LEGAL_ENTITY.companyName,
    url: CANONICAL_ORIGIN,
    logo: {
      "@type": "ImageObject",
      url: BRAND_LOGO_URL,
      width: BRAND_ICON.width,
      height: BRAND_ICON.height,
    },
    description: BRAND_DESCRIPTION,
    email: LEGAL_ENTITY.supportEmail,
    contactPoint: organizationContactPoint(),
  };
  if (BRAND_SAME_AS.length > 0) node.sameAs = [...BRAND_SAME_AS];
  return node;
}
