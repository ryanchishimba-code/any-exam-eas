import type { Metadata } from "next";
import {
  SITE_DOMAIN,
  SITE_NAME,
  formatMonthlyPrice,
  formatTrialIntroPrice,
  formatTrialLabel,
} from "@/lib/site";
import { MONTHLY_PRICE_USD, TRIAL_DAYS } from "@/lib/stripe";

/** Canonical production URL — set NEXT_PUBLIC_SITE_URL in Vercel (e.g. https://www.anyexameasy.com). */
export function getSiteUrl(): string {
  const env = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "");
  if (env) return env;
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  return `https://www.${SITE_DOMAIN}`;
}

export const DEFAULT_OG_IMAGE_PATH = "/images/hero.jpg";

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

const HOME_KEYWORDS = [
  "NCLEX NGN prep",
  "NCLEX practice questions",
  "USMLE Step 1",
  "USMLE Step 2 CK",
  "NAPLEX study",
  "nursing board exam",
  "medical board exam",
  "personalized question bank",
  "board exam study tool",
];

export function buildHomeMetadata(): Metadata {
  const title = `${SITE_NAME} — NCLEX, USMLE & Board Exam Prep`;
  const description = `Board exam study support for NCLEX NGN, USMLE, and NAPLEX. OER-backed rationales, personalized practice, and progress tracking. ${formatTrialLabel()} from ${formatTrialIntroPrice()}, then ${formatMonthlyPrice()}/mo.`;
  const url = getSiteUrl();
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  return {
    title,
    description,
    keywords: HOME_KEYWORDS,
    authors: [{ name: SITE_NAME, url }],
    creator: SITE_NAME,
    publisher: SITE_NAME,
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
          width: 1200,
          height: 800,
          alt: "Healthcare student using Any Exam Easy for board-style NCLEX and USMLE study practice",
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
    description: `NCLEX NGN, USMLE, and NAPLEX study support with personalized practice and OER-backed rationales.`,
    icons: {
      icon: "/favicon.svg",
      apple: "/favicon.svg",
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
        name: SITE_NAME,
        url,
        logo: absoluteUrl("/favicon.svg"),
        description:
          "Board exam study support for nursing, medical, and pharmacy students preparing for NCLEX, USMLE, and NAPLEX.",
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
            urlTemplate: `${url}/study?q={search_term_string}`,
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
          description: `${TRIAL_DAYS}-day trial available from ${formatTrialIntroPrice()}`,
        },
        description:
          "Board exam study support with personalized practice, progress tracking, and OER-backed explanations for NCLEX, USMLE, and NAPLEX.",
      },
    ],
  };
}

/**
 * Performance tips (also configure in Vercel):
 * - Set NEXT_PUBLIC_SITE_URL for correct canonical/OG URLs
 * - Enable Vercel Speed Insights + Image Optimization
 * - hero.jpg: keep under 150KB WebP/JPEG; run `npx @squoosh/cli --webp auto public/images/hero.jpg`
 * - Use `next/dynamic` for below-the-fold client sections (see page.tsx)
 */
export const PERFORMANCE_HINTS = [
  "Hero image uses priority loading and responsive sizes",
  "Below-fold sections are code-split via next/dynamic",
  "Local /public assets avoid third-party image latency",
  "Prefer WebP/AVIF exports of hero.jpg for smaller LCP payload",
] as const;
