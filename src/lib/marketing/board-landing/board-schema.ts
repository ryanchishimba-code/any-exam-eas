import { absoluteUrl, getSiteUrl } from "@/lib/seo";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import { DEFAULT_OG_IMAGE_PATH } from "@/lib/seo";
import { ROUTES } from "@/lib/routes";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { SITE_NAME, formatMonthlyPrice } from "@/lib/site";

/** Stamped on board landing JSON-LD and the visible “Updated” marker. */
export const BOARD_LANDING_DATE_MODIFIED = "2026-10-24";
export const BOARD_LANDING_CONTENT_YEAR = 2026;

export function freeBoardMetaTitle(boardLabel: string): string {
  const price = formatMonthlyPrice("pro");
  return `Free ${boardLabel} Practice Questions & Qbank (${BOARD_LANDING_CONTENT_YEAR}) | ${price}/mo`;
}

type GraphNode = Record<string, unknown>;

export function boardLandingBaseGraph(input: {
  pagePath: string;
  breadcrumbName: string;
  productDescription: string;
  trialHref: string;
  faqs: { question: string; answer: string }[];
  pageName: string;
}): GraphNode[] {
  const site = getSiteUrl();
  const pageUrl = absoluteUrl(input.pagePath);
  const price = formatMonthlyPrice("pro");
  const trialHref = absoluteUrl(input.trialHref);
  return [
    {
      "@type": "Organization",
      "@id": `${site}/#organization`,
      name: LEGAL_ENTITY.companyName,
      legalName: LEGAL_ENTITY.companyName,
      url: site,
      logo: absoluteUrl("/icons/icon-192.png"),
      contactPoint: organizationContactPoint(),
    },
    {
      "@type": "WebPage",
      "@id": pageUrl,
      url: pageUrl,
      name: input.pageName,
      dateModified: BOARD_LANDING_DATE_MODIFIED,
      isPartOf: { "@type": "WebSite", name: SITE_NAME, url: site },
    },
    {
      "@type": "BreadcrumbList",
      itemListElement: [
        { "@type": "ListItem", position: 1, name: "Home", item: site },
        { "@type": "ListItem", position: 2, name: input.breadcrumbName, item: pageUrl },
      ],
    },
    {
      "@type": "Product",
      name: `${SITE_NAME} Pro`,
      description: input.productDescription,
      image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
      brand: { "@type": "Brand", name: SITE_NAME },
      url: absoluteUrl(ROUTES.pricing),
      offers: {
        "@type": "Offer",
        price: TIER_MONTHLY_USD.pro.toFixed(2),
        priceCurrency: "USD",
        availability: "https://schema.org/InStock",
        url: trialHref,
        description: `${TRIAL_DAYS}-day free trial, then ${price} a month. No payment method to start.`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${pageUrl}#faq`,
      mainEntity: input.faqs.map((faq) => ({
        "@type": "Question",
        name: faq.question,
        acceptedAnswer: { "@type": "Answer", text: faq.answer },
      })),
    },
  ];
}
