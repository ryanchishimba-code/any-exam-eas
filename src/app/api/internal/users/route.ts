import { NextResponse } from "next/server";
import { requireInternalPermission } from "@/lib/internal/auth";
import { searchUsers } from "@/lib/crm/user-profile";

export async function GET(req: Request) {
  const auth = await requireInternalPermission("crm.view_users");
  if (auth instanceof NextResponse) return auth;

  const { searchParams } = new URL(req.url);
  const q = searchParams.get("q") ?? "";
  const users = await searchUsers(q, 50);

  return NextResponse.json({ users });
}
