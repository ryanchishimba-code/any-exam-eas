import { auth } from "@/auth";
import { NextResponse } from "next/server";
import { hasPermission, isStaffRole, type Permission } from "@/lib/permissions";
import type { StaffRole } from "@/lib/analytics/types";
import { prisma } from "@/lib/prisma";

export type InternalSession = {
  userId: string;
  email: string;
  name: string | null;
  role: StaffRole;
};

export async function getInternalSession(): Promise<InternalSession | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true },
  });
  const role = dbUser?.role ?? "user";
  if (!isStaffRole(role)) return null;

  return {
    userId: session.user.id,
    email: session.user.email ?? "",
    name: session.user.name ?? null,
    role: role as StaffRole,
  };
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireInternalPermission(
  permission: Permission
): Promise<InternalSession | NextResponse> {
  const internal = await getInternalSession();
  if (!internal) return forbiddenResponse();
  if (!hasPermission(internal.role, permission)) return forbiddenResponse();
  return internal;
}
