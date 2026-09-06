import {
  appBaseUrl,
  getEmailFromAddress,
  getEmailSetupWarnings,
  isEmailConfigured,
  isResendSandboxFrom,
  type EmailDeliveryResult,
} from "@/lib/email/config";
import { PASSWORD_RESET_EXPIRY_MINUTES } from "@/lib/validators/password-reset";

type PasswordResetEmailParams = {
  to: string;
  resetUrl: string;
};

function passwordResetHtml(resetUrl: string): string {
  const expiry = PASSWORD_RESET_EXPIRY_MINUTES;
  return `<!DOCTYPE html>
<html lang="en">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1d1d1f;margin:0;padding:0;background:#f5f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px;">
    <tr>
      <td align="center">
        <table width="100%" cellpadding="0" cellspacing="0" style="max-width:480px;background:#ffffff;border-radius:16px;padding:32px 28px;border:1px solid rgba(0,0,0,0.06);">
          <tr>
            <td>
              <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">Any Exam Easy</p>
              <h1 style="margin:0 0 16px;font-size:22px;font-weight:600;color:#0f172a;">Reset your password</h1>
              <p style="margin:0 0 20px;font-size:15px;color:#475569;">We received a request to reset the password for your Any Exam Easy account. Tap the button below to choose a new password.</p>
              <p style="margin:0 0 24px;text-align:center;">
                <a href="${resetUrl}" style="display:inline-block;background:linear-gradient(135deg,#0e7490,#0891b2);color:#ffffff;text-decoration:none;font-weight:600;font-size:15px;padding:14px 28px;border-radius:12px;">Reset password</a>
              </p>
              <p style="margin:0 0 12px;font-size:13px;color:#64748b;">This link expires in <strong>${expiry} minutes</strong> and can only be used once.</p>
              <table width="100%" cellpadding="0" cellspacing="0" style="margin:0 0 20px;background:#f8fafc;border-radius:10px;border:1px solid #e2e8f0;">
                <tr>
                  <td style="padding:14px 16px;">
                    <p style="margin:0 0 6px;font-size:12px;font-weight:600;color:#475569;">Security notice</p>
                    <p style="margin:0;font-size:12px;color:#64748b;line-height:1.5;">If you did not request a password reset, you can safely ignore this email — your password will not change. Never share this link with anyone. Any Exam Easy will never ask for your password by email.</p>
                  </td>
                </tr>
              </table>
              <p style="margin:0;font-size:12px;color:#94a3b8;word-break:break-all;">Or copy this URL into your browser:<br>${resetUrl}</p>
            </td>
          </tr>
        </table>
        <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;">© Any Exam Easy · anyexameasy.com</p>
      </td>
    </tr>
  </table>
</body>
</html>`;
}

function passwordResetText(resetUrl: string): string {
  const expiry = PASSWORD_RESET_EXPIRY_MINUTES;
  return [
    "Reset your Any Exam Easy password",
    "",
    "We received a request to reset the password for your Any Exam Easy account.",
    "Open the link below to choose a new password:",
    resetUrl,
    "",
    `This link expires in ${expiry} minutes and can only be used once.`,
    "",
    "SECURITY: If you did not request this, ignore this email — your password will not change.",
    "Never share this link. Any Exam Easy will never ask for your password by email.",
  ].join("\n");
}

/**
 * Sends password reset email via Resend when RESEND_API_KEY is set.
 * Returns a delivery result for server-side logging (never expose to clients in production).
 */
export async function sendPasswordResetEmail({
  to,
  resetUrl,
}: PasswordResetEmailParams): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getEmailFromAddress();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error(
        "[email] RESEND_API_KEY is not set — password reset email was not sent.",
        { toDomain: to.split("@")[1] ?? "unknown", setup: getEmailSetupWarnings() }
      );
    } else {
      console.warn("[email] RESEND_API_KEY not set — password reset email skipped (dev).");
    }
    return { ok: false, reason: "not_configured" };
  }

  if (process.env.NODE_ENV === "production" && isResendSandboxFrom()) {
    console.warn(
      "[email] EMAIL_FROM uses Resend sandbox — delivery is limited to your Resend account email.",
      { from, toDomain: to.split("@")[1] ?? "unknown" }
    );
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Reset your Any Exam Easy password",
        html: passwordResetHtml(resetUrl),
        text: passwordResetText(resetUrl),
      }),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error("[email] Resend password reset failed:", res.status, bodyText);
      return {
        ok: false,
        reason: "send_failed",
        detail: `${res.status}: ${bodyText.slice(0, 200)}`,
      };
    }

    let messageId: string | undefined;
    try {
      const parsed = JSON.parse(bodyText) as { id?: string };
      messageId = parsed.id;
    } catch {
      /* ignore */
    }

    console.info("[email] Password reset sent via Resend", {
      toDomain: to.split("@")[1] ?? "unknown",
      messageId,
    });

    return { ok: true, provider: "resend", messageId };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    console.error("[email] Password reset send error:", detail);
    return { ok: false, reason: "send_failed", detail };
  }
}

type VerificationEmailParams = {
  to: string;
  verifyUrl: string;
};

export async function sendVerificationEmail({
  to,
  verifyUrl,
}: VerificationEmailParams): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getEmailFromAddress();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] RESEND_API_KEY missing — verification email not sent.");
    }
    return { ok: false, reason: "not_configured" };
  }

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [to],
        subject: "Ready to start your exam prep — verify your email",
        html: `
          <p>Ready to start your exam prep?</p>
          <p>Please verify your email so we can keep your progress safe:</p>
          <p><a href="${verifyUrl}">Verify email address</a></p>
          <p>This link expires in 48 hours.</p>
          <p style="color:#666;font-size:12px">${verifyUrl}</p>
        `,
        text: `Ready to start your exam prep?\n\nPlease verify your email:\n${verifyUrl}\n\nThis link expires in 48 hours.`,
      }),
    });

    if (!res.ok) {
      const body = await res.text();
      console.error("[email] Verification send failed:", res.status, body);
      return { ok: false, reason: "send_failed", detail: body.slice(0, 200) };
    }

    return { ok: true, provider: "resend" };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "send_failed", detail };
  }
}

type SupportEmailParams = {
  to: string;
  subject: string;
  body: string;
  replyTo?: string;
};

function supportEmailHtml(subject: string, body: string): string {
  const escaped = body
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\n/g, "<br>");
  return `<!DOCTYPE html>
<html lang="en">
<body style="font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,sans-serif;line-height:1.6;color:#1d1d1f;margin:0;padding:0;background:#f5f5f7;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f7;padding:32px 16px;">
    <tr><td align="center">
      <table width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;background:#ffffff;border-radius:16px;padding:32px 28px;border:1px solid rgba(0,0,0,0.06);">
        <tr><td>
          <p style="margin:0 0 8px;font-size:12px;font-weight:600;letter-spacing:0.06em;text-transform:uppercase;color:#64748b;">Any Exam Easy Support</p>
          <h1 style="margin:0 0 16px;font-size:20px;font-weight:600;color:#0f172a;">${subject.replace(/</g, "&lt;")}</h1>
          <p style="margin:0;font-size:15px;color:#475569;">${escaped}</p>
        </td></tr>
      </table>
      <p style="margin:16px 0 0;font-size:11px;color:#94a3b8;">© Any Exam Easy · anyexameasy.com</p>
    </td></tr>
  </table>
</body>
</html>`;
}

/** Sends a support message to a user via Resend (admin customer service). */
export async function sendSupportEmail({
  to,
  subject,
  body,
  replyTo,
}: SupportEmailParams): Promise<EmailDeliveryResult> {
  const apiKey = process.env.RESEND_API_KEY?.trim();
  const from = getEmailFromAddress();

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      console.error("[email] RESEND_API_KEY missing — support email not sent.");
    }
    return { ok: false, reason: "not_configured" };
  }

  try {
    const payload: Record<string, unknown> = {
      from,
      to: [to],
      subject,
      html: supportEmailHtml(subject, body),
      text: body,
    };
    if (replyTo) payload.reply_to = replyTo;

    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    const bodyText = await res.text();
    if (!res.ok) {
      console.error("[email] Support email failed:", res.status, bodyText);
      return {
        ok: false,
        reason: "send_failed",
        detail: `${res.status}: ${bodyText.slice(0, 200)}`,
      };
    }

    return { ok: true, provider: "resend" };
  } catch (err) {
    const detail = err instanceof Error ? err.message : String(err);
    return { ok: false, reason: "send_failed", detail };
  }
}

export { appBaseUrl, isEmailConfigured };
