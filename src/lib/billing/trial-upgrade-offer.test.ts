import { describe, expect, it } from "vitest";
import type { BillingInterval } from "@/lib/billing-config";
import { formatPlanUsd } from "@/lib/billing-plans";
import { applyDiscount } from "@/lib/promo-pricing";
import {
  OFFER_PUBLIC_MESSAGE,
  TRIAL_UPGRADE_OFFER_PERCENT,
  classifyTrialUpgradeOffer,
  decideOfferIssue,
  firstPaymentPricing,
  formatOfferDeadline,
  hasPaidBefore,
  isTrialMember,
  isTrialUpgradeCoupon,
  offerExpiresAt,
  publicOfferMessage,
  renewalRemainsFullPrice,
  resolveCheckoutOffer,
  trialUpgradeOfferLink,
} from "./trial-upgrade-offer";

const NOW = new Date("2026-11-15T01:39:00.000Z");
const USER = "user_1";

function offer(overrides?: Partial<{ expiresAt: Date; redeemedAt: Date | null; userId: string }>) {
  return {
    id: "offer_1",
    userId: overrides?.userId ?? USER,
    expiresAt: overrides?.expiresAt ?? new Date(NOW.getTime() + 60 * 60 * 1000),
    redeemedAt: overrides?.redeemedAt ?? null,
  };
}

describe("trial upgrade offer", () => {
  it("accepts a live offer for an unpaid trial user", () => {
    const result = classifyTrialUpgradeOffer({
      offer: offer(),
      accountUserId: USER,
      paid: false,
      trial: true,
      now: NOW,
    });
    expect(result.status).toBe("valid");
    expect(result.offerId).toBe("offer_1");
    expect(publicOfferMessage(result.status)).toMatch(/25% off your first payment/);
  });

  it("rejects an offer after its own 48-hour window", () => {
    const result = classifyTrialUpgradeOffer({
      offer: offer({ expiresAt: new Date(NOW.getTime() - 1000) }),
      accountUserId: USER,
      paid: false,
      trial: true,
      now: NOW,
    });
    expect(result.status).toBe("expired");
    expect(publicOfferMessage(result.status)).toBe(OFFER_PUBLIC_MESSAGE.expired);
    expect(publicOfferMessage(result.status)).toMatch(/standard pricing/i);
  });

  it("rejects an offer that was already used", () => {
    const result = classifyTrialUpgradeOffer({
      offer: offer({ redeemedAt: new Date(NOW.getTime() - 60_000) }),
      accountUserId: USER,
      paid: false,
      trial: true,
      now: NOW,
    });
    expect(result.status).toBe("used");
    expect(publicOfferMessage(result.status)).toBe(OFFER_PUBLIC_MESSAGE.used);
  });

  it("rejects an unexpired offer when the account has already paid", () => {
    const result = classifyTrialUpgradeOffer({
      offer: offer(),
      accountUserId: USER,
      paid: true,
      trial: true,
      now: NOW,
    });
    expect(result.status).toBe("already_paid");
    expect(publicOfferMessage(result.status)).toBe(OFFER_PUBLIC_MESSAGE.already_paid);
  });

  it("does not apply the discount for another account's link", () => {
    const result = classifyTrialUpgradeOffer({
      offer: offer({ userId: "someone_else" }),
      accountUserId: USER,
      paid: false,
      trial: true,
      now: NOW,
    });
    expect(result.status).toBe("wrong_account");
    expect(result.offerId).toBeNull();
    expect(publicOfferMessage(result.status)).toBe(OFFER_PUBLIC_MESSAGE.unavailable);
  });

  it("takes 25% off the first payment of every plan and leaves the renewal price", () => {
    const intervals: BillingInterval[] = ["monthly", "quarterly", "semiannual", "yearly"];
    for (const interval of intervals) {
      const pricing = firstPaymentPricing(interval);
      expect(pricing.primary.discounted).toBe(
        applyDiscount(pricing.primary.original, TRIAL_UPGRADE_OFFER_PERCENT, null)
      );
      expect(pricing.primary.discounted).toBeLessThan(pricing.primary.original);
      expect(renewalRemainsFullPrice(interval)).toBe(true);
    }
    expect(firstPaymentPricing("monthly").primary.original).toBe(27.99);
    expect(firstPaymentPricing("monthly").primary.discounted).toBe(20.99);
    expect(formatPlanUsd(firstPaymentPricing("monthly").primary.discounted)).toBe("$20.99");
  });

  it("refuses to stack the offer with another code and ignores checkout when no token is sent", () => {
    expect(
      resolveCheckoutOffer({
        tokenPresent: true,
        status: "valid",
        offerId: "offer_1",
        promoCodePresent: true,
      })
    ).toEqual({ action: "reject", message: OFFER_PUBLIC_MESSAGE.stack });

    expect(
      resolveCheckoutOffer({
        tokenPresent: true,
        status: "valid",
        offerId: "offer_1",
        promoCodePresent: false,
      })
    ).toEqual({ action: "apply", offerId: "offer_1" });

    expect(
      resolveCheckoutOffer({
        tokenPresent: true,
        status: "expired",
        offerId: "offer_1",
        promoCodePresent: false,
      }).action
    ).toBe("reject");

    expect(
      resolveCheckoutOffer({
        tokenPresent: false,
        status: "expired",
        offerId: null,
        promoCodePresent: true,
      })
    ).toEqual({ action: "ignore" });
  });

  it("sets the window from the issue time and does not extend a live link", () => {
    expect(offerExpiresAt(NOW).toISOString()).toBe("2026-11-17T01:39:00.000Z");
    expect(
      decideOfferIssue({
        paid: false,
        trial: true,
        existing: { redeemedAt: null, expiresAt: offerExpiresAt(NOW) },
        now: NOW,
      }).action
    ).toBe("reuse");
    expect(
      decideOfferIssue({
        paid: false,
        trial: true,
        existing: { redeemedAt: null, expiresAt: offerExpiresAt(NOW) },
        now: NOW,
        rotate: true,
      }).action
    ).toBe("create");
    expect(
      decideOfferIssue({
        paid: true,
        trial: true,
        existing: null,
        now: NOW,
      })
    ).toEqual({ action: "refuse", reason: "paid" });
    expect(
      decideOfferIssue({
        paid: false,
        trial: true,
        existing: { redeemedAt: NOW, expiresAt: offerExpiresAt(NOW) },
        now: NOW,
      })
    ).toEqual({ action: "refuse", reason: "used" });
  });

  it("treats a card-free trial as unpaid and a subscribe or pay-once row as paid", () => {
    expect(
      hasPaidBefore({
        status: "trialing",
        plan: "trial",
        trialEndsAt: new Date(NOW.getTime() + 86_400_000),
        stripeSubscriptionId: null,
      })
    ).toBe(false);
    expect(
      isTrialMember({
        status: "trial_expired",
        plan: "trial",
        trialEndsAt: new Date(NOW.getTime() - 1000),
      })
    ).toBe(true);
    expect(hasPaidBefore({ status: "active", plan: "subscribe", stripeSubscriptionId: "sub_123" })).toBe(
      true
    );
    expect(hasPaidBefore({ status: "canceled", plan: "subscribe" })).toBe(true);
    expect(hasPaidBefore({ status: "trial_expired", plan: "trial", purchaseType: "one_time" })).toBe(
      true
    );
    expect(hasPaidBefore({ status: "past_due", plan: "subscribe" })).toBe(true);
    expect(hasPaidBefore(null)).toBe(false);
    expect(isTrialMember(null)).toBe(false);
  });

  it("builds a per-user link and only accepts a 25% once coupon", () => {
    expect(trialUpgradeOfferLink("tok_abc")).toBe(
      "https://www.anyexameasy.com/upgrade?offer=tok_abc"
    );
    expect(formatOfferDeadline(new Date("2026-11-17T01:39:00.000Z"))).toMatch(/Nov 17/);
    expect(formatOfferDeadline(new Date("2026-11-17T01:39:00.000Z"))).toMatch(/UTC/);
    expect(isTrialUpgradeCoupon({ percent_off: 25, duration: "once", valid: true })).toBe(true);
    expect(isTrialUpgradeCoupon({ percent_off: 25, duration: "forever", valid: true })).toBe(false);
    expect(isTrialUpgradeCoupon({ percent_off: 20, duration: "once", valid: true })).toBe(false);
    expect(isTrialUpgradeCoupon({ percent_off: 25, duration: "once", valid: false })).toBe(false);
  });
});
