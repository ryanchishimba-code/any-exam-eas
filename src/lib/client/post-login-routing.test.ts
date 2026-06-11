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

  it("routes new users without an exam to /select-exam", () => {
    expect(
      resolvePostLoginDestination("/dashboard", { hasAccess: true }, null)
    ).toBe("/select-exam");
  });

  it("sends unpaid users to trial checkout when they already have an exam", () => {
    expect(
      resolvePostLoginDestination("/dashboard", { hasAccess: false }, "nclex")
    ).toBe("/checkout?plan=trial");
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
