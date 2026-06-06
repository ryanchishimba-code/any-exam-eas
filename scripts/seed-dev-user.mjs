#!/usr/bin/env node
/**
 * Creates or refreshes a dev account for testing login (idempotent).
 * Default: dev@anyexameasy.test / DevPassword1!
 *
 * Always resets password hash so "dev password not working" is fixed after re-run.
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const email = (process.env.DEV_USER_EMAIL ?? "dev@anyexameasy.test").trim().toLowerCase();
const password = process.env.DEV_USER_PASSWORD ?? "DevPassword1!";
const name = process.env.DEV_USER_NAME ?? "Dev User";
const role = (process.env.DEV_USER_ROLE ?? "user").trim();

const prisma = new PrismaClient();

try {
  const passwordHash = await bcrypt.hash(password, 12);
  const dob = new Date("1990-01-15");
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 14);

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

    if (!existing.subscription) {
      await prisma.subscription.create({
        data: {
          userId: existing.id,
          status: "trialing",
          trialEndsAt,
        },
      });
    } else if (existing.subscription.status === "inactive") {
      await prisma.subscription.update({
        where: { userId: existing.id },
        data: { status: "trialing", trialEndsAt },
      });
    }

    console.log("Refreshed dev user (password reset):");
    console.log(`  Email:    ${email}`);
    console.log(`  Password: ${password}`);
    console.log(`  Role:     ${role}`);
    console.log(`  Id:       ${existing.id}`);
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
        create: { status: "trialing", trialEndsAt },
      },
    },
  });

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
