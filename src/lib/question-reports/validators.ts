import { z } from "zod";
import { QUESTION_REPORT_REASONS, type QuestionReportReason } from "./types";

const reasonIds = QUESTION_REPORT_REASONS.map((r) => r.id) as [
  QuestionReportReason,
  ...QuestionReportReason[],
];

export const submitQuestionReportSchema = z.object({
  bankItemId: z.string().min(1).optional(),
  questionKey: z.string().min(1).max(200),
  fieldId: z.string().min(1).max(80),
  examSlug: z.string().min(1).max(40).optional(),
  subjectId: z.string().min(1).max(80).optional(),
  sessionId: z.string().min(1).max(120).optional(),
  sessionMode: z.string().min(1).max(40).optional(),
  reason: z.enum(reasonIds),
  message: z.string().max(2000).optional(),
  selectedAnswer: z.string().max(500).optional(),
  stemPreview: z.string().max(4000).optional(),
  options: z.array(z.string().max(500)).max(12).optional(),
  correctAnswer: z.string().max(500).optional(),
});

export const patchQuestionReportSchema = z.object({
  status: z.enum(["resolved", "dismissed"]).optional(),
  applyFix: z.boolean().optional(),
});
