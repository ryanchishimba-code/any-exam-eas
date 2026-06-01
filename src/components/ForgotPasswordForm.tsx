import { ForgotPasswordPanel } from "@/components/auth/ForgotPasswordPanel";

type ForgotPasswordFormProps = {
  defaultEmail?: string;
};

/** Standalone forgot-password page wrapper. */
export function ForgotPasswordForm({ defaultEmail }: ForgotPasswordFormProps) {
  return <ForgotPasswordPanel variant="page" defaultEmail={defaultEmail} />;
}
