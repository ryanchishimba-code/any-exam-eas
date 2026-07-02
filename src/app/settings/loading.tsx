import { Skeleton } from "@/components/ui/skeleton";

export default function SettingsLoading() {
  return (
    <div className="mx-auto w-full max-w-2xl space-y-4 px-4 py-10">
      <Skeleton className="h-10 w-48" />
      <Skeleton className="h-4 w-72" />
      <Skeleton className="mt-8 h-96 w-full rounded-2xl" />
    </div>
  );
}
