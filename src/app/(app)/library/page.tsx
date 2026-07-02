import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { LibraryHubClient } from "@/components/library/LibraryHubClient";
import type { LibraryHubStats } from "@/components/library/LibraryHubHeader";
import { ProBenefitsCallout } from "@/components/ProBenefitsCallout";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference, resolveExamFieldId } from "@/lib/edtech/exam-preference";
import { getUserEdtechMetadata } from "@/lib/edtech/user-metadata";
import { usmleStepDefinition, defaultUsmleFieldId } from "@/lib/exam-prep/usmle/steps";
import {
  getLibraryHubStats,
  getStudentWeakTopics,
} from "@/lib/learning/student-dashboard";
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
  const fieldId = resolveExamFieldId(examSlug);
  const meta = examSlug === "usmle" ? await getUserEdtechMetadata(userId) : null;
  const usmleStep =
    examSlug === "usmle"
      ? usmleStepDefinition(meta?.usmleFieldId ?? defaultUsmleFieldId())
      : null;

  const [{ cards }, weakTopics, hubStatsRaw] = await Promise.all([
    loadMemoryCards(userId, examSlug, {
      usmleFieldId: meta?.usmleFieldId,
    }),
    getStudentWeakTopics(userId, [fieldId]),
    getLibraryHubStats(userId),
  ]);

  const weakTopicsSlice = weakTopics.slice(0, 6);
  const hubStats: LibraryHubStats = {
    readinessScore: hubStatsRaw.readinessScore,
    studyStreakDays: hubStatsRaw.studyStreakDays,
    overallAccuracy: hubStatsRaw.overallAccuracy,
    motivationalMessage: hubStatsRaw.motivationalMessage,
  };

  return (
    <div className="w-full space-y-4">
      <ProBenefitsCallout />
      <LibraryHubClient
        examSlug={examSlug}
        usmleStepLabel={usmleStep?.shortName}
        userName={userName}
        cards={cards}
        weakTopics={weakTopicsSlice}
        hubStats={hubStats}
        initialCardId={initialCardId}
        topicKey={topicKey}
      />
    </div>
  );
}

async function LibraryPageInner({
  examOverride,
  initialCardId,
  topicKey,
}: {
  examOverride?: ExamSlug;
  initialCardId?: string;
  topicKey?: string;
}) {
  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.library)}`);
  }

  await requirePremiumPage(ROUTES.library);

  return (
    <LibraryContent
      userId={session.user.id}
      userName={session.user.name}
      examOverride={examOverride}
      initialCardId={initialCardId}
      topicKey={topicKey}
    />
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; card?: string; topic?: string }>;
};

export default async function LibraryPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const examOverride = params.exam as ExamSlug | undefined;
  const initialCardId = params.card;
  const topicKey = params.topic;

  return (
    <Suspense fallback={<LibrarySkeleton />}>
      <LibraryPageInner
        examOverride={examOverride}
        initialCardId={initialCardId}
        topicKey={topicKey}
      />
    </Suspense>
  );
}
