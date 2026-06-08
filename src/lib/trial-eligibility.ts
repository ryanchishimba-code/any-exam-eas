import { prisma } from "@/lib/prisma";
import { normalizeEmail } from "@/lib/validators/auth";

/** Returns true if this email has already consumed an intro trial. */
export async function hasConsumedTrial(email: string): Promise<boolean> {
  const row = await prisma.trialEligibility.findUnique({
    where: { email: normalizeEmail(email) },
  });
  return !!row;
}

export async function recordTrialUsed(email: string, userId: string): Promise<void> {
  await prisma.trialEligibility.upsert({
    where: { email: normalizeEmail(email) },
    create: { email: normalizeEmail(email), userId },
    update: { userId, usedAt: new Date() },
  });
}
