import type { CoverageDomain, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import type {
  ExamDayReadiness,
  ReadinessDomainBar,
} from "@/lib/learning/exam-day-plan";
import { PracticeGoalsMenu } from "@/components/dashboard/PracticeGoalsMenu";
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

function barCaption(domain: CoverageBar): string {
  if (domain.untouched) {
    return domain.available > 0
      ? `Untouched · ${domain.available.toLocaleString()} questions`
      : "Untouched";
  }
  if (domain.available > 0) {
    const count = `${domain.seen.toLocaleString()} of ${domain.available.toLocaleString()}`;
    return domain.veryLow ? `Low · ${count}` : count;
  }
  if (domain.veryLow) return "Low coverage";
  return `${domain.bankCoveragePct}% covered`;
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
}: {
  readiness: ExamDayReadiness;
  domainsLabel?: string;
  /** Heatmap shared with Today's block and Qbank chips. */
  coverage?: CoverageHeatmap | null;
  /** True when a parent card already supplies the surface. */
  embedded?: boolean;
  /** Today's block already prints this on the first row. */
  showLeadReason?: boolean;
}) {
  const scoredCriteria = readiness.criteria.filter((row) => row.id !== "exam_sim");
  const examSim = readiness.criteria.find((row) => row.id === "exam_sim") ?? null;
  const label = domainsLabel ?? coverage?.domainsLabel ?? "Blueprint topics";
  const bars = coverage
    ? barsFromCoverage(coverage.domains).map((domain) => ({
        ...domain,
        isTopGap: domain.id === coverage.topGapId,
      }))
    : barsFromReadiness(readiness.domains, null);
  const showTotals =
    coverage != null &&
    coverage.topicQuestionTotal != null &&
    coverage.countsAgree &&
    coverage.categoryQuestionTotal > 0;

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
      >
      {showLeadReason && readiness.visible && readiness.leadReason ? (
        <p className="text-[14px] font-medium leading-relaxed tracking-[-0.01em] text-[var(--color-accent)]">
          {readiness.leadReason}
        </p>
      ) : null}

      {bars.length > 0 ? (
        <div className="space-y-4">
          <p className="text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
            {label}
          </p>
          <ul className="space-y-4" aria-label={label}>
            {bars.map((domain) => (
              <li key={domain.id}>
                <div className="flex items-baseline justify-between gap-4">
                  <p className="min-w-0 text-[15px] font-semibold leading-snug tracking-[-0.02em] text-[var(--color-ink)]">
                    {domain.label}
                    {domain.isTopGap ? (
                      <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--color-accent)]">
                        Top gap
                      </span>
                    ) : null}
                  </p>
                  <p className="shrink-0 text-[13px] tabular-nums tracking-[-0.01em] text-[var(--color-ink-muted)]">
                    {barCaption(domain)}
                  </p>
                </div>
                <div className={`${dbUi.sparkTrack} mt-2`}>
                  <div
                    className={`${dbUi.sparkBar} ${
                      domain.isTopGap || domain.untouched || domain.veryLow
                        ? "bg-[var(--color-accent)]"
                        : "bg-[var(--color-ink)]/30"
                    }`}
                    style={{ width: `${Math.max(domain.untouched ? 0 : 4, domain.fillPct)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
          {showTotals ? (
            <p className="text-[13px] leading-relaxed tracking-[-0.01em] text-[var(--color-ink-muted)]">
              {coverage.categoryQuestionTotal.toLocaleString()} active questions in these {label}.
              {coverage.unmappedQuestionTotal > 0
                ? ` ${coverage.unmappedQuestionTotal.toLocaleString()} more sit outside this blueprint.`
                : ""}{" "}
              Topic list total is {coverage.topicQuestionTotal?.toLocaleString()} active questions.
            </p>
          ) : null}
        </div>
      ) : null}

      {examSim ? (
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">{examSim.detail}</p>
      ) : null}
      </PracticeGoalsMenu>
    </section>
  );
}
