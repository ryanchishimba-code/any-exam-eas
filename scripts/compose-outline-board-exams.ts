/**
 * Dry-run (and, after a later approval, apply) for USMLE, AANP, PANCE, and NPTE.
 * Sessions are not read or written. Item text is not edited.
 * This module is invoked from compose-board-practice-exams.ts.
 */
import { Prisma, type PrismaClient } from "@prisma/client";
import {
  composeBoardExams,
  formatAreaDistribution,
  overlapStats,
  reuseStats,
  type BoardComposeConfig,
  type ComposedExam,
  type ComposerItem,
  type TestPlanArea,
} from "../src/lib/exam-prep/compose/board-exam-composer";
import {
  BOARD_COMPOSER_PIPELINE,
  planBoardExamRows,
  type ExamRowWritePlan,
} from "../src/lib/exam-prep/compose/board-exam-row-plan";
import { scenarioTextForCompose } from "../src/lib/exam-prep/compose/nclex-rn-2026-plan";
import {
  aanpAgeGroupId,
  aanpDomainId,
  aanpFnpComposeConfig,
  AANP_FNP_COMPOSE_SOURCE,
} from "../src/lib/exam-prep/compose/aanp-fnp-2024-plan";
import {
  npteBodySystemId,
  nptePtComposeConfig,
  npteTaskId,
  NPTE_PT_COMPOSE_SOURCE,
  NPTE_PT_TASK_WEIGHT_SUM,
} from "../src/lib/exam-prep/compose/npte-pt-2026-plan";
import { NPTE_PT_TASK_AREAS } from "../src/lib/exam-prep/npte-pt/content-outline";
import {
  panceComposeConfig,
  panceContentId,
  panceTaskId,
  PANCE_COMPOSE_SOURCE,
} from "../src/lib/exam-prep/compose/pance-2025-plan";
import {
  usmleBlockComposeConfig,
  usmleDisciplineId,
  usmleDisciplineRanges,
  usmleOrganSystemId,
  usmlePhysicianTaskId,
  USMLE_COMPOSE_SOURCE,
} from "../src/lib/exam-prep/compose/usmle-block-plan";
import { USMLE_PHYSICIAN_TASKS } from "../src/lib/exam-prep/usmle/official-content-model";
import type { UsmleStepLevel } from "../src/lib/exam-prep/usmle/types";
import { STUDENT_ELIGIBLE_SQL } from "../src/lib/exam-prep/student-eligibility-sql";

/** Matches parsePresetExamNumber in the full-exam start route. */
const LAUNCHER_CAP = 100_000;

export const OUTLINE_BOARDS = [
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "aanp-fnp",
  "pance",
  "npte-pt",
] as const;

export type OutlineBoardId = (typeof OUTLINE_BOARDS)[number];

export function isOutlineBoard(board: string): board is OutlineBoardId {
  return (OUTLINE_BOARDS as readonly string[]).includes(board);
}

type BankRow = {
  id: string;
  subjectId: string;
  blueprintDomain: string | null;
  taskCategory: string | null;
  patientAgeGroup: string | null;
  stepLevel: string | null;
  itemType: string;
  scenario: string | null;
  question: string;
  correctAnswer: string;
};

function bump(bag: Record<string, number>, key: string) {
  const label = key.trim() || "(blank)";
  bag[label] = (bag[label] ?? 0) + 1;
}

function topTags(bag: Record<string, number>, limit = 12): string {
  const rows = Object.entries(bag).sort((a, b) => b[1] - a[1] || a[0].localeCompare(b[0]));
  const shown = rows.slice(0, limit).map(([tag, count]) => `${tag} ${count}`);
  const rest = rows.slice(limit).reduce((sum, [, count]) => sum + count, 0);
  if (rest > 0) shown.push(`other tags ${rest}`);
  return shown.join(", ") || "none";
}

function listNumbers(numbers: number[]): string {
  if (numbers.length === 0) return "none";
  return `${numbers.length}: ${numbers.join(", ")}`;
}

function quotaExam(quota: Record<string, number>, length: number): ComposedExam {
  return {
    kind: "full",
    title: "quota",
    itemIds: Array.from({ length }, (_, index) => String(index)),
    areaCounts: quota,
    areasOutOfRange: [],
    secondaryCounts: {},
    secondaryOutOfRange: [],
    shortfall: [],
    signalCounts: {},
  };
}

function printQuota(title: string, quota: Record<string, number> | null, areas: readonly TestPlanArea[], length: number) {
  console.log(`\n${title}`);
  if (!quota) {
    console.log("No integer quota. The percent bands cannot fill this length.");
    return;
  }
  for (const line of formatAreaDistribution(quotaExam(quota, length), areas)) console.log(`  ${line}`);
}

function thinCategories(
  quota: Record<string, number> | null,
  pool: Record<string, number>
): string[] {
  if (!quota) return [];
  return Object.entries(quota)
    .filter(([id, need]) => need > 0 && (pool[id] ?? 0) < need)
    .map(([id, need]) => `${id} pool ${pool[id] ?? 0} < quota ${need}`);
}

type ScopeRow = { examNumber: number; active: boolean; stepLevel?: string };

async function loadScope(
  prisma: PrismaClient,
  board: OutlineBoardId,
  step: UsmleStepLevel | null
): Promise<{ existing: ScopeRow[]; reserved: number[] }> {
  if (step) {
    const rows = await prisma.usmleFullPracticeExam.findMany({
      select: { examNumber: true, active: true, stepLevel: true },
      orderBy: { examNumber: "asc" },
    });
    return {
      existing: rows.filter((row) => row.stepLevel === step),
      reserved: rows.filter((row) => row.stepLevel !== step).map((row) => row.examNumber),
    };
  }
  const rows =
    board === "aanp-fnp"
      ? await prisma.aanpFnpFullPracticeExam.findMany({
          select: { examNumber: true, active: true },
          orderBy: { examNumber: "asc" },
        })
      : board === "pance"
        ? await prisma.panceFullPracticeExam.findMany({
            select: { examNumber: true, active: true },
            orderBy: { examNumber: "asc" },
          })
        : await prisma.nptePtFullPracticeExam.findMany({
            select: { examNumber: true, active: true },
            orderBy: { examNumber: "asc" },
          });
  return { existing: rows, reserved: [] };
}

function boardConfig(board: OutlineBoardId, maxExams: number): BoardComposeConfig {
  if (board === "usmle-step-1") return usmleBlockComposeConfig("step1", maxExams);
  if (board === "usmle-step-2") return usmleBlockComposeConfig("step2", maxExams);
  if (board === "usmle-step-3") return usmleBlockComposeConfig("step3", maxExams);
  if (board === "aanp-fnp") return aanpFnpComposeConfig(maxExams);
  if (board === "pance") return panceComposeConfig(maxExams);
  return nptePtComposeConfig(maxExams);
}

function sourceFor(board: OutlineBoardId): string {
  if (board.startsWith("usmle")) return USMLE_COMPOSE_SOURCE;
  if (board === "aanp-fnp") return AANP_FNP_COMPOSE_SOURCE;
  if (board === "pance") return PANCE_COMPOSE_SOURCE;
  return NPTE_PT_COMPOSE_SOURCE;
}

function stepFor(board: OutlineBoardId): UsmleStepLevel | null {
  if (board === "usmle-step-1") return "step1";
  if (board === "usmle-step-2") return "step2";
  if (board === "usmle-step-3") return "step3";
  return null;
}

export async function runOutlineBoard(
  prisma: PrismaClient,
  args: { apply: boolean; restore: boolean; maxExams: number; board: OutlineBoardId }
) {
  if (args.restore) {
    await restoreOutline(prisma, args.board, args.apply);
    return;
  }
  const step = stepFor(args.board);
  const config = boardConfig(args.board, args.maxExams);
  console.log(`Source: ${sourceFor(args.board)}`);
  console.log(
    `Form length ${config.fullExamLength}. Full-exam simulation length is not changed by this composer.`
  );
  if (args.board === "aanp-fnp") {
    console.log(
      "Length tradeoff: the exam is 150 items with 15 unscored pretest items. The bank has no pretest flag, so the form is the 135 scored items. That is also the simulation length, which stays 135."
    );
  }
  if (args.board === "npte-pt") {
    console.log(
      `Length tradeoff: NPTE sections are 50 items and the full exam is 250. These forms are one section so the pool can fill the outline with items used once. Process tasks sum to ${NPTE_PT_TASK_WEIGHT_SUM} and are not a fill quota.`
    );
  }
  if (args.board.startsWith("usmle")) {
    console.log(
      "Length tradeoff: 40 is one block (Step 1 up to 40, Step 2 CK about 40, Step 3 about 38–40). Forty fits the published organ-system percent ranges. The full simulation stays 280 / 280 / 200."
    );
  }
  if (args.board === "pance") {
    console.log("Length is one 60-item PANCE block. The 300-item simulation stays unchanged.");
  }

  const rows = (await prisma.$queryRawUnsafe(
    `
    SELECT id, "subjectId", "blueprintDomain", "taskCategory", "patientAgeGroup", "stepLevel", "itemType",
      left(COALESCE(scenario, ''), 800) AS scenario,
      left(question, 800) AS question,
      left("correctAnswer", 240) AS "correctAnswer"
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      AND ${STUDENT_ELIGIBLE_SQL}
    `,
    args.board
  )) as BankRow[];

  const primaryUnmapped: Record<string, number> = {};
  const secondaryUnmapped: Record<string, number> = {};
  const disciplinePool: Record<string, number> = {};
  const disciplineUnmapped: Record<string, number> = {};
  const taskPool: Record<string, number> = {};
  const taskUnmapped: Record<string, number> = {};
  let otherStep = 0;
  let nullStep = 0;
  const items: ComposerItem[] = [];
  const disciplineById = new Map<string, string | null>();
  const taskById = new Map<string, string | null>();
  const rawTaskById = new Map<string, string | null>();
  const itemTypeById = new Map<string, string>();
  const areaById = new Map<string, string>();

  for (const row of rows) {
    if (step && row.stepLevel && row.stepLevel !== step) {
      otherStep += 1;
      continue;
    }
    if (step && !row.stepLevel) nullStep += 1;
    const scenarioText = scenarioTextForCompose(row.scenario, row.question);
    const disciplineId = step ? usmleDisciplineId(step, row.subjectId) : null;
    const taskId = step
      ? usmlePhysicianTaskId(row.taskCategory)
      : args.board === "npte-pt"
        ? npteTaskId(row.taskCategory)
        : args.board === "pance"
          ? panceTaskId(row.taskCategory)
          : null;
    if (step || args.board === "npte-pt" || args.board === "pance") {
      if (taskId) bump(taskPool, taskId);
      else bump(taskUnmapped, row.taskCategory ?? "");
    }
    if (step && step !== "step3") {
      if (disciplineId) bump(disciplinePool, disciplineId);
      else bump(disciplineUnmapped, row.subjectId ?? "");
    }

    let areaId: string | null = null;
    let secondaryId: string | null = null;
    if (step) {
      areaId = usmleOrganSystemId(row.blueprintDomain);
      if (!areaId) bump(primaryUnmapped, row.blueprintDomain ?? "");
    } else if (args.board === "aanp-fnp") {
      areaId = aanpDomainId(row.blueprintDomain);
      secondaryId = aanpAgeGroupId(row.patientAgeGroup);
      if (!areaId) bump(primaryUnmapped, row.blueprintDomain ?? "");
      if (areaId && !secondaryId) bump(secondaryUnmapped, row.patientAgeGroup ?? "");
    } else if (args.board === "pance") {
      areaId = panceContentId(row.blueprintDomain);
      secondaryId = panceTaskId(row.taskCategory);
      if (!areaId) bump(primaryUnmapped, row.blueprintDomain ?? "");
      if (areaId && !secondaryId) bump(secondaryUnmapped, row.taskCategory ?? "");
    } else {
      areaId = npteBodySystemId(row.blueprintDomain);
      if (!areaId) bump(primaryUnmapped, row.blueprintDomain ?? "");
    }
    if (!areaId) continue;
    if (config.secondaryAreas && !secondaryId) continue;

    items.push({
      id: row.id,
      areaId,
      secondaryId: secondaryId ?? undefined,
      subjectId: row.subjectId,
      scenarioText,
      answerKey: row.correctAnswer,
    });
    disciplineById.set(row.id, disciplineId);
    taskById.set(row.id, taskId);
    rawTaskById.set(row.id, row.taskCategory);
    itemTypeById.set(row.id, row.itemType);
    areaById.set(row.id, areaId);
  }

  const composed = composeBoardExams(items, config);
  const onPlan = composed.exams.filter(
    (exam) =>
      exam.kind === "full" &&
      exam.itemIds.length === config.fullExamLength &&
      exam.areasOutOfRange.length === 0 &&
      exam.secondaryOutOfRange.length === 0
  );

  console.log("\n## Pool\n");
  console.log(`Eligible rows on ${args.board}: ${rows.length}`);
  if (step) {
    console.log(`Excluded because stepLevel is a different step: ${otherStep}`);
    console.log(`Included with a blank stepLevel (field is this step's bank): ${nullStep}`);
  }
  console.log(`Mapped items passed to the composer: ${items.length}`);
  console.log(
    `Unmapped primary tags: ${Object.values(primaryUnmapped).reduce((sum, count) => sum + count, 0)} (${topTags(primaryUnmapped)})`
  );
  if (config.secondaryAreas) {
    console.log(
      `Unmapped secondary tags: ${Object.values(secondaryUnmapped).reduce((sum, count) => sum + count, 0)} (${topTags(secondaryUnmapped)})`
    );
  }
  console.log(`Composer primary unmapped: ${composed.math.unmappedItems}`);
  console.log(`Composer secondary unmapped: ${composed.math.secondaryUnmappedItems}`);

  printQuota("## Primary quota", composed.math.quota, config.areas, config.fullExamLength);
  console.log(`Pool by category: ${JSON.stringify(composed.math.poolByArea)}`);
  console.log(`Max forms by category before near-duplicate checks: ${JSON.stringify(composed.math.maxFullExamsByArea)}`);
  console.log(`Limiting category: ${composed.math.limitingArea ?? "none"}`);
  const primaryGaps = thinCategories(composed.math.quota, composed.math.poolByArea);
  console.log(`Blueprint gaps (pool thinner than one form): ${primaryGaps.join("; ") || "none"}`);

  if (config.secondaryAreas) {
    printQuota("## Secondary quota", composed.math.secondaryQuota, config.secondaryAreas, config.fullExamLength);
    console.log(`Secondary pool: ${JSON.stringify(composed.math.secondaryPool)}`);
    console.log(
      `Max forms by secondary category: ${JSON.stringify(composed.math.secondaryMaxFullExamsByArea)}`
    );
    console.log(`Secondary limiting category: ${composed.math.secondaryLimitingArea ?? "none"}`);
    const secondaryGaps = thinCategories(composed.math.secondaryQuota, composed.math.secondaryPool);
    console.log(`Secondary blueprint gaps: ${secondaryGaps.join("; ") || "none"}`);
  }

  if (step && step !== "step3") {
    const ranges = usmleDisciplineRanges(step);
    console.log(
      "\n## Discipline report\nDiscipline ranges are integrative and sum past 100%, so they are not exclusive quotas. Shares below use the in-scope eligible pool as the denominator. Outside means the pool is not inside the published range. Forms are not rejected for this."
    );
    if (ranges) {
      const total = rows.length - otherStep;
      for (const [id, range] of Object.entries(ranges)) {
        const count = disciplinePool[id] ?? 0;
        const pct = total === 0 ? 0 : (count / total) * 100;
        const inside = pct + 1e-6 >= range.minPct && pct - 1e-6 <= range.maxPct;
        console.log(
          `  ${id} ${count}/${total} ${pct.toFixed(1)}% [${range.minPct}-${range.maxPct}] ${inside ? "in range" : "outside"}`
        );
      }
    }
    console.log(
      `Unmapped discipline tags: ${Object.values(disciplineUnmapped).reduce((sum, count) => sum + count, 0)} (${topTags(disciplineUnmapped)})`
    );
  }
  if (step === "step3") {
    console.log(
      "\n## Discipline report\nThe Step 3 content outline does not publish a discipline table. Physician-task minimums sum above 100%, so tasks are not exclusive quotas."
    );
  }
  if (step) {
    console.log(`\n## Physician-task report\nMapped tasks: ${topTags(taskPool, 20)}`);
    console.log(
      `Unmapped task tags: ${Object.values(taskUnmapped).reduce((sum, count) => sum + count, 0)} (${topTags(taskUnmapped)})`
    );
    const taskRanges = USMLE_PHYSICIAN_TASKS.flatMap((task) => {
      const range = task.ranges[step];
      return range ? [{ id: task.id, ...range }] : [];
    });
    const taskTotal = Object.values(taskPool).reduce((sum, count) => sum + count, 0);
    for (const range of taskRanges) {
      const count = taskPool[range.id] ?? 0;
      const pct = taskTotal === 0 ? 0 : (count / taskTotal) * 100;
      console.log(`  tagged ${range.id} ${count} is ${pct.toFixed(1)}% of mapped tasks, published ${range.minPct}-${range.maxPct}% of a form`);
    }
  }
  if (args.board === "npte-pt") {
    console.log("\n## Process-task report\nNot a fill quota.");
    for (const task of NPTE_PT_TASK_AREAS) {
      console.log(`  ${task.id} pool ${taskPool[task.id] ?? 0} published weight ${task.weightLabel}`);
    }
    console.log(
      `Unmapped task tags: ${Object.values(taskUnmapped).reduce((sum, count) => sum + count, 0)} (${topTags(taskUnmapped)})`
    );
  }

  console.log("\n## Forms\n");
  console.log(composed.math.stopReason);
  console.log(`On-plan forms: ${onPlan.length} of length ${config.fullExamLength}`);
  if (onPlan[0]) {
    console.log(`Sample ${onPlan[0].title}`);
    for (const line of formatAreaDistribution(onPlan[0], config.areas)) console.log(`  ${line}`);
    if (config.secondaryAreas) {
      for (const line of formatAreaDistribution(
        { ...onPlan[0], areaCounts: onPlan[0].secondaryCounts },
        config.secondaryAreas
      )) {
        console.log(`  secondary ${line}`);
      }
    }
  }
  const overlap = overlapStats(onPlan);
  const reuse = reuseStats(onPlan);
  console.log("\n## Overlap and reuse\n");
  console.log(`Distinct items: ${reuse.distinctItems}`);
  console.log(`Max item reuse: ${reuse.maxReuse}`);
  console.log(`Max shared items: ${overlap.maxSharedItems}`);
  console.log(`Mean shared items: ${overlap.meanSharedItems.toFixed(2)}`);
  console.log(`Identical pairs: ${overlap.identicalPairs}`);

  const scope = await loadScope(prisma, args.board, step);
  const activeNumbers = scope.existing
    .filter((row) => row.active)
    .map((row) => row.examNumber)
    .sort((a, b) => a - b);
  const rowPlan = planBoardExamRows({
    existing: scope.existing,
    composedCount: onPlan.length,
    maxExamNumber: LAUNCHER_CAP,
    publishNumbers: activeNumbers,
    reservedNumbers: scope.reserved,
  });
  console.log("\n## Row plan\n");
  console.log(`Replace ${listNumbers(rowPlan.replace)}`);
  console.log(`Create ${listNumbers(rowPlan.create)}`);
  console.log(`Pause ${listNumbers(rowPlan.pause)} (links kept)`);
  console.log("In-progress sessions are not modified.");
  console.log("Blueprint gaps stay in this admin log. Student titles do not mention them.");

  if (step && step !== "step3" && onPlan[0]) {
    const ranges = usmleDisciplineRanges(step);
    if (ranges) {
      console.log("Sample form discipline mix (not a fill quota):");
      const counts: Record<string, number> = {};
      let unmappedOnForm = 0;
      for (const id of onPlan[0].itemIds) {
        const discipline = disciplineById.get(id);
        if (!discipline) unmappedOnForm += 1;
        else counts[discipline] = (counts[discipline] ?? 0) + 1;
      }
      for (const [id, range] of Object.entries(ranges)) {
        const count = counts[id] ?? 0;
        const pct = (count / config.fullExamLength) * 100;
        const inside = pct + 1e-6 >= range.minPct && pct - 1e-6 <= range.maxPct;
        console.log(`  ${id} ${count} ${pct.toFixed(1)}% [${range.minPct}-${range.maxPct}] ${inside ? "in range" : "outside"}`);
      }
      console.log(`  unmapped discipline tags on the sample form: ${unmappedOnForm}`);
    }
  }
  if (onPlan[0] && (step || args.board === "npte-pt" || args.board === "pance")) {
    const taskCounts: Record<string, number> = {};
    let unmappedTasks = 0;
    for (const id of onPlan[0].itemIds) {
      const task = taskById.get(id);
      if (!task) unmappedTasks += 1;
      else taskCounts[task] = (taskCounts[task] ?? 0) + 1;
    }
    console.log(`Sample form task mix: ${JSON.stringify(taskCounts)} unmapped ${unmappedTasks}`);
  }

  if (!args.apply) {
    console.log("\nNo rows written. Re-run with --apply after owner approval.");
    return;
  }

  await applyOutline(prisma, args.board, step, onPlan, rowPlan, areaById, itemTypeById, rawTaskById);
}

function mergeArchive(existing: Prisma.JsonValue | null, next: Record<string, unknown>): Prisma.InputJsonValue {
  const base =
    existing && typeof existing === "object" && !Array.isArray(existing)
      ? { ...(existing as Record<string, unknown>) }
      : {};
  const prior =
    base.boardExamComposer && typeof base.boardExamComposer === "object"
      ? (base.boardExamComposer as Record<string, unknown>)
      : {};
  if (prior.pipeline === BOARD_COMPOSER_PIPELINE && prior.previous) {
    return { ...base, boardExamComposer: { ...prior, reappliedAt: next.appliedAt } } as Prisma.InputJsonValue;
  }
  return { ...base, boardExamComposer: next } as Prisma.InputJsonValue;
}

async function applyOutline(
  prisma: PrismaClient,
  board: OutlineBoardId,
  step: UsmleStepLevel | null,
  exams: ComposedExam[],
  rowPlan: ExamRowWritePlan,
  areaById: Map<string, string>,
  itemTypeById: Map<string, string>,
  rawTaskById: Map<string, string | null>
) {
  const numbers = [...rowPlan.replace, ...rowPlan.create];
  const now = new Date().toISOString();
  for (let index = 0; index < exams.length; index++) {
    const examNumber = numbers[index];
    const exam = exams[index];
    if (examNumber == null || !exam) break;
    await writeOne(prisma, board, step, examNumber, exam, areaById, itemTypeById, rawTaskById, now);
  }
  for (const examNumber of rowPlan.pause) {
    await pauseOne(prisma, board, examNumber, now);
  }
  console.log(`\nApply finished for ${board}. Restore with --board ${board} --apply --restore.`);
}

async function writeOne(
  prisma: PrismaClient,
  board: OutlineBoardId,
  step: UsmleStepLevel | null,
  examNumber: number,
  exam: ComposedExam,
  areaById: Map<string, string>,
  itemTypeById: Map<string, string>,
  rawTaskById: Map<string, string | null>,
  now: string
) {
  const summary = {
    areas: exam.areaCounts,
    secondary: exam.secondaryCounts,
    meetsOutline: exam.areasOutOfRange.length === 0 && exam.secondaryOutOfRange.length === 0,
  };
  if (step) {
    await writeUsmle(prisma, step, examNumber, exam, summary, areaById, itemTypeById, rawTaskById, now);
    return;
  }
  if (board === "aanp-fnp") {
    await writeSimple(prisma, "aanp", examNumber, exam, summary, now);
    await rewriteAanpLinks(prisma, examNumber, exam, areaById);
    return;
  }
  if (board === "pance") {
    await writeSimple(prisma, "pance", examNumber, exam, summary, now);
    await rewritePanceLinks(prisma, examNumber, exam, areaById);
    return;
  }
  await writeSimple(prisma, "npte", examNumber, exam, summary, now);
  await rewriteNpteLinks(prisma, examNumber, exam, areaById, rawTaskById);
}

async function writeUsmle(
  prisma: PrismaClient,
  step: UsmleStepLevel,
  examNumber: number,
  exam: ComposedExam,
  summary: Prisma.InputJsonValue,
  areaById: Map<string, string>,
  itemTypeById: Map<string, string>,
  rawTaskById: Map<string, string | null>,
  now: string
) {
  const existing = await prisma.usmleFullPracticeExam.findUnique({
    where: { examNumber },
    include: { questions: true },
  });
  const previous = existing
    ? {
        title: existing.title,
        questionCount: existing.questionCount,
        active: existing.active,
        qaPassed: existing.qaPassed,
        stepLevel: existing.stepLevel,
        blueprintSummary: existing.blueprintSummary,
        links: existing.questions
          .slice()
          .sort((a, b) => a.sortOrder - b.sortOrder)
          .map((link) => ({
            questionBankItemId: link.questionBankItemId,
            sortOrder: link.sortOrder,
            blueprintSystem: link.blueprintSystem,
            physicianTask: link.physicianTask,
            itemFormat: link.itemFormat,
          })),
      }
    : null;
  const data = {
    title: exam.title,
    stepLevel: step,
    questionCount: exam.itemIds.length,
    active: true,
    qaPassed: true,
    blueprintSummary: summary,
    generationVersion: BOARD_COMPOSER_PIPELINE,
    qaReport: mergeArchive(existing?.qaReport ?? null, {
      pipeline: BOARD_COMPOSER_PIPELINE,
      appliedAt: now,
      kind: existing ? "replace" : "create",
      previous,
    }),
  };
  const saved = existing
    ? await prisma.usmleFullPracticeExam.update({ where: { id: existing.id }, data })
    : await prisma.usmleFullPracticeExam.create({ data: { examNumber, ...data } });
  await prisma.$transaction([
    prisma.usmleFullPracticeExamQuestion.deleteMany({ where: { examId: saved.id } }),
    prisma.usmleFullPracticeExamQuestion.createMany({
      data: exam.itemIds.map((questionBankItemId, sortOrder) => ({
        examId: saved.id,
        questionBankItemId,
        sortOrder,
        blueprintSystem: areaById.get(questionBankItemId) ?? null,
        physicianTask: rawTaskById.get(questionBankItemId) ?? null,
        itemFormat: itemTypeById.get(questionBankItemId) ?? null,
      })),
    }),
  ]);
  console.log(`wrote exam ${examNumber} ${exam.title} (${exam.itemIds.length})`);
}

async function rewriteAanpLinks(
  prisma: PrismaClient,
  examNumber: number,
  exam: ComposedExam,
  areaById: Map<string, string>
) {
  const saved = await prisma.aanpFnpFullPracticeExam.findUnique({ where: { examNumber } });
  if (!saved) return;
  await prisma.$transaction([
    prisma.aanpFnpFullPracticeExamQuestion.deleteMany({ where: { examId: saved.id } }),
    prisma.aanpFnpFullPracticeExamQuestion.createMany({
      data: exam.itemIds.map((questionBankItemId, sortOrder) => ({
        examId: saved.id,
        questionBankItemId,
        sortOrder,
        blueprintDomain: areaById.get(questionBankItemId) ?? null,
      })),
    }),
  ]);
}

async function rewritePanceLinks(
  prisma: PrismaClient,
  examNumber: number,
  exam: ComposedExam,
  areaById: Map<string, string>
) {
  const saved = await prisma.panceFullPracticeExam.findUnique({ where: { examNumber } });
  if (!saved) return;
  await prisma.$transaction([
    prisma.panceFullPracticeExamQuestion.deleteMany({ where: { examId: saved.id } }),
    prisma.panceFullPracticeExamQuestion.createMany({
      data: exam.itemIds.map((questionBankItemId, sortOrder) => ({
        examId: saved.id,
        questionBankItemId,
        sortOrder,
        contentCategory: areaById.get(questionBankItemId) ?? null,
      })),
    }),
  ]);
}

async function rewriteNpteLinks(
  prisma: PrismaClient,
  examNumber: number,
  exam: ComposedExam,
  areaById: Map<string, string>,
  rawTaskById: Map<string, string | null>
) {
  const saved = await prisma.nptePtFullPracticeExam.findUnique({ where: { examNumber } });
  if (!saved) return;
  await prisma.$transaction([
    prisma.nptePtFullPracticeExamQuestion.deleteMany({ where: { examId: saved.id } }),
    prisma.nptePtFullPracticeExamQuestion.createMany({
      data: exam.itemIds.map((questionBankItemId, sortOrder) => ({
        examId: saved.id,
        questionBankItemId,
        sortOrder,
        contentCategory: areaById.get(questionBankItemId) ?? null,
        taskCategory: rawTaskById.get(questionBankItemId) ?? null,
      })),
    }),
  ]);
}

type SimpleKind = "aanp" | "pance" | "npte";

function examWriteData(
  exam: ComposedExam,
  summary: Prisma.InputJsonValue,
  now: string,
  existing: {
    title: string;
    questionCount: number;
    active: boolean;
    qaPassed: boolean;
    blueprintSummary: Prisma.JsonValue | null;
    qaReport: Prisma.JsonValue | null;
  } | null,
  links: unknown[]
) {
  const previous = existing
    ? {
        title: existing.title,
        questionCount: existing.questionCount,
        active: existing.active,
        qaPassed: existing.qaPassed,
        blueprintSummary: existing.blueprintSummary,
        links,
      }
    : null;
  return {
    title: exam.title,
    questionCount: exam.itemIds.length,
    active: true,
    qaPassed: true,
    blueprintSummary: summary,
    generationVersion: BOARD_COMPOSER_PIPELINE,
    qaReport: mergeArchive(existing?.qaReport ?? null, {
      pipeline: BOARD_COMPOSER_PIPELINE,
      appliedAt: now,
      kind: existing ? "replace" : "create",
      previous,
    }),
  };
}

async function writeSimple(
  prisma: PrismaClient,
  kind: SimpleKind,
  examNumber: number,
  exam: ComposedExam,
  summary: Prisma.InputJsonValue,
  now: string
) {
  if (kind === "aanp") {
    const existing = await prisma.aanpFnpFullPracticeExam.findUnique({ where: { examNumber } });
    const links = existing ? await snapshotSimpleLinks(prisma, kind, existing.id) : [];
    const data = examWriteData(exam, summary, now, existing, links);
    if (existing) await prisma.aanpFnpFullPracticeExam.update({ where: { id: existing.id }, data });
    else await prisma.aanpFnpFullPracticeExam.create({ data: { examNumber, ...data } });
  } else if (kind === "pance") {
    const existing = await prisma.panceFullPracticeExam.findUnique({ where: { examNumber } });
    const links = existing ? await snapshotSimpleLinks(prisma, kind, existing.id) : [];
    const data = examWriteData(exam, summary, now, existing, links);
    if (existing) await prisma.panceFullPracticeExam.update({ where: { id: existing.id }, data });
    else await prisma.panceFullPracticeExam.create({ data: { examNumber, ...data } });
  } else {
    const existing = await prisma.nptePtFullPracticeExam.findUnique({ where: { examNumber } });
    const links = existing ? await snapshotSimpleLinks(prisma, kind, existing.id) : [];
    const data = examWriteData(exam, summary, now, existing, links);
    if (existing) await prisma.nptePtFullPracticeExam.update({ where: { id: existing.id }, data });
    else await prisma.nptePtFullPracticeExam.create({ data: { examNumber, ...data } });
  }
  console.log(`wrote exam ${examNumber} ${exam.title} (${exam.itemIds.length})`);
}

async function pauseOne(prisma: PrismaClient, board: OutlineBoardId, examNumber: number, now: string) {
  if (board.startsWith("usmle")) {
    const existing = await prisma.usmleFullPracticeExam.findUnique({ where: { examNumber } });
    if (!existing?.active) return;
    await prisma.usmleFullPracticeExam.update({
      where: { id: existing.id },
      data: {
        active: false,
        qaReport: mergeArchive(existing.qaReport, {
          pipeline: BOARD_COMPOSER_PIPELINE,
          appliedAt: now,
          kind: "pause",
          previous: { title: existing.title, active: true, questionCount: existing.questionCount },
        }),
      },
    });
  } else if (board === "aanp-fnp") {
    await pauseModel(prisma.aanpFnpFullPracticeExam, examNumber, now);
  } else if (board === "pance") {
    await pauseModel(prisma.panceFullPracticeExam, examNumber, now);
  } else {
    await pauseModel(prisma.nptePtFullPracticeExam, examNumber, now);
  }
  console.log(`paused exam ${examNumber} (links kept)`);
}

async function pauseModel(
  model: {
    findUnique: (args: { where: { examNumber: number } }) => Promise<{
      id: string;
      active: boolean;
      title: string;
      questionCount: number;
      qaReport: Prisma.JsonValue | null;
    } | null>;
    update: (args: { where: { id: string }; data: { active: boolean; qaReport: Prisma.InputJsonValue } }) => Promise<unknown>;
  },
  examNumber: number,
  now: string
) {
  const existing = await model.findUnique({ where: { examNumber } });
  if (!existing?.active) return;
  await model.update({
    where: { id: existing.id },
    data: {
      active: false,
      qaReport: mergeArchive(existing.qaReport, {
        pipeline: BOARD_COMPOSER_PIPELINE,
        appliedAt: now,
        kind: "pause",
        previous: { title: existing.title, active: true, questionCount: existing.questionCount },
      }),
    },
  });
}

async function snapshotSimpleLinks(prisma: PrismaClient, kind: SimpleKind, examId: string) {
  if (kind === "aanp") {
    const links = await prisma.aanpFnpFullPracticeExamQuestion.findMany({
      where: { examId },
      orderBy: { sortOrder: "asc" },
    });
    return links.map((link) => ({
      questionBankItemId: link.questionBankItemId,
      sortOrder: link.sortOrder,
      blueprintDomain: link.blueprintDomain,
    }));
  }
  if (kind === "pance") {
    const links = await prisma.panceFullPracticeExamQuestion.findMany({
      where: { examId },
      orderBy: { sortOrder: "asc" },
    });
    return links.map((link) => ({
      questionBankItemId: link.questionBankItemId,
      sortOrder: link.sortOrder,
      contentCategory: link.contentCategory,
    }));
  }
  const links = await prisma.nptePtFullPracticeExamQuestion.findMany({
    where: { examId },
    orderBy: { sortOrder: "asc" },
  });
  return links.map((link) => ({
    questionBankItemId: link.questionBankItemId,
    sortOrder: link.sortOrder,
    contentCategory: link.contentCategory,
    taskCategory: link.taskCategory,
  }));
}

function asRecord(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return value as Record<string, unknown>;
}

async function restoreOutline(prisma: PrismaClient, board: OutlineBoardId, apply: boolean) {
  const rows = board.startsWith("usmle")
    ? await prisma.usmleFullPracticeExam.findMany()
    : board === "aanp-fnp"
      ? await prisma.aanpFnpFullPracticeExam.findMany()
      : board === "pance"
        ? await prisma.panceFullPracticeExam.findMany()
        : await prisma.nptePtFullPracticeExam.findMany();
  const step = stepFor(board);
  let planned = 0;
  for (const row of rows) {
    if (step && "stepLevel" in row && row.stepLevel !== step) continue;
    const block = asRecord(asRecord(row.qaReport).boardExamComposer);
    if (block.pipeline !== BOARD_COMPOSER_PIPELINE) continue;
    const previous = asRecord(block.previous);
    planned += 1;
    console.log(
      `${apply ? "restore" : "plan restore"} exam ${row.examNumber} kind=${String(block.kind)} active→${String(previous.active ?? false)}`
    );
    if (!apply) continue;
    if (block.kind === "create") {
      if (board.startsWith("usmle")) {
        await prisma.usmleFullPracticeExam.update({ where: { id: row.id }, data: { active: false } });
      } else if (board === "aanp-fnp") {
        await prisma.aanpFnpFullPracticeExam.update({ where: { id: row.id }, data: { active: false } });
      } else if (board === "pance") {
        await prisma.panceFullPracticeExam.update({ where: { id: row.id }, data: { active: false } });
      } else {
        await prisma.nptePtFullPracticeExam.update({ where: { id: row.id }, data: { active: false } });
      }
      continue;
    }
    const data = {
      title: typeof previous.title === "string" ? previous.title : row.title,
      questionCount: typeof previous.questionCount === "number" ? previous.questionCount : row.questionCount,
      active: previous.active !== false,
      qaPassed: typeof previous.qaPassed === "boolean" ? previous.qaPassed : row.qaPassed,
      blueprintSummary: (previous.blueprintSummary ?? Prisma.JsonNull) as Prisma.InputJsonValue,
    };
    if (board.startsWith("usmle")) {
      await prisma.usmleFullPracticeExam.update({ where: { id: row.id }, data });
    } else if (board === "aanp-fnp") {
      await prisma.aanpFnpFullPracticeExam.update({ where: { id: row.id }, data });
    } else if (board === "pance") {
      await prisma.panceFullPracticeExam.update({ where: { id: row.id }, data });
    } else {
      await prisma.nptePtFullPracticeExam.update({ where: { id: row.id }, data });
    }
    if (block.kind !== "replace" || !Array.isArray(previous.links)) continue;
    await restoreLinks(prisma, board, row.id, previous.links);
  }
  console.log(`Restore ${apply ? "applied" : "planned"}: ${planned}`);
  if (!apply) console.log("No rows written.");
}

async function restoreLinks(
  prisma: PrismaClient,
  board: OutlineBoardId,
  examId: string,
  links: unknown[]
) {
  if (board.startsWith("usmle")) {
    const typed = links as Array<{
      questionBankItemId: string;
      sortOrder: number;
      blueprintSystem: string | null;
      physicianTask: string | null;
      itemFormat: string | null;
    }>;
    await prisma.$transaction([
      prisma.usmleFullPracticeExamQuestion.deleteMany({ where: { examId } }),
      prisma.usmleFullPracticeExamQuestion.createMany({
        data: typed.map((link) => ({ examId, ...link })),
      }),
    ]);
    return;
  }
  if (board === "aanp-fnp") {
    const typed = links as Array<{
      questionBankItemId: string;
      sortOrder: number;
      blueprintDomain: string | null;
    }>;
    await prisma.$transaction([
      prisma.aanpFnpFullPracticeExamQuestion.deleteMany({ where: { examId } }),
      prisma.aanpFnpFullPracticeExamQuestion.createMany({
        data: typed.map((link) => ({ examId, ...link })),
      }),
    ]);
    return;
  }
  if (board === "pance") {
    const typed = links as Array<{
      questionBankItemId: string;
      sortOrder: number;
      contentCategory: string | null;
    }>;
    await prisma.$transaction([
      prisma.panceFullPracticeExamQuestion.deleteMany({ where: { examId } }),
      prisma.panceFullPracticeExamQuestion.createMany({
        data: typed.map((link) => ({ examId, ...link })),
      }),
    ]);
    return;
  }
  const typed = links as Array<{
    questionBankItemId: string;
    sortOrder: number;
    contentCategory: string | null;
    taskCategory: string | null;
  }>;
  await prisma.$transaction([
    prisma.nptePtFullPracticeExamQuestion.deleteMany({ where: { examId } }),
    prisma.nptePtFullPracticeExamQuestion.createMany({
      data: typed.map((link) => ({ examId, ...link })),
    }),
  ]);
}
