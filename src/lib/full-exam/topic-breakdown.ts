import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import type { FullExamTopicBreakdown } from "@/types/full-exam";

type TopicQuestion = { topicCategory?: string; subjectId?: string };

export function buildTopicBreakdown(
  questions: TopicQuestion[],
  answers: ExamAnswerRecord[]
): FullExamTopicBreakdown[] {
  const byTopic = new Map<string, { correct: number; total: number }>();

  for (let i = 0; i < questions.length; i++) {
    const q = questions[i];
    const topic = q.topicCategory ?? q.subjectId ?? "General";
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
