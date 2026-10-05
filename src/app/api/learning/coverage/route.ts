import { NextResponse } from "next/server";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { loadQuestionBankCoverage } from "@/lib/learning/load-coverage-heatmap";

export const runtime = "nodejs";

/**
 * Coverage heatmap for the signed-in student.
 * Readiness bars, Today's block, and Qbank chips all use this shape.
 */
export async function GET(req: Request) {
  // Same study access as the question-bank page (trial or paid). Premium-only
  // would hide chips the server used to render for a trial student.
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
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
    const loaded = await loadQuestionBankCoverage(premium.userId, examSlug, fieldId);
    // A roadmap miss used to leave weak marks on the page. Keep those, with
    // an empty chip list, instead of failing the whole response.
    const heatmap = loaded.heatmap ?? {
      domainsLabel: fieldId === "nursing" ? ("Client Needs" as const) : ("Blueprint topics" as const),
      domains: [],
      topGapId: null,
      touchCoveragePct: 0,
      bankCoveragePct: null,
      categoryQuestionTotal: 0,
      unmappedQuestionTotal: 0,
      topicQuestionTotal: null,
      countsAgree: false,
      chips: [],
    };
    return NextResponse.json({
      ...heatmap,
      openIncorrectCount: loaded.openIncorrectCount,
      weakTopics: loaded.weakTopics,
    });
  } catch (error) {
    console.error("[learning/coverage] lookup failed:", error);
    return NextResponse.json({ error: "Coverage unavailable" }, { status: 503 });
  }
}
