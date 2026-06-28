#!/usr/bin/env node
/**
 * Apply question-bank performance indexes on Neon/Postgres.
 * Safe to re-run — uses CREATE INDEX IF NOT EXISTS.
 *
 * Usage:
 *   npm run db:apply-perf-indexes
 */
import { readFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

const __dirname = dirname(fileURLToPath(import.meta.url));
const sqlPath = join(
  __dirname,
  "../prisma/migrations/20260623120000_question_bank_perf_indexes/migration.sql"
);

async function main() {
  const { PrismaClient } = await import("@prisma/client");
  const prisma = new PrismaClient();
  const sql = readFileSync(sqlPath, "utf8");
  const statements = sql
    .split(";")
    .map((s) => s.trim())
    .filter((s) => s.length > 0 && !s.startsWith("--"));

  console.log(`Applying ${statements.length} index statement(s)…`);
  for (const statement of statements) {
    console.log(`→ ${statement.split("\n")[0]}…`);
    await prisma.$executeRawUnsafe(`${statement};`);
  }
  console.log("Done.");
  await prisma.$disconnect();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
