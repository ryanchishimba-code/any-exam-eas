import { notFound, redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { usmleStudyBook, usmleStudyBookForField } from "@/lib/nclex-study-guide/guide-registry";
import {
  isUsmleGuideFileFallback,
  usmleStudyGuideVisibility,
} from "@/lib/nclex-study-guide/usmle-guide-access";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";

export const dynamic = "force-dynamic";

export const metadata = studyGuideGatedMetadata("USMLE Study Guide");

/** Picks the learner's Step book. Students get a 404 until the flags are on. */
export default async function UsmleStudyGuideHubPage() {
  const visibility = await usmleStudyGuideVisibility();
  if (visibility === "hidden") notFound();
  if (isUsmleGuideFileFallback()) {
    redirect(usmleStudyBook("step-1").routeBase);
  }
  const session = await getCachedSession();
  const userId = session?.user?.id;
  const field = userId ? (await getUserEdtechMetadata(userId)).usmleFieldId : undefined;
  redirect(usmleStudyBookForField(field).routeBase);
}
