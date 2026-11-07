import type { CoverageDomain, CoverageHeatmap } from "@/lib/learning/coverage-heatmap";
import type {
  ExamDayReadiness,
  ReadinessCriterionStatus,
  ReadinessDomainBar,
} from "@/lib/learning/exam-day-plan";
import { ReadinessRing } from "@/components/study/ReadinessRing";
import { dbUi } from "@/lib/study/dashboard-ui";

function statusClass(status: ReadinessCriterionStatus): string {
  if (status === "met") return dbUi.statusPillAccent;
  return dbUi.statusPill;
}

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
      aria-labelledby="readiness-proof-heading"
      data-tour="readiness"
      className={embedded ? "space-y-4" : `${dbUi.heroSurface} space-y-4`}
    >
      <div data-practice-goals="proof" data-practice-headline={readiness.headline} data-practice-score={readiness.score ?? 0}>
        <p className={dbUi.eyebrow}>Practice progress</p>
        <div className="mt-3 flex flex-col items-center gap-4 sm:flex-row sm:items-center">
          <ReadinessRing
            score={readiness.score ?? 0}
            size={112}
            label="Practice"
            ariaLabel={`${readiness.headline}. ${readiness.score ?? 0} practice progress. ${readiness.disclaimer}`}
          />
          <div className="min-w-0 text-center sm:text-left">
            <h3
              id="readiness-proof-heading"
              className="text-[22px] font-semibold leading-tight tracking-[-0.03em] text-[var(--color-ink)]"
            >
              {readiness.headline}
            </h3>
            <p className="mt-2 text-[15px] leading-snug text-[var(--color-ink)]">{readiness.disclaimer}</p>
            {readiness.sampleDetail ? (
              <p className="mt-1 text-[15px] leading-snug text-[var(--color-ink-muted)]">{readiness.sampleDetail}</p>
            ) : null}
          </div>
        </div>
      </div>

      {scoredCriteria.length > 0 ? (
        <ul className="space-y-2">
          {scoredCriteria.map((row) => (
            <li
              key={row.id}
              className="rounded-2xl border border-[var(--db-line,var(--color-border))]/70 bg-[var(--color-surface)]/50 px-3.5 py-3"
            >
              <div className="flex flex-col items-start gap-2 sm:flex-row sm:items-center sm:justify-between">
                <p className="min-w-0 text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                  {row.label}
                  <span className="ml-2 font-medium tabular-nums text-[var(--color-ink-muted)]">
                    {row.valueLabel}
                  </span>
                </p>
                <span className={`${statusClass(row.status)} max-w-full shrink-0 text-left sm:text-right`}>
                  {row.badge}
                </span>
              </div>
              {row.nextStep ? (
                <p className="mt-2 text-[15px] leading-snug text-[var(--color-ink)]">{row.nextStep}</p>
              ) : null}
              <p className="mt-1 text-[13px] leading-snug text-[var(--color-ink-muted)]">{row.detail}</p>
            </li>
          ))}
        </ul>
      ) : null}

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
    </section>
  );
}
