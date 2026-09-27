import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import {
  HOME_PRACTICE_HEADLINE,
  HOME_READINESS_HEADING,
  HOME_READINESS_LINE,
  NOT_FOR_PATIENT_CARE_LINE,
  PAID_RENEWAL_CONSENT_VERSION,
  QUOTE_CONSENT_VERSION,
  RATIONALE_STUDY_NOTE,
  STUDENT_QUOTE_CLAUSE,
  TESTIMONIAL_RESULTS_NOTE,
  boardReviewBadge,
  paidRenewalConsentText,
  passCheckInSubtitle,
  quoteShareConsentLabel,
  withPriceAsOf,
} from "@/lib/marketing/legal-copy";
import { LEGAL_DISCLAIMERS, TRADEMARK_NOTICE } from "@/lib/legal";

const homeSources = [
  "src/components/marketing/elevation/PublicHome.tsx",
  "src/components/marketing/elevation/HomeQuote.tsx",
  "src/components/Footer.tsx",
].map((file) => readFileSync(path.join(process.cwd(), file), "utf8"));

describe("legal copy", () => {
  it("uses the owner-confirmed quote clause and drops composite-example language", () => {
    expect(LEGAL_DISCLAIMERS.testimonials).toBe(STUDENT_QUOTE_CLAUSE);
    expect(LEGAL_DISCLAIMERS.testimonials).not.toMatch(/composite|illustrative|not verified/i);
    expect(TESTIMONIAL_RESULTS_NOTE).toBe("Individual experiences. Results vary.");
  });

  it("names reviewer leads without calling the work item-by-item review", () => {
    expect(boardReviewBadge("nclex", "Ileen Chishimba, RN")).toBe(
      "NCLEX content review led by Ileen Chishimba, RN"
    );
    expect(boardReviewBadge("naplex", "Ryan Chishimba, PharmD")).toBe(
      "Content review led by Ryan Chishimba, PharmD"
    );
  });

  it("keeps the study-use and trademark lines", () => {
    expect(NOT_FOR_PATIENT_CARE_LINE).toMatch(/Not medical, nursing, or pharmacy advice/);
    expect(RATIONALE_STUDY_NOTE).toBe(
      "Study use only · not medical advice or for patient care · verify with current references."
    );
    expect(TRADEMARK_NOTICE).toMatch(/UWorld, Kaplan, Archer Review, and RxPrep/);
    expect(TRADEMARK_NOTICE).not.toMatch(/FNP®/);
    expect(LEGAL_DISCLAIMERS.notOfficialExamContent).not.toMatch(/FNP®/);
  });

  it("dates competitor prices and writes the paid-renewal consent", () => {
    expect(withPriceAsOf("$139/30 days")).toBe("$139/30 days (as of Sep 27, 2026)");
    expect(withPriceAsOf("listed as of Sep 27, 2026")).toBe("listed as of Sep 27, 2026");
    expect(paidRenewalConsentText("$27.99", "month")).toBe(
      "I agree that my subscription renews automatically at $27.99/month until I cancel in Settings. Payments are non-refundable except where required by law."
    );
    expect(PAID_RENEWAL_CONSENT_VERSION).toBe("2026-09-27");
  });

  it("states pass check-in privacy and the quote permission", () => {
    expect(passCheckInSubtitle("NCLEX")).toBe(
      "Optional check-in for NCLEX. Your answer is private unless you choose to share a quote below."
    );
    expect(quoteShareConsentLabel()).toContain("support@anyexameasy.com");
    expect(quoteShareConsentLabel()).toContain("first name, last initial");
    expect(QUOTE_CONSENT_VERSION).toBe("2026-09-27");
    expect(TRIAL_LIFETIME_QUESTIONS).toBe(500);
  });
});

describe("home legal copy", () => {
  it("keeps the home headline and practice estimate in the shared module", () => {
    expect(HOME_PRACTICE_HEADLINE).toBe("From doubtful to ready.");
    expect(HOME_READINESS_HEADING).toMatch(/practice estimate/i);
    expect(HOME_READINESS_LINE).toMatch(/questions you answer/i);
    const ours = [HOME_PRACTICE_HEADLINE, HOME_READINESS_HEADING, HOME_READINESS_LINE].join(" ");
    expect(ours).not.toMatch(/you will pass|guarantee|best|#1|24\/7/i);
  });

  it("renders main's compliance lines from the shared module", () => {
    const joined = homeSources.join("\n");
    expect(joined).toContain("NOT_FOR_PATIENT_CARE_LINE");
    expect(joined).toContain("TRADEMARK_NOTICE");
    expect(joined).toContain("TESTIMONIAL_RESULTS_NOTE");
    expect(joined).toContain("HOME_PRACTICE_HEADLINE");
    expect(joined).toContain("boardReviewBadge");
    expect(joined).toMatch(/\/legal\/refunds/);
    expect(joined).not.toMatch(/HOME_NOT_AFFILIATED|HOME_EDUCATIONAL_USE|HOME_TESTIMONIAL_LABEL/);
  });
});
