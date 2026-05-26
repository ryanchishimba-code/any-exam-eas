import { NextResponse } from "next/server";
import { z } from "zod";
import { requireInternalPermission } from "@/lib/internal/auth";
import { prisma } from "@/lib/prisma";
import { logAdminAction } from "@/lib/audit";
import { TRIAL_DAYS } from "@/lib/stripe";

export const runtime = "nodejs";

const patchSchema = z.object({
  accountStatus: z.enum(["active", "suspended"]).optional(),
  subscriptionStatus: z
    .enum(["trialing", "active", "inactive", "trial_expired", "past_due", "canceled"])
    .optional(),
  extendTrialDays: z.coerce.number().int().min(0).max(90).optional(),
  grantCompDays: z.coerce.number().int().min(0).max(365).optional(),
  revokeCompAccess: z.boolean().optional(),
});

type RouteContext = { params: Promise<{ userId: string }> };

export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireInternalPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await context.params;
  const body = patchSchema.parse(await req.json());

  const user = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  if (body.accountStatus) {
    await prisma.user.update({
      where: { id: userId },
      data: { accountStatus: body.accountStatus },
    });
  }

  const subUpdate: Record<string, unknown> = {};

  if (body.subscriptionStatus) {
    subUpdate.status = body.subscriptionStatus;
  }

  if (body.extendTrialDays != null && body.extendTrialDays > 0) {
    const base = user.subscription?.trialEndsAt ?? new Date();
    const trialEndsAt = new Date(base);
    trialEndsAt.setDate(trialEndsAt.getDate() + body.extendTrialDays);
    subUpdate.status = "trialing";
    subUpdate.trialEndsAt = trialEndsAt;
  }

  if (body.grantCompDays != null && body.grantCompDays > 0) {
    const until = new Date();
    until.setDate(until.getDate() + body.grantCompDays);
    subUpdate.compAccessUntil = until;
    subUpdate.status = "active";
  }

  if (body.revokeCompAccess) {
    subUpdate.compAccessUntil = null;
  }

  if (Object.keys(subUpdate).length > 0) {
    await prisma.subscription.upsert({
      where: { userId },
      create: {
        userId,
        status: (subUpdate.status as string) ?? "inactive",
        trialEndsAt:
          (subUpdate.trialEndsAt as Date | undefined) ??
          (() => {
            const d = new Date();
            d.setDate(d.getDate() + TRIAL_DAYS);
            return d;
          })(),
        compAccessUntil: subUpdate.compAccessUntil as Date | undefined,
      },
      update: subUpdate,
    });
  }

  void logAdminAction({
    actorId: auth.userId,
    action: "UPDATE_USER_ACCESS",
    targetType: "user",
    targetId: userId,
    metadata: body,
    req,
  });

  const updated = await prisma.user.findUnique({
    where: { id: userId },
    include: { subscription: true },
  });

  return NextResponse.json({
    user: {
      id: updated?.id,
      accountStatus: updated?.accountStatus,
      subscription: updated?.subscription,
    },
  });
}
