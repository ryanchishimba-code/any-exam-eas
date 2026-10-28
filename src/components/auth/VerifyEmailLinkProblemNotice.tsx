import { VerifyEmailLinkIssueCard } from "@/components/auth/verify-email/VerifyEmailLinkIssueCard";

type VerifyEmailLinkProblemNoticeProps = {
  kind: "invalid" | "missing";
  displayEmail?: string | null;
};

export function VerifyEmailLinkProblemNotice({
  kind,
  displayEmail,
}: VerifyEmailLinkProblemNoticeProps) {
  const emailLabel = displayEmail?.trim() ? displayEmail.trim() : "your email";
  return <VerifyEmailLinkIssueCard kind={kind} emailLabel={emailLabel} />;
}
