import { createHash, randomBytes } from "node:crypto";
import { prisma } from "@/lib/prisma";
import { findUserByEmail } from "@/lib/user-auth";
import { normalizeEmail } from "@/lib/validators/auth";
import { sendMagicLinkEmail } from "@/lib/email";

const TOKEN_BYTES = 32;
const EXPIRY_MINUTES = 15;
const MAGIC_PREFIX = "magic:";

function hashToken(rawToken: string): string {
  return createHash("sha256").update(rawToken).digest("hex");
}

function magicLinkUrl(rawToken: string): string {
  const base = process.env.NEXTAUTH_URL ?? "http://localhost:3000";
  return `${base.replace(/\/$/, "")}/login?magicToken=${encodeURIComponent(rawToken)}`;
}

/** Send a one-time sign-in link. Never reveals whether the email exists. */
export async function requestMagicLink(email: string): Promise<void> {
  const normalized = normalizeEmail(email);
  const user = await findUserByEmail(normalized);
  if (!user || user.accountStatus === "suspended") return;

  const rawToken = randomBytes(TOKEN_BYTES).toString("base64url");
  const tokenHash = hashToken(rawToken);
  const expires = new Date(Date.now() + EXPIRY_MINUTES * 60 * 1000);

  await prisma.verificationToken.deleteMany({
    where: { identifier: `${MAGIC_PREFIX}${normalized}` },
  });

  await prisma.verificationToken.create({
    data: {
      identifier: `${MAGIC_PREFIX}${normalized}`,
      token: tokenHash,
      expires,
    },
  });

  const url = magicLinkUrl(rawToken);
  await sendMagicLinkEmail({ to: normalized, signInUrl: url, name: user.name });

  if (process.env.NODE_ENV === "development") {
    console.info(`[magic-link] Sign-in link for ${normalized}:\n${url}`);
  }
}

/** Validate magic token and return user id, or null if invalid. */
export async function consumeMagicLinkToken(rawToken: string): Promise<{
  id: string;
  email: string;
  name: string | null;
  role: string;
} | null> {
  const tokenHash = hashToken(rawToken.trim());
  const record = await prisma.verificationToken.findUnique({
    where: { token: tokenHash },
  });

  if (!record?.identifier.startsWith(MAGIC_PREFIX) || record.expires < new Date()) {
    return null;
  }

  const email = record.identifier.slice(MAGIC_PREFIX.length);
  const user = await findUserByEmail(email);
  if (!user || user.accountStatus === "suspended") {
    await prisma.verificationToken.deleteMany({ where: { token: tokenHash } });
    return null;
  }

  await prisma.verificationToken.deleteMany({ where: { token: tokenHash } });

  const dbUser = await prisma.user.findUnique({
    where: { id: user.id },
    select: { id: true, email: true, name: true, role: true },
  });

  return dbUser;
}
