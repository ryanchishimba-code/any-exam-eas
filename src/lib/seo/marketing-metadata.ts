import type { Metadata } from "next";
import {
  EXAM_SEO_CONFIG,
  examMarketingPath,
  getExamSeoConfig,
  resolveExamSeoKey,
  type ExamSeoKey,
} from "@/lib/seo/exam-config";
import {
  RESOURCE_ARTICLES,
  type ResourceArticle,
} from "@/lib/seo/resources-content";
import {
  absoluteUrl,
  DEFAULT_OG_IMAGE_PATH,
  getSiteUrl,
} from "@/lib/seo";
import { LEGAL_ENTITY } from "@/lib/legal";
import { SITE_NAME, formatMonthlyPrice, formatTrialLabel } from "@/lib/site";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";

function baseOpenGraph(title: string, description: string, path: string): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  return {
    title,
    description,
    metadataBase: new URL(getSiteUrl()),
    alternates: { canonical: path },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [{ url: ogImage, width: 1200, height: 800, alt: title }],
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [ogImage],
    },
    robots: {
      index: true,
      follow: true,
      googleBot: { index: true, follow: true, "max-image-preview": "large" },
    },
  };
}

export function buildExamMetadata(slug: string): Metadata {
  const key = resolveExamSeoKey(slug);
  if (!key) return { title: "Board Exam Prep" };
  const config = getExamSeoConfig(key);
  const path = examMarketingPath(key);
  return {
    ...baseOpenGraph(config.metaTitle, config.metaDescription, path),
    keywords: config.keywords,
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    category: "education",
  };
}

export function buildResourcesHubMetadata(): Metadata {
  const title = "Board Exam Study Resources & Guides (2026)";
  const description = `Free study guides for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT — practice question tips, blueprints, and downloadable planners. ${formatTrialLabel()}.`;
  const path = "/resources";
  return {
    ...baseOpenGraph(title, description, path),
    keywords: [
      "board exam study guide",
      "NCLEX study resources",
      "USMLE study guide",
      "NAPLEX review",
      "PANCE prep guide",
      "NPTE study guide",
      "free board exam resources",
    ],
  };
}

export function buildResourceArticleMetadata(article: ResourceArticle): Metadata {
  const path = `/resources/${article.slug}`;
  return {
    ...baseOpenGraph(article.title, article.metaDescription, path),
    keywords: article.keywords,
  };
}

export function buildPricingMetadata(): Metadata {
  const title = "Pricing — Basic & Pro Board Exam Plans";
  const description = `14-day free trial · Basic from ${formatMonthlyPrice("basic")}/mo · Pro from ${formatMonthlyPrice("pro")}/mo · All 6 board exams included · Save up to 20% on annual.`;
  return {
    ...baseOpenGraph(title, description, "/pricing"),
  };
}

export function buildAboutMetadata(serveReadyTotalLabel?: string): Metadata {
  const title = "About Us — Liberating Premium Board Prep";
  const countPhrase = serveReadyTotalLabel
    ? `${serveReadyTotalLabel}`
    : "serve-ready, QA-gated questions";
  const description =
    `AnyExamEasy is premium board prep without the premium price — ${countPhrase}, Top 503 Drugs + clinical pearls, and roadmaps for USMLE, NCLEX, NAPLEX, PANCE, FNP & NPTE. Curated by licensed clinicians with 12+ years combined frontline experience. Proudly built in Texas.`;
  return {
    ...baseOpenGraph(title, description, "/about"),
    keywords: [
      "about AnyExamEasy",
      "affordable board exam prep",
      "clinician-curated question bank",
      "Top 503 drugs reference",
      "USMLE NCLEX NAPLEX PANCE FNP NPTE prep",
    ],
  };
}

export function buildExamJsonLd(key: ExamSeoKey) {
  const config = getExamSeoConfig(key);
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
          price: TIER_MONTHLY_USD.basic.toFixed(2),
          priceCurrency: "USD",
          description: `${formatTrialLabel()} · Basic from ${formatMonthlyPrice("basic")}/mo`,
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
    ],
  };
}

export function buildArticleJsonLd(article: ResourceArticle) {
  const url = absoluteUrl(`/resources/${article.slug}`);
  return {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.metaDescription,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt,
    author: { "@type": "Organization", name: LEGAL_ENTITY.companyName },
    publisher: {
      "@type": "Organization",
      name: LEGAL_ENTITY.companyName,
      logo: { "@type": "ImageObject", url: absoluteUrl("/icons/icon-192.png") },
    },
    mainEntityOfPage: url,
    inLanguage: "en-US",
  };
}

export function buildResourcesHubJsonLd() {
  const url = absoluteUrl("/resources");
  return {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Board Exam Study Resources",
    url,
    description:
      "Study guides and free resources for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT board exam prep.",
    hasPart: RESOURCE_ARTICLES.slice(0, 12).map((a) => ({
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
