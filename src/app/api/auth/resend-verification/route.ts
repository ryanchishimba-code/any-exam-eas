import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { enforceRateLimit } from "@/lib/api-rate-limit";
import { sendEmailVerification } from "@/lib/email-verification";
import { prisma } from "@/lib/prisma";

export const runtime = "nodejs";

export async function POST(req: Request) {
  const limited = enforceRateLimit(req, "resend-verify", 5, 60_000);
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

  await sendEmailVerification(session.user.id, user.email);
  return NextResponse.json({ ok: true, message: "Verification email sent." });
}
