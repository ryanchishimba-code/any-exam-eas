/**
 * Admin audit trail — never block request handlers or pin Prisma's
 * connection_limit=1 slot. Writes go through Neon HTTP after the response.
 */
import { after } from "next/server";
import { createId } from "@/lib/id";
import { hashIp } from "@/lib/analytics/request-context";
import { withNeon } from "@/lib/db-resilience";

export type AdminActionParams = {
  actorId: string;
  action: string;
  targetType?: string;
  targetId?: string;
  metadata?: Record<string, unknown>;
  req?: Request;
};

/** High-churn read audits — debounce so dashboard refreshes don't spam Neon. */
const VIEW_ACTION_DEBOUNCE_MS = 5 * 60_000;
const viewActionLastLogged = new Map<string, number>();

function isViewAction(action: string): boolean {
  return action.startsWith("VIEW_");
}

function shouldSkipDebouncedView(actorId: string, action: string): boolean {
  if (!isViewAction(action)) return false;
  const key = `${actorId}:${action}`;
  const now = Date.now();
  const last = viewActionLastLogged.get(key) ?? 0;
  if (now - last < VIEW_ACTION_DEBOUNCE_MS) return true;
  viewActionLastLogged.set(key, now);
  // Bound map growth in long-lived isolates.
  if (viewActionLastLogged.size > 500) {
    const cutoff = now - VIEW_ACTION_DEBOUNCE_MS;
    for (const [k, at] of viewActionLastLogged) {
      if (at < cutoff) viewActionLastLogged.delete(k);
    }
  }
  return false;
}

type PreparedAdminAction = {
  id: string;
  actorId: string;
  action: string;
  targetType: string | null;
  targetId: string | null;
  metadata: string | null;
  ipHash: string | null;
};

async function writeAdminActionHttp(row: PreparedAdminAction): Promise<void> {
  const { getNeonSql } = await import("@/db");
  const sql = getNeonSql();
  await withNeon(
    "audit.adminAction.insert",
    async () => {
      await sql`
        INSERT INTO "AdminAction" (
          id, "actorId", action, "targetType", "targetId", metadata, "ipHash", "createdAt"
        ) VALUES (
          ${row.id},
          ${row.actorId},
          ${row.action},
          ${row.targetType},
          ${row.targetId},
          ${row.metadata},
          ${row.ipHash},
          NOW()
        )
      `;
    },
    { maxAttempts: 1, timeoutMs: 3_000 }
  );
}

function scheduleAuditWrite(run: () => Promise<void>): void {
  const safe = async () => {
    try {
      await run();
    } catch {
      /* never surface audit failures to callers */
    }
  };

  try {
    after(safe);
  } catch {
    void safe();
  }
}

/**
 * Record an admin/staff action. Safe to call with `void` — never awaits Neon
 * on the request path and never uses the Prisma TCP pool.
 */
export function logAdminAction(params: AdminActionParams): void {
  if (!params.actorId || !params.action) return;
  if (shouldSkipDebouncedView(params.actorId, params.action)) return;

  const row: PreparedAdminAction = {
    id: createId(),
    actorId: params.actorId,
    action: params.action,
    targetType: params.targetType ?? null,
    targetId: params.targetId ?? null,
    metadata: params.metadata ? JSON.stringify(params.metadata) : null,
    ipHash: hashIp(params.req),
  };

  scheduleAuditWrite(() => writeAdminActionHttp(row));
}

/** Test helpers */
export const __auditTest = {
  isViewAction,
  shouldSkipDebouncedView,
  VIEW_ACTION_DEBOUNCE_MS,
  clearViewDebounce() {
    viewActionLastLogged.clear();
  },
};
