import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";

export type SessionGuardResult =
  | { ok: true; session: Session; userId: string }
  | { ok: false; response: NextResponse };

export type OptionalSessionGuardResult =
  | { ok: true; session?: Session; userId?: string }
  | { ok: false; response: NextResponse };

/** Authenticated session — IP limits are enforced at login, not on every API call. */
export async function requireSessionGuard(_req?: Request): Promise<SessionGuardResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  return { ok: true, session, userId: session.user.id };
}

/** Optional auth for low-risk telemetry — no DB work. */
export async function readOptionalSessionUser(): Promise<
  { userId: string; session: Session } | undefined
> {
  const session = await auth();
  if (!session?.user?.id) return undefined;
  return { userId: session.user.id, session };
}

/** Optional auth — no IP-limit DB work on hot paths. */
export async function optionalSessionGuard(_req?: Request): Promise<OptionalSessionGuardResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: true };
  return { ok: true, session, userId: session.user.id };
}
