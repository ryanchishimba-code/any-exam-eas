/**
 * Ranked blueprint readiness chart for Study Hub.
 * Horizontal bars beat tile grids for comparing domains (linear scale, shared baseline).
 */
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { RoadmapReadinessKey } from "@/lib/learning/exam-roadmap";
import { NCLEX_CLIENT_NEEDS_DOMAINS } from "@/lib/exam-prep/nclex/topic-registry";

export type DomainMapTile = {
  id: string;
  label: string;
  weightPct: number;
  score: number;
  status: RoadmapReadinessKey;
  practiceHref: string;
  /** Soft bank coverage fill (0–100), shown on full variant only. */
  coveragePct?: number;
  /** Pulse as the suggested next domain. */
  highlighted?: boolean;
};

export type DomainMapVariant = "compact" | "full";

const STATUS_LABEL: Record<RoadmapReadinessKey, string> = {
  strong: "Strong",
  needs_review: "Review",
  needs_more_work: "Focus",
};

/** Brand-aligned readiness palette — teal / gold / indigo (no pink). */
const STATUS_BAR: Record<RoadmapReadinessKey, string> = {
  strong: "bg-[linear-gradient(90deg,var(--db-ready-strong),var(--db-ready-strong-end))]",
  needs_review: "bg-[linear-gradient(90deg,var(--db-ready-review),var(--db-ready-review-end))]",
  needs_more_work: "bg-[linear-gradient(90deg,var(--db-ready-focus),var(--db-ready-focus-end))]",
};

const STATUS_DOT: Record<RoadmapReadinessKey, string> = {
  strong: "bg-[var(--db-ready-strong)]",
  needs_review: "bg-[var(--db-ready-review)]",
  needs_more_work: "bg-[var(--db-ready-focus)]",
};

const STATUS_TEXT: Record<RoadmapReadinessKey, string> = {
  strong: "text-[var(--db-ready-strong-text)]",
  needs_review: "text-[var(--db-ready-review-text)]",
  needs_more_work: "text-[var(--db-ready-focus-text)]",
};

const NCLEX_SHORT = new Map(
  NCLEX_CLIENT_NEEDS_DOMAINS.map((d) => [d.id, d.shortLabel] as const)
);

/** Prefer short board labels so the chart stays scannable. */
export function displayDomainLabel(id: string, label: string): string {
  return NCLEX_SHORT.get(id as never) ?? label;
}

/** @deprecated Kept for tests — weight still informs sort priority, not grid span. */
export function domainTileSpan(weightPct: number): 1 | 2 {
  return weightPct >= 14 ? 2 : 1;
}

/** Short label for compact UI when shortLabel map misses. */
export function shortenDomainLabel(label: string, max = 22): string {
  const trimmed = label.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
}

const STATUS_RANK: Record<RoadmapReadinessKey, number> = {
  needs_more_work: 0,
  needs_review: 1,
  strong: 2,
};

/** Rank weakest / highest-weight domains first so the chart drives action. */
export function rankDomainTiles(tiles: DomainMapTile[]): DomainMapTile[] {
  return [...tiles].sort((a, b) => {
    if (STATUS_RANK[a.status] !== STATUS_RANK[b.status]) {
      return STATUS_RANK[a.status] - STATUS_RANK[b.status];
    }
    if (a.score !== b.score) return a.score - b.score;
    return b.weightPct - a.weightPct;
  });
}

export function DomainMap({
  tiles,
  variant = "compact",
  className,
  "aria-label": ariaLabel = "Blueprint domains",
}: {
  tiles: DomainMapTile[];
  variant?: DomainMapVariant;
  className?: string;
  "aria-label"?: string;
}) {
  if (tiles.length === 0) return null;

  const isFull = variant === "full";
  const ranked = rankDomainTiles(tiles);

  return (
    <div className={cn("space-y-3", className)}>
      <ul
        className="flex flex-wrap items-center gap-x-3 gap-y-1.5 text-[11px] font-medium text-[var(--color-ink-muted)]"
        aria-label="Readiness legend"
      >
        {(
          [
            ["strong", "Strong"],
            ["needs_review", "Review"],
            ["needs_more_work", "Focus"],
          ] as const
        ).map(([key, label]) => (
          <li key={key} className="inline-flex items-center gap-1.5">
            <span className={cn("h-2 w-2 rounded-full", STATUS_DOT[key])} aria-hidden />
            {label}
          </li>
        ))}
      </ul>

      <ul role="list" aria-label={ariaLabel} className="space-y-1.5">
        {ranked.map((tile, index) => {
          const fill = Math.max(4, Math.min(100, tile.score));
          const name = isFull
            ? tile.label
            : shortenDomainLabel(displayDomainLabel(tile.id, tile.label), 20);
          const coverage =
            tile.coveragePct != null
              ? Math.max(0, Math.min(100, tile.coveragePct))
              : null;

          return (
            <li
              key={tile.id}
              style={{ animationDelay: `${Math.min(index, 10) * 35}ms` }}
              className="apple-animate-in"
            >
              <Link
                href={tile.practiceHref}
                className={cn(
                  "group grid grid-cols-[minmax(0,1fr)_auto] items-center gap-x-3 gap-y-1 rounded-2xl px-2.5 py-2.5",
                  "border border-transparent bg-transparent transition duration-200",
                  "hover:border-[var(--color-border)]/60 hover:bg-[var(--color-surface)]/70",
                  "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                  isFull && "px-3 py-3",
                  tile.highlighted &&
                    "border-[var(--color-accent)]/25 bg-[var(--color-accent)]/[0.04] domain-tile-pulse"
                )}
                aria-label={`${tile.label}: ${tile.score}% ready, ${tile.weightPct}% of exam, ${STATUS_LABEL[tile.status]}. Practice.`}
              >
                <div className="min-w-0">
                  <div className="flex items-center gap-2">
                    <span
                      className={cn(
                        "min-w-0 truncate font-semibold tracking-tight text-[var(--color-ink)]",
                        isFull ? "text-[13px]" : "text-[12px]"
                      )}
                    >
                      {name}
                    </span>
                    <span className="shrink-0 rounded-full bg-[var(--color-border)]/35 px-1.5 py-0.5 text-[10px] font-semibold tabular-nums text-[var(--color-ink-muted)]">
                      {tile.weightPct}%
                    </span>
                    {tile.highlighted ? (
                      <span className="shrink-0 text-[10px] font-semibold uppercase tracking-wide text-[var(--color-accent)]">
                        Next
                      </span>
                    ) : null}
                  </div>

                  <div
                    className={cn(
                      "mt-1.5 h-2.5 overflow-hidden rounded-full bg-[var(--db-ready-track)]",
                      isFull && "h-3 mt-2"
                    )}
                    role="presentation"
                  >
                    <div
                      className={cn(
                        "h-full rounded-full transition-[width] duration-700 ease-out motion-reduce:transition-none",
                        STATUS_BAR[tile.status]
                      )}
                      style={{ width: `${fill}%` }}
                    />
                  </div>

                  {isFull && coverage != null ? (
                    <p className="mt-1 text-[10px] tabular-nums text-[var(--color-ink-muted)]">
                      {coverage}% bank covered
                    </p>
                  ) : null}
                </div>

                <div className="flex shrink-0 flex-col items-end gap-0.5">
                  <span
                    className={cn(
                      "tabular-nums font-semibold tracking-tight text-[var(--color-ink)]",
                      isFull ? "text-[15px]" : "text-[13px]"
                    )}
                  >
                    {tile.score}
                    <span className="text-[11px] font-medium text-[var(--color-ink-muted)]">%</span>
                  </span>
                  <span
                    className={cn(
                      "text-[10px] font-semibold uppercase tracking-wide",
                      STATUS_TEXT[tile.status]
                    )}
                  >
                    {STATUS_LABEL[tile.status]}
                  </span>
                </div>
              </Link>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
