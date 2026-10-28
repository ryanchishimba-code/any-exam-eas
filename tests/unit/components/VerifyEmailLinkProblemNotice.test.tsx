import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerifyEmailLinkProblemNotice } from "@/components/auth/VerifyEmailLinkProblemNotice";
import { VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE } from "@/lib/auth/verify-email-copy";

describe("VerifyEmailLinkProblemNotice", () => {
  it("shows invalid link messaging and spam callout on login", () => {
    render(<VerifyEmailLinkProblemNotice kind="invalid" displayEmail="s***@example.com" />);

    expect(screen.getByText(/invalid or has expired/i)).toBeInTheDocument();
    expect(screen.getByText(/s\*\*\*@example.com/)).toBeInTheDocument();
    expect(screen.getByText(VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE)).toBeInTheDocument();
  });

  it("shows missing link messaging", () => {
    render(<VerifyEmailLinkProblemNotice kind="missing" />);

    expect(screen.getByText(/verification link missing/i)).toBeInTheDocument();
    expect(screen.getByText(VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE)).toBeInTheDocument();
  });
});
