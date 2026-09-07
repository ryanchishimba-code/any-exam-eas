import type { SgChapterDto } from "./types";

const cache = new Map<string, SgChapterDto>();
const inflight = new Map<string, Promise<SgChapterDto>>();

export function seedChapterCache(chapter: SgChapterDto) {
  cache.set(chapter.slug, chapter);
}

export function getCachedChapter(slug: string): SgChapterDto | undefined {
  return cache.get(slug);
}

export async function fetchChapter(slug: string, track: "rn" | "pn" = "rn"): Promise<SgChapterDto> {
  const cached = cache.get(slug);
  if (cached) return cached;

  const existing = inflight.get(slug);
  if (existing) return existing;

  const promise = (async () => {
    const res = await fetch(
      `/api/nclex-study-guide/chapters/${encodeURIComponent(slug)}?track=${track}`
    );
    if (!res.ok) {
      throw new Error(`Chapter load failed (${res.status})`);
    }
    const data = (await res.json()) as { chapter?: SgChapterDto };
    if (!data.chapter) throw new Error("Chapter missing in response");
    cache.set(slug, data.chapter);
    return data.chapter;
  })();

  inflight.set(slug, promise);
  try {
    return await promise;
  } finally {
    inflight.delete(slug);
  }
}

/** Warm neighbor chapters without blocking UI. */
export function prefetchChapter(slug: string | null | undefined, track: "rn" | "pn" = "rn") {
  if (!slug || cache.has(slug) || inflight.has(slug)) return;
  void fetchChapter(slug, track).catch(() => {
    /* ignore prefetch errors */
  });
}
