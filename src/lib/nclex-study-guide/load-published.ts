import {
  getChapterBySlug,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { STUDY_GUIDES, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { withDbRetry } from "@/lib/nclex-study-guide/with-db-retry";

export async function loadPublishedGuideFirstSlug(exam: StudyGuideExam): Promise<string> {
  return withDbRetry(async () => {
    const config = STUDY_GUIDES[exam];
    const guide = await getPublishedGuide(exam);
    const toc = await getGuideToc(guide?.id ?? config.guideId);
    return toc[0]?.slug ?? "manuscript-pending";
  });
}

export async function loadPublishedGuideChapter(
  exam: StudyGuideExam,
  chapterSlug: string
) {
  return withDbRetry(async () => {
    const config = STUDY_GUIDES[exam];
    const guide = await getPublishedGuide(exam);
    const guideId = guide?.id ?? config.guideId;
    const [toc, chapter] = await Promise.all([
      getGuideToc(guideId),
      getChapterBySlug(guideId, chapterSlug, exam),
    ]);
    return { guide, toc, chapter };
  });
}
