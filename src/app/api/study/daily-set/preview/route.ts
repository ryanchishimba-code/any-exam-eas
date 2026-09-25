/**
 * GET /api/study/daily-set/preview?field=&done=
 *
 * The mix line for today's card. Same served set as POST /api/study/daily-set.
 * No-store so a previous line cannot be replayed from the browser.
 */

import { NextResponse } from "next/server";
import { examSlugForFieldId } from "@/lib/edtech/exam-field-ids";
import { loadTodaySetPreview } from "@/lib/learning/today-set-plan";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

export async function GET(req: Request) {
  const { requireStudyApi } = await import("@/lib/api-access");
  const premium = await requireStudyApi();
  if (!premium.ok) return premium.response;

  try {
    const url = new URL(req.url);
    const field = url.searchParams.get("field")?.trim() ?? "";
    if (!field) {
      return NextResponse.json({ error: "Missing field." }, { status: 400 });
    }
    const doneRaw = Number(url.searchParams.get("done") ?? "0");
    const questionsDone = Number.isFinite(doneRaw) ? Math.max(0, Math.round(doneRaw)) : 0;

    const { resolveQuestionBankFieldId, enforceQuestionBankFieldAccess } = await import(
      "@/lib/edtech/question-bank-scope"
    );
    const fieldId = resolveQuestionBankFieldId(field);
    const examSlug = examSlugForFieldId(fieldId);
    if (!examSlug) {
      return NextResponse.json({ error: "Unknown exam field." }, { status: 400 });
    }
    const access = await enforceQuestionBankFieldAccess(premium.userId, field);
    if (!access.ok) return access.response;

    const preview = await loadTodaySetPreview({
      userId: premium.userId,
      examSlug,
      fieldId,
      questionsDone,
      access: premium.access,
    });

    return NextResponse.json(
      {
        fieldId: preview.fieldId,
        target: preview.target,
        mixLine: preview.mixLine,
        reviewCount: preview.reviewCount,
        newCount: preview.newCount,
        empty: preview.empty,
        limitReached: preview.limitReached,
        streakDays: preview.streakDays,
      },
      {
        headers: {
          "Cache-Control": "private, no-store",
        },
      }
    );
  } catch (error) {
    console.error("[study/daily-set/preview]", error);
    return NextResponse.json({ error: "Could not load today's mix." }, { status: 500 });
  }
}
