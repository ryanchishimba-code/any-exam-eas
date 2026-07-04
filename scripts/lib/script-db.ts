/**
 * Shared Prisma client for CLI scripts — resolves Neon/Vercel env vars,
 * bounds the connection pool, and retries transient failures.
 */
import type { PrismaClient } from "@prisma/client";
import { createResilientPrismaClient } from "@/lib/prisma-resilient-client";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "../resolve-database-url.mjs";

loadEnvFiles();
const url = ensureDatabaseUrlEnv();
if (!url) {
  console.error(
    "No DATABASE_URL. Set .env.local or POSTGRES_URL (see scripts/check-db-connection.mjs)."
  );
  process.exit(1);
}

let client: PrismaClient | null = null;

export function getScriptPrisma(): PrismaClient {
  if (!client) {
    client = createResilientPrismaClient({
      log: process.env.DEBUG_PRISMA ? ["query", "error", "warn"] : ["error"],
    });
  }
  return client;
}

export async function disconnectScriptPrisma(): Promise<void> {
  if (client) {
    await client.$disconnect();
    client = null;
  }
}

export async function assertScriptDbConnection(): Promise<void> {
  const prisma = getScriptPrisma();
  await prisma.$queryRaw`SELECT 1 AS ok`;
}
