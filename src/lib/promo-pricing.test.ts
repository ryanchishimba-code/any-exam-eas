import { describe, expect, it } from "vitest";
import { applyDiscount, buildPlanPricing, hasDiscount } from "./promo-pricing";

describe("promo-pricing", () => {
  it("applies percent discount to monthly", () => {
    const pricing = buildPlanPricing("subscribe", 10, null);
    expect(pricing.primary.original).toBe(29.99);
    expect(pricing.primary.discounted).toBeCloseTo(26.99, 2);
    expect(hasDiscount(pricing)).toBe(true);
  });

  it("applies fixed discount", () => {
    expect(applyDiscount(29.99, null, 10)).toBe(19.99);
  });

  it("builds trial due-today and recurring lines", () => {
    const pricing = buildPlanPricing("trial", 10, null);
    expect(pricing.primary.discounted).toBe(0);
    expect(pricing.recurring?.discounted).toBeCloseTo(26.99, 2);
    expect(pricing.totalSavings).toBeGreaterThan(0);
  });
});
