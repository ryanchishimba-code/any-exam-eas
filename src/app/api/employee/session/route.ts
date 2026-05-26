import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { getInternalSession } from "@/lib/internal/auth";
import { logAdminAction } from "@/lib/audit";

export const runtime = "nodejs";

/** Returns whether the current session has staff portal access. */
export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ authenticated: false, staff: false }, { status: 401 });
  }

  const internal = await getInternalSession();
  if (!internal) {
    return NextResponse.json({
      authenticated: true,
      staff: false,
      role: session.user.role ?? "user",
    });
  }

  void logAdminAction({
    actorId: internal.userId,
    action: "STAFF_SESSION_CHECK",
    req,
  });

  return NextResponse.json({
    authenticated: true,
    staff: true,
    role: internal.role,
    email: internal.email,
    name: internal.name,
  });
}
