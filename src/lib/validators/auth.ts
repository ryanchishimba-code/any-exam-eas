import { z } from "zod";
import { passwordSchema } from "@/lib/validators/password-policy";

/** Normalize emails before storage and lookup (case-insensitive login). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const signupPlanSchema = z.enum(["trial", "subscribe"], {
  errorMap: () => ({ message: "Choose a trial or subscription plan to continue." }),
});

export const subscriptionTierSchema = z.literal("pro").default("pro");

/** Exam slugs offered at signup — mirrors EXAM_CATALOG in @/lib/edtech/exams. */
export const examSlugSchema = z.enum([
  "nclex",
  "usmle",
  "naplex",
  "pance",
  "aanp-fnp",
  "npte-pt",
]);

export const signUpSchema = z.object({
  email: z.string().trim().email().transform(normalizeEmail),
  password: passwordSchema,
  name: z.string().trim().min(1, "Name is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to create an account." }),
  }),
  plan: signupPlanSchema,
  tier: subscriptionTierSchema.optional(),
  interval: z.enum(["monthly", "quarterly", "semiannual", "yearly"]).optional(),
  examSlug: examSlugSchema.optional(),
  testDate: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date.")
    .refine((d) => !Number.isNaN(Date.parse(d)), "Enter a valid date.")
    .optional(),
  promoCode: z.string().trim().max(32).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform(normalizeEmail),
  password: z.string().trim().min(1, "Password is required."),
});

export type SignupPlan = z.infer<typeof signupPlanSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
