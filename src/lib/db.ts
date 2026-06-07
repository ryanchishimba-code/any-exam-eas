/**
 * Canonical database entry for Drizzle + Neon.
 * Re-exports from `@/db` — prefer `requireDb()` in route handlers and server code.
 */
export {
  getDb,
  getNeonSql,
  requireDb,
  schema,
  type AppDatabase,
} from "@/db";
