#!/usr/bin/env node
/**
 * Restore rows touched by apply-cardiac-cleanup-20261025.ts using undo.json.
 *
 *   npx tsx scripts/undo-cardiac-cleanup-20261025.ts --dry-run
 *   npx tsx scripts/undo-cardiac-cleanup-20261025.ts --apply
 */
import { readFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";
import { PrismaClient } from "@prisma/client";

loadEnvFiles();
ensureDatabaseUrlEnv();

const UNDO_PATH = path.join(process.cwd(), "scripts/data/cardiac-cleanup-20261025/undo.json");

const prisma = new PrismaClient();

type UndoFile = {
  rows: { id: string; blueprintTopic: string | null; tags: string | null; active: boolean }[];
};

function parseArgs() {
  const args = new Set(process.argv.slice(2));
  if (args.has("--apply") && args.has("--dry-run")) {
    throw new Error("Pass either --apply or --dry-run, not both.");
  }
  return { apply: args.has("--apply"), dryRun: !args.has("--apply") };
}

async function main() {
  const { apply, dryRun } = parseArgs();
  const undo = JSON.parse(readFileSync(UNDO_PATH, "utf8")) as UndoFile;
  console.log(`${dryRun ? "Dry-run" : "Apply"}: restore ${undo.rows.length} rows from undo.json`);

  for (const row of undo.rows) {
    const current = await prisma.questionBankItem.findUnique({
      where: { id: row.id },
      select: { blueprintTopic: true, tags: true, active: true },
    });
    if (!current) {
      throw new Error(`Missing row ${row.id}`);
    }
    const needs =
      current.blueprintTopic !== row.blueprintTopic ||
      current.tags !== row.tags ||
      current.active !== row.active;
    if (!needs) continue;
    if (dryRun) {
      console.log(`  would restore ${row.id}`);
      continue;
    }
    await prisma.questionBankItem.update({
      where: { id: row.id },
      data: {
        blueprintTopic: row.blueprintTopic,
        tags: row.tags,
        active: row.active,
        updatedAt: new Date(),
      },
    });
  }
  console.log(dryRun ? "Dry-run complete." : "Undo apply complete.");
}

main()
  .catch((err) => {
    console.error(err);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
