#!/usr/bin/env node
/**
 * Set a new credentials password for an existing user.
 * Usage:
 *   RESET_USER_EMAIL=user@example.com RESET_USER_PASSWORD='NewPass1!' node scripts/reset-user-password.mjs
 * If RESET_USER_PASSWORD is omitted, a random password is generated and printed once.
 */
import { randomBytes } from "node:crypto";
import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const email = (process.env.RESET_USER_EMAIL ?? process.argv[2] ?? "").trim().toLowerCase();
let password = process.env.RESET_USER_PASSWORD ?? process.argv[3];

if (!email) {
  console.error("Usage: RESET_USER_EMAIL=user@example.com [RESET_USER_PASSWORD=...] node scripts/reset-user-password.mjs");
  process.exit(1);
}

if (!password) {
  password = randomBytes(12).toString("base64url").slice(0, 16);
}

if (password.length < 8) {
  console.error("Password must be at least 8 characters.");
  process.exit(1);
}

const prisma = new PrismaClient();

try {
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) {
    console.error(`No user found for ${email}`);
    process.exit(1);
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await prisma.user.update({
    where: { email },
    data: { passwordHash },
  });

  console.log("Password updated:");
  console.log(`  Email:    ${email}`);
  console.log(`  Password: ${password}`);
  console.log(`  User id:  ${user.id}`);
} catch (e) {
  console.error(e instanceof Error ? e.message : e);
  process.exit(1);
} finally {
  await prisma.$disconnect();
}
