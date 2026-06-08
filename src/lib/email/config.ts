export type EmailDeliveryResult =
  | { ok: true; provider: "resend"; messageId?: string }
  | { ok: false; reason: "not_configured" | "send_failed"; detail?: string };

export function getEmailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "Any Exam Easy <onboarding@resend.dev>";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

import { getSiteUrl } from "@/lib/seo";

export function appBaseUrl(): string {
  if (process.env.NODE_ENV === "development") {
    const raw =
      process.env.NEXTAUTH_URL ??
      process.env.NEXT_PUBLIC_SITE_URL ??
      "http://localhost:3000";
    const trimmed = raw.replace(/\/$/, "");
    if (/localhost|127\.0\.0\.1/i.test(trimmed)) return trimmed;
    return "http://localhost:3000";
  }

  const authUrl = process.env.NEXTAUTH_URL?.trim().replace(/\/$/, "");
  if (authUrl) return authUrl;

  return getSiteUrl();
}
