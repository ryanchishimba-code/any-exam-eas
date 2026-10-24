import { PLATFORM_EXAM_LIST } from "@/lib/landing/content";
import { HOME_GUIDELINE_LINE } from "@/lib/marketing/home-compare";
import { formatLandingTrialScopeSentence, formatMonthlyPrice } from "@/lib/site";

/**
 * Short homepage FAQ. Longer marketing copy lives here instead of on the page body.
 */
export const HOME_FAQ = [
  {
    q: "Which exams are included?",
    a: `All six are on one subscription: ${PLATFORM_EXAM_LIST}. USMLE covers Step 1, Step 2 CK, and Step 3.`,
  },
  {
    q: "How does AnyExamEasy compare to typical prep sites?",
    a: `One Pro plan covers all six boards. ${HOME_GUIDELINE_LINE} on scored items, Quick Bites video lessons, NCLEX exam mode, and readiness tools are included—not sold per exam.`,
  },
  {
    q: "Do I need a payment method to start?",
    a: `No. ${formatLandingTrialScopeSentence()}. Cancel in Settings before it ends and you are not charged.`,
  },
  {
    q: "What does Pro cost after the trial?",
    a: `${formatMonthlyPrice("pro")}/mo for every board. Cancel anytime in Settings to stop the next charge.`,
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes. Cancel anytime in Settings. That stops the next charge. Paid charges are non-refundable except where the law requires a refund.",
  },
  {
    q: "Are you affiliated with the exam boards?",
    a: "No. AnyExamEasy is independent. We are not affiliated with NCSBN, NABP, NBME, or the organizations that own the other board exams.",
  },
] as const;
