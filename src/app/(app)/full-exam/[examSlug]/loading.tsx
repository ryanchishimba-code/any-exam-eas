import { Skeleton } from "@/components/ui/skeleton";

export default function FullExamLoading() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
