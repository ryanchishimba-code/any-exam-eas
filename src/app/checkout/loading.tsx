import { Skeleton } from "@/components/ui/skeleton";

export default function CheckoutLoading() {
  return (
    <div className="mx-auto w-full max-w-lg space-y-6 px-4 py-10">
      <Skeleton className="h-8 w-2/3 rounded-lg" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}
