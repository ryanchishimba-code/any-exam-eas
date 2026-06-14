import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { resetPasswordWithToken } from "@/lib/password-reset";
import { resetPasswordSchema } from "@/lib/validators/password-reset";

export const runtime = "nodejs";

// Rate limit: 15 attempts per IP per 15 minutes — mitigates token brute-force.
export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "reset-password", 15, 15 * 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { token, newPassword } = resetPasswordSchema.parse(body);
    await resetPasswordWithToken(token, newPassword);
    return NextResponse.json({
      ok: true,
      message: "Your password has been updated. You can log in now.",
    });
  } catch (e) {
    if (e instanceof ZodError) {
      const message = e.errors[0]?.message ?? "Invalid input.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Could not reset password.";
    const status = /invalid|expired/i.test(message) ? 400 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}
