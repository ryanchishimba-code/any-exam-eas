import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { registerUser } from "@/lib/user-auth";
import { signUpSchema } from "@/lib/validators/auth";
import { ZodError } from "zod";
import { trackEvent, logActivity } from "@/lib/analytics/events";
import { EVENT_TYPES } from "@/lib/analytics/types";

export const runtime = "nodejs";

export async function POST(req: Request) {
  /** Per-IP burst; real users spread across IPs. Raised for high-concurrency signup waves. */
  const limited = enforceRateLimit(req, "register", 30, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const input = signUpSchema.parse(body);
    const user = await registerUser(input);

    trackEvent({
      userId: user.id,
      eventType: EVENT_TYPES.USER_REGISTERED,
      category: "auth",
      metadata: { plan: user.plan },
      req,
    });
    void logActivity({
      userId: user.id,
      action: "register",
      summary: `Account created (${user.plan} plan)`,
      metadata: { plan: user.plan },
    });

    return NextResponse.json({ ok: true, user, plan: user.plan });
  } catch (e) {
    if (e instanceof ZodError) {
      const message = e.errors[0]?.message ?? "Invalid registration data.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Registration failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
