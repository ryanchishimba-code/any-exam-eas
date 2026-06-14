import { NextResponse } from "next/server";
import { findUserByEmail, toSafeUser } from "@/lib/user-auth";
import { requireSessionGuard } from "@/lib/session-guard";

export const runtime = "nodejs";

/** Returns the logged-in user's account record (no password hash). */
export async function GET(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const email = guard.session.user.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: toSafeUser(user) });
}
