import { StudyGuideIndexScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";

export const metadata = studyGuideGatedMetadata("AANP FNP Study Guide");

export const dynamic = "force-dynamic";

/** /aanp-fnp/study-guide → first chapter after the premium gate. */
export default function StudyGuideIndexPage() {
  return <StudyGuideIndexScreen exam="aanp-fnp" />;
}
