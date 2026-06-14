import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { createFeedback } from "@/lib/feedback/service";
import { submitFeedbackSchema } from "@/lib/feedback/validators";
import { trackEvent } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";
import { optionalSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "feedback", 15, 60_000);
  if (limited) return limited;

  try {
    const guard = await optionalSessionGuard(req);
    if (!guard.ok) return guard.response;

    const body = await req.json();
    const input = submitFeedbackSchema.parse(body);
    const userId = guard.userId;

    const { id } = await createFeedback(input, { userId, req });

    trackEvent({
      userId,
      eventType: EVENT_TYPES.FEEDBACK_SUBMITTED,
      category: "engagement",
      metadata: { category: input.category, rating: input.rating, feedbackId: id },
      req,
    });

    return NextResponse.json({ ok: true, id });
  } catch (e) {
    if (e instanceof ZodError) {
      const message = e.errors[0]?.message ?? "Invalid feedback.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not submit feedback." }, { status: 500 });
  }
}
