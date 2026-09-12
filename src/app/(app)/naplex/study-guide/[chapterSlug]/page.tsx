import type { Metadata } from "next";
import { notFound, unstable_rethrow } from "next/navigation";
import { StudyGuideReader } from "@/components/nclex-study-guide/StudyGuideReader";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { getCachedSession } from "@/lib/auth/session";
import { STUDY_GUIDES } from "@/lib/nclex-study-guide/guide-registry";
import { loadPublishedGuideChapter } from "@/lib/nclex-study-guide/load-published";

export const dynamic = "force-dynamic";

const EXAM = "naplex" as const;
const CONFIG = STUDY_GUIDES[EXAM];

type Props = { params: Promise<{ chapterSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterSlug } = await params;
  return {
    title: { absolute: `${chapterSlug.replace(/-/g, " ")} — ${CONFIG.title}` },
    description: `${CONFIG.title} reader — book surface with highlights and notes.`,
  };
}

export default async function StudyGuideChapterPage({ params }: Props) {
  const { chapterSlug } = await params;
  const session = await getCachedSession();

  let guide;
  let toc;
  let chapter;

  try {
    ({ guide, toc, chapter } = await loadPublishedGuideChapter(EXAM, chapterSlug));
  } catch (e) {
    unstable_rethrow(e);
    console.error(`[${EXAM}/study-guide]`, e);
    return <StudyGuideUnavailable exam={EXAM} />;
  }

  if (!chapter) notFound();

  return (
    <StudyGuideReader
      exam={EXAM}
      guideId={guide?.id ?? CONFIG.guideId}
      guideTitle={guide?.title ?? CONFIG.title}
      chapters={toc ?? []}
      chapter={chapter}
      guestPreview={!session?.user?.id}
    />
  );
}
