import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { sendEmailVerification } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = await enforceRateLimit(req, "resend-verify", 5, 60_000);
  if (limited) return limited;

  const session = await auth();
  if (!session?.user?.id || !session.user.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { emailVerified: true, email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (user.emailVerified) {
    return NextResponse.json({ ok: true, message: "Email already verified." });
  }

  const result = await sendEmailVerification(session.user.id, user.email);
  if (!result.ok) {
    console.error("[resend-verify] delivery failed", {
      reason: result.reason,
      detail: result.detail,
      userId: session.user.id,
    });
    return NextResponse.json(
      { error: "Could not send verification email. Try again in a moment." },
      { status: 503 }
    );
  }

  return NextResponse.json({ ok: true, message: "Verification email sent." });
}
