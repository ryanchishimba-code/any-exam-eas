import { NextResponse } from "next/server";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { countActiveQuestions, getSubjectServedCountsWithRetry } from "@/lib/question-bank-db";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

export const runtime = "nodejs";

type RouteParams = { params: Promise<{ examSlug: string }> };

/** Single exam metadata + topic counts (no question bodies). */
export async function GET(_req: Request, { params }: RouteParams) {
  const { examSlug } = await params;
  if (!isExamSlug(examSlug)) {
    return NextResponse.json({ error: "Unknown exam" }, { status: 404 });
  }

  const exam = EXAM_CATALOG[examSlug];

  try {
    const payload = await cacheGetOrSet(
      cacheKey(["exam-metadata", examSlug]),
      CACHE_TTL.subjectCatalog,
      async () => {
        const [questionCount, subjectCounts] = await Promise.all([
          countActiveQuestions(exam.fieldId),
          getSubjectServedCountsWithRetry(exam.fieldId),
        ]);
        const topics = getSubjectsForFieldId(exam.fieldId).map((s) => ({
          id: s.id,
          label: s.label,
          questionCount: subjectCounts[s.id] ?? 0,
        }));

        return {
          id: examSlug,
          slug: examSlug,
          name: exam.name,
          shortName: exam.shortName,
          fieldId: exam.fieldId,
          category: exam.fieldId,
          description: exam.description,
          questionCount,
          topicCount: topics.length,
          durationMin: exam.simulatedDurationMin,
          simulatedQuestionCount: exam.simulatedQuestionCount,
          topics,
          updatedAt: new Date().toISOString(),
        };
      }
    );

    return NextResponse.json(payload, {
      headers: { "Cache-Control": "public, s-maxage=120, stale-while-revalidate=600" },
    });
  } catch (error) {
    console.error("[api/exams/[examSlug]] failed:", error);
    return NextResponse.json(
      {
        id: examSlug,
        slug: examSlug,
        name: exam.name,
        fieldId: exam.fieldId,
        questionCount: 0,
        topics: [],
        degraded: true,
        error: "Could not load exam metadata.",
      },
      { status: 503 }
    );
  }
}
