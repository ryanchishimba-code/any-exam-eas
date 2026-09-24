import { describe, expect, it } from "vitest";
import { FIRST_MONTH_DISCOUNT_ENABLED } from "@/lib/billing/first-month-discount";
import {
  formatCheckoutTrialPageDescription,
  formatPricingCheckoutTrialOffer,
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
});
