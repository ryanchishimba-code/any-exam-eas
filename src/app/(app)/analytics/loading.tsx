import { Skeleton } from "@/components/ui/skeleton";
import { studyUi } from "@/lib/study/study-ui";

/** Soft placeholder while analytics data resolves. */
export default function AnalyticsLoading() {
  return (
    <div className={studyUi.page} aria-busy="true" aria-label="Loading analytics">
      <div className="space-y-2">
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="h-9 w-48 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-64 max-w-full rounded-full" />
      </div>
      <div className="grid gap-3 sm:grid-cols-3">
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
        <Skeleton className="h-24 rounded-2xl" />
      </div>
      <Skeleton className="h-80 w-full rounded-[28px]" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}
