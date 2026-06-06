import { NextResponse } from "next/server";
import { requireAdminPermission } from "@/lib/admin/auth";
import { prisma } from "@/lib/prisma";
import { requestPasswordReset } from "@/lib/password-reset";
import { enforceRateLimit, enforceUserRateLimit } from "@/lib/api-rate-limit";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ userId: string }> };

export async function POST(req: Request, context: RouteContext) {
  const limited = enforceRateLimit(req, "admin-password-reset", 15, 60_000);
  if (limited) return limited;

  const auth = await requireAdminPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const userLimited = enforceUserRateLimit(
    auth.userId,
    "admin-password-reset",
    20,
    60_000
  );
  if (userLimited) return userLimited;

  const { userId } = await context.params;

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { email: true },
  });

  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const outcome = await requestPasswordReset(user.email);

  void logAdminAction({
    actorId: auth.userId,
    action: "ADMIN_TRIGGER_PASSWORD_RESET",
    targetType: "user",
    targetId: userId,
    metadata: { emailDelivered: outcome.emailDelivered ?? false },
    req,
  });

  if (!outcome.userFound) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  if (!outcome.emailDelivered && process.env.NODE_ENV !== "development") {
    return NextResponse.json(
      {
        error:
          "Reset token created but email delivery failed. Check Resend configuration.",
      },
      { status: 502 }
    );
  }

  return NextResponse.json({
    ok: true,
    message: "Password reset link sent to the user.",
    ...(process.env.NODE_ENV === "development" && outcome.devResetUrl
      ? { devResetUrl: outcome.devResetUrl }
      : {}),
  });
}
