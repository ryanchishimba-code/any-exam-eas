import type { Metadata } from "next";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideReader } from "@/components/nclex-study-guide/StudyGuideReader";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { getCachedSession } from "@/lib/auth/session";
import {
  DEFAULT_NCLEX_GUIDE_ID,
  getChapterBySlug,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { withDbRetry } from "@/lib/nclex-study-guide/with-db-retry";
import { requirePremiumPage } from "@/lib/require-premium-page";
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

  const callbackPath = `${ROUTES.nclexStudyGuide}/${chapterSlug}`;

  let guide;
  let toc;
  let chapter;

  // The access check queries the database too, so it shares the content's
  // fallback. `unstable_rethrow` lets the login and paywall redirects through —
  // catching them here would hand the book to anyone during a blip.
  try {
    ({ guide, toc, chapter } = await withDbRetry(async () => {
      const session = await getCachedSession();
      if (!session?.user?.id) {
        redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(callbackPath)}`);
      }
      await requirePremiumPage(ROUTES.nclexStudyGuide);

      const loadedGuide = await getPublishedGuide("rn");
      const guideId = loadedGuide?.id ?? DEFAULT_NCLEX_GUIDE_ID;
      return {
        guide: loadedGuide,
        toc: await getGuideToc(guideId),
        chapter: await getChapterBySlug(guideId, chapterSlug),
      };
    }));
  } catch (e) {
    unstable_rethrow(e);
    console.error("[nclex/study-guide]", e);
    return <StudyGuideUnavailable />;
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
