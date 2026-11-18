import { getCachedSession } from "@/lib/auth/session";
import { hasMinRole } from "@/lib/permissions";
import { isUsmleStudyGuidePublic, isUsmleStudyGuideReleased } from "./usmle-guide-public";

/**
 * The route is open to learners when either flag is on.
 * USMLE_STUDY_GUIDE_PUBLIC is server-only and is read at request time.
 * NEXT_PUBLIC_USMLE_STUDY_GUIDE_PUBLIC also turns on in-app links after a rebuild.
 * Until one of them is set, students get a 404 and an admin can preview.
 */

export { isUsmleStudyGuidePublic, isUsmleStudyGuideReleased };

/** Admin and super_admin may open the books while they are still hidden. */
export async function canPreviewUsmleStudyGuide(): Promise<boolean> {
  if (isUsmleStudyGuideReleased()) return true;
  const session = await getCachedSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return hasMinRole(role, "admin");
}

export type UsmleGuideGate = "open" | "preview" | "hidden";

export async function usmleGuideGate(): Promise<UsmleGuideGate> {
  if (isUsmleStudyGuideReleased()) return "open";
  if (await canPreviewUsmleStudyGuide()) return "preview";
  return "hidden";
}
