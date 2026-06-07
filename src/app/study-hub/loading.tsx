import { Skeleton } from "@/components/ui/skeleton";

export default function StudyHubLoading() {
  return (
    <div className="space-y-8">
      <Skeleton className="h-44 w-full rounded-3xl" />
      <div className="flex gap-3">
        <Skeleton className="h-16 w-28 rounded-xl" />
        <Skeleton className="h-16 w-28 rounded-xl" />
        <Skeleton className="h-16 w-28 rounded-xl" />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        {Array.from({ length: 5 }).map((_, i) => (
          <Skeleton key={i} className="h-44 rounded-2xl" />
        ))}
      </div>
    </div>
  );
}
