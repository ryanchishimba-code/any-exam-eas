import { NextResponse } from "next/server";
import { requirePremiumApi } from "@/lib/api-access";
import { respondDbUnavailable } from "@/lib/api-db-error";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { examSlugFromFieldId } from "@/lib/edtech/exams";
import { resolveCanonicalPracticeFieldId } from "@/lib/edtech/question-bank-scope";
import { getExamSession } from "@/lib/exam-sessions/service";
import { loadFullExamSessionQuestionsPayload } from "@/lib/full-exam/load-session-questions";

export const runtime = "nodejs";
export const maxDuration = 120;

export async function GET(
  _req: Request,
  ctx: { params: Promise<{ sessionId: string }> }
) {
  const premium = await requirePremiumApi();
  if (!premium.ok) return premium.response;

  const { sessionId } = await ctx.params;

  try {
    const session = await getExamSession(sessionId, premium.userId);
    if (!session) {
      return NextResponse.json({ error: "Session not found" }, { status: 404 });
    }

    const pref = await getUserExamPreference(premium.userId);
    if (!pref) {
      return NextResponse.json(
        { error: "Select an exam before practicing.", code: "NO_EXAM_PREFERENCE" },
        { status: 403 }
      );
    }

    const resolvedFieldId = session.fieldId;
    if (!resolvedFieldId) {
      return NextResponse.json(
        { error: "Session has no exam field.", code: "SESSION_FIELD_MISSING" },
        { status: 404 }
      );
    }

    const sessionExamSlug = examSlugFromFieldId(resolvedFieldId);
    if (!sessionExamSlug || sessionExamSlug !== pref.examSlug) {
      return NextResponse.json(
        { error: "That session does not match your selected exam.", code: "EXAM_MISMATCH" },
        { status: 403 }
      );
    }

    const canonicalFieldId = await resolveCanonicalPracticeFieldId(
      premium.userId,
      pref.examSlug
    );
    if (resolvedFieldId !== canonicalFieldId) {
      return NextResponse.json(
        {
          error: "That session does not match your selected exam step.",
          code: "USMLE_STEP_MISMATCH",
          expectedFieldId: canonicalFieldId,
        },
        { status: 403 }
      );
    }

    const loaded = await loadFullExamSessionQuestionsPayload(premium.userId, sessionId);
    if (!loaded.ok) {
      return NextResponse.json(
        { error: loaded.error, code: loaded.code },
        { status: loaded.status }
      );
    }

    return NextResponse.json(loaded.payload);
  } catch (e) {
    const dbResponse = respondDbUnavailable(e);
    if (dbResponse) return dbResponse;
    const message = e instanceof Error ? e.message : "Could not load session questions";
    return NextResponse.json({ error: message }, { status: 503 });
  }
}
