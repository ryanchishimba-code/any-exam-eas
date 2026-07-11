import { describe, expect, it } from "vitest";
import type Stripe from "stripe";
import {
  stripeUnixToDate,
  subscriptionCurrentPeriodEnd,
  subscriptionCurrentPeriodEndUnix,
} from "@/lib/stripe-period";

describe("stripeUnixToDate", () => {
  it("returns null for missing or invalid values", () => {
    expect(stripeUnixToDate(undefined)).toBeNull();
    expect(stripeUnixToDate(null)).toBeNull();
    expect(stripeUnixToDate(NaN)).toBeNull();
    expect(stripeUnixToDate(0)).toBeNull();
    expect(stripeUnixToDate(-1)).toBeNull();
    expect(stripeUnixToDate("1700000000")).toBeNull();
  });

  it("converts valid unix seconds", () => {
    const date = stripeUnixToDate(1_700_000_000);
    expect(date?.toISOString()).toBe("2023-11-14T22:13:20.000Z");
  });
});

describe("subscriptionCurrentPeriodEnd", () => {
  it("reads classic top-level current_period_end", () => {
    const sub = {
      current_period_end: 1_700_000_000,
      items: { data: [] },
    } as unknown as Stripe.Subscription;
    expect(subscriptionCurrentPeriodEnd(sub)?.toISOString()).toBe("2023-11-14T22:13:20.000Z");
    expect(subscriptionCurrentPeriodEndUnix(sub)).toBe(1_700_000_000);
  });

  it("falls back to subscription item period end (basil+ API)", () => {
    const sub = {
      items: {
        data: [{ current_period_end: 1_710_000_000 }],
      },
    } as unknown as Stripe.Subscription;
    expect(subscriptionCurrentPeriodEnd(sub)?.toISOString()).toBe("2024-03-09T16:00:00.000Z");
    expect(subscriptionCurrentPeriodEndUnix(sub)).toBe(1_710_000_000);
  });

  it("returns null when neither shape has a period end", () => {
    const sub = { items: { data: [{}] } } as unknown as Stripe.Subscription;
    expect(subscriptionCurrentPeriodEnd(sub)).toBeNull();
    expect(subscriptionCurrentPeriodEndUnix(sub)).toBeNull();
  });
});
