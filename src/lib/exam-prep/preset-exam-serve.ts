/**
 * Serve a full practice exam at its advertised length.
 * Ineligible linked items are replaced from the eligible pool.
 * A form that cannot be filled returns null and does not throw.
 */
import { prisma } from "@/lib/prisma";
import { sqlQuery } from "@/lib/db";
import { enrichBankItemFromRow } from "@/lib/mpje/parse-bank-options";
import type { BankItem } from "@/lib/question-bank";
import {
  assessStudentEligibility,
  warmCompleteCaseGroups,
  type StudentEligibilityInput,
} from "./student-eligibility";
import { studentEligibleAndSql } from "./student-eligibility-sql";
import { planPresetExamFill, type ExamFillPlan } from "./preset-exam-fill";

type LinkedQuestion = {
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
  curationMeta: unknown;
  source: string | null;
  solutionSteps: string | null;
  tags: string | null;
  stateCode?: string | null;
  difficulty?: number | null;
  topicCategory?: string | null;
  taskCategory?: string | null;
  blueprintTopic?: string | null;
  reviewStatus?: string | null;
  generationVersion?: string | null;
  generationMeta?: unknown;
  references?: unknown;
  stepLevel?: string | null;
};

export type PresetExamLink = {
  sortOrder: number;
  areaKey: string;
  question: LinkedQuestion;
};

type PoolRow = { id: string; subjectId: string; blueprintDomain: string | null };

function linkMatchesExamField(row: LinkedQuestion, fieldId: string): boolean {
  if (row.fieldId !== fieldId) return false;
  if (fieldId === "usmle-step-2" && row.stepLevel === "step3") return false;
  return true;
}

function inputFromQuestion(row: LinkedQuestion): StudentEligibilityInput {
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
    curationMeta: row.curationMeta,
  };
}

function toBankItem(row: LinkedQuestion): BankItem {
  const item = enrichBankItemFromRow(row);
  item.id = row.id;
  item.source = row.source ?? undefined;
  return item;
}

async function loadReplacementIds(params: {
  fieldId: string;
  excludeIds: string[];
  limit: number;
}): Promise<PoolRow[]> {
  const exclude = params.excludeIds.length > 0 ? params.excludeIds : ["__none__"];
  const stepGuard =
    params.fieldId === "usmle-step-2"
      ? `AND ("stepLevel" IS NULL OR "stepLevel" <> 'step3')`
      : "";
  const rows = (await sqlQuery(
    `
    SELECT id, "subjectId", "blueprintDomain"
    FROM "QuestionBankItem"
    WHERE "fieldId" = $1
      AND active = true
      AND "qaPassed" = true
      AND NOT (id = ANY($2::text[]))
      ${stepGuard}
      ${studentEligibleAndSql()}
    ORDER BY id
    LIMIT $3
    `,
    [params.fieldId, exclude, params.limit]
  )) as PoolRow[];
  return rows;
}

export async function assembleEligibleExamItems(params: {
  fieldId: string;
  questionCount: number;
  links: PresetExamLink[];
}): Promise<{ items: BankItem[]; plan: ExamFillPlan } | null> {
  if (params.questionCount <= 0) return null;
  const completeCaseGroups = await warmCompleteCaseGroups();
  const context = { completeCaseGroups };

  const slots = params.links.map((link) => {
    const verdict = assessStudentEligibility(inputFromQuestion(link.question), context);
    return {
      id: link.question.id,
      sortOrder: link.sortOrder,
      areaKey: link.areaKey || link.question.subjectId,
      eligible:
        verdict.eligible &&
        link.question.active !== false &&
        linkMatchesExamField(link.question, params.fieldId),
    };
  });

  const keptIds = slots.filter((slot) => slot.eligible).map((slot) => slot.id);
  const need = params.questionCount - new Set(keptIds).size;
  const pool =
    need > 0
      ? await loadReplacementIds({
          fieldId: params.fieldId,
          excludeIds: params.links.map((link) => link.question.id),
          limit: Math.max(params.questionCount * 6, need * 8, 200),
        })
      : [];

  const plan = planPresetExamFill({
    questionCount: params.questionCount,
    slots,
    pool: pool.map((row) => ({
      id: row.id,
      areaKeys: [row.subjectId, row.blueprintDomain].filter((value): value is string => Boolean(value)),
    })),
  });
  if (plan.action === "hide") return null;

  const linkedById = new Map(params.links.map((link) => [link.question.id, link.question]));
  const missing = plan.orderedIds.filter((id) => !linkedById.has(id));
  if (missing.length > 0) {
    const rows = await prisma.questionBankItem.findMany({ where: { id: { in: missing } } });
    for (const row of rows) linkedById.set(row.id, row);
  }

  const items: BankItem[] = [];
  for (const id of plan.orderedIds) {
    const row = linkedById.get(id);
    if (!row) return null;
    items.push(toBankItem(row));
  }
  if (items.length !== params.questionCount) return null;
  return { items, plan };
}
