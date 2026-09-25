/**
 * Which bank items a readiness check may use.
 *
 * Tighten this in one place. Call sites must not add a second, looser filter.
 *
 * Current policy (`requireApprovedReview: false`):
 * - The item is already in the served bank (active and qaPassed). The sampler applies that.
 * - It has no open quality flag:
 *   - `reviewFlag` is not true. That flag is the Item QA queue (schema gaps, text
 *     defects, near-duplicates) and the curation "needs review" mark. Rows that
 *     still need a person are classified needs_human until this flag is cleared.
 *   - `reviewStatus` is not flagged or rejected.
 *   - `curationMeta.itemQa.codes` is empty. A stored code is an open flag even
 *     if `reviewFlag` was left unset.
 * - Among items that pass, a higher `qualityScore` is preferred. A missing score
 *   stays eligible. `keepRecommendation` is only a tie-break.
 *
 * RN-reviewed only: set `requireApprovedReview` to true. Eligible items must
 * also have `reviewStatus === "approved"`. Pending and unreviewed rows drop out.
 * Do not pad a short area with flagged items either way.
 */
import type { Prisma } from "@prisma/client";
import { readItemQaRecord } from "@/lib/exam-prep/item-qa/flag";
import { READINESS_THIN_AREA_LABEL } from "@/lib/learning/readiness-check/thresholds";

export { READINESS_THIN_AREA_LABEL };

export const READINESS_ITEM_POLICY = {
  id: "no_open_qa_flag" as const,
  /** Flip to true to require editorial sign-off (reviewStatus "approved"). */
  requireApprovedReview: false,
};

export type ReadinessItemPolicy = {
  requireApprovedReview: boolean;
};

export type ReadinessEligibilityRow = {
  reviewFlag?: boolean | null;
  reviewStatus?: string | null;
  curationMeta?: unknown;
  generationMeta?: unknown;
  qualityScore?: number | null;
  keepRecommendation?: boolean | null;
};

function itemQaCodes(row: ReadinessEligibilityRow): string[] {
  const fromCuration = readItemQaRecord(row.curationMeta);
  if (fromCuration) return fromCuration.codes;
  return readItemQaRecord(row.generationMeta)?.codes ?? [];
}

/** True when a person still needs to clear this row before a readiness check uses it. */
export function readinessItemHasOpenQaFlag(row: ReadinessEligibilityRow): boolean {
  if (row.reviewFlag === true) return true;
  if (row.reviewStatus === "flagged" || row.reviewStatus === "rejected") return true;
  return itemQaCodes(row).length > 0;
}

export function readinessItemIsEligible(
  row: ReadinessEligibilityRow,
  policy: ReadinessItemPolicy = READINESS_ITEM_POLICY
): boolean {
  if (readinessItemHasOpenQaFlag(row)) return false;
  if (policy.requireApprovedReview && row.reviewStatus !== "approved") return false;
  return true;
}

/** Prisma clause for the readiness sampler. Pairs with the in-memory check. */
export function readinessEligibilityWhere(
  policy: ReadinessItemPolicy = READINESS_ITEM_POLICY
): Prisma.QuestionBankItemWhereInput {
  const and: Prisma.QuestionBankItemWhereInput[] = [
    { NOT: { reviewFlag: true } },
    { NOT: { reviewStatus: { in: ["flagged", "rejected"] } } },
  ];
  if (policy.requireApprovedReview) and.push({ reviewStatus: "approved" });
  return { AND: and };
}

function qualityRank(row: ReadinessEligibilityRow): number {
  const score = typeof row.qualityScore === "number" && Number.isFinite(row.qualityScore) ? row.qualityScore : 0;
  const keep =
    row.keepRecommendation === true ? 0.01 : row.keepRecommendation === false ? -0.01 : 0;
  return score + keep;
}

/**
 * Keep the stronger eligible items, then shuffle that band so a retake is not
 * the same sequence. Never reaches past the eligible list to fill `need`.
 */
export function selectReadinessItems<T extends ReadinessEligibilityRow>(
  items: T[],
  need: number,
  policy: ReadinessItemPolicy = READINESS_ITEM_POLICY,
  random: () => number = Math.random
): T[] {
  if (need <= 0) return [];
  const eligible = items.filter((item) => readinessItemIsEligible(item, policy));
  const ranked = [...eligible].sort((a, b) => qualityRank(b) - qualityRank(a));
  const bandSize = Math.min(ranked.length, Math.max(need, Math.min(ranked.length, need * 3)));
  const band = ranked.slice(0, bandSize);
  for (let i = band.length - 1; i > 0; i -= 1) {
    const j = Math.floor(random() * (i + 1));
    const current = band[i]!;
    band[i] = band[j]!;
    band[j] = current;
  }
  return band.slice(0, need);
}
