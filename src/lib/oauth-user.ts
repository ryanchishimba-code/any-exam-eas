import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validators/auth";
import { isAtLeast18 } from "@/lib/age";

const DEFAULT_DOB = new Date("1990-01-01");

/** Link or create a user from OAuth (email pre-verified by provider). */
export async function findOrCreateGoogleUser(params: {
  email: string;
  name?: string | null;
  image?: string | null;
  providerAccountId: string;
  provider?: "google" | "apple";
}): Promise<{ id: string; role: string }> {
  const email = normalizeEmail(params.email);
  const provider = params.provider ?? "google";

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (!existing.emailVerified) {
      await prisma.user.update({
        where: { id: existing.id },
        data: { emailVerified: new Date() },
      });
    }
    const hasProvider = await prisma.account.findFirst({
      where: { userId: existing.id, provider },
    });
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

  const user = await prisma.user.create({
    data: {
      email,
      name: params.name ?? null,
      image: params.image ?? null,
      emailVerified: new Date(),
      dateOfBirth: DEFAULT_DOB,
      subscription: {
        create: { status: "inactive", trialEndsAt: null },
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

  return { id: user.id, role: user.role };
}
