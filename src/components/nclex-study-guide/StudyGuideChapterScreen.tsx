import { notFound, redirect, unstable_rethrow } from "next/navigation";
import { StudyGuideReader } from "@/components/nclex-study-guide/StudyGuideReader";
import { StudyGuideUnavailable } from "@/components/nclex-study-guide/StudyGuideUnavailable";
import { StudyGuideUpsell } from "@/components/nclex-study-guide/StudyGuideUpsell";
import {
  STUDY_GUIDES,
  USMLE_STUDY_STEPS,
  type StudyGuideExam,
  type UsmleStudyBook,
  usmleStudyBook,
} from "@/lib/nclex-study-guide/guide-registry";
import {
  loadPublishedGuideChapter,
  loadPublishedGuideFirstSlug,
  loadPublishedUsmleChapter,
  loadPublishedUsmleFirstSlug,
} from "@/lib/nclex-study-guide/load-published";
import { isUsmleGuideFileFallback } from "@/lib/nclex-study-guide/usmle-guide-flags";
import {
  loadUsmleChaptersFromFiles,
  loadUsmleTocFromFiles,
} from "@/lib/nclex-study-guide/usmle-file-preview";
import { resolveStudyGuideAccess } from "@/lib/require-premium-page";

/** Index routes redirect to the first chapter only after the premium gate. */
export async function StudyGuideIndexScreen({ exam }: { exam: StudyGuideExam }) {
  const config = STUDY_GUIDES[exam];
  const gate = await resolveStudyGuideAccess(config.routeBase);
  if (gate.status === "upsell") {
    return <StudyGuideUpsell exam={exam} signedIn={gate.signedIn} />;
  }

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
  const gate = await resolveStudyGuideAccess(`${config.routeBase}/${chapterSlug}`);
  if (gate.status === "upsell") {
    return <StudyGuideUpsell exam={exam} signedIn={gate.signedIn} />;
  }

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

async function usmleVisibility() {
  const { usmleStudyGuideVisibility } = await import("@/lib/nclex-study-guide/usmle-guide-access");
  return usmleStudyGuideVisibility();
}

function usmleStepNav(current: UsmleStudyBook["readerKey"]) {
  return USMLE_STUDY_STEPS.map((step) => {
    const book = usmleStudyBook(step);
    return { id: book.readerKey, label: book.shortLabel, href: book.routeBase };
  }).map((item) => ({ ...item, current: item.id === current }));
}

/** Index for one USMLE book. Hidden books 404 for students. Admins preview. */
export async function UsmleStudyGuideIndexScreen({ book }: { book: UsmleStudyBook }) {
  const visibility = await usmleVisibility();
  if (visibility === "hidden") notFound();
  if (visibility === "open" && !isUsmleGuideFileFallback()) {
    const gate = await resolveStudyGuideAccess(book.routeBase);
    if (gate.status === "upsell") {
      return <StudyGuideUpsell exam="nclex" signedIn={gate.signedIn} book={book} />;
    }
  }

  if (isUsmleGuideFileFallback()) {
    const first = loadUsmleTocFromFiles(book)[0]?.slug;
    if (!first) return <StudyGuideUnavailable exam="nclex" book={book} />;
    redirect(`${book.routeBase}/${first}`);
  }

  let first = "";
  try {
    first = await loadPublishedUsmleFirstSlug(book);
  } catch (e) {
    unstable_rethrow(e);
    console.error(`[usmle/study-guide/${book.step}] index`, e);
    return <StudyGuideUnavailable exam="nclex" book={book} />;
  }
  if (!first || first === "manuscript-pending") {
    return <StudyGuideUnavailable exam="nclex" />;
  }
  redirect(`${book.routeBase}/${first}`);
}

/** Chapter for one USMLE book. Same reader as the other exams, plus the step switcher. */
export async function UsmleStudyGuideChapterScreen({
  book,
  chapterSlug,
}: {
  book: UsmleStudyBook;
  chapterSlug: string;
}) {
  const visibility = await usmleVisibility();
  if (visibility === "hidden") notFound();
  if (visibility === "open" && !isUsmleGuideFileFallback()) {
    const gate = await resolveStudyGuideAccess(`${book.routeBase}/${chapterSlug}`);
    if (gate.status === "upsell") {
      return <StudyGuideUpsell exam="nclex" signedIn={gate.signedIn} book={book} />;
    }
  }

  if (isUsmleGuideFileFallback()) {
    const chapters = loadUsmleChaptersFromFiles(book);
    const chapter = chapters.find((item) => item.slug === chapterSlug);
    if (!chapter) notFound();
    return (
      <StudyGuideReader
        exam={book.readerKey}
        boardExam="usmle"
        book={book}
        stepNav={usmleStepNav(book.readerKey)}
        guideId={book.guideId}
        guideTitle={book.title}
        chapters={loadUsmleTocFromFiles(book)}
        chapter={chapter}
      />
    );
  }

  let guide;
  let toc;
  let chapter;
  try {
    ({ guide, toc, chapter } = await loadPublishedUsmleChapter(book, chapterSlug));
  } catch (e) {
    unstable_rethrow(e);
    console.error(`[usmle/study-guide/${book.step}]`, e);
    return <StudyGuideUnavailable exam="nclex" book={book} />;
  }
  if (!chapter) notFound();

  return (
    <StudyGuideReader
      exam={book.readerKey}
      boardExam="usmle"
      book={book}
      stepNav={usmleStepNav(book.readerKey)}
      guideId={guide?.id ?? book.guideId}
      guideTitle={guide?.title ?? book.title}
      chapters={toc ?? []}
      chapter={chapter}
    />
  );
}
