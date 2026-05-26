import { PrismaClient } from "@prisma/client";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import { assertRuntimeDatabaseUrl } from "@/lib/database-url";

const isNextBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

if (process.env.VERCEL && !isNextBuild) {
  assertRuntimeDatabaseUrl();
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const dbUrl = process.env.DATABASE_URL ?? "";
// SQLite tuning is only useful in local development.
if (process.env.NODE_ENV === "development" && dbUrl.startsWith("file:")) {
  void Promise.all([
    prisma.$executeRawUnsafe("PRAGMA journal_mode=WAL"),
    prisma.$executeRawUnsafe("PRAGMA busy_timeout=10000"),
  ]).catch(() => {});
}

/**
 * Serverless / concurrent users: use a pooled Postgres URL (Neon pooler, Supabase pooler).
 * Append `?connection_limit=5` if your host supports it to avoid exhausting connections.
 */
