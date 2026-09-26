import type { NgnReference, SourceRef } from "@/lib/assessment/types";

export type CitedSource = {
  src: string;
  locator: string | null;
  title: string;
  url: string | null;
};

/** Map a batch source registry (`sources[].id`) to title and URL. */
export function sourceRegistry(sources: unknown): Record<string, Pick<SourceRef, "title" | "url">> {
  if (!Array.isArray(sources)) return {};
  const out: Record<string, Pick<SourceRef, "title" | "url">> = {};
  for (const entry of sources) {
    if (!entry || typeof entry !== "object") continue;
    const record = entry as { id?: unknown; title?: unknown; url?: unknown };
    if (typeof record.id !== "string" || record.id.length === 0) continue;
    const title = typeof record.title === "string" && record.title.trim() ? record.title.trim() : record.id;
    const url = typeof record.url === "string" ? record.url.trim() : "";
    out[record.id] = { title, url };
  }
  return out;
}

/**
 * Resolve `{ src, locator }` citations against the source registry.
 * Unknown ids keep the id as the title and have no link.
 */
export function resolveCitedSources(
  references: NgnReference[] | null | undefined,
  sourcesById: Record<string, Pick<SourceRef, "title" | "url"> | undefined>
): CitedSource[] {
  if (!Array.isArray(references)) return [];
  return references.flatMap((reference) => {
    if (!reference || typeof reference.src !== "string" || reference.src.length === 0) return [];
    const source = sourcesById[reference.src];
    const url = source?.url?.trim() ?? "";
    const title = source?.title?.trim() || reference.src;
    const locator = typeof reference.locator === "string" && reference.locator.trim() ? reference.locator.trim() : null;
    return [{ src: reference.src, locator, title, url: url || null }];
  });
}
