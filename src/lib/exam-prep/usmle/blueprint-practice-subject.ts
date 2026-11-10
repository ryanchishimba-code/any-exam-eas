import { getUsmle2026Topic } from "@/lib/exam-prep/usmle/blueprint-topics-2026";

/** A question-bank subjectId that is a USMLE blueprint topic, not a catalog subject. */
export function usmleBlueprintPracticeSlug(fieldId: string, subjectId: string): string | null {
  if (!fieldId.startsWith("usmle-step-")) return null;
  const slug = subjectId.trim().toLowerCase();
  if (!slug || slug === "mixed" || slug === "__mixed__") return null;
  return getUsmle2026Topic(slug) ? slug : null;
}
