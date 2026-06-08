#!/usr/bin/env node
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
const url = ensureDatabaseUrlEnv();
if (!url) {
  console.error("No DATABASE_URL");
  process.exit(1);
}

async function main() {
  const { requireDb } = await import("../src/db/index.ts");
  const { examSessions } = await import("../src/db/schema.ts");
  const { count } = await import("drizzle-orm");
  const db = requireDb();
  const rows = await db.select({ n: count() }).from(examSessions);
  console.log("OK — Drizzle connected, exam_sessions:", rows[0]?.n ?? 0);
}

main().catch((e) => {
  console.error("FAILED — Drizzle:", e.message ?? e);
  process.exit(1);
});
