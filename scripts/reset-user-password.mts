#!/usr/bin/env npx tsx
import { PrismaClient } from "@prisma/client";
import { randomBytes } from "node:crypto";
import { setUserPassword } from "../src/lib/user-auth";
import { normalizeEmail } from "../src/lib/validators/auth";

const email = normalizeEmail(process.env.RESET_USER_EMAIL ?? process.argv[2] ?? "");
let password = process.env.RESET_USER_PASSWORD ?? process.argv[3];

if (!email) {
  console.error(
    "Usage: RESET_USER_EMAIL=user@example.com [RESET_USER_PASSWORD=...] npm run db:reset-user-password"
  );
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

  await setUserPassword(user.id, password);

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
