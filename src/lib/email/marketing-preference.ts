import { createHmac, timingSafeEqual } from "crypto";
import { appBaseUrl } from "@/lib/email/config";
import { prisma } from "@/lib/prisma";

function unsubscribeSecret(): string {
  const value = process.env.AUTH_SECRET?.trim() || process.env.NEXTAUTH_SECRET?.trim();
  if (!value) {
    throw new Error("AUTH_SECRET is required to sign unsubscribe links");
  }
  return value;
}

function signUserId(userId: string): string {
  return createHmac("sha256", unsubscribeSecret()).update(userId).digest("base64url");
}

/** Signed token for the one-click unsubscribe page. The user id is the payload. */
export function signMarketingUnsubscribeToken(userId: string): string {
  return `${userId}.${signUserId(userId)}`;
}

export function readMarketingUnsubscribeToken(token: string): string | null {
  const dot = token.lastIndexOf(".");
  if (dot <= 0) return null;
  const userId = token.slice(0, dot);
  const sig = token.slice(dot + 1);
  if (!userId || !sig) return null;
  const expected = signUserId(userId);
  const left = Buffer.from(sig);
  const right = Buffer.from(expected);
  if (left.length !== right.length) return null;
  if (!timingSafeEqual(left, right)) return null;
  return userId;
}

export function marketingUnsubscribePageUrl(userId: string): string {
  const token = signMarketingUnsubscribeToken(userId);
  return `${appBaseUrl()}/email/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function marketingUnsubscribeOneClickUrl(userId: string): string {
  const token = signMarketingUnsubscribeToken(userId);
  return `${appBaseUrl()}/api/email/unsubscribe?token=${encodeURIComponent(token)}`;
}

export function marketingUnsubscribeHeaders(userId: string): Record<string, string> {
  return {
    "List-Unsubscribe": `<${marketingUnsubscribeOneClickUrl(userId)}>`,
    "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
  };
}

export async function isMarketingEmailSuppressed(userId: string): Promise<boolean> {
  const row = await prisma.userPreference.findUnique({
    where: { userId },
    select: { marketingOptOutAt: true },
  });
  return row?.marketingOptOutAt != null;
}

export async function optOutOfMarketingEmail(userId: string): Promise<void> {
  const now = new Date();
  await prisma.userPreference.upsert({
    where: { userId },
    create: { userId, marketingOptOutAt: now },
    update: { marketingOptOutAt: now },
  });
}
