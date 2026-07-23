import { describe, expect, it } from "vitest";
import { sanitizeCallbackUrl } from "./auth-routes";

describe("sanitizeCallbackUrl", () => {
  it("keeps relative checkout URLs with query params", () => {
    expect(
      sanitizeCallbackUrl(
        "/checkout?plan=subscribe&tier=pro&interval=yearly&return=%2Fdashboard"
      )
    ).toBe("/checkout?plan=subscribe&tier=pro&interval=yearly&return=%2Fdashboard");
  });

  it("extracts path + query from absolute NextAuth callback URLs", () => {
    expect(
      sanitizeCallbackUrl(
        "http://127.0.0.1:3000/checkout?plan=subscribe&tier=pro&interval=yearly"
      )
    ).toBe("/checkout?plan=subscribe&tier=pro&interval=yearly");
  });

  it("strips foreign hosts to a same-app path (no open redirect)", () => {
    // Absolute URLs are reduced to pathname+search on this origin — never sent off-site.
    expect(sanitizeCallbackUrl("https://evil.example/phish")).toBe("/phish");
    expect(sanitizeCallbackUrl("//evil.example")).toBe("/dashboard");
  });

  it("rejects auth loops", () => {
    expect(sanitizeCallbackUrl("/login?callbackUrl=/checkout")).toBe("/dashboard");
    expect(sanitizeCallbackUrl("/auth/login?callbackUrl=/checkout")).toBe("/dashboard");
  });
});
