import type { UserAccess } from "@/lib/access-control";
import { canPlayQuickBites } from "@/lib/quick-bites/access";

type FeedAccess = Pick<UserAccess, "role" | "hasPremiumAccess" | "subscription">;

/**
 * Paid plans only. Reuses the Quick Bites paid-plan gate:
 * an active subscriber, or staff reviewing the library.
 * Trial accounts get a fixed slice instead. Post-trial free accounts stay locked.
 */
export function canUsePanceFeed(access: FeedAccess): boolean {
  return canPlayQuickBites(access);
}

export type FlashcardFeedLevel = "full" | "trial" | "locked";

/** Full deck for a paid plan or staff. A live free trial gets the fixed slice. */
export function flashcardFeedLevel(access: FeedAccess): FlashcardFeedLevel {
  if (canUsePanceFeed(access)) return "full";
  if (
    access.role === "trial" &&
    access.hasPremiumAccess &&
    access.subscription.status === "trialing"
  ) {
    return "trial";
  }
  return "locked";
}
