import { describe, expect, it } from "vitest";
import {
  FORGOT_PASSWORD_RESEND_COOLDOWN_SEC,
  isValidForgotPasswordEmail,
} from "@/lib/client/forgot-password";

describe("forgot-password client helpers", () => {
  it("validates email format", () => {
    expect(isValidForgotPasswordEmail("user@example.com")).toBe(true);
    expect(isValidForgotPasswordEmail("  user@example.com  ")).toBe(true);
    expect(isValidForgotPasswordEmail("not-an-email")).toBe(false);
    expect(isValidForgotPasswordEmail("")).toBe(false);
  });

  it("uses a reasonable resend cooldown", () => {
    expect(FORGOT_PASSWORD_RESEND_COOLDOWN_SEC).toBeGreaterThanOrEqual(30);
    expect(FORGOT_PASSWORD_RESEND_COOLDOWN_SEC).toBeLessThanOrEqual(120);
  });
});
