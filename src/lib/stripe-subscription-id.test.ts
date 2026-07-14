import { describe, expect, it } from "vitest";
import { isUsableStripeSubscriptionId } from "./stripe";

describe("isUsableStripeSubscriptionId", () => {
  it("accepts real subscription ids", () => {
    expect(isUsableStripeSubscriptionId("sub_1Ts1AYHzk3nTXwgVj7j4DYAU")).toBe(true);
  });

  it("rejects seed and empty ids", () => {
    expect(isUsableStripeSubscriptionId("sub_seed_test_trial")).toBe(false);
    expect(isUsableStripeSubscriptionId("cus_123")).toBe(false);
    expect(isUsableStripeSubscriptionId(null)).toBe(false);
    expect(isUsableStripeSubscriptionId("")).toBe(false);
  });
});
