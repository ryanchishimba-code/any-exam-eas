import type { CoverageChip, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";

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

/** Client fetch for the coverage heatmap. Null when the API cannot score it. */
export async function fetchCoverageHeatmap(fieldId: string): Promise<CoverageHeatmap | null> {
  try {
    const res = await fetch(`/api/learning/coverage?field=${encodeURIComponent(fieldId)}`, {
      cache: "no-store",
    });
    if (!res.ok) return null;
    const data = (await res.json()) as Partial<CoverageHeatmap> | null;
    if (!data || !Array.isArray(data.domains) || !Array.isArray(data.chips)) return null;
    if (!data.chips.every(isChip)) return null;
    return data as CoverageHeatmap;
  } catch {
    return null;
  }
}
