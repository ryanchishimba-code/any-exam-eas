import { Skeleton } from "@/components/ui/skeleton";

export default function AnatomyLoading() {
  return (
    <div className="mx-auto w-full max-w-6xl space-y-5 pb-10">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-[28rem] w-full rounded-[28px]" />
    </div>
  );
}
