import type { Metadata } from "next";
import { toPublicPuzzle } from "@/lib/daily-vitals/bank";
import { dailyVitalsPath, formatDailyVitalsDate } from "@/lib/daily-vitals/schedule";
import { getSiteUrl } from "@/lib/seo";

export const DAILY_VITALS_TITLE = "Daily Vitals: Free Daily Nursing Case | AnyExamEasy";

export const DAILY_VITALS_DESCRIPTION =
  "Free daily one-word nursing case. Six tries, the same clue for everyone until midnight US Central, then a short why. For study only, not medical advice.";

export function hubMetadata(): Metadata {
  const url = `${getSiteUrl()}${dailyVitalsPath()}`;
  return {
    title: { absolute: DAILY_VITALS_TITLE },
    description: DAILY_VITALS_DESCRIPTION,
    alternates: { canonical: url },
    openGraph: {
      title: DAILY_VITALS_TITLE,
      description: DAILY_VITALS_DESCRIPTION,
      url,
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: DAILY_VITALS_TITLE,
      description: DAILY_VITALS_DESCRIPTION,
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
  return {
    title: { absolute: title },
    description,
    alternates: { canonical: url },
    openGraph: { title, description, url, type: "website" },
    twitter: { card: "summary_large_image", title, description },
  };
}
