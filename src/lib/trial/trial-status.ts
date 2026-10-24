import { TRIAL_DAYS, TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import { PRO_MONTHLY_PRICE_USD } from "@/lib/pricing-defaults";
import { formatPlanUsd } from "@/lib/billing-plans";
import { trialUpgradeCheckoutHref } from "@/lib/dashboard/upgrade-banner";

const MS_PER_HOUR = 1000 * 60 * 60;
const MS_PER_DAY = MS_PER_HOUR * 24;

/** Whole calendar days left until `trialEndsAt` (matches subscription-access). */
export function trialDaysRemaining(trialEndsAt: Date, now = new Date()): number {
  return Math.max(0, Math.ceil((trialEndsAt.getTime() - now.getTime()) / MS_PER_DAY));
}

export function trialHoursRemaining(trialEndsAt: Date, now = new Date()): number {
  return Math.max(0, (trialEndsAt.getTime() - now.getTime()) / MS_PER_HOUR);
}

/** Last 48 hours of the trial — day 4 and day 5 on a 5-day trial. */
export function trialIsUrgent(trialEndsAt: Date, now = new Date()): boolean {
  return trialHoursRemaining(trialEndsAt, now) <= 48;
}

export function formatTrialEndWeekday(trialEndsAt: Date): string {
  return trialEndsAt.toLocaleDateString("en-US", { weekday: "long" });
}

export type TrialStatusBarModel = {
  daysRemaining: number;
  questionsUsed: number;
  questionLimit: number;
  urgent: boolean;
  trialEndsAt: Date;
  upgradeHref: string;
  monthlyLabel: string;
};

export function buildTrialStatusBarModel(input: {
  trialEndsAt: Date;
  usedTrialTotal: number;
  returnPath?: string;
  now?: Date;
}): TrialStatusBarModel {
  const now = input.now ?? new Date();
  const trialEndsAt = input.trialEndsAt;
  return {
    daysRemaining: trialDaysRemaining(trialEndsAt, now),
    questionsUsed: input.usedTrialTotal,
    questionLimit: TRIAL_LIFETIME_QUESTIONS,
    urgent: trialIsUrgent(trialEndsAt, now),
    trialEndsAt,
    upgradeHref: trialUpgradeCheckoutHref(input.returnPath ?? "/dashboard"),
    monthlyLabel: formatPlanUsd(PRO_MONTHLY_PRICE_USD),
  };
}

export function trialStatusBarMessage(model: TrialStatusBarModel): string {
  if (model.urgent) {
    return `Your trial ends ${formatTrialEndWeekday(model.trialEndsAt)}. Keep your progress — ${model.monthlyLabel}/mo.`;
  }
  const dayLabel =
    model.daysRemaining === 1
      ? "1 day left in your free trial"
      : `${model.daysRemaining} days left in your free trial`;
  return `${dayLabel} · ${model.questionsUsed} of ${model.questionLimit} questions used`;
}

/** Day-4 email window: first calendar day inside the <=48h urgency band. */
export function isTrialDay4ReminderWindow(
  trialEndsAt: Date,
  now = new Date()
): boolean {
  const hours = trialHoursRemaining(trialEndsAt, now);
  return hours > 48 && hours <= 48 + 24;
}

export function trialDayLabelFromEndsAt(trialEndsAt: Date, now = new Date()): number {
  const daysLeft = trialDaysRemaining(trialEndsAt, now);
  return Math.min(TRIAL_DAYS, Math.max(1, TRIAL_DAYS - daysLeft + 1));
}
