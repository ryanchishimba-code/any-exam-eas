import { PrismaClient } from "@prisma/client";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import {
  assertRuntimeDatabaseUrl,
  getRuntimeDatabaseUrl,
  isPostgresDatabaseUrl,
} from "@/lib/database-url";

const isNextBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

if (process.env.VERCEL && !isNextBuild) {
  assertRuntimeDatabaseUrl();
}

const globalForPrisma = globalThis as unknown as { prisma: PrismaClient };

function createPrismaClient(): PrismaClient {
  const url = getRuntimeDatabaseUrl();
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(url && isPostgresDatabaseUrl(url)
      ? { datasources: { db: { url } } }
      : {}),
  });
}

export const prisma = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

const dbUrl = process.env.DATABASE_URL ?? "";
if (process.env.NODE_ENV === "development" && dbUrl.startsWith("file:")) {
  void (async () => {
    try {
      await prisma.$queryRawUnsafe("PRAGMA journal_mode=WAL");
      await prisma.$queryRawUnsafe("PRAGMA busy_timeout=30000");
      await prisma.$queryRawUnsafe("PRAGMA synchronous=NORMAL");
    } catch {
      /* ignore */
    }
  })();
}
