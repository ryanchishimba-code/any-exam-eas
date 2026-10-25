import { prisma } from "@/lib/prisma";
import {
  ENGAGEMENT_SURFACES,
  HEARTBEAT_MAX_CREDIT_SECONDS,
  HEARTBEAT_MIN_INTERVAL_MS,
  type EngagementSurface,
} from "./config";
import { centralDateFromKey, centralDateKey } from "./central-date";

export type HeartbeatResult =
  | { accepted: true; creditedSeconds: number }
  | { accepted: false; reason: "too_fast" | "invalid_surface" };

export function creditSecondsFromHeartbeat(requestedSeconds: number): number {
  const safe = Math.max(0, Math.min(requestedSeconds, HEARTBEAT_MAX_CREDIT_SECONDS));
  return Math.round(safe);
}

export async function processEngagementHeartbeat(
  userId: string,
  surface: string,
  requestedSeconds: number
): Promise<HeartbeatResult> {
  if (!ENGAGEMENT_SURFACES.includes(surface as EngagementSurface)) {
    return { accepted: false, reason: "invalid_surface" };
  }

  const now = new Date();
  const meta = await prisma.studyEngagementHeartbeatMeta.findUnique({
    where: { userId },
  });

  if (meta?.lastAcceptedAt) {
    const elapsed = now.getTime() - meta.lastAcceptedAt.getTime();
    if (elapsed < HEARTBEAT_MIN_INTERVAL_MS) {
      await prisma.studyEngagementHeartbeatMeta.upsert({
        where: { userId },
        create: {
          userId,
          lastAcceptedAt: meta.lastAcceptedAt,
          ignoredTooFastCount: 1,
        },
        update: {
          ignoredTooFastCount: { increment: 1 },
        },
      });
      return { accepted: false, reason: "too_fast" };
    }
  }

  const creditedSeconds = creditSecondsFromHeartbeat(requestedSeconds);
  const dateKey = centralDateKey(now);
  const date = centralDateFromKey(dateKey);

  await prisma.$transaction([
    prisma.studyEngagementDaily.upsert({
      where: {
        userId_date_surface: { userId, date, surface },
      },
      create: {
        userId,
        date,
        surface,
        activeSeconds: creditedSeconds,
      },
      update: {
        activeSeconds: { increment: creditedSeconds },
      },
    }),
    prisma.studyEngagementHeartbeatMeta.upsert({
      where: { userId },
      create: {
        userId,
        lastAcceptedAt: now,
        ignoredTooFastCount: 0,
      },
      update: {
        lastAcceptedAt: now,
      },
    }),
  ]);

  return { accepted: true, creditedSeconds };
}
