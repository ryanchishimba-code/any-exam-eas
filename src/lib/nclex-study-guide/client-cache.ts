import type { StudyGuideExam } from "./guide-registry";
import type { SgChapterDto } from "./types";

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

const keyOf = (exam: StudyGuideExam, slug: string) => `${exam}:${slug}`;

export function seedChapterCache(exam: StudyGuideExam, chapter: SgChapterDto) {
  cache.set(keyOf(exam, chapter.slug), chapter);
}

export function getCachedChapter(
  exam: StudyGuideExam,
  slug: string
): SgChapterDto | undefined {
  return cache.get(keyOf(exam, slug));
}

export async function fetchChapter(
  exam: StudyGuideExam,
  slug: string
): Promise<SgChapterDto> {
  const key = keyOf(exam, slug);

  const cached = cache.get(key);
  if (cached) return cached;

  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const res = await fetch(
      `/api/nclex-study-guide/chapters/${encodeURIComponent(slug)}?exam=${exam}`
    );
    if (!res.ok) {
      throw new Error(`Chapter load failed (${res.status})`);
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
export function prefetchChapter(exam: StudyGuideExam, slug: string | null | undefined) {
  if (!slug) return;
  const key = keyOf(exam, slug);
  if (cache.has(key) || inflight.has(key)) return;
  void fetchChapter(exam, slug).catch(() => {
    /* ignore prefetch errors */
  });
}
