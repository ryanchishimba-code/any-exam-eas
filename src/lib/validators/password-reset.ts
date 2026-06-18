import { z } from "zod";
import { normalizeEmail } from "@/lib/validators/auth";
import { passwordSchema } from "@/lib/validators/password-policy";

/** Shown for every request — never reveals whether the email is registered. */
export const FORGOT_PASSWORD_SUCCESS_MESSAGE =
  "If an account exists, a password reset link has been sent to your email.";

export const PASSWORD_RESET_EXPIRY_MINUTES = 15;

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
    newPassword: passwordSchema.optional(),
    password: passwordSchema.optional(),
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
