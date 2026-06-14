import { prisma } from "@/lib/prisma";
import { isStaffRole } from "@/lib/permissions";
import { hashIp, hashIpFromHeaders } from "@/lib/analytics/request-context";

/** Max distinct network locations per subscriber account (rolling window). */
export const MAX_ACCOUNT_IPS = 3;

/** Rolling window for distinct IP tracking. */
export const ACCOUNT_IP_WINDOW_MS = 30 * 24 * 60 * 60 * 1000;

export type AccountIpCheckResult =
  | { ok: true }
  | { ok: false; reason: "too_many_ips" };

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
  if (!opts.ipHash) return { ok: true };

  const known = await getRecentDistinctIpHashes(userId);
  if (known.includes(opts.ipHash)) return { ok: true };
  if (known.length >= MAX_ACCOUNT_IPS) return { ok: false, reason: "too_many_ips" };
  return { ok: true };
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

export const ACCOUNT_IP_LIMIT_MESSAGE =
  "This account is already active on 3 devices or networks. Sign out elsewhere or contact support.";
