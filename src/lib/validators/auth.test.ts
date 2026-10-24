import { describe, expect, it } from "vitest";
import { signUpSchema } from "@/lib/validators/auth";

const baseSignup = {
  email: "student@example.com",
  password: "TestPassword1",
  firstName: "Ava",
  lastName: "Lee",
  acceptedTerms: true as const,
  plan: "trial" as const,
  examSlug: "nclex" as const,
};

describe("signUpSchema", () => {
  it("accepts signup without date of birth when terms are accepted", () => {
    const parsed = signUpSchema.parse(baseSignup);
    expect(parsed.dateOfBirth).toBeUndefined();
  });

  it("still validates date of birth when provided", () => {
    const parsed = signUpSchema.parse({
      ...baseSignup,
      dateOfBirth: "1992-03-20",
    });
    expect(parsed.dateOfBirth).toBe("1992-03-20");
  });

  it("rejects signup when terms are not accepted", () => {
    expect(() =>
      signUpSchema.parse({
        ...baseSignup,
        acceptedTerms: false,
      })
    ).toThrow();
  });
});
