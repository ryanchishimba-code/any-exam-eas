import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { optionalSessionGuard } from "@/lib/session-guard";
import { createQuestionReport } from "@/lib/question-reports/service";
import { submitQuestionReportSchema } from "@/lib/question-reports/validators";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "question-report", 20, 60_000);
  if (limited) return limited;

  try {
    const guard = await optionalSessionGuard(req);
    if (!guard.ok) return guard.response;

    const input = submitQuestionReportSchema.parse(await req.json());
    const { id } = await createQuestionReport(input, { userId: guard.userId });

    trackEvent({
      userId: guard.userId,
      eventType: EVENT_TYPES.FEEDBACK_SUBMITTED,
      category: "education",
      metadata: {
        kind: "question_report",
        reportId: id,
        fieldId: input.fieldId,
        reason: input.reason,
        bankItemId: input.bankItemId,
      },
      req,
    });

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid report." },
        { status: 400 }
      );
    }
    return NextResponse.json({ error: "Could not submit report." }, { status: 500 });
  }
}
