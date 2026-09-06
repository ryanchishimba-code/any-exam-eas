import { Skeleton } from "@/components/ui/skeleton";

/** Flashcard-first placeholder so the deck silhouette paints above the fold. */
export function DrugReviewStudioSkeleton() {
  return (
    <div
      className="mt-6 space-y-5"
      aria-busy="true"
      aria-label="Loading drug flashcards"
    >
      <Skeleton className="h-11 w-full rounded-xl" />
      <div className="aee-drugs-skeleton relative mx-auto min-h-[min(52vh,420px)] w-full max-w-xl rounded-3xl border border-teal-100/80 p-6 sm:p-8">
        <div className="absolute inset-x-8 top-8 space-y-3">
          <Skeleton className="h-3 w-24 rounded-full bg-teal-100/80" />
          <Skeleton className="h-8 w-3/4 max-w-xs rounded-xl bg-white/70" />
          <Skeleton className="h-4 w-full rounded-full bg-white/50" />
          <Skeleton className="h-4 w-5/6 rounded-full bg-white/50" />
        </div>
        <p className="absolute bottom-6 left-0 right-0 text-center text-xs text-teal-800/70">
          Loading Top 500 deck…
        </p>
      </div>
      <div className="aee-drugs-skeleton h-28 rounded-2xl" />
    </div>
  );
}
