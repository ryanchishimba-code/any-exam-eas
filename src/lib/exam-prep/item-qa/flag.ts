/** Shape written to QuestionBankItem.curationMeta.itemQa by the audit script. */

export const ITEM_QA_PIPELINE = "item-qa-v1" as const;

export type ItemQaRecord = {
  pipeline: typeof ITEM_QA_PIPELINE;
  checkedAt: string;
  codes: string[];
  summary: string;
  partnerId?: string;
};

export function readItemQaRecord(meta: unknown): ItemQaRecord | null {
  if (!meta || typeof meta !== "object" || Array.isArray(meta)) return null;
  const raw = (meta as Record<string, unknown>).itemQa;
  if (!raw || typeof raw !== "object" || Array.isArray(raw)) return null;
  const record = raw as Partial<ItemQaRecord>;
  if (record.pipeline !== ITEM_QA_PIPELINE) return null;
  if (!Array.isArray(record.codes) || typeof record.summary !== "string") return null;
  return {
    pipeline: ITEM_QA_PIPELINE,
    checkedAt: typeof record.checkedAt === "string" ? record.checkedAt : "",
    codes: record.codes.filter((code): code is string => typeof code === "string"),
    summary: record.summary,
    partnerId: typeof record.partnerId === "string" ? record.partnerId : undefined,
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
