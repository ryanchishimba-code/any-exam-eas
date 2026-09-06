import { cn } from "@/lib/utils";

export function Skeleton({
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div
      className={cn(
        "animate-pulse rounded-lg bg-[color-mix(in_srgb,var(--color-ink)_8%,var(--color-surface))]",
        className
      )}
      aria-hidden
      {...props}
    />
  );
}

export function CardSkeleton() {
  return (
    <div className="aee-card space-y-4 p-6" aria-busy="true" aria-label="Loading">
      <Skeleton className="h-10 w-10 rounded-xl" />
      <Skeleton className="h-5 w-2/3" />
      <Skeleton className="h-4 w-full" />
      <Skeleton className="h-4 w-4/5" />
      <Skeleton className="mt-4 h-10 w-full rounded-xl" />
    </div>
  );
}
