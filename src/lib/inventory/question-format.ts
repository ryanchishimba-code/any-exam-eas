/**
 * Question-format buckets with no database import.
 * Client practice UI imports this module. The inventory query stays in
 * `active-questions.ts`.
 */

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
