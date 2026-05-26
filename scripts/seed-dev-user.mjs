#!/usr/bin/env node
/**
 * Creates a local dev account for testing login (idempotent).
 * Default: dev@anyexameasy.test / DevPassword1!
 */
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const email = (process.env.DEV_USER_EMAIL ?? "dev@anyexameasy.test").trim().toLowerCase();
const password = process.env.DEV_USER_PASSWORD ?? "DevPassword1!";
const name = process.env.DEV_USER_NAME ?? "Dev User";
const role = (process.env.DEV_USER_ROLE ?? "user").trim();

const prisma = new PrismaClient();

try {
  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    if (role && existing.role !== role) {
      await prisma.user.update({
        where: { email },
        data: { role },
      });
      console.log(
        `Updated dev user role: ${email} → ${role} (id ${existing.id})`
      );
    } else {
      console.log(`Dev user already exists: ${email} (id ${existing.id})`);
    }
    process.exit(0);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  const dob = new Date("1990-01-15");
  const trialEndsAt = new Date();
  trialEndsAt.setDate(trialEndsAt.getDate() + 2);

  const user = await prisma.user.create({
    data: {
      email,
      name,
      passwordHash,
      dateOfBirth: dob,
      role,
      subscription: {
        create: { status: "trialing", trialEndsAt },
      },
    },
  });

  console.log("Created dev user:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  Id:       ${user.id}`);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
