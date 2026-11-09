import { describe, expect, it } from "vitest";
import {
  CONSENT_ATTESTATION_VERSION,
  getSignupConsentAttestations,
  getSignupConsentSummaryLines,
} from "@/lib/legal/consent-attestations";
import { readFileSync } from "node:fs";
import { LEGAL_ENTITY } from "@/lib/legal";

describe("consent attestations", () => {
  it("names the content provider and disclaims official exam material", () => {
    const text = getSignupConsentAttestations().join(" ");
    expect(text).toContain(LEGAL_ENTITY.companyName);
    expect(text).toContain(LEGAL_ENTITY.productName);
    expect(text).toMatch(/NOT actual NCLEX/i);
    expect(text).toMatch(/supplement—not my sole resource/i);
  });

  it("includes summary lines for signup UI", () => {
    const lines = getSignupConsentSummaryLines();
    expect(lines.some((l) => /original study material/i.test(l))).toBe(true);
    expect(lines.some((l) => /not official exam items/i.test(l))).toBe(true);
    expect(lines.some((l) => /not for patient care/i.test(l))).toBe(true);
    expect(lines.some((l) => /not consent to promotional email/i.test(l))).toBe(true);
    expect(lines.join(" ")).not.toMatch(/AI-generated|may contain errors/i);
  });

  it("keeps full AI-risk language on the stored attestation, not the signup checkbox", () => {
    const stored = getSignupConsentAttestations().join(" ");
    expect(stored).toMatch(/AI-generated/i);
    expect(stored).toMatch(/may be written, edited, or generated with AI/i);
    expect(stored).toMatch(/not for patient care/i);
    expect(stored).toMatch(/not consent to marketing email/i);
  });

  it("uses a stable attestation version id", () => {
    expect(CONSENT_ATTESTATION_VERSION).toBe("2026-11-09");
  });

  it("keeps social signup behind the terms checkbox", () => {
    const form = readFileSync("src/components/SignupForm.tsx", "utf8");
    expect(form).toContain("disabled={!accepted}");
    expect(form).toContain("stampSignupConsentCookie()");
    const oauth = readFileSync("src/lib/oauth-user.ts", "utf8");
    expect(oauth).toContain("SignupConsentRequiredError");
  });
});
