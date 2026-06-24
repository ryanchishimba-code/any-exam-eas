import { Skeleton } from "@/components/ui/skeleton";

export default function AppLoading() {
  return (
    <div className="w-full space-y-5">
      <Skeleton className="h-16 w-full rounded-2xl" />
      <Skeleton className="h-[28rem] w-full rounded-[28px]" />
    </div>
  );
}
