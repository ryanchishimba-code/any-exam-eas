import { createHash } from "node:crypto";
import { afterEach, describe, expect, it, vi } from "vitest";
import {
  GOOGLE_ADS_ACCOUNT_125_SIGNUP_EVENT,
  GOOGLE_ADS_PURCHASE_SEND_TO,
  GOOGLE_ADS_SIGNUP_SEND_TO,
  GOOGLE_ADS_TAG_ID,
  STRIPE_CHECKOUT_SUCCESS_PATH,
  buildConfirmedPurchase,
  encodePurchaseCookie,
  encodeSignupCookie,
  googleTagBootstrapScript,
  hashEmailForAds,
  memoryFiredStore,
  parsePurchaseCookie,
  parseSignupCookie,
  purchaseFromCheckoutSession,
  purchaseGtagEvents,
  signUpGtagEvents,
  trackPurchaseOnce,
  trackSignUpOnce,
} from "@/lib/analytics/google-ads";
import {
  GOOGLE_TAG_CONNECT_HOSTS,
  GOOGLE_TAG_SCRIPT_HOSTS,
} from "@/lib/analytics/google-tag-policy";

const USER_ID = "cm123abc456def789xyz";

describe("google ads conversion ids", () => {
  it("uses the tag and labels from account 917-707-9098", () => {
    expect(GOOGLE_ADS_TAG_ID).toBe("AW-18297494724");
    expect(GOOGLE_ADS_SIGNUP_SEND_TO).toBe("AW-18297494724/noSrCL349MAdEMS59pRE");
    expect(GOOGLE_ADS_PURCHASE_SEND_TO).toBe("AW-18297494724/fqrSCMD49MAdEMS59pRE");
    expect(STRIPE_CHECKOUT_SUCCESS_PATH).toBe(
      "/checkout/return?session_id={CHECKOUT_SESSION_ID}"
    );
  });

  it("allows the Google tag in the production content security policy", () => {
    expect(GOOGLE_TAG_SCRIPT_HOSTS).toContain("https://www.googletagmanager.com");
    expect(GOOGLE_TAG_CONNECT_HOSTS).toContain("https://www.google-analytics.com");
    expect(GOOGLE_TAG_CONNECT_HOSTS).toContain("https://googleads.g.doubleclick.net");
  });
});

describe("google tag bootstrap", () => {
  afterEach(() => {
    vi.unstubAllEnvs();
  });

  it("sets Consent Mode v2 defaults before the Ads config", () => {
    const script = googleTagBootstrapScript();
    const consentAt = script.indexOf("gtag('consent', 'default'");
    const configAt = script.indexOf(`gtag('config', '${GOOGLE_ADS_TAG_ID}'`);
    expect(consentAt).toBeGreaterThan(-1);
    expect(configAt).toBeGreaterThan(consentAt);
    expect(script).toContain("ad_user_data: 'denied'");
    expect(script).toContain("ad_personalization: 'denied'");
    expect(script).toContain("'GB'");
    expect(script).toContain("ad_storage: 'granted'");
    expect(script).toContain("allow_enhanced_conversions: true");
    expect(script).not.toContain(GOOGLE_ADS_ACCOUNT_125_SIGNUP_EVENT);
  });

  it("adds GA4 and the account 125 tag only when those ids are set", () => {
    vi.stubEnv("NEXT_PUBLIC_GA_MEASUREMENT_ID", "G-TEST123");
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ACCOUNT_125_ID", "AW-9990001111");
    const script = googleTagBootstrapScript();
    expect(script).toContain("gtag('config', 'G-TEST123')");
    expect(script).toContain("gtag('config', 'AW-9990001111'");
  });

  it("ignores an ads id that is not an AW- tag", () => {
    vi.stubEnv("NEXT_PUBLIC_GOOGLE_ADS_ACCOUNT_125_ID", "125-765-3442");
    expect(googleTagBootstrapScript()).not.toContain("125-765-3442");
  });
});

describe("signup and purchase hits", () => {
  it("fires GA4 sign_up, the trial label, and the account 125 event once", async () => {
    const store = memoryFiredStore();
    const sent: { events: { name: string; params: Record<string, unknown> }[]; hash: string | null }[] =
      [];
    const signup = { method: "email", userId: USER_ID, trial: true };

    const first = await trackSignUpOnce({
      signup,
      email: " Student@Example.com ",
      store,
      gaId: "G-TEST123",
      account125Id: "AW-9990001111",
      send: async (events, hash) => {
        sent.push({ events, hash });
      },
    });
    const second = await trackSignUpOnce({
      signup,
      email: "student@example.com",
      store,
      gaId: "G-TEST123",
      account125Id: "AW-9990001111",
      send: async () => {
        throw new Error("second signup must not send");
      },
    });

    expect(first).toBe(true);
    expect(second).toBe(false);
    expect(sent).toHaveLength(1);
    expect(sent[0]?.events).toEqual([
      { name: "sign_up", params: { method: "email", send_to: "G-TEST123" } },
      {
        name: "conversion",
        params: { send_to: GOOGLE_ADS_SIGNUP_SEND_TO, transaction_id: USER_ID },
      },
      {
        name: GOOGLE_ADS_ACCOUNT_125_SIGNUP_EVENT,
        params: { send_to: "AW-9990001111", transaction_id: USER_ID },
      },
    ]);
    expect(sent[0]?.hash).toBe(
      createHash("sha256").update("student@example.com").digest("hex")
    );
  });

  it("does not send the free-trial label for a paid signup", () => {
    expect(
      signUpGtagEvents({
        userId: USER_ID,
        method: "google",
        trial: false,
        gaId: "G-TEST123",
        account125Id: null,
      })
    ).toEqual([{ name: "sign_up", params: { method: "google", send_to: "G-TEST123" } }]);
  });

  it("fires purchase once per transaction with value, currency, and items", async () => {
    const purchase = buildConfirmedPurchase({
      transactionId: "sub_123abc",
      amountCents: 2799,
      currency: "usd",
      tier: "pro",
      interval: "monthly",
    });
    expect(purchase).toMatchObject({
      transactionId: "sub_123abc",
      value: 27.99,
      currency: "USD",
      itemId: "pro_monthly",
      itemName: "Pro monthly",
    });
    const store = memoryFiredStore();
    const sent: { name: string; params: Record<string, unknown> }[][] = [];
    const send = async (
      events: { name: string; params: Record<string, unknown> }[]
    ) => {
      sent.push(events);
    };

    expect(
      await trackPurchaseOnce({
        purchase: purchase!,
        email: "student@example.com",
        store,
        gaId: "G-TEST123",
        send,
      })
    ).toBe(true);
    expect(
      await trackPurchaseOnce({
        purchase: purchase!,
        store,
        gaId: "G-TEST123",
        send,
      })
    ).toBe(false);

    expect(sent).toHaveLength(1);
    expect(sent[0]).toEqual(purchaseGtagEvents(purchase!, "G-TEST123"));
    const ga4 = sent[0]?.find((event) => event.name === "purchase");
    expect(ga4?.params).toMatchObject({
      send_to: "G-TEST123",
      transaction_id: "sub_123abc",
      value: 27.99,
      currency: "USD",
      items: [
        {
          item_id: "pro_monthly",
          item_name: "Pro monthly",
          price: 27.99,
          quantity: 1,
        },
      ],
    });
    const ads = sent[0]?.find((event) => event.name === "conversion");
    expect(ads?.params).toMatchObject({
      send_to: GOOGLE_ADS_PURCHASE_SEND_TO,
      value: 27.99,
      currency: "USD",
      transaction_id: "sub_123abc",
    });
  });

  it("counts a second payment with a different transaction id", async () => {
    const store = memoryFiredStore();
    const send = vi.fn(async () => undefined);
    const first = buildConfirmedPurchase({
      transactionId: "cs_first",
      amountCents: 2799,
      currency: "usd",
    })!;
    const second = buildConfirmedPurchase({
      transactionId: "cs_second",
      amountCents: 23512,
      currency: "usd",
      interval: "yearly",
    })!;
    expect(await trackPurchaseOnce({ purchase: first, store, gaId: null, send })).toBe(true);
    expect(await trackPurchaseOnce({ purchase: second, store, gaId: null, send })).toBe(true);
    expect(send).toHaveBeenCalledTimes(2);
  });
});

describe("confirmed checkout purchase", () => {
  const paid = {
    id: "cs_test_123",
    status: "complete",
    payment_status: "paid",
    amount_total: 2799,
    currency: "usd",
    metadata: { userId: USER_ID, tier: "pro", interval: "monthly" },
    subscription: "sub_abc123",
  };

  it("uses the subscription id after a paid session for this user", () => {
    expect(purchaseFromCheckoutSession(paid, USER_ID)?.transactionId).toBe("sub_abc123");
  });

  it("uses the checkout session id for a one-time payment", () => {
    expect(
      purchaseFromCheckoutSession({ ...paid, subscription: null }, USER_ID)?.transactionId
    ).toBe("cs_test_123");
  });

  it("does not fire for another user, an unpaid session, or a zero amount", () => {
    expect(purchaseFromCheckoutSession(paid, "cmotheruser12345678")).toBeNull();
    expect(
      purchaseFromCheckoutSession({ ...paid, payment_status: "unpaid" }, USER_ID)
    ).toBeNull();
    expect(purchaseFromCheckoutSession({ ...paid, amount_total: 0 }, USER_ID)).toBeNull();
    expect(purchaseFromCheckoutSession({ ...paid, metadata: null }, USER_ID)).toBeNull();
  });
});

describe("conversion cookies", () => {
  it("round-trips a new-account beacon and rejects a login", () => {
    const encoded = encodeSignupCookie({ method: "Google", userId: USER_ID, trial: true });
    expect(parseSignupCookie(encoded!)).toEqual({
      method: "google",
      userId: USER_ID,
      trial: true,
    });
    expect(parseSignupCookie("email.short.1")).toBeNull();
  });

  it("round-trips a confirmed purchase", () => {
    const purchase = buildConfirmedPurchase({
      transactionId: "sub_abc123",
      amountCents: 23512,
      currency: "usd",
      interval: "yearly",
    })!;
    expect(parsePurchaseCookie(encodePurchaseCookie(purchase)!)).toEqual(purchase);
  });
});

describe("enhanced conversion email hash", () => {
  it("hashes the trimmed lowercase address", async () => {
    expect(await hashEmailForAds(" Student@Example.com ")).toBe(
      createHash("sha256").update("student@example.com").digest("hex")
    );
    expect(await hashEmailForAds("not-an-email")).toBeNull();
  });
});
