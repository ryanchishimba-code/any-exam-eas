import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { hasMinRole, type Permission } from "@/lib/permissions";
import type { StaffRole } from "@/lib/analytics/types";

export type AdminSession = {
  userId: string;
  email: string;
  name: string | null;
  role: StaffRole;
};

export async function getAdminSession(): Promise<AdminSession | null> {
  const session = await auth();
  if (!session?.user?.id) return null;

  const dbUser = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { role: true, email: true, name: true, accountStatus: true },
  });

  if (!dbUser || dbUser.accountStatus === "suspended") return null;
  if (!hasMinRole(dbUser.role, "admin")) return null;

  return {
    userId: session.user.id,
    email: dbUser.email,
    name: dbUser.name,
    role: dbUser.role as StaffRole,
  };
}

export function forbiddenResponse() {
  return NextResponse.json({ error: "Forbidden" }, { status: 403 });
}

export async function requireAdminPermission(
  permission: Permission
): Promise<AdminSession | NextResponse> {
  const admin = await getAdminSession();
  if (!admin) return forbiddenResponse();

  const { hasPermission } = await import("@/lib/permissions");
  if (!hasPermission(admin.role, permission)) return forbiddenResponse();

  return admin;
}
