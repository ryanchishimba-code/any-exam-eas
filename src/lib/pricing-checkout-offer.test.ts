import { describe, expect, it } from "vitest";
import { FIRST_MONTH_DISCOUNT_ENABLED } from "@/lib/billing/first-month-discount";
import { getBillingPlanTier, formatTierPricingSummary } from "@/lib/billing-plans";
import { buildHomeJsonLd } from "@/lib/seo";
import {
  formatCheckoutContinueCta,
  formatCheckoutTrialPageDescription,
  formatLandingStickyDetail,
  formatPricingCheckoutTrialOffer,
  formatTierPriceLine,
  formatTrialCtaWithSavings,
  formatTrialPlanDetail,
  NO_PAYMENT_TRIAL_BADGE,
  NO_PAYMENT_TRIAL_SUBLINE,
} from "@/lib/site";

describe("pricing and checkout trial offer", () => {
  it("uses the approved product line", () => {
    expect(formatPricingCheckoutTrialOffer()).toBe(
      "5-day free trial · no payment method required · then $27.99/mo"
    );
    expect(formatCheckoutTrialPageDescription()).toBe(
      "5-day free trial · $0 today · no payment method required · then $27.99/mo"
    );
    expect(formatCheckoutTrialPageDescription("yearly")).toBe(
      "5-day free trial · $0 today · no payment method required"
    );
  });

  it("does not use card or percent-off trial wording", () => {
    const lines = [formatPricingCheckoutTrialOffer(), formatCheckoutTrialPageDescription()];
    for (const line of lines) {
      expect(line).not.toMatch(/no card/i);
      expect(line).not.toMatch(/5 days free/i);
      expect(line).not.toMatch(/% off/i);
    }
    expect(FIRST_MONTH_DISCOUNT_ENABLED).toBe(false);
  });

  it("uses the same phrase on landing and signup helpers", () => {
    const lines = [
      formatLandingStickyDetail(),
      formatTrialPlanDetail(),
      NO_PAYMENT_TRIAL_BADGE,
      NO_PAYMENT_TRIAL_SUBLINE,
    ];
    expect(formatLandingStickyDetail()).toBe(formatPricingCheckoutTrialOffer());
    expect(NO_PAYMENT_TRIAL_BADGE).toBe("No payment method required");
    expect(formatTrialPlanDetail()).toMatch(/5-day free trial/i);
    for (const line of lines) {
      expect(line).toMatch(/no payment method required/i);
      expect(line).not.toMatch(/no card/i);
      expect(line).not.toMatch(/5 days free/i);
    }
  });

  it("does not advertise percent-off savings on interval labels or homepage JSON-LD", () => {
    const intervals = ["monthly", "quarterly", "semiannual", "yearly"] as const;
    for (const interval of intervals) {
      const plan = getBillingPlanTier("pro", interval);
      expect(formatTierPriceLine(plan)).not.toMatch(/save\s+\d+%/i);
      expect(formatCheckoutContinueCta("trial", "pro", interval)).toBe("Continue to Payment");
      expect(formatCheckoutContinueCta("subscribe", "pro", interval)).toBe("Continue to Payment");
      expect(formatTrialCtaWithSavings("pro", interval)).not.toMatch(/save\s+\d+%/i);
      expect(formatTrialCtaWithSavings("pro", interval)).not.toMatch(/% off/i);
    }
    expect(formatTierPricingSummary("pro")).not.toMatch(/save\s+\d+%/i);
    expect(formatTierPricingSummary("pro")).toContain("$27.99/mo");
    expect(formatTierPricingSummary("pro")).toContain("$235.12");
    const json = JSON.stringify(buildHomeJsonLd());
    expect(json).not.toMatch(/save up to \d+%/i);
    expect(json).not.toMatch(/save \d+%/i);
    expect(json).toContain("Pro at $27.99/mo");
  });
});
