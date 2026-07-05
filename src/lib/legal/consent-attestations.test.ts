import { describe, expect, it } from "vitest";
import {
  CONSENT_ATTESTATION_VERSION,
  getSignupConsentAttestations,
  getSignupConsentSummaryLines,
} from "@/lib/legal/consent-attestations";
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
    expect(lines.length).toBeGreaterThanOrEqual(3);
    expect(lines.some((l) => /not affiliated/i.test(l))).toBe(true);
  });

  it("uses a stable attestation version id", () => {
    expect(CONSENT_ATTESTATION_VERSION).toMatch(/^\d{4}-\d{2}-\d{2}$/);
  });
});
