/**
 * Admin access & permissions — unit tests (Vitest node environment).
 *
 * Run with:
 *   npx vitest run --project unit src/lib/admin/admin-access.test.ts
 *
 * Coverage goals
 * ──────────────
 * isAdminRole (client helper)
 *   - Returns false for undefined / null / empty string.
 *   - Returns false for sub-admin roles (user, support_staff, moderator).
 *   - Returns true for admin and super_admin.
 *
 * hasMinRole (core permission utility)
 *   - Correctly orders the five-tier hierarchy.
 *   - Treats unknown role strings as "user".
 *
 * isStaffRole
 *   - True for support_staff+, false for user.
 *
 * hasPermission
 *   - admin has analytics.view_full; user does not.
 *   - super_admin has system.metrics; admin does not.
 *   - support_staff can view_users but cannot admin.actions.
 *
 * normalizeRole
 *   - Unknown role strings coerce to "user".
 */

import { describe, expect, it } from "vitest";
import { isAdminRole } from "@/lib/client/admin-access";
import {
  hasMinRole,
  isStaffRole,
  hasPermission,
  normalizeRole,
} from "@/lib/permissions";

// ── isAdminRole ──────────────────────────────────────────────────────────────

describe("isAdminRole", () => {
  it("returns false for undefined", () => {
    expect(isAdminRole(undefined)).toBe(false);
  });

  it("returns false for null", () => {
    expect(isAdminRole(null)).toBe(false);
  });

  it("returns false for empty string", () => {
    expect(isAdminRole("")).toBe(false);
  });

  it("returns false for role = 'user'", () => {
    expect(isAdminRole("user")).toBe(false);
  });

  it("returns false for role = 'support_staff'", () => {
    expect(isAdminRole("support_staff")).toBe(false);
  });

  it("returns false for role = 'moderator'", () => {
    expect(isAdminRole("moderator")).toBe(false);
  });

  it("returns true for role = 'admin'", () => {
    expect(isAdminRole("admin")).toBe(true);
  });

  it("returns true for role = 'super_admin'", () => {
    expect(isAdminRole("super_admin")).toBe(true);
  });

  it("returns false for an arbitrary unknown role string", () => {
    expect(isAdminRole("god_mode")).toBe(false);
  });
});

// ── normalizeRole ────────────────────────────────────────────────────────────

describe("normalizeRole", () => {
  it("coerces undefined to 'user'", () => {
    expect(normalizeRole(undefined)).toBe("user");
  });

  it("coerces null to 'user'", () => {
    expect(normalizeRole(null)).toBe("user");
  });

  it("coerces an unknown string to 'user'", () => {
    expect(normalizeRole("hacker")).toBe("user");
  });

  it("passes through valid role strings unchanged", () => {
    expect(normalizeRole("admin")).toBe("admin");
    expect(normalizeRole("super_admin")).toBe("super_admin");
    expect(normalizeRole("moderator")).toBe("moderator");
  });
});

// ── hasMinRole ───────────────────────────────────────────────────────────────

describe("hasMinRole", () => {
  it("user does not satisfy support_staff minimum", () => {
    expect(hasMinRole("user", "support_staff")).toBe(false);
  });

  it("support_staff satisfies support_staff minimum", () => {
    expect(hasMinRole("support_staff", "support_staff")).toBe(true);
  });

  it("moderator satisfies support_staff and moderator minimums", () => {
    expect(hasMinRole("moderator", "support_staff")).toBe(true);
    expect(hasMinRole("moderator", "moderator")).toBe(true);
  });

  it("moderator does not satisfy admin minimum", () => {
    expect(hasMinRole("moderator", "admin")).toBe(false);
  });

  it("admin satisfies admin minimum", () => {
    expect(hasMinRole("admin", "admin")).toBe(true);
  });

  it("admin does not satisfy super_admin minimum", () => {
    expect(hasMinRole("admin", "super_admin")).toBe(false);
  });

  it("super_admin satisfies every tier", () => {
    expect(hasMinRole("super_admin", "user")).toBe(true);
    expect(hasMinRole("super_admin", "support_staff")).toBe(true);
    expect(hasMinRole("super_admin", "moderator")).toBe(true);
    expect(hasMinRole("super_admin", "admin")).toBe(true);
    expect(hasMinRole("super_admin", "super_admin")).toBe(true);
  });

  it("treats null role as user", () => {
    expect(hasMinRole(null, "support_staff")).toBe(false);
  });

  it("treats unknown role as user", () => {
    expect(hasMinRole("owner", "support_staff")).toBe(false);
  });
});

// ── isStaffRole ──────────────────────────────────────────────────────────────

describe("isStaffRole", () => {
  it("returns false for user", () => {
    expect(isStaffRole("user")).toBe(false);
  });

  it("returns false for undefined", () => {
    expect(isStaffRole(undefined)).toBe(false);
  });

  it("returns true for support_staff", () => {
    expect(isStaffRole("support_staff")).toBe(true);
  });

  it("returns true for moderator, admin, super_admin", () => {
    expect(isStaffRole("moderator")).toBe(true);
    expect(isStaffRole("admin")).toBe(true);
    expect(isStaffRole("super_admin")).toBe(true);
  });
});

// ── hasPermission ────────────────────────────────────────────────────────────

describe("hasPermission", () => {
  it("user has no permissions", () => {
    expect(hasPermission("user", "analytics.view_basic")).toBe(false);
    expect(hasPermission("user", "crm.view_users")).toBe(false);
  });

  it("support_staff can view users and edit notes but not admin.actions", () => {
    expect(hasPermission("support_staff", "crm.view_users")).toBe(true);
    expect(hasPermission("support_staff", "crm.edit_notes")).toBe(true);
    expect(hasPermission("support_staff", "admin.actions")).toBe(false);
    expect(hasPermission("support_staff", "system.metrics")).toBe(false);
  });

  it("moderator can manage feedback but not admin.actions or billing analytics", () => {
    expect(hasPermission("moderator", "feedback.manage")).toBe(true);
    expect(hasPermission("moderator", "analytics.view_billing")).toBe(false);
    expect(hasPermission("moderator", "admin.actions")).toBe(false);
  });

  it("admin has full analytics and admin.actions but not system.metrics", () => {
    expect(hasPermission("admin", "analytics.view_full")).toBe(true);
    expect(hasPermission("admin", "analytics.export")).toBe(true);
    expect(hasPermission("admin", "admin.actions")).toBe(true);
    expect(hasPermission("admin", "system.metrics")).toBe(false);
  });

  it("super_admin has all permissions including system.metrics", () => {
    expect(hasPermission("super_admin", "analytics.view_full")).toBe(true);
    expect(hasPermission("super_admin", "admin.actions")).toBe(true);
    expect(hasPermission("super_admin", "system.metrics")).toBe(true);
  });

  it("treats null role as user (no permissions)", () => {
    expect(hasPermission(null, "analytics.view_basic")).toBe(false);
  });
});
