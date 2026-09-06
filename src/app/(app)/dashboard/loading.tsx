import { Skeleton } from "@/components/ui/skeleton";
import { dbUi } from "@/lib/study/dashboard-ui";

/** Soft placeholder while dashboard RSC hydrates — chrome stays painted. */
export default function DashboardLoading() {
  return (
    <div
      className={dbUi.page}
      aria-busy="true"
      aria-label="Loading dashboard"
    >
      <div className="space-y-2">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-9 w-56 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-72 max-w-full rounded-full" />
      </div>
      <div className={`${dbUi.surface} flex flex-col gap-6 p-5 sm:flex-row sm:items-center sm:p-7`}>
        <Skeleton className="mx-auto h-36 w-36 shrink-0 rounded-full sm:mx-0" />
        <div className="min-w-0 flex-1 space-y-3">
          <Skeleton className="h-5 w-40 rounded-full" />
          <Skeleton className="h-4 w-full max-w-md rounded-full" />
          <Skeleton className="h-11 w-44 rounded-xl" />
        </div>
      </div>
      <div className="grid gap-3 sm:grid-cols-2">
        <Skeleton className="h-28 rounded-2xl" />
        <Skeleton className="h-28 rounded-2xl" />
      </div>
      <Skeleton className="h-48 w-full rounded-2xl" />
    </div>
  );
}
