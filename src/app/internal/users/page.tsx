import Link from "next/link";
import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { hasPermission } from "@/lib/permissions";
import UserSearch from "./UserSearch";

export default async function InternalUsersPage() {
  const auth = await requireInternalPermission("crm.view_users");
  if (auth instanceof NextResponse) {
    return (
      <p className="text-sm text-amber-800">You do not have CRM access. Contact an administrator.</p>
    );
  }

  const canManageStaff = hasPermission(auth.role, "admin.actions");

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User management</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Search users, review activity, and manage subscriptions.
          {canManageStaff ? (
            <>
              {" "}
              Admins can invite employees from{" "}
              <Link className="link font-medium" href="/internal/staff">
                Employees
              </Link>
              .
            </>
          ) : null}
        </p>
      </div>
      <UserSearch showAdminColumns={canManageStaff} />
    </div>
  );
}

