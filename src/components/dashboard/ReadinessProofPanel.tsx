import type { CoverageDomain, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import type {
  ExamDayReadiness,
  ReadinessDomainBar,
} from "@/lib/learning/exam-day-plan";
import { PracticeGoalsMenu } from "@/components/dashboard/PracticeGoalsMenu";
import type { GoalDomainBar, GoalTrendPoint } from "@/components/dashboard/PracticeGoalsCharts";
import { dbUi } from "@/lib/study/dashboard-ui";
import { cn } from "@/lib/utils";

type CoverageBar = {
  id: string;
  label: string;
  fillPct: number;
  untouched: boolean;
  veryLow: boolean;
  isTopGap: boolean;
  available: number;
  seen: number;
  bankCoveragePct: number;
};

function barsFromCoverage(domains: CoverageDomain[]): CoverageBar[] {
  return domains.map((domain) => ({
    id: domain.id,
    label: domain.label,
    fillPct: domain.fillPct,
    untouched: domain.untouched,
    veryLow: domain.veryLow,
    isTopGap: false,
    available: domain.available,
    seen: domain.seen,
    bankCoveragePct: domain.bankCoveragePct,
  }));
}

function barsFromReadiness(domains: ReadinessDomainBar[], topGapId: string | null): CoverageBar[] {
  return domains.map((domain) => ({
    id: domain.id,
    label: domain.label,
    fillPct: domain.fillPct,
    untouched: domain.untouched,
    veryLow: domain.veryLow,
    isTopGap: domain.isTopGap || domain.id === topGapId,
    available: domain.available,
    seen: domain.seen,
    bankCoveragePct: domain.bankCoveragePct,
  }));
}

/**
 * Expandable practice proof. Same component on Dashboard and Analytics.
 * Copy describes saved practice only — never a licensure outcome.
 */
export function ReadinessProofPanel({
  readiness,
  domainsLabel,
  coverage = null,
  embedded = false,
  showLeadReason = true,
  trend = [],
}: {
  readiness: ExamDayReadiness;
  domainsLabel?: string;
  /** Heatmap shared with Today's block and Qbank chips. */
  coverage?: CoverageHeatmap | null;
  /** True when a parent card already supplies the surface. */
  embedded?: boolean;
  /** Today's block already prints this on the first row. */
  showLeadReason?: boolean;
  trend?: GoalTrendPoint[];
}) {
  const scoredCriteria = readiness.criteria.filter((row) => row.id !== "exam_sim");
  void domainsLabel;
  void showLeadReason;
  const bars = coverage
    ? barsFromCoverage(coverage.domains).map((domain) => ({
        ...domain,
        isTopGap: domain.id === coverage.topGapId,
      }))
    : barsFromReadiness(readiness.domains, null);
  const chartDomains: GoalDomainBar[] = bars
    .map((domain) => ({
      id: domain.id,
      label: domain.label,
      weightPct: Math.max(domain.bankCoveragePct > 0 ? 1 : 0, 1),
      answeredPct: domain.available > 0 ? Math.round((domain.seen / domain.available) * 100) : domain.fillPct,
      served: domain.available,
      seen: domain.seen,
      gap: domain.isTopGap,
    }))
    .slice(0, 5);
  const weighted = (coverage?.domains ?? readiness.domains).map((domain) => ({
    id: domain.id,
    weightPct: domain.blueprintWeightPct,
  }));
  const domainsForChart = chartDomains.map((domain) => ({
    ...domain,
    weightPct: weighted.find((row) => row.id === domain.id)?.weightPct || domain.weightPct,
  }));

  return (
    <section
      data-tour="readiness"
      className={embedded ? "" : cn(dbUi.surface, "px-3.5 py-3")}
    >
      <PracticeGoalsMenu
        surface="proof"
        headline={readiness.headline}
        score={readiness.score ?? 0}
        disclaimer={readiness.disclaimer}
        criteria={scoredCriteria}
        trend={trend}
        domains={domainsForChart}
        difficultyMix={readiness.difficultyMix}
      />
    </section>
  );
}
