import { UsmleStudyGuideIndexScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";
import { usmleStudyBook } from "@/lib/nclex-study-guide/guide-registry";

export const metadata = studyGuideGatedMetadata("USMLE Step 2 CK Study Guide");

export const dynamic = "force-dynamic";

export default function UsmleStep2StudyGuidePage() {
  return <UsmleStudyGuideIndexScreen book={usmleStudyBook("step-2-ck")} />;
}
