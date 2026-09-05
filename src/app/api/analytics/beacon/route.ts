import { after, NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { analyticsBeaconSchema } from "@/lib/analytics/beacon-schema";
import { trackEventAsync, touchUserSession } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";
import { isDbUserSessionId } from "@/lib/analytics/session-id";
import { readOptionalSessionUser } from "@/lib/session-guard";

export const runtime = "nodejs";

export async function POST(req: Request) {
  // Tighter limit: beacons were exhausting Neon pool slots under connection_limit=1.
  const limited = await enforceRateLimit(req, "analytics-beacon", 40, 60_000);
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

    if (input.path.startsWith("/internal") || input.path.startsWith("/api/")) {
      return NextResponse.json({ ok: true, skipped: true });
    }

    const sessionUser = await readOptionalSessionUser();
    const headerSnapshot = new Headers(req.headers);
    const requestUrl = req.url;

    after(async () => {
      const stubReq = new Request(requestUrl, { headers: headerSnapshot });
      await trackEventAsync({
        userId: sessionUser?.userId,
        sessionId: input.sessionId,
        eventType: EVENT_TYPES.PAGE_VIEW,
        category: "engagement",
        metadata: {
          path: input.path,
          durationSec: input.durationSec ?? 0,
          referrer: input.referrer,
        },
        req: stubReq,
      });

      if (input.sessionId && isDbUserSessionId(input.sessionId)) {
        await touchUserSession(input.sessionId, input.durationSec);
      }
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) {
      // Sample ~10% of invalid beacons so we can tell bots vs broken clients
      // without flooding logs (or Neon) under traffic.
      if (Math.random() < 0.1) {
        const keys = e.issues
          .slice(0, 6)
          .map((issue) => issue.path.join(".") || "(root)");
        console.warn("[analytics/beacon] invalid payload", {
          keys: [...new Set(keys)],
          issueCount: e.issues.length,
        });
      }
      return NextResponse.json({ error: "Invalid beacon." }, { status: 400 });
    }
    return NextResponse.json({ ok: true });
  }
}
