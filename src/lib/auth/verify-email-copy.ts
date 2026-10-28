/** Shared verify-email copy — website + email stay in sync. */

export const VERIFY_EMAIL_HEADLINE = "Ready to start your exam prep";

/** Primary inbox heading on premium verify surfaces. */
export const VERIFY_EMAIL_INBOX_HEADLINE = "Check your inbox";

/** @deprecated use VERIFY_EMAIL_INBOX_HEADLINE */
export const VERIFY_EMAIL_CHECK_LABEL = "Check your email";

export const VERIFY_EMAIL_NEXT_STEP =
  "Open that email, tap the link, then come back here.";

export const VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE =
  "Don't see it? Check your Spam or Junk folder.";

export const VERIFY_EMAIL_SPAM_CALLOUT_TIMING = "It can take a few minutes.";

export const VERIFY_EMAIL_SPAM_CALLOUT_RESEND_NEARBY = "Still nothing? Tap Resend email.";

export const VERIFY_EMAIL_SPAM_CALLOUT_RESEND_AFTER_LOGIN =
  "Still nothing? Log in and tap Resend email.";

export const VERIFY_EMAIL_LINK_ISSUE_HEADLINE =
  "This link has expired or was already used";

export const VERIFY_EMAIL_LINK_ISSUE_SUBLINE =
  "Request a fresh verification email after you log in — your old link will not work.";

export const VERIFY_EMAIL_MISSING_LINK_HEADLINE = "Verification link missing";

/** @deprecated use VERIFY_EMAIL_LINK_ISSUE_HEADLINE */
export const VERIFY_EMAIL_INVALID_LINK_TITLE = VERIFY_EMAIL_LINK_ISSUE_HEADLINE;

/** @deprecated */
export const VERIFY_EMAIL_INVALID_LINK_BODY = VERIFY_EMAIL_LINK_ISSUE_SUBLINE;

/** @deprecated */
export const VERIFY_EMAIL_MISSING_LINK_TITLE = VERIFY_EMAIL_MISSING_LINK_HEADLINE;

/** @deprecated */
export const VERIFY_EMAIL_MISSING_LINK_BODY =
  "Open the full link from your email, or request a new one after you log in.";

export function formatVerifyEmailSentLine(displayEmail: string): string {
  return `We sent a link to ${displayEmail}.`;
}

/** @deprecated use formatVerifyEmailSentLine */
export function formatVerifyEmailBody(displayEmail: string): string {
  return `Please look for the verification link we sent to ${displayEmail}.`;
}
