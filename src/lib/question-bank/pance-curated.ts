import type { BankItem } from "@/lib/question-bank";

/** Hand-authored PANCE physician-educator seeds — auto-pass clinical QA. */
export function isPanceCuratedItem(item: Pick<BankItem, "tags">): boolean {
  const tags = item.tags ?? [];
  if (tags.includes("physician-educator")) return true;
  if (tags.includes("PANCE-2025") && tags.includes("clinical-vignette")) return true;
  if (tags.includes("pance-seed") && !tags.includes("bulk-bank")) return true;
  return false;
}

export const PANCE_CURATED_SAMPLE_RATIO = 0.5;

export function curatedPanceWhereClause() {
  return {
    OR: [
      { tags: { contains: "physician-educator" } },
      { tags: { contains: "pance-seed" } },
      { source: "seed" as const },
    ],
    NOT: { tags: { contains: "bulk-bank" } },
  };
}

export function curatedSampleTarget(want: number, curatedAvailable: number): number {
  if (curatedAvailable <= 0) return 0;
  const ratioTarget = Math.ceil(want * PANCE_CURATED_SAMPLE_RATIO);
  return Math.min(curatedAvailable, Math.max(ratioTarget, Math.min(3, curatedAvailable)));
}
