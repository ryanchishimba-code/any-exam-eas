import { NextResponse } from "next/server";
import {
  getRecommendedSubjects,
  getSubjectCatalog,
  getTrendingSubjects,
} from "@/lib/subjects/catalog";
import { ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL } from "@/lib/inventory/active-inventory-cache";
import { getCachedActiveInventory } from "@/lib/marketing/question-bank-counts";
import { sqlQuery } from "@/lib/db";
import { studentEligibleAndSql } from "@/lib/exam-prep/student-eligibility-sql";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

/** Inventory totals in this payload follow the published stamp, not a 60s module cache. */
export const dynamic = "force-dynamic";

type CatalogPayload = {
  subjects: Array<
    ReturnType<typeof getSubjectCatalog>[number] & {
      questionCount: number;
      topicCount: number;
    }
  >;
  trending: ReturnType<typeof getTrendingSubjects>;
  recommended: ReturnType<typeof getRecommendedSubjects>;
  totalQuestions: number;
  updatedAt: string;
};

async function countQuestionsByField(): Promise<Map<string, number>> {
  try {
    const inventory = await getCachedActiveInventory();
    if (!inventory.degraded) {
      return new Map(
        Object.values(inventory.fields).map((field) => [field.fieldId, field.active])
      );
    }
  } catch (error) {
    console.error("[catalog/subjects] inventory counts failed:", error);
  }

  const rows = (await sqlQuery(
    `
    SELECT "fieldId", COUNT(*)::int AS count
    FROM "QuestionBankItem"
    WHERE active = true
      AND "qaPassed" = true
      AND NOT ("fieldId" = 'usmle-step-2' AND "stepLevel" = 'step3')
      ${studentEligibleAndSql()}
    GROUP BY "fieldId"
    `,
    []
  )) as Array<{ fieldId: string; count: number }>;
  return new Map(rows.map((row) => [row.fieldId, Number(row.count) || 0]));
}

export async function GET() {
  try {
    const catalog = getSubjectCatalog();
    const counts = await countQuestionsByField();

    const enriched = catalog.map((entry) => ({
      ...entry,
      questionCount: counts.get(entry.fieldId) ?? 0,
      topicCount: getSubjectsForFieldId(entry.fieldId).length,
    }));

    const totalQuestions = enriched.reduce((n, e) => n + e.questionCount, 0);

    const payload: CatalogPayload = {
      subjects: enriched,
      trending: getTrendingSubjects(),
      recommended: getRecommendedSubjects(),
      totalQuestions,
      updatedAt: new Date().toISOString(),
    };

    return NextResponse.json(payload, {
      headers: { "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL },
    });
  } catch (e) {
    console.error("[catalog/subjects] lookup failed:", e);

    // A count-free catalog keeps marketing pages up during a DB blip.
    // Never leak raw database errors, and do not replay a previous total.
    const fallback: CatalogPayload = {
      subjects: getSubjectCatalog().map((entry) => ({
        ...entry,
        questionCount: 0,
        topicCount: getSubjectsForFieldId(entry.fieldId).length,
      })),
      trending: getTrendingSubjects(),
      recommended: getRecommendedSubjects(),
      totalQuestions: 0,
      updatedAt: new Date().toISOString(),
    };
    return NextResponse.json(fallback, {
      headers: { "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL },
    });
  }
}
