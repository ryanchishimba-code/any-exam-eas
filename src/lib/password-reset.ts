import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { findUserByEmail, setUserPassword } from "@/lib/user-auth";
import { normalizeEmail } from "@/lib/validators/auth";
import { PASSWORD_RESET_EXPIRY_MINUTES } from "@/lib/validators/password-reset";
import {
  buildPasswordResetUrl,
  getEmailSetupWarnings,
} from "@/lib/email/config";
import { sendPasswordResetEmail } from "@/lib/email";

const TOKEN_BYTES = 32;

export type PasswordResetOutcome = {
  userFound: boolean;
  attempted: boolean;
  emailDelivered?: boolean;
  /** Present when email could not be sent (admin/dev scripts only — never expose via public API in production). */
  devResetUrl?: string;
};

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}


function logEmail(email: string): string {
  const [local, domain] = email.split("@");
  if (!domain) return "[invalid-email]";
  const maskedLocal = local.length <= 2 ? "**" : `${local.slice(0, 2)}***`;
  return `${maskedLocal}@${domain}`;
}

/**
 * Request a password reset email. Always resolves without revealing whether the email exists.
 * Supports credentials and OAuth-only accounts (sets password on reset).
 */
export async function requestPasswordReset(email: string): Promise<PasswordResetOutcome> {
  const normalized = normalizeEmail(email);
  let user;
  try {
    user = await findUserByEmail(normalized);
  } catch (err) {
    console.error("[password-reset] User lookup failed", {
      email: logEmail(normalized),
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }

  if (!user) {
    console.info("[password-reset] No action — no account", { email: logEmail(normalized) });
    return { userFound: false, attempted: false };
  }

  const rawToken = randomBytes(TOKEN_BYTES).toString("base64url");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + PASSWORD_RESET_EXPIRY_MINUTES * 60 * 1000);
  const url = buildPasswordResetUrl(rawToken);

  try {
    await prisma.passwordResetToken.deleteMany({ where: { userId: user.id } });
    await prisma.passwordResetToken.create({
      data: { userId: user.id, email: normalized, tokenHash, expiresAt },
    });
  } catch (err) {
    console.error("[password-reset] Failed to persist reset token", {
      email: logEmail(normalized),
      userId: user.id,
      error: err instanceof Error ? err.message : String(err),
    });
    throw err;
  }

  const delivery = await sendPasswordResetEmail({ to: normalized, resetUrl: url });

  const outcome: PasswordResetOutcome = {
    userFound: true,
    attempted: true,
    emailDelivered: delivery.ok,
  };

  if (!delivery.ok) {
    console.error("[password-reset] Delivery failed", {
      email: logEmail(normalized),
      reason: delivery.reason,
      detail: "detail" in delivery ? delivery.detail : undefined,
      resetBaseUrl: url.split("?")[0],
      setupWarnings: getEmailSetupWarnings(),
      hasPassword: Boolean(user.passwordHash),
      oauthOnly: !user.passwordHash,
    });
    outcome.devResetUrl = url;
    if (process.env.NODE_ENV === "development") {
      console.info(`[password-reset] Dev fallback link for ${normalized}:\n${url}`);
    }
  } else {
    console.info("[password-reset] Delivery ok", {
      email: logEmail(normalized),
      messageId: delivery.messageId,
      hasPassword: Boolean(user.passwordHash),
    });
  }

  return outcome;
}

export async function resetPasswordWithToken(
  rawToken: string,
  newPassword: string
): Promise<void> {
  const tokenHash = hashToken(rawToken.trim());
  const record = await prisma.passwordResetToken.findUnique({
    where: { tokenHash },
  });

  if (!record || record.expiresAt < new Date()) {
    throw new Error("This reset link is invalid or has expired. Request a new one.");
  }

  const user = await prisma.user.findUnique({ where: { id: record.userId } });
  if (!user) {
    throw new Error("This reset link is invalid or has expired. Request a new one.");
  }

  await setUserPassword(user.id, newPassword);
  await prisma.passwordResetToken.delete({ where: { id: record.id } });
}
