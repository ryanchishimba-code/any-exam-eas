import { NextResponse } from "next/server";
import {
  getRecommendedSubjects,
  getSubjectCatalog,
  getTrendingSubjects,
} from "@/lib/subjects/catalog";
import { countActiveQuestions } from "@/lib/question-bank-db";
import { getSubjectsForFieldId } from "@/lib/subjects/registry";

export const dynamic = "force-dynamic";

export async function GET() {
  try {
    const catalog = getSubjectCatalog();
    const enriched = await Promise.all(
      catalog.map(async (entry) => {
        const [questionCount, areas] = await Promise.all([
          countActiveQuestions(entry.fieldId).catch(() => 0),
          Promise.resolve(getSubjectsForFieldId(entry.fieldId).length),
        ]);
        return {
          ...entry,
          questionCount,
          topicCount: areas,
        };
      })
    );

    const totalQuestions = enriched.reduce((n, e) => n + e.questionCount, 0);

    return NextResponse.json({
      subjects: enriched,
      trending: getTrendingSubjects(),
      recommended: getRecommendedSubjects(),
      totalQuestions,
      updatedAt: new Date().toISOString(),
    });
  } catch (e) {
    const message = e instanceof Error ? e.message : "Catalog unavailable";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
