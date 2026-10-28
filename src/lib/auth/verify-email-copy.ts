/** Shared verify-email copy — website + email stay in sync. */

export const VERIFY_EMAIL_HEADLINE = "Ready to start your exam prep";

export const VERIFY_EMAIL_CHECK_LABEL = "Check your email";

export const VERIFY_EMAIL_NEXT_STEP =
  "Open that email, verify, then come back here.";

export const VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE =
  "Don't see it? Check your Spam or Junk folder.";

export const VERIFY_EMAIL_SPAM_CALLOUT_TIMING = "It can take a few minutes.";

export const VERIFY_EMAIL_SPAM_CALLOUT_RESEND_NEARBY = "Still nothing? Tap Resend email.";

export const VERIFY_EMAIL_SPAM_CALLOUT_RESEND_AFTER_LOGIN =
  "Still nothing? Log in and tap Resend email.";

export const VERIFY_EMAIL_INVALID_LINK_TITLE =
  "This verification link is invalid or has expired.";

export const VERIFY_EMAIL_INVALID_LINK_BODY =
  "Request a new link from your account — the old one no longer works.";

export const VERIFY_EMAIL_MISSING_LINK_TITLE = "Verification link missing.";

export const VERIFY_EMAIL_MISSING_LINK_BODY =
  "Open the full link from your email, or request a new one after you log in.";

export function formatVerifyEmailBody(displayEmail: string): string {
  return `Please look for the verification link we sent to ${displayEmail}.`;
}
