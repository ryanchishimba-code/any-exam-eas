import type { BillingInterval } from "@/lib/billing-config";
import { formatPlanUsd, renewalTermsLine } from "@/lib/billing-plans";
import { applyDiscount, buildPlanPricing, type PromoPricing } from "@/lib/promo-pricing";
import type { SubscriptionTier } from "@/lib/subscription-tiers";

/**
 * Support-issued, per-user upgrade offer.
 * 25% off the first payment on any plan. The window is 48 hours from the
 * moment that user's row is issued. A shared Stripe coupon (duration once)
 * does the charge; this module decides whether that user may use it.
 */
export const TRIAL_UPGRADE_OFFER_PERCENT = 25;
export const TRIAL_UPGRADE_OFFER_HOURS = 48;
export const TRIAL_UPGRADE_OFFER_MS = TRIAL_UPGRADE_OFFER_HOURS * 60 * 60 * 1000;
export const TRIAL_UPGRADE_COUPON_ID = "aee_trial_upgrade_25";

export const OFFER_PUBLIC_MESSAGE = {
  valid: "25% off your first payment, on any plan. Renews at the regular price.",
  expired: "This 48-hour offer has ended. Standard pricing is shown below.",
  used: "This offer has already been used. Standard pricing is shown below.",
  already_paid:
    "This offer is only for a first payment, and this account has already paid. Standard pricing is shown below.",
  unavailable:
    "This offer link isn't available for this account. Standard pricing is shown below.",
  stack: "This offer can't be combined with another code.",
} as const;

export type PublicOfferStatus = "valid" | "expired" | "used" | "already_paid" | "unavailable";

export type TrialUpgradeOfferView = {
  status: PublicOfferStatus;
  message: string;
  expiresAt: string | null;
  /** Set only when this signed-in user can still pay with the link. */
  token: string | null;
  percentOff: number | null;
};

export type OfferStatus = PublicOfferStatus | "missing" | "wrong_account" | "not_trial";

/** Subscription fields that decide trial vs already-paid. Null means no row. */
export type TrialOfferSubscription = {
  status: string;
  plan: string | null;
  purchaseType?: string | null;
  trialEndsAt?: Date | null;
  stripeSubscriptionId?: string | null;
  stripePaymentIntentId?: string | null;
  lastPaymentReceiptInvoiceId?: string | null;
} | null;

export function offerExpiresAt(issuedAt: Date): Date {
  return new Date(issuedAt.getTime() + TRIAL_UPGRADE_OFFER_MS);
}

/**
 * A payment has already happened, or a paid plan is on the books.
 * A card-free trial, including a Stripe trial that has not been charged, is not paid.
 */
export function hasPaidBefore(sub: TrialOfferSubscription): boolean {
  if (!sub) return false;
  if (sub.purchaseType === "one_time") return true;
  if (sub.stripePaymentIntentId) return true;
  if (sub.lastPaymentReceiptInvoiceId) return true;
  if (sub.status === "past_due" || sub.status === "unpaid") return true;
  if (sub.status === "active" && Boolean(sub.stripeSubscriptionId?.trim())) return true;
  if (
    sub.plan === "subscribe" &&
    sub.status !== "trialing" &&
    sub.status !== "trial_expired"
  ) {
    return true;
  }
  return false;
}

/** Trial is in progress or has already ended. Someone who never started one does not qualify. */
export function isTrialMember(sub: TrialOfferSubscription): boolean {
  if (!sub) return false;
  if (sub.trialEndsAt) return true;
  if (sub.status === "trialing" || sub.status === "trial_expired") return true;
  if (sub.plan === "trial") return true;
  return false;
}

export function trialOfferFlags(sub: TrialOfferSubscription): { paid: boolean; trial: boolean } {
  return { paid: hasPaidBefore(sub), trial: isTrialMember(sub) };
}

export type OfferSnapshot = {
  id: string;
  userId: string;
  expiresAt: Date;
  redeemedAt: Date | null;
};

export type ClassifiedOffer = {
  status: OfferStatus;
  offerId: string | null;
  expiresAt: Date | null;
};

/**
 * Decide what this signed-in user may do with a link.
 * Paid and used are checked before the clock, so a lapsed link cannot
 * still be spent, and a payer cannot use an unexpired one.
 */
export function classifyTrialUpgradeOffer(input: {
  offer: OfferSnapshot | null;
  accountUserId: string;
  paid: boolean;
  trial: boolean;
  now?: Date;
}): ClassifiedOffer {
  const offer = input.offer;
  if (!offer) {
    return { status: "missing", offerId: null, expiresAt: null };
  }
  if (offer.userId !== input.accountUserId) {
    return { status: "wrong_account", offerId: null, expiresAt: null };
  }
  if (offer.redeemedAt) {
    return { status: "used", offerId: offer.id, expiresAt: offer.expiresAt };
  }
  if (input.paid) {
    return { status: "already_paid", offerId: offer.id, expiresAt: offer.expiresAt };
  }
  if (!input.trial) {
    return { status: "not_trial", offerId: offer.id, expiresAt: offer.expiresAt };
  }
  const now = input.now ?? new Date();
  if (offer.expiresAt.getTime() <= now.getTime()) {
    return { status: "expired", offerId: offer.id, expiresAt: offer.expiresAt };
  }
  return { status: "valid", offerId: offer.id, expiresAt: offer.expiresAt };
}

export function publicOfferStatus(status: OfferStatus): PublicOfferStatus {
  if (
    status === "valid" ||
    status === "expired" ||
    status === "used" ||
    status === "already_paid"
  ) {
    return status;
  }
  return "unavailable";
}

export function publicOfferMessage(status: OfferStatus): string {
  return OFFER_PUBLIC_MESSAGE[publicOfferStatus(status)];
}

export type CheckoutOfferResolution =
  | { action: "apply"; offerId: string }
  | { action: "reject"; message: string }
  | { action: "ignore" };

/**
 * A presented offer token is authoritative: an invalid one stops checkout
 * instead of silently charging full price. A valid one never stacks with a promo.
 * No token leaves the existing promo path alone.
 */
export function resolveCheckoutOffer(input: {
  tokenPresent: boolean;
  status: OfferStatus;
  offerId: string | null;
  promoCodePresent: boolean;
}): CheckoutOfferResolution {
  if (!input.tokenPresent) return { action: "ignore" };
  if (input.status === "valid" && input.offerId) {
    if (input.promoCodePresent) {
      return { action: "reject", message: OFFER_PUBLIC_MESSAGE.stack };
    }
    return { action: "apply", offerId: input.offerId };
  }
  return { action: "reject", message: publicOfferMessage(input.status) };
}

export function firstPaymentPricing(
  interval: BillingInterval,
  tier: SubscriptionTier = "pro"
): PromoPricing {
  return buildPlanPricing("subscribe", tier, interval, TRIAL_UPGRADE_OFFER_PERCENT, null);
}

/** Renewal copy stays on the undiscounted total. The discount is the first charge only. */
export function renewalRemainsFullPrice(
  interval: BillingInterval,
  tier: SubscriptionTier = "pro"
): boolean {
  const pricing = firstPaymentPricing(interval, tier);
  const renewal = renewalTermsLine(tier, interval);
  return (
    pricing.primary.discounted ===
      applyDiscount(pricing.primary.original, TRIAL_UPGRADE_OFFER_PERCENT, null) &&
    pricing.primary.discounted < pricing.primary.original &&
    renewal.includes(formatPlanUsd(pricing.primary.original))
  );
}

export function formatOfferDeadline(expiresAt: Date): string {
  return expiresAt.toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: "UTC",
    timeZoneName: "short",
  });
}

export function trialUpgradeOfferLink(token: string, origin = "https://www.anyexameasy.com"): string {
  const base = origin.replace(/\/$/, "");
  const url = new URL("/upgrade", base.startsWith("http") ? base : `https://${base}`);
  url.searchParams.set("offer", token);
  return url.toString();
}

export type IssueDecision =
  | { action: "create" }
  | { action: "reuse" }
  | { action: "refuse"; reason: "paid" | "not_trial" | "used" };

/** Resending a live link does not move the clock. `--rotate` starts a new 48 hours. */
export function decideOfferIssue(input: {
  paid: boolean;
  trial: boolean;
  existing: { redeemedAt: Date | null; expiresAt: Date } | null;
  now?: Date;
  rotate?: boolean;
}): IssueDecision {
  if (input.paid) return { action: "refuse", reason: "paid" };
  if (!input.trial) return { action: "refuse", reason: "not_trial" };
  if (input.existing?.redeemedAt) return { action: "refuse", reason: "used" };
  const now = input.now ?? new Date();
  if (
    input.existing &&
    !input.rotate &&
    input.existing.expiresAt.getTime() > now.getTime()
  ) {
    return { action: "reuse" };
  }
  return { action: "create" };
}

export function isTrialUpgradeCoupon(coupon: {
  percent_off: number | null;
  duration: string | null;
  valid: boolean;
}): boolean {
  return (
    coupon.valid &&
    coupon.percent_off === TRIAL_UPGRADE_OFFER_PERCENT &&
    coupon.duration === "once"
  );
}
