import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function BlockSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Skeleton className="h-56 w-full rounded-[28px]" />
    </div>
  );
}

/** Loaded only when the USMLE hub renders the step picker. */
export const UsmleStepShowcaseLazy = dynamic(
  () => import("@/components/marketing/UsmleStepShowcase").then((m) => m.UsmleStepShowcase),
  { loading: () => <BlockSkeleton className="my-10" /> }
);
