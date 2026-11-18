import { UsmleStudyGuideStepIndex } from "@/components/nclex-study-guide/UsmleStudyGuideScreen";
import { studyGuideGatedMetadata } from "@/lib/nclex-study-guide/gated-reader-metadata";
import { USMLE_STUDY_GUIDES, usmleGuideStepFromRoute } from "@/lib/nclex-study-guide/guide-registry";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ step: string }> };

export async function generateMetadata({ params }: Props) {
  const { step } = await params;
  const resolved = usmleGuideStepFromRoute(step);
  const title = resolved ? USMLE_STUDY_GUIDES[resolved].title : "USMLE Study Guide";
  return studyGuideGatedMetadata(title);
}

export default async function UsmleStudyGuideStepPage({ params }: Props) {
  const { step } = await params;
  return <UsmleStudyGuideStepIndex routeStep={step} />;
}
