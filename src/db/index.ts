/**
 * Neon + Drizzle (HTTP) — serverless-safe singleton.
 * Driver: @neondatabase/serverless (official Neon serverless package)
 * @see https://neon.tech/docs/serverless/serverless-driver
 */
import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import {
  ensureDatabaseUrlEnv,
  getRuntimeDatabaseUrl,
  isPostgresDatabaseUrl,
} from "@/lib/database-url";
import * as schema from "./schema";

export type AppDatabase = NeonHttpDatabase<typeof schema>;

let dbInstance: AppDatabase | null = null;
let sqlInstance: ReturnType<typeof neon> | null = null;
let cachedUrl: string | null = null;

function resolveConnectionString(): string {
  ensureDatabaseUrlEnv();
  const url = getRuntimeDatabaseUrl();
  if (!url || !isPostgresDatabaseUrl(url)) {
    throw new Error(
      "DATABASE_URL is not configured. Set a Neon pooled postgresql:// URL (see docs/VERCEL_DATABASE.md)."
    );
  }
  return url;
}

/** Low-level Neon SQL tagged-template executor (HTTP). */
export function getNeonSql() {
  const url = resolveConnectionString();
  if (!sqlInstance || cachedUrl !== url) {
    sqlInstance = neon(url);
    cachedUrl = url;
    dbInstance = null;
  }
  return sqlInstance;
}

/** Lazy Drizzle client — resolves env on first use (safe on Vercel). */
export function getDb(): AppDatabase {
  const url = resolveConnectionString();
  if (!dbInstance || cachedUrl !== url) {
    sqlInstance = neon(url);
    cachedUrl = url;
    dbInstance = drizzle(sqlInstance, { schema });
  }
  return dbInstance;
}

/** Same as getDb(); throws if Neon is not configured. */
export function requireDb(): AppDatabase {
  return getDb();
}

export { schema };
