import type { StudyGuideBookExam } from "./guide-registry";
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

const keyOf = (exam: StudyGuideBookExam, slug: string, step?: string) =>
  step ? `${exam}:${step}:${slug}` : `${exam}:${slug}`;

export class ChapterLoadError extends Error {
  status: number;
  constructor(status: number) {
    super(`Chapter load failed (${status})`);
    this.name = "ChapterLoadError";
    this.status = status;
  }
}

export function seedChapterCache(
  exam: StudyGuideBookExam,
  chapter: SgChapterDto,
  step?: string
) {
  cache.set(keyOf(exam, chapter.slug, step), chapter);
}

export function getCachedChapter(
  exam: StudyGuideBookExam,
  slug: string,
  step?: string
): SgChapterDto | undefined {
  return cache.get(keyOf(exam, slug, step));
}

export async function fetchChapter(
  exam: StudyGuideBookExam,
  slug: string,
  step?: string
): Promise<SgChapterDto> {
  const key = keyOf(exam, slug, step);

  const cached = cache.get(key);
  if (cached) return cached;

  const existing = inflight.get(key);
  if (existing) return existing;

  const promise = (async () => {
    const stepQuery = step ? `&step=${encodeURIComponent(step)}` : "";
    const res = await fetch(
      `/api/nclex-study-guide/chapters/${encodeURIComponent(slug)}?exam=${exam}${stepQuery}`
    );
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
export function prefetchChapter(
  exam: StudyGuideBookExam,
  slug: string | null | undefined,
  step?: string
) {
  if (!slug) return;
  const key = keyOf(exam, slug, step);
  if (cache.has(key) || inflight.has(key)) return;
  void fetchChapter(exam, slug, step).catch(() => {
    /* ignore prefetch errors */
  });
}
