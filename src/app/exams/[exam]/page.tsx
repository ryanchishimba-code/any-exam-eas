import { Suspense } from "react";
import { notFound, redirect } from "next/navigation";
import { ExamLanding } from "@/components/exams/ExamLanding";
import { CardSkeleton } from "@/components/ui/skeleton";
import { getExamHub } from "@/lib/exams/catalog";
import type { ExamRouteSlug } from "@/lib/routes";

const VALID: ExamRouteSlug[] = ["nclex", "naplex", "usmle", "pance"];

type Props = { params: Promise<{ exam: string }> };

export async function generateMetadata({ params }: Props) {
  const { exam } = await params;
  const hub = getExamHub(exam);
  if (!hub) return { title: "Exam — Any Exam Easy" };
  return {
    title: `${hub.title} — Any Exam Easy`,
    description: hub.subtitle,
  };
}

export default async function ExamPage({ params }: Props) {
  const { exam } = await params;
  if (exam === "top500") redirect("/study/drugs300");
  if (!VALID.includes(exam as ExamRouteSlug)) notFound();

  return (
    <Suspense
      fallback={
        <div className="mx-auto max-w-5xl px-6 pt-[var(--page-top)]">
          <CardSkeleton />
        </div>
      }
    >
      <ExamLanding slug={exam as ExamRouteSlug} />
    </Suspense>
  );
}
