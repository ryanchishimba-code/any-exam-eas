import { z } from "zod";

/** Normalize emails before storage and lookup (case-insensitive login). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const signupPlanSchema = z.enum(["trial", "subscribe"], {
  errorMap: () => ({ message: "Choose a trial or subscription plan to continue." }),
});

export const subscriptionTierSchema = z.enum(["basic", "pro"]).default("pro");

export const signUpSchema = z.object({
  email: z.string().trim().email().transform(normalizeEmail),
  password: z
    .string()
    .min(10, "Password must be at least 10 characters.")
    .regex(/[A-Za-z]/, "Password must include a letter.")
    .regex(/\d/, "Password must include a number."),
  name: z.string().trim().min(1, "Name is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to create an account." }),
  }),
  plan: signupPlanSchema,
  tier: subscriptionTierSchema.optional(),
  interval: z.enum(["monthly", "quarterly", "semiannual", "yearly"]).optional(),
  promoCode: z.string().trim().max(32).optional(),
});

export const loginSchema = z.object({
  email: z.string().trim().email().transform(normalizeEmail),
  password: z.string().trim().min(1, "Password is required."),
});

export type SignupPlan = z.infer<typeof signupPlanSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
