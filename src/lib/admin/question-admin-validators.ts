import { z } from "zod";

const optionalText = z
  .string()
  .trim()
  .max(20000)
  .optional()
  .transform((v) => (v === "" ? undefined : v));

const nullableText = z
  .string()
  .trim()
  .max(20000)
  .nullable()
  .optional();

const tagArray = z.array(z.string().trim().min(1).max(120)).max(40);

const optionsArray = z
  .array(z.string().trim().min(1).max(4000))
  .min(2, "At least two answer options are required.")
  .max(12);

export const createQuestionSchema = z
  .object({
    fieldId: z.string().trim().min(1),
    subjectId: z.string().trim().min(1).max(120),
    question: z.string().trim().min(8, "Question stem is too short.").max(20000),
    scenario: optionalText,
    options: optionsArray,
    correctAnswer: z.string().trim().min(1, "Select the correct answer."),
    explanation: z.string().trim().min(8, "A rationale is required.").max(20000),
    difficulty: z.number().int().min(1).max(5).optional(),
    itemType: z.string().trim().max(60).optional(),
    blueprintDomain: optionalText,
    blueprintTopic: optionalText,
    topicCategory: optionalText,
    taskCategory: optionalText,
    patientAgeGroup: optionalText,
    tags: tagArray.optional(),
    draft: z.boolean().optional(),
  })
  .superRefine((val, ctx) => {
    const isMcq = !val.itemType || val.itemType === "mcq" || val.itemType === "vignette";
    if (isMcq) {
      const match = val.options.some(
        (o) => o.toLowerCase() === val.correctAnswer.toLowerCase()
      );
      if (!match) {
        ctx.addIssue({
          code: z.ZodIssueCode.custom,
          path: ["correctAnswer"],
          message: "Correct answer must match one of the options.",
        });
      }
    }
  });

export const updateQuestionSchema = z
  .object({
    question: z.string().trim().min(8).max(20000).optional(),
    scenario: nullableText,
    options: optionsArray.optional(),
    correctAnswer: z.string().trim().min(1).optional(),
    explanation: z.string().trim().min(8).max(20000).optional(),
    difficulty: z.number().int().min(1).max(5).nullable().optional(),
    itemType: z.string().trim().max(60).optional(),
    reviewStatus: z.enum(["pending", "approved", "flagged", "rejected"]).nullable().optional(),
    blueprintDomain: nullableText,
    blueprintTopic: nullableText,
    topicCategory: nullableText,
    taskCategory: nullableText,
    patientAgeGroup: nullableText,
    tags: tagArray.optional(),
    active: z.boolean().optional(),
    qaPassed: z.boolean().optional(),
    note: z.string().trim().max(2000).optional(),
  })
  .refine((v) => Object.keys(v).length > 0, { message: "No changes provided." });

export const bulkActionSchema = z.object({
  ids: z.array(z.string().min(1)).min(1, "Select at least one question.").max(500),
  action: z.enum([
    "approve",
    "reject",
    "flag",
    "archive",
    "activate",
    "qa_pass",
    "qa_unpass",
    "set_tags",
  ]),
  tags: tagArray.optional(),
});

export type CreateQuestionBody = z.infer<typeof createQuestionSchema>;
export type UpdateQuestionBody = z.infer<typeof updateQuestionSchema>;
export type BulkActionBody = z.infer<typeof bulkActionSchema>;
