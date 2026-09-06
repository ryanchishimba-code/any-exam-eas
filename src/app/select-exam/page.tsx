import { redirect } from "next/navigation";
import { Suspense } from "react";
import { auth } from "@/auth";
import { AccessBlockedNotice } from "@/components/AccessBlockedNotice";
import { ExamSelectionScreen } from "@/components/edtech/ExamSelectionScreen";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { getUserAccess } from "@/lib/access-control";
import { ROUTES } from "@/lib/routes";
import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";

export const metadata = {
  title: "Choose Your Exam — Any Exam Easy",
  description: `Bold, personalized prep for ${PLATFORM_EXAM_LIST}.`,
};

export const dynamic = "force-dynamic";
/** Preference read + access check can hit Neon on cold start. */
export const maxDuration = 30;

type PageProps = {
  searchParams: Promise<{ switch?: string; welcome?: string; verify?: string }>;
};

export default async function SelectExamPage({ searchParams }: PageProps) {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.selectExam)}`);
  }

  const params = await searchParams;
  const switchMode = params.switch === "1" || params.switch === "true";
  const access = await getUserAccess(session.user.id);

  if (access.blockReason === "email_unverified") {
    return (
      <AccessBlockedNotice
        reason="email_unverified"
        email={session.user.email}
      />
    );
  }

  const pref = await getUserExamPreference(session.user.id);

  if (pref && !switchMode) {
    if (access.hasAppAccess) {
      const qs = new URLSearchParams();
      if (params.welcome === "trial") qs.set("welcome", "trial");
      if (params.verify === "1") qs.set("verify", "1");
      const suffix = qs.toString() ? `?${qs.toString()}` : "";
      redirect(`${ROUTES.dashboard}${suffix}`);
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
