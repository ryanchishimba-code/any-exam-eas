/** Days after signup that make the check-in eligible without a past exam date. */
export const PASS_CHECK_IN_ACCOUNT_DAYS = 30;

/** How long "haven't taken it" and dismiss stay quiet. */
export const PASS_CHECK_IN_SNOOZE_DAYS = 14;

export const PASS_CHECK_IN_RESULT = {
  passed: "passed",
  not_yet: "not_yet",
  not_taken: "not_taken",
  dismissed: "dismissed",
} as const;

export type PassCheckInResult = (typeof PASS_CHECK_IN_RESULT)[keyof typeof PASS_CHECK_IN_RESULT];

const ANSWERS = new Set<string>([
  PASS_CHECK_IN_RESULT.passed,
  PASS_CHECK_IN_RESULT.not_yet,
  PASS_CHECK_IN_RESULT.not_taken,
  PASS_CHECK_IN_RESULT.dismissed,
]);

export function isPassCheckInResult(value: unknown): value is PassCheckInResult {
  return typeof value === "string" && ANSWERS.has(value);
}

const MS_DAY = 86_400_000;

export function passCheckInDaysBetween(earlier: Date, later: Date): number {
  return Math.floor((later.getTime() - earlier.getTime()) / MS_DAY);
}

function isoDay(date: Date): string {
  return date.toISOString().slice(0, 10);
}

/** True when any stored exam date is today or earlier. */
export function hasExamDateInThePast(examDates: readonly string[], now: Date): boolean {
  const today = isoDay(now);
  return examDates.some((date) => /^\d{4}-\d{2}-\d{2}$/.test(date) && date <= today);
}

export type PassCheckInLatest = {
  result: PassCheckInResult;
  recordedAt: Date;
};

/**
 * Show the prompt for an account that is 30+ days old, or that has an exam
 * date today or earlier. A recorded pass or a miss hides it. "Haven't taken
 * it" and dismiss snooze for two weeks. This never computes a pass rate.
 */
export function shouldShowPassCheckIn(input: {
  now: Date;
  accountCreatedAt: Date;
  examDates: readonly string[];
  latest: PassCheckInLatest | null;
}): boolean {
  const accountDays = passCheckInDaysBetween(input.accountCreatedAt, input.now);
  const qualified =
    accountDays >= PASS_CHECK_IN_ACCOUNT_DAYS ||
    hasExamDateInThePast(input.examDates, input.now);
  if (!qualified) return false;
  if (!input.latest) return true;
  if (
    input.latest.result === PASS_CHECK_IN_RESULT.passed ||
    input.latest.result === PASS_CHECK_IN_RESULT.not_yet
  ) {
    return false;
  }
  return (
    passCheckInDaysBetween(input.latest.recordedAt, input.now) >= PASS_CHECK_IN_SNOOZE_DAYS
  );
}

/** Store a quote only when the student both wrote one and consented. */
export function quoteToStore(quote: string | null | undefined, consent: boolean): {
  quote: string | null;
  shareQuoteConsent: boolean;
} {
  const trimmed = quote?.trim() ?? "";
  if (!consent || trimmed.length === 0) {
    return { quote: null, shareQuoteConsent: false };
  }
  return { quote: trimmed.slice(0, 500), shareQuoteConsent: true };
}
