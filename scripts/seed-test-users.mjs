#!/usr/bin/env node
/**
 * Create or refresh 3 test login accounts (idempotent).
 * Usage: node scripts/seed-test-users.mjs
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const PASSWORD = process.env.TEST_USER_PASSWORD ?? "TestLogin1!";
const dob = new Date("1990-06-15");

const testUsers = [
  {
    email: "test-unpaid@anyexameasy.test",
    name: "Test Unpaid",
    subscription: { status: "inactive", trialEndsAt: null, currentPeriodEnd: null },
  },
  {
    email: "test-trial@anyexameasy.test",
    name: "Test Trial",
    subscription: {
      status: "trialing",
      trialEndsAt: daysFromNow(14),
      currentPeriodEnd: daysFromNow(14),
    },
  },
  {
    email: "test-premium@anyexameasy.test",
    name: "Test Premium",
    subscription: {
      status: "active",
      trialEndsAt: null,
      currentPeriodEnd: daysFromNow(30),
    },
  },
];

function daysFromNow(days) {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(PASSWORD, 12);
  console.log("Test accounts (password for all):\n");

  for (const spec of testUsers) {
    const email = spec.email.toLowerCase();
    const existing = await prisma.user.findUnique({
      where: { email },
      include: { subscription: true },
    });

    if (existing) {
      await prisma.user.update({
        where: { email },
        data: { name: spec.name, passwordHash, emailVerified: new Date() },
      });
      await prisma.subscription.upsert({
        where: { userId: existing.id },
        create: { userId: existing.id, ...spec.subscription },
        update: spec.subscription,
      });
      console.log(`  Updated  ${email} (${spec.subscription.status})`);
    } else {
      await prisma.user.create({
        data: {
          email,
          name: spec.name,
          passwordHash,
          dateOfBirth: dob,
          emailVerified: new Date(),
          subscription: { create: spec.subscription },
        },
      });
      console.log(`  Created  ${email} (${spec.subscription.status})`);
    }
  }

  console.log(`\n  Password: ${PASSWORD}\n`);
  console.log("Log in at /login");
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
