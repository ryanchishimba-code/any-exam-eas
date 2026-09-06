import { describe, expect, it, afterEach } from "vitest";
import {
  expectedIntervalUsd,
  getMissingStripePriceEnvKeys,
  isIntervalPriceConfigured,
  requireStripePriceId,
  stripeRecurringForInterval,
} from "./stripe-prices";

describe("stripe-prices", () => {
  const envBackup = { ...process.env };

  afterEach(() => {
    process.env = { ...envBackup };
  });

  it("computes expected USD amounts matching billing-plans", () => {
    expect(expectedIntervalUsd("pro", "monthly")).toBe(27.99);
    expect(expectedIntervalUsd("pro", "quarterly")).toBeCloseTo(79.77, 1);
    expect(expectedIntervalUsd("pro", "yearly")).toBe(235.12);
  });

  it("maps Stripe recurring intervals", () => {
    expect(stripeRecurringForInterval("monthly")).toEqual({
      interval: "month",
      interval_count: 1,
    });
    expect(stripeRecurringForInterval("quarterly")).toEqual({
      interval: "month",
      interval_count: 3,
    });
    expect(stripeRecurringForInterval("yearly")).toEqual({
      interval: "year",
      interval_count: 1,
    });
  });

  it("requireStripePriceId returns committed price when env is missing", () => {
    delete process.env.STRIPE_PRO_PRICE_ID_YEARLY;
    delete process.env.STRIPE_PRICE_ID_YEARLY;
    expect(requireStripePriceId("pro", "yearly")).toMatch(/^price_/);
  });

  it("isIntervalPriceConfigured uses committed price IDs", () => {
    delete process.env.STRIPE_PRO_PRICE_ID_MONTHLY;
    delete process.env.STRIPE_PRICE_ID;
    expect(isIntervalPriceConfigured("pro", "monthly")).toBe(true);
  });

  it("isIntervalPriceConfigured prefers committed IDs over invalid env", () => {
    process.env.STRIPE_PRO_PRICE_ID_MONTHLY = "invalid";
    expect(isIntervalPriceConfigured("pro", "monthly")).toBe(true);
  });

  it("getMissingStripePriceEnvKeys is empty when committed IDs cover Pro", () => {
    expect(getMissingStripePriceEnvKeys()).toEqual([]);
  });
});
