import { describe, expect, it } from "vitest";
import {
  assertPublicSignupEmailAllowed,
  isAccountDisabled,
  RESERVED_EMAIL_MESSAGE,
} from "@/lib/account-security";

describe("register email policy", () => {
  it("rejects reserved internal test domains on public signup", () => {
    expect(() => assertPublicSignupEmailAllowed("test-premium@anyexameasy.test")).toThrow(
      RESERVED_EMAIL_MESSAGE
    );
    expect(() => assertPublicSignupEmailAllowed("k6@loadtest.anyexameasy.test")).toThrow(
      RESERVED_EMAIL_MESSAGE
    );
  });

  it("allows normal consumer emails", () => {
    expect(() => assertPublicSignupEmailAllowed("student@gmail.com")).not.toThrow();
  });
});

describe("isAccountDisabled", () => {
  it("flags suspended and deleted accounts", () => {
    expect(isAccountDisabled("suspended")).toBe(true);
    expect(isAccountDisabled("deleted")).toBe(true);
    expect(isAccountDisabled("active")).toBe(false);
  });
});
