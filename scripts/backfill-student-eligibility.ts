#!/usr/bin/env node
/**
 * Record why an active item is hidden from students, and plan practice-exam fills.
 *
 * Dry-run (no writes) — counts per board and per reason, plus every active exam:
 *   npm run db:student-eligibility
 *
 * Persist reason codes and replace exam membership. Does not change stems,
 * options, keys, rationales, `active`, or `qaPassed` on items:
 *   npm run db:student-eligibility -- --apply
 *
 * Mark one item eligible again after an RN repair (structural reasons stay on
 * the record; the restore status is the override):
 *   npm run db:student-eligibility -- --apply --restore <itemId>
 *
 * Drop restore overrides and re-assess:
 *   npm run db:student-eligibility -- --apply --clear-restores
 *
 * A hidden exam (`active = false`, qaReport.studentEligibility.reason =
 * could_not_fill) stays hidden. Set `active` back to true and re-run `--apply`
 * after the eligible pool can fill it.
 */
import { loadEnvFiles, ensureDatabaseUrlEnv } from "./resolve-database-url.mjs";

loadEnvFiles();
ensureDatabaseUrlEnv();

import { Prisma, PrismaClient } from "@prisma/client";
import { sqlQuery } from "../src/lib/db";
import {
  STUDENT_ELIGIBILITY_PIPELINE,
  STUDENT_SUPPRESS_REASONS,
  assessStudentEligibility,
  buildCaseGroupFacts,
  readStudentEligibilityRecord,
  type StudentEligibilityInput,
  type StudentEligibilityRecord,
  type StudentSuppressReason,
} from "../src/lib/exam-prep/student-eligibility";
import { STUDENT_ELIGIBLE_SQL } from "../src/lib/exam-prep/student-eligibility-sql";
import { planPresetExamFill, type ExamFillCandidate, type ExamFillSlot } from "../src/lib/exam-prep/preset-exam-fill";

const prisma = new PrismaClient();
const BATCH = 250;

type Args = {
  apply: boolean;
  clearRestores: boolean;
  restoreIds: string[];
};

function parseArgs(): Args {
  const args = process.argv.slice(2);
  const parsed: Args = { apply: false, clearRestores: false, restoreIds: [] };
  for (let i = 0; i < args.length; i += 1) {
    const arg = args[i];
    if (arg === "--apply") parsed.apply = true;
    else if (arg === "--clear-restores") parsed.clearRestores = true;
    else if (arg === "--restore" && args[i + 1]) parsed.restoreIds.push(args[++i]!);
  }
  return parsed;
}

type ItemRow = {
  id: string;
  fieldId: string;
  subjectId: string;
  active: boolean;
  qaPassed: boolean;
  itemType: string;
  scenario: string | null;
  question: string;
  options: string;
  correctAnswer: string;
  explanation: string;
  blueprintDomain: string | null;
  clientNeeds: string | null;
  stepLevel: string | null;
  curationMeta: Prisma.JsonValue | null;
};

const itemSelect = {
  id: true,
  fieldId: true,
  subjectId: true,
  active: true,
  qaPassed: true,
  itemType: true,
  scenario: true,
  question: true,
  options: true,
  correctAnswer: true,
  explanation: true,
  blueprintDomain: true,
  clientNeeds: true,
  stepLevel: true,
  curationMeta: true,
} as const;

function emptyReasons(): Record<StudentSuppressReason, number> {
  return Object.fromEntries(STUDENT_SUPPRESS_REASONS.map((code) => [code, 0])) as Record<
    StudentSuppressReason,
    number
  >;
}

function sameReasons(left: readonly string[], right: readonly string[]): boolean {
  if (left.length !== right.length) return false;
  const a = [...left].sort();
  const b = [...right].sort();
  return a.every((code, index) => code === b[index]);
}

function asObject(value: unknown): Record<string, unknown> {
  if (!value || typeof value !== "object" || Array.isArray(value)) return {};
  return { ...(value as Record<string, unknown>) };
}

function metaForAssess(meta: Prisma.JsonValue | null, clearRestores: boolean): unknown {
  if (!clearRestores) return meta;
  const record = readStudentEligibilityRecord(meta);
  if (!record || record.status !== "restored") return meta;
  return {
    ...asObject(meta),
    studentEligibility: { ...record, status: "suppressed" },
  };
}

function toInput(row: ItemRow, meta: unknown): StudentEligibilityInput {
  return {
    id: row.id,
    fieldId: row.fieldId,
    active: row.active,
    qaPassed: row.qaPassed,
    itemType: row.itemType,
    question: row.question,
    scenario: row.scenario,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    optionsRaw: row.options,
    curationMeta: meta,
  };
}

type Desired = {
  record: StudentEligibilityRecord | null;
  changed: boolean;
};

function desiredRecord(row: ItemRow, reasons: StudentSuppressReason[], restored: boolean, now: string): Desired {
  const prior = readStudentEligibilityRecord(row.curationMeta);
  const next: StudentEligibilityRecord = restored
    ? {
        pipeline: STUDENT_ELIGIBILITY_PIPELINE,
        status: "restored",
        reasons,
        assessedAt: prior?.status === "restored" ? prior.assessedAt || now : now,
        restoredAt: prior?.restoredAt || now,
      }
    : {
        pipeline: STUDENT_ELIGIBILITY_PIPELINE,
        status: reasons.length === 0 ? "eligible" : "suppressed",
        reasons,
        assessedAt: now,
      };

  if (!restored && reasons.length === 0 && !prior) return { record: null, changed: false };
  if (
    prior &&
    prior.status === next.status &&
    sameReasons(prior.reasons, next.reasons) &&
    (next.status !== "restored" || prior.restoredAt === next.restoredAt)
  ) {
    return { record: next, changed: false };
  }
  return { record: next, changed: true };
}

function mergeMeta(existing: Prisma.JsonValue | null, record: StudentEligibilityRecord): Prisma.InputJsonValue {
  return {
    ...asObject(existing),
    studentEligibility: record,
  } as Prisma.InputJsonValue;
}

type FieldReport = {
  fieldId: string;
  active: number;
  eligible: number;
  suppressed: number;
  restored: number;
  qaPassed: number;
  qaPassedIneligible: number;
  reasons: Record<StudentSuppressReason, number>;
  metaWrites: number;
};

type LinkRow = {
  questionBankItemId: string;
  sortOrder: number;
  storedArea: string | null;
};

type ExamPlanRow = {
  board: string;
  examNumber: number;
  title: string;
  advertised: number;
  eligibleLinked: number;
  kept: number;
  added: number;
  action: "unchanged" | "backfill" | "hide";
};

type ExamSpec = {
  board: string;
  fieldId: (row: { stepLevel?: string | null }) => string;
  load: () => Promise<
    Array<{
      id: string;
      examNumber: number;
      title: string;
      questionCount: number;
      qaReport: Prisma.JsonValue | null;
      stepLevel?: string | null;
      links: LinkRow[];
    }>
  >;
  hide: (id: string, qaReport: Prisma.InputJsonValue) => Promise<void>;
  replace: (
    examId: string,
    rows: Array<{ questionBankItemId: string; sortOrder: number; storedArea: string | null }>
  ) => Promise<void>;
};

function areaKeys(row: { subjectId: string; blueprintDomain: string | null; clientNeeds: string | null }): string[] {
  return [row.subjectId, row.blueprintDomain, row.clientNeeds].filter((value): value is string => Boolean(value));
}

const EXAMS: ExamSpec[] = [
  {
    board: "NCLEX",
    fieldId: () => "nursing",
    load: async () => {
      const rows = await prisma.nclexFullPracticeExam.findMany({
        where: { active: true },
        orderBy: { examNumber: "asc" },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            select: { questionBankItemId: true, sortOrder: true, clientNeedsCategory: true },
          },
        },
      });
      return rows.map((row) => ({
        id: row.id,
        examNumber: row.examNumber,
        title: row.title,
        questionCount: row.questionCount,
        qaReport: row.qaReport,
        links: row.questions.map((link) => ({
          questionBankItemId: link.questionBankItemId,
          sortOrder: link.sortOrder,
          storedArea: link.clientNeedsCategory,
        })),
      }));
    },
    hide: async (id, qaReport) => {
      await prisma.nclexFullPracticeExam.update({ where: { id }, data: { active: false, qaReport } });
    },
    replace: async (examId, rows) => {
      await prisma.$transaction([
        prisma.nclexFullPracticeExamQuestion.deleteMany({ where: { examId } }),
        prisma.nclexFullPracticeExamQuestion.createMany({
          data: rows.map((row) => ({
            examId,
            questionBankItemId: row.questionBankItemId,
            sortOrder: row.sortOrder,
            clientNeedsCategory: row.storedArea,
          })),
        }),
      ]);
    },
  },
  {
    board: "NAPLEX",
    fieldId: () => "pharmacy",
    load: async () => {
      const rows = await prisma.naplexFullPracticeExam.findMany({
        where: { active: true },
        orderBy: { examNumber: "asc" },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            select: { questionBankItemId: true, sortOrder: true, blueprintArea: true },
          },
        },
      });
      return rows.map((row) => ({
        id: row.id,
        examNumber: row.examNumber,
        title: row.title,
        questionCount: row.questionCount,
        qaReport: row.qaReport,
        links: row.questions.map((link) => ({
          questionBankItemId: link.questionBankItemId,
          sortOrder: link.sortOrder,
          storedArea: link.blueprintArea,
        })),
      }));
    },
    hide: async (id, qaReport) => {
      await prisma.naplexFullPracticeExam.update({ where: { id }, data: { active: false, qaReport } });
    },
    replace: async (examId, rows) => {
      await prisma.$transaction([
        prisma.naplexFullPracticeExamQuestion.deleteMany({ where: { examId } }),
        prisma.naplexFullPracticeExamQuestion.createMany({
          data: rows.map((row) => ({
            examId,
            questionBankItemId: row.questionBankItemId,
            sortOrder: row.sortOrder,
            blueprintArea: row.storedArea,
          })),
        }),
      ]);
    },
  },
  {
    board: "USMLE",
    fieldId: (row) =>
      row.stepLevel === "step1" ? "usmle-step-1" : row.stepLevel === "step3" ? "usmle-step-3" : "usmle-step-2",
    load: async () => {
      const rows = await prisma.usmleFullPracticeExam.findMany({
        where: { active: true },
        orderBy: { examNumber: "asc" },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            select: { questionBankItemId: true, sortOrder: true, blueprintSystem: true },
          },
        },
      });
      return rows.map((row) => ({
        id: row.id,
        examNumber: row.examNumber,
        title: row.title,
        questionCount: row.questionCount,
        qaReport: row.qaReport,
        stepLevel: row.stepLevel,
        links: row.questions.map((link) => ({
          questionBankItemId: link.questionBankItemId,
          sortOrder: link.sortOrder,
          storedArea: link.blueprintSystem,
        })),
      }));
    },
    hide: async (id, qaReport) => {
      await prisma.usmleFullPracticeExam.update({ where: { id }, data: { active: false, qaReport } });
    },
    replace: async (examId, rows) => {
      await prisma.$transaction([
        prisma.usmleFullPracticeExamQuestion.deleteMany({ where: { examId } }),
        prisma.usmleFullPracticeExamQuestion.createMany({
          data: rows.map((row) => ({
            examId,
            questionBankItemId: row.questionBankItemId,
            sortOrder: row.sortOrder,
            blueprintSystem: row.storedArea,
          })),
        }),
      ]);
    },
  },
  {
    board: "PANCE",
    fieldId: () => "pance",
    load: async () => {
      const rows = await prisma.panceFullPracticeExam.findMany({
        where: { active: true },
        orderBy: { examNumber: "asc" },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            select: { questionBankItemId: true, sortOrder: true, contentCategory: true },
          },
        },
      });
      return rows.map((row) => ({
        id: row.id,
        examNumber: row.examNumber,
        title: row.title,
        questionCount: row.questionCount,
        qaReport: row.qaReport,
        links: row.questions.map((link) => ({
          questionBankItemId: link.questionBankItemId,
          sortOrder: link.sortOrder,
          storedArea: link.contentCategory,
        })),
      }));
    },
    hide: async (id, qaReport) => {
      await prisma.panceFullPracticeExam.update({ where: { id }, data: { active: false, qaReport } });
    },
    replace: async (examId, rows) => {
      await prisma.$transaction([
        prisma.panceFullPracticeExamQuestion.deleteMany({ where: { examId } }),
        prisma.panceFullPracticeExamQuestion.createMany({
          data: rows.map((row) => ({
            examId,
            questionBankItemId: row.questionBankItemId,
            sortOrder: row.sortOrder,
            contentCategory: row.storedArea,
          })),
        }),
      ]);
    },
  },
  {
    board: "AANP",
    fieldId: () => "aanp-fnp",
    load: async () => {
      const rows = await prisma.aanpFnpFullPracticeExam.findMany({
        where: { active: true },
        orderBy: { examNumber: "asc" },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            select: { questionBankItemId: true, sortOrder: true, blueprintDomain: true },
          },
        },
      });
      return rows.map((row) => ({
        id: row.id,
        examNumber: row.examNumber,
        title: row.title,
        questionCount: row.questionCount,
        qaReport: row.qaReport,
        links: row.questions.map((link) => ({
          questionBankItemId: link.questionBankItemId,
          sortOrder: link.sortOrder,
          storedArea: link.blueprintDomain,
        })),
      }));
    },
    hide: async (id, qaReport) => {
      await prisma.aanpFnpFullPracticeExam.update({ where: { id }, data: { active: false, qaReport } });
    },
    replace: async (examId, rows) => {
      await prisma.$transaction([
        prisma.aanpFnpFullPracticeExamQuestion.deleteMany({ where: { examId } }),
        prisma.aanpFnpFullPracticeExamQuestion.createMany({
          data: rows.map((row) => ({
            examId,
            questionBankItemId: row.questionBankItemId,
            sortOrder: row.sortOrder,
            blueprintDomain: row.storedArea,
          })),
        }),
      ]);
    },
  },
  {
    board: "NPTE",
    fieldId: () => "npte-pt",
    load: async () => {
      const rows = await prisma.nptePtFullPracticeExam.findMany({
        where: { active: true },
        orderBy: { examNumber: "asc" },
        include: {
          questions: {
            orderBy: { sortOrder: "asc" },
            select: { questionBankItemId: true, sortOrder: true, contentCategory: true },
          },
        },
      });
      return rows.map((row) => ({
        id: row.id,
        examNumber: row.examNumber,
        title: row.title,
        questionCount: row.questionCount,
        qaReport: row.qaReport,
        links: row.questions.map((link) => ({
          questionBankItemId: link.questionBankItemId,
          sortOrder: link.sortOrder,
          storedArea: link.contentCategory,
        })),
      }));
    },
    hide: async (id, qaReport) => {
      await prisma.nptePtFullPracticeExam.update({ where: { id }, data: { active: false, qaReport } });
    },
    replace: async (examId, rows) => {
      await prisma.$transaction([
        prisma.nptePtFullPracticeExamQuestion.deleteMany({ where: { examId } }),
        prisma.nptePtFullPracticeExamQuestion.createMany({
          data: rows.map((row) => ({
            examId,
            questionBankItemId: row.questionBankItemId,
            sortOrder: row.sortOrder,
            contentCategory: row.storedArea,
          })),
        }),
      ]);
    },
  },
];

function hideReport(existing: Prisma.JsonValue | null): Prisma.InputJsonValue {
  return {
    ...asObject(existing),
    studentEligibility: {
      hiddenAt: new Date().toISOString(),
      reason: "could_not_fill",
      previousActive: true,
    },
  } as Prisma.InputJsonValue;
}

async function sqlIneligibleIds(fieldId: string): Promise<string[]> {
  const rows = (await sqlQuery(
    `
    SELECT id
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      AND NOT ${STUDENT_ELIGIBLE_SQL}
    `,
    [fieldId]
  )) as Array<{ id: string }>;
  return rows.map((row) => row.id);
}

async function main() {
  const args = parseArgs();
  const now = new Date().toISOString();
  const restoreIds = new Set(args.restoreIds);
  const mode = args.apply ? "APPLY" : "DRY-RUN";
  console.log(`student-eligibility ${mode}`);
  if (args.clearRestores) console.log("clear-restores: restore overrides will be dropped");
  if (restoreIds.size > 0) console.log(`restore ids: ${[...restoreIds].join(", ")}`);

  const loadedExams = new Map<string, Awaited<ReturnType<ExamSpec["load"]>>>();
  const linkedIds = new Set<string>();
  for (const spec of EXAMS) {
    const exams = await spec.load();
    loadedExams.set(spec.board, exams);
    for (const exam of exams) {
      for (const link of exam.links) linkedIds.add(link.questionBankItemId);
    }
  }

  const caseRows = await prisma.questionBankItem.findMany({
    where: {
      active: true,
      itemType: { in: ["case_study", "unfolding_case", "case_based"] },
    },
    select: {
      fieldId: true,
      itemType: true,
      options: true,
      active: true,
      scenario: true,
      question: true,
      correctAnswer: true,
    },
  });
  const caseGroups = buildCaseGroupFacts(
    caseRows.map((row) => ({
      fieldId: row.fieldId,
      itemType: row.itemType,
      active: row.active,
      optionsRaw: row.options,
      scenario: row.scenario,
      question: row.question,
      correctAnswer: row.correctAnswer,
    }))
  );
  const servableCaseGroups = [...caseGroups.values()].filter(
    (facts) => facts.members === 6 && facts.sharedPatient && facts.hasNgnItem
  ).length;
  console.log(`case groups: ${caseGroups.size}, servable: ${servableCaseGroups}`);

  const fields = await prisma.questionBankItem.findMany({
    where: { active: true },
    distinct: ["fieldId"],
    select: { fieldId: true },
    orderBy: { fieldId: "asc" },
  });

  const reports: FieldReport[] = [];
  const pools = new Map<string, ExamFillCandidate[]>();
  const verdictById = new Map<string, { eligible: boolean; fieldId: string; stepLevel: string | null; subjectId: string }>();
  const tsIneligible = new Map<string, Set<string>>();
  let metaWrites = 0;

  for (const field of fields) {
    const report: FieldReport = {
      fieldId: field.fieldId,
      active: 0,
      eligible: 0,
      suppressed: 0,
      restored: 0,
      qaPassed: 0,
      qaPassedIneligible: 0,
      reasons: emptyReasons(),
      metaWrites: 0,
    };
    const pool: ExamFillCandidate[] = [];
    const ineligible = new Set<string>();
    let cursor: string | undefined;

    for (;;) {
      const rows = await prisma.questionBankItem.findMany({
        where: { active: true, fieldId: field.fieldId },
        orderBy: { id: "asc" },
        take: BATCH,
        ...(cursor ? { skip: 1, cursor: { id: cursor } } : {}),
        select: itemSelect,
      });
      if (rows.length === 0) break;
      cursor = rows[rows.length - 1]!.id;

      for (const row of rows) {
        const assessedMeta = metaForAssess(row.curationMeta, args.clearRestores);
        const verdict = assessStudentEligibility(toInput(row, assessedMeta), { caseGroups });
        const forceRestore = restoreIds.has(row.id);
        const restored = forceRestore || (!args.clearRestores && verdict.restored);
        const eligible = restored || verdict.reasons.length === 0;
        report.active += 1;
        if (row.qaPassed) report.qaPassed += 1;
        if (eligible) report.eligible += 1;
        else report.suppressed += 1;
        if (restored) report.restored += 1;
        if (!eligible) {
          for (const code of verdict.reasons) report.reasons[code] += 1;
        }
        if (row.qaPassed && !eligible) {
          report.qaPassedIneligible += 1;
          ineligible.add(row.id);
        }

        const serveOnThisField = !(row.fieldId === "usmle-step-2" && row.stepLevel === "step3");
        if (eligible && serveOnThisField) {
          pool.push({
            id: row.id,
            areaKeys: areaKeys(row),
          });
        }
        if (linkedIds.has(row.id)) {
          verdictById.set(row.id, {
            eligible: eligible && serveOnThisField,
            fieldId: row.fieldId,
            stepLevel: row.stepLevel,
            subjectId: row.subjectId,
          });
        }

        const record = desiredRecord(row, verdict.reasons, restored, now);
        if (!record.changed || !record.record) continue;
        report.metaWrites += 1;
        metaWrites += 1;
        if (!args.apply) continue;
        await prisma.questionBankItem.update({
          where: { id: row.id },
          data: { curationMeta: mergeMeta(row.curationMeta, record.record) },
        });
      }
    }

    pools.set(field.fieldId, pool);
    tsIneligible.set(field.fieldId, ineligible);
    reports.push(report);
    console.log(
      `${field.fieldId}: active ${report.active}, eligible ${report.eligible}, suppressed ${report.suppressed}`
    );
  }

  console.log("\n## Suppression by board\n");
  console.log("| board | active | eligible | suppressed | restored | qaPassed | qaPassed still ineligible | meta writes |");
  console.log("| --- | ---: | ---: | ---: | ---: | ---: | ---: | ---: |");
  for (const report of reports) {
    console.log(
      `| ${report.fieldId} | ${report.active} | ${report.eligible} | ${report.suppressed} | ${report.restored} | ${report.qaPassed} | ${report.qaPassedIneligible} | ${report.metaWrites} |`
    );
  }

  console.log("\n## Reasons (an item can have more than one)\n");
  console.log(`| board | ${STUDENT_SUPPRESS_REASONS.join(" | ")} |`);
  console.log(`| --- | ${STUDENT_SUPPRESS_REASONS.map(() => "---:").join(" | ")} |`);
  for (const report of reports) {
    const cells = STUDENT_SUPPRESS_REASONS.map((code) => String(report.reasons[code]));
    console.log(`| ${report.fieldId} | ${cells.join(" | ")} |`);
  }

  const nursing = reports.find((report) => report.fieldId === "nursing");
  console.log(`\nNCLEX (nursing) unique suppressed: ${nursing?.suppressed ?? 0}`);
  console.log(`meta writes ${args.apply ? "applied" : "planned"}: ${metaWrites}`);

  console.log("\n## SQL vs TypeScript on the qaPassed pool\n");
  console.log("| board | ts ineligible | sql ineligible | only ts | only sql |");
  console.log("| --- | ---: | ---: | ---: | ---: |");
  for (const report of reports) {
    if (report.qaPassed === 0) continue;
    let sqlIds: string[] = [];
    try {
      sqlIds = await sqlIneligibleIds(report.fieldId);
    } catch (error) {
      const message = error instanceof Error ? error.message : String(error);
      console.log(`| ${report.fieldId} | ${report.qaPassedIneligible} | ERROR | | ${message.slice(0, 180)} |`);
      continue;
    }
    const tsIds = tsIneligible.get(report.fieldId) ?? new Set<string>();
    const sqlSet = new Set(sqlIds);
    let onlyTs = 0;
    let onlySql = 0;
    const tsSample: string[] = [];
    const sqlSample: string[] = [];
    for (const id of tsIds) {
      if (!sqlSet.has(id)) {
        onlyTs += 1;
        if (tsSample.length < 8) tsSample.push(id);
      }
    }
    for (const id of sqlSet) {
      if (!tsIds.has(id)) {
        onlySql += 1;
        if (sqlSample.length < 8) sqlSample.push(id);
      }
    }
    console.log(`| ${report.fieldId} | ${tsIds.size} | ${sqlSet.size} | ${onlyTs} | ${onlySql} |`);
    if (onlyTs || onlySql) {
      if (tsSample.length) console.log(`  only ts ${report.fieldId}: ${tsSample.join(", ")}`);
      if (sqlSample.length) console.log(`  only sql ${report.fieldId}: ${sqlSample.join(", ")}`);
    }
  }

  console.log("\n## Practice exams\n");
  console.log("| board | exam | advertised | eligible linked | kept | added | action |");
  console.log("| --- | ---: | ---: | ---: | ---: | ---: | --- |");
  const plans: ExamPlanRow[] = [];
  const hidden: string[] = [];

  for (const spec of EXAMS) {
    const exams = loadedExams.get(spec.board) ?? [];
    for (const exam of exams) {
      const fieldId = spec.fieldId(exam);
      const slots: ExamFillSlot[] = exam.links.map((link) => {
        const verdict = verdictById.get(link.questionBankItemId);
        const fieldOk =
          verdict?.fieldId === fieldId && !(fieldId === "usmle-step-2" && verdict.stepLevel === "step3");
        return {
          id: link.questionBankItemId,
          sortOrder: link.sortOrder,
          areaKey: link.storedArea || verdict?.subjectId || "",
          eligible: Boolean(verdict?.eligible && fieldOk),
        };
      });
      const linkedIdSet = new Set(exam.links.map((link) => link.questionBankItemId));
      const pool = (pools.get(fieldId) ?? []).filter((row) => !linkedIdSet.has(row.id));
      const plan = planPresetExamFill({
        questionCount: exam.questionCount,
        slots,
        pool,
      });
      const eligibleLinked = slots.filter((slot) => slot.eligible).length;
      const row: ExamPlanRow = {
        board: spec.board,
        examNumber: exam.examNumber,
        title: exam.title,
        advertised: exam.questionCount,
        eligibleLinked,
        kept: plan.kept,
        added: plan.added,
        action: plan.action,
      };
      plans.push(row);
      if (plan.action === "hide") hidden.push(`${spec.board} #${exam.examNumber} (${exam.title})`);
      console.log(
        `| ${spec.board} | ${exam.examNumber} | ${exam.questionCount} | ${eligibleLinked} | ${plan.kept} | ${plan.added} | ${plan.action} |`
      );

      if (!args.apply || plan.action === "unchanged") continue;
      if (plan.action === "hide") {
        await spec.hide(exam.id, hideReport(exam.qaReport));
        continue;
      }
      const compacted = [...exam.links]
        .sort((a, b) => a.sortOrder - b.sortOrder || a.questionBankItemId.localeCompare(b.questionBankItemId))
        .slice(0, exam.questionCount);
      await spec.replace(
        exam.id,
        plan.orderedIds.map((id, index) => ({
          questionBankItemId: id,
          sortOrder: index + 1,
          storedArea: compacted[index]?.storedArea ?? null,
        }))
      );
    }
  }

  console.log(`\nHidden exams: ${hidden.length === 0 ? "none" : hidden.join("; ")}`);
  console.log(`Exam rows planned: ${plans.length}`);
  if (!args.apply) console.log("No rows written. Re-run with --apply to persist reason codes and exam membership.");
}

main()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
