import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { FullExamLauncher } from "@/components/exam/FullExamLauncher";
import { isExamSlug } from "@/lib/edtech/exams";
import { requirePremiumPage } from "@/lib/require-premium-page";
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
}: {
  params: Promise<{ examSlug: string }>;
}) {
  const { examSlug } = await params;
  if (!isExamSlug(examSlug)) redirect("/study-hub");

  const session = await auth();
  if (!session?.user?.id) {
    redirect(`/auth/login?callbackUrl=/full-exam/${examSlug}`);
  }

  await requirePremiumPage(`/full-exam/${examSlug}`);

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-5xl px-6 pb-24 pt-[var(--page-top)]">
        <FullExamLauncher examSlug={examSlug as ExamSlug} />
      </div>
    </div>
  );
}
