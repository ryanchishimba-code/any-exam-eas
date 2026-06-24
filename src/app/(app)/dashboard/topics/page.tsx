import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HighYieldTopicsClient } from "@/components/edtech/HighYieldTopicsClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { loadHighYieldTopics } from "@/lib/edtech/topics-service";
import { loadTopicProgressMap } from "@/lib/edtech/topic-progress";
import { requireProFeaturePage } from "@/lib/require-pro-feature";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "High-Yield Topics & Review Modules — Any Exam Easy",
  description:
    "Exam-specific textbook-style review modules and condensed study topics with must-know facts and practice links.",
};

async function TopicsContent({
  userId,
  examParam,
  topicParam,
  deepDive,
}: {
  userId: string;
  examParam?: string;
  topicParam?: string;
  deepDive?: boolean;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref) redirect(ROUTES.selectExam);

  const examSlug: ExamSlug = pref.examSlug;

  // High-yield topics are scoped to the user's active exam — ignore mismatched ?exam= links.
  if (examParam && isExamSlug(examParam) && examParam !== examSlug) {
    const qs = new URLSearchParams();
    if (topicParam) qs.set("topic", topicParam);
    if (deepDive) qs.set("mode", "deep");
    const suffix = qs.toString();
    redirect(suffix ? `${ROUTES.highYieldTopics}?${suffix}` : ROUTES.highYieldTopics);
  }

  const topics = await loadHighYieldTopics(examSlug);
  const progressMap = await loadTopicProgressMap(
    userId,
    topics.map((t) => t.id)
  );

  return (
    <HighYieldTopicsClient
      examSlug={examSlug}
      topics={topics}
      progressMap={progressMap}
      initialTopicSlug={topicParam}
      initialDeepDive={deepDive}
    />
  );
}

function TopicsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-4 w-full max-w-xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-44 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

export default async function HighYieldTopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; topic?: string; mode?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.highYieldTopics)}`);
  }

  await requirePremiumPage(ROUTES.highYieldTopics);
  const { exam, topic, mode } = await searchParams;

  if (mode === "deep") {
    await requireProFeaturePage("deep_dive_modules", ROUTES.highYieldTopics);
  }

  return (
    <Suspense fallback={<TopicsSkeleton />}>
      <TopicsContent
        userId={session.user.id}
        examParam={exam}
        topicParam={topic}
        deepDive={mode === "deep"}
      />
    </Suspense>
  );
}
