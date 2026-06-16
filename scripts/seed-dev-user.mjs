#!/usr/bin/env node
/**
 * Creates or refreshes a dev account for testing login (idempotent).
 */
import { PrismaClient } from "@prisma/client";
import { hashPassword, passwordCredentialFields } from "../src/lib/password-hash.ts";

const email = (process.env.DEV_USER_EMAIL ?? "dev@anyexameasy.test").trim().toLowerCase();
const password = process.env.DEV_USER_PASSWORD ?? "DevPassword1!";
const name = process.env.DEV_USER_NAME ?? "Dev User";
const role = (process.env.DEV_USER_ROLE ?? "admin").trim();

const premiumSubscription = {
  status: "active",
  trialEndsAt: null,
  currentPeriodEnd: daysFromNow(365),
};

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const prisma = new PrismaClient();

async function upsertPremiumSubscription(userId) {
  await prisma.subscription.upsert({
    where: { userId },
    create: { userId, ...premiumSubscription },
    update: premiumSubscription,
  });
}

try {
  const credentialFields = passwordCredentialFields(await hashPassword(password));
  const dob = new Date("1990-01-15");

  const existing = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true },
  });

  if (existing) {
    await prisma.user.update({
      where: { email },
      data: {
        name,
        ...credentialFields,
        role,
        accountStatus: "active",
        emailVerified: existing.emailVerified ?? new Date(),
      },
    });
    await upsertPremiumSubscription(existing.id);
    await prisma.userSession.deleteMany({ where: { userId: existing.id } });

    console.log("Refreshed dev user:");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role:     ${role}`);
    process.exit(0);
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      ...credentialFields,
      dateOfBirth: dob,
      role,
      accountStatus: "active",
      emailVerified: new Date(),
      subscription: { create: premiumSubscription },
    },
  });
  await prisma.userSession.deleteMany({ where: { userId: user.id } });

  console.log("Created dev user:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     ${role}`);
  console.log(`  Id:       ${user.id}`);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
