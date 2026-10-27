import { createHash, randomBytes } from "crypto";
import { emailVerificationPath, parseBoardSlug } from "@/lib/auth/board-intent";
import { isExamSlug } from "@/lib/edtech/exams";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validators/auth";
import { sendVerificationEmail } from "@/lib/email";
import type { ExamSlug } from "@/types/edtech";

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 48;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

function verifyUrl(rawToken: string, board: ExamSlug | null): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}${emailVerificationPath(rawToken, board)}`;
}

async function savedBoard(userId: string): Promise<ExamSlug | null> {
  const row = await prisma.userExamPreference.findUnique({
    where: { userId },
    select: { examSlug: true },
  });
  return row && isExamSlug(row.examSlug) ? row.examSlug : null;
}

export async function sendEmailVerification(
  userId: string,
  email: string,
  board?: string | null
): Promise<void> {
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

  const intent = parseBoardSlug(board) ?? (await savedBoard(userId));
  const url = verifyUrl(rawToken, intent);
  await sendVerificationEmail({ to: normalized, verifyUrl: url });

  if (process.env.NODE_ENV === "development") {
    console.info(`[email-verify] Link for ${normalized}:\n${url}`);
  }
}

export async function verifyEmailWithToken(
  rawToken: string
): Promise<{ ok: true; userId: string } | { ok: false }> {
  const tokenHash = hashToken(rawToken);
  const row = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });
  if (!row || row.expires < new Date()) return { ok: false };

  const user = await prisma.user.findFirst({
    where: { email: row.identifier },
    select: { id: true },
  });
  if (!user) return { ok: false };

  await prisma.user.update({
    where: { id: user.id },
    data: { emailVerified: new Date() },
  });
  await prisma.verificationToken.delete({ where: { token: tokenHash } });
  return { ok: true, userId: user.id };
}
