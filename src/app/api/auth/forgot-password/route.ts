import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { requestPasswordReset } from "@/lib/password-reset";
import {
  FORGOT_PASSWORD_SUCCESS_MESSAGE,
  forgotPasswordSchema,
} from "@/lib/validators/password-reset";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "forgot-password", 10, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { email } = forgotPasswordSchema.parse(body);
    const outcome = await requestPasswordReset(email);

    const payload: {
      ok: true;
      message: string;
      devResetUrl?: string;
    } = {
      ok: true,
      message: FORGOT_PASSWORD_SUCCESS_MESSAGE,
    };

    // Dev-only: surface reset link when Resend is not configured (local testing).
    if (process.env.NODE_ENV === "development" && outcome.devResetUrl) {
      payload.devResetUrl = outcome.devResetUrl;
    }

    return NextResponse.json(payload);
  } catch (e) {
    if (e instanceof ZodError) {
      const message = e.errors[0]?.message ?? "Invalid email.";
      return NextResponse.json({ error: message }, { status: 400 });
    }
    console.error("[forgot-password] Unexpected error:", e);
    return NextResponse.json(
      { error: "Could not process request. Please try again." },
      { status: 500 }
    );
  }
}
