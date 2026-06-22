import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { conversionBeaconSchema } from "@/lib/analytics/conversion-schema";
import { saveConversionEvent } from "@/lib/analytics/conversions";
import { optionalSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "analytics-conversion", 60, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const input = conversionBeaconSchema.parse(body);
    const guard = await optionalSessionGuard(req);
    if (!guard.ok) return guard.response;

    await saveConversionEvent({
      eventName: input.eventName,
      properties: input.properties,
      userId: guard.userId,
      sessionId: input.sessionId,
      source: "web",
      req,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Invalid conversion payload." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }
}
