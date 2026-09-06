import type { Metadata } from "next";
import {
  SITE_DOMAIN,
  SITE_NAME,
  formatMonthlyPrice,
  formatTrialLabel,
  formatTrialQuestionLimit,
} from "@/lib/site";
import { LEGAL_ENTITY } from "@/lib/legal";
import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS, MONTHLY_PRICE_USD } from "@/lib/billing-config";
import {
  enforceMetaDescription,
  enforceMetaTitle,
} from "@/lib/seo/meta-budget";

const PRODUCTION_SITE_URL = `https://www.${SITE_DOMAIN}`;

function isLocalhostUrl(url: string): boolean {
  return /localhost|127\.0\.0\.1/i.test(url);
}

/** Canonical public site URL for metadata, sitemap, and OG tags. */
export function getSiteUrl(): string {
  const fromEnv = process.env.NEXT_PUBLIC_SITE_URL?.trim().replace(/\/$/, "");
  if (fromEnv && !(process.env.NODE_ENV === "production" && isLocalhostUrl(fromEnv))) {
    return fromEnv;
  }

  const vercelProduction = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim().replace(/\/$/, "");
  if (vercelProduction) {
    return vercelProduction.startsWith("http")
      ? vercelProduction
      : `https://${vercelProduction}`;
  }

  // Production deploys must not advertise ephemeral *.vercel.app hostnames in SEO.
  if (process.env.VERCEL_ENV === "production") {
    return PRODUCTION_SITE_URL;
  }

  const vercelUrl = process.env.VERCEL_URL?.trim();
  if (vercelUrl && process.env.VERCEL_ENV === "preview") {
    return `https://${vercelUrl}`;
  }

  if (process.env.NODE_ENV === "development") {
    return "http://localhost:3000";
  }

  return PRODUCTION_SITE_URL;
}

export const DEFAULT_OG_IMAGE_PATH = "/images/og-share.jpg";
export const DEFAULT_OG_IMAGE_WIDTH = 1200;
export const DEFAULT_OG_IMAGE_HEIGHT = 630;

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

import { SEO_KEYWORD_CLUSTERS, SEO_LIVE_STATS, seoPlatformPitch } from "@/lib/seo/seo-copy";

const HOME_KEYWORDS = [
  "NCLEX question bank",
  "NCLEX practice questions",
  "USMLE question bank",
  ...SEO_KEYWORD_CLUSTERS.nclex,
  ...SEO_KEYWORD_CLUSTERS.naplex,
  ...SEO_KEYWORD_CLUSTERS.usmle,
  ...SEO_KEYWORD_CLUSTERS.multiExam,
  "PANCE exam prep",
  "AANP FNP certification prep",
  "NPTE-PT board prep",
  "spaced repetition board prep",
  "clinician-built Qbank",
  "one subscription six exams",
  "AnyExamEasy",
];

export function buildHomeMetadata(totalQuestionsLabel?: string): Metadata {
  const count = totalQuestionsLabel?.trim() || SEO_LIVE_STATS.questionCount;
  const title = enforceMetaTitle(
    `One Study System. Six Boards. — ${count} Questions`,
    "home"
  );
  const description = enforceMetaDescription(
    `${count} QA-gated questions with Blueprint Roadmaps and full-length mocks for USMLE, NCLEX, NAPLEX, PANCE, AANP FNP & NPTE-PT. Free ${SEO_LIVE_STATS.trialDays}-day trial — no card.`,
    "home"
  );
  const url = getSiteUrl();
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  return {
    title: { absolute: title },
    description,
    keywords: HOME_KEYWORDS,
    authors: [{ name: SITE_NAME, url }],
    creator: LEGAL_ENTITY.companyName,
    publisher: LEGAL_ENTITY.companyName,
    metadataBase: new URL(url),
    alternates: {
      canonical: "/",
    },
    openGraph: {
      type: "website",
      locale: "en_US",
      url,
      siteName: SITE_NAME,
      title,
      description,
      images: [
        {
          url: ogImage,
          width: DEFAULT_OG_IMAGE_WIDTH,
          height: DEFAULT_OG_IMAGE_HEIGHT,
          alt: "AnyExamEasy — one subscription for NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, and NPTE-PT",
        },
      ],
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
      googleBot: {
        index: true,
        follow: true,
        "max-image-preview": "large",
        "max-snippet": -1,
      },
    },
    category: "education",
  };
}

export function buildRootMetadata(): Metadata {
  return {
    metadataBase: new URL(getSiteUrl()),
    title: {
      default: `${SITE_NAME} — Board Exam Study Support`,
      template: `%s | ${SITE_NAME}`,
    },
    description: `USMLE, NCLEX, NAPLEX, PANCE, AANP FNP, and NPTE-PT study support with integrated Roadmaps and adaptive practice.`,
    icons: {
      icon: [
        { url: "/favicon.svg", type: "image/svg+xml" },
        { url: "/icons/icon-48.png", sizes: "48x48", type: "image/png" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
      shortcut: "/icons/icon-48.png",
    },
    manifest: "/manifest.webmanifest",
    other: {
      "theme-color": "#0d9488",
    },
  };
}

/** JSON-LD for homepage — Organization + WebSite with search action. */
export function buildHomeJsonLd() {
  const url = getSiteUrl();
  return {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "Organization",
        "@id": `${url}/#organization`,
        name: LEGAL_ENTITY.companyName,
        legalName: LEGAL_ENTITY.companyName,
        url,
        logo: absoluteUrl("/icons/icon-192.png"),
        description: `${LEGAL_ENTITY.productName} — ${seoPlatformPitch()}`,
        sameAs: [url],
      },
      {
        "@type": "WebSite",
        "@id": `${url}/#website`,
        url,
        name: SITE_NAME,
        publisher: { "@id": `${url}/#organization` },
        inLanguage: "en-US",
        potentialAction: {
          "@type": "SearchAction",
          target: {
            "@type": "EntryPoint",
            urlTemplate: `${url}/toolkit?q={search_term_string}`,
          },
          "query-input": "required name=search_term_string",
        },
      },
      {
        "@type": "SoftwareApplication",
        name: SITE_NAME,
        applicationCategory: "EducationalApplication",
        operatingSystem: "Web",
        offers: {
          "@type": "Offer",
          price: MONTHLY_PRICE_USD,
          priceCurrency: "USD",
          description: `${TRIAL_DAYS}-day free trial · ${TRIAL_LIFETIME_QUESTIONS} practice questions · no payment required · Pro at ${formatMonthlyPrice("pro")}/mo · save up to 20% on annual`,
          url: absoluteUrl("/pricing"),
        },
        description: seoPlatformPitch(),
      },
      {
        "@type": "Product",
        name: `${SITE_NAME} Pro — Multi-Exam Board Prep`,
        description: seoPlatformPitch(),
        image: absoluteUrl(DEFAULT_OG_IMAGE_PATH),
        brand: { "@type": "Brand", name: SITE_NAME },
        offers: {
          "@type": "Offer",
          price: MONTHLY_PRICE_USD,
          priceCurrency: "USD",
          availability: "https://schema.org/InStock",
          url: absoluteUrl("/signup?plan=trial&tier=pro"),
          priceValidUntil: `${new Date().getFullYear()}-12-31`,
          description: `${SEO_LIVE_STATS.trialDays}-day free trial · ${SEO_LIVE_STATS.moneyBackDays}-day money-back guarantee`,
        },
      },
      {
        "@type": "HowTo",
        name: "How to study for NCLEX, USMLE, or NAPLEX with AnyExamEasy",
        description:
          "A blueprint-aligned study workflow using adaptive Roadmaps, Deep Dive review, and Full Exam simulations.",
        step: [
          {
            "@type": "HowToStep",
            position: 1,
            name: "Choose your exam",
            text: "Select NCLEX, USMLE, NAPLEX, PANCE, AANP FNP, or NPTE-PT — all six share one subscription.",
          },
          {
            "@type": "HowToStep",
            position: 2,
            name: "Follow your Blueprint Roadmap",
            text: "Complete daily question sets prioritized by weak blueprint categories surfaced in your Roadmap.",
          },
          {
            "@type": "HowToStep",
            position: 3,
            name: "Review with Deep Dives",
            text: "Open rationales and eight-section Deep Dive modules for missed topics.",
          },
          {
            "@type": "HowToStep",
            position: 4,
            name: "Reinforce with Spaced Repetition",
            text: "Queue weak topics and memory cards for spaced review before timed mock exams.",
          },
        ],
      },
    ],
  };
}

/**
 * Performance tips (also configure in Vercel):
 * - Set NEXT_PUBLIC_SITE_URL for correct canonical/OG URLs
 * - Enable Vercel Speed Insights + Image Optimization
 * - og-share.jpg: 1200×630 social card; keep under ~200KB JPEG
 * - hero.jpg: on-page hero only; keep under 150KB WebP/JPEG
 * - Use `next/dynamic` for below-the-fold client sections (see page.tsx)
 */
export const PERFORMANCE_HINTS = [
  "Hero image uses priority loading, WebP, and responsive sizes (no unoptimized PNG)",
  "Below-fold landing sections mount via DeferredMount + next/dynamic",
  "Nav logo uses a compact asset with explicit sizes to avoid oversized preloads",
  "Local /public assets avoid third-party image latency",
] as const;
