/**
 * Canonical Neon HTTP SQL client for serverless (Vercel).
 * Driver: @neondatabase/serverless — `neon()` uses Neon's HTTP API (no TCP pool).
 *
 * Prefer the pooled DATABASE_URL hostname (`-pooler`) on Vercel.
 * @see https://neon.tech/docs/serverless/serverless-driver
 */
import { neon, type NeonQueryFunction } from "@neondatabase/serverless";
import {
  assertRuntimeDatabaseUrl,
  ensureDatabaseUrlEnv,
  getNeonHttpDatabaseUrl,
  isNeonPooledUrl,
  isPostgresDatabaseUrl,
} from "@/lib/database-url";

export type NeonSql = NeonQueryFunction<false, false>;

const QB_RETRY_BACKOFF_MS = [500, 1000, 2000] as const;
const QB_RETRY_MAX_ATTEMPTS = 3;

let sqlInstance: NeonSql | null = null;
let cachedHttpUrl: string | null = null;

function resolvePooledHttpUrl(): string {
  ensureDatabaseUrlEnv();
  assertRuntimeDatabaseUrl();

  const url = getNeonHttpDatabaseUrl();
  if (!url || !isPostgresDatabaseUrl(url)) {
    throw new Error(
      "DATABASE_URL is not configured. Set a Neon pooled postgresql:// URL (hostname must include -pooler)."
    );
  }

  // Always require pooler on Vercel; warn elsewhere if missing.
  if (process.env.VERCEL && !isNeonPooledUrl(url)) {
    throw new Error(
      "DATABASE_URL must use the Neon pooled hostname (-pooler) for the HTTP driver. Copy the pooled connection string from Neon Console → Connect."
    );
  }
  if (!isNeonPooledUrl(url)) {
    console.warn(
      "[db] DATABASE_URL host does not include -pooler. Prefer the pooled Neon URL for serverless."
    );
  }

  return url;
}

/** Low-level Neon SQL tagged-template executor (HTTP). */
export function getSql(): NeonSql {
  const url = resolvePooledHttpUrl();
  if (!sqlInstance || cachedHttpUrl !== url) {
    sqlInstance = neon(url);
    cachedHttpUrl = url;
  }
  return sqlInstance;
}

/**
 * Reusable Neon HTTP `sql` client.
 * Lazy — connection string is resolved on first use (safe on Vercel cold starts).
 */
export const sql: NeonSql = new Proxy(function sqlTag() {} as unknown as NeonSql, {
  apply(_target, _thisArg, argArray) {
    const client = getSql() as unknown as (...args: unknown[]) => unknown;
    return client(...argArray);
  },
  get(_target, prop) {
    const client = getSql() as unknown as Record<string | symbol, unknown>;
    const value = client[prop];
    return typeof value === "function"
      ? (value as (...args: unknown[]) => unknown).bind(client)
      : value;
  },
});

/** Current HTTP connection string (pooled, Prisma-only query params stripped). */
export function getSqlConnectionUrl(): string | null {
  return cachedHttpUrl;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

/**
 * Retry critical question-bank DB work through transient Neon blips.
 * Exactly 3 attempts with fixed backoff: 500ms → 1000ms → 2000ms between tries.
 */
export async function withDbRetry<T>(
  operation: () => Promise<T>,
  label = "db"
): Promise<T> {
  let lastError: unknown;

  for (let attempt = 0; attempt < QB_RETRY_MAX_ATTEMPTS; attempt++) {
    try {
      return await operation();
    } catch (error) {
      lastError = error;
      const message = error instanceof Error ? error.message : String(error);
      console.warn(
        `[db] ${label} attempt ${attempt + 1}/${QB_RETRY_MAX_ATTEMPTS} failed:`,
        message
      );
      if (attempt < QB_RETRY_MAX_ATTEMPTS - 1) {
        await sleep(QB_RETRY_BACKOFF_MS[attempt]!);
      }
    }
  }

  throw lastError;
}

/** Alias kept for older call sites; prefer `getSql` / `sql`. */
export function getNeonSql(): NeonSql {
  return getSql();
}
