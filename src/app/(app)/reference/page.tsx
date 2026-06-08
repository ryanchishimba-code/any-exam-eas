import { Suspense } from "react";
import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ReferenceHubClient } from "@/components/reference/ReferenceHubClient";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { loadMemoryCards } from "@/lib/reference/memory-cards";
import { getMemoryCardSubjects } from "@/lib/reference/seeds";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const metadata = {
  title: "Quick Reference — Any Exam Easy",
  description: "Searchable memory cards for equations, conversions, tables, and high-yield facts.",
};

function ReferenceSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-40 w-full rounded-3xl" />
      <Skeleton className="h-11 w-full rounded-2xl" />
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Skeleton key={i} className="h-52 w-full rounded-2xl" />
        ))}
      </div>
    </div>
  );
}

async function ReferenceContent({
  userId,
  examOverride,
  initialCardId,
}: {
  userId: string;
  examOverride?: ExamSlug;
  initialCardId?: string;
}) {
  const pref = await getUserExamPreference(userId);
  if (!pref && !examOverride) redirect(ROUTES.selectExam);

  const { examSlug, cards } = await loadMemoryCards(userId, examOverride ?? pref?.examSlug);
  const subjects = getMemoryCardSubjects(examSlug);

  return (
    <ReferenceHubClient
      examSlug={examSlug}
      cards={cards}
      subjects={subjects}
      initialCardId={initialCardId}
    />
  );
}

type PageProps = {
  searchParams: Promise<{ exam?: string; card?: string }>;
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

  return (
    <div className="space-y-6">
      <header>
        <p className="text-xs font-bold uppercase tracking-[0.15em] text-violet-600">
          Quick Reference
        </p>
        <h1 className="mt-2 text-3xl font-bold tracking-tight text-[var(--color-ink)]">
          Memory Cards
        </h1>
        <p className="mt-2 max-w-2xl text-[var(--color-ink-muted)]">
          Fast recall for your board exam — search, filter, then practice or open a deeper review
          module.
        </p>
      </header>

      <Suspense fallback={<ReferenceSkeleton />}>
        <ReferenceContent
          userId={session.user.id}
          examOverride={examOverride}
          initialCardId={initialCardId}
        />
      </Suspense>
    </div>
  );
}
