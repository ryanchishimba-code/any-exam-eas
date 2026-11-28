import type { StudyGuideExam } from "./guide-registry";
import type { SgChapterDto } from "./types";

/** USMLE books share slugs, so the cache key is the step, not the board. */
export type StudyGuideReaderKey = StudyGuideExam | `usmle-${string}`;

/**
 * Client-side chapter cache.
 *
 * Keyed by `exam:slug`, never by slug alone: the books share chapter slugs
 * (`endocrine`, `respiratory`, `exam-strategy`, `quick-reference`), so a
 * slug-only key would serve the NCLEX chapter to a NAPLEX reader that happened
 * to visit the other book first in the same session.
 */
const cache = new Map<string, SgChapterDto>();
const inflight = new Map<string, Promise<SgChapterDto>>();

const keyOf = (exam: StudyGuideReaderKey, slug: string) => `${exam}:${slug}`;

function chapterRequestUrl(exam: StudyGuideReaderKey, slug: string): string {
  const path = `/api/nclex-study-guide/chapters/${encodeURIComponent(slug)}`;
  if (exam.startsWith("usmle-")) {
    const step = exam.slice("usmle-".length);
    return `${path}?exam=usmle&step=${encodeURIComponent(step)}`;
  }
  return `${path}?exam=${exam}`;
}

export class ChapterLoadError extends Error {
  status: number;
  constructor(status: number) {
    super(`Chapter load failed (${status})`);
    this.name = "ChapterLoadError";
    this.status = status;
  }
}

export function seedChapterCache(exam: StudyGuideReaderKey, chapter: SgChapterDto) {
  cache.set(keyOf(exam, chapter.slug), chapter);
}

export function getCachedChapter(
  exam: StudyGuideReaderKey,
  slug: string
): SgChapterDto | undefined {
  return cache.get(keyOf(exam, slug));
}

export async function fetchChapter(
  exam: StudyGuideReaderKey,
  slug: string
): Promise<SgChapterDto> {
  const key = keyOf(exam, slug);

  const cached = cache.get(key);
  if (cached) return cached;

  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const res = await fetch(chapterRequestUrl(exam, slug));
    if (!res.ok) {
      throw new ChapterLoadError(res.status);
    }
    const data = (await res.json()) as { chapter?: SgChapterDto };
    if (!data.chapter) throw new Error("Chapter missing in response");
    cache.set(key, data.chapter);
    return data.chapter;
  })();

  inflight.set(key, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(key);
  }
}

/** Warm neighbor chapters without blocking UI. */
export function prefetchChapter(exam: StudyGuideReaderKey, slug: string | null | undefined) {
  if (!slug) return;
  const key = keyOf(exam, slug);
  if (cache.has(key) || inflight.has(key)) return;
  void fetchChapter(exam, slug).catch(() => {
    /* ignore prefetch errors */
  });
}
