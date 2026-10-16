import type { UserAccess } from "@/lib/access-control";

/**
 * Video Quick Bites is paid-only.
 * Trial and post-trial free members can see the posters, not the files.
 * Staff can play so the library can be reviewed.
 */
export function canPlayQuickBites(
  access: Pick<UserAccess, "role" | "hasPremiumAccess" | "subscription">
): boolean {
  if (access.role === "staff") return true;
  return (
    access.role === "subscriber" &&
    access.hasPremiumAccess &&
    access.subscription.status === "active"
  );
}
