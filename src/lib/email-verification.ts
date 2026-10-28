import { createHash, randomBytes } from "crypto";
import { after } from "next/server";
import { emailVerificationPath, parseBoardSlug } from "@/lib/auth/board-intent";
import { appBaseUrl, type EmailDeliveryResult } from "@/lib/email/config";
import { isExamSlug } from "@/lib/edtech/exams";
import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validators/auth";
import { sendVerificationEmail } from "@/lib/email";
import type { ExamSlug } from "@/types/edtech";

const TOKEN_BYTES = 32;
const EXPIRY_HOURS = 48;
const SIGNUP_SEND_TIMEOUT_MS = 8_000;

function hashToken(raw: string): string {
  return createHash("sha256").update(raw).digest("hex");
}

/** Canonical verification link on app origin (www.anyexameasy.com in production). */
export function buildVerificationUrl(rawToken: string, board: ExamSlug | null): string {
  return `${appBaseUrl()}${emailVerificationPath(rawToken, board)}`;
}

async function savedBoard(userId: string): Promise<ExamSlug | null> {
  const row = await prisma.userExamPreference.findUnique({
    where: { userId },
    select: { examSlug: true },
  });
  return row && isExamSlug(row.examSlug) ? row.examSlug : null;
}

function withTimeout<T>(promise: Promise<T>, ms: number, label: string): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`${label} timed out after ${ms}ms`)), ms);
    promise
      .then((value) => {
        clearTimeout(timer);
        resolve(value);
      })
      .catch((err) => {
        clearTimeout(timer);
        reject(err);
      });
  });
}

/**
 * After signup response — keeps the function alive via `after()` with a bounded wait.
 * Signup already succeeded; failures are logged only.
 */
export function scheduleSignupEmailVerification(
  userId: string,
  email: string,
  board?: string | null
): void {
  const task = async () => {
    try {
      await withTimeout(
        sendEmailVerification(userId, email, board ?? null),
        SIGNUP_SEND_TIMEOUT_MS,
        "signup verification email"
      );
    } catch (err) {
      const detail = err instanceof Error ? err.message : String(err);
      console.error("[email-verify] signup send failed:", detail, {
        userId,
        toDomain: email.split("@")[1] ?? "unknown",
      });
    }
  };

  try {
    after(task);
  } catch {
    void task();
  }
}

export async function sendEmailVerification(
  userId: string,
  email: string,
  board?: string | null
): Promise<EmailDeliveryResult> {
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
  const url = buildVerificationUrl(rawToken, intent);
  const result = await sendVerificationEmail({ to: normalized, verifyUrl: url });

  if (!result.ok) {
    console.error("[email-verify] send failed", {
      reason: result.reason,
      detail: result.detail,
      toDomain: normalized.split("@")[1] ?? "unknown",
    });
  }

  if (process.env.NODE_ENV === "development") {
    console.info(`[email-verify] Link for ${normalized}:\n${url}`);
  }

  return result;
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
