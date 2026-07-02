import { Suspense } from "react";
import { redirect } from "next/navigation";
import { getCachedSession } from "@/lib/auth/session";
import { FullExamLauncher } from "@/components/exam/FullExamLauncher";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { getStudyUsageSnapshot } from "@/lib/study/usage-limits";
import { resolveMockExamAccess, type MockExamAccess } from "@/lib/study/mock-exam-access";
import { fullExamHref, ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

export const maxDuration = 60;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;
  return {
    title: `Full Simulated Exam — ${examSlug.toUpperCase()}`,
    description: "Premium board exam simulator with dynamic timer and detailed review.",
  };
}

function FullExamLauncherSkeleton() {
  return (
    <div className="mx-auto w-full max-w-3xl space-y-4 px-4 py-8">
      <Skeleton className="h-10 w-64" />
      <Skeleton className="h-48 w-full rounded-2xl" />
      <Skeleton className="h-12 w-full rounded-xl" />
    </div>
  );
}

async function FullExamLauncherContent({
  examSlug,
  mode,
  autostart,
  timed,
  mockAccess,
}: {
  examSlug: ExamSlug;
  mode?: string;
  autostart?: string;
  timed?: string;
  mockAccess: MockExamAccess;
}) {
  return (
    <FullExamLauncher
      key={`${mode ?? "default"}-${autostart ?? "0"}-${timed ?? "1"}`}
      examSlug={examSlug}
      initialMode={mode ?? null}
      autostart={autostart === "1"}
      initialTimed={timed !== "0"}
      mockAccess={mockAccess}
    />
  );
}

export default async function FullExamLauncherPage({
  params,
  searchParams,
}: {
  params: Promise<{ examSlug: string }>;
  searchParams: Promise<{ mode?: string; autostart?: string; timed?: string }>;
}) {
  const { examSlug: rawSlug } = await params;
  const sp = await searchParams;
  if (!isExamSlug(rawSlug)) redirect(ROUTES.dashboard);

  const examSlug = rawSlug as ExamSlug;

  const session = await getCachedSession();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(fullExamHref(examSlug))}`);
  }

  const access = await requirePremiumPage(fullExamHref(examSlug));
  const usage = await getStudyUsageSnapshot(access);
  const mockAccess = resolveMockExamAccess(usage.limits, usage.plan, {
    usedTrialMocks: usage.usedTrialMocks,
  });

  const pref = await getUserExamPreference(session.user.id);
  if (!pref) redirect(ROUTES.selectExam);
  if (pref.examSlug !== examSlug) {
    const qs = new URLSearchParams();
    if (sp.mode) qs.set("mode", sp.mode);
    if (sp.autostart) qs.set("autostart", sp.autostart);
    if (sp.timed) qs.set("timed", sp.timed);
    const suffix = qs.toString();
    redirect(`${fullExamHref(pref.examSlug)}${suffix ? `?${suffix}` : ""}`);
  }

  return (
    <Suspense fallback={<FullExamLauncherSkeleton />}>
      <FullExamLauncherContent
        examSlug={examSlug}
        mode={sp.mode}
        autostart={sp.autostart}
        timed={sp.timed}
        mockAccess={mockAccess}
      />
    </Suspense>
  );
}
