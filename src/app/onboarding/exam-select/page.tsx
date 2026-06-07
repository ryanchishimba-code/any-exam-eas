import { redirect } from "next/navigation";
import { auth } from "@/auth";
import { ExamSelectCards } from "@/components/edtech/ExamSelectCards";
import { getUserExamPreference } from "@/lib/edtech/exam-preference";

export const metadata = {
  title: "Select Your Exam — Any Exam Easy",
  description: "Choose NCLEX-RN, USMLE, NAPLEX, or MPJE to personalize your Study Hub.",
};

export default async function ExamSelectPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect("/auth/login?callbackUrl=/onboarding/exam-select");
  }

  const pref = await getUserExamPreference(session.user.id);
  if (pref) redirect("/study-hub");

  return (
    <div className="min-h-screen bg-[var(--color-bg)]">
      <div className="mx-auto max-w-3xl px-6 pb-24 pt-[var(--page-top)]">
        <p className="text-xs font-medium uppercase tracking-wide text-slate-500">Get started</p>
        <h1 className="mt-2 text-4xl font-semibold tracking-tight text-slate-900">
          Which exam are you preparing for?
        </h1>
        <p className="mt-4 max-w-xl text-lg text-slate-600">
          Your Study Hub, high-yield topics, and analytics will be tailored to one primary exam.
          You can switch anytime from the dashboard.
        </p>
        <div className="mt-10">
          <ExamSelectCards />
        </div>
      </div>
    </div>
  );
}
