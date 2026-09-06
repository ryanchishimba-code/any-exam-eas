import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="w-full space-y-5" aria-busy="true" aria-label="Loading">
      <div className="space-y-2">
        <Skeleton className="h-3 w-28 rounded-full" />
        <Skeleton className="h-9 w-52 max-w-full rounded-xl" />
      </div>
      <Skeleton className="h-40 w-full rounded-2xl" />
      <Skeleton className="h-[22rem] w-full rounded-[28px]" />
    </div>
  );
}
