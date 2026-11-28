/**
 * Daily Vitals uses the same America/Chicago calendar as the crossword and
 * the question of the day.
 *
 * The game is a sibling page at /daily-vitals, not a section of /daily.
 * /daily is the question of the day, with /daily/[exam] and /daily/[exam]/[date]
 * already taken. Putting the game there would replace or collide with that tool.
 */

export {
  addIsoDays,
  dayIndexFromIso,
  parseCrosswordDate as parseDailyVitalsDate,
  todayIsoCentral,
} from "@/lib/crossword/schedule";

export const DAILY_VITALS_PATH = "/daily-vitals";

/** Public brand line on the share card. Friends are sent to the real game URL. */
export const DAILY_VITALS_SHARE_LABEL = "anyexameasy.com/daily-vitals";

export const DAILY_VITALS_SHARE_URL = "https://www.anyexameasy.com/daily-vitals";

export function dailyVitalsPath(dateIso?: string): string {
  if (!dateIso) return DAILY_VITALS_PATH;
  return `${DAILY_VITALS_PATH}/${dateIso}`;
}

export function formatDailyVitalsDate(iso: string): string {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(iso)) return iso;
  const [y, m, d] = iso.split("-").map(Number);
  const utc = new Date(Date.UTC(y, (m ?? 1) - 1, d ?? 1));
  return utc.toLocaleDateString("en-US", {
    timeZone: "UTC",
    weekday: "long",
    month: "short",
    day: "numeric",
  });
}
