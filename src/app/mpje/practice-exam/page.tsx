import { Suspense } from "react";
import { MpjePracticeExam } from "@/components/mpje/MpjePracticeExam";

export const metadata = {
  title: "MPJE Practice Exam — AnyExamEasy",
  description: "120-question MPJE practice exam with a countdown, flags, and scored review.",
};

export const dynamic = "force-dynamic";

export default function MpjePracticeExamPage() {
  return (
    <Suspense fallback={null}>
      <MpjePracticeExam />
    </Suspense>
  );
}
