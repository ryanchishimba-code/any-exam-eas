import type { StaffRole } from "@/lib/analytics/types";

export const ROLE_RANK: Record<StaffRole, number> = {
  user: 0,
  support_staff: 1,
  moderator: 2,
  admin: 3,
  super_admin: 4,
};

export type Permission =
  | "analytics.view_basic"
  | "analytics.view_education"
  | "analytics.view_billing"
  | "analytics.view_full"
  | "analytics.export"
  | "crm.view_users"
  | "crm.edit_notes"
  | "crm.edit_tags"
  | "crm.bookmark_users"
  | "feedback.view"
  | "feedback.manage"
  | "moderation.view"
  | "social.moderate"
  | "social.publish"
  | "questions.view"
  | "questions.edit"
  | "questions.publish"
  | "admin.actions"
  | "admin.blog"
  | "system.metrics";

const ROLE_PERMISSIONS: Record<StaffRole, Permission[]> = {
  user: [],
  support_staff: [
    "analytics.view_basic",
    "feedback.view",
    "crm.view_users",
    "crm.edit_notes",
    "crm.bookmark_users",
    "questions.view",
    "questions.edit",
  ],
  moderator: [
    "analytics.view_basic",
    "analytics.view_education",
    "feedback.view",
    "feedback.manage",
    "moderation.view",
    "social.moderate",
    "crm.view_users",
    "crm.edit_notes",
    "crm.edit_tags",
    "crm.bookmark_users",
    "questions.view",
    "questions.edit",
    "questions.publish",
  ],
  admin: [
    "analytics.view_basic",
    "analytics.view_education",
    "analytics.view_billing",
    "analytics.view_full",
    "analytics.export",
    "feedback.view",
    "feedback.manage",
    "crm.view_users",
    "crm.edit_notes",
    "crm.edit_tags",
    "crm.bookmark_users",
    "moderation.view",
    "social.moderate",
    "social.publish",
    "questions.view",
    "questions.edit",
    "questions.publish",
    "admin.actions",
    "admin.blog",
  ],
  super_admin: [
    "analytics.view_basic",
    "analytics.view_education",
    "analytics.view_billing",
    "analytics.view_full",
    "analytics.export",
    "feedback.view",
    "feedback.manage",
    "crm.view_users",
    "crm.edit_notes",
    "crm.edit_tags",
    "crm.bookmark_users",
    "moderation.view",
    "social.moderate",
    "social.publish",
    "questions.view",
    "questions.edit",
    "questions.publish",
    "admin.actions",
    "admin.blog",
    "system.metrics",
  ],
};

export function normalizeRole(role?: string | null): StaffRole {
  const r = (role ?? "user") as StaffRole;
  return r in ROLE_RANK ? r : "user";
}

export function isStaffRole(role?: string | null): boolean {
  return ROLE_RANK[normalizeRole(role)] >= ROLE_RANK.support_staff;
}

export function hasPermission(role: string | null | undefined, permission: Permission): boolean {
  const perms = ROLE_PERMISSIONS[normalizeRole(role)];
  return perms.includes(permission);
}

export function hasMinRole(role: string | null | undefined, min: StaffRole): boolean {
  return ROLE_RANK[normalizeRole(role)] >= ROLE_RANK[min];
}
