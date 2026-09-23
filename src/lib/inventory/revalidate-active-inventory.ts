import { revalidatePath, revalidateTag } from "next/cache";
import {
  ACTIVE_INVENTORY_CACHE_TAG,
  ACTIVE_INVENTORY_PATHS,
} from "@/lib/inventory/active-inventory-cache";

export type ActiveInventoryRevalidateResult =
  | { ok: true }
  | { ok: false; error: string };

/**
 * Drop the shared inventory cache and the pages that baked it into HTML.
 * Safe to call from a route handler. Outside a Next request this returns
 * `{ ok: false }` instead of throwing.
 */
export function revalidateActiveQuestionInventory(): ActiveInventoryRevalidateResult {
  try {
    revalidateTag(ACTIVE_INVENTORY_CACHE_TAG);
    for (const path of ACTIVE_INVENTORY_PATHS) {
      revalidatePath(path);
    }
    return { ok: true };
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Inventory cache revalidation failed.";
    // Next throws this outside a request (CLI, unit tests). Other errors,
    // including dynamic-rendering bailouts, must keep propagating.
    if (!message.includes("static generation store missing")) {
      throw error;
    }
    console.error("[inventory] cache revalidate failed:", error);
    return { ok: false, error: message };
  }
}
