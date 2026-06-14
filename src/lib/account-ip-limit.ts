import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { isStaffRole } from "@/lib/permissions";
import { hashIp, hashIpFromHeaders } from "@/lib/analytics/request-context";

/** Max distinct network locations per subscriber account (rolling window). */
export const MAX_ACCOUNT_IPS = 3;

/** Rolling window for distinct IP tracking. */
export const ACCOUNT_IP_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export type AccountIpCheckResult =
  | { ok: true }
  | { ok: false; reason: "too_many_ips" | "ip_required" };

export function isProductionRuntime(): boolean {
  return process.env.NODE_ENV === "production" || Boolean(process.env.VERCEL);
}

export function resolveIpHash(req?: Request, headerStore?: Headers): string | undefined {
  if (req) return hashIp(req);
  if (headerStore) return hashIpFromHeaders(headerStore);
  return undefined;
}

export async function getRecentDistinctIpHashes(userId: string): Promise<string[]> {
  const since = new Date(Date.now() - ACCOUNT_IP_WINDOW_MS);
  const rows = await prisma.userSession.findMany({
    where: {
      userId,
      lastSeenAt: { gte: since },
      ipHash: { not: null },
    },
    select: { ipHash: true },
  });

  return [...new Set(rows.map((r) => r.ipHash).filter((h): h is string => Boolean(h)))];
}

export async function assertAccountIpAllowed(
  userId: string,
  opts: { ipHash?: string; role?: string | null }
): Promise<AccountIpCheckResult> {
  if (isStaffRole(opts.role)) return { ok: true };
  if (!opts.ipHash) {
    return isProductionRuntime() ? { ok: false, reason: "ip_required" } : { ok: true };
  }

  const known = await getRecentDistinctIpHashes(userId);
  if (known.includes(opts.ipHash)) return { ok: true };
  if (known.length >= MAX_ACCOUNT_IPS) return { ok: false, reason: "too_many_ips" };
  return { ok: true };
}

export const ACCOUNT_IP_LIMIT_MESSAGE =
  "This account is already active on 3 devices or networks. Sign out elsewhere or contact support.";

export const IP_REQUIRED_MESSAGE =
  "We could not verify your network location. Refresh the page or try again from a standard browser connection.";

export function accountIpLimitResponse(
  reason: "too_many_ips" | "ip_required"
): NextResponse {
  if (reason === "ip_required") {
    return NextResponse.json(
      { error: IP_REQUIRED_MESSAGE, code: "IP_REQUIRED" },
      { status: 403 }
    );
  }
  return NextResponse.json(
    { error: ACCOUNT_IP_LIMIT_MESSAGE, code: "TOO_MANY_IPS" },
    { status: 403 }
  );
}

export async function checkAndRecordAccountIp(
  userId: string,
  role: string | undefined,
  req?: Request,
  headerStore?: Headers
): Promise<AccountIpCheckResult> {
  const ipHash = resolveIpHash(req, headerStore);
  const ipCheck = await assertAccountIpAllowed(userId, { ipHash, role });
  if (ipCheck.ok && ipHash) void recordAccountIpAccess(userId, ipHash);
  return ipCheck;
}

export async function enforceAccountIpLimit(
  userId: string,
  role: string | undefined,
  req?: Request,
  headerStore?: Headers
): Promise<NextResponse | null> {
  const ipCheck = await checkAndRecordAccountIp(userId, role, req, headerStore);
  if (!ipCheck.ok) return accountIpLimitResponse(ipCheck.reason);
  return null;
}

export async function recordAccountIpAccess(userId: string, ipHash: string): Promise<void> {
  if (!ipHash) return;

  const since = new Date(Date.now() - ACCOUNT_IP_WINDOW_MS);
  const existing = await prisma.userSession.findFirst({
    where: {
      userId,
      ipHash,
      lastSeenAt: { gte: since },
    },
    orderBy: { lastSeenAt: "desc" },
  });

  if (existing) {
    await prisma.userSession.update({
      where: { id: existing.id },
      data: { lastSeenAt: new Date() },
    });
    return;
  }

  await prisma.userSession.create({
    data: {
      userId,
      ipHash,
      lastSeenAt: new Date(),
    },
  });
}
