import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { findUserByEmail, toSafeUser } from "@/lib/user-auth";

export const runtime = "nodejs";

/** Returns the logged-in user's account record (no password hash). */
export async function GET() {
  const session = await auth();
  if (!session?.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const user = await findUserByEmail(session.user.email);
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({ user: toSafeUser(user) });
}
