"use client";

import type { GeneratedExam } from "@/lib/ai";
import { StudySessionFromExam } from "@/components/study/StudySessionPlayer";

/** Exam practice — one question at a time via the dynamic study engine. */
export function ExamQuiz({
  exam,
  examId,
  mode = "practice",
}: {
  exam: GeneratedExam;
  examId?: string;
  mode?: "practice" | "rapid" | "timed";
}) {
  return <StudySessionFromExam exam={exam} examId={examId} mode={mode} />;
}
