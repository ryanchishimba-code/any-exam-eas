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
  const examParam = searchParams.get("exam");

  let examSlug: ExamSlug = isExamSlug(examParam ?? "")
    ? (examParam as ExamSlug)
    : "nclex";
  if (!isExamSlug(examParam ?? "")) {
    const pref = await getUserExamPreference(premium.userId);
    examSlug = pref?.examSlug ?? "nclex";
  }

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
