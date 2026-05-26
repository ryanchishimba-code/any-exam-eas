import { createHash, randomBytes } from "node:crypto";
import bcrypt from "bcryptjs";
import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "@/lib/user-auth";
import { normalizeEmail } from "@/lib/validators/auth";
import { sendPasswordResetEmail } from "@/lib/email";

const BCRYPT_ROUNDS = 12;
const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 1;

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

function resetUrl(rawToken: string): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/reset-password?token=${encodeURIComponent(rawToken)}`;
}

/**
 * Request a password reset email. Always resolves without revealing whether the email exists.
 */
export async function requestPasswordReset(email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const user = await findUserByEmail(normalized);

  if (!user?.passwordHash) {
    return;
  }

  const rawToken = randomBytes(TOKEN_BYTES).toString("base64url");
  const tokenHash = hashToken(rawToken);
  const expiresAt = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.passwordResetToken.deleteMany({ where: { email: normalized } });
  await prisma.passwordResetToken.create({
    data: { email: normalized, tokenHash, expiresAt },
  });

  const url = resetUrl(rawToken);
  await sendPasswordResetEmail({ to: normalized, resetUrl: url });

  if (process.env.NODE_ENV === "development") {
    console.info(`[password-reset] Reset link for ${normalized}:\n${url}`);
  }
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

  const user = await findUserByEmail(record.email);
  if (!user) {
    throw new Error("This reset link is invalid or has expired. Request a new one.");
  }

  const passwordHash = await bcrypt.hash(newPassword, BCRYPT_ROUNDS);

  await prisma.$transaction([
    prisma.user.update({
      where: { id: user.id },
      data: { passwordHash },
    }),
    prisma.passwordResetToken.deleteMany({ where: { email: record.email } }),
  ]);
}
