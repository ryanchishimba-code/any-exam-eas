import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";

export const metadata = {
  title: "Question bank — Any Exam Easy",
};

function practiceCallbackPath(params: { field?: string; mode?: string }) {
  const qs = new URLSearchParams();
  if (params.field) qs.set("field", params.field);
  if (params.mode) qs.set("mode", params.mode);
  const query = qs.toString();
  return query ? `/study/practice?${query}` : "/study/practice";
}

export default async function StudyPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string; mode?: string }>;
}) {
  const params = await searchParams;
  if (params.field === "drugs300") redirect("/study/drugs300");

  const callbackPath = practiceCallbackPath(params);

  return (
    <PageShell
      eyebrow="Study"
      title="Question bank"
      description="Board-style practice with personalized ordering, confidence tracking, and cited explanations after each item."
      maxWidth="max-w-3xl"
    >
      <StudySubnav />
      <PremiumGate callbackPath={callbackPath}>
        <Suspense fallback={<p className="mt-8 text-sm text-[var(--color-ink-muted)]">Loading…</p>}>
          <StudyBankPractice />
        </Suspense>
      </PremiumGate>
    </PageShell>
  );
}
