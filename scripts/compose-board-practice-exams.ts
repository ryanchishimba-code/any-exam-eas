#!/usr/bin/env node
/**
 * Compose NCLEX-RN practice exams from student-eligible items.
 *
 * The composer is board-generic (`composeBoardExams` + a test-plan config).
 * This script loads the nursing pool and writes NCLEX preset rows only.
 *
 * In-progress and completed sessions keep `exam_sessions.analysis.prefetchedQuestionIds`.
 * This script does not read or write exam sessions. New links apply to new sittings.
 *
 * Question-bank stems, options, keys, and rationales are not edited.
 * Replaced exam membership is copied into `qaReport.boardExamComposer.previous`
 * so `--apply --restore` can put it back. Paused exams keep their links.
 *
 * Dry-run (default):
 *   npm run db:compose-board-exams
 *
 * After owner approval:
 *   npm run db:compose-board-exams -- --apply
 *   npm run db:compose-board-exams -- --apply --restore
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import {
  composeBoardExams,
  formatAreaDistribution,
  type ComposedExam,
} from "../src/lib/exam-prep/compose/board-exam-composer";
import {
  BOARD_COMPOSER_PIPELINE,
  planBoardExamRows,
} from "../src/lib/exam-prep/compose/board-exam-row-plan";
import {
  nclexAreaId,
  nclexRn2026ComposeConfig,
  scenarioTextForCompose,
} from "../src/lib/exam-prep/compose/nclex-rn-2026-plan";
import { STUDENT_ELIGIBLE_SQL } from "../src/lib/exam-prep/student-eligibility-sql";

const prisma = new PrismaClient();

type Args = { apply: boolean; restore: boolean; maxExams: number };

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = { apply: false, restore: false, maxExams: 43 };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--apply") parsed.apply = true;
    else if (arg === "--restore") parsed.restore = true;
    else if (arg === "--max-exams" && args[i + 1]) parsed.maxExams = Number(args[++i]);
  }
  if (!Number.isFinite(parsed.maxExams) || parsed.maxExams < 0) {
    throw new Error("--max-exams must be a non-negative number.");
  }
  return parsed;
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
}

type BankRow = {
  id: string;
  subjectId: string;
  clientNeeds: string | null;
  scenario: string | null;
  question: string;
};

type LinkSnap = {
  questionBankItemId: string;
  sortOrder: number;
  clientNeedsCategory: string | null;
  itemFormat: string | null;
};

function snapshotLinks(
  links: Array<{
    questionBankItemId: string;
    sortOrder: number;
    clientNeedsCategory: string | null;
    itemFormat: string | null;
  }>
): LinkSnap[] {
  return links
    .slice()
    .sort((a, b) => a.sortOrder - b.sortOrder)
    .map((link) => ({
      questionBankItemId: link.questionBankItemId,
      sortOrder: link.sortOrder,
      clientNeedsCategory: link.clientNeedsCategory,
      itemFormat: link.itemFormat,
    }));
}

async function main() {
  const args = parseArgs();
  const mode = args.apply ? "APPLY" : "DRY-RUN";
  console.log(`compose-board-practice-exams ${mode} board=nclex-rn`);
  console.log("Sessions are not modified. Stored item text is not modified.");

  if (args.restore) {
    await restoreExams(args.apply);
    return;
  }

  const config = nclexRn2026ComposeConfig(args.maxExams);
  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT id, "subjectId", "clientNeeds",
      left(COALESCE(scenario, ''), 800) AS scenario,
      left(question, 800) AS question
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      AND ${STUDENT_ELIGIBLE_SQL}
    `,
    "nursing"
  )) as BankRow[];

  const areaById = new Map<string, string>();
  const items = [];
  let unmapped = 0;
  for (const row of rows) {
    const areaId = nclexAreaId(row.subjectId, row.clientNeeds);
    if (!areaId) {
      unmapped += 1;
      continue;
    }
    areaById.set(row.id, areaId);
    items.push({
      id: row.id,
      areaId,
      subjectId: row.subjectId,
      scenarioText: scenarioTextForCompose(row.scenario, row.question),
    });
  }

  const composed = composeBoardExams(items, config);
  console.log("\n## Pool math\n");
  console.log(`Eligible nursing items loaded: ${rows.length}`);
  console.log(`Unmapped subject tags: ${unmapped}`);
  console.log(`Quota: ${JSON.stringify(composed.math.quota)}`);
  console.log(`Pool by area: ${JSON.stringify(composed.math.poolByArea)}`);
  console.log(`Max full exams by area (reuse 1, before near-duplicate blocking): ${JSON.stringify(composed.math.maxFullExamsByArea)}`);
  console.log(`Limiting area: ${composed.math.limitingArea ?? "none"}`);
  console.log(
    `Published full exams: ${composed.math.publishedFullExams} of ${composed.math.requestedFullExams} requested (${composed.math.fullExamLength} items).`
  );
  console.log(`Published subject sets: ${composed.math.publishedSubjectSets}`);
  console.log(composed.math.stopReason);

  console.log("\n## Per-exam area distribution\n");
  composed.exams.forEach((exam, index) => {
    console.log(`\n${index + 1}. ${exam.title} [${exam.kind}] n=${exam.itemIds.length} out of range: ${exam.areasOutOfRange.length}`);
    for (const line of formatAreaDistribution(exam, config.areas)) console.log(`  ${line}`);
  });

  const overlap = composed.overlap;
  console.log("\n## Overlap\n");
  console.log(`Exams: ${overlap.exams}`);
  console.log(`Identical pairs: ${overlap.identicalPairs}`);
  console.log(`Max shared items: ${overlap.maxSharedItems}`);
  console.log(`Mean shared items: ${overlap.meanSharedItems.toFixed(2)}`);
  console.log(`Max Jaccard: ${overlap.maxJaccard.toFixed(3)}`);
  console.log(`Mean Jaccard: ${overlap.meanJaccard.toFixed(3)}`);

  const existing = await prisma.nclexFullPracticeExam.findMany({
    select: { examNumber: true, active: true },
    orderBy: { examNumber: "asc" },
  });
  const rowPlan = planBoardExamRows({ existing, composedCount: composed.exams.length });
  console.log("\n## Row plan\n");
  console.log(`Replace exam numbers: ${rowPlan.replace.join(", ") || "none"}`);
  console.log(`Create exam numbers: ${rowPlan.create.join(", ") || "none"}`);
  console.log(`Pause exam numbers (links kept): ${rowPlan.pause.join(", ") || "none"}`);

  if (!args.apply) {
    console.log("\nNo rows written. Re-run with --apply after owner approval.");
    return;
  }

  const now = new Date().toISOString();
  for (let index = 0; index < composed.exams.length; index++) {
    const examNumber = index + 1;
    const exam = composed.exams[index]!;
    await writeExam(examNumber, exam, areaById, now);
  }
  for (const examNumber of rowPlan.pause) {
    await pauseExam(examNumber, now);
  }
  console.log("\nApply finished. Restore with --apply --restore.");
}

async function writeExam(
  examNumber: number,
  exam: ComposedExam,
  areaById: Map<string, string>,
  now: string
) {
  const existing = await prisma.nclexFullPracticeExam.findUnique({
    where: { examNumber },
    include: { questions: true },
  });
  const previous = existing
    ? {
        title: existing.title,
        questionCount: existing.questionCount,
        active: existing.active,
        qaPassed: existing.qaPassed,
        blueprintSummary: existing.blueprintSummary,
        links: snapshotLinks(existing.questions),
      }
    : null;
  const qaReport = mergeArchive(existing?.qaReport ?? null, {
    pipeline: BOARD_COMPOSER_PIPELINE,
    appliedAt: now,
    kind: existing ? "replace" : "create",
    examKind: exam.kind,
    previous,
  });
  const data = {
    title: exam.title,
    questionCount: exam.itemIds.length,
    active: true,
    qaPassed: true,
    blueprintSummary: exam.areaCounts,
    generationVersion: BOARD_COMPOSER_PIPELINE,
    qaReport,
  };
  const saved = existing
    ? await prisma.nclexFullPracticeExam.update({ where: { id: existing.id }, data })
    : await prisma.nclexFullPracticeExam.create({ data: { examNumber, ...data } });

  await prisma.$transaction([
    prisma.nclexFullPracticeExamQuestion.deleteMany({ where: { examId: saved.id } }),
    prisma.nclexFullPracticeExamQuestion.createMany({
      data: exam.itemIds.map((questionBankItemId, sortOrder) => ({
        examId: saved.id,
        questionBankItemId,
        sortOrder,
        clientNeedsCategory: areaById.get(questionBankItemId) ?? null,
      })),
    }),
  ]);
  console.log(`wrote exam ${examNumber} ${exam.title} (${exam.itemIds.length})`);
}

async function pauseExam(examNumber: number, now: string) {
  const existing = await prisma.nclexFullPracticeExam.findUnique({
    where: { examNumber },
    include: { questions: true },
  });
  if (!existing || !existing.active) return;
  const qaReport = mergeArchive(existing.qaReport, {
    pipeline: BOARD_COMPOSER_PIPELINE,
    appliedAt: now,
    kind: "pause",
    previous: {
      title: existing.title,
      questionCount: existing.questionCount,
      active: true,
      qaPassed: existing.qaPassed,
      blueprintSummary: existing.blueprintSummary,
      links: snapshotLinks(existing.questions),
    },
  });
  await prisma.nclexFullPracticeExam.update({
    where: { id: existing.id },
    data: { active: false, qaReport },
  });
  console.log(`paused exam ${examNumber} (links kept)`);
}

function mergeArchive(existing: Prisma.JsonValue | null, next: Record<string, unknown>): Prisma.InputJsonValue {
  const base = asObject(existing);
  const prior = asObject(base.boardExamComposer);
  if (prior.pipeline === BOARD_COMPOSER_PIPELINE && prior.previous) {
    return {
      ...base,
      boardExamComposer: { ...prior, reappliedAt: next.appliedAt },
    } as Prisma.InputJsonValue;
  }
  return { ...base, boardExamComposer: next } as Prisma.InputJsonValue;
}

async function restoreExams(apply: boolean) {
  const rows = await prisma.nclexFullPracticeExam.findMany({
    include: { questions: { select: { id: true } } },
  });
  let planned = 0;
  for (const row of rows) {
    const block = asObject(asObject(row.qaReport).boardExamComposer);
    if (block.pipeline !== BOARD_COMPOSER_PIPELINE) continue;
    const previous = asObject(block.previous);
    planned += 1;
    console.log(
      `${apply ? "restore" : "plan restore"} exam ${row.examNumber} kind=${String(block.kind)} active→${previous.active ?? false}`
    );
    if (!apply) continue;
    if (block.kind === "create") {
      await prisma.nclexFullPracticeExam.update({
        where: { id: row.id },
        data: { active: false },
      });
      continue;
    }
    const links = Array.isArray(previous.links) ? (previous.links as LinkSnap[]) : null;
    await prisma.nclexFullPracticeExam.update({
      where: { id: row.id },
      data: {
        title: typeof previous.title === "string" ? previous.title : row.title,
        questionCount: typeof previous.questionCount === "number" ? previous.questionCount : row.questionCount,
        active: previous.active !== false,
        qaPassed: typeof previous.qaPassed === "boolean" ? previous.qaPassed : row.qaPassed,
        blueprintSummary: (previous.blueprintSummary ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });
    if (block.kind === "replace" && links) {
      await prisma.$transaction([
        prisma.nclexFullPracticeExamQuestion.deleteMany({ where: { examId: row.id } }),
        prisma.nclexFullPracticeExamQuestion.createMany({
          data: links.map((link) => ({
            examId: row.id,
            questionBankItemId: link.questionBankItemId,
            sortOrder: link.sortOrder,
            clientNeedsCategory: link.clientNeedsCategory,
            itemFormat: link.itemFormat,
          })),
        }),
      ]);
    }
  }
  console.log(`Restore ${apply ? "applied" : "planned"}: ${planned}`);
  if (!apply) console.log("No rows written.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
