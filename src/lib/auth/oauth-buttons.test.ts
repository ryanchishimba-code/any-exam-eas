import { describe, expect, it } from "vitest";
import { isAppleAuthButtonEnabled, isGoogleAuthButtonEnabled } from "@/lib/auth/oauth-buttons";

describe("oauth button flags", () => {
  it("stays off unless the public flag is exactly true", () => {
    const env = {
      NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: "",
      NEXT_PUBLIC_APPLE_AUTH_ENABLED: "false",
    };
    expect(isGoogleAuthButtonEnabled(env)).toBe(false);
    expect(isAppleAuthButtonEnabled(env)).toBe(false);
    expect(isGoogleAuthButtonEnabled({ NEXT_PUBLIC_GOOGLE_AUTH_ENABLED: "true" })).toBe(true);
    expect(isAppleAuthButtonEnabled({ NEXT_PUBLIC_APPLE_AUTH_ENABLED: "true" })).toBe(true);
  });
});
