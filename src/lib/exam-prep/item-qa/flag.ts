/** Shape written to QuestionBankItem.curationMeta.itemQa by the audit script. */

export const ITEM_QA_PIPELINE = "item-qa-v1" as const;

/** Code the audit stores on the higher id of a duplicate pair. The lower id is kept. */
export const NEAR_DUPLICATE_CODE = "near_duplicate" as const;

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
