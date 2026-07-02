import { Skeleton } from "@/components/ui/skeleton";

export default function Drugs300Loading() {
  return (
    <div className="space-y-4">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-[420px] w-full rounded-3xl" />
    </div>
  );
}
