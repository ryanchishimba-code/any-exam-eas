/**
 * America/Chicago crossword calendar. Safe for client components:
 * no puzzle answers and no heavy SEO imports.
 */

export const CROSSWORD_TIME_ZONE = "America/Chicago";

const EPOCH_UTC = Date.UTC(2024, 0, 1);

const centralDateFormatter = new Intl.DateTimeFormat("en-US", {
  timeZone: CROSSWORD_TIME_ZONE,
  year: "numeric",
  month: "2-digit",
  day: "2-digit",
});

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
  if (utc.getUTCFullYear() !== y || utc.getUTCMonth() !== m - 1 || utc.getUTCDate() !== d) {
    return null;
  }
  return utc;
}

/** Rejects malformed dates, dates before 2024-01-01, and dates after today in Chicago. */
export function parseCrosswordDate(date: string, now = new Date()): Date | null {
  const utc = utcMidnightFromIso(date);
  if (!utc) return null;
  if (utc.getTime() < EPOCH_UTC) return null;
  if (date > todayIsoCentral(now)) return null;
  return utc;
}

export function dayIndexFromIso(dateIso: string, now = new Date()): number | null {
  const parsed = parseCrosswordDate(dateIso, now);
  if (!parsed) return null;
  return Math.floor((parsed.getTime() - EPOCH_UTC) / 86_400_000);
}

export function addIsoDays(iso: string, days: number): string {
  const [y, m, d] = iso.split("-").map(Number);
  const dt = new Date(Date.UTC(y, (m ?? 1) - 1, (d ?? 1) + days));
  const month = String(dt.getUTCMonth() + 1).padStart(2, "0");
  const day = String(dt.getUTCDate()).padStart(2, "0");
  return `${dt.getUTCFullYear()}-${month}-${day}`;
}

export function formatCrosswordDate(iso: string): string {
  const parsed = utcMidnightFromIso(iso);
  if (!parsed) return iso;
  return parsed.toLocaleDateString("en-US", {
    timeZone: "UTC",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatCrosswordDateLong(iso: string): string {
  const parsed = utcMidnightFromIso(iso);
  if (!parsed) return iso;
  return parsed.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

/** UTC timestamp of the next America/Chicago midnight. */
export function nextChicagoMidnight(now = new Date()): number {
  const today = todayIsoCentral(now);
  const tomorrow = addIsoDays(today, 1);
  const [y, m, d] = tomorrow.split("-").map(Number);
  for (let hour = 3; hour <= 10; hour += 1) {
    const guess = Date.UTC(y, m - 1, d, hour, 0, 0);
    if (todayIsoCentral(new Date(guess)) !== tomorrow) continue;
    if (todayIsoCentral(new Date(guess - 60_000)) === today) return guess;
  }
  return now.getTime() + 86_400_000;
}

export function crosswordHubPath(): string {
  return "/crossword";
}

export function crosswordBoardPath(board: string): string {
  return `/crossword/${board}`;
}

export function crosswordDatedPath(board: string, dateIso: string): string {
  return `/crossword/${board}/${dateIso}`;
}

export function recentArchiveDates(days: number, now = new Date()): string[] {
  const today = todayIsoCentral(now);
  return Array.from({ length: days }, (_, index) => addIsoDays(today, -index));
}

export function formatClock(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const minutes = Math.floor(total / 60);
  const seconds = total % 60;
  return `${minutes}:${String(seconds).padStart(2, "0")}`;
}

export function formatCountdown(ms: number): string {
  const total = Math.max(0, Math.floor(ms / 1000));
  const hours = Math.floor(total / 3600);
  const minutes = Math.floor((total % 3600) / 60);
  const seconds = total % 60;
  return `${hours}:${String(minutes).padStart(2, "0")}:${String(seconds).padStart(2, "0")}`;
}
