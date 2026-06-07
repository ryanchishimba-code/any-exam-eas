import { redirect } from "next/navigation";
import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { PracticeSidebar } from "@/components/layout/PracticeSidebar";
import { StudyBankPractice } from "@/components/study/StudyBankPractice";
import { CardSkeleton } from "@/components/ui/skeleton";
import { getExamHub } from "@/lib/exams/catalog";
import type { ExamRouteSlug } from "@/lib/routes";

const FIELD_MAP: Record<ExamRouteSlug, string> = {
  nclex: "nursing",
  naplex: "pharmacy",
  usmle: "usmle-step-2",
  mpje: "mpje",
};

type Props = {
  params: Promise<{ exam: string }>;
  searchParams: Promise<{ mode?: string; state?: string; field?: string }>;
};

export async function generateMetadata({ params }: Props) {
  const { exam } = await params;
  const hub = getExamHub(exam);
  return {
    title: hub ? `Practice ${hub.title}` : "Practice — Any Exam Easy",
  };
}

export default async function PracticeExamPage({ params, searchParams }: Props) {
  const { exam } = await params;
  const sp = await searchParams;

  if (!["nclex", "naplex", "usmle", "mpje"].includes(exam)) {
    redirect("/study-hub");
  }

  const slug = exam as ExamRouteSlug;
  const field = sp.field ?? FIELD_MAP[slug];
  const mode = sp.mode === "timed" ? "timed" : "bank";
  const qs = new URLSearchParams({ field, mode });
  if (sp.state) {
    qs.set("state", sp.state);
    qs.set("mpjeState", sp.state);
  }
  if (slug === "mpje") qs.set("mpjeVariant", "state");

  if (!sp.field || (sp.mode !== "timed" && sp.mode !== "bank" && !sp.mode)) {
    redirect(`/practice/${exam}?${qs.toString()}`);
  }

  const hub = getExamHub(slug);
  const callbackPath = `/practice/${exam}?${qs.toString()}`;

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto flex max-w-6xl gap-8 px-5 pb-20 pt-[var(--page-top)] sm:px-6">
        <PracticeSidebar />
        <div className="min-w-0 flex-1">
          <p className="text-xs font-semibold uppercase tracking-wider text-indigo-600">
            Practice
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            {hub?.title ?? exam.toUpperCase()}
          </h1>
          <p className="mt-2 text-sm text-slate-600">{hub?.subtitle}</p>

          <PremiumGate callbackPath={callbackPath}>
            <Suspense fallback={<CardSkeleton />}>
              <div className="mt-8">
                <StudyBankPractice />
              </div>
            </Suspense>
          </PremiumGate>
        </div>
      </div>
    </div>
  );
}
