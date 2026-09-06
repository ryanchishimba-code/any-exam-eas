import { DrugReviewStudioSkeleton } from "@/components/study/DrugReviewStudioSkeleton";
import { Skeleton } from "@/components/ui/skeleton";
import { studyUi } from "@/lib/study/study-ui";
import { cn } from "@/lib/utils";

export default function Drugs300Loading() {
  return (
    <div className={studyUi.page} aria-busy="true" aria-label="Loading Top 500 Drugs">
      <header>
        <Skeleton className="h-3 w-24 rounded-full" />
        <Skeleton className="mt-2 h-9 w-48 max-w-full rounded-xl" />
        <Skeleton className={cn("mt-2 h-4 w-full max-w-xl rounded-full")} />
      </header>
      <DrugReviewStudioSkeleton />
    </div>
  );
}
