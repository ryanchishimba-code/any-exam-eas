import { NextResponse } from "next/server";
import type { Session } from "next-auth";
import { auth } from "@/auth";
import {
  accountIpLimitResponse,
  checkAndRecordAccountIp,
} from "@/lib/account-ip-limit";

export type SessionGuardResult =
  | { ok: true; session: Session; userId: string }
  | { ok: false; response: NextResponse };

export type OptionalSessionGuardResult =
  | { ok: true; session?: Session; userId?: string }
  | { ok: false; response: NextResponse };

/** Authenticated session with account IP limit enforcement. */
export async function requireSessionGuard(req?: Request): Promise<SessionGuardResult> {
  const session = await auth();
  if (!session?.user?.id) {
    return {
      ok: false,
      response: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
    };
  }

  const ipCheck = await checkAndRecordAccountIp(
    session.user.id,
    session.user.role,
    req,
    undefined,
    session.user.email
  );
  if (!ipCheck.ok) {
    return { ok: false, response: accountIpLimitResponse(ipCheck.reason) };
  }

  return { ok: true, session, userId: session.user.id };
}

/** Optional auth — enforces IP limit only when a session exists. */
export async function optionalSessionGuard(req?: Request): Promise<OptionalSessionGuardResult> {
  const session = await auth();
  if (!session?.user?.id) return { ok: true };

  const ipCheck = await checkAndRecordAccountIp(
    session.user.id,
    session.user.role,
    req,
    undefined,
    session.user.email
  );
  if (!ipCheck.ok) {
    return { ok: false, response: accountIpLimitResponse(ipCheck.reason) };
  }

  return { ok: true, session, userId: session.user.id };
}
