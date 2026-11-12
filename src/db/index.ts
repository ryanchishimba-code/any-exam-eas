/**
 * Drizzle singleton. Neon hosts use the HTTP driver. Local Postgres (CI and
 * Playwright) uses TCP, because the Neon HTTP driver turns 127.0.0.1 into
 * https://api.0.0.1/sql and the exam page dies in its error boundary.
 */
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import { drizzle as drizzlePg } from "drizzle-orm/node-postgres";
import type { NodePgDatabase } from "drizzle-orm/node-postgres";
import { Pool } from "pg";
import {
  isBuildPlaceholderDatabaseUrl,
  isPostgresDatabaseUrl,
  resolveDatabaseUrl,
  usesNeonHttpDriver,
} from "@/lib/database-url";
import { getSql, getSqlConnectionUrl } from "@/lib/db";
import * as schema from "./schema";

export type AppDatabase = NeonHttpDatabase<typeof schema> | NodePgDatabase<typeof schema>;

let dbInstance: NeonHttpDatabase<typeof schema> | null = null;
let drizzleBoundUrl: string | null = null;
let localPool: Pool | null = null;
let localDb: NodePgDatabase<typeof schema> | null = null;
let localUrl: string | null = null;

/** Low-level Neon SQL tagged-template executor (HTTP) — shared with `@/lib/db`. */
export { getSql as getNeonSql, sql } from "@/lib/db";

function getLocalDb(url: string): NodePgDatabase<typeof schema> {
  if (!localDb || localUrl !== url) {
    void localPool?.end();
    localPool = new Pool({ connectionString: url, max: 4 });
    localDb = drizzlePg(localPool, { schema });
    localUrl = url;
  }
  return localDb;
}

/** Lazy Drizzle client — resolves env on first use (safe on Vercel). */
export function getDb(): AppDatabase {
  const url = resolveDatabaseUrl();
  if (
    isPostgresDatabaseUrl(url) &&
    !usesNeonHttpDriver(url) &&
    !isBuildPlaceholderDatabaseUrl(url)
  ) {
    return getLocalDb(url);
  }
  const sqlClient = getSql();
  const bound = getSqlConnectionUrl();
  if (!dbInstance || drizzleBoundUrl !== bound) {
    dbInstance = drizzleNeon(sqlClient, { schema });
    drizzleBoundUrl = bound;
  }
  return dbInstance;
}

/** Same as getDb(); throws if Neon is not configured. */
export function requireDb(): AppDatabase {
  return getDb();
}

export { schema };
