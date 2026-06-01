export type EmailDeliveryResult =
  | { ok: true; provider: "resend"; messageId?: string }
  | { ok: false; reason: "not_configured" | "send_failed"; detail?: string };

export function getEmailFromAddress(): string {
  return process.env.EMAIL_FROM?.trim() || "Any Exam Easy <onboarding@resend.dev>";
}

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY?.trim());
}

export function appBaseUrl(): string {
  const raw =
    process.env.NEXTAUTH_URL ??
    process.env.NEXT_PUBLIC_SITE_URL ??
    "http://localhost:3000";

  // Local dev should never generate reset links pointing at production.
  if (process.env.NODE_ENV === "development") {
    const trimmed = raw.replace(/\/$/, "");
    if (/localhost|127\.0\.0\.1/i.test(trimmed)) return trimmed;
    return "http://localhost:3000";
  }

  return raw.replace(/\/$/, "");
}
