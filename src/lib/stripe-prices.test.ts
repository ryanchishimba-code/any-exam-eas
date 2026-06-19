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
    expect(expectedIntervalUsd("basic", "monthly")).toBeCloseTo(27.99, 2);
    expect(expectedIntervalUsd("basic", "quarterly")).toBeCloseTo(79.77, 1);
    expect(expectedIntervalUsd("basic", "yearly")).toBe(279);
    expect(expectedIntervalUsd("pro", "monthly")).toBeCloseTo(34.99, 2);
    expect(expectedIntervalUsd("pro", "yearly")).toBe(349);
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

  it("requireStripePriceId throws when env is missing", () => {
    delete process.env.STRIPE_PRO_PRICE_ID_YEARLY;
    delete process.env.STRIPE_PRICE_ID_YEARLY;
    expect(() => requireStripePriceId("pro", "yearly")).toThrow(/STRIPE_PRO_PRICE_ID_YEARLY/);
  });

  it("isIntervalPriceConfigured requires price_ prefix", () => {
    process.env.STRIPE_PRO_PRICE_ID_MONTHLY = "price_test_monthly";
    expect(isIntervalPriceConfigured("pro", "monthly")).toBe(true);
    process.env.STRIPE_PRO_PRICE_ID_MONTHLY = "invalid";
    expect(isIntervalPriceConfigured("pro", "monthly")).toBe(false);
  });

  it("getMissingStripePriceEnvKeys lists unset price env vars", () => {
    for (const key of getMissingStripePriceEnvKeys()) {
      delete process.env[key];
    }
    const missing = getMissingStripePriceEnvKeys();
    expect(missing.length).toBeGreaterThan(0);
  });
});
