import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { hasPermission } from "@/lib/permissions";
import { searchUsers, serializeInternalUserRows } from "@/lib/crm/user-profile";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("crm.view_users");
  if (auth instanceof NextResponse) return auth;

  const includeAdminFields = hasPermission(auth.role, "admin.actions");

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const users = await searchUsers(q, 50, includeAdminFields);

  return NextResponse.json({
    users: serializeInternalUserRows(users),
    adminColumns: includeAdminFields,
  });
}
