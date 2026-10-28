import { render, screen } from "@testing-library/react";
import { describe, expect, it } from "vitest";
import { PaywallNotice } from "@/components/PaywallNotice";
import { VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE } from "@/lib/auth/verify-email-copy";

describe("PaywallNotice verify", () => {
  it("shows verify copy with spam callout", () => {
    render(<PaywallNotice reason="verify" />);

    expect(screen.getByText(/verification link we sent to your email/i)).toBeInTheDocument();
    expect(screen.getByText(VERIFY_EMAIL_SPAM_CALLOUT_HEADLINE)).toBeInTheDocument();
  });
});
