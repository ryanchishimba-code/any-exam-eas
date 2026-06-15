import { NextResponse } from "next/server";
import { z } from "zod";
import { requireInternalPermission } from "@/lib/internal/auth";
import { logAdminAction } from "@/lib/audit";
import {
  ASSIGNABLE_STAFF_ROLES,
  canAssignStaffRole,
  inviteStaffMember,
  listStaffMembers,
  STAFF_ROLE_LABELS,
} from "@/lib/staff-management";
import { inviteStaffSchema } from "@/lib/validators/staff";
import { normalizeRole, ROLE_RANK } from "@/lib/permissions";

export const runtime = "nodejs";

/** List staff accounts (admin+). */
export async function GET() {
  const auth = await requireInternalPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  const staff = await listStaffMembers();
  const assignableRoles = ASSIGNABLE_STAFF_ROLES.filter((role) => {
    if (auth.role === "super_admin") return true;
    if (role === "super_admin" || role === "admin") return false;
    return true;
  });

  return NextResponse.json({
    staff,
    assignableRoles,
    roleLabels: STAFF_ROLE_LABELS,
    loginUrl: "/login?callbackUrl=%2Finternal",
  });
}

/** Invite or promote an employee (admin+). */
export async function POST(req: Request) {
  const auth = await requireInternalPermission("admin.actions");
  if (auth instanceof NextResponse) return auth;

  let body: z.infer<typeof inviteStaffSchema>;
  try {
    body = inviteStaffSchema.parse(await req.json());
  } catch (e) {
    if (e instanceof z.ZodError) {
      return NextResponse.json(
        { error: e.errors[0]?.message ?? "Invalid input." },
        { status: 400 }
      );
    }
    throw e;
  }

  const actorRank = ROLE_RANK[normalizeRole(auth.role)];
  const newRank = ROLE_RANK[normalizeRole(body.role)];
  if (newRank > actorRank) {
    return NextResponse.json(
      { error: "You cannot assign a role above your own." },
      { status: 403 }
    );
  }
  if (
    auth.role !== "super_admin" &&
    (body.role === "admin" || body.role === "super_admin")
  ) {
    return NextResponse.json(
      { error: "Only a super admin can grant admin or super admin access." },
      { status: 403 }
    );
  }

  const { prisma } = await import("@/lib/prisma");
  const existing = await prisma.user.findUnique({
    where: { email: body.email },
    select: { id: true, role: true },
  });
  if (existing) {
    const promoteAllowed = canAssignStaffRole({
      actorId: auth.userId,
      actorRole: auth.role,
      targetUserId: existing.id,
      targetRole: existing.role,
      newRole: body.role,
    });
    if (!promoteAllowed.ok) {
      return NextResponse.json({ error: promoteAllowed.reason }, { status: 403 });
    }
  }

  const result = await inviteStaffMember({
    email: body.email,
    name: body.name,
    role: body.role,
    password: body.password,
  });

  void logAdminAction({
    actorId: auth.userId,
    action: result.created ? "STAFF_INVITED" : "STAFF_PROMOTED",
    targetType: "user",
    targetId: result.userId,
    metadata: {
      email: body.email,
      role: body.role,
      created: result.created,
    },
    req,
  });

  return NextResponse.json({
    ok: true,
    userId: result.userId,
    created: result.created,
    message: result.created
      ? "Employee account created."
      : "Existing user promoted to staff.",
    temporaryPassword: result.temporaryPassword,
    loginUrl: "/login?callbackUrl=%2Finternal",
  });
}
