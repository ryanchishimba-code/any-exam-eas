import { CACHE_TTL, CACHE_STALE } from "@/lib/cache";
import { cacheAsidePublishedStamp } from "@/lib/inventory/active-inventory-stamp";
import { withDbRetry } from "@/lib/db";
import { resolveQuestionBankReadAccess } from "@/lib/edtech/question-bank-scope";
import {
  ACTIVE_QUESTION_DEFINITION,
  fieldInventoryPayload,
  type FormatCounts,
  type InventoryCategoryCount,
} from "@/lib/inventory/active-questions";
import { getCachedActiveInventory } from "@/lib/marketing/question-bank-counts";
import { getSubjectServedCountsWithRetry } from "@/lib/question-bank-db";

export type SubjectCountsPayload = {
  fieldId: string;
  counts: Record<string, number>;
  total: number;
  formats: FormatCounts | null;
  topicFormats: Record<string, FormatCounts> | null;
  categories: InventoryCategoryCount[];
  categoryLabel: string | null;
  definition: string;
};

/** Server-side serve-ready counts for the question bank topic picker. */
export async function loadSubjectCountsForUser(
  userId: string,
  fieldParam: string
): Promise<SubjectCountsPayload | null> {
  const access = await withDbRetry(
    () => resolveQuestionBankReadAccess(userId, fieldParam),
    "qb-field-access"
  );
  if (!access.ok) return null;

  const fieldId = access.fieldId;

  try {
    const fromInventory = fieldInventoryPayload(fieldId, await getCachedActiveInventory());
    if (fromInventory) {
      return {
        fieldId,
        counts: fromInventory.counts,
        total: fromInventory.total,
        formats: fromInventory.formats,
        topicFormats: fromInventory.topicFormats,
        categories: fromInventory.categories,
        categoryLabel: fromInventory.categoryLabel,
        definition: fromInventory.definition,
      };
    }
  } catch (error) {
    console.error("[subject-counts] inventory lookup failed:", error);
  }

  // Errors propagate after Neon HTTP retries so the question-bank error UI can show.
  const counts = await cacheAsidePublishedStamp(
    ["subject-served-counts", fieldId],
    CACHE_TTL.subjectCatalog,
    () => getSubjectServedCountsWithRetry(fieldId),
    { staleTtlMs: CACHE_STALE.subjectCatalog }
  );
  const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
  return {
    fieldId,
    counts,
    total,
    formats: null,
    topicFormats: null,
    categories: [],
    categoryLabel: null,
    definition: ACTIVE_QUESTION_DEFINITION,
  };
}
