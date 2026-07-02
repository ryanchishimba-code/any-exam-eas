"use client";

import dynamic from "next/dynamic";
import { Skeleton } from "@/components/ui/skeleton";

function SectionPlaceholder({ className }: { className?: string }) {
  return (
    <div
      className={className}
      aria-hidden
    >
      <Skeleton className="mx-auto h-64 w-full max-w-5xl rounded-[28px]" />
    </div>
  );
}

const LandingOfferingV2 = dynamic(
  () => import("./LandingOfferingV2").then((m) => m.LandingOfferingV2),
  { loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingShowcaseV2 = dynamic(
  () => import("./LandingShowcaseV2").then((m) => m.LandingShowcaseV2),
  { loading: () => <SectionPlaceholder className="py-16" /> }
);

const ChooseYourExam = dynamic(
  () => import("@/components/home/ChooseYourExam").then((m) => m.ChooseYourExam),
  { loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingWhyChooseV2 = dynamic(
  () => import("./LandingWhyChooseV2").then((m) => m.LandingWhyChooseV2),
  { loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingClinicianTrust = dynamic(
  () => import("@/components/landing/LandingClinicianTrust").then((m) => m.LandingClinicianTrust),
  { loading: () => <SectionPlaceholder className="py-12" /> }
);

const ProBenefitsComparison = dynamic(
  () => import("@/components/pricing/ProBenefitsComparison").then((m) => m.ProBenefitsComparison),
  { loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingPricingPreview = dynamic(
  () => import("@/components/landing/LandingPricingPreview").then((m) => m.LandingPricingPreview),
  { loading: () => <SectionPlaceholder className="py-12" /> }
);

const LandingTrialGuarantee = dynamic(
  () => import("@/components/landing/LandingTrialGuarantee").then((m) => m.LandingTrialGuarantee),
  { loading: () => <SectionPlaceholder className="py-12" /> }
);

const LandingFaqV2 = dynamic(
  () => import("./LandingFaqV2").then((m) => m.LandingFaqV2),
  { loading: () => <SectionPlaceholder className="py-12" /> }
);

const LandingTestimonialsV2 = dynamic(
  () => import("@/components/landing/LandingTestimonialsV2").then((m) => m.LandingTestimonialsV2),
  { loading: () => <SectionPlaceholder className="py-12" /> }
);

const LandingStickyCta = dynamic(
  () => import("@/components/landing/LandingStickyCta").then((m) => m.LandingStickyCta),
  { ssr: false }
);

export {
  LandingOfferingV2,
  LandingShowcaseV2,
  ChooseYourExam,
  LandingWhyChooseV2,
  LandingClinicianTrust,
  ProBenefitsComparison,
  LandingPricingPreview,
  LandingTrialGuarantee,
  LandingFaqV2,
  LandingTestimonialsV2,
  LandingStickyCta,
};
