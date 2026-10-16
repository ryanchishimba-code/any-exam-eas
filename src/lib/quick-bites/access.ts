import type { UserAccess } from "@/lib/access-control";
import { isOpenQuickBite } from "@/lib/quick-bites/catalog";

type QuickBiteAccess = Pick<UserAccess, "role" | "hasPremiumAccess" | "subscription">;

/**
 * The full library is paid-only.
 * Trial and post-trial free members can see the posters, not those files.
 * Staff can play so the library can be reviewed.
 */
export function canPlayQuickBites(access: QuickBiteAccess): boolean {
  if (access.role === "staff") return true;
  return (
    access.role === "subscriber" &&
    access.hasPremiumAccess &&
    access.subscription.status === "active"
  );
}

/**
 * Episode 1 is open to every signed-in member. Episodes 2–16 stay on the paid check.
 * Call this only after authentication. Logged-out requests stay 401.
 */
export function canPlayQuickBiteEpisode(access: QuickBiteAccess, slug: string): boolean {
  if (isOpenQuickBite(slug)) return true;
  return canPlayQuickBites(access);
}
