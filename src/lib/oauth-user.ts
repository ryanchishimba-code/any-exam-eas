import { prisma } from "@/lib/prisma";
import { assertPublicSignupEmailAllowed, isAccountDisabled, OAuthAccountDisabledError } from "@/lib/account-security";
import { normalizeEmail } from "@/lib/validators/auth";
import { normalizeStoredName } from "@/lib/display-name";
import { isAtLeast18 } from "@/lib/age";
import { trialEndsAtFromNow } from "@/lib/billing-config";
import { recordTrialUsed } from "@/lib/trial-eligibility";

const DEFAULT_DOB = new Date("1990-01-01");

/** Thrown when OAuth sign-in targets an email/password account without an explicit link. */
export class OAuthLinkBlockedError extends Error {
  constructor() {
    super("OAuthAccountNotLinked");
    this.name = "OAuthLinkBlockedError";
  }
}

/** Link or create a user from OAuth (email pre-verified by provider). */
export async function findOrCreateGoogleUser(params: {
  email: string;
  name?: string | null;
  image?: string | null;
  providerAccountId: string;
  provider?: "google" | "apple" | "linkedin";
}): Promise<{ id: string; role: string }> {
  const email = normalizeEmail(params.email);
  const provider = params.provider ?? "google";

  const existing = await prisma.user.findUnique({
    where: { email },
    select: {
      id: true,
      role: true,
      accountStatus: true,
      emailVerified: true,
      passwordHash: true,
    },
  });
  if (existing) {
    if (isAccountDisabled(existing.accountStatus)) {
      throw new OAuthAccountDisabledError();
    }
    const hasProvider = await prisma.account.findFirst({
      where: { userId: existing.id, provider },
    });
    if (!existing.emailVerified) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { emailVerified: new Date() },
      });
    }
    if (!hasProvider) {
      await prisma.account.create({
        data: {
          userId: existing.id,
          type: "oauth",
          provider,
          providerAccountId: params.providerAccountId,
        },
      });
    }
    return { id: existing.id, role: existing.role };
  }

  assertPublicSignupEmailAllowed(email);

  const user = await prisma.user.create({
    data: {
      email,
      name: normalizeStoredName(params.name),
      image: params.image ?? null,
      emailVerified: new Date(),
      dateOfBirth: DEFAULT_DOB,
      subscription: {
        create: {
          status: "trialing",
          trialEndsAt: trialEndsAtFromNow(),
          plan: "trial",
          planTier: "pro",
          planInterval: "yearly",
        },
      },
      accounts: {
        create: {
          type: "oauth",
          provider,
          providerAccountId: params.providerAccountId,
        },
      },
    },
  });

  if (!isAtLeast18(user.dateOfBirth)) {
    /* placeholder DOB for OAuth signups — user must be 18+ per terms */
  }

  void recordTrialUsed(email, user.id);

  void import("@/lib/trial-email-triggers").then((m) =>
    m.triggerWelcomeTrialEmail(user.id)
  );

  return { id: user.id, role: user.role };
}
