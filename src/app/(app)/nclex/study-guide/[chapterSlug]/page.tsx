import type { Metadata } from "next";
import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideReader } from "@/components/nclex-study-guide/StudyGuideReader";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { getCachedSession } from "@/lib/auth/session";
import {
  getChapterBySlug,
  getGuideToc,
  getPublishedGuide,
} from "@/lib/nclex-study-guide";
import { STUDY_GUIDES } from "@/lib/nclex-study-guide/guide-registry";
import { withDbRetry } from "@/lib/nclex-study-guide/with-db-retry";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";

export const dynamic = "force-dynamic";

/** This route folder is the NCLEX book; NAPLEX has its own under /naplex. */
const EXAM = "nclex" as const;
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

  const callbackPath = `${CONFIG.routeBase}/${chapterSlug}`;

  let guide;
  let toc;
  let chapter;

  // The access check queries the database too, so it shares the content's
  // fallback. `unstable_rethrow` lets the login and paywall redirects through —
  // catching them here would hand the book to anyone during a blip.
  //
  // Access stays outside `withDbRetry`: the Prisma client already retries every
  // statement, so nesting a second retry around the checks multiplied the worst
  // case instead of improving it.
  try {
    const session = await getCachedSession();
    if (!session?.user?.id) {
      redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(callbackPath)}`);
    }
    await requirePremiumPage(CONFIG.routeBase);

    ({ guide, toc, chapter } = await withDbRetry(async () => {
      const loadedGuide = await getPublishedGuide(EXAM);
      const guideId = loadedGuide?.id ?? CONFIG.guideId;
      // Independent once the guide id is known.
      const [loadedToc, loadedChapter] = await Promise.all([
        getGuideToc(guideId),
        getChapterBySlug(guideId, chapterSlug, EXAM),
      ]);
      return { guide: loadedGuide, toc: loadedToc, chapter: loadedChapter };
    }));
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
    />
  );
}
