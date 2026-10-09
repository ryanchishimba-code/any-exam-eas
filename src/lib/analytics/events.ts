import { prisma } from "@/lib/prisma";
import type { TrackEventInput } from "./types";
import { EVENT_TYPES } from "./types";
import { hashIp, getUserAgent, parseUserAgent } from "./request-context";
import { isDbUserSessionId } from "./session-id";
import {
  prepareAnalyticsEvent,
  scheduleAnalyticsWrite,
  writePreparedAnalyticsEvent,
} from "./event-writer";

export function trackPageView(params: {
  path: string;
  userId?: string | null;
  sessionId?: string | null;
  durationSec?: number;
  referrer?: string;
  req?: Request;
}): void {
  trackEvent({
    userId: params.userId,
    sessionId: params.sessionId,
    eventType: EVENT_TYPES.PAGE_VIEW,
    category: "engagement",
    metadata: {
      path: params.path,
      durationSec: params.durationSec ?? 0,
      referrer: params.referrer,
    },
    req: params.req,
  });
}

/**
 * Touch a real DB UserSession row. No-ops for client analytics UUIDs so we
 * never burn a pooled connection on a guaranteed empty updateMany.
 */
export async function touchUserSession(
  sessionId: string,
  durationSec?: number
): Promise<void> {
  if (!isDbUserSessionId(sessionId)) return;
  try {
    await prisma.userSession.updateMany({
      where: { id: sessionId },
      data: {
        lastSeenAt: new Date(),
        ...(durationSec != null && durationSec > 0
          ? { endedAt: new Date() }
          : {}),
      },
    });
  } catch {
    /* non-blocking */
  }
}

/**
 * Centralized, non-blocking event tracking. The request snapshot is taken now;
 * the write runs after the response via `after()` (see event-writer.ts).
 */
export function trackEvent(input: TrackEventInput): void {
  const row = prepareAnalyticsEvent(input);
  scheduleAnalyticsWrite(() => writePreparedAnalyticsEvent(row));
}

/** Awaitable variant (e.g. already inside `after()`); never throws. */
export async function trackEventAsync(input: TrackEventInput): Promise<void> {
  try {
    await writePreparedAnalyticsEvent(prepareAnalyticsEvent(input));
  } catch {
    /* analytics must not break product flows */
  }
}

async function upsertDeviceHistory(
  userId: string,
  userAgent: string,
  parsed: ReturnType<typeof parseUserAgent>,
  ipHash?: string
): Promise<void> {
  const recent = await prisma.deviceHistory.findFirst({
    where: { userId, userAgent },
    orderBy: { lastSeenAt: "desc" },
    select: { id: true },
  });

  if (recent) {
    // updateMany = one UPDATE statement (no BEGIN/SELECT/UPDATE/COMMIT round trips).
    await prisma.deviceHistory.updateMany({
      where: { id: recent.id },
      data: { lastSeenAt: new Date(), ...(ipHash ? { ipHash } : {}) },
    });
    return;
  }

  await prisma.deviceHistory.create({
    data: {
      userId,
      userAgent,
      browser: parsed.browser,
      os: parsed.os,
      deviceType: parsed.deviceType,
      ipHash,
    },
  });
}

export async function logActivity(params: {
  userId: string;
  action: string;
  summary: string;
  metadata?: Record<string, unknown>;
}): Promise<void> {
  try {
    await prisma.activityLog.create({
      data: {
        userId: params.userId,
        action: params.action,
        summary: params.summary,
        metadata: params.metadata ? JSON.stringify(params.metadata) : null,
      },
    });
  } catch {
    /* non-blocking */
  }
}

export async function recordGeneration(params: {
  userId: string;
  examId?: string;
  quiltId?: string;
  field: string;
  subjectId?: string;
  topic: string;
  difficulty: string;
  questionCount: number;
  status?: "success" | "failed";
  durationMs?: number;
  errorMessage?: string;
}): Promise<void> {
  try {
    await prisma.generationHistory.create({
      data: {
        userId: params.userId,
        examId: params.examId,
        quiltId: params.quiltId,
        field: params.field,
        subjectId: params.subjectId,
        topic: params.topic,
        difficulty: params.difficulty,
        questionCount: params.questionCount,
        status: params.status ?? "success",
        durationMs: params.durationMs,
        errorMessage: params.errorMessage,
      },
    });

    const metricsUpdate: {
      generationCount: { increment: number };
      lastGenerationAt: Date;
      examCount?: { increment: number };
      quiltCount?: { increment: number };
    } = {
      generationCount: { increment: 1 },
      lastGenerationAt: new Date(),
    };
    if (params.examId) metricsUpdate.examCount = { increment: 1 };
    if (params.quiltId) metricsUpdate.quiltCount = { increment: 1 };

    await prisma.userUsageMetrics.upsert({
      where: { userId: params.userId },
      create: {
        userId: params.userId,
        generationCount: 1,
        examCount: params.examId ? 1 : 0,
        quiltCount: params.quiltId ? 1 : 0,
        lastGenerationAt: new Date(),
      },
      update: metricsUpdate,
    });

    await mergeUserPreferences(params.userId, params.field, params.difficulty);
  } catch {
    /* non-blocking */
  }
}

async function mergeUserPreferences(
  userId: string,
  field: string,
  difficulty: string
): Promise<void> {
  const existing = await prisma.userPreference.findUnique({ where: { userId } });
  const fields: string[] = existing?.preferredFields
    ? (JSON.parse(existing.preferredFields) as string[])
    : [];
  if (!fields.includes(field)) fields.push(field);

  await prisma.userPreference.upsert({
    where: { userId },
    create: {
      userId,
      preferredFields: JSON.stringify(fields.slice(-10)),
      defaultDifficulty: difficulty,
    },
    update: {
      preferredFields: JSON.stringify(fields.slice(-10)),
      defaultDifficulty: difficulty,
    },
  });
}

export async function startUserSession(
  userId: string,
  req?: Request
): Promise<string | undefined> {
  try {
    const userExists = await prisma.user.findUnique({
      where: { id: userId },
      select: { id: true },
    });
    if (!userExists) return undefined;

    const ua = getUserAgent(req);
    const parsed = parseUserAgent(ua ?? null);
    const session = await prisma.userSession.create({
      data: {
        userId,
        userAgent: ua,
        browser: parsed.browser,
        os: parsed.os,
        deviceType: parsed.deviceType,
        ipHash: hashIp(req),
      },
    });

    await prisma.userUsageMetrics.upsert({
      where: { userId },
      create: { userId, loginCount: 1 },
      update: { loginCount: { increment: 1 } },
    });

    // Login is a good time to refresh last-active + device history once.
    await prisma.user.update({
      where: { id: userId },
      data: { lastActiveAt: new Date() },
    });
    if (ua) {
      await upsertDeviceHistory(userId, ua, parsed, hashIp(req));
    }

    return session.id;
  } catch {
    return undefined;
  }
}
