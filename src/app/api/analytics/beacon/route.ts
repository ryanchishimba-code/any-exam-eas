import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { analyticsBeaconSchema } from "@/lib/analytics/beacon-schema";
import { trackPageView, touchUserSession } from "@/lib/analytics/events";
import { readOptionalSessionUser } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "analytics-beacon", 120, 60_000);
  if (limited) return limited;

  try {
    let body: unknown;
    try {
      body = await req.json();
    } catch {
      const text = await req.text();
      body = text ? JSON.parse(text) : {};
    }
    const input = analyticsBeaconSchema.parse(body);
    const sessionUser = await readOptionalSessionUser();

    if (input.path.startsWith("/internal") || input.path.startsWith("/api/")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    trackPageView({
      path: input.path,
      userId: sessionUser?.userId,
      sessionId: input.sessionId,
      durationSec: input.durationSec,
      referrer: input.referrer,
      req,
    });

    if (input.sessionId) {
      void touchUserSession(input.sessionId, input.durationSec);
    }

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Invalid beacon." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }
}
