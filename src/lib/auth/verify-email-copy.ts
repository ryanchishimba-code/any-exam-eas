/** Shared verify-email copy — website + email stay in sync. */

export const VERIFY_EMAIL_HEADLINE = "Ready to start your exam prep";

export const VERIFY_EMAIL_CHECK_LABEL = "Check your email";

export const VERIFY_EMAIL_NEXT_STEP =
  "Open that email, verify, then come back here.";

export function formatVerifyEmailBody(displayEmail: string): string {
  return `Please look for the verification link we sent to ${displayEmail}.`;
}
