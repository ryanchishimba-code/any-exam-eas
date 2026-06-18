import { describe, expect, it } from "vitest";
import {
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  forgotPasswordSchema,
  resetPasswordSchema,
} from "@/lib/validators/password-reset";
import { passwordError } from "@/lib/validators/password-policy";

describe("forgotPasswordSchema", () => {
  it("accepts a valid email and normalizes it", () => {
    const result = forgotPasswordSchema.parse({ email: "  User@Example.COM  " });
    expect(result.email).toBe("user@example.com");
  });

  it("rejects invalid email format", () => {
    expect(() => forgotPasswordSchema.parse({ email: "not-an-email" })).toThrow();
  });

  it("uses a non-enumerating success message", () => {
    expect(FORGOT_PASSWORD_SUCCESS_MESSAGE).toMatch(/if an account exists/i);
    expect(FORGOT_PASSWORD_SUCCESS_MESSAGE).not.toMatch(/we found|does not exist|not registered/i);
  });
});

describe("resetPasswordSchema", () => {
  it("accepts newPassword that meets the policy", () => {
    const result = resetPasswordSchema.parse({
      token: "abc",
      newPassword: "SecurePass1",
    });
    expect(result.newPassword).toBe("SecurePass1");
  });

  it("accepts legacy password field", () => {
    const result = resetPasswordSchema.parse({
      token: "abc",
      password: "SecurePass1",
    });
    expect(result.newPassword).toBe("SecurePass1");
  });

  it("rejects passwords that violate the policy", () => {
    expect(() =>
      resetPasswordSchema.parse({ token: "abc", newPassword: "short1" })
    ).toThrow();
    expect(() =>
      resetPasswordSchema.parse({ token: "abc", newPassword: "1234567890" })
    ).toThrow();
    expect(() =>
      resetPasswordSchema.parse({ token: "abc", newPassword: "abcdefghij" })
    ).toThrow();
  });
});

describe("passwordError", () => {
  it("returns null for valid passwords", () => {
    expect(passwordError("ValidPass1")).toBeNull();
  });

  it("reports missing requirements", () => {
    expect(passwordError("abc")).toMatch(/10 characters/);
    expect(passwordError("abcdefghij")).toMatch(/number/);
    expect(passwordError("1234567890")).toMatch(/letter/);
  });
});
