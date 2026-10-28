import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { VerifyEmailSpamCallout } from "@/components/auth/VerifyEmailSpamCallout";
import { VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE } from "@/lib/auth/verify-email-copy";

describe("VerifyEmailSpamCallout", () => {
  it("renders the highlighted spam/junk guidance with accessible note", () => {
    render(<VerifyEmailSpamCallout />);

    expect(
      screen.getByRole("note", { name: /where to find your verification email/i })
    ).toBeInTheDocument();
    expect(screen.getByText(VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE)).toBeInTheDocument();
    expect(screen.getByText(/Tap Resend email\./i)).toBeInTheDocument();
  });

  it("points to resend after login when the button is not on the same screen", () => {
    render(<VerifyEmailSpamCallout resendHint="after-login" />);

    expect(screen.getByRole("link", { name: "Log in" })).toHaveAttribute("href", "/auth/login");
  });
});
