import bcrypt from "bcryptjs";
import { Prisma } from "@prisma/client";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAtLeast18 } from "@/lib/age";
import { TRIAL_DAYS } from "@/lib/billing-config";
import { signUpSchema, normalizeEmail, type SignUpInput } from "@/lib/validators/auth";
import { recordTrialUsed } from "@/lib/trial-eligibility";

const BCRYPT_ROUNDS = 12;
const REGISTER_RETRIES = 6;

function isTransientDbError(e: unknown): boolean {
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    if (e.code === "P2034") return true;
    const msg = e.message.toLowerCase();
    if (msg.includes("database is locked") || msg.includes("sqlite_busy")) return true;
    if (msg.includes("socket timeout") || msg.includes("timed out")) return true;
  }
  if (e instanceof Error) {
    const msg = e.message.toLowerCase();
    return (
      msg.includes("database is locked") ||
      msg.includes("sqlite_busy") ||
      msg.includes("socket timeout")
    );
  }
  return false;
}

async function withRegisterRetry<T>(fn: () => Promise<T>): Promise<T> {
  let lastError: unknown;
  for (let attempt = 0; attempt < REGISTER_RETRIES; attempt++) {
    try {
      return await fn();
    } catch (e) {
      lastError = e;
      if (!isTransientDbError(e) || attempt === REGISTER_RETRIES - 1) throw e;
      await new Promise((r) => setTimeout(r, 80 * (attempt + 1) ** 2));
    }
  }
  throw lastError;
}

/** Public user fields — never expose passwordHash to clients. */
export type SafeUser = Pick<User, "id" | "email" | "name" | "createdAt" | "lastLoginAt">;

export function toSafeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  return prisma.user.findUnique({
    where: { email: normalizeEmail(email) },
  });
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<User | null> {
  const user = await findUserByEmail(email);
  if (!user?.passwordHash) return null;

  const valid = await bcrypt.compare(password, user.passwordHash);
  return valid ? user : null;
}

export async function recordUserLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

/**
 * Create a new account with hashed password and chosen plan.
 * `trial` — in-app free trial; `subscribe` — pay via Stripe checkout (no access until paid).
 */
export async function registerUser(
  input: SignUpInput
): Promise<SafeUser & { plan: "trial" | "subscribe" }> {
  const parsed = signUpSchema.parse(input);
  const dob = new Date(parsed.dateOfBirth);

  if (!isAtLeast18(dob)) {
    throw new Error("You must be at least 18 years old to create an account.");
  }

  const passwordHash = await bcrypt.hash(parsed.password, BCRYPT_ROUNDS);

  const subscriptionData =
    parsed.plan === "trial"
      ? (() => {
          const trialEndsAt = new Date();
          trialEndsAt.setDate(trialEndsAt.getDate() + TRIAL_DAYS);
          return { status: "trialing" as const, trialEndsAt };
        })()
      : { status: "inactive" as const, trialEndsAt: null };

  try {
    const user = await withRegisterRetry(() =>
      prisma.$transaction(
        async (tx) => {
          const existing = await tx.user.findUnique({
            where: { email: parsed.email },
          });
          if (existing) {
            throw new Error("An account with this email already exists.");
          }

          return tx.user.create({
            data: {
              email: parsed.email,
              name: parsed.name,
              passwordHash,
              dateOfBirth: dob,
              subscription: { create: subscriptionData },
            },
          });
        },
        { maxWait: 15_000, timeout: 45_000 }
      )
    );

    if (parsed.plan === "trial") {
      await recordTrialUsed(parsed.email, user.id);
    }

    void import("@/lib/email-verification").then((m) =>
      m.sendEmailVerification(user.id, user.email)
    );

    return { ...toSafeUser(user), plan: parsed.plan };
  } catch (e) {
    if (
      e instanceof Prisma.PrismaClientKnownRequestError &&
      e.code === "P2002"
    ) {
      throw new Error("An account with this email already exists.");
    }
    throw e;
  }
}
