import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { FullExamLauncher } from "@/components/exam/FullExamLauncher";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { requirePremiumPage } from "@/lib/require-premium-page";
import { getStudyUsageSnapshot } from "@/lib/study/usage-limits";
import { resolveMockExamAccess } from "@/lib/study/mock-exam-access";
import { fullExamHref, ROUTES } from "@/lib/routes";
import type { ExamSlug } from "@/types/edtech";

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

export default async function FullExamLauncherPage({
  params,
  searchParams,
}: {
  params: Promise<{ examSlug: string }>;
  searchParams: Promise<{ mode?: string; autostart?: string; timed?: string }>;
}) {
  const { examSlug } = await params;
  const sp = await searchParams;
  if (!isExamSlug(examSlug)) redirect(ROUTES.dashboard);

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(fullExamHref(examSlug as ExamSlug))}`);
  }

  const access = await requirePremiumPage(fullExamHref(examSlug as ExamSlug));
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
    <FullExamLauncher
      key={`${sp.mode ?? "default"}-${sp.autostart ?? "0"}-${sp.timed ?? "1"}`}
      examSlug={examSlug as ExamSlug}
      initialMode={sp.mode ?? null}
      autostart={sp.autostart === "1"}
      initialTimed={sp.timed !== "0"}
      mockAccess={mockAccess}
    />
  );
}
