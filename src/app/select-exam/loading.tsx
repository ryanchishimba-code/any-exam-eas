import { Skeleton } from "@/components/ui/skeleton";

export default function SelectExamLoading() {
  return (
    <div className="mx-auto max-w-6xl px-5 pt-[var(--page-top)] sm:px-8">
      <Skeleton className="mx-auto h-4 w-48" />
      <Skeleton className="mx-auto mt-6 h-14 w-full max-w-xl" />
      <Skeleton className="mx-auto mt-4 h-6 w-full max-w-md" />
      <div className="mx-auto mt-12 grid max-w-5xl gap-5 sm:grid-cols-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <Skeleton key={i} className="h-[300px] rounded-3xl" />
        ))}
      </div>
    </div>
  );
}
