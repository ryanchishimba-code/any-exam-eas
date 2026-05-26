import { z } from "zod";

/** Normalize emails before storage and lookup (case-insensitive login). */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export const signupPlanSchema = z.enum(["trial", "subscribe"], {
  errorMap: () => ({ message: "Choose a free trial or subscribe to continue." }),
});

export const signUpSchema = z.object({
  email: z.string().email().transform(normalizeEmail),
  password: z.string().min(8, "Password must be at least 8 characters."),
  name: z.string().trim().min(1, "Name is required."),
  dateOfBirth: z.string().min(1, "Date of birth is required."),
  acceptedTerms: z.literal(true, {
    errorMap: () => ({ message: "You must accept the terms to create an account." }),
  }),
  plan: signupPlanSchema,
});

export const loginSchema = z.object({
  email: z.string().email().transform(normalizeEmail),
  password: z.string().min(1, "Password is required."),
});

export type SignupPlan = z.infer<typeof signupPlanSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
