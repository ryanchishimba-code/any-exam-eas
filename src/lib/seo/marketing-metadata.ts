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
import { SITE_NAME, formatMonthlyPrice, formatTrialLabel, formatTrialQuestionLimit } from "@/lib/site";
import { TIER_MONTHLY_USD } from "@/lib/subscription-tiers";
import { SEO_LIVE_STATS, seoPlatformPitch } from "@/lib/seo/seo-copy";
import { TRIAL_DAYS } from "@/lib/billing-config";

function baseOpenGraph(
  title: string,
  description: string,
  path: string,
  options?: { absoluteTitle?: boolean }
): Metadata {
  const url = absoluteUrl(path);
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH);
  const titleField = options?.absoluteTitle ? { absolute: title } : title;
  return {
    title: titleField,
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
    ...baseOpenGraph(config.metaTitle, config.metaDescription, path, { absoluteTitle: true }),
    keywords: config.keywords,
    authors: [{ name: SITE_NAME, url: getSiteUrl() }],
    category: "education",
  };
}

export function buildResourcesHubMetadata(): Metadata {
  return buildToolkitHubMetadata();
}

export function buildToolkitHubMetadata(): Metadata {
  const title = `Board Exam Toolkit — NCLEX, USMLE & NAPLEX Study Guides (2026) | ${SITE_NAME}`;
  const description = `${SEO_LIVE_STATS.questionCount} practice questions, ${SEO_LIVE_STATS.topDrugsLabel}, AI Tutor, and adaptive Blueprint Roadmaps for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT. ${SEO_LIVE_STATS.trialDays}-day free trial.`;
  const path = "/toolkit";
  return {
    ...baseOpenGraph(title, description, path, { absoluteTitle: true }),
    keywords: [
      "board exam toolkit",
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
    keywords: article.keywords,
  };
}

export function buildPricingMetadata(): Metadata {
  const title = `Pricing — Best Value Multi-Exam Board Prep | ${SITE_NAME} Pro (2026)`;
  const description = `All 6 board exams (NCLEX, USMLE, NAPLEX, PANCE, FNP, NPTE) on one Pro plan at ${formatMonthlyPrice("pro")}/mo. ${SEO_LIVE_STATS.questionCount} questions · ${SEO_LIVE_STATS.topDrugsLabel} · AI Tutor · ${SEO_LIVE_STATS.trialDays}-day free trial · ${SEO_LIVE_STATS.moneyBackDays}-day money-back guarantee.`;
  return {
    ...baseOpenGraph(title, description, "/pricing", { absoluteTitle: true }),
    keywords: [
      "UWorld alternative pricing",
      "best value multi-exam prep",
      "affordable NCLEX Qbank",
      "USMLE question bank price",
      "NAPLEX prep subscription",
    ],
  };
}

export function buildAboutMetadata(serveReadyTotalLabel?: string): Metadata {
  const title = `About ${SITE_NAME} — Clinician-Built Board Prep (12+ Years)`;
  const countPhrase = serveReadyTotalLabel ?? SEO_LIVE_STATS.questionCount;
  const description = `${SITE_NAME} is QA-gated, clinician-built board prep (${SEO_LIVE_STATS.clinicianYears} years combined) with ${countPhrase} practice questions, ${SEO_LIVE_STATS.topDrugsLabel}, AI Tutor, adaptive Blueprint Roadmaps, and Spaced Repetition for NCLEX, USMLE, NAPLEX, PANCE, FNP & NPTE. Proudly built in Texas.`;
  return {
    ...baseOpenGraph(title, description, "/about", { absoluteTitle: true }),
    keywords: [
      "about AnyExamEasy",
      "affordable board exam prep",
      "clinician-curated question bank",
      "Top 509 drugs reference",
      "AI tutor board prep",
      "adaptive roadmap NCLEX USMLE NAPLEX",
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
          price: TIER_MONTHLY_USD.pro.toFixed(2),
          priceCurrency: "USD",
          description: `${formatTrialLabel()} · Pro at ${formatMonthlyPrice("pro")}/mo`,
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
        description: `Blueprint-aligned ${config.shortName} study plan using adaptive Roadmaps, AI Tutor, and spaced repetition.`,
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
            name: "Follow your Blueprint Roadmap",
            text: "Prioritize weak categories surfaced in your Roadmap instead of random question churn.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Review misses with AI Tutor",
            text: "Open rationales and AI Tutor coaching on every incorrect or flagged item the same day.",
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
        keywords: article.keywords.join(", "),
      },
    ],
  };
}

export function buildPricingJsonLd() {
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
        description: seoPlatformPitch(),
        image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        brand: { "@type": "Brand", name: SITE_NAME },
        url,
        offers: {
          "@type": "Offer",
          price: TIER_MONTHLY_USD.pro.toFixed(2),
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/signup?plan=trial&tier=pro"),
          description: `${TRIAL_DAYS}-day free trial · ${SEO_LIVE_STATS.moneyBackDays}-day money-back guarantee · ${formatTrialQuestionLimit()}`,
        },
      },
      {
        "@type": "FAQPage",
        mainEntity: [
          {
            "@type": "Question",
            name: "Is AnyExamEasy a UWorld alternative?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `Yes — ${SITE_NAME} Pro includes NCLEX, USMLE (Steps 1–3), NAPLEX, PANCE, AANP FNP, and NPTE-PT on one subscription at ${formatMonthlyPrice("pro")}/mo instead of paying per exam.`,
            },
          },
          {
            "@type": "Question",
            name: "What is included in the free trial?",
            acceptedAnswer: {
              "@type": "Answer",
              text: `${formatTrialLabel()} with ${formatTrialQuestionLimit()} across all six board exams — no payment required.`,
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
        "@type": "Organization",
        name: LEGAL_ENTITY.companyName,
        url: site,
        logo: absoluteUrl("/icons/icon-192.png"),
        description: seoPlatformPitch(),
        foundingLocation: { "@type": "Place", name: "Texas, USA" },
      },
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
      "Complete board exam prep toolkit for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT — exam breakdowns, study guides, and readiness tools.",
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
