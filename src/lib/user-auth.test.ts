import { describe, expect, it } from "vitest";
import {
  assertPublicSignupEmailAllowed,
  DISPOSABLE_EMAIL_MESSAGE,
  isAccountDisabled,
  RESERVED_EMAIL_MESSAGE,
} from "@/lib/account-security";
import { isDisposableEmail } from "@/lib/disposable-email-domains";
import { blocksUnverifiedTrialAccess } from "@/lib/access-control";

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

  it("rejects disposable domains when blockDisposable is true (trial)", () => {
    expect(() =>
      assertPublicSignupEmailAllowed("abuse@mailinator.com", { blockDisposable: true })
    ).toThrow(DISPOSABLE_EMAIL_MESSAGE);
    expect(() =>
      assertPublicSignupEmailAllowed("x@yopmail.com", { blockDisposable: true })
    ).toThrow(DISPOSABLE_EMAIL_MESSAGE);
    expect(() =>
      assertPublicSignupEmailAllowed("a@guerrillamail.com", { blockDisposable: true })
    ).toThrow(DISPOSABLE_EMAIL_MESSAGE);
  });

  it("allows disposable domains when blockDisposable is false (subscribe)", () => {
    expect(() =>
      assertPublicSignupEmailAllowed("pay@mailinator.com", { blockDisposable: false })
    ).not.toThrow();
    expect(() => assertPublicSignupEmailAllowed("pay@mailinator.com")).not.toThrow();
  });

  it("still rejects reserved domains even without disposable blocking", () => {
    expect(() =>
      assertPublicSignupEmailAllowed("test@anyexameasy.test", { blockDisposable: false })
    ).toThrow(RESERVED_EMAIL_MESSAGE);
  });
});

describe("isDisposableEmail", () => {
  it("detects known disposable domains and subdomains", () => {
    expect(isDisposableEmail("user@mailinator.com")).toBe(true);
    expect(isDisposableEmail("user@foo.mailinator.com")).toBe(true);
    expect(isDisposableEmail("student@gmail.com")).toBe(false);
    expect(isDisposableEmail("student@school.edu")).toBe(false);
  });
});

describe("blocksUnverifiedTrialAccess", () => {
  it("blocks unverified trialing users when verification is required", () => {
    expect(
      blocksUnverifiedTrialAccess({
        requireVerification: true,
        emailVerified: false,
        staff: false,
        subscriptionStatus: "trialing",
      })
    ).toBe(true);
  });

  it("does not block paid active subscribers even if unverified", () => {
    expect(
      blocksUnverifiedTrialAccess({
        requireVerification: true,
        emailVerified: false,
        staff: false,
        subscriptionStatus: "active",
      })
    ).toBe(false);
  });

  it("does not block when verification is off, verified, or staff", () => {
    expect(
      blocksUnverifiedTrialAccess({
        requireVerification: false,
        emailVerified: false,
        staff: false,
        subscriptionStatus: "trialing",
      })
    ).toBe(false);
    expect(
      blocksUnverifiedTrialAccess({
        requireVerification: true,
        emailVerified: true,
        staff: false,
        subscriptionStatus: "trialing",
      })
    ).toBe(false);
    expect(
      blocksUnverifiedTrialAccess({
        requireVerification: true,
        emailVerified: false,
        staff: true,
        subscriptionStatus: "trialing",
      })
    ).toBe(false);
  });
});

describe("isAccountDisabled", () => {
  it("flags suspended and deleted accounts", () => {
    expect(isAccountDisabled("suspended")).toBe(true);
    expect(isAccountDisabled("deleted")).toBe(true);
    expect(isAccountDisabled("active")).toBe(false);
  });
});
