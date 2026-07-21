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

/** ISO `YYYY-MM-DD` → `MM/DD/YYYY` for typed entry. */
export function isoToMmddyyyy(iso: string): string {
  const match = iso.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (!match) return "";
  const [, year, month, day] = match;
  return `${month}/${day}/${year}`;
}

/** Insert slashes while typing digits for `MM/DD/YYYY` (MMDDYYYY). */
export function formatMmddyyyyDigits(digits: string): string {
  const d = digits.replace(/\D/g, "").slice(0, 8);
  if (d.length <= 2) return d;
  if (d.length <= 4) return `${d.slice(0, 2)}/${d.slice(2)}`;
  return `${d.slice(0, 2)}/${d.slice(2, 4)}/${d.slice(4)}`;
}

/** Parse `MM/DD/YYYY` or `MMDDYYYY` to ISO date, or null when invalid. */
export function parseMmddyyyy(raw: string): string | null {
  const digits = raw.replace(/\D/g, "");
  if (digits.length !== 8) return null;

  const month = digits.slice(0, 2);
  const day = digits.slice(2, 4);
  const year = digits.slice(4, 8);
  const monthNum = Number(month);
  const dayNum = Number(day);
  const yearNum = Number(year);

  if (monthNum < 1 || monthNum > 12 || dayNum < 1 || dayNum > 31 || yearNum < 1900) {
    return null;
  }

  const iso = `${year}-${month}-${day}`;
  const parsed = new Date(`${iso}T12:00:00`);
  if (
    parsed.getFullYear() !== yearNum ||
    parsed.getMonth() + 1 !== monthNum ||
    parsed.getDate() !== dayNum
  ) {
    return null;
  }

  return iso;
}

export function isIsoWithinBounds(
  iso: string,
  bounds: { minDate?: string; maxDate?: string }
): boolean {
  if (bounds.minDate && iso < bounds.minDate) return false;
  if (bounds.maxDate && iso > bounds.maxDate) return false;
  return true;
}
