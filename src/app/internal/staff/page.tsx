import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { StaffManagementPanel } from "@/components/crm/StaffManagementPanel";

export default async function InternalStaffPage() {
  const auth = await requireInternalPermission("admin.actions");
  if (auth instanceof NextResponse) {
    return (
      <p className="text-sm text-amber-800">
        Admin access required to manage employees. Contact a super admin.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Employees</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Invite staff, assign roles, and manage access to the internal portal.
        </p>
      </div>
      <StaffManagementPanel />
    </div>
  );
}
