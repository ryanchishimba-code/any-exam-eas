import { Skeleton } from "@/components/ui/skeleton";

export default function QuestionBankLoading() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-14 w-full rounded-2xl" />
      <Skeleton className="h-[32rem] w-full rounded-[28px]" />
    </div>
  );
}
