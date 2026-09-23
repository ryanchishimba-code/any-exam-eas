import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("next/cache", () => ({
  revalidateTag: vi.fn(),
  revalidatePath: vi.fn(),
}));

import { revalidatePath, revalidateTag } from "next/cache";
import { cacheGet, cacheKey, cacheSet } from "@/lib/cache";
import { ACTIVE_INVENTORY_CACHE_TAG, ACTIVE_INVENTORY_PATHS } from "./active-inventory-cache";
import { revalidateActiveQuestionInventory } from "./revalidate-active-inventory";

describe("revalidateActiveQuestionInventory", () => {
  beforeEach(() => {
    vi.mocked(revalidateTag).mockReset();
    vi.mocked(revalidatePath).mockReset();
  });

  it("drops subject-count fallbacks along with the shared tag", () => {
    const key = cacheKey(["subject-served-counts", "nursing"]);
    cacheSet(key, { "med-surg": 10 }, 60_000);
    revalidateActiveQuestionInventory();
    expect(cacheGet(key)).toBeNull();
  });

  it("drops the shared tag and every surface that renders it", () => {
    const result = revalidateActiveQuestionInventory();
    expect(result).toEqual({ ok: true });
    expect(revalidateTag).toHaveBeenCalledWith(ACTIVE_INVENTORY_CACHE_TAG);
    for (const path of ACTIVE_INVENTORY_PATHS) {
      expect(revalidatePath).toHaveBeenCalledWith(path);
    }
    expect(revalidatePath).toHaveBeenCalledWith("/nclex");
    expect(revalidatePath).toHaveBeenCalledWith("/question-bank");
  });

  it("returns a failure when Next cannot revalidate outside a request", () => {
    vi.mocked(revalidateTag).mockImplementation(() => {
      throw new Error("static generation store missing");
    });
    const errorSpy = vi.spyOn(console, "error").mockImplementation(() => {});
    const result = revalidateActiveQuestionInventory();
    errorSpy.mockRestore();
    expect(result).toEqual({ ok: false, error: "static generation store missing" });
    expect(revalidatePath).not.toHaveBeenCalled();
  });
});
