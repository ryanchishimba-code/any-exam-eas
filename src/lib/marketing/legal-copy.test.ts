import { readFileSync } from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { TRIAL_LIFETIME_QUESTIONS } from "@/lib/billing-config";
import {
  formatHomeHeroSubline,
  HOME_FOUNDER_ATTRIBUTION,
  HOME_FOUNDER_QUOTE,
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
import {
  LEGAL_DISCLAIMERS,
  QUESTION_COUNT_AND_REPORT_NOTE,
  QUESTION_COUNT_CHANGE_NOTE,
  QUESTION_ISSUE_REPORT_NOTE,
  TRADEMARK_NOTICE,
} from "@/lib/legal";

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

  it("says question counts can change and points at the real report path", () => {
    expect(QUESTION_COUNT_CHANGE_NOTE).toBe(
      "Question counts are approximate and may change as questions are added, revised, or removed through ongoing review and updates."
    );
    expect(QUESTION_ISSUE_REPORT_NOTE).toBe(
      "See a possible error? Report it from the explanation in a study session, or email support@anyexameasy.com."
    );
    expect(QUESTION_COUNT_AND_REPORT_NOTE).not.toMatch(/constantly|clinician/i);
    expect(LEGAL_DISCLAIMERS.questionCounts).toBe(QUESTION_COUNT_AND_REPORT_NOTE);
    const terms = readFileSync(path.join(process.cwd(), "src/app/legal/terms/page.tsx"), "utf8");
    const pricing = readFileSync(path.join(process.cwd(), "src/app/(marketing)/pricing/page.tsx"), "utf8");
    const strip = readFileSync(
      path.join(process.cwd(), "src/components/marketing/board-landing/BoardStatStrip.tsx"),
      "utf8"
    );
    expect(terms).toContain("LEGAL_DISCLAIMERS.questionCounts");
    expect(pricing).toContain("QUESTION_COUNT_AND_REPORT_NOTE");
    expect(strip).toContain("QUESTION_COUNT_AND_REPORT_NOTE");
  });

  it("keeps the study-use and trademark lines", () => {
    expect(NOT_FOR_PATIENT_CARE_LINE).toMatch(/Not medical, nursing, or pharmacy advice/);
    expect(RATIONALE_STUDY_NOTE).toBe(
      "Study use only · not medical advice or for patient care · verify with current references."
    );
    expect(TRADEMARK_NOTICE).not.toMatch(/UWorld|Kaplan|Archer Review|RxPrep|AMBOSS/);
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
    expect(TRIAL_LIFETIME_QUESTIONS).toBe(100);
  });
});

describe("home legal copy", () => {
  it("keeps the home headline and practice estimate in the shared module", () => {
    expect(HOME_PRACTICE_HEADLINE).toBe(
      "Built for your exam, from the first question to test day."
    );
    expect(HOME_FOUNDER_QUOTE).toBe(
      "Studying for boards is hard enough. We exist to make it clearer, simpler and within reach for every student."
    );
    expect(HOME_FOUNDER_ATTRIBUTION).toBe("— Founder");
    expect(HOME_FOUNDER_ATTRIBUTION).not.toMatch(/Chishimba|Ryan/i);
    expect(formatHomeHeroSubline("43,300+")).toBe(
      "NCLEX, NAPLEX, PANCE, AANP FNP, USMLE, and NPTE-PT practice questions."
    );
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
    const landing = readFileSync(
      path.join(process.cwd(), "src/components/marketing/ExamMarketingLanding.tsx"),
      "utf8"
    );
    expect(landing).toContain("boardReviewBadge");
    expect(landing).toContain("boardReviewBadge(examKey, reviewer.displayName)");
    expect(joined).toMatch(/\/legal\/refunds/);
    expect(joined).not.toMatch(/HOME_NOT_AFFILIATED|HOME_EDUCATIONAL_USE|HOME_TESTIMONIAL_LABEL/);
  });
});
