import { describe, expect, it } from "vitest";
import {
  VERIFICATION_EMAIL_SUBJECT,
  verificationEmailHtml,
  verificationEmailText,
} from "@/lib/email";
import { LEGAL_ENTITY } from "@/lib/legal";

const sampleUrl =
  "https://www.anyexameasy.com/api/auth/verify-email?token=abc123&board=pance";

describe("verification email templates", () => {
  it("uses a short transactional subject", () => {
    expect(VERIFICATION_EMAIL_SUBJECT).toBe("Confirm your AnyExamEasy email");
  });

  it("includes html and plain text with the same canonical link", () => {
    const html = verificationEmailHtml(sampleUrl);
    const text = verificationEmailText(sampleUrl);

    expect(html).toContain(sampleUrl);
    expect(html).toContain("Confirm email");
    expect(html).not.toMatch(/FREE|ACT NOW|!!!/);

    expect(text).toContain(sampleUrl);
    expect(text).toContain("Confirm your AnyExamEasy email");
    expect(text).not.toContain("<html");
  });

  it("does not embed shorteners or off-site redirect hosts", () => {
    const html = verificationEmailHtml(sampleUrl);
    expect(html).not.toMatch(/bit\.ly|t\.co|utm_/i);
    expect(html).toContain("www.anyexameasy.com");
  });
});

describe("verification reply-to expectation", () => {
  it("uses product support email for replies", () => {
    expect(LEGAL_ENTITY.supportEmail).toBe("support@anyexameasy.com");
  });
});
