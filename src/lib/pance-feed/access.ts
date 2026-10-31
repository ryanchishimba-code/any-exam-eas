import type { UserAccess } from "@/lib/access-control";
import { canPlayQuickBites } from "@/lib/quick-bites/access";

/**
 * Paid plans only. Reuses the Quick Bites paid-plan gate:
 * an active subscriber, or staff reviewing the library.
 * Trial and post-trial free accounts are unpaid for this surface.
 */
export function canUsePanceFeed(
  access: Pick<UserAccess, "role" | "hasPremiumAccess" | "subscription">
): boolean {
  return canPlayQuickBites(access);
}
