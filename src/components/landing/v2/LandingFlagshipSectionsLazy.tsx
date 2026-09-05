"use client";

import dynamic from "next/dynamic";
import type { ComponentProps } from "react";
import { Skeleton } from "@/components/ui/skeleton";
import { DeferredMount } from "@/components/landing/v2/DeferredMount";

function SectionPlaceholder({ className }: { className?: string }) {
  return (
    <div className={className} aria-hidden>
      <Skeleton className="mx-auto h-64 w-full max-w-5xl rounded-[28px]" />
    </div>
  );
}

const clientSection = {
  ssr: false as const,
};

const LandingOfferingV2Inner = dynamic(
  () => import("./LandingOfferingV2").then((m) => m.LandingOfferingV2),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingShowcaseV2Inner = dynamic(
  () => import("./LandingShowcaseV2").then((m) => m.LandingShowcaseV2),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-16" /> }
);

const ChooseYourExamInner = dynamic(
  () => import("@/components/home/ChooseYourExam").then((m) => m.ChooseYourExam),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingWhyChooseV2Inner = dynamic(
  () => import("./LandingWhyChooseV2").then((m) => m.LandingWhyChooseV2),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingCrossExamComparisonInner = dynamic(
  () => import("./LandingCrossExamComparison").then((m) => m.LandingCrossExamComparison),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingClinicianTrustInner = dynamic(
  () => import("@/components/landing/LandingClinicianTrust").then((m) => m.LandingClinicianTrust),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-12" /> }
);

const ProBenefitsComparisonInner = dynamic(
  () => import("@/components/pricing/ProBenefitsComparison").then((m) => m.ProBenefitsComparison),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingPricingPreviewInner = dynamic(
  () => import("@/components/landing/LandingPricingPreview").then((m) => m.LandingPricingPreview),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-12" /> }
);

const LandingTrialGuaranteeInner = dynamic(
  () => import("@/components/landing/LandingTrialGuarantee").then((m) => m.LandingTrialGuarantee),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-12" /> }
);

const LandingFaqV2Inner = dynamic(
  () => import("./LandingFaqV2").then((m) => m.LandingFaqV2),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-12" /> }
);

const LandingTestimonialsV2Inner = dynamic(
  () => import("@/components/landing/LandingTestimonialsV2").then((m) => m.LandingTestimonialsV2),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-12" /> }
);

/** Sample sits just under the hero — load on hydrate (NGN inside is still viewport-gated). */
const LandingSamplePractice = dynamic(
  () => import("./LandingSamplePractice").then((m) => m.LandingSamplePractice),
  { ...clientSection, loading: () => <SectionPlaceholder className="py-16" /> }
);

const LandingStickyCta = dynamic(
  () => import("@/components/landing/LandingStickyCta").then((m) => m.LandingStickyCta),
  { ssr: false }
);

function LandingOfferingV2(props: ComponentProps<typeof LandingOfferingV2Inner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-16" />}>
      <LandingOfferingV2Inner {...props} />
    </DeferredMount>
  );
}

function LandingShowcaseV2(props: ComponentProps<typeof LandingShowcaseV2Inner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-16" />}>
      <LandingShowcaseV2Inner {...props} />
    </DeferredMount>
  );
}

function ChooseYourExam(props: ComponentProps<typeof ChooseYourExamInner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-16" />}>
      <ChooseYourExamInner {...props} />
    </DeferredMount>
  );
}

function LandingWhyChooseV2(props: ComponentProps<typeof LandingWhyChooseV2Inner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-16" />}>
      <LandingWhyChooseV2Inner {...props} />
    </DeferredMount>
  );
}

function LandingCrossExamComparison(
  props: ComponentProps<typeof LandingCrossExamComparisonInner>
) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-16" />}>
      <LandingCrossExamComparisonInner {...props} />
    </DeferredMount>
  );
}

function LandingClinicianTrust(props: ComponentProps<typeof LandingClinicianTrustInner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-12" />}>
      <LandingClinicianTrustInner {...props} />
    </DeferredMount>
  );
}

function ProBenefitsComparison(props: ComponentProps<typeof ProBenefitsComparisonInner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-16" />}>
      <ProBenefitsComparisonInner {...props} />
    </DeferredMount>
  );
}

function LandingPricingPreview(props: ComponentProps<typeof LandingPricingPreviewInner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-12" />}>
      <LandingPricingPreviewInner {...props} />
    </DeferredMount>
  );
}

function LandingTrialGuarantee(props: ComponentProps<typeof LandingTrialGuaranteeInner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-12" />}>
      <LandingTrialGuaranteeInner {...props} />
    </DeferredMount>
  );
}

function LandingFaqV2(props: ComponentProps<typeof LandingFaqV2Inner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-12" />}>
      <LandingFaqV2Inner {...props} />
    </DeferredMount>
  );
}

function LandingTestimonialsV2(props: ComponentProps<typeof LandingTestimonialsV2Inner>) {
  return (
    <DeferredMount fallback={<SectionPlaceholder className="py-12" />}>
      <LandingTestimonialsV2Inner {...props} />
    </DeferredMount>
  );
}

export {
  LandingOfferingV2,
  LandingShowcaseV2,
  ChooseYourExam,
  LandingCrossExamComparison,
  LandingWhyChooseV2,
  LandingClinicianTrust,
  ProBenefitsComparison,
  LandingPricingPreview,
  LandingTrialGuarantee,
  LandingFaqV2,
  LandingTestimonialsV2,
  LandingStickyCta,
  LandingSamplePractice,
};
