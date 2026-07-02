import { Skeleton } from "@/components/ui/skeleton";

export default function TopicsLoading() {
  return (
    <div className="mx-auto max-w-5xl space-y-5 px-0.5">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}
