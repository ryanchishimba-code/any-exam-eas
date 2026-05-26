import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import UserSearch from "./UserSearch";

export default async function InternalUsersPage() {
  const auth = await requireInternalPermission("crm.view_users");
  if (auth instanceof NextResponse) {
    return (
      <p className="text-sm text-amber-800">You do not have CRM access. Contact an administrator.</p>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">User management</h1>
        <p className="mt-1 text-sm text-[var(--color-ink-muted)]">
          Search users, review activity, and manage subscriptions.
        </p>
      </div>
      <UserSearch />
    </div>
  );
}

