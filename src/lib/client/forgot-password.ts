/** Minimum wait before the user can request another reset email. */
export const FORGOT_PASSWORD_RESEND_COOLDOWN_SEC = 60;

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function isValidForgotPasswordEmail(value: string): boolean {
  return EMAIL_PATTERN.test(value.trim());
}

export type ForgotPasswordRequestResult =
  | { ok: true; devResetUrl?: string }
  | { ok: false; error: string; retryAfterSec?: number };

export async function requestForgotPassword(
  email: string,
  baseUrl = ""
): Promise<ForgotPasswordRequestResult> {
  const trimmed = email.trim();
  if (!trimmed) {
    return { ok: false, error: "Enter your email address." };
  }
  if (!isValidForgotPasswordEmail(trimmed)) {
    return { ok: false, error: "Enter a valid email address." };
  }

  try {
    const res = await fetch(`${baseUrl}/api/auth/forgot-password`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: trimmed }),
    });

    let data: { error?: string; devResetUrl?: string } = {};
    try {
      data = await res.json();
    } catch {
      /* non-JSON */
    }

    if (res.status === 429) {
      const retryHeader = res.headers.get("Retry-After");
      const retryAfterSec = retryHeader ? Number.parseInt(retryHeader, 10) : undefined;
      return {
        ok: false,
        error: data.error ?? "Too many requests. Please wait a moment and try again.",
        retryAfterSec: Number.isFinite(retryAfterSec) ? retryAfterSec : undefined,
      };
    }

    if (!res.ok) {
      return {
        ok: false,
        error: data.error ?? "Something went wrong. Please try again.",
      };
    }

    return { ok: true, devResetUrl: data.devResetUrl };
  } catch {
    return { ok: false, error: "Something went wrong. Please try again." };
  }
}
