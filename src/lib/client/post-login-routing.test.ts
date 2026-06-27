import { describe, expect, it } from "vitest";
import { resolvePostLoginDestination } from "./post-login-routing";

describe("resolvePostLoginDestination", () => {
  it("honors /select-exam callback before paywall", () => {
    expect(
      resolvePostLoginDestination("/select-exam", { hasAccess: false }, null)
    ).toBe("/select-exam");
  });

  it("honors /select-exam?switch=1 for subscribed users", () => {
    expect(
      resolvePostLoginDestination("/select-exam?switch=1", { hasAccess: true }, "nclex")
    ).toBe("/select-exam?switch=1");
  });

  it("routes subscribed users to dashboard even without a saved exam", () => {
    expect(
      resolvePostLoginDestination("/dashboard", { hasAccess: true }, null)
    ).toBe("/dashboard");
  });

  it("falls back to dashboard when subscription status is still loading", () => {
    expect(resolvePostLoginDestination("/dashboard", null, null)).toBe("/dashboard");
  });

  it("sends inactive users without an exam to reactivate, not select-exam", () => {
    expect(
      resolvePostLoginDestination("/dashboard", { hasAccess: false }, null)
    ).toBe("/settings?reactivate=1");
  });

  it("sends inactive users without an exam to checkout when provided", () => {
    expect(
      resolvePostLoginDestination(
        "/dashboard",
        {
          hasAccess: false,
          reactivation: {
            method: "checkout",
            checkoutPath: "/checkout?plan=trial&tier=pro&interval=yearly&reactivate=1",
          },
        },
        null
      )
    ).toBe("/checkout?plan=trial&tier=pro&interval=yearly&reactivate=1");
  });

  it("sends lapsed users to settings reactivate by default", () => {
    expect(
      resolvePostLoginDestination("/dashboard", { hasAccess: false }, "nclex")
    ).toBe("/settings?reactivate=1");
  });

  it("sends returning users to subscribe checkout when reactivation says checkout", () => {
    expect(
      resolvePostLoginDestination(
        "/dashboard",
        {
          hasAccess: false,
          reactivation: {
            method: "checkout",
            checkoutPath: "/checkout?plan=subscribe&interval=yearly&reactivate=1",
          },
        },
        "nclex"
      )
    ).toBe("/checkout?plan=subscribe&interval=yearly&reactivate=1");
  });

  it("sends past_due users to billing settings", () => {
    expect(
      resolvePostLoginDestination(
        "/dashboard",
        {
          hasAccess: false,
          status: "past_due",
          reactivation: {
            method: "update_payment",
            settingsPath: "/settings?billing=past_due",
          },
        },
        "nclex"
      )
    ).toBe("/settings?billing=past_due");
  });

  it("returns dashboard for subscribed users with an exam", () => {
    expect(
      resolvePostLoginDestination("/dashboard", { hasAccess: true }, "usmle")
    ).toBe("/dashboard");
  });

  it("maps legacy study-hub callback to dashboard", () => {
    expect(
      resolvePostLoginDestination("/study-hub", { hasAccess: true }, "nclex")
    ).toBe("/dashboard");
  });
});
