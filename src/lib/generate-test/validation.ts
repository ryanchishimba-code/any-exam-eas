import { z } from "zod";
import { isValidQuestionCount } from "@/lib/medicine-subjects";

export const generateTestBodySchema = z.object({
  field: z.string().min(1, "Field is required"),
  subjectId: z.string().min(1, "Subject is required"),
  topic: z.string().optional(),
  difficulty: z.enum(["easy", "medium", "hard"]).default("medium"),
  questionCount: z
    .number()
    .int()
    .default(10)
    .refine((n) => isValidQuestionCount(n), {
      message: "Question count must be 10, 15, 20, … up to 50 (steps of 5)",
    }),
  userNotes: z.string().max(50_000).optional(),
  generatorMode: z.enum(["topic", "upload", "custom"]).optional(),
  lessonPlanId: z.string().optional(),
  timed: z.boolean().optional(),
});

export type GenerateTestBody = z.infer<typeof generateTestBodySchema>;
