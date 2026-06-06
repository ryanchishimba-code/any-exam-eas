import { z } from "zod";
import { normalizeEmail } from "@/lib/validators/auth";

/** Shown for every request — never reveals whether the email is registered. */
export const FORGOT_PASSWORD_SUCCESS_MESSAGE =
  "If an account exists, a password reset link has been sent to your email.";

export const PASSWORD_RESET_EXPIRY_MINUTES = 15;

/** Strong password: 8+ chars, at least one number and one symbol. */
export const strongPasswordSchema = z
  .string()
  .min(8, "Password must be at least 8 characters.")
  .regex(/\d/, "Password must include at least one number.")
  .regex(/[^A-Za-z0-9]/, "Password must include at least one symbol.");

export type StrongPasswordChecks = {
  minLength: boolean;
  hasNumber: boolean;
  hasSymbol: boolean;
};

export function checkStrongPassword(password: string): StrongPasswordChecks {
  return {
    minLength: password.length >= 8,
    hasNumber: /\d/.test(password),
    hasSymbol: /[^A-Za-z0-9]/.test(password),
  };
}

export function strongPasswordError(password: string): string | null {
  const checks = checkStrongPassword(password);
  if (!checks.minLength) return "Password must be at least 8 characters.";
  if (!checks.hasNumber) return "Password must include at least one number.";
  if (!checks.hasSymbol) return "Password must include at least one symbol.";
  return null;
}

export const forgotPasswordSchema = z.object({
  email: z
    .string()
    .trim()
    .email("Enter a valid email address.")
    .transform(normalizeEmail),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, "Reset link is invalid."),
    newPassword: strongPasswordSchema.optional(),
    password: strongPasswordSchema.optional(),
  })
  .superRefine((data, ctx) => {
    if (!data.newPassword && !data.password) {
      ctx.addIssue({
        code: z.ZodIssueCode.custom,
        message: "Password is required.",
        path: ["newPassword"],
      });
    }
  })
  .transform((data) => ({
    token: data.token,
    newPassword: (data.newPassword ?? data.password)!,
  }));

export type ForgotPasswordInput = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordInput = z.infer<typeof resetPasswordSchema>;
