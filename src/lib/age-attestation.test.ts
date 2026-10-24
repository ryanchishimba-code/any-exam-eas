import { describe, expect, it } from "vitest";
import { formatAgeVerificationForConsent } from "@/lib/age-attestation";

describe("formatAgeVerificationForConsent", () => {
  it("shows attestation date when DOB was not collected", () => {
    expect(
      formatAgeVerificationForConsent({
        dateOfBirth: new Date("1990-01-01"),
        metadata: { dateOfBirthProvided: false, ageAttestedAt: "2026-10-24" },
      })
    ).toBe("18+ attestation (2026-10-24)");
  });

  it("shows stored DOB when birth date was provided", () => {
    expect(
      formatAgeVerificationForConsent({
        dateOfBirth: new Date("1992-03-20T12:00:00.000Z"),
        metadata: { dateOfBirthProvided: true },
      })
    ).toBe("1992-03-20");
  });
});
