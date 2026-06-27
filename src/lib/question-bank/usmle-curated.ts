import type { BankItem } from "@/lib/question-bank";

const USMLE_FIELD_PREFIX = "usmle";

export function isUsmleFieldId(fieldId: string): boolean {
  return fieldId.startsWith(USMLE_FIELD_PREFIX);
}

/** Hand-authored or editorial QA seeds — served before bulk-polished templates. */
export function isUsmleCuratedItem(item: Pick<BankItem, "tags">): boolean {
  const tags = item.tags ?? [];
  if (tags.includes("physician-educator")) return true;
  if (tags.includes("clinical-vignette") && !tags.includes("bulk-bank")) return true;
  if (tags.includes("v2") && !tags.includes("bulk-bank") && !tags.includes("usmle-polished")) {
    return true;
  }
  if (tags.includes("edtech-seed") && !tags.includes("bulk-bank")) return true;
  return false;
}

/** Prisma filter: exam-ready USMLE rows preferred in subject sampling. */
export function curatedUsmleWhereClause() {
  return {
    OR: [
      { source: { in: ["ai-curated", "curated", "polished", "seed", "generated"] } },
      { tags: { contains: "physician-educator" } },
      { tags: { contains: "clinical-vignette" } },
      { tags: { contains: "edtech-seed" } },
    ],
    NOT: { tags: { contains: "bulk-bank" } },
  };
}

/** Share of a practice pull from exam-ready curated rows when available. */
export const USMLE_CURATED_SAMPLE_RATIO = 0.85;

export function curatedSampleTarget(want: number, curatedAvailable: number): number {
  if (curatedAvailable <= 0) return 0;
  const ratioTarget = Math.ceil(want * USMLE_CURATED_SAMPLE_RATIO);
  return Math.min(curatedAvailable, ratioTarget, want);
}
