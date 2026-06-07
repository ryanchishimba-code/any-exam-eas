import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { StudySubnav } from "@/components/StudySubnav";
import { PageShell } from "@/components/PageShell";
import { EXAM_MODES } from "@/lib/exam/modes";

function practiceCallbackPath(params: { field?: string; mode?: string }) {
  const qs = new URLSearchParams();
  if (params.field) qs.set("field", params.field);
  if (params.mode) qs.set("mode", params.mode);
  const query = qs.toString();
  return query ? `/study/practice?${query}` : "/study/practice";
}

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ mode?: string }>;
}) {
  const { mode } = await searchParams;
  const examMode = EXAM_MODES.find((m) => m.param === (mode === "bank" ? "bank" : "timed"));
  return {
    title: `${examMode?.label ?? "Study"} — Study Hub`,
    description: examMode?.description,
  };
}

export default async function StudyPracticePage({
  searchParams,
}: {
  searchParams: Promise<{ field?: string; mode?: string }>;
}) {
  const params = await searchParams;
  if (params.field === "drugs300") redirect("/study/drugs300");

  const examMode = EXAM_MODES.find((m) => m.param === (params.mode === "bank" ? "bank" : "timed"));
  const callbackPath = practiceCallbackPath(params);

  return (
    <PageShell
      eyebrow="Study Hub"
      title={examMode?.label ?? "Study"}
      description={
        params.mode === "bank"
          ? "Pick a topic, choose how many questions you want, and practice timed or untimed."
          : examMode?.description
      }
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
