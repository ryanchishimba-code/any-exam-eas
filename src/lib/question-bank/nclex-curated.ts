import type { BankItem } from "@/lib/question-bank";

export const NURSING_FIELD_ID = "nursing";

export function isNursingFieldId(fieldId: string): boolean {
  return fieldId === NURSING_FIELD_ID;
}

/** Polished, hand-authored, or AI-curated NCLEX items — the only pool we prefer to serve. */
export function isNclexCuratedItem(
  item: Pick<BankItem, "tags"> & { source?: string | null }
): boolean {
  const tags = item.tags ?? [];
  if (tags.includes("curated")) return true;
  if (tags.includes("cjmm-polished")) return true;
  if (tags.includes("nclex-ngn")) return true;
  if (tags.includes("high-yield") && !tags.includes("generated")) return true;
  if (item.source === "ai-curated" || item.source === "curated" || item.source === "polished") {
    return true;
  }
  return false;
}

/** Prisma filter: best-quality NCLEX rows (qaPassed applied separately). */
export function curatedNclexWhereClause() {
  return {
    OR: [
      { source: { in: ["ai-curated", "curated", "polished"] } },
      { tags: { contains: "curated" } },
      { tags: { contains: "cjmm-polished" } },
      { tags: { contains: "nclex-ngn" } },
    ],
    NOT: { tags: { contains: "generated" } },
  };
}

/** When best items exist, fill the entire pull from them. */
export const NCLEX_CURATED_SAMPLE_RATIO = 1;

export function curatedSampleTarget(want: number, curatedAvailable: number): number {
  if (curatedAvailable <= 0) return 0;
  const ratioTarget = Math.ceil(want * NCLEX_CURATED_SAMPLE_RATIO);
  return Math.min(curatedAvailable, Math.max(ratioTarget, Math.min(want, curatedAvailable)));
}
