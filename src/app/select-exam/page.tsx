import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { ExamSelectionScreen } from "@/components/edtech/ExamSelectionScreen";
import { Skeleton } from "@/components/ui/skeleton";
import { ensureAllBoardExams } from "@/lib/edtech/board-exam-sync";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserAccess } from "@/lib/access-control";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Choose Your Exam — Any Exam Easy",
  description:
    "Bold, personalized prep for USMLE, NCLEX, NAPLEX, COMLEX, and AANP FNP.",
};

export const dynamic = "force-dynamic";
/** Board exam bootstrap + preference read can hit Neon on cold start. */
export const maxDuration = 30;

type PageProps = {
  searchParams: Promise<{ switch?: string }>;
};

export default async function SelectExamPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.selectExam)}`);
  }

  const params = await searchParams;
  const switchMode = params.switch === "1" || params.switch === "true";

  // Non-blocking bootstrap — page renders immediately; sync runs in background.
  void ensureAllBoardExams().catch((err) => {
    console.error("[select-exam] board exam bootstrap failed:", err);
  });

  const pref = await getUserExamPreference(session.user.id);

  if (pref && !switchMode) {
    const access = await getUserAccess(session.user.id);
    if (access.hasAppAccess) {
      redirect(ROUTES.dashboard);
    }
    redirect("/settings?reactivate=1");
  }

  return (
    <Suspense
      fallback={
        <div className="mx-auto flex min-h-[50vh] max-w-4xl flex-col gap-4 px-4 py-12">
          <Skeleton className="h-10 w-64 rounded-xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
          <Skeleton className="h-48 w-full rounded-2xl" />
        </div>
      }
    >
      <ExamSelectionScreen
        switchMode={switchMode}
        currentExam={pref?.examSlug ?? null}
      />
    </Suspense>
  );
}
