import { Skeleton } from "@/components/ui/skeleton";

/**
 * Branded 3D viewer placeholder — soft figure silhouette instead of an empty stage.
 */
export function AnatomyViewerSkeleton() {
  return (
    <div
      className="relative flex h-[min(72vh,640px)] w-full flex-col items-center justify-center overflow-hidden rounded-2xl border border-[color-mix(in_srgb,var(--color-border)_85%,transparent)] bg-[color-mix(in_srgb,var(--color-surface-elevated)_92%,var(--color-accent)_8%)]"
      aria-busy="true"
      aria-label="Loading 3D anatomy viewer"
    >
      <div
        className="pointer-events-none absolute inset-0 opacity-60"
        style={{
          background:
            "radial-gradient(ellipse 55% 70% at 50% 58%, color-mix(in srgb, var(--color-accent) 14%, transparent), transparent 70%)",
        }}
      />
      {/* Soft figure silhouette */}
      <div className="relative mb-5 flex flex-col items-center gap-1 opacity-80">
        <Skeleton className="h-10 w-10 rounded-full" />
        <Skeleton className="h-24 w-16 rounded-[2rem]" />
        <div className="flex gap-3">
          <Skeleton className="h-20 w-5 rounded-full" />
          <Skeleton className="h-20 w-5 rounded-full" />
        </div>
      </div>
      <Skeleton className="relative h-3 w-44 rounded-full" />
      <p className="relative mt-3 text-xs font-medium tracking-wide text-[var(--color-ink-muted)]">
        Loading anatomy explorer…
      </p>
    </div>
  );
}
