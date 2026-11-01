import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { saveDailyQuestionLead } from "@/lib/marketing/daily-question-lead";

export const runtime = "nodejs";

const subscribeSchema = z.object({
  email: z.string().trim().email().max(320),
  examSlug: z.string().trim().max(40).optional(),
});

/**
 * Stores a daily-question address as pending.
 * A confirmation email is sent when the mailer is configured. Nothing else is sent until they confirm.
 */
export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "daily-subscribe", 10, 60_000);
  if (limited) return limited;

  try {
    const input = subscribeSchema.parse(await req.json());
    const saved = await saveDailyQuestionLead({
      email: input.email,
      examSlug: input.examSlug,
    });
    return NextResponse.json({ ok: true, ...saved });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not save that email." }, { status: 500 });
  }
}
