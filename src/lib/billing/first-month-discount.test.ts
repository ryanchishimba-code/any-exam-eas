import { describe, expect, it } from "vitest";
import {
  isEligibleForFirstMonthDiscount,
  shouldApplyFirstMonthDiscount,
} from "./first-month-discount";

describe("first-month-discount", () => {
  it("allows users with no subscription row", () => {
    expect(isEligibleForFirstMonthDiscount(null)).toBe(true);
  });

  it("allows trialing and trial_expired users", () => {
    expect(
      isEligibleForFirstMonthDiscount({
        status: "trialing",
        plan: "trial",
        canceledAt: null,
      })
    ).toBe(true);
    expect(
      isEligibleForFirstMonthDiscount({
        status: "trial_expired",
        plan: "trial",
        canceledAt: null,
      })
    ).toBe(true);
  });

  it("blocks active and previously paid canceled subscribers", () => {
    expect(
      isEligibleForFirstMonthDiscount({
        status: "active",
        plan: "subscribe",
        canceledAt: null,
      })
    ).toBe(false);
    expect(
      isEligibleForFirstMonthDiscount({
        status: "canceled",
        plan: "subscribe",
        canceledAt: new Date(),
      })
    ).toBe(false);
  });

  it("does not attach a first-month percent-off while the promo is disabled", () => {
    const sub = { status: "trialing", plan: "trial", canceledAt: null };
    expect(shouldApplyFirstMonthDiscount({ interval: "monthly", sub })).toBe(false);
    expect(shouldApplyFirstMonthDiscount({ interval: "yearly", sub })).toBe(false);
    expect(
      shouldApplyFirstMonthDiscount({ interval: "monthly", sub, hasPromoCoupon: true })
    ).toBe(false);
  });
});
