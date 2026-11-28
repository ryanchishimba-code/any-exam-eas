import { getCachedSession } from "@/lib/auth/session";
import { hasMinRole } from "@/lib/permissions";
import { isUsmleFeedStep, isUsmleStudyFeedPublic } from "@/lib/study-feed/usmle-feed";

/**
 * The route is open to learners when either flag is on.
 * USMLE_STUDY_FEED_PUBLIC is server-only and is read at request time.
 * NEXT_PUBLIC_USMLE_STUDY_FEED_PUBLIC also turns on in-app links after a rebuild.
 */
export function isUsmleFeedReleased(): boolean {
  if (isUsmleStudyFeedPublic()) return true;
  const raw = process.env.USMLE_STUDY_FEED_PUBLIC ?? "";
  return raw === "1" || raw === "true";
}

/** Admin and super_admin may preview the feed while it is still hidden. */
export async function canPreviewUsmleFeed(): Promise<boolean> {
  if (isUsmleFeedReleased()) return true;
  const session = await getCachedSession();
  const role = (session?.user as { role?: string } | undefined)?.role;
  return hasMinRole(role, "admin");
}

export type UsmleFeedGate = "open" | "preview" | "hidden";

export async function usmleFeedGate(exam: string): Promise<UsmleFeedGate> {
  if (!isUsmleFeedStep(exam)) return "open";
  if (isUsmleFeedReleased()) return "open";
  if (await canPreviewUsmleFeed()) return "preview";
  return "hidden";
}
