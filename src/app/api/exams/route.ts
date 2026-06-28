import { NextResponse } from "next/server";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { EXAM_CATALOG, EXAM_SLUGS, type ExamSlug } from "@/lib/edtech/exams";
import { countActiveQuestions } from "@/lib/question-bank-db";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

export const runtime = "nodejs";

const CACHE_HEADERS = {
  "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600",
};

/** Lightweight exam catalog — metadata only, no question payloads. */
export async function GET() {
  try {
    const payload = await cacheGetOrSet(
      cacheKey(["exam-catalog-metadata"]),
      CACHE_TTL.subjectCatalog,
      async () => {
        const uniqueFieldIds = [...new Set(EXAM_SLUGS.map((slug) => EXAM_CATALOG[slug].fieldId))];
        const countEntries = await Promise.all(
          uniqueFieldIds.map(async (fieldId) => [fieldId, await countActiveQuestions(fieldId)] as const)
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
          totalQuestions: exams.reduce((sum, e) => sum + e.questionCount, 0),
          updatedAt: new Date().toISOString(),
        };
      }
    );

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
