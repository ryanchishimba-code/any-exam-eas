import { describe, expect, it } from "vitest";
import { TIER_MONTHLY_USD } from "./subscription-tiers";
import { getBillingPlanTier, intervalTotalUsd } from "./billing-plans";
import { buildPlanPricing, applyDiscount } from "./promo-pricing";

describe("promo-pricing", () => {
  it("applies percent discount to monthly pro plan", () => {
    const pricing = buildPlanPricing("subscribe", "pro", "monthly", 10);
    expect(pricing.primary.original).toBe(TIER_MONTHLY_USD.pro);
    expect(pricing.primary.discounted).toBeCloseTo(TIER_MONTHLY_USD.pro * 0.9, 2);
  });

  it("rounds 50% AEE-style savings without float residue", () => {
    const pricing = buildPlanPricing("subscribe", "pro", "monthly", 50);
    expect(pricing.primary.discounted).toBe(14);
    expect(pricing.totalSavings).toBe(13.99);
    expect(Number.isInteger(pricing.totalSavings * 100)).toBe(true);
  });

  it("applyDiscount subtracts fixed amount", () => {
    expect(applyDiscount(TIER_MONTHLY_USD.pro, null, 10)).toBeCloseTo(TIER_MONTHLY_USD.pro - 10, 2);
  });

  it("trial plan shows $0 due today", () => {
    const pricing = buildPlanPricing("trial", "pro", "yearly");
    expect(pricing.primary.discounted).toBe(0);
    expect(pricing.recurring?.discounted).toBe(235.12);
  });

  it("interval totals match tier pricing", () => {
    expect(intervalTotalUsd("pro", "monthly")).toBe(27.99);
    expect(intervalTotalUsd("pro", "yearly")).toBe(235.12);
    const yearly = getBillingPlanTier("pro", "yearly");
    expect(yearly.recommended).toBe(true);
    expect(yearly.savingsPercent).toBe(30);
  });
});
