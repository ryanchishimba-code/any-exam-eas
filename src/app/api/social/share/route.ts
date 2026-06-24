import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { shareBeaconSchema } from "@/lib/social/validators";
import { recordShare } from "@/lib/social/shares";
import { optionalSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

/** POST /api/social/share — record a share-button click (auth optional). */
export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "social-share", 60, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const input = shareBeaconSchema.parse(body);
    const guard = await optionalSessionGuard(req);
    if (!guard.ok) return guard.response;

    await recordShare(input, guard.userId);
    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json({ error: "Invalid share payload." }, { status: 400 });
    }
    // Never fail the user's share UX on tracking errors.
    return NextResponse.json({ ok: true });
  }
}
