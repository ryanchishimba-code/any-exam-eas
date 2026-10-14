import { NextResponse } from "next/server";
import { ZodError, z } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

const subscribeSchema = z.object({
  email: z.string().trim().email().max(320),
});

/** Stores a daily-question inbox address. No new table — one analytics row. */
export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "daily-subscribe", 10, 60_000);
  if (limited) return limited;

  try {
    const input = subscribeSchema.parse(await req.json());
    await prisma.analyticsEvent.create({
      data: {
        eventType: "daily_question_subscribe",
        category: "engagement",
        metadata: JSON.stringify({ email: input.email }),
      },
    });
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Enter a valid email." }, { status: 400 });
    }
    return NextResponse.json({ error: "Could not subscribe." }, { status: 500 });
  }
}
