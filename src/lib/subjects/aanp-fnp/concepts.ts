import type { ExamQuestion } from "@/lib/ai";

export function extractAanpFnpConcepts(q: ExamQuestion): string[] {
  const tags = q.tags ?? [];
  const topic = q.topicCategory?.trim();
  return [...tags, ...(topic ? [topic] : [])].filter(Boolean);
}
