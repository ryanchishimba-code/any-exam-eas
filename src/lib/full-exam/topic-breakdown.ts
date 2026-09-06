import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { resolveOrganSystemId } from "@/lib/exam-prep/usmle/content-spine";
import { organSystemById } from "@/lib/exam-prep/usmle/official-content-model";
import type { FullExamTopicBreakdown } from "@/types/full-exam";

type TopicQuestion = {
  topicCategory?: string;
  subjectId?: string;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
};

function displayLabel(raw: string): string {
  const spine = resolveOrganSystemId(raw, raw, raw);
  if (spine) return organSystemById(spine)?.shortLabel ?? spine;
  return raw
    .split(/[-_/\s]+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function bucketForQuestion(q: TopicQuestion): string {
  const spine = resolveOrganSystemId(
    q.blueprintDomain,
    q.blueprintTopic ?? q.topicCategory,
    q.subjectId
  );
  if (spine) return organSystemById(spine)?.shortLabel ?? spine;
  const fallback = q.topicCategory ?? q.subjectId ?? "General";
  return displayLabel(fallback);
}

export function buildTopicBreakdown(
  questions: TopicQuestion[],
  answers: ExamAnswerRecord[]
): FullExamTopicBreakdown[] {
  const byTopic = new Map<string, { correct: number; total: number }>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const topic = bucketForQuestion(q ?? {});
    const entry = byTopic.get(topic) ?? { correct: 0, total: 0 };
    entry.total += 1;
    const ans = answers.find((a) => a.questionIndex === i);
    if (ans?.correct) entry.correct += 1;
    byTopic.set(topic, entry);
  }

  return [...byTopic.entries()]
    .map(([topic, { correct, total }]) => ({
      topic,
      correct,
      total,
      pct: total > 0 ? Math.round((correct / total) * 100) : 0,
    }))
    .sort((a, b) => a.pct - b.pct);
}
