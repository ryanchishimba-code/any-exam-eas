import type { UserAccessRole } from "@/lib/access-control";
import {
  classifyTrialUpgradeOffer,
  TRIAL_UPGRADE_OFFER_MS,
  type OfferSnapshot,
} from "@/lib/billing/trial-upgrade-offer";

export type TrialEndOfferHideReason =
  | "in_trial"
  | "ended_too_long_ago"
  | "no_questions"
  | "paid"
  | "used"
  | "expired"
  | "invalid";

export type TrialEndOfferDecision =
  | { show: true }
  | { show: false; reason: TrialEndOfferHideReason };

export type TrialEndOfferEligibilityInput = {
  userId: string;
  role: UserAccessRole;
  subscriptionStatus: string;
  /** Redis caches this as an ISO string. */
  trialEndsAt: Date | string | null;
  questionsAnswered: number;
  paid: boolean;
  offer: OfferSnapshot | null;
  now?: Date;
};

function toDate(value: Date | string | null | undefined): Date | null {
  if (value == null) return null;
  const date = value instanceof Date ? value : new Date(value);
  return Number.isNaN(date.getTime()) ? null : date;
}

/**
 * Post-trial window for the in-app 25% offer.
 * A live offer is assumed so this can run before a database read.
 * Paid accounts and a used or expired row are decided later.
 */
export function shouldResolveTrialEndOffer(
  input: Omit<TrialEndOfferEligibilityInput, "paid" | "offer">
): boolean {
  const now = input.now ?? new Date();
  const decision = trialEndUpgradeOfferEligibility({
    ...input,
    paid: false,
    offer: {
      id: "pending",
      userId: input.userId,
      expiresAt: new Date(now.getTime() + TRIAL_UPGRADE_OFFER_MS),
      redeemedAt: null,
    },
    now,
  });
  return decision.show;
}

/**
 * Who sees the dashboard offer.
 * The trial must already be over, and it must have ended within 48 hours.
 * One answered question on the selected exam is enough. Staff, an active
 * subscription, a prior payment, and a used, expired, or invalid offer hide it.
 */
export function trialEndUpgradeOfferEligibility(
  input: TrialEndOfferEligibilityInput
): TrialEndOfferDecision {
  const now = input.now ?? new Date();

  if (input.role === "staff") return { show: false, reason: "invalid" };
  if (input.role === "subscriber" && input.subscriptionStatus === "active") {
    return { show: false, reason: "invalid" };
  }
  if (input.role === "trial") return { show: false, reason: "in_trial" };
  if (input.role !== "free") return { show: false, reason: "invalid" };

  const trialEndsAt = toDate(input.trialEndsAt);
  if (!trialEndsAt) return { show: false, reason: "invalid" };
  if (trialEndsAt.getTime() > now.getTime()) return { show: false, reason: "in_trial" };
  if (now.getTime() - trialEndsAt.getTime() > TRIAL_UPGRADE_OFFER_MS) {
    return { show: false, reason: "ended_too_long_ago" };
  }
  if (input.questionsAnswered < 1) return { show: false, reason: "no_questions" };
  if (input.paid) return { show: false, reason: "paid" };

  const classified = classifyTrialUpgradeOffer({
    offer: input.offer,
    accountUserId: input.userId,
    paid: false,
    trial: true,
    now,
  });
  if (classified.status === "valid") return { show: true };
  if (classified.status === "used") return { show: false, reason: "used" };
  if (classified.status === "expired") return { show: false, reason: "expired" };
  return { show: false, reason: "invalid" };
}
