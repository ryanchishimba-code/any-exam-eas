import type { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClientCtor } from "@prisma/client";
import { PHASE_PRODUCTION_BUILD } from "next/constants";
import {
  assertRuntimeDatabaseUrl,
  ensureDatabaseUrlEnv,
  getRuntimeDatabaseUrl,
  isPostgresDatabaseUrl,
} from "@/lib/database-url";
import { executeWithRetry } from "@/lib/db-resilience";

const isNextBuild = process.env.NEXT_PHASE === PHASE_PRODUCTION_BUILD;

if (!isNextBuild) {
  ensureDatabaseUrlEnv();
}

/** Bump when Prisma schema adds/changes models so dev HMR replaces stale clients. */
const PRISMA_SCHEMA_VERSION = 6;

type GlobalPrisma = typeof globalThis & {
  prisma?: PrismaClient;
  prismaSchemaVersion?: number;
};

const globalForPrisma = globalThis as GlobalPrisma;

function createPrismaClient(): PrismaClient {
  ensureDatabaseUrlEnv();
  if (process.env.VERCEL) {
    assertRuntimeDatabaseUrl();
  }
  const url = getRuntimeDatabaseUrl();
  const base = new PrismaClientCtor({
    log: process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"],
    ...(url && isPostgresDatabaseUrl(url)
      ? { datasources: { db: { url } } }
      : {}),
  });

  return base.$extends({
    query: {
      $allOperations({ model, operation, args, query }) {
        const label = `prisma:${model ?? "raw"}.${operation}`;
        return executeWithRetry(() => query(args), {
          label,
          maxAttempts: 4,
          timeoutMs: 20_000,
          baseDelayMs: 250,
        });
      },
    },
  }) as unknown as PrismaClient;
}

function isPrismaClientCurrent(client: PrismaClient | undefined): client is PrismaClient {
  return Boolean(
    client &&
      typeof client.drugReviewCycle?.findUnique === "function" &&
      typeof client.drugCardProgress?.findUnique === "function" &&
      typeof client.memoryCardMastery?.findUnique === "function" &&
      typeof client.userSocialPost?.findUnique === "function" &&
      typeof client.scheduledSocialPost?.findUnique === "function"
  );
}

export function getPrisma(): PrismaClient {
  ensureDatabaseUrlEnv();
  if (process.env.VERCEL) {
    try {
      assertRuntimeDatabaseUrl();
    } catch (error) {
      const message = error instanceof Error ? error.message : "DATABASE_URL misconfigured";
      throw new Error(`[db] ${message}`);
    }
  }
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

/** Lazy proxy so importing `@/lib/prisma` does not open a DB connection at module load. */
export const prisma: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, prop, receiver) {
    const client = getPrisma();
    const value = Reflect.get(client, prop, client);
    return typeof value === "function" ? value.bind(client) : value;
  },
});

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
