import { Skeleton } from "@/components/ui/skeleton";

export default function LibraryLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-5 pb-10">
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-72 w-full rounded-[28px]" />
    </div>
  );
}
