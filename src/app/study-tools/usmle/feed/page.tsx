import { notFound } from "next/navigation";
import { StudyFeedPage, studyFeedMetadata } from "@/components/study-feed/StudyFeedPage";
import { canPreviewUsmleFeed, isUsmleFeedReleased } from "@/lib/study-feed/usmle-feed-access";
import { usmleBoardFromQuery, usmleFeedStepChoices } from "@/lib/study-feed/usmle-feed";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

export const metadata = studyFeedMetadata({
  exam: "usmle-step-1",
  contentDir: "usmle-feed/step-1",
  idPrefix: "usmle1",
  label: "USMLE Feed",
  href: "/study-tools/usmle/feed",
  apiBase: "/api/study-feed/usmle-step-1",
  testId: "usmle-step-1-feed",
  description: "Flashcard feed for USMLE, organized by Step.",
});

export default async function UsmleFeedPage({
  searchParams,
}: {
  searchParams: Promise<{ step?: string }>;
}) {
  const preview = !isUsmleFeedReleased();
  if (preview && !(await canPreviewUsmleFeed())) {
    notFound();
  }
  const { step } = await searchParams;
  const board = usmleBoardFromQuery(step);
  return (
    <StudyFeedPage
      board={board}
      steps={usmleFeedStepChoices()}
      readOnly={preview}
      notice={preview ? "Admin preview" : undefined}
    />
  );
}
