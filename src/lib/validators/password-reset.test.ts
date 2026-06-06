import { describe, expect, it } from "vitest";
import {
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  forgotPasswordSchema,
  resetPasswordSchema,
  strongPasswordError,
} from "@/lib/validators/password-reset";

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
  it("accepts newPassword with strong rules", () => {
    const result = resetPasswordSchema.parse({
      token: "abc",
      newPassword: "Secure1!",
    });
    expect(result.newPassword).toBe("Secure1!");
  });

  it("accepts legacy password field", () => {
    const result = resetPasswordSchema.parse({
      token: "abc",
      password: "Secure1!",
    });
    expect(result.newPassword).toBe("Secure1!");
  });

  it("rejects weak passwords", () => {
    expect(() =>
      resetPasswordSchema.parse({ token: "abc", newPassword: "short" })
    ).toThrow();
    expect(() =>
      resetPasswordSchema.parse({ token: "abc", newPassword: "NoSymbol1" })
    ).toThrow();
    expect(() =>
      resetPasswordSchema.parse({ token: "abc", newPassword: "NoNumber!" })
    ).toThrow();
  });
});

describe("strongPasswordError", () => {
  it("returns null for valid passwords", () => {
    expect(strongPasswordError("ValidPass1!")).toBeNull();
  });

  it("reports missing requirements", () => {
    expect(strongPasswordError("abc")).toMatch(/8 characters/);
    expect(strongPasswordError("abcdefgh")).toMatch(/number/);
    expect(strongPasswordError("Abcdefg1")).toMatch(/symbol/);
  });
});
