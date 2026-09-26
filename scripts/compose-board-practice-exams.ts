#!/usr/bin/env node
/**
 * Compose NCLEX-RN practice exams from student-eligible items.
 *
 * The composer is board-generic (`composeBoardExams` + a test-plan config).
 * This script loads the nursing or pharmacy pool and writes that board's preset rows only.
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
 *   npm run db:compose-board-exams -- --board naplex
 *
 * After owner approval:
 *   npm run db:compose-board-exams -- --apply
 *   npm run db:compose-board-exams -- --apply --restore
 *   npm run db:compose-board-exams -- --board naplex --apply
 *   npm run db:compose-board-exams -- --board naplex --apply --restore
 *
 * Outline previews (no rows written unless --apply):
 *   npm run db:compose-board-exams -- --board usmle-step-1
 *   npm run db:compose-board-exams -- --board usmle-step-2
 *   npm run db:compose-board-exams -- --board usmle-step-3
 *   npm run db:compose-board-exams -- --board aanp-fnp
 *   npm run db:compose-board-exams -- --board pance
 *   npm run db:compose-board-exams -- --board npte-pt
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import {
  composeBoardExams,
  formatAreaDistribution,
  overlapStats,
  reuseStats,
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
import { naplex2025ComposeConfig, naplexComposerItem } from "../src/lib/exam-prep/compose/naplex-2025-plan";
import { STUDENT_ELIGIBLE_SQL } from "../src/lib/exam-prep/student-eligibility-sql";
import { isOutlineBoard, OUTLINE_BOARDS, runOutlineBoard } from "./compose-outline-board-exams";

const prisma = new PrismaClient();

const BOARD_IDS = ["nclex-rn", "naplex", ...OUTLINE_BOARDS] as const;
type BoardId = (typeof BOARD_IDS)[number];

type Args = { apply: boolean; restore: boolean; maxExams: number; board: BoardId; maxExamsSet: boolean };

function defaultMaxExams(board: BoardId): number {
  if (board === "naplex") return 24;
  if (board === "nclex-rn") return 43;
  // Do not publish more forms than the active rows these previews would replace.
  if (board === "usmle-step-2") return 117;
  if (board === "aanp-fnp" || board === "pance" || board === "npte-pt") return 100;
  return 200;
}

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = {
    apply: false,
    restore: false,
    maxExams: 43,
    board: "nclex-rn",
    maxExamsSet: false,
  };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--apply") parsed.apply = true;
    else if (arg === "--restore") parsed.restore = true;
    else if (arg === "--board" && args[i + 1]) {
      const board = args[++i]!;
      if (!BOARD_IDS.includes(board as BoardId)) {
        throw new Error(`--board must be one of ${BOARD_IDS.join(", ")}.`);
      }
      parsed.board = board as BoardId;
    } else if (arg === "--max-exams" && args[i + 1]) {
      parsed.maxExams = Number(args[++i]);
      parsed.maxExamsSet = true;
    }
  }
  if (!Number.isFinite(parsed.maxExams) || parsed.maxExams < 0) {
    throw new Error("--max-exams must be a non-negative number.");
  }
  if (!parsed.maxExamsSet) parsed.maxExams = defaultMaxExams(parsed.board);
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

type NaplexBankRow = {
  id: string;
  subjectId: string;
  blueprintDomain: string | null;
  itemType: string;
  scenario: string | null;
  question: string;
  correctAnswer: string;
};

async function runNaplex(args: Args) {
  if (args.restore) {
    await restoreNaplex(args.apply);
    return;
  }
  const config = naplex2025ComposeConfig(args.maxExams);
  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT id, "subjectId", "blueprintDomain", "itemType",
      left(COALESCE(scenario, ''), 800) AS scenario,
      left(question, 1200) AS question,
      left("correctAnswer", 240) AS "correctAnswer"
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      AND ${STUDENT_ELIGIBLE_SQL}
    `,
    "pharmacy"
  )) as NaplexBankRow[];

  const items = [];
  const itemTypeById = new Map<string, string>();
  const subjectById = new Map<string, string>();
  const areaById = new Map<string, string>();
  let unmapped = 0;
  let calculations = 0;
  const contentPool: Record<string, number> = {};
  for (const row of rows) {
    const item = naplexComposerItem({
      id: row.id,
      subjectId: row.subjectId,
      blueprintDomain: row.blueprintDomain,
      itemType: row.itemType,
      question: row.question,
      scenario: row.scenario,
      correctAnswer: row.correctAnswer,
      scenarioText: scenarioTextForCompose(row.scenario, row.question),
    });
    if (!item) {
      unmapped += 1;
      continue;
    }
    items.push(item);
    itemTypeById.set(row.id, row.itemType);
    subjectById.set(row.id, row.subjectId);
    areaById.set(row.id, item.areaId);
    contentPool[item.areaId] = (contentPool[item.areaId] ?? 0) + 1;
    if (item.signals?.includes("calculation")) calculations += 1;
  }

  const composed = composeBoardExams(items, config);
  console.log("\n## Pool math\n");
  console.log(`Eligible pharmacy items loaded: ${rows.length}`);
  console.log(`Unmapped subject or domain tags: ${unmapped}`);
  console.log(`Calculation items (content signal, not the area tag): ${calculations}`);
  console.log(`Honest area pool after content override: ${JSON.stringify(contentPool)}`);
  console.log(`Quota: ${JSON.stringify(composed.math.quota)}`);
  console.log(`Pool by area: ${JSON.stringify(composed.math.poolByArea)}`);
  console.log(
    `Max full exams by area (before near-duplicate blocking, reuse cap ${config.maxItemReuse}): ${JSON.stringify(composed.math.maxFullExamsByArea)}`
  );
  console.log(`Limiting area: ${composed.math.limitingArea ?? "none"}`);
  console.log(
    `Published full exams: ${composed.math.publishedFullExams} of ${composed.math.requestedFullExams} requested (${composed.math.fullExamLength} items).`
  );
  console.log(composed.math.stopReason);
  console.log(
    "Area 4 and area 5 counts use content signals (ethics, reporting, shortage, workflow), not the stored domain tag alone. Calculation items are a content signal inside foundational knowledge. Four calculations do not equal the 25% foundational-knowledge weight."
  );

  console.log("\n## Per-exam distribution\n");
  composed.exams.forEach((exam, index) => {
    const subjects: Record<string, number> = {};
    const formats: Record<string, number> = {};
    for (const id of exam.itemIds) {
      const subjectId = subjectById.get(id) ?? "unknown";
      subjects[subjectId] = (subjects[subjectId] ?? 0) + 1;
      const itemType = itemTypeById.get(id) ?? "unknown";
      formats[itemType] = (formats[itemType] ?? 0) + 1;
    }
    console.log(
      `\n${index + 1}. ${exam.title} n=${exam.itemIds.length} out of range: ${exam.areasOutOfRange.join(", ") || "none"} shortfall: ${exam.shortfall.join(", ") || "none"}`
    );
    for (const line of formatAreaDistribution(exam, config.areas)) console.log(`  ${line}`);
    console.log(`  content ${JSON.stringify(exam.signalCounts)}`);
    console.log(
      `  coverage cns=${subjects["cns-rx"] ?? 0} endocrine=${subjects["endocrine-rx"] ?? 0} id=${subjects["infectious-disease-rx"] ?? 0} pk=${subjects.pharmacokinetics ?? 0}`
    );
    console.log(`  formats ${JSON.stringify(formats)}`);
  });

  const overlap = composed.overlap;
  const reuse = reuseStats(composed.exams);
  console.log("\n## Overlap and reuse\n");
  console.log(`Exams: ${overlap.exams}`);
  console.log(`Identical pairs: ${overlap.identicalPairs}`);
  console.log(`Max shared items: ${overlap.maxSharedItems}`);
  console.log(`Mean shared items: ${overlap.meanSharedItems.toFixed(2)}`);
  console.log(`Max Jaccard: ${overlap.maxJaccard.toFixed(3)}`);
  console.log(`Mean Jaccard: ${overlap.meanJaccard.toFixed(3)}`);
  console.log(`Distinct items: ${reuse.distinctItems}`);
  console.log(`Max item reuse: ${reuse.maxReuse}`);
  console.log(`Items used more than once: ${reuse.reusedItems}`);
  console.log(`Slots filled by those items: ${reuse.slotsFromReusedItems}`);

  const existing = await prisma.naplexFullPracticeExam.findMany({
    select: { examNumber: true, active: true },
    orderBy: { examNumber: "asc" },
  });
  const activeNumbers = existing.filter((row) => row.active).map((row) => row.examNumber);
  const rowPlan = planBoardExamRows({
    existing,
    composedCount: composed.exams.filter((exam) => exam.kind === "full").length,
    publishNumbers: activeNumbers,
  });
  console.log("\n## Row plan\n");
  console.log(`Replace exam numbers: ${rowPlan.replace.join(", ") || "none"}`);
  console.log(`Create exam numbers: ${rowPlan.create.join(", ") || "none"}`);
  console.log(`Pause exam numbers (links kept): ${rowPlan.pause.join(", ") || "none"}`);
  console.log("blueprintSummary will be rewritten from the items actually placed. Inactive exams 1–9 stay inactive.");

  if (!args.apply) {
    console.log("\nNo rows written. Re-run with --apply after owner approval.");
    return;
  }

  const fullExams = composed.exams.filter((exam) => exam.kind === "full");
  const numbers = [...rowPlan.replace, ...rowPlan.create];
  const now = new Date().toISOString();
  for (let index = 0; index < fullExams.length; index++) {
    const examNumber = numbers[index];
    if (examNumber == null) break;
    await writeNaplexExam(examNumber, fullExams[index]!, itemTypeById, areaById, now);
  }
  for (const examNumber of rowPlan.pause) {
    await pauseNaplex(examNumber, now);
  }
  console.log("\nApply finished. Restore with --board naplex --apply --restore.");
}

async function writeNaplexExam(
  examNumber: number,
  exam: ComposedExam,
  itemTypeById: Map<string, string>,
  areaById: Map<string, string>,
  now: string
) {
  const existing = await prisma.naplexFullPracticeExam.findUnique({
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
        formatSummary: existing.formatSummary,
        links: existing.questions
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((link) => ({
            questionBankItemId: link.questionBankItemId,
            sortOrder: link.sortOrder,
            blueprintArea: link.blueprintArea,
            itemFormat: link.itemFormat,
          })),
      }
    : null;
  const formats: Record<string, number> = {};
  for (const id of exam.itemIds) {
    const itemType = itemTypeById.get(id) ?? "unknown";
    formats[itemType] = (formats[itemType] ?? 0) + 1;
  }
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
    blueprintSummary: {
      ...exam.areaCounts,
      content: exam.signalCounts,
      shortfall: exam.shortfall,
      meetsOutline: exam.shortfall.length === 0 && exam.areasOutOfRange.length === 0,
    },
    formatSummary: formats,
    generationVersion: BOARD_COMPOSER_PIPELINE,
    qaReport,
  };
  const saved = existing
    ? await prisma.naplexFullPracticeExam.update({ where: { id: existing.id }, data })
    : await prisma.naplexFullPracticeExam.create({ data: { examNumber, ...data } });
  await prisma.$transaction([
    prisma.naplexFullPracticeExamQuestion.deleteMany({ where: { examId: saved.id } }),
    prisma.naplexFullPracticeExamQuestion.createMany({
      data: exam.itemIds.map((questionBankItemId, sortOrder) => ({
        examId: saved.id,
        questionBankItemId,
        sortOrder,
        blueprintArea: areaById.get(questionBankItemId) ?? null,
        itemFormat: itemTypeById.get(questionBankItemId) ?? null,
      })),
    }),
  ]);
  console.log(`wrote exam ${examNumber} ${exam.title} (${exam.itemIds.length})`);
}

async function pauseNaplex(examNumber: number, now: string) {
  const existing = await prisma.naplexFullPracticeExam.findUnique({
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
      formatSummary: existing.formatSummary,
      links: existing.questions.map((link) => ({
        questionBankItemId: link.questionBankItemId,
        sortOrder: link.sortOrder,
        blueprintArea: link.blueprintArea,
        itemFormat: link.itemFormat,
      })),
    },
  });
  await prisma.naplexFullPracticeExam.update({
    where: { id: existing.id },
    data: { active: false, qaReport },
  });
  console.log(`paused exam ${examNumber} (links kept)`);
}

async function restoreNaplex(apply: boolean) {
  const rows = await prisma.naplexFullPracticeExam.findMany();
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
      await prisma.naplexFullPracticeExam.update({ where: { id: row.id }, data: { active: false } });
      continue;
    }
    const links = Array.isArray(previous.links)
      ? (previous.links as Array<{
          questionBankItemId: string;
          sortOrder: number;
          blueprintArea: string | null;
          itemFormat: string | null;
        }>)
      : null;
    await prisma.naplexFullPracticeExam.update({
      where: { id: row.id },
      data: {
        title: typeof previous.title === "string" ? previous.title : row.title,
        questionCount: typeof previous.questionCount === "number" ? previous.questionCount : row.questionCount,
        active: previous.active !== false,
        qaPassed: typeof previous.qaPassed === "boolean" ? previous.qaPassed : row.qaPassed,
        blueprintSummary: (previous.blueprintSummary ?? Prisma.JsonNull) as Prisma.InputJsonValue,
        formatSummary: (previous.formatSummary ?? Prisma.JsonNull) as Prisma.InputJsonValue,
      },
    });
    if (block.kind === "replace" && links) {
      await prisma.$transaction([
        prisma.naplexFullPracticeExamQuestion.deleteMany({ where: { examId: row.id } }),
        prisma.naplexFullPracticeExamQuestion.createMany({
          data: links.map((link) => ({
            examId: row.id,
            questionBankItemId: link.questionBankItemId,
            sortOrder: link.sortOrder,
            blueprintArea: link.blueprintArea,
            itemFormat: link.itemFormat,
          })),
        }),
      ]);
    }
  }
  console.log(`Restore ${apply ? "applied" : "planned"}: ${planned}`);
  if (!apply) console.log("No rows written.");
}

async function main() {
  const args = parseArgs();
  const mode = args.apply ? "APPLY" : "DRY-RUN";
  console.log(`compose-board-practice-exams ${mode} board=${args.board}`);
  console.log("Sessions are not modified. Stored item text is not modified.");

  if (args.board === "naplex") {
    await runNaplex(args);
    return;
  }

  if (isOutlineBoard(args.board)) {
    await runOutlineBoard(prisma, {
      apply: args.apply,
      restore: args.restore,
      maxExams: args.maxExams,
      board: args.board,
    });
    return;
  }

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

  const fullExams = composed.exams.filter(
    (exam) =>
      exam.kind === "full" &&
      exam.itemIds.length === config.fullExamLength &&
      exam.areasOutOfRange.length === 0
  );
  console.log(`On-plan full exams to publish: ${fullExams.length}`);
  if (composed.math.publishedSubjectSets > 0) {
    console.log(
      `Subject sets left unpublished: ${composed.math.publishedSubjectSets}. Fixed forms stay at ${config.fullExamLength} items.`
    );
  }

  console.log("\n## Per-exam area distribution\n");
  fullExams.forEach((exam, index) => {
    console.log(`\n${index + 1}. ${exam.title} [${exam.kind}] n=${exam.itemIds.length} out of range: ${exam.areasOutOfRange.length}`);
    for (const line of formatAreaDistribution(exam, config.areas)) console.log(`  ${line}`);
  });

  const overlap = overlapStats(fullExams);
  console.log("\n## Overlap\n");
  console.log(`Exams: ${overlap.exams}`);
  console.log(`Identical pairs: ${overlap.identicalPairs}`);
  console.log(`Max shared items: ${overlap.maxSharedItems}`);
  console.log(`Mean shared items: ${overlap.meanSharedItems.toFixed(2)}`);
  console.log(`Max Jaccard: ${overlap.maxJaccard.toFixed(3)}`);
  console.log(`Mean Jaccard: ${overlap.meanJaccard.toFixed(3)}`);
  const reuse = reuseStats(fullExams);
  console.log(`Distinct items: ${reuse.distinctItems}`);
  console.log(`Max item reuse: ${reuse.maxReuse}`);
  console.log(`Items used more than once: ${reuse.reusedItems}`);
  console.log(`Slots filled by those items: ${reuse.slotsFromReusedItems}`);

  const existing = await prisma.nclexFullPracticeExam.findMany({
    select: { examNumber: true, active: true },
    orderBy: { examNumber: "asc" },
  });
  const rowPlan = planBoardExamRows({ existing, composedCount: fullExams.length });
  console.log("\n## Row plan\n");
  console.log(`Replace exam numbers: ${rowPlan.replace.join(", ") || "none"}`);
  console.log(`Create exam numbers: ${rowPlan.create.join(", ") || "none"}`);
  console.log(`Pause exam numbers (links kept): ${rowPlan.pause.join(", ") || "none"}`);

  if (!args.apply) {
    console.log("\nNo rows written. Re-run with --apply after owner approval.");
    return;
  }

  const now = new Date().toISOString();
  const numbers = [...rowPlan.replace, ...rowPlan.create];
  for (let index = 0; index < fullExams.length; index++) {
    const examNumber = numbers[index];
    if (examNumber == null) break;
    await writeExam(examNumber, fullExams[index]!, areaById, now);
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
