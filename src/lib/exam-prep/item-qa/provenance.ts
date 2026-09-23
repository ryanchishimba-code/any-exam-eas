/**
 * Student-facing source and review date.
 * Pipeline labels (seed, curated, manual) are not citations.
 */

const PIPELINE_SOURCES = new Set([
  "seed",
  "generated",
  "curated",
  "ai-curated",
  "ai",
  "polished",
  "manual",
  "import",
  "admin",
  "admin-manual",
]);

export type ItemProvenance = {
  sourceLabel?: string;
  sourceUrl?: string;
  reviewedAt?: string;
};

function asRecord(value: unknown): Record<string, unknown> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  return value as Record<string, unknown>;
}

function safeHttpUrl(url: string | undefined): string | undefined {
  if (!url?.trim()) return undefined;
  try {
    const parsed = new URL(url.trim());
    if (parsed.protocol === "https:" || parsed.protocol === "http:") return parsed.toString();
  } catch {
    return undefined;
  }
  return undefined;
}

function toIso(value: unknown): string | undefined {
  if (value instanceof Date && !Number.isNaN(value.getTime())) return value.toISOString();
  if (typeof value !== "string" || !value.trim()) return undefined;
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return undefined;
  return date.toISOString();
}

export function formatReviewMonth(value: string | Date | null | undefined): string | null {
  const iso = toIso(value);
  if (!iso) return null;
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    year: "numeric",
    timeZone: "UTC",
  }).format(new Date(iso));
}

function readReferenceList(
  value: unknown
): Array<{ label?: string; url?: string; citation?: string }> {
  if (!Array.isArray(value)) return [];
  const refs: Array<{ label?: string; url?: string; citation?: string }> = [];
  for (const entry of value) {
    if (typeof entry === "string" && entry.trim()) {
      refs.push({ label: entry.trim() });
      continue;
    }
    const record = asRecord(entry);
    if (!record) continue;
    refs.push({
      label: typeof record.label === "string" ? record.label : undefined,
      citation: typeof record.citation === "string" ? record.citation : undefined,
      url: typeof record.url === "string" ? record.url : undefined,
    });
  }
  return refs;
}

function citationLabelFromMeta(meta: Record<string, unknown> | null): {
  label: string;
  url?: string;
} {
  const citation = asRecord(meta?.citation);
  if (!citation) return { label: "" };
  const label = typeof citation.label === "string" ? citation.label.trim() : "";
  const text = typeof citation.citation === "string" ? citation.citation.trim() : "";
  const combined =
    label && text && !label.includes(text) ? `${label} · ${text}` : label || text;
  return {
    label: combined,
    url: safeHttpUrl(typeof citation.url === "string" ? citation.url : undefined),
  };
}

export function resolveItemProvenance(item: {
  source?: string | null;
  references?: unknown;
  lastReviewedAt?: Date | string | null;
  generationMeta?: unknown;
}): ItemProvenance {
  const meta = asRecord(item.generationMeta);
  const metaLabel = typeof meta?.sourceLabel === "string" ? meta.sourceLabel.trim() : "";
  const metaCitation = citationLabelFromMeta(meta);
  const reference = readReferenceList(item.references).find(
    (ref) => ref.label?.trim() || ref.citation?.trim()
  );
  let sourceLabel = metaLabel.length >= 3 ? metaLabel : "";
  let sourceUrl = safeHttpUrl(typeof meta?.sourceUrl === "string" ? meta.sourceUrl : undefined);
  if (!sourceLabel && metaCitation.label.length >= 3) {
    sourceLabel = metaCitation.label;
    sourceUrl = sourceUrl ?? metaCitation.url;
  }

  if (!sourceLabel && reference) {
    const label = reference.label?.trim() ?? "";
    const citation = reference.citation?.trim() ?? "";
    sourceLabel =
      label && citation && !label.includes(citation) ? `${label} · ${citation}` : label || citation;
    sourceUrl = sourceUrl ?? safeHttpUrl(reference.url);
  }

  if (!sourceLabel) {
    const source = item.source?.trim() ?? "";
    if (source.length >= 3 && !PIPELINE_SOURCES.has(source.toLowerCase())) {
      sourceLabel = source;
    }
  }

  const reviewedAt =
    toIso(item.lastReviewedAt) ??
    toIso(meta?.contentReviewedAt) ??
    toIso(meta?.reviewedAt);

  const out: ItemProvenance = {};
  if (sourceLabel) out.sourceLabel = sourceLabel;
  if (sourceUrl) out.sourceUrl = sourceUrl;
  if (reviewedAt) out.reviewedAt = reviewedAt;
  return out;
}
