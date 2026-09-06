import { AnatomyViewerSkeleton } from "@/components/anatomy/AnatomyViewerSkeleton";
import { Skeleton } from "@/components/ui/skeleton";

export default function AnatomyLoading() {
  return (
    <div
      className="mx-auto w-full max-w-6xl space-y-5 pb-10"
      aria-busy="true"
      aria-label="Loading anatomy"
    >
      <div className="space-y-2">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-9 w-56 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-80 max-w-full rounded-full" />
      </div>
      <AnatomyViewerSkeleton />
    </div>
  );
}
