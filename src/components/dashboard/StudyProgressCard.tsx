import { dbUi } from "@/lib/study/dashboard-ui";
import type { StudyCompletionResult } from "@/lib/learning/study-completion/compute-study-completion";
import { cn } from "@/lib/utils";

function formatCount(n: number): string {
  return n.toLocaleString("en-US");
}

function PillarRow({ pillar }: { pillar: StudyCompletionResult["pillars"][number] }) {
  const pct = pillar.target > 0 ? Math.min(100, Math.round((pillar.done / pillar.target) * 100)) : 0;
  return (
    <li className="space-y-1.5">
      <div className="flex items-baseline justify-between gap-3 text-[13px]">
        <span className="font-medium text-[var(--color-ink)]">{pillar.label}</span>
        <span
          className={cn(
            "shrink-0 tabular-nums text-[12px]",
            pillar.met ? "font-semibold text-[var(--color-accent)]" : "text-[var(--color-ink-muted)]"
          )}
        >
          {formatCount(pillar.done)} / {formatCount(pillar.target)}
        </span>
      </div>
      <div className={dbUi.sparkTrack} aria-hidden>
        <div
          className={cn(dbUi.sparkBar, pillar.met ? "bg-[var(--color-accent)]" : "bg-[var(--color-ink-muted)]/45")}
          style={{ width: `${pct}%` }}
        />
      </div>
    </li>
  );
}

export function StudyProgressCard({ data }: { data: StudyCompletionResult }) {
  return (
    <section
      className={cn(dbUi.surface, "p-5 sm:p-6")}
      aria-labelledby="study-progress-title"
      data-study-progress-card="true"
    >
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 id="study-progress-title" className={dbUi.sectionTitle}>
            Study progress
          </h2>
          <p className="mt-1 text-[12px] leading-relaxed text-[var(--color-ink-muted)]">
            Only activity saved to your account counts.
          </p>
        </div>
        <p
          className="text-2xl font-semibold tabular-nums tracking-tight text-[var(--color-ink)]"
          aria-label={`Overall study progress ${data.overallPercent} percent`}
        >
          {data.overallPercent}%
        </p>
      </div>

      <ul className="mt-5 space-y-4" aria-label="Study completion pillars">
        {data.pillars.map((pillar) => (
          <PillarRow key={pillar.id} pillar={pillar} />
        ))}
      </ul>
    </section>
  );
}
