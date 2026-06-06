import { NextResponse } from "next/server";
import { z } from "zod";
import { requireAdminPermission } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { sendSupportEmail } from "@/lib/email";
import { enforceRateLimit, enforceUserRateLimit } from "@/lib/api-rate-limit";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

const bodySchema = z.object({
  subject: z.string().min(1).max(200),
  body: z.string().min(1).max(10_000),
});

type RouteContext = { params: Promise<{ userId: string }> };

export async function POST(req: Request, context: RouteContext) {
  const limited = enforceRateLimit(req, "admin-send-email", 20, 60_000);
  if (limited) return limited;

  const auth = await requireAdminPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const userLimited = enforceUserRateLimit(auth.userId, "admin-send-email", 30, 60_000);
  if (userLimited) return userLimited;

  const { userId } = await context.params;

  try {
    const body = bodySchema.parse(await req.json());
    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: { email: true, accountStatus: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found." }, { status: 404 });
    }

    const delivery = await sendSupportEmail({
      to: user.email,
      subject: body.subject,
      body: body.body,
      replyTo: auth.email,
    });

    if (!delivery.ok) {
      return NextResponse.json(
        { error: "Email could not be sent. Check Resend configuration." },
        { status: 502 }
      );
    }

    void logAdminAction({
      actorId: auth.userId,
      action: "ADMIN_SEND_EMAIL",
      targetType: "user",
      targetId: userId,
      metadata: { subject: body.subject.slice(0, 80) },
      req,
    });

    return NextResponse.json({ ok: true });
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json({ error: "Invalid request." }, { status: 400 });
    }
    console.error("[admin/send-email]", e);
    return NextResponse.json({ error: "Could not send email." }, { status: 500 });
  }
}
