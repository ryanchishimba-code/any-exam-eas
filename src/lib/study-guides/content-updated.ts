const CHICAGO = "America/Chicago";

/**
 * Last commit that changed each manuscript, as a Chicago calendar day.
 * Stored here so a shallow checkout cannot replace it with the deploy date.
 */
const CONTENT_UPDATED: Record<string, string> = {
  "content/nclex-study-guide": "2026-11-07",
  "content/naplex-study-guide": "2026-10-31",
  "content/pance-study-guide": "2026-11-10",
  "content/aanp-fnp-study-guide": "2026-10-31",
  "content/usmle-study-guide": "2026-11-18",
  "content/usmle-study-guide/step-1": "2026-11-18",
  "content/usmle-study-guide/step-2-ck": "2026-11-18",
  "content/usmle-study-guide/step-3": "2026-11-18",
  "src/lib/exam-prep/npte-pt/content-outline.ts": "2026-10-25",
};

/** Calendar day in America/Chicago, as YYYY-MM-DD. */
export function chicagoCalendarDate(instant: Date): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: CHICAGO,
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(instant);
}

/** Never return a Chicago day later than today. */
export function clampChicagoDate(iso: string, now = new Date()): string {
  const today = chicagoCalendarDate(now);
  return iso > today ? today : iso;
}

export function formatChicagoDate(iso: string): string {
  const [year, month, day] = iso.split("-").map(Number);
  return new Date(Date.UTC(year!, month! - 1, day!, 18)).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    timeZone: CHICAGO,
  });
}

/**
 * Last time the manuscript files changed, as a Chicago calendar day.
 * A day after today is clamped.
 */
export function contentUpdatedOn(relativeDirs: string[], now = new Date()): { iso: string; label: string } {
  const known = relativeDirs.map((dir) => CONTENT_UPDATED[dir]).filter((iso): iso is string => Boolean(iso));
  const iso = clampChicagoDate(known.sort().at(-1) ?? chicagoCalendarDate(now), now);
  return { iso, label: formatChicagoDate(iso) };
}
