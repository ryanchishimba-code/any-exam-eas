import type { Prisma } from "@prisma/client";
import { prisma } from "@/lib/prisma";
import { parseBankOptions } from "@/lib/mpje/parse-bank-options";
import { bankItemContentHash } from "@/lib/sync-question-bank";
import { normalizeFieldId } from "@/lib/subjects/field-ids";
import { examSlugFromFieldId, EXAM_CATALOG } from "@/lib/edtech/exams";

/** Review states an item can be in (mirrors BankItem.reviewStatus + draft). */
export const REVIEW_STATUSES = ["pending", "approved", "flagged", "rejected"] as const;
export type ReviewStatus = (typeof REVIEW_STATUSES)[number];

export type AdminQuestionFilters = {
  search?: string;
  fieldId?: string;
  reviewStatus?: string;
  qaPassed?: boolean;
  active?: boolean;
  difficulty?: number;
  itemType?: string;
  source?: string;
  blueprint?: string;
  reportedOnly?: boolean;
  dateField?: "createdAt" | "updatedAt";
  dateFrom?: Date;
  dateTo?: Date;
  sort?: "createdAt" | "updatedAt" | "difficulty";
  order?: "asc" | "desc";
  page?: number;
  pageSize?: number;
};

export type AdminQuestionListItem = {
  id: string;
  fieldId: string;
  examName: string;
  subjectId: string;
  questionPreview: string;
  itemType: string;
  difficulty: number | null;
  reviewStatus: string | null;
  qaPassed: boolean;
  active: boolean;
  source: string;
  blueprintDomain: string | null;
  blueprintTopic: string | null;
  openReports: number;
  createdAt: string;
  updatedAt: string;
};

export type AdminQuestionDetail = {
  id: string;
  fieldId: string;
  examName: string;
  subjectId: string;
  stateCode: string | null;
  question: string;
  scenario: string | null;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty: number | null;
  itemType: string;
  stepLevel: string | null;
  reviewStatus: string | null;
  qaPassed: boolean;
  active: boolean;
  source: string;
  topicCategory: string | null;
  blueprintDomain: string | null;
  blueprintTopic: string | null;
  taskCategory: string | null;
  patientAgeGroup: string | null;
  tags: string[];
  generationVersion: string | null;
  generationMeta: Record<string, unknown> | null;
  qualityScore: number | null;
  lastReviewedAt: string | null;
  createdAt: string;
  updatedAt: string;
  reports: {
    id: string;
    reason: string;
    message: string | null;
    status: string;
    issueSummary: string | null;
    createdAt: string;
  }[];
  history: {
    id: string;
    action: string;
    actorName: string | null;
    actorEmail: string | null;
    changes: Record<string, { before: unknown; after: unknown }> | null;
    note: string | null;
    createdAt: string;
  }[];
};

export type AdminQuestionFacets = {
  fields: { fieldId: string; examName: string; count: number }[];
  itemTypes: string[];
  sources: string[];
  totals: {
    all: number;
    pending: number;
    flagged: number;
    drafts: number;
    qaPassed: number;
  };
};

function fieldLabel(fieldId: string): string {
  const slug = examSlugFromFieldId(fieldId);
  if (slug && EXAM_CATALOG[slug]) return EXAM_CATALOG[slug].name;
  return fieldId;
}

function preview(text: string, max = 160): string {
  const clean = text.replace(/\s+/g, " ").trim();
  return clean.length > max ? `${clean.slice(0, max)}…` : clean;
}

function readQualityScore(meta: unknown): number | null {
  if (!meta || typeof meta !== "object") return null;
  const m = meta as Record<string, unknown>;
  const candidates = [m.qualityScore, m.qcScore, m.qaScore, m.score];
  for (const c of candidates) {
    if (typeof c === "number" && Number.isFinite(c)) return c;
  }
  return null;
}

/** Resolve set of bank item ids that currently have open question reports. */
async function bankItemIdsWithOpenReports(): Promise<string[]> {
  const grouped = await prisma.questionReport.groupBy({
    by: ["bankItemId"],
    where: { status: { in: ["open", "applied"] }, bankItemId: { not: null } },
  });
  return grouped
    .map((g) => g.bankItemId)
    .filter((v): v is string => typeof v === "string");
}

function buildWhere(
  filters: AdminQuestionFilters,
  reportedIds?: string[]
): Prisma.QuestionBankItemWhereInput {
  const where: Prisma.QuestionBankItemWhereInput = {};
  const and: Prisma.QuestionBankItemWhereInput[] = [];

  if (filters.fieldId) where.fieldId = normalizeFieldId(filters.fieldId);
  if (filters.reviewStatus) where.reviewStatus = filters.reviewStatus;
  if (typeof filters.qaPassed === "boolean") where.qaPassed = filters.qaPassed;
  if (typeof filters.active === "boolean") where.active = filters.active;
  if (typeof filters.difficulty === "number") where.difficulty = filters.difficulty;
  if (filters.itemType) where.itemType = filters.itemType;
  if (filters.source) where.source = filters.source;

  if (filters.search) {
    const term = filters.search.trim();
    and.push({
      OR: [
        { question: { contains: term, mode: "insensitive" } },
        { explanation: { contains: term, mode: "insensitive" } },
        { scenario: { contains: term, mode: "insensitive" } },
      ],
    });
  }

  if (filters.blueprint) {
    const term = filters.blueprint.trim();
    and.push({
      OR: [
        { blueprintDomain: { contains: term, mode: "insensitive" } },
        { blueprintTopic: { contains: term, mode: "insensitive" } },
        { topicCategory: { contains: term, mode: "insensitive" } },
        { taskCategory: { contains: term, mode: "insensitive" } },
      ],
    });
  }

  if (filters.dateFrom || filters.dateTo) {
    const field = filters.dateField ?? "createdAt";
    where[field] = {
      ...(filters.dateFrom ? { gte: filters.dateFrom } : {}),
      ...(filters.dateTo ? { lte: filters.dateTo } : {}),
    };
  }

  if (filters.reportedOnly) {
    where.id = { in: reportedIds && reportedIds.length ? reportedIds : ["__none__"] };
  }

  if (and.length) where.AND = and;
  return where;
}

export async function listAdminQuestions(filters: AdminQuestionFilters): Promise<{
  items: AdminQuestionListItem[];
  total: number;
  page: number;
  pageSize: number;
}> {
  const page = Math.max(1, filters.page ?? 1);
  const pageSize = Math.min(100, Math.max(5, filters.pageSize ?? 25));

  let reportedIds: string[] | undefined;
  if (filters.reportedOnly) {
    reportedIds = await bankItemIdsWithOpenReports();
  }

  const where = buildWhere(filters, reportedIds);
  const sort = filters.sort ?? "updatedAt";
  const order = filters.order ?? "desc";

  const [rows, total] = await Promise.all([
    prisma.questionBankItem.findMany({
      where,
      orderBy: { [sort]: order },
      skip: (page - 1) * pageSize,
      take: pageSize,
      select: {
        id: true,
        fieldId: true,
        subjectId: true,
        question: true,
        itemType: true,
        difficulty: true,
        reviewStatus: true,
        qaPassed: true,
        active: true,
        source: true,
        blueprintDomain: true,
        blueprintTopic: true,
        createdAt: true,
        updatedAt: true,
      },
    }),
    prisma.questionBankItem.count({ where }),
  ]);

  const ids = rows.map((r) => r.id);
  const reportCounts = new Map<string, number>();
  if (ids.length) {
    const grouped = await prisma.questionReport.groupBy({
      by: ["bankItemId"],
      where: { bankItemId: { in: ids }, status: "open" },
      _count: { _all: true },
    });
    for (const g of grouped) {
      if (g.bankItemId) reportCounts.set(g.bankItemId, g._count._all);
    }
  }

  return {
    items: rows.map((r) => ({
      id: r.id,
      fieldId: r.fieldId,
      examName: fieldLabel(r.fieldId),
      subjectId: r.subjectId,
      questionPreview: preview(r.question),
      itemType: r.itemType,
      difficulty: r.difficulty,
      reviewStatus: r.reviewStatus,
      qaPassed: r.qaPassed,
      active: r.active,
      source: r.source,
      blueprintDomain: r.blueprintDomain,
      blueprintTopic: r.blueprintTopic,
      openReports: reportCounts.get(r.id) ?? 0,
      createdAt: r.createdAt.toISOString(),
      updatedAt: r.updatedAt.toISOString(),
    })),
    total,
    page,
    pageSize,
  };
}

export async function getAdminQuestion(id: string): Promise<AdminQuestionDetail | null> {
  const row = await prisma.questionBankItem.findUnique({ where: { id } });
  if (!row) return null;

  const parsed = parseBankOptions(row.options);

  const [reports, actions] = await Promise.all([
    prisma.questionReport.findMany({
      where: { bankItemId: id },
      orderBy: { createdAt: "desc" },
      take: 20,
      select: {
        id: true,
        reason: true,
        message: true,
        status: true,
        issueSummary: true,
        createdAt: true,
      },
    }),
    prisma.adminAction.findMany({
      where: { targetType: "question_bank_item", targetId: id },
      orderBy: { createdAt: "desc" },
      take: 30,
      include: { actor: { select: { name: true, email: true } } },
    }),
  ]);

  return {
    id: row.id,
    fieldId: row.fieldId,
    examName: fieldLabel(row.fieldId),
    subjectId: row.subjectId,
    stateCode: row.stateCode,
    question: row.question,
    scenario: row.scenario,
    options: parsed.options,
    correctAnswer: row.correctAnswer,
    explanation: row.explanation,
    difficulty: row.difficulty,
    itemType: row.itemType,
    stepLevel: row.stepLevel,
    reviewStatus: row.reviewStatus,
    qaPassed: row.qaPassed,
    active: row.active,
    source: row.source,
    topicCategory: row.topicCategory,
    blueprintDomain: row.blueprintDomain,
    blueprintTopic: row.blueprintTopic,
    taskCategory: row.taskCategory,
    patientAgeGroup: row.patientAgeGroup,
    tags: row.tags ? safeJsonArray(row.tags) : [],
    generationVersion: row.generationVersion,
    generationMeta:
      row.generationMeta && typeof row.generationMeta === "object"
        ? (row.generationMeta as Record<string, unknown>)
        : null,
    qualityScore: readQualityScore(row.generationMeta),
    lastReviewedAt: row.lastReviewedAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    reports: reports.map((r) => ({
      id: r.id,
      reason: r.reason,
      message: r.message,
      status: r.status,
      issueSummary: r.issueSummary,
      createdAt: r.createdAt.toISOString(),
    })),
    history: actions.map((a) => {
      let changes: AdminQuestionDetail["history"][number]["changes"] = null;
      let note: string | null = null;
      if (a.metadata) {
        try {
          const meta = JSON.parse(a.metadata) as Record<string, unknown>;
          if (meta.changes && typeof meta.changes === "object") {
            changes = meta.changes as Record<string, { before: unknown; after: unknown }>;
          }
          if (typeof meta.note === "string") note = meta.note;
        } catch {
          /* ignore */
        }
      }
      return {
        id: a.id,
        action: a.action,
        actorName: a.actor?.name ?? null,
        actorEmail: a.actor?.email ?? null,
        changes,
        note,
        createdAt: a.createdAt.toISOString(),
      };
    }),
  };
}

function safeJsonArray(raw: string): string[] {
  try {
    const v = JSON.parse(raw);
    if (Array.isArray(v)) return v.map(String);
  } catch {
    /* fall through */
  }
  return raw
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
}

/** Replace the options array inside the stored options column, keeping any enrichment envelope. */
function rebuildOptionsColumn(existingRaw: string | null, newOptions: string[]): string {
  if (existingRaw) {
    try {
      const parsed = JSON.parse(existingRaw) as unknown;
      if (parsed && typeof parsed === "object" && !Array.isArray(parsed)) {
        return JSON.stringify({ ...(parsed as Record<string, unknown>), options: newOptions });
      }
    } catch {
      /* fall through */
    }
  }
  return JSON.stringify(newOptions);
}

export type AdminQuestionUpdate = {
  question?: string;
  scenario?: string | null;
  options?: string[];
  correctAnswer?: string;
  explanation?: string;
  difficulty?: number | null;
  itemType?: string;
  reviewStatus?: string | null;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  topicCategory?: string | null;
  taskCategory?: string | null;
  patientAgeGroup?: string | null;
  tags?: string[];
  active?: boolean;
  qaPassed?: boolean;
};

const EDITABLE_SCALARS: (keyof AdminQuestionUpdate)[] = [
  "question",
  "scenario",
  "correctAnswer",
  "explanation",
  "difficulty",
  "itemType",
  "reviewStatus",
  "blueprintDomain",
  "blueprintTopic",
  "topicCategory",
  "taskCategory",
  "patientAgeGroup",
  "active",
  "qaPassed",
];

export type UpdateResult =
  | { ok: true; changes: Record<string, { before: unknown; after: unknown }> }
  | { ok: false; error: string };

export async function updateAdminQuestion(
  id: string,
  patch: AdminQuestionUpdate
): Promise<UpdateResult> {
  const existing = await prisma.questionBankItem.findUnique({ where: { id } });
  if (!existing) return { ok: false, error: "Question not found." };

  const data: Prisma.QuestionBankItemUpdateInput = {};
  const changes: Record<string, { before: unknown; after: unknown }> = {};

  for (const key of EDITABLE_SCALARS) {
    if (!(key in patch)) continue;
    const next = patch[key];
    const prev = (existing as Record<string, unknown>)[key];
    if (next === prev) continue;
    (data as Record<string, unknown>)[key] = next;
    changes[key] = { before: prev, after: next };
  }

  if (patch.options) {
    const before = parseBankOptions(existing.options).options;
    data.options = rebuildOptionsColumn(existing.options, patch.options);
    changes.options = { before, after: patch.options };
  }

  if (patch.tags) {
    const before = existing.tags ? safeJsonArray(existing.tags) : [];
    data.tags = JSON.stringify(patch.tags);
    changes.tags = { before, after: patch.tags };
  }

  // Recompute content hash if the stem/scenario changed (column is unique).
  const questionChanged = patch.question != null && patch.question !== existing.question;
  const scenarioChanged =
    "scenario" in patch && (patch.scenario ?? "") !== (existing.scenario ?? "");
  if (questionChanged || scenarioChanged) {
    const nextHash = bankItemContentHash(existing.fieldId, existing.subjectId, {
      question: patch.question ?? existing.question,
      scenario: patch.scenario ?? existing.scenario ?? undefined,
    });
    if (nextHash !== existing.contentHash) {
      const clash = await prisma.questionBankItem.findUnique({
        where: { contentHash: nextHash },
        select: { id: true },
      });
      if (clash && clash.id !== id) {
        return { ok: false, error: "An identical question already exists in this subject." };
      }
      data.contentHash = nextHash;
    }
  }

  if (Object.keys(changes).length === 0) {
    return { ok: true, changes: {} };
  }

  if (patch.reviewStatus) {
    data.lastReviewedAt = new Date();
  }

  await prisma.questionBankItem.update({ where: { id }, data });
  return { ok: true, changes };
}

export type CreateQuestionInput = {
  fieldId: string;
  subjectId: string;
  question: string;
  scenario?: string;
  options: string[];
  correctAnswer: string;
  explanation: string;
  difficulty?: number;
  itemType?: string;
  blueprintDomain?: string;
  blueprintTopic?: string;
  topicCategory?: string;
  taskCategory?: string;
  patientAgeGroup?: string;
  tags?: string[];
  draft?: boolean;
  diagramUrl?: string;
};

export type CreateResult =
  | { ok: true; id: string }
  | { ok: false; error: string };

export async function createAdminQuestion(input: CreateQuestionInput): Promise<CreateResult> {
  const fieldId = normalizeFieldId(input.fieldId);
  const subjectId = input.subjectId.trim() || "general";
  const contentHash = bankItemContentHash(fieldId, subjectId, {
    question: input.question,
    scenario: input.scenario,
  });

  const clash = await prisma.questionBankItem.findUnique({
    where: { contentHash },
    select: { id: true },
  });
  if (clash) return { ok: false, error: "An identical question already exists." };

  const created = await prisma.questionBankItem.create({
    data: {
      fieldId,
      subjectId,
      question: input.question,
      scenario: input.scenario ?? null,
      options: JSON.stringify(input.options),
      correctAnswer: input.correctAnswer,
      explanation: input.explanation,
      difficulty: input.difficulty ?? null,
      itemType: input.itemType ?? "mcq",
      blueprintDomain: input.blueprintDomain ?? null,
      blueprintTopic: input.blueprintTopic ?? null,
      topicCategory: input.topicCategory ?? null,
      taskCategory: input.taskCategory ?? null,
      patientAgeGroup: input.patientAgeGroup ?? null,
      tags: input.tags && input.tags.length ? JSON.stringify(input.tags) : null,
      source: "manual",
      generationVersion: "admin-manual-v1",
      generationMeta: input.diagramUrl ? { diagramUrl: input.diagramUrl } : undefined,
      contentHash,
      // Drafts are inactive + pending; published items still require QA gating before serving.
      active: !input.draft,
      reviewStatus: input.draft ? "pending" : "approved",
      qaPassed: false,
      lastReviewedAt: input.draft ? null : new Date(),
    },
    select: { id: true },
  });

  return { ok: true, id: created.id };
}

export type BulkAction =
  | "approve"
  | "reject"
  | "flag"
  | "archive"
  | "activate"
  | "qa_pass"
  | "qa_unpass"
  | "set_tags";

export async function bulkUpdateAdminQuestions(
  ids: string[],
  action: BulkAction,
  options?: { tags?: string[] }
): Promise<{ updated: number }> {
  if (!ids.length) return { updated: 0 };

  const where: Prisma.QuestionBankItemWhereInput = { id: { in: ids } };
  let data: Prisma.QuestionBankItemUpdateManyMutationInput = {};

  switch (action) {
    case "approve":
      data = { reviewStatus: "approved", active: true, lastReviewedAt: new Date() };
      break;
    case "reject":
      data = { reviewStatus: "rejected", active: false, lastReviewedAt: new Date() };
      break;
    case "flag":
      data = { reviewStatus: "flagged", lastReviewedAt: new Date() };
      break;
    case "archive":
      data = { active: false };
      break;
    case "activate":
      data = { active: true };
      break;
    case "qa_pass":
      data = { qaPassed: true, qaAuditedAt: new Date() };
      break;
    case "qa_unpass":
      data = { qaPassed: false };
      break;
    case "set_tags":
      data = { tags: JSON.stringify(options?.tags ?? []) };
      break;
  }

  const res = await prisma.questionBankItem.updateMany({ where, data });
  return { updated: res.count };
}

export async function getQuestionFacets(): Promise<AdminQuestionFacets> {
  const [byField, itemTypes, sources, pending, flagged, drafts, qaPassed, all] =
    await Promise.all([
      prisma.questionBankItem.groupBy({ by: ["fieldId"], _count: { _all: true } }),
      prisma.questionBankItem.findMany({
        distinct: ["itemType"],
        select: { itemType: true },
      }),
      prisma.questionBankItem.findMany({
        distinct: ["source"],
        select: { source: true },
      }),
      prisma.questionBankItem.count({ where: { reviewStatus: "pending" } }),
      prisma.questionBankItem.count({ where: { reviewStatus: "flagged" } }),
      prisma.questionBankItem.count({ where: { active: false } }),
      prisma.questionBankItem.count({ where: { qaPassed: true } }),
      prisma.questionBankItem.count(),
    ]);

  return {
    fields: byField
      .map((f) => ({
        fieldId: f.fieldId,
        examName: fieldLabel(f.fieldId),
        count: f._count._all,
      }))
      .sort((a, b) => b.count - a.count),
    itemTypes: itemTypes.map((i) => i.itemType).filter(Boolean).sort(),
    sources: sources.map((s) => s.source).filter(Boolean).sort(),
    totals: { all, pending, flagged, drafts, qaPassed },
  };
}
