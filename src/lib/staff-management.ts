import { randomBytes } from "node:crypto";
import type { StaffRole } from "@/lib/analytics/types";
import { prisma } from "@/lib/prisma";
import { hashPassword, passwordCredentialFields } from "@/lib/password-hash";
import { hasMinRole, normalizeRole, ROLE_RANK } from "@/lib/permissions";
import type { StaffRoleValue } from "@/lib/validators/staff";
import { normalizeEmail } from "@/lib/validators/auth";

const STAFF_DOB = new Date("1990-01-01T00:00:00.000Z");

function daysFromNow(days: number): Date {
  const d = new Date();
  d.setDate(d.getDate() + days);
  return d;
}

const premiumSubscription = {
  status: "active" as const,
  trialEndsAt: null,
  currentPeriodEnd: daysFromNow(365),
};

export function generateStaffPassword(): string {
  const base = randomBytes(9).toString("base64url");
  return `${base}1A`;
}

/** Whether actor may assign `newRole` to a user who currently has `targetRole`. */
export function canAssignStaffRole(params: {
  actorId: string;
  actorRole: string;
  targetUserId: string;
  targetRole: string;
  newRole: StaffRoleValue;
}): { ok: true } | { ok: false; reason: string } {
  const actorRank = ROLE_RANK[normalizeRole(params.actorRole)];
  const targetRank = ROLE_RANK[normalizeRole(params.targetRole)];
  const newRank = ROLE_RANK[normalizeRole(params.newRole)];

  if (!hasMinRole(params.actorRole, "admin")) {
    return { ok: false, reason: "Admin access required." };
  }

  if (params.actorId === params.targetUserId) {
    return { ok: false, reason: "You cannot change your own role." };
  }

  if (newRank > actorRank) {
    return { ok: false, reason: "You cannot assign a role above your own." };
  }

  if (params.actorRole !== "super_admin") {
    if (targetRank >= ROLE_RANK.admin) {
      return { ok: false, reason: "Only a super admin can modify admin accounts." };
    }
    if (newRank >= ROLE_RANK.admin && actorRank < ROLE_RANK.super_admin) {
      return { ok: false, reason: "Only a super admin can grant admin access." };
    }
  }

  return { ok: true };
}

export async function listStaffMembers(limit = 100) {
  return prisma.user.findMany({
    where: {
      role: { in: ["support_staff", "moderator", "admin", "super_admin"] },
      accountStatus: { not: "deleted" },
    },
    orderBy: [{ role: "desc" }, { createdAt: "desc" }],
    take: limit,
    select: {
      id: true,
      name: true,
      email: true,
      role: true,
      accountStatus: true,
      lastActiveAt: true,
      createdAt: true,
    },
  });
}

export async function inviteStaffMember(params: {
  email: string;
  name: string;
  role: Exclude<StaffRoleValue, "user">;
  password?: string;
}): Promise<{ userId: string; created: boolean; temporaryPassword?: string }> {
  const email = normalizeEmail(params.email);
  const password = params.password?.trim() || generateStaffPassword();
  const credentialFields = passwordCredentialFields(await hashPassword(password));

  const existing = await prisma.user.findUnique({
    where: { email },
    include: { subscription: true },
  });

  if (existing) {
    await prisma.user.update({
      where: { id: existing.id },
      data: {
        name: params.name,
        role: params.role,
        accountStatus: "active",
        emailVerified: existing.emailVerified ?? new Date(),
        ...(params.password ? credentialFields : {}),
      },
    });

    await prisma.subscription.upsert({
      where: { userId: existing.id },
      create: { userId: existing.id, ...premiumSubscription },
      update: premiumSubscription,
    });

    return {
      userId: existing.id,
      created: false,
      temporaryPassword: params.password ? undefined : password,
    };
  }

  const user = await prisma.user.create({
    data: {
      email,
      name: params.name,
      ...credentialFields,
      dateOfBirth: STAFF_DOB,
      role: params.role,
      accountStatus: "active",
      emailVerified: new Date(),
      subscription: { create: premiumSubscription },
    },
  });

  return {
    userId: user.id,
    created: true,
    temporaryPassword: params.password ? undefined : password,
  };
}

export async function updateUserStaffRole(params: {
  userId: string;
  role: StaffRoleValue;
}): Promise<{ id: string; role: StaffRole; email: string; name: string | null }> {
  const user = await prisma.user.findUnique({ where: { id: params.userId } });
  if (!user) {
    throw new Error("User not found.");
  }

  await prisma.user.update({
    where: { id: params.userId },
    data: { role: params.role },
  });

  if (params.role !== "user") {
    await prisma.subscription.upsert({
      where: { userId: params.userId },
      create: { userId: params.userId, ...premiumSubscription },
      update: premiumSubscription,
    });
  }

  return {
    id: user.id,
    role: params.role as StaffRole,
    email: user.email,
    name: user.name,
  };
}

export const STAFF_ROLE_LABELS: Record<Exclude<StaffRoleValue, "user">, string> = {
  support_staff: "Support staff",
  moderator: "Moderator",
  admin: "Admin",
  super_admin: "Super admin",
};

export const ASSIGNABLE_STAFF_ROLES: Exclude<StaffRoleValue, "user">[] = [
  "support_staff",
  "moderator",
  "admin",
  "super_admin",
];
