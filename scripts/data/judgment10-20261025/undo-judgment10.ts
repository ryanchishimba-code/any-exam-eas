#!/usr/bin/env node
/**
 * Remove judgment10 pilot rows inserted by apply-judgment10.ts.
 *
 *   npx tsx scripts/data/judgment10-20261025/undo-judgment10.ts
 *   npx tsx scripts/data/judgment10-20261025/undo-judgment10.ts --apply
 */
import { readFileSync, existsSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "../../resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { DATA_DIR } from "./map-judgment-items";

const UNDO_PATH = path.join(DATA_DIR, "undo.json");
const prisma = new PrismaClient();

type UndoFile = {
  batchId: string;
  insertedIds: string[];
  backupTable: string;
};

async function main() {
  const apply = process.argv.includes("--apply");
  if (!existsSync(UNDO_PATH)) {
    console.error(`Missing ${UNDO_PATH} — nothing to undo.`);
    process.exit(1);
  }
  const undo = JSON.parse(readFileSync(UNDO_PATH, "utf8")) as UndoFile;
  const ids = undo.insertedIds ?? [];
  if (ids.length === 0) {
    console.error("undo.json has no insertedIds");
    process.exit(1);
  }

  const live = await prisma.questionBankItem.findMany({
    where: { id: { in: ids } },
    select: { id: true, tags: true },
  });

  console.log(`\nUndo judgment batch ${undo.batchId}`);
  console.log(`  rows in undo.json: ${ids.length}`);
  console.log(`  still live: ${live.length}`);
  console.log(apply ? "  mode: APPLY\n" : "  mode: preview\n");

  if (!apply) {
    console.log("Pass --apply to DELETE these QuestionBankItem rows.");
    return;
  }

  const deleted = await prisma.questionBankItem.deleteMany({ where: { id: { in: ids } } });
  console.log(`Deleted ${deleted.count} row(s). Backup snapshot remains in ${undo.backupTable}.`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
