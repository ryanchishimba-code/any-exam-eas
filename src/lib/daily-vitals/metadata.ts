import type { Metadata } from "next";
import { toPublicPuzzle } from "@/lib/daily-vitals/bank";
import { dailyVitalsPath, formatDailyVitalsDate } from "@/lib/daily-vitals/schedule";
import { getSiteUrl } from "@/lib/seo";

export const DAILY_VITALS_TITLE = "Daily Vitals — One nursing case. One word. Every day.";

export const DAILY_VITALS_DESCRIPTION =
  "A free daily nursing case from AnyExamEasy. Six tries, then a short why. For study only, not medical advice.";

export const DAILY_VITALS_OG_PATH = "/images/og/daily-vitals.png";

export const DAILY_VITALS_OG_ALT = "Daily Vitals. One nursing case. One word. Every day.";

/** Preview HTML must point at the image on that deployment. Production uses the public site. */
export function dailyVitalsOgImageUrl(): string {
  const host = process.env.VERCEL_URL?.trim().replace(/^https?:\/\//, "").replace(/\/$/, "");
  if (process.env.VERCEL_ENV === "preview" && host) {
    return `https://${host}${DAILY_VITALS_OG_PATH}`;
  }
  return `${getSiteUrl()}${DAILY_VITALS_OG_PATH}`;
}

export function dailyVitalsShareImage() {
  return {
    url: dailyVitalsOgImageUrl(),
    width: 1200,
    height: 630,
    alt: DAILY_VITALS_OG_ALT,
    type: "image/png" as const,
  };
}

export function hubMetadata(): Metadata {
  const url = `${getSiteUrl()}${dailyVitalsPath()}`;
  const image = dailyVitalsShareImage();
  return {
    title: { absolute: DAILY_VITALS_TITLE },
    description: DAILY_VITALS_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: DAILY_VITALS_TITLE,
      description: DAILY_VITALS_DESCRIPTION,
      url,
      type: "website",
      images: [image],
    },
    twitter: {
      card: "summary_large_image",
      title: DAILY_VITALS_TITLE,
      description: DAILY_VITALS_DESCRIPTION,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}

export function dayMetadata(dateIso: string, now = new Date()): Metadata {
  const puzzle = toPublicPuzzle(dateIso, now);
  const label = formatDailyVitalsDate(dateIso);
  const title = puzzle
    ? `Daily Vitals ${label} | AnyExamEasy`
    : DAILY_VITALS_TITLE;
  const description = puzzle
    ? `Free ${puzzle.boardLabel} Daily Vitals case for ${label}. Six tries, one word, then a short why. For study only, not medical advice.`
    : DAILY_VITALS_DESCRIPTION;
  const url = `${getSiteUrl()}${dailyVitalsPath(dateIso)}`;
  const image = dailyVitalsShareImage();
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website", images: [image] },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [{ url: image.url, alt: image.alt }],
    },
  };
}
