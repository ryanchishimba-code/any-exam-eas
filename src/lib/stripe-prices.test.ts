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
    expect(expectedIntervalUsd("monthly")).toBeCloseTo(32.99, 2);
    expect(expectedIntervalUsd("quarterly")).toBeCloseTo(94.02, 2);
    expect(expectedIntervalUsd("semiannual")).toBeCloseTo(178.15, 2);
    expect(expectedIntervalUsd("yearly")).toBeCloseTo(316.7, 2);
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
    delete process.env.STRIPE_PRICE_ID_YEARLY;
    expect(() => requireStripePriceId("yearly")).toThrow(/STRIPE_PRICE_ID_YEARLY/);
  });

  it("isIntervalPriceConfigured requires price_ prefix", () => {
    process.env.STRIPE_PRICE_ID = "price_test_monthly";
    expect(isIntervalPriceConfigured("monthly")).toBe(true);
    process.env.STRIPE_PRICE_ID = "invalid";
    expect(isIntervalPriceConfigured("monthly")).toBe(false);
  });

  it("getMissingStripePriceEnvKeys lists unset price env vars", () => {
    delete process.env.STRIPE_PRICE_ID;
    delete process.env.STRIPE_PRICE_ID_QUARTERLY;
    delete process.env.STRIPE_PRICE_ID_SEMIANNUAL;
    delete process.env.STRIPE_PRICE_ID_YEARLY;
    const missing = getMissingStripePriceEnvKeys();
    expect(missing).toEqual([
      "STRIPE_PRICE_ID",
      "STRIPE_PRICE_ID_QUARTERLY",
      "STRIPE_PRICE_ID_SEMIANNUAL",
      "STRIPE_PRICE_ID_YEARLY",
    ]);
  });
});
