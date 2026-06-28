import { Prisma } from "@prisma/client";
import type { User } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { isAtLeast18 } from "@/lib/age";
import {
  assertPublicSignupEmailAllowed,
  clearAccountDeviceSessions,
  credentialsLoginBlocked,
} from "@/lib/account-security";
import {
  hashPassword,
  passwordCredentialFields,
  verifyPassword,
} from "@/lib/password-hash";
import { signUpSchema, normalizeEmail, type SignUpInput } from "@/lib/validators/auth";
import { normalizeStoredName } from "@/lib/display-name";
import { parseBillingInterval } from "@/lib/billing-plans";
import { parseSubscriptionTier } from "@/lib/subscription-tiers";
import { hasConsumedTrial, recordTrialUsed } from "@/lib/trial-eligibility";
import { trialEndsAtFromNow } from "@/lib/billing-config";

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
    name: normalizeStoredName(user.name) ?? user.name,
    createdAt: user.createdAt,
    lastLoginAt: user.lastLoginAt,
  };
}

export async function findUserByEmail(email: string): Promise<User | null> {
  const normalized = normalizeEmail(email);
  const exact = await prisma.user.findUnique({
    where: { email: normalized },
  });
  if (exact) return exact;

  return prisma.user.findFirst({
    where: { email: { equals: normalized, mode: "insensitive" } },
  });
}

export async function verifyUserPassword(
  email: string,
  password: string
): Promise<User | null> {
  const result = await authenticateCredentials(email, password);
  return result.ok ? result.user : null;
}

export type CredentialAuthFailure = "invalid" | "no_password" | "invalid_hash" | "blocked";

export type CredentialAuthResult =
  | { ok: true; user: User }
  | { ok: false; reason: CredentialAuthFailure };

export async function authenticateCredentials(
  email: string,
  password: string
): Promise<CredentialAuthResult> {
  const user = await findUserByEmail(email);
  if (!user) return { ok: false, reason: "invalid" };

  const blocked = credentialsLoginBlocked(user);
  if (blocked === "no_password") return { ok: false, reason: "no_password" };
  if (blocked === "invalid_hash") return { ok: false, reason: "invalid_hash" };
  if (blocked) return { ok: false, reason: "blocked" };

  if (!(await verifyPassword(password, user.passwordHash))) {
    return { ok: false, reason: "invalid" };
  }

  return { ok: true, user };
}

/** Set or rotate credentials password; clears device session history. */
export async function setUserPassword(
  userId: string,
  plainPassword: string
): Promise<void> {
  const passwordHash = await hashPassword(plainPassword);
  await prisma.user.update({
    where: { id: userId },
    data: passwordCredentialFields(passwordHash),
  });
  await clearAccountDeviceSessions(userId);
}

export async function recordUserLogin(userId: string): Promise<void> {
  await prisma.user.update({
    where: { id: userId },
    data: { lastLoginAt: new Date() },
  });
}

export async function registerUser(
  input: SignUpInput
): Promise<SafeUser & { plan: "trial" | "subscribe"; promoCode?: string }> {
  const parsed = signUpSchema.parse(input);
  assertPublicSignupEmailAllowed(parsed.email);

  const dob = new Date(parsed.dateOfBirth);
  if (!isAtLeast18(dob)) {
    throw new Error("You must be at least 18 years old to create an account.");
  }

  const passwordHash = await hashPassword(parsed.password);
  const planTier = parseSubscriptionTier(parsed.tier);
  const planInterval = parseBillingInterval(parsed.interval);

  if (parsed.plan === "trial" && (await hasConsumedTrial(parsed.email))) {
    throw new Error(
      "This email has already used a free trial. Subscribe at the monthly rate instead."
    );
  }

  const startsAppTrial = parsed.plan === "trial";

  const subscriptionData = startsAppTrial
    ? {
        status: "trialing" as const,
        trialEndsAt: trialEndsAtFromNow(),
        plan: "trial" as const,
        planTier,
        planInterval,
      }
    : {
        status: "inactive" as const,
        trialEndsAt: null,
        plan: parsed.plan,
        planTier,
        planInterval,
      };

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
              name: normalizeStoredName(parsed.name) ?? parsed.name,
              ...passwordCredentialFields(passwordHash),
              dateOfBirth: dob,
              subscription: { create: subscriptionData },
            },
          });
        },
        { maxWait: 15_000, timeout: 45_000 }
      )
    );

    if (startsAppTrial) {
      void recordTrialUsed(parsed.email, user.id);
      void import("@/lib/trial-email-triggers").then((m) =>
        m.triggerWelcomeTrialEmail(user.id)
      );
    }

    if (parsed.examSlug) {
      try {
        const { setUserExamPreference } = await import("@/lib/edtech/exam-preference");
        await setUserExamPreference(user.id, parsed.examSlug);
        if (parsed.testDate) {
          const { setUserExamTestDate } = await import("@/lib/edtech/user-metadata");
          await setUserExamTestDate(user.id, parsed.examSlug, parsed.testDate);
        }
      } catch (err) {
        console.error("[registerUser] failed to set exam preference:", err);
      }
    }

    void import("@/lib/email-verification").then((m) =>
      m.sendEmailVerification(user.id, user.email)
    );

    if (parsed.promoCode?.trim()) {
      void import("@/lib/promo").then((m) =>
        m.redeemPromoCode(user.id, parsed.promoCode!.trim())
      );
    }

    return {
      ...toSafeUser(user),
      plan: parsed.plan,
      promoCode: parsed.promoCode?.trim() || undefined,
    };
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
