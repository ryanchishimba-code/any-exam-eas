import type { CoverageChip, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import type { WeakTopicRow } from "@/lib/learning/student-dashboard";

export type QuestionBankCoveragePayload = CoverageHeatmap & {
  openIncorrectCount: number | null;
  weakTopics: WeakTopicRow[];
};

function isChip(value: unknown): value is CoverageChip {
  if (!value || typeof value !== "object") return false;
  const chip = value as Partial<CoverageChip>;
  return (
    (chip.kind === "untouched" || chip.kind === "weak") &&
    typeof chip.domainId === "string" &&
    typeof chip.label === "string" &&
    typeof chip.subjectId === "string"
  );
}

function isWeakTopic(value: unknown): value is WeakTopicRow {
  if (!value || typeof value !== "object") return false;
  const row = value as Partial<WeakTopicRow>;
  return (
    typeof row.id === "string" &&
    typeof row.name === "string" &&
    typeof row.fieldId === "string" &&
    typeof row.masteryScore === "number" &&
    typeof row.attempts === "number" &&
    typeof row.weight === "number"
  );
}

/** Client fetch for the coverage heatmap. Null when the API cannot score it. */
export async function fetchCoverageHeatmap(
  fieldId: string
): Promise<QuestionBankCoveragePayload | null> {
  try {
    const res = await fetch(`/api/learning/coverage?field=${encodeURIComponent(fieldId)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<QuestionBankCoveragePayload> | null;
    if (!data || !Array.isArray(data.domains) || !Array.isArray(data.chips)) return null;
    if (!data.chips.every(isChip)) return null;
    const weakTopics = Array.isArray(data.weakTopics) ? data.weakTopics.filter(isWeakTopic) : [];
    const openIncorrectCount =
      typeof data.openIncorrectCount === "number" && Number.isFinite(data.openIncorrectCount)
        ? data.openIncorrectCount
        : null;
    return { ...(data as CoverageHeatmap), openIncorrectCount, weakTopics };
  } catch {
    return null;
  }
}
