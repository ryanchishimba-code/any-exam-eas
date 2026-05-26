import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { resetPasswordWithToken } from "@/lib/password-reset";
import { resetPasswordSchema } from "@/lib/validators/password-reset";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { token, password } = resetPasswordSchema.parse(body);
    await resetPasswordWithToken(token, password);
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
