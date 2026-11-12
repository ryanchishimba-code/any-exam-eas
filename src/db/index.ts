/**
 * Drizzle singleton. Neon hosts use the HTTP driver. Local Postgres (CI and
 * Playwright) uses TCP, because the Neon HTTP driver turns 127.0.0.1 into
 * https://api.0.0.1/sql and the exam page dies in its error boundary.
 */
import { drizzle as drizzleNeon } from "drizzle-orm/neon-http";
import type { NeonHttpDatabase } from "drizzle-orm/neon-http";
import type { Pool } from "pg";
import {
  isBuildPlaceholderDatabaseUrl,
  isPostgresDatabaseUrl,
  resolveDatabaseUrl,
  usesNeonHttpDriver,
} from "@/lib/database-url";
import { getSql, getSqlConnectionUrl } from "@/lib/db";
import * as schema from "./schema";

export type AppDatabase = NeonHttpDatabase<typeof schema>;

let dbInstance: AppDatabase | null = null;
let drizzleBoundUrl: string | null = null;
let localPool: Pool | null = null;
let localDb: AppDatabase | null = null;
let localUrl: string | null = null;

/**
 * `pg` uses Node's net/tls/fs. A static import is pulled into client components
 * that reach this module and the production build fails. Load it only when a
 * local database is actually opened.
 */
function loadLocalDrizzle(): {
  Pool: typeof import("pg").Pool;
  drizzle: typeof import("drizzle-orm/node-postgres").drizzle;
} {
  const req = eval("require") as NodeRequire;
  return {
    Pool: (req("pg") as typeof import("pg")).Pool,
    drizzle: (req("drizzle-orm/node-postgres") as typeof import("drizzle-orm/node-postgres")).drizzle,
  };
}

/** Low-level Neon SQL tagged-template executor (HTTP) — shared with `@/lib/db`. */
export { getSql as getNeonSql, sql } from "@/lib/db";

function getLocalDb(url: string): AppDatabase {
  if (!localDb || localUrl !== url) {
    void localPool?.end();
    const { Pool: PgPool, drizzle } = loadLocalDrizzle();
    localPool = new PgPool({ connectionString: url, max: 4 });
    // Call sites are typed for the Neon HTTP client. The query builder is the
    // same; only the transport differs, so the TCP client is cast at the boundary.
    localDb = drizzle(localPool, { schema }) as unknown as AppDatabase;
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
