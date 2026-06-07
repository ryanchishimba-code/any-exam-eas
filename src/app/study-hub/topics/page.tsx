import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { HighYieldTopicsClient } from "@/components/edtech/HighYieldTopicsClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { loadHighYieldTopics } from "@/lib/edtech/topics-service";
import { loadTopicProgressMap } from "@/lib/edtech/topic-progress";
import { requirePremiumPage } from "@/lib/require-premium-page";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "High-Yield Topics — Study Hub",
  description: "Exam-specific book-summary study topics with must-know facts and practice links.",
};

async function TopicsContent({
  userId,
  examParam,
}: {
  userId: string;
  examParam?: string;
}) {
  const pref = await getUserExamPreference(userId);
  const examSlug: ExamSlug =
    examParam && isExamSlug(examParam) ? examParam : (pref?.examSlug ?? "nclex");

  if (!pref && !examParam) {
    redirect("/onboarding/exam-select");
  }

  const topics = await loadHighYieldTopics(examSlug);
  const progressMap = await loadTopicProgressMap(
    userId,
    topics.map((t) => t.id)
  );

  return (
    <HighYieldTopicsClient examSlug={examSlug} topics={topics} progressMap={progressMap} />
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
  searchParams: Promise<{ exam?: string }>;
}) {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login?callbackUrl=/study-hub/topics");

  await requirePremiumPage("/study-hub/topics");
  const { exam } = await searchParams;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-6xl px-6 pb-24 pt-[var(--page-top)]">
        <Suspense fallback={<TopicsSkeleton />}>
          <TopicsContent userId={session.user.id} examParam={exam} />
        </Suspense>
      </div>
    </div>
  );
}
