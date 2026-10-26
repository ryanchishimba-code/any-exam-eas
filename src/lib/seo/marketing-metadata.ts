import type { Metadata } from "next";
import {
  EXAM_SEO_CONFIG,
  examMarketingPath,
  resolveExamSeoKey,
  type ExamSeoKey,
} from "@/lib/seo/exam-config";
import {
  RESOURCE_ARTICLES,
  type ResourceArticle,
} from "@/lib/seo/resources-content";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_HEIGHT,
  DEFAULT_OG_IMAGE_PATH,
  DEFAULT_OG_IMAGE_WIDTH,
  dedupeKeywords,
  getSiteUrl,
} from "@/lib/seo";
import { LEGAL_ENTITY, organizationContactPoint } from "@/lib/legal";
import {
  SITE_NAME,
  formatMonthlyPrice,
  formatPricingCheckoutTrialOffer,
  formatTrialLabel,
  formatTrialQuestionLimit,
} from "@/lib/site";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { comparePageFaqJsonLdEntities } from "@/lib/seo/compare-faq";
import { SEO_LIVE_STATS, seoPlatformPitch } from "@/lib/seo/seo-copy";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatUsd } from "@/lib/seo/competitor-comparison";
import {
  enforceMetaDescription,
  enforceMetaTitle,
} from "@/lib/seo/meta-budget";
import type { FormatCounts } from "@/lib/inventory/active-questions";
import { ABOUT_FOUNDER } from "@/lib/marketing/about-copy";
import { CLINICAL_REVIEWERS } from "@/lib/marketing/company";
import { landingOgImage } from "@/lib/seo/landing-og-image";
import { publicExamSeo } from "@/lib/marketing/public-format-copy";

function baseOpenGraph(
  title: string,
  description: string,
  path: string,
  options?: { absoluteTitle?: boolean }
): Metadata {
  const safeTitle = enforceMetaTitle(title, path);
  const safeDescription = enforceMetaDescription(description, path);
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const titleField = options?.absoluteTitle ? { absolute: safeTitle } : safeTitle;
  return {
    title: titleField,
    description: safeDescription,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title: safeTitle,
      description: safeDescription,
      images: [{ url: ogImage, width: DEFAULT_OG_IMAGE_WIDTH, height: DEFAULT_OG_IMAGE_HEIGHT, alt: safeTitle }],
    },
    twitter: {
      card: "summary_large_image",
      title: safeTitle,
      description: safeDescription,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export function buildExamMetadata(
  slug: string,
  formats?: FormatCounts | null
): Metadata {
  const key = resolveExamSeoKey(slug);
  if (!key) return { title: "Board Exam Prep" };
  const config = publicExamSeo(key, formats ?? null);
  const path = examMarketingPath(key);
  return {
    ...baseOpenGraph(config.metaTitle, config.metaDescription, path, { absoluteTitle: true }),
    keywords: dedupeKeywords(config.keywords),
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    category: "education",
  };
}

export function buildResourcesHubMetadata(): Metadata {
  return buildToolkitHubMetadata();
}

export function buildFreeGuidesMetadata(): Metadata {
  const title = "Free Tools & Premium Books";
  const description = `Drug cards, anatomy, and six board hubs stay free. NCLEX, NAPLEX, FNP, and PANCE books include highlights on a ${formatTrialLabel()}, then Pro at ${formatMonthlyPrice("pro")}/mo.`;
  return {
    ...baseOpenGraph(title, description, "/free-guides", { absoluteTitle: true }),
    keywords: [
      "NCLEX reference book",
      "NAPLEX reference book",
      "FNP reference book",
      "PANCE reference book",
      "board exam toolkit",
      "free NCLEX practice",
    ],
  };
}

export function buildToolkitHubMetadata(): Metadata {
  const title = "Board Exam Toolkit — Official Links & Study Tools";
  const description =
    "Toolkit directory for six boards: official blueprints, lab values & calculators, Top 500 drugs, Anatomy Explorer, Roadmap, and exam study guides.";
  const path = "/toolkit";
  return {
    ...baseOpenGraph(title, description, path, { absoluteTitle: true }),
    keywords: [
      "board exam toolkit",
      "NCLEX test plan",
      "NAPLEX content outline",
      "USMLE official resources",
      "lab values calculators",
      "Top 500 drugs",
      "Anatomy Explorer",
      "Roadmap",
      "NCLEX study resources",
      "USMLE study guide",
      "NAPLEX review",
      "PANCE prep guide",
      "NPTE study guide",
      "board exam prep",
    ],
  };
}

export function buildResourceArticleMetadata(article: ResourceArticle): Metadata {
  const path = `/resources/${article.slug}`;
  return {
    ...baseOpenGraph(article.title, article.metaDescription, path, { absoluteTitle: true }),
    keywords: dedupeKeywords(article.keywords),
  };
}

export function buildPricingMetadata(totalLabel?: string): Metadata {
  const count = totalLabel?.trim();
  const title = "Pricing — 6 Board Exams, One Pro Plan";
  const description = count
    ? `One Pro plan: ${count} active questions for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE at ${formatMonthlyPrice("pro")}/mo. Includes Roadmap & Deep Dives. Start a ${SEO_LIVE_STATS.trialDays}-day trial now.`
    : `One Pro plan for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE at ${formatMonthlyPrice("pro")}/mo. Includes the Roadmap and Deep Dives. Start a ${SEO_LIVE_STATS.trialDays}-day free trial. Cancel anytime.`;
  return {
    ...baseOpenGraph(title, description, "/pricing", { absoluteTitle: true }),
    keywords: [
      "affordable multi-exam board prep",
      "affordable multi-exam prep",
      "affordable NCLEX Qbank",
      "USMLE question bank price",
      "NAPLEX prep subscription",
    ],
  };
}

export function buildCompareMetadata(): Metadata {
  const title = "Compare — multi-exam board prep";
  const description =
    `See how AnyExamEasy Pro (${formatMonthlyPrice("pro")}/mo) covers six boards with Roadmap, Deep Dives, and Full Exams — versus typical single-exam prep. Start a ${SEO_LIVE_STATS.trialDays}-day free trial.`;
  return {
    ...baseOpenGraph(title, description, "/compare", { absoluteTitle: true }),
    keywords: [
      "affordable multi-exam board prep",
      "multi-exam Qbank comparison",
      "six board exams one subscription",
      "affordable board exam prep 2026",
      "NCLEX USMLE NAPLEX one plan",
    ],
  };
}

export function buildCompareJsonLd() {
  const url = absoluteUrl("/compare");
  const site = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: "Compare", item: url },
        ],
      },
      {
        "@type": "FAQPage",
        mainEntity: comparePageFaqJsonLdEntities(),
      },
    ],
  };
}

const ABOUT_TITLE = "Any Exam Easy Exam Prep from the Founder";
const ABOUT_DESCRIPTION =
  "Any Exam Easy exam prep from founder Ryan Chishimba, PharmD. One plan for NCLEX, NAPLEX, USMLE, PANCE, FNP, and NPTE-PT. Start a 5-day free trial.";

export function buildAboutMetadata(serveReadyTotalLabel?: string): Metadata {
  const title = ABOUT_TITLE;
  // Description stays inside the meta budget without a bank-size slogan.
  const description = ABOUT_DESCRIPTION;
  void serveReadyTotalLabel;
  const card = landingOgImage("about");
  const base = baseOpenGraph(title, description, "/about", { absoluteTitle: true });
  return {
    ...base,
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    creator: LEGAL_ENTITY.companyName,
    publisher: LEGAL_ENTITY.companyName,
    openGraph: base.openGraph ? { ...base.openGraph, images: [card] } : undefined,
    twitter: base.twitter ? { ...base.twitter, images: [card.url] } : undefined,
    keywords: [
      "about AnyExamEasy",
      "NCLEX question bank",
      "NCLEX practice questions",
      "USMLE question bank",
      "affordable board exam prep",
      "QA-gated question bank",
      "one subscription six exams",
      "Roadmap board prep",
      "deep dive exam review",
      "full exam simulation",
      "multi-exam board prep",
      "adaptive roadmap NCLEX USMLE NAPLEX",
    ],
  };
}

export function buildExamJsonLd(key: ExamSeoKey, formats?: FormatCounts | null) {
  const config = publicExamSeo(key, formats ?? null);
  const url = absoluteUrl(examMarketingPath(key));
  const site = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: config.displayName, item: url },
        ],
      },
      {
        "@type": "Course",
        name: `${config.displayName} Board Exam Prep`,
        description: config.metaDescription,
        url,
        provider: { "@type": "Organization", name: LEGAL_ENTITY.companyName, url: site },
        educationalLevel: "Professional certification preparation",
        inLanguage: "en-US",
        offers: {
          "@type": "Offer",
          price: TIER_MONTHLY_USD.pro.toFixed(2),
          priceCurrency: "USD",
          description: formatPricingCheckoutTrialOffer(),
          url: absoluteUrl("/signup?plan=trial&tier=pro"),
        },
      },
      {
        "@type": "FAQPage",
        "@id": `${url}#faq`,
        mainEntity: config.faqs.map((faq) => ({
          "@type": "Question",
          name: faq.question,
          acceptedAnswer: { "@type": "Answer", text: faq.answer },
        })),
      },
      {
        "@type": "HowTo",
        name: `How to study for ${config.shortName} with AnyExamEasy`,
        description: `Blueprint-aligned ${config.shortName} study plan using adaptive Roadmap, Deep Dive modules, and Full Exam simulations.`,
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Start with a diagnostic set",
            text: `Complete an untimed ${config.shortName} question block to baseline your blueprint category scores.`,
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Follow your Roadmap",
            text: "Prioritize weak categories surfaced in your Roadmap instead of random question churn.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Review misses with Deep Dives",
            text: "Open rationales and eight-section Deep Dive modules on every incorrect or flagged item the same day.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Simulate before test day",
            text: "Run timed mock exams in the final 2–4 weeks to build pacing and endurance.",
          },
        ],
      },
    ],
  };
}

export function buildArticleJsonLd(article: ResourceArticle) {
  const url = absoluteUrl(`/resources/${article.slug}`);
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const site = getSiteUrl();

  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: "Toolkit", item: absoluteUrl("/toolkit") },
          { "@type": "ListItem", position: 3, name: article.title, item: url },
        ],
      },
      {
        "@type": "Article",
        headline: article.title,
        description: article.metaDescription,
        datePublished: article.publishedAt,
        dateModified: article.updatedAt,
        image: ogImage,
        author: { "@type": "Organization", name: LEGAL_ENTITY.companyName, url: site },
        publisher: {
          "@type": "Organization",
          name: LEGAL_ENTITY.companyName,
          logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-192.png") },
        },
        mainEntityOfPage: { "@type": "WebPage", "@id": url },
        inLanguage: "en-US",
        keywords: dedupeKeywords(article.keywords).join(", "),
      },
      ...(article.faq?.length
        ? [
            {
              "@type": "FAQPage",
              mainEntity: article.faq.map((item) => ({
                "@type": "Question",
                name: item.question,
                acceptedAnswer: { "@type": "Answer", text: item.answer },
              })),
            },
          ]
        : []),
    ],
  };
}

export function buildPricingJsonLd(totalLabel?: string) {
  const url = absoluteUrl("/pricing");
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: getSiteUrl() },
          { "@type": "ListItem", position: 2, name: "Pricing", item: url },
        ],
      },
      {
        "@type": "Product",
        name: `${SITE_NAME} Pro — All 6 Board Exams`,
        description: seoPlatformPitch(totalLabel),
        image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        brand: { "@type": "Brand", name: SITE_NAME },
        url,
        offers: {
          "@type": "Offer",
          price: TIER_MONTHLY_USD.pro.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/signup?plan=trial&tier=pro"),
          description: formatPricingCheckoutTrialOffer(),
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Does AnyExamEasy cover multiple board exams on one plan?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes — ${SITE_NAME} Pro includes NCLEX, USMLE (Steps 1–3), NAPLEX, PANCE, AANP FNP, and NPTE-PT on one subscription at ${formatMonthlyPrice("pro")}/mo instead of buying separate single-exam products for each board.`,
            },
          },
          {
            "@type": "Question",
            name: "What is included in the free trial?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `${formatTrialLabel()} with ${formatTrialQuestionLimit()} across all six board exams — no payment method required.`,
            },
          },
        ],
      },
    ],
  };
}

export function buildAboutJsonLd() {
  const url = absoluteUrl("/about");
  const site = getSiteUrl();
  const organizationId = `${site}#organization`;
  const founderId = `${url}#founder`;
  const nursing = CLINICAL_REVIEWERS.find((reviewer) => reviewer.id === "nursing");
  const people = [
    {
      "@type": "Person" as const,
      "@id": founderId,
      name: ABOUT_FOUNDER.name,
      jobTitle: ABOUT_FOUNDER.jobTitle,
    },
    {
      "@type": "Person" as const,
      "@id": `${url}#nursing`,
      name: nursing?.displayName ?? "Ileen Chishimba, RN",
      jobTitle: nursing?.jobTitle ?? "Nursing content review lead (NCLEX-RN/PN)",
    },
  ];
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "BreadcrumbList",
        itemListElement: [
          { "@type": "ListItem", position: 1, name: "Home", item: site },
          { "@type": "ListItem", position: 2, name: "About", item: url },
        ],
      },
      {
        "@type": "AboutPage",
        "@id": `${url}#webpage`,
        url,
        name: ABOUT_TITLE,
        description: ABOUT_DESCRIPTION,
        isPartOf: { "@type": "WebSite", name: SITE_NAME, url: site },
        about: { "@id": organizationId },
        mainEntity: { "@id": organizationId },
        mentions: people.map((person) => ({ "@id": person["@id"] })),
      },
      {
        "@type": "Organization",
        "@id": organizationId,
        name: LEGAL_ENTITY.companyName,
        url: site,
        logo: absoluteUrl("/icons/icon-192.png"),
        description: seoPlatformPitch(),
        foundingLocation: { "@type": "Place", name: "Texas, USA" },
        founder: { "@id": founderId },
        contactPoint: organizationContactPoint(),
      },
      ...people,
    ],
  };
}

export function buildResourcesHubJsonLd() {
  return buildToolkitHubJsonLd();
}

export function buildToolkitHubJsonLd() {
  const url = absoluteUrl("/toolkit");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "AnyExamEasy Toolkit",
    url,
    description:
      "Study-instrument directory for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT — official board documents, in-product tools, and exam guides.",
    hasPart: RESOURCE_ARTICLES.map((a) => ({
      "@type": "Article",
      name: a.title,
      url: absoluteUrl(`/resources/${a.slug}`),
    })),
  };
}

/** All public exam marketing paths for sitemap. */
export function getExamMarketingSitemapPaths(): string[] {
  return Object.keys(EXAM_SEO_CONFIG).map((key) => examMarketingPath(key as ExamSeoKey));
}
