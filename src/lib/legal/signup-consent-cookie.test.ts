import { describe, expect, it } from "vitest";
import { CONSENT_ATTESTATION_VERSION } from "@/lib/legal/consent-attestations";
import { LEGAL_LAST_UPDATED } from "@/lib/legal";
import {
  parseSignupConsentCookie,
  signupConsentCookieValue,
} from "@/lib/legal/signup-consent-cookie";

describe("signup consent cookie", () => {
  it("accepts a stamp for the current terms version", () => {
    const now = Date.parse("2026-11-09T02:00:00.000Z");
    const raw = encodeURIComponent(signupConsentCookieValue(now));
    expect(parseSignupConsentCookie(raw, now + 1_000)).toBe(true);
  });

  it("rejects a missing, stale, or old-version stamp", () => {
    const now = Date.parse("2026-11-09T02:00:00.000Z");
    expect(parseSignupConsentCookie(null, now)).toBe(false);
    expect(parseSignupConsentCookie(`${LEGAL_LAST_UPDATED}|${CONSENT_ATTESTATION_VERSION}|${now - 11 * 60 * 1000}`, now)).toBe(
      false
    );
    expect(parseSignupConsentCookie(`September 27, 2026|${CONSENT_ATTESTATION_VERSION}|${now}`, now)).toBe(
      false
    );
  });
});
