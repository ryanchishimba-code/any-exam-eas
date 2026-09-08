import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { StudyGuideReader } from "@/components/nclex-study-guide/StudyGuideReader";
import {
  DEFAULT_NCLEX_GUIDE_ID,
  getChapterBySlug,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ chapterSlug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { chapterSlug } = await params;
  return {
    title: { absolute: `${chapterSlug.replace(/-/g, " ")} — NCLEX Study Guide` },
    description: "NCLEX Study Guide reader — book surface with highlights and notes.",
  };
}

export default async function StudyGuideChapterPage({ params }: Props) {
  const { chapterSlug } = await params;

  let guide;
  let toc;
  let chapter;

  try {
    guide = await getPublishedGuide("rn");
    const guideId = guide?.id ?? DEFAULT_NCLEX_GUIDE_ID;
    toc = await getGuideToc(guideId);
    chapter = await getChapterBySlug(guideId, chapterSlug);
  } catch (e) {
    console.error("[nclex/study-guide]", e);
    return (
      <main
        className="flex min-h-[100dvh] flex-col items-center justify-center gap-4 px-6 text-center"
        style={{ background: "#0b1c2c", color: "#e8eef4" }}
      >
        <h1 className="text-2xl font-bold">Study Guide database not ready</h1>
        <p className="max-w-md text-sm text-white/65">
          Run the Prisma migration for <code>sg_*</code> tables, then reload. See{" "}
          <code>DEV.md</code> in the study-guide module.
        </p>
        <Link href={ROUTES.nclexHub} className="text-sm font-semibold" style={{ color: "#2ec4b6" }}>
          ← NCLEX hub
        </Link>
      </main>
    );
  }

  if (!chapter) notFound();

  return (
    <StudyGuideReader
      guideId={guide?.id ?? DEFAULT_NCLEX_GUIDE_ID}
      guideTitle={guide?.title ?? "NCLEX-RN Study Guide"}
      chapters={toc ?? []}
      chapter={chapter}
    />
  );
}
