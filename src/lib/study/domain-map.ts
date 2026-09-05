import type { DomainMapTile } from "@/components/dashboard/DomainMap";
import type { ExamRoadmapData } from "@/lib/learning/exam-roadmap";
import type { PracticeReadinessSummary } from "@/lib/learning/honest-readiness";

/** Highlight the weakest high-weight domain (same spirit as roadmap priorities). */
export function pickHighlightedDomainId(
  tiles: Array<Pick<DomainMapTile, "id" | "weightPct" | "score" | "status">>
): string | null {
  const ranked = [...tiles].sort((a, b) => {
    const aWeak = a.status === "needs_more_work" ? 0 : a.status === "needs_review" ? 1 : 2;
    const bWeak = b.status === "needs_more_work" ? 0 : b.status === "needs_review" ? 1 : 2;
    if (aWeak !== bWeak) return aWeak - bWeak;
    if (b.weightPct !== a.weightPct) return b.weightPct - a.weightPct;
    return a.score - b.score;
  });
  const top = ranked[0];
  if (!top || top.status === "strong") return null;
  return top.id;
}

export function domainTilesFromReadiness(
  summary: PracticeReadinessSummary
): DomainMapTile[] {
  const base = summary.categoryBars.map((bar) => ({
    id: bar.categoryId,
    label: bar.label,
    weightPct: bar.blueprintWeightPct,
    score: bar.readinessScore,
    status: bar.readinessKey,
    practiceHref: bar.practiceHref,
  }));
  const highlightId = pickHighlightedDomainId(base);
  return base.map((t) => ({
    ...t,
    highlighted: t.id === highlightId,
  }));
}

export function domainTilesFromRoadmap(data: ExamRoadmapData): DomainMapTile[] {
  const base = data.topics.map((t) => ({
    id: t.categoryId,
    label: t.label,
    weightPct: t.blueprintWeightPct,
    score: t.readinessScore,
    status: t.readinessKey,
    practiceHref: t.practiceHref,
    coveragePct: t.pushCoveragePct,
  }));
  const highlightId =
    data.priorityTopics[0]?.categoryId ?? pickHighlightedDomainId(base);
  return base.map((t) => ({
    ...t,
    highlighted: t.id === highlightId,
  }));
}
