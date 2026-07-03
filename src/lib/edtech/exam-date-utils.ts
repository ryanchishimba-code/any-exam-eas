/** ISO calendar date helpers shared by exam countdown and signup flows. */

export function todayIso(): string {
  const d = new Date();
  return toIsoDate(d);
}

export function toIsoDate(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
}

/** Suggested preview when no date chosen yet (~3 months out). */
export function defaultExamDatePreview(from = todayIso()): string {
  return addMonthsToIso(from, 3);
}

/** Latest DOB that satisfies 18+ (inclusive). */
export function eighteenYearsAgoIso(from = todayIso()): string {
  const d = new Date(`${from}T12:00:00`);
  d.setFullYear(d.getFullYear() - 18);
  return toIsoDate(d);
}

/** Earliest selectable birth year (~100 years). */
export function oldestBirthDateIso(from = todayIso()): string {
  const d = new Date(`${from}T12:00:00`);
  d.setFullYear(d.getFullYear() - 100);
  return `${d.getFullYear()}-01-01`;
}

/** Suggested DOB preview (~25 years old). */
export function defaultBirthDatePreview(from = todayIso()): string {
  const d = new Date(`${from}T12:00:00`);
  d.setFullYear(d.getFullYear() - 25);
  return toIsoDate(d);
}

export function addMonthsToIso(iso: string, months: number): string {
  const d = new Date(`${iso}T12:00:00`);
  d.setMonth(d.getMonth() + months);
  return toIsoDate(d);
}

export function formatExamDateLong(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

export function formatExamDateShort(iso: string): string {
  return new Date(`${iso}T00:00:00`).toLocaleDateString(undefined, {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export function calendarDaysUntil(isoDate: string, now = Date.now()): number {
  const today = new Date(now);
  today.setHours(0, 0, 0, 0);
  const target = new Date(`${isoDate}T00:00:00`);
  return Math.round((target.getTime() - today.getTime()) / 86_400_000);
}
