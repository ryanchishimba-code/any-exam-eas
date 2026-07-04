import type { PrismaClient } from "@prisma/client";
import { PrismaClient as PrismaClientCtor } from "@prisma/client";
import {
  ensureDatabaseUrlEnv,
  assertRuntimeDatabaseUrl,
  getRuntimeDatabaseUrl,
  isPostgresDatabaseUrl,
} from "@/lib/database-url";
import { executeWithRetry, getPrismaRetryOptions } from "@/lib/db-resilience";

/** Prisma client with automatic retry on transient Neon/Vercel failures. */
export function createResilientPrismaClient(options?: {
  log?: ("query" | "info" | "warn" | "error")[];
}): PrismaClient {
  ensureDatabaseUrlEnv();
  if (process.env.VERCEL) {
    assertRuntimeDatabaseUrl();
  }
  const url = getRuntimeDatabaseUrl();
  const retryOpts = getPrismaRetryOptions();
  const base = new PrismaClientCtor({
    log:
      options?.log ??
      (process.env.NODE_ENV === "development" ? ["error", "warn"] : ["error"]),
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
          ...retryOpts,
        });
      },
    },
  }) as unknown as PrismaClient;
}
