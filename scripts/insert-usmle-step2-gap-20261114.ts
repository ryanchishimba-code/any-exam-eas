#!/usr/bin/env node
/**
 * Insert the 100 hidden Step 2 gap items (active=false).
 *
 *   npx tsx scripts/insert-usmle-step2-gap-20261114.ts --dry-run
 *   npx tsx scripts/insert-usmle-step2-gap-20261114.ts
 *
 * Undo, after a real insert:
 *   psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-step2-gap-20261114.sql
 *
 * The undo deletes exactly the ids written into that file. Rows stay inactive.
 */
import { mkdirSync, writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { PrismaClient } from "@prisma/client";
import { bankItemContentHash } from "../src/lib/sync-question-bank";
import {
  GAP_STEP2_20261114,
  GAP_STEP2_BATCH_ID,
  GAP_STEP2_SOURCE,
} from "../src/lib/exam-prep/usmle/gap-step2-20261114";

const dryRun = process.argv.includes("--dry-run");
const BACKUP = "qbi_usmle_s2_gap100_20261114_backup";

function csvEscape(value: string) {
  if (/[",\n]/.test(value)) return `"${value.replace(/"/g, '""')}"`;
  return value;
}

function optionsJson(item: (typeof GAP_STEP2_20261114)[number]) {
  return JSON.stringify({
    options: item.options,
    kind: "vignette",
    blueprintSystem: item.blueprintDomain,
    blueprintTopic: item.blueprintTopic,
    taskCategory: item.taskCategory,
  });
}

async function main() {
  const prisma = new PrismaClient();
  const rows: {
    code: string;
    id: string;
    contentHash: string;
    item: (typeof GAP_STEP2_20261114)[number];
  }[] = [];

  try {
    for (const item of GAP_STEP2_20261114) {
      const hash = bankItemContentHash("usmle-step-2", item.subjectId, {
        question: item.stem,
        vignette: item.vignette,
      });
      const existing = await prisma.questionBankItem.findUnique({
        where: { contentHash: hash },
        select: { id: true, source: true, active: true },
      });
      if (existing && existing.source !== GAP_STEP2_SOURCE) {
        throw new Error(`content hash collision on ${item.code} with ${existing.id}`);
      }
      rows.push({ code: item.code, id: existing?.id ?? "", contentHash: hash, item });
    }

    if (!dryRun) {
      for (const row of rows) {
        const item = row.item;
        const data = {
          fieldId: "usmle-step-2",
          subjectId: item.subjectId,
          scenario: item.vignette,
          difficulty: item.difficulty,
          topicCategory: item.blueprintTopic,
          blueprintDomain: item.blueprintDomain,
          blueprintTopic: item.blueprintTopic,
          taskCategory: item.taskCategory,
          stepLevel: "step2",
          itemType: "vignette",
          question: item.stem,
          options: optionsJson(item),
          correctAnswer: item.correctAnswer,
          explanation: item.explanation,
          tags: JSON.stringify([
            "usmle",
            "step2",
            "gap-batch-20261114",
            item.blueprintDomain,
            item.difficultyBand,
          ]),
          references: item.references,
          source: GAP_STEP2_SOURCE,
          contentHash: row.contentHash,
          active: false,
          qaPassed: false,
          manualCorrection: true,
          reviewStatus: "pending",
          generationVersion: GAP_STEP2_BATCH_ID,
          generationMeta: {
            batchId: GAP_STEP2_BATCH_ID,
            difficultyBand: item.difficultyBand,
            code: item.code,
            blindRead: "agree",
            hidden: true,
          },
        };
        if (row.id) {
          await prisma.questionBankItem.update({
            where: { id: row.id },
            data: { ...data, active: false, qaPassed: false },
          });
        } else {
          const created = await prisma.questionBankItem.create({ data, select: { id: true } });
          row.id = created.id;
        }
      }

      const ids = rows.map((row) => row.id);
      await prisma.$executeRawUnsafe(`DROP TABLE IF EXISTS ${BACKUP}`);
      const list = ids.map((id) => `'${id.replace(/'/g, "''")}'`).join(",");
      await prisma.$executeRawUnsafe(
        `CREATE TABLE ${BACKUP} AS SELECT * FROM "QuestionBankItem" WHERE id IN (${list})`
      );
      const undo = undoSql(ids);
      writeFileSync(path.join("scripts", "undo-usmle-step2-gap-20261114.sql"), undo);
    }

    mkdirSync("reports", { recursive: true });
    const header = [
      "code",
      "id",
      "fieldId",
      "blueprintDomain",
      "difficulty",
      "difficultyBand",
      "subjectId",
      "blueprintTopic",
      "correctAnswer",
      "citationUrl",
      "active",
      "contentHash",
    ];
    const lines = [header.join(",")];
    for (const row of rows) {
      lines.push(
        [
          row.code,
          row.id,
          "usmle-step-2",
          row.item.blueprintDomain,
          String(row.item.difficulty),
          row.item.difficultyBand,
          row.item.subjectId,
          row.item.blueprintTopic,
          row.item.correctAnswer,
          row.item.references[0]?.url ?? "",
          "false",
          row.contentHash,
        ]
          .map(csvEscape)
          .join(",")
      );
    }
    const csvPath = path.join("reports", "usmle-step2-gap-20261114-dryrun.csv");
    writeFileSync(csvPath, `${lines.join("\n")}\n`);
    console.log(
      `${dryRun ? "dry-run" : "inserted"} ${rows.length} hidden items; csv ${csvPath}`
    );
  } finally {
    await prisma.$disconnect();
  }
}

function undoSql(ids: string[]) {
  const list = ids.map((id) => `    '${id.replace(/'/g, "''")}'`).join(",\n");
  return `-- Undo the 2026-11-14 hidden Step 2 gap batch.
-- Deletes exactly these ${ids.length} ids. They were inserted inactive.
-- Backup table ${BACKUP} still holds a copy of the inserted rows after this delete.
-- Command: psql "$DATABASE_URL" -v ON_ERROR_STOP=1 -f scripts/undo-usmle-step2-gap-20261114.sql
BEGIN;
DO $undo$
DECLARE n integer;
BEGIN
  SELECT COUNT(*) INTO n FROM "QuestionBankItem"
  WHERE id IN (
${list}
  )
  AND source = '${GAP_STEP2_SOURCE}'
  AND active = false;
  IF n <> ${ids.length} THEN
    RAISE EXCEPTION 'expected ${ids.length} hidden gap rows, found %', n;
  END IF;
  DELETE FROM "QuestionBankItem"
  WHERE id IN (
${list}
  )
  AND source = '${GAP_STEP2_SOURCE}'
  AND active = false;
  GET DIAGNOSTICS n = ROW_COUNT;
  IF n <> ${ids.length} THEN
    RAISE EXCEPTION 'deleted % rows, expected ${ids.length}', n;
  END IF;
END
$undo$;
COMMIT;
`;
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
