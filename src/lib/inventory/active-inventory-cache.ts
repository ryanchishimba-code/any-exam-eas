/**
 * Shared cache identity for the active-question inventory.
 *
 * Marketing hubs (`/nclex` and the other board pages) and the question bank
 * both read `getCachedBankStatsBundle()`. The heavy snapshot is one
 * `unstable_cache` entry, keyed by a live published stamp from the database.
 * A retire or publish changes that stamp, so the next request rebuilds even
 * when nobody called `POST /api/cron/revalidate-inventory`.
 *
 * Writers that run inside a Next request still revalidate the tag and the
 * paths below. That drops Full Route Cache and Redis fallbacks immediately.
 * The cron purge is optional. A missing `CRON_SECRET` must not leave the UI
 * on the previous total.
 *
 * This module stays free of `next/cache`, the app route map, and Node built-ins
 * so the retire script and marketing client components can import it. Cron
 * authorization lives in `@/lib/cron-auth`.
 */

/** Tag passed to `unstable_cache` and `revalidateTag`. */
export const ACTIVE_INVENTORY_CACHE_TAG = "question-bank-counts";

/**
 * How long an unchanged stamp may reuse the heavy group-by. The stamp itself
 * is read on every request, so this TTL does not keep a retired total on screen.
 */
export const ACTIVE_INVENTORY_CACHE_TTL_SECONDS = 60 * 60;

/**
 * v4 adds the per-topic format split the Qbank uses for NGN and case counts.
 * v3 is keyed with the published stamp (`published:touchedAt`). v2 stayed warm
 * for an hour when a retire skipped the cron purge.
 */
export const ACTIVE_INVENTORY_CACHE_KEY = ["marketing-active-inventory-v6"] as const;

/**
 * Public count responses must not sit in a browser or CDN cache.
 * A hard refresh has to reach the stamp check.
 */
export const ACTIVE_INVENTORY_RESPONSE_CACHE_CONTROL =
  "private, no-cache, no-store, max-age=0, must-revalidate";

export const ACTIVE_INVENTORY_REVALIDATE_PATH = "/api/cron/revalidate-inventory";

const DEFAULT_REVALIDATE_ORIGIN = "https://www.anyexameasy.com";

/**
 * Pages and routes that render the cached inventory into HTML or JSON.
 * `/npte` is the public alias of `/npte-pt`.
 */
export const ACTIVE_INVENTORY_PATHS = [
  "/",
  "/nclex",
  "/usmle",
  "/naplex",
  "/pance",
  "/aanp-fnp",
  "/npte-pt",
  "/npte",
  "/about",
  "/free-guides",
  "/question-bank",
  "/api/marketing/bank-counts",
  "/api/catalog/subjects",
  "/api/exams/usmle",
] as const;

const INVENTORY_BULK_ACTIONS = new Set([
  "approve",
  "reject",
  "archive",
  "activate",
  "qa_pass",
  "qa_unpass",
]);

/** True when an admin patch actually changed publication fields the inventory counts. */
export function changedFieldsAffectActiveInventory(fields: Iterable<string>): boolean {
  for (const field of fields) {
    if (field === "active" || field === "qaPassed") return true;
  }
  return false;
}

/** Bulk actions that write `active` or `qaPassed`. Flag and tag edits do not. */
export function bulkActionAffectsActiveInventory(action: string): boolean {
  return INVENTORY_BULK_ACTIONS.has(action);
}

/** Revalidate only after an apply that changed at least one row. */
export function shouldRevalidateInventoryAfterRetire(apply: boolean, written: number): boolean {
  return apply && written > 0;
}

function stripTrailingSlash(value: string): string {
  return value.trim().replace(/\/$/, "");
}

/**
 * Origin or full URL the retire script calls.
 * `INVENTORY_REVALIDATE_URL` wins, then the public site URL, then production.
 */
export function activeInventoryRevalidateUrl(env: NodeJS.ProcessEnv = process.env): string {
  const explicit = env.INVENTORY_REVALIDATE_URL?.trim();
  if (explicit) {
    const url = stripTrailingSlash(explicit);
    if (url.includes("/api/")) return url;
    return `${url}${ACTIVE_INVENTORY_REVALIDATE_PATH}`;
  }
  const origin = stripTrailingSlash(
    env.NEXT_PUBLIC_SITE_URL || env.NEXTAUTH_URL || DEFAULT_REVALIDATE_ORIGIN
  );
  return `${origin}${ACTIVE_INVENTORY_REVALIDATE_PATH}`;
}

export type InventoryRevalidateRequestResult = {
  ok: boolean;
  url: string;
  status?: number;
  error?: string;
};

/**
 * CLI copy for an optional cron purge.
 * A failed purge does not leave `/nclex` or the Qbank on the old total: the
 * next request compares the published stamp and rebuilds.
 */
export function describeInventoryRevalidateResult(
  result: InventoryRevalidateRequestResult
): string {
  if (result.ok) return `Inventory cache revalidated: ${result.url}`;
  return `Public inventory refreshes from the database on the next request. Optional purge was not completed (${result.url}): ${result.error ?? "unknown error"}`;
}

/** Ask the deployed app to drop the inventory cache. Used by CLI scripts. */
export async function requestActiveInventoryRevalidation(
  env: NodeJS.ProcessEnv = process.env,
  fetchImpl: typeof fetch = fetch
): Promise<InventoryRevalidateRequestResult> {
  const url = activeInventoryRevalidateUrl(env);
  const secret = env.CRON_SECRET?.trim();
  if (!secret) {
    return {
      ok: false,
      url,
      error: "CRON_SECRET is not set, so the public inventory cache was not cleared.",
    };
  }

  try {
    const response = await fetchImpl(url, {
      method: "POST",
      headers: { authorization: `Bearer ${secret}` },
      cache: "no-store",
    });
    if (!response.ok) {
      return {
        ok: false,
        url,
        status: response.status,
        error: `Inventory revalidate failed (${response.status}).`,
      };
    }
    return { ok: true, url, status: response.status };
  } catch (error) {
    return {
      ok: false,
      url,
      error: error instanceof Error ? error.message : "Inventory revalidate request failed.",
    };
  }
}
