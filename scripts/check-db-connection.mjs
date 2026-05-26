#!/usr/bin/env node
/**
 * Test DATABASE_URL connectivity. Usage: node scripts/check-db-connection.mjs [url]
 */
import { readFileSync, existsSync } from "node:fs";

function loadEnv() {
  if (!existsSync(".env")) return;
  for (const line of readFileSync(".env", "utf8").split("\n")) {
    const t = line.trim();
    if (!t || t.startsWith("#")) continue;
    const i = t.indexOf("=");
    if (i < 0) continue;
    const k = t.slice(0, i).trim();
    let v = t.slice(i + 1).trim();
    if ((v.startsWith('"') && v.endsWith('"')) || (v.startsWith("'") && v.endsWith("'"))) {
      v = v.slice(1, -1);
    }
    if (!process.env[k]) process.env[k] = v;
  }
}

const urlArg = process.argv[2];
loadEnv();
const url = urlArg ?? process.env.DATABASE_URL ?? "";

if (!url) {
  console.error("No DATABASE_URL. Pass URL or set .env");
  process.exit(1);
}

const masked = url.replace(/:([^:@]+)@/, ":****@");
console.log("Testing:", masked);

async function main() {
  if (url.startsWith("file:")) {
    process.env.DATABASE_URL = url;
    const { PrismaClient } = await import("@prisma/client");
    const prisma = new PrismaClient();
    try {
      await prisma.$queryRaw`SELECT 1 as ok`;
      const users = await prisma.user.count();
      console.log("OK — SQLite connected");
      console.log("Users in database:", users);
    } finally {
      await prisma.$disconnect();
    }
    return;
  }

  if (!url.startsWith("postgres")) {
    console.error("Unsupported URL scheme");
    process.exit(1);
  }

  process.env.DATABASE_URL = url;
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1 as ok`;
    const users = await prisma.user.count();
    console.log("OK — PostgreSQL connected");
    console.log("Users in database:", users);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("FAILED —", e.message ?? e);
  process.exit(1);
});
