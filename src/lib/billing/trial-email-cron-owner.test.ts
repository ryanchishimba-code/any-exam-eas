import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { renewalReceiptContent, cancellationEmailContent } from "@/lib/email/billing-emails";

describe("trial email cron ownership", () => {
  it("keeps ending and ended sends off the billing reminder cron", () => {
    const billing = readFileSync(
      path.join(process.cwd(), "src/lib/billing-reminders.ts"),
      "utf8"
    );
    const trialCron = readFileSync(
      path.join(process.cwd(), "src/app/api/cron/trial-emails/route.ts"),
      "utf8"
    );
    expect(billing).not.toContain("runTrialLifecycleEmails");
    expect(billing).not.toContain("runTrialDay4ReminderEmails");
    expect(trialCron).toContain("runTrialLifecycleEmails");
    expect(trialCron).toContain("runDueWelcomeEmails");
    expect(trialCron).toContain("runTrialDay4ReminderEmails");
  });
});

describe("payment and cancellation mail", () => {
  it("puts the amount on the renewal receipt", () => {
    const message = renewalReceiptContent({
      name: "Jordan",
      amountLabel: "$27.99",
      planLabel: "Pro",
    });
    expect(message.subject).toBe("Your AnyExamEasy renewal receipt");
    expect(message.text).toContain("Payment received: $27.99");
  });

  it("confirms cancellation without promising a result", () => {
    const message = cancellationEmailContent({
      name: "Jordan",
      accessUntilLabel: "December 1, 2026",
    });
    expect(message.subject).toBe("Your AnyExamEasy subscription is canceled");
    expect(message.text).toContain("December 1, 2026");
    expect(message.text).toContain("does not promise a score or a license");
  });
});
