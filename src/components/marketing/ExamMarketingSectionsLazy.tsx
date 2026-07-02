import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function BlockSkeleton({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Skeleton className="h-56 w-full rounded-[28px]" />
    </div>
  );
}

export const CostComparisonChartLazy = dynamic(
  () => import("@/components/landing/CostComparisonChart").then((m) => m.CostComparisonChart),
  { loading: () => <BlockSkeleton className="my-8" /> }
);

export const UsmleStepShowcaseLazy = dynamic(
  () => import("@/components/marketing/UsmleStepShowcase").then((m) => m.UsmleStepShowcase),
  { loading: () => <BlockSkeleton className="my-10" /> }
);

export const ProBenefitsComparisonLazy = dynamic(
  () => import("@/components/pricing/ProBenefitsComparison").then((m) => m.ProBenefitsComparison),
  { loading: () => <BlockSkeleton className="my-10" /> }
);

export const LandingPricingPreviewLazy = dynamic(
  () => import("@/components/landing/LandingPricingPreview").then((m) => m.LandingPricingPreview),
  { loading: () => <BlockSkeleton className="my-8" /> }
);
