import { UsmleStudyGuideIndexScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";
import { usmleStudyBook } from "@/lib/nclex-study-guide/guide-registry";

export const dynamic = "force-dynamic";

export default function UsmleStep2StudyGuidePage() {
  return <UsmleStudyGuideIndexScreen book={usmleStudyBook("step-2-ck")} />;
}
