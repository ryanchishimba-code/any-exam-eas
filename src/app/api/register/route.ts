import { NextResponse } from "next/server";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { registerUser } from "@/lib/user-auth";
import { signUpSchema } from "@/lib/validators/auth";
import { ZodError } from "zod";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "register", 40, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const input = signUpSchema.parse(body);
    const user = await registerUser(input);
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
