#!/usr/bin/env node
/**
 * Hide audited wrong keys and queue uncertain keys for RN review.
 * Covers the NCLEX and NAPLEX reviewed lists.
 *
 * Does not edit stems, options, keys, rationales, `active`, or `qaPassed`.
 * Does not delete rows. Exam links stay until the board composer is applied.
 * A wrong key is hidden by the student-eligibility rule (and by this meta
 * record). `--restore` sets status to restored, which the rule honors.
 * `--clear-restores` hides those reviewed ids again.
 *
 * Dry-run (default):
 *   npm run db:pull-key-wrong
 *
 * Record curationMeta after owner approval:
 *   npm run db:pull-key-wrong -- --apply
 *
 *   npm run db:pull-key-wrong -- --apply --restore <itemId>
 *   npm run db:pull-key-wrong -- --apply --clear-restores
 *   npm run db:pull-key-wrong -- --apply --clear-review-queue
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import {
  STUDENT_ELIGIBILITY_PIPELINE,
  readStudentEligibilityRecord,
  type StudentEligibilityRecord,
} from "../src/lib/exam-prep/student-eligibility";
import {
  KEY_REVIEW_AUDIT_REF,
  NAPLEX_KEY_REVIEW_AUDIT_REF,
  KEY_UNCERTAIN_RN_REVIEW,
  KEY_WRONG_PENDING_RN_REVIEW,
  KEY_WRONG_REASON,
  keyUncertainReviewFor,
  keyWrongReviewFor,
  rnReviewQueueRecord,
  withKeyWrongAudit,
} from "../src/lib/exam-prep/reviewed-key-queue";

const prisma = new PrismaClient();

type Args = {
  apply: boolean;
  clearRestores: boolean;
  clearReviewQueue: boolean;
  restoreIds: string[];
};

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = { apply: false, clearRestores: false, clearReviewQueue: false, restoreIds: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--apply") parsed.apply = true;
    else if (arg === "--clear-restores") parsed.clearRestores = true;
    else if (arg === "--clear-review-queue") parsed.clearReviewQueue = true;
    else if (arg === "--restore" && args[i + 1]) parsed.restoreIds.push(args[++i]!);
  }
  return parsed;
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
}

async function main() {
  const args = parseArgs();
  const now = new Date().toISOString();
  const mode = args.apply ? "APPLY" : "DRY-RUN";
  console.log(`pull-key-wrong ${mode}`);
  console.log(`audits: ${KEY_REVIEW_AUDIT_REF}; ${NAPLEX_KEY_REVIEW_AUDIT_REF}`);
  console.log("No stems, options, keys, rationales, active flags, or exam links are modified.");

  const wrongIds = KEY_WRONG_PENDING_RN_REVIEW.map((item) => item.id);
  const uncertainIds = KEY_UNCERTAIN_RN_REVIEW.map((item) => item.id);
  const [nclexExams, naplexExams] = await Promise.all([
    prisma.nclexFullPracticeExam.findMany({
      where: { active: true },
      orderBy: { examNumber: "asc" },
      select: {
        examNumber: true,
        title: true,
        questionCount: true,
        questions: {
          where: { questionBankItemId: { in: [...wrongIds, ...uncertainIds] } },
          select: { questionBankItemId: true },
        },
      },
    }),
    prisma.naplexFullPracticeExam.findMany({
      where: { active: true },
      orderBy: { examNumber: "asc" },
      select: {
        examNumber: true,
        title: true,
        questionCount: true,
        questions: {
          where: { questionBankItemId: { in: [...wrongIds, ...uncertainIds] } },
          select: { questionBankItemId: true },
        },
      },
    }),
  ]);
  const exams = [
    ...nclexExams.map((exam) => ({ board: "nclex", ...exam })),
    ...naplexExams.map((exam) => ({ board: "naplex", ...exam })),
  ];

  const examsByItem = new Map<string, string[]>();
  for (const exam of exams) {
    for (const link of exam.questions) {
      const list = examsByItem.get(link.questionBankItemId) ?? [];
      list.push(`${exam.board} ${exam.examNumber}`);
      examsByItem.set(link.questionBankItemId, list);
    }
  }

  console.log("\n## Wrong keys to hide\n");
  console.log("| sample | id | exams |");
  console.log("| --- | --- | ---: |");
  const affected = new Set<string>();
  let slots = 0;
  for (const item of KEY_WRONG_PENDING_RN_REVIEW) {
    const list = examsByItem.get(item.id) ?? [];
    slots += list.length;
    for (const label of list) affected.add(label);
    console.log(`| ${item.sampleId} | ${item.id} | ${list.length} |`);
  }
  console.log(`\nDistinct exams containing a wrong key: ${affected.size}`);
  console.log(`Slots to replace: ${slots}`);

  console.log("\n## Backfill plan (not executed)\n");
  console.log(
    "Serve-time fill keeps every other linked item and replaces each wrong-key slot from the student-eligible pool. The board composer rebuilds whole forms; this script does not rewrite links."
  );
  console.log("| board | exam | title | length | slots to replace | kept | action |");
  console.log("| --- | ---: | --- | ---: | ---: | ---: | --- |");
  for (const exam of exams) {
    const replace = exam.questions.filter((link) => keyWrongReviewFor(link.questionBankItemId)).length;
    if (replace === 0) continue;
    const kept = exam.questionCount - replace;
    console.log(
      `| ${exam.board} | ${exam.examNumber} | ${exam.title} | ${exam.questionCount} | ${replace} | ${kept} | backfill |`
    );
  }

  console.log("\n## Uncertain keys (queue only; hidden only if also on the wrong-key list)\n");
  console.log("| sample | id | exams |");
  console.log("| --- | --- | ---: |");
  for (const item of KEY_UNCERTAIN_RN_REVIEW) {
    const list = examsByItem.get(item.id) ?? [];
    console.log(`| ${item.sampleId} | ${item.id} | ${list.length} |`);
  }

  const rows = await prisma.questionBankItem.findMany({
    where: { id: { in: [...wrongIds, ...uncertainIds] } },
    select: { id: true, curationMeta: true },
  });
  const byId = new Map(rows.map((row) => [row.id, row]));
  const missing = [...wrongIds, ...uncertainIds].filter((id) => !byId.has(id));
  if (missing.length > 0) console.log(`\nMissing bank rows: ${missing.join(", ")}`);

  let writes = 0;
  for (const item of KEY_WRONG_PENDING_RN_REVIEW) {
    const row = byId.get(item.id);
    if (!row) continue;
    const prior = readStudentEligibilityRecord(row.curationMeta);
    const forceRestore = args.restoreIds.includes(item.id);
    const clearThis = args.clearRestores && prior?.status === "restored";
    const restored = forceRestore || (prior?.status === "restored" && !clearThis);
    const record: StudentEligibilityRecord = withKeyWrongAudit(item.id, {
      pipeline: STUDENT_ELIGIBILITY_PIPELINE,
      status: restored ? "restored" : "suppressed",
      reasons: [KEY_WRONG_REASON],
      assessedAt: prior?.assessedAt || now,
      ...(restored ? { restoredAt: prior?.restoredAt || now } : {}),
    });
    const changed =
      !prior ||
      prior.status !== record.status ||
      prior.auditRef !== record.auditRef ||
      prior.sampleId !== record.sampleId ||
      !prior.reasons.includes(KEY_WRONG_REASON);
    if (!changed) continue;
    writes += 1;
    console.log(
      `${args.apply ? "write" : "plan"} ${item.sampleId} ${item.id} → ${record.status} (${KEY_WRONG_REASON}, ${record.auditRef})`
    );
    if (!args.apply) continue;
    await prisma.questionBankItem.update({
      where: { id: item.id },
      data: {
        curationMeta: {
          ...asObject(row.curationMeta),
          studentEligibility: record,
        } as Prisma.InputJsonValue,
      },
    });
  }

  for (const item of KEY_UNCERTAIN_RN_REVIEW) {
    const row = byId.get(item.id);
    if (!row) continue;
    const meta = asObject(row.curationMeta);
    if (args.clearReviewQueue) {
      if (!meta.rnReviewQueue) continue;
      writes += 1;
      console.log(`${args.apply ? "clear queue" : "plan clear queue"} ${item.sampleId} ${item.id}`);
      if (!args.apply) continue;
      delete meta.rnReviewQueue;
      await prisma.questionBankItem.update({
        where: { id: item.id },
        data: { curationMeta: meta as Prisma.InputJsonValue },
      });
      continue;
    }
    const queued = rnReviewQueueRecord(item, now);
    const existing = asObject(meta.rnReviewQueue);
    const auditRef = item.auditRef ?? KEY_REVIEW_AUDIT_REF;
    if (existing.sampleId === item.sampleId && existing.reason === "key_uncertain" && existing.auditRef === auditRef) {
      continue;
    }
    writes += 1;
    console.log(
      `${args.apply ? "queue" : "plan queue"} ${item.sampleId} ${item.id} → rnReviewQueue key_uncertain (${auditRef})`
    );
    if (!args.apply) continue;
    await prisma.questionBankItem.update({
      where: { id: item.id },
      data: {
        curationMeta: { ...meta, rnReviewQueue: queued } as Prisma.InputJsonValue,
      },
    });
  }

  console.log(`\nMeta writes ${args.apply ? "applied" : "planned"}: ${writes}`);
  if (!args.apply) console.log("No rows written. Re-run with --apply after owner approval.");
  if (args.restoreIds.some((id) => !keyWrongReviewFor(id) && !keyUncertainReviewFor(id))) {
    console.log("A --restore id is outside the reviewed lists and was ignored.");
  }
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
