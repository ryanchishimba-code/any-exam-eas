#!/usr/bin/env node
/**
 * Test Neon/Postgres connectivity. Usage: node scripts/check-db-connection.mjs [url]
 */
import { ensureDatabaseUrlEnv, loadEnvFiles } from "./resolve-database-url.mjs";

const urlArg = process.argv[2];
loadEnvFiles();
const url = urlArg ?? ensureDatabaseUrlEnv();

if (!url) {
  console.error("No DATABASE_URL. Pass URL or set .env / .env.local (or POSTGRES_URL on Vercel).");
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

  const { neon } = await import("@neondatabase/serverless");
  const sql = neon(url);
  const rows = await sql`SELECT 1 AS ok`;
  console.log("OK — Neon HTTP driver connected", rows);

  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  try {
    await prisma.$queryRaw`SELECT 1 as ok`;
    const users = await prisma.user.count();
    console.log("OK — Prisma connected");
    console.log("Users in database:", users);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("FAILED —", e.message ?? e);
  process.exit(1);
});
