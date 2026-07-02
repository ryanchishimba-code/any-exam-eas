import { NextResponse } from "next/server";
import type { ExamSlug } from "@/types/edtech";
import { getExamRoadmapData } from "@/lib/learning/exam-roadmap";
import { EXAM_CATALOG, isExamSlug } from "@/lib/edtech/exams";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { searchParams } = new URL(request.url);
  const pref = await getUserExamPreference(premium.userId);
  if (!pref) {
    return NextResponse.json({ error: "Select an exam before viewing roadmap." }, { status: 403 });
  }

  const examParam = searchParams.get("exam");
  if (examParam && isExamSlug(examParam) && examParam !== pref.examSlug) {
    return NextResponse.json(
      { error: "That exam does not match your selected exam.", code: "EXAM_MISMATCH" },
      { status: 403 }
    );
  }

  const examSlug: ExamSlug = pref.examSlug;

  if (!EXAM_CATALOG[examSlug]) {
    return NextResponse.json({ error: "Unknown exam" }, { status: 400 });
  }

  const roadmap = await cacheGetOrSet(
    cacheKey(["exam-roadmap", premium.userId, examSlug]),
    CACHE_TTL.learningDashboard,
    () => getExamRoadmapData(premium.userId, examSlug)
  );

  if (!roadmap) {
    return NextResponse.json({ error: "Blueprint not available" }, { status: 404 });
  }

  return NextResponse.json({ roadmap });
}
