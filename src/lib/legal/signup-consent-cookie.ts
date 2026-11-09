import { CONSENT_ATTESTATION_VERSION } from "@/lib/legal/consent-attestations";
import { LEGAL_LAST_UPDATED } from "@/lib/legal";

/** Short-lived proof that a new social signup checked the current terms. */
export const SIGNUP_CONSENT_COOKIE = "aee_legal";
export const SIGNUP_CONSENT_MAX_AGE_SEC = 10 * 60;

export function signupConsentCookieValue(now = Date.now()): string {
  return `${LEGAL_LAST_UPDATED}|${CONSENT_ATTESTATION_VERSION}|${now}`;
}

export function parseSignupConsentCookie(
  raw: string | null | undefined,
  now = Date.now()
): boolean {
  if (!raw) return false;
  let decoded = raw;
  try {
    decoded = decodeURIComponent(raw);
  } catch {
    return false;
  }
  const [updated, version, stamped] = decoded.split("|");
  if (updated !== LEGAL_LAST_UPDATED || version !== CONSENT_ATTESTATION_VERSION) return false;
  const at = Number(stamped);
  if (!Number.isFinite(at)) return false;
  const age = now - at;
  return age >= -60_000 && age <= SIGNUP_CONSENT_MAX_AGE_SEC * 1000;
}

/** Browser only. Called after the signup checkbox is checked, before social sign-in. */
export function stampSignupConsentCookie(): void {
  if (typeof document === "undefined") return;
  const secure = window.location.protocol === "https:" ? "; Secure" : "";
  document.cookie = `${SIGNUP_CONSENT_COOKIE}=${encodeURIComponent(signupConsentCookieValue())}; Path=/; Max-Age=${SIGNUP_CONSENT_MAX_AGE_SEC}; SameSite=Lax${secure}`;
}
