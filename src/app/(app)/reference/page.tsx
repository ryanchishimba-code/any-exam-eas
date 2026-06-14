import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ReferenceHubClient } from "@/components/reference/ReferenceHubClient";
import type { ReferenceHubStats } from "@/components/reference/ReferenceHubHeader";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { loadMemoryCards } from "@/lib/reference/memory-cards";
import { getMemoryCardSubjects } from "@/lib/reference/seeds";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Study Reference — Any Exam Easy",
  description:
    "AI-personalized study brief, quick tools, memory cards, drugs, and anatomy — your exam home base.",
};

function ReferenceSkeleton() {
  return (
    <div className="mx-auto max-w-5xl space-y-4">
      <Skeleton className="h-20 w-full rounded-[18px]" />
      <Skeleton className="h-28 w-full rounded-[20px]" />
      <Skeleton className="h-[28rem] w-full rounded-[28px]" />
    </div>
  );
}

async function ReferenceContent({
  userId,
  examOverride,
  initialCardId,
  topicKey,
}: {
  userId: string;
  examOverride?: ExamSlug;
  initialCardId?: string;
  topicKey?: string;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref && !examOverride) redirect(ROUTES.selectExam);

  const examSlug = (examOverride ?? pref?.examSlug ?? "nclex") as ExamSlug;
  const [{ cards }, dashboard] = await Promise.all([
    loadMemoryCards(userId, examSlug),
    getStudentDashboardData(userId),
  ]);
  const subjects = getMemoryCardSubjects(examSlug);
  const fieldId = resolveExamFieldId(examSlug);
  const weakTopics = dashboard.weakTopics
    .filter((t) => t.fieldId === fieldId)
    .slice(0, 6);

  const hubStats: ReferenceHubStats = {
    readinessScore: dashboard.headline.readinessScore,
    studyStreakDays: dashboard.headline.studyStreakDays,
    overallAccuracy: dashboard.headline.overallAccuracy,
    motivationalMessage: dashboard.headline.motivationalMessage,
  };

  return (
    <ReferenceHubClient
      examSlug={examSlug}
      cards={cards}
      subjects={subjects}
      weakTopics={weakTopics}
      hubStats={hubStats}
      initialCardId={initialCardId}
      topicKey={topicKey}
    />
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; card?: string; topic?: string }>;
};

export default async function ReferencePage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.reference)}`);
  }

  await requirePremiumPage(ROUTES.reference);

  const params = await searchParams;
  const examOverride = params.exam as ExamSlug | undefined;
  const initialCardId = params.card;
  const topicKey = params.topic;

  return (
    <Suspense fallback={<ReferenceSkeleton />}>
      <ReferenceContent
        userId={session.user.id}
        examOverride={examOverride}
        initialCardId={initialCardId}
        topicKey={topicKey}
      />
    </Suspense>
  );
}
