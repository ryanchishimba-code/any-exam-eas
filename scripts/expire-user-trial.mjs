#!/usr/bin/env node
/**
 * Dev helper: expire a user's trial immediately.
 * Usage: DATABASE_URL=... node scripts/expire-user-trial.mjs user@email.com
 */
import { PrismaClient } from "@prisma/client";

const email = process.argv[2]?.trim().toLowerCase();
if (!email) {
  console.error("Usage: node scripts/expire-user-trial.mjs <email>");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error("User not found:", email);
    process.exit(1);
  }

  const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000);
  await prisma.subscription.update({
    where: { userId: user.id },
    data: { status: "trialing", trialEndsAt: yesterday },
  });

  console.log(`Trial set to expire for ${email}. Visit /study to see paywall.`);
} finally {
  await prisma.$disconnect();
}
