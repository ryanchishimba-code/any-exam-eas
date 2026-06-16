import type { BankItem } from "@/lib/question-bank";

/** Hand-authored AANP FNP physician-educator seeds — auto-pass clinical QA when vignette is valid. */
export function isAanpFnpCuratedItem(item: Pick<BankItem, "tags">): boolean {
  const tags = item.tags ?? [];
  if (tags.includes("physician-educator")) return true;
  if (tags.includes("AANP-FNP-2024") && tags.includes("clinical-vignette")) return true;
  if (tags.includes("aanp-fnp-seed") && !tags.includes("bulk-bank")) return true;
  return false;
}

export const AANP_FNP_CURATED_SAMPLE_RATIO = 0.5;

export function curatedAanpFnpWhereClause() {
  return {
    OR: [
      { tags: { contains: "physician-educator" } },
      { tags: { contains: "aanp-fnp-seed" } },
      { source: "seed" as const },
    ],
    NOT: { tags: { contains: "bulk-bank" } },
  };
}

export function curatedSampleTarget(want: number, curatedAvailable: number): number {
  if (curatedAvailable <= 0) return 0;
  const ratioTarget = Math.ceil(want * AANP_FNP_CURATED_SAMPLE_RATIO);
  return Math.min(curatedAvailable, Math.max(ratioTarget, Math.min(3, curatedAvailable)));
}
