import { render, screen } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { VerifyEmailPrompt } from "@/components/auth/VerifyEmailPrompt";
import { VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE } from "@/lib/auth/verify-email-copy";

vi.mock("next/link", () => ({
  default: ({ children, href }: { children: React.ReactNode; href: string }) => (
    <a href={href}>{children}</a>
  ),
}));

describe("VerifyEmailPrompt", () => {
  it("shows sent-to line with spam callout directly underneath", () => {
    render(<VerifyEmailPrompt email="student@example.com" compact />);

    expect(screen.getByText(/verification link we sent to/i)).toBeInTheDocument();
    expect(screen.getByText(VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE)).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /resend email/i })).toBeInTheDocument();
  });
});
