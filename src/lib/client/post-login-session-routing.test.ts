import { describe, expect, it } from "vitest";
import { statusFromSessionRouting } from "./post-login";
import { resolvePostLoginDestination } from "./post-login-routing";

describe("JWT session login routing", () => {
  it("routes from session snapshot without status APIs", () => {
    const parsed = statusFromSessionRouting({
      hasAccess: true,
      hasAppAccess: true,
      subscriptionStatus: "active",
      examSlug: "naplex",
    });
    expect(parsed).not.toBeNull();
    expect(
      resolvePostLoginDestination("/dashboard", parsed!.status, parsed!.examSlug)
    ).toBe("/dashboard");
  });

  it("sends lapsed users to reactivate from JWT reactivation", () => {
    const parsed = statusFromSessionRouting({
      hasAccess: false,
      hasAppAccess: false,
      subscriptionStatus: "canceled",
      examSlug: "nclex",
      reactivation: {
        method: "checkout",
        checkoutPath: "/checkout?plan=subscribe&tier=pro&interval=yearly&reactivate=1",
      },
    });
    expect(
      resolvePostLoginDestination("/dashboard", parsed!.status, parsed!.examSlug)
    ).toBe("/checkout?plan=subscribe&tier=pro&interval=yearly&reactivate=1");
  });

  it("falls back to safe dashboard when snapshot is missing", () => {
    expect(statusFromSessionRouting(null)).toBeNull();
    expect(statusFromSessionRouting({ examSlug: "nclex" })).toBeNull();
    expect(resolvePostLoginDestination("/dashboard", null, null)).toBe("/dashboard");
    expect(resolvePostLoginDestination("/question-bank", null, null)).toBe("/question-bank");
  });
});
