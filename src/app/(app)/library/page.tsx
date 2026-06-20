import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { LibraryHubClient } from "@/components/library/LibraryHubClient";
import type { LibraryHubStats } from "@/components/library/LibraryHubHeader";
import { ProBenefitsCallout } from "@/components/ProBenefitsCallout";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { getStudentDashboardData } from "@/lib/learning/student-dashboard";
import { loadMemoryCards } from "@/lib/library/memory-cards";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Library — Any Exam Easy",
  description:
    "AI-personalized study brief, quick tools, memory cards, drugs, and anatomy — your exam home base.",
};

function LibrarySkeleton() {
  return (
    <div className="w-full space-y-4">
      <Skeleton className="h-20 w-full rounded-[18px]" />
      <Skeleton className="h-28 w-full rounded-[20px]" />
      <Skeleton className="h-[28rem] w-full rounded-[28px]" />
    </div>
  );
}

async function LibraryContent({
  userId,
  userName,
  examOverride,
  initialCardId,
  topicKey,
}: {
  userId: string;
  userName?: string | null;
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
  const fieldId = resolveExamFieldId(examSlug);
  const weakTopics = dashboard.weakTopics
    .filter((t) => t.fieldId === fieldId)
    .slice(0, 6);

  const hubStats: LibraryHubStats = {
    readinessScore: dashboard.headline.readinessScore,
    studyStreakDays: dashboard.headline.studyStreakDays,
    overallAccuracy: dashboard.headline.overallAccuracy,
    motivationalMessage: dashboard.headline.motivationalMessage,
  };

  return (
    <div className="w-full space-y-4">
      <ProBenefitsCallout />
      <LibraryHubClient
        examSlug={examSlug}
        userName={userName}
        cards={cards}
        weakTopics={weakTopics}
        hubStats={hubStats}
        initialCardId={initialCardId}
        topicKey={topicKey}
      />
    </div>
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; card?: string; topic?: string }>;
};

export default async function LibraryPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.library)}`);
  }

  await requirePremiumPage(ROUTES.library);

  const params = await searchParams;
  const examOverride = params.exam as ExamSlug | undefined;
  const initialCardId = params.card;
  const topicKey = params.topic;

  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryContent
        userId={session.user.id}
        userName={session.user.name}
        examOverride={examOverride}
        initialCardId={initialCardId}
        topicKey={topicKey}
      />
    </Suspense>
  );
}
