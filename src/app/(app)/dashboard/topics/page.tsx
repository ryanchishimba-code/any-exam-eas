import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { HighYieldTopicsClient } from "@/components/edtech/HighYieldTopicsClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { usmleStepDefinition, defaultUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
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

export const maxDuration = 60;

function TopicsSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-5 px-0.5">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="h-20 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-2xl" />
      <Skeleton className="h-64 w-full rounded-2xl" />
    </div>
  );
}

async function TopicsContent({
  userId,
  examSlug,
  topicParam,
  deepDive,
}: {
  userId: string;
  examSlug: ExamSlug;
  topicParam?: string;
  deepDive?: boolean;
}) {
  const meta = examSlug === "usmle" ? await getUserEdtechMetadata(userId) : null;
  const usmleStep =
    examSlug === "usmle"
      ? usmleStepDefinition(meta?.usmleFieldId ?? defaultUsmleFieldId())
      : null;

  const topics = await loadHighYieldTopics(examSlug, {
    usmleFieldId: meta?.usmleFieldId,
  });
  const progressMap = await loadTopicProgressMap(
    userId,
    topics.map((t) => t.id)
  );

  return (
    <HighYieldTopicsClient
      examSlug={examSlug}
      usmleStepLabel={usmleStep?.shortName}
      topics={topics}
      progressMap={progressMap}
      initialTopicSlug={topicParam}
      initialDeepDive={deepDive}
    />
  );
}

export default async function HighYieldTopicsPage({
  searchParams,
}: {
  searchParams: Promise<{ exam?: string; topic?: string; mode?: string }>;
}) {
  const { exam, topic, mode } = await searchParams;
  const deepDive = mode === "deep";

  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.highYieldTopics)}`);
  }

  await requirePremiumPage(ROUTES.highYieldTopics);
  if (deepDive) {
    await requireProFeaturePage("deep_dive_modules", ROUTES.highYieldTopics);
  }

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);

  if (exam && isExamSlug(exam) && exam !== pref.examSlug) {
    const qs = new URLSearchParams();
    if (topic) qs.set("topic", topic);
    if (deepDive) qs.set("mode", "deep");
    const suffix = qs.toString();
    redirect(suffix ? `${ROUTES.highYieldTopics}?${suffix}` : ROUTES.highYieldTopics);
  }

  return (
    <Suspense fallback={<TopicsSkeleton />}>
      <TopicsContent
        userId={session.user.id}
        examSlug={pref.examSlug}
        topicParam={topic}
        deepDive={deepDive}
      />
    </Suspense>
  );
}
