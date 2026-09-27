import { describe, expect, it } from "vitest";
import {
  assertStripeTrialCheckoutClosed,
  paidSubscribeHrefFromCheckoutQuery,
  resolveCheckoutEntry,
  signupHrefFromCheckoutQuery,
} from "./card-free-checkout";

const trialQuery = {
  plan: "trial",
  interval: "monthly",
  tier: "pro",
  reactivate: "1",
};

describe("resolveCheckoutEntry", () => {
  it("leaves an explicit paid subscribe on checkout", () => {
    expect(
      resolveCheckoutEntry({
        plan: "subscribe",
        loggedIn: false,
        trialAvailable: true,
      })
    ).toEqual({ kind: "paid-checkout" });
  });

  it("sends logged-out trial and bare checkout URLs to signup", () => {
    expect(
      resolveCheckoutEntry({
        plan: "trial",
        loggedIn: false,
        trialAvailable: true,
        query: trialQuery,
      })
    ).toEqual({
      kind: "signup",
      href: "/signup?plan=trial&interval=monthly&tier=pro",
    });

    expect(
      resolveCheckoutEntry({
        plan: undefined,
        loggedIn: false,
        trialAvailable: true,
        query: { interval: "yearly", reactivate: "1" },
      })
    ).toEqual({
      kind: "signup",
      href: "/signup?plan=trial&interval=yearly",
    });
  });

  it("starts the card-free trial for a logged-in user who has not used one", () => {
    expect(
      resolveCheckoutEntry({
        plan: "trial",
        loggedIn: true,
        trialAvailable: true,
        accessStatus: "inactive",
        query: trialQuery,
      }).kind
    ).toBe("start-app-trial");

    expect(
      resolveCheckoutEntry({
        plan: undefined,
        loggedIn: true,
        trialAvailable: true,
        accessStatus: "none",
        query: { reactivate: "1" },
      }).kind
    ).toBe("start-app-trial");
  });

  it("sends a used trial to paid subscribe without a trial plan", () => {
    const decision = resolveCheckoutEntry({
      plan: "trial",
      loggedIn: true,
      trialAvailable: false,
      accessStatus: "trial_expired",
      query: trialQuery,
    });
    expect(decision).toEqual({
      kind: "paid-subscribe",
      href: "/checkout?plan=subscribe&interval=monthly&tier=pro&reactivate=1",
    });
    expect(decision.kind === "paid-subscribe" && decision.href).not.toContain("plan=trial");
    expect(decision.kind === "paid-subscribe" && decision.href).not.toContain(
      "no payment method required"
    );
  });

  it("does not restart a trial that is already running", () => {
    expect(
      resolveCheckoutEntry({
        plan: "trial",
        loggedIn: true,
        trialAvailable: true,
        accessStatus: "trialing",
      })
    ).toEqual({ kind: "dashboard" });
  });

  it("offers paid subscribe when a current trial was already used", () => {
    expect(
      resolveCheckoutEntry({
        plan: "trial",
        loggedIn: true,
        trialAvailable: false,
        accessStatus: "trialing",
        query: { interval: "yearly" },
      })
    ).toEqual({
      kind: "paid-subscribe",
      href: "/checkout?plan=subscribe&interval=yearly",
    });
  });

  it("does not open a trial over an active paid subscription or a failed payment", () => {
    expect(
      resolveCheckoutEntry({
        plan: "trial",
        loggedIn: true,
        trialAvailable: true,
        accessStatus: "active",
      })
    ).toEqual({ kind: "dashboard" });

    expect(
      resolveCheckoutEntry({
        plan: "trial",
        loggedIn: true,
        trialAvailable: true,
        accessStatus: "past_due",
        query: trialQuery,
      })
    ).toEqual({ kind: "update-payment", href: "/settings?billing=past_due" });
  });
});

describe("checkout href helpers", () => {
  it("drops reactivate from the signup link", () => {
    expect(signupHrefFromCheckoutQuery(trialQuery)).toBe(
      "/signup?plan=trial&interval=monthly&tier=pro"
    );
  });

  it("forces plan=subscribe on the paid fallback", () => {
    expect(paidSubscribeHrefFromCheckoutQuery(trialQuery)).toBe(
      "/checkout?plan=subscribe&interval=monthly&tier=pro&reactivate=1"
    );
  });
});

describe("assertStripeTrialCheckoutClosed", () => {
  it("rejects a Stripe trial plan before a checkout session can be built", () => {
    expect(() => assertStripeTrialCheckoutClosed("trial")).toThrow(/Stripe trials are closed/);
    expect(() => assertStripeTrialCheckoutClosed("subscribe")).not.toThrow();
    expect(() => assertStripeTrialCheckoutClosed(undefined)).not.toThrow();
  });
});
