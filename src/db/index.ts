/**
 * Neon + Drizzle (HTTP) — serverless-safe singleton.
 * Driver: @neondatabase/serverless (official Neon serverless package)
 * @see https://neon.tech/docs/serverless/serverless-driver
 */
import { drizzle } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { getSql, getSqlConnectionUrl } from "@/lib/db";
import * as schema from "./schema";

export type AppDatabase = NeonHttpDatabase<typeof schema>;

let dbInstance: AppDatabase | null = null;
let drizzleBoundUrl: string | null = null;

/** Low-level Neon SQL tagged-template executor (HTTP) — shared with `@/lib/db`. */
export { getSql as getNeonSql, sql } from "@/lib/db";

/** Lazy Drizzle client — resolves env on first use (safe on Vercel). */
export function getDb(): AppDatabase {
  const sqlClient = getSql();
  const url = getSqlConnectionUrl();
  if (!dbInstance || drizzleBoundUrl !== url) {
    dbInstance = drizzle(sqlClient, { schema });
    drizzleBoundUrl = url;
  }
  return dbInstance;
}

/** Same as getDb(); throws if Neon is not configured. */
export function requireDb(): AppDatabase {
  return getDb();
}

export { schema };
