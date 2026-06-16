import type { GeneratedExam } from "@/lib/ai";

export function validateAanpFnpExam(exam: GeneratedExam): string[] {
  const issues: string[] = [];
  if (exam.questions.length === 0) issues.push("empty_exam");
  for (const q of exam.questions) {
    if (!q.vignette?.trim()) issues.push("missing_vignette");
    if ((q.options?.length ?? 0) < 4 && q.type !== "select_all") issues.push("weak_options");
  }
  return issues;
}
