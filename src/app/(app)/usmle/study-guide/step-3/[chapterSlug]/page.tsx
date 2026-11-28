import type { Metadata } from "next";
import { UsmleStudyGuideChapterScreen } from "@/components/nclex-study-guide/StudyGuideChapterScreen";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";
import { usmleStudyBook } from "@/lib/nclex-study-guide/guide-registry";

export const dynamic = "force-dynamic";

const BOOK = usmleStudyBook("step-3");

type Props = { params: Promise<{ chapterSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  await params;
  return studyGuideGatedMetadata(BOOK.title);
}

export default async function UsmleStep3ChapterPage({ params }: Props) {
  const { chapterSlug } = await params;
  return <UsmleStudyGuideChapterScreen book={BOOK} chapterSlug={chapterSlug} />;
}