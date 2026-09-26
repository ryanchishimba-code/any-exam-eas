import {
  ACTIVE_QUESTION_DEFINITION,
  type FormatCounts,
  type InventoryCategoryCount,
} from "@/lib/inventory/active-questions";

/** Client payload for per-topic active counts — shared by React Query and prefetch. */
export type SubjectCountsClient = {
  counts: Record<string, number>;
  total: number | null;
  formats: FormatCounts | null;
  topicFormats: Record<string, FormatCounts> | null;
  categories: InventoryCategoryCount[];
  categoryLabel: string | null;
  definition: string | null;
};

function parseFormatCounts(value: unknown): FormatCounts | null {
  if (!value || typeof value !== "object") return null;
  const row = value as Partial<FormatCounts>;
  if (typeof row.mcq !== "number" || typeof row.ngn !== "number" || typeof row.case !== "number") {
    return null;
  }
  return { mcq: row.mcq, ngn: row.ngn, case: row.case };
}

function parseTopicFormats(value: unknown): Record<string, FormatCounts> | null {
  if (!value || typeof value !== "object" || Array.isArray(value)) return null;
  const out: Record<string, FormatCounts> = {};
  for (const [id, raw] of Object.entries(value as Record<string, unknown>)) {
    const formats = parseFormatCounts(raw);
    if (formats) out[id] = formats;
  }
  return out;
}

function emptySubjectCounts(): SubjectCountsClient {
  return {
    counts: {},
    total: null,
    formats: null,
    topicFormats: null,
    categories: [],
    categoryLabel: null,
    definition: null,
  };
}

function parseSubjectCounts(data: unknown): SubjectCountsClient | null {
  if (!data || typeof data !== "object") return null;
  const row = data as Partial<SubjectCountsClient> & { counts?: unknown; total?: unknown };
  if (!row.counts || typeof row.counts !== "object") return null;
  const total = typeof row.total === "number" ? row.total : null;
  return {
    counts: row.counts as Record<string, number>,
    total,
    formats: parseFormatCounts(row.formats),
    topicFormats: parseTopicFormats(row.topicFormats),
    categories: Array.isArray(row.categories) ? row.categories : [],
    categoryLabel: row.categoryLabel ?? null,
    definition:
      typeof row.definition === "string" ? row.definition : ACTIVE_QUESTION_DEFINITION,
  };
}

export async function fetchSubjectCounts(fieldId: string): Promise<SubjectCountsClient> {
  try {
    const res = await fetch(
      `/api/questions/subject-counts?field=${encodeURIComponent(fieldId)}`,
      { cache: "no-store" }
    );

    if (res.ok) {
      const parsed = parseSubjectCounts(await res.json());
      if (parsed && Object.keys(parsed.counts).length > 0) return parsed;
    }

    if (res.status === 503) {
      const data = await res.json().catch(() => null);
      if (data && typeof data === "object" && "dbError" in data && data.dbError) {
        await new Promise((r) => setTimeout(r, 600));
        const retry = await fetch(
          `/api/questions/subject-counts?field=${encodeURIComponent(fieldId)}`,
          { cache: "no-store" }
        );
        if (retry.ok) {
          const parsed = parseSubjectCounts(await retry.json());
          if (parsed && Object.keys(parsed.counts).length > 0) return parsed;
        }
      }
    }
  } catch (error) {
    console.warn("[subject-counts] fetch failed:", error instanceof Error ? error.message : error);
  }

  // Soft-fail so the question bank UI stays usable during Neon blips.
  return emptySubjectCounts();
}
