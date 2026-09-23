import { describe, expect, it, vi } from "vitest";
import {
  ACTIVE_INVENTORY_CACHE_KEY,
  ACTIVE_INVENTORY_CACHE_TAG,
  ACTIVE_INVENTORY_CACHE_TTL_SECONDS,
  ACTIVE_INVENTORY_CDN_STALE_SECONDS,
  ACTIVE_INVENTORY_PATHS,
  activeInventoryRevalidateUrl,
  bulkActionAffectsActiveInventory,
  changedFieldsAffectActiveInventory,
  isCronSecretAuthorized,
  requestActiveInventoryRevalidation,
  shouldRevalidateInventoryAfterRetire,
} from "./active-inventory-cache";

describe("active inventory cache identity", () => {
  it("keeps a one-hour TTL fallback and the question-bank-counts tag", () => {
    expect(ACTIVE_INVENTORY_CACHE_TAG).toBe("question-bank-counts");
    expect(ACTIVE_INVENTORY_CACHE_TTL_SECONDS).toBe(3600);
    expect(ACTIVE_INVENTORY_CACHE_KEY).toEqual(["marketing-active-inventory-v2"]);
    expect(ACTIVE_INVENTORY_CDN_STALE_SECONDS).toBeLessThan(300);
  });

  it("revalidates the NCLEX hub and the question bank together", () => {
    expect(ACTIVE_INVENTORY_PATHS).toContain("/nclex");
    expect(ACTIVE_INVENTORY_PATHS).toContain("/question-bank");
    expect(ACTIVE_INVENTORY_PATHS).toContain("/api/marketing/bank-counts");
  });
});

describe("inventory invalidation predicates", () => {
  it("treats active and qaPassed writes as inventory changes", () => {
    expect(changedFieldsAffectActiveInventory(["question"])).toBe(false);
    expect(changedFieldsAffectActiveInventory(["reviewStatus"])).toBe(false);
    expect(changedFieldsAffectActiveInventory(["active"])).toBe(true);
    expect(changedFieldsAffectActiveInventory(["qaPassed", "explanation"])).toBe(true);
  });

  it("revalidates publish toggles and skips flag or tag edits", () => {
    expect(bulkActionAffectsActiveInventory("approve")).toBe(true);
    expect(bulkActionAffectsActiveInventory("reject")).toBe(true);
    expect(bulkActionAffectsActiveInventory("archive")).toBe(true);
    expect(bulkActionAffectsActiveInventory("activate")).toBe(true);
    expect(bulkActionAffectsActiveInventory("qa_pass")).toBe(true);
    expect(bulkActionAffectsActiveInventory("qa_unpass")).toBe(true);
    expect(bulkActionAffectsActiveInventory("flag")).toBe(false);
    expect(bulkActionAffectsActiveInventory("set_tags")).toBe(false);
  });

  it("revalidates only after an apply that wrote rows", () => {
    expect(shouldRevalidateInventoryAfterRetire(false, 10)).toBe(false);
    expect(shouldRevalidateInventoryAfterRetire(true, 0)).toBe(false);
    expect(shouldRevalidateInventoryAfterRetire(true, 1)).toBe(true);
  });
});

describe("requestActiveInventoryRevalidation", () => {
  it("prefers an explicit URL, then the site origin, then production", () => {
    expect(activeInventoryRevalidateUrl({})).toBe(
      "https://www.anyexameasy.com/api/cron/revalidate-inventory"
    );
    expect(
      activeInventoryRevalidateUrl({ NEXT_PUBLIC_SITE_URL: "http://localhost:3000/" })
    ).toBe("http://localhost:3000/api/cron/revalidate-inventory");
    expect(
      activeInventoryRevalidateUrl({
        INVENTORY_REVALIDATE_URL: "https://preview.example/api/cron/revalidate-inventory/",
        NEXT_PUBLIC_SITE_URL: "http://localhost:3000",
      })
    ).toBe("https://preview.example/api/cron/revalidate-inventory");
  });

  it("does not call the network without CRON_SECRET", async () => {
    const fetchImpl = vi.fn();
    const result = await requestActiveInventoryRevalidation({}, fetchImpl);
    expect(result.ok).toBe(false);
    expect(result.error).toMatch(/CRON_SECRET/);
    expect(fetchImpl).not.toHaveBeenCalled();
  });

  it("POSTs the bearer secret and reports a failed status", async () => {
    const fetchImpl = vi.fn().mockResolvedValue(new Response("no", { status: 401 }));
    const result = await requestActiveInventoryRevalidation(
      { CRON_SECRET: "secret", NEXT_PUBLIC_SITE_URL: "https://www.anyexameasy.com" },
      fetchImpl
    );
    expect(result.ok).toBe(false);
    expect(result.status).toBe(401);
    expect(fetchImpl).toHaveBeenCalledWith(
      "https://www.anyexameasy.com/api/cron/revalidate-inventory",
      expect.objectContaining({
        method: "POST",
        headers: { authorization: "Bearer secret" },
      })
    );
  });

  it("accepts the cron bearer and rejects a spoofed Vercel cron header", () => {
    const env = { CRON_SECRET: "secret", VERCEL: "1" };
    expect(
      isCronSecretAuthorized(
        new Request("https://example.com", { headers: { authorization: "Bearer secret" } }),
        env
      )
    ).toBe(true);
    expect(
      isCronSecretAuthorized(
        new Request("https://example.com", { headers: { "x-vercel-cron": "1" } }),
        env
      )
    ).toBe(false);
    expect(isCronSecretAuthorized(new Request("https://example.com"), env)).toBe(false);
  });
});
