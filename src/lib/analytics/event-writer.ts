/**
 * Background analytics writes (AnalyticsEvent + last-active + device history).
 *
 * Why this exists: trackEvent() used to fire Prisma writes into an in-memory
 * queue without registering them with the platform. On Vercel the function is
 * frozen once the response is sent, so those writes (and their 12s race
 * timers) were suspended mid-flight while still holding a Prisma pool slot —
 * and, for multi-statement Prisma updates through pgbouncer, possibly an open
 * transaction with a row lock on a hot per-user row (DeviceHistory / User).
 * When the next request thawed the isolate the stale timers fired, the write
 * "took" 17–440s, got retried, and competed with product queries.
 *
 * Now every background write:
 *   - is scheduled with `after()` so the platform keeps the function alive
 *     until it finishes (no freeze mid-write);
 *   - goes over Neon HTTP (no Prisma TCP pool slot, nothing held across
 *     requests) as one non-interactive request per write;
 *   - runs with SET LOCAL statement_timeout / lock_timeout so it fails fast
 *     instead of waiting on locks, with a single attempt (no retry storms);
 *   - only touches hot per-user rows (User.lastActiveAt, DeviceHistory) when
 *     they are stale, both per isolate and in SQL, so repeated question fetches
 *     are insert-only.
 */
import { after } from "next/server";
import { createId } from "@/lib/id";
import { withNeon } from "@/lib/db-resilience";
import { getRuntimeDatabaseUrl, isPostgresDatabaseUrl } from "@/lib/database-url";
import { hashIp, getUserAgent, parseUserAgent } from "./request-context";
import { enqueueAnalyticsWrite } from "./write-queue";
import type { TrackEventInput } from "./types";
import { EVENT_TYPES } from "./types";

/** Server-side ceiling for any single background analytics statement. */
export const ANALYTICS_STATEMENT_TIMEOUT_MS = 5_000;
/** Give up quickly if a row we touch is locked by someone else. */
export const ANALYTICS_LOCK_TIMEOUT_MS = 2_000;
/** Client-side ceiling (slightly above the server one so Postgres cancels first). */
export const ANALYTICS_CLIENT_TIMEOUT_MS = 6_000;
/** Hot per-user rows are refreshed at most this often. */
export const ACTIVITY_TOUCH_INTERVAL_MS = 15 * 60_000;
const ACTIVITY_TOUCH_INTERVAL_SQL = "15 minutes";

export type PreparedAnalyticsEvent = {
  id: string;
  userId: string | null;
  sessionId: string | null;
  eventType: string;
  category: string;
  metadata: string | null;
  ipHash: string | null;
  /** Present only when this event should refresh User.lastActiveAt. */
  touchUser: boolean;
  /** Present only when this event should refresh DeviceHistory. */
  device: {
    id: string;
    userAgent: string;
    browser: string | null;
    os: string | null;
    deviceType: string | null;
  } | null;
};

/** Per-isolate throttles so repeated fetches don't hit hot per-user rows. */
const lastUserTouch = new Map<string, number>();
const lastDeviceTouch = new Map<string, number>();
const THROTTLE_MAP_MAX = 2_000;

function claimThrottle(map: Map<string, number>, key: string, now: number): boolean {
  const prev = map.get(key) ?? 0;
  if (now - prev < ACTIVITY_TOUCH_INTERVAL_MS) return false;
  map.set(key, now);
  if (map.size > THROTTLE_MAP_MAX) {
    const cutoff = now - ACTIVITY_TOUCH_INTERVAL_MS;
    for (const [k, at] of map) {
      if (at < cutoff) map.delete(k);
    }
  }
  return true;
}

/**
 * Snapshot everything we need from the request synchronously, so the write can
 * run after the response without touching the (possibly consumed) Request.
 */
export function prepareAnalyticsEvent(
  input: TrackEventInput,
  now = Date.now()
): PreparedAnalyticsEvent {
  const ipHash = hashIp(input.req) ?? null;
  const ua = getUserAgent(input.req);
  const isPageView = input.eventType === EVENT_TYPES.PAGE_VIEW;
  const userId = input.userId ?? null;

  // Page views are high-frequency — never touch User/DeviceHistory for them.
  const sideEffects = Boolean(userId) && !isPageView;
  const touchUser = sideEffects && claimThrottle(lastUserTouch, userId!, now);
  let device: PreparedAnalyticsEvent["device"] = null;
  if (sideEffects && ua && claimThrottle(lastDeviceTouch, `${userId}\u0000${ua}`, now)) {
    const parsed = parseUserAgent(ua);
    device = {
      id: createId(),
      userAgent: ua,
      browser: parsed.browser ?? null,
      os: parsed.os ?? null,
      deviceType: parsed.deviceType ?? null,
    };
  }

  return {
    id: createId(),
    userId,
    sessionId: input.sessionId ?? null,
    eventType: input.eventType,
    category: input.category ?? "general",
    metadata: input.metadata ? JSON.stringify(input.metadata) : null,
    ipHash,
    touchUser,
    device,
  };
}

type NeonTxnSql = (strings: TemplateStringsArray, ...values: unknown[]) => unknown;
type NeonTxnClient = {
  transaction: (build: (txn: NeonTxnSql) => unknown[]) => Promise<unknown>;
};

/** Neon HTTP clients are injectable for tests. */
export type AnalyticsSqlProvider = () => Promise<NeonTxnClient>;

const defaultSqlProvider: AnalyticsSqlProvider = async () => {
  const { getNeonSql } = await import("@/db");
  return getNeonSql() as unknown as NeonTxnClient;
};

let sqlProvider: AnalyticsSqlProvider = defaultSqlProvider;

function timeoutPrelude(txn: NeonTxnSql): unknown[] {
  // set_config(..., true) == SET LOCAL, but accepts bind params.
  return [
    txn`SELECT set_config('statement_timeout', ${String(ANALYTICS_STATEMENT_TIMEOUT_MS)}, true)`,
    txn`SELECT set_config('lock_timeout', ${String(ANALYTICS_LOCK_TIMEOUT_MS)}, true)`,
  ];
}

/**
 * Write one prepared event over Neon HTTP. Each logical write is its own short,
 * non-interactive transaction (one HTTP round trip), single attempt, bounded
 * by statement_timeout/lock_timeout. Never throws.
 */
export async function writePreparedAnalyticsEvent(row: PreparedAnalyticsEvent): Promise<void> {
  if (!isPostgresDatabaseUrl(getRuntimeDatabaseUrl())) {
    await writePreparedAnalyticsEventPrisma(row);
    return;
  }

  let sql: NeonTxnClient;
  try {
    sql = await sqlProvider();
  } catch {
    return;
  }

  const opts = { maxAttempts: 1, timeoutMs: ANALYTICS_CLIENT_TIMEOUT_MS } as const;

  try {
    await withNeon(
      "analytics.event.insert",
      () =>
        sql.transaction((txn) => [
          ...timeoutPrelude(txn),
          txn`
            INSERT INTO "AnalyticsEvent" (
              id, "userId", "sessionId", "eventType", category, metadata, "ipHash", "createdAt"
            ) VALUES (
              ${row.id}, ${row.userId}, ${row.sessionId}, ${row.eventType},
              ${row.category}, ${row.metadata}, ${row.ipHash}, NOW()
            )
          `,
        ]),
      opts
    );
  } catch {
    /* analytics must not break product flows */
  }

  if (!row.userId || (!row.touchUser && !row.device)) return;
  const userId = row.userId;
  const device = row.device;

  try {
    await withNeon(
      "analytics.activity.touch",
      () =>
        sql.transaction((txn) => {
          const stmts: unknown[] = [...timeoutPrelude(txn)];
          if (row.touchUser) {
            // Conditional: concurrent isolates won't re-update a fresh row.
            stmts.push(txn`
              UPDATE "User" SET "lastActiveAt" = NOW()
              WHERE id = ${userId}
                AND ("lastActiveAt" IS NULL
                     OR "lastActiveAt" < NOW() - ${ACTIVITY_TOUCH_INTERVAL_SQL}::interval)
            `);
          }
          if (device) {
            // One statement: refresh the latest matching device row only when
            // stale, insert a new row only when none exists.
            stmts.push(txn`
              WITH cur AS (
                SELECT id, "lastSeenAt" FROM "DeviceHistory"
                WHERE "userId" = ${userId} AND "userAgent" = ${device.userAgent}
                ORDER BY "lastSeenAt" DESC
                LIMIT 1
              ),
              upd AS (
                UPDATE "DeviceHistory" d
                SET "lastSeenAt" = NOW(), "ipHash" = COALESCE(${row.ipHash}, d."ipHash")
                FROM cur
                WHERE d.id = cur.id
                  AND cur."lastSeenAt" < NOW() - ${ACTIVITY_TOUCH_INTERVAL_SQL}::interval
                RETURNING d.id
              )
              INSERT INTO "DeviceHistory" (
                id, "userId", "userAgent", browser, os, "deviceType", "ipHash", "firstSeenAt", "lastSeenAt"
              )
              SELECT ${device.id}, ${userId}, ${device.userAgent}, ${device.browser},
                     ${device.os}, ${device.deviceType}, ${row.ipHash}, NOW(), NOW()
              WHERE NOT EXISTS (SELECT 1 FROM cur)
            `);
          }
          return stmts;
        }),
      opts
    );
  } catch {
    /* best-effort */
  }
}

/** Local SQLite dev / tests without Postgres: same semantics through Prisma. */
async function writePreparedAnalyticsEventPrisma(row: PreparedAnalyticsEvent): Promise<void> {
  try {
    const { prisma } = await import("@/lib/prisma");
    await prisma.analyticsEvent.create({
      data: {
        id: row.id,
        userId: row.userId,
        sessionId: row.sessionId,
        eventType: row.eventType,
        category: row.category,
        metadata: row.metadata,
        ipHash: row.ipHash,
      },
    });
    if (!row.userId) return;
    if (row.touchUser) {
      await prisma.user.updateMany({
        where: { id: row.userId },
        data: { lastActiveAt: new Date() },
      });
    }
    if (row.device) {
      const recent = await prisma.deviceHistory.findFirst({
        where: { userId: row.userId, userAgent: row.device.userAgent },
        orderBy: { lastSeenAt: "desc" },
        select: { id: true },
      });
      if (recent) {
        await prisma.deviceHistory.updateMany({
          where: { id: recent.id },
          data: { lastSeenAt: new Date(), ...(row.ipHash ? { ipHash: row.ipHash } : {}) },
        });
      } else {
        await prisma.deviceHistory.create({
          data: {
            id: row.device.id,
            userId: row.userId,
            userAgent: row.device.userAgent,
            browser: row.device.browser,
            os: row.device.os,
            deviceType: row.device.deviceType,
            ipHash: row.ipHash,
          },
        });
      }
    }
  } catch {
    /* analytics must not break product flows */
  }
}

/**
 * Run `task` after the response, keeping the function alive until it is done.
 * Outside a request scope (scripts, cron helpers) `after()` throws; fall back to
 * the bounded in-process queue.
 */
export function scheduleAnalyticsWrite(task: () => Promise<void>): void {
  const safe = async () => {
    try {
      await task();
    } catch {
      /* never surface analytics failures */
    }
  };
  try {
    after(safe);
  } catch {
    enqueueAnalyticsWrite(safe);
  }
}

export const __analyticsWriterTest = {
  setSqlProvider(provider: AnalyticsSqlProvider | null) {
    sqlProvider = provider ?? defaultSqlProvider;
  },
  resetThrottles() {
    lastUserTouch.clear();
    lastDeviceTouch.clear();
  },
};
