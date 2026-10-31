import { StudyFeedPage, studyFeedMetadata } from "@/components/study-feed/StudyFeedPage";
import { STUDY_FEEDS } from "@/lib/study-feed/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = studyFeedMetadata(STUDY_FEEDS["aanp-fnp"]);

export default function FnpFeedPage() {
  return <StudyFeedPage board={STUDY_FEEDS["aanp-fnp"]} />;
}
