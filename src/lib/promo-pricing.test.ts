import { describe, expect, it } from "vitest";
import { MONTHLY_PRICE_USD } from "./billing-config";
import { applyDiscount, buildPlanPricing, hasDiscount } from "./promo-pricing";
import { getBillingPlanTier, intervalTotalUsd } from "./billing-plans";

describe("promo-pricing", () => {
  it("applies percent discount to monthly", () => {
    const pricing = buildPlanPricing("subscribe", "monthly", 10, null);
    expect(pricing.primary.original).toBe(MONTHLY_PRICE_USD);
    expect(pricing.primary.discounted).toBeCloseTo(MONTHLY_PRICE_USD * 0.9, 2);
    expect(hasDiscount(pricing)).toBe(true);
  });

  it("applies fixed discount", () => {
    expect(applyDiscount(MONTHLY_PRICE_USD, null, 10)).toBeCloseTo(MONTHLY_PRICE_USD - 10, 2);
  });

  it("builds trial due-today and recurring lines", () => {
    const pricing = buildPlanPricing("trial", "monthly", 10, null);
    expect(pricing.primary.discounted).toBe(0);
    expect(pricing.recurring?.discounted).toBeCloseTo(MONTHLY_PRICE_USD * 0.9, 2);
    expect(pricing.totalSavings).toBeGreaterThan(0);
  });

  it("applies interval savings for yearly", () => {
    const yearly = getBillingPlanTier("yearly");
    const pricing = buildPlanPricing("subscribe", "yearly");
    expect(pricing.primary.original).toBe(yearly.totalUsd);
    expect(yearly.savingsPercent).toBe(20);
  });
});

describe("billing-plans", () => {
  it("computes multi-month totals with savings", () => {
    expect(intervalTotalUsd("monthly")).toBeCloseTo(32.99, 2);
    expect(intervalTotalUsd("quarterly")).toBeCloseTo(32.99 * 3 * 0.95, 2);
    expect(intervalTotalUsd("semiannual")).toBeCloseTo(32.99 * 6 * 0.9, 2);
    expect(intervalTotalUsd("yearly")).toBeCloseTo(32.99 * 12 * 0.8, 2);
  });
});
