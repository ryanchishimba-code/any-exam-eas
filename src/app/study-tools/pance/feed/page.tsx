import { StudyFeedPage, studyFeedMetadata } from "@/components/study-feed/StudyFeedPage";
import { STUDY_FEEDS } from "@/lib/study-feed/catalog";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = studyFeedMetadata(STUDY_FEEDS.pance);

export default function PanceFeedPage() {
  return <StudyFeedPage board={STUDY_FEEDS.pance} />;
}
