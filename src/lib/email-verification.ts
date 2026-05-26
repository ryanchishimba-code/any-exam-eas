import { createHash, randomBytes } from "crypto";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validators/auth";
import { sendVerificationEmail } from "@/lib/email";

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 48;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function verifyUrl(rawToken: string): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/api/auth/verify-email?token=${encodeURIComponent(rawToken)}`;
}

export async function sendEmailVerification(userId: string, email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const rawToken = randomBytes(TOKEN_BYTES).toString("base64url");
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + EXPIRY_HOURS * 60 * 60 * 1000);

  await prisma.verificationToken.deleteMany({ where: { identifier: normalized } });
  await prisma.verificationToken.create({
    data: {
      identifier: normalized,
      token: tokenHash,
      expires,
    },
  });

  const url = verifyUrl(rawToken);
  await sendVerificationEmail({ to: normalized, verifyUrl: url });

  if (process.env.NODE_ENV === "development") {
    console.info(`[email-verify] Link for ${normalized}:\n${url}`);
  }
}

export async function verifyEmailWithToken(rawToken: string): Promise<boolean> {
  const tokenHash = hashToken(rawToken);
  const row = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });
  if (!row || row.expires < new Date()) return false;

  await prisma.user.updateMany({
    where: { email: row.identifier },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token: tokenHash } });
  return true;
}
