import { NextResponse } from "next/server";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL } from "@/lib/inventory/active-inventory-cache";
import { readActiveInventoryStampKey } from "@/lib/inventory/active-inventory-stamp";
import { countActiveQuestions, getSubjectServedCountsWithRetry } from "@/lib/question-bank-db";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteParams = { params: Promise<{ examSlug: string }> };

/** Single exam metadata + topic counts (no question bodies). */
export async function GET(_req: Request, { params }: RouteParams) {
  const { examSlug } = await params;
  if (!isExamSlug(examSlug)) {
    return NextResponse.json({ error: "Unknown exam" }, { status: 404 });
  }

  const exam = EXAM_CATALOG[examSlug];

  try {
    const stamp = await readActiveInventoryStampKey();
    const loadExam = async () => {
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
    };
    const payload = stamp
      ? await cacheGetOrSet(
          cacheKey(["exam-metadata", examSlug, stamp]),
          CACHE_TTL.subjectCatalog,
          loadExam
        )
      : await loadExam();

    return NextResponse.json(payload, {
      headers: { "Cache-Control": ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL },
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
