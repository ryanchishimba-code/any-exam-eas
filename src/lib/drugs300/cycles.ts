/** Quarterly (3-month) review cycles aligned to calendar quarters. */

export type DrugReviewCycleInfo = {
  key: string;
  label: string;
  startedAt: Date;
  endsAt: Date;
  daysRemaining: number;
  refreshNote: string;
};

const MONTH_NAMES = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

export function getQuarterIndex(date: Date): number {
  return Math.floor(date.getUTCMonth() / 3);
}

export function getCycleKey(date: Date = new Date()): string {
  const year = date.getUTCFullYear();
  const quarter = getQuarterIndex(date) + 1;
  return `${year}-Q${quarter}`;
}

export function getCycleBounds(date: Date = new Date()): { startedAt: Date; endsAt: Date } {
  const year = date.getUTCFullYear();
  const q = getQuarterIndex(date);
  const startMonth = q * 3;
  const startedAt = new Date(Date.UTC(year, startMonth, 1, 0, 0, 0, 0));
  const endsAt = new Date(Date.UTC(year, startMonth + 3, 0, 23, 59, 59, 999));
  return { startedAt, endsAt };
}

export function getCurrentDrugCycle(date: Date = new Date()): DrugReviewCycleInfo {
  const key = getCycleKey(date);
  const { startedAt, endsAt } = getCycleBounds(date);
  const msRemaining = endsAt.getTime() - date.getTime();
  const daysRemaining = Math.max(0, Math.ceil(msRemaining / (1000 * 60 * 60 * 24)));
  const startLabel = MONTH_NAMES[startedAt.getUTCMonth()];
  const endLabel = MONTH_NAMES[endsAt.getUTCMonth()];

  return {
    key,
    label: `${key} (${startLabel}–${endLabel} ${endsAt.getUTCFullYear()})`,
    startedAt,
    endsAt,
    daysRemaining,
    refreshNote: "Your drug deck refreshes at the start of each quarter (every 3 months).",
  };
}

export function isCycleExpired(storedKey: string, date: Date = new Date()): boolean {
  return storedKey !== getCycleKey(date);
}

export function getNextCycleStart(date: Date = new Date()): Date {
  const { endsAt } = getCycleBounds(date);
  return new Date(endsAt.getTime() + 1);
}
