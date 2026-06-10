import { Skeleton } from "@/components/ui/skeleton";

export function AnatomyViewerSkeleton() {
  return (
    <div className="relative flex h-[min(72vh,640px)] w-full flex-col items-center justify-center gap-4 rounded-2xl border border-black/[0.06] bg-gradient-to-b from-slate-50 to-slate-100">
      <Skeleton className="h-12 w-12 rounded-full" />
      <Skeleton className="h-4 w-48" />
      <Skeleton className="h-3 w-64" />
      <p className="text-xs text-[var(--color-ink-muted)]">Loading 3D anatomy viewer…</p>
    </div>
  );
}
