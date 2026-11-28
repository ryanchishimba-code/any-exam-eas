import { getCachedSession } from "@/lib/auth/session";
import { hasMinRole } from "@/lib/permissions";
import {
  isUsmleGuideFileFallback,
  isUsmleStudyGuideReleased,
} from "@/lib/nclex-study-guide/usmle-guide-flags";

export {
  isUsmleGuideFileFallback,
  isUsmleStudyGuidePublic,
  isUsmleStudyGuideReleased,
} from "@/lib/nclex-study-guide/usmle-guide-flags";

/** Admin and super_admin may preview the books while they are still hidden. */
export async function canPreviewUsmleStudyGuide(): Promise<boolean> {
  if (isUsmleStudyGuideReleased()) return true;
  const session = await getCachedSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return hasMinRole(role, "admin");
}

export type UsmleStudyGuideVisibility = "open" | "preview" | "hidden";

export async function usmleStudyGuideVisibility(): Promise<UsmleStudyGuideVisibility> {
  if (isUsmleGuideFileFallback()) return "open";
  if (isUsmleStudyGuideReleased()) return "open";
  if (await canPreviewUsmleStudyGuide()) return "preview";
  return "hidden";
}
