import { applyScoredClinicalCatalog } from "@/lib/counts";
import { formatBoardQuestionSentence, boardQuestionUnits } from "@/lib/counts";
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
  /** QuestionBankItem rows only. The practice wheel uses this so a standard set is not sized with case-study items. */
  sessionCounts: Record<string, number>;
  total: number;
  bankItemTotal: number;
  formats: FormatCounts | null;
  topicFormats: Record<string, FormatCounts> | null;
  categories: InventoryCategoryCount[];
  categoryLabel: string | null;
  definition: string;
  questionSentence: string | null;
  caseStudies: number;
  caseItems: number;
  standaloneNgn: number;
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
      const { loadPublishedClinicalBank } = await import("@/lib/assessment/serve-db");
      const bank = await loadPublishedClinicalBank(fieldId).catch(() => null);
      const scored = applyScoredClinicalCatalog({
        fieldId,
        bankTotal: fromInventory.total,
        topicCounts: fromInventory.counts,
        formats: fromInventory.formats,
        topicFormats: fromInventory.topicFormats,
        categories: fromInventory.categories,
        catalog: bank?.catalog ?? null,
      });
      const units = boardQuestionUnits({
        slug: fieldId === "nursing" ? "nclex" : "usmle",
        bankItems: fromInventory.total,
        formats: fromInventory.formats,
        clinical: scored.clinical,
      });
      return {
        fieldId,
        counts: scored.topicCounts,
        sessionCounts: scored.sessionCounts,
        total: scored.total,
        bankItemTotal: scored.bankItemTotal,
        formats: scored.formats,
        topicFormats: scored.topicFormats,
        categories: scored.categories,
        categoryLabel: fromInventory.categoryLabel,
        definition: fromInventory.definition,
        questionSentence:
          scored.clinical.standaloneNgn > 0 || scored.clinical.caseStudies > 0
            ? formatBoardQuestionSentence(units)
            : null,
        caseStudies: scored.clinical.caseStudies,
        caseItems: scored.clinical.caseItems,
        standaloneNgn: scored.clinical.standaloneNgn,
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
    sessionCounts: counts,
    total,
    bankItemTotal: total,
    formats: null,
    topicFormats: null,
    categories: [],
    categoryLabel: null,
    definition: ACTIVE_QUESTION_DEFINITION,
    questionSentence: null,
    caseStudies: 0,
    caseItems: 0,
    standaloneNgn: 0,
  };
}
