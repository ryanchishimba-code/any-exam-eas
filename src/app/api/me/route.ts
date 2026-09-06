import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireSessionGuard } from "@/lib/session-guard";
import { normalizeEmail } from "@/lib/validators/auth";
import { normalizeStoredName } from "@/lib/display-name";

export const runtime = "nodejs";

/** Returns the logged-in user's account record (no password hash). */
export async function GET(req: Request) {
  const guard = await requireSessionGuard(req);
  if (!guard.ok) return guard.response;

  const email = guard.session.user.email;
  if (!email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  // Prefer session userId — avoids a second email lookup when the cookie is fresh.
  const byId = await prisma.user.findUnique({
    where: { id: guard.userId },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });

  if (byId) {
    return NextResponse.json({
      user: {
        ...byId,
        name: normalizeStoredName(byId.name) ?? byId.name,
      },
    });
  }

  const normalized = normalizeEmail(email);
  const byEmail = await prisma.user.findUnique({
    where: { email: normalized },
    select: {
      id: true,
      email: true,
      name: true,
      createdAt: true,
      lastLoginAt: true,
    },
  });
  if (!byEmail) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }

  return NextResponse.json({
    user: {
      ...byEmail,
      name: normalizeStoredName(byEmail.name) ?? byEmail.name,
    },
  });
}
