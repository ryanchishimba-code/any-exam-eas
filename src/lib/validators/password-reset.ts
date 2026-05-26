import { z } from "zod";
import { normalizeEmail } from "@/lib/validators/auth";

export const forgotPasswordSchema = z.object({
  email: z.string().email("Enter a valid email address.").transform(normalizeEmail),
});

export const resetPasswordSchema = z.object({
  token: z.string().min(1, "Reset link is invalid."),
  password: z.string().min(8, "Password must be at least 8 characters."),
});

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
