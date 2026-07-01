#!/usr/bin/env node
/**
 * Database optimization: hard-delete retired/inactive question bank rows and legacy cruft.
 *
 * Safe to run — only removes rows that are NOT served in production:
 *   - active=false (soft-retired curation leftovers)
 *   - active=true AND qaPassed=false (QA gate failures)
 *   - RETIRED_FIELD_IDS (mpje, medicine, etc.)
 *
 * Full-practice-exam join rows cascade on delete. User attempts/reports keep
 * optional bankItemId snapshots (no FK).
 *
 * Usage:
 *   npm run db:optimize-cleanup           # audit only
 *   npm run db:optimize-cleanup:dry       # dry-run counts
 *   npm run db:optimize-cleanup:apply     # execute purge
 *   npm run db:optimize-cleanup:apply -- --include-legacy
 */
import fs from "node:fs";
import path from "node:path";
import { getScriptPrisma, disconnectScriptPrisma } from "./lib/script-db";
import { RETIRED_FIELD_IDS } from "../src/lib/subjects/field-ids";

const prisma = getScriptPrisma();
const ARTIFACTS = path.join(process.cwd(), "artifacts");
const REPORT_PATH = path.join(ARTIFACTS, "db-optimize-cleanup.json");

const auditOnly = process.argv.includes("--audit");
const dryRun = process.argv.includes("--dry-run") || auditOnly || !process.argv.includes("--apply");
const includeLegacy = process.argv.includes("--include-legacy");
const batchArg = process.argv.find((a) => a.startsWith("--batch-size="));
const BATCH_SIZE = batchArg ? parseInt(batchArg.split("=")[1]!, 10) : 500;

type FieldCounts = Record<string, number>;

type AuditSnapshot = {
  questionBank: {
    total: number;
    active: number;
    inactive: number;
    qaPassed: number;
    qaFailedActive: number;
    purgeCandidates: number;
  };
  activeByField: FieldCounts;
  inactiveByField: FieldCounts;
  retiredFieldItems: number;
  tableSizeBytes: number | null;
  legacy: Record<string, number>;
};

async function tableSizeBytes(): Promise<number | null> {
  const rows = await prisma.$queryRaw<{ bytes: bigint }[]>`
    SELECT pg_total_relation_size('"QuestionBankItem"') AS bytes
  `;
  return rows[0] ? Number(rows[0].bytes) : null;
}

async function audit(): Promise<AuditSnapshot> {
  const [total, active, inactive, qaPassed, qaFailedActive, retiredFieldItems] =
    await Promise.all([
      prisma.questionBankItem.count(),
      prisma.questionBankItem.count({ where: { active: true } }),
      prisma.questionBankItem.count({ where: { active: false } }),
      prisma.questionBankItem.count({ where: { active: true, qaPassed: true } }),
      prisma.questionBankItem.count({ where: { active: true, qaPassed: false } }),
      prisma.questionBankItem.count({ where: { fieldId: { in: [...RETIRED_FIELD_IDS] } } }),
    ]);

  const [byFieldActive, byFieldInactive, sizeBytes, legacyCounts] = await Promise.all([
    prisma.questionBankItem.groupBy({
      by: ["fieldId"],
      where: { active: true },
      _count: { id: true },
    }),
    prisma.questionBankItem.groupBy({
      by: ["fieldId"],
      where: { active: false },
      _count: { id: true },
    }),
    tableSizeBytes(),
    Promise.all([
      prisma.lessonPlan.count(),
      prisma.generatedExam.count(),
      prisma.learningQuilt.count(),
      prisma.textbookUpload.count(),
      prisma.generationHistory.count(),
      prisma.generatedQuestion.count(),
      prisma.questionBankSync.count(),
    ]).then(
      ([lessonPlans, generatedExams, learningQuilts, textbookUploads, generationHistory, generatedQuestions, syncLogs]) => ({
        lessonPlans,
        generatedExams,
        learningQuilts,
        textbookUploads,
        generationHistory,
        generatedQuestions,
        questionBankSyncLogs: syncLogs,
      })
    ),
  ]);

  const activeByField: FieldCounts = {};
  for (const row of byFieldActive) activeByField[row.fieldId] = row._count.id;

  const inactiveByField: FieldCounts = {};
  for (const row of byFieldInactive) inactiveByField[row.fieldId] = row._count.id;

  return {
    questionBank: {
      total,
      active,
      inactive,
      qaPassed,
      qaFailedActive,
      purgeCandidates: inactive + qaFailedActive + retiredFieldItems,
    },
    activeByField,
    inactiveByField,
    retiredFieldItems,
    tableSizeBytes: sizeBytes,
    legacy: legacyCounts,
  };
}

function formatBytes(n: number | null): string {
  if (n == null) return "unknown";
  if (n >= 1_073_741_824) return `${(n / 1_073_741_824).toFixed(2)} GB`;
  if (n >= 1_048_576) return `${(n / 1_048_576).toFixed(1)} MB`;
  return `${(n / 1024).toFixed(0)} KB`;
}

function purgeWhereClause() {
  return {
    OR: [
      { active: false },
      { active: true, qaPassed: false },
      { fieldId: { in: [...RETIRED_FIELD_IDS] } },
    ],
  } as const;
}

async function countPurgeCandidates(): Promise<number> {
  return prisma.questionBankItem.count({ where: purgeWhereClause() });
}

async function purgeQuestionBankBatch(): Promise<number> {
  const batch = await prisma.questionBankItem.findMany({
    where: purgeWhereClause(),
    select: { id: true },
    take: BATCH_SIZE,
    orderBy: { id: "asc" },
  });
  if (!batch.length) return 0;

  const ids = batch.map((r) => r.id);
  if (dryRun) return ids.length;

  const result = await prisma.questionBankItem.deleteMany({
    where: { id: { in: ids } },
  });
  return result.count;
}

async function purgeLegacyTables(): Promise<Record<string, number>> {
  const deleted: Record<string, number> = {};
  if (dryRun) {
    const counts = await audit();
    deleted.lessonPlans = counts.legacy.lessonPlans ?? 0;
    deleted.generatedExams = counts.legacy.generatedExams ?? 0;
    deleted.learningQuilts = counts.legacy.learningQuilts ?? 0;
    deleted.textbookUploads = counts.legacy.textbookUploads ?? 0;
    deleted.generationHistory = counts.legacy.generationHistory ?? 0;
    deleted.generatedQuestions = counts.legacy.generatedQuestions ?? 0;
    deleted.questionBankSyncLogs = counts.legacy.questionBankSyncLogs ?? 0;
    return deleted;
  }

  deleted.lessonPlans = (await prisma.lessonPlan.deleteMany({})).count;
  deleted.generatedExams = (await prisma.generatedExam.deleteMany({})).count;
  deleted.learningQuilts = (await prisma.learningQuilt.deleteMany({})).count;
  deleted.textbookUploads = (await prisma.textbookUpload.deleteMany({})).count;
  deleted.generationHistory = (await prisma.generationHistory.deleteMany({})).count;
  deleted.generatedQuestions = (await prisma.generatedQuestion.deleteMany({})).count;
  // Keep last 20 sync logs for audit trail
  const keepSync = await prisma.questionBankSync.findMany({
    orderBy: { finishedAt: "desc" },
    take: 20,
    select: { id: true },
  });
  deleted.questionBankSyncLogs = (
    await prisma.questionBankSync.deleteMany({
      where: { id: { notIn: keepSync.map((s) => s.id) } },
    })
  ).count;

  return deleted;
}

async function analyzeTable() {
  if (dryRun) return;
  await prisma.$executeRawUnsafe('ANALYZE "QuestionBankItem"');
}

async function main() {
  const mode = auditOnly ? "audit" : dryRun ? "dry-run" : "apply";
  console.log(`\nDatabase optimize cleanup [${mode}] batch=${BATCH_SIZE}\n`);

  const before = await audit();
  const purgeTotal = await countPurgeCandidates();

  console.log("Before:");
  console.log(`  QuestionBankItem: ${before.questionBank.total.toLocaleString()} rows (${formatBytes(before.tableSizeBytes)})`);
  console.log(`  Active / qaPassed: ${before.questionBank.active.toLocaleString()} / ${before.questionBank.qaPassed.toLocaleString()}`);
  console.log(`  Inactive: ${before.questionBank.inactive.toLocaleString()}`);
  console.log(`  Active QA-failed: ${before.questionBank.qaFailedActive.toLocaleString()}`);
  console.log(`  Retired field rows: ${before.retiredFieldItems.toLocaleString()}`);
  console.log(`  Purge candidates: ${purgeTotal.toLocaleString()}`);

  if (auditOnly) {
    console.log("\nActive by field:", before.activeByField);
    console.log("Inactive by field:", before.inactiveByField);
    console.log("Legacy tables:", before.legacy);
    return;
  }

  if (dryRun) {
    console.log(`\nWould hard-delete ${purgeTotal.toLocaleString()} question bank row(s).`);
    if (includeLegacy) {
      const legacy = await purgeLegacyTables();
      console.log("Would purge legacy tables:", legacy);
    }
    console.log("\nRe-run with --apply to execute.");
    return;
  }

  console.log(`\nPurging ${purgeTotal.toLocaleString()} question bank row(s)…`);
  let deleted = 0;
  let batches = 0;
  const started = Date.now();

  while (true) {
    const n = await purgeQuestionBankBatch();
    if (n === 0) break;
    deleted += n;
    batches++;
    if (batches % 20 === 0 || deleted >= purgeTotal) {
      process.stdout.write(`  ${deleted.toLocaleString()} / ${purgeTotal.toLocaleString()} deleted\r`);
    }
  }
  console.log(`\n  Deleted ${deleted.toLocaleString()} question bank row(s) in ${batches} batch(es).`);

  let legacyDeleted: Record<string, number> | undefined;
  if (includeLegacy) {
    legacyDeleted = await purgeLegacyTables();
    console.log("  Legacy tables purged:", legacyDeleted);
  }

  await analyzeTable();
  const after = await audit();

  const report = {
    at: new Date().toISOString(),
    mode,
    batchSize: BATCH_SIZE,
    includeLegacy,
    before,
    after,
    deleted: { questionBank: deleted, legacy: legacyDeleted },
    durationMs: Date.now() - started,
  };

  fs.mkdirSync(ARTIFACTS, { recursive: true });
  fs.writeFileSync(REPORT_PATH, JSON.stringify(report, null, 2));

  console.log("\nAfter:");
  console.log(`  QuestionBankItem: ${after.questionBank.total.toLocaleString()} rows (${formatBytes(after.tableSizeBytes)})`);
  console.log(`  Active / qaPassed: ${after.questionBank.active.toLocaleString()} / ${after.questionBank.qaPassed.toLocaleString()}`);
  console.log(`  Space saved: ~${formatBytes((before.tableSizeBytes ?? 0) - (after.tableSizeBytes ?? 0))}`);
  console.log(`\nReport: ${REPORT_PATH}`);
  console.log("\n✓ Database optimization complete.");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => disconnectScriptPrisma());
