import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideReader } from "@/components/nclex-study-guide/StudyGuideReader";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { STUDY_GUIDES, type StudyGuideExam } from "@/lib/nclex-study-guide/guide-registry";
import { loadPublishedGuideChapter, loadPublishedGuideFirstSlug } from "@/lib/nclex-study-guide/load-published";
import { requirePremiumPage } from "@/lib/require-premium-page";

/** Index routes redirect to the first chapter only after the premium gate. */
export async function StudyGuideIndexScreen({ exam }: { exam: StudyGuideExam }) {
  const config = STUDY_GUIDES[exam];
  await requirePremiumPage(config.routeBase);

  let first = "";
  try {
    first = await loadPublishedGuideFirstSlug(exam);
  } catch (e) {
    unstable_rethrow(e);
    console.error(`[${exam}/study-guide] index`, e);
    return <StudyGuideUnavailable exam={exam} />;
  }

  if (!first || first === "manuscript-pending") {
    return <StudyGuideUnavailable exam={exam} />;
  }

  redirect(`${config.routeBase}/${first}`);
}

/** Chapter HTML is loaded only after trial or paid access is confirmed. */
export async function StudyGuideChapterScreen({
  exam,
  chapterSlug,
}: {
  exam: StudyGuideExam;
  chapterSlug: string;
}) {
  const config = STUDY_GUIDES[exam];
  await requirePremiumPage(`${config.routeBase}/${chapterSlug}`);

  let guide;
  let toc;
  let chapter;

  try {
    ({ guide, toc, chapter } = await loadPublishedGuideChapter(exam, chapterSlug));
  } catch (e) {
    unstable_rethrow(e);
    console.error(`[${exam}/study-guide]`, e);
    return <StudyGuideUnavailable exam={exam} />;
  }

  if (!chapter) notFound();

  return (
    <StudyGuideReader
      exam={exam}
      guideId={guide?.id ?? config.guideId}
      guideTitle={guide?.title ?? config.title}
      chapters={toc ?? []}
      chapter={chapter}
    />
  );
}
