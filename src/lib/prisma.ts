import { PrismaClient } from "@prisma/client";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import {
  assertRuntimeDatabaseUrl,
  ensureDatabaseUrlEnv,
  getRuntimeDatabaseUrl,
  isPostgresDatabaseUrl,
} from "@/lib/database-url";

const isNextBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

if (process.env.VERCEL && !isNextBuild) {
  ensureDatabaseUrlEnv();
  assertRuntimeDatabaseUrl();
}

/** Bump when Prisma schema adds/changes models so dev HMR replaces stale clients. */
const PRISMA_SCHEMA_VERSION = 2;

type GlobalPrisma = typeof globalThis & {
  prisma?: PrismaClient;
  prismaSchemaVersion?: number;
};

const globalForPrisma = globalThis as GlobalPrisma;

function createPrismaClient(): PrismaClient {
  ensureDatabaseUrlEnv();
  const url = getRuntimeDatabaseUrl();
  return new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(url && isPostgresDatabaseUrl(url)
      ? { datasources: { db: { url } } }
      : {}),
  });
}

function isPrismaClientCurrent(client: PrismaClient | undefined): client is PrismaClient {
  return Boolean(
    client &&
      typeof client.drugReviewCycle?.findUnique === "function" &&
      typeof client.drugCardProgress?.findUnique === "function"
  );
}

export function getPrisma(): PrismaClient {
  ensureDatabaseUrlEnv();
  const cached = globalForPrisma.prisma;
  const versionMatch = globalForPrisma.prismaSchemaVersion === PRISMA_SCHEMA_VERSION;

  if (cached && versionMatch && isPrismaClientCurrent(cached)) {
    return cached;
  }

  const previous = globalForPrisma.prisma;
  const client = createPrismaClient();
  globalForPrisma.prisma = client;
  globalForPrisma.prismaSchemaVersion = PRISMA_SCHEMA_VERSION;

  if (previous && previous !== client) {
    void previous.$disconnect().catch(() => undefined);
  }

  return client;
}

/** @deprecated Prefer `getPrisma()` in new code — kept for existing imports. */
export const prisma = getPrisma();

const dbUrl = ensureDatabaseUrlEnv();
if (process.env.NODE_ENV === "development" && dbUrl.startsWith("file:")) {
  void (async () => {
    try {
      const client = getPrisma();
      await client.$queryRawUnsafe("PRAGMA journal_mode=WAL");
      await client.$queryRawUnsafe("PRAGMA busy_timeout=30000");
      await client.$queryRawUnsafe("PRAGMA synchronous=NORMAL");
    } catch {
      /* ignore */
    }
  })();
}
