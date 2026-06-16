import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { FullExamLauncher } from "@/components/exam/FullExamLauncher";
import { setUserExamPreference } from "@/lib/edtech/exam-preference";
import { isExamSlug } from "@/lib/edtech/exams";
import { requireProFeaturePage } from "@/lib/require-pro-feature";
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

  await requireProFeaturePage("unlimited_mock_exams", fullExamHref(examSlug as ExamSlug));

  await setUserExamPreference(session.user.id, examSlug as ExamSlug);

  return (
    <FullExamLauncher
      key={`${sp.mode ?? "default"}-${sp.autostart ?? "0"}-${sp.timed ?? "1"}`}
      examSlug={examSlug as ExamSlug}
      initialMode={sp.mode ?? null}
      autostart={sp.autostart === "1"}
      initialTimed={sp.timed !== "0"}
    />
  );
}
