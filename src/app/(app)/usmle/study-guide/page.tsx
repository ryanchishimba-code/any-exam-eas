import { UsmleStudyGuideIndexRedirect } from "@/components/nclex-study-guide/UsmleStudyGuideScreen";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";

export const dynamic = "force-dynamic";

export const metadata = studyGuideGatedMetadata("USMLE Study Guide");

/** Hidden until the USMLE study-guide flags are on. Admins can preview. */
export default async function UsmleStudyGuideIndexPage() {
  await UsmleStudyGuideIndexRedirect();
}
