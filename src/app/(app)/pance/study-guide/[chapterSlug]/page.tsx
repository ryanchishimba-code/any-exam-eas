import type { Metadata } from "next";
import { StudyGuideChapterScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";
import { STUDY_GUIDES } from "@/lib/nclex-study-guide/guide-registry";

export const dynamic = "force-dynamic";

const CONFIG = STUDY_GUIDES["pance"];

type Props = { params: Promise<{ chapterSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return studyGuideGatedMetadata(CONFIG.title);
}

export default async function StudyGuideChapterPage({ params }: Props) {
  const { chapterSlug } = await params;
  return <StudyGuideChapterScreen exam="pance" chapterSlug={chapterSlug} />;
}
