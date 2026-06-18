import { z } from "zod";

/**
 * Single source of truth for password rules across every flow that sets a
 * password (signup, password reset, and any future credential changes).
 *
 * Policy: at least 10 characters, including at least one letter and one number.
 */
export const PASSWORD_MIN_LENGTH = 10;

export type PasswordRequirementId = "length" | "letter" | "number";

type PasswordRequirement = {
  id: PasswordRequirementId;
  /** Short label for inline checklists shown beside the input. */
  label: string;
  /** Full-sentence message used for form-level errors. */
  message: string;
  test: (password: string) => boolean;
};

export const passwordRequirements: readonly PasswordRequirement[] = [
  {
    id: "length",
    label: `At least ${PASSWORD_MIN_LENGTH} characters`,
    message: `Password must be at least ${PASSWORD_MIN_LENGTH} characters.`,
    test: (password) => password.length >= PASSWORD_MIN_LENGTH,
  },
  {
    id: "letter",
    label: "At least one letter",
    message: "Password must include a letter.",
    test: (password) => /[A-Za-z]/.test(password),
  },
  {
    id: "number",
    label: "At least one number",
    message: "Password must include a number.",
    test: (password) => /\d/.test(password),
  },
];

export type PasswordChecks = Record<PasswordRequirementId, boolean>;

export function checkPassword(password: string): PasswordChecks {
  return passwordRequirements.reduce((acc, req) => {
    acc[req.id] = req.test(password);
    return acc;
  }, {} as PasswordChecks);
}

export function isPasswordValid(password: string): boolean {
  return passwordRequirements.every((req) => req.test(password));
}

/** First unmet-requirement message, or null when the password satisfies the policy. */
export function passwordError(password: string): string | null {
  return passwordRequirements.find((req) => !req.test(password))?.message ?? null;
}

export const passwordSchema = z
  .string()
  .min(PASSWORD_MIN_LENGTH, passwordRequirements[0]!.message)
  .regex(/[A-Za-z]/, passwordRequirements[1]!.message)
  .regex(/\d/, passwordRequirements[2]!.message);
