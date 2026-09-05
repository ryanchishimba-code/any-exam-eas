/**
 * Weighted blueprint domain map — shared by Study Hub hero and /dashboard/roadmap.
 * Tile size ≈ exam weight; fill ≈ practice readiness; color ≈ Strong / Review / More work.
 */
import Link from "next/link";
import { cn } from "@/lib/utils";
import type { RoadmapReadinessKey } from "@/lib/learning/exam-roadmap";

export type DomainMapTile = {
  id: string;
  label: string;
  weightPct: number;
  score: number;
  status: RoadmapReadinessKey;
  practiceHref: string;
  /** Soft bank coverage fill (0–100), shown on full roadmap only. */
  coveragePct?: number;
  /** Pulse as the suggested next domain. */
  highlighted?: boolean;
};

export type DomainMapVariant = "compact" | "full";

const STATUS_FILL: Record<RoadmapReadinessKey, string> = {
  strong: "bg-emerald-500/75",
  needs_review: "bg-amber-500/70",
  needs_more_work: "bg-rose-500/65",
};

const STATUS_RING: Record<RoadmapReadinessKey, string> = {
  strong: "ring-emerald-500/25",
  needs_review: "ring-amber-500/30",
  needs_more_work: "ring-rose-500/35",
};

const STATUS_LABEL: Record<RoadmapReadinessKey, string> = {
  strong: "Strong",
  needs_review: "Needs review",
  needs_more_work: "Needs more work",
};

/** CSS grid column span from blueprint weight (exam %). */
export function domainTileSpan(weightPct: number): 1 | 2 {
  return weightPct >= 14 ? 2 : 1;
}

/** Short label for compact tiles (Client Needs can be long). */
export function shortenDomainLabel(label: string, max = 22): string {
  const trimmed = label.trim();
  if (trimmed.length <= max) return trimmed;
  return `${trimmed.slice(0, max - 1).trimEnd()}…`;
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

  return (
    <ul
      role="list"
      aria-label={ariaLabel}
      className={cn(
        "grid grid-cols-2 gap-2 sm:grid-cols-4",
        isFull && "gap-2.5 sm:gap-3",
        className
      )}
    >
      {tiles.map((tile, index) => {
        const span = domainTileSpan(tile.weightPct);
        const fill = Math.max(6, Math.min(100, tile.score));
        const coverage =
          tile.coveragePct != null
            ? Math.max(0, Math.min(100, tile.coveragePct))
            : null;

        return (
          <li
            key={tile.id}
            className={cn(
              span === 2 && "col-span-2",
              "min-w-0",
              tile.highlighted && "z-[1]"
            )}
            style={{
              animationDelay: `${Math.min(index, 8) * 40}ms`,
            }}
          >
            <Link
              href={tile.practiceHref}
              className={cn(
                "group relative flex h-full min-h-[4.5rem] flex-col justify-between overflow-hidden rounded-2xl",
                "border border-[var(--color-border)]/55 bg-[var(--color-surface)]/80",
                "ring-1 ring-inset transition duration-300",
                STATUS_RING[tile.status],
                "hover:border-[var(--color-accent)]/35 hover:shadow-[var(--shadow-apple-sm)]",
                "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--color-accent)]",
                isFull ? "min-h-[6.5rem] p-3 sm:min-h-[7.25rem] sm:p-3.5" : "p-2.5",
                tile.highlighted &&
                  "domain-tile-pulse ring-2 ring-[var(--color-accent)]/45"
              )}
              aria-label={`${tile.label}: ${tile.score}% ready, ${tile.weightPct}% of exam, ${STATUS_LABEL[tile.status]}. Practice.`}
            >
              {/* Score fill — shape first */}
              <span
                className={cn(
                  "pointer-events-none absolute inset-x-0 bottom-0 transition-[height] duration-700 ease-out motion-reduce:transition-none",
                  STATUS_FILL[tile.status]
                )}
                style={{ height: `${fill}%` }}
                aria-hidden
              />
              {/* Soft top wash so text stays readable */}
              <span
                className="pointer-events-none absolute inset-0 bg-gradient-to-b from-[var(--color-surface-elevated)]/90 via-[var(--color-surface-elevated)]/35 to-transparent"
                aria-hidden
              />

              <div className="relative z-[1] flex items-start justify-between gap-1.5">
                <span
                  className={cn(
                    "min-w-0 font-semibold leading-snug text-[var(--color-ink)]",
                    isFull ? "text-[13px] sm:text-[14px]" : "text-[11px] sm:text-[12px]"
                  )}
                >
                  {isFull ? tile.label : shortenDomainLabel(tile.label)}
                </span>
                <span
                  className={cn(
                    "shrink-0 tabular-nums font-semibold text-[var(--color-ink-muted)]",
                    isFull ? "text-[12px]" : "text-[10px]"
                  )}
                >
                  {tile.score}%
                </span>
              </div>

              <div className="relative z-[1] mt-auto flex items-end justify-between gap-2 pt-2">
                <span
                  className={cn(
                    "tabular-nums text-[var(--color-ink-muted)]",
                    isFull ? "text-[11px]" : "text-[10px]"
                  )}
                >
                  {tile.weightPct}% exam
                </span>
                {isFull && coverage != null ? (
                  <span className="text-[10px] tabular-nums text-[var(--color-ink-muted)]">
                    {coverage}% covered
                  </span>
                ) : tile.highlighted ? (
                  <span className="text-[10px] font-semibold text-[var(--color-accent)]">
                    Next
                  </span>
                ) : null}
              </div>

              {isFull ? (
                <span
                  className={cn(
                    "relative z-[1] mt-1.5 text-[10px] font-medium uppercase tracking-wide",
                    tile.status === "strong" && "text-emerald-800/80",
                    tile.status === "needs_review" && "text-amber-800/80",
                    tile.status === "needs_more_work" && "text-rose-800/80"
                  )}
                >
                  {STATUS_LABEL[tile.status]}
                </span>
              ) : null}
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
