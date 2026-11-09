import { cookies } from "next/headers";
import { SIGNUP_CONSENT_COOKIE, parseSignupConsentCookie } from "@/lib/legal/signup-consent-cookie";

export async function hasSignupConsentCookie(): Promise<boolean> {
  try {
    const jar = await cookies();
    return parseSignupConsentCookie(jar.get(SIGNUP_CONSENT_COOKIE)?.value);
  } catch {
    return false;
  }
}
