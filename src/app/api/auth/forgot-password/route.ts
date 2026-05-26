import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { requestPasswordReset } from "@/lib/password-reset";
import { forgotPasswordSchema } from "@/lib/validators/password-reset";

export const runtime = "nodejs";

const SUCCESS_MESSAGE =
  "If an account exists for that email, we sent a link to reset your password.";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "forgot-password", 10, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);
    await requestPasswordReset(email);
    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  } catch (e) {
    if (e instanceof ZodError) {
      const message = e.errors[0]?.message ?? "Invalid email.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    const message = e instanceof Error ? e.message : "Could not process request.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
