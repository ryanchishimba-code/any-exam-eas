import { describe, expect, it } from "vitest";
import { DAILY_LEAD_CONSENT_COPY } from "@/lib/marketing/daily-lead-copy";
import {
  dailyLeadConfirmationContent,
  hashLeadToken,
} from "@/lib/marketing/daily-question-lead";

describe("daily question email capture", () => {
  it("hashes tokens and does not claim the person is already subscribed", () => {
    expect(hashLeadToken("abc")).toHaveLength(64);
    expect(hashLeadToken("abc")).not.toBe("abc");
    const content = dailyLeadConfirmationContent(
      "https://www.anyexameasy.com/daily/confirm?token=abc",
      "https://www.anyexameasy.com/daily/unsubscribe?token=def"
    );
    const copy = `${DAILY_LEAD_CONSENT_COPY} ${content.subject} ${content.text}`.toLowerCase();
    expect(copy).toContain("until you confirm");
    expect(copy).toContain("unsubscribe");
    expect(copy).not.toContain("you're subscribed");
    expect(copy).not.toContain("you are subscribed");
    expect(content.text).toContain("/daily/unsubscribe?token=def");
  });
});
