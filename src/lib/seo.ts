import type { Metadata } from "next";
import {
  SITE_DOMAIN,
  SITE_NAME,
  formatMonthlyPrice,
  formatTrialLabel,
} from "@/lib/site";
import { LEGAL_ENTITY } from "@/lib/legal";
import { TRIAL_DAYS } from "@/lib/billing-config";

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

export const DEFAULT_OG_IMAGE_PATH = "/images/hero.jpg";

export function absoluteUrl(path: string): string {
  return `${getSiteUrl()}${path.startsWith("/") ? path : `/${path}`}`;
}

const HOME_KEYWORDS = [
  "NCLEX prep",
  "NCLEX practice questions",
  "USMLE Step 2 CK",
  "NAPLEX study",
  "PANCE prep",
  "PANCE practice questions",
  "AANP FNP",
  "AANPCB FNP certification",
  "affordable board exam prep",
  "UWorld alternative",
  "nursing board exam",
  "medical board exam",
  "adaptive practice",
  "board exam study tool",
];

export function buildHomeMetadata(): Metadata {
  const title = `${SITE_NAME} — Pass Your Boards with Confidence`;
  const description = `Professional board prep for USMLE, NCLEX, NAPLEX, PANCE, and AANP FNP — Basic from ${formatMonthlyPrice("basic")}/mo. ${formatTrialLabel()} · no credit card required.`;
  const url = getSiteUrl();
  const ogImage = absoluteUrl(DEFAULT_OG_IMAGE_PATH);

  return {
    title,
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
          width: 1200,
          height: 800,
          alt: "Healthcare student using Any Exam Easy for USMLE, NCLEX, NAPLEX, PANCE, and AANP FNP board exam prep",
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
    description: `USMLE, NCLEX, NAPLEX, PANCE, and AANP FNP study support with integrated Roadmaps and adaptive practice.`,
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
        description:
          `${LEGAL_ENTITY.productName} — board exam prep for students preparing for USMLE, NCLEX, NAPLEX, PANCE, and AANP FNP.`,
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
          description: `${TRIAL_DAYS}-day free trial · no credit card required · Basic from ${formatMonthlyPrice("basic")}/mo · Pro from ${formatMonthlyPrice("pro")}/mo · save up to 20% on annual`,
        },
        description:
          "Board exam prep with integrated Roadmaps, adaptive practice, and OER-backed explanations for USMLE, NCLEX, NAPLEX, PANCE, and AANP FNP.",
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
