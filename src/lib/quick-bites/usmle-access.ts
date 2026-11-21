import { getCachedSession } from "@/lib/auth/session";
import { hasMinRole } from "@/lib/permissions";
import { isUsmleQuickBitesReleased } from "@/lib/quick-bites/usmle-flags";

export { isUsmleQuickBitesPublic, isUsmleQuickBitesReleased } from "@/lib/quick-bites/usmle-flags";

/** Admin and super_admin may preview the library while it is still hidden. */
export async function canPreviewUsmleQuickBites(): Promise<boolean> {
  if (isUsmleQuickBitesReleased()) return true;
  const session = await getCachedSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return hasMinRole(role, "admin");
}

export type UsmleQuickBitesGate = "open" | "preview" | "hidden";

export async function usmleQuickBitesGate(): Promise<UsmleQuickBitesGate> {
  if (isUsmleQuickBitesReleased()) return "open";
  if (await canPreviewUsmleQuickBites()) return "preview";
  return "hidden";
}
