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
 * The nursing sample is playable without a paid plan.
 * Every other nursing episode stays on the paid check.
 * The media route serves that one sample with no session. This helper is for a signed-in caller.
 */
export function canPlayQuickBiteEpisode(access: QuickBiteAccess, slug: string): boolean {
  if (isOpenQuickBite(slug)) return true;
  return canPlayQuickBites(access);
}
