/** Shape written to QuestionBankItem.curationMeta.itemQa by the audit script. */

export const ITEM_QA_PIPELINE = "item-qa-v1" as const;

/** Code the audit stores on the higher id of a duplicate pair. The lower id is kept. */
export const NEAR_DUPLICATE_CODE = "near_duplicate" as const;

/**
 * Umbrella code for the Item QA queue. Specific rationale gaps are stored beside it.
 * Citation is optional, so a missing citation is not a schema failure.
 */
export const FAILS_SCHEMA_CODE = "fails_schema" as const;

const RATIONALE_SCHEMA_ERROR_CODES = [
  "missing_correct_explanation",
  "missing_distractor_reason",
  "missing_governing_principle",
] as const;

export function isSchemaQaCode(code: string): boolean {
  return (
    code === FAILS_SCHEMA_CODE ||
    (RATIONALE_SCHEMA_ERROR_CODES as readonly string[]).includes(code)
  );
}

export function schemaFailureCodesFromIssues(
  issues: Array<{ area?: string; code: string; severity: string }>
): string[] {
  const specific = [
    ...new Set(
      issues
        .filter(
          (issue) =>
            issue.severity === "error" &&
            issue.area === "rationale" &&
            (RATIONALE_SCHEMA_ERROR_CODES as readonly string[]).includes(issue.code)
        )
        .map((issue) => issue.code)
    ),
  ];
  if (!specific.length) return [];
  return [FAILS_SCHEMA_CODE, ...specific];
}

/**
 * Why a row was soft-deactivated. Near-duplicate retirement and text-flag
 * retirement share this field. They do not hard-delete the row.
 */
export const ITEM_QA_RETIRED_REASONS = [
  "near_duplicate",
  "empty_stem",
  "truncated_option",
  "letter_only_option",
  "empty_option",
] as const;

export type ItemQaRetiredReason = (typeof ITEM_QA_RETIRED_REASONS)[number];

export type ItemQaRecord = {
  pipeline: typeof ITEM_QA_PIPELINE;
  checkedAt: string;
  codes: string[];
  summary: string;
  partnerId?: string;
  /** Set when a retire tool deactivates this row. */
  retiredAt?: string;
  retiredReason?: ItemQaRetiredReason;
};

export function readItemQaRecord(meta: unknown): ItemQaRecord | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const raw = (meta as Record<string, unknown>).itemQa;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Partial<ItemQaRecord>;
  if (record.pipeline !== ITEM_QA_PIPELINE) return null;
  if (!Array.isArray(record.codes) || typeof record.summary !== "string") return null;
  const partnerId = typeof record.partnerId === "string" ? record.partnerId : undefined;
  const retiredAt = typeof record.retiredAt === "string" ? record.retiredAt : undefined;
  const retiredReason = ITEM_QA_RETIRED_REASONS.includes(record.retiredReason as ItemQaRetiredReason)
    ? (record.retiredReason as ItemQaRetiredReason)
    : undefined;
  return {
    pipeline: ITEM_QA_PIPELINE,
    checkedAt: typeof record.checkedAt === "string" ? record.checkedAt : "",
    codes: record.codes.filter((code): code is string => typeof code === "string"),
    summary: record.summary,
    ...(partnerId ? { partnerId } : {}),
    ...(retiredAt ? { retiredAt } : {}),
    ...(retiredReason ? { retiredReason } : {}),
  };
}

export function withItemQaRecord(meta: unknown, record: ItemQaRecord | null): Record<string, unknown> {
  const base =
    meta && typeof meta === "object" && !Array.isArray(meta)
      ? { ...(meta as Record<string, unknown>) }
      : {};
  if (!record) {
    delete base.itemQa;
    return base;
  }
  base.itemQa = record;
  return base;
}

type SchemaIssue = { area?: string; code: string; severity: string; message?: string };

/** Queue a schema failure on the existing Item QA record. Does not touch item text. */
export function withSchemaFailureFlag(
  meta: unknown,
  issues: SchemaIssue[],
  checkedAt: string
): { reviewFlag: true; curationMeta: Record<string, unknown> } | null {
  const schemaCodes = schemaFailureCodesFromIssues(issues);
  if (!schemaCodes.length) return null;
  const existing = readItemQaRecord(meta);
  const kept = (existing?.codes ?? []).filter((code) => !isSchemaQaCode(code));
  const codes = [...kept, ...schemaCodes.filter((code) => !kept.includes(code))];
  const schemaSummary =
    issues
      .filter((issue) => issue.severity === "error" && issue.area === "rationale" && issue.message)
      .slice(0, 4)
      .map((issue) => issue.message)
      .join(" ") || "Fails the rationale schema.";
  const summary = [kept.length ? `Also queued: ${kept.join(", ")}.` : "", schemaSummary]
    .filter(Boolean)
    .join(" ");
  const record: ItemQaRecord = {
    pipeline: ITEM_QA_PIPELINE,
    checkedAt,
    codes,
    summary,
    ...(existing?.partnerId ? { partnerId: existing.partnerId } : {}),
    ...(existing?.retiredAt ? { retiredAt: existing.retiredAt } : {}),
    ...(existing?.retiredReason ? { retiredReason: existing.retiredReason } : {}),
  };
  return { reviewFlag: true, curationMeta: withItemQaRecord(meta, record) };
}

/** Drop schema codes after an edit meets the schema. Other Item QA codes stay queued. */
export function withoutSchemaFailureFlag(
  meta: unknown,
  checkedAt: string
): { reviewFlag: boolean; curationMeta: Record<string, unknown> } | null {
  const existing = readItemQaRecord(meta);
  if (!existing?.codes.some((code) => isSchemaQaCode(code))) return null;
  const codes = existing.codes.filter((code) => !isSchemaQaCode(code));
  if (!codes.length) {
    if (existing.retiredReason) {
      return {
        reviewFlag: false,
        curationMeta: withItemQaRecord(meta, { ...existing, codes: [], checkedAt }),
      };
    }
    return { reviewFlag: false, curationMeta: withItemQaRecord(meta, null) };
  }
  return {
    reviewFlag: true,
    curationMeta: withItemQaRecord(meta, { ...existing, codes, checkedAt }),
  };
}
