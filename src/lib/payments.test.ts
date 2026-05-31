import { describe, expect, it, afterEach } from "vitest";

describe("isStripeConfigured", () => {
  const env = { ...process.env };

  afterEach(() => {
    process.env = { ...env };
  });

  async function loadPayments() {
    return import("./payments");
  }

  it("returns false when any required key is missing", async () => {
    delete process.env.STRIPE_SECRET_KEY;
    delete process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY;
    delete process.env.STRIPE_PRICE_ID;
    const { isStripeConfigured } = await loadPayments();
    expect(isStripeConfigured()).toBe(false);
  });

  it("returns true when all required keys are set", async () => {
    process.env.STRIPE_SECRET_KEY = "sk_test_x";
    process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY = "pk_test_x";
    process.env.STRIPE_PRICE_ID = "price_test_x";
    const { isStripeConfigured } = await loadPayments();
    expect(isStripeConfigured()).toBe(true);
  });
});

describe("PAYMENT_METHODS", () => {
  it("lists card and wallet rails for checkout UI", async () => {
    const { PAYMENT_METHODS } = await import("./payments");
    const ids = PAYMENT_METHODS.map((m) => m.id);
    expect(ids).toContain("card");
    expect(ids).toContain("apple_pay");
    expect(ids).toContain("google_pay");
  });
});

describe("billing-config", () => {
  it("defaults trial and monthly prices", async () => {
    const { TRIAL_DAYS, MONTHLY_PRICE_USD, TRIAL_INTRO_PRICE_USD } = await import(
      "./billing-config"
    );
    expect(TRIAL_DAYS).toBeGreaterThan(0);
    expect(MONTHLY_PRICE_USD).toBeGreaterThan(0);
    expect(TRIAL_INTRO_PRICE_USD).toBeGreaterThan(0);
  });

  it("estimateMrr combines subscribers and trials", async () => {
    const { estimateMrr, MONTHLY_PRICE_USD, TRIAL_INTRO_PRICE_USD } = await import(
      "./billing-config"
    );
    expect(estimateMrr(10, 5)).toBeCloseTo(
      10 * MONTHLY_PRICE_USD + 5 * TRIAL_INTRO_PRICE_USD,
      5
    );
  });
});
