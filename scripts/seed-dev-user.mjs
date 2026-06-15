#!/usr/bin/env node
/**
 * Creates or refreshes a dev account for testing login (idempotent).
 * Default: dev@anyexameasy.test / DevPassword1! / role=admin (full site + /internal)
 *
 * Always resets password hash so "dev password not working" is fixed after re-run.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const email = (process.env.DEV_USER_EMAIL ?? "dev@anyexameasy.test").trim().toLowerCase();
const password = process.env.DEV_USER_PASSWORD ?? "DevPassword1!";
const name = process.env.DEV_USER_NAME ?? "Dev User";
const role = (process.env.DEV_USER_ROLE ?? "admin").trim();

/** Full premium access for local/dev login (status=active, not checkout-gated trialing). */
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
  const passwordHash = await bcrypt.hash(password, 12);
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
        passwordHash,
        role,
        accountStatus: "active",
        emailVerified: existing.emailVerified ?? new Date(),
      },
    });

    await upsertPremiumSubscription(existing.id);

    console.log("Refreshed dev user (password reset, premium + staff access):");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role:     ${role}`);
    console.log(`  Id:       ${existing.id}`);
    console.log(`  Login:    /login or /employee/login → /internal`);
    process.exit(0);
  }

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      dateOfBirth: dob,
      role,
      accountStatus: "active",
      emailVerified: new Date(),
      subscription: {
        create: premiumSubscription,
      },
    },
  });

  console.log("Created dev user:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Role:     ${role}`);
  console.log(`  Id:       ${user.id}`);
  console.log(`  Login:    /login or /employee/login → /internal`);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
