import { cookies } from "next/headers";
import {
  ADS_SIGNUP_COOKIE,
  adsCookieOptions,
  encodeSignupCookie,
  type SignupBeacon,
} from "@/lib/analytics/google-ads";

/** One-shot cookie so the next page can fire sign_up after OAuth creates the account. */
export async function stampAdsSignupCookie(signup: SignupBeacon): Promise<void> {
  const value = encodeSignupCookie(signup);
  if (!value) return;
  try {
    const jar = await cookies();
    jar.set(ADS_SIGNUP_COOKIE, value, adsCookieOptions());
  } catch (error) {
    console.warn(
      "[ads] signup cookie skipped:",
      error instanceof Error ? error.message : error
    );
  }
}
