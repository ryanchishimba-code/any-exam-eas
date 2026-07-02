import { Skeleton } from "@/components/ui/skeleton";

export default function RootLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-6 px-4 py-10">
      <Skeleton className="mx-auto h-12 w-2/3 max-w-lg rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-[28px]" />
      <div className="grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
        <Skeleton className="h-40 rounded-2xl" />
      </div>
    </div>
  );
}
