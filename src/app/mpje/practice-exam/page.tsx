import { Suspense } from "react";
import { PremiumGate } from "@/components/PremiumGate";
import { MpjePracticeExam } from "@/components/mpje/MpjePracticeExam";

export const metadata = {
  title: "MPJE Full Practice Exam — 120 Questions",
  description:
    "Full-length MPJE practice exam simulator: 120 questions, 2.5 hours, state-specific pharmacy law.",
};

export default function MpjePracticeExamPage() {
  return (
    <PremiumGate callbackPath="/mpje/practice-exam">
      <Suspense
        fallback={
          <p className="py-20 text-center text-sm text-slate-500">Loading exam…</p>
        }
      >
        <MpjePracticeExam />
      </Suspense>
    </PremiumGate>
  );
}
