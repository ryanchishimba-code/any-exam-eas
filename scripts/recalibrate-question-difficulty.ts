#!/usr/bin/env node
/**
 * Recalibrate QuestionBankItem.difficulty from saved attempt accuracy.
 *
 * Does not change stems, options, keys, or rationales.
 * Dry-run is the default and writes nothing:
 *   npx tsx scripts/recalibrate-question-difficulty.ts --field nursing
 *
 * Apply writes the new difficulty and an undo file:
 *   npx tsx scripts/recalibrate-question-difficulty.ts --field nursing --apply --undo-file ./difficulty-undo.json
 *
 * Restore the previous difficulties from that file:
 *   npx tsx scripts/recalibrate-question-difficulty.ts --undo ./difficulty-undo.json
 *
 * Do not run --apply or --undo against production without reviewing the dry-run.
 */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname } from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { proposeDifficultyChanges } from "../src/lib/exam-prep/difficulty-calibration";

type UndoRow = { id: string; from: number | null };

function arg(name: string): string | null {
  const index = process.argv.indexOf(name);
  if (index < 0) return null;
  return process.argv[index + 1] ?? null;
}

function has(name: string): boolean {
  return process.argv.includes(name);
}

async function main() {
  const prisma = new PrismaClient();
  try {
    const undoPath = arg("--undo");
    if (undoPath) {
      const rows = JSON.parse(readFileSync(undoPath, "utf8")) as UndoRow[];
      if (!Array.isArray(rows)) throw new Error("Undo file must be an array.");
      console.log(`Restoring ${rows.length} difficulty values from ${undoPath}`);
      for (const row of rows) {
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: { difficulty: row.from },
        });
      }
      console.log("Undo complete.");
      return;
    }

    const fieldId = arg("--field") ?? "nursing";
    const rows = await prisma.$queryRaw<
      { id: string; difficulty: number | null; answered: number; correct: number }[]
    >`
      SELECT qbi.id,
        qbi.difficulty,
        COUNT(qa.id)::int AS answered,
        COALESCE(SUM(CASE WHEN qa.correct THEN 1 ELSE 0 END), 0)::int AS correct
      FROM "QuestionBankItem" qbi
      JOIN "QuestionAttempt" qa ON qa."bankItemId" = qbi.id
      WHERE qbi."fieldId" = ${fieldId}
        AND qbi.active = true
        AND qbi."qaPassed" = true
      GROUP BY qbi.id, qbi.difficulty
    `;
    const changes = proposeDifficultyChanges(rows);
    console.log(
      `${fieldId}: ${rows.length} items with attempts, ${changes.length} difficulty changes proposed.`
    );
    const sample = changes.slice(0, 20);
    for (const change of sample) {
      console.log(
        `${change.id}  ${change.from ?? "unset"} -> ${change.to}  (${change.correct}/${change.answered})`
      );
    }
    if (changes.length > sample.length) {
      console.log(`… ${changes.length - sample.length} more`);
    }
    if (!has("--apply")) {
      console.log("Dry-run only. Re-run with --apply --undo-file <path> to write.");
      return;
    }
    const undoFile = arg("--undo-file");
    if (!undoFile) throw new Error("--apply requires --undo-file <path>.");
    const undo: UndoRow[] = changes.map((change) => ({ id: change.id, from: change.from }));
    mkdirSync(dirname(undoFile), { recursive: true });
    writeFileSync(undoFile, JSON.stringify(undo, null, 2));
    for (const change of changes) {
      await prisma.questionBankItem.update({
        where: { id: change.id },
        data: { difficulty: change.to },
      });
    }
    console.log(`Applied ${changes.length} updates. Undo file: ${undoFile}`);
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error instanceof Error ? error.message : error);
  process.exit(1);
});
