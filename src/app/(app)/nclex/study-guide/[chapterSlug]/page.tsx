import type { Metadata } from "next";
import { StudyGuideChapterScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";
import { STUDY_GUIDES } from "@/lib/nclex-study-guide/guide-registry";

export const dynamic = "force-dynamic";

const CONFIG = STUDY_GUIDES.nclex;

type Props = { params: Promise<{ chapterSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return {
    title: { absolute: CONFIG.title },
    description: `${CONFIG.title}. Bookmarks and highlights are included with the trial or Pro plan.`,
  };
}

export default async function StudyGuideChapterPage({ params }: Props) {
  const { chapterSlug } = await params;
  return <StudyGuideChapterScreen exam="nclex" chapterSlug={chapterSlug} />;
}
