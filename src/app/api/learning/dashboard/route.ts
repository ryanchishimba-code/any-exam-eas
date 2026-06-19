import { NextResponse } from "next/server";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { examFieldIds, isExamSlug } from "@/lib/edtech/exams";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  // Scope analytics to one exam: an explicit ?examSlug= wins, otherwise the
  // user's saved exam preference. ?field= narrows to a single study field
  // (e.g. a single USMLE step) when it belongs to that exam.
  const url = new URL(req.url);
  const examParam = url.searchParams.get("examSlug");
  const fieldParam = url.searchParams.get("field");

  let examSlug = examParam && isExamSlug(examParam) ? examParam : null;
  if (!examSlug) {
    const pref = await getUserExamPreference(premium.userId);
    examSlug = pref?.examSlug ?? null;
  }

  let fieldIds: string[] | null = null;
  if (examSlug) {
    const examFields = examFieldIds(examSlug);
    fieldIds =
      fieldParam && examFields.includes(fieldParam) ? [fieldParam] : examFields;
  }

  const scopeId = `${examSlug ?? "all"}:${fieldIds?.length === 1 ? fieldIds[0] : "*"}`;
  const dashboard = await cacheGetOrSet(
    cacheKey(["student-dashboard", premium.userId, scopeId]),
    CACHE_TTL.learningDashboard,
    () => getStudentDashboardData(premium.userId, fieldIds)
  );

  return NextResponse.json({
    dashboard,
    scope: { examSlug, fieldIds: fieldIds ?? [] },
  });
}
