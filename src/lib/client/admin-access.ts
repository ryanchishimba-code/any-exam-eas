"use client";

import { useSession } from "next-auth/react";
import { hasMinRole } from "@/lib/permissions";
import type { StaffRole } from "@/lib/analytics/types";

export function isAdminRole(role?: string | null): boolean {
  return hasMinRole(role, "admin");
}

export function useIsAdmin(): { isAdmin: boolean; loading: boolean; role: StaffRole | null } {
  const { data: session, status } = useSession();
  const role = (session?.user as { role?: string } | undefined)?.role ?? null;
  return {
    isAdmin: isAdminRole(role),
    loading: status === "loading",
    role: role as StaffRole | null,
  };
}
