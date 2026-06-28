import { Skeleton } from "@/components/ui/skeleton";
import { studyUi } from "@/lib/study/study-ui";

/** Layout-accurate placeholder while StudySessionPlayer chunk loads. */
export function QuestionSessionSkeleton() {
  return (
    <div
      className={`${studyUi.page} mt-8 space-y-4`}
      aria-busy="true"
      aria-label="Loading practice session"
    >
      <div className="flex justify-end">
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
      <Skeleton className="h-1.5 w-full rounded-full" />
      <div
        className={`${studyUi.sessionCard} space-y-5 p-4 sm:p-6 md:p-8`}
      >
        <div className="flex justify-end gap-2">
          <Skeleton className="h-8 w-20 rounded-full" />
          <Skeleton className="h-8 w-28 rounded-full" />
        </div>
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-5/6" />
        <div className="space-y-2 pt-2">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-12 w-full rounded-xl" />
          ))}
        </div>
        <Skeleton className="mt-4 h-11 w-full rounded-full sm:w-40" />
      </div>
      <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
        <Skeleton className="h-10 w-full rounded-full sm:w-28" />
        <Skeleton className="h-10 w-full rounded-full sm:w-28" />
      </div>
    </div>
  );
}
