/**
 * Shared cache identity for the active-question inventory.
 *
 * Marketing hubs (`/nclex` and the other board pages) and the question bank
 * both read `getCachedBankStatsBundle()`. That helper is one `unstable_cache`
 * entry. Deactivating a question does not expire it, so the UI can keep a
 * retired total until the TTL elapses. Callers that change `active` or
 * `qaPassed` must revalidate the tag and the paths below.
 *
 * This module stays free of `next/cache` and the app route map so the retire
 * script can import it.
 */

/** Tag passed to `unstable_cache` and `revalidateTag`. */
export const ACTIVE_INVENTORY_CACHE_TAG = "question-bank-counts";

/**
 * Fallback when a writer does not revalidate. A hard refresh does not skip
 * this. On-demand revalidation is what makes the hub and the Qbank match the
 * database immediately.
 */
export const ACTIVE_INVENTORY_CACHE_TTL_SECONDS = 60 * 60;

/**
 * v2 abandons the v1 entry that stayed warm after rows were retired without
 * a tag purge. The inventory query itself is unchanged.
 */
export const ACTIVE_INVENTORY_CACHE_KEY = ["marketing-active-inventory-v2"] as const;

/**
 * How long the public counts API may keep serving the previous payload after
 * `s-maxage` expires. Short on purpose: a day-long stale-while-revalidate
 * kept the old total on hard refresh after the data cache had expired.
 */
export const ACTIVE_INVENTORY_CDN_STALE_SECONDS = 60;

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

export function isCronSecretAuthorized(
  req: Request,
  env: NodeJS.ProcessEnv = process.env
): boolean {
  const secret = env.CRON_SECRET?.trim();
  if (!secret) return false;
  if (req.headers.get("authorization") === `Bearer ${secret}`) return true;
  return req.headers.get("x-vercel-cron") === "1" && Boolean(env.VERCEL);
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
