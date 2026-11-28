import { describe, expect, it } from "vitest";
import {
  GOOGLE_ADS_ID,
  GOOGLE_ADS_PURCHASE_SEND_TO,
  GOOGLE_ADS_PURCHASE_VALUE_USD,
  GOOGLE_ADS_TRIAL_SEND_TO,
  googleAdsConversionParams,
  googleAdsScriptSrc,
  isStripeCheckoutSessionId,
  normalizeAdsEmail,
  paidCheckoutSuccessUrl,
  paidUpgradeReturnPath,
  purchaseConversionFromCheckout,
  purchaseConversionFromSubscription,
  trialConversionReady,
} from "@/lib/analytics/google-ads";

describe("google ads tag", () => {
  it("loads the ads id and nothing else in the script address", () => {
    const src = googleAdsScriptSrc();
    expect(src).toBe(`https://www.googletagmanager.com/gtag/js?id=${GOOGLE_ADS_ID}`);
    expect(src).not.toContain("@");
    expect(src).not.toContain("email");
  });

  it("keeps email out of conversion parameters and checkout return URLs", () => {
    const params = googleAdsConversionParams({
      sendTo: GOOGLE_ADS_PURCHASE_SEND_TO,
      value: GOOGLE_ADS_PURCHASE_VALUE_USD,
      transactionId: "sub_123",
    });
    expect(params).toEqual({
      send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
      value: 27.99,
      currency: "USD",
      transaction_id: "sub_123",
    });
    expect(params).not.toHaveProperty("email");
    expect(JSON.stringify(params)).not.toContain("@");

    const success = paidCheckoutSuccessUrl("https://www.anyexameasy.com", "/dashboard");
    expect(success).toBe(
      "https://www.anyexameasy.com/dashboard?checkout=success&stripe_session={CHECKOUT_SESSION_ID}"
    );
    expect(success).not.toContain("@");
    expect(paidUpgradeReturnPath("/dashboard", "sub_abc")).toBe(
      "/dashboard?checkout=success&stripe_subscription=sub_abc"
    );
    expect(paidUpgradeReturnPath("/dashboard", "user@example.com")).toBe("/dashboard?checkout=success");
  });

  it("normalizes an email for gtag set and rejects values that are not emails", () => {
    expect(normalizeAdsEmail("  Ada@Example.com ")).toBe("ada@example.com");
    expect(normalizeAdsEmail("not-an-email")).toBeNull();
    expect(normalizeAdsEmail("a b@example.com")).toBeNull();
  });

  it("fires the trial conversion only for a live trial that has not been sent", () => {
    expect(trialConversionReady({ status: "trialing", hasAccess: true, alreadySent: false })).toBe(true);
    expect(trialConversionReady({ status: "trialing", hasAccess: true, alreadySent: true })).toBe(false);
    expect(trialConversionReady({ status: "active", hasAccess: true, alreadySent: false })).toBe(false);
    expect(trialConversionReady({ status: "trialing", hasAccess: false, alreadySent: false })).toBe(false);
    expect(GOOGLE_ADS_TRIAL_SEND_TO).toBe("AW-18297494724/noSrCL349MAdEMS59pRE");
  });

  it("requires a completed paid subscription and uses the Stripe id", () => {
    const paid = purchaseConversionFromCheckout(
      {
        id: "cs_live_123",
        status: "complete",
        mode: "subscription",
        paymentStatus: "paid",
        amountTotal: 2799,
        plan: "subscribe",
        ownerUserId: "user_1",
        subscriptionId: "sub_live_9",
      },
      "user_1"
    );
    expect(paid).toEqual({
      transactionId: "sub_live_9",
      value: 27.99,
      currency: "USD",
      sendTo: GOOGLE_ADS_PURCHASE_SEND_TO,
    });

    expect(
      purchaseConversionFromCheckout(
        {
          id: "cs_live_123",
          status: "complete",
          mode: "subscription",
          paymentStatus: "paid",
          amountTotal: 0,
          plan: "trial",
          ownerUserId: "user_1",
          subscriptionId: "sub_live_9",
        },
        "user_1"
      )
    ).toBeNull();

    expect(
      purchaseConversionFromCheckout(
        {
          id: "cs_live_123",
          status: "open",
          mode: "subscription",
          paymentStatus: "unpaid",
          amountTotal: 2799,
          plan: "subscribe",
          ownerUserId: "user_1",
          subscriptionId: null,
        },
        "user_1"
      )
    ).toBeNull();

    expect(
      purchaseConversionFromSubscription(
        { id: "sub_live_9", status: "active", ownerUserId: "user_1", amountPaid: 2799 },
        "user_1"
      )?.transactionId
    ).toBe("sub_live_9");
    expect(
      purchaseConversionFromSubscription(
        { id: "sub_live_9", status: "trialing", ownerUserId: "user_1", amountPaid: 0 },
        "user_1"
      )
    ).toBeNull();
    expect(isStripeCheckoutSessionId("cs_test_abc")).toBe(true);
    expect(isStripeCheckoutSessionId("ada@example.com")).toBe(false);
  });
});
