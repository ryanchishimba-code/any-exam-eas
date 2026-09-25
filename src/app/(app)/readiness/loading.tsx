import { Skeleton } from "@/components/ui/skeleton";

export default function ReadinessLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-10" aria-busy="true" aria-label="Loading readiness">
      <Skeleton className="h-4 w-28 rounded-full" />
      <Skeleton className="h-12 w-4/5 max-w-xl rounded-xl" />
      <Skeleton className="h-16 w-full rounded-xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}
