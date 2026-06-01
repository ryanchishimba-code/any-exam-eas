import { describe, expect, it } from "vitest";
import {
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  forgotPasswordSchema,
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
