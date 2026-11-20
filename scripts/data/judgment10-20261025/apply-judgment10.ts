#!/usr/bin/env node
/**
 * Insert the 10 judgment-pilot items into live QuestionBankItem (Neon).
 *
 *   npx tsx scripts/data/judgment10-20261025/apply-judgment10.ts
 *   npx tsx scripts/data/judgment10-20261025/apply-judgment10.ts --apply
 *
 * Default is dry-run inside a rolled-back transaction. --apply copies inserted
 * rows into qbi_judgment10_backup_20261025, writes undo.json, and commits.
 */
import { writeFileSync } from "node:fs";
import path from "node:path";
import { loadEnvFiles, ensureDatabaseUrlEnv } from "../../resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import type { Prisma } from "@prisma/client";
import { PrismaClient } from "@prisma/client";
import { auditNclexBankItem } from "../../../src/lib/exam-prep/nclex-bank-audit";
import { auditNaplexBankItem } from "../../../src/lib/exam-prep/naplex-bank-audit";
import { bankItemToExamQuestion } from "../../../src/lib/exam-prep/ngn-bank-bridge";
import { examQuestionToStudy, isAnswerCorrect } from "../../../src/lib/questions/prepare";
import { JUDGMENT10_BATCH_ID } from "../../../src/lib/judgment-pilot/constants";
import {
  DATA_DIR,
  loadJudgmentItems,
  mapAllJudgmentItems,
  serializeMappedRow,
  type MappedJudgmentRow,
} from "./map-judgment-items";

const BACKUP_TABLE = "qbi_judgment10_backup_20261025";
const UNDO_PATH = path.join(DATA_DIR, "undo.json");
const prisma = new PrismaClient();

type UndoRow = { id: string; pilotId: string; fieldId: string; contentHash: string };

type UndoFile = {
  batchId: string;
  appliedAt?: string;
  insertedIds: string[];
  backupTable: string;
  rows: UndoRow[];
};

type DbClient = Prisma.TransactionClient | PrismaClient;

function assertServeReady(row: MappedJudgmentRow) {
  const exam = bankItemToExamQuestion(
    {
      ...row.bankItem,
      id: row.pilotId,
      fieldId: row.fieldId,
      itemType: row.itemType,
    },
    0
  );
  const study = examQuestionToStudy({ ...exam, field: row.fieldId }, 0, { shuffleOptions: false });
  const graded = study.correctAnswers;
  if (!isAnswerCorrect(study, graded)) {
    throw new Error(`${row.pilotId}: mapped key does not grade (${graded.join(" | ")})`);
  }

  if (row.fieldId === "nursing") {
    const audit = auditNclexBankItem(row.bankItem);
    if (!audit.ok) {
      throw new Error(`${row.pilotId}: NCLEX audit failed: ${audit.issues.map((i) => i.code).join(",")}`);
    }
  } else {
    const audit = auditNaplexBankItem(row.bankItem);
    if (!audit.ok) {
      throw new Error(`${row.pilotId}: NAPLEX audit failed: ${audit.issues.map((i) => i.code).join(",")}`);
    }
  }
}

async function countServe(client: DbClient, fieldId: string) {
  return client.questionBankItem.count({
    where: { fieldId, active: true, qaPassed: true },
  });
}

async function insertRows(client: DbClient, mapped: MappedJudgmentRow[]): Promise<UndoRow[]> {
  const inserted: UndoRow[] = [];
  for (const row of mapped) {
    const created = await client.questionBankItem.create({
      data: {
        fieldId: row.fieldId,
        subjectId: row.bankItem.subjectId,
        scenario: row.bankItem.vignette ?? null,
        question: row.bankItem.question,
        options: serializeMappedRow(row, "pending").options,
        correctAnswer: row.bankItem.correctAnswer,
        explanation: row.bankItem.explanation,
        itemType: row.bankItem.itemType ?? "vignette",
        difficulty: row.bankItem.difficulty ?? 5,
        topicCategory: row.bankItem.topicCategory ?? row.bankItem.subjectId,
        blueprintDomain: row.bankItem.blueprintDomain ?? null,
        tags: JSON.stringify(row.bankItem.tags ?? []),
        references: row.bankItem.references ?? [],
        source: "judgment-pilot",
        contentHash: row.contentHash,
        active: true,
        manualCorrection: true,
        qaPassed: true,
        reviewStatus: "approved",
        qaAuditedAt: new Date(),
        generationMeta: row.bankItem.generationMeta ?? { batchId: JUDGMENT10_BATCH_ID },
      },
      select: { id: true },
    });
    inserted.push({
      id: created.id,
      pilotId: row.pilotId,
      fieldId: row.fieldId,
      contentHash: row.contentHash,
    });
  }

  const serveChecks = await client.questionBankItem.count({
    where: {
      id: { in: inserted.map((r) => r.id) },
      active: true,
      qaPassed: true,
    },
  });
  if (serveChecks !== inserted.length) {
    throw new Error("post-insert serve gate check failed");
  }

  return inserted;
}

async function backupRows(ids: string[]) {
  if (ids.length === 0) return;
  await prisma.$executeRawUnsafe(
    `CREATE TABLE IF NOT EXISTS ${BACKUP_TABLE} (LIKE "QuestionBankItem" INCLUDING ALL)`
  );
  const idList = ids.map((id) => `'${id}'`).join(", ");
  await prisma.$executeRawUnsafe(`
    INSERT INTO ${BACKUP_TABLE}
    SELECT * FROM "QuestionBankItem" WHERE id IN (${idList})
    ON CONFLICT DO NOTHING
  `);
}

class RollbackSignal extends Error {
  rows: UndoRow[];
  constructor(rows: UndoRow[]) {
    super("rollback");
    this.rows = rows;
  }
}

async function main() {
  const apply = process.argv.includes("--apply");
  const items = loadJudgmentItems();
  const mapped = mapAllJudgmentItems(items);

  console.log(`\nJudgment10 pilot — ${mapped.length} item(s) — batch ${JUDGMENT10_BATCH_ID}`);
  console.log(apply ? "mode: APPLY\n" : "mode: DRY-RUN (rolled back)\n");

  for (const row of mapped) {
    assertServeReady(row);
    console.log(`  ✓ ${row.pilotId} · ${row.fieldId} · ${row.itemType}`);
  }

  const nursingBefore = await countServe(prisma, "nursing");
  const pharmacyBefore = await countServe(prisma, "pharmacy");

  const hashes = mapped.map((m) => m.contentHash);
  const hashHits = await prisma.questionBankItem.findMany({
    where: { contentHash: { in: hashes } },
    select: { id: true, contentHash: true },
  });
  const tagHits = await prisma.questionBankItem.findMany({
    where: { tags: { contains: JUDGMENT10_BATCH_ID } },
    select: { id: true },
  });

  if (tagHits.length > 0) {
    console.log(`\nBatch tag already on ${tagHits.length} row(s): ${tagHits.map((t) => t.id).join(", ")}`);
    if (apply) process.exit(1);
  }
  if (hashHits.length > 0) {
    console.log(`\nContent-hash collision(s): ${hashHits.map((h) => h.id).join(", ")}`);
    if (apply) process.exit(1);
  }

  let inserted: UndoRow[] = [];

  if (apply) {
    inserted = await insertRows(prisma, mapped);
    await backupRows(inserted.map((r) => r.id));
    const undo: UndoFile = {
      batchId: JUDGMENT10_BATCH_ID,
      appliedAt: new Date().toISOString(),
      insertedIds: inserted.map((r) => r.id),
      backupTable: BACKUP_TABLE,
      rows: inserted,
    };
    writeFileSync(UNDO_PATH, JSON.stringify(undo, null, 2));
    console.log(`\nWrote ${UNDO_PATH}`);
  } else {
    try {
      await prisma.$transaction(
        async (tx) => {
          inserted = await insertRows(tx, mapped);
          throw new RollbackSignal(inserted);
        },
        { timeout: 120_000 }
      );
    } catch (err) {
      if (!(err instanceof RollbackSignal)) throw err;
      inserted = err.rows;
    }
  }

  const nursingDelta = mapped.filter((m) => m.fieldId === "nursing").length;
  const pharmacyDelta = mapped.filter((m) => m.fieldId === "pharmacy").length;
  const nursingAfter = apply ? await countServe(prisma, "nursing") : nursingBefore + nursingDelta;
  const pharmacyAfter = apply ? await countServe(prisma, "pharmacy") : pharmacyBefore + pharmacyDelta;

  console.log("\nCounts (active + qaPassed):");
  console.log(`  nursing:  ${nursingBefore} → ${nursingAfter} (+${nursingAfter - nursingBefore})`);
  console.log(`  pharmacy: ${pharmacyBefore} → ${pharmacyAfter} (+${pharmacyAfter - pharmacyBefore})`);
  console.log(`\nWould insert / inserted: ${inserted.length}`);
  if (!apply) {
    console.log("\nDry-run complete — transaction rolled back.");
  } else {
    console.log(`\nBackup table: ${BACKUP_TABLE}`);
    console.log("Undo: npx tsx scripts/data/judgment10-20261025/undo-judgment10.ts --apply");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
