/**
 * Question of the Day helpers that are safe to import from client components.
 * The answer key lives in `qotd.ts` and must not be bundled into the page.
 */

import type { ExamSlug } from "@/types/edtech";
import { getSiteUrl } from "@/lib/seo";
import { examMarketingPath, type ExamSeoKey } from "@/lib/seo/exam-config";

export type QotdItem = {
  id: string;
  examSlug: ExamSlug;
  examLabel: string;
  examColor: string;
  stem: string;
  options: string[];
  /** Index of `correct` in `options`. Stays on the server with the key. */
  correctIndex: 0 | 1 | 2 | 3;
  correct: string;
  rationale: string;
  /** Guideline or label URLs. Empty when this item's citation was not revised. */
  sources: readonly string[];
};

/** Stem and choices only — no key, rationale, or citation list. */
export type QotdPublicItem = Omit<QotdItem, "correct" | "rationale" | "correctIndex" | "sources">;

export const QOTD_TIME_ZONE = "America/Chicago";

const EPOCH_UTC = Date.UTC(2024, 0, 1);

const centralDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: QOTD_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

/** YYYY-MM-DD for the America/Chicago calendar day that contains `now`. */
export function todayIsoCentral(now = new Date()): string {
  const parts = centralDateFormatter.formatToParts(now);
  const year = parts.find((part) => part.type === "year")?.value;
  const month = parts.find((part) => part.type === "month")?.value;
  const day = parts.find((part) => part.type === "day")?.value;
  if (!year || !month || !day) {
    throw new Error("Unable to format the America/Chicago calendar date");
  }
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}`;
}

function utcMidnightFromIso(date: string): Date | null {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) return null;
  const [y, m, d] = date.split("-").map(Number);
  if (!y || !m || !d) return null;
  const utc = new Date(Date.UTC(y, m - 1, d));
  if (
    utc.getUTCFullYear() !== y ||
    utc.getUTCMonth() !== m - 1 ||
    utc.getUTCDate() !== d
  ) {
    return null;
  }
  return utc;
}

/**
 * Parse a dated share URL. Rejects malformed dates, dates before 2024-01-01,
 * and any calendar date after today in America/Chicago. A null result must
 * 404 — it must not fall through to item 01.
 */
export function parseQotdDate(date: string, now = new Date()): Date | null {
  const utc = utcMidnightFromIso(date);
  if (!utc) return null;
  if (utc.getTime() < EPOCH_UTC) return null;
  if (date > todayIsoCentral(now)) return null;
  return utc;
}

/** Days since 2024-01-01, or null when the date must not be served. */
export function dayIndexFromIso(dateIso: string, now = new Date()): number | null {
  const parsed = parseQotdDate(dateIso, now);
  if (!parsed) return null;
  return Math.floor((parsed.getTime() - EPOCH_UTC) / 86_400_000);
}

export function toPublicQotd(item: QotdItem): QotdPublicItem {
  return {
    id: item.id,
    examSlug: item.examSlug,
    examLabel: item.examLabel,
    examColor: item.examColor,
    stem: item.stem,
    options: [...item.options],
  };
}

export function qotdPath(exam: ExamSlug, dateIso?: string): string {
  if (dateIso) return `/daily/${exam}/${dateIso}`;
  return `/daily/${exam}`;
}

export function qotdAbsoluteUrl(exam: ExamSlug, dateIso: string): string {
  return `${getSiteUrl()}${qotdPath(exam, dateIso)}`;
}

export function qotdShareCaption(
  item: Pick<QotdItem, "examLabel" | "stem">,
  dateIso: string
): string {
  const stem =
    item.stem.length > 140 ? `${item.stem.slice(0, 137).trimEnd()}…` : item.stem;
  return `${item.examLabel} Question of the Day (${dateIso}): ${stem}`;
}

export function qotdEntityId(exam: ExamSlug, dateIso: string): string {
  return `qotd-${exam}-${dateIso}`;
}

export function examMarketingHref(exam: ExamSlug): string {
  return examMarketingPath(exam as ExamSeoKey);
}

/**
 * Format a calendar date for display. Uses UTC so the YYYY-MM-DD string is
 * not shifted into the previous evening. Availability is decided separately.
 */
export function formatQotdDisplayDate(dateIso: string): string {
  const parsed = utcMidnightFromIso(dateIso);
  if (!parsed) return dateIso;
  return parsed.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}
