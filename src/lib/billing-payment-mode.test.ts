import { describe, expect, it } from "vitest";
import {
  DEFAULT_PAYMENT_MODE,
  parsePaymentMode,
  paymentModeDetail,
  paymentModeOptions,
} from "./billing-payment-mode";
import { getBillingPlanTier } from "./billing-plans";

describe("payment mode", () => {
  it("defaults to auto-pay for missing or unknown values", () => {
    expect(DEFAULT_PAYMENT_MODE).toBe("auto");
    expect(parsePaymentMode(undefined)).toBe("auto");
    expect(parsePaymentMode(null)).toBe("auto");
    expect(parsePaymentMode("")).toBe("auto");
    expect(parsePaymentMode("lifetime")).toBe("auto");
    expect(parsePaymentMode(1)).toBe("auto");
  });

  it("parses an explicit manual choice", () => {
    expect(parsePaymentMode("manual")).toBe("manual");
  });

  it("prices both modes identically — only renewal differs", () => {
    for (const interval of ["monthly", "quarterly", "semiannual", "yearly"] as const) {
      const [auto, manual] = paymentModeOptions("pro", interval);
      const total = getBillingPlanTier("pro", interval).totalUsd;
      const amount = new RegExp(total.toFixed(2).replace(".", "\\."));

      expect(auto!.sub).toMatch(amount);
      expect(manual!.sub).toMatch(amount);
      expect(manual!.sub).toContain("once");
      expect(auto!.detail).toContain("Renews automatically");
      expect(manual!.detail).toContain("No automatic renewal");
    }
  });

  it("describes access length in months for the chosen interval", () => {
    expect(paymentModeDetail("manual", "pro", "monthly")).toContain("1 month of access");
    expect(paymentModeDetail("manual", "pro", "yearly")).toContain("12 months of access");
    expect(paymentModeDetail("auto", "pro", "monthly")).toContain("every month");
    expect(paymentModeDetail("auto", "pro", "quarterly")).toContain("every 3 months");
  });
});
