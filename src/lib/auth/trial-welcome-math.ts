import { TRIAL_DAYS } from "@/lib/billing-config";
import { formatMonthlyPrice, formatPricingCheckoutTrialOffer } from "@/lib/site";

/**
 * Trial length comes from plan config (`TRIAL_DAYS`, 5) or the subscription
 * payload's `trialDays`, which is that same constant. Never assume 14.
 */
export function resolveTrialLengthDays(trialDays?: number | null): number {
  if (typeof trialDays === "number" && Number.isFinite(trialDays) && trialDays > 0) {
    return Math.max(1, Math.round(trialDays));
  }
  return TRIAL_DAYS;
}

function clampRemaining(daysRemaining: number, length: number): number {
  if (!Number.isFinite(daysRemaining)) return length;
  return Math.max(0, Math.min(length, Math.round(daysRemaining)));
}

function firstFinite(...values: Array<number | null | undefined>): number | null {
  for (const value of values) {
    if (typeof value === "number" && Number.isFinite(value)) return value;
  }
  return null;
}

/** Days left and trial length for the welcome card. Both clamp to plan length. */
export function resolveDisplayedTrial(input: {
  statusDays?: number | null;
  pendingDays?: number | null;
  statusTrialDays?: number | null;
}): { daysRemaining: number; trialDays: number } {
  const trialDays = resolveTrialLengthDays(input.statusTrialDays);
  const raw = firstFinite(input.statusDays, input.pendingDays) ?? trialDays;
  return { daysRemaining: clampRemaining(raw, trialDays), trialDays };
}

/**
 * 1-based day in the trial. Day 1 means the full length is still remaining.
 * A finished trial (0 days left) stays on the last day.
 */
export function trialDayNumber(daysRemaining: number, trialDays?: number | null): number {
  const length = resolveTrialLengthDays(trialDays);
  const remaining = clampRemaining(daysRemaining, length);
  if (remaining <= 0) return length;
  return Math.min(length, length - remaining + 1);
}

export function trialElapsedDays(daysRemaining: number, trialDays?: number | null): number {
  const length = resolveTrialLengthDays(trialDays);
  return length - clampRemaining(daysRemaining, length);
}

/** Visual progress only. Do not print this as percent-off pricing. */
export function trialProgressPct(daysRemaining: number, trialDays?: number | null): number {
  const length = resolveTrialLengthDays(trialDays);
  return Math.round((trialElapsedDays(daysRemaining, length) / length) * 100);
}

/**
 * Halfway starts on the midpoint day (day 3 of 5) and stops before the last day,
 * which has its own line. A 5-day trial is not halfway on day 1.
 */
export function isTrialHalfway(daysRemaining: number, trialDays?: number | null): boolean {
  const length = resolveTrialLengthDays(trialDays);
  const remaining = clampRemaining(daysRemaining, length);
  if (remaining <= 1) return false;
  const day = trialDayNumber(remaining, length);
  return day >= Math.ceil(length / 2);
}

export type TrialUrgencyTone = "calm" | "moderate" | "urgent";

export function trialUrgencyTone(
  daysRemaining: number,
  trialDays?: number | null
): TrialUrgencyTone {
  const length = resolveTrialLengthDays(trialDays);
  const remaining = clampRemaining(daysRemaining, length);
  if (remaining <= 1) return "urgent";
  if (isTrialHalfway(remaining, length)) return "moderate";
  return "calm";
}

export function trialUrgencyMessage(daysRemaining: number, trialDays?: number | null): string {
  const length = resolveTrialLengthDays(trialDays);
  const remaining = clampRemaining(daysRemaining, length);
  const day = trialDayNumber(remaining, length);
  if (remaining <= 1) {
    return `Last day of your trial — then ${formatMonthlyPrice("pro")}/mo`;
  }
  if (isTrialHalfway(remaining, length)) {
    return "You're halfway through — keep the momentum.";
  }
  if (day === 1) {
    return `Day 1 of ${length} · full access`;
  }
  return "Full access unlocked — start whenever you're ready.";
}

/** Approved product line. Identical to pricing and landing. No percent-off. */
export function approvedTrialOfferLine(): string {
  return formatPricingCheckoutTrialOffer();
}

export function trialDayCaption(daysRemaining: number, trialDays?: number | null): string {
  const length = resolveTrialLengthDays(trialDays);
  const day = trialDayNumber(daysRemaining, length);
  return `Day ${day} of ${length}`;
}
