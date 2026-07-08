import { Skeleton } from "@/components/ui/skeleton";

export default function PricingLoading() {
  return (
    <div className="mx-auto w-full max-w-5xl space-y-8 px-4 py-10">
      <Skeleton className="mx-auto h-10 w-1/2 rounded-xl" />
      <Skeleton className="h-72 w-full rounded-[28px]" />
      <div className="grid gap-4 md:grid-cols-2">
        <Skeleton className="h-96 rounded-[28px]" />
        <Skeleton className="h-96 rounded-[28px]" />
      </div>
    </div>
  );
}
