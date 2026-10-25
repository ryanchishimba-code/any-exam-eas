import { NextResponse } from "next/server";
import { boardQuestionUnits, formatBoardQuestionSentence } from "@/lib/counts";
import { getScoredFieldInventory } from "@/lib/inventory/scored-field-inventory";
import {
  countActiveQuestionBankItemsByBlueprintTopics,
  getSubjectServedCountsWithRetry,
} from "@/lib/question-bank-db";
import { nclexBlueprintTopicsForCount } from "@/lib/study/topic-practice-filters";
import { ACTIVE_QUESTION_DEFINITION } from "@/lib/inventory/active-questions";
import { ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL } from "@/lib/inventory/active-inventory-cache";
import { CACHE_TTL, CACHE_STALE } from "@/lib/cache";
import { cacheAsidePublishedStamp } from "@/lib/inventory/active-inventory-stamp";
import { respondDbUnavailable } from "@/lib/api-db-error";

export const runtime = "nodejs";

/**
 * Active question counts per subject for a single exam field.
 *
 * Trust contract: counts come from the active inventory (published, not retired),
 * the same helper marketing uses. If that lookup is degraded, fall back to the
 * serve-path subject counts so the topic picker still matches what practice draws.
 */
export async function GET(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  const url = new URL(req.url);
  const field = url.searchParams.get("field");
  if (!field) {
    return NextResponse.json({ error: "Missing field" }, { status: 400 });
  }
  const blueprintTopicsParam = url.searchParams.get("blueprintTopics")?.trim();
  const blueprintTopics = blueprintTopicsParam
    ? blueprintTopicsParam
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean)
    : undefined;

  const { resolveQuestionBankReadAccess } = await import("@/lib/edtech/question-bank-scope");
  const access = await resolveQuestionBankReadAccess(premium.userId, field);
  if (!access.ok) return access.response;

  const fieldId = access.fieldId;

  let topicPracticePoolCount: number | undefined;
  if (blueprintTopics?.length && fieldId === "nursing") {
    topicPracticePoolCount = await countActiveQuestionBankItemsByBlueprintTopics({
      fieldId,
      blueprintTopics: nclexBlueprintTopicsForCount(blueprintTopics),
    });
  }

  try {
    const fromInventory = await getScoredFieldInventory(fieldId);
    if (fromInventory) {
      const scored = fromInventory.scored;
      const units = boardQuestionUnits({
        slug: "nclex",
        bankItems: fromInventory.bankTotal,
        formats: fromInventory.formats,
        clinical: scored.clinical,
      });
      return NextResponse.json(
        {
          field: fieldId,
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
          ...(topicPracticePoolCount != null
            ? { topicPracticePoolCount }
            : {}),
        },
        {
          headers: { "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL },
        }
      );
    }

    const counts = await cacheAsidePublishedStamp(
      ["subject-served-counts", fieldId],
      CACHE_TTL.subjectCatalog,
      () => getSubjectServedCountsWithRetry(fieldId),
      { staleTtlMs: CACHE_STALE.subjectCatalog }
    );

    const total = Object.values(counts).reduce((sum, n) => sum + n, 0);
    return NextResponse.json({
      field: fieldId,
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
      ...(topicPracticePoolCount != null ? { topicPracticePoolCount } : {}),
    });
  } catch (error) {
    const dbResponse = respondDbUnavailable(error);
    if (dbResponse) return dbResponse;
    console.error("[questions/subject-counts] lookup failed:", error);
    return NextResponse.json(
      {
        field: fieldId,
        counts: {},
        total: 0,
        dbError: true,
        error: "Could not load topic counts. Try again in a moment.",
      },
      { status: 503 }
    );
  }
}
