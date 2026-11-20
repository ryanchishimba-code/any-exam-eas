#!/usr/bin/env node
/**
 * NAPLEX content corrections (2026-10-20). Dry run by default.
 *
 *   npx tsx scripts/apply-naplex-content-fix-20261020.ts
 *   npx tsx scripts/apply-naplex-content-fix-20261020.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";

const DATA_DIR = path.join(process.cwd(), "scripts/data/naplex-content-fix-20261020");
const BACKUP_TABLE = "qbi_naplex_content_fix_backup_20261020";

type Proposed = {
  label: string;
  set_correctAnswer: string;
  set_options?: string[];
  set_scenario?: string;
  set_question?: string;
  set_explanation: string;
};

const prisma = new PrismaClient();

function readProposed(): Record<string, Proposed> {
  return JSON.parse(readFileSync(path.join(DATA_DIR, "proposed-changes.json"), "utf8")) as Record<
    string,
    Proposed
  >;
}

function parseOptions(raw: string): Record<string, unknown> {
  try {
    const parsed = JSON.parse(raw) as unknown;
    if (Array.isArray(parsed)) return { options: parsed };
    if (parsed && typeof parsed === "object") return parsed as Record<string, unknown>;
  } catch {
    /* fall through */
  }
  return { options: [] };
}

function mergeOptions(raw: string, nextOptions: string[] | undefined): string {
  if (!nextOptions?.length) return raw;
  const base = parseOptions(raw);
  return JSON.stringify({ ...base, options: nextOptions });
}

async function main() {
  const apply = process.argv.includes("--apply");
  const proposed = readProposed();
  const ids = Object.keys(proposed);

  const live = (await prisma.$queryRawUnsafe(
    `
    SELECT id, scenario, question, options, "correctAnswer", explanation,
           "updatedAt"::text AS updated_at, active, "manual_correction"
    FROM "QuestionBankItem"
    WHERE id = ANY($1::text[])
    `,
    ids
  )) as Array<{
    id: string;
    scenario: string | null;
    question: string;
    options: string;
    correctAnswer: string;
    explanation: string;
    updated_at: string;
    active: boolean;
    manual_correction: boolean;
  }>;

  const byId = new Map(live.map((row) => [row.id, row]));
  const missing = ids.filter((id) => !byId.has(id));
  if (missing.length) {
    console.error("Missing live rows:", missing.join(", "));
    process.exit(1);
  }

  console.log(apply ? "APPLY" : "DRY RUN");
  console.log(`targets: ${ids.length}`);

  for (const id of ids) {
    const row = byId.get(id)!;
    const fix = proposed[id]!;
    const nextOptions = fix.set_options ? mergeOptions(row.options, fix.set_options) : row.options;
    const optionTexts = (parseOptions(nextOptions).options as string[]) ?? [];
    if (!optionTexts.includes(fix.set_correctAnswer)) {
      console.error(`${id}: new key not in options`, fix.set_correctAnswer);
      process.exit(1);
    }
    console.log(
      `${fix.label} | ${id}\n  key: ${JSON.stringify(row.correctAnswer)} -> ${JSON.stringify(fix.set_correctAnswer)}`
    );
    if (fix.set_options) {
      console.log(`  options: ${JSON.stringify(optionTexts)}`);
    }
  }

  if (!apply) {
    console.log("\nNo writes. Re-run with --apply after backup approval.");
    return;
  }

  await prisma.$executeRawUnsafe(`
    CREATE TABLE IF NOT EXISTS "${BACKUP_TABLE}" AS
    SELECT q.*, now() AS backed_up_at
    FROM "QuestionBankItem" q
    WHERE false
  `);

  await prisma.$executeRawUnsafe(
    `
    INSERT INTO "${BACKUP_TABLE}"
    SELECT q.*, now() AS backed_up_at
    FROM "QuestionBankItem" q
    WHERE q.id = ANY($1::text[])
      AND NOT EXISTS (
        SELECT 1 FROM "${BACKUP_TABLE}" b WHERE b.id = q.id
      )
    `,
    ids
  );

  for (const id of ids) {
    const row = byId.get(id)!;
    const fix = proposed[id]!;
    const nextOptions = fix.set_options ? mergeOptions(row.options, fix.set_options) : row.options;
    await prisma.$executeRaw(
      Prisma.sql`
        UPDATE "QuestionBankItem"
        SET
          scenario = ${fix.set_scenario ?? row.scenario},
          question = ${fix.set_question ?? row.question},
          options = ${nextOptions},
          "correctAnswer" = ${fix.set_correctAnswer},
          explanation = ${fix.set_explanation},
          "manual_correction" = true,
          "updatedAt" = now()
        WHERE id = ${id}
          AND "correctAnswer" = ${row.correctAnswer}
      `
    );
  }

  console.log(`\nApplied ${ids.length} rows. Backup table: ${BACKUP_TABLE}`);
}

main()
  .catch((error) => {
    console.error(error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
