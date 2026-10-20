import type { ExamAnswerRecord } from "@/lib/exam-sessions/service";
import { buildTopicBreakdown as buildTopicBreakdownRows } from "@/lib/full-exam/exam-breakdown-tally";
import type { ExamSlug } from "@/types/edtech";
import type { FullExamTopicBreakdown } from "@/types/full-exam";

type TopicQuestion = {
  topicCategory?: string;
  subjectId?: string;
  blueprintDomain?: string | null;
  blueprintTopic?: string | null;
  question?: string | null;
  tags?: string[] | null;
  caseStep?: number;
};

export function buildTopicBreakdown(
  questions: TopicQuestion[],
  answers: ExamAnswerRecord[],
  options?: { examSlug?: ExamSlug }
): FullExamTopicBreakdown[] {
  return buildTopicBreakdownRows(questions, answers, options);
}
