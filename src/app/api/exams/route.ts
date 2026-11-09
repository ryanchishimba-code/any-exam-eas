import { NextResponse } from "next/server";
import { cacheGetOrSet, cacheKey, CACHE_TTL, CACHE_STALE } from "@/lib/cache";
import { EXAM_CATALOG, EXAM_SLUGS } from "@/lib/edtech/exams";
import type { ExamSlug } from "@/types/edtech";
import { ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL } from "@/lib/inventory/active-inventory-cache";
import { readActiveInventoryStampKey } from "@/lib/inventory/active-inventory-stamp";
import { catalogFieldsToCount, sumFieldCounts } from "@/lib/edtech/exam-catalog-totals";
import { countActiveQuestions } from "@/lib/question-bank-db";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CACHE_HEADERS = {
  "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL,
};

/** Lightweight exam catalog — metadata only, no question payloads. */
export async function GET() {
  try {
    const stamp = await readActiveInventoryStampKey();
    const loadCatalog = async () => {
        const slugFieldIds = [...new Set(EXAM_SLUGS.map((slug) => EXAM_CATALOG[slug].fieldId))];
        // The usmle slug stays bound to Step 2 CK. Step 1 and Step 3 are
        // counted too so totalQuestions is not only that one step.
        const countFieldIds = catalogFieldsToCount(slugFieldIds);
        const countEntries = await Promise.all(
          countFieldIds.map(async (fieldId) => [fieldId, await countActiveQuestions(fieldId)] as const)
        );
        const countByField = Object.fromEntries(countEntries) as Record<string, number>;

        const exams = EXAM_SLUGS.map((slug: ExamSlug) => {
          const exam = EXAM_CATALOG[slug];
          return {
            id: slug,
            slug,
            name: exam.name,
            shortName: exam.shortName,
            fieldId: exam.fieldId,
            category: exam.fieldId,
            description: exam.description,
            questionCount: countByField[exam.fieldId] ?? 0,
            topicCount: getSubjectsForFieldId(exam.fieldId).length,
            durationMin: exam.simulatedDurationMin,
            simulatedQuestionCount: exam.simulatedQuestionCount,
          };
        });

        return {
          exams,
          totalQuestions: sumFieldCounts(countFieldIds, countByField),
          updatedAt: new Date().toISOString(),
        };
    };
    const payload = stamp
      ? await cacheGetOrSet(
          cacheKey(["exam-catalog-metadata", stamp, "step2-blank-included"]),
          CACHE_TTL.subjectCatalog,
          loadCatalog,
          { staleTtlMs: CACHE_STALE.examCatalog }
        )
      : await loadCatalog();

    return NextResponse.json(payload, { headers: CACHE_HEADERS });
  } catch (error) {
    console.error("[api/exams] catalog failed:", error);
    const fallback = EXAM_SLUGS.map((slug) => {
      const exam = EXAM_CATALOG[slug];
      return {
        id: slug,
        slug,
        name: exam.name,
        shortName: exam.shortName,
        fieldId: exam.fieldId,
        category: exam.fieldId,
        description: exam.description,
        questionCount: 0,
        topicCount: getSubjectsForFieldId(exam.fieldId).length,
        durationMin: exam.simulatedDurationMin,
        simulatedQuestionCount: exam.simulatedQuestionCount,
      };
    });
    return NextResponse.json(
      { exams: fallback, totalQuestions: 0, updatedAt: new Date().toISOString(), degraded: true },
      { status: 503, headers: CACHE_HEADERS }
    );
  }
}
