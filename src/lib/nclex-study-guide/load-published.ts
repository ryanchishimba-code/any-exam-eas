import {
  getChapterBySlug,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { STUDY_GUIDES, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { getManuscriptChapter, loadManuscriptGuide } from "@/lib/nclex-study-guide/manuscript-fallback";
import { getChapterRelatedTopics } from "@/lib/nclex-study-guide/related-topics";
import { withDbRetry } from "@/lib/nclex-study-guide/with-db-retry";

function manuscriptFirstSlug(exam: StudyGuideExam): string {
  return loadManuscriptGuide(exam).toc[0]?.slug ?? "manuscript-pending";
}

function databaseConfigured(): boolean {
  return Boolean(process.env.DATABASE_URL?.trim());
}

export async function loadPublishedGuideFirstSlug(exam: StudyGuideExam): Promise<string> {
  if (!databaseConfigured()) {
    return manuscriptFirstSlug(exam);
  }
  try {
    const slug = await withDbRetry(async () => {
      const config = STUDY_GUIDES[exam];
      const guide = await getPublishedGuide(exam);
      const toc = await getGuideToc(guide?.id ?? config.guideId);
      return toc[0]?.slug ?? null;
    });
    if (slug) return slug;
  } catch (e) {
    console.warn(`[${exam}/study-guide] published toc unavailable, using manuscript`, e);
  }
  return manuscriptFirstSlug(exam);
}

export async function loadPublishedGuideChapter(
  exam: StudyGuideExam,
  chapterSlug: string
) {
  if (!databaseConfigured()) {
    const manuscript = getManuscriptChapter(exam, chapterSlug);
    if (!manuscript) {
      return { guide: null, toc: [], chapter: null };
    }
    return manuscriptAsPublished(exam, manuscript, chapterSlug);
  }
  try {
    const published = await withDbRetry(async () => {
      const config = STUDY_GUIDES[exam];
      const guide = await getPublishedGuide(exam);
      const guideId = guide?.id ?? config.guideId;
      const [toc, chapter] = await Promise.all([
        getGuideToc(guideId),
        getChapterBySlug(guideId, chapterSlug, exam),
      ]);
      return { guide, toc, chapter };
    });
    if (published.toc.length > 0) return published;
  } catch (e) {
    console.warn(`[${exam}/study-guide] published chapter unavailable, using manuscript`, e);
  }

  const manuscript = getManuscriptChapter(exam, chapterSlug);
  if (!manuscript) {
    return { guide: null, toc: [], chapter: null };
  }
  return manuscriptAsPublished(exam, manuscript, chapterSlug);
}

function manuscriptAsPublished(
  exam: StudyGuideExam,
  manuscript: NonNullable<ReturnType<typeof getManuscriptChapter>>,
  chapterSlug: string
) {
  const config = STUDY_GUIDES[exam];
  return {
    guide: {
      id: manuscript.guide.id,
      title: manuscript.guide.title,
      examSlug: exam,
      examTrack: config.track,
      edition: "1",
      version: "manuscript",
    },
    toc: manuscript.toc,
    chapter: {
      ...manuscript.chapter,
      relatedTopics: getChapterRelatedTopics(exam, chapterSlug),
    },
  };
}
