import { NextResponse } from "next/server";
import { ZodError } from "zod";
import { z } from "zod";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { requestMagicLink } from "@/lib/magic-link";
import { normalizeEmail } from "@/lib/validators/auth";

export const runtime = "nodejs";

const schema = z.object({
  email: z.string().email().transform(normalizeEmail),
});

const SUCCESS_MESSAGE =
  "If an account exists for that email, we sent a secure sign-in link. It expires in 15 minutes.";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "magic-link", 8, 60_000);
  if (limited) return limited;

  try {
    const body = await req.json();
    const { email } = schema.parse(body);
    await requestMagicLink(email);
    return NextResponse.json({ ok: true, message: SUCCESS_MESSAGE });
  } catch (e) {
    if (e instanceof ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid email." },
        { status: 400 }
      );
    }
    const message = e instanceof Error ? e.message : "Could not send sign-in link.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
