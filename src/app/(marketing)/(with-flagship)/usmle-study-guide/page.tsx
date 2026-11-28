import { PublicStudyGuidePage, publicGuideMetadata } from "@/components/marketing/study-guide/PublicStudyGuidePage";

export const dynamic = "force-static";
export const revalidate = 86400;

export const metadata = publicGuideMetadata("usmle");

export default function UsmleStudyGuidePage() {
  return <PublicStudyGuidePage id="usmle" />;
}
