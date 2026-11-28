import { notFound } from "next/navigation";
import { UsmleStepGuidePage, usmleStepMetadata } from "@/components/marketing/study-guide/PublicStudyGuidePage";
import { USMLE_PUBLIC_STEPS } from "@/lib/study-guides/public-catalog";

export const dynamic = "force-static";
export const revalidate = 86400;

export function generateStaticParams() {
  return USMLE_PUBLIC_STEPS.map((step) => ({ step: step.id }));
}

export async function generateMetadata({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  return usmleStepMetadata(step);
}

export default async function UsmleStepPage({ params }: { params: Promise<{ step: string }> }) {
  const { step } = await params;
  if (!USMLE_PUBLIC_STEPS.some((item) => item.id === step)) notFound();
  return <UsmleStepGuidePage stepId={step} />;
}
