import type { BankItem } from "@/lib/question-bank";

export const PHARMACY_FIELD_ID = "pharmacy";

export function isPharmacyFieldId(fieldId: string): boolean {
  return fieldId === PHARMACY_FIELD_ID;
}

/** Hand-authored, polished, or AI-curated NAPLEX items — served before bulk templates. */
export function isNaplexCuratedItem(
  item: Pick<BankItem, "tags"> & { source?: string | null }
): boolean {
  const tags = item.tags ?? [];
  if (tags.includes("physician-educator")) return true;
  if (tags.includes("naplex-polished")) return true;
  if (tags.includes("curated")) return true;
  if (tags.includes("high-yield") && !tags.includes("bulk-bank")) return true;
  if (item.source === "ai-curated" || item.source === "curated" || item.source === "polished") {
    return true;
  }
  return false;
}

/** Prisma filter: curated NAPLEX rows in a subject bank. */
export function curatedNaplexWhereClause() {
  return {
    OR: [
      { source: { in: ["ai-curated", "curated", "polished", "seed"] } },
      { tags: { contains: "physician-educator" } },
      { tags: { contains: "naplex-polished" } },
      { tags: { contains: "curated" } },
    ],
    NOT: { tags: { contains: "bulk-bank" } },
  };
}

/** Share of a practice pull reserved for curated/best items when available. */
export const NAPLEX_CURATED_SAMPLE_RATIO = 0.85;

export function curatedSampleTarget(want: number, curatedAvailable: number): number {
  if (curatedAvailable <= 0) return 0;
  const ratioTarget = Math.ceil(want * NAPLEX_CURATED_SAMPLE_RATIO);
  return Math.min(curatedAvailable, Math.max(ratioTarget, Math.min(want, curatedAvailable)));
}
