import { NextResponse } from "next/server";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { cacheGetOrSet, cacheKey, CACHE_TTL } from "@/lib/cache";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import {
  resolveCanonicalPracticeFieldId,
  resolveQuestionBankFieldId,
} from "@/lib/edtech/question-bank-scope";

export const runtime = "nodejs";

export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  // Scope analytics to the user's saved exam only — ignore cross-exam ?examSlug= overrides.
  const url = new URL(req.url);
  const examParam = url.searchParams.get("examSlug");
  const fieldParam = url.searchParams.get("field");

  const pref = await getUserExamPreference(premium.userId);
  if (examParam && isExamSlug(examParam) && pref && examParam !== pref.examSlug) {
    return NextResponse.json(
      {
        error: "That exam does not match your selected exam.",
        code: "EXAM_MISMATCH",
        expectedExamSlug: pref.examSlug,
      },
      { status: 403 }
    );
  }

  const examSlug = pref?.examSlug ?? null;

  let fieldIds: string[] | null = null;
  if (examSlug) {
    const canonicalFieldId = await resolveCanonicalPracticeFieldId(premium.userId, examSlug);
    const resolvedField = fieldParam ? resolveQuestionBankFieldId(fieldParam) : null;
    fieldIds = resolvedField === canonicalFieldId ? [canonicalFieldId] : [canonicalFieldId];
  }

  const scopeId = `${examSlug ?? "all"}:${fieldIds?.length === 1 ? fieldIds[0] : "*"}`;
  const dashboard = await cacheGetOrSet(
    cacheKey(["student-dashboard", premium.userId, scopeId]),
    CACHE_TTL.learningDashboard,
    () => getStudentDashboardData(premium.userId, fieldIds)
  );

  return NextResponse.json(
    {
      dashboard,
      scope: { examSlug, fieldIds: fieldIds ?? [] },
    },
    {
      headers: {
        "Cache-Control": "private, max-age=15, stale-while-revalidate=30",
      },
    }
  );
}
