import { NextResponse } from "next/server";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { loadCoverageHeatmapForUser } from "@/lib/learning/load-coverage-heatmap";

export const runtime = "nodejs";

/**
 * Coverage heatmap for the signed-in student.
 * Readiness bars, Today's block, and Qbank chips all use this shape.
 */
export async function GET(req: Request) {
  const { requirePremiumApi } = await import("@/lib/api-access");
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const field = new URL(req.url).searchParams.get("field");
  if (!field) {
    return NextResponse.json({ error: "Missing field" }, { status: 400 });
  }

  const { resolveQuestionBankReadAccess } = await import("@/lib/edtech/question-bank-scope");
  const access = await resolveQuestionBankReadAccess(premium.userId, field);
  if (!access.ok) return access.response;

  const fieldId = access.fieldId;
  const examSlug = examSlugFromFieldId(fieldId);
  if (!examSlug) {
    return NextResponse.json({ error: "Unknown field" }, { status: 400 });
  }

  try {
    const heatmap = await loadCoverageHeatmapForUser(premium.userId, examSlug, fieldId);
    if (!heatmap) {
      return NextResponse.json({ error: "Coverage unavailable" }, { status: 503 });
    }
    return NextResponse.json(heatmap);
  } catch (error) {
    console.error("[learning/coverage] lookup failed:", error);
    return NextResponse.json({ error: "Coverage unavailable" }, { status: 503 });
  }
}
