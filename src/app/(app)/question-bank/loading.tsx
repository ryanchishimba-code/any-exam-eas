import { Skeleton } from "@/components/ui/skeleton";

/** Layout-matched placeholder so dark-mode first paint isn’t an empty void. */
export default function QuestionBankLoading() {
  return (
    <div
      className="question-bank-ui mx-auto w-full min-w-0 max-w-5xl space-y-5 pb-10"
      aria-busy="true"
      aria-label="Loading question bank"
    >
      <div className="space-y-3">
        <Skeleton className="h-3 w-40 rounded-full" />
        <Skeleton className="h-10 w-64 max-w-full rounded-xl" />
        <Skeleton className="h-4 w-80 max-w-full rounded-full" />
      </div>
      <Skeleton className="h-12 w-56 rounded-xl" />
      <Skeleton className="h-72 w-full rounded-2xl" />
      <Skeleton className="h-40 w-full rounded-2xl" />
    </div>
  );
}
