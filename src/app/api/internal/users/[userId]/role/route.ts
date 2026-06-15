import { NextResponse } from "next/server";
import { z } from "zod";
import { requireInternalPermission } from "@/lib/internal/auth";
import { logAdminAction } from "@/lib/audit";
import { prisma } from "@/lib/prisma";
import { canAssignStaffRole, updateUserStaffRole } from "@/lib/staff-management";
import { updateStaffRoleSchema } from "@/lib/validators/staff";

export const runtime = "nodejs";

type RouteContext = { params: Promise<{ userId: string }> };

/** Change a user's staff role or revoke staff access (admin+). */
export async function PATCH(req: Request, context: RouteContext) {
  const auth = await requireInternalPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const { userId } = await context.params;

  let body: z.infer<typeof updateStaffRoleSchema>;
  try {
    body = updateStaffRoleSchema.parse(await req.json());
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid role." },
        { status: 400 }
      );
    }
    throw e;
  }

  const user = await prisma.user.findUnique({
    where: { id: userId },
    select: { id: true, email: true, role: true },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found." }, { status: 404 });
  }

  const allowed = canAssignStaffRole({
    actorId: auth.userId,
    actorRole: auth.role,
    targetUserId: userId,
    targetRole: user.role,
    newRole: body.role,
  });
  if (!allowed.ok) {
    return NextResponse.json({ error: allowed.reason }, { status: 403 });
  }

  const updated = await updateUserStaffRole({ userId, role: body.role });

  void logAdminAction({
    actorId: auth.userId,
    action: "STAFF_ROLE_UPDATED",
    targetType: "user",
    targetId: userId,
    metadata: { from: user.role, to: body.role, email: user.email },
    req,
  });

  return NextResponse.json({
    ok: true,
    user: updated,
    message:
      body.role === "user"
        ? "Staff access removed. User must sign in again."
        : "Role updated. User must sign out and sign in again.",
  });
}
