import { StudyGuideIndexScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";

export const dynamic = "force-dynamic";

/** /aanp-fnp/study-guide → first chapter after the premium gate. */
export default function StudyGuideIndexPage() {
  return <StudyGuideIndexScreen exam="aanp-fnp" />;
}
