import type { ExamDayReadiness, ReadinessCriterionStatus } from "@/lib/learning/exam-day-plan";
import { dbUi } from "@/lib/study/dashboard-ui";

const STATUS_LABEL: Record<ReadinessCriterionStatus, string> = {
  met: "Met",
  missing: "Missing",
  not_scored: "Not scored",
};

function statusClass(status: ReadinessCriterionStatus): string {
  if (status === "met") return dbUi.statusPillAccent;
  return dbUi.statusPill;
}

/**
 * Expandable practice proof. Same component on Dashboard and Analytics.
 * Copy describes saved practice only — never a licensure outcome.
 */
export function ReadinessProofPanel({
  readiness,
  domainsLabel = "Blueprint coverage",
  embedded = false,
  showLeadReason = true,
}: {
  readiness: ExamDayReadiness;
  domainsLabel?: string;
  /** True when a parent card already supplies the surface. */
  embedded?: boolean;
  /** Today's block already prints this on the first row. */
  showLeadReason?: boolean;
}) {
  const formulaLine =
    readiness.visible && readiness.score != null
      ? `${readiness.coveragePct}% coverage × ${readiness.recentAccuracyPct}% recent accuracy × ${readiness.remediationPct}% remediation = ${readiness.score}.`
      : `${readiness.coveragePct}% coverage × ${readiness.recentAccuracyPct}% recent accuracy × ${readiness.remediationPct}% remediation.`;
  const scoredCriteria = readiness.criteria.filter((row) => row.id !== "exam_sim");
  const examSim = readiness.criteria.find((row) => row.id === "exam_sim") ?? null;

  return (
    <section
      aria-labelledby="readiness-proof-heading"
      className={embedded ? "space-y-4" : `${dbUi.heroSurface} space-y-4`}
    >
      <div>
        <p className={dbUi.eyebrow}>Readiness proof</p>
        <h3
          id="readiness-proof-heading"
          className="mt-1 text-[22px] font-semibold tracking-[-0.03em] text-[var(--color-ink)] sm:text-[26px]"
        >
          {readiness.headline}
        </h3>
        <p className={`${dbUi.subtitle} mt-2`}>{readiness.sampleDetail}</p>
        {readiness.visible ? (
          <p className="mt-3 text-[15px] leading-relaxed tracking-[-0.01em] text-[var(--color-ink)]">
            {formulaLine} {readiness.formula}
          </p>
        ) : null}
      </div>

      {readiness.visible ? (
        <ul className="space-y-2">
          {scoredCriteria.map((row) => (
            <li
              key={row.id}
              className="flex items-center justify-between gap-3 rounded-2xl border border-[var(--db-line,var(--color-border))]/70 bg-[var(--color-surface)]/50 px-3.5 py-3"
            >
              <p className="min-w-0 text-[15px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                {row.label}
                <span className="ml-2 font-medium tabular-nums text-[var(--color-ink-muted)]">
                  {row.valueLabel}
                </span>
              </p>
              <span className={`${statusClass(row.status)} shrink-0`}>{STATUS_LABEL[row.status]}</span>
            </li>
          ))}
        </ul>
      ) : null}

      {showLeadReason && readiness.visible && readiness.leadReason ? (
        <p className="text-[14px] font-medium leading-relaxed tracking-[-0.01em] text-[var(--color-accent)]">
          {readiness.leadReason}
        </p>
      ) : null}

      {readiness.visible && readiness.domains.length > 0 ? (
        <div>
          <p className={dbUi.sectionTitle}>{domainsLabel}</p>
          <ul className="mt-3 space-y-2.5" aria-label={domainsLabel}>
            {readiness.domains.map((domain) => (
              <li key={domain.id}>
                <div className="flex items-baseline justify-between gap-3">
                  <p className="min-w-0 truncate text-[14px] font-semibold tracking-[-0.02em] text-[var(--color-ink)]">
                    {domain.label}
                    {domain.isTopGap ? (
                      <span className="ml-2 text-[11px] font-semibold uppercase tracking-[0.12em] text-[var(--color-accent)]">
                        Top gap
                      </span>
                    ) : null}
                  </p>
                  <p className="shrink-0 text-[12px] tabular-nums text-[var(--color-ink-muted)]">
                    {domain.blueprintWeightPct}% ·{" "}
                    {domain.untouched
                      ? "Untouched"
                      : `${domain.accuracyPct ?? 0}% · ${domain.attempts} answers`}
                  </p>
                </div>
                <div className={`${dbUi.sparkTrack} mt-1.5`}>
                  <div
                    className={`${dbUi.sparkBar} ${
                      domain.isTopGap ? "bg-[var(--color-accent)]" : "bg-[var(--color-ink)]/35"
                    }`}
                    style={{ width: `${Math.max(domain.untouched ? 0 : 4, domain.fillPct)}%` }}
                  />
                </div>
              </li>
            ))}
          </ul>
        </div>
      ) : null}

      {examSim && readiness.visible ? (
        <p className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">{examSim.detail}</p>
      ) : null}

      <details className="rounded-2xl border border-[var(--color-border)]/50 bg-[var(--color-surface)]/50 px-3.5 py-2.5">
        <summary className="cursor-pointer text-[13px] font-semibold tracking-[-0.01em] text-[var(--color-ink)]">
          How this proof is scored
        </summary>
        <p className="mt-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">{formulaLine}</p>
        <ul className="mt-2 space-y-2 pb-1">
          {readiness.criteria.map((row) => (
            <li key={row.id} className="text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
              <span className="font-semibold text-[var(--color-ink)]">
                {row.label} · {STATUS_LABEL[row.status]}
              </span>
              {" — "}
              {row.detail}
            </li>
          ))}
        </ul>
        <p className="border-t border-[var(--color-border)]/50 pt-2 text-[13px] leading-relaxed text-[var(--color-ink-muted)]">
          {readiness.disclaimer}
        </p>
      </details>
    </section>
  );
}
