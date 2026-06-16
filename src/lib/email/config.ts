import { getSiteUrl } from "@/lib/seo";

export type EmailDeliveryResult =
  | { ok: true; provider: "resend"; messageId?: string }
  | { ok: false; reason: "not_configured" | "send_failed"; detail?: string };

/** Resend sender — must use a verified domain in production (not onboarding@resend.dev). */
export function getEmailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "Any Exam Easy <onboarding@resend.dev>";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

/**
 * True when password reset emails can be attempted (Resend API key present).
 * Sandbox FROM only delivers to the Resend account owner until domain is verified.
 */
export function isPasswordResetEmailReady(): boolean {
  return isEmailConfigured();
}

export const PASSWORD_RESET_UNAVAILABLE_MESSAGE =
  "Password reset email is temporarily unavailable. Please contact support at /feedback.";

/** True when EMAIL_FROM uses Resend's sandbox sender (only delivers to the Resend account owner). */
export function isResendSandboxFrom(): boolean {
  const from = getEmailFromAddress().toLowerCase();
  return from.includes("resend.dev") || from.includes("onboarding@");
}

/**
 * Canonical origin for password-reset links in emails.
 * Production: set NEXTAUTH_URL=https://www.anyexameasy.com on Vercel/AWS.
 * Local dev: always localhost so links open your local app (not production).
 */
export function appBaseUrl(): string {
  const trimSlash = (value?: string) => value?.trim().replace(/\/$/, "") ?? "";

  if (process.env.NODE_ENV === "development") {
    const localCandidate =
      trimSlash(process.env.NEXTAUTH_URL) ||
      trimSlash(process.env.NEXT_PUBLIC_SITE_URL) ||
      "http://localhost:3000";
    if (/localhost|127\.0\.0\.1/i.test(localCandidate)) return localCandidate;
    return "http://localhost:3000";
  }

  const authUrl = trimSlash(process.env.NEXTAUTH_URL);
  if (authUrl && !/localhost|127\.0\.0\.1/i.test(authUrl)) return authUrl;

  const siteUrl = trimSlash(process.env.NEXT_PUBLIC_SITE_URL);
  if (siteUrl && !/localhost|127\.0\.0\.1/i.test(siteUrl)) return siteUrl;

  return getSiteUrl();
}

/** Full reset link — `/reset-password` redirects to `/auth/reset-password` via next.config. */
export function buildPasswordResetUrl(rawToken: string): string {
  return `${appBaseUrl()}/reset-password?token=${encodeURIComponent(rawToken)}`;
}

/**
 * Non-secret diagnostics for logs and /api/health.
 * Call on cold start or when a reset email fails to surface misconfiguration quickly.
 */
export function getEmailSetupWarnings(): string[] {
  const warnings: string[] = [];

  if (!isEmailConfigured()) {
    warnings.push(
      "RESEND_API_KEY is not set — password reset emails are skipped (API still returns generic success)."
    );
  }

  if (process.env.NODE_ENV === "production" && isResendSandboxFrom()) {
    warnings.push(
      "EMAIL_FROM uses Resend sandbox (onboarding@resend.dev) — emails only reach your Resend account owner. Verify anyexameasy.com in Resend and set EMAIL_FROM=Any Exam Easy <noreply@anyexameasy.com>."
    );
  }

  const base = appBaseUrl();
  if (process.env.NODE_ENV === "production" && /localhost|127\.0\.0\.1/i.test(base)) {
    warnings.push(
      `Reset links point to ${base} — set NEXTAUTH_URL=https://www.anyexameasy.com in production.`
    );
  }

  if (process.env.NODE_ENV === "production" && !process.env.NEXTAUTH_URL?.trim()) {
    warnings.push(
      "NEXTAUTH_URL is unset — reset links use NEXT_PUBLIC_SITE_URL or site fallback."
    );
  }

  return warnings;
}
