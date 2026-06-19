import { redirect } from "next/navigation";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { auth } from "@/auth";
import { ExamWheelPicker } from "@/components/edtech/ExamWheelPicker";
import { getUsmleExamOptionsWithCounts } from "@/lib/exam-prep/usmle/exam-options";
import { ROUTES } from "@/lib/routes";

export const metadata = {
  title: "Choose Your USMLE Step — Any Exam Easy",
  description:
    "Pick USMLE Step 1, Step 2 CK, or Step 3. Each step has its own question bank with live counts.",
};

// Counts are DB-backed (cached ~5 min); render dynamically.
export const dynamic = "force-dynamic";

export default async function SelectUsmleStepPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `${ROUTES.auth.login}?callbackUrl=${encodeURIComponent(ROUTES.selectExamUsmle)}`
    );
  }

  const payload = await getUsmleExamOptionsWithCounts();

  return (
    <div className="relative min-h-[calc(100vh-var(--page-top))] overflow-hidden bg-[var(--color-bg)]">
      {/* Calm radial wash for depth, consistent with the exam selection screen. */}
      <div
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_120%_80%_at_50%_-20%,rgba(99,102,241,0.12),transparent_55%)]"
        aria-hidden
      />

      <div className="relative mx-auto max-w-6xl px-5 pb-20 pt-[var(--page-top)] sm:px-8 sm:pb-28">
        <div className="mb-6">
          <Link
            href={ROUTES.selectExam}
            className="inline-flex items-center gap-1.5 text-sm font-semibold text-indigo-600 transition hover:text-indigo-700 dark:text-indigo-400"
          >
            <ArrowLeft className="h-4 w-4" aria-hidden />
            All exams
          </Link>
        </div>

        <header className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-indigo-600 dark:text-indigo-400">
            USMLE
          </p>
          <h1 className="mt-4 bg-gradient-to-br from-slate-900 via-slate-800 to-indigo-800 bg-clip-text text-4xl font-extrabold tracking-tight text-transparent dark:from-white dark:via-slate-100 dark:to-indigo-300 sm:text-5xl">
            Choose your Step
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-lg text-slate-600 dark:text-slate-400">
            Spin the wheel to your focus for today — each step has its own
            dedicated, high-yield question bank. You can switch anytime.
          </p>
        </header>

        <div className="mt-12">
          <ExamWheelPicker initialPayload={payload} initialLevel="step2" />
        </div>
      </div>
    </div>
  );
}
