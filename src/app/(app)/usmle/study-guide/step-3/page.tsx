import { UsmleStudyGuideIndexScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";
import { usmleStudyBook } from "@/lib/nclex-study-guide/guide-registry";

export const metadata = studyGuideGatedMetadata("USMLE Step 3 Study Guide");

export const dynamic = "force-dynamic";

export default function UsmleStep3StudyGuidePage() {
  return <UsmleStudyGuideIndexScreen book={usmleStudyBook("step-3")} />;
}
