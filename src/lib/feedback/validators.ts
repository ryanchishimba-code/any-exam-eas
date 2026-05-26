import { z } from "zod";
import { FEEDBACK_CATEGORIES, type FeedbackCategory } from "./types";

const categoryIds = FEEDBACK_CATEGORIES.map((c) => c.id) as [
  FeedbackCategory,
  ...FeedbackCategory[],
];

export const submitFeedbackSchema = z.object({
  name: z.string().trim().max(120).optional().or(z.literal("")),
  email: z
    .string()
    .trim()
    .max(254)
    .email("Enter a valid email address.")
    .optional()
    .or(z.literal("")),
  category: z.enum(categoryIds, {
    errorMap: () => ({ message: "Select a feedback category." }),
  }),
  message: z
    .string()
    .trim()
    .min(10, "Message must be at least 10 characters.")
    .max(5000, "Message is too long (max 5000 characters)."),
  rating: z.coerce.number().int().min(1).max(5),
});

export type SubmitFeedbackInput = z.infer<typeof submitFeedbackSchema>;
