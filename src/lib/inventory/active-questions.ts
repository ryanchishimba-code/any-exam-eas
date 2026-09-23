/**
 * Active question inventory — one definition for the Qbank and marketing.
 *
 * Active means published and not retired: a unique QuestionBankItem row with
 * active = true and qaPassed = true, excluding legacy Step 3 rows filed on the
 * Step 2 field (the Qbank does not serve those). Memory cards and library case
 * sets are not questions and are not included.
 *
 * Counts partition into MCQ, NGN-style, and case. A row is counted once.
 * Case membership uses item type (case study, unfolding case, CCS). A
 * caseGroupId buried only in generation JSON is not scanned — that column is
 * large, and the Qbank count has to stay on the indexed serve filter.
 */
import type { ExamRouteSlug } from "@/lib/routes";
import { withDbRetry, sql } from "@/lib/db";
import { getExamBlueprint } from "@/lib/engine/blueprints";
import { USMLE_FIELD_IDS } from "@/lib/exam-prep/usmle/steps";

export const ACTIVE_QUESTION_DEFINITION =
  "Active means published and not retired: unique questions still available to practice. Drafts, retired items, memory cards, and library case sets are not included.";

export const ACTIVE_COUNT_UNAVAILABLE =
  "Live bank count is unavailable, so this figure is the published floor — not the current Qbank total.";

/** Practice fields whose rows are allowed into the inventory. */
export const INVENTORY_FIELD_IDS = [
  "nursing",
  "usmle-step-1",
  "usmle-step-2",
  "usmle-step-3",
  "pharmacy",
  "pance",
  "aanp-fnp",
  "npte-pt",
] as const;

export type InventoryFieldId = (typeof INVENTORY_FIELD_IDS)[number];

const INVENTORY_FIELD_SET = new Set<string>(INVENTORY_FIELD_IDS);

const BOARD_FIELDS: Record<ExamRouteSlug, readonly InventoryFieldId[]> = {
  nclex: ["nursing"],
  usmle: USMLE_FIELD_IDS,
  naplex: ["pharmacy"],
  pance: ["pance"],
  "aanp-fnp": ["aanp-fnp"],
  "npte-pt": ["npte-pt"],
};

export const CASE_ITEM_TYPES = new Set([
  "case_study",
  "case_based",
  "unfolding_case",
  "ccs_prompt",
]);

/** Structured formats counted separately from single-best-answer MCQs. */
export const NGN_ITEM_TYPES = new Set([
  "select_all",
  "sata",
  "ngn_bowtie",
  "bow_tie",
  "ngn_matrix",
  "matrix",
  "ordered_response",
  "ngn_highlight",
  "highlight",
  "drag_drop",
  "constructed_response",
]);

export type QuestionFormatBucket = "mcq" | "ngn" | "case";

export type FormatCounts = Record<QuestionFormatBucket, number>;

export type InventoryTopicCount = {
  id: string;
  count: number;
};

export type InventoryCategoryCount = {
  id: string;
  label: string;
  count: number;
};

export type FieldActiveInventory = {
  fieldId: string;
  active: number;
  formats: FormatCounts;
  topics: InventoryTopicCount[];
  categories: InventoryCategoryCount[];
  categoryLabel: "Client Needs" | "Blueprint topics";
};

export type BoardActiveInventory = {
  slug: ExamRouteSlug;
  active: number;
  formats: FormatCounts;
  topicCount: number;
  categories: InventoryCategoryCount[];
  categoryLabel: "Client Needs" | "Blueprint topics";
  /** Set when the board total spans more than the field open in the Qbank. */
  scopeNote: string | null;
};

export type ActiveQuestionInventory = {
  definition: string;
  updatedAt: string;
  degraded: boolean;
  fields: Record<string, FieldActiveInventory>;
  boards: Record<ExamRouteSlug, BoardActiveInventory>;
};

export type ActiveInventoryRow = {
  fieldId: string;
  subjectId: string | null;
  clientNeeds: string | null;
  itemType: string | null;
  hasCaseGroup: boolean;
  count: number;
};

export function emptyFormatCounts(): FormatCounts {
  return { mcq: 0, ngn: 0, case: 0 };
}

export function classifyQuestionFormat(
  itemType: string | null | undefined,
  hasCaseGroup = false
): QuestionFormatBucket {
  if (hasCaseGroup) return "case";
  const type = (itemType ?? "mcq").trim().toLowerCase();
  if (CASE_ITEM_TYPES.has(type)) return "case";
  if (NGN_ITEM_TYPES.has(type)) return "ngn";
  return "mcq";
}

/** Item types that inventory counts in one deliberate-practice bucket. */
export function itemTypesForFormatBucket(bucket: "ngn" | "case"): readonly string[] {
  return [...(bucket === "ngn" ? NGN_ITEM_TYPES : CASE_ITEM_TYPES)];
}

/**
 * Prisma filter matching classifyQuestionFormat(itemType, false).
 * Inventory does not scan caseGroupId, so this filter does not either.
 */
export function formatBucketItemTypeWhere(bucket: "ngn" | "case") {
  return {
    OR: itemTypesForFormatBucket(bucket).map((itemType) => ({
      itemType: { equals: itemType, mode: "insensitive" as const },
    })),
  };
}

export function formatInventoryFormatLine(
  formats: FormatCounts,
  ngnLabel = "NGN"
): string | null {
  if (formats.ngn <= 0 && formats.case <= 0) return null;
  const parts = [`${formats.mcq.toLocaleString("en-US")} MCQ`];
  if (formats.ngn > 0) {
    parts.push(`${formats.ngn.toLocaleString("en-US")} ${ngnLabel}`);
  }
  if (formats.case > 0) {
    const noun = formats.case === 1 ? "case" : "cases";
    parts.push(`${formats.case.toLocaleString("en-US")} ${noun}`);
  }
  return parts.join(" · ");
}

function categoryLabelForField(fieldId: string): "Client Needs" | "Blueprint topics" {
  return fieldId === "nursing" ? "Client Needs" : "Blueprint topics";
}

function humanizeId(id: string): string {
  return id
    .split("-")
    .filter(Boolean)
    .map((part) => part.charAt(0).toUpperCase() + part.slice(1))
    .join(" ");
}

function categoryMeta(
  fieldId: string,
  categoryId: string
): { label: string; order: number } {
  const categories = getExamBlueprint(fieldId)?.categories ?? [];
  const index = categories.findIndex(
    (category) =>
      category.id === categoryId || category.subjectIds?.includes(categoryId)
  );
  if (index === -1) return { label: humanizeId(categoryId), order: 1000 };
  return { label: categories[index]!.label, order: index };
}

function categoryIdForRow(
  fieldId: string,
  subjectId: string,
  clientNeeds: string | null
): string | null {
  const explicit = clientNeeds?.trim();
  if (explicit) return explicit;
  const categories = getExamBlueprint(fieldId)?.categories ?? [];
  const match = categories.find(
    (category) => category.id === subjectId || category.subjectIds?.includes(subjectId)
  );
  return match?.id ?? null;
}

function emptyField(fieldId: string): FieldActiveInventory {
  return {
    fieldId,
    active: 0,
    formats: emptyFormatCounts(),
    topics: [],
    categories: [],
    categoryLabel: categoryLabelForField(fieldId),
  };
}

function emptyBoard(slug: ExamRouteSlug): BoardActiveInventory {
  return {
    slug,
    active: 0,
    formats: emptyFormatCounts(),
    topicCount: 0,
    categories: [],
    categoryLabel: slug === "nclex" ? "Client Needs" : "Blueprint topics",
    scopeNote:
      slug === "usmle"
        ? "Across Step 1, Step 2 CK, and Step 3. The Qbank count is the step you have open."
        : null,
  };
}

export function emptyActiveInventory(degraded: boolean): ActiveQuestionInventory {
  const fields = Object.fromEntries(
    INVENTORY_FIELD_IDS.map((fieldId) => [fieldId, emptyField(fieldId)])
  );
  const boards = Object.fromEntries(
    (Object.keys(BOARD_FIELDS) as ExamRouteSlug[]).map((slug) => [slug, emptyBoard(slug)])
  ) as Record<ExamRouteSlug, BoardActiveInventory>;

  return {
    definition: ACTIVE_QUESTION_DEFINITION,
    updatedAt: new Date().toISOString(),
    degraded,
    fields,
    boards,
  };
}

type FieldAccum = {
  formats: FormatCounts;
  topics: Map<string, number>;
  categories: Map<string, number>;
};

export function aggregateActiveInventory(rows: ActiveInventoryRow[]): ActiveQuestionInventory {
  const inventory = emptyActiveInventory(false);
  const acc = new Map<string, FieldAccum>();

  for (const fieldId of INVENTORY_FIELD_IDS) {
    acc.set(fieldId, {
      formats: emptyFormatCounts(),
      topics: new Map(),
      categories: new Map(),
    });
  }

  for (const row of rows) {
    if (!INVENTORY_FIELD_SET.has(row.fieldId)) continue;
    const count = Math.max(0, Math.floor(row.count) || 0);
    if (count === 0) continue;
    const bucket = acc.get(row.fieldId);
    if (!bucket) continue;

    const format = classifyQuestionFormat(row.itemType, row.hasCaseGroup);
    bucket.formats[format] += count;

    const subjectId = row.subjectId?.trim() || "unassigned";
    bucket.topics.set(subjectId, (bucket.topics.get(subjectId) ?? 0) + count);

    const categoryId = categoryIdForRow(row.fieldId, subjectId, row.clientNeeds);
    if (categoryId) {
      bucket.categories.set(categoryId, (bucket.categories.get(categoryId) ?? 0) + count);
    }
  }

  for (const fieldId of INVENTORY_FIELD_IDS) {
    const bucket = acc.get(fieldId)!;
    const topics = [...bucket.topics.entries()]
      .map(([id, count]) => ({ id, count }))
      .sort((a, b) => b.count - a.count || a.id.localeCompare(b.id));
    const categories = [...bucket.categories.entries()]
      .map(([id, count]) => {
        const meta = categoryMeta(fieldId, id);
        return { id, label: meta.label, count, order: meta.order };
      })
      .sort((a, b) => a.order - b.order || a.label.localeCompare(b.label))
      .map(({ id, label, count }) => ({ id, label, count }));
    const active = bucket.formats.mcq + bucket.formats.ngn + bucket.formats.case;
    inventory.fields[fieldId] = {
      fieldId,
      active,
      formats: bucket.formats,
      topics,
      categories,
      categoryLabel: categoryLabelForField(fieldId),
    };
  }

  for (const slug of Object.keys(BOARD_FIELDS) as ExamRouteSlug[]) {
    const fieldIds = BOARD_FIELDS[slug];
    const formats = emptyFormatCounts();
    const topics = new Set<string>();
    const categories = new Map<string, InventoryCategoryCount>();
    for (const fieldId of fieldIds) {
      const field = inventory.fields[fieldId]!;
      formats.mcq += field.formats.mcq;
      formats.ngn += field.formats.ngn;
      formats.case += field.formats.case;
      for (const topic of field.topics) topics.add(topic.id);
      for (const category of field.categories) {
        const prev = categories.get(category.id);
        if (prev) prev.count += category.count;
        else categories.set(category.id, { ...category });
      }
    }
    const orderField = fieldIds[0] ?? "nursing";
    const orderedCategories = [...categories.values()].sort((a, b) => {
      const ao = categoryMeta(orderField, a.id).order;
      const bo = categoryMeta(orderField, b.id).order;
      return ao - bo || a.label.localeCompare(b.label);
    });
    inventory.boards[slug] = {
      ...emptyBoard(slug),
      active: formats.mcq + formats.ngn + formats.case,
      formats,
      topicCount: topics.size,
      categories: orderedCategories,
      categoryLabel: slug === "nclex" ? "Client Needs" : "Blueprint topics",
    };
  }

  inventory.updatedAt = new Date().toISOString();
  inventory.degraded = false;
  return inventory;
}

type DbInventoryRow = {
  fieldId: string;
  subjectId: string | null;
  clientNeeds: string | null;
  itemType: string | null;
  hasCaseGroup: boolean | string | number | null;
  count: number | string;
};

function normalizeDbRow(row: DbInventoryRow): ActiveInventoryRow {
  const hasCaseGroup =
    row.hasCaseGroup === true ||
    row.hasCaseGroup === 1 ||
    row.hasCaseGroup === "t" ||
    row.hasCaseGroup === "true";
  const count = typeof row.count === "number" ? row.count : Number(row.count);
  return {
    fieldId: row.fieldId,
    subjectId: row.subjectId,
    clientNeeds: row.clientNeeds || null,
    itemType: row.itemType,
    hasCaseGroup,
    count: Number.isFinite(count) ? count : 0,
  };
}

async function queryActiveInventoryRows(): Promise<DbInventoryRow[]> {
  const rows = await sql`
    SELECT
      "fieldId",
      "subjectId",
      COALESCE(NULLIF(BTRIM("clientNeeds"), ''), '') AS "clientNeeds",
      COALESCE(NULLIF(BTRIM("itemType"), ''), 'mcq') AS "itemType",
      false AS "hasCaseGroup",
      COUNT(*)::int AS count
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND "fieldId" IN (
        'nursing',
        'usmle-step-1',
        'usmle-step-2',
        'usmle-step-3',
        'pharmacy',
        'pance',
        'aanp-fnp',
        'npte-pt'
      )
      AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')
    GROUP BY 1, 2, 3, 4
  `;
  return rows as DbInventoryRow[];
}

/** Live unique active questions. Returns a degraded snapshot instead of throwing. */
export async function fetchActiveInventoryFromDb(): Promise<ActiveQuestionInventory> {
  try {
    const rows = await withDbRetry(
      () => queryActiveInventoryRows(),
      "active-question-inventory"
    );
    return aggregateActiveInventory(rows.map(normalizeDbRow));
  } catch (error) {
    console.error("[inventory] active question lookup failed:", error);
    return emptyActiveInventory(true);
  }
}

export type FieldInventoryPayload = {
  field: string;
  counts: Record<string, number>;
  total: number;
  formats: FormatCounts | null;
  categories: InventoryCategoryCount[];
  categoryLabel: string | null;
  definition: string;
};

/** Topic map plus format/category split for one Qbank field. Null when inventory is degraded. */
export function fieldInventoryPayload(
  fieldId: string,
  inventory: ActiveQuestionInventory
): FieldInventoryPayload | null {
  if (inventory.degraded) return null;
  const field = inventory.fields[fieldId];
  if (!field) return null;
  return {
    field: fieldId,
    counts: Object.fromEntries(field.topics.map((topic) => [topic.id, topic.count])),
    total: field.active,
    formats: field.formats,
    categories: field.categories,
    categoryLabel: field.categoryLabel,
    definition: inventory.definition,
  };
}

export type BoardInventoryPresentation = {
  formatLine: string | null;
  definition: string;
  categories: InventoryCategoryCount[];
  categoryLabel: string;
  scopeNote: string | null;
  countSource: "active-inventory" | "published-floor";
  activeCount: number | null;
};

/** Copy and breakdown for a board hub. Live counts and the floor never share a definition line. */
export function presentBoardInventory(input: {
  slug: ExamRouteSlug;
  usingLiveCount: boolean;
  board: BoardActiveInventory | null;
}): BoardInventoryPresentation {
  if (!input.usingLiveCount || !input.board || input.board.active <= 0) {
    return {
      formatLine: null,
      definition: ACTIVE_COUNT_UNAVAILABLE,
      categories: [],
      categoryLabel: input.slug === "nclex" ? "Client Needs" : "Blueprint topics",
      scopeNote: null,
      countSource: "published-floor",
      activeCount: null,
    };
  }

  const ngnLabel = input.slug === "nclex" ? "NGN" : "NGN-style";
  return {
    formatLine: formatInventoryFormatLine(input.board.formats, ngnLabel),
    definition: ACTIVE_QUESTION_DEFINITION,
    categories: input.board.categories,
    categoryLabel: input.board.categoryLabel,
    scopeNote: input.board.scopeNote,
    countSource: "active-inventory",
    activeCount: input.board.active,
  };
}
