import { describe, expect, it } from "vitest";
import {
  expectedStripeLivemode,
  stripeEventMatchesKeyMode,
} from "@/lib/stripe-livemode";

describe("expectedStripeLivemode", () => {
  it("detects live and test secret keys", () => {
    expect(expectedStripeLivemode("sk_live_abc")).toBe(true);
    expect(expectedStripeLivemode("rk_live_abc")).toBe(true);
    expect(expectedStripeLivemode("sk_test_abc")).toBe(false);
    expect(expectedStripeLivemode("rk_test_abc")).toBe(false);
    expect(expectedStripeLivemode("")).toBeNull();
    expect(expectedStripeLivemode("not-a-key")).toBeNull();
  });
});

describe("stripeEventMatchesKeyMode", () => {
  it("rejects test events when live key is configured", () => {
    const prev = process.env.STRIPE_SECRET_KEY;
    process.env.STRIPE_SECRET_KEY = "sk_live_example";
    expect(stripeEventMatchesKeyMode({ livemode: false })).toEqual({
      ok: false,
      reason: "test_event_with_live_key",
    });
    expect(stripeEventMatchesKeyMode({ livemode: true })).toEqual({ ok: true });
    process.env.STRIPE_SECRET_KEY = prev;
  });

  it("rejects live events when test key is configured", () => {
    const prev = process.env.STRIPE_SECRET_KEY;
    process.env.STRIPE_SECRET_KEY = "sk_test_example";
    expect(stripeEventMatchesKeyMode({ livemode: true })).toEqual({
      ok: false,
      reason: "live_event_with_test_key",
    });
    expect(stripeEventMatchesKeyMode({ livemode: false })).toEqual({ ok: true });
    process.env.STRIPE_SECRET_KEY = prev;
  });
});
