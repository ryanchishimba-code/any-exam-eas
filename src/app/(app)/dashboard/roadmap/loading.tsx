import { Skeleton } from "@/components/ui/skeleton";

export default function RoadmapLoading() {
  return (
    <div className="mx-auto max-w-4xl space-y-4 px-4 pt-[var(--page-top)] sm:px-6">
      <Skeleton className="h-24 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
